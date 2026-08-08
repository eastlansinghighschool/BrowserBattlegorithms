# Plan 97 Repair Directions (Repair 01)

**Date:** 2026-08-06
**Source:** Orchestration review of the first Plan 97 implementation pass. Verdict: send back. Two hard blockers, three secondary items.
**Status of this file:** durable work order for the repair pass. The packet (`docs/development/plan-97-inversion-level-prototype.md`) and the gate rulings (`docs/decision-log.md` 2026-07-22) remain the contract.

## What the first pass got right (do not regress these)

- Board-choice inversion design is exactly the accepted shape (clear-aisle correct, barrier-ahead fails by timeout).
- Tests drive the real catalog and the real prediction state machine — no stubs, no restated config. Keep them.
- Level integration is clean: append-last ordering, optional index exports, honest contract-test updates.
- `toolboxBlockTypes: []` renders valid empty toolbox XML without crashing (verified structurally).

## Repair 1 (BLOCKER): `npm run lint:levels` must actually pass — 6 errors, honestly reported

The completion report claims "0 errors, 48 warnings." The real run shows **6 errors, 53 warnings**. A packet whose Commands list includes lint:levels shipping with a fabricated green lint result is the same class of validation falsehood this project has sent back before. Fix the errors, then report TRUE numbers.

- **1a. Concept-matrix entry (2 errors).** Add `optional-inversion-lab` to `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — a document the packet itself lists as required reading. Follow the existing row format for optional/prediction-style levels; the matrix entry should describe what the level teaches (code-to-board conditional reasoning) and what it assumes (IF/ELSE, square-ahead-blocked sensing).
- **1b. Fixture-vs-empty-toolbox collision (4 errors).** The `reference-solution-toolbox-compatibility` rule errors because the fixture's blocks can't be in an intentionally empty toolbox. Resolve honestly, in this order of preference:
  1. **Minimal documented lint exemption:** teach the rule that a level with `toolboxBlockTypes: []` is intentionally locked — fixture-to-toolbox compatibility is vacuous there. Keep it narrow (empty toolbox only, not prediction-kind broadly), comment why, and add/adjust a lint unit test for it. This preserves the fixture, which drives the simulation verification.
  2. If the rule structure makes (1) awkward, STOP and surface with options rather than deleting the fixture or hacking the rule.
- After fixes: run `npm run lint:levels` and report the true error/warning counts. Expected end state: 0 errors; 53 warnings (51 baseline + the 2 expected new ones on this level, matching the other optional labs) — if your exemption changes warning counts, say so and why.

## Repair 2 (BLOCKER): Remove `starCriteria` — the gate ruled pass-star-only

`src/config/levels/phases/optional/level-40-optional-inversion-lab.js:57` carries `starCriteria: { turnPar: 1 }` directly beneath the file's own `// ... pass-star-only.` comment (line 24). The gate ruling (decision log 2026-07-22) and the plan-113 precedent for the other three prediction checkpoints is NO `starCriteria`. `turnPar: 1` would also violate S6's generous-par rule regardless. Remove the field; keep the comment. If you believe a choice-based level should earn a par star, that contradicts the established treatment of the existing prediction checkpoints — stop and surface for owner sign-off instead of shipping it.

## Repair 3 (MINOR): Distractor-3 wording

The current label ("Either board — the ELSE branch moves when it's clear, and Stay Still handles the barrier.") still implies stay-still is an adequate answer to the barrier. Orchestrator-approved replacement: **"Either board — the ELSE branch moves when it's clear, and Stay Still also reaches the target when blocked."** A distractor should assert something the student can reject as false; "handles" sounds acceptable. Update the label and keep the rationale/explanation consistent.

## Repair 4 (MINOR): Regenerate the dossier/evidence artifacts

The campaign now has 47 levels; `reports/development/guided-level-complexity-audit/level-dossiers/` holds 46 tracked files and no 47th. Run `npm run level:dossiers` and `npm run level:behavior-evidence` and commit the new level's artifacts (the level is non-runnable, so its behavior evidence should come out as a clear not-applicable summary). If either generator produces unexpected churn beyond the new level's files (mass rewrites of existing artifacts), STOP and surface instead of committing it.

## Repair 5: Progress report honesty

Rewrite the validation section with the true lint numbers and the repairs above. "0 errors, 48 warnings" was false twice over (6 errors; 53 warnings).

## Process requirements

- Do NOT run `plan-status.js set` at any status.
- Keep the diff scoped to these repairs.
- If any repair forces a choice this file does not cover, stop and surface.

## Validation gate for the repair pass

1. `npm run lint:levels`: 0 errors, true warning count reported.
2. `npm test` passes with `prediction-inversion-level.test.js` registered (report counts).
3. `npm run build` passes.
4. `starCriteria` absent from the new level file (grep-verifiable).
5. Concept matrix has 47 rows and the lint agrees.
6. Dossier + behavior-evidence artifacts exist for the 47th level (or an explicit surfaced reason).
7. Progress report corrected per Repair 5.
