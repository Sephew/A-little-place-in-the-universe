'use strict';

const path = require('path');
const fs = require('fs');
const { createClient } = require('@libsql/client');

// Local dev (and no Turso env vars set): a plain SQLite file on disk, same
// as the original MVP — libsql's `file:` URL uses the same on-disk format,
// so the file is still one plain file you can inspect, back up, or delete.
// Hosted (Render): TURSO_DATABASE_URL points at a hosted libsql database,
// since Render's free tier has no persistent disk to keep a local file on.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
if (!process.env.TURSO_DATABASE_URL && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || `file:${path.join(DATA_DIR, 'spirit.db')}`,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const PROMPT_KEYS = ['failed', 'worked', 'missed', 'next'];

// server.js awaits this before listening, so no request can race table creation.
const ready = (async () => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
  // Migrate a users table created when accounts were keyed by email. Existing
  // emails simply become usernames. Throws (harmlessly) on a fresh DB where the
  // column is already `username`.
  try { await db.execute('ALTER TABLE users RENAME COLUMN email TO username'); } catch (_) {}
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      created_at TEXT NOT NULL
    )
  `);
  // Migrate a sessions table created before accounts existed. ponytail: ADD
  // COLUMN throws if it's already there; the CREATE above covers fresh DBs.
  try { await db.execute('ALTER TABLE sessions ADD COLUMN user_id INTEGER'); } catch (_) {}
  await db.execute(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL REFERENCES sessions(id),
      prompt TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
})();

// No passwords: password_hash is kept as a vestigial '' so the existing NOT NULL
// column is satisfied without a table rebuild. Drop it if passwords never return.
async function createUser(username) {
  const { lastInsertRowid } = await db.execute({
    sql: 'INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)',
    args: [username, '', new Date().toISOString()],
  });
  return Number(lastInsertRowid);
}

async function getUserByUsername(username) {
  const { rows } = await db.execute({
    sql: 'SELECT id, username FROM users WHERE username = ?',
    args: [username],
  });
  return rows[0] || null;
}

// A session row is written even if every prompt was skipped (invariant #3) —
// only entries with actual text get an Entry row.
async function saveSession(userId, answers) {
  const now = new Date().toISOString();
  const { lastInsertRowid } = await db.execute({
    sql: 'INSERT INTO sessions (user_id, created_at) VALUES (?, ?)',
    args: [userId, now],
  });
  const sessionId = Number(lastInsertRowid);

  const inserts = PROMPT_KEYS
    .map((key) => [key, String(answers[key] || '').trim()])
    .filter(([, text]) => text)
    .map(([key, text]) => ({
      sql: 'INSERT INTO entries (session_id, prompt, text, created_at) VALUES (?, ?, ?, ?)',
      args: [sessionId, key, text, now],
    }));
  if (inserts.length) await db.batch(inserts, 'write');

  return sessionId;
}

async function listSessions(userId) {
  const { rows: sessions } = await db.execute({
    sql: 'SELECT id, created_at FROM sessions WHERE user_id = ? ORDER BY created_at DESC',
    args: [userId],
  });
  const withEntries = [];
  for (const session of sessions) {
    const { rows: entries } = await db.execute({
      sql: 'SELECT id, prompt, text, created_at FROM entries WHERE session_id = ? ORDER BY id ASC',
      args: [session.id],
    });
    withEntries.push({ ...session, entries });
  }
  return withEntries;
}

// Entries are scoped through their session's owner so a user can't touch
// another user's rows even if they guess an id.
const OWNED = 'session_id IN (SELECT id FROM sessions WHERE user_id = ?)';

async function updateEntry(userId, id, text) {
  await db.execute({
    sql: `UPDATE entries SET text = ? WHERE id = ? AND ${OWNED}`,
    args: [String(text || '').trim(), id, userId],
  });
}

async function deleteEntry(userId, id) {
  await db.execute({ sql: `DELETE FROM entries WHERE id = ? AND ${OWNED}`, args: [id, userId] });
}

async function deleteSession(userId, id) {
  await db.batch([
    { sql: `DELETE FROM entries WHERE session_id = ? AND ${OWNED}`, args: [id, userId] },
    { sql: 'DELETE FROM sessions WHERE id = ? AND user_id = ?', args: [id, userId] },
  ], 'write');
}

module.exports = { ready, saveSession, listSessions, updateEntry, deleteEntry, deleteSession, createUser, getUserByUsername };
