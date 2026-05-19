# Plan 53: Above/Below Sensor Curriculum Audit

## Packet Metadata

- Packet id: plan-53
- Packet title: Above/Below Sensor Curriculum Audit
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: curriculum / level-authoring / data / docs
- Mutation level: source-code (level data + linter) / tests / docs
- Approval gate: before changing any sensor-relation engine logic, adding new sensor relation enum values, changing reference solutions, or extending vertical-relation pairing to runner-index or distance-based sensors
- Expected artifacts:
  - guided-level `sensorRelationTypes` allowlists extended to include `DIRECTLY_ABOVE`/`DIRECTLY_BELOW`/`ANYWHERE_ABOVE`/`ANYWHERE_BELOW` everywhere their horizontal pair is already exposed
  - Free Play default toolbox surfaces all eight directional relations
  - linter contract `sensor-relation-policy` extended to pair vertical relations the same way it pairs horizontal ones
  - light vocabulary touch-ups in the concept matrix and Student/Teacher guides where vertical relations are now part of the toolbox
  - progress report listing which levels were touched and why
- Progress report folder: `reports/development/plan-53-above-below-sensor-curriculum-audit/`
- Progress report file: `reports/development/plan-53-above-below-sensor-curriculum-audit/progress.md`

## Packet Summary

Goal: Surface the existing `DIRECTLY_ABOVE`, `DIRECTLY_BELOW`, `ANYWHERE_ABOVE`, and `ANYWHERE_BELOW` sensor relations in every guided level (and Free Play) where the horizontal analog (`DIRECTLY_IN_FRONT`, `DIRECTLY_BEHIND`, `ANYWHERE_FORWARD`, `ANYWHERE_BEHIND`) is already exposed. Engine support already exists — this packet is a **curriculum audit**, not a feature build.

The four vertical relations are wired through every required surface: enum entries in `src/config/constants.js`, dropdown labels in `src/ai/blockly/blocks.js`, evaluation logic in `src/core/conditions.js`. Five guided levels already use them (levels 8, 9, 15, 22, 28). The remaining levels that expose `DIRECTLY_IN_FRONT`/`DIRECTLY_BEHIND` but not their vertical pair represent the audit gap — students reach a level expecting a complete cardinal-direction toolkit and find half of it missing from the dropdown.

Vertical relations are **team-neutral** (no `playDirection` flip). [conditions.js:108-119](src/core/conditions.js:108) evaluates them on raw `deltaY`, which is the correct semantic — the board's vertical axis is not mirrored when team play directions flip horizontally.

Non-goals:

- Do not change the engine's sensing logic. It is already correct.
- Do not add new sensor relation enum values. All required values already exist.
- Do not rewrite reference solutions. Existing solutions continue to use whichever relations they already chose; opening up new options does not require students to use them.
- Do not change lesson copy or tutorial steps. Lesson copy teaches the concept of "sensing things around you," not the specific dropdown enumeration. New options become available silently and progressively as students notice them.
- Do not extend the vertical relations to any new pedagogical introduction level. Existing levels gain the options; no new level is authored.
- Do not introduce vertical analogs for any other sensor primitive in this packet (no vertical distance variants, no vertical runner-index variants). Out of scope.
- Do not change the `WITHIN_N` family. Those are distance-based, not directional.
- Do not deploy.

Depends on:

- Existing sensor relation engine (already complete).
- Existing `sensor-relation-policy` linter contract in `scripts/lint-levels.js`.

Blocks:

- Cleaner vertical-pressure strategy scenarios for any future level (challenge revisions, bug hunts, predictions) that wants to invite vertical thinking.

Why this packet exists:

The engine ships with eight directional sensor relations. Students who reach levels 8 or 15 see all eight in the dropdown. Students at levels 6, 7, 16, 18, 21, 23-27, and several others see only four — the horizontal half. There's no engineering reason for the asymmetry, only an authoring oversight. Closing it costs almost nothing and gives students a more consistent mental model: every relation that exists for the horizontal axis also exists for the vertical axis.

Auditing also surfaces a small linter-contract symmetry gap: the `sensor-relation-policy` contract at [lint-levels.js:26](scripts/lint-levels.js:26) currently only pairs `DIRECTLY_IN_FRONT`/`DIRECTLY_BEHIND`. If vertical relations should pair the same way (and they should, for the same reason), the contract needs extending.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-18):

