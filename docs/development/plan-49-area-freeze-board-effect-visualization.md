# Plan 49: Area Freeze Board Effect Visualization

## Packet Metadata

- Packet id: plan-49
- Packet title: Area Freeze Board Effect Visualization
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: implementation / rendering / accessibility / tests / docs
- Mutation level: source-code / tests / docs
- Approval gate: before changing freeze rules, cooldown timing, freeze radius/duration, scoring, collision behavior, or adding new dependencies
- Expected artifacts:
  - transient board effect when Area Freeze is used
  - visible flash/marking for affected runners
  - persistent frozen countdown badge near frozen runners
  - reduced-motion equivalent
  - updated p5 subsystem note/tests/progress report
- Progress report folder: `reports/development/plan-49-area-freeze-board-effect-visualization/`
- Progress report file: `reports/development/plan-49-area-freeze-board-effect-visualization/progress.md`

## Packet Summary

Goal: Make Area Freeze legible on the board. When a runner uses freeze, the board should show a short icy pulse from the caster, briefly flash affected opponents, and then keep a small frozen countdown badge near each frozen runner until they thaw.

Non-goals:

- Do not implement the cooldown rule or status chip; Plan 48 owns that.
- Do not change the Area Freeze radius or frozen duration.
- Do not change who gets frozen.
- Do not add sound effects unless an existing effect is already wired and simply continues to play.
- Do not add dependencies or server-side assets.
- Do not deploy.

Depends on:

- Plan 48 complete, or at minimum current freeze execution still emits/updates enough state to identify a freeze use.
- Existing p5 rendering contract in `docs/subsystems/p5-surface-map.md`.

Blocks:

- Visual classroom explanation of freeze timing and affected area.
- Future playtest tuning for freeze-heavy challenge levels.

Why this packet exists:

Area Freeze is currently an important tactical action whose state changes are easy to miss. Students benefit from seeing the causal chain: the caster spends the power, nearby opponents are hit, and frozen runners remain disabled for a visible number of turns. This reinforces resource timing and board-state tracing without adding a modal or interrupting the turn loop.

## Authority And Contracts

Sources of truth:

- `docs/GameSpecification.md`
- `docs/subsystems/p5-surface-map.md`
- `docs/subsystems/turn-engine.md`
- `src/core/turnEngine.js`
- `src/core/setup.js`
- `src/render/p5App.js`
- `src/render/drawBoard.js`
- `src/render/drawEntities.js`
- `src/entities/Runner.js`
- relevant browser/unit tests

Do not redefine:

