# PRD — The Hub (the returning-user main experience)

*Scope: the central hub of Universe Tree — arriving into the Void, giving the Tree an Entry, the Witness attending, and the world growing more beautiful. North star `prompt 1.md`; shared model `domain-model.md`; aesthetic target `attak.jpg` (a blaze of white light erupting from glowing blue dunes in a cold, indifferent dark). Interaction and look were prototyped in `hub.html` (throwaway).*

> **The one thing that matters:** this app delivers its entire value by being *beautiful*. Priority order is **(1) maximize the aesthetic**, then **(2) run on most devices** as a floor. Performance choices below exist to make the beauty cheap and reachable, never to make it lesser.

---

## What the Hub is

An aesthetic object. A singular Tree of light standing in a vast, indifferent dark, that you feed with whatever you're carrying, that a dim smoky spirit-Witness quietly attends, and that grows **more beautiful the more you show up** — never diminished by hard days, only changed in character. You look at it because it's worth looking at.

## Problem Statement

When I want to put down what I'm carrying, my options are a filing cabinet or a scoreboard. A notes app receives my words and does nothing with them; nothing notices, nothing accumulates into anything I'd want to look at. A habit or journaling app does the opposite: it counts me, streaks me, and guilts me the moment I break the chain, which is exactly the day I needed it most. So on a bad day I have nowhere that will simply receive what I give it and turn it into something beautiful and permanent, without turning me into a number or abandoning me for struggling.

## Solution

I arrive into a dark, vast, quiet Void where the only light is my own Tree, unlike anyone else's, with a faint spirit-Witness beside it. It greets me. I click the Witness, choose how I'm arriving (a win, a failure, a struggle, or a vent, all equal), and write into the dark. The Tree takes it immediately and visibly: it grows, the light flares, motes rise, a low tone sounds. A beat later the Witness answers — briefly, often just as presence — and the world's mood eases toward what I wrote. Nothing scores me. A hard Entry never shrinks or wilts the Tree; it only changes its character (cooler light, drawn mist, tighter, slower motion), because struggle becoming part of the Tree's beauty is the whole point. Everything falls quiet and I'm left with the Tree. I leave with no streak counter and no summons to return. Months later I come back and it feels like a homecoming. Eventually the Tree is full-grown, and the Witness gently offers to begin another.

---

## The Aesthetic (the product)

- **Palette — cold and locked.** Blazing white light, iced blue, deep navy Void, blue-white glowing dunes. One accent, one theme (the Void is dark by nature, not a toggle). The color temperature carries the thesis: a living light in an indifferent cold.
- **The Tree — a burst of light, not a branching trunk.** Fine filaments spray from a blazing white core, tapering white → iced-blue at the tips, a light-column pouring down to a pool of light on rippled dunes. This is the `attak.jpg` image and it is the hero of every frame.
- **The Witness — a smoky spirit figure.** Dim, translucent, beside the Tree, kept faint so the Tree keeps the light. It is the one thing you touch.
- **Sacred vs flex (beauty on any device).** The *sacred floor* — baked Tree sprite, core glow, light-column, ground pool, and the Climate color-wash — renders identically and cheaply on any device; this alone is the picture. The *flex layer* — motes, mist, ripples, sway, render resolution — scales up on capable hardware and thins on weak hardware. Atmosphere degrades first; the Tree never does. Tiers are **measured over a few frames on load, not device-sniffed**.
- **Quiet at rest, motion lavished on the moments.** At rest the Tree breathes almost imperceptibly and the light shimmers slowly — the calmest image and the lightest loop, near-idle CPU. The motion budget is spent on rare, brief, gorgeous events: the planting **burst**, the **release**, and the **Climate shift**. Still 95% of the time; alive exactly when something happened.

---

## User Stories

