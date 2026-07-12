# 04 — The write loop

*Tier: MVP · Stories: 4-13, 21, 23, 26, 28, 30, 42. The heart of the app.*

## What to build

The core loop. Clicking the Witness offers **four equal words** (win / failure / struggle / vent — none ranked or colored); choosing one opens a **caret-in-the-void** writing surface; **`let it go`** (or Cmd/Ctrl+Enter) releases. On release the Entry persists to Supabase (immutable: `type`, `text`, `created_at`, tied to the current Tree), the **Tree grows by one** (recursive render at the new visible-entry count), a brief flare + tone play, and the scene **falls quiet** (no auto re-offer). A basic list re-reads past Entries. The Witness answers with a short line from a **local pool** (no LLM yet). Writing is re-initiated only by clicking the Witness again.

## Acceptance criteria

- [ ] Click Witness → four equal, unranked words → pick one → write → release persists an immutable Entry on the current Tree.
- [ ] The Tree visibly grows with each Entry (count-driven) and never shrinks from writing; growth is immediate and local (no network wait).
- [ ] After release the Witness shows a short local-pool line, then the scene falls quiet; writing re-initiates only via the Witness.
- [ ] A basic list re-reads the current Tree's past Entries.
- [ ] Release is a no-op on empty text; the writing surface is keyboard-operable and lifts above the mobile keyboard.

## Blocked by

- 03 — Hub arrival
