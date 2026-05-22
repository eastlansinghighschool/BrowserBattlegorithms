# Plan 67: Own-Flag-Home Scoring Rule

- Packet id: Plan 67
- Packet title: Own-Flag-Home Scoring Rule
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-21
- Packet type: implementation
- Mutation level: source-code
- Approval gate: none; integration owner has approved the core design decision below
- Expected artifacts:
  - Core scoring rule change
  - Blocked-scoring feedback event/narration
  - Focused unit tests
  - Runtime-contract doc updates
  - Guided-level fallout report in the progress report
- Progress report folder: `reports/development/plan-67-own-flag-home-scoring-rule/`
- Progress report file: `reports/development/plan-67-own-flag-home-scoring-rule/progress.md`

## Packet Summary

Goal: Change scoring so a runner carrying the enemy flag can score only when that runner's own team flag is home and not being carried.

Non-goals:
- Do not reauthor guided levels in this packet.
- Do not tune NPC or Free Play CPU behavior in this packet.
- Do not add new Blockly blocks.
- Do not add a global scan that scores for runners whose turn did not just complete.
- Do not introduce mode-specific scoring rules.
- Do not reference other product versions or external variants of the game in docs, comments, tests, reports, or UI copy.

Depends on:
- Plan 46 carrier-vulnerability collision rule.
- Plan 47 optional double-carrier level.
- Plan 35/36 event-log and narration surfaces.
- Plan 55 level-result invariant.

Blocks:
- Plan 68 guided-level scoring-rule reauthoring.
- Plan 69 CPU scoring-rule adaptation.

Why this packet exists:
The current rule lets a team score while its own flag is being carried away. That makes double-carrier situations mostly a race home instead of a coordination problem. This packet makes flag defense matter: students should understand that a successful capture requires both carrying the enemy flag home and keeping or restoring their own flag.

## Approved Design Decision

Use this exact behavior:

- A carrier can score only when carrying the enemy flag, standing in its own base area, and its own flag is home and not carried.
- If the own flag is away, scoring is blocked. The carrier keeps the enemy flag. The turn continues normally after the completed action.
- If the own flag later returns home, the waiting carrier does not score during another runner's turn. The carrier can score on its own next completed turn while still in base.
- Do not scan all runners after every action to find parked carriers who can now score.

This preserves the existing one-runner-at-a-time turn model and avoids hidden scoring caused by another runner's action.

## Authority And Contracts

Required project contracts:
- Core rule outcomes belong in `src/core/`.
- Event production belongs in the engine/core event flow; factual narration consumes events.
- The one-action-per-turn execution model must remain intact.
- `mainGameState === GAME_OVER` must still coincide with a defined guided level result when in guided mode.
- If behavior described in `docs/subsystems/*.md` changes, the matching note must be updated in the same patch.
- The app must remain a static Vite deployment.

Do not redefine:
- Collision rules from Plan 46.
- Round reset behavior after an actual score.
- Flag pickup behavior.
- Guided level authoring or reference solutions.
- CPU strategy.

## Required Reading

Read before editing:
- `docs/GameSpecification.md`
- `docs/subsystems/turn-engine.md`
- `docs/subsystems/npc-and-cpu.md`
- `src/core/scoring.js`
- `src/core/turnEngine.js`
- `src/core/events.js`
- `src/ui/narration.js`
- `src/ui/scoreboard.js`
- `src/core/levels.js`
- `tests/unit/scoring-and-level-state.test.js`
- `tests/unit/narration-event-log.test.js`
- `tests/unit/turn-engine-resilience.test.js`

Use `rg` for current references to:
- `checkForScoring`
- `team.scored`
- `flag.pickedUp`
- `lastScoringTeam`
- `resetRound`
- `hasEnemyFlag`
- `isAtBase`
- `carriedByRunnerId`

## Scope

### In Scope

- Add the own-flag-home prerequisite to scoring.
- Add a focused helper if that makes the rule clearer and testable.
- Add a factual event for blocked scoring, such as `score.blocked`, with enough detail for narration and tests.
- Add concise narration/turn-log copy explaining that scoring was blocked because the team's own flag is away.
- Update `docs/GameSpecification.md` and `docs/subsystems/turn-engine.md`.
- Add tests for:
  - scoring still works when own flag is home
  - scoring is blocked when own flag is carried
  - scoring is blocked when own flag is away from base
  - blocked carrier keeps the enemy flag
  - blocked carrier can score on its own later completed turn after own flag returns home
  - blocked scoring emits/logs factual feedback
- Run full guided/reference validation to identify fallout, but do not repair authored levels here.

### Out Of Scope

