# Plan 01: Guided Level Source Split

- Packet id: plan-01
- Packet title: Guided Level Source Split
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-09
- Packet type: implementation / refactor / testing
- Mutation level: source-code / tests
- Approval gate: none
- Expected artifacts:
  - Smaller guided level source modules under `src/config/levels/`
  - Split full-document XML reference fixtures under `tests/unit/fixtures/guided-reference-solutions/`
  - A compatibility export at `src/config/levels.js`
  - A progress report at `reports/development/plan-01-guided-level-source-split/progress.md`
- Progress report folder: `reports/development/plan-01-guided-level-source-split/`
- Progress report file: `reports/development/plan-01-guided-level-source-split/progress.md`

## Goal

Split the two largest guided-level authoring files into smaller, human-readable modules without changing authored campaign behavior.

Current pain points:

- `src/config/levels.js` is about 2,200 lines and mixes Blockly demo XML, toolbox arrays, setup normalization helpers, all guided level objects, and exported runtime accessors.
- `tests/unit/fixtures/guidedReferenceSolutions.js` is about 600 lines and stores every reference solution as inline XML fragments inside one JavaScript object.
- Both files are hard for humans and smaller agents to review safely.

After this packet, an implementer should be able to open one level file or one solution XML file and understand the local change without scrolling through the full campaign.

## Non-Goals

- Do not repair guided pedagogy, demos, turn limits, level count drift, or reference solution correctness beyond what is mechanically required by the file split.
- Do not redesign any level.
- Do not change the public runtime behavior of `getLevelDefinitions()` or `createInitialLevelProgress()`.
- Do not introduce a generated build step.
- Do not move canonical level data to JSON, IndexedDB, server APIs, or runtime fetches.
- Do not change Blockly block definitions or interpreter semantics.
- Do not change static deployment behavior.

## Depends On

- Existing modular app structure described in `docs/ARCHITECTURE.md`.
- Existing packet guidance in `docs/packet-creation-guidance.md`.
- Current failing-test baseline documented in the initial project scan.

## Blocks

This packet should make later guided-level packets easier:

- Demo Blockly redesign
- Guided level count/docs alignment
- Late multi-ally level repair
- Advanced transition copy
- Map variety and territory redesign

## Why This Packet Exists

Guided levels are the heart of the student learning path. Right now the authoring surface is too large for quick, trustworthy edits. Splitting the source lets future packet agents work at the level or phase granularity, which reduces accidental drift and makes pedagogy reviews easier.

This directly supports the app's AP CSA bridge: future changes to conditionals, boolean logic, comparisons, runner-index roles, and strategic self-management should be inspectable in small files instead of buried inside one giant module.

## Current Baseline

Before editing, run:

```powershell
npm test
npm run build
```

Known baseline on 2026-05-09:

- `npm run build` passes.
- `npm test` fails 4 unit assertions:
  - expected guided level count is stale (`38 !== 36`)
  - one guided toolbox expectation expects stale authored sensor object types
  - one generic sensing demo XML expectation no longer matches current tutorial content
  - the `dodge-and-deliver` reference solution exceeds the turn limit

This packet may finish with the same 4 known failures. It must not introduce new failures. If validation produces new failures, fix them if they are caused by the split; otherwise stop and report.

## Authority And Contracts

Required reading:

- `docs/packet-creation-guidance.md`
- `docs/development/README.md`
- `docs/ARCHITECTURE.md`
- `src/config/levels.js`
- `tests/unit/fixtures/guidedReferenceSolutions.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/unit/guided-reference-solutions.test.js`

Contracts:

- Preserve the import path `../config/levels.js` for runtime code and tests unless all call sites are updated cleanly. The safest approach is to keep `src/config/levels.js` as a thin compatibility re-export.
- `getLevelDefinitions()` must still return normalized level objects with setup normalization applied.
- `createInitialLevelProgress()` must preserve current unlock behavior and `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING` behavior.
- Level order must not change.
- Level IDs must not change.
- Level object contents must not change except for import/export mechanics and harmless formatting.
- Reference solution XML contents must not change except for full-document wrapping and whitespace normalization.
- The full campaign should still ship through the static Vite bundle.
- Do not add new dependencies.

