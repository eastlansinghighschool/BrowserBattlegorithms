# Progress Report — Plan 68: Guided Level Scoring-Rule Repairs

- Packet id: Plan 68
- Date completed: 2026-05-21
- Status: complete — ready for integration review
- Depends on Plan 67

---

## Summary

Full guided-level audit under the Plan 67 own-flag-home scoring rule. No required level breaks. No reference or project fixtures needed updating. The only repair required was updating the tutorial copy and concept-matrix row for the optional double-carrier showdown level (Level 39) to accurately describe that intercepting the enemy carrier is now required for scoring, not merely a strategic option.

All 367 unit tests pass. Build passes. Lint warnings are all pre-existing.

---

## Audit: Plan 67 Guided Failures Reproduced

Plan 67 reported 35/35 guided tests passing with no failures. That baseline was confirmed at the start of this packet. There were no test failures to reproduce — the audit proceeded directly to pedagogical classification.

---

## Level Classification

### Levels with `team_scores_point` win condition

| Level | Opponent NPC behavior | Own flag risk | Classification |
|---|---|---|---|
| Level 3 (score-a-point) | All Team 2 runners frozen (999 turns) | None — frozen NPCs cannot carry | **Unaffected** |
| Level 12 (bring-it-home) | All Team 2 runners frozen (999 turns) | None | **Unaffected** |
| Level 28 (full-team-tactics) | npc1/npc2: `GUIDED_RANDOM_MOVE_ONLY`; npc3: no `cpuBehavior` → `npcType2` (patrol/defender) | npcType2 patrols around Team 2's flag home — never actively chases or carries Team 1's flag | **Unaffected** |
| Level 37 (advanced-scrimmage) | All three NPCs: no `cpuBehavior` → `npcType2` (patrol/defender) | Same — patrol behavior never runs with Team 1's flag | **Unaffected** |
| Level 39 (optional-double-carrier-showdown) | npc1 starts carrying Team 1's flag; uses `npcType2` (wanders, does not try to score) | Team 1 flag is away at match start by design — scoring is blocked until npc1 is intercepted | **Copy/matrix update required** |

### Levels with `runner_reaches_cell` or other win conditions

All other levels with live opponents use win conditions that do not involve scoring. The new scoring rule has no effect on them.

### Key finding: default NPC behavior is `PATROL_INTERCEPT` (npcType2)

The `ACTIVE_TEAM2_NPC_BEHAVIOR` constant is set to `NPC_BEHAVIORS.PATROL_INTERCEPT`, which maps to `calculateNpcType2Action` — a patrol/defender that stays near Team 2's flag home. No guided level assigns `NPC_BEHAVIORS.SIMPLE_TARGET` (npcType1, the flag chaser) to any NPC slot. The blast-radius concern about npcType1 stealing Team 1's flag in Levels 28 and 37 does not apply to the actual configuration.

### Level 32 (escort-the-carrier)

Team 1's ally starts with the enemy flag, but the win condition is `runner_reaches_cell` (not `team_scores_point`), and both Team 2 NPCs are permanently frozen. No scoring is involved. Unaffected.

---

## Changes Made

### `src/config/levels/phases/optional/level-39-optional-double-carrier-showdown.js`

**`description`** — Updated from "Protect your carrier while another carrier is already racing on the other side of the map" to copy that states the scoring-block mechanic directly:
> "Both teams start with a carrier. Your team cannot score while your own flag is away — stop the enemy carrier to unblock the run."

**`introText`** — Updated from "carrier vulnerability, screening, and interception" framing to one that opens with the scoring rule:
> "Both teams start with a flag carrier already in motion. Under the scoring rules, your team cannot score while your own flag is away — stopping the enemy carrier is the only way to unblock your run. This lab is about using runner roles to escort your carrier and intercept theirs at the same time."

**Tutorial step 0 body** — Previous copy said interception makes the lane "safe". Updated to state that interception is required:
> "Your runner starts with the enemy flag, and Team 2 already has your flag. Your team cannot score while your own flag is away — stopping the enemy carrier is not optional, it is what unblocks the scoring run."

**Tutorial step 1 body** — Updated to state WHY interception matters mechanically:
> "Use runner index and teammate-has-flag to give one ally escort duty and one ally interception duty. Intercepting the enemy carrier returns your flag home and unblocks the scoring run."

No changes to: setup positions, starting flags, win condition, failure conditions, turn cap (20), toolbox, move-toward targets, scripted pass test, or any contract assertions.

### `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`

Level 39 row updated:

| Column | Before | After |
|---|---|---|
| Focus | "carrier vulnerability under pressure" | "own-flag-home scoring; escort and intercept coordination" |
| New vocabulary / board idea | "carrier vulnerability, runner index roles, teammate flag pressure" | "scoring is blocked when own flag is away; carrier interception unblocks the score; runner index roles" |
| Assumes | "Levels 19, 29-37 and the carrier collision rule" | "Levels 19, 29-37, the carrier collision rule, and the own-flag-home scoring rule" |
| Blockly ideas and Support concepts | unchanged | unchanged |

---

## No Changes Made To

- Level 28, Level 37, or any other level source
- Any reference or project fixture
- Any test (contract, reference-solution, or project-solution)
- NPC or CPU behavior
- Core scoring logic
- Teacher or Student guides (neither contains level-specific scoring detail that would mislead)
- Turn-engine subsystem note (already updated in Plan 67)
- Game specification (already updated in Plan 67)

---

## Validation Results

| Suite | Result |
|---|---|
| `npm run lint:levels` | Pass — all warnings pre-existing, none introduced by this packet |
| Guided contracts + reference solutions + project solutions + scoring tests | **57 / 57 pass** |
| Full `npm test` | **367 / 367 pass** |
| `npm run build` | **Pass** — pre-existing chunk-size warnings only |

---

## Validation Checklist

- [x] Plan 67 guided failures reproduced (baseline confirmed: 35/35 pass, no failures to reproduce)
- [x] Each affected guided level classified in this report
- [x] Required levels remain passable
- [x] Optional double-carrier level repaired (copy and concept matrix updated; test still passes)
- [x] Reference/project fixtures match authored behavior (no fixture changes required)
- [x] Concept matrix agrees with level source
- [x] `npm run lint:levels` has no new warnings
- [x] Guided reference and project solution tests pass (57/57)
- [x] `npm test` result reported honestly (367/367)
- [x] `npm run build` passes
- [x] No core scoring or CPU strategy changes were made
- [x] No unrelated files were changed

---

## Stop Conditions Assessment

No stop conditions were triggered:
- No required level needed redesign — Level 28 and Level 37 are unaffected by the rule change.
- Level 39's repair preserves its double-carrier premise — only copy was updated, not setup or mechanics.
- No fixture updates were needed that would hide a teaching regression.
- No doc/source mismatches that change lesson intent.
- No core scoring behavior changes.
- No global CPU behavior changes.

Plan 68 is complete and ready for integration alongside Plan 67.
