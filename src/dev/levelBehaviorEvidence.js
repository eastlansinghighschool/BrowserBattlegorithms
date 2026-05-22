import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as Blockly from "blockly";
import {
  ACTIVE_TEAM2_NPC_BEHAVIOR,
  AI_ACTION_TYPES,
  BLOCKLY_TRACE_SPEED_THRESHOLD,
  HUMAN_TURN_BEHAVIORS,
  LEVEL_RESULT,
  NPC_BEHAVIORS
} from "../config/constants.js";
import { GUIDED_LEVEL_MANIFEST } from "../config/levels/manifest.js";
import { registerBattleBlocklyBlocks } from "../ai/blockly/blocks.js";
import { getFirstRunnableAction, loadWorkspaceXml } from "../ai/blockly/workspace.js";
import { createApp } from "../core/state.js";
import { initializeLevelState, startLevel } from "../core/levels.js";
import { processTurnActions } from "../core/turnEngine.js";
import { createSeededRandom, loadLevelReadinessContext } from "./levelReadiness.js";
import { PROJECT_READINESS_POLICY } from "./levelReadinessProjectPolicy.js";
import { GUIDED_LEVEL_DOSSIER_OUTPUT_DIR } from "./levelDossiers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
export const GUIDED_LEVEL_BEHAVIOR_OUTPUT_DIR = path.join(GUIDED_LEVEL_DOSSIER_OUTPUT_DIR, "behavior-evidence");
export const GUIDED_LEVEL_BEHAVIOR_SUMMARY_INDEX_PATH = path.join(REPO_ROOT, "reports/development/guided-level-complexity-audit/behavior-summary-index.md");
const BEHAVIOR_EVIDENCE_RELATIVE_DIR = "behavior-evidence";
const DOSSIER_RELATIVE_DIR = "level-dossiers";
const TRACE_TAIL_LENGTH = 6;
const EVENT_TAIL_LENGTH = 8;
const MAX_SIMULATION_TICKS = 12000;

const TEST_P5 = {
  lerp(start, end, amount) {
    return start + (end - start) * amount;
  }
};

function toRepoRelative(filePath) {
  if (!filePath) {
    return null;
  }
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function padOrder(order) {
  return String(order).padStart(2, "0");
}

function escapeMarkdown(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
}

function inlineCode(value) {
  return `\`${String(value ?? "")}\``;
}

function cloneEventPayload(payload) {
  return payload && typeof payload === "object" ? { ...payload } : {};
}

function cloneTurnEventLog(eventLog) {
  return eventLog.map((event) => ({
    kind: event.kind,
    turn: event.turn,
    payload: cloneEventPayload(event.payload)
  }));
}

function cloneTraceSnapshot(trace) {
  return {
    runnerId: trace.runnerId ?? null,
    runnerTeam: trace.runnerTeam ?? null,
    turnNumber: trace.turnNumber ?? null,
    levelId: trace.levelId ?? null,
    steps: Array.isArray(trace.steps)
      ? trace.steps.map((step) => ({ ...step }))
      : [],
    ignoredActionBlockIds: Array.isArray(trace.ignoredActionBlockIds) ? [...trace.ignoredActionBlockIds] : [],
    comparisonInputBlockTypes: trace.comparisonInputBlockTypes && typeof trace.comparisonInputBlockTypes === "object"
      ? structuredClone(trace.comparisonInputBlockTypes)
      : {},
    teamAllyCount: trace.teamAllyCount ?? null,
    runnerAllyIndex: trace.runnerAllyIndex ?? null
  };
}

function getLevelManifestEntry(levelId) {
  return GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === levelId) || null;
}

function getLevelCategory(level) {
  if (level.project?.id) {
    return "project";
  }
  if (level.levelKind === "prediction") {
    return "prediction";
  }
  if (level.levelKind === "bug_hunt") {
    return "bug hunt";
  }
  if (level.levelKind === "challenge") {
    return "challenge/synthesis";
  }
  if (String(level.id || "").startsWith("optional-")) {
    return "optional lab";
  }
  return "ordinary";
}

function getDossierRelativePath(order, levelId) {
  return `${DOSSIER_RELATIVE_DIR}/${padOrder(order)}-${slugify(levelId)}.md`;
}

function getBehaviorRelativePath(order, levelId) {
  return `${BEHAVIOR_EVIDENCE_RELATIVE_DIR}/${padOrder(order)}-${slugify(levelId)}.md`;
}

function getNpcBehaviorLabel(runner) {
  if (!runner?.isNPC) {
    return null;
  }
  return runner.cpuBehavior || ACTIVE_TEAM2_NPC_BEHAVIOR || NPC_BEHAVIORS.PATROL_INTERCEPT;
}