1. As a returning writer, I want to arrive into darkness, my Tree, a faint spirit, and silence — no dashboard, badges, or prompts — so that it feels like a place rather than a tool.
2. As a returning writer, I want the Witness to greet me by name instantly with no loading, so that I feel received the moment I arrive.
3. As a returning writer, I want the greeting to vary unpredictably (a plain welcome, an ambient cosmic line, or just silence), so that the Witness never feels like a script on a schedule.
4. As a writer, I want to begin writing by clicking the Witness, so that the one presence in the world is the one thing I interact with.
5. As a writer, I want to choose how I'm arriving from four equal words (win, failure, struggle, vent), so that I can name the shape of what I bring without a form.
6. As a writer, I want the four types rendered as plain equal words — none highlighted, ranked, or color-coded — so that venting never feels lesser than winning.
7. As a writer, I want to vent with no shape at all, so that I don't have to make my feeling legible before I'm allowed to put it down.
8. As a writer, I want to write into the Void as caret-in-the-dark with no visible box, so that it feels like speaking into the universe rather than filling a field.
9. As a writer on a phone, I want the writing surface to lift above the keyboard while the Tree stays visible, so that I can write without losing the world.
10. As a writer, I want a quiet, non-transactional way to send my Entry (`let it go`, or a keyboard shortcut), so that finishing feels like release, not submitting a record.
11. As a writer, I want the Tree to grow and the light to flare the instant I release, before any network, so that the response is felt, not awaited.
12. As a writer, I want my released words to visibly dissolve upward into the light with a low tone, so that I can see the Tree take what I gave it.
13. As a writer, I want a soft tone on release with sound off by default and a persistent mute, so that the world can be felt or silent on my terms.
14. As a writer, I want the Witness to answer every Entry with one short line a beat later, so that I always know I was seen.
15. As a writer, I want that line to often be presence rather than a reply (a meteor said hello; the universe makes no sound), so that being witnessed doesn't require being analyzed.
16. As a writer, I want the Witness to never advise unasked, cheerlead, diagnose, perform enthusiasm, or ask a question to keep me engaged, so that it stays a witness and not a coach, therapist, or chatbot.
17. As a writer, I want the world's mood to ease toward what I wrote a beat after I release (once the Witness has read it), so that the shift feels like being understood, not like a meter moving.
18. As a writer having a bad day, I want the Tree to change character rather than shrink or wilt, so that opening the app when I'm struggling never makes me feel worse.
19. As a writer, I want a hard stretch to cool the light, draw mist, and make the Tree's motion slower and tighter — while a luminous stretch opens and quickens it — so that my mood shapes the Tree's *beauty*, never a score.
20. As a writer, I want brightness to arrive immediately and heaviness to settle slowly, so that a good moment lifts the world at once and a hard stretch drifts in without thrashing.
21. As a writer, I want every Entry to grow the Tree regardless of its emotional content, so that showing up is the only thing that grows it.
22. As a writer, I want the Tree to grow with diminishing steps toward a soft ceiling, so that it becomes fuller over time without ever turning into a shapeless mass.
23. As a writer, after the Witness answers I want everything to fall quiet and leave me with just the Tree, so that I can sit with it and it never asks me for more.
24. As a writer, I want to look at the Tree without writing anything, so that it can be a thing worth having on its own.
25. As a writer, I want the resting world to be nearly still and reverent, so that it feels like silence-as-a-feature and stays kind to my battery.
26. As a writer, I want to write again only by choosing to (clicking the Witness), so that returning to write is always my move and never a prompt.
27. As a writer returning after months away, I want no penalty, no lost streak, and no walk of shame, so that coming back feels like a homecoming.
28. As a writer, I want no points, levels, badges, XP, or shown numbers anywhere, so that the Tree stays a record and not a reward.
29. As a writer, I want to reach the quiet things (past Entries, past Trees, sound, account) from the Witness without a menu bar, so that everything recurring lives inside the fiction.
30. As a writer, I want to re-read my past Entries, so that I can see what I've circled and where I've come from.
31. As a writer, I want to hide an Entry from re-reading without deleting it, so that I can look away from something without erasing that it happened.
32. As a writer, I want the first arrival to plant my Tree with a short luminous burst and a few words from the Witness, so that the beginning feels like a moment, not a blank screen.
33. As a writer, I want to replay that planting moment later, so that I can return to how it began.
34. As a writer, I want the Tree, once full-grown, to be met by the Witness gently offering a new seed, so that growth has a beautiful ending rather than an endless plateau.
35. As a writer offered a new seed, I want to decline and keep writing into the matured Tree, so that I'm never forced to move on before I'm ready.
36. As a writer offered a new seed, I want to accept and watch a new Tree burst into being, so that beginning again is itself a moment worth having.
37. As a writer, I want my matured Trees kept and revisitable (read-only), so that the ones I've lived through aren't lost.
38. As a writer, I want the app to stay beautiful and smooth on a modest or older phone, so that the experience isn't reserved for expensive hardware.
39. As a writer who prefers reduced motion, I want the shimmer, drift, and burst to calm to a still, beautiful frame, so that the app respects my setting without losing its image.
40. As a writer using a keyboard or screen reader, I want the Witness, the four words, the writing surface, release, and the quiet panel to be operable and announced, so that the experience is reachable without a pointer.
41. As a writer, I want the Witness's words to stay legible over the bright dunes, so that I can always read what it says.
42. As a writer, I want to leave with no "come back tomorrow" and no scheduled notification, so that returning is always my choice.