- Reauthoring `optional-double-carrier-showdown`.
- Changing Level 28, Level 37, or any guided fixtures.
- Changing Free Play or guided NPC behavior.
- Adding a scoreboard flag-status widget.
- Adding new sounds or animations.
- Changing scoring thresholds, round reset, game-over, or usage export contracts except where directly caused by the scoring rule.
- Editing GitHub workflow files or deployment settings.

### Files And Areas Likely Touched

- `src/core/scoring.js`
- `src/core/events.js`
- `src/ui/narration.js`
- `docs/GameSpecification.md`
- `docs/subsystems/turn-engine.md`
- `tests/unit/scoring-and-level-state.test.js`
- `tests/unit/narration-event-log.test.js`
- possibly `tests/unit/narration-templater.test.js`
- possibly `tests/unit/turn-engine-resilience.test.js`

## Implementation Requirements

### 1. Scoring Guard

Required behavior:
- `checkForScoring(state, runner)` must return `false` when the runner's own flag is not home or is carried.
- The enemy flag remains carried by the runner when scoring is blocked.
- No score increments, round reset, goal burst, level result, or game-over transition should occur for a blocked score.
- Existing score behavior must remain unchanged when the own flag is home.

Constraints:
- Null-guard any flag lookup so partial unit-test states fail gracefully instead of throwing.
- Do not inspect UI mode. The rule is global.
- Do not score for runners other than the completed runner.

Edge cases:
- Own flag carried by an opponent.
- Own flag dropped or otherwise away from its initial/base state.
- Carrier already in base, own flag later returns, carrier completes a later turn while still in base.

### 2. Blocked-Scoring Feedback

Required behavior:
- When a carrier completes a turn in base but cannot score because its own flag is away, emit a factual event.
- Narration must make the rule visible in plain language.

Copy guidance:
- Use concise student-facing wording, for example: "Team 1 reached base with the enemy flag, but their own flag is away."
- Do not mention any other version of the game.
- Do not over-explain strategy in narration; this is factual feedback.

Constraints:
- Avoid duplicate blocked-score announcements if the implementation path calls scoring checks more than once in the same completed turn.
- Keep screen-reader and visible-turn-log behavior aligned with existing narration patterns.

### 3. Documentation

Required updates:
- `docs/GameSpecification.md` must state the own-flag-home scoring prerequisite.
- `docs/subsystems/turn-engine.md` must describe the blocked-score branch and confirm that only the completed runner is checked for scoring.

Constraints:
- Keep the docs phrased as Browser Battlegorithms rules, not comparisons to any external or alternate version.
- If any other subsystem note becomes false, update it or stop for review.

### 4. Guided Fallout Audit

Required behavior:
- Run the guided/reference/project tests listed below.
- Record any affected levels in the progress report.
- Do not fix level source or fixtures in this packet.

The progress report must explicitly mention:
- Whether Level 28, Level 37, and Level 39 pass or fail under the new rule.
- Any exact test failures that should be handed to Plan 68.
- Whether the packet is ready for integration alone or requires Plan 68 before integration.

## Work Plan

1. Inspect current scoring, event, narration, and turn-engine flow.
2. Implement the scoring guard and blocked-score event.
3. Add focused unit coverage.
4. Update the game spec and turn-engine subsystem note.
5. Run targeted validation.
6. Run broad unit and guided validation to identify authored-level fallout.
7. Write the progress report with exact failures, risks, and whether Plan 68 is required before integration.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/scoring-and-level-state.test.js tests/unit/narration-event-log.test.js tests/unit/narration-templater.test.js tests/unit/turn-engine-resilience.test.js
npm run lint:levels
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js
npm test
npm run build
```

Run browser tests only if narration/UI behavior changes need browser confirmation:

```powershell
npx playwright test tests/browser/aria-narration.spec.js tests/browser/guided-play.spec.js --reporter=line
```

## Validation Checklist

- [ ] Own-flag-home prerequisite is enforced globally.
- [ ] Existing scoring still works when own flag is home.
- [ ] Blocked carrier keeps the enemy flag.
- [ ] Blocked score does not increment score or reset the round.
- [ ] Blocked score produces factual feedback.
- [ ] Carrier can score on its own later completed turn after own flag returns home.
- [ ] No global parked-carrier scoring scan was added.
- [ ] `docs/GameSpecification.md` and `docs/subsystems/turn-engine.md` match runtime behavior.
- [ ] Guided-level fallout is reported, not silently repaired.
- [ ] `npm test` result is reported honestly.
- [ ] `npm run build` passes.
- [ ] No unrelated files were changed.

## Stop Conditions

Stop and report instead of broadening scope if:
- Implementing the rule appears to require scanning all runners after every action.
- The only way to avoid confusion appears to require a new UI widget beyond narration/turn log.
- Required guided levels fail in a way that requires reauthoring.
- Level 39 requires redesign.
- CPU behavior becomes necessary to make the core rule correct.
- Any source-of-truth doc would need a product decision not stated in this packet.

