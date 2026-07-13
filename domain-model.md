# A Little Place in the Universe — Domain Model & Build Plan

*Working reference for the shrunk MVP. This supersedes all prior tree/archetype/climate/Supabase/OpenRouter scope from earlier drafts of this file — `prompt 1.md` is still the north star for tone and feeling; this is the mechanics.*

> **v2 scope note.** The product is now: a local-only app, a single glowing spirit in a void, and exactly four fixed retro prompts. No accounts, no cloud, no LLM, no growing tree.

> **v3 scope note.** Still one person, one set of data — but now reachable over the open internet (hosted on Railway) instead of localhost only. That means it needs *something* standing between "anyone with the URL" and the data: a single shared password (env var `AUTH_PASSWORD`), not a full account system. No usernames, no registration, no per-user data — there is still exactly one user. See `server.js` for the session-cookie mechanics.

---

## 1. Posture & stack (the frame)

- **Who it's for:** you, one person, one machine (or, since v3, one hosted URL). No multi-user design, no scaling concerns.
- **Runs on:** localhost during development; hosted on Railway for real use, on a persistent volume (see below) so the SQLite file survives redeploys. Plain Node — the built-in `http` module, no Express or other server framework — serves the page and a couple of JSON endpoints.
- **Data lives in:** a SQLite file on disk via `better-sqlite3`, written by the server — on Railway, on the attached volume (`RAILWAY_VOLUME_MOUNT_PATH`); locally, in `./data`. One file, easy to inspect, back up, or delete. No external database service. This is the one and only npm dependency.
- **The witness (spirit voice):** **no LLM.** A small fixed pool of hand-written lines in code, picked pseudo-randomly (avoid repeating the same line twice in a row). Zero API dependency — this is the "no gimmicks" line in the sand.
- **Front end:** plain HTML/CSS/JS + Canvas2D for the spirit's glow. No component framework, no TypeScript, no Vite or any build step. Edit the files, refresh the page.
- **Auth:** a single shared password (see v3 scope note above), not accounts. When `AUTH_PASSWORD` is unset (local dev), the app behaves exactly like the v2 MVP — no login screen at all. When it's set, every route except `/api/login` requires a signed session cookie, and unauthenticated requests are served `login.html` instead. There's still no per-user identity — the password gates the one and only dataset, it doesn't distinguish users. The visual **threshold** scene (see glossary) remains purely a scene transition, unrelated to this — the password gate sits in front of it, not inside it.
- **Sound:** optional, minimal. At most one soft tone on submit, off by default. Not a priority for MVP.

---

## 2. Ubiquitous language (glossary)

| Term | Meaning |
|---|---|
| **Threshold** | The opening scene (`gargantua.html`): a black hole at rest, with a header nav (Home / Explore / Credits), a title ("Whisper into the Universe"), a subtitle, and a **Begin Journey** button — matching the earlier landing-page mockup. Only the threshold carries this UI; the void stays bare. The black hole is a static render — no drag-to-orbit — since dragging kept invalidating the renderer's TAA accumulation and forcing continuous full-cost re-rendering; it now converges once and idles. Pressing Begin Journey snapshots the current frame as a still image, stops the live renderer, and runs a pulsing hyper-zoom (one pulse, then an accelerating zoom-out with rising brightness) on that snapshot via cheap CSS animation — no swirl, no further shader cost during the transition; pressing it again mid-transition skips straight to the void. Shown on *every* visit — nothing tracks whether you've crossed it before. Purely a scene transition — no authentication, no identity, no accounts. Kept from the earlier build; the auth/login concept behind it was not. |
| **Void** | The dark, empty scene. No ground, no horizon, nothing but black — you are inside a black hole. Arrived at by crossing the threshold. |
| **Spirit** | The single glowing circle at the center of the void. The witness. Fixed shape and size — it does not grow, change palette, or accumulate visual history. Idles at a resting glow; pulses brighter for a few seconds on submit. |
| **Session** | One visit's pass through the four prompts, submitted together. |
| **Prompt** | One of the four fixed questions, always offered in this order: `failed`, `worked`, `missed`, `next`. |
| **Entry** | One saved answer: prompt type + text + timestamp. Immutable once saved for MVP (no edit/delete). |
| **Witness line** | One of a small fixed set of short acknowledgment strings shown after a session is submitted. Never blank, never advice. |

---

## 3. Entities & relationships

