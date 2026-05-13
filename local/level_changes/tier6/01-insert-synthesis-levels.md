---
status: COMPLETE
tier: 6
level-id: [multiple: dodge-and-deliver, show-what-you-know, full-team-tactics]
level-title: "Three Synthesis Level Insertions"
change-type: level insertion (three objects)
target-file: src/config/levels.js
---

## Summary
Three synthesis levels are inserted at arc boundaries. Each uses only tools already taught — no new blocks — and features live enemies. Anchor IDs (stable slug values) are used for all insertion points.

**Insertion points (by anchor id, after which to insert):**
1. After `id: "jump-the-gap"` (currently L14) → insert `dodge-and-deliver`
2. After `id: "freeze-the-lane"` (currently L20) → insert `show-what-you-know`
3. After `id: "flip-the-answer"` (currently L25; after L26 removal per Tier 5) → insert `full-team-tactics`

**Dependencies:**
- Tier 5 (`tier5/01-remove-enemy-side-decision-making.md`) should be COMPLETE before inserting `full-team-tactics`, so that the anchor `flip-the-answer` is correctly adjacent to `one-program-two-allies`.
- Tier 7 renumbering is applied AFTER all Tier 6 insertions.

**Developer verification required:** NPC movement behavior defaults to the team's `playDirection` each turn. Verify that NPC runners in these levels produce sensible movement for students before committing. All NPC positions can be adjusted based on playtesting without re-running this change step — just update coordinates directly.

---

## Insertion 1: Dodge and Deliver (after `jump-the-gap`)

### What to Read
Find the level object with `id: "jump-the-gap"` and its closing `},`. The new object goes immediately after that closing comma.

### Anchor context (end of jump-the-gap, to locate the insertion point)
```
    }
  },
  {
    id: "jump-if-ready",
```

### What to insert (between `jump-the-gap` and `jump-if-ready`)
Insert the following new object so the sequence reads `jump-the-gap → dodge-and-deliver → jump-if-ready`:

```javascript
  {
    id: "dodge-and-deliver",
    title: "Challenge: Dodge and Deliver",
    description: "Pick up the enemy flag and bring it home while a live enemy patrols the field.",
    introText: "No new tools this time. An enemy is watching the midfield. Use what you know.",
    tips: [
      "There is no single right answer — think about how to balance chasing the flag and avoiding the threat.",
      "Checking the enemy's distance before committing to a direction can help.",
      "The enemy flag needs to come all the way back home to score a point."
    ],
    mode: GAME_MODES.PLAYER_VS_NPC,
    mapKey: "simpleAisle",
    humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
    toolboxBlockTypes: [
      BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
      BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
      ...GENERIC_SENSOR_BLOCKS,
      ...MOVE_TOWARD_BLOCKS,
      ...JUMP_BLOCKS,
      ...EXTENDED_MOVEMENT_BLOCKS
    ],
    sensorObjectTypes: [
      SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
      SENSOR_OBJECT_TYPES.BARRIER,
      SENSOR_OBJECT_TYPES.HUMAN_RUNNER,
      SENSOR_OBJECT_TYPES.ENEMY_FLAG
    ],
    sensorRelationTypes: [
      SENSOR_RELATION_TYPES.WITHIN_2,
      SENSOR_RELATION_TYPES.WITHIN_3,
      SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
      SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
      SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
      SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
      SENSOR_RELATION_TYPES.ANYWHERE_BELOW
    ],
    moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
    initialBlocklyXml: STARTER_EVENT_XML,
    winCondition: { type: "team_scores_point", teamId: 1, runnerId: "runner_1_AI_AllyP1" },
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 22 },
    tutorialSteps: [
      {
        id: "dodge-and-deliver-real-game",
        title: "A Real Game Situation",
        body: "This is a real game situation — one enemy is moving. Your program needs to make progress while staying out of trouble.",
        targetSelector: "#canvas-container"
      },
      {
        id: "dodge-and-deliver-toolkit",
        title: "Your Full Toolkit",
        body: "All the tools from the previous levels are here. There is no single right answer — think about how your ally should balance chasing the flag and avoiding the threat.",
        targetSelector: "#blockly-region"
      }
    ],
    setup: {
      pointsToWin: 1,
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      teams: {
        player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
        opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 6, gridY: 4 }, { slot: "npc2", gridX: 10, gridY: 6, isFrozen: true, frozenTurnsRemaining: 999 }] }
      },
      flags: { opponent: { gridX: 9, gridY: 4 } }
    }
  },
```

