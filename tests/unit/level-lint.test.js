import test from "node:test";
import assert from "node:assert/strict";
import {
  checkBugHuntHasBrokenStarter,
  checkBugHuntHasReferenceSolution,
  checkBugHuntLevelsIntroduceNoNewBlock,
  checkChallengeLevelsIntroduceNoNewBlock,
  checkFlagSetupGameSpecCompliance,
  checkConceptMatrixAgreement,
  checkDemoBlocklyDoesNotSolveLevel,
  checkProjectMetadata,
  checkProjectToolboxPolicy,
  checkPredictionHasValidSchema,
  checkReferenceSolutionFixtureNameMatchesLevelId,
  checkReferenceSolutionToolboxCompatibility,
  checkSensorRelationPolicy,
  checkStarterXmlWellFormedNextNesting,
  checkTurnLimitFloor,
  checkWinConditionRequiresNamedMechanic,
  formatDiagnostic,
  runLevelLint
} from "../../scripts/lint-levels.js";
import {
  STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS,
  TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS
} from "../../src/config/levels/shared/projectToolboxes.js";

function createLevel(overrides = {}) {
  return {
    id: "level-one",
    title: "Level 1: Example",
    levelKind: null,
    initialBlocklyXml: "<xml><block type=\"battlegorithms_on_each_turn\"></block></xml>",
    toolboxBlockTypes: ["battlegorithms_move_forward"],
    failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 },
    winCondition: { type: "runner_reaches_cell" },
    sensorObjectTypes: [],
    sensorRelationTypes: [],
    tutorialSteps: [],
    sourcePath: "/abs/level-one.js",
    ...overrides
  };
}

function createMatrixRow(levelLabel, focus) {
  return {
    levelLabel,
    focus,
    newVocabulary: "",
    newBlockly: "",
    assumes: ""
  };
}

test("concept matrix agreement passes when level order and labels match", () => {
  const levels = [createLevel({ id: "one", title: "Level 1: One" }), createLevel({ id: "two", title: "Level 2: Two", sourcePath: "/abs/two.js" })];
  const matrix = [createMatrixRow("1", "One"), createMatrixRow("2", "Two")];
  assert.deepEqual(checkConceptMatrixAgreement(levels, matrix), []);
});

test("concept matrix agreement keeps distinct optional lab rows separate", () => {
  const levels = [
    createLevel({ id: "optional-one", title: "Optional Lab: First Optional" }),
    createLevel({ id: "optional-two", title: "Optional Lab: Second Optional", sourcePath: "/abs/optional-two.js" })
  ];
  const matrix = [
    createMatrixRow("Optional Lab: First Optional", ""),
    createMatrixRow("Optional Lab: Second Optional", "")
  ];
  assert.deepEqual(checkConceptMatrixAgreement(levels, matrix), []);
});

test("concept matrix agreement reports missing and misordered rows", () => {
  const levels = [createLevel({ id: "one", title: "Level 1: One" }), createLevel({ id: "two", title: "Level 2: Two" })];
  const matrix = [createMatrixRow("1", "One"), createMatrixRow("3", "Three")];
  const diagnostics = checkConceptMatrixAgreement(levels, matrix);
  assert.equal(diagnostics.some((entry) => entry.contract === "concept-matrix-agreement"), true);
});

test("reference solution toolbox compatibility passes for included blocks", () => {
  const level = createLevel({ id: "toolbox-ok", toolboxBlockTypes: ["battlegorithms_move_forward", "battlegorithms_if_have_enemy_flag"] });
  const ref = new Map([
    [
      "toolbox-ok",
      {
        filePath: "/abs/toolbox-ok.xml",
        xmlText: `<xml><block type="battlegorithms_on_each_turn"><next><block type="battlegorithms_move_forward"></block></next></block></xml>`
      }
    ]
  ]);
  assert.deepEqual(checkReferenceSolutionToolboxCompatibility([level], { referenceSolutionsByLevelId: ref }), []);
});

