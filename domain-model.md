# Universe Tree — Domain Model & Build Plan

*Working reference produced from the grilling session. This is the shared understanding; the design brief (`prompt 1.md`) is the north star, this is how we realized it. Where the two differ, the differences are marked **[revises brief]** — they were deliberate decisions.*

> **v1 scope note (2026-07-12).** The Hub PRD (`prd-hub.md`) is the authority for v1; a grilling session sharpened several items below (inline **[revises]** markers). Headline changes: **aesthetics is the north-star priority, "runs on most devices" is a floor, not a driver**; bake-once **Canvas2D**, not PixiJS; geometry keyed to **visible-entry count**; **no sapling** (plant straight to a tree); **size-driven maturity**, not day-based; climate character includes **motion**; the witness is a **smoky spirit figure**. Where the build order (§7) still mentions sapling/PixiJS, the PRD wins.

---

## 1. Posture & stack (the frame)

- **Who it's for:** you, maybe 2–3 people. Grow the architecture later if it spreads. Optimize for *the feeling*, not scale.
- **Data lives in:** **Supabase** (free tier — Postgres + auth). It's just Postgres underneath, so migrating to a self-hosted box later is a `pg_dump`, not a rewrite. *(Flag: your private entries sit in Supabase's cloud — accepted.)*
- **LLM (the witness):** **OpenRouter**, pinned to a **no-logging route**. Model chosen at build time for voice/tone.
- **The world (main app):** **bake-once Canvas2D** — the deterministic tree is baked to a single glowing sprite when it changes, then each frame composites that sprite + a thin, capped atmosphere layer (climate wash, a few motes, a soft breathe). Depth is faked in the baked art, not per-frame. **[revises: was PixiJS + parallax]** — chosen for beauty-per-watt and broad device reach.
- **Front end:** **Vanilla TypeScript + Vite + Canvas2D + supabase-js.** No component framework, no render library — the DOM is the thin auth threshold + the diegetic voice layer over the canvas. TS for the deterministic tree/lifecycle logic.
- **The threshold (landing):** the existing **`gargantua.html`** (raw WebGL2 black-hole shader) + Supabase register/login. A separate, standalone rendering context from the tree world. Non-diegetic on purpose — a doorway crossed once.
- **Sound:** Web Audio — an ambient drone + a few event tones. Off until first gesture, persistent mute.
- **Platform:** responsive both; desktop-first polish, mobile first-class. Mobile writing panel designed around the keyboard (docks above it; tree stays visible).

**Diegetic line (how far the fiction goes):** everything that *recurs* — arriving, writing, the witness, re-reading, settings — lives inside the fiction (settings & past trees open by *tapping the witness*, not a menu bar). The unavoidable plumbing (register/login/reset/legal) is a plain, quiet threshold you rarely see.

---

## 2. Ubiquitous language (glossary)

