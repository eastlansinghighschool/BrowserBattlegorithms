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
  NPC_BEHAVIORS,
  TURN_STATES
} from "../config/constants.js";
import { getBlockDisplayLabel } from "../ai/blockly/blocks.js";
import { GUIDED_LEVEL_MANIFEST } from "../config/levels/manifest.js";
import { registerBattleBlocklyBlocks } from "../ai/blockly/blocks.js";
import { getFirstRunnableAction, loadWorkspaceXml } from "../ai/blockly/workspace.js";
import { createApp } from "../core/state.js";
import { initializeLevelState, startLevel } from "../core/levels.js";
import { processTurnActions } from "../core/turnEngine.js";
import { createSeededRandom, loadLevelReadinessContext } from "./levelReadiness.js";
import { PROJECT_READINESS_POLICY } from "./levelReadinessProjectPolicy.js";
import { GUIDED_LEVEL_DOSSIER_OUTPUT_DIR } from "./levelDossiers.js";
import { normalizeLegacyLevelSetup } from "../config/levels/shared/normalizeSetup.js";

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

function getConnectedBlocks(block, visited = new Set()) {
  if (!block || visited.has(block.id)) {
    return visited;
  }
  visited.add(block.id);
  const next = block.getNextBlock();
  if (next) {
    getConnectedBlocks(next, visited);
  }
  for (const input of block.inputList || []) {
    const target = input.connection?.targetBlock();
    if (target) {
      getConnectedBlocks(target, visited);
    }
  }
  return visited;
}

function getBlockCoverage(app, traceSnapshots) {
  if (!app.blocklyWorkspace) {
    return { ratioText: "not applicable", total: 0, blocks: [] };
  }
  const eventBlock = app.blocklyWorkspace.getAllBlocks(false).find(b => b.type === "battlegorithms_on_each_turn");
  if (!eventBlock) {
    return { ratioText: "not applicable", total: 0, blocks: [] };
  }
  const executableBlockIds = getConnectedBlocks(eventBlock);
  const executableBlocks = app.blocklyWorkspace.getAllBlocks(false).filter(b => executableBlockIds.has(b.id) && b.isEnabled());

  const firedCounts = {};
  for (const trace of traceSnapshots) {
    if (Array.isArray(trace.steps)) {
      for (const step of trace.steps) {
        if (step.blockId) {
          firedCounts[step.blockId] = (firedCounts[step.blockId] || 0) + 1;
        }
      }
    }
  }

  let firedCount = 0;
  const blocksData = executableBlocks.map(block => {
    const count = firedCounts[block.id] || 0;
    if (count > 0) firedCount += 1;
    return {
      id: block.id,
      type: block.type,
      label: getBlockDisplayLabel(block.type) || block.type,
      count,
      fired: count > 0
    };
  });

  const total = executableBlocks.length;
  const ratioText = total > 0 ? `${firedCount} / ${total} (${((firedCount / total) * 100).toFixed(1)}%)` : "0 / 0 (0.0%)";
  return {
    ratioText,
    firedCount,
    total,
    blocks: blocksData
  };
}

