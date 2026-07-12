# 06 — Quiet panel: hide, sound, account

*Tier: Post-MVP · Stories: 13, 29, 30, 31.*

## What to build

The **quiet things** as a subordinate affordance off the Witness moment (not a menu bar): re-read past Entries with the ability to **hide** one (excluded from re-reading and from the Tree's visible count, never deleted, restorable), a **persistent mute** for sound (Web Audio drone + event tones, off until first gesture), and **account / sign-out**.

## Acceptance criteria

- [ ] The quiet things open via a subordinate gesture off the Witness, distinct from writing.
- [ ] Hiding an Entry removes it from re-reading and drops the Tree's visible count by one; nothing is destroyed; unhide restores both.
- [ ] Persistent mute survives reload; audio stays off until a user gesture.
- [ ] Account / sign-out reachable from here.

## Blocked by

- 04 — The write loop
