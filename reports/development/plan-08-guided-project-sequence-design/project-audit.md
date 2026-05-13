# Plan 08 — Project Audit Report

**Date:** 2026-05-12  
**Scope:** `advanced-logic/` (L22–L28) and `advanced-teamplay/` (L29–L37)  
**Status:** Analysis only — no mutations authorized  

---

## 1. Level-by-Level Teaching Role Summary

### advanced-logic phase

| # | id | Title | Kind | Teaching role | Win condition | Toolbox base | Allies | Active enemies |
|---|---|---|---|---|---|---|---|---|
| 22 | show-what-you-know | Challenge 22 | challenge | Pre-project synthesis; all pre-advanced blocks; score vs live defenders | team_scores_point (ally 0) | full pre-advanced set | 1 | 2 unfrozen |
| 23 | closest-threat | Level 23 | intro | Move Toward CLOSEST_ENEMY; advanced layer introduction step | runner_reaches_cell (ally 0) | MOVE_TOWARD + EXTENDED | 1 | 1 frozen |
| 24 | how-far-away | Level 24 | intro | Distance as numeric value; VALUE_COMPARE | runner_reaches_cell (ally 0) | ADVANCED_ALL + MOVE_TOWARD + EXTENDED | 1 | 1 frozen |
| 25 | two-conditions-at-once | Level 25 | intro | LOGIC_AND; two truths before spending freeze | runner_reaches_enemy_flag (ally 0) | ADVANCED_ALL + AREA_FREEZE + MOVE_TOWARD + EXTENDED | 1 | 1 active |
| 26 | this-or-that | Level 26 | intro | LOGIC_OR; react to either of two dangers | runner_reaches_cell (ally 0) | ADVANCED_ALL + EXTENDED | 1 | 1 frozen |
| 27 | flip-the-answer | Level 27 | intro | LOGIC_NOT; reverse a boolean | runner_reaches_cell (ally 0) | ADVANCED_ALL + EXTENDED | 1 | 0 active |
| 28 | full-team-tactics | Challenge 28 | challenge | Single-ally capstone; full single-ally toolkit; bridge to team arc | team_scores_point (ally 0) | full pre-advanced set | 1 | 2 unfrozen |

### advanced-teamplay phase

| # | id | Title | Kind | Teaching role | Win condition | Toolbox base | Allies | Active enemies |
|---|---|---|---|---|---|---|---|---|
| 29 | one-program-two-allies | Level 29 | intro | Shared program model; runner index 0/1; keep one ally clear | runner_reaches_enemy_flag (ally 0) | ADVANCED_ALL + MOVE_TOWARD + EXTENDED | 2 | 0 active |
| 30 | index-jobs | Level 30 | intro | Index comparison for role assignment (attacker vs. patrol) | runner_reaches_enemy_flag (ally 0) | ADVANCED_ALL + MOVE_TOWARD + EXTENDED | 2 | 0 active |
| 31 | first-two-defend | Level 31 | intro | Index range (index < 2) groups allies; 3-ally program | runner_reaches_cell (ally 2) | ADVANCED_ALL + EXTENDED | 3 | 0 active |
| 32 | escort-the-carrier | Level 32 | intro | teammate_has_flag + index; support movement role | runner_reaches_cell (ally 1) | ADVANCED_ALL + MOVE_TOWARD + TEAMMATE_FLAG + EXTENDED | 2 | 0 active |
| 33 | closest-enemy-defender | Level 33 | intro | Attacker/defender split with live enemies | runner_reaches_enemy_flag (ally 0) | ADVANCED_ALL + MOVE_TOWARD + EXTENDED | 2 | 2 active |
| 34 | freeze-support | Level 34 | intro | Freeze specialist role; index-gated team resource | runner_reaches_enemy_flag (ally 0) | ADVANCED_ALL + AREA_FREEZE + MOVE_TOWARD + EXTENDED | 2 | 1 active |
| 35 | barrier-specialist | Level 35 | intro | Barrier specialist role; index-gated resource | runner_reaches_cell (ally 0) | ADVANCED_ALL + BARRIER + BARRIER_READY + EXTENDED | 2 | 1 active |
| 36 | jump-team | Level 36 | intro | Jump role assignment; index decides jump route | runner_reaches_cell (ally 0) | ADVANCED_ALL + JUMP_COND + JUMP + EXTENDED | 2 | 0 active |
| 37 | advanced-scrimmage | Level 37 | challenge | 3-ally capstone scrimmage; full toolkit; real score | team_scores_point (ally 0) | ADVANCED_CAPSTONE_BLOCKS | 3 | 3 active |

---

## 2. Toolbox Analysis

### Current toolbox unlock pattern