export function runBehaviorSimulation(level, xmlText, { randomSeedText }) {
  const app = makeSimulationApp(randomSeedText);
  if (!level.setup && level.setupOverrides) {
    level.setup = normalizeLegacyLevelSetup(level.setupOverrides);
  }
  if (!app.state.levels.some((l) => l.id === level.id)) {
    app.state.levels.push(level);
  }
  startLevel(app, level.id);
  loadWorkspaceXml(app, xmlText);

  const turnEventLogs = [];
  const traceSnapshots = [];
  let previousEventSignature = null;
  let previousTraceSignature = null;

  const npcMovementTimeline = [];
  let currentNpcTurnRecord = null;
  const ownTurnCounts = {};

  const interactionTimeline = [];
  const loggedNearMissesThisTurn = new Set();
  const playerRunner = app.state.allRunners.find((r) => r.team === 1 && !r.isNPC && !r.isHumanControlled);

  const currentTurnStateByRunner = new Map();
  const derivedOutcomesByTurnAndRunner = new Map();

  let omittedEvents = false;

  for (let tick = 0; tick < MAX_SIMULATION_TICKS; tick += 1) {
    if (app.state.activeLevelResult === LEVEL_RESULT.PASSED || app.state.activeLevelResult === LEVEL_RESULT.FAILED) {
      break;
    }

    const preActiveRunner = app.state.allRunners[app.state.activeRunnerIndex];
    const preTurnState = app.state.currentTurnState;
    const currentTurn = app.state.currentTurnNumber;

    // Increment own-turn count on turn start boundary
    if (preTurnState === TURN_STATES.AWAITING_INPUT && preActiveRunner) {
      ownTurnCounts[preActiveRunner.id] = (ownTurnCounts[preActiveRunner.id] || 0) + 1;
      
      // Initialize runner turn state tracker
      currentTurnStateByRunner.set(preActiveRunner.id, {
        startX: preActiveRunner.gridX,
        startY: preActiveRunner.gridY,
        actionChosen: "STAY_STILL", // default fallback
        turn: currentTurn
      });
    }

    const isEventInWindow = currentTurn <= 15;

    // 1. NPC own-turn start detection (only if NOT frozen)
    if (preTurnState === TURN_STATES.AWAITING_INPUT && preActiveRunner && preActiveRunner.team !== 1 && !preActiveRunner.isFrozen) {
      const counts = ownTurnCounts[preActiveRunner.id] || 0;
      if (counts < 15) {
        currentNpcTurnRecord = {
          turn: currentTurn,
          runnerId: preActiveRunner.id,
          behavior: preActiveRunner.cpuBehavior || getNpcBehaviorLabel(preActiveRunner),
          fromCell: `(${preActiveRunner.gridX}, ${preActiveRunner.gridY})`,
          isFrozen: preActiveRunner.isFrozen,
          action: "STAY_STILL"
        };
      }
    }

    // 2. Near-miss check at turn boundaries
    if (preTurnState === TURN_STATES.AWAITING_INPUT) {
      if (isEventInWindow) {
        for (const p of app.state.allRunners.filter((r) => r.team === 1)) {
          for (const e of app.state.allRunners.filter((r) => r.team !== 1)) {
            const dist = Math.abs(p.gridX - e.gridX) + Math.abs(p.gridY - e.gridY);
            if (dist === 1) {
              const key = `${currentTurn}:${p.id}:${e.id}`;
              if (!loggedNearMissesThisTurn.has(key)) {
                loggedNearMissesThisTurn.add(key);
                interactionTimeline.push({
                  turn: currentTurn,
                  event: "near-miss",
                  details: `enemy ${e.id} within 1 cell of player ${p.id} (at (${p.gridX}, ${p.gridY}) and (${e.gridX}, ${e.gridY}))`
                });
              }
            }
          }
        }
      } else {
        // Check if any near-miss occurred that we are omitting
        for (const p of app.state.allRunners.filter((r) => r.team === 1)) {
          for (const e of app.state.allRunners.filter((r) => r.team !== 1)) {
            const dist = Math.abs(p.gridX - e.gridX) + Math.abs(p.gridY - e.gridY);
            if (dist === 1) {
              omittedEvents = true;
            }
          }
        }
      }
    }

    // Pre-action state for collision detection
    const prePositions = app.state.allRunners.map((r) => ({ id: r.id, team: r.team, x: r.gridX, y: r.gridY }));
    const queued = app.state.queuedActionForCurrentRunner;
    let plannedCollision = null;

    if (queued && preActiveRunner && (queued.actionType.startsWith("MOVE") || queued.actionType.startsWith("JUMP"))) {
      if (isEventInWindow) {
        const targetX = preActiveRunner.gridX + (queued.dx || 0);
        const targetY = preActiveRunner.gridY + (queued.dy || 0);
        const opponent = prePositions.find((p) => p.team !== preActiveRunner.team && p.x === targetX && p.y === targetY);
        if (opponent) {
          const oppRunnerObj = app.state.allRunners.find((r) => r.id === opponent.id);
          if (oppRunnerObj && !oppRunnerObj.isFrozen) {
            plannedCollision = {
              turn: currentTurn,
              event: "collision",
              details: `player ${preActiveRunner.team === 1 ? preActiveRunner.id : opponent.id} collided with enemy ${preActiveRunner.team === 1 ? opponent.id : preActiveRunner.id} at (${targetX}, ${targetY})`
            };
          }
        }
      } else {
        omittedEvents = true;
      }
    }

    processTurnActions(app, TEST_P5);

    const postActiveRunner = app.state.allRunners[app.state.activeRunnerIndex];
    const postTurnState = app.state.currentTurnState;
    const levelEnded = app.state.activeLevelResult === LEVEL_RESULT.PASSED || app.state.activeLevelResult === LEVEL_RESULT.FAILED;

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

      // Update action chosen in our turn start tracker
      const chosenEvent = lastTurnEventLog.find((e) => e.kind === "runner.actionChosen" && e.payload.runnerId === preActiveRunner?.id);
      if (chosenEvent && preActiveRunner) {
        const startState = currentTurnStateByRunner.get(preActiveRunner.id);
        if (startState) {
          startState.actionChosen = chosenEvent.payload.actionType;
        }
      }
    }

    // Finalize runner turn and derive outcome if the runner changed or level ended
    if (preActiveRunner && (levelEnded || postActiveRunner?.id !== preActiveRunner.id || postTurnState === TURN_STATES.AWAITING_INPUT)) {
      const startState = currentTurnStateByRunner.get(preActiveRunner.id);
      if (startState) {
        const endX = preActiveRunner.gridX;
        const endY = preActiveRunner.gridY;
        const hasMoved = startState.startX !== endX || startState.startY !== endY;

        // Scan lastTurnEventLog for resolving outcome
        const bounced = lastTurnEventLog.some((e) => e.kind === "runner.blockedOrBounced" && e.payload.runnerId === preActiveRunner.id);
        const skippedFrozen = lastTurnEventLog.some((e) => e.kind === "runner.actionResolved" && e.payload.runnerId === preActiveRunner.id && e.payload.outcome === "skipped_frozen");
        const freezeUsed = lastTurnEventLog.some((e) => e.kind === "runner.actionResolved" && e.payload.runnerId === preActiveRunner.id && e.payload.outcome === "freeze_applied");
        const barrierUsed = lastTurnEventLog.some((e) => e.kind === "runner.actionResolved" && e.payload.runnerId === preActiveRunner.id && e.payload.outcome === "barrier_placed");

        let outcome = "stayed";
        if (hasMoved) {
          outcome = startState.actionChosen.includes("JUMP") ? "jumped" : "moved";
        } else {
          if (skippedFrozen) outcome = "skipped_frozen";
          else if (bounced) outcome = "bounced";
          else if (freezeUsed) outcome = "freeze_applied";
          else if (barrierUsed) outcome = "barrier_placed";
          else if (startState.actionChosen === "STAY_STILL") outcome = "stayed";
          else outcome = "illegal_noop";
        }

        derivedOutcomesByTurnAndRunner.set(`${startState.turn}:${preActiveRunner.id}`, outcome);
        currentTurnStateByRunner.delete(preActiveRunner.id);

        // Update NPC movement timeline record action using our derived outcome
        if (currentNpcTurnRecord && currentNpcTurnRecord.runnerId === preActiveRunner.id) {
          currentNpcTurnRecord.action = startState.actionChosen;
          if (outcome === "skipped_frozen") {
            currentNpcTurnRecord.action = "STAY_STILL (frozen)";
          } else if (outcome === "bounced") {
            currentNpcTurnRecord.action = `${startState.actionChosen} (bounced)`;
          } else {
            currentNpcTurnRecord.action = `${startState.actionChosen} (${outcome})`;
          }
          currentNpcTurnRecord.toCell = `(${preActiveRunner.gridX}, ${preActiveRunner.gridY})`;
          npcMovementTimeline.push(currentNpcTurnRecord);
          currentNpcTurnRecord = null;
        }
      }
    }

    // Process turn events for interactionTimeline
    if (lastTurnEventLog.length > 0) {
      // Sort to make event order stable: collision/bounce/flag events
      // flag events first, then collision, then bounce
      const sortedEvents = [...lastTurnEventLog].sort((a, b) => {
        const order = { "flag.pickedUp": 1, "flag.dropped": 2, "team.scored": 3, "score.blocked": 4, "collision": 5, "runner.blockedOrBounced": 6 };
        return (order[a.kind] || 99) - (order[b.kind] || 99);
      });

      for (const event of sortedEvents) {
        const payload = event.payload;
        const kind = event.kind;
        const turn = event.turn;

        const isForceKind = kind === "team.scored" || kind === "score.blocked";

        if (isEventInWindow || isForceKind) {
          if (kind === "runner.blockedOrBounced") {
            const bounceType = payload.reason === "runner_collision_bounce" ? " (cell occupied)" : "";
            interactionTimeline.push({
              turn,
              event: "bounce",
              details: `runner ${payload.runnerId} bounced${bounceType} trying to reach (${payload.attemptedCell.x}, ${payload.attemptedCell.y})`
            });
          } else if (kind === "flag.pickedUp") {
            interactionTimeline.push({
              turn,
              event: "flag.pickedUp",
              details: `runner ${payload.carrierRunnerId} picked up flag ${payload.flagTeam} at (${payload.cell.x}, ${payload.cell.y})`
            });
          } else if (kind === "flag.dropped") {
            interactionTimeline.push({
              turn,
              event: "flag.dropped",
              details: `flag ${payload.flagTeam} dropped by runner ${payload.previousCarrierRunnerId} at (${payload.cell.x}, ${payload.cell.y}) due to ${payload.reason}`
            });
          } else if (kind === "team.scored") {
            interactionTimeline.push({
              turn,
              event: "team.scored",
              details: `team ${payload.scoringTeam} scored a point`
            });
          } else if (kind === "score.blocked") {
            interactionTimeline.push({
              turn,
              event: "score.blocked",
              details: `scoring blocked for team ${payload.blockedTeam} because own flag is away`
            });
          } else if (kind === "runner.actionResolved" && payload.actionType === AI_ACTION_TYPES.FREEZE_OPPONENTS) {
            interactionTimeline.push({
              turn,
              event: "freeze",
              details: `runner ${payload.runnerId} used Area Freeze`
            });
          }
        } else {
          omittedEvents = true;
        }
      }
    }

    // If a collision was planned and resolved in this turn, record it
    if (plannedCollision) {
      const activeResolved = lastTurnEventLog?.some(
        (e) => e.kind === "runner.actionResolved" && e.payload.runnerId === preActiveRunner.id
      );
      if (activeResolved) {
        if (isEventInWindow) {
          interactionTimeline.push(plannedCollision);
        } else {
          omittedEvents = true;
        }
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

  // Add final level result to interaction timeline
  if (app.state.activeLevelResult === LEVEL_RESULT.PASSED || app.state.activeLevelResult === LEVEL_RESULT.FAILED) {
    interactionTimeline.push({
      turn: app.state.currentTurnNumber,
      event: "level.result",
      details: `level result: ${app.state.activeLevelResult} (reason: ${app.state.lastLevelResultReason || "none"})`
    });
  }

  if (omittedEvents) {
    interactionTimeline.push({
      turn: "...",
      event: "info",
      details: "later events omitted after evidence window"
    });
  }

  // Deduce static frozen NPCs
  const staticFrozenNpcs = [];
  const liveNpcIds = new Set(npcMovementTimeline.map((r) => r.runnerId));
  for (const runner of app.state.allRunners.filter((r) => r.team !== 1)) {
    if (!liveNpcIds.has(runner.id) && runner.isFrozen) {
      staticFrozenNpcs.push({
        id: runner.id,
        behavior: runner.cpuBehavior || getNpcBehaviorLabel(runner) || "PATROL_INTERCEPT",
        initialCell: `(${runner.initialGridX}, ${runner.initialGridY})`
      });
    }
  }

  const { actionEvents, scoreEvents, interactionEvents } = collectEventLogs(turnEventLogs);
  
  // Override resolvedOutcome with our derived outcomes
  for (const entry of actionEvents) {
    const key = `${entry.turn}:${entry.payload.runnerId}`;
    if (derivedOutcomesByTurnAndRunner.has(key)) {
      entry.resolvedOutcome = derivedOutcomesByTurnAndRunner.get(key);
    }
  }

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
    enemyInteractionEvents,
    npcMovementTimeline,
    staticFrozenNpcs,
    interactionTimeline
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
      status: "not run",
      npcMovementTimeline: [],
      staticFrozenNpcs: [],
      interactionTimeline: [],
      blockCoverage: { ratioText: "not applicable", total: 0, blocks: [] },
      blockCount: 0
    };
  }

  const simulation = runBehaviorSimulation(level, descriptor.xmlText, { randomSeedText });
  const status = descriptor.documentedException ? "documented exception" : simulation.app.state.activeLevelResult === LEVEL_RESULT.PASSED ? "pass" : "fail";
  const enemyBehaviorSummary = getEnemyBehaviorSummary(simulation.app.state.allRunners, simulation.enemyActionEvents);
  const controlledActionRows = buildControlledActionSummary(simulation.referenceActionEvents, simulation.traceSnapshots);
  const enemyActionRows = buildEnemyActionSummary(simulation.enemyActionEvents, simulation.traceSnapshots);
  const blockCoverage = getBlockCoverage(simulation.app, simulation.traceSnapshots);
  const blockCount = simulation.app.blocklyWorkspace ? simulation.app.blocklyWorkspace.getAllBlocks(false).length : 0;

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
    },
    npcMovementTimeline: simulation.npcMovementTimeline,
    staticFrozenNpcs: simulation.staticFrozenNpcs,
    interactionTimeline: simulation.interactionTimeline,
    blockCoverage,
    blockCount
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
    },
    npcMovementTimeline: [],
    staticFrozenNpcs: [],
    interactionTimeline: [],
    blockCoverage: { ratioText: "not applicable", total: 0, blocks: [] },
    blockCount: 0
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

  lines.push("#### Enemy Movement Timeline");
  if (run.npcMovementTimeline && run.npcMovementTimeline.length > 0) {
    lines.push("| turn | runner | behavior | from | to | action |");
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const log of run.npcMovementTimeline) {
      lines.push(`| ${log.turn} | ${inlineCode(log.runnerId)} | ${log.behavior} | ${log.fromCell} | ${log.toCell} | ${log.action} |`);
    }
  } else if (run.staticFrozenNpcs && run.staticFrozenNpcs.length > 0) {
    lines.push("- no live NPC movement observed");
  } else {
    lines.push("- no NPCs");
  }

  if (run.staticFrozenNpcs && run.staticFrozenNpcs.length > 0) {
    lines.push("");
    lines.push("**Static/Frozen NPCs:**");
    for (const npc of run.staticFrozenNpcs) {
      lines.push(`- ${inlineCode(npc.id)}: behavior ${npc.behavior}, starting cell ${npc.initialCell} (frozen/static)`);
    }
  }

  lines.push("");
  lines.push("#### Interaction Timeline");
  if (run.interactionTimeline && run.interactionTimeline.length > 0) {
    lines.push("| turn | event | details |");
    lines.push("| --- | --- | --- |");
    for (const event of run.interactionTimeline) {
      lines.push(`| ${event.turn} | ${inlineCode(event.event)} | ${event.details} |`);
    }
  } else {
    lines.push("- no interaction events observed in window");
  }

  lines.push("");
  lines.push("#### Blockly Reference Solution Execution Trace Coverage");
  if (run.blockCoverage && run.blockCoverage.ratioText !== "not applicable") {
    lines.push(`- executable block count: ${run.blockCoverage.total}`);
    lines.push(`- blocks fired: ${run.blockCoverage.blocks.filter(b => b.fired).length}`);
    lines.push(`- blocks never fired: ${run.blockCoverage.blocks.filter(b => !b.fired).length}`);
    lines.push(`- coverage ratio: ${run.blockCoverage.ratioText}`);
    lines.push("");
    lines.push("| block id | block type | display label | fired count | status |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const b of run.blockCoverage.blocks) {
      lines.push(`| ${inlineCode(b.id)} | ${inlineCode(b.type)} | ${b.label} | ${b.count} | ${b.fired ? "fired" : "never fired"} |`);
    }
  } else {
    lines.push("- status: not applicable");
  }

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
  lines.push("## Naive Solution Run Proof");
  if (entry.naiveRunResult) {
    lines.push(`- status: ${entry.naiveRunResult.status}`);
    lines.push(`- fixture path: ${inlineCode(entry.naiveRunResult.fixturePath)}`);
    lines.push(`- turns elapsed: ${entry.naiveRunResult.turnsElapsed}`);
    lines.push(`- failure reason: ${inlineCode(entry.naiveRunResult.lastLevelResultReason)}`);
    lines.push(`- final board state summary: ${entry.naiveRunResult.boardSummary}`);
  } else {
    lines.push("- status: no naive fixture");
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
  lines.push("| order | level id | title | fixture kind | run status | turns elapsed | reference action count | distinct action types observed | branch/trace evidence present | live enemy acted | enemy interaction events | live enemy count | movement-timeline present | trace-observed execution ratio | naive fixture present/result | dossier link | behavior evidence link |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
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

    const liveEnemyCount = entry.notApplicableReason
      ? "n/a"
      : String(new Set(entry.runs.flatMap(run => (run.npcMovementTimeline || []).map(r => r.runnerId))).size);
    
    const movementTimelinePresent = entry.notApplicableReason
      ? "no"
      : (entry.runs.some(run => run.npcMovementTimeline && run.npcMovementTimeline.length > 0) ? "yes" : "no");
    
    const ratioText = entry.notApplicableReason
      ? "n/a"
      : entry.runs.length === 1
        ? entry.runs[0].blockCoverage.ratioText
        : entry.runs.map(run => `${run.fixtureKind === "project checkpoint" ? "checkpoint" : "final"} ${run.blockCoverage?.ratioText || "n/a"}`).join(" / ");
        
    const naiveFixtureResult = entry.naiveRunResult
      ? `yes (${entry.naiveRunResult.status})`
      : "no naive fixture";

    lines.push(
      `| ${entry.order ?? "n/a"} | ${inlineCode(entry.id)} | ${escapeMarkdown(entry.title)} | ${escapeMarkdown(fixtureKind)} | ${escapeMarkdown(runStatus)} | ${escapeMarkdown(turnsElapsed)} | ${escapeMarkdown(referenceActionCount)} | ${escapeMarkdown(distinctActionTypesObserved)} | ${branchTraceEvidencePresent} | ${liveEnemyActed} | ${escapeMarkdown(enemyInteractionEvents)} | ${liveEnemyCount} | ${movementTimelinePresent} | ${escapeMarkdown(ratioText)} | ${escapeMarkdown(naiveFixtureResult)} | [dossier](${escapeMarkdown(entry.dossierRelativePath)}) | [behavior](${escapeMarkdown(entry.behaviorRelativePath)}) |`
    );
  }
  return lines.join("\n");
}

