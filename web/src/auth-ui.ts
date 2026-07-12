import { authenticate, validateCredentials, type AuthMode } from './auth';

const CSS = `
.au-backdrop{position:fixed;inset:0;z-index:10;display:flex;align-items:center;justify-content:center;
  background:rgba(3,4,8,.6);backdrop-filter:blur(3px);font-family:ui-monospace,Menlo,Consolas,monospace}
.au-modal{position:relative;width:min(360px,90vw);display:flex;flex-direction:column;gap:12px;
  padding:30px 28px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:#0c0e14;color:#e8e8ec}
.au-h{margin:0 0 6px;font-size:20px;font-weight:500}
.au-l{display:flex;flex-direction:column;gap:6px;font-size:12px;letter-spacing:.05em;color:#aeb0ba}
.au-in{font:inherit;font-size:14px;color:#e8e8ec;background:#15171f;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:10px 12px}
.au-err{min-height:16px;margin:0;font-size:12px;color:#ff9a9a}
.au-submit{font:inherit;font-size:14px;color:#15161c;background:#e9e9ee;border:0;border-radius:9px;padding:11px;cursor:pointer}
.au-submit:disabled{opacity:.6;cursor:default}
.au-toggle{font:inherit;font-size:12px;color:#9aa0b4;background:none;border:0;cursor:pointer}
.au-close{position:absolute;top:10px;right:12px;font-size:20px;line-height:1;color:#9aa0b4;background:none;border:0;cursor:pointer}
.au-in:focus-visible,.au-submit:focus-visible,.au-toggle:focus-visible,.au-close:focus-visible{outline:2px solid #8ab4ff;outline-offset:2px}
`;

function injectStyle() {
  if (document.getElementById('au-style')) return;
  const s = document.createElement('style');
  s.id = 'au-style';
  s.textContent = CSS;
  document.head.appendChild(s);
}

/** Opens the barest register/login overlay. Success fires Supabase's auth
 *  state change, which the app uses to route to the hub. */
export function openAuth(host: HTMLElement): void {
  if (host.querySelector('.au-backdrop')) return;
  injectStyle();
  let mode: AuthMode = 'login';

  const backdrop = document.createElement('div');
  backdrop.className = 'au-backdrop';
  backdrop.innerHTML = `
    <form class="au-modal" novalidate>
      <button class="au-close" type="button" aria-label="Close">×</button>
      <h2 class="au-h">Begin Journey</h2>
      <label class="au-l">Email
        <input class="au-in" name="email" type="email" autocomplete="email" required></label>
      <label class="au-l">Password
        <input class="au-in" name="password" type="password" autocomplete="current-password" required></label>
      <p class="au-err" role="alert" aria-live="polite"></p>
      <button class="au-submit" type="submit">Log in</button>
      <button class="au-toggle" type="button">New here? Create an account</button>
    </form>`;
  host.appendChild(backdrop);

  const form = backdrop.querySelector('form')!;
  const err = backdrop.querySelector<HTMLElement>('.au-err')!;
  const submit = backdrop.querySelector<HTMLButtonElement>('.au-submit')!;
  const toggle = backdrop.querySelector<HTMLButtonElement>('.au-toggle')!;
  const email = form.elements.namedItem('email') as HTMLInputElement;
  const password = form.elements.namedItem('password') as HTMLInputElement;

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };
  function close() {
    document.removeEventListener('keydown', onKey);
    backdrop.remove();
  }
  document.addEventListener('keydown', onKey);
  backdrop.addEventListener('mousedown', (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector<HTMLButtonElement>('.au-close')!.addEventListener('click', close);

  toggle.addEventListener('click', () => {
    mode = mode === 'login' ? 'register' : 'login';
    submit.textContent = mode === 'login' ? 'Log in' : 'Create account';
    toggle.textContent =
      mode === 'login' ? 'New here? Create an account' : 'Have an account? Log in';
    password.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
    err.textContent = '';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = validateCredentials(email.value, password.value);
    if (msg) {
      err.textContent = msg;
      return;
    }
    submit.disabled = true;
    err.textContent = '';
    try {
      const { error } = await authenticate(mode, email.value, password.value);
      if (error) {
        err.textContent = error.message;
        submit.disabled = false;
        return;
      }
      // On sign-in (or sign-up without email confirmation) the auth state change
      // routes to the hub. If confirmation is required, session is null and the
      // user simply stays on the landing.
      close();
    } catch (ex) {
      err.textContent =
        ex instanceof Error ? ex.message : 'Something went wrong. Try again.';
      submit.disabled = false;
    }
  });

  email.focus();
}
