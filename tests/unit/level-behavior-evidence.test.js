import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  buildGuidedLevelBehaviorEvidenceData,
  generateGuidedLevelBehaviorEvidence,
  renderGuidedLevelBehaviorEvidenceMarkdown,
  renderGuidedLevelBehaviorSummaryIndexMarkdown,
  runBehaviorSimulation,
  getBlockCoverage
} from "../../src/dev/levelBehaviorEvidence.js";

let evidenceDataPromise = null;

async function getEvidenceData() {
  if (!evidenceDataPromise) {
    evidenceDataPromise = buildGuidedLevelBehaviorEvidenceData();
  }
  return evidenceDataPromise;
}

test("behavior evidence identifies at least one ordinary passing level", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "move-to-target");

  assert.ok(entry, "expected move-to-target behavior evidence");
  assert.equal(entry.notApplicableReason, null);
  assert.equal(entry.runs[0].status, "pass");
  assert.ok(entry.runs[0].turnsElapsed > 0);
  assert.ok(entry.runs[0].actionCount > 0);
  assert.equal(entry.runs[0].branchTraceEvidencePresent, true);
});

test("behavior evidence reports a not-run reason for a prediction level", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "prediction-25");

  assert.ok(entry, "expected prediction-25 behavior evidence");
  assert.equal(entry.notApplicableReason, "prediction checkpoint requires a prediction choice before play");
  assert.equal(entry.runs.length, 0);

  const markdown = renderGuidedLevelBehaviorEvidenceMarkdown(entry);
  assert.match(markdown, /not-applicable reason: prediction checkpoint requires a prediction choice before play/);
  assert.match(markdown, /no runtime evidence collected/);
});

test("behavior evidence reports project fixture policy status for a project level", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "index-jobs");

  assert.ok(entry, "expected index-jobs behavior evidence");
  assert.equal(entry.notApplicableReason, null);
  assert.equal(entry.runs.some((run) => run.status === "documented exception"), true);
  assert.equal(entry.runs.length >= 2, true);

  const markdown = renderGuidedLevelBehaviorEvidenceMarkdown(entry);
  assert.match(markdown, /documented exception/);
  assert.match(markdown, /project checkpoint/);
  assert.match(markdown, /project final/);
});

test("behavior evidence includes NPC behavior names and first enemy actions", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "dodge-and-deliver");

  assert.ok(entry, "expected dodge-and-deliver behavior evidence");
  assert.equal(entry.notApplicableReason, null);
  assert.ok(entry.runs[0].enemyBehaviorSummary.lines.some((line) => line.includes("behavior")));
  assert.ok(entry.runs[0].enemyActionRows.length > 0);
  assert.ok(entry.runs[0].enemyActionRows[0].actionType);

  const markdown = renderGuidedLevelBehaviorEvidenceMarkdown(entry);
  assert.match(markdown, /Enemy \/ NPC Behavior/);
  assert.match(markdown, /first enemy actions/);
});

test("behavior summary index includes links to behavior evidence files", async () => {
  const { entries } = await getEvidenceData();
  const summary = renderGuidedLevelBehaviorSummaryIndexMarkdown(entries);

  assert.match(summary, /\[behavior\]\(behavior-evidence\/01-move-to-target\.md\)/);
  assert.match(summary, /\[behavior\]\(behavior-evidence\/46-optional-double-carrier-showdown\.md\)/);
});

test("behavior evidence classifies a project level with WAIT_FOR_INPUT as not applicable", async () => {
  const { entries } = await getEvidenceData();
  const entry = entries.find((candidate) => candidate.id === "full-team-tactics");

  assert.ok(entry, "expected full-team-tactics behavior evidence");
  assert.ok(entry.notApplicableReason, "expected a not-applicable reason for full-team-tactics");
  assert.match(entry.notApplicableReason, /project capstone/);
  assert.equal(entry.runs.length, 0, "expected no runs for a WAIT_FOR_INPUT project level");

  const markdown = renderGuidedLevelBehaviorEvidenceMarkdown(entry);
  assert.match(markdown, /not-applicable reason:.*project capstone/);
  assert.match(markdown, /no runtime evidence collected/);
});