function getBoardStateSummary(state) {
  const runnerParts = state.allRunners.map(
    r => `${r.id} at (${r.gridX}, ${r.gridY})${r.hasEnemyFlag ? " with flag" : ""}${r.isFrozen ? " (frozen)" : ""}`
  );
  const flagParts = [];
  for (const teamId of [1, 2]) {
    const flag = state.gameFlags[teamId];
    if (flag) {
      let status = "loose";
      if (flag.isAtBase) status = "at base";
      if (flag.carriedByRunnerId) status = `carried by ${flag.carriedByRunnerId}`;
      flagParts.push(`Flag ${teamId} is ${status}`);
    }
  }
  return `Score: ${formatScoreboard(state.teamScores)}. ${runnerParts.join("; ")}. ${flagParts.join("; ")}.`;
}

function buildLevelBehaviorEntry(level, context, naiveSolutions) {
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

  const naiveFixture = naiveSolutions.get(level.id) || null;
  let naiveRunResult = null;
  if (naiveFixture && naiveFixture.xmlText) {
    const simulation = runBehaviorSimulation(level, naiveFixture.xmlText, {
      randomSeedText: `naive-evidence:${level.id}`
    });
    naiveRunResult = {
      fixturePath: toRepoRelative(naiveFixture.filePath),
      status: simulation.app.state.activeLevelResult === LEVEL_RESULT.PASSED ? "pass" : "fail",
      turnsElapsed: simulation.app.state.currentTurnNumber,
      lastLevelResultReason: simulation.app.state.lastLevelResultReason || "none",
      boardSummary: getBoardStateSummary(simulation.app.state)
    };
  }

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
    runs,
    naiveRunResult
  };
}

