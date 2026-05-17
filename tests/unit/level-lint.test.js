import test from "node:test";
import assert from "node:assert/strict";
import {
  checkChallengeLevelsIntroduceNoNewBlock,
  checkConceptMatrixAgreement,
  checkDemoBlocklyDoesNotSolveLevel,
  checkProjectMetadata,
  checkProjectToolboxPolicy,
  checkReferenceSolutionFixtureNameMatchesLevelId,
  checkReferenceSolutionToolboxCompatibility,
  checkSensorRelationPolicy,
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

test("challenge levels do not warn when they reuse only previously introduced blocks", () => {
  const levels = [
    createLevel({ id: "base-1", title: "Level 1: Base One", toolboxBlockTypes: ["a"] }),
    createLevel({ id: "base-2", title: "Level 2: Base Two", toolboxBlockTypes: ["a", "b"] }),
    createLevel({ id: "challenge", title: "Challenge 3: Challenge", levelKind: "challenge", toolboxBlockTypes: ["b"] })
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
