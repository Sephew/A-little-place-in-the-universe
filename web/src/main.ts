import { SceneRouter } from './scene';
import { landing } from './scenes/landing';
import { hub } from './scenes/hub';
import { getSupabase } from './supabase';
import { openAuth } from './auth-ui';

const app = document.getElementById('app')!;

const stage = document.createElement('div');
stage.style.cssText = 'position:fixed;inset:0';
app.appendChild(stage);

const router = new SceneRouter(stage);

async function signOut() {
  try {
    await getSupabase().auth.signOut();
  } catch {
    /* no env / already signed out — the routing below still returns to landing */
  }
}

let signedIn: boolean | null = null;
function route(next: boolean) {
  if (next === signedIn) return; // ignore token refreshes etc.
  signedIn = next;
  router.go(next ? () => hub(signOut) : () => landing(() => openAuth(app)));
}

async function start() {
  try {
    const supabase = getSupabase();
    const { data } = await supabase.auth.getSession();
    route(!!data.session);
    // Session persists across reload (getSession) and drives every crossing.
    supabase.auth.onAuthStateChange((_event, session) => route(!!session));
  } catch {
    // No Supabase env configured yet — still show the doorway; auth will report
    // the missing config when attempted.
    route(false);
  }
}
start();
