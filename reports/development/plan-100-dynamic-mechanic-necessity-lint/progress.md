# Plan 100 Progress Report: Dynamic Mechanic Necessity Lint

- Packet: Plan 100
- Date: 2026-07-07
- Implementer: Claude Sonnet 5
- Status: implementation complete, awaiting orchestration review (status field left for orchestrator, per standing convention)

## Summary

Taught the `win-condition-requires-named-mechanic` lint rule (`src/dev/levelLintCore.js`) to recognize dynamic necessity: a mechanic made mandatory by a live enemy rather than by win-condition structure. Added an optional `mechanicNecessity` level field (`static` default | `dynamic`, mirroring `boardDynamicsTier`'s shape), wired a Plan-86-convention naive-fixture lookup into the rule so a `dynamic` claim must be backed by a discoverable degenerate fixture, and annotated `enemy-nearby` (Plan 92's living-board uplift target). The previously-permanent `enemy-nearby win-condition-requires-named-mechanic: mechanic appears only in prose` warning is gone; no other level's lint status changed. The Plan 92 degenerate program, previously inline in a test, is now a discoverable fixture file the linter and the behavior-evidence generator can both find — the regenerated evidence bundle now shows the S8 proof (`naive fixture: yes (fail)`) where it previously said `no naive fixture`, a welcome side effect of making the artifact real.

## Prerequisite Gate Check (before mutation)

