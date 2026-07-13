'use strict';

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { ready: dbReady, saveSession, listSessions, updateEntry, deleteEntry, deleteSession } = require('./db');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Unset locally (matches domain-model.md's original "no auth" MVP); set on the
// hosted deploy so the app is no longer wide open on a public URL. Sessions
// are a signed cookie, not server-side state, so no session store is needed.
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
const SESSION_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
// Only mark the session cookie Secure when NODE_ENV=production (set this in
// the host's env vars) — a Secure cookie is silently dropped over plain http,
// which is what local dev uses.
const IS_PROD = process.env.NODE_ENV === 'production';

const ROUTES = {
  '/': 'gargantua.html',
  '/void': 'void.html',
  '/login': 'login.html',
};

function parseCookies(req) {
  const header = req.headers.cookie;
  const cookies = {};
  if (!header) return cookies;
  for (const pair of header.split(';')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    cookies[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  }
  return cookies;
}

function sign(value) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('hex');
}

function buildSessionCookie() {
  const expiry = String(Date.now() + SESSION_MAX_AGE_MS);
  const token = encodeURIComponent(`${expiry}.${sign(expiry)}`);
  const flags = ['HttpOnly', 'Path=/', 'SameSite=Lax', `Max-Age=${Math.floor(SESSION_MAX_AGE_MS / 1000)}`];
  if (IS_PROD) flags.push('Secure');
  return `session=${token}; ${flags.join('; ')}`;
}

function buildLogoutCookie() {
  const flags = ['HttpOnly', 'Path=/', 'SameSite=Lax', 'Max-Age=0'];
  if (IS_PROD) flags.push('Secure');
  return `session=; ${flags.join('; ')}`;
}

function isValidSessionToken(token) {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot === -1) return false;
  const expiry = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!expiry || !sig || Date.now() > Number(expiry)) return false;
  const expected = Buffer.from(sign(expiry));
  const actual = Buffer.from(sig);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function isAuthed(req) {
  if (!AUTH_PASSWORD) return true; // no password configured: local dev, matches original "no auth" MVP
  return isValidSessionToken(parseCookies(req).session);
}

function safeComparePassword(candidate) {
  const expected = Buffer.from(AUTH_PASSWORD);
  const actual = Buffer.from(String(candidate || ''));
  if (expected.length !== actual.length) {
    crypto.timingSafeEqual(expected, expected); // keep timing constant either way
    return false;
  }
  return crypto.timingSafeEqual(expected, actual);
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

function send(res, status, body, contentType) {
  res.writeHead(status, { 'Content-Type': contentType || 'text/plain' });
  res.end(body);
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, 'Not found');
      return;
    }
    const ext = path.extname(filePath);
    send(res, 200, data, MIME_TYPES[ext] || 'application/octet-stream');
  });
}

function readJsonBody(req, callback) {
  let raw = '';
  req.on('data', (chunk) => { raw += chunk; });
  req.on('end', () => {
    try {
      callback(null, raw ? JSON.parse(raw) : {});
    } catch (err) {
      callback(err);
    }
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/login' && req.method === 'POST') {
    readJsonBody(req, (err, body) => {
      if (err || !AUTH_PASSWORD || !safeComparePassword(body.password)) {
        send(res, 401, JSON.stringify({ error: 'incorrect password' }), 'application/json');
        return;
      }
      res.setHeader('Set-Cookie', buildSessionCookie());
      send(res, 200, JSON.stringify({ ok: true }), 'application/json');
    });
    return;
  }

  if (url.pathname === '/api/logout' && req.method === 'POST') {
    res.setHeader('Set-Cookie', buildLogoutCookie());
    send(res, 200, JSON.stringify({ ok: true }), 'application/json');
    return;
  }

  if (!isAuthed(req)) {
    if (url.pathname.startsWith('/api/')) {
      send(res, 401, JSON.stringify({ error: 'unauthorized' }), 'application/json');
      return;
    }
    serveFile(res, path.join(PUBLIC_DIR, 'login.html'));
    return;
  }

  if (url.pathname === '/api/sessions' && req.method === 'POST') {
    readJsonBody(req, (err, body) => {
      if (err) {
        send(res, 400, JSON.stringify({ error: 'invalid JSON' }), 'application/json');
        return;
      }
      saveSession(body.answers || {})
        .then((id) => send(res, 200, JSON.stringify({ id }), 'application/json'))
        .catch((dbErr) => {
          console.error(dbErr);
          send(res, 500, JSON.stringify({ error: 'save failed' }), 'application/json');
        });
    });
    return;
  }

  if (url.pathname === '/api/sessions' && req.method === 'GET') {
    listSessions()
      .then((sessions) => send(res, 200, JSON.stringify(sessions), 'application/json'))
      .catch((dbErr) => {
        console.error(dbErr);
        send(res, 500, JSON.stringify({ error: 'load failed' }), 'application/json');
      });
    return;
  }

  const sessionIdMatch = url.pathname.match(/^\/api\/sessions\/(\d+)$/);
  if (sessionIdMatch && req.method === 'DELETE') {
    deleteSession(Number(sessionIdMatch[1]))
      .then(() => send(res, 200, JSON.stringify({ ok: true }), 'application/json'))
      .catch((dbErr) => {
        console.error(dbErr);
        send(res, 500, JSON.stringify({ error: 'delete failed' }), 'application/json');
      });
    return;
  }

  const entryIdMatch = url.pathname.match(/^\/api\/entries\/(\d+)$/);
  if (entryIdMatch && req.method === 'PUT') {
    readJsonBody(req, (err, body) => {
      if (err) {
        send(res, 400, JSON.stringify({ error: 'invalid JSON' }), 'application/json');
        return;
      }
      updateEntry(Number(entryIdMatch[1]), body.text)
        .then(() => send(res, 200, JSON.stringify({ ok: true }), 'application/json'))
        .catch((dbErr) => {
          console.error(dbErr);
          send(res, 500, JSON.stringify({ error: 'update failed' }), 'application/json');
        });
    });
    return;
  }
  if (entryIdMatch && req.method === 'DELETE') {
    deleteEntry(Number(entryIdMatch[1]))
      .then(() => send(res, 200, JSON.stringify({ ok: true }), 'application/json'))
      .catch((dbErr) => {
        console.error(dbErr);
        send(res, 500, JSON.stringify({ error: 'delete failed' }), 'application/json');
      });
    return;
  }

  const relativePath = ROUTES[url.pathname] || url.pathname;
  const filePath = path.join(PUBLIC_DIR, relativePath);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    send(res, 403, 'Forbidden');
    return;
  }

  serveFile(res, filePath);
});

dbReady
  .then(() => {
    server.listen(PORT, () => {
      console.log(`listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('failed to initialize database', err);
    process.exit(1);
  });
