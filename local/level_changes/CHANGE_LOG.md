# Level Changes Log

This file is appended to by the Gemini agent after each change is processed.
Each entry records what was found, what was changed, and confirms completion.

---

## tier1/01-move-to-target.md — 2026-05-08
- Level: Level 1: Move to Target
- Step id: level-1-event
- Field changed: body
- Old value (first 60 chars): "Every ally program begins with the On Each Turn block. Add…"
- New value (first 60 chars): "Every ally program begins with the On Each Turn block. Any…"
- Status: COMPLETE

## tier1/02-mirror-forward.md — 2026-05-08
- Level: Level 5: Forward Works Both Ways
- Step id: level-5-forward
- Field changed: body
- Status: COMPLETE

## tier1/03-sensor-barrier-branch.md — 2026-05-08
- Level: Level 6: Barrier Sensor Branch
- Step id: level-6-generic-sensor
- Field changed: body
- Status: COMPLETE

## tier1/04-jump-if-ready.md — 2026-05-08
- Level: Level 15: Jump If Ready
- Step id: level-15-ready
- Field changed: body
- Status: COMPLETE

## tier1/05-my-side-their-side.md — 2026-05-08
- Level: Level 19: My Side, Their Side
- Step id: level-19-switch-sides
- Field changed: body
- Status: COMPLETE

## tier1/06-freeze-the-lane.md — 2026-05-08
- Level: Level 20: Freeze the Lane
- Step id: level-20-free-play
- Fields changed: title, body
- Status: COMPLETE

## tier1/07-closest-threat.md — 2026-05-08
- Level: Level 21: Closest Threat
- Action: Inserted new first tutorial step
- New step id: level-21-advanced-layer
- Existing steps unchanged: level-21-target, level-21-board
- Status: COMPLETE

## tier1/08-this-or-that.md — 2026-05-08
- Level: Level 24: This Or That
- Step id: level-24-path
- Field changed: body
- Status: COMPLETE

## tier1/09-flip-the-answer.md — 2026-05-08
- Level: Level 25: Flip The Answer
- Step id: level-25-side
- Field changed: body
- Status: COMPLETE

## tier1/10-one-program-two-allies.md — 2026-05-08
- Level: Level 27: One Program, Two Allies
- Step id: level-27-shared-program
- Field changed: body
- Status: COMPLETE

## tier1/11-index-jobs.md — 2026-05-08
- Level: Level 28: Index Jobs
- Step id: level-28-jobs
- Field changed: body
- Status: COMPLETE

## tier1/12-first-two-defend.md — 2026-05-08
- Level: Level 29: First Two Defend
- Action: Added tips array (was missing)
- tip[0]: "Stay Still can remove a barrier directly in front — remember that from an earlier level?"
- Status: COMPLETE

## tier2/01-my-side-their-side-toolbox.md — 2026-05-08
- Level: Level 19: My Side, Their Side
- Field changed: toolboxBlockTypes
- Old value: [...TERRITORY_BLOCKS, ...EXTENDED_MOVEMENT_BLOCKS]
- New value: [BLOCK_TYPES.IF_ON_MY_SIDE, BLOCK_TYPES.IF_ON_MY_SIDE_ELSE, ...EXTENDED_MOVEMENT_BLOCKS]
- Status: COMPLETE

## tier2/02-first-two-defend-turn-limit.md — 2026-05-08
- Level: Level 29: First Two Defend
- Field changed: failureCondition.maxTurns
- Old value: 6
- New value: 10
- Status: COMPLETE

## tier2/03-barrier-specialist-turn-limit.md — 2026-05-08
- Level: Level 33: Barrier Specialist
- Field changed: failureCondition.maxTurns
- Old value: 3
- New value: 8
- Status: COMPLETE

## tier2/04-jump-team-turn-limit.md — 2026-05-08
- Level: Level 34: Jump Team
- Field changed: failureCondition.maxTurns
- Old value: 3
- New value: 8
- Status: COMPLETE

## tier3/01-score-a-point-demo.md — 2026-05-09
- Level: Level 3: Score a Point
- Constant changed: SCORE_SWITCH_DEMO_XML
- Old condition: if_have_enemy_flag_else (was solution)
- New condition: if_barrier_in_front_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/02-barrier-detour-demo.md — 2026-05-09
- Level: Level 4: Barrier Detour
- Constant changed: BARRIER_DETOUR_DEMO_XML
- Old condition: if_barrier_in_front_else (was solution)
- New condition: if_have_enemy_flag_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/03-sensor-barrier-branch-demo.md — 2026-05-09
- Level: Level 6: Barrier Sensor Branch
- Constant changed: SENSOR_BARRIER_DEMO_XML
- Old sensor: BARRIER/DIRECTLY_IN_FRONT (was solution)
- New sensor: ENEMY_RUNNER/WITHIN_2 (not available in this level)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/04-find-the-human-demo.md — 2026-05-09
- Level: Level 8: Find the Human
- Constant changed: FIND_HUMAN_DEMO_XML
- Old sensor: HUMAN_RUNNER/ANYWHERE_ABOVE (nested, was solution)
- New sensor: BARRIER/DIRECTLY_IN_FRONT (not available in this level)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/05-bring-it-home-demo.md — 2026-05-09
- Level: Level 12: Bring It Home
- Constant changed: BRING_IT_HOME_DEMO_XML
- Old condition: if_have_enemy_flag_else with Move Toward (was solution)
- New condition: if_can_jump_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/06-enemy-nearby-demo.md — 2026-05-09
- Level: Level 13: Enemy Nearby
- Constant changed: ENEMY_NEARBY_DEMO_XML
- Old sensor: ENEMY_RUNNER/WITHIN_2 (was solution)
- New sensor: BARRIER/DIRECTLY_IN_FRONT (not available in this level)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/07-jump-the-gap-demo-remove.md — 2026-05-09
- Level: Level 14: Jump the Gap
- Action: Removed demoBlocklyXml, demoTitle, demoCaption from step level-14-jump
- Constant JUMP_THE_GAP_DEMO_XML: still present in file (unused)
- Status: COMPLETE