L23 starts with a deliberately narrow toolbox (`MOVE_TOWARD_BLOCKS + EXTENDED_MOVEMENT_BLOCKS`) to introduce the advanced layer gently. From L24 onward, all intro levels use `ADVANCED_ALL_BLOCKS` as the base, with per-level additions:

- L25 adds `AREA_FREEZE_BLOCKS`  
- L32 adds `TEAMMATE_FLAG_BLOCKS`  
- L34 adds `AREA_FREEZE_BLOCKS`  
- L35 adds `BARRIER_PLACEMENT_BLOCKS + BARRIER_READY_BLOCKS`  
- L36 adds `JUMP_CONDITION_BLOCKS + JUMP_BLOCKS`  
- L37 uses `ADVANCED_CAPSTONE_BLOCKS` (everything)

**Key tension for project mode:** If the project starts with a broad toolbox (so backward navigation doesn't strand students without needed blocks), students will see freeze, barrier, and jump blocks at L29 before those concepts are introduced. If the toolbox grows per level, students navigating backward into an earlier step may lose access to blocks they used in their current code.

**Recommended approach:** Project 1 (Strategy Brain) unlocks `ADVANCED_ALL_BLOCKS + AREA_FREEZE_BLOCKS + MOVE_TOWARD_BLOCKS (all targets) + EXTENDED_MOVEMENT_BLOCKS` at project start. Project 2 (Team Strategy Script) unlocks `ADVANCED_CAPSTONE_BLOCKS` at project start, since all individual resources were taught in prior one-off levels.

---

## 3. Which Levels Naturally Become Project Steps

### Project 1: Strategy Brain (single-ally advanced logic)

**Natural project steps:** L23 → L24 → L25 → L26 → L27 → L28 (Challenge)

The arc is coherent: each level adds one composable tool (closest-enemy targeting, numeric distance, AND, OR, NOT) toward the capstone's open scrimmage. The shared program evolves from a single Move Toward block into a multi-operator decision tree. Challenge 22 is a natural pre-project gateway (all pre-advanced tools, before the new layer opens).

**Awkward fit:** L24 (`how-far-away`) can be solved trivially with `move_forward` + `move_up_screen` in 2 turns (ally at 1,4 to target at 5,2) without using the distance comparison at all. Under project shared-code, a student who passess L24 trivially carries forward a program that doesn't use the new concept — then struggles to build on it in L25. **This is the highest-risk level in Project 1.**

L26 and L27 both involve territory-based scenarios, creating perceived redundancy with pre-project L19/L20 (territory levels in resources-and-territory phase). However, the conceptual payload (OR and NOT as logical operators) is distinct enough to keep both.

### Project 2: Team Strategy Script (multi-ally coordination)

**Natural project steps:** L29 → L30 → L31 → L32 → L33 → L34 → L35 → L36 → L37 (Challenge)

L29–L30 form a natural paired introduction (concept → role assignment). L31 is the first 3-ally level — a significant step. L32 introduces a different trigger (teammate state) rather than just index. L33 is the first live-enemy level in the multi-ally arc. L34–L36 are three sequential resource-specialist levels.

---

## 4. Levels Awkward Under Shared Latest Code

### Problem: backward navigation loads evolved code onto earlier setups

| Level | Specific risk |
|---|---|
| L24 | Trivially solvable — student's L24 code may be too simple to build on for L25/AND |
| L29 | If navigated to after L31 (3-ally), third ally (index 2) just never fires — acceptable |
| L31 | 3-ally setup. If loaded with a 2-ally-scoped program (from L29 going forward), ally 2 has no branch and stays still — may still pass with ally 2's target at (4,4) if ally 2 moves forward on the else branch |
| L32 | Starts with ally 0 carrying the flag (`hasEnemyFlag: true` + `flagOverrides`). A backward-navigating student whose current code targets the enemy flag (not carrying behavior) will see ally 0 not move toward base. This is the most confusing backward-navigation scenario in Project 2. |
| L33 | Live enemies (both NPC runners active). Code that was written for frozen-enemy levels may fail here in ways that aren't immediately legible — enemy collisions happen. |
| L35/L36 | 8-turn limits. A student refining their program iteratively on these levels has no slack for mistakes. Programs that worked for earlier levels may not finish in 8 turns. |

### Backward navigation verdict by project

**Project 1 (Strategy Brain):** Backward navigation is relatively safe. All levels are single-ally with the same target runner, frozen enemies (except L25 and L28), and similar board shapes. Evolved programs that use AND/OR/NOT generally still produce valid actions on simpler boards.

**Project 2 (Team Strategy Script):** Backward navigation has one dangerous case: L32's flag-already-carried setup. All other levels are safe in the sense that extra index branches either fire on valid ally slots or fall to an else clause. L33 (live enemies) could cause unexpected collisions with code written for frozen boards, but the behavior is explainable.

---

## 5. Condensing and Merging Opportunities

### Strategy Brain (Project 1)

**L26 + L27 potential merge:** Both levels use `runner_reaches_cell` at (6,2) and both involve territory-based movement with ADVANCED_ALL_BLOCKS. They differ only in which logic operator is taught. However, combining OR and NOT in one level would be too dense for a teaching level — keep separate.

**L24 redesign needed (not merge):** The current L24 board can be solved without the new concept. Rather than merging, the board should be redesigned so the distance comparison is load-bearing. This is a pre-project-launch repair item.

### Team Strategy Script (Project 2)

**L34 + L35 + L36 triple pattern:** All three follow: `if index == X → use resource (with readiness check) / else → move forward`. The structural pattern is identical; only the resource block changes (freeze / barrier / jump). Arguments for condensing:
- Pro-keep: each resource was originally taught as a one-off concept level earlier; the project levels reinforce application in a team context; three separate levels give students room to iterate.
- Pro-merge: three structurally identical levels may feel repetitive, especially under shared-code where the student is modifying one program rather than starting fresh. Two levels (combine L34+L35 into "resource specialist," keep L36 as jump-route) would reduce the pattern without losing the teaching payoff.

**Recommendation:** Keep L34–L36 as 3 steps but flag for playtest review. If playtesting (Plan 06) shows students disengage mid-sequence, consolidating L35+L36 is the natural cut.

**L29 + L30 adjacency:** Both are 2-ally, frozen-enemy, `runner_reaches_enemy_flag` for ally 0. The only difference is that L29 introduces the shared-program concept and L30 introduces explicit index comparison. Under shared-code, L30's intro (comparing index to a number) is the key step that makes subsequent levels possible. Keep both; L29 is the orientation moment and L30 is the first real index skill.

---

## 6. Risks for Canonical Tests

### Structural risks

**`advanced-scrimmage.xml` is a minimal 2-branch program:**  
```
if have enemy flag → move toward MY_BASE
else → move toward ENEMY_FLAG
```
This program does not use runner index, distance, closest-enemy, or any of the multi-ally coordination blocks introduced in L29–L36. It is the simplest possible program that can accidentally score if ally 0 reaches the flag and happens to return home within 40 turns. The current test passes because the board is open enough (`wideScrimmage`) that this heuristic works. This reference solution does not represent what students should learn to write. It should be replaced with a program that at minimum differentiates ally roles by index.

**Win condition `runnerId` pinning:** Every level in both arcs pins the win to `runner_1_AI_AllyP1` (ally 0) except L31 (ally 2 = `runner_1_AI_AllyP1_3`). Under project shared-code, this constraint means reference solutions should consistently route ally 0 to the scoring position. Students who design programs where ally 1 scores instead will fail the automated test even with a working strategy. This is a pedagogy risk: it penalizes creative solutions.

**Shared-code testing strategy gap:** Current tests run each level's reference solution from the `STARTER_EVENT_XML` starting state — a blank workspace. Under project shared-code, the meaningful test is whether a student's *evolved* program still passes all prior project levels. The current harness cannot express this. Plan 13 will need to decide between:
- (a) per-level isolation: test each level independently with a level-appropriate solution, as today
- (b) cumulative progression: test that a final project program passes all project steps in sequence
- (c) hybrid: per-level solutions for automated tests; acceptance that project programs may differ from minimal solutions

**L33 NPC movement sensitivity:** Both NPC runners are active with no frozen state. Turn-order randomization means the reference solution (`closest-enemy-defender.xml`) may pass or fail depending on NPC turn order within a given run. The test should verify the solution passes reliably across multiple seeded runs, or use a deterministic turn-order fixture.

**L35 barrier-specialist live-enemy concern:** NPC1 at (6,5) is active. Ally 1 (barrier specialist) starts at (3,5) in the same row. NPC1 moving toward the player side reaches (5,5) in 1 turn, (4,5) in 2, (3,5) in 3. Ally 1 starts at (3,5). At turn 3, NPC1 and ally 1 could collide if ally 1 has not moved. The reference solution has ally 1 place a barrier immediately (turn 1), then stay still — barrier at (4,5) would block NPC1 at (4,5). This works but is fragile: if the barrier placement fails for any reason, ally 1 gets frozen.

---

## 7. Recommended Project Arcs

### Project 1: Strategy Brain

**Student-facing name:** Strategy Brain  
**Placement:** After Challenge 22 (`show-what-you-know`), before Challenge 28 (`full-team-tactics`)  
**Steps:** 6 levels (L23 → L24 → L25 → L26 → L27 → L28)  
**Challenge capstone:** L28 (`full-team-tactics`) — last step of the project  
**Runner count:** 1 ally throughout  
**Toolbox at project start:** `ADVANCED_ALL_BLOCKS + AREA_FREEZE_BLOCKS + MOVE_TOWARD_BLOCKS (all four targets) + EXTENDED_MOVEMENT_BLOCKS`  
**Rationale for broad start:** All blocks needed to complete L28 must be available from L23 so backward navigation never strands the student. Area freeze is introduced at L25 but must be present in the project workspace from the start.

**Shared-code behavior:** The single ally's program evolves across the 6 steps. Students start with a simple closest-enemy targeting program and incrementally layer in distance comparison, AND, OR, NOT toward a complete tactical decision tree.

**Pre-repair required before launch:** L24 board must be redesigned so the distance comparison is load-bearing before this project is presented to students. As-is, students can skip the concept and carry a trivial program forward.

**Challenge 22 role:** Standalone gateway level, not a project step. It proves single-ally readiness before the advanced layer opens. Its `levelKind: "challenge"` and UI badge should make clear it is a reward/synthesis moment, not a new concept.

### Project 2: Team Strategy Script

**Student-facing name:** Team Strategy Script  
**Placement:** After Challenge 28 (`full-team-tactics`), ends at L37 (`advanced-scrimmage`)  
**Steps:** 9 levels (L29 → L30 → L31 → L32 → L33 → L34 → L35 → L36 → L37)  
**Challenge capstone:** L37 (`advanced-scrimmage`) — last step of the project  
**Runner count:** 2 allies (L29–L30, L32–L36), 3 allies (L31, L37)  
**Toolbox at project start:** `ADVANCED_CAPSTONE_BLOCKS` (everything)  
**Rationale:** By the time students enter Project 2, every individual resource block (freeze, barrier, jump, territory, teammate-has-flag) has already been taught as a single-concept level. Opening the full capstone toolbox prevents backward navigation from stranding students and matches the open strategic intent of the team arc.

**Shared-code behavior:** The team coordination program evolves across 9 steps. It starts as a simple index branch and grows into a multi-ally script that assigns attack, defense, support, and resource roles.

**Special handling for L32:** Tutorial copy must clearly state that the ally *starts with the flag* and that the program should handle this initial state. Students navigating backward from L33+ into L32 need a tooltip or banner explaining the unusual starting setup.

**Capstone reference solution replacement:** `advanced-scrimmage.xml` must be replaced with a program that uses runner index to assign roles. The current 2-branch solution does not represent team coordination.

---

## 8. Open Questions for Decision Record

These require integration-owner decisions before Plans 09–14 can proceed:

1. **Challenge 22 gateway role:** Should `show-what-you-know` be the last level of the pre-advanced sequence, or should it be framed as a formal "Project 1 unlocks after passing this" gate in the UI?

2. **Challenge 28 project membership:** Is `full-team-tactics` the capstone of Project 1 (last step, carries shared code), or a standalone bridge between projects that resets the workspace?

3. **L24 repair timing:** Should `how-far-away` be redesigned before Project 1 launches (requiring Plan 11 to fix it), or should the project launch with a known pedagogy gap and a note for Plan 06 playtesting?

4. **L34–L36 condensing decision:** Keep all three resource-specialist levels as separate project steps (9-step Project 2), or condense freeze+barrier into one level (8-step Project 2)?

5. **Canonical test strategy:** Which option for Plan 13 — per-level isolated solutions, cumulative progression tests, or hybrid?

6. **L37 scorer restriction:** Should the capstone win condition accept any ally scoring (`team_scores_point` without `runnerId`), or keep the restriction to ally 0? Affects reference solution design and creative student strategies.

7. **L32 backward navigation warning:** Is a tutorial overlay sufficient for the flag-already-carried edge case, or should the engine provide a persistent per-level state notice when project mode detects backward navigation?

8. **Project classroom staging:** Are both projects required for the first classroom rollout, or can Project 2 be deferred until Project 1 is validated?

---

## 9. Summary Risk Table

| Risk | Severity | Affects | Recommended action |
|---|---|---|---|
| L24 trivially solvable without distance compare | High | Project 1 pedagogy | Redesign board before Project 1 launch |
| `advanced-scrimmage.xml` minimal solution | High | Project 2 test validity | Replace reference solution with index-role program |
| L32 flag-start backward navigation confusion | Medium | Project 2 UX | Add per-level state notice in project mode |
| L33 NPC turn-order sensitivity in tests | Medium | Plan 13 test harness | Use seeded turn-order fixture for L33 test |
| L35/L36 8-turn limits | Medium | Project 2 iteration room | Raise to 10–12 turns; flag for Plan 06 playtest |
| No shared-code test harness | High | Plan 13 scope | Decision needed on test strategy before Plan 13 |
| Win condition ally-0 pinning | Low–Medium | Student creative strategies | Consider removing runnerId restriction on L37 |
| L34–L36 pattern repetition | Low | Classroom engagement | Flag for Plan 06 playtest before deciding to condense |