function formatScoreboard(teamScores = {}) {
  return `Team 1: ${teamScores[1] ?? 0}, Team 2: ${teamScores[2] ?? 0}`;
}

function buildControlledActionSummary(actionEvents, traceSnapshots, maxRows = 6) {
  const rows = [];
  const traceByTurnAndRunner = new Map();

  for (const trace of traceSnapshots) {
    traceByTurnAndRunner.set(`${trace.turnNumber}:${trace.runnerId}`, trace);
  }

  for (const event of actionEvents) {
    if (event.payload.runnerTeam !== 1 || event.payload.source === "npc") {
      continue;
    }
    const trace = traceByTurnAndRunner.get(`${event.turn}:${event.payload.runnerId}`) || null;
    rows.push({
      turn: event.turn,
      runnerId: event.payload.runnerId,
      source: event.payload.source || "blockly",
      actionType: event.payload.actionType || "not found",
      outcome: event.resolvedOutcome || "not found",
      traceSummary: trace ? summarizeTraceSnapshot(trace) : "trace data not available"
    });
    if (rows.length >= maxRows) {
      break;
    }
  }

  return rows;
}

function buildEnemyActionSummary(actionEvents, traceSnapshots, maxRows = 4) {
  const rows = [];
  const traceByTurnAndRunner = new Map();
  for (const trace of traceSnapshots) {
    traceByTurnAndRunner.set(`${trace.turnNumber}:${trace.runnerId}`, trace);
  }

  for (const event of actionEvents) {
    if (event.payload.runnerTeam === 1) {
      continue;
    }
    if (event.payload.source !== "cpu" && event.payload.source !== "npc") {
      continue;
    }
    const trace = traceByTurnAndRunner.get(`${event.turn}:${event.payload.runnerId}`) || null;
    rows.push({
      turn: event.turn,
      runnerId: event.payload.runnerId,
      source: event.payload.source,
      actionType: event.payload.actionType || "not found",
      outcome: event.resolvedOutcome || "not found",
      traceSummary: trace ? summarizeTraceSnapshot(trace) : "trace data not available"
    });
    if (rows.length >= maxRows) {
      break;
    }
  }

  return rows;
}

function summarizeTraceStep(step) {
  const parts = [`${step.kind}`, inlineCode(step.blockType)];
  if (step.result !== undefined) {
    parts.push(`result=${step.result}`);
  }
  if (step.numericLeft !== undefined || step.numericRight !== undefined) {
    parts.push(`compare=${step.numericLeft} vs ${step.numericRight}`);
  }
  return parts.join(" ");
}

function summarizeTraceSnapshot(trace) {
  if (!trace?.steps?.length) {
    return "no trace data";
  }
  const stepSummary = trace.steps.slice(0, 5).map((step) => summarizeTraceStep(step)).join(" -> ");
  const suffix = trace.steps.length > 5 ? ` -> … (+${trace.steps.length - 5} more)` : "";
  const ignored = trace.ignoredActionBlockIds?.length
    ? `; ignored extra-action blocks=${trace.ignoredActionBlockIds.length}`
    : "";
  return `turn ${trace.turnNumber} runner ${trace.runnerId}: ${stepSummary}${suffix}${ignored}`;
}

function formatEventPayload(payload) {
  const parts = [];
  if (payload.runnerId) parts.push(`runner=${payload.runnerId}`);
  if (payload.runnerTeam !== undefined) parts.push(`team=${payload.runnerTeam}`);
  if (payload.actionType) parts.push(`action=${payload.actionType}`);
  if (payload.outcome) parts.push(`outcome=${payload.outcome}`);
  if (payload.source) parts.push(`source=${payload.source}`);
  if (payload.reason) parts.push(`reason=${payload.reason}`);
  if (payload.blockedTeam !== undefined) parts.push(`blockedTeam=${payload.blockedTeam}`);
  if (payload.carrierRunnerId) parts.push(`carrier=${payload.carrierRunnerId}`);
  if (payload.flagTeam !== undefined) parts.push(`flagTeam=${payload.flagTeam}`);
  if (payload.teamId !== undefined) parts.push(`teamId=${payload.teamId}`);
  if (payload.result) parts.push(`result=${payload.result}`);
  return parts.length > 0 ? ` (${parts.join(", ")})` : "";
}

function summarizeTurnEventLog(turnEventLog) {
  return turnEventLog.map((event) => `${event.kind}${formatEventPayload(event.payload)}`).join(" | ");
}

