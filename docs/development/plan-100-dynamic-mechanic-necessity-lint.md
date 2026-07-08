---
id: plan-100-dynamic-mechanic-necessity-lint
title: "Dynamic Mechanic Necessity Lint"
status: complete
depends_on: [plan-86-dynamic-board-evidence-upgrade, plan-92-pre-challenge-15-living-board-pilot]
gate: "before changing the win-condition-requires-named-mechanic rule's static path, before adding a new level-metadata field beyond the one specified here"
superseded_by: null
resolution: "Orchestrator-verified 2026-07-08: four-path rule correct — static structure checked first (no static+dynamic double-report), dynamic branch requires BOTH the annotation AND a discoverable fixture, and the naive-fixture map is consulted only inside the DYNAMIC branch so a stray fixture cannot silence an unannotated level (anti-bypass edge tested and passing). Linter stays static: loadNaiveSolutionIndex is an fs existence lookup at context-build, never runs a level. On disk: enemy-nearby false positive cleared, the three legitimately-unannotated levels still warn (move-toward-flag/closest-threat/prediction-31), lint exit 0, 8 new lint tests + Plan 99 tier tests green, full suite 455/455, build clean. Degenerate program extracted to a real fixture file, now also surfaced by the Plan 86 evidence generator (naive fixture: yes (fail)) as a bonus."
summary: >-
  Teach the `win-condition-requires-named-mechanic` linter rule to recognize dynamic necessity — a mechanic made mandatory by a live enemy rather than by win-condition structure — so living-board uplift levels stop firing a permanent false-positive warning. A level may declare dynamic necessity and point at an S8 degenerate-solution fixture; the linter then treats the mechanic as required. Clears the spurious `enemy-nearby` warning surfaced by Plan 92.
---
# Plan 100: Dynamic Mechanic Necessity Lint

- Packet id: Plan 100
- Packet title: Dynamic Mechanic Necessity Lint
- Status: (see frontmatter)
- Owner/model: implementation agent with lint/tooling care
- Date: 2026-07-07
- Packet type: implementation / tooling / tests / docs
- Mutation level: source-code (lint rule + optional level metadata), tests, docs
- Approval gate: before weakening the static path of the mechanic-necessity rule; before adding any level-metadata field beyond the one specified here
- Expected artifacts:
  - an optional `mechanicNecessity` level-metadata field (`static` default | `dynamic`)
  - updated `win-condition-requires-named-mechanic` rule in `src/dev/levelLintCore.js` that accepts dynamic necessity backed by a degenerate fixture
  - the `enemy-nearby` level annotated so its spurious warning clears
  - focused lint tests for the accept / error / still-warn paths
  - progress report
- Progress report folder: `reports/development/plan-100-dynamic-mechanic-necessity-lint/`
- Progress report file: `reports/development/plan-100-dynamic-mechanic-necessity-lint/progress.md`

## Packet Summary

Goal: Close the false-positive the Plan 92 pilot exposed. The `win-condition-requires-named-mechanic` linter rule (Plan 34) checks *statically* whether a level's win condition structurally requires the mechanic the lesson claims to teach. Living-board uplift levels make a mechanic mandatory *dynamically* — a live enemy captures any solution that ignores it — which a `runner_reaches_cell` win condition cannot encode. So the rule fires a permanent warning on exactly the levels that most rigorously enforce their mechanic (proven by the charter S8 degenerate-solution test). A rule that always cries wolf trains reviewers to ignore it; this packet gives it a way to see dynamic necessity.

The fix: a level may declare `mechanicNecessity: "dynamic"` and provide a degenerate-solution fixture (the S8 naive fixture that provably fails). When both are present, the linter treats the mechanic as required and stays silent. When a level declares dynamic necessity but has no degenerate fixture, that is an **error** (a necessity claim with no proof). When neither static nor dynamic necessity holds, the existing warning stands. This makes the S8 degenerate fixture a first-class linter input rather than a test-only artifact.

Non-goals:
- Do not weaken the static path. Levels whose win condition structurally requires the mechanic must still pass exactly as today; do not make `mechanicNecessity` a blanket escape hatch.
- Do not make the linter run levels. The linter is static: it verifies the fixture *exists* and the annotation is present. Proof that the fixture actually *fails* stays in the unit test layer (the Plan 92 degenerate test pattern).
- Do not add level-metadata fields beyond the single `mechanicNecessity` field.
- Do not retune, relocate, or re-tier any guided level. `enemy-nearby` gets an annotation only, no behavior change.
- Do not touch the `turn-limit-floor` rule or any other lint rule.
- Do not add a dependency or change build/deploy behavior.