test("reference solution toolbox compatibility reports missing blocks", () => {
  const level = createLevel({ id: "toolbox-missing", toolboxBlockTypes: ["battlegorithms_move_forward"] });
  const ref = new Map([
    [
      "toolbox-missing",
      {
        filePath: "/abs/toolbox-missing.xml",
        xmlText: `<xml><block type="battlegorithms_on_each_turn"><next><block type="battlegorithms_move_randomly"></block></next></block></xml>`
      }
    ]
  ]);
  const diagnostics = checkReferenceSolutionToolboxCompatibility([level], { referenceSolutionsByLevelId: ref });
  assert.equal(diagnostics[0].contract, "reference-solution-toolbox-compatibility");
});

test("demo Blockly comparison ignores layout but flags identical programs", () => {
  const level = createLevel({
    id: "demo",
    tutorialSteps: [
      {
        id: "demo-step",
        demoBlocklyXml: `<xml><block type="battlegorithms_on_each_turn" x="9" y="9"><next><block type="battlegorithms_move_forward"></block></next></block></xml>`
      }
    ]
  });
  const ref = new Map([
    [
      "demo",
      {
        filePath: "/abs/demo.xml",
        xmlText: `<xml><block type="battlegorithms_on_each_turn"><next><block type="battlegorithms_move_forward"></block></next></block></xml>`
      }
    ]
  ]);
  const diagnostics = checkDemoBlocklyDoesNotSolveLevel([level], { referenceSolutionsByLevelId: ref });
  assert.equal(diagnostics[0].contract, "demo-does-not-solve-level");
});

test("prediction levels do not warn when their schema is complete", () => {
  const levels = [
    createLevel({
      id: "prediction-ok",
      title: "Prediction 1: Example",
      levelKind: "prediction",
      prediction: {
        prompt: "Will the runner move forward?",
        choices: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" }
        ],
        correctChoiceId: "yes"
      }
    })
  ];
  assert.deepEqual(checkPredictionHasValidSchema(levels), []);
});

test("prediction levels warn when their schema is missing or malformed", () => {
  const levels = [
    createLevel({ id: "missing", title: "Prediction 2: Missing", levelKind: "prediction" }),
    createLevel({
      id: "bad",
      title: "Prediction 3: Bad",
      levelKind: "prediction",
      prediction: {
        prompt: "",
        choices: [{ id: "yes", label: "Yes" }],
        correctChoiceId: "nope"
      }
    })
  ];
  const diagnostics = checkPredictionHasValidSchema(levels);
  assert.equal(diagnostics.some((entry) => entry.contract === "prediction-has-valid-schema"), true);
  assert.equal(diagnostics.every((entry) => entry.severity === "warning"), true);
});

test("challenge levels do not warn when they reuse only previously introduced blocks", () => {
  const levels = [
    createLevel({ id: "base-1", title: "Level 1: Base One", toolboxBlockTypes: ["a"] }),
    createLevel({ id: "base-2", title: "Level 2: Base Two", toolboxBlockTypes: ["a", "b"] }),
    createLevel({ id: "challenge", title: "Challenge 3: Challenge", levelKind: "challenge", toolboxBlockTypes: ["b"] })
  ];
  const diagnostics = checkChallengeLevelsIntroduceNoNewBlock(levels);
  assert.deepEqual(diagnostics, []);
});

test("challenge levels can reuse a block first introduced by the project arc", () => {
  const levels = [
    createLevel({ id: "base-1", title: "Level 1: Base One", toolboxBlockTypes: ["battlegorithms_move_forward"] }),
    createLevel({
      id: "project-start",
      title: "Level 2: Project Start",
      project: { id: "strategy-brain", step: 1 },
      toolboxBlockTypes: ["battlegorithms_move_forward", "battlegorithms_value_count_within"]
    }),
    createLevel({
      id: "challenge",
      title: "Challenge 3: Challenge",
      levelKind: "challenge",
      toolboxBlockTypes: ["battlegorithms_value_count_within"]
    })
  ];
  const diagnostics = checkChallengeLevelsIntroduceNoNewBlock(levels);
  assert.deepEqual(diagnostics, []);
});

