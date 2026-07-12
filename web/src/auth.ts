import { getSupabase } from './supabase';

export type AuthMode = 'login' | 'register';

/** Returns a user-facing error message if the inputs are unusable, else null. */
export function validateCredentials(email: string, password: string): string | null {
  const e = email.trim();
  if (!e) return 'Enter your email.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return 'That email looks off.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

export function authenticate(mode: AuthMode, email: string, password: string) {
  const auth = getSupabase().auth;
  const creds = { email: email.trim(), password };
  return mode === 'register' ? auth.signUp(creds) : auth.signInWithPassword(creds);
}
