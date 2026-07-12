# 05 — Witness answers: LLM + texture + Climate

*Tier: Post-MVP · Stories: 14-20.*

## What to build

Replace the local-pool line with the real **single** post-release call to OpenRouter (no-logging route): it returns a short, **often-ambient** line + an inferred internal **texture**. On timeout at **8s (config)** or failure → a base-case local line + **no texture**. Persist witness utterances. Derive **Climate** (character only — hue / mist / bloom / particles / motion) from recent textures over a rolling window, **asymmetric** (fast attack to light, slow smoothed release to heavy), and ease the world toward it a beat after release. Texture stays internal, never shown as a number or chart.

## Acceptance criteria

- [ ] On release, exactly one OpenRouter call fires; its line appears a beat later; the immediate Tree reaction never waits on it.
- [ ] 8s timeout or failure → a base-case line and Climate holds (no texture) for that Entry.
- [ ] Texture is inferred and persisted internally and never surfaced as a number/chart.
- [ ] Climate changes character only (never size/health), asymmetrically: a heavy stretch cools/draws-in, a bright one opens/quickens.

## Blocked by

- 04 — The write loop
