# Plan 74 Progress Report: Guided Reference Behavior Evidence

- Packet: Plan 74
- Date completed: 2026-05-21
- Implementer: Codex agent (implementation) + Claude Sonnet 4.6 (final checks, report)

## Summary

Plan 74 is complete. All implementation work was done by the Codex implementer thread before a connection interruption; a Claude follow-up verified the final state, ran validation, wrote this report, and completed a repair pass for `full-team-tactics` human-input project classification.

## Commands Run and Results

| Command | Result |
| --- | --- |
| `npm run level:behavior-evidence` | Generated 46 per-level behavior-evidence files + `behavior-summary-index.md` (run by Codex thread) |
| `node --test --test-isolation=none tests/unit/level-behavior-evidence.test.js` | 7/7 pass after repair |
| `npm test` | 400/400 pass after repair |
| `npm run build` | Pass; same pre-existing chunk-size and dynamic/static import warnings as Plan 66 baseline |

## Artifacts Produced

### Source Files Created or Edited

| File | Change |
| --- | --- |
| `src/dev/levelBehaviorEvidence.js` | New — evidence data model, simulation harness, Markdown renderers, and `generateGuidedLevelBehaviorEvidence()` export |
| `src/dev/levelDossiers.js` | Edited — exported `GUIDED_LEVEL_DOSSIER_OUTPUT_DIR` so behavior module can share the audit folder root |
| `scripts/level-behavior-evidence.js` | New — CLI entry point for `npm run level:behavior-evidence` |
| `package.json` | Edited — added `level:behavior-evidence` script |
| `tests/unit/level-behavior-evidence.test.js` | New — 7 focused unit tests covering all required evidence categories, including `full-team-tactics` not-applicable classification |
| `tests/unit/level-dossiers.test.js` | Edited — minor adjustments to stay compatible with the shared export |

### Generated Report Artifacts (not committed)