function collectEventLogs(eventsByTurn) {
  const actionEvents = [];
  const scoreEvents = [];
  const interactionEvents = [];
  let lastActionOutcomeByRunner = new Map();

  for (const turnLog of eventsByTurn) {
    for (const event of turnLog.events) {
      if (event.kind === "runner.actionChosen") {
        actionEvents.push({
          turn: turnLog.turn,
          payload: cloneEventPayload(event.payload),
          resolvedOutcome: null
        });
      } else if (event.kind === "runner.actionResolved") {
        lastActionOutcomeByRunner.set(`${turnLog.turn}:${event.payload.runnerId}`, event.payload.outcome || null);
      } else if (
        event.kind === "flag.pickedUp" ||
        event.kind === "flag.dropped" ||
        event.kind === "score.blocked" ||
        event.kind === "resource.unavailable" ||
        event.kind === "runner.blockedOrBounced" ||
        event.kind === "team.scored" ||
        event.kind === "level.forcedFailedAtGameOver"
      ) {
        interactionEvents.push({
          turn: turnLog.turn,
          kind: event.kind,
          payload: cloneEventPayload(event.payload)
        });
      }
      if (event.kind === "team.scored" || event.kind === "score.blocked") {
        scoreEvents.push({
          turn: turnLog.turn,
          kind: event.kind,
          payload: cloneEventPayload(event.payload)
        });
      }
    }
  }

  for (const entry of actionEvents) {
    entry.resolvedOutcome = lastActionOutcomeByRunner.get(`${entry.turn}:${entry.payload.runnerId}`) || null;
  }

  return {
    actionEvents,
    scoreEvents,
    interactionEvents
  };
}

function buildEventKindCounts(interactionEvents) {
  const counts = new Map();
  for (const event of interactionEvents) {
    counts.set(event.kind, (counts.get(event.kind) || 0) + 1);
  }
  return [...counts.entries()].sort(([left], [right]) => left.localeCompare(right));
}

function formatEventKindCounts(interactionEvents) {
  const entries = buildEventKindCounts(interactionEvents);
  if (entries.length === 0) {
    return "none observed";
  }
  return entries.map(([kind, count]) => `${kind} x${count}`).join("; ");
}

function getEnemyBehaviorSummary(runners, enemyActionEvents) {
  const enemies = runners.filter((runner) => runner.team !== 1 && (runner.isNPC || runner.cpuBehavior));
  if (enemies.length === 0) {
    return {
      title: "Enemy / NPC behavior",
      lines: ["- status: no live or unfrozen enemy runners found"]
    };
  }

  const lines = [];
  lines.push("## Enemy / NPC Behavior");
  for (const runner of enemies) {
    const behavior = getNpcBehaviorLabel(runner);
    const frozenState = runner.isFrozen ? `yes (${runner.frozenTurnsRemaining ?? "unknown"} turns remaining)` : "no";
    lines.push(
      `- ${runner.id}: behavior ${behavior || "not found"}; start (${runner.initialGridX}, ${runner.initialGridY}); frozen ${frozenState}`
    );
  }

  const enemyRows = buildEnemyActionSummary(enemyActionEvents, [], 4);
  if (enemyRows.length > 0) {
    lines.push("- first enemy actions:");
    for (const row of enemyRows) {
      lines.push(
        `  - turn ${row.turn}: ${row.runnerId} chose ${row.actionType} via ${row.source}; outcome ${row.outcome}`
      );
    }
  } else {
    lines.push("- first enemy actions: none observed");
  }

  return {
    title: "Enemy / NPC behavior",
    lines
  };
}

function makeSimulationApp(randomSeedText) {
  registerBattleBlocklyBlocks();
  const app = createApp();
  app.blocklyWorkspace = new Blockly.Workspace();
  app.state.suppressProgressPersistence = true;
  app.state.randomFn = createSeededRandom(randomSeedText);
  app.state.animationSpeedFactor = BLOCKLY_TRACE_SPEED_THRESHOLD;
  app.hooks.getAIAllyAction = (runnerOverride = null) => {
    const runner =
      runnerOverride ||
      app.state.allRunners.find((candidate) => candidate.team === 1 && !candidate.isHumanControlled && !candidate.isNPC);
    return getFirstRunnableAction(app, runner) || { type: AI_ACTION_TYPES.STAY_STILL };
  };
  initializeLevelState(app);
  return app;
}

