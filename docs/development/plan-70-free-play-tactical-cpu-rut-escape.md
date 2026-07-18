---
id: plan-70
title: "Free Play Tactical CPU Rut Escape"
status: complete
depends_on: []
gate: "none for bounded Free Play tactical CPU tuning; stop for broader pathfinding or guided NPC changes"
superseded_by: null
resolution: "Completed and verified; see progress report."
summary: >-
  Add a bounded rut-escape behavior for Free Play Tactical CPU runners using existing recent movement state.
---
# Plan 70: Free Play Tactical CPU Rut Escape

- Packet id: Plan 70
- Packet title: Free Play Tactical CPU Rut Escape
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-05-21
- Packet type: implementation
- Mutation level: source-code
- Approval gate: none for bounded Free Play tactical CPU tuning; stop for broader pathfinding or guided NPC changes
- Expected artifacts:
  - Tactical CPU rut-detection behavior using existing recent movement state
  - Focused tests
  - NPC subsystem documentation update
  - Progress report
- Progress report folder: `reports/development/plan-70-free-play-tactical-cpu-rut-escape/`
- Progress report file: `reports/development/plan-70-free-play-tactical-cpu-rut-escape/progress.md`

## Packet Summary

Goal: Reduce repetitive Free Play Tactical CPU ruts by making stuck tactical CPU runners temporarily choose legal escape movement using the existing recent-movement state from Plan 65.

Non-goals:
- Do not implement A*, breadth-first search, or other full pathfinding.
- Do not change guided teaching NPC behavior.
- Do not change Easy CPU's intentionally random personality.
- Do not add new Blockly blocks or expose new student-facing state.
- Do not change scoring, collision, freeze, jump, barrier, or movement legality rules.
- Do not change guided level source or fixtures.

Depends on:
- Plan 65 Free Play recent-state boolean blocks and `src/core/recentMovement.js`.

Blocks:
- None, but this improves Free Play before more advanced CPU work.

Why this packet exists:
Students have observed tactical CPU opponents bouncing between the same two or three cells around map inlets and obstacles. The browser version should still keep CPU behavior readable and lightweight, but Tactical opponents should recover from obvious local ruts so Free Play feels less brittle and more strategically alive.

## Authority And Contracts

Required project contracts:
- Free Play CPU behavior belongs in `src/ai/npc/freePlayCpu.js`.
- Guided teaching NPC behavior is separate from Free Play CPU behavior and should remain deterministic/readable unless a level explicitly opts into a named guided exception.
- Existing movement legality remains owned by `src/core/movement.js`.
- Existing recent movement state remains owned by `src/core/recentMovement.js`.
- Random behavior must be testable through `state.randomFn`.
- If `docs/subsystems/npc-and-cpu.md` becomes stale, update it in the same patch.

Do not redefine:
- Plan 65 student-facing recent-state block semantics.
- Easy CPU behavior.
- Tactical attacker/defender role assignment.
- Guided level behavior.

## Required Reading

Read before editing:
- `docs/subsystems/npc-and-cpu.md`
- `docs/subsystems/turn-engine.md`
- `docs/GameSpecification.md`
- `src/ai/npc/freePlayCpu.js`
- `src/ai/npc/pathing.js`
- `src/core/recentMovement.js`
- `src/core/movement.js`
- `src/core/teams.js`
- `src/config/constants.js`
- `tests/unit/free-play-contracts.test.js`
- `tests/browser/free-play.spec.js`

Use `rg` for:
- `FREE_PLAY_TACTICAL_ATTACKER`
- `FREE_PLAY_TACTICAL_DEFENDER`
- `calculateFreePlayCpuAction`
- `hasRunnerBeenStuckForTurns`
- `recentMovementState`
- `state.randomFn`

## Scope

### In Scope