test("challenge levels warn when they expose a first-seen block", () => {
  const levels = [
    createLevel({ id: "base-1", title: "Level 1: Base One", toolboxBlockTypes: ["a"] }),
    createLevel({ id: "challenge", title: "Challenge 2: Challenge", levelKind: "challenge", toolboxBlockTypes: ["a", "c"] })
  ];
  const diagnostics = checkChallengeLevelsIntroduceNoNewBlock(levels);
  assert.equal(diagnostics.some((entry) => entry.contract === "challenge-introduces-no-new-block"), true);
  assert.equal(diagnostics[0].severity, "warning");
});

test("bug hunt levels do not warn when they reuse only previously introduced blocks", () => {
  const levels = [
    createLevel({ id: "base-1", title: "Level 1: Base One", toolboxBlockTypes: ["a"] }),
    createLevel({ id: "base-2", title: "Level 2: Base Two", toolboxBlockTypes: ["a", "b"] }),
    createLevel({ id: "bug-hunt", title: "Level 3: Bug Hunt", levelKind: "bug_hunt", toolboxBlockTypes: ["b"] })
  ];
  const diagnostics = checkBugHuntLevelsIntroduceNoNewBlock(levels);
  assert.deepEqual(diagnostics, []);
});

test("bug hunt levels warn when they expose a first-seen block", () => {
  const levels = [
    createLevel({ id: "base-1", title: "Level 1: Base One", toolboxBlockTypes: ["a"] }),
    createLevel({ id: "bug-hunt", title: "Level 2: Bug Hunt", levelKind: "bug_hunt", toolboxBlockTypes: ["a", "c"] })
  ];
  const diagnostics = checkBugHuntLevelsIntroduceNoNewBlock(levels);
  assert.equal(diagnostics.some((entry) => entry.contract === "bug-hunt-introduces-no-new-block"), true);
  assert.equal(diagnostics[0].severity, "warning");
});

test("bug hunt starter and reference solution contracts validate the authored repair loop", () => {
  const level = createLevel({
    id: "bug-hunt",
    title: "Level 2: Bug Hunt",
    levelKind: "bug_hunt",
    initialBlocklyXml: "<xml><block type=\"battlegorithms_move_forward\"></block></xml>"
  });
  const ref = new Map([
    [
      "bug-hunt",
      {
        filePath: "/abs/bug-hunt.xml",
        xmlText: "<xml><block type=\"battlegorithms_move_backward\"></block></xml>"
      }
    ]
  ]);
  assert.deepEqual(checkBugHuntHasBrokenStarter([level], { referenceSolutionsByLevelId: ref }), []);
  assert.deepEqual(checkBugHuntHasReferenceSolution([level], { referenceSolutionsByLevelId: ref }), []);

  const brokenStarter = createLevel({
    id: "bug-hunt",
    title: "Level 3: Bug Hunt",
    levelKind: "bug_hunt",
    initialBlocklyXml: "<xml><block type=\"battlegorithms_move_backward\"></block></xml>"
  });
  assert.equal(checkBugHuntHasBrokenStarter([brokenStarter], { referenceSolutionsByLevelId: ref })[0].contract, "bug-hunt-has-broken-starter");

  const missingReference = createLevel({
    id: "missing-ref",
    title: "Level 4: Bug Hunt",
    levelKind: "bug_hunt",
    initialBlocklyXml: "<xml><block type=\"battlegorithms_move_forward\"></block></xml>"
  });
  assert.equal(checkBugHuntHasReferenceSolution([missingReference], { referenceSolutionsByLevelId: new Map() })[0].contract, "bug-hunt-has-reference-solution");
});