- Render functions read state; they do not decide game rules.
- `draw()` is both simulation tick and paint pass. Do not put once-per-turn game logic directly in draw functions.
- Frozen runners already block space and thaw according to turn-engine rules.
- Visual effects must not affect collision, movement, scoring, or freeze readiness.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/subsystems/p5-surface-map.md`
- `docs/subsystems/turn-engine.md`
- `docs/GameSpecification.md` freeze sections after Plan 48
- `src/core/turnEngine.js` freeze execution path
- `src/core/setup.js` reset paths
- `src/render/p5App.js`
- `src/render/drawBoard.js`
- `src/render/drawEntities.js`
- `src/entities/Runner.js`
- `tests/browser/guided-play.spec.js`
- `tests/browser/guided-ui.spec.js`

Use `rg "freeze|frozenTurnsRemaining|goalBurstEffect|prefers-reduced-motion|drawEntities|drawBoard" src tests docs` before editing.

## Scope

### In Scope

- Add transient state for a freeze-use board effect.
- Render a short icy pulse from the caster that communicates the affected area.
- Briefly flash or outline affected runners.
- Render a small persistent frozen countdown badge near frozen runners.
- Respect reduced-motion preferences.
- Add focused tests where feasible and document any visual-only manual smoke requirement.
- Update `docs/subsystems/p5-surface-map.md`.
- Write the progress report.

### Out Of Scope

- Cooldown rule/state/chip.
- New freeze sounds.
- New SVG/image assets unless extremely small and justified.
- New dependencies.
- Guided level redesign.
- Deployment.

### Files And Areas Likely Touched

- `src/core/turnEngine.js`
- `src/core/setup.js`
- `src/core/state.js`
- `src/render/drawBoard.js`
- `src/render/drawEntities.js`
- `src/render/p5App.js`
- `src/entities/Runner.js` if badge positioning/glyph state belongs there
- `src/assets/styles/` only if a DOM overlay is chosen for some part of the effect
- `docs/subsystems/p5-surface-map.md`
- `tests/unit/` for effect-state creation/reset if pure state is added
- `tests/browser/` for visual state hooks or canvas-adjacent assertions
- `reports/development/plan-49-area-freeze-board-effect-visualization/progress.md`

## Product Decisions

### Decision 1: Use Three Layered Signals

Implement three distinct signals:

1. A short caster-origin pulse that shows the freeze area.
2. A brief affected-runner flash.
3. A persistent frozen countdown badge.

Rationale:

Each answers a different student question: "Who used it?", "Who got hit?", and "How long are they frozen?"

### Decision 2: Prefer A Diamond Pulse

Area Freeze currently uses Manhattan distance. A diamond-shaped pulse is more rule-honest than a circle because it matches grid distance better.

Required behavior:

- The pulse should visibly originate from the caster's cell.
- The pulse should reach cells within the current freeze radius.
- It should be subtle and short, roughly 400-700 ms.

If a diamond is too costly in p5, a low-opacity ring is acceptable only if the progress report documents the mismatch and the visual does not imply exact Euclidean range.

### Decision 3: Snowflake Badge, With Text/Count

Use the same visual language as Plan 48's chip: a blue-white snowflake icon may be used if it renders cleanly. The frozen-runner badge should include the remaining turns, such as `❄ 2` then `❄ 1`.

Required behavior:

- The badge remains while `runner.isFrozen` is true.
- The count reflects `runner.frozenTurnsRemaining`.
- The badge must not obscure the runner so much that position becomes unreadable.
- If emoji rendering is inconsistent in p5, use a simple drawn badge with ASCII/text fallback and document the choice.

### Decision 4: Reduced Motion Is Required

Students using reduced-motion settings must get equivalent information.

Required behavior:

- If `prefers-reduced-motion: reduce`, avoid expanding/pulsing animation.
- Show a static brief diamond/area highlight and affected-runner mark instead.
- The persistent frozen countdown badge remains unchanged.

## Implementation Requirements

### Requirement 1: Effect State Is Created By The Turn Engine

Required behavior:

- When Area Freeze is successfully used, record transient visual-effect state containing:
  - caster runner id/team
  - caster cell
  - affected runner ids and cells
  - radius
  - start time/frame or duration metadata
- If freeze is attempted while unavailable, do not create the effect.
- If no opponents are affected but the resource is successfully spent, still show the caster pulse so students can see the action happened.

Constraints:

- Render code must not recompute freeze legality or choose affected runners independently.
- Reset paths must clear transient freeze visual state.

### Requirement 2: Caster Pulse

Required behavior:

- Draw a pale blue-white area pulse centered on the caster cell.
- Prefer a diamond shape matching Manhattan radius.
- Keep it short and non-blocking.
- It must not hide the grid, flags, runners, or target highlights.

Constraints:

- Do not use a full-screen overlay.
- Do not mutate game state from render functions.

### Requirement 3: Affected Runner Flash

Required behavior:

- Affected runners receive a brief visual mark when the freeze lands.
- Use a frosty outline, sparkle, small snowflake mark, or cell flash.
- The mark should be redundant with the persistent badge, not the only signal.

Constraints:

- Do not rely solely on emoji glyph changes.
- Keep colors high contrast enough against board cells.

### Requirement 4: Persistent Frozen Countdown Badge

Required behavior:

- While any runner is frozen, draw a small badge near that runner.
- Badge includes remaining frozen turns.
- Badge works for human, ally, and NPC runners.
- Badge should not be mirrored incorrectly with runner emoji transforms.

Constraints:

- Frozen auto-skip guided humans may already appear frozen indefinitely. If `frozenTurnsRemaining` is infinite, show a simple snowflake badge without a numeric countdown or otherwise document the chosen display.
- Do not make the badge look like an action button.

### Requirement 5: Tests And Docs

Required behavior:

- Unit-test any pure helper that creates or clears freeze visual-effect state.
- Add browser coverage or test hooks where feasible to assert:
  - successful freeze creates effect state
  - unavailable freeze does not create effect state
  - reset clears effect state
  - frozen runner countdown data is available to render
- Update `docs/subsystems/p5-surface-map.md` to describe freeze pulse/badge ownership.
- Progress report must include whether a manual visual smoke was performed and what was observed.

Constraints:

- Do not write brittle pixel-perfect canvas tests.
- Prefer state/test-hook assertions plus manual smoke notes for visual polish.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/free-play-contracts.test.js tests/unit/conditions.test.js tests/unit/display-and-controls.test.js
npm test
npm run build
npx playwright test tests/browser/guided-play.spec.js --reporter=line
npx playwright test tests/browser/guided-ui.spec.js --reporter=line
npm run test:browser
```

If the implementation adds a dedicated browser spec, run that spec directly before the broader browser suite.

## Validation Checklist

- [ ] Successful Area Freeze creates transient visual-effect state.
- [ ] Unavailable freeze attempt does not create pulse/flash state.
- [ ] Pulse communicates caster location and affected area.
- [ ] Affected runners flash briefly.
- [ ] Frozen runners show persistent badge/count while frozen.
- [ ] Infinite/auto-skip frozen runners have a sensible display.
- [ ] Reduced-motion mode avoids expanding/pulsing animation while preserving information.
- [ ] Reset, level switch, round reset, and mode switch clear transient effect state.
- [ ] No game rules are computed in render functions.
- [ ] `docs/subsystems/p5-surface-map.md` still reads true.
- [ ] Targeted tests pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Browser tests pass or unrelated flakes are documented with focused reruns.
- [ ] Progress report includes manual visual smoke notes if pixel-perfect automation is not practical.

## Stop Conditions

Stop and report for owner review if:

- The visual effect requires changing freeze rule semantics.
- A p5 emoji snowflake renders inconsistently enough to require a non-emoji art direction decision.
- Reduced-motion support cannot be implemented cleanly.
- The badge obscures board state in common viewport sizes.
- The only reliable implementation requires DOM overlays instead of p5 and that creates positioning/responsiveness tradeoffs not covered here.
- Browser tests become brittle around canvas pixels and need a different validation strategy.
