# 02 — Threshold: landing + minimal auth

*Tier: MVP · Stories: landing/threshold (new, not in the hub PRD story list).*

## What to build

The doorway into the app. Reuse the existing `gargantua.html` WebGL2 black-hole shader as the **landing scene**, keeping its WebGL2-unsupported fallback. Over it, a clean hero card matching `006 landing page.png`: nav (Home / Explore / Credits), heading **"Whisper into the Universe"**, subtext **"A small pocket of the universe is waiting"**, and a **Begin Journey** action, in the framed-glass monospace style. Begin Journey opens the **barest** Supabase email + password register/login; on success the router advances to the hub. Sign-out returns here. Non-diegetic and quiet — a doorway crossed once.

## Acceptance criteria

- [ ] Landing renders the Gargantua shader (drag-to-orbit) with the existing WebGL2 fallback on unsupported devices.
- [ ] Hero card matches the PNG (nav, heading, subtext, Begin Journey), responsive, legible over the shader.
- [ ] Begin Journey → email/password register + login via Supabase; inline errors; success routes to the hub scene.
- [ ] Authenticated session persists across reload; sign-out returns to the landing.
- [ ] Nav and Begin Journey are keyboard-operable and reachable without a pointer.

## Blocked by

- 01 — Walking skeleton
