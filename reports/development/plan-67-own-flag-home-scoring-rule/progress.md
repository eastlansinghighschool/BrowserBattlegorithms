# Progress Report — Plan 67: Own-Flag-Home Scoring Rule

- Packet id: Plan 67
- Date completed: 2026-05-21
- Status: complete — ready for integration review
- Depends on Plan 68 before integration: **see section below**

---

## Summary

The own-flag-home scoring prerequisite is implemented and validated. A runner carrying the enemy flag can now score only when that runner's own team's flag is currently at home and not carried. Blocked scoring emits a `score.blocked` event and a factual narration sentence. All 367 unit tests pass. All 35 guided-level tests pass, including the double-carrier-showdown level. Build passes. Lint warnings are all pre-existing.

---

## Changes Made

### `src/core/scoring.js`

Added an own-flag-home guard inside `checkForScoring`, immediately after the base-cell check and before the scoring path:

```js
const ownFlag = state.gameFlags?.[runner.team];
if (!ownFlag || !ownFlag.isAtBase) {
  emit(state, "score.blocked", {
    blockedTeam: runner.team,
    carrierRunnerId: runner.id,
    reason: "own_flag_away"
  });
  return false;
}
```

When the guard triggers:
- No score increment occurs.
- No round reset fires.
- The runner keeps the enemy flag (`hasEnemyFlag` remains `true`).
- The `score.blocked` event is emitted with `{ blockedTeam, carrierRunnerId, reason: "own_flag_away" }`.
- The function returns `false` so `turnEngine.js`'s `checkForScoring(...)` branch does not enter the post-score path.

The null-guard on `state.gameFlags?.[runner.team]` ensures partial unit-test states fail gracefully (return false) rather than throwing.

### `src/core/events.js`

Added canonical emission-site comment:

```
// - score.blocked -> src/core/scoring.js (own-flag-away guard; runner keeps enemy flag, no round reset)
```

### `src/ui/narration.js`

- Added `scoreBlockedEvent` extraction from the event log in `buildNarrationContext`.
- Added `formatScoreBlockedSentence` function. Produces: `"Team N reached base with the enemy flag, but their own flag is away."`
- Wired `scoreBlockedSentence` into `formatTurnNarration` after the score sentence block. Because `score.blocked` and `team.scored` are mutually exclusive events, these two branches can never both fire in the same turn.

### `docs/GameSpecification.md`

- **Section 4 (Flags):** Added bullet: "A runner's score attempt is blocked if that runner's own team's flag is not currently at home. The runner keeps the enemy flag and the turn continues normally. The runner can score on a later turn once their own flag returns home."
- **Section 9 (Scoring and Win Conditions):** Updated opening sentence to include the own-flag prerequisite. Added a second sentence describing the blocked path and that scoring can succeed on a later turn.

### `docs/subsystems/turn-engine.md`

- **Turn resolution step 8:** Expanded from a one-liner to include the blocked branch, the `score.blocked` event, and the explicit note that only the completed runner is checked.
- **"Scoring vs level completion vs round reset" section:** Added a "Blocked scoring" bullet describing the new path.
- **"Common traps" section:** Added: "Expecting a parked carrier to auto-score when the own flag returns home. Blocked scoring does not create a deferred trigger. The carrier scores only during its own completed turn, not as a side effect of another runner returning the own flag."

---

## New Tests

### `tests/unit/scoring-and-level-state.test.js` (4 new tests)

| Test | Asserts |
|---|---|
| "scoring is blocked when own flag is carried by the enemy" | `scored === false`, score stays 0, carrier keeps enemy flag, own flag state unchanged |
| "scoring is blocked when own flag is dropped but not yet home" | Same assertions for the dropped-not-home case |
| "blocked carrier can score on its own next completed turn once own flag returns home" | First attempt blocked, runner retains flag, second attempt (after `ownFlag.resetToInitialPosition()`) scores successfully |
| "scoring still works normally when own flag is home" | Regression guard — standard scoring path unaffected by the new rule |

### `tests/unit/narration-event-log.test.js` (1 new test)

| Test | Asserts |
|---|---|
| "score.blocked logs the blocked team, carrier, and reason when own flag is away" | `score.blocked` event present with correct payload; `team.scored` absent |

### `tests/unit/narration-templater.test.js` (1 new test)

