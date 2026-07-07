# Progress Report: Plan 86 Dynamic Board Evidence Upgrade Repair

- Date: 2026-07-07
- Status: delivered (awaiting orchestration review)

## Repairs Completed

### First Pass Repairs
1. **Separation of Frozen/Static NPCs**:
   * Modified `runBehaviorSimulation` to ignore frozen NPCs in `npcMovementTimeline`.
   * Added `staticFrozenNpcs` section in per-level markdown files to print frozen statues exactly once per run.
   * Proved that frozen statue levels report `live enemy count` as `0` and `movement-timeline present` as `no` (e.g. Level 1).
   * Verified that unfrozen stationary NPCs (e.g. with `cpuBehavior: "GUIDED_STAY_STILL"`) are correctly logged in the timeline showing stayed/still.

2. **Evidence Bounding Window**:
   * Standardized `isEventInWindow` to check `currentTurn <= 15`, which maps exactly to the first 15 own-turns of the player runner.
   * Appended the info note `"later events omitted after evidence window"` to the interaction timeline if any events past turn 15 were omitted.
   * Omitted late near-misses and other interactions past turn 15 while retaining scoring tail events.

3. **Truthful Action Outcomes**:
   * Implemented a position-difference and event-driven action outcome resolver in `levelBehaviorEvidence.js`.
   * Maps successful movements to `"moved"` or `"jumped"` instead of the animation-related `"illegal_noop"`.
   * Successfully maps blocked movements to `"bounced"`, skipped frozen turns to `"skipped_frozen"`, freeze usages to `"freeze_applied"`, and barrier placements to `"barrier_placed"`.

4. **Synthetic Unit Tests**:
   * Added 5 new targeted synthetic test suites in `tests/unit/level-behavior-evidence.test.js` validating the repaired behaviors.

### Second Pass Repairs (Stable Generated Evidence)
1. **Block Coverage ID Stabilization**:
   * Replaced random workspace-generated Blockly block IDs with traversal-based deterministic semantic IDs (e.g. `on_each_turn_1`, `move_forward_1`) in `getBlockCoverage`.
   * Walks the executable workspace blocks in a stable recursive depth-first traversal order starting from the `On Each Turn` root.
   * Maps trace steps' raw workspace IDs to their corresponding stable IDs deterministically.
   * Ensures that repeated generation runs are completely byte-stable, introducing 0 noisy git diffs when source inputs are unchanged.
2. **Stability Regression Test**:
   * Added a targeted regression test (`synthetic: repeated simulation runs produce stable/identical block coverage IDs`) verifying that repeated runs produce stable, identical IDs matching the semantic format.

---

## Validation Commands Run

1. `node --test --test-isolation=none tests/unit/level-behavior-evidence.test.js`
   * **Result**: Passed (all 16 targeted and stability tests passed successfully).
2. `npm run level:behavior-evidence` followed by a second `npm run level:behavior-evidence`
   * **Result**: Passed. The second run produced `0` git changes/diffs on behavior evidence files, confirming complete stability.
3. `npm test`
   * **Result**: Passed (all 422 unit tests passed).
4. `npm run build`
   * **Result**: Passed (clean production build).
5. `npm run lint:levels`
   * **Result**: Passed (clean check).

*Note: `npm run level:dossiers` was intentionally skipped as no level definitions, concept matrices, or dossier schemas were mutated.*