## tier3/08-jump-if-ready-demo.md — 2026-05-09
- Level: Level 15: Jump If Ready
- Constant changed: JUMP_IF_READY_DEMO_XML
- Old condition: if_can_jump_else (was solution)
- New condition: if_have_enemy_flag_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/09-stay-still-can-do-something-demo.md — 2026-05-09
- Level: Level 17: Stay Still Can Do Something
- Constant changed: STAY_STILL_DEMO_XML
- Old sensor: BARRIER/DIRECTLY_IN_FRONT ? stay_still (was solution)
- New sensor: ENEMY_RUNNER/WITHIN_2 (not available in this level)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/10-relay-race-demo.md — 2026-05-09
- Level: Level 18: Relay Race
- Constant changed: RELAY_RACE_DEMO_XML
- Old condition: if_teammate_has_flag_else with Move Toward (was solution)
- New condition: if_barrier_in_front_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE

## tier3/11-freeze-the-lane-demo.md — 2026-05-09
- Level: Level 20: Freeze the Lane
- Constant changed: FREEZE_THE_LANE_DEMO_XML
- Old condition: if_area_freeze_ready_else (was solution)
- New condition: if_can_jump_else (not in toolbox)
- demoCaption updated: yes
- Status: COMPLETE

## tier4/01-reach-enemy-flag-board.md — 2026-05-09
- Level: Level 2: Reach Enemy Flag
- Field changed: setupOverrides
- Ally position: (1,4) ? (9,4)
- Flag override added: Team 2 flag at (7,4)
- Status: COMPLETE

## tier4/02-how-far-away-board.md — 2026-05-09
- Level: Level 22: How Far Away?
- NPC1 position: (4,4) ? (5,4)
- winCondition.targetCell: (2,3) ? (5,2)
- Status: COMPLETE

## tier4/03-relay-race-board.md — 2026-05-09
- Level: Level 18: Relay Race
- Option chosen: B
- Changes made: None (Option B selected as Option A violates Tier 4 slot rules)
- Status: SKIPPED

## tier4/04-barrier-specialist-board.md — 2026-05-09
- Level: Level 33: Barrier Specialist
- Change: NPC1 repositioned from (8,5) to (6,5)
- Status: COMPLETE

## tier5/01-remove-enemy-side-decision-making.md — 2026-05-09
- Level removed: Level 26: Enemy-Side Decision Making (id: enemy-side-decision-making)
- Verified: id not found in file after removal
- Verified: flip-the-answer now adjacent to one-program-two-allies
- Status: COMPLETE

## tier1/13-reach-enemy-flag.md — 2026-05-09
- Level: Level 2: Reach Enemy Flag
- Step id: level-2-new-block
- Field changed: body
- Status: COMPLETE

## tier6/01-insert-synthesis-levels.md — 2026-05-09
- Inserted: dodge-and-deliver (after jump-the-gap)
- Inserted: show-what-you-know (after freeze-the-lane)
- Inserted: full-team-tactics (after flip-the-answer, after Tier 5 removal)
- Order verified: yes
- Status: COMPLETE

## tier7/01-title-renumbering.md — 2026-05-09
- Levels renamed: 23 title strings updated
- jump-if-ready: 15 ? 16
- build-the-barrier: 16 ? 17
- stay-still-can-do-something: 17 ? 18
- relay-race: 18 ? 19
- my-side-their-side: 19 ? 20
- freeze-the-lane: 20 ? 21
- closest-threat: 21 ? 23
- how-far-away: 22 ? 24
- two-conditions-at-once: 23 ? 25
- this-or-that: 24 ? 26
- flip-the-answer: 25 ? 27
- one-program-two-allies: 27 ? 29
- index-jobs: 28 ? 30
- first-two-defend: 29 ? 31
- escort-the-carrier: 30 ? 32
- closest-enemy-defender: 31 ? 33
- freeze-support: 32 ? 34
- barrier-specialist: 33 ? 35
- jump-team: 34 ? 36
- advanced-scrimmage: 35 ? 37
- dodge-and-deliver: Challenge ? Challenge 15
- show-what-you-know: Challenge ? Challenge 22
- full-team-tactics: Challenge ? Challenge 28
- Status: COMPLETE
