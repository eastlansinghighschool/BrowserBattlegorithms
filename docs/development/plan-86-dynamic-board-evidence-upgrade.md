# Plan 86: Dynamic Board Evidence Upgrade

- Packet id: Plan 86
- Packet title: Dynamic Board Evidence Upgrade
- Status: ready
- Owner/model: lower-cost implementation agent with data-tooling care
- Date: 2026-07-06
- Packet type: developer tooling / reports / testing / scan-prep
- Mutation level: source-code (dev tooling under `src/dev/` or `scripts/`) / tests / generated-local / docs
- Approval gate: before adding dependencies, before changing existing generated-output file contracts consumed by prior audits
- Expected artifacts:
  - per-level enemy movement timelines for live/unfrozen NPCs
  - per-level interaction timelines (collisions, bounces, near-misses, flag events, freeze uses)
  - per-level trace-observed execution tables for reference solutions
  - naive-solution failure evidence where a naive fixture exists, plus the fixture folder convention
  - machine-readable per-level par-candidates artifact
  - extended `behavior-summary-index.md` columns without breaking existing columns or links
  - focused tests for each new evidence section
  - progress report
- Progress report folder: `reports/development/plan-86-dynamic-board-evidence-upgrade/`
- Progress report file: `reports/development/plan-86-dynamic-board-evidence-upgrade/progress.md`

## Packet Summary

Goal: Extend the Plan 73/74 deterministic evidence generators so per-level evidence captures dynamic board behavior — enemy movement over time, interaction sequences, which reference-solution blocks/branches are observed in the existing Blockly trace, how naive solutions fail, and machine-readable par candidates — ahead of a campaign rewrite that introduces living boards, escalation arcs, and mastery scoring.

Non-goals:
- Do not redesign levels, rewrite the campaign, or implement escalation/mastery mechanics.
- Do not decide par values, star thresholds, or scoring rules; only emit seed data.
- Do not change NPC behavior, turn rules, Blockly semantics, collision, scoring, or fixture policy.
- Do not modify existing reference solutions or create new ones (naive fixtures are new optional additions, not replacements).
- Do not make curriculum judgments; this packet compiles evidence only.
- Do not require a browser or add dependencies.

Depends on:
- Plan 73 dossier tooling and output folder convention (`src/dev/levelDossiers.js`, `reports/development/guided-level-complexity-audit/`).
- Plan 74 behavior-evidence tooling (`src/dev/levelBehaviorEvidence.js`, `behavior-evidence/`, `behavior-summary-index.md`).
- Plan 25a trace-collection infrastructure in `src/ai/blockly/` (`lastBlocklyTrace` and related state).
- Existing deterministic test harness (`tests/unit/helpers/testHarness.js`).

Blocks:
- The campaign-rewrite decision packets can consume this evidence to reason about live-enemy pressure, escalation candidates, and degenerate solutions.
- A future stars/par packet can consume the par-candidates artifact as seed data.

Why this packet exists:
The owner is weighing a campaign rewrite built around living boards (moving enemies), escalation arcs, and mastery scoring. Every version of that rewrite needs the same evidence: what live enemies actually do turn by turn, when interactions happen, which parts of reference solutions are observed firing in trace data, whether trivially naive solutions already fail, and what a fair par might be. The current Plan 74 output summarizes events as tails and one-line interaction lists; it does not show sequence, trace-observed execution, or degenerate-solution behavior. Upgrading the evidence generators now is decision-independent: it improves the evidence base regardless of which rewrite decisions are later approved, and it keeps orchestration tokens reserved for judgment rather than re-running source spelunking.

## Authority And Contracts

Required project contracts:
- Turn resolution order belongs to `docs/subsystems/turn-engine.md`.
- NPC behavior contracts belong to `docs/subsystems/npc-and-cpu.md`.
- Blockly first-action-only semantics and trace behavior belong to `docs/subsystems/blockly-workspace.md`.
- Reference fixtures remain the authoritative runnable solutions where they exist.
- Generated evidence must not become a source of truth over authored level files.
- Existing generated files consumed by Plans 75/76 (`behavior-summary-index.md`, per-level behavior evidence, dossiers) are a downstream contract: prior audits cite them by path and column. Extensions must be additive, or the whole set must be regenerated wholesale in the same run with links intact.
- Packets and generated report locations must follow `docs/packet-creation-guidance.md`.