async function loadNaiveSolutions(levels) {
  const naiveSolutions = new Map();
  for (const level of levels) {
    const naivePath = path.join(REPO_ROOT, "tests/unit/fixtures/guided-naive-solutions", `${level.id}.xml`);
    try {
      const xmlText = await fs.readFile(naivePath, "utf8");
      naiveSolutions.set(level.id, { filePath: naivePath, xmlText });
    } catch {
      // Ignored
    }
  }
  return naiveSolutions;
}

export async function buildGuidedLevelBehaviorEvidenceData() {
  const context = await loadLevelReadinessContext();
  const naiveSolutions = await loadNaiveSolutions(context.levels);
  const entries = context.levels
    .map((level) => buildLevelBehaviorEntry(level, context, naiveSolutions))
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

  // Export Par Candidates
  const parCandidates = {};
  for (const entry of entries) {
    if (entry.notApplicableReason) {
      parCandidates[entry.id] = {
        runnable: false,
        notApplicableReason: entry.notApplicableReason
      };
    } else {
      parCandidates[entry.id] = {
        runnable: true,
        runs: entry.runs.map(run => ({
          fixtureKind: run.fixtureKind,
          turnsElapsed: run.turnsElapsed,
          blockCount: run.blockCount,
          distinctActionTypes: run.distinctReferenceActionTypes
        }))
      };
    }
  }
  const parCandidatesPath = path.join(outputDir, "../par-candidates.json");
  await fs.writeFile(parCandidatesPath, JSON.stringify(parCandidates, null, 2), "utf8");

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
