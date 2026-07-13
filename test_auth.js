'use strict';
// Runnable self-check for the session-cookie integrity. Run: node test_auth.js
const assert = require('assert');
const { buildSessionCookie, sessionUserId } = require('./server');

// session cookie binds the user id and rejects tampering
const value = buildSessionCookie(42).match(/session=([^;]+)/)[1];
const reqWith = (raw) => ({ headers: { cookie: 'session=' + raw } });
assert.strictEqual(sessionUserId(reqWith(value)), 42, 'valid cookie yields the user id');
const tampered = encodeURIComponent(decodeURIComponent(value).replace(/^42\./, '99.'));
assert.strictEqual(sessionUserId(reqWith(tampered)), null, 'tampered user id rejected');
assert.strictEqual(sessionUserId({ headers: {} }), null, 'no cookie → no user');

console.log('auth self-check passed');
process.exit(0);