### Decision 1: Pairing rule — vertical relations pair the same way horizontal ones do

Any level whose `sensorRelationTypes` allowlist contains `DIRECTLY_IN_FRONT` and `DIRECTLY_BEHIND` (as a pair) must also contain `DIRECTLY_ABOVE` and `DIRECTLY_BELOW`. Same for the `ANYWHERE_*` family: `ANYWHERE_FORWARD`/`ANYWHERE_BEHIND` paired requires `ANYWHERE_ABOVE`/`ANYWHERE_BELOW`.

Rationale: pedagogical symmetry. Students who can ask "directly in front" and "directly behind" should be able to ask "directly above" and "directly below" in the same dropdown. The cardinal directions form a natural set.

### Decision 2: Linter contract — extend `DIRECTED_SENSOR_RELATIONS` and the pairing rule

The `DIRECTED_SENSOR_RELATIONS` set at [lint-levels.js:26](scripts/lint-levels.js:26) currently contains only `DIRECTLY_IN_FRONT` and `DIRECTLY_BEHIND`. Extend to include `DIRECTLY_ABOVE` and `DIRECTLY_BELOW`. Add a sibling `DIRECTED_VERTICAL_RELATIONS` set (or equivalent) for the above/below pair, and check pairing as "if any vertical directed relation is present, both must be present" — mirroring the existing front/behind check.

Optionally extend the same pattern to the `ANYWHERE_*` family if the existing contract does not already enforce horizontal pairing there. The implementer should read the current contract end-to-end and apply the same symmetry consistently.

### Decision 3: Free Play default toolbox — all eight directional relations available

Free Play's default toolbox configuration must surface all eight directional relations (`DIRECTLY_*` × 4, `ANYWHERE_*` × 4). If today's free play configuration omits any of them, this packet adds them.

Rationale: Free Play is the open-ended experimentation environment. Students who have finished guided campaign should have the full toolkit by default.

### Decision 4: No lesson copy or tutorial step changes

Lesson copy and tutorial overlays teach the concept, not the enumeration. New options appear in the dropdown silently. A student who notices them and tries them learns by experimentation; a student who doesn't notice them continues using the relations the lesson taught. Both outcomes are acceptable.

The concept matrix gets a small touch-up where horizontal relations are first introduced, noting that the vertical analogs exist with identical semantics on the vertical axis. Implementer's call on whether this is a one-line edit or a full row addition.

### Decision 5: No reference solution changes

Reference solutions are recipes for passing each level. They use whichever relations the author chose. Opening up new options does not require recipes to change. Existing reference solution fixtures and tests continue to pass unchanged.

If the implementer notices a reference solution that would be cleaner with a vertical relation, they may **note it in the progress report** as a future authoring opportunity but must not change the solution in this packet.

### Decision 6: No new levels, no new content

This packet does not author new levels, bug hunts, prediction levels, or examples that specifically teach vertical relations. The point is to remove the asymmetry; teaching vertical thinking as a featured lesson is a separate curriculum decision for a future packet if classroom feedback warrants.

## Authority And Contracts

Sources of truth:

- `src/config/constants.js` lines 77-91 — `SENSOR_RELATION_TYPES` enum (read-only here; all values exist)
- `src/core/conditions.js` lines 98-124 — sensor evaluation (read-only here; logic is correct)
- `src/ai/blockly/blocks.js` — dropdown labels (read-only here; all labels exist)
- `src/config/levels/phases/**/*.js` — level definitions with `sensorRelationTypes` allowlists (this is what gets edited)
- `src/config/levels/shared/toolboxes.js` — Free Play default toolbox (likely edited)
- `scripts/lint-levels.js` — linter contracts (extended)
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — concept matrix (light touch)
- `docs/subsystems/blockly-workspace.md` — post-Plan-51 home for Blockly catalog content (light touch if any)
- `docs/StudentGuide.md` and `docs/TeacherGuide.md` — vocabulary mentions (light touch if any)

Required product contracts:

