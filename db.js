'use strict';

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

// RAILWAY_VOLUME_MOUNT_PATH is set automatically when a volume is attached
// on Railway — without it, the DB would live on the container's ephemeral
// filesystem and vanish on every redeploy.
const DATA_DIR = process.env.DATA_DIR || process.env.RAILWAY_VOLUME_MOUNT_PATH || path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'spirit.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL REFERENCES sessions(id),
    prompt TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

const PROMPT_KEYS = ['failed', 'worked', 'missed', 'next'];

const insertSession = db.prepare('INSERT INTO sessions (created_at) VALUES (?)');
const insertEntry = db.prepare(
  'INSERT INTO entries (session_id, prompt, text, created_at) VALUES (?, ?, ?, ?)'
);

// A session row is written even if every prompt was skipped (invariant #3) —
// only entries with actual text get an Entry row.
const saveSession = db.transaction((answers) => {
  const now = new Date().toISOString();
  const { lastInsertRowid: sessionId } = insertSession.run(now);
  for (const key of PROMPT_KEYS) {
    const text = String(answers[key] || '').trim();
    if (text) insertEntry.run(sessionId, key, text, now);
  }
  return sessionId;
});

const listSessionsStmt = db.prepare('SELECT id, created_at FROM sessions ORDER BY created_at DESC');
const listEntriesForSessionStmt = db.prepare(
  'SELECT id, prompt, text, created_at FROM entries WHERE session_id = ? ORDER BY id ASC'
);

function listSessions() {
  return listSessionsStmt.all().map((session) => ({
    ...session,
    entries: listEntriesForSessionStmt.all(session.id),
  }));
}

const updateEntryStmt = db.prepare('UPDATE entries SET text = ? WHERE id = ?');
function updateEntry(id, text) {
  updateEntryStmt.run(String(text || '').trim(), id);
}

const deleteEntryStmt = db.prepare('DELETE FROM entries WHERE id = ?');
function deleteEntry(id) {
  deleteEntryStmt.run(id);
}

const deleteSessionEntriesStmt = db.prepare('DELETE FROM entries WHERE session_id = ?');
const deleteSessionStmt = db.prepare('DELETE FROM sessions WHERE id = ?');
const deleteSession = db.transaction((id) => {
  deleteSessionEntriesStmt.run(id);
  deleteSessionStmt.run(id);
});

module.exports = { saveSession, listSessions, updateEntry, deleteEntry, deleteSession };
