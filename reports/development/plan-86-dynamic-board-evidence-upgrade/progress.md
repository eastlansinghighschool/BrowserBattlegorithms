# Progress Report: Plan 86 Dynamic Board Evidence Upgrade Repair

- Date: 2026-07-07
- Status: delivered (awaiting orchestration review)

## Repairs Completed

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
   * Added 5 new targeted synthetic test suites in `tests/unit/level-behavior-evidence.test.js` validating the repaired behaviors:
     1. Frozen NPC exclusion from timeline.
     2. Unfrozen stationary NPC detection.
     3. Near-miss range exclusion (distance-1 vs distance-2).
     4. Timeline window bounding and info notes.
     5. Derived action outcome checks (successful vs blocked).

5. **Regeneration of Evidence Files**:
   * Ran `npm run level:behavior-evidence` to regenerate all 46 level markdown files, `behavior-summary-index.md`, and `par-candidates.json`.

---

## Validation Commands Run

1. `node --test --test-isolation=none tests/unit/level-behavior-evidence.test.js`
   * **Result**: Passed (all 15 targeted tests passing successfully).
2. `npm run level:behavior-evidence`
   * **Result**: Passed (successfully generated all markdown files and `par-candidates.json`).
3. `npm test`
   * **Result**: Passed (all 421 unit tests passed).
4. `npm run build`
   * **Result**: Passed (clean client environment build).
5. `npm run lint:levels`
   * **Result**: Passed (no lint errors, only pre-existing format warnings).

*Note: `npm run level:dossiers` was intentionally skipped as no level definitions, concept matrices, or dossier schemas were mutated.*