function runBehaviorSimulation(level, xmlText, { randomSeedText }) {
  const app = makeSimulationApp(randomSeedText);
  startLevel(app, level.id);
  loadWorkspaceXml(app, xmlText);

  const turnEventLogs = [];
  const traceSnapshots = [];
  let previousEventSignature = null;
  let previousTraceSignature = null;

  for (let tick = 0; tick < MAX_SIMULATION_TICKS; tick += 1) {
    if (app.state.activeLevelResult === LEVEL_RESULT.PASSED || app.state.activeLevelResult === LEVEL_RESULT.FAILED) {
      break;
    }

    processTurnActions(app, TEST_P5);

    const lastTurnEventLog = Array.isArray(app.state.lastTurnEventLog) ? app.state.lastTurnEventLog : [];
    if (lastTurnEventLog.length > 0) {
      const eventCopy = cloneTurnEventLog(lastTurnEventLog);
      const eventSignature = JSON.stringify(eventCopy);
      if (eventSignature !== previousEventSignature) {
        previousEventSignature = eventSignature;
        turnEventLogs.push({
          turn: eventCopy[0]?.turn ?? app.state.currentTurnNumber,
          events: eventCopy
        });
      }
    }

    if (app.state.lastBlocklyTrace) {
      const traceCopy = cloneTraceSnapshot(app.state.lastBlocklyTrace);
      const traceSignature = JSON.stringify(traceCopy);
      if (traceSignature !== previousTraceSignature) {
        previousTraceSignature = traceSignature;
        traceSnapshots.push(traceCopy);
      }
    }
  }

  const { actionEvents, scoreEvents, interactionEvents } = collectEventLogs(turnEventLogs);
  const referenceActionEvents = actionEvents.filter((event) => event.payload.runnerTeam === 1 && event.payload.source !== "npc");
  const distinctReferenceActionTypes = [...new Set(referenceActionEvents.map((event) => event.payload.actionType).filter(Boolean))].sort();
  const enemyActionEvents = actionEvents.filter(
    (event) => event.payload.runnerTeam !== 1 && (event.payload.source === "npc" || event.payload.source === "cpu")
  );
  const branchTraceEvidencePresent = traceSnapshots.some((trace) => Array.isArray(trace.steps) && trace.steps.length > 0);
  const enemyInteractionEvents = interactionEvents.filter(
    (event) =>
      event.kind === "flag.pickedUp" ||
      event.kind === "flag.dropped" ||
      event.kind === "score.blocked" ||
      event.kind === "resource.unavailable" ||
      event.kind === "runner.blockedOrBounced" ||
      event.kind === "team.scored"
  );

  return {
    app,
    turnEventLogs,
    traceSnapshots,
    actionEvents,
    referenceActionEvents,
    enemyActionEvents,
    interactionEvents,
    scoreEvents,
    branchTraceEvidencePresent,
    distinctReferenceActionTypes,
    enemyInteractionEvents
  };
}

function summarizeInteractionEvents(interactionEvents, limit = 4) {
  if (interactionEvents.length === 0) {
    return "none observed";
  }
  return interactionEvents.slice(0, limit).map((event) => {
    const payload = event.payload;
    const details = [];
    if (payload.runnerId) details.push(`runner=${payload.runnerId}`);
    if (payload.runnerTeam !== undefined) details.push(`team=${payload.runnerTeam}`);
    if (payload.blockedTeam !== undefined) details.push(`blockedTeam=${payload.blockedTeam}`);
    if (payload.reason) details.push(`reason=${payload.reason}`);
    if (payload.actionType) details.push(`action=${payload.actionType}`);
    if (payload.outcome) details.push(`outcome=${payload.outcome}`);
    if (payload.carrierRunnerId) details.push(`carrier=${payload.carrierRunnerId}`);
    return `${event.kind}${details.length ? ` (${details.join(", ")})` : ""}`;
  }).join("; ");
}

function summarizeEventsByKind(interactionEvents, kinds, limit = 4) {
  const selected = interactionEvents.filter((event) => kinds.includes(event.kind));
  if (selected.length === 0) {
    return "none observed";
  }
  return selected.slice(0, limit).map((event) => {
    const payload = event.payload;
    const details = [];
    if (payload.runnerId) details.push(`runner=${payload.runnerId}`);
    if (payload.runnerTeam !== undefined) details.push(`team=${payload.runnerTeam}`);
    if (payload.blockedTeam !== undefined) details.push(`blockedTeam=${payload.blockedTeam}`);
    if (payload.reason) details.push(`reason=${payload.reason}`);
    if (payload.actionType) details.push(`action=${payload.actionType}`);
    if (payload.outcome) details.push(`outcome=${payload.outcome}`);
    if (payload.carrierRunnerId) details.push(`carrier=${payload.carrierRunnerId}`);
    if (payload.flagTeam !== undefined) details.push(`flagTeam=${payload.flagTeam}`);
    return `${event.kind}${details.length ? ` (${details.join(", ")})` : ""}`;
  }).join("; ");
}