## Recommended Target Structure

### Level Source

Use this structure unless local implementation details make a small adjustment clearly better:

```text
src/config/levels.js
src/config/levels/
  index.js
  manifest.js
  shared/
    blocklyXml.js
    levelProgress.js
    normalizeSetup.js
    toolboxes.js
  phases/
    foundations/
      level-01-move-to-target.js
      level-02-reach-enemy-flag.js
      level-03-score-a-point.js
      level-04-barrier-detour.js
      level-05-mirror-forward.js
    sensing/
      level-06-sensor-barrier-branch.js
      level-07-watch-the-wall.js
      level-08-find-the-human.js
      level-09-find-the-enemy-flag.js
    movement-helpers/
      level-10-human-runner-practice.js
      level-11-move-toward-flag.js
      level-12-bring-it-home.js
      level-13-enemy-nearby.js
      level-14-jump-the-gap.js
      level-15-dodge-and-deliver.js
      level-16-jump-if-ready.js
    resources-and-territory/
      level-17-build-the-barrier.js
      level-18-stay-still-can-do-something.js
      level-19-relay-race.js
      level-20-my-side-their-side.js
      level-21-freeze-the-lane.js
      level-22-show-what-you-know.js
    advanced-logic/
      level-23-closest-threat.js
      level-24-how-far-away.js
      level-25-two-conditions-at-once.js
      level-26-this-or-that.js
      level-27-flip-the-answer.js
      level-28-full-team-tactics.js
    advanced-teamplay/
      level-29-one-program-two-allies.js
      level-30-index-jobs.js
      level-31-first-two-defend.js
      level-32-escort-the-carrier.js
      level-33-closest-enemy-defender.js
      level-34-freeze-support.js
      level-35-barrier-specialist.js
      level-36-jump-team.js
      level-37-advanced-scrimmage.js
    optional/
      optional-random-lab.js
```

Notes:

- Keep phase grouping as an authoring convenience only. Do not add runtime phase behavior in this packet.
- If `src/config/levels.js` as a file cannot coexist cleanly with a same-named `src/config/levels/` directory on this platform or tooling, use `src/config/guided-levels/` for the new folder and keep `src/config/levels.js` as the compatibility entrypoint.
- `manifest.js` should export a compact summary for humans and agents, not become a second source of truth for level behavior.

### Reference Solution Fixtures

Use one standalone Blockly XML document per non-human guided level:

```text
tests/unit/fixtures/guidedReferenceSolutions.js
tests/unit/fixtures/guided-reference-solutions/
  move-to-target.xml
  reach-enemy-flag.xml
  score-a-point.xml
  barrier-detour.xml
  ...
  optional-random-lab.xml
```

Each XML file should be a full Blockly document:

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <!-- solution blocks -->
    </next>
  </block>
</xml>
```

Keep `tests/unit/fixtures/guidedReferenceSolutions.js` as a tiny loader that exports the same API:

- `buildSolutionXml`, if tests still import it
- `GUIDED_LEVEL_REFERENCE_SOLUTIONS`

Because tests run in Node, the loader may use `node:fs` and `node:path` to read XML files at test time. Do not make runtime app code depend on filesystem access.

## Detailed Requirements

### 1. Shared Helpers

Move helper logic out of `src/config/levels.js`:

- Blockly XML constants and demo XML helpers to `shared/blocklyXml.js`
- toolbox arrays to `shared/toolboxes.js`
- setup normalization helpers to `shared/normalizeSetup.js`
- progress creation to `shared/levelProgress.js`

Keep helper names stable where practical. If helpers are not exported outside the level modules, they may remain internal to shared modules.

### 2. Per-Level Modules

Each per-level file should export exactly one level object as its default export.

Example shape:

```js
import { BASIC_MOVEMENT_BLOCKS } from "../../shared/toolboxes.js";