---

## Product Decisions

### The look and how it stays light

**Render — bake once, animate cheap.** The deterministic Tree is baked to **one high-quality glowing sprite** only when it changes (on plant, and on each new Entry as it grows). Every frame composites that sprite + a thin, capped atmosphere layer. Plain **Canvas2D**, no PixiJS, no render library — dependency-free and universal. (Revises `domain-model.md`, which specified PixiJS.)

**Sacred vs flex.** Sacred, always rendered: baked Tree sprite, core glow, light-column, ground pool, Climate color-wash. Flex, scaled to the device and shed first under load: motes count, mist detail, ripple animation, sway rate, and render resolution (cap DPR ≈ 1.5). Quality **tier is measured over the first frames, not device-sniffed**, and steps down if timing slips. Atmosphere degrades before the Tree, and the Tree never does.

**Motion budget.** Quiet at rest (imperceptible breathe, slow shimmer, near-idle loop; step down further or pause when the tab is hidden or under reduced-motion / battery-saver). Motion is spent on three brief events: the planting **burst**, the **release**, the **Climate shift**.

### The loop

**Two-beat reaction.** On release the Tree grows **instantly and locally** (geometry recomputes at the new count, re-bakes the sprite) with an acknowledgment flare, rising motes, and a tone — no network in this beat. A beat later, the single Witness call returns a **texture**, and Climate **eases** toward it. *Growth is immediate; mood follows.*

**Geometry — count only, baked.** Tree geometry is a deterministic, versioned pure function of `(intention, variation_seed, visible_entry_count, growth_version)`, seeded PRNG only. **Content never touches shape** — only the *count* of visible Entries grows it, so the core rule is enforced structurally, not merely intended. Growth is **asymptotic** toward a soft ceiling. Hiding an Entry drops the count by one (a slight, accepted shrink; "never shrinks" governs *content*, not your explicit hide). Regenerable from Entries alone if render state is wiped.

**Climate — character, including motion.** Derived (cached, recomputed on new Entry / load) as a pure function of recent Entry **textures** over a rolling window. It sets hue, mist, bloom, particles, **and motion (sway, curl, quickness)** — never size or health. **Asymmetric:** fast attack toward light/warmth (a bright Entry lifts the world at once), slow, smoothed release toward heaviness (a hard stretch drifts in without thrashing).

**Entry.** Immutable: `type` (win / failure / struggle / vent, explicitly picked, all equal), `text`, `created_at`, `texture_tags` (internal only — never shown as a number or chart), `hidden`. Never edited or deleted; hiding excludes it from re-reading and from the count, but destroys nothing.

**The Witness.** A dim, translucent smoky spirit figure. Responds to **every** Entry a beat later — one short line, varied register, **often ambient presence rather than a reply**; the texture is inferred silently from the Entry regardless of the spoken register. Never advises unasked, cheerleads, diagnoses, or farms engagement. Backed by **OpenRouter on a no-logging route**, model chosen at build time for voice.

**The single network call, and its base case.** The **only** LLM call in the whole hub loop is the post-release one (utterance + texture). It times out at **8 seconds (config)**. On success: show the line, ease Climate toward the texture. On timeout/failure: show a **base-case** line from a local pool and infer no texture, so Climate simply holds for that Entry. Arrival and everything else are local and instant — the Void never waits on the network.

**Falls quiet.** After the Witness's line, everything fades to **resting** (Tree + spirit, silence). No auto re-offer. Writing is re-initiated only by clicking the Witness.

**Clicking the Witness.** It attends: greeting + the four words (write, primary). The quiet things — re-read past Entries (with hide), past Trees, sound toggle, account — are a subordinate affordance off that same moment, not a menu bar.

**Planting.** On first login, if there's no current Tree, one is **auto-planted** with a universe-decided Fingerprint (Intention + Palette both "let the universe decide" from a minted variation seed), wrapped in a short **planting burst + Witness dialogue**. The planting moment is **replayable** per Tree from the quiet panel. (Choosing Intention/Palette — the full ceremony — is deferred.)