| Test | Asserts |
|---|---|
| "formatTurnNarration describes a blocked scoring attempt" | Full sentence: "Turn 5. Ally 0 moved to row 4, column 1. Team 1 reached base with the enemy flag, but their own flag is away." |

---

## Validation Results

| Suite | Result |
|---|---|
| Focused: scoring + narration + resilience tests | **50 / 50 pass** |
| Guided-level contracts | **35 / 35 pass** |
| Full `npm test` | **367 / 367 pass** |
| `npm run lint:levels` | Pass — warnings are all pre-existing, none introduced by this packet |
| `npm run build` | **Pass** — pre-existing chunk-size warnings only |

---

## Guided Level Fallout Audit

The plan requires explicit reporting on Levels 28, 37, and 39.

### Level 28 (full-team-tactics) — PASS

The `guided-reference-solutions.test.js` run includes Level 28. **35/35 guided tests pass**, including the Level 28 reference solution.

However, this does not mean Level 28 is unaffected in live play. The reference solution for Level 28 uses code-controlled allies that happen to score before the npcType1 runner (which actively chases the player flag) can complete a run home with Team 1's flag. Under the new rule, if the npcType1 runner does pick up Team 1's flag and reaches Team 2's base before Team 1 scores, Team 2 scoring would now also be blocked by the same rule — but the *player*'s score attempt could also be blocked if Team 2's flag-carrier reaches Team 2's base while Team 1's flag is away.

The reference solution passes because it is fast enough to score before the NPC carrier completes its run. In live student play with slower or less optimal programs, the standoff is reachable. **This is flagged for Plan 68 to address via a level-authoring decision** (e.g., freezing the attacker NPC or adjusting setup).

### Level 37 (advanced-scrimmage) — PASS

Reference solution passes. Same caveat as Level 28: a very slow student program could encounter a standoff if both teams' carriers reach their respective bases simultaneously. **Flagged for Plan 68 review.**

### Level 39 (optional-double-carrier-showdown) — PASS (but semantics changed)

The scripted pass test at `guided-level-contracts.test.js` passes. The scripted human solution (carrier moving toward base while allies intercept the enemy carrier) still produces `LEVEL_RESULT.PASSED` within the 20-turn cap.

**However, the level's mechanics have changed meaningfully under the new rule.** Both teams start with a carrier already holding the enemy flag. Under the old rule, whichever carrier reached base first scored. Under the new rule, neither can score until the other's carrier is stopped — which is exactly what the scripted solution accomplishes. The scripted solution continues to work because the ally intercept path was already stopping Team 2's carrier before Team 1's human reached base.

The pedagogical framing in the level's `introText` (currently describing the level as teaching "carrier vulnerability under pressure") is now somewhat incomplete: stopping the enemy carrier is now *required* for scoring, not merely advantageous. The test passes, but the tutorial copy and possibly the turn cap should be revisited in Plan 68.

### All other levels — PASS / UNAFFECTED

Levels with permanently frozen Team 2 runners (Level 3, Level 12) are completely unaffected — Team 2 cannot carry Team 1's flag. Levels whose win condition is not `team_scores_point` are unaffected. The full 35/35 guided test suite confirms no authored level broke under this packet.

---

## Integration Readiness

**This packet is safe to integrate on its own.** The core rule is correct, tests pass, and no existing level breaks. The open items (Level 28 and 37 live-play standoff risk, Level 39 tutorial copy) are documentation and authoring concerns for Plan 68, not correctness issues introduced here.

**Plan 68 is recommended before shipping to students** if any of the following are concerns:
1. Students encountering a silent standoff in Level 28 with no guidance (the narration now says "Team 1 reached base with the enemy flag, but their own flag is away" which provides feedback, but the level `introText` does not prepare students for this condition).
2. Level 39's `introText` now understates the requirement (stopping the enemy carrier is now mandatory, not optional).
3. The Level 28 npcType1 attacker creating a live-play standoff for students using slow programs.

Plan 69 (CPU behavior adaptation) remains deferred; no NPC or CPU logic was changed in this packet.

---

## What Was NOT Changed

Per plan scope constraints, the following were not modified:
- Guided level configs (Level 28, 37, 39, or any other)
- NPC or Free Play CPU behavior
- Collision rules, round-reset behavior, or flag pickup
- Scoring thresholds or game-over logic
- Any sound, animation, or scoreboard widget
- GitHub workflow files or deployment settings