export default {
  id: "move-to-target",
  title: "Level 1: Move to Target",
  // existing level object contents unchanged
};
```

Do not introduce computed level IDs, computed titles, or phase-derived level ordering. Explicit authoring is easier to review.

### 3. Phase Assemblers

Each phase folder may have an `index.js` that imports its level modules and exports an ordered array.

Example:

```js
import moveToTarget from "./level-01-move-to-target.js";
import reachEnemyFlag from "./level-02-reach-enemy-flag.js";

export const foundationLevels = [moveToTarget, reachEnemyFlag];
```

### 4. Main Level Entrypoint

`src/config/levels/index.js` should:

- import all phase arrays
- concatenate them in campaign order
- export `LEVEL_DEFINITIONS` if useful for tests
- export `getLevelDefinitions()`
- export `createInitialLevelProgress()`

`src/config/levels.js` should stay as a compatibility re-export:

```js
export {
  createInitialLevelProgress,
  getLevelDefinitions
} from "./levels/index.js";
```

If tests or debugging tools benefit from direct `LEVEL_DEFINITIONS`, it may be exported too, but do not change existing consumers unnecessarily.

### 5. Manifest

Add `src/config/levels/manifest.js` exporting a compact, manually readable summary generated from the assembled level array at module load time:

```js
import { LEVEL_DEFINITIONS } from "./index.js";

export const GUIDED_LEVEL_MANIFEST = LEVEL_DEFINITIONS.map((level, index) => ({
  order: index + 1,
  id: level.id,
  title: level.title,
  hasDemoBlocklyXml: level.tutorialSteps?.some((step) => step.demoBlocklyXml),
  winConditionType: level.winCondition?.type,
  turnLimit: level.turnLimit
}));
```

Keep the manifest informational. Do not make runtime behavior depend on it.

### 6. XML Fixture Loader

Replace inline XML strings in `tests/unit/fixtures/guidedReferenceSolutions.js` with a loader.

Requirements:

- Export `GUIDED_LEVEL_REFERENCE_SOLUTIONS` as an object keyed by level ID.
- Use the existing level ID as the XML filename stem.
- Read UTF-8 XML text from `tests/unit/fixtures/guided-reference-solutions/`.
- Keep or replace `buildSolutionXml` only as needed for current tests.
- If retaining `buildSolutionXml`, preserve its current behavior for tests that import it.
- Add a clear error if a mapped XML file is missing.

### 7. Progress Report

Create `reports/development/plan-01-guided-level-source-split/progress.md` with:

- Summary
- Files changed
- Level files created
- XML fixture files created
- Any import-path deviations from the recommended target structure
- Baseline commands and results
- Final commands and results
- Known failures preserved
- New failures introduced, if any
- Follow-ups recommended

## Validation

Run these before editing and after editing:

```powershell
npm test
npm run build
```

Also run a focused export smoke check after editing:

```powershell
node --input-type=module -e "import { getLevelDefinitions, createInitialLevelProgress } from './src/config/levels.js'; const levels = getLevelDefinitions(); console.log(levels.length, levels[0].id, levels.at(-1).id, Object.keys(createInitialLevelProgress()).length);"
```

Expected current source-order smoke output should report:

- level count: `38`
- first level: `move-to-target`
- last level: `optional-random-lab`
- progress key count: `38`

If packet implementation preserves current behavior, `npm test` may still fail with the same known 4 assertions. The final progress report must say whether failures are identical to baseline.

## Stop Conditions

Stop and report if:

- Moving the files requires changing level content beyond mechanical imports/exports.
- Current source appears to contain duplicate, missing, or contradictory level definitions.
- `getLevelDefinitions()` output changes in level count, order, IDs, normalized setup shape, or level object content.
- The fixture split requires changing reference solution XML behavior to satisfy tests.
- The implementation needs a new dependency or build step.
- The implementation creates new unit/build failures that cannot be fixed by import/path corrections.
- The current dirty working tree contains conflicting user edits that make a mechanical split unsafe.

## Final Response Requirements

The implementing agent should report:

- Packet: Plan 01 Guided Level Source Split
- Summary of mechanical split
- Files changed
- Whether `getLevelDefinitions()` preserved count/order
- Whether XML fixtures load from standalone files
- Commands run and results
- Known failures preserved or resolved
- New risks/follow-ups
- Ready for integration: yes/no