Do not redefine:
- Guided NPC behavior constants or movement rules.
- Reference-solution acceptance criteria.
- Which levels require human input or prediction choices.
- Documented project-solution exceptions from Plan 74.
- Fixture policy for `tests/unit/fixtures/` beyond the one new naive-fixture folder this packet defines.

## Required Reading

Read before editing:
- `docs/development/plan-73-guided-level-dossier-generator.md`
- `docs/development/plan-74-guided-reference-behavior-evidence.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/npc-and-cpu.md`
- `src/dev/levelDossiers.js`
- `src/dev/levelBehaviorEvidence.js`
- `src/dev/levelReadiness.js`
- `tests/unit/helpers/testHarness.js`
- `tests/unit/level-behavior-evidence.test.js`
- The Plan 25a trace collection module in `src/ai/blockly/` (locate via `rg`)
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md` (current output shape)

Use `rg` for:
- `lastBlocklyTrace`
- `currentTurnEventLog`
- `lastTurnEventLog`
- `runner.blockedOrBounced`
- `flag.pickedUp`
- `flag.dropped`
- `FREEZE_OPPONENTS`
- `cpuBehavior`
- `isFrozen`
- `runGuidedLevelWithSolution`
- `GUIDED_LEVEL_REFERENCE_SOLUTIONS`

## Scope

### In Scope

- Extend the deterministic evidence generators (Plan 73/74 tooling under `src/dev/` and `scripts/`) to emit the six evidence upgrades below per level.
- Define and document the naive-fixture folder convention.
- Emit one machine-readable par-candidates artifact for the whole campaign.
- Extend `behavior-summary-index.md` with new columns without breaking existing columns or links.
- Regenerate the full evidence set so no generated file is half-updated.
- Add focused unit tests for each new evidence section using synthetic/authored data.
- Update the progress report with any instrumentation gaps discovered.

### Out Of Scope

- Level, fixture (other than optional naive fixtures), or reference-solution edits.
- Engine, interpreter, NPC, or event-system changes. If evidence requires new runtime events or engine hooks, stop and report.
- Browser playthroughs or screenshots.
- Par/star/mastery rule decisions.
- Curriculum recommendations.
- Editing `docs/development/README.md` rows for other packets beyond adding the Plan 86 row.

### Files And Areas Likely Touched

- `src/dev/levelBehaviorEvidence.js` (or a sibling module it composes)
- `src/dev/levelDossiers.js` (index columns only, if the index is rendered there)
- `scripts/`
- `tests/unit/`
- `tests/unit/fixtures/guided-naive-solutions/` (new folder, optional fixtures)
- `reports/development/guided-level-complexity-audit/`
- `reports/development/plan-86-dynamic-board-evidence-upgrade/progress.md`
- `docs/development/README.md` (status flip only — the Plan 86 row already exists)

## Implementation Requirements

### 1. Enemy Movement Timeline

Required behavior:
- For each live (unfrozen) NPC in a level's reference run, emit a compact per-turn position log covering the first N own-turns of the run: turn number, runner id, behavior constant, from-cell, to-cell, action taken.
- For frozen runners, record them as static with their tier/behavior — one row, not a timeline.
- Render the timeline as a Markdown table in the per-level behavior evidence file.

Constraints:
- N defaults to the first ~15 own-turns; if the run ends sooner, the timeline ends with the run.
- Deterministic across reruns; same harness seed/setup as Plan 74.
- Coordinates use the same cell notation the Plan 73 dossiers already use.
- If a level has no NPCs, write `no NPCs` rather than an empty table.

Edge cases:
- NPCs that unfreeze mid-run (e.g., freeze expiry) should show the transition turn.
- NPCs removed or reset mid-run should log the last observed state, not fabricate rows.

### 2. Interaction Timeline

Required behavior:
- Emit a sequenced timeline table of interaction events with turn numbers: collision events, bounce events, near-miss events (any enemy within 1 cell of any player runner at a turn boundary), flag pickups/drops, and freeze uses.
- Much of this exists in the Plan 74 event-log data; the upgrade is surfacing it as an ordered timeline table rather than an event-tail summary.

Constraints:
- Near-miss detection is a read-only derivation from board state at turn boundaries; do not add runtime events for it.
- Bounded to the same first ~15 own-turns window plus a final-tail note if later events matter (e.g., the scoring event).
- Neutral phrasing only (`enemy within 1 cell of carrier at turn 7`), no threat judgments.

Edge cases:
- Multiple events on the same turn appear in resolution order per `docs/subsystems/turn-engine.md`.
- Levels with no interactions get a one-line `no interaction events observed in window`.

### 3. Trace-Observed Execution Coverage

Required behavior:
- Using the existing Plan 25a trace-collection infrastructure (`lastBlocklyTrace` and related state), report which blocks or trace-identifiable branches of the reference solution were observed firing during the reference run and which trace-identifiable blocks never executed.
- Output: a per-block fired/never-fired table (block id or type + position, fired count or fired/never) plus a coverage ratio (blocks fired / total executable blocks).
- Flag never-fired blocks factually (`3 of 11 blocks never executed`), without judging whether that is a defect.

Constraints:
- Read trace data only; do not modify the interpreter or trace format.
- This is evidence of observed execution in the deterministic reference run, not a proof that all semantic branches of the program have been covered across possible boards.
- If trace data turns out not to be reachable from the harness context, stop and report rather than hacking engine changes.
- Coverage applies only to levels with runnable reference/project fixtures; others report `not applicable`.

Edge cases:
- Blocks that fire on some runners but not others (multi-ally programs) count as fired.
- Project levels report trace-observed execution per fixture (checkpoint and final) like Plan 74's split rows.

### 4. Naive-Solution Failure Proof

Required behavior:
- Accept an optional per-level "naive fixture": a deliberately trivial solution XML, for example the previous pre-uplift reference.
- Fixture folder convention: `tests/unit/fixtures/guided-naive-solutions/<level-id>.xml`. Document this convention in the generated evidence and the progress report.
- When a naive fixture exists for a level, run it through the same deterministic harness and record: pass/fail, failure reason (`lastLevelResultReason` or equivalent), turns elapsed, and a short final board state summary.
- When no naive fixture exists, record `no naive fixture` — absence is not an error.

Constraints:
- Naive fixtures are authored test inputs, not reference solutions; they must not appear in `GUIDED_LEVEL_REFERENCE_SOLUTIONS` or affect reference-solution tests.
- Do not author naive fixtures for every level in this packet; add at most a small representative set (2-4 levels) to prove the pipeline, and let uplift packets add more.
- A naive fixture that unexpectedly passes is evidence, not a failure of this packet — record it factually.

Edge cases:
- If the proposed folder convention conflicts with existing fixture policy or test-loading conventions, stop and report before creating the folder.

### 5. Par Extraction

Required behavior:
- Emit a single machine-readable per-level par-candidates artifact under `reports/development/guided-level-complexity-audit/` containing, per runnable level: reference turns elapsed, reference block count, and distinct action types used.
- One JSON file (preferred) or one Markdown table file — a single artifact a future stars/par packet can consume as seed data.
- Non-runnable levels appear with a `not applicable` marker so the artifact covers the full campaign roster.

Constraints:
- Values are copied from the same run that produced the behavior evidence, so they cannot drift from the per-level files.
- No par judgments, thresholds, rounding rules, or star bands — raw candidates only.
- Deterministic key order and stable formatting so diffs are reviewable.

### 6. Summary Index Extensions

Required behavior:
- Add columns to `behavior-summary-index.md`: live enemy count, movement-timeline present, trace-observed execution ratio, naive fixture present/result.
- Existing columns, column order, row anchors, and relative links must remain intact — Plans 75/76 audits cite them.

Constraints:
- Additive columns only. If any existing column must change meaning or move, that is a generated-output contract change: stop for owner approval and include a migration note before proceeding.
- Regenerate the index and all per-level files in the same run; no half-updated state.

### 7. Tests

Required tests (synthetic/authored fixtures only; no real-level golden files that would churn on level edits):
- Movement timeline renders correct rows for a synthetic run with one moving NPC and one frozen NPC, including the turn bound.
- Interaction timeline orders a synthetic collision, near-miss, and flag pickup by turn, and near-miss derivation fires at distance 1 but not distance 2.
- Trace-observed execution table and ratio are correct for a synthetic trace with one never-fired block.
- Naive fixture handling: present fixture produces a fail record with reason; absent fixture produces `no naive fixture`.
- Par-candidates artifact contains expected keys for a synthetic runnable level and `not applicable` for a synthetic non-runnable one.
- Summary index still contains all pre-existing columns and links after extension.

## Work Plan

1. Inspect Plan 73/74 generator structure, the harness, and the trace module; confirm trace data is reachable from the harness context before writing any timeline code. Summarize findings before editing.
2. Confirm the current `behavior-summary-index.md` column set and link format so extensions stay additive.
3. Implement pure helpers for each evidence section (movement timeline, interaction timeline, near-miss derivation, trace-observed execution table, naive-run record, par extraction) with synthetic-data tests.
4. Wire the helpers into the existing generation command(s), keeping Plan 74's command shape (`npm run level:behavior-evidence` or a documented sibling).
5. Define the naive-fixture folder and add the small representative fixture set.
6. Regenerate the full evidence set in one run; verify prior-audit links still resolve and existing columns are unchanged.
7. Run targeted tests, then `npm test`.
8. Write the progress report listing commands run, any instrumentation gaps discovered, and any levels where evidence could not be produced.

## Commands

Run from the repository root:

```powershell
npm run level:behavior-evidence
npm run level:dossiers
node --test --test-isolation=none tests/unit/level-behavior-evidence.test.js
npm test
```

If dossier/index rendering code is touched:

```powershell
node --test --test-isolation=none tests/unit/level-dossiers.test.js
```

## Validation Checklist

- [ ] Movement timelines exist for every level with live NPCs; frozen runners are recorded as static with tier.
- [ ] Interaction timelines are sequenced tables with turn numbers, bounded to ~15 own-turns.
- [ ] Trace-observed execution tables and ratios exist for runnable fixtures, or the packet stopped and reported trace unreachability.
- [ ] Naive-fixture convention is documented; present fixtures produce pass/fail + reason + board summary; absence is recorded cleanly.
- [ ] Par-candidates artifact exists, is machine-readable, and covers the full roster.
- [ ] `behavior-summary-index.md` gained the new columns and lost nothing: existing columns, order, and links intact.
- [ ] Prior-audit citations (Plans 75/76 paths and anchors) still resolve after regeneration.
- [ ] Full evidence set was regenerated in one run; no half-updated generated files.
- [ ] All output is deterministic and rerunnable, uses repository-relative paths, and required no browser or new dependencies.
- [ ] Synthetic-data unit tests cover each new evidence section.
- [ ] `npm test` passes.
- [ ] No guided level source, reference fixtures, or engine code were changed.
- [ ] Progress report lists commands run and instrumentation gaps.

## Stop Conditions

Stop and report if:
- Trace data is unreachable from the harness context without engine or interpreter changes.
- Timeline generation exposes nondeterminism in the harness that would require harness fixes to resolve.
- The naive-fixture folder convention conflicts with existing fixture policy or test-loading conventions.
- A generated-output contract change (column meaning, file rename, link format) would invalidate Plan 75/76 audit citations without a migration note approved by the owner.
- Near-miss or timeline evidence would require adding new runtime events.
- The work starts making rewrite, par, or curriculum recommendations instead of compiling evidence.
