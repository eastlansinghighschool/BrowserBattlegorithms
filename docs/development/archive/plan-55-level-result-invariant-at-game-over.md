# Plan 55: Level Result Invariant At Game Over

## Packet Metadata

- Packet id: plan-55
- Packet title: Level Result Invariant At Game Over
- Status: complete
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: bugfix / engine-invariant / source-code / tests / docs
- Mutation level: source-code / tests / docs
- Approval gate: before changing any scoring rule, changing `pointsToWin` for any level, or modifying how authored win conditions are defined
- Expected artifacts:
  - engine invariant enforced: whenever `mainGameState === GAME_OVER`, `activeLevelResult` is a defined terminal value (PASSED or FAILED), never `IN_PROGRESS` or null
  - centralized check in `src/core/levels.js`'s `evaluateLevelProgress` (or equivalent seam) that fails the level to `FAILED` when match ends without the level's own win condition being satisfied
  - clear failure reason recorded on the safety-net branch so narration, learning-moment classification, and debugging all read correctly
  - new Plan 35 event kind logged when the safety net fires, for observability
  - regression test reproducing the Level 29 scenario (wrong-runner scoring) and asserting level transitions to FAILED
  - regression test for at least one other potentially-affected level, identified during the work
  - optional linter contract flagging level designs that combine runner-specific win conditions with low `pointsToWin` (Tier 2)
  - subsystem doc update in `docs/subsystems/turn-engine.md` documenting the new invariant
  - progress report
- Progress report folder: `reports/development/plan-55-level-result-invariant-at-game-over/`
- Progress report file: `reports/development/plan-55-level-result-invariant-at-game-over/progress.md`

## Packet Summary

Goal: Close an engine-level dead-end where a guided level's match transitions to `GAME_OVER` via the scoring path while the level's own win condition has not been satisfied. Today this leaves the level result in `IN_PROGRESS`, scoring at e.g. `{1: 1, 2: 0}`, with no current-turn indicator and no level-pass or level-fail screen. The player cannot edit code, cannot resume play, and cannot complete the level — only the Reset Level button recovers.

This was discovered on Level 29 (`one-program-two-allies`) by a 2026-05-18 pilot student. The level's win condition is tied to runner index 0 (`runner_1_AI_AllyP1`), but `pointsToWin: 1` and a stock scoring rule mean any team-1 ally reaching the enemy flag triggers match `GAME_OVER`. When the wrong ally scored, the level entered limbo: scored, match ended, no level result.

An investigation on the same day confirmed this is **distinct from** the recently-fixed Level 28 turn-engine recovery (orphaned `PROCESSING_ACTION` with no queued action). Same visible symptom — frozen UI, no current-turn highlight, only Reset Level recovers — different root cause. Plan 55 addresses the level-result mismatch class.

The fix is small and general: enforce the invariant that whenever `mainGameState === GAME_OVER`, `activeLevelResult` is a defined terminal value. Any multi-ally level with a runner-specific win condition and a low `pointsToWin` could hit this; the engine-level safety net defends against all such cases without per-level authoring changes.

Non-goals:

- Do not change the Level 29 win condition. The "runner index 0 must score" rule is intentional pedagogy.
- Do not change `pointsToWin` for any level.
- Do not change any scoring rule (collision priority, flag pickup, point award, etc.).
- Do not change the Plan 28 turn-engine recovery added in `src/core/turnEngine.js` for orphaned `PROCESSING_ACTION` state. That fix is keeper and addresses a separate orphan condition.
- Do not change Plan 36 narration text. The existing "Level failed" narration is invoked by this packet's new transition; no new wording is authored.
- Do not extend Plan 37 learning-moment classification with a `wrong_runner_scored` kind in this packet. That is a future-directions opportunity for Plan 38 coaching but is out of scope here.
- Do not author new levels, bug hunts, or prediction levels around this case.
- Do not deploy.

Depends on:

- Plan 35 event log (`src/core/events.js`) for the new event kind that records when the safety net fires.
- Existing `evaluateLevelProgress` in `src/core/levels.js` (per the 2026-05-18 implementer investigation at lines 605-674) as the centralized seam for the fix.
- Existing scoring path in `src/core/scoring.js` (lines 55-60) which sets `currentTurnState` and `mainGameState` to `GAME_OVER`.
- Existing turn-engine post-scoring flow in `src/core/turnEngine.js` (lines 368-438) which calls `evaluateLevelProgress` after scoring.

