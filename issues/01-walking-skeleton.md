# 01 — Walking skeleton (prefactor)

*Tier: MVP · Prefactor — do first.*

## What to build

Stand up the deployable web-app foundation everything else mounts onto. Vite + TypeScript + supabase-js, deployed to a public URL. A **scene-router** that mounts exactly one scene at a time (landing / hub) and tears the previous one down cleanly, with a seam where the crossing transition will later play. Supabase client configured from env. App-wide plumbing exposed to scenes: a DPR cap (~1.5) and a reduced-motion signal. Placeholder landing/hub scenes so the switch is demonstrable.

## Acceptance criteria

- [ ] Vite + TS project builds, runs locally, and deploys to a public URL.
- [ ] supabase-js client initializes from env vars; no secrets committed.
- [ ] A scene-router mounts one scene at a time and cleanly tears down the previous scene's canvas + animation loop (no leaked RAF loops).
- [ ] A shared utility exposes the reduced-motion signal and DPR cap to any scene.
- [ ] Placeholder "landing" and "hub" scenes prove the switch end-to-end on the deployed URL.

## Blocked by

None - can start immediately.
