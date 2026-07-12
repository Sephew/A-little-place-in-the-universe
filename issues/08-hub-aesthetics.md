# 08 — Hub aesthetics: bake-once render + sacred/flex + burst

*Tier: Post-MVP · Stories: 18, 19, 22, 25, 38, 39, 41. Aesthetic target: `attak.jpg`.*

## What to build

Upgrade the hub from the reused recursive render to the real look. The **burst-of-light Tree** is baked once to a sprite (re-baked only on growth) and composited each frame with a thin, capped **atmosphere** (Climate wash, motes, mist, rippled dunes, light-column). The **sacred floor** (Tree sprite, core glow, light-column, ground pool, Climate wash) renders on any device; the **flex layer** scales by tier **measured over the first frames** (+ DPR cap ~1.5) and sheds under load — atmosphere degrades before the Tree, and the Tree never does. **Quiet at rest**, motion lavished on events (release flare).

## Acceptance criteria

- [ ] The Tree is baked to a sprite and re-baked only when it changes; per-frame cost is small on a mid-range phone.
- [ ] Sacred floor always renders; flex layer scales by measured tier and sheds under load; atmosphere degrades before the Tree.
- [ ] Quiet-at-rest loop is near-idle; it steps down / pauses when the tab is hidden or under reduced-motion; release is a brief flare.
- [ ] The composed image reads as `attak.jpg` (cold palette, blazing core, light-column, rippled dunes).

## Blocked by

- 04 — The write loop