Depends on:
- Plan 86 — defined the naive/degenerate fixture folder convention (`tests/unit/fixtures/guided-naive-solutions/<level-id>.xml`). Confirm the exact path and whether `enemy-nearby` already has a fixture file or the degenerate program is currently inline in `tests/unit/guided-reference-solutions.test.js`; reconcile so the linter has a discoverable artifact.
- Plan 92 — introduced the first living-board uplift (`enemy-nearby`) and the S8 degenerate test; that level is this packet's real-data test case.

Blocks:
- Plan 93 (Pre-Challenge-22 Living Resource Uplift). Plan 93 will produce several more living-board uplift levels; without this rule fix each one ships a spurious mechanic-necessity warning. Land this first so Plan 93's `lint:levels` output stays trustworthy. Recommend adding `plan-100` to Plan 93's `depends_on`.

Why this exists:
Surfaced by the Plan 92 orchestration review: `enemy-nearby win-condition-requires-named-mechanic: mechanic appears only in prose` fired even though the Guard makes the distance sensor strictly necessary (the S8 degenerate solution is captured and fails). The warning is a false positive that will recur on every living-board uplift. The linter must learn the difference between "the lesson's mechanic is not required" and "the lesson's mechanic is required dynamically, by a live enemy."

## Authority And Contracts

Required project contracts:
- `docs/development/plan-85-campaign-rewrite-charter.md` — S8 (degenerate-solution standard) is the necessity proof this rule keys off.
- `src/dev/levelLintCore.js` — home of the lint rules (the Plan 99 work confirmed rules live here, not `scripts/lint-levels.js`).
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — the concept-matrix entry the rule cross-references.
- `docs/packet-creation-guidance.md` — records the S8 standard; update it to note the linter hook.
- `tests/unit/level-lint.test.js` — where lint-rule tests live.
- `tests/unit/guided-reference-solutions.test.js` — where the Plan 92 degenerate test lives.

Do not redefine:
- The static necessity check remains the primary, preferred proof. Dynamic necessity is an *additional* accepted proof, not a replacement.
- Guided levels still teach one primary concept at a time.
- The S8 standard: a degenerate/naive solution must provably fail. This packet does not relax that; it wires it into the linter.

## Required Reading

Read before editing:
- This packet end-to-end.
- `src/dev/levelLintCore.js` — the `win-condition-requires-named-mechanic` rule (and how `makeDiagnostic` / severities / the rule aggregator work).
- `docs/development/plan-86-dynamic-board-evidence-upgrade.md` — the naive-fixture folder convention.
- `reports/development/plan-92-pre-challenge-15-living-board-pilot/progress.md` — the S8 degenerate argument for `enemy-nearby`.
- `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js` — the annotation target.
- `tests/unit/guided-reference-solutions.test.js` — the existing degenerate test.
- `tests/unit/level-lint.test.js` — lint test patterns.

Use `rg` for:
- `win-condition-requires-named-mechanic`
- `mechanicNecessity`
- `guided-naive-solutions`
- `boardDynamicsTier` (the precedent optional-metadata field, for shape parity)

## Scope

### In Scope

- Add an optional `mechanicNecessity` level field, closed vocabulary `static` (default when absent) | `dynamic`.
- Update the `win-condition-requires-named-mechanic` rule:
  - static requirement satisfied → clean (unchanged).
  - `mechanicNecessity: "dynamic"` AND a degenerate fixture exists for the level → clean.
  - `mechanicNecessity: "dynamic"` AND no degenerate fixture exists → **error** (necessity claimed without proof).
  - neither static nor dynamic → existing **warning** (unchanged).
- Annotate `enemy-nearby` with `mechanicNecessity: "dynamic"` and confirm its warning clears.
- Reconcile the degenerate-fixture artifact so the linter can discover it (fixture file under the Plan 86 folder, matching the Plan 92 degenerate test).
- Add focused lint tests for all four rule paths.
- Update `docs/packet-creation-guidance.md` (S8 now has a linter hook) and any note in `levelLintCore.js`.

### Out Of Scope

- Level behavior, tier, geometry, or copy changes (annotation only for `enemy-nearby`).
- Other lint rules, including `turn-limit-floor`.
- Running levels inside the linter.
- New metadata fields beyond `mechanicNecessity`.

### Files And Areas Likely Touched

- `src/dev/levelLintCore.js`
- `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js` (annotation only)
- possibly `tests/unit/fixtures/guided-naive-solutions/enemy-nearby.xml` (if the degenerate program is currently inline and needs a discoverable fixture)
- `tests/unit/level-lint.test.js`
- `docs/packet-creation-guidance.md`
- `reports/development/plan-100-dynamic-mechanic-necessity-lint/progress.md`

## Implementation Requirements

