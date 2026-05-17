# Plan 34: Level Authoring Contract Linter

## Packet Metadata

- Packet id: plan-34
- Packet title: Level Authoring Contract Linter
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-16
- Packet type: implementation / developer-tooling / testing
- Mutation level: source-code (new tool only) / tests / docs-only
- Approval gate: none
- Expected artifacts:
  - new node script `scripts/lint-levels.js` (or similar) that walks `src/config/levels/` and validates curriculum contracts
  - new test file `tests/unit/level-lint.test.js` covering the linter's checks
  - new `npm run lint:levels` script in `package.json`
  - subsystem note touch if any current note describes a contract the linter now enforces
  - optional CI hook recommendation (documented, not enabled by this packet)
  - progress report
- Progress report folder: `reports/development/plan-34-level-authoring-contract-linter/`
- Progress report file: `reports/development/plan-34-level-authoring-contract-linter/progress.md`

## Packet Summary

Goal: Build a developer-side linter that audits every guided level against the curriculum contracts the project already enforces by code review and intermittent unit tests. The linter runs as `npm run lint:levels`, returns nonzero on any violation, and emits one-line diagnostics with file and level id. The point is to make future level work safer — every Plan that touches a level (recent: 11, 12, 23, 24, 26) currently relies on the orchestrator and implementer to remember the contracts. The linter remembers them instead.

Non-goals:

- Do not change any level config, reference solution, demo XML, win condition, or toolbox restriction.
- Do not redesign the levels module structure or move config files.
- Do not enforce contracts that aren't already implicit in the project (no new policy creation in this packet).
- Do not auto-fix violations. The linter reports; the human decides.
- Do not introduce a CI workflow. The packet documents how to wire one but does not enable it.
- Do not add a runtime dependency. The linter may use already-installed dev dependencies (e.g. `glob`, `node:fs`, `node:path`); no new packages.
- Do not deploy.

Depends on:

- Current state of `src/config/levels/` and the level-loading entry point.
- Current state of `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` (concept-per-level authority).
- Existing tests in `tests/unit/guided-level-contracts.test.js` and `tests/unit/guided-reference-solutions.test.js` and `tests/unit/guided-project-solutions.test.js` — these already exercise some contracts; the linter complements rather than duplicates.

Blocks:

- Future level work confidence. Plans that touch levels would benefit from `npm run lint:levels` as a pre-commit-style sanity check.
- The "bug-hunt levels" packet (queued Tier B) becomes safer to author if the linter is already in place.

Why this packet exists:

Levels have many contracts that the project has accumulated incrementally:
- Win condition requires the mechanic the lesson teaches.
- Demo XML doesn't solve the level (it shows structure, not the answer).
- Toolbox is scoped to the current lesson plus mastered concepts.
- Reference solution uses only available toolbox blocks.
- Challenge/synthesis levels introduce no new block concepts.
- Project levels carry project metadata.
- Turn limits allow learning time, not only perfect first attempts.
- `DIRECTLY_IN_FRONT` / `DIRECTLY_BEHIND` relation policy stays consistent with declared toolbox sensor relations.
- Reference solution and project-solution fixtures stay in sync with level ids.
- Level order in `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` matches the campaign's loaded order.

The orchestrator and implementer hold these in their heads. A future level change can violate any of them silently — the existing unit tests catch some, code review catches some, the rest slip through. A linter encodes the contracts in one place and runs in one second.

## Authority And Contracts

Sources of truth:

- `src/config/levels/` — authoritative for level configs, reference solutions, demo XML, toolboxes, turn limits.
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — authoritative for which concept each level introduces.
- `docs/development/README.md` (Cross-Packet Contracts section) — authoritative for project membership and toolbox policy.
- Existing unit tests in `tests/unit/guided-level-contracts.test.js` and siblings — show which contracts already have test coverage.

Required product contracts (the contracts the linter enforces):

The contract set below is the *initial* lint surface. It is what the linter checks in version 1. The set is intentionally bounded; future contracts get added by future packets that explicitly enumerate them.

