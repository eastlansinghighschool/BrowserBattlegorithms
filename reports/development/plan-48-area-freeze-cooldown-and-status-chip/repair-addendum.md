# Plan 48 Repair Addendum

Date: 2026-05-18

## Integration Review Finding

Plan 48 is close, and the current combined worktree now passes `npm test`, but it is not quite ready for integration. The remaining issues are contract/documentation drift plus an accessibility risk in the status chip implementation.

Validation observed during review:

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/conditions.test.js tests/unit/narration-event-log.test.js tests/unit/narration-templater.test.js tests/unit/learning-moments.test.js tests/unit/coaching-narration.test.js
npm run lint:levels
npm run build
npm test
```

All passed in the current worktree. `npm run lint:levels` still reports the known warning set.

## Required Repairs

### 1. Finish Game Specification Updates

`docs/GameSpecification.md` still contains the old once-per-round Area Freeze contract:

- round reset example still names `team areaFreezeUsedThisRound = false`
- action list says `If team's areaFreezeUsedThisRound is false`
- action resolution says `Mark areaFreezeUsedThisRound for the team as true`

Update those sections to the cooldown model:

- Area Freeze starts ready for each team.
- If used on round turn `T`, the team cannot use it again until `T + AREA_FREEZE_COOLDOWN_TURNS`.
- It is ready when `currentTurnNumber >= nextAvailableTurn`.
- Round reset and level/match reset make it ready again.
- Freeze radius and frozen duration are unchanged.

Also update `docs/subsystems/turn-engine.md` to explicitly document the Area Freeze cooldown contract, not only the collision and level-completion contracts. Add `src/core/areaFreeze.js` to the turn-engine surface map or a related note so future packets know where readiness logic lives.

### 2. Reduce Status-Chip Live-Region Noise

`src/ui/scoreboard.js` currently renders each chip as:

```html
<span class="area-freeze-status-chip" role="status" aria-label="...">...</span>
```

Because `updateScoreDisplay()` rebuilds the chip HTML on every UI sync, `role="status"` can repeatedly announce ready/cooldown text and compete with the Plan 36/38 narration/coaching live regions.

Recommended repair:

- Remove `role="status"` from the chip.
- Keep visible short text (`❄ Ready`, `❄ 7 turns`) and an accessible "Area Freeze" label.
- Prefer explicit hidden text inside the chip over relying only on `aria-label`, for example:

  ```html
  <span class="area-freeze-status-chip">
    <span class="area-freeze-status-a11y">Team 1 Area Freeze</span>
    <span aria-hidden="true">❄</span>
    <span>Ready</span>
  </span>
  ```

- Add CSS that visually hides `.area-freeze-status-a11y` while preserving it for assistive tech, or use the repo's existing visually-hidden utility if one is added before this repair lands.

Do not add another live region unless the owner explicitly approves it. The board narration and coaching surfaces already own live updates.

### 3. Clarify Or Remove Legacy `teamAreaFreezeUsed`

The new source of truth is `teamAreaFreezeNextAvailableTurn`, but `teamAreaFreezeUsed` remains in state and is set to `true` after use. Once the cooldown expires, `teamAreaFreezeUsed` stays `true` even though Area Freeze is ready.

That is acceptable only if it is treated as a legacy/debug "has been used since reset" flag, not a readiness flag.

Recommended repair:

- Prefer removing `teamAreaFreezeUsed` from production state and tests if no consumer needs it.
- If preserving it to reduce churn, add a short comment in `src/core/areaFreeze.js` or `src/core/state.js` and avoid asserting it as readiness in tests.
- Add a focused regression test that fails if any runtime consumer reverts to checking `state.teamAreaFreezeUsed?.[team]` for readiness.

The important contract: Blockly, turn engine, UI, and CPU must all use `isAreaFreezeReady()`.

### 4. Add Missing Edge Coverage

Current tests cover the main happy path and boundary readiness, but the packet checklist also asks for:

- second successful use advances `nextAvailableTurn` again;
- unavailable attempts do not extend cooldown;
- CPU logic does not choose freeze while cooling down;
- status chip hides on a guided level without freeze tools;
- PvP free play shows both team chips and PvCPU shows only the player-team chip.

Add focused unit/browser coverage for these. Keep tests narrow; do not broaden into Plan 49 board visuals.

### 5. Update Progress Report

`progress.md` says `npm test` failed in unrelated authored fixture tests. In the current reviewed worktree, `npm test` passes. Update the report after repair with exact current validation results.

## Stop Conditions

Stop for owner review if:

- removing or redefining `teamAreaFreezeUsed` creates broad churn outside Plan 48;
- a quieter accessible chip requires a new app-wide accessibility utility decision;
- documenting cooldown in `turn-engine.md` reveals disagreement with implementation;
- any browser layout check shows the chip crowding the scoreboard on Chromebook-width screens.

## Ready Criteria

- `docs/GameSpecification.md` has no stale `areaFreezeUsedThisRound` wording.
- `docs/subsystems/turn-engine.md` documents Area Freeze cooldown and points to `src/core/areaFreeze.js`.
- The status chip is accessible without acting as a repeatedly rebuilt live region.
- All runtime readiness consumers use `isAreaFreezeReady()`.
- Added edge tests pass.
- `npm run lint:levels`, `npm test`, `npm run build`, and browser validation pass.
