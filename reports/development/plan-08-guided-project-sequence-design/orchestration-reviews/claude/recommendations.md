# Plan 08 Independent Recommendations: claude

**Reviewer:** Claude Opus (thinking)
**Date:** 2026-05-12
**Audit reviewed:** `reports/development/plan-08-guided-project-sequence-design/project-audit.md`
**Source verification:** All level source files in `advanced-logic/` and `advanced-teamplay/`, `toolboxes.js`, all flagged reference solution XMLs, and `workspace.js` persistence code were inspected.

---

## Executive Recommendation

The two-project structure is sound and should proceed. The audit is accurate in its factual claims. My primary departures from the audit are:

1. **Challenge 28 should be a standalone bridge, not a Project 1 capstone.** It uses the pre-advanced beginner toolbox, not advanced boolean blocks, so including it in a project whose shared-code is built on `ADVANCED_ALL_BLOCKS` creates a toolbox mismatch and a confusing workspace evolution narrative.
2. **L24 must be repaired before Project 1 launches** — I agree with the audit on severity but want to make this a hard gate, not a recommendation.
3. **L34–L36 should stay as three levels** until Plan 06 playtest produces evidence to condense. Under shared-code, the repetition is less likely to cause disengagement because students are modifying one program, not starting fresh three times.
4. **L37's win condition should drop the ally-0 restriction.** A capstone that penalizes creative team compositions contradicts the project's core lesson.
5. **Project 2 should use `ADVANCED_CAPSTONE_BLOCKS` from the start**, but Plan 10's UI should introduce a "spotlight" system that visually highlights the new blocks relevant to each step while keeping the full set available.

---

## Audit Check

### Question 1: Does the audit accurately describe the current levels?

**Yes, with minor corrections:**

- The audit's toolbox descriptions match `toolboxes.js` exactly. `ADVANCED_ALL_BLOCKS` = `ADVANCED_BOOLEAN_WRAPPERS + ADVANCED_BOOLEAN_VALUES + ADVANCED_NUMBER_VALUES` (lines 85–89 of toolboxes.js). `ADVANCED_CAPSTONE_BLOCKS` adds generic sensors, move-toward, teammate-flag, territory, freeze, barrier, jump, extended movement, and `MOVE_RANDOMLY` (lines 91–104).
- The audit correctly identifies that L22 and L28 use the beginner/pre-advanced statement-block toolbox (manually listed block types rather than `ADVANCED_ALL_BLOCKS`), while L23–L27 use advanced boolean/value blocks. This is confirmed in source — L22 and L28 import individual `BLOCK_TYPES` and groups like `GENERIC_SENSOR_BLOCKS`, not `ADVANCED_ALL_BLOCKS`.
- The audit correctly identifies L24's trivial-solve risk. Source confirms: ally at (1,4), target at (5,2), 6-turn limit. `move_forward` four times + `move_up_screen` twice reaches the target. The reference solution does use distance comparison (`distance to CLOSEST_ENEMY <= 2 → move_up_screen / else → move_forward`), but the level passes without it.
- The audit correctly identifies that `advanced-scrimmage.xml` is a minimal 2-branch solution with no runner index logic. Source confirms: it's just `if have enemy flag → move toward MY_BASE / else → move toward ENEMY_FLAG`. For a 3-ally capstone, this is inadequate.
- **Minor correction:** The audit says L23 has "1 frozen" active enemy. Source shows NPC1 at (5,2) frozen 999 turns and NPC2 at (10,6) frozen 999 turns — both are frozen, zero are active. The audit table for L23 says "1 frozen" in the active enemies column, but should say "0 active" to be precise. This doesn't affect project membership decisions.
- **Confirmed:** L32 does start ally 0 with `hasEnemyFlag: true` and uses `flagOverrides` to mark the flag as carried. This is the most unusual setup in either arc.
- **Confirmed:** L35 and L36 both have 8-turn limits. L34 has a 10-turn limit.
- **Confirmed:** L33 has both NPC runners active (no frozen state). All other teamplay intro levels have all enemies frozen.

---

## Proposed Project A: Strategy Brain

