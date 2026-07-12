# 03 — Hub arrival

*Tier: MVP · Stories: 1, 2, 24, 26.*

## What to build

Crossing into the Void. After auth, mount the hub scene: a dark, cold Void with a decent-looking Tree as the only light (reuse the recursive-glow render from `hub.html` — acceptable, not the bake-once system yet), a dim **clickable Witness** presence, and an **instant local greeting** ("Welcome back, {name}."). If the user has no current Tree, silently create one with a universe-decided Fingerprint (minted variation seed) so the Void is never empty. Settle into a quiet **resting** state — no prompts, no words after the greeting. Nothing on arrival waits on the network.

## Acceptance criteria

- [ ] Authenticated arrival shows Void + Tree + Witness + a greeting that appears with no network round-trip.
- [ ] First-ever arrival auto-creates exactly one current Tree (persisted, minted variation seed); later arrivals load it.
- [ ] The Witness has a clear clickable hit target; the Tree is the light source; resting state is quiet (no prompts).
- [ ] Cold palette, acceptable-looking; reduced-motion renders a calm static frame.

## Blocked by

- 02 — Threshold: landing + minimal auth
