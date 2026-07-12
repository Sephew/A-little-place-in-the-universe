import { describe, it, expect } from 'vitest';
import { validateCredentials } from './auth';

describe('validateCredentials', () => {
  it('accepts a well-formed email + 6+ char password', () => {
    expect(validateCredentials('a@b.co', 'secret')).toBeNull();
  });

  it('rejects empty, malformed email, and short password', () => {
    expect(validateCredentials('', 'secret')).toMatch(/email/i);
    expect(validateCredentials('nope', 'secret')).toMatch(/email/i);
    expect(validateCredentials('a@b.co', 'short')).toMatch(/6 characters/i);
  });
});