| Current level | Keep/merge/condense/defer | Proposed project step | Focus | Notes |
| --- | --- | --- | --- | --- |
| L22 `show-what-you-know` | Keep as standalone gateway | Not a project step | Pre-advanced synthesis using beginner blocks | Challenge badge; "pass this to unlock the advanced layer" |
| L23 `closest-threat` | Keep | Step 1 | `Move Toward closest enemy`; advanced layer intro | First advanced block; narrow toolbox is acceptable as Step 1 |
| L24 `how-far-away` | Keep but **repair board** | Step 2 | Distance as numeric value; comparison operators | **Hard gate:** board must make distance comparison load-bearing before project launch |
| L25 `two-conditions-at-once` | Keep | Step 3 | `AND`; conditional resource spend | First live enemy in project arc; freeze resource adds stakes |
| L26 `this-or-that` | Keep | Step 4 | `OR`; react to either danger | Different map (`midfieldPressure`); good variety |
| L27 `flip-the-answer` | Keep | Step 5 | `NOT`; boolean negation | Completes the logic operator trio |
| L28 `full-team-tactics` | **Keep as standalone bridge** | Not a project step | Single-ally capstone with live enemies | See reasoning below |

### Challenge 28 as standalone bridge, not project capstone

The audit proposes L28 as the last step of Project 1. I disagree for three reasons:

1. **Toolbox mismatch.** L28 uses the pre-advanced statement-block toolbox (manually listed `IF_HAVE_ENEMY_FLAG`, `GENERIC_SENSOR_BLOCKS`, etc.) — it does *not* include `ADVANCED_ALL_BLOCKS`. If a student has been building their Strategy Brain program with advanced boolean blocks (AND, OR, NOT, value compare), their shared code would contain blocks that aren't in L28's toolbox. The Blockly workspace would show those blocks but they'd appear in the toolbox as invalid. This is confusing.

2. **Pedagogical role.** L28's purpose is "prove you can handle a real single-ally scenario before team programming begins." That's a bridge moment, not a project culmination. The project's narrative is "build an increasingly sophisticated boolean decision tree." L28 doesn't require boolean sophistication — it requires practical scoring under pressure using any available tools.

3. **Workspace reset at project boundary.** If L28 is standalone, the workspace resets naturally when entering Project 2. If it's a project step, students carry forward a 5-level evolved program into a fundamentally different kind of challenge (live scrimmage vs. single-concept puzzle). The evolved program may actually be worse than a fresh one for L28's open-ended scenario.

**Recommendation:** Strategy Brain is a 5-step project (L23–L27). L28 remains a standalone challenge that bridges into Project 2. Challenge badges (Plan 03) and explicit UI copy should mark L28 as "prove yourself before team programming."

### Project 1 toolbox at project start

Unlock: `ADVANCED_ALL_BLOCKS + AREA_FREEZE_BLOCKS + MOVE_TOWARD_BLOCKS (all four targets) + EXTENDED_MOVEMENT_BLOCKS`

**Rationale:** L25 requires `AREA_FREEZE_BLOCKS`, so the project toolbox must include them from Step 1. `MOVE_TOWARD_BLOCKS` with all four targets is needed because students navigating backward from L25 to L23 might have a program that references enemy-flag or my-base targets not originally available at L23. The full `MOVE_TOWARD_TARGETS` set prevents workspace breakage.

**What this does NOT include:** `GENERIC_SENSOR_BLOCKS`, `JUMP_BLOCKS`, `JUMP_CONDITION_BLOCKS`, `BARRIER_PLACEMENT_BLOCKS`, `BARRIER_READY_BLOCKS`, `TEAMMATE_FLAG_BLOCKS`, `TERRITORY_BLOCKS`, `MOVE_RANDOMLY`. These belong to the pre-advanced beginner layer and are not part of the advanced boolean model. Including them would bloat the toolbox with blocks that aren't pedagogically relevant to the project arc.

---

## Proposed Project B: Team Strategy Script

