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
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL
    )
  `);
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

// A session row is written even if every prompt was skipped (invariant #3) —
// only entries with actual text get an Entry row.
async function saveSession(answers) {
  const now = new Date().toISOString();
  const { lastInsertRowid } = await db.execute({
    sql: 'INSERT INTO sessions (created_at) VALUES (?)',
    args: [now],
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

async function listSessions() {
  const { rows: sessions } = await db.execute('SELECT id, created_at FROM sessions ORDER BY created_at DESC');
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

async function updateEntry(id, text) {
  await db.execute({ sql: 'UPDATE entries SET text = ? WHERE id = ?', args: [String(text || '').trim(), id] });
}

async function deleteEntry(id) {
  await db.execute({ sql: 'DELETE FROM entries WHERE id = ?', args: [id] });
}

async function deleteSession(id) {
  await db.batch([
    { sql: 'DELETE FROM entries WHERE session_id = ?', args: [id] },
    { sql: 'DELETE FROM sessions WHERE id = ?', args: [id] },
  ], 'write');
}

module.exports = { ready, saveSession, listSessions, updateEntry, deleteEntry, deleteSession };