function getProjectRunDescriptors(level, context) {
  const projectId = level.project?.id || null;
  const projectFixtures = projectId ? context.projectFixturesById.get(projectId) || null : null;
  const policy = projectId ? PROJECT_READINESS_POLICY[projectId] || null : null;
  const stepFixture = projectFixtures?.stepFixtures?.get(level.project?.step) || null;
  const finalFixture = projectFixtures?.finalFixture || null;
  return [
    {
      key: "project checkpoint",
      fixtureKind: "project checkpoint",
      fixturePath: stepFixture?.filePath || null,
      xmlText: stepFixture?.xmlText || null,
      documentedException: policy?.stepExceptions?.[level.id] || null
    },
    {
      key: "project final",
      fixtureKind: "project final",
      fixturePath: finalFixture?.filePath || null,
      xmlText: finalFixture?.xmlText || null,
      documentedException: policy?.cumulativeExceptions?.[level.id] || null
    }
  ];
}

function getRunnableDescriptors(level, context) {
  // Guard for non-runnable levels before any fixture lookup.
  // WAIT_FOR_INPUT is checked first so project levels that require live human
  // input (e.g. full-team-tactics) are classified as not-applicable rather
  // than being sent to the project fixture simulator which cannot advance them.
  if (level.levelKind === "prediction" || level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT) {
    return [];
  }
  if (level.project?.id) {
    return getProjectRunDescriptors(level, context);
  }
  const ref = context.referenceSolutionsByLevelId.get(level.id) || null;
  return [
    {
      key: "one-off reference",
      fixtureKind: "one-off reference",
      fixturePath: ref?.filePath || null,
      xmlText: ref?.xmlText || null,
      documentedException: null
    }
  ];
}

function formatRunStatus(run) {
  if (run.notApplicableReason) {
    return "not run";
  }
  if (run.documentedException) {
    return "documented exception";
  }
  return run.runtimeResult === LEVEL_RESULT.PASSED ? "pass" : "fail";
}

function buildRunEvidence(level, descriptor, { randomSeedText }) {
  if (!descriptor.xmlText) {
    return {
      fixtureKind: descriptor.fixtureKind,
      fixturePath: descriptor.fixturePath,
      notApplicableReason: "missing fixture",
      status: "not run"
    };
  }

  const simulation = runBehaviorSimulation(level, descriptor.xmlText, { randomSeedText });
  const status = descriptor.documentedException ? "documented exception" : simulation.app.state.activeLevelResult === LEVEL_RESULT.PASSED ? "pass" : "fail";
  const enemyBehaviorSummary = getEnemyBehaviorSummary(simulation.app.state.allRunners, simulation.enemyActionEvents);
  const controlledActionRows = buildControlledActionSummary(simulation.referenceActionEvents, simulation.traceSnapshots);
  const enemyActionRows = buildEnemyActionSummary(simulation.enemyActionEvents, simulation.traceSnapshots);

  return {
    fixtureKind: descriptor.fixtureKind,
    fixturePath: descriptor.fixturePath,
    documentedException: descriptor.documentedException,
    runtimeResult: simulation.app.state.activeLevelResult,
    status,
    turnsElapsed: simulation.app.state.currentTurnNumber,
    lastLevelResultReason: simulation.app.state.lastLevelResultReason || null,
    teamScores: structuredClone(simulation.app.state.teamScores),
    controlledActionRows,
    enemyActionRows,
    branchTraceEvidencePresent: simulation.branchTraceEvidencePresent,
    distinctReferenceActionTypes: simulation.distinctReferenceActionTypes,
    actionCount: simulation.referenceActionEvents.length,
    liveEnemyActed: simulation.enemyActionEvents.length > 0,
    enemyInteractionEvents: simulation.enemyInteractionEvents,
    interactionEvents: simulation.interactionEvents,
    turnEventLogs: simulation.turnEventLogs,
    traceSnapshots: simulation.traceSnapshots,
    enemyBehaviorSummary,
    appState: {
      activeLevelResult: simulation.app.state.activeLevelResult,
      lastLevelResultReason: simulation.app.state.lastLevelResultReason || null,
      teamScores: structuredClone(simulation.app.state.teamScores)
    }
  };
}

function buildNotApplicableRun(level, reason) {
  return {
    fixtureKind: "not applicable",
    fixturePath: null,
    notApplicableReason: reason,
    status: "not run",
    turnsElapsed: null,
    runtimeResult: LEVEL_RESULT.NONE,
    lastLevelResultReason: reason,
    teamScores: { 1: 0, 2: 0 },
    controlledActionRows: [],
    enemyActionRows: [],
    branchTraceEvidencePresent: false,
    distinctReferenceActionTypes: [],
    actionCount: 0,
    liveEnemyActed: false,
    enemyInteractionEvents: [],
    interactionEvents: [],
    turnEventLogs: [],
    traceSnapshots: [],
    enemyBehaviorSummary: {
      title: "Enemy / NPC behavior",
      lines: ["- status: not run"]
    },
    appState: {
      activeLevelResult: LEVEL_RESULT.NONE,
      lastLevelResultReason: reason,
      teamScores: { 1: 0, 2: 0 }
    }
  };
}

