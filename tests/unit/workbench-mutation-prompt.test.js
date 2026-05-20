import test from "node:test";
import assert from "node:assert/strict";
import { formatWorkbenchMutationPrompt } from "../../src/workbench/workbenchMutationPrompt.js";

test("mutation prompt names the selected fixture and carries the scratch XML payload", () => {
  const prompt = formatWorkbenchMutationPrompt({
    levelId: "dodge-and-deliver",
    title: "Challenge 15: Dodge and Deliver",
    sourcePath: "C:/AI/BrowserBattlegorithms/src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js",
    fixtureTarget: {
      kind: "reference",
      label: "Reference fixture",
      path: "C:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml",
      exists: true
    },
    scratchXmlText: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn"></block></xml>',
    scratchRun: {
      status: "pass",
      turnCount: 12,
      finalTurnState: "GAME_OVER",
      mainGameState: "LEVEL_RESULT",
      lastLevelResultReason: "level_win"
    },
    canonicalRun: {
      status: "pass",
      turnCount: 12,
      finalTurnState: "GAME_OVER",
      mainGameState: "LEVEL_RESULT",
      lastLevelResultReason: "level_win"
    },
    validationCommands: [
      { command: "npm test" },
      { command: "npm run build" }
    ],
    extraDoNotTouchFiles: [
      "C:/AI/BrowserBattlegorithms/docs/GUIDED_LEVEL_CONCEPT_MATRIX.md"
    ]
  });

  assert.match(prompt, /# Scratch Blockly Mutation Prompt/);
  assert.match(prompt, /fixture target: Reference fixture \(reference\)/);
  assert.match(prompt, /tests\/unit\/fixtures\/guided-reference-solutions\/dodge-and-deliver\.xml/);
  assert.match(prompt, /The workbench did not write files\./);
  assert.match(prompt, /This scratch candidate passed, so it is a ready repair candidate\./);
  assert.match(prompt, /```xml/);
  assert.match(prompt, /battlegorithms_on_each_turn/);
  assert.match(prompt, /## Do Not Touch/);
  assert.match(prompt, /docs\/GUIDED_LEVEL_CONCEPT_MATRIX\.md/);
  assert.match(prompt, /npm test/);
  assert.match(prompt, /npm run build/);
});

test("mutation prompt marks failing scratch runs as experiments instead of ready repairs", () => {
  const prompt = formatWorkbenchMutationPrompt({
    levelId: "advanced-scrimmage",
    title: "Challenge 28: Full Team Tactics",
    sourcePath: "C:/AI/BrowserBattlegorithms/src/config/levels/phases/advanced-teamplay/level-37-advanced-scrimmage.js",
    fixtureTarget: {
      kind: "final",
      label: "Project final fixture",
      path: "C:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-project-solutions/team-strategy-script/final.xml",
      exists: true
    },
    scratchXmlText: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn"></block></xml>',
    scratchRun: {
      status: "fail",
      turnCount: 8,
      finalTurnState: "GAME_OVER",
      mainGameState: "GAME_OVER",
      lastLevelResultReason: "turn_limit_exceeded"
    },
    canonicalRun: {
      status: "pass",
      turnCount: 9,
      finalTurnState: "GAME_OVER",
      mainGameState: "LEVEL_RESULT",
      lastLevelResultReason: "level_win"
    },
    validationCommands: [{ command: "npm test" }],
    extraDoNotTouchFiles: [
      "C:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-project-solutions/strategy-brain/final.xml"
    ]
  });

  assert.match(prompt, /fixture target: Project final fixture \(final\)/);
  assert.match(prompt, /team-strategy-script\/final\.xml/);
  assert.match(prompt, /This is an experiment, not a ready repair\./);
  assert.match(prompt, /turn_limit_exceeded/);
});