| Current level | Keep/merge/condense/defer | Proposed project step | Focus | Notes |
| --- | --- | --- | --- | --- |
| L29 `one-program-two-allies` | Keep | Step 1 | Shared program model; runner index concept | Orientation step; gentle entry |
| L30 `index-jobs` | Keep | Step 2 | Index comparison for role assignment | First real index skill; `if index == 0` |
| L31 `first-two-defend` | Keep | Step 3 | Index range grouping; 3-ally team | `index < 2`; first 3-ally level |
| L32 `escort-the-carrier` | Keep with **enhanced tutorial** | Step 4 | Teammate-has-flag + index | Unusual flag-start; needs project-mode backward-nav warning |
| L33 `closest-enemy-defender` | Keep | Step 5 | Attacker/defender split with live enemies | First live-enemy teamplay level; high value |
| L34 `freeze-support` | Keep | Step 6 | Freeze specialist role | Resource-by-index pattern intro |
| L35 `barrier-specialist` | Keep, **raise turn limit to 10** | Step 7 | Barrier specialist role | 8-turn limit is too tight for iterative project development |
| L36 `jump-team` | Keep, **raise turn limit to 10** | Step 8 | Jump specialist role | Same turn-limit concern as L35 |
| L37 `advanced-scrimmage` | Keep as project capstone, **replace reference solution, remove ally-0 pin** | Step 9 (capstone) | Full team scrimmage | See reasoning below |

### L34–L36: Keep all three

The audit notes the structural repetition (all three follow `if index == X → use resource / else → move`). Under shared-code, this repetition is actually productive:

- Students modify the *same* program three times, layering in freeze-specialist, barrier-specialist, and jump-specialist roles.
- Each level forces a different decision: which index gets the new resource, and what happens to the other roles.
- The shared-code evolution is visible: by L36, the student's program has three or four distinct index branches, each with a resource readiness check. That is exactly the kind of multi-role program the capstone (L37) will demand.

Condensing L35+L36 into one level would force students to add two new resource roles simultaneously, which is too much for a teaching level.

### L35 and L36: Raise turn limits

Both currently have 8-turn limits. Under project shared-code, a student's program may be carrying forward logic from earlier steps that isn't optimal for the current board. 8 turns gives no room for programs that take an indirect path or spend a turn on a resource action. Raising to 10 gives meaningful slack without making the levels trivially easy.

### L37: Remove ally-0 win restriction

Current win condition: `{ type: "team_scores_point", teamId: 1, runnerId: "runner_1_AI_AllyP1" }`.

This requires ally 0 (index 0) to be the scorer. A student who designs a program where index 1 is the attacker and index 0 is the defender will fail the automated test despite having a working team strategy. This directly contradicts the project's lesson: "design a team where each ally has a role."

**Recommendation:** Change to `{ type: "team_scores_point", teamId: 1 }` (no `runnerId` restriction). The reference solution should still demonstrate index-based roles, but any ally scoring should count.

### L37: Replace reference solution

The current `advanced-scrimmage.xml` is a 2-branch program with no index logic. Replace with a program that:
- Uses `runner index == 0` for an attacker role (move toward flag → if have flag, move toward base)
- Uses `runner index == 1` for a defender/interceptor role (move toward closest enemy)
- Uses `else` (index 2) for a support/flag-chaser fallback

This doesn't have to be optimal, but it must demonstrate index-based role assignment — the core skill of the project arc.

### Project 2 toolbox at project start

Unlock: `ADVANCED_CAPSTONE_BLOCKS` (everything).

**Rationale:** By the time students reach Project 2, every individual resource block has been taught as a single-concept level in the pre-project campaign (freeze at L21, barriers at L17, jump at L14/L16, territory at L20, teammate-has-flag at L19). Opening the full toolbox prevents backward navigation from stranding students and matches the project's strategic intent: "use anything to coordinate your team."

### L32 backward-navigation handling

L32's flag-already-carried setup is the most confusing backward-navigation case. A student going from L33 back to L32 will have a program that assumes the flag hasn't been picked up yet. Their code may try to chase the enemy flag when ally 0 already has it.

**Recommendation:** Use a persistent per-level project banner (not just a one-time tutorial overlay) that says: "In this level, your lead ally starts with the flag. Think about what each ally should do when a teammate is already carrying."

---

## Toolbox And Persistence Contracts

### Toolbox policy

- **Project 1 (Strategy Brain):** Broad toolbox from Step 1, as defined above. No per-step toolbox growth within the project.
- **Project 2 (Team Strategy Script):** Full `ADVANCED_CAPSTONE_BLOCKS` from Step 1. No per-step toolbox growth within the project.
- **Toolbox spotlight (Plan 10 scope):** The UI should highlight newly-relevant blocks for each step without hiding the others. This can be as simple as a tooltip or badge on the toolbox category containing the step's focus block. This is a Plan 10 responsibility, not a Plan 09 decision.