function getNotApplicableReason(level) {
  if (level.levelKind === "prediction") {
    return "prediction checkpoint requires a prediction choice before play";
  }
  if (level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT) {
    if (level.project?.id) {
      return "project capstone with live human input — project fixtures exist but runtime behavior evidence requires student-driven play";
    }
    return "human-input level requires live player input";
  }
  return "reference-run evidence is not applicable";
}

function renderActionTable(rows, heading) {
  const lines = [];
  lines.push(`### ${heading}`);
  if (rows.length === 0) {
    lines.push("- none observed");
    return lines;
  }
  lines.push("| turn | runner | action | outcome | trace summary |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const row of rows) {
    lines.push(
      `| ${row.turn} | ${inlineCode(row.runnerId)} | ${escapeMarkdown(row.actionType)} | ${escapeMarkdown(row.outcome)} | ${escapeMarkdown(row.traceSummary)} |`
    );
  }
  return lines;
}

function renderEventTail(turnEventLogs) {
  const lines = [];
  lines.push("### Event Tail");
  if (turnEventLogs.length === 0) {
    lines.push("- none observed");
    return lines;
  }
  for (const log of turnEventLogs.slice(-EVENT_TAIL_LENGTH)) {
    lines.push(`- ${summarizeTurnEventLog(log.events)}`);
  }
  return lines;
}

function renderTraceTail(traceSnapshots) {
  const lines = [];
  lines.push("### Trace Tail");
  if (traceSnapshots.length === 0) {
    lines.push("- no trace data");
    return lines;
  }
  for (const trace of traceSnapshots.slice(-TRACE_TAIL_LENGTH)) {
    lines.push(`- ${summarizeTraceSnapshot(trace)}`);
  }
  return lines;
}

function renderRunSection(run) {
  const lines = [];
  lines.push(`### ${run.fixtureKind}`);
  lines.push(`- fixture path: ${run.fixturePath ? inlineCode(run.fixturePath) : "not applicable"}`);
  lines.push(`- run status: ${run.status}`);
  lines.push(`- result: ${run.runtimeResult || LEVEL_RESULT.NONE}`);
  lines.push(`- turns elapsed: ${run.turnsElapsed ?? "n/a"}`);
  lines.push(`- activeLevelResult: ${run.appState.activeLevelResult}`);
  lines.push(`- lastLevelResultReason: ${run.lastLevelResultReason || "none"}`);
  lines.push(`- team scores: ${formatScoreboard(run.teamScores)}`);
  if (run.documentedException) {
    lines.push(`- documented exception: ${run.documentedException}`);
  }
  lines.push(`- score / blocked-scoring events: ${summarizeEventsByKind(run.interactionEvents, ["score.blocked", "team.scored"])}`);
  lines.push(`- flag pickup / drop events: ${summarizeEventsByKind(run.interactionEvents, ["flag.pickedUp", "flag.dropped"])}`);
  lines.push(`- resource unavailable events: ${summarizeEventsByKind(run.interactionEvents, ["resource.unavailable"])}`);
  lines.push(`- branch/trace evidence present: ${run.branchTraceEvidencePresent ? "yes" : "no"}`);
  lines.push(`- reference action count: ${run.actionCount}`);
  lines.push(`- distinct action types observed: ${run.distinctReferenceActionTypes.length > 0 ? run.distinctReferenceActionTypes.map((actionType) => inlineCode(actionType)).join(", ") : "none"}`);
  lines.push(`- live enemy acted: ${run.liveEnemyActed ? "yes" : "no"}`);
  lines.push(`- enemy interaction events: ${summarizeInteractionEvents(run.enemyInteractionEvents)}`);
  lines.push(`- ignored/extra-action evidence: ${run.traceSnapshots.some((trace) => trace.ignoredActionBlockIds?.length) ? run.traceSnapshots.filter((trace) => trace.ignoredActionBlockIds?.length).map((trace) => `${trace.runnerId}: ${trace.ignoredActionBlockIds.length} ignored block id(s)`).join("; ") : "none observed"}`);
  lines.push(...renderActionTable(run.controlledActionRows, "Reference action summary"));
  lines.push(...renderActionTable(run.enemyActionRows, "Enemy action summary"));
  lines.push(...renderEventTail(run.turnEventLogs));
  lines.push(...renderTraceTail(run.traceSnapshots));
  lines.push("");
  lines.push("#### NPC / Enemy Snapshot");
  for (const entry of run.enemyBehaviorSummary.lines) {
    lines.push(entry);
  }
  return lines;
}