| Term | Meaning |
|---|---|
| **Void / Universe** | The dark, vast space the tree stands in. The only light source is the tree. |
| **Tree** | One singular generated organism — the aggregate for a "season." A user grows many over time. |
| **Intention** | A **named seed** the witness offers at planting — `fortitude`, `wisdom`, … (5–8), plus **"let the universe choose."** Picks the **species archetype**. **[revises brief]** — brief withheld all fingerprint choice; we let you choose the *intention* (ceremony), the universe still decides the *form*. |
| **Archetype** | A hand-authored **silhouette family** (5–8). Guarantees every tree sits on a beautiful manifold. Selected by Intention. |
| **Variation seed** | Random seed minted at planting; rolls the exact shape *within* the archetype (angles, taper, curl, asymmetry). Makes each tree singular. |
| **Fingerprint (Permanent traits)** | Archetype + variation seed + **palette**. Fixed at planting, **never changes** for that tree. |
| **Palette** | The one visual choice: *"let the universe decide"* (derived from seed) or *"choose"* (curated set). Each Intention carries a default palette tendency you can override. |
| **Entry** | An immutable story you write. Has a **type**, text, timestamp, **texture**, and a witness response. Can be **hidden**, never deleted/edited. |
| **Entry type** | `win` / `failure` / `struggle` / `vent`. **Explicitly picked** by you (styled in-world as motes/words, not a form). All four equal. |
| **Texture** | Qualitative words the witness LLM infers per entry (`heavy`, `turbulent`, `tender`, `luminous`, `numb`, + rough intensity). **Internal only — never shown as a number or chart.** |
| **Witness** | A dim, translucent **smoky spirit figure** near the tree (kept faint so the tree owns the light). Responds to **every** entry — short, tailored, varied register, **often just presence rather than a reply**. Offers seeds at planting/reseeding. **Clicked → it attends: greeting + the four words (write, primary); the quiet things (re-read / past trees / sound / account) are a subordinate affordance off the same moment.** **[revises: was a faint star]** |
| **Climate / Weather** | The living-layer state derived from recent textures: hue, mist, bloom, particles **and motion (sway, curl, quickness)**. Character only — never size or health. **[revises: motion added]** |
| **Stage clock** | *Deferred past v1.* Sapling stage and day-based transitions are cut from v1 (plant straight to a tree; maturity is size-driven). **[revises: v1 has the size clock only]** |
| **Size clock** | Counted in **entries**. Every entry adds size/density, **asymptotically** toward a soft ceiling (no shapeless mass). **Never shrinks** (holds near the ceiling); reaching full-grown triggers maturity. |
| **Grove / Collection** | A user's trees over time. **v1: a list in the quiet panel + travel into an archived tree (read-only).** Faint background silhouettes deferred. |
| **Threshold** | The non-diegetic auth boundary (Gargantua landing → register/login). |

---

## 3. Entities & relationships

```
User (Supabase auth)
 └── Tree  (many; exactly one is `current`)
      ├── seed fields: intention, variation_seed, palette_choice
      ├── lifecycle: created_at, matured_at?, status(active|matured|archived), is_current
      ├── Entry (many)
      │    ├── type, text, created_at
      │    ├── texture_tags (jsonb, internal)
      │    └── hidden (bool)
      └── WitnessUtterance (many)
           ├── text, register, created_at
           └── entry_id? (null for planting / ambient utterances)
```

- **Climate is derived, not stored** (cached; recomputed on new entry / load).
- **Tree geometry is derived, not stored** — a pure function of `(intention, variation_seed, visible_entry_count, growth_version)`; **content never touches shape** (only count grows it), baked to a sprite for drawing. **[revises: count, not ordered entries]**

---

## 4. Invariants (the rules that must never break)

1. **Content never diminishes the tree.** Size/density only grows or holds — never shrinks. Texture changes *character* only (hue/mist/bloom/particles), never size or health. A heavy month → deeper, mistier, cooler; never smaller or wilting.
2. **The fingerprint is fixed at planting** (archetype + variation seed + palette) and never moves for that tree.
3. **Both clocks only move forward.** Stage clock = distinct active days; size clock = entries. Neither decays. A three-month gap costs nothing — it's a homecoming, not a walk of shame.
4. **The tree is regenerable from source.** Geometry = deterministic, *versioned* function of intention + variation seed + **visible-entry count**. Seeded PRNG only; no `Math.random()` at draw time. If render state is wiped, the exact tree rebuilds from the entries. **[revises: count, not ordered entries]**
5. **Entries are immutable.** Never edited or deleted; may be *hidden* from re-reading. Hiding an entry excludes it from geometry too — but nothing is destroyed and the recipe never develops holes.
6. **Exactly one current tree** per user at a time.
7. **A matured tree is a final, frozen shape** — but still writable and still *lives* (climate keeps responding); it just stops growing.
8. **The witness responds to every entry:** short, tailored, register varies (wisdom / acknowledgment / pattern-noticing / near-silent ambient). It **never** advises unasked, cheerleads, diagnoses, performs enthusiasm, or asks a follow-up to farm engagement. Silence is a *register* ("you are heard"), not an absence.
9. **No streaks, no scores, no shown numbers, no points/levels/badges, no social, no nagging, no clinical sliders.** The tree is a record, not a reward.
10. **The climate is asymmetric — biased toward light.** Fast attack toward brightness/warmth (a bright entry uplifts *immediately*); slow release toward heaviness (heavy/messy input sinks *slowly*, with extra smoothing so it drifts, never thrashes).