```
Session
 ├── id
 ├── created_at
 └── Entry (0..4)
      ├── session_id (FK → Session.id)
      ├── prompt     (failed | worked | missed | next)
      ├── text
      └── created_at
```

`Session` is a real row in SQLite — its own `id` and `created_at` — not just a label for "entries submitted together." `Entry` rows foreign-key to it. This is what lets a zero-answer submission (all four prompts skipped) still be a recordable session, rather than nothing at all.

No `User` entity — single local user is implicit. No `Tree`, `Archetype`, `VariationSeed`, `Palette`, `Climate`, or `Grove` — all removed with the tree-growth mechanic.

---

## 4. Invariants (the rules that must never break)

1. **Every entry is tied to exactly one of the four fixed prompts**, and prompts are always presented in the same order: failed, worked, missed, next.
2. **No prompt is required.** Any or all four can be skipped in a session — but skipping isn't frictionless: if you hit submit with any prompt still blank, a confirmation appears ("Are you sure this is all for today?") naming which prompt(s) you left unanswered. Confirming proceeds with the submit as-is (skipped prompts still create no Entry row); declining returns you to fill in more. This is a nudge, not a gate — the skip still goes through if you confirm it — but it's worth noting the tension with prompt 1.md's "no scoring, no wrong answer" framing: the spirit still isn't grading you, but the app now asks once before letting you leave something out.
3. **Nothing leaves the machine.** Entries persist only to the local SQLite file via the local server. Nothing is written until the confirmed submit — the four prompts live entirely in client-side state until then, at which point the Session row and its Entry rows are written together in one atomic save. There's no partial/in-progress Session sitting in the database; closing the tab mid-pass leaves nothing behind.
4. **The spirit's appearance never encodes entry content or history.** No growth, no color-from-mood, no climate, no size clock. Its only reactive behavior is a brief pulse on submit — the glow means "listening," not a progress bar.
5. **The witness always responds to a submitted session** with one short line from the static pool — never blank, never advice, never a follow-up question.
6. **The threshold shows on every visit.** No flag, cookie, or record tracks whether you've crossed it before — same as the spirit, it has no memory of you.

---

## 5. The core loop

1. **Open localhost.** The threshold: the black hole at rest.
2. **Interact with it.** Zoom transition, no credentials — a scene change, not a login.
3. **Arrive.** Dark void, spirit at its resting glow.
4. **The spirit presents the four prompts**, one at a time, each skippable.
5. **Submit.** If any prompt is still blank, a confirmation names what's unanswered and asks "are you sure this is all for today?" first. Once confirmed, entries save locally; the spirit pulses; one witness line appears.
6. **Leave.** No reminders, no streaks, no scheduled notification.

---

## 6. Build order (MVP)

Smallest thing that delivers the feeling first.

- **Phase 0 — Skeleton.** A local Node server serves a static page on localhost. No persistence yet.
- **Phase 1 — The threshold.** `gargantua.html` is already a clean, self-contained WebGL2 black hole visual with no auth in it — the old auth lived in `web/src/auth.ts`/`auth-ui.ts` (deleted), which merely gated access to it from outside. Nothing to strip; what's missing is new behavior: a click/interact-to-enter trigger, the zoom transition (skippable via a second interaction), and navigation into the void once it completes.
- **Phase 2 — The void + spirit.** Canvas2D glowing circle, centered, idle breathing animation.
- **Phase 3 — The four prompts.** Sequential, skippable text inputs for failed / worked / missed / next, with a submit action.
- **Phase 4 — Persistence.** Local SQLite file via the local server: an endpoint to save a session's entries, an endpoint to list past ones.
- **Phase 5 — Witness reply.** Static line pool, random pick with no-immediate-repeat, shown alongside the submit pulse.
- **Phase 6 (deferred) — Re-reading past entries.** A plain list view. No visualization needed for MVP.

**Cut from scope (removed, not deferred):** Supabase, register/login/auth, OpenRouter or any LLM witness, tree/archetype/variation-seed/palette geometry, climate/weather system, maturity/reseed/grove, PixiJS. **Not cut:** the Gargantua scene itself — kept as the visual-only threshold (see glossary). It was never wired to auth directly; the auth lived one layer up in the deleted `web/` app and is what's actually gone.

---

## 7. Open, defaulted (flag if wrong)

- **Local DB file location:** e.g. `./data/spirit.db` (gitignored).
- **Multiple sessions per day:** allowed, no special handling — each is its own record.
- **Prompt order:** fixed — failed, worked, missed, next — every time, no randomization.
