# Plan 65 Repair Directions: Add The Missing Stuck-Window Block

## Context

Plan 65 implemented two Free Play-only recent-state boolean blocks:

- `my last move was blocked`
- `I have not moved for [N] turns`

That is incomplete. The orchestration intent included a third, distinct block:

- `I have been stuck for [N] turns`

This was not meant to duplicate `I have not moved for [N] turns`. It was meant to catch local ping-pong / inlet behavior where a runner keeps moving but stays trapped in a small area. The rejected idea was goal-relative progress, such as "I have not gotten closer to the flag." Do not implement goal-relative progress in this repair.

## Required Reading

- `docs/development/archive/plan-65-free-play-recent-state-boolean-blocks.md`
- `reports/development/plan-65-free-play-recent-state-boolean-blocks/progress.md`
- `src/core/recentMovement.js`
- `src/core/turnEngine.js`
- `src/core/conditions.js`
- `src/ai/blockly/blocks.js`
- `src/ai/blockly/workspace.js`
- `tests/unit/conditions.test.js`
- `tests/unit/blockly-interpreter.test.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/unit/guided-level-contracts.test.js`
- `tests/browser/free-play.spec.js`
- `tests/browser/guided-ui.spec.js`
- `docs/GameSpecification.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`

## Repair Scope

Add one missing Free Play-only composable Advanced boolean value block:

- Student-facing label: `I have been stuck for [N] turns`
- Internal type: add a new explicit block id, for example `battlegorithms_boolean_stuck_for`
- Category: `Advanced`
- Output: Boolean
- Dropdown threshold: use the same small bounded style as the existing recent-state block. Prefer `3`, `4`, `5` unless the existing design strongly favors reusing `2`, `3`, `4`, `5`.

Do not remove or rename the existing `I have not moved for [N] turns` block. It remains useful and has different semantics.

## Authoritative Semantics

Define "stuck" as bounded local movement, not goal progress.

Recommended deterministic rule:

- Track each runner's completed own-turn end positions.
- `I have been stuck for N turns` returns true when the runner has at least N completed own turns in its recent-position window and every recorded end position in that N-turn window is within Manhattan distance `2` of the oldest end position in that window.
- The current turn should count only after it has completed, matching the existing recent-state update contract.
- Frozen skips and `Stay Still` count as completed own turns with the same end position.
- Successful movement within the same small local area may still count as stuck.
- Moving beyond the distance-2 local window clears the stuck condition for that window.
- Round reset, level start, free-play match start, and runner reset clear the stuck history.

Why this rule:

- It catches the intended inlet / ping-pong case where a runner moves back and forth but cannot escape a tiny area.
- It is visible from the board and does not require choosing a goal target.
- It avoids the rejected "not getting closer to goal" semantics.

If implementation finds this exact rule awkward, stop and report options before substituting a different definition.

## Implementation Notes

- Extend `src/core/recentMovement.js` rather than adding a parallel tracker.
- Keep the state runner-local and non-persistent.
- Cap stored position history to the largest dropdown value needed by the block.
- Wire condition evaluation through `src/core/conditions.js`.
- Wire Blockly descriptor/evaluation through the same composable boolean-value path as the existing recent-state blocks.
- Keep the block Free Play-only by relying on the Free Play full toolbox and guided level allowlists. Do not add it to guided level toolboxes.
- Do not add statement-style `if stuck` wrappers.
- Do not change movement, collision, scoring, freeze, pause, or NPC rules.

## Required Tests

Add or update focused tests proving:

- A runner that alternates between two adjacent cells for the threshold window returns true for `I have been stuck for [N] turns`.
- A runner that moves beyond Manhattan distance `2` within the threshold window returns false.
- A runner that has not accumulated enough completed own turns returns false.
- Frozen skips / `Stay Still` contribute positions without making `last move was blocked` true.
- The block works inside `If [boolean]` and with `and` / `or` / `not` composition.
- Free Play exposes all three recent-state blocks in Advanced:
  - `my last move was blocked`
  - `I have not moved for [N] turns`
  - `I have been stuck for [N] turns`
- Guided level toolboxes expose none of the recent-state blocks.

## Documentation Updates

Update:

- `docs/GameSpecification.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `docs/development/archive/plan-65-free-play-recent-state-boolean-blocks.md`
- `reports/development/plan-65-free-play-recent-state-boolean-blocks/progress.md`
- `docs/development/future-directions-analysis/state-tracking-and-variables-pathway.md`

Docs must distinguish:

- `I have not moved for [N] turns`: same-cell no-movement streak.
- `I have been stuck for [N] turns`: bounded local movement within a distance-2 window.

## Validation Commands

Run at minimum:

```powershell
node --test --test-isolation=none tests/unit/conditions.test.js tests/unit/blockly-interpreter.test.js tests/unit/free-play-contracts.test.js tests/unit/guided-level-contracts.test.js tests/unit/turn-engine-resilience.test.js
npx playwright test tests/browser/free-play.spec.js tests/browser/guided-ui.spec.js --reporter=line
npm run lint:levels
npm test
npm run build
npm run test:browser:smoke
```

If browser validation is slow, the targeted browser command plus smoke suite is the required minimum, but report whether the full browser suite was run.

## Stop Conditions

Stop and ask for owner/orchestrator review if:

- The implementer wants a different definition of "stuck."
- Adding the block would require changing guided levels, fixtures, or concept matrix rows.
- The implementation needs persistence, filesystem writes, or new dependencies.
- The implementation starts to resemble user-authored variables or goal-relative progress sensors.
