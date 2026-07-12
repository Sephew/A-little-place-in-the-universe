# 07 — Maturity & reseed

*Tier: Post-MVP · Stories: 27, 34, 35, 36.*

## What to build

When the current Tree reaches **full-grown** (a tunable entry-count threshold), the Witness **gently** offers a new seed (never nags). **Decline** → keep writing into the matured Tree (size frozen, Climate still lives). **Accept** → archive the matured Tree (read-only) and create a new current Tree (universe-decided). Exactly one current Tree at all times.

## Acceptance criteria

- [ ] Reaching the full-grown threshold triggers a single, gentle, non-nagging seed offer.
- [ ] Decline keeps writing into the matured Tree; its size is frozen; Climate still responds.
- [ ] Accept archives the current Tree (read-only) and makes a new Tree current.
- [ ] Exactly one current Tree exists at all times; the threshold is a config constant.

## Blocked by

- 04 — The write loop
