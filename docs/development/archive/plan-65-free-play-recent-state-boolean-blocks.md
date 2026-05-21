# Plan 65: Free Play Recent-State Boolean Blocks

## Packet Metadata

- Packet id: plan-65
- Packet title: Free Play Recent-State Boolean Blocks
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-21
- Packet type: implementation / Blockly / testing / docs
- Mutation level: source-code / tests / docs
- Approval gate: before adding guided-level access, before adding full variables, before changing movement/collision rules, before adding filesystem/server behavior
- Expected artifacts:
  - Free Play-only Advanced boolean blocks for recent runner state
  - runner/turn-engine state tracking needed for the blocks
  - Blockly interpreter and toolbox integration
  - focused unit and browser coverage
  - subsystem doc updates
  - progress report
- Progress report folder: `reports/development/plan-65-free-play-recent-state-boolean-blocks/`
- Progress report file: `reports/development/plan-65-free-play-recent-state-boolean-blocks/progress.md`

## Packet Summary

Goal: Add a small, curated state-tracking bridge in Free Play by exposing composable Advanced boolean blocks that let a runner react when its own recent turn outcomes show no movement or a blocked move.

Why this packet exists:

Students can build strong local rules with sensing, role checks, and resources, but Free Play maps can still expose a real strategy gap: a runner may bounce against a wall, get trapped in a one-cell inlet, or repeat a local failure without any way to notice that the current rule is not working. This packet adds bounded runner memory as a game-provided sensor, not as user-authored variables. It supports debugging and decentralized self-management while keeping the browser version focused.

Non-goals:

- Do not add general-purpose variables, assignment blocks, lists, or user-authored counters.
- Do not add these blocks to guided levels yet.
- Do not add new guided levels in this packet.
- Do not implement goal-relative "progress toward target" checks.
- Do not change movement, collision, freeze, scoring, or one-action-per-turn semantics.
- Do not change NPC behavior.
- Do not add persistence for runner memory across matches.
- Do not add dependencies or server behavior.

Depends on:

- Existing Blockly Advanced boolean/value block architecture.
- Existing turn-engine event/action outcome flow.
- Existing Free Play full toolbox policy.

Blocks:

- Future guided-level packets that introduce state/history reasoning explicitly.
- Future variable-pathway packets.

## Authority And Contracts

Authoritative sources:

- `docs/GameSpecification.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/config/constants.js`
- `src/entities/Runner.js`
- `src/core/turnEngine.js`
- `src/core/conditions.js`
- `src/ai/blockly/blocks.js`
- `src/ai/blockly/interpreter.js`
- `src/ai/blockly/workspace.js`
- `tests/unit/blockly-interpreter.test.js`
- `tests/unit/conditions.test.js`
- `tests/unit/movement-and-collisions.test.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/browser/free-play.spec.js`

Contracts this packet must preserve:

- Student programs still run from the required `On Each Turn` event block.
- Only the first reached action executes for a runner turn.
- New blocks are boolean value blocks in the Advanced category, composable with existing `If [boolean]`, `and`, `or`, `not`, and compare patterns.
- The new blocks are available in Free Play only for this packet.
- Guided levels and their toolbox restrictions must not change.
- Core rules remain in `src/core/`; Blockly block definitions remain in `src/ai/blockly/`; UI changes, if any, remain in `src/ui/`.
- The app remains a static Vite deployment.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/GameSpecification.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `src/config/constants.js`
- `src/entities/Runner.js`
- `src/core/turnEngine.js`
- `src/core/conditions.js`
- `src/ai/blockly/blocks.js`
- `src/ai/blockly/interpreter.js`
- `src/ai/blockly/workspace.js`
- `tests/unit/blockly-interpreter.test.js`
- `tests/unit/conditions.test.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/browser/free-play.spec.js`

Use `rg "BOOLEAN_|VALUE_|evaluateCondition|evaluateValue|getFirstRunnableAction|actionResolved|blockedOrBounced|currentToolboxBlockTypes"` to confirm current names before editing.

## Scope

In scope:

- Add a runner-local record of recent movement outcomes for the current match.
- Add a boolean value block for `my last move was blocked`.
- Add a boolean value block for `I have not moved for [N] turns`, with a small dropdown such as `2`, `3`, `4`, `5`.
- Make both blocks appear only in the Free Play Advanced toolbox for now.
- Allow the blocks to plug into existing composable boolean contexts.
- Add tests that prove guided toolboxes do not expose the blocks.
- Update relevant subsystem docs and testing docs if command guidance changes.

Out of scope:

- Goal-relative progress checks such as "not closer to enemy flag."
- Per-student/user-authored variables.
- Setter/change-value blocks.
- New guided levels, reference solutions, or concept-matrix rows.
- UI explanations beyond tooltips and docs needed to keep contracts accurate.
- Free Play map redesigns.

Files and areas likely touched:

- `src/config/constants.js`
- `src/entities/Runner.js`
- `src/core/turnEngine.js`
- `src/core/conditions.js`
- `src/ai/blockly/blocks.js`
- `src/ai/blockly/interpreter.js`
- `src/ai/blockly/workspace.js`
- focused unit tests under `tests/unit/`
- focused browser tests under `tests/browser/free-play.spec.js` or a new browser spec
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/GameSpecification.md` if runner state inventory changes
- progress report

## Work Plan

1. Inspect current action-outcome/event-log flow and runner reset/start paths.
2. Define a minimal runner-memory shape that resets on match setup, level start, and round reset.
3. Implement state updates at runner-turn completion, after movement/bounce/no-op outcome is known.
4. Add the two new boolean value blocks in the Advanced category.
5. Wire interpreter/condition evaluation so the blocks work inside composable boolean logic.
6. Restrict toolbox exposure to Free Play only.
7. Add targeted unit and browser tests.
8. Update subsystem docs and write the progress report.

## Implementation Requirements

### Requirement 1: Runner Recent-State Tracking

Required behavior:

- Track each runner's recent own-turn movement outcomes during the current match.
- The tracker must support:
  - whether the most recent attempted movement action was blocked/bounced/illegal because movement did not change the runner's grid cell
  - how many consecutive own turns ended without the runner changing grid cells
- Reset recent-state tracking when runners reset to initial state, when a level/free-play match starts, and when a round reset recreates runner positions.

Constraints:

- Do not persist this memory to localStorage.
- Do not count animation frames; count completed runner turns.
- Frozen skips and explicit `Stay Still` should count as "not moved" for the consecutive no-movement counter.
- `my last move was blocked` should only mean the runner attempted a movement/jump action and it was blocked, bounced, illegal, or failed. It should not become true merely because the runner chose `Stay Still`, was frozen, or used an unavailable non-move resource.
- Successful move and successful jump should clear the no-movement counter and clear the last-move-blocked flag.
- Successful non-move actions that do not change cell, such as placing a barrier or Area Freeze, may increment "not moved" but should not set `last move was blocked`.

Expected artifact:

- Runner or core-state fields with focused tests around reset and update behavior.

### Requirement 2: Boolean Blocks

Required behavior:

- Add two composable Advanced boolean value blocks:
  - `my last move was blocked`
  - `I have not moved for [N] turns`
- The threshold block should use a dropdown, not a freeform number field, for initial clarity.
- Both blocks must output Boolean and plug into existing `If [boolean]`, `and`, `or`, and `not` blocks.

Constraints:

- Do not create statement-style `if` wrappers for these ideas.
- Do not add separate `else` condition blocks for these ideas.
- Do not add goal-relative wording such as "made progress."
- Tooltips must be concise and rule-accurate.

Expected artifact:

- Blockly definitions and interpreter support.

### Requirement 3: Free Play Only

Required behavior:

- The new blocks appear in Free Play's default/full toolbox.
- The new blocks do not appear in any guided level toolbox.
- Existing guided level manifests, concept matrix, reference fixtures, and project fixtures remain unchanged.

Constraints:

- Do not silently broaden project toolboxes.
- If current toolbox helpers make "Free Play only" awkward, add a narrow helper rather than changing guided toolbox semantics.

Expected artifact:

- Unit/browser tests verifying Free Play exposure and guided absence.

### Requirement 4: Student-Facing Semantics

Required behavior:

- Names and tooltips should frame the feature as recent runner state, not variables.
- The behavior should be predictable from the board:
  - "not moved" means this runner's cell stayed the same at the end of its own turn
  - "last move blocked" means the runner tried to move/jump and the board rejected that move

Constraints:

- Avoid introducing a classroom-facing variables lesson in copy.
- Do not imply the runner knows future pathfinding or goal progress.

## Testing Requirements

Add or update unit tests for:

- Last blocked move is true after blocked movement/bounce/failed jump and false after successful movement.
- Stay Still and frozen skip can increment the "not moved" counter but do not set last-move-blocked.
- Successful barrier or Area Freeze can count as not moved but does not set last-move-blocked.
- The no-movement counter resets after a successful cell-changing move/jump.
- Runner recent-state fields reset on setup/round reset.
- Blockly boolean evaluation returns expected values for the new blocks.
- Free Play toolbox includes the new Advanced blocks.
- Guided toolboxes do not include the new blocks.

Add browser coverage for:

- Free Play shows the new blocks in the Advanced category.
- A small Free Play program can use one of the new blocks inside `If [boolean]`.
- A representative guided level does not expose the new blocks.

## Commands

Run from repository root:

```powershell
node --test --test-isolation=none tests/unit/conditions.test.js tests/unit/blockly-interpreter.test.js tests/unit/free-play-contracts.test.js tests/unit/movement-and-collisions.test.js
npx playwright test tests/browser/free-play.spec.js --reporter=line
npm test
npm run build
npm run test:browser:smoke
```

Run `npm run test:browser` if browser/toolbox initialization changes broadly or if smoke coverage is insufficient.

## Validation Checklist

- [ ] New blocks are Boolean value blocks in Advanced, not statement-style condition wrappers.
- [ ] New blocks appear in Free Play only.
- [ ] Guided toolboxes, level data, concept matrix, and fixtures are unchanged.
- [ ] Last-blocked and not-moved semantics match the packet definitions.
- [ ] State resets on match/level/round reset.
- [ ] One-action-per-turn behavior is unchanged.
- [ ] Existing resource, movement, collision, freeze, and scoring rules are unchanged.
- [ ] Relevant subsystem notes still read true.
- [ ] Targeted unit tests pass.
- [ ] Relevant browser tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Final report lists commands run and remaining risks.

## Stop Conditions

Stop and report for owner review if:

- The implementation appears to require general-purpose variables or assignment semantics.
- It is difficult to distinguish blocked movement from intentional no-movement without changing action outcomes.
- Free Play-only exposure cannot be implemented without changing guided toolbox behavior.
- Existing docs imply a different runner-state contract that would need product judgment to change.
- Any guided level or reference fixture would need to change.
- The feature starts to require a new UI explanation surface or tutorial level in this packet.

## Progress Report Requirements

Write `reports/development/plan-65-free-play-recent-state-boolean-blocks/progress.md` with:

- implemented block names and exact semantics
- runner state fields added or changed
- Free Play-only toolbox gating approach
- tests added
- files changed
- commands run and results
- approval gates honored
- ready-for-integration yes/no