test("behavior evidence generator writes the summary index and per-level files", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "bba-behavior-evidence-"));
  const summaryIndexPath = path.join(tempDir, "behavior-summary-index.md");
  const result = await generateGuidedLevelBehaviorEvidence({ outputDir: path.join(tempDir, "behavior-evidence"), summaryIndexPath });

  assert.equal(result.entries.length > 0, true);
  assert.equal(await fs.stat(summaryIndexPath).then(() => true), true);
  assert.equal(
    await fs.stat(path.join(tempDir, "behavior-evidence", "01-move-to-target.md")).then(() => true),
    true
  );
});

test("behavior evidence includes new Plan 86 upgraded sections", async () => {
  const { entries } = await getEvidenceData();
  
  // 1. Check NPC Movement Timeline and Static Frozen NPCs on dodge-and-deliver
  const dodgeAndDeliver = entries.find((c) => c.id === "dodge-and-deliver");
  assert.ok(dodgeAndDeliver);
  const run0 = dodgeAndDeliver.runs[0];
  assert.ok(run0.npcMovementTimeline, "expected NPC movement timeline");
  assert.ok(run0.staticFrozenNpcs, "expected static frozen NPCs list");
  assert.ok(run0.interactionTimeline, "expected interaction timeline");
  
  // Verify NPC Movement Timeline structure and rendering
  const ddMarkdown = renderGuidedLevelBehaviorEvidenceMarkdown(dodgeAndDeliver);
  assert.match(ddMarkdown, /Enemy Movement Timeline/, "Markdown should contain Enemy Movement Timeline header");
  assert.match(ddMarkdown, /Interaction Timeline/, "Markdown should contain Interaction Timeline header");
  assert.match(ddMarkdown, /Blockly Reference Solution Execution Trace Coverage/, "Markdown should contain Blockly Coverage header");

  // 2. Check Naive Solution Run Proof
  const moveToTarget = entries.find((c) => c.id === "move-to-target");
  assert.ok(moveToTarget);
  assert.ok(moveToTarget.naiveRunResult, "expected naive run result for Level 1");
  assert.equal(moveToTarget.naiveRunResult.status, "fail", "Level 1 naive solution should fail");
  assert.ok(moveToTarget.naiveRunResult.turnsElapsed > 0);
  assert.ok(moveToTarget.naiveRunResult.boardSummary.includes("Score:"), "expected scoreboard in boardSummary");

  const mttMarkdown = renderGuidedLevelBehaviorEvidenceMarkdown(moveToTarget);
  assert.match(mttMarkdown, /Naive Solution Run Proof/, "Markdown should contain Naive Solution Run Proof header");
  assert.match(mttMarkdown, /status: fail/, "Markdown should report failure of naive fixture");

  // 3. Verify Blockly Execution Trace Coverage
  assert.ok(run0.blockCoverage, "expected blockCoverage data");
  assert.ok(run0.blockCoverage.total > 0, "expected total executable block count > 0");
  assert.ok(run0.blockCoverage.ratioText, "expected ratioText");
});

test("behavior evidence generator exports par-candidates.json", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "bba-behavior-evidence-par-"));
  const summaryIndexPath = path.join(tempDir, "behavior-summary-index.md");
  const outputDir = path.join(tempDir, "behavior-evidence");
  await generateGuidedLevelBehaviorEvidence({ outputDir, summaryIndexPath });

  const parCandidatesPath = path.join(outputDir, "../par-candidates.json");
  const exists = await fs.stat(parCandidatesPath).then(() => true).catch(() => false);
  assert.equal(exists, true, "par-candidates.json should be written");

  const jsonContent = JSON.parse(await fs.readFile(parCandidatesPath, "utf8"));
  assert.ok(jsonContent["move-to-target"], "par-candidates should include move-to-target");
  assert.equal(jsonContent["move-to-target"].runnable, true);
  assert.ok(jsonContent["move-to-target"].runs.length > 0);
  assert.equal(typeof jsonContent["move-to-target"].runs[0].blockCount, "number");
});