---

## 5. The core loop

0. **Threshold.** Gargantua landing → register/login (crossed once).
1. **Arrive.** Dark void, your tree, silence. No dashboard, no badges, no prompts.
2. **Give it something.** Witness: *"Welcome back {name}, tell us your story."* You pick a type (win/failure/struggle/vent) and write into the void.
3. **The tree takes it — instantly.** A branch, a shift in light, a drift of particles + a tone. Felt, not announced. (Immediate; doesn't wait on the API.)
4. **The witness answers.** A beat later — one short, tailored line of a varied register. Always *something*.
5. **You leave.** No streak counter, no "come back tomorrow," no notification.

---

## 6. Lifecycle (state machine)

```
[auto-plant: universe-decides intention + palette → mint variation seed → planting burst + witness dialogue (replayable)]
        │
        ▼
    TREE  ── grows in size/density with each entry, asymptotically; climate lives ──
        │  reaches full-grown (tunable entry-count threshold)
        ▼
   MATURED ── final frozen shape; still writable; climate still lives
        │  witness offers a new seed (gently; never nags)
        │
        ├── decline → keep writing into the matured tree (recorded, witnessed, climate moves, size frozen)
        │
        └── accept → matured tree → ARCHIVED (read-only, revisitable), new tree becomes CURRENT
```

- **[revises brief + v1]** No sapling stage and no day-based transitions in v1: plant straight to a tree, and maturity is **size-driven** (full-grown), not "31 active days."
- **First run:** auto-plant (universe-decided fingerprint) → planting burst + short witness dialogue; the planting moment is **replayable** per tree.
- **Grove (v1):** a list in the quiet panel → travel into any archived tree (read-only) and re-read its entries. Faint background silhouettes deferred.

---

## 7. Build order (ponytail MVP → polish)

Smallest thing that delivers the feeling first; parked features noted.

- **Phase 0 — Threshold.** `gargantua.html` + Supabase auth (email/password or magic link). Cross into an empty void.
- **Phase 1 — The loop skeleton.** Arrive → type picker → write → store entry → witness responds (OpenRouter) → *something* reacts. Placeholder sapling. This proves the heart.
- **Phase 2 — The tree.** Archetypes + seeded variation, deterministic recipe + cache, PixiJS render with parallax depth. Planting flow (intention/palette). Sapling → tree at 7 active days. Size grows per entry.
- **Phase 3 — The living world.** Texture from the witness call → asymmetric rolling-decay climate → scene mapping (hue/mist/bloom/particles). Web Audio drone + event tones.
- **Phase 4 — Lifecycle & grove.** Maturity at 31 active days, reseed flow, past-trees list + faint background silhouettes.
- **Phase 5 — Re-reading & settings.** Tap-the-witness panel: past entries (with hide), past trees, mute, background-trees toggle, account.

**Deferred / someday (parked, not cut):** full diegetic grove *navigation* (travel-to-a-light instead of a list); generative per-tree *music*; scaling past the Supabase free tier; deeper mobile-specific writing refinements.

---

## 8. Open, defaulted (flag if wrong)

- **Auth method:** Supabase **email + password** (magic-link is an easy swap). 
- **Multiple entries per day:** allowed — each grows size once; the *stage* clock ticks only once per day.
- **Number of intentions/archetypes:** start with ~6.
- **Climate window:** rolling-decay over ~2 weeks / ~10 entries, asymmetric per Invariant 10.