- `reports/development/guided-level-complexity-audit/behavior-evidence/` — 46 per-level Markdown files
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md` — summary table with links to dossiers and evidence files

### Documentation Updates

- `docs/development/README.md` — Plan 74 status changed from `ready` to `complete`; validation baseline updated to note the new command and test additions

## Evidence Coverage Summary

| Category | Count |
| --- | --- |
| Total levels covered | 46 |
| Ordinary levels — one-off reference, pass | 27 |
| Bug-hunt levels — one-off reference, pass | 4 |
| Challenge / synthesis — one-off reference, pass | 3 |
| Optional lab — one-off reference, pass | 1 |
| Project levels — documented exception (expected per policy) | 9 |
| Project levels — pass | 2 |
| Not-applicable — prediction checkpoint | 3 |
| Not-applicable — human-input level | 2 |
| Not-applicable — optional lab requiring human control | 1 |
| Not-applicable — project capstone with live human input | 1 (`full-team-tactics` — Challenge 28) |

## Notable Observations (Factual, Not Curriculum Recommendations)

- **`full-team-tactics` (Challenge 28)** is classified as not-applicable because it is a project capstone with live human input. Project fixtures exist, but runtime behavior evidence requires student-driven play.
- **Enemy/NPC acted** (`live enemy acted: yes`) in 10 of 40 runnable entries, including the synthesis challenges and multi-ally project levels.
- **Branch/trace evidence present** in all runnable levels that produced any ally actions.
- **`relay-race` and `optional-double-carrier-showdown`** are not-applicable because they require live human runner input; the simulation harness cannot substitute for that.
- **Prediction checkpoints** (3 levels) are not-applicable by design; they require a prediction choice before play begins.
- **`score.blocked` events** were not observed in any reference run. This is consistent with the own-flag-home rule (Plan 67): reference solutions do not produce scenarios where the own flag is stolen before the carrier scores.

## Instrumentation Gaps

- The simulation does not capture block-level execution trace for NPC/CPU runners (only blockly-sourced ally runners produce `lastBlocklyTrace`). Enemy trace summaries in per-level files correctly report "trace data not available" for NPC turns.
- The harness reads `lastTurnEventLog` which is set only when the engine advances a full turn step. Levels that halt mid-turn (e.g., `WAIT_FOR_INPUT`) produce no event log entries, confirming the not-applicable classification.
- `ignored/extra-action evidence` relies on `ignoredActionBlockIds` in `lastBlocklyTrace`; this is only populated when an ally runner has unreachable action blocks below a selected action. No examples were observed in the generated evidence, which is consistent with the authored reference solutions being well-formed.

## Approval Gates Honored

- No guided level source files were changed.
- No reference fixtures were changed.
- No runtime events were added or modified.
- No curriculum recommendations were made.
- All generated files are in `reports/development/guided-level-complexity-audit/` — the designated output directory for Plans 73/74/75.

## Remaining Risks and Follow-Ups

- Plan 75 (complexity audit) depends on both the Plan 73 dossiers and the Plan 74 behavior-evidence files. Both are now generated and stable.
- `full-team-tactics` has no generated runtime behavior evidence because the level waits for live human input; Plan 75 should treat that as an instrumentation boundary, not a fixture defect or gameplay failure.
- The validation baseline in `docs/development/README.md` records the post-repair `npm test` result: 400/400 pass.

---

## Repair Pass — 2026-05-21 (Claude Sonnet 4.6)

**Issue found by integration owner:** `full-team-tactics` (Challenge 28) was classified as `fail` in the generated evidence because `getRunnableDescriptors()` dispatched project levels to the fixture simulator before checking `humanTurnBehavior`. `full-team-tactics` has `WAIT_FOR_INPUT`, so the simulator could not advance its turns, producing a spurious `fail / IN_PROGRESS` result with zero reference actions.

**Fix applied:**
- `src/dev/levelBehaviorEvidence.js`: moved the `humanTurnBehavior === WAIT_FOR_INPUT` guard before the project-level dispatch in `getRunnableDescriptors()`. Also updated `getNotApplicableReason()` to emit a specific message for the project + WAIT_FOR_INPUT case: *"project capstone with live human input — project fixtures exist but runtime behavior evidence requires student-driven play"*.
- `tests/unit/level-behavior-evidence.test.js`: added a 7th test asserting that `full-team-tactics` is classified as not-applicable with a `project capstone` reason and zero runs.
- Artifacts regenerated with `npm run level:behavior-evidence`.
- `docs/development/plan-74-guided-reference-behavior-evidence.md`: `Status: ready` → `Status: complete`.

**Levels affected by the code change:** only `full-team-tactics` (the only project level with `WAIT_FOR_INPUT`). `advanced-scrimmage` (project + `AUTO_SKIP`) is unchanged — still classified and run via project fixtures.

**Validation after repair:**

| Command | Result |
| --- | --- |
| `node --test --test-isolation=none tests/unit/level-behavior-evidence.test.js` | 7/7 pass, ~2.1s |
| `npm run level:behavior-evidence` | 46 files regenerated; `33-full-team-tactics.md` now shows `not run / not applicable` |
| `npm test` | 400/400 pass |
| `npm run build` | Pass; same pre-existing warnings |

## Updated Evidence Coverage Summary (after repair)

| Category | Count |
| --- | --- |
| Total levels covered | 46 |
| Ordinary levels — one-off reference, pass | 27 |
| Bug-hunt levels — one-off reference, pass | 4 |
| Challenge / synthesis — one-off reference, pass | 3 |
| Optional lab — one-off reference, pass | 1 |
| Project levels — documented exception (expected per policy) | 9 |
| Project levels — pass | 2 |
| Not-applicable — prediction checkpoint | 3 |
| Not-applicable — human-input level (ordinary) | 2 |
| Not-applicable — optional lab requiring human control | 1 |
| Not-applicable — project capstone with WAIT_FOR_INPUT | 1 (`full-team-tactics`) |

## Ready for Integration

Yes. Repair complete. `full-team-tactics` is correctly classified as not-applicable. `npm test` 400/400, `npm run build` pass, no guided level source or fixture files changed.
