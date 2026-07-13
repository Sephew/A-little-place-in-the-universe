'use strict';

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { ready: dbReady, saveSession, listSessions, updateEntry, deleteEntry, deleteSession, createUser, getUserByUsername } = require('./db');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'views');

// Sessions are a signed cookie carrying the user id, not server-side state, so
// no session store is needed. Set SESSION_SECRET on the host so cookies survive
// restarts (and can't be forged); locally an ephemeral random one is fine.
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

// Cookie is `userId.expiry.signature`; the signature covers `userId.expiry`, so
// a user can't tamper with their id or expiry without invalidating it.
function buildSessionCookie(userId) {
  const payload = `${userId}.${Date.now() + SESSION_MAX_AGE_MS}`;
  const token = encodeURIComponent(`${payload}.${sign(payload)}`);
  const flags = ['HttpOnly', 'Path=/', 'SameSite=Lax', `Max-Age=${Math.floor(SESSION_MAX_AGE_MS / 1000)}`];
  if (IS_PROD) flags.push('Secure');
  return `session=${token}; ${flags.join('; ')}`;
}

function buildLogoutCookie() {
  const flags = ['HttpOnly', 'Path=/', 'SameSite=Lax', 'Max-Age=0'];
  if (IS_PROD) flags.push('Secure');
  return `session=; ${flags.join('; ')}`;
}

// Returns the signed-in user's id, or null if the cookie is missing/expired/forged.
function sessionUserId(req) {
  const token = parseCookies(req).session;
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, expiry, sig] = parts;
  if (!userId || !expiry || Date.now() > Number(expiry)) return null;
  const expected = Buffer.from(sign(`${userId}.${expiry}`));
  const actual = Buffer.from(sig);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;
  return Number(userId);
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

function requestHandler(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/signup' && req.method === 'POST') {
    readJsonBody(req, (err, body) => {
      const username = String((body && body.username) || '').trim().toLowerCase();
      if (err || !/^[a-z0-9_.-]{3,30}$/.test(username)) {
        send(res, 400, JSON.stringify({ error: 'username must be 3–30 characters (letters, numbers, . _ -)' }), 'application/json');
        return;
      }
      createUser(username)
        .then((id) => {
          res.setHeader('Set-Cookie', buildSessionCookie(id));
          send(res, 200, JSON.stringify({ ok: true }), 'application/json');
        })
        .catch((dbErr) => {
          const taken = /UNIQUE|constraint/i.test(String(dbErr && dbErr.message));
          if (!taken) console.error(dbErr);
          send(res, taken ? 409 : 500, JSON.stringify({ error: taken ? 'that name is already taken' : 'signup failed' }), 'application/json');
        });
    });
    return;
  }

  // No passwords: knowing a name is enough to become it. Deliberate — see the note
  // when this shipped. Login is just "does this name exist?".
  if (url.pathname === '/api/login' && req.method === 'POST') {
    readJsonBody(req, (err, body) => {
      const username = String((body && body.username) || '').trim().toLowerCase();
      if (err || !username) {
        send(res, 401, JSON.stringify({ error: 'tell me your name' }), 'application/json');
        return;
      }
      getUserByUsername(username)
        .then((user) => {
          if (!user) {
            send(res, 401, JSON.stringify({ error: "I don't know that name yet" }), 'application/json');
            return;
          }
          res.setHeader('Set-Cookie', buildSessionCookie(user.id));
          send(res, 200, JSON.stringify({ ok: true }), 'application/json');
        })
        .catch((dbErr) => {
          console.error(dbErr);
          send(res, 500, JSON.stringify({ error: 'login failed' }), 'application/json');
        });
    });
    return;
  }

  if (url.pathname === '/api/logout' && req.method === 'POST') {
    res.setHeader('Set-Cookie', buildLogoutCookie());
    send(res, 200, JSON.stringify({ ok: true }), 'application/json');
    return;
  }

  // Lets the void know whether to show the account form at the end.
  if (url.pathname === '/api/me' && req.method === 'GET') {
    send(res, 200, JSON.stringify({ authed: !!sessionUserId(req) }), 'application/json');
    return;
  }

  // The experience is public: you can enter the void and answer anonymously.
  // The account is created at the end ("will you come back?"), so only the data
  // APIs require a user — pages fall through to static serving below.
  const userId = sessionUserId(req);
  if (!userId && url.pathname.startsWith('/api/')) {
    send(res, 401, JSON.stringify({ error: 'unauthorized' }), 'application/json');
    return;
  }

  if (url.pathname === '/api/sessions' && req.method === 'POST') {
    readJsonBody(req, (err, body) => {
      if (err) {
        send(res, 400, JSON.stringify({ error: 'invalid JSON' }), 'application/json');
        return;
      }
      saveSession(userId, body.answers || {})
        .then((id) => send(res, 200, JSON.stringify({ id }), 'application/json'))
        .catch((dbErr) => {
          console.error(dbErr);
          send(res, 500, JSON.stringify({ error: 'save failed' }), 'application/json');
        });
    });
    return;
  }

  if (url.pathname === '/api/sessions' && req.method === 'GET') {
    listSessions(userId)
      .then((sessions) => send(res, 200, JSON.stringify(sessions), 'application/json'))
      .catch((dbErr) => {
        console.error(dbErr);
        send(res, 500, JSON.stringify({ error: 'load failed' }), 'application/json');
      });
    return;
  }

  const sessionIdMatch = url.pathname.match(/^\/api\/sessions\/(\d+)$/);
  if (sessionIdMatch && req.method === 'DELETE') {
    deleteSession(userId, Number(sessionIdMatch[1]))
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
      updateEntry(userId, Number(entryIdMatch[1]), body.text)
        .then(() => send(res, 200, JSON.stringify({ ok: true }), 'application/json'))
        .catch((dbErr) => {
          console.error(dbErr);
          send(res, 500, JSON.stringify({ error: 'update failed' }), 'application/json');
        });
    });
    return;
  }
  if (entryIdMatch && req.method === 'DELETE') {
    deleteEntry(userId, Number(entryIdMatch[1]))
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
}

// Local/Render: run a real listening server. On Vercel this file is imported by
// api/index.js instead, which awaits dbReady and calls requestHandler per request.
if (require.main === module) {
  const server = http.createServer(requestHandler);
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
}

module.exports = requestHandler;
// Exposed for test_auth.js — the signed-session check gets a runnable test.
Object.assign(module.exports, { buildSessionCookie, sessionUserId });