test("behavior summary index has all Plan 86 columns", async () => {
  const { entries } = await getEvidenceData();
  const summary = renderGuidedLevelBehaviorSummaryIndexMarkdown(entries);

  // Check headers
  assert.match(summary, /live enemy count/);
  assert.match(summary, /movement-timeline present/);
  assert.match(summary, /trace-observed execution ratio/);
  assert.match(summary, /naive fixture present\/result/);
});

// Plan 86 Repair Synthetic Tests

const xmlMoveForward = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
    </next>
  </block>
</xml>
`;

const xmlStayStill = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24"></block>
</xml>
`;

const makeMockLevel = (id, setupOverrides, levelOverrides = {}) => ({
  id,
  title: "Mock Level",
  description: "Mock Level Description",
  mode: "PLAYER_VS_NPC",
  mapKey: "simpleAisle",
  humanTurnBehavior: "AUTO_SKIP",
  toolboxBlockTypes: ["battlegorithms_move_forward"],
  initialBlocklyXml: xmlMoveForward,
  winCondition: {
    type: "runner_reaches_cell",
    runnerId: "runner_1_AI_AllyP1",
    targetCell: { x: 3, y: 4 }
  },
  failureCondition: {
    type: "turn_limit_exceeded",
    maxTurns: 25
  },
  ...levelOverrides,
  setupOverrides: {
    autoStayHumanRunnerIds: ["runner_1_HumanP1"],
    pointsToWin: 1,
    ...setupOverrides
  }
});

test("synthetic: only frozen NPCs results in live enemy count 0 and no timeline rows", async () => {
  const level = makeMockLevel("mock-frozen-only", {
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: true, frozenTurnsRemaining: 999 }
    }
  });

  const result = runBehaviorSimulation(level, xmlMoveForward, { randomSeedText: "test-frozen" });
  assert.equal(result.npcMovementTimeline.length, 0, "Frozen NPC should not be in the movement timeline");
  assert.equal(result.staticFrozenNpcs.length, 1, "Frozen NPC should be listed as static frozen");
  assert.equal(result.staticFrozenNpcs[0].id, "runner_2_Npc1");
});

test("synthetic: unfrozen stationary NPC is not misclassified as frozen", async () => {
  const level = makeMockLevel("mock-unfrozen-stationary", {
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 10, gridY: 2, isFrozen: false, cpuBehavior: "GUIDED_STAY_STILL" }
    }
  });

  const result = runBehaviorSimulation(level, xmlMoveForward, { randomSeedText: "test-unfrozen" });
  assert.ok(result.npcMovementTimeline.length > 0, "Unfrozen NPC should have timeline rows");
  assert.equal(result.staticFrozenNpcs.length, 0, "Unfrozen NPC should not be static frozen");
  assert.match(result.npcMovementTimeline[0].action, /STAY_STILL/, "Action outcome should be stayed/still");
});