- Plan 86 (naive-fixture folder convention): status `complete`.
- Plan 92 (first living-board uplift, `enemy-nearby`, this packet's real-data test case): status `complete`.
- `node scripts/dev/plan-status.js check plan-100-dynamic-mechanic-necessity-lint` → `RUNNABLE`.

## Fixture Reconciliation Decision (Work Plan step 1)

Before editing, I confirmed the Plan 92 degenerate program was inline in `tests/unit/guided-reference-solutions.test.js` as a template-literal constant (`ENEMY_NEARBY_BLIND_FORWARD_XML`), and that `tests/unit/fixtures/guided-naive-solutions/` already existed (Plan 86) with two representative fixtures (`move-to-target.xml`, `reach-enemy-flag.xml`) but no `enemy-nearby.xml`. The linter's fixture-existence check needs a filesystem artifact, not a string baked into a test file, so I:

1. Created `tests/unit/fixtures/guided-naive-solutions/enemy-nearby.xml` with the exact XML the test previously inlined (`on each turn: move forward`).
2. Changed the test to `fs.readFileSync` that file instead of using the inline constant, keeping the S8 explanatory comment at the read site and adding a note pointing at the new linter dependency on this file's existence.
3. Reran the test — still green, same assertions, now reading from the fixture Plan 100 also needs.

This makes the fixture a single artifact serving three consumers: the Plan 92 unit test, the Plan 86 behavior-evidence generator (which already had the `tests/unit/fixtures/guided-naive-solutions/<id>.xml` lookup wired in and simply picked the new file up on the next `level:behavior-evidence` run), and this packet's lint rule.

## Implementation

### 1. `mechanicNecessity` field

- `src/config/constants.js`: added `MECHANIC_NECESSITY = { STATIC: "static", DYNAMIC: "dynamic" }`, directly beneath `BOARD_DYNAMICS_TIERS` for shape parity — same "enum object of string values" pattern, same "absent means the safe/current default" semantics.
- No level is forced to set the field; `enemy-nearby` is the only level that authors it.

### 2. Rule update (`checkWinConditionRequiresNamedMechanic`)

Added a `{ naiveSolutionsByLevelId = new Map() }` options parameter (mirroring how `referenceSolutionsByLevelId` is already threaded through the sibling checks) and reordered the per-level logic into four paths, checked in this order so proofs never double-report:

1. **Invalid `mechanicNecessity` value** (present but not `static`/`dynamic`) → **error**, independent of concept-matrix row lookup — checked first, same shape as `checkBoardDynamicsTierAgreement`'s invalid-tier branch.
2. **Static structure satisfied** (`structuredMatches`) → clean, unconditionally — this is checked *before* consulting `mechanicNecessity` at all, so a level with both a structural requirement and a `dynamic` annotation is silent for the static reason and the dynamic branch is never reached (no double-report; either proof suffices, exactly as the packet specifies).
3. **`mechanicNecessity: "dynamic"`** (only reached when static structure did *not* satisfy the rule) → fixture discoverable in `naiveSolutionsByLevelId` → clean; fixture absent → **error**, message names the exact expected fixture path (`tests/unit/fixtures/guided-naive-solutions/<level-id>.xml`) so a reviewer can act on it directly.
4. **Neither** → existing warning paths, unchanged in severity/contract, with a short suffix added to each message (`(no static structure and no dynamic-necessity annotation)`) so a reviewer scanning lint output can tell, from the message alone, that dynamic necessity wasn't even claimed — distinct from the new dynamic-claimed-but-unproven error message, which says `dynamic" claimed for ... but no degenerate fixture found`. This satisfies the "diagnostics must name which path was taken" requirement for every case where a diagnostic actually fires; the two "clean" paths (static-satisfied, dynamic-proven) are silent by design, matching how `boardDynamicsTier`'s clean case is also silent.

A fixture existing for a level that is *not* annotated `dynamic` does not silence anything — the rule only consults `naiveSolutionsByLevelId` inside the `necessity === "dynamic"` branch, so an unrelated or coincidental fixture can't accidentally satisfy the rule (verified by a dedicated test, see below).

### 3. `enemy-nearby` annotation

Added `mechanicNecessity: MECHANIC_NECESSITY.DYNAMIC` to `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js`, with a code comment pointing at the fixture path and the S8/Plan 100 rationale. **No other field changed** — win condition, Guard post/radius, tiers, tips, and toolbox are untouched from the Plan 92 repaired state.

### 4. Wiring the fixture lookup into the readiness/lint pipeline

`checkWinConditionRequiresNamedMechanic` is a pure function (levels + concept matrix + an optional fixture map in, diagnostics out) — it does not touch the filesystem itself, consistent with every other rule in `levelLintCore.js` and with the packet's explicit constraint ("the linter is static... a filesystem/registry lookup, not a level run"). The filesystem read happens once, in the caller:

- `src/dev/levelReadiness.js`: added `NAIVE_SOLUTIONS_DIR` (`tests/unit/fixtures/guided-naive-solutions`) and `loadNaiveSolutionIndex(levels)`, mirroring the existing `loadReferenceSolutionIndex` exactly (same async `readTextIfExists` helper, same `{ xmlText, filePath }` shape). `loadReadinessContext()` now loads `naiveSolutionsByLevelId` alongside `referenceSolutionsByLevelId` and passes it into `runLevelLint(...)`.
- `runLevelLint({...})` in `levelLintCore.js` gained a `naiveSolutionsByLevelId = new Map()` parameter, threaded into `checkWinConditionRequiresNamedMechanic`.
- Both `npm run lint:levels` (via `scripts/lint-levels.js` → `loadLevelReadinessContext()`) and `npm run level:readiness -- --level <id>` pick this up automatically since both go through `loadReadinessContext()`.

### 5. Tests

Added 8 tests to `tests/unit/level-lint.test.js` (all synthetic, using the existing `createLevel`/`createMatrixRow` helpers — no real level data needed for the unit-level coverage):

- Static requirement satisfied → clean (explicit test, previously only implied).
- `dynamic` + fixture present → clean.
- `dynamic` + fixture absent → error, message matches `/no degenerate fixture found/`.
- Invalid `mechanicNecessity` value → error, message matches `/is not one of/`.
- Static structure **and** `dynamic` annotation both present → clean, no double-report (belt-and-suspenders case from the packet's edge cases).
- Fixture present but level **not** annotated `dynamic` → existing warning still fires (fixture alone doesn't silence it).
- (Pre-existing) neither static nor dynamic → warning, contract/severity unchanged.

Plus real-data verification (not committed as a test, run manually and recorded here): annotated `enemy-nearby` with `dynamic`, temporarily deleted its fixture file, confirmed `npm run lint:levels` emits `error enemy-nearby win-condition-requires-named-mechanic: mechanicNecessity "dynamic" claimed for concept-matrix entry "13 Enemy nearby" but no degenerate fixture found at tests/unit/fixtures/guided-naive-solutions/enemy-nearby.xml`, then restored the fixture and confirmed the diagnostic disappears.

## Files Changed

| File | Change |
| --- | --- |
| `src/config/constants.js` | Added `MECHANIC_NECESSITY` enum (`static`/`dynamic`), mirroring `BOARD_DYNAMICS_TIERS`. |
| `src/dev/levelLintCore.js` | Rewrote `checkWinConditionRequiresNamedMechanic` with the four-path logic; added `naiveSolutionsByLevelId` param to `runLevelLint`. |
| `src/dev/levelReadiness.js` | Added `NAIVE_SOLUTIONS_DIR` + `loadNaiveSolutionIndex`; wired `naiveSolutionsByLevelId` into `loadReadinessContext()` and its `runLevelLint(...)` call. |
| `src/config/levels/phases/movement-helpers/level-13-enemy-nearby.js` | Added `mechanicNecessity: MECHANIC_NECESSITY.DYNAMIC` + explanatory comment. No other field changed. |
| `tests/unit/fixtures/guided-naive-solutions/enemy-nearby.xml` | New fixture file — the S8 degenerate program, extracted from the test's inline constant. |
| `tests/unit/guided-reference-solutions.test.js` | `ENEMY_NEARBY_BLIND_FORWARD_XML` now reads the fixture file instead of an inline template literal; same assertions. |
| `tests/unit/level-lint.test.js` | 8 new tests covering all four rule paths plus the two named edge cases. |
| `docs/packet-creation-guidance.md` | Added a "Linter hook (Plan 100)" note under the existing S8 section. |

## Artifacts Produced

- `reports/development/guided-level-complexity-audit/behavior-evidence/14-enemy-nearby.md` — regenerated; `Naive Solution Run Proof` now shows `status: fail`, `turns elapsed: 13`, `failure reason: turn_limit_exceeded` (previously `status: no naive fixture`), because the fixture this packet extracted to disk is also what the Plan 86 behavior-evidence generator looks for. This is a side effect of the fixture-reconciliation decision, not a level behavior change — the underlying simulation is identical to what Plan 92's unit test already exercised.
- `reports/development/guided-level-complexity-audit/behavior-summary-index.md` — regenerated; single-row change, `enemy-nearby`'s `naive fixture` column: `no naive fixture` → `yes (fail)`.
- No `level-dossiers/*.md` changes (dossiers track block/decision counts, unaffected by fixture discoverability or the `mechanicNecessity` field).

## Commands Run And Results

| Command | Result |
| --- | --- |
| `node scripts/dev/plan-status.js check plan-100-dynamic-mechanic-necessity-lint` | `RUNNABLE` |
| `node --test --test-isolation=none tests/unit/level-lint.test.js` | 42/42 pass (8 new). |
| `node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js` | 6/6 pass (fixture-file-backed degenerate test still green). |
| `npm run lint:levels` | Exit 0. `enemy-nearby` no longer appears for `win-condition-requires-named-mechanic`; the only remaining warnings for that contract are `move-toward-flag`, `closest-threat`, `prediction-31` — all three pre-existing, all three unrelated to this packet, message text unchanged except for the new explanatory suffix. |
| Deliberate-error real-data check (`dynamic` annotated, fixture temporarily deleted) | Lint emitted the expected error naming the exact missing fixture path. Fixture restored; lint returned to clean for `enemy-nearby`. |
| `npm run level:readiness -- --level enemy-nearby` | `Lint diagnostics: pass — No lint diagnostics apply to this level` (previously `warning`). `Reference runtime: pass`, unchanged. |
| `npm run level:dossiers` | Regenerated 46 dossiers; zero diff. |
| `npm run level:behavior-evidence` | Regenerated 46 behavior-evidence files; diff limited to `14-enemy-nearby.md` and `behavior-summary-index.md` (naive-fixture proof now recorded — see Artifacts). |
| `npm test` | 455/455 pass. |
| `npm run build` | Clean; same pre-existing chunk-size warnings, no new ones. |

## Validation Checklist (from the packet)

- [x] `mechanicNecessity` accepts `static`/`dynamic`, rejects other values, and is optional (absent → static, unit-tested and confirmed by the campaign-wide lint run showing no new diagnostics on any level that doesn't author the field).
- [x] `dynamic` + fixture present → clean; `dynamic` + no fixture → error; neither → existing warning; static structural requirement → clean. All four paths covered by dedicated tests.
- [x] `enemy-nearby` annotated `dynamic`; its warning no longer fires; fixture is discoverable and the Plan 92 degenerate test still passes.
- [x] Static path unchanged: full-campaign `lint:levels` diff shows exactly one contract-level change (`enemy-nearby`'s warning removed); no level that previously passed the rule now warns or errors.
- [x] Lint tests cover all four paths plus the invalid-value case, plus the two named edge cases (belt-and-suspenders, unrelated-fixture-doesn't-silence).
- [x] `npm run lint:levels`, `npm test`, `npm run build` pass.
- [x] `docs/packet-creation-guidance.md` records the S8 linter hook.
- [x] No guided level behavior, tier, geometry, or copy changed — `enemy-nearby` gained exactly one field.
- [x] Progress report records the fixture-reconciliation decision (above) and the one level whose lint status changed.

## Problems Encountered And How Resolved

None requiring a design deviation. The one thing worth flagging: regenerating behavior evidence produced an unrequested-but-correct side effect (the naive-fixture proof appearing in `14-enemy-nearby.md`) because the fixture-reconciliation step (Work Plan step 1) necessarily makes the file visible to *every* consumer of the `guided-naive-solutions/` convention, not just the linter. I judged this in-scope to keep (it's strictly additive evidence, not a behavior change, and matches Plan 86's original intent) rather than something to suppress or work around.

## Remaining Risks Or Follow-Ups

- **Only one level currently uses `mechanicNecessity: "dynamic"`.** The rule's dynamic-path logic is validated against real data for exactly one case (`enemy-nearby`). Plan 93's upcoming living-board uplift levels are the next real-world exercise of this path — per the packet's "Blocks" note, they should add `plan-100` to their own `depends_on` so their lint output is trustworthy from the start rather than needing a follow-up cleanup.
- **The rule's static-vs-dynamic reordering changes diagnostic message text for the three still-warning levels** (`move-toward-flag`, `closest-threat`, `prediction-31`) — each message now ends with a short parenthetical noting the absence of both proofs. This is intentional (packet requirement: "diagnostic messages must name which path was taken") but is a message-format change; any external tooling doing exact string matching on the old message text would need to update. I did not find any such tooling in this repo (only `assert.match` regex checks in tests, which still pass).
- **Unrelated concurrent changes observed in the working tree**, not part of this packet: `docs/development/README.md` (+1 line) and a new untracked `docs/development/plan-101-charger-archetype.md`. I did not create, edit, or rely on either. Flagging so the orchestrator doesn't attribute them to Plan 100.

## Ready For Orchestrator Review: Yes