### Persistence policy

**Current state:** `workspace.js` line 156 uses `bba:guided-workspace:<levelId>` — one localStorage key per guided level. This is per-level isolation.

**Project shared-code requires a new storage scheme:**

- **Project key:** Introduce a new key pattern like `bba:project-workspace:<projectId>` that stores the shared latest project code.
- **Loading behavior:** When a student enters any project level, load from the project key (not the level key). When they edit, save to the project key.
- **Backward navigation:** Loading a prior project step loads the project key's latest code, not a historical per-level snapshot. The student always sees their most recent program.
- **Reset behavior:** "Reset Level" should reset the board state but keep the current project workspace. A separate "Reset Project" action (or long-press, or confirmation dialog) should reset the project workspace to the project-start initial XML. This is dangerous enough to gate behind a confirmation.
- **Non-project guided levels:** Continue using per-level isolation (`bba:guided-workspace:<levelId>`).
- **Cross-mode isolation:** Project workspaces must not affect free-play workspaces or non-project guided workspaces.

### Backtracking behavior

- Going backward inside a project always loads the shared latest project code. The board resets; the code does not.
- Going forward inside a project also loads the shared latest project code.
- Leaving the project (going to a non-project level, free play, or a different project) does not affect the stored project workspace.
- Re-entering the project at any step loads the shared latest project code.

---

## UI And Student-Facing Framing

### Project start signifiers (Plan 10 scope)

- When a student first reaches a project start (L23 for Project 1, L29 for Project 2), show a one-time callout explaining: "This is a project. Your code will carry forward across the next N levels. Each level adds a new challenge for your program."
- The level picker should visually group project levels (bracket, colored band, or icon) so students understand the arc.
- Challenge/capstone levels within projects (L37 for Project 2) should have the challenge badge AND a "capstone" label.

### L22 gateway framing

L22 should say: "Pass this challenge to unlock advanced programming tools." It is not a project step but it is the on-ramp. Plan 03's challenge badge plus copy changes in Plan 11 should handle this.

### L28 bridge framing

L28 should say: "One last solo challenge before team programming begins." Its tutorial already says this (confirmed in source: `"One last single-ally challenge before team programming begins."`). No change needed.

---

## Testing Implications

### Question 9: Biggest testing risks for Plan 13

1. **No shared-code test harness exists.** The current test runner evaluates each level's reference solution from a blank workspace (`STARTER_EVENT_XML`). Under project shared-code, the meaningful test is whether a student's evolved program still passes prior project levels. The current harness cannot express this.

2. **Recommended strategy: hybrid (option c from audit).**
   - **Per-level isolated tests (keep existing):** Each level gets its own reference solution XML tested from a blank workspace. This validates that the level is solvable.
   - **Project cumulative tests (new):** A new test suite runs a "final project program" (the capstone reference solution) against all prior project levels in sequence. This validates that a well-built evolved program still passes earlier steps.
   - **Acceptance:** Student programs may differ from either reference. The per-level test proves solvability; the cumulative test proves evolvability; students get credit for anything that passes the win condition.

3. **L33 NPC turn-order sensitivity.** The audit correctly flags this. The test should either:
   - Use a deterministic seeded turn-order fixture, or
   - Run the reference solution multiple times (3–5 runs) and require it to pass in a majority.
   I prefer the deterministic fixture approach — it's more debuggable.

4. **L37 win condition change.** Removing the ally-0 restriction changes what the reference solution must demonstrate. The new reference solution should still pass reliably on the `wideScrimmage` map within 40 turns. Test this with multiple seeded runs.

5. **L35 barrier fragility.** The audit notes that if barrier placement fails, ally 1 gets frozen. The reference solution should be reviewed for robustness under edge cases. Consider a fallback action in the else branch.

---

## Downstream Packet Contracts

Later packets (Plans 09–14) should treat these as fixed:

### Fixed contracts