**Maturity and reseed.** When the Tree reaches **full-grown** (a tunable entry-count threshold), it matures and the Witness gently offers a new seed. **Decline** → keep writing into the matured Tree (size frozen, Climate still lives). **Accept** → the matured Tree is archived (read-only) and a new current Tree bursts into being. Exactly one current Tree always. (Maturity is **size-driven**, revising the domain model's 31-active-days trigger.)

**Grove (v1).** A list in the quiet panel → travel into an archived Tree (re-rendered from its recipe) to re-read its Entries, read-only. Faint background silhouettes and travel-to-a-light navigation deferred.

**Persistence.** Online web app; **Supabase** (Postgres + auth) is the source of truth. No offline-first sync engine — a failed write is held as an in-memory draft and retried; writing with no signal is an accepted limitation.

**Sound.** Web Audio: an ambient drone + a few event tones. Off until the first gesture; mute is persistent.

**The loop as a state machine (from the `hub.html` prototype, updated):**

```
states:  arriving → offering → writing → releasing → witnessing → resting
         resting  + summon(click witness)     → offering
         witnessing + [full-grown]            → matured-offer
         matured-offer + accept               → arriving (new tree bursts)
         matured-offer + decline              → resting (writable, size frozen)

events:  arrived            // world faded in; local greeting, no network
         summon             // click the spirit figure
         choose(type)       // win|failure|struggle|vent  (equal)
         edit(text)
         release            // no-op if empty
         reacted            // tree grew + flared locally (immediate)
         witnessed(line, texture) | witnessTimedOut   // ≤ 8s, else base case
         reseed(accept | decline)

decisive transitions:
  offering  + choose(t)        → writing{type:t}
  writing   + release[empty]   → writing
  writing   + release          → releasing         // grow tree NOW (local); fire the one LLM call
  releasing + reacted          → witnessing
  witnessing+ witnessed(l,tex) → resting{line:l}    // Climate eases toward tex
  witnessing+ witnessTimedOut  → resting{line:base} // no texture; Climate holds
  resting   + summon           → offering
```

## What protects the feeling (tests)

Only a handful of things can quietly break the *feeling*, and those are exactly the pure, fast checks worth writing (Vitest; greenfield, so these become the prior art). Test external behavior, not draw calls or DOM.

- **The Tree never diminishes.** Adding an Entry never reduces size; the *only* thing that lowers the count is an explicit hide. Content (type/texture) has no path to size at all.
- **The Tree is deterministic and regenerable.** Same `(intention, seed, count, version)` → identical geometry, no `Math.random()` in the path; rebuilt-from-Entries equals cached.
- **Climate is character-only and asymmetric.** Its output carries no size/health term; a bright texture lifts it more per step than an equal-magnitude heavy one, and the trajectory is smoothed, not oscillating.
- **You are always met.** Every released Entry yields a line — including when the network call throws or exceeds 8s (base-case line) — and the immediate world reaction never waits on that call.
- **Exactly one current Tree**, and hidden Entries are excluded from re-reading.

The renderer, the atmosphere, and the DOM voice layer are thin and verified **by eye**, not by unit tests — the visual is the product, and it's judged by looking.

## Out of Scope

- **Threshold / auth:** `gargantua.html` landing + Supabase register/login/reset/legal. A separate, non-diegetic context.
- **The full planting *ceremony*:** choosing Intention and Palette. v1 auto-plants universe-decided (the *animation + dialogue* are in; the *choices* are not).
- **The sapling stage and any day-based transitions:** cut from v1 entirely (plant straight to a Tree; maturity is size-driven).
- **Deep cross-Entry pattern-noticing:** the Witness surfacing something days later, or a history-aware arrival line. Needs pattern-detection + triggers; deferred.
- **Grove polish:** faint background silhouettes of past Trees in the live Void, and travel-to-a-light navigation.
- **Offline-first:** local store + sync reconciler. v1 assumes connectivity.
- **Witness prompt engineering:** exact prompt, model selection, register-tuning. This PRD fixes only the contract (short, tailored, varied/often-ambient register, never advises, returns line + texture, ≤ 8s or base case).
- **Generative per-Tree music**, and scaling past the Supabase free tier.

## Further Notes

- **The rule that must never break:** the Tree grows because you showed up, not because you were happy. Content never diminishes it; it only changes its character. Every decision is checked against this.
- **The feeling to protect:** small under an indifferent universe, and at the same time the only one of you — looking at the one impossible glowing thing that exists because you kept showing up.
- **Success criteria (ranked):** (1) you open it on a bad day and it helps; (2) you look at the Tree without writing; (3) you're still using it in six months, not daily; (4) you'd be sad to lose the Tree. Daily active use is explicitly *not* a criterion.
- **Priority order:** aesthetics first; "runs on most devices" is a floor, never a reason to make it less beautiful.
- **Artifacts:** `attak.jpg` fixes the aesthetic target. `hub.html` is the throwaway interaction + visual prototype and the source of the state machine above.
- **Publishing note:** no issue tracker / triage vocabulary was configured, so this PRD lives as a repo file. Run `/setup-matt-pocock-skills` to enable tracker publishing with the `ready-for-agent` label.