function renderBehaviorEvidenceMarkdown(entry) {
  const lines = [];
  lines.push(`# Guided Reference Behavior Evidence: ${entry.title}`);
  lines.push("");
  lines.push("## Level Identity");
  lines.push(`- order: ${entry.order ?? "n/a"}`);
  lines.push(`- id: ${inlineCode(entry.id)}`);
  lines.push(`- title: ${entry.title}`);
  lines.push(`- category: ${entry.category}`);
  lines.push(`- level kind: ${entry.levelKind || "not found"}`);
  lines.push(`- source file: ${inlineCode(entry.sourcePath || "not found")}`);
  lines.push(`- dossier link: [dossier](${escapeMarkdown(`../${entry.dossierRelativePath}`)})`);
  lines.push(`- summary index: [behavior-summary-index](../behavior-summary-index.md)`);
  lines.push("");
  lines.push("## Fixture Overview");
  if (entry.notApplicableReason) {
    lines.push(`- status: not run`);
    lines.push(`- not-applicable reason: ${entry.notApplicableReason}`);
  } else {
    lines.push(`- status: ${entry.runs.some((run) => run.status === "documented exception") ? "documented exception" : entry.runs.every((run) => run.status === "pass") ? "pass" : "fail"}`);
    lines.push(`- runnable fixture count: ${entry.runs.length}`);
    for (const run of entry.runs) {
      lines.push(`- ${run.fixtureKind}: ${run.status}${run.documentedException ? ` (documented exception)` : ""}`);
      lines.push(`  - fixture path: ${run.fixturePath ? inlineCode(run.fixturePath) : "not found"}`);
      lines.push(`  - turns elapsed: ${run.turnsElapsed ?? "n/a"}`);
      lines.push(`  - lastLevelResultReason: ${run.lastLevelResultReason || "none"}`);
    }
  }
  lines.push("");
  lines.push("## Runtime Evidence");
  if (entry.notApplicableReason) {
    lines.push("- no runtime evidence collected");
  } else {
    lines.push("| fixture kind | run status | turns | scores | reference actions | live enemy acted | enemy interactions |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- |");
    for (const run of entry.runs) {
      lines.push(
        `| ${escapeMarkdown(run.fixtureKind)} | ${escapeMarkdown(run.status)} | ${run.turnsElapsed ?? "n/a"} | ${escapeMarkdown(formatScoreboard(run.teamScores))} | ${run.actionCount} | ${run.liveEnemyActed ? "yes" : "no"} | ${escapeMarkdown(summarizeInteractionEvents(run.enemyInteractionEvents))} |`
      );
    }
  }
  lines.push("");
  if (entry.runs.length > 0) {
    for (const run of entry.runs) {
      lines.push(...renderRunSection(run));
      lines.push("");
    }
  }
  return lines.join("\n").trimEnd();
}

function renderBehaviorSummaryIndexMarkdown(entries) {
  const lines = [];
  lines.push("# Guided Level Behavior Summary Index");
  lines.push("");
  lines.push("Project rows summarize both checkpoint and final fixtures inside a single level row; the per-level evidence files contain the detailed fixture-by-fixture breakdown.");
  lines.push("");
  lines.push("| order | level id | title | fixture kind | run status | turns elapsed | reference action count | distinct action types observed | branch/trace evidence present | live enemy acted | enemy interaction events | dossier link | behavior evidence link |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const entry of entries) {
    const runStatus = entry.notApplicableReason
      ? "not run"
      : entry.runs.some((run) => run.status === "documented exception")
        ? "documented exception"
        : entry.runs.every((run) => run.status === "pass")
          ? "pass"
          : "fail";
    const fixtureKind = entry.notApplicableReason
      ? "not applicable"
      : entry.runs.length === 1
        ? entry.runs[0].fixtureKind
        : "project checkpoint + final";
    const turnsElapsed = entry.notApplicableReason
      ? "n/a"
      : entry.runs.length === 1
        ? String(entry.runs[0].turnsElapsed ?? "n/a")
        : entry.runs.map((run) => `${run.fixtureKind === "project checkpoint" ? "checkpoint" : "final"} ${run.turnsElapsed ?? "n/a"}`).join(" / ");
    const referenceActionCount = entry.notApplicableReason
      ? "n/a"
      : entry.runs.length === 1
        ? String(entry.runs[0].actionCount)
        : entry.runs.map((run) => `${run.fixtureKind === "project checkpoint" ? "checkpoint" : "final"} ${run.actionCount}`).join(" / ");
    const distinctActionTypesObserved = entry.notApplicableReason
      ? "n/a"
      : entry.runs.length === 1
        ? (entry.runs[0].distinctReferenceActionTypes.length > 0
            ? entry.runs[0].distinctReferenceActionTypes.map((actionType) => inlineCode(actionType)).join(", ")
            : "none")
        : entry.runs.map((run) => `${run.fixtureKind === "project checkpoint" ? "checkpoint" : "final"} ${run.distinctReferenceActionTypes.length > 0 ? run.distinctReferenceActionTypes.map((actionType) => inlineCode(actionType)).join(", ") : "none"}`).join(" / ");
    const branchTraceEvidencePresent = entry.notApplicableReason
      ? "no"
      : entry.runs.some((run) => run.branchTraceEvidencePresent)
        ? "yes"
        : "no";
    const liveEnemyActed = entry.notApplicableReason
      ? "no"
      : entry.runs.some((run) => run.liveEnemyActed)
        ? "yes"
        : "no";
    const enemyInteractionEvents = entry.notApplicableReason
      ? "none"
      : summarizeInteractionEvents(entry.runs.flatMap((run) => run.enemyInteractionEvents));
    lines.push(
      `| ${entry.order ?? "n/a"} | ${inlineCode(entry.id)} | ${escapeMarkdown(entry.title)} | ${escapeMarkdown(fixtureKind)} | ${escapeMarkdown(runStatus)} | ${escapeMarkdown(turnsElapsed)} | ${escapeMarkdown(referenceActionCount)} | ${escapeMarkdown(distinctActionTypesObserved)} | ${branchTraceEvidencePresent} | ${liveEnemyActed} | ${escapeMarkdown(enemyInteractionEvents)} | [dossier](${escapeMarkdown(entry.dossierRelativePath)}) | [behavior](${escapeMarkdown(entry.behaviorRelativePath)}) |`
    );
  }
  return lines.join("\n");
}