1. **Two projects:** Strategy Brain (L23–L27, 5 steps) and Team Strategy Script (L29–L37, 9 steps including capstone).
2. **L22 and L28 are standalone levels, not project members.**
3. **Project toolboxes are broad from project start:** Project 1 uses `ADVANCED_ALL_BLOCKS + AREA_FREEZE_BLOCKS + MOVE_TOWARD_BLOCKS + EXTENDED_MOVEMENT_BLOCKS`. Project 2 uses `ADVANCED_CAPSTONE_BLOCKS`.
4. **Project persistence uses a single shared key per project**, not per-level keys. The key pattern is `bba:project-workspace:<projectId>`.
5. **Backward navigation loads the shared latest code.** No per-level snapshots within projects.
6. **"Reset Level" resets the board, not the code.** A separate "Reset Project" with confirmation resets the project workspace.
7. **L37's win condition drops the `runnerId` restriction.**
8. **L37's reference solution must use runner index for role assignment.**
9. **L35 and L36 turn limits increase from 8 to 10.**
10. **Plan 13 uses hybrid testing: per-level isolated + project cumulative.**
11. **L24 board must be redesigned** so distance comparison is load-bearing. This is a Plan 11 pre-repair item and a hard gate for Project 1 launch.

### Decision boundaries for downstream packets

- Plans 09–10 implement the persistence and UI contracts above. They do not invent new project membership or toolbox policies.
- Plan 11 revises the advanced-logic sequence into Project 1, including the L24 board repair.
- Plan 12 revises the advanced-teamplay sequence into Project 2, including the L37 reference solution replacement and L35/L36 turn limit changes.
- Plan 13 implements the hybrid test harness. It does not change project membership or toolbox policy.
- Plan 14 designs project version history. It builds on top of the shared-key persistence model from Plan 09.

---

## Open Questions For The Integration Owner

1. **Project 1 length — 5 or 6 steps?** My recommendation is 5 (L23–L27), excluding L28. If you want L28 as a capstone, the toolbox mismatch needs resolution — either L28 gets the advanced toolbox (changing its character) or the project allows toolbox narrowing at the capstone (violating the broad-toolbox contract). Which do you prefer?

2. **L24 repair scope.** The board needs redesign so the distance comparison is load-bearing. Options:
   - (a) Move the frozen enemy to block the direct forward path, forcing a distance-triggered detour.
   - (b) Add a barrier or wall that makes the simple forward+up path fail, requiring a distance-based conditional.
   - (c) Change the target cell so the ally must approach from a direction that only works with distance awareness.
   The repair is scoped to Plan 11 but the design choice affects the difficulty curve. Do you have a preference?

3. **Project classroom staging.** Should Project 1 ship alone first, or should both projects ship together? My recommendation is ship Project 1 first, validate through Plan 06 playtest, then ship Project 2. This lets you test the shared-code UX on the simpler arc before committing to the 9-step project.

4. **"Reset Project" user experience.** Should "Reset Project" be:
   - (a) A separate button visible during project levels, with a confirmation dialog?
   - (b) A long-press on "Reset Level" that triggers the project reset?
   - (c) Available only through a settings/menu area to reduce accidental resets?
   This affects Plan 10's UI design.

5. **Project cumulative test seeding.** For the hybrid test harness, should cumulative tests use a single canonical seed or run against 3–5 seeds? Single seed is faster; multiple seeds catch flaky solutions.

---

## Confidence And Risks

### High confidence
- Project membership (L23–L27 for Project 1, L29–L37 for Project 2)
- L22 and L28 as standalone levels
- Broad project toolboxes
- L37 ally-0 pin removal
- Hybrid testing strategy
- L24 repair as hard gate

### Medium confidence
- L34–L36 keep-all-three recommendation (depends on playtest evidence)
- L35/L36 turn limit 10 (might need to be 12; playtesting will tell)
- L32 persistent banner vs. one-time overlay (UX design call)

### Low confidence
- Whether `AREA_FREEZE_BLOCKS` in Project 1's toolbox from Step 1 will confuse students at L23 (freeze hasn't been introduced at that point in the project, though it was taught at L21). Playtesting should watch for this.
- Whether the project cumulative test will be stable enough for CI without being overly deterministic. Plan 13 will need to iterate on this.

### Key risks
- **L24 repair is on the critical path.** If the board redesign is tricky, it delays Project 1 launch.
- **Shared-code persistence is new architecture.** Plan 09 has no existing patterns to follow. The change touches `workspace.js`, which is the most complex file in the Blockly subsystem (725 lines). Risk of regression is real.
- **L33 NPC sensitivity is not fully characterized.** The audit flags it but doesn't report how often the current reference solution fails under different turn orders. Plan 13 should start with a stability audit of L33's reference solution.
