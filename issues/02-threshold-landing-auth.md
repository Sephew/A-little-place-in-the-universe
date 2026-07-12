# 02 — Threshold: landing + minimal auth

*Tier: MVP · Stories: landing/threshold (new, not in the hub PRD story list).*

## What to build

The doorway into the app. Reuse the existing `gargantua.html` WebGL2 black-hole shader as the **landing scene**, keeping its WebGL2-unsupported fallback. Over it, a clean hero card matching `006 landing page.png`: nav (Home / Explore / Credits), heading **"Whisper into the Universe"**, subtext **"A small pocket of the universe is waiting"**, and a **Begin Journey** action, in the framed-glass monospace style. Begin Journey opens the **barest** Supabase email + password register/login; on success the router advances to the hub. Sign-out returns here. Non-diegetic and quiet — a doorway crossed once.

## Acceptance criteria

- [x] Landing renders the Gargantua shader (drag-to-orbit) with the existing WebGL2 fallback on unsupported devices. (Reused verbatim as a full-bleed iframe from `web/public/gargantua.html`; its own fallback + drag-to-orbit are preserved. `web/src/scenes/landing.ts`.)
- [x] Hero card matches the PNG (nav, heading, subtext, Begin Journey), responsive, legible over the shader. *(Built to the PNG; final by-eye visual match still pending — no browser in the AFK loop.)*
- [x] Begin Journey → email/password register + login via Supabase; inline errors; success routes to the hub scene. (`web/src/auth-ui.ts` + `auth.ts`; success → `onAuthStateChange` routes.) *(Live round-trip unverified — needs a Supabase project + env, same gap as slice-1 deploy.)*
- [x] Authenticated session persists across reload; sign-out returns to the landing. (`main.ts` boots from `auth.getSession()` and routes on every auth change; hub has a sign-out button. Verified structurally, not against a live session.)
- [x] Nav and Begin Journey are keyboard-operable and reachable without a pointer. (Native `<a>`/`<button>`, visible `:focus-visible` rings, Esc closes the auth modal.)

**Status:** built; typecheck clean, 6/6 tests, build green, `/` + `/gargantua.html` serve 200 under `vite preview`. Remaining: by-eye visual pass + live Supabase auth round-trip (needs a project + browser). See commit below.

## Blocked by

- 01 — Walking skeleton
