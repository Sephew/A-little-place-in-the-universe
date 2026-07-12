import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Lazy so the skeleton scenes render even before env is wired; the first real
// caller (auth, slice 2) throws clearly if the env vars are missing.
let client: SupabaseClient | undefined;

export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (see .env.example)');
    }
    client = createClient(url, key);
  }
  return client;
}
