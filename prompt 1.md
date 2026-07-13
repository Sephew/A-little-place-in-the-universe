# A Little Place in the Universe — Design Brief

*A void, a spirit, and four questions asked in the dark.*

---

## The one-sentence version

You are inside a black hole. Nothing lives here except a spirit made of light, and it wants to hear about the world outside — what failed, what worked, what you missed, what you'll do next.

---

## Why this exists

Most retrospectives happen in a shared doc, get skimmed once in a standup, and are forgotten by the next one. This is a retro with only one person in the room, held by something that isn't grading you and has no stake in the answer.

Four questions. Always the same four. Asked by something that just wants to know, not something building a case for what you should do differently.

---

## The concept

You're inside a black hole — an absolute void. No ground, no horizon, nothing to look at except one thing: **the spirit**, a slow glowing circle floating in the center of the dark. It is the only light source in the scene. It's been sealed in here a long time, it doesn't know what's outside, and that's why it asks.

Every time you arrive, it asks the same four things, in the same order:

1. **What failed?**
2. **What worked?**
3. **What did you miss?**
4. **What will you do next?**

Answer any or all of them. Skip one if you want — though if you try to leave, it'll ask once, by name, whether you're sure that's all for today. No scoring, no wrong answer, no minimum length.

When you're done, the spirit takes it — a slow pulse of light — and gives back one short line. Not advice. Not analysis. Just acknowledgment that it heard you. Then it goes quiet again until you come back.

---

## Why these four questions

This replaces the earlier open-ended win/failure/struggle/vent journaling with a fixed, structured retro format — the kind used to close out a sprint or a project, borrowed and turned inward on one person instead of a team. Always all four, always in this order, in one sitting. It's a shape you can return to without having to decide what to write about first.

---

## Anti-goals

- **Not cloud.** Runs entirely on localhost. No account, no real login, no remote database, nothing leaves your machine. (The threshold scene *looks* like a gate — it isn't one. There's nothing behind it to authenticate.)
- **Not AI.** The spirit's replies are a small fixed set of hand-written lines, chosen at random. No LLM call, no API key, no network dependency.
- **Not a growing thing.** No tree, no visual growth, no archetypes, no seasons, no maturity. The spirit doesn't change shape based on what you tell it. The glow means it's listening, not a progress bar.
- **Not a streak app.** No chain, no "you missed a day."
- **Not gamified.** No points, no levels, no badges.
- **Not social.** Just you and the spirit.

---

## The loop

1. **Open localhost.** The threshold: a black hole at rest, waiting.
2. **Interact with it.** A zoom transition pulls you in — no credentials, just crossing over. Plays out in full by default; skippable if you're not in the mood for ceremony.
3. **Arrive in the void.** Just dark, and the spirit's resting glow.
4. **The spirit asks its four questions**, one at a time. Answer or skip each.
5. **You submit.** If anything's blank, it asks by name whether that's all for today. Once you confirm, the spirit pulses, gives back one short line, then dims back to its resting glow.
6. **You leave.** Entries are saved locally on your machine. Nothing else happens — no reminder, no streak, no follow-up.

---

## Success criteria

1. **It runs fully offline**, on your own machine, with nothing to configure beyond starting it.
2. **You'd use it after a bad day** — it never asks you to perform wellness or growth, just to answer plainly.
3. **Coming back after a long gap costs nothing.** The spirit doesn't remember you left; it just asks again.

---

## Open questions

- **Can you re-read old answers?** Yes — a plain list is enough for the MVP, no visualization needed.
- **Does the spirit's glow ever change?** Kept minimal: an idle resting pulse, and a brighter pulse for a few seconds on submit. No permanent change across visits.
- **One session a day, or as many as you want?** Undecided — default to allowing as many sessions as you want, each saved as its own record.