Blocks:

- Pilot reliability. Any pilot session that exposes Level 29 (or any similar level) to students can repeat the lockup. This packet closes that vulnerability for the class, not just for Level 29.
- Future authoring of multi-ally levels with runner-specific win conditions — once this engine invariant is in place, authors don't have to think about the dead-end case.

Why this packet exists:

Two pilot sessions on 2026-05-17 and 2026-05-18 produced lockups that required Reset Level recovery. The first (Level 28, frozen human runner) was traced to an orphaned `PROCESSING_ACTION` turn state with no queued action; an implementer added a recovery path in `processTurnActions()` and a regression test on 2026-05-17. The second (Level 29, wrong-ally scoring) initially looked like the same bug — same symptom — but the 2026-05-18 investigation showed a different root cause:

- Scoring code at [src/core/scoring.js:55-60](src/core/scoring.js#L55) sets `mainGameState === GAME_OVER` when a team reaches `pointsToWin`.
- `evaluateLevelProgress` at [src/core/levels.js:605-674](src/core/levels.js#L605) returns `null` (no transition) when the named `runnerId` in the win condition hasn't satisfied the condition.
- The turn engine respects `mainGameState === GAME_OVER` at [src/core/turnEngine.js:634-636](src/core/turnEngine.js#L634) and stops processing turns.

Together: match ends, level doesn't transition, UI halts. Reset Level is the only escape.

The implementer's broader observation is the load-bearing insight: **the bug is a class, not an instance.** Any multi-ally level with a runner-specific win condition and low `pointsToWin` can hit this. The fix should be class-level — an engine invariant — not per-level patching.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-18):

### Decision 1: The invariant — `GAME_OVER` implies defined level result

Once a guided-mode match enters `mainGameState === MAIN_GAME_STATES.GAME_OVER`, `state.activeLevelResult` must be a defined terminal value: `LEVEL_RESULT.PASSED` or `LEVEL_RESULT.FAILED`. It must never remain `IN_PROGRESS` (or null, or undefined). This invariant holds across every cause of `GAME_OVER` — scoring threshold reached, turn limit exceeded, failure condition fired, future causes.

The invariant is enforced centrally rather than at every transition site. Centralized enforcement: one place to read, one place to maintain, one place to test.

### Decision 2: Safety-net location — `evaluateLevelProgress` in `src/core/levels.js`

The fix lives in `evaluateLevelProgress` (per the 2026-05-18 investigation, lines 605-674). The function gains a new branch executed after all existing win-condition and failure-condition checks:

```
// Safety net: if the match has ended but the level result is still IN_PROGRESS,
// force the level to FAILED. This guards against authored mismatches where
// scoring triggers GAME_OVER but the level's own win condition wasn't satisfied
// (e.g., Level 29 with runner-specific win condition and pointsToWin: 1, when
// the wrong ally scored).
if (state.mainGameState === MAIN_GAME_STATES.GAME_OVER) {
  if (state.activeLevelResult === LEVEL_RESULT.IN_PROGRESS || !state.activeLevelResult) {
    state.lastLevelResultReason = "match_ended_without_level_win_condition_satisfied";
    return LEVEL_RESULT.FAILED;
  }
}
```

The exact code shape is the implementer's call; the contract is: when `evaluateLevelProgress` returns control to its caller, the invariant must hold for any state where the match has ended.

The implementer may choose to factor the check into a small helper (e.g., `enforceLevelResultInvariant(state)`) that can be called from any future GAME_OVER-causing site without re-deriving the rule. Optional but recommended.

### Decision 3: Failure attribution — clear, narration-friendly reason string

The new failure path records a distinct `lastLevelResultReason`: `"match_ended_without_level_win_condition_satisfied"` (or shorter equivalent that the implementer chooses, documented in the progress report).

Rationale:

- Plan 36 narration already reads `lastLevelResultReason` for level-result wording. A distinct reason lets narration distinguish "you failed by running out of turns" from "you failed because your program scored, but not in the way this level requires."
- Plan 37 learning-moment classification could later use this reason to fire a coaching moment specifically about runner-role assignment.
- Debugging: when a teacher reports a confused student, the event log + reason string makes diagnosis fast.

The exact reason string is the implementer's call; document the choice in the progress report.

### Decision 4: Observability — Plan 35 event when the safety net fires

When the new safety-net branch transitions the level to FAILED, emit a Plan 35 event with a new event kind: `level.forcedFailedAtGameOver` (or similar, implementer's call on naming).

Payload includes at minimum:

- `levelId` — which level hit the case
- `reason` — the `lastLevelResultReason` string
- `winConditionType` — the type of win condition the level declared
- `winConditionRunnerId` — if the win condition named a specific runner, that runner id
- `scoringTeam` — which team triggered the GAME_OVER scoring

Rationale: future occurrences leave a clear breadcrumb in the event log. Usage export already captures Plan 35 events, so this also gives the orchestrator visibility into how often the safety net fires in real classroom use. If the count climbs, that's a signal that more levels need authoring review or that the safety net is doing real work.

### Decision 5: Plan 36 narration — no new wording in this packet

The existing "Level failed" narration is invoked automatically when `activeLevelResult` transitions to `FAILED`. Plan 55 does not author new narration prose. If classroom evidence later shows students confused by the generic "Level failed" wording when this specific case fires, a future Plan 36 follow-up packet can author distinct phrasing (e.g., "Your program scored, but this level requires a specific runner to do the scoring. Try again with the right runner.") — but only with classroom evidence.

### Decision 6: Plan 37 learning-moment — deferred

A potential new `LearningMoment` kind `wrong_runner_scored` would let Plan 38 coaching prose surface targeted advice ("Did you mean to have runner 0 score? Try checking runner index before moving toward the flag."). This is **deferred** to a future packet. Plan 55's job is to close the lockup; pedagogy enrichment is a separate axis.

Document the deferral in the progress report and add a sentence to `docs/development/future-directions-analysis/` if a relevant note already exists, or create a small note (implementer's judgment on whether the note is worth a new file or a paragraph in an existing one).

### Decision 7: Tier 2 — optional linter contract

A new contract in `scripts/lint-levels.js`, severity WARNING:

- **`level-runner-specific-win-condition-needs-failsafe`** — fires when a level's `winCondition` names a specific `runnerId` (rather than any runner satisfying the condition) AND `pointsToWin <= 1` AND the level allows more than one team-1 runner to potentially reach the win cell.

Rationale: surfaces the authoring class that's vulnerable to this case. The engine safety net catches the bug at runtime; the linter surfaces it at authoring time so the author can decide whether the strict scoring rule is intentional or whether to relax the win condition.

This is Tier 2. The engine fix (Decisions 1-4) is Tier 1 and is required. The linter (Decision 7) is desirable but skippable if scope pressure surfaces. If skipped, document in the progress report as a future Plan 55-follow-up.

### Decision 8: Regression coverage

Two regression tests minimum, in `tests/unit/turn-engine-resilience.test.js` (the file the implementer created during the 2026-05-17 Level 28 fix) or in a new sibling file (implementer's call):

- **Level 29 wrong-runner scenario**: load Level 29, advance state so an ally OTHER than `runner_1_AI_AllyP1` reaches the enemy flag, assert that after the scoring resolution `state.mainGameState === GAME_OVER` AND `state.activeLevelResult === LEVEL_RESULT.FAILED` (not `IN_PROGRESS`).
- **At least one additional vulnerable level**: identified during implementer audit. If no other level can naturally trigger the same case, that's also a useful finding — document and skip this second test.

Test for the new Plan 35 event being emitted on the safety-net branch.

## Authority And Contracts

Sources of truth:

- `src/core/scoring.js` — scoring path; sets `currentTurnState` and `mainGameState` to `GAME_OVER` when pointsToWin is reached
- `src/core/turnEngine.js` — post-scoring flow that calls `evaluateLevelProgress`; the existing Level 28 recovery for `PROCESSING_ACTION` orphan state
- `src/core/levels.js` — `evaluateLevelProgress` is the fix seam
- `src/core/events.js` — Plan 35 event emitter; receives the new event kind
- `src/config/constants.js` — `MAIN_GAME_STATES`, `LEVEL_RESULT`, `TURN_STATES` enums
- `docs/subsystems/turn-engine.md` — runtime contract for the turn-engine state machine
- `tests/unit/turn-engine-resilience.test.js` — the regression home for both Plan 28's recovery and Plan 55's safety net (or a sibling file if the implementer prefers)

Required product contracts:

- After Plan 55 lands, no path through guided-mode play can leave the game in `mainGameState === GAME_OVER` with `activeLevelResult === IN_PROGRESS` (or null/undefined).
- The Level 29 wrong-runner scenario produces a clear FAILED outcome with a distinct reason string.
- Plan 35 event log records the safety-net firing with diagnostic payload.
- Plan 36 narration correctly announces level failure on the safety-net path (using existing wording).
- Plan 28's `PROCESSING_ACTION` recovery in `processTurnActions` continues to work; Plan 55 does not modify it.
- All existing tests pass unchanged.
- The app remains a static Vite deployment.

Do not redefine:

- Any scoring rule.
- Any level's `winCondition` or `pointsToWin`.
- The semantic of `MAIN_GAME_STATES.GAME_OVER` (it still means "match has ended; no more turns will be processed").
- The semantic of `LEVEL_RESULT.IN_PROGRESS` (it still means "level has not yet reached a terminal state") — but it becomes impossible to observe alongside `GAME_OVER`.
- Plan 35 event log shape; only add a new event kind.
- Plan 36 narration wording.
- Plan 37 learning-moment kinds.
- Reset Level button behavior.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/subsystems/turn-engine.md` — runtime contract for the turn-engine state machine
- `docs/subsystems/blockly-workspace.md` — for context on the workspace's role during GAME_OVER
- `src/core/scoring.js` — focus on the scoring-to-GAME_OVER transition at lines 55-60
- `src/core/turnEngine.js` — focus on lines 368-438 (post-scoring + evaluateLevelProgress call) and lines 634-636 (GAME_OVER short-circuit); also read the recently-added Plan 28 recovery for context
- `src/core/levels.js` — focus on `evaluateLevelProgress` at lines 605-674; this is the fix seam
- `src/core/events.js` — existing event kinds, emission pattern
- `src/config/constants.js` — `MAIN_GAME_STATES`, `LEVEL_RESULT`, `TURN_STATES` enums; existing reason strings
- `src/config/levels/phases/advanced-teamplay/level-29-one-program-two-allies.js` — the canonical example
- `tests/unit/turn-engine-resilience.test.js` — the Plan 28 regression test, as a structural pattern for Plan 55's new tests
- `reports/development/plan-28-*` (or wherever Plan 28's recovery report lives) — for the orphaned-PROCESSING_ACTION context

Use `rg "evaluateLevelProgress|GAME_OVER|activeLevelResult|pointsToWin" src/core` to surface every site that interacts with the relevant state.

## Scope

### In scope

- Centralized safety-net branch in `evaluateLevelProgress` (or equivalent helper called from it) that enforces the Decision 1 invariant.
- Distinct `lastLevelResultReason` string for the safety-net path (Decision 3).
- New Plan 35 event kind `level.forcedFailedAtGameOver` (or similar) emitted on the safety-net branch (Decision 4).
- Regression test for Level 29 wrong-runner scenario.
- Regression test for at least one other vulnerable level identified during the work (or a documented finding that no other level is vulnerable).
- Test that the new Plan 35 event is emitted on the safety-net branch.
- Tier 2: optional linter contract `level-runner-specific-win-condition-needs-failsafe` (Decision 7). Skippable; document choice.
- Subsystem doc update in `docs/subsystems/turn-engine.md` documenting the invariant.
- Progress report including: the levels audited for vulnerability, the safety-net code shape, the reason string chosen, the event payload shape, and (if Tier 2 was implemented) the linter contract details.

### Files and areas likely touched

- `src/core/levels.js` (safety-net branch in `evaluateLevelProgress`)
- `src/core/events.js` (new event kind, optional — could also live as a new emission in `levels.js`)
- `src/config/constants.js` (only if a new reason-string constant or event-kind constant is added to a central enum; implementer's call)
- `tests/unit/turn-engine-resilience.test.js` (additions) OR `tests/unit/level-result-invariant.test.js` (new)
- `package.json` (if a new test file is created, add to `test:unit` allowlist)
- `scripts/lint-levels.js` (Tier 2 only)
- `tests/unit/level-lint.test.js` (Tier 2 only; new lint-contract fixtures)
- `docs/subsystems/turn-engine.md`
- `reports/development/plan-55-level-result-invariant-at-game-over/progress.md`

### Out of scope

- Any change to scoring rules.
- Any change to authored win conditions or pointsToWin values.
- Any change to Plan 28's `PROCESSING_ACTION` recovery in `processTurnActions`.
- Plan 36 narration text changes.
- Plan 37 learning-moment classification changes.
- Plan 38 coaching prose extension for the wrong-runner case (deferred).
- Authoring new levels around the case.
- Game rule changes of any kind.
- Renaming any existing state-machine constants.
- Deployment.

## Work Plan

1. Read every required-reading file. Confirm the exact line numbers cited by the implementer investigation against current code. Confirm Plan 28's recovery is in place and won't be affected by Plan 55's additions.
2. Audit guided levels for the vulnerability class. Run `rg "winCondition" src/config/levels` and filter to levels whose `winCondition` names a specific `runnerId`. Cross-reference `pointsToWin` for each. Build a list of levels that could hit the case.
3. Add the safety-net branch to `evaluateLevelProgress`. Implement Decision 3 reason string. Confirm existing tests pass (the branch should never fire in well-behaved scenarios).
4. Add the new Plan 35 event kind emission on the safety-net branch.
5. Author the Level 29 regression test. Confirm it fails on current code (proving the bug is reproducible) and passes after Step 3 lands.
6. Author the additional vulnerable-level regression test from the Step 2 audit, OR document the audit finding that no other level is vulnerable.
7. Update `docs/subsystems/turn-engine.md` with the new invariant.
8. Tier 2 (if scope allows): author the linter contract and its lint test fixtures. Run `npm run lint:levels` and verify behavior on the level set.
9. Run full validation. Write the progress report.

## Implementation Requirements

### Requirement 1: The safety-net branch (Decisions 1, 2, 3)

Required behavior:

- `evaluateLevelProgress` (or a helper it calls) checks at exit: if `state.mainGameState === MAIN_GAME_STATES.GAME_OVER` AND `state.activeLevelResult` is `IN_PROGRESS`, `null`, or `undefined`, set `state.activeLevelResult = LEVEL_RESULT.FAILED` AND set `state.lastLevelResultReason` to a distinct string identifying this branch.
- The reason string is consistent across all invocations of this safety net. Suggested: `"match_ended_without_level_win_condition_satisfied"`. Implementer may shorten; the contract is consistency.
- The check executes after all existing win-condition and failure-condition logic, so legitimate PASSED or FAILED transitions resolve first.

Constraints:

- The check must not change the level result for any case where the existing logic already produces a defined value. It only fills in the gap when the gap exists.
- The check must not change `mainGameState` (the match end is already correctly determined; only the level result is being filled in).
- The check must not retroactively change `teamScores` or any other state field.

### Requirement 2: Plan 35 event emission (Decision 4)

Required behavior:

- When the safety-net branch transitions the level to FAILED, emit a new Plan 35 event with the kind `level.forcedFailedAtGameOver` (or the implementer's chosen name, documented).
- Payload includes at minimum: `levelId`, `reason` (matches the reason string from Requirement 1), `winConditionType` (the type string from the level's `winCondition`), `winConditionRunnerId` (if the win condition names a runner), `scoringTeam` (which team triggered scoring; null or absent if GAME_OVER cause was not scoring).
- The event is emitted via the existing `emit(state, kind, payload)` function in `src/core/events.js`; no new emission mechanism.

Constraints:

- The new event kind appears in the event-kind enum or wherever Plan 35 maintains its catalog. Verify and update.
- Do not change any existing Plan 35 event payload shape.

### Requirement 3: Level 29 regression test

Required behavior:

- A unit test in `tests/unit/turn-engine-resilience.test.js` (additions) or `tests/unit/level-result-invariant.test.js` (new) that:
  - Loads Level 29.
  - Programmatically advances state so that `runner_1_AI_AllyP2` (the ally NOT named in the win condition) reaches the enemy flag cell.
  - Runs the scoring resolution.
  - Asserts `state.mainGameState === MAIN_GAME_STATES.GAME_OVER`.
  - Asserts `state.activeLevelResult === LEVEL_RESULT.FAILED`.
  - Asserts `state.lastLevelResultReason` equals the chosen Decision 3 reason string.
  - Asserts the new Plan 35 event was emitted with the expected payload fields populated.
- The test fails on current code (before the fix) and passes after the fix lands.

Constraints:

- The test uses the existing test-harness patterns (no new test infrastructure).
- The test does not depend on UI; it operates on `state` directly.
- If a new test file is created, add it to `package.json`'s `test:unit` allowlist.

### Requirement 4: Additional vulnerable-level audit and test

Required behavior:

- Audit all guided levels: any level whose `winCondition` names a specific `runnerId` AND has `pointsToWin <= 1` AND the level setup includes more than one team-1 runner that could reach the win cell.
- For at least one identified vulnerable level (other than Level 29), author a regression test asserting the safety net fires correctly.
- If the audit finds no other vulnerable level, document that finding in the progress report (with the audit query and result) and skip the second test.

Constraints:

- The audit is a one-time exhaustive sweep, not a heuristic.
- Do not change any audited level's design. Authored intent is preserved; the engine fix is what catches the case.

### Requirement 5: Subsystem doc update

Required behavior:

- `docs/subsystems/turn-engine.md` gains a new section or paragraph describing the invariant: "Whenever `mainGameState === GAME_OVER`, `activeLevelResult` is a defined terminal value (PASSED or FAILED). The safety-net branch in `evaluateLevelProgress` enforces this when scoring causes GAME_OVER but the level's own win condition was not satisfied."
- The section names the new Plan 35 event kind and the reason string.
- The section cross-references Plan 28's `PROCESSING_ACTION` recovery as a related but distinct safety net (turn-engine state recovery vs. level-result transition).

Constraints:

- Match the existing heading style and tone.
- Do not move or rewrite existing sections beyond what the new content needs.

### Requirement 6: Optional Tier 2 linter contract (Decision 7)

Required behavior (only if implementing Tier 2):

- New contract `level-runner-specific-win-condition-needs-failsafe` in `scripts/lint-levels.js`, severity WARNING.
- Fires when:
  - `level.winCondition` includes a `runnerId` field (i.e., names a specific runner), AND
  - `level.pointsToWin` is `<= 1`, AND
  - the level setup includes more than one runner on the same team as the named runner.
- Warning message names the level, the named runner, and the risk: "match can end via scoring before the level's runner-specific win condition is satisfied; the engine safety net will fail the level but the author may prefer to relax the win condition or raise pointsToWin."
- Lint test fixtures in `tests/unit/level-lint.test.js` cover one passing case and one failing case.

Constraints:

- Severity is WARNING, not ERROR. The engine safety net handles the runtime case; the linter is an authoring nudge.
- Do not modify any existing levels in response to the new warning. Surfacing the warnings is the linter's job; deciding whether to act on them is curriculum work for a future packet.

### Requirement 7: Validation

Required behavior:

- All existing unit and Playwright tests continue to pass.
- `npm test` count increases by the number of new tests added (at least the Level 29 regression test; possibly a second vulnerable-level test; possibly Tier 2 lint fixtures).
- `npm run test:browser` continues to pass.
- `npm run lint:levels` continues to pass (Tier 2 may surface new warnings, which are documented).
- `npm run build` continues to pass.
- The progress report includes commands run with results.

## Commands

Run from the repository root:

```powershell
rg "winCondition|evaluateLevelProgress|GAME_OVER|activeLevelResult|pointsToWin" src/core --no-heading | head -50
node --test --test-isolation=none tests/unit/turn-engine-resilience.test.js
node --test --test-isolation=none tests/unit/level-result-invariant.test.js
node --test --test-isolation=none tests/unit/guided-level-contracts.test.js
node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js
node --test --test-isolation=none tests/unit/guided-project-solutions.test.js
node --test --test-isolation=none tests/unit/level-lint.test.js
npm run lint:levels
npm test
npm run test:browser
npm run build
```

If a new test file is created, run it directly first before the broader suite.

## Validation Checklist

- [ ] Safety-net branch lives in `evaluateLevelProgress` (or a centralized helper called from it).
- [ ] When `mainGameState === GAME_OVER` and `activeLevelResult` is `IN_PROGRESS`/null/undefined, the safety net transitions `activeLevelResult` to `FAILED`.
- [ ] `lastLevelResultReason` is set to a distinct, documented string on the safety-net branch.
- [ ] New Plan 35 event `level.forcedFailedAtGameOver` (or chosen name) is emitted with the documented payload fields.
- [ ] Level 29 regression test asserts the safety net fires correctly and that the Plan 35 event is emitted.
- [ ] Vulnerable-level audit completed; either a second regression test exists OR the audit finding is documented.
- [ ] `docs/subsystems/turn-engine.md` documents the new invariant and cross-references Plan 28's separate recovery.
- [ ] Tier 2 linter contract added OR explicitly skipped with rationale in progress report.
- [ ] `npm test` passes; new test files added to `test:unit` allowlist if needed.
- [ ] `npm run test:browser` passes.
- [ ] `npm run lint:levels` passes (any new Tier 2 warnings documented).
- [ ] `npm run build` passes.
- [ ] Plan 28's `PROCESSING_ACTION` recovery is untouched and continues to work.
- [ ] No scoring rule changed.
- [ ] No level definition changed.
- [ ] No narration text changed.
- [ ] No new game state introduced.

## Stop Conditions

Stop and report for owner review if:

- The audit (Requirement 4) finds a guided level that intentionally relies on the current `GAME_OVER + IN_PROGRESS` limbo (e.g., a level designed to "pause" the player after scoring). None should exist, but if found, surface for design review before introducing the safety net.
- The safety-net branch surfaces an unexpected interaction with the Plan 28 `PROCESSING_ACTION` recovery (e.g., both fire on the same turn and produce a conflicting state). Surface; the two safety nets should be orthogonal.
- The new Plan 35 event kind would conflict with an existing kind. Rename and document.
- The Level 29 regression test fails to reproduce the bug on current code. That would indicate the implementer investigation's hypothesis is wrong; revisit the diagnosis before implementing the fix.
- The Tier 2 linter contract surfaces many false positives. Reduce scope of the contract or skip Tier 2 entirely.
- Any change beyond the documented scope would be required.

## Notes For Future Self

- **The wrong-runner-scored learning moment** (Plan 37 extension) is a clean future packet. Plan 38 coaching could surface targeted advice the first time this case fires for a student: "Did you mean to have runner 0 score? Try checking the runner index before moving toward the flag." The event-log breadcrumb from Decision 4 is exactly the input that learning moment would need.
- **Narration enrichment** (Plan 36 follow-up) is similarly opportunistic. The generic "Level failed" string is fine for now; if classroom evidence shows students confused, author a distinct phrasing pegged to the `lastLevelResultReason` string from Decision 3.
- **More levels might be vulnerable** than the audit catches today, especially as new authoring lands. The Tier 2 linter contract is the durable defense against authoring drift; if Tier 2 is skipped in this packet, the next time a similar lockup is reported, that's the right moment to land it.
- **Plan 28's recovery and Plan 55's safety net** are now both in the engine. They guard different orphan states. Future implementers should not assume one subsumes the other. Keep both. The `turn-engine.md` subsystem doc names them explicitly to prevent confusion.
- **Reset Level button** remains the user-facing escape hatch for any unforeseen state. Plan 55 makes it unnecessary in the Level 29 class; future safety nets may further reduce its need, but the button is a keeper for genuine edge cases.
- **The 2026-05-18 pilot student** who surfaced this on Level 29 is the canonical user story. Like the Plan 52 student feedback, real classroom evidence drove real engine improvement. Preserve the evidence trail in the progress report.