---

## Insertion 2: Show What You Know (after `freeze-the-lane`)

### What to Read
Find the level object with `id: "freeze-the-lane"` and its closing `},`. The new object goes immediately after that closing comma.

### Anchor context (end of freeze-the-lane, to locate the insertion point)
```
    }
  },
  {
    id: "closest-threat",
```

### What to insert (between `freeze-the-lane` and `closest-threat`)
Insert the following new object so the sequence reads `freeze-the-lane → show-what-you-know → closest-threat`:

```javascript
  {
    id: "show-what-you-know",
    title: "Challenge: Show What You Know",
    description: "Score a point against live defenders using any tool you have learned so far.",
    introText: "No new tools this time. Two enemies are active. Use what you know to score.",
    tips: [
      "You have movement, sensing, flag state, helper blocks, barriers, jumping, and freeze.",
      "There is more than one way to win — experiment with what you have.",
      "Freeze is a team power that can give you a window to act."
    ],
    mode: GAME_MODES.PLAYER_VS_NPC,
    mapKey: "midfieldPressure",
    humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
    toolboxBlockTypes: [
      BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
      BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
      BLOCK_TYPES.IF_BARRIER_IN_FRONT,
      BLOCK_TYPES.IF_BARRIER_IN_FRONT_ELSE,
      ...GENERIC_SENSOR_BLOCKS,
      ...MOVE_TOWARD_BLOCKS,
      ...JUMP_CONDITION_BLOCKS,
      ...JUMP_BLOCKS,
      ...BARRIER_PLACEMENT_BLOCKS,
      ...BARRIER_READY_BLOCKS,
      ...AREA_FREEZE_BLOCKS,
      ...TERRITORY_BLOCKS,
      ...EXTENDED_MOVEMENT_BLOCKS
    ],
    sensorObjectTypes: [
      SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
      SENSOR_OBJECT_TYPES.BARRIER,
      SENSOR_OBJECT_TYPES.HUMAN_RUNNER,
      SENSOR_OBJECT_TYPES.EDGE_OR_WALL,
      SENSOR_OBJECT_TYPES.ENEMY_FLAG
    ],
    sensorRelationTypes: [
      SENSOR_RELATION_TYPES.WITHIN_2,
      SENSOR_RELATION_TYPES.WITHIN_3,
      SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
      SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
      SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
      SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
      SENSOR_RELATION_TYPES.ANYWHERE_BELOW
    ],
    moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
    initialBlocklyXml: STARTER_EVENT_XML,
    winCondition: { type: "team_scores_point", teamId: 1, runnerId: "runner_1_AI_AllyP1" },
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 24 },
    tutorialSteps: [
      {
        id: "show-what-you-know-challenge",
        title: "No New Tools",
        body: "This level does not introduce anything new. Two enemies are active and you need to score a point — use any combination of what you have already learned.",
        targetSelector: "#canvas-container"
      },
      {
        id: "show-what-you-know-strategy",
        title: "Think Like A Programmer",
        body: "There is no single right program. Think about what conditions matter, what actions respond to them, and what your ally should do when the situation changes.",
        targetSelector: "#blockly-region"
      }
    ],
    setup: {
      pointsToWin: 1,
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      teams: {
        player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
        opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 7, gridY: 3 }, { slot: "npc2", gridX: 7, gridY: 5 }] }
      },
      flags: { opponent: { gridX: 9, gridY: 4 } }
    }
  },
```

---

## Insertion 3: Full Team Tactics (after `flip-the-answer`)

**Prerequisite:** Tier 5 must be COMPLETE (L26 removed) so `flip-the-answer` is now directly followed by `one-program-two-allies`.

### What to Read
Find the level object with `id: "flip-the-answer"` and its closing `},`. Confirm the next level object has `id: "one-program-two-allies"`. The new object goes between them.

### Anchor context (end of flip-the-answer, to locate the insertion point)
```
    }
  },
  {
    id: "one-program-two-allies",
```

### What to insert (between `flip-the-answer` and `one-program-two-allies`)
Insert the following new object so the sequence reads `flip-the-answer → full-team-tactics → one-program-two-allies`:

```javascript
  {
    id: "full-team-tactics",
    title: "Challenge: Full Team Tactics",
    description: "Score a point against live defenders using your complete single-ally toolkit.",
    introText: "One last single-ally challenge before team programming begins. Two defenders are active.",
    tips: [
      "You have the full single-ally toolkit — sensing, territory, NOT, freeze, barriers, and more.",
      "Think about which tools matter most when an enemy is nearby.",
      "The next level changes everything — two allies will share one program."
    ],
    mode: GAME_MODES.PLAYER_VS_NPC,
    mapKey: "simpleAisle",
    humanTurnBehavior: HUMAN_TURN_BEHAVIORS.AUTO_SKIP,
    toolboxBlockTypes: [
      BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
      BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
      BLOCK_TYPES.IF_BARRIER_IN_FRONT,
      BLOCK_TYPES.IF_BARRIER_IN_FRONT_ELSE,
      ...GENERIC_SENSOR_BLOCKS,
      ...MOVE_TOWARD_BLOCKS,
      ...JUMP_CONDITION_BLOCKS,
      ...JUMP_BLOCKS,
      ...BARRIER_PLACEMENT_BLOCKS,
      ...BARRIER_READY_BLOCKS,
      ...AREA_FREEZE_BLOCKS,
      ...TERRITORY_BLOCKS,
      ...EXTENDED_MOVEMENT_BLOCKS
    ],
    sensorObjectTypes: [
      SENSOR_OBJECT_TYPES.ENEMY_RUNNER,
      SENSOR_OBJECT_TYPES.BARRIER,
      SENSOR_OBJECT_TYPES.HUMAN_RUNNER,
      SENSOR_OBJECT_TYPES.EDGE_OR_WALL,
      SENSOR_OBJECT_TYPES.ENEMY_FLAG
    ],
    sensorRelationTypes: [
      SENSOR_RELATION_TYPES.WITHIN_2,
      SENSOR_RELATION_TYPES.WITHIN_3,
      SENSOR_RELATION_TYPES.DIRECTLY_IN_FRONT,
      SENSOR_RELATION_TYPES.ANYWHERE_FORWARD,
      SENSOR_RELATION_TYPES.ANYWHERE_BEHIND,
      SENSOR_RELATION_TYPES.ANYWHERE_ABOVE,
      SENSOR_RELATION_TYPES.ANYWHERE_BELOW
    ],
    moveTowardTargetTypes: [MOVE_TOWARD_TARGETS.ENEMY_FLAG, MOVE_TOWARD_TARGETS.MY_BASE],
    initialBlocklyXml: STARTER_EVENT_XML,
    winCondition: { type: "team_scores_point", teamId: 1, runnerId: "runner_1_AI_AllyP1" },
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 20 },
    tutorialSteps: [
      {
        id: "full-team-tactics-last-solo",
        title: "One Last Solo Challenge",
        body: "This is a real game situation with two active defenders. Use any part of your single-ally toolkit to score.",
        targetSelector: "#canvas-container"
      },
      {
        id: "full-team-tactics-next",
        title: "What Comes Next",
        body: "You have written programs that sense, decide, and use special actions. The next challenge asks you to do this for two allies at once — using the same program.",
        targetSelector: "#blockly-region"
      }
    ],
    setup: {
      pointsToWin: 1,
      autoStayHumanRunnerIds: ["runner_1_HumanP1"],
      teams: {
        player: { playDirection: 1, runners: [{ slot: "human", gridX: 1, gridY: 1 }, { slot: "ally", gridX: 1, gridY: 4 }] },
        opponent: { playDirection: -1, runners: [{ slot: "npc1", gridX: 7, gridY: 3 }, { slot: "npc2", gridX: 7, gridY: 5 }] }
      },
      flags: { opponent: { gridX: 9, gridY: 4 } }
    }
  },
```

---

## Verification (all three insertions)

After all three insertions, verify the order in LEVEL_DEFINITIONS:
1. `jump-the-gap` → `dodge-and-deliver` → `jump-if-ready`
2. `freeze-the-lane` → `show-what-you-know` → `closest-threat`
3. `flip-the-answer` → `full-team-tactics` → `one-program-two-allies`

Confirm no duplicate `id` values exist for the three new levels by searching for each id.

## Log Entry Template
```
## tier6/01-insert-synthesis-levels.md — [DATE]
- Inserted: dodge-and-deliver (after jump-the-gap)
- Inserted: show-what-you-know (after freeze-the-lane)
- Inserted: full-team-tactics (after flip-the-answer, after Tier 5 removal)
- Order verified: yes
- Status: COMPLETE
```