- Detect when a Free Play Tactical CPU runner has been stuck in a small local area for a threshold number of its own turns.
- Temporarily choose legal escape movement for a small number of turns.
- Prefer legal movement that leaves the recent local area when possible.
- Use `state.randomFn` for any random tie-breaks.
- Add unit tests covering attacker and defender escape behavior.
- Add or update browser coverage only if the behavior is not adequately covered by unit tests.
- Update `docs/subsystems/npc-and-cpu.md`.

### Out Of Scope

- Full pathfinding.
- Long-term route memory.
- New CPU difficulty modes.
- Student-facing block/toolbox changes.
- Guided NPC changes.
- Guided level repairs.
- Any rule changes in `src/core/`.

### Files And Areas Likely Touched

- `src/ai/npc/freePlayCpu.js`
- `docs/subsystems/npc-and-cpu.md`
- `tests/unit/free-play-contracts.test.js`
- possibly a new focused CPU unit test file
- possibly `tests/browser/free-play.spec.js`

## Implementation Requirements

### 1. Rut Detection

Required behavior:
- Use the existing recent movement state rather than inventing a second history tracker.
- A Tactical CPU runner should be considered in a rut when its recent end positions remain within the existing small local-area stuck definition for a chosen threshold.

Suggested defaults:
- Rut threshold: `4` own turns stuck.
- Escape duration: `2` own turns.

Constraints:
- Keep constants local and named clearly.
- Do not expose these constants as student-facing rules unless docs need a concise implementation note.
- Do not count global turns; this should be based on the runner's own recent movement history.

### 2. Escape Action Selection

Required behavior:
- During escape, choose legal cardinal movement.
- Prefer moves whose destination is outside the runner's recent local stuck area.
- If no such move exists, choose any legal movement.
- If no legal movement exists, fall back to `STAY_STILL`.

Constraints:
- Do not choose jump, barrier, or freeze as part of this rut escape packet. Special ability polish is Plan 71.
- Keep behavior deterministic under a pinned `state.randomFn`.
- Do not mutate core movement legality.

### 3. Role Preservation

Required behavior:
- Tactical Attacker and Tactical Defender should return to their normal role behavior after the short escape window.
- Easy CPU should remain unchanged.
- Guided NPCs and guided exception behaviors should remain unchanged.

### 4. Tests

Required tests:
- Tactical Attacker in a local rut chooses a legal escape movement instead of repeating the normal stuck path.
- Tactical Defender in a local rut chooses a legal escape movement.
- Escape prefers a move outside the recent local area when available.
- Escape falls back to legal movement or `STAY_STILL` when boxed in.
- Pinned `state.randomFn` makes tie-breaks deterministic.
- Easy CPU behavior remains unchanged.

## Work Plan

1. Inspect current recent movement state and tactical CPU decision flow.
2. Implement the smallest rut-escape helper inside or near `freePlayCpu.js`.
3. Add focused tests with pinned random behavior.
4. Update `docs/subsystems/npc-and-cpu.md`.
5. Run targeted and broad validation.
6. Write the progress report with examples and any remaining risks.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js
npm test
npm run build
```

If browser coverage changes:

```powershell
npx playwright test tests/browser/free-play.spec.js --reporter=line
```

## Validation Checklist

- [ ] Free Play Tactical CPU rut detection uses existing recent movement state.
- [ ] Tactical Attacker rut escape is covered.
- [ ] Tactical Defender rut escape is covered.
- [ ] Easy CPU behavior is unchanged.
- [ ] Guided NPC behavior is unchanged.
- [ ] Random tie-breaks are pinned by `state.randomFn` in tests.
- [ ] `docs/subsystems/npc-and-cpu.md` matches runtime behavior.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and ask for owner review if:
- The only effective fix appears to require full pathfinding.
- The implementation needs broad persistent route memory.
- Guided NPCs would need to change.
- The escape behavior starts using special abilities; that belongs to Plan 71.
- The change breaks existing Free Play Tactical role expectations.
