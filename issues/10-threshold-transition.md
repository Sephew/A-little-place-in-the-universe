# 10 — Threshold-crossing transition (both ways)

*Tier: Post-MVP · Stories: transition (new).*

## What to build

The **transitional loading animation** between the landing and the hub: crossing from the black-hole landing/auth **into** the Void (covering hub scene boot / asset warmup so there's no blank frame), and the **reverse** on sign-out. A doorway crossed once — non-diegetic, unhurried.

## Acceptance criteria

- [ ] Entering the hub plays a transition from the landing into the Void that covers scene teardown/boot with no jarring flash or blank frame.
- [ ] Sign-out plays the reverse transition back to the landing.
- [ ] Reduced-motion substitutes a quick fade for the full transition.

## Blocked by

- 08 — Hub aesthetics (a Void worth transitioning into)