function buildLevelBehaviorEntry(level, context) {
  const manifestEntry = getLevelManifestEntry(level.id);
  const order = manifestEntry?.order ?? null;
  const dossierRelativePath = getDossierRelativePath(order ?? "n/a", level.id);
  const behaviorRelativePath = getBehaviorRelativePath(order ?? "n/a", level.id);
  const category = getLevelCategory(level);
  const runnableDescriptors = getRunnableDescriptors(level, context);
  const notApplicableReason = runnableDescriptors.length === 0 ? getNotApplicableReason(level) : null;
  const runs = runnableDescriptors.map((descriptor) =>
    buildRunEvidence(level, descriptor, {
      randomSeedText: `behavior-evidence:${level.id}:${descriptor.fixtureKind}`
    })
  );

  return {
    order,
    id: level.id,
    title: level.title,
    levelKind: level.levelKind || null,
    category,
    sourcePath: level.sourcePath || null,
    project: level.project ? structuredClone(level.project) : null,
    dossierRelativePath,
    behaviorRelativePath,
    notApplicableReason,
    runs
  };
}

export async function buildGuidedLevelBehaviorEvidenceData() {
  const context = await loadLevelReadinessContext();
  const entries = context.levels
    .map((level) => buildLevelBehaviorEntry(level, context))
    .sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER) || left.id.localeCompare(right.id));
  return { context, entries };
}

export async function generateGuidedLevelBehaviorEvidence({
  outputDir = GUIDED_LEVEL_BEHAVIOR_OUTPUT_DIR,
  summaryIndexPath = GUIDED_LEVEL_BEHAVIOR_SUMMARY_INDEX_PATH
} = {}) {
  const { entries } = await buildGuidedLevelBehaviorEvidenceData();
  await fs.rm(outputDir, { recursive: true, force: true });
  await fs.mkdir(outputDir, { recursive: true });

  const writtenFiles = [];
  for (const entry of entries) {
    const fileName = `${padOrder(entry.order ?? 0)}-${slugify(entry.id)}.md`;
    const absolutePath = path.join(outputDir, fileName);
    entry.behaviorRelativePath = `${BEHAVIOR_EVIDENCE_RELATIVE_DIR}/${fileName}`;
    const markdown = renderBehaviorEvidenceMarkdown(entry);
    await fs.writeFile(absolutePath, `${markdown}\n`, "utf8");
    writtenFiles.push({
      levelId: entry.id,
      path: absolutePath,
      relativePath: toRepoRelative(absolutePath)
    });
  }

  await fs.mkdir(path.dirname(summaryIndexPath), { recursive: true });
  const summaryMarkdown = renderBehaviorSummaryIndexMarkdown(entries);
  await fs.writeFile(summaryIndexPath, `${summaryMarkdown}\n`, "utf8");

  return {
    outputDir,
    summaryIndexPath,
    entries,
    writtenFiles
  };
}

export function renderGuidedLevelBehaviorSummaryIndexMarkdown(entries) {
  return renderBehaviorSummaryIndexMarkdown(entries);
}

export function renderGuidedLevelBehaviorEvidenceMarkdown(entry) {
  return renderBehaviorEvidenceMarkdown(entry);
}