1. **Concept matrix agreement.** Every level loaded by the campaign appears in the concept matrix, and vice versa. Levels appear in the same order.
2. **Reference solution toolbox compatibility.** Every block type in a level's reference solution XML is present in that level's toolbox.
3. **Demo XML does not solve the level.** If a level has a demo XML, that demo's program must not equal the reference solution (structural or normalized comparison — implementer's call, documented in the script).
4. **Challenge/synthesis levels introduce no new block concept.** A level flagged as challenge/synthesis is checked against the cumulative set of block concepts already introduced earlier in campaign order. Reusing an earlier block is allowed. Challenge levels warn only when they expose a genuinely first-seen block concept. `On Each Turn` is ignored as infrastructure in this comparison.
5. **Project levels have project metadata.** Every level in the `strategy-brain` (L23–L28) or `team-strategy-script` (L29–L37) range has a `projectId` (or equivalent metadata key) matching its arc.
6. **Project toolbox policy.** Project levels have the broad project toolbox declared by Plan 08's contract.
7. **Turn limit floor.** Every level has a turn limit ≥ a project-wide minimum (default suggestion: 8). Tunable constant in the script.
8. **Win condition requires the named mechanic.** For levels whose concept-matrix entry names a mechanic (e.g. "AND," "place barrier," "freeze opponents"), the win condition or sensor object types must reference that mechanic in some checkable way. This check is necessarily heuristic; the linter emits a warning rather than an error when the check is ambiguous.
9. **Reference solution fixture name matches level id.** The reference solution file (if it lives separately from the level config) must follow the naming convention that ties it to the level id.
10. **Sensor relation policy.** If a level's toolbox allows `DIRECTLY_IN_FRONT` or `DIRECTLY_BEHIND` relations, the level's win condition / sensor object types must declare them; conversely, sensor relations not declared by the level should not appear in the level's reference solution.

Severity:

- Checks 1, 2, 3, 5, 6, 7, 9 → **error** (linter exits nonzero).
- Checks 4, 8, 10 → **warning** (linter exits zero but reports clearly). Implementer flips a warning to an error in a follow-up packet only after the contract has been tightened to admit no false positives.

Do not redefine:

- Existing level configs, reference solutions, or demo XML.
- The concept matrix.
- Project membership rules.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/development/README.md` (Cross-Packet Contracts section)
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `src/config/levels/index.js` (or wherever the level list is assembled) and a handful of representative level configs across ordinary / challenge / project tiers
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-project-solutions.test.js`

Use `rg "challenge|synthesis|projectId|toolbox|referenceSolution|demoBlocklyXml|turnLimit|sensorObjectTypes|sensorRelationTypes"` from the repository root to find the relevant level-config fields.

## Scope

### In scope

- A new node script `scripts/lint-levels.js` (or `scripts/lint-levels.mjs` if ESM matches project conventions). The script:
  - imports the level list from `src/config/levels/` the same way the app does;
  - imports the concept matrix from `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` (parse the markdown table) or from a JSON source if one exists;
  - runs each contract check from the authority list above on every level;
  - emits one line per finding with severity, level id, contract name, and a short explanation (e.g. `error L24 reference-solution-toolbox-compatibility: block "battlegorithms_teammate_has_flag" missing from toolbox`);
  - exits 0 if no errors (warnings allowed), 1 if any errors.