### 1. `mechanicNecessity` Field

Required behavior:
- Optional top-level level field; closed vocabulary `static` | `dynamic`. Absent means `static` (current behavior).
- Invalid value → lint error, consistent with how `boardDynamicsTier` handles an invalid enum value.

Constraints:
- Mirror the `boardDynamicsTier` field shape and validation for consistency.
- Do not force the field onto any level; it is opt-in for dynamic-necessity levels only.

### 2. Rule Update

Required behavior — the four paths above. The dynamic-necessity branch is satisfied only when BOTH the annotation is `dynamic` AND a degenerate fixture is discoverable for the level. A `dynamic` claim without a fixture is an error, so the annotation cannot be used to silently bypass the check.

Constraints:
- Keep the static path untouched — do not let `mechanicNecessity` short-circuit a level that should have satisfied the static check.
- The fixture-existence check is a filesystem/registry lookup, not a level run.
- Diagnostic messages must name which path was taken so a reviewer can tell "silenced by dynamic proof" from "silenced by static structure."

Edge cases:
- Level annotated `dynamic` but its win condition *also* structurally requires the mechanic: clean (either proof suffices); do not double-report.
- Degenerate fixture exists but the level is not annotated: the fixture alone does not silence the warning — the level must explicitly declare dynamic necessity. (Prevents an unrelated fixture from accidentally satisfying the rule.)

### 3. Annotate `enemy-nearby`

Required behavior:
- Add `mechanicNecessity: "dynamic"` to `level-13-enemy-nearby.js`. No other change.
- Ensure a degenerate fixture is discoverable for it (reconcile with the Plan 92 degenerate test — if that test uses an inline program, extract it to the Plan 86 fixture folder so both the test and the linter reference one artifact; keep the test green).
- Confirm `npm run lint:levels` no longer warns on `enemy-nearby` for this rule, and the deliberate-error path (annotate `dynamic`, remove the fixture, expect error, restore) is exercised.

### 4. Tests

Required (in `tests/unit/level-lint.test.js`, synthetic fixtures):
- static requirement satisfied → no diagnostic.
- `dynamic` + fixture present → no diagnostic.
- `dynamic` + fixture absent → error.
- neither → warning (existing behavior preserved).
- invalid `mechanicNecessity` value → error.

## Work Plan

1. Read the rule and the naive-fixture convention; determine whether `enemy-nearby`'s degenerate program is a fixture file or inline in the test. Summarize before editing.
2. Add the `mechanicNecessity` field + validation (mirror `boardDynamicsTier`).
3. Update the rule with the four-path logic and path-naming in diagnostics.
4. Reconcile the `enemy-nearby` degenerate fixture so it is discoverable; annotate the level.
5. Add lint tests for all paths.
6. Run `npm run lint:levels`, `npm test`, `npm run build`; confirm the `enemy-nearby` warning is gone and no other level changed status.
7. Update `docs/packet-creation-guidance.md` (S8 → linter hook). Write the progress report, noting the fixture reconciliation decision.

## Commands

```powershell
node --test --test-isolation=none tests/unit/level-lint.test.js tests/unit/guided-reference-solutions.test.js
npm run lint:levels
npm test
npm run build
```

## Validation Checklist

- [ ] `mechanicNecessity` accepts `static`/`dynamic`, rejects other values, and is optional (absent → static).
- [ ] `dynamic` + degenerate fixture present → rule clean; `dynamic` + no fixture → error; neither → existing warning; static structural requirement → clean.
- [ ] `enemy-nearby` annotated `dynamic`; its `win-condition-requires-named-mechanic` warning no longer fires; degenerate fixture is discoverable and the Plan 92 degenerate test still passes.
- [ ] Static path unchanged: no level that previously passed the rule now warns, and no level that previously warned is silenced except `enemy-nearby`.
- [ ] Lint tests cover all four paths plus the invalid-value case.
- [ ] `npm run lint:levels`, `npm test`, `npm run build` pass.
- [ ] `docs/packet-creation-guidance.md` records the S8 linter hook.
- [ ] No guided level behavior, tier, geometry, or copy changed (annotation only).
- [ ] Progress report records the fixture-reconciliation decision and any level whose lint status changed.

## Stop Conditions

- The naive-fixture convention turns out not to give the linter a discoverable artifact without running levels → stop, surface; do not make the linter execute levels.
- Satisfying the rule dynamically would require weakening the static path → stop; the static path is primary.
- Annotating `enemy-nearby` changes any behavior beyond clearing the warning → stop; this packet is annotation-only for that level.
- The change would silence a genuinely-under-specified level (mechanic neither statically nor dynamically required) → stop; that warning is correct and must stay.
