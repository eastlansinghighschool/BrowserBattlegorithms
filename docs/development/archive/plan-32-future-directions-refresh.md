# Plan 32: Future Directions Refresh

## Packet Metadata

- Packet id: plan-32
- Packet title: Future Directions Refresh
- Status: ready
- Owner/model: implementation agent (small/cheap model is sufficient — docs-only)
- Date: 2026-05-16
- Packet type: docs / hygiene
- Mutation level: docs-only
- Approval gate: none
- Expected artifacts:
  - rewritten `docs/development/future-directions-analysis/backlog.md` reflecting current ground truth
  - new `docs/development/future-directions-analysis/analysis-index.md` consolidating the three model-perspective files into a single status-tagged index
  - the three original model files archived under `docs/development/future-directions-analysis/archive/`
  - progress report
- Progress report folder: `reports/development/plan-32-future-directions-refresh/`
- Progress report file: `reports/development/plan-32-future-directions-refresh/progress.md`

## Packet Summary

Goal: Bring `docs/development/future-directions-analysis/` to current ground truth. The four existing files (backlog.md, claude.md, codex.md, gemini.md) all date from before Plans 25/29/30/31 and reflect a stale view. Future orchestrators routinely re-derive completion status by hand. This packet consolidates the suggestions into a single status-tagged index and rewrites the backlog so the "Near-Term Packet Queue" no longer lists items that are all shipped.

Non-goals:

- Do not invent new future-direction suggestions. The packet records and re-classifies what's already in the four files, plus anything explicitly named in current orchestrator conversation notes — it does not add new ideas of its own.
- Do not rewrite the bodies of model suggestions. Preserve the original phrasing in the archived copies; the new index just adds status + a one-line summary + a link.
- Do not change the packet workflow, the packet-creation guidance, or any subsystem note.
- Do not deploy.

Depends on:

- Current state of `docs/development/README.md` (source of truth for what's shipped).
- Current state of the four files in `docs/development/future-directions-analysis/`.

Blocks:

- Future planning conversations: the next orchestration thread (whether Claude or Codex) should be able to read one index file and have an accurate picture instead of cross-referencing four stale ones.

Why this packet exists:

The future-directions-analysis folder hasn't been refreshed since 2026-05-12. Plans 25a, 25b, 26, 27, 28, 29, 30 have shipped since then, plus 31 is in flight. The backlog's "Near-Term Packet Queue" table currently lists ~14 items, all of which are now complete. The three model-perspective files (claude.md, codex.md, gemini.md) each propose 8–10 suggestions, several of which are shipped, several of which the integration owner has explicitly marked out of scope, and the rest of which are queued at various tiers. Without a refresh, every future planning conversation pays the cost of re-classifying these suggestions from scratch.

## Authority And Contracts

Sources of truth (read-only for this packet):

- `docs/development/README.md` — authoritative for what's shipped.
- `docs/development/future-directions-analysis/backlog.md` — to be rewritten.
- `docs/development/future-directions-analysis/claude.md` — to be summarized then archived.
- `docs/development/future-directions-analysis/codex.md` — same.
- `docs/development/future-directions-analysis/gemini.md` — same.

Required product contracts:

- The new index must not assert a packet is shipped or out-of-scope without evidence in the README or in this packet's explicit status notes.
- Archived files must remain byte-identical to their pre-archive contents (optional one-line "Archived 2026-05-16" banner at the top is OK).
- Cross-links to active packet docs (`plan-NN-...md`) and to archived packet docs (`archive/plan-NN-...md`) must resolve.

Do not redefine:

- The packet-tracking workflow (README is still the canonical index).
- The packet-creation guidance.
- The naming scheme (`plan-NN-...`).

## Required Reading

- `docs/development/README.md` (entire packet table — both Active and Completed)
- `docs/development/future-directions-analysis/backlog.md`
- `docs/development/future-directions-analysis/claude.md`
- `docs/development/future-directions-analysis/codex.md`
- `docs/development/future-directions-analysis/gemini.md`
- `docs/packet-creation-guidance.md`

## Scope

### In scope

- Create `docs/development/future-directions-analysis/archive/` and move (`git mv`) the three model files into it: `claude.md`, `codex.md`, `gemini.md`. Optionally add a one-line "Archived 2026-05-16 — superseded by `../analysis-index.md`" banner at the top of each archived file. The originals are preserved verbatim otherwise.
- Create `docs/development/future-directions-analysis/analysis-index.md` containing a single consolidated table or list of every suggestion across the three model files, status-tagged as one of: **shipped** (with packet link), **out of scope** (with one-line rationale), **queued — tier A/B/C** (with one-line rationale and sequencing note), or **deferred** (with one-line rationale).
- For each entry in the consolidated index, include: short title, status, the model file(s) it came from, one-line summary (≤25 words), and either the shipping packet link or the rationale.
- Rewrite `backlog.md`. Delete the "Near-Term Packet Queue" table (all items are shipped). Replace with: a short header explaining the file's purpose, a single "Active Queue" table that lists only items the integration owner has currently prioritized (Tier A/B/C from the orchestration discussion), and a "Loose Future Ideas" table for the remaining queued/deferred items. Preserve the "Loose Future Ideas" entries that are still relevant.
- Plan 32 progress report.

### Files and areas likely touched

- `docs/development/future-directions-analysis/backlog.md` — rewritten in place.
- `docs/development/future-directions-analysis/analysis-index.md` — new.
- `docs/development/future-directions-analysis/archive/claude.md` — moved.
- `docs/development/future-directions-analysis/archive/codex.md` — moved.
- `docs/development/future-directions-analysis/archive/gemini.md` — moved.
- `reports/development/plan-32-future-directions-refresh/progress.md` — new.

### Out of scope

- New suggestions beyond what the four current files plus the orchestrator's recent tier-list contain.
- Any change to active or archived packet files.
- Any subsystem-note touch.
- Any code, test, or build-config change.

## Work Plan

1. Read all four future-directions files and the current README packet table.
2. Build the consolidated `analysis-index.md`. For each suggestion across the three model files, find its current status by:
   - cross-referencing the README for `complete` packets whose purpose matches;
   - cross-referencing the orchestrator's tier list provided in this packet's "Status Source of Truth" section below;
   - marking remaining items as `queued` or `deferred` per the tier list.
3. `git mv` the three model files into `archive/` and optionally annotate.
4. Rewrite `backlog.md`.
5. Verify every link in the new docs resolves.
6. Write the progress report.

## Status Source of Truth

The integration owner's current tier list (recorded in this packet to seed `analysis-index.md`; the implementer must not invent additions):

**Shipped (mark complete):**
- Turn trace / execution highlighting → Plans 25a, 25b, 29.
- Challenge / synthesis framing → Plan 03.
- Saveable usage file + admin report page → Plans 04, 04b, 16.
- Blockly undo/redo → Plan 05.
- Guided playtest triage / Gemini scaffolding / dev-guided assist → Plans 06, 19, 22.
- Private Free Play program files → Plan 07.
- Guided project sequences → Plans 08–14.
- Pilot readiness → Plan 15.
- Subsystem-doc workflow → Plans 17, 18.
- Doc and packet hygiene → Plan 27.
- Style.css component split → Plan 28.
- Global key-capture bugfix → Plan 30.
- Challenge 22 patrol defenders → Plan 26.

**Out of scope (with one-line rationale per entry):**
- Broad demo XML redesign — handle as targeted fixes when a playtest surfaces a spoiler or stale demo, not as a standalone packet.
- Return-action semantic refactor — would invalidate the one-action-per-turn contract and the trace work in Plans 25a/25b/29.
- State / memory blocks — changes the learning model from local sensing to explicit mutable state; not this version.
- Map editor — teacher-authoring tool with its own validation surface; defer.
- Advanced AI opponents — current campaign has enough opponent variety.
- Build-size review — chunk warnings are tolerable; revisit only if classroom load time becomes a complaint.
- Full strategy comparison view — demo overlay already exists; persistent side-by-side adds screen-space pain.
- Broad "daily puzzles" system — defer; possibly reduces to "scenario cards" later.

**Queued — Tier A (pilot-readiness):**
- Plan 31 finish + repairs (in flight; this packet should reference it but not redo it).
- Teacher timing and facilitation kit → Plan 33 (in flight, drafted alongside this packet).
- Accessibility board narration → upcoming packet not yet numbered.
- Level authoring contract linter → Plan 34 (in flight, drafted alongside this packet).

**Queued — Tier B (AP CSA bridge and learning visibility):**
- Prediction-first checkpoints.
- AP CSA Java preview cards.
- Bug-hunt / reverse-engineering levels.

**Queued — Tier C (depth and competition):**
- Seedable RNG + deterministic replay decision (enabler).
- Tournament-in-a-box (depends on the RNG decision).

**Deferred (not rejected, promote if classroom feedback surfaces the gap):**
- Misconception detectors / inline lint-style warnings — defer until classroom feedback names specific common stuck points; assessment-shaped tools (prediction, bug-hunt) cover most of the same ground first.
- Sensor sandbox / API explorer — trace playback already addresses much of the same intuition gap.
- Formative-assessment checkpoint quizzes — same family as prediction; revisit after prediction lands.
- Strategy reflection export — depends on whether usage evidence proves sufficient without it.
- Deterministic replay viewer UI (the playback player) — separate from the seed/RNG decision; build only if students or teachers ask for it.

## Implementation Requirements

### Requirement 1: Consolidated index file

Required behavior:

- `docs/development/future-directions-analysis/analysis-index.md` exists and contains:
  - A short header (≤10 lines) explaining the file's purpose and pointing to `archive/` for the original model files.
  - A single table or grouped list with columns: Title, Source (claude/codex/gemini/multiple), Status, Notes/Link.
  - Every distinct suggestion from the three model files appears exactly once. Where two or three models proposed the same idea (e.g. turn-trace appeared in all three), consolidate into one row with Source listing all the originating model files.
  - Status values are exactly one of: `shipped`, `out of scope`, `queued — A`, `queued — B`, `queued — C`, `deferred`.

Constraints:

- The implementer assigns status from the "Status Source of Truth" section above, not from independent judgment. If a suggestion appears in the model files but isn't covered by the source-of-truth list, mark it `deferred` and surface the gap in the progress report.
- One-line notes only. The original files exist in archive for anyone wanting the full rationale.
- Order entries by status (shipped first or last — implementer's choice but stay consistent), then alphabetically within status.

Edge cases:

- A model file proposes something that's actually already a project contract, not a future direction (e.g. "one-action-per-turn" mentioned as a feature). Skip it; note in the progress report.
- Two model files propose subtly different versions of the same idea. Consolidate under the broader phrasing and note both originals in the Source column.

Expected artifact:

- `analysis-index.md`.

### Requirement 2: Archive moves

Required behavior:

- `docs/development/future-directions-analysis/archive/` exists and contains the three original model files moved via `git mv`.
- Each archived file may optionally gain a one-line banner at the top: `> Archived 2026-05-16 — superseded by [analysis-index.md](../analysis-index.md).` Skip if it would distort the file's existing front-matter or visible structure.

Constraints:

- Use `git mv`, not copy+delete, so history follows.
- Do not modify the body of any archived file beyond the optional banner.

Expected artifact:

- Three archived files at the new path.

### Requirement 3: Rewritten backlog

Required behavior:

- `backlog.md` is rewritten in place:
  - Top of file: short header (≤10 lines) describing the file's role and pointing at `analysis-index.md` for the full suggestion catalog and at `docs/development/README.md` for shipped packet tracking.
  - "Active Queue" section: a small table listing only the Tier A items from the source-of-truth list, with status and current packet number where applicable.
  - "Loose Future Ideas" section: the Tier B/C and deferred items, with one-line summaries.
  - No "Near-Term Packet Queue" section. That table's content (all shipped) is replaced by a single sentence pointing at the Completed Packets table in the README.

Constraints:

- Keep the file short (≤80 lines target). The point is scannability, not completeness — `analysis-index.md` is the catalog.

Expected artifact:

- Rewritten `backlog.md`.

### Requirement 4: Validation

Required behavior:

- Every relative link in the new docs resolves.
- `npm test` and `npm run build` pass (docs-only changes should not affect them, but sanity-check).
- `git status` shows only the expected moves and new/edited docs.

Expected artifact:

- Validation results in the progress report.

## Model-Specific Instructions

- Start by listing every distinct suggestion across the three model files. Cross-reference the Status Source of Truth section to assign status. Do not invent additions or omissions.
- The implementer is not the author of the future-directions strategy. Their job is to faithfully record the integration owner's current tier list into a single index.
- Keep prose terse. One-line notes per entry.
- If a model-file suggestion can't be assigned a status from the source-of-truth list, mark it `deferred` and flag it in the progress report for the integration owner to triage.

## Commands

```powershell
git status
git mv docs/development/future-directions-analysis/claude.md docs/development/future-directions-analysis/archive/claude.md
git mv docs/development/future-directions-analysis/codex.md docs/development/future-directions-analysis/archive/codex.md
git mv docs/development/future-directions-analysis/gemini.md docs/development/future-directions-analysis/archive/gemini.md
npm test
npm run build
```

## Validation Checklist

- [ ] `analysis-index.md` exists with every distinct model-file suggestion status-tagged.
- [ ] The three model files moved to `archive/` via `git mv`.
- [ ] `backlog.md` rewritten; no "Near-Term Packet Queue" table remains.
- [ ] Every relative link in the new docs resolves.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No code, test, or subsystem-note file changed.
- [ ] Progress report flags any suggestion that couldn't be assigned a status from the source-of-truth list.

## Stop Conditions

Stop and report for integration-owner review if:

- A model-file suggestion can't be reconciled with the source-of-truth tier list and the implementer is uncertain whether to mark it `deferred`, `out of scope`, or something else.
- The implementer notices that a "shipped" packet listed in the source-of-truth list doesn't actually appear `complete` in the README — that indicates the source-of-truth list itself is wrong.
- The required reading reveals a future-direction file the orchestrator didn't see (e.g. a fifth file added since 2026-05-12).
