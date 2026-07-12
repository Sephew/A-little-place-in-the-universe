# 01 — Walking skeleton (prefactor)

*Tier: MVP · Prefactor — do first.*

## What to build

Stand up the deployable web-app foundation everything else mounts onto. Vite + TypeScript + supabase-js, deployed to a public URL. A **scene-router** that mounts exactly one scene at a time (landing / hub) and tears the previous one down cleanly, with a seam where the crossing transition will later play. Supabase client configured from env. App-wide plumbing exposed to scenes: a DPR cap (~1.5) and a reduced-motion signal. Placeholder landing/hub scenes so the switch is demonstrable.

## Acceptance criteria

- [x] Vite + TS project builds and runs locally. *(Deploy to a public URL still pending — needs a hosting account; not doable headless in the AFK loop. `npm run build` emits a static `dist/` ready to drop on Vercel/Netlify.)*
- [x] supabase-js client initializes from env vars; no secrets committed. (`web/src/supabase.ts`, lazy `getSupabase()`; only `VITE_*` anon vars, `.env.example` only.)
- [x] A scene-router mounts one scene at a time and cleanly tears down the previous scene's canvas + animation loop (no leaked RAF loops). (`web/src/scene.ts` + `loop.ts`; verified by `scene.test.ts` / `loop.test.ts`.)
- [x] A shared utility exposes the reduced-motion signal and DPR cap to any scene. (`web/src/platform.ts`.)
- [x] Placeholder "landing" and "hub" scenes prove the switch end-to-end (locally via the `cross →` button; `web/src/scenes/`). Publicly demoable once deployed.

**Status:** built & verified locally (typecheck clean, 4/4 tests, build green). Only the public-URL deploy remains. See commit `ac3b9a8`.

## Blocked by

None - can start immediately.
