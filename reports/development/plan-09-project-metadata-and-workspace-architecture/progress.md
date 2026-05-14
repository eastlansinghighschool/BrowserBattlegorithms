# Plan 09 Progress Report

## Summary

Implemented the shared-project workspace architecture for the two approved guided projects.

- Added project metadata to the guided project levels for `strategy-brain` and `team-strategy-script`.
- Preserved project metadata through `getLevelDefinitions()` and the guided level manifest.
- Switched guided Blockly persistence to use one shared latest workspace per project id.
- Kept ordinary guided per-level persistence unchanged.
- Kept Free Play persistence isolated from guided project workspaces.
- Preserved `Reset Level` behavior so board/runtime state resets while project code remains available.

Plan 09 intentionally did not add project-facing UI. That is reserved for the next packet.

## Files Changed

- [src/config/levels/shared/project.js](../../../src/config/levels/shared/project.js)
- [src/config/levels/index.js](../../../src/config/levels/index.js)
- [src/config/levels/manifest.js](../../../src/config/levels/manifest.js)
- [src/config/levels/phases/advanced-logic/level-23-closest-threat.js](../../../src/config/levels/phases/advanced-logic/level-23-closest-threat.js)
- [src/config/levels/phases/advanced-logic/level-24-how-far-away.js](../../../src/config/levels/phases/advanced-logic/level-24-how-far-away.js)
- [src/config/levels/phases/advanced-logic/level-25-two-conditions-at-once.js](../../../src/config/levels/phases/advanced-logic/level-25-two-conditions-at-once.js)
- [src/config/levels/phases/advanced-logic/level-26-this-or-that.js](../../../src/config/levels/phases/advanced-logic/level-26-this-or-that.js)
- [src/config/levels/phases/advanced-logic/level-27-flip-the-answer.js](../../../src/config/levels/phases/advanced-logic/level-27-flip-the-answer.js)
- [src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js](../../../src/config/levels/phases/advanced-logic/level-28-full-team-tactics.js)
- [src/config/levels/phases/advanced-teamplay/level-29-one-program-two-allies.js](../../../src/config/levels/phases/advanced-teamplay/level-29-one-program-two-allies.js)
- [src/config/levels/phases/advanced-teamplay/level-30-index-jobs.js](../../../src/config/levels/phases/advanced-teamplay/level-30-index-jobs.js)
- [src/config/levels/phases/advanced-teamplay/level-31-first-two-defend.js](../../../src/config/levels/phases/advanced-teamplay/level-31-first-two-defend.js)
- [src/config/levels/phases/advanced-teamplay/level-32-escort-the-carrier.js](../../../src/config/levels/phases/advanced-teamplay/level-32-escort-the-carrier.js)
- [src/config/levels/phases/advanced-teamplay/level-33-closest-enemy-defender.js](../../../src/config/levels/phases/advanced-teamplay/level-33-closest-enemy-defender.js)
- [src/config/levels/phases/advanced-teamplay/level-34-freeze-support.js](../../../src/config/levels/phases/advanced-teamplay/level-34-freeze-support.js)
- [src/config/levels/phases/advanced-teamplay/level-35-barrier-specialist.js](../../../src/config/levels/phases/advanced-teamplay/level-35-barrier-specialist.js)
- [src/config/levels/phases/advanced-teamplay/level-36-jump-team.js](../../../src/config/levels/phases/advanced-teamplay/level-36-jump-team.js)
- [src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js](../../../src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js)
- [src/ai/blockly/workspace.js](../../../src/ai/blockly/workspace.js)
- [tests/unit/guided-level-contracts.test.js](../../../tests/unit/guided-level-contracts.test.js)
- [tests/browser/persistence.spec.js](../../../tests/browser/persistence.spec.js)

## Artifacts

- None beyond the updated report itself.

## Validation

- `node --test --test-isolation=none tests/unit/guided-level-contracts.test.js` - passed
- `npx playwright test tests/browser/persistence.spec.js --reporter=line` - passed
- `npm test` - passed
- `npm run build` - passed with the repo’s existing Blockly chunk-size warnings
- `npm run test:browser` - passed

## Notes

- Guided project workspaces now use `bba:guided-project-workspace:<projectId>`.
- Ordinary guided levels still save per-level, and Free Play still uses its own separate keys.
- The project-capstone levels keep their current visible challenge framing for now; Plan 10 can add the student-facing project signifiers.