- Every level that currently exposes `DIRECTLY_IN_FRONT` and `DIRECTLY_BEHIND` together also exposes `DIRECTLY_ABOVE` and `DIRECTLY_BELOW` after this packet.
- Same for the `ANYWHERE_*` family.
- Free Play default toolbox surfaces all eight directional relations.
- The extended linter contract passes on the updated level set with no new errors (warnings allowed, documented in the progress report).
- Reference solution fixtures and tests pass unchanged.
- No engine logic changes.
- The app remains a static Vite deployment.

Do not redefine:

- The semantic of vertical relations (team-neutral; raw deltaY-based).
- The `WITHIN_N` family or any other non-directional relation.
- Reference solutions for any guided level.
- Lesson copy, tutorial steps, or hint text in any level.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/subsystems/blockly-workspace.md` — post-Plan-51 home for Blockly catalog content
- `src/config/constants.js` — confirm `SENSOR_RELATION_TYPES` shape
- `src/core/conditions.js` — confirm vertical evaluation semantics
- `src/ai/blockly/blocks.js` — confirm dropdown labels exist
- `scripts/lint-levels.js` — read the existing `sensor-relation-policy` contract end-to-end before extending
- A representative sampling of `src/config/levels/phases/**/*.js` files — see which already expose vertical relations (levels 8, 9, 15, 22, 28 per `rg`) vs. which expose horizontal-only
- `tests/unit/level-lint.test.js` — fixture pattern for new lint cases

Use `rg "sensorRelationTypes\b" src/config/levels` from the repository root to enumerate every level that declares the allowlist; cross-reference horizontal vs. vertical presence per file.

## Scope

### In scope

- Audit every guided level under `src/config/levels/phases/**/*.js`. For each level whose `sensorRelationTypes` declares `DIRECTLY_IN_FRONT` and `DIRECTLY_BEHIND`, add `DIRECTLY_ABOVE` and `DIRECTLY_BELOW`. Same for the `ANYWHERE_*` family.
- Update Free Play default toolbox (likely in `src/config/levels/shared/toolboxes.js` — implementer confirms exact location) to surface all eight directional relations.
- Extend the `sensor-relation-policy` linter contract in `scripts/lint-levels.js` to pair vertical relations.
- Add a passing-case and failing-case fixture to `tests/unit/level-lint.test.js` for the extended contract.
- Light vocabulary touch-up in `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` (implementer's judgment — one row note or a small section addition).
- Mention in `docs/StudentGuide.md` and `docs/TeacherGuide.md` only if those docs currently enumerate sensor relations and would otherwise be incomplete.
- Mention in `docs/subsystems/blockly-workspace.md` if the post-Plan-51 catalog section enumerates relations and would otherwise be inconsistent.
- Progress report listing every file edited with a one-line reason per file.

### Files and areas likely touched

- `src/config/levels/phases/sensing/*.js` (several files)
- `src/config/levels/phases/resources-and-territory/*.js`
- `src/config/levels/phases/movement-helpers/*.js`
- `src/config/levels/phases/advanced-logic/*.js`
- `src/config/levels/phases/advanced-teamplay/*.js`
- `src/config/levels/shared/toolboxes.js`
- `scripts/lint-levels.js`
- `tests/unit/level-lint.test.js`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/subsystems/blockly-workspace.md`
- Possibly `docs/StudentGuide.md`, `docs/TeacherGuide.md`
- `reports/development/plan-53-above-below-sensor-curriculum-audit/progress.md`

### Out of scope

- Any engine logic change in `src/core/conditions.js` or elsewhere.
- New SENSOR_RELATION_TYPES enum values.
- New Blockly blocks.
- Reference solution XML updates.
- Lesson copy or tutorial step rewrites.
- New levels, bug hunts, or prediction levels.
- Distance-based vertical sensor variants.
- Game rule changes.
- Plan 38 coaching prose updates.
- Deployment.

## Work Plan

1. Read the required references. Run `rg "DIRECTLY_IN_FRONT\|DIRECTLY_BEHIND\|ANYWHERE_FORWARD\|ANYWHERE_BEHIND\|DIRECTLY_ABOVE\|DIRECTLY_BELOW\|ANYWHERE_ABOVE\|ANYWHERE_BELOW" src/config/levels` to build the per-level map.
2. For each level that has horizontal relations but missing their vertical pair, add the missing pair to the `sensorRelationTypes` array.
3. Audit Free Play default toolbox configuration. Add any missing directional relations.
4. Extend the `sensor-relation-policy` contract in `lint-levels.js`. Add new lint test fixtures.
5. Run `npm run lint:levels`. Confirm no new errors (only the pre-existing warnings already present in the baseline). The extended contract may surface new warnings for any level that now requires vertical pairing — those should already have been fixed in step 2.
6. Update `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` with a light note (implementer's judgment on placement).
7. Sweep `docs/subsystems/blockly-workspace.md`, `docs/StudentGuide.md`, and `docs/TeacherGuide.md` for any enumeration of sensor relations. Update if found.
8. Run `npm test`, `npm run test:browser`, `npm run build`. Confirm clean.
9. Write the progress report.

## Implementation Requirements

### Requirement 1: Per-level audit and pairing

Required behavior:

- For every guided level whose `sensorRelationTypes` array includes both `DIRECTLY_IN_FRONT` and `DIRECTLY_BEHIND`, add `DIRECTLY_ABOVE` and `DIRECTLY_BELOW` to the same array.
- For every guided level whose array includes both `ANYWHERE_FORWARD` and `ANYWHERE_BEHIND`, add `ANYWHERE_ABOVE` and `ANYWHERE_BELOW`.
- If a level includes only one half of a horizontal pair (e.g., `DIRECTLY_IN_FRONT` without `DIRECTLY_BEHIND`), that is a pre-existing inconsistency — note in the progress report but do not fix in this packet (the existing linter contract should have caught it; if it didn't, that's a separate finding).
- The implementer maintains a per-level checklist of "audited / not touched / touched with both pair members added" entries in the progress report.

Constraints:

- Do not add vertical relations to a level whose `sensorRelationTypes` does not already include the horizontal analog.
- Do not remove any existing relation.
- Do not reorder the array (preserve authorship order for diff clarity).

### Requirement 2: Free Play default toolbox

Required behavior:

- Free Play's default sensor relation set surfaces all eight directional relations: `DIRECTLY_IN_FRONT`, `DIRECTLY_BEHIND`, `DIRECTLY_ABOVE`, `DIRECTLY_BELOW`, `ANYWHERE_FORWARD`, `ANYWHERE_BEHIND`, `ANYWHERE_ABOVE`, `ANYWHERE_BELOW`.
- The exact location of the Free Play default depends on the codebase layout. Use `rg "FREE_PLAY|freePlay" src/config/levels/shared/` to locate. The implementer documents the file edited in the progress report.

Constraints:

- Do not change Free Play's `WITHIN_*` family availability.
- Do not change Free Play's `SENSOR_OBJECT_TYPES` availability.
- Do not change any other Free Play default beyond the directional relation set.

### Requirement 3: Linter contract extension

Required behavior:

- The `DIRECTED_SENSOR_RELATIONS` set at [lint-levels.js:26](scripts/lint-levels.js:26) is extended to include `DIRECTLY_ABOVE` and `DIRECTLY_BELOW`, OR a sibling `DIRECTED_VERTICAL_RELATIONS` set is introduced (implementer's call on data shape).
- The `sensor-relation-policy` contract enforces that if any vertical directed relation is present in a level's `sensorRelationTypes`, both `DIRECTLY_ABOVE` and `DIRECTLY_BELOW` are present.
- The same symmetry is enforced for the `ANYWHERE_*` family if the existing contract already enforces horizontal pairing there. If not, extend symmetrically.
- New passing-case and failing-case fixtures are added to `tests/unit/level-lint.test.js`.

Constraints:

- Do not weaken the existing horizontal-pairing rule.
- The contract message wording should be analogous to the existing rule's wording.

### Requirement 4: Documentation touch-ups

Required behavior:

- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — add a one-line note (or short section, implementer's judgment) near the first row that introduces directional sensing, indicating that vertical analogs (`DIRECTLY_ABOVE`, `DIRECTLY_BELOW`, etc.) exist with team-neutral semantics on the vertical axis.
- `docs/subsystems/blockly-workspace.md` — if the catalog section enumerates sensor relations explicitly, ensure all eight directional relations are listed. If it abstracts ("the four horizontal and four vertical directional relations"), no edit needed.
- `docs/StudentGuide.md` and `docs/TeacherGuide.md` — only edit if these docs currently enumerate sensor relations and would otherwise become incomplete.

Constraints:

- Do not write new conceptual lessons about vertical sensing in these docs.
- Do not add tutorial steps to any level.

### Requirement 5: Progress report contents

Required behavior:

- The progress report lists every guided level file touched, with a one-line reason per file (e.g., "added DIRECTLY_ABOVE/DIRECTLY_BELOW to pair with existing DIRECTLY_IN_FRONT/DIRECTLY_BEHIND").
- The progress report lists every level audited but NOT touched, with a one-line reason (e.g., "no horizontal directed relations exposed; no vertical pair needed").
- The progress report notes any pre-existing inconsistencies discovered (e.g., a level with one half of a horizontal pair) without fixing them.
- The progress report notes any reference solution that the implementer thinks would benefit from a vertical relation in a future authoring pass, without making the change.

Constraints:

- The list should be exhaustive across `src/config/levels/phases/**/*.js`.

## Commands

Run from the repository root:

```powershell
rg "sensorRelationTypes" src/config/levels --files-with-matches
npm run lint:levels
node --test --test-isolation=none tests/unit/level-lint.test.js
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js
node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js
node --test --test-isolation=none tests/unit/guided-project-solutions.test.js
npm test
npm run test:browser
npm run build
```

## Validation Checklist

- [ ] Every guided level with both `DIRECTLY_IN_FRONT` and `DIRECTLY_BEHIND` now also has both `DIRECTLY_ABOVE` and `DIRECTLY_BELOW`.
- [ ] Every guided level with both `ANYWHERE_FORWARD` and `ANYWHERE_BEHIND` now also has both `ANYWHERE_ABOVE` and `ANYWHERE_BELOW`.
- [ ] Free Play default toolbox surfaces all eight directional relations.
- [ ] `DIRECTED_SENSOR_RELATIONS` (or new sibling set) covers the vertical pair.
- [ ] `sensor-relation-policy` contract enforces vertical pairing.
- [ ] New passing-case and failing-case fixtures in `tests/unit/level-lint.test.js` for the extended contract.
- [ ] `npm run lint:levels` produces no new errors compared to baseline (baseline warnings allowed and documented).
- [ ] `npm test` passes.
- [ ] `npm run test:browser` passes.
- [ ] `npm run build` passes.
- [ ] Reference solution tests pass unchanged.
- [ ] `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` has a light note about vertical analogs.
- [ ] No engine logic was changed.
- [ ] No reference solutions were changed.
- [ ] No new levels, lessons, or tutorial steps were authored.
- [ ] Progress report lists every level audited with status (touched / not touched / pre-existing inconsistency).

## Stop Conditions

Stop and report for owner review if:

- An audited level reveals a pre-existing inconsistency the existing linter should have caught (e.g., one half of a horizontal pair without the other). Surface; do not fix in this packet.
- The Free Play default toolbox location is unclear or shared with a pattern that would cascade unintended changes. Surface before mutating.
- The extended linter contract surfaces warnings that look like legitimate authoring choices (e.g., a level that intentionally exposes only vertical relations without horizontal). Surface for owner judgment.
- A reference solution test fails after the audit (it should not — solutions don't depend on relations they don't use). If it does, the cause is unexpected and needs investigation.
- Any change beyond the documented scope appears required.

## Notes For Future Self

- **Vertical-relation pedagogy as a featured lesson.** This packet opens the dropdown but doesn't teach vertical thinking explicitly. If classroom evidence shows students stick to horizontal relations even when vertical would help, a future packet could author a small lesson level (or a bug hunt) that puts a vertical-threat scenario front and center.
- **Distance-based vertical variants.** No vertical analog of the `WITHIN_N` family exists, by design — `WITHIN_N` is omnidirectional (Manhattan distance). If a future packet wants directional distance (e.g., "anywhere above within 3"), that's a new enum-extension packet.
- **Runner-index vertical variants** are similarly out of scope. Runner-index roles are independent of board geometry.
- **The `sensor-relation-policy` contract** is now richer. If a future packet adds more directional relations (e.g., diagonals), follow the same pairing pattern: define the directed set, enforce pair completeness via the linter.