test("checkStarterXmlWellFormedNextNesting passes on well-formed Blockly XML", () => {
  const wellFormed = createLevel({
    id: "well-formed",
    initialBlocklyXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn">
    <next>
      <block type="battlegorithms_move_forward">
        <next>
          <block type="battlegorithms_stay_still"></block>
        </next>
      </block>
    </next>
  </block>
</xml>`.trim()
  });
  assert.deepEqual(checkStarterXmlWellFormedNextNesting([wellFormed]), []);
});

test("checkStarterXmlWellFormedNextNesting flags a <next> sibling of a <block> in starter XML", () => {
  // This is the exact malformation that hit bughunt-22: the inner <block> is
  // self-closed and the <next> chain sits next to it as a sibling instead of
  // inside it. Blockly silently drops the second block, so authored content
  // never reaches the student.
  const malformed = createLevel({
    id: "malformed-starter",
    initialBlocklyXml: `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn">
    <next>
      <block type="battlegorithms_move_forward"></block>
      <next>
        <block type="battlegorithms_stay_still"></block>
      </next>
    </next>
  </block>
</xml>`.trim()
  });
  const diagnostics = checkStarterXmlWellFormedNextNesting([malformed]);
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].contract, "starter-xml-well-formed-next-nesting");
  assert.equal(diagnostics[0].levelId, "malformed-starter");
  assert.ok(diagnostics[0].message.includes("starter"));
});

test("checkStarterXmlWellFormedNextNesting also flags reference solution XML when malformed", () => {
  const level = createLevel({
    id: "ref-broken",
    initialBlocklyXml: "<xml><block type=\"battlegorithms_move_forward\"></block></xml>"
  });
  const refs = new Map([
    [
      "ref-broken",
      {
        filePath: "/abs/ref-broken.xml",
        xmlText:
          "<xml><block type=\"battlegorithms_move_forward\"></block><next><block type=\"battlegorithms_stay_still\"></block></next></xml>"
      }
    ]
  ]);
  const diagnostics = checkStarterXmlWellFormedNextNesting([level], {
    referenceSolutionsByLevelId: refs
  });
  assert.equal(diagnostics.length, 1);
  assert.ok(diagnostics[0].message.includes("reference solution"));
});

test("project capstone challenges do not warn for approved blocks already introduced earlier", () => {
  const levels = [
    createLevel({
      id: "base-1",
      title: "Level 1: Base One",
      toolboxBlockTypes: ["battlegorithms_move_forward", "battlegorithms_move_toward"]
    }),
    createLevel({
      id: "capstone",
      title: "Challenge 2: Project Capstone",
      levelKind: "challenge",
      project: { id: "strategy-brain", step: 6, isCapstone: true },
      toolboxBlockTypes: ["battlegorithms_move_forward", "battlegorithms_move_toward"]
    })
  ];
  const diagnostics = checkChallengeLevelsIntroduceNoNewBlock(levels);
  assert.deepEqual(diagnostics, []);
});

test("project metadata requires the authored arc id and step", () => {
  const good = [
    createLevel({ id: "closest-threat", project: { id: "strategy-brain", step: 1 } }),
    createLevel({ id: "one-program-two-allies", project: { id: "team-strategy-script", step: 1 } })
  ];
  assert.deepEqual(checkProjectMetadata(good), []);

  const bad = createLevel({ id: "closest-threat", project: { id: "wrong", step: 1 } });
  assert.equal(checkProjectMetadata([bad])[0].contract, "project-metadata");
});

test("project toolbox policy matches the shared broad project toolboxes", () => {
  const strategyBrain = createLevel({
    id: "closest-threat",
    project: { id: "strategy-brain", step: 1 },
    toolboxBlockTypes: [...STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS]
  });
  const teamStrategyScript = createLevel({
    id: "one-program-two-allies",
    project: { id: "team-strategy-script", step: 1 },
    toolboxBlockTypes: [...TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS]
  });
  assert.deepEqual(checkProjectToolboxPolicy([strategyBrain, teamStrategyScript]), []);

  const broken = createLevel({
    id: "closest-threat",
    project: { id: "strategy-brain", step: 1 },
    toolboxBlockTypes: ["battlegorithms_move_forward"]
  });
  assert.equal(checkProjectToolboxPolicy([broken])[0].contract, "project-toolbox-policy");
});

test("turn limit floor reports low or missing turn limits", () => {
  const ok = createLevel({ failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 } });
  assert.deepEqual(checkTurnLimitFloor([ok]), []);
  const bad = createLevel({ failureCondition: { type: "turn_limit_exceeded", maxTurns: 6 } });
  assert.equal(checkTurnLimitFloor([bad])[0].contract, "turn-limit-floor");
  assert.equal(checkTurnLimitFloor([bad])[0].severity, "warning");

  const plural = createLevel({
    failureCondition: null,
    failureConditions: [
      { type: "team_scores_point", teamId: 2 },
      { type: "turn_limit_exceeded", maxTurns: 8 }
    ]
  });
  assert.deepEqual(checkTurnLimitFloor([plural]), []);
});

test("win condition heuristic warns when the mechanic is only described in prose", () => {
  const level = createLevel({
    id: "mechanic",
    title: "Level 2: Barrier Lesson",
    description: "Use a barrier to win.",
    winCondition: { type: "runner_reaches_cell" }
  });
  const matrix = [createMatrixRow("2", "Barrier detour")];
  const diagnostics = checkWinConditionRequiresNamedMechanic([level], matrix);
  assert.equal(diagnostics[0].severity, "warning");
  assert.equal(diagnostics[0].contract, "win-condition-requires-named-mechanic");
});

test("reference solution fixture names must match level ids", () => {
  const levels = [createLevel({ id: "alpha" })];
  const ref = new Map([
    [
      "alpha",
      {
        filePath: "/abs/guided-reference-solutions/alpha.xml",
        xmlText: "<xml></xml>"
      }
    ]
  ]);
  assert.deepEqual(checkReferenceSolutionFixtureNameMatchesLevelId(levels, { referenceSolutionsByLevelId: ref }), []);

  const wrong = new Map([
    [
      "alpha",
      {
        filePath: "/abs/guided-reference-solutions/not-alpha.xml",
        xmlText: "<xml></xml>"
      }
    ]
  ]);
  assert.equal(checkReferenceSolutionFixtureNameMatchesLevelId(levels, { referenceSolutionsByLevelId: wrong })[0].contract, "reference-solution-fixture-name");
});

test("sensor relation policy warns for undeclared relations in the reference solution", () => {
  const level = createLevel({
    id: "sensor",
    sensorRelationTypes: ["ANYWHERE_FORWARD", "ANYWHERE_BEHIND"]
  });
  const ref = new Map([
    [
      "sensor",
      {
        filePath: "/abs/sensor.xml",
        xmlText: `<xml><block type="battlegorithms_on_each_turn"><next><block type="battlegorithms_if_sensor_matches_else"><field name="RELATION">DIRECTLY_IN_FRONT</field></block></next></block></xml>`
      }
    ]
  ]);
  const diagnostics = checkSensorRelationPolicy([level], { referenceSolutionsByLevelId: ref });
  assert.equal(diagnostics[0].severity, "warning");
  assert.equal(diagnostics[0].contract, "sensor-relation-policy");
});

test("sensor relation policy passes when horizontal and vertical directional pairs are both declared", () => {
  const level = createLevel({
    id: "sensor-paired",
    sensorRelationTypes: [
      "DIRECTLY_IN_FRONT",
      "DIRECTLY_BEHIND",
      "DIRECTLY_ABOVE",
      "DIRECTLY_BELOW",
      "ANYWHERE_FORWARD",
      "ANYWHERE_BEHIND",
      "ANYWHERE_ABOVE",
      "ANYWHERE_BELOW"
    ]
  });

  assert.deepEqual(checkSensorRelationPolicy([level]), []);
});

test("sensor relation policy warns when the vertical direct pair is missing beside the horizontal pair", () => {
  const level = createLevel({
    id: "sensor-missing-vertical",
    sensorRelationTypes: ["DIRECTLY_IN_FRONT", "DIRECTLY_BEHIND"]
  });

  const diagnostics = checkSensorRelationPolicy([level]);
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].contract, "sensor-relation-policy");
});

test("sensor relation policy warns when the vertical anywhere pair is missing beside the horizontal pair", () => {
  const level = createLevel({
    id: "sensor-missing-anywhere-vertical",
    sensorRelationTypes: ["ANYWHERE_FORWARD", "ANYWHERE_BEHIND"]
  });

  const diagnostics = checkSensorRelationPolicy([level]);
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].contract, "sensor-relation-policy");
});

test("flag setup game spec compliance passes for base flags and carried flags with valid carriers", () => {
  const baseLevel = createLevel({
    id: "base-flag",
    mapKey: "simpleAisle",
    setup: {
      teams: {
        player: {
          homeSide: "left",
          baseCellType: 3,
          flagHome: { x: 0, y: 4 },
          runners: [{ slot: "human", gridX: 1, gridY: 1 }]
        },
        opponent: {
          homeSide: "right",
          baseCellType: 4,
          flagHome: { x: 11, y: 4 },
          runners: [{ slot: "npc1", gridX: 10, gridY: 2 }]
        }
      },
      flags: {
        opponent: { gridX: 11, gridY: 4 }
      }
    }
  });

  const carriedLevel = createLevel({
    id: "carried-flag",
    mapKey: "simpleAisle",
    setup: {
      teams: {
        player: {
          homeSide: "left",
          baseCellType: 3,
          flagHome: { x: 0, y: 4 },
          runners: [
            { slot: "human", gridX: 1, gridY: 1 },
            { slot: "ally", gridX: 2, gridY: 4, hasEnemyFlag: true }
          ]
        },
        opponent: {
          homeSide: "right",
          baseCellType: 4,
          flagHome: { x: 11, y: 4 },
          runners: [{ slot: "npc1", gridX: 10, gridY: 2 }]
        }
      },
      flags: {
        opponent: { carriedByRunnerId: "runner_1_AI_AllyP1", isAtBase: false }
      }
    }
  });

  assert.deepEqual(checkFlagSetupGameSpecCompliance([baseLevel]), []);
  assert.deepEqual(checkFlagSetupGameSpecCompliance([carriedLevel]), []);
});

test("flag setup game spec compliance warns for off-base, missing-carrier, mismatched-carrier, and false-at-base flags", () => {
  const offBase = createLevel({
    id: "off-base-flag",
    mapKey: "simpleAisle",
    setup: {
      teams: {
        player: {
          homeSide: "left",
          baseCellType: 3,
          flagHome: { x: 0, y: 4 },
          runners: [{ slot: "human", gridX: 1, gridY: 1 }]
        },
        opponent: {
          homeSide: "right",
          baseCellType: 4,
          flagHome: { x: 11, y: 4 },
          runners: [{ slot: "npc1", gridX: 10, gridY: 2 }]
        }
      },
      flags: {
        opponent: { gridX: 9, gridY: 4 }
      }
    }
  });

  const missingCarrier = createLevel({
    id: "missing-carrier",
    mapKey: "simpleAisle",
    setup: {
      teams: {
        player: {
          homeSide: "left",
          baseCellType: 3,
          flagHome: { x: 0, y: 4 },
          runners: [{ slot: "human", gridX: 1, gridY: 1 }]
        },
        opponent: {
          homeSide: "right",
          baseCellType: 4,
          flagHome: { x: 11, y: 4 },
          runners: [{ slot: "npc1", gridX: 10, gridY: 2 }]
        }
      },
      flags: {
        opponent: { carriedByRunnerId: "runner_1_AI_AllyP1", isAtBase: false }
      }
    }
  });

  const carrierWithoutFlag = createLevel({
    id: "carrier-without-flag",
    mapKey: "simpleAisle",
    setup: {
      teams: {
        player: {
          homeSide: "left",
          baseCellType: 3,
          flagHome: { x: 0, y: 4 },
          runners: [{ slot: "ally", gridX: 2, gridY: 4 }]
        },
        opponent: {
          homeSide: "right",
          baseCellType: 4,
          flagHome: { x: 11, y: 4 },
          runners: [{ slot: "npc1", gridX: 10, gridY: 2 }]
        }
      },
      flags: {
        opponent: { carriedByRunnerId: "runner_1_AI_AllyP1", isAtBase: false }
      }
    }
  });

  const falseAtBase = createLevel({
    id: "false-at-base",
    mapKey: "simpleAisle",
    setup: {
      teams: {
        player: {
          homeSide: "left",
          baseCellType: 3,
          flagHome: { x: 0, y: 4 },
          runners: [{ slot: "human", gridX: 1, gridY: 1 }]
        },
        opponent: {
          homeSide: "right",
          baseCellType: 4,
          flagHome: { x: 11, y: 4 },
          runners: [{ slot: "npc1", gridX: 10, gridY: 2 }]
        }
      },
      flags: {
        opponent: { gridX: 10, gridY: 4, isAtBase: false }
      }
    }
  });

  assert.equal(checkFlagSetupGameSpecCompliance([offBase])[0].contract, "flag-setup-game-spec-compliance");
  assert.equal(checkFlagSetupGameSpecCompliance([missingCarrier])[0].contract, "flag-setup-game-spec-compliance");
  assert.equal(checkFlagSetupGameSpecCompliance([carrierWithoutFlag]).some((entry) => /hasEnemyFlag/.test(entry.message)), true);
  assert.equal(checkFlagSetupGameSpecCompliance([falseAtBase])[0].contract, "flag-setup-game-spec-compliance");
});

test("lint runner returns exit code 0 for warnings only and 1 for errors", () => {
  const levels = [
    createLevel({ id: "one", title: "Level 1: One", toolboxBlockTypes: ["a"], failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 } }),
    createLevel({ id: "two", title: "Level 2: Two", levelKind: "challenge", toolboxBlockTypes: ["a", "b"], failureCondition: { type: "turn_limit_exceeded", maxTurns: 8 } })
  ];
  const conceptMatrix = [createMatrixRow("1", "One"), createMatrixRow("2", "Two")];
  const ref = new Map([
    ["one", { filePath: "/abs/one.xml", xmlText: "<xml></xml>" }],
    ["two", { filePath: "/abs/two.xml", xmlText: "<xml></xml>" }]
  ]);
  const warningsOnly = runLevelLint({ levels, conceptMatrix, referenceSolutionsByLevelId: ref });
  assert.equal(warningsOnly.every((entry) => entry.severity !== "error"), true);
  assert.equal(warningsOnly.some((entry) => entry.severity === "warning"), true);

  const errorDiagnostics = runLevelLint({
    levels: [createLevel({ id: "one", title: "Level 1: One" })],
    conceptMatrix: [createMatrixRow("1", "One")],
    referenceSolutionsByLevelId: new Map()
  });
  assert.equal(errorDiagnostics.some((entry) => entry.severity === "error"), true);
});

test("diagnostics format with relative file paths", () => {
  const formatted = formatDiagnostic({
    severity: "error",
    levelId: "level-1",
    contract: "turn-limit-floor",
    message: "turn limit too low",
    file: "/abs/path/level-1.js"
  });
  assert.match(formatted, /^error level-1 turn-limit-floor: turn limit too low/);
});
