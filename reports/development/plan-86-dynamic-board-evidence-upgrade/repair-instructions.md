# Plan 86 Repair Instructions

Date: 2026-07-07

Reviewer: Codex orchestration review

Status after review: **not accepted yet**. The packet was set back from `complete` to `delivered` using `npm run plan:set -- plan-86-dynamic-board-evidence-upgrade delivered` so it no longer appears orchestrator-verified.

## Summary

The implementation made real progress and the focused test file currently passes, but the generated evidence is not reliable enough for downstream campaign-rewrite decisions. The main failure mode is that statue/frozen boards are being reported as if they have live enemy movement, and interaction timelines are not bounded as the packet required. This would directly mislead Plan 92/93 level-design work.

Repair this packet before it is accepted.

## Required Repairs

### 1. Restore closeout discipline

Required:

- Create the required progress report at `reports/development/plan-86-dynamic-board-evidence-upgrade/progress.md`.
- Leave packet status as `delivered` when reporting back. Implementers should not set their own work to `complete`; orchestration review will do that after verification.
- The progress report must mention all commands actually run, including whether `npm test`, `npm run level:dossiers`, and `npm run build` were run or intentionally skipped.

Evidence:

- The packet requires `reports/development/plan-86-dynamic-board-evidence-upgrade/progress.md`.
- At review time that file did not exist.

### 2. Separate frozen/static NPC evidence from live movement timelines

Current problem:

- Frozen NPCs are being logged once per frozen turn in `npcMovementTimeline`.
- The summary index derives `live enemy count` from `npcMovementTimeline`, so frozen statue levels report live enemies and `movement-timeline present: yes`.
- Example: `reports/development/guided-level-complexity-audit/behavior-evidence/01-move-to-target.md` shows two frozen NPCs repeated in `Enemy Movement Timeline`, and `behavior-summary-index.md` reports `live enemy count` as `2` for `move-to-target`.

Required:

- Do not add `skipped_frozen` runners to `npcMovementTimeline`.
- Represent frozen NPCs as static rows once per run, with id, behavior, cell, and frozen status.
- Keep unfrozen stationary enemies distinct from frozen enemies. An unfrozen `GUIDED_STAY_STILL` runner may appear as live/static-acting evidence, but it must not be confused with `isFrozen`.
- `live enemy count` should count unfrozen enemy NPCs/runners relevant to the run, not frozen statues.
- `movement-timeline present` should be `yes` only when the run has actual live/unfrozen NPC timeline rows.

Tests to add:

- Synthetic or fixture-level test proving a level with only frozen enemies reports `live enemy count` 0, `movement-timeline present` no, and static frozen NPC details once rather than per turn.
- Synthetic or fixture-level test proving an unfrozen stationary NPC is not misclassified as frozen.

### 3. Enforce the intended timeline window

Current problem:

- The packet required interaction timelines to be bounded to roughly the first 15 own-turns plus a final-tail note if later events matter.
- `runBehaviorSimulation()` computes `playerOwnTurnCount` from `ownTurnCounts[playerRunner.id]`, but that counter is never incremented for the player/reference runner. As a result, `isEventInWindow` stays true and project/challenge files can emit near-miss rows deep into the run.
- Example: `reports/development/guided-level-complexity-audit/behavior-evidence/44-advanced-scrimmage.md` contains near-miss rows well past turn 50.

Required:

- Track the intended window explicitly. Prefer a per-run count of reference-controlled own-turns, or a clearly documented global evidence-window counter.
- Interaction timelines should include:
  - events within the bounded window
  - final scoring/result tail events if needed
  - a short note such as `later events omitted after evidence window` when relevant
- Avoid unbounded repeated near-miss rows.

Tests to add:

- Synthetic test proving distance-1 near-miss is included and distance-2 is not.
- Synthetic test proving near-miss/interactions after the evidence window are omitted except for allowed final-tail events.
- Synthetic test proving event order is stable for collision/bounce/flag events on the same turn.

### 4. Fix or relabel misleading action outcomes

Current problem:

- The generated reference-action summaries report normal successful moves as `illegal_noop`.
- Example: `move-to-target` passes in 3 turns, but every `MOVE_FORWARD` action in the reference action summary is shown as `illegal_noop`.
- This appears to come from the engine event's current `runner.actionResolved` outcome for animated moves. Whether that is a pre-existing runtime-event issue or a Plan 86 derivation issue, the evidence artifact should not present misleading outcomes as student/program behavior evidence.

Required:

- Do not present `illegal_noop` as the movement outcome for successful animated movement.
- Either derive a truthful evidence outcome from before/after runner positions and known collision/bounce events, or rename the field so it is clear it is a raw engine outcome event and not the actual movement result.
- Prefer truthful derived evidence for this packet, since downstream readers need to know what actually happened.

Tests to add:

- A passing movement fixture should show a successful movement-derived outcome, not `illegal_noop`.
- A genuinely illegal/no-op action should still be distinguishable.

### 5. Strengthen tests to match the packet

Current problem:

- The focused tests pass, but they mostly assert that sections exist in real generated evidence.
- The packet explicitly required synthetic/authored tests for timeline rows, event ordering, near-miss distance behavior, trace-observed execution ratio, naive fixture present/absent handling, par-candidates shape, and summary-index compatibility.

Required:

- Add focused tests that directly cover the repaired behavior above.
- It is okay to keep real-level smoke assertions, but they are not enough by themselves.

### 6. Regenerate all affected artifacts

Required:

- Rerun `npm run level:behavior-evidence` after repairs.
- Regenerate all 46 behavior evidence files, `behavior-summary-index.md`, and `par-candidates.json` together.
- Confirm the summary index remains additive and keeps existing prior-audit links intact.

Spot-check after regeneration:

- `move-to-target` should not report frozen enemies as live movement.
- `enemy-nearby` should not report frozen enemies as a movement timeline.
- `dodge-and-deliver` should still show meaningful live enemy movement.
- `advanced-scrimmage` should not contain unbounded near-miss spam past the evidence window.

## Required Validation Before Re-Report

Run from the repo root:

```powershell
node --test --test-isolation=none tests/unit/level-behavior-evidence.test.js
npm run level:behavior-evidence
npm test
```

If source/tooling changes affect packet status or generated index behavior, also run:

```powershell
npm run plan:lint
```

If `npm test` is skipped because of time, say so explicitly in the progress report and list the narrower commands that did run.

## Review Notes

- This packet should remain evidence/tooling-only. Do not change guided level source, reference fixtures, engine semantics, NPC behavior, or Blockly interpreter behavior unless the repair proves the evidence cannot be made truthful without a separate runtime packet.
- If a runtime event outcome bug is discovered while repairing action-outcome reporting, document it as a separate follow-up unless a very small and clearly safe fix is already covered by another active runtime packet.