- A `lint:levels` script entry in `package.json`'s `"scripts"`. Suggested: `"lint:levels": "node scripts/lint-levels.js"`.
- Unit-test coverage in a new `tests/unit/level-lint.test.js` that:
  - constructs in-memory "level" objects with deliberate violations and asserts the linter emits the right diagnostic per check;
  - asserts the linter exits with severity-appropriate exit code (call the linter's main function directly with synthetic input rather than spawning a subprocess).
- A short addition to `docs/packet-creation-guidance.md` under "Required Reading" or "Validation Checklist" noting that level-touching packets should run `npm run lint:levels`.
- Documented (not enabled) CI recommendation: a paragraph in the progress report describing how to add `lint:levels` to GitHub Actions or pre-commit hook if/when desired.
- Plan 34 progress report.

### Files and areas likely touched

- `scripts/lint-levels.js` (new, or `.mjs` per project ESM convention).
- `tests/unit/level-lint.test.js` (new).
- `package.json` (one `lint:levels` script entry added).
- `docs/packet-creation-guidance.md` (one-line addition mentioning the linter).
- `docs/subsystems/*.md` only if a current note describes one of the linter's enforced contracts and the addition of the linter changes the language ("this is enforced by code review" → "this is enforced by `npm run lint:levels`"). Surgical edits only.
- `reports/development/plan-34-level-authoring-contract-linter/progress.md` (new).

### Out of scope

- Any change to level config, reference solution, demo XML, or toolbox.
- Auto-fix or codemod functionality.
- New runtime dependencies. The script may rely on `node:fs`, `node:path`, and already-installed dev dependencies; nothing else.
- CI workflow changes. The packet documents the recommendation but does not enable it.
- Linting non-level files (Blockly config, NPC config, etc.).
- Linting reference solutions beyond toolbox compatibility (we are not auto-validating solutions actually win — that's existing test coverage).

## Work Plan

1. Read the level-loading entry point, the concept matrix, and three representative level configs (one ordinary, one challenge, one project) before writing the script.
2. Choose between `.js` and `.mjs` based on current project conventions. Match existing scripts in `scripts/` if any exist.
3. Write the script's data-loading layer: load levels, load concept matrix, build a normalized in-memory model.
4. Implement each contract check as a small function returning an array of `{ severity, levelId, contract, message }` objects.
5. Wire main() to run all checks and print/exit appropriately.
6. Write unit tests that drive each check with synthetic violations.
7. Add the `lint:levels` script to `package.json`.
8. Run the linter on the current campaign. Document any *existing* violations in the progress report — do not fix them; that's a separate packet if needed.
9. Update `docs/packet-creation-guidance.md` with the one-line addition.
10. Touch any subsystem note that now belongs to the linter.
11. Write the progress report including the CI-wiring recommendation.

## Implementation Requirements

### Requirement 1: Linter behavior

Required behavior:

- The script can be run as `npm run lint:levels` or `node scripts/lint-levels.js`.
- It runs every check listed in "Required product contracts" above on every level loaded from `src/config/levels/`.
- Output is plain text, one line per finding, prefixed by severity (e.g. `error`, `warning`).
- Exit code is `0` if no errors (warnings tolerated), `1` if any errors.
- Total runtime under 2 seconds on a normal dev machine.

Constraints:

- Do not couple the linter to the running app. It imports level config modules but does not start Blockly, p5, the turn engine, or the UI.
- Do not require a build step. The linter runs against `src/` directly.

Edge cases:

- A level whose config can't be imported (syntax error, missing file): emit a single `error` diagnostic and continue with the remaining levels.
- A check that depends on data unavailable for a given level (e.g. no demo XML): skip the check for that level silently (or with a `debug`-severity note that the progress report can mention but the user generally won't see).

Expected artifact:

- `scripts/lint-levels.js` (or `.mjs`).

### Requirement 2: Contract checks

Required behavior:

- All ten contracts from the Authority section are implemented. Severities match the list (1, 2, 3, 5, 6, 7, 9 = error; 4, 8, 10 = warning).
- Each check is a separate function with a clear name (e.g. `checkConceptMatrixAgreement(levels, conceptMatrix)`).
- Each check's output is a flat array of diagnostic objects.

Constraints:

- Heuristic checks (4, 8, 10) must be conservative — false positives are louder than false negatives. The packet prefers "warning that looks like a false positive" over "warning that hides a real bug."
- If a check would require running Blockly to evaluate (e.g. statically reasoning about a complex condition tree), simplify to a structural check rather than a semantic one. Document the limitation in the script's comments and the progress report.

Edge cases:

- The concept matrix has levels the campaign doesn't load, or vice versa → emit an error diagnostic per orphan in each direction.
- A challenge level whose toolbox is exactly identical to the previous level's → contract is satisfied (check 4 allows the non-strict subset).
- A project level whose toolbox is *broader* than the project metadata declares → contract 6 emits an error.

Expected artifact:

- Ten contract-check functions.

### Requirement 3: Unit tests

Required behavior:

- `tests/unit/level-lint.test.js` covers each contract check by constructing a synthetic "level" object with a deliberate violation and asserting the linter emits the expected diagnostic.
- Each check also has at least one "passing" test where a well-formed level produces zero diagnostics from that check.
- The tests call the linter's check functions or main function directly. They do not spawn `node scripts/lint-levels.js`.

Constraints:

- Synthetic level objects should be minimal — the smallest object shape that the check under test actually inspects.
- Do not couple unit tests to real level configs; that creates a maintenance hazard where changing a real level can break unit tests.

Edge cases:

- Tests should cover at least one "ambiguous" case for warning-severity checks (4, 8, 10) to confirm the linter emits a warning rather than an error.

Expected artifact:

- One unit-test file with full check coverage.

### Requirement 4: Documentation

Required behavior:

- `docs/packet-creation-guidance.md` gets one new sentence under its validation section: "Packets that touch guided levels should run `npm run lint:levels` and either resolve any new errors or surface them for owner review."
- The progress report names every existing violation found when the linter runs against the current campaign. Existing violations are surfaced, not fixed.

Constraints:

- Do not rewrite packet-creation-guidance. One sentence addition only.
- Do not edit subsystem notes unless one of them currently states a contract "is enforced by code review" or similar language that the linter has now superseded.

Expected artifact:

- One sentence in packet-creation-guidance; possibly one surgical edit in a subsystem note.

### Requirement 5: CI recommendation

Required behavior:

- The progress report contains a paragraph describing how to wire `npm run lint:levels` into CI or a pre-commit hook if/when the integration owner wants it. The packet itself does not modify CI.

Constraints:

- Do not enable CI in this packet.
- Do not add husky, lint-staged, or other tooling. The recommendation is "here's the script to add; here's what flag to pass."

Expected artifact:

- A paragraph in the progress report.

## Model-Specific Instructions

- Read three real levels (one ordinary, one challenge, one project) before writing any check. The actual shape of level configs in this repo is the only specification for what to inspect.
- Build the linter incrementally: data-loading first, then one check at a time with its unit test before moving to the next.
- Heuristic checks: prefer false positives (warnings the user will look at and clear) over false negatives (real bugs the linter misses).
- The linter exists to encode contracts. If a check requires reasoning beyond what the existing guided-level-contracts tests do, that probably means the contract isn't really enforceable mechanically yet — surface that in the progress report and downgrade the check to a no-op stub with a TODO. The linter is allowed to have known gaps.
- Stop and report if:
  - the level-loading entry point can't be imported from a node script without bringing in the entire app (Blockly, p5, etc.);
  - the concept matrix in markdown can't be parsed into a stable structure (in which case, propose a JSON copy generated alongside the markdown);
  - more than two existing violations are found that look like real curriculum bugs — that's a separate diagnostic packet, not for this implementer to fix.

## Commands

```powershell
node scripts/lint-levels.js
npm run lint:levels
node --test --test-isolation=none tests/unit/level-lint.test.js
npm test
npm run build
```

## Validation Checklist

- [ ] `scripts/lint-levels.js` exists, runnable as `npm run lint:levels`, no new dependencies.
- [ ] All ten contracts from the Authority section are implemented with the correct severity.
- [ ] Linter exits 0 on a clean campaign, 1 on any error-severity violation, 0 on warnings only.
- [ ] Total runtime < 2 seconds.
- [ ] `tests/unit/level-lint.test.js` covers each check (passing case + violating case).
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `package.json` has the new `lint:levels` script entry.
- [ ] `docs/packet-creation-guidance.md` has the one-sentence addition.
- [ ] Any subsystem note that currently describes a contract the linter enforces is updated (or documented as needing no change).
- [ ] Progress report lists every existing violation found in the current campaign, separates errors from warnings, and includes the CI-wiring recommendation.
- [ ] No level config, reference solution, demo XML, or toolbox was modified.

## Stop Conditions

Stop and report for integration-owner review if:

- The level-loading entry point can't be imported from a plain node script.
- The concept matrix can't be parsed stably from markdown.
- More than two real curriculum violations are found in the current campaign — surface them; the fix is its own packet.
- A contract from the authority list turns out to be too heuristic to implement without false positives — downgrade to a stub with TODO and note in the progress report.
- The implementer would need to add a runtime dependency to implement a check.
- The implementer is tempted to fix any violation the linter finds. That's out of scope.