test("synthetic: near-miss distance-1 is logged and distance-2 is not", async () => {
  // Distance 1: player at (1,4), enemy at (2,4)
  const levelDist1 = makeMockLevel("mock-dist-1", {
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 2, gridY: 4, isFrozen: false, cpuBehavior: "GUIDED_STAY_STILL" }
    }
  });
  const result1 = runBehaviorSimulation(levelDist1, xmlStayStill, { randomSeedText: "test-dist-1" });
  const hasNearMiss1 = result1.interactionTimeline.some(e => e.event === "near-miss");
  assert.equal(hasNearMiss1, true, "Distance-1 near-miss should be logged");

  // Distance 2: player at (1,4), enemy at (3,4)
  const levelDist2 = makeMockLevel("mock-dist-2", {
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 3, gridY: 4, isFrozen: false, cpuBehavior: "GUIDED_STAY_STILL" }
    }
  });
  const result2 = runBehaviorSimulation(levelDist2, xmlStayStill, { randomSeedText: "test-dist-2" });
  const hasNearMiss2 = result2.interactionTimeline.some(e => e.event === "near-miss");
  assert.equal(hasNearMiss2, false, "Distance-2 near-miss should not be logged");
});
test("synthetic: interactions after evidence window are omitted with tail info note", async () => {
  // Construct a level that takes >15 turns to complete
  const levelLong = makeMockLevel("mock-long", {
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 },
      runner_2_Npc1: { gridX: 11, gridY: 4, isFrozen: false, cpuBehavior: "GUIDED_STAY_STILL" }
    }
  }, {
    winCondition: {
      type: "runner_reaches_cell",
      runnerId: "runner_1_AI_AllyP1",
      targetCell: { x: 11, y: 0 } // far away
    },
    failureCondition: {
      type: "turn_limit_exceeded",
      maxTurns: 30
    }
  });

  const result = runBehaviorSimulation(levelLong, xmlMoveForward, { randomSeedText: "test-long" });
  
  // The near-miss at turn 18 (after player's 15 own-turns) should be omitted
  const lateNearMiss = result.interactionTimeline.some(e => e.event === "near-miss" && e.turn > 15);
  assert.equal(lateNearMiss, false, "Late near-miss after turn 15 should be omitted");

  // Info note about omitted events should be present
  const hasInfoNote = result.interactionTimeline.some(e => e.event === "info" && e.details.includes("omitted"));
  assert.equal(hasInfoNote, true, "Info note about omitted events should be present");
});
test("synthetic: passing movement fixture shows outcome moved and genuinely illegal shows bounced", async () => {
  // Normal pass movement
  const level = makeMockLevel("mock-pass-outcome", {
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 }
    }
  });

  const result = runBehaviorSimulation(level, xmlMoveForward, { randomSeedText: "test-outcome" });
  
  const moveEvent = result.actionEvents.find(e => e.payload.actionType === "MOVE_FORWARD");
  assert.ok(moveEvent);
  assert.equal(moveEvent.resolvedOutcome, "moved", "Successful move should resolve to moved");

  // Genuinely blocked/bounced movement (blocked by edge)
  // Let's place a blocked runner facing the right edge
  const levelBlocked = makeMockLevel("mock-blocked", {
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 11, gridY: 4 } // at the right boundary
    }
  });

  const resultBlocked = runBehaviorSimulation(levelBlocked, xmlMoveForward, { randomSeedText: "test-blocked" });
  const blockedEvent = resultBlocked.actionEvents.find(e => e.payload.actionType === "MOVE_FORWARD");
  assert.ok(blockedEvent);
  assert.equal(blockedEvent.resolvedOutcome, "bounced", "Blocked move should resolve to bounced");
});

test("synthetic: repeated simulation runs produce stable/identical block coverage IDs", async () => {
  const level = makeMockLevel("mock-stability", {
    runnerOverrides: {
      runner_1_HumanP1: { gridX: 1, gridY: 1 },
      runner_1_AI_AllyP1: { gridX: 1, gridY: 4 }
    }
  });

  const result1 = runBehaviorSimulation(level, xmlMoveForward, { randomSeedText: "test-stability-1" });
  const result2 = runBehaviorSimulation(level, xmlMoveForward, { randomSeedText: "test-stability-2" });

  const cov1 = getBlockCoverage(result1.app, result1.traceSnapshots);
  const cov2 = getBlockCoverage(result2.app, result2.traceSnapshots);

  assert.ok(cov1.blocks.length > 0, "Should have block coverage blocks");
  assert.equal(cov1.blocks.length, cov2.blocks.length, "Both runs should have same block count");

  for (let i = 0; i < cov1.blocks.length; i++) {
    const block1 = cov1.blocks[i];
    const block2 = cov2.blocks[i];
    assert.equal(block1.id, block2.id, `Block at index ${i} should have stable ID across runs`);
    assert.equal(block1.type, block2.type, `Block at index ${i} should have same type`);
    assert.match(block1.id, /^[a-zA-Z_]+_[0-9]+$/, "Stable ID should match traversal-based format (e.g. move_forward_1)");
  }
});
