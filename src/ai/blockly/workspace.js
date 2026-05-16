import * as Blockly from "blockly";
import {
  ADVANCED_COMPARE_OPERATORS,
  BLOCK_TYPES,
  FREE_PLAY_MODES,
  GAME_VIEW_MODES,
  MOVE_TOWARD_TARGETS
} from "../../config/constants.js";
import { getCurrentLevel } from "../../core/levels.js";
import { evaluateCondition } from "../../core/conditions.js";
import { getEnemyTeamId, getTeamFlagHome } from "../../core/teams.js";
import {
  getActionTypeForBlockType,
  getBlockDisplayLabel,
  getBlockLibrary,
  getCurrentMoveTowardTargetValues,
  getCurrentSensorObjectValues,
  getCurrentSensorRelationValues,
  getFullToolboxBlockTypes,
  getMoveTowardTargetOptionLabels,
  getSensorObjectOptionLabels,
  getSensorRelationOptionLabels,
  getToolboxBlockTypesForMode,
  isConditionBlockType,
  registerBattleBlocklyBlocks
} from "./blocks.js";
import { setAllowedMoveTowardTargets, setAllowedSensorOptions } from "./blocks.js";
import { applyBlocklyPanelSize } from "../../ui/blocklyLayout.js";
import { getActiveProgramLabel } from "../../ui/programContext.js";
import { clearAllTraceClasses } from "./traceRenderer.js";

const IGNORED_BLOCK_REASON = "bba_ignored_block";
const GUIDED_WORKSPACE_STORAGE_PREFIX = "bba:guided-workspace:";
const FREE_PLAY_WORKSPACE_STORAGE_KEY = "bba:free-play-workspace";
const FREE_PLAY_PVP_WORKSPACE_STORAGE_PREFIX = "bba:free-play-pvp-team:";

function buildToolboxXml(blockTypes) {
  const blockLibrary = getBlockLibrary();
  const categories = new Map();
  for (const blockType of blockTypes) {
    const config = blockLibrary[blockType];
    if (!config) {
      continue;
    }
    if (!categories.has(config.category)) {
      categories.set(config.category, { color: config.color, blocks: [] });
    }
    categories.get(config.category).blocks.push(blockType);
  }

  const categoryXml = [...categories.entries()]
    .map(([name, config]) => {
      const blocksXml = config.blocks.map((type) => `        <block type="${type}"></block>`).join("\n");
      return `      <category name="${name}" colour="${config.color}">\n${blocksXml}\n      </category>`;
    })
    .join("\n");

  return `<xml xmlns="https://developers.google.com/blockly/xml">\n${categoryXml}\n    </xml>`;
}

function buildDefaultWorkspaceXml() {
  return `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="${BLOCK_TYPES.ON_EACH_TURN}" x="24" y="24"></block>
    </xml>
  `.trim();
}

function buildGuidedAssistStarterWorkspaceXml(xmlText, x = 360) {
  if (!xmlText) {
    return xmlText;
  }

  try {
    const xml = Blockly.utils.xml.textToDom(xmlText);
    const blocks = xml.getElementsByTagName?.("block") || [];
    for (const block of blocks) {
      if (block.getAttribute?.("type") === BLOCK_TYPES.ON_EACH_TURN) {
        block.setAttribute("x", String(x));
        break;
      }
    }
    return Blockly.Xml.domToText(xml);
  } catch {
    return xmlText;
  }
}

function getEventBlock(workspace) {
  return workspace.getBlocksByType(BLOCK_TYPES.ON_EACH_TURN, false)[0] || null;
}

function getFreePlayProgramKey(teamId) {
  return Number(teamId) === 2 ? "team2" : "team1";
}

function getActiveFreePlayProgramKey(app) {
  if (app.state.freePlayMode === FREE_PLAY_MODES.PLAYER_VS_PLAYER) {
    return getFreePlayProgramKey(app.state.activeBlocklyTeamTab || 1);
  }
  return "player";
}

function buildUsageWorkspaceCapture(app, reason) {
  if (!app.blocklyWorkspace) {
    return null;
  }
  const blockCounts = app.blocklyWorkspace.getAllBlocks(false).reduce((counts, block) => {
    counts[block.type] = (counts[block.type] || 0) + 1;
    return counts;
  }, {});

  return {
    reason,
    xmlText: getWorkspaceXmlText(app),
    blockCounts,
    modeView: app.state.currentModeView,
    levelId: app.state.currentLevelId,
    mapKey: app.state.currentMapKey,
    freePlayMode: app.state.freePlayMode,
    freePlayTeamSize: app.state.freePlayTeamSize,
    activeBlocklyTeamTab: app.state.activeBlocklyTeamTab,
    turnNumber: app.state.currentTurnNumber
  };
}

function createBlocklyTraceCollector(runner) {
  const steps = [];
  const runnerId = runner?.id ?? null;
  const runnerTeam = runner?.team ?? null;

  return {
    recordStep(step) {
      if (!step || typeof step !== "object") {
        return;
      }
      steps.push({
        ...step,
        runnerId,
        runnerTeam
      });
    },
    getSteps() {
      return steps.map((step) => ({ ...step }));
    }
  };
}

export function clearBlocklyTracePlayback(app) {
  if (!app?.state) {
    return;
  }

  clearAllTraceClasses(app.blocklyWorkspace);
  app.state.activeBlocklyTrace = null;
  app.state.tracePlaybackSteps = [];
  app.state.traceStepIndex = 0;
  app.state.traceStepFrameCount = 0;
  app.state.traceStepFrameBudget = 0;
  app.state.traceCurrentBlockId = null;
  app.state.traceOverflowBadgeVisible = false;
  app.state.traceEmptyHintVisible = false;
}

function recordTraceStep(collector, block, kind, extra = {}) {
  if (!collector || !block) {
    return;
  }
  collector.recordStep({
    blockId: block.id,
    blockType: block.type,
    kind,
    ...extra
  });
}

function isWorkspaceEditable(workspace) {
  if (!workspace) {
    return false;
  }
  if (typeof workspace.isReadOnly === "function") {
    return !workspace.isReadOnly();
  }
  return !workspace.readOnly;
}

function clearWorkspaceUndoHistory(workspace) {
  workspace?.clearUndo?.();
}

export function canUndoBlocklyWorkspace(app) {
  const workspace = app.blocklyWorkspace;
  return Boolean(isWorkspaceEditable(workspace) && workspace?.getUndoStack?.().length > 0);
}

export function canRedoBlocklyWorkspace(app) {
  const workspace = app.blocklyWorkspace;
  return Boolean(isWorkspaceEditable(workspace) && workspace?.getRedoStack?.().length > 0);
}

export function undoBlocklyWorkspace(app) {
  const workspace = app.blocklyWorkspace;
  if (!canUndoBlocklyWorkspace(app)) {
    return false;
  }
  workspace?.hideChaff?.();
  workspace?.undo?.(false);
  return true;
}

export function redoBlocklyWorkspace(app) {
  const workspace = app.blocklyWorkspace;
  if (!canRedoBlocklyWorkspace(app)) {
    return false;
  }
  workspace?.hideChaff?.();
  workspace?.undo?.(true);
  return true;
}

export function getActiveBlocklyProgramLabel(app) {
  return getActiveProgramLabel(app.state);
}

function getWorkspaceStorageKey(app, overrideTeamId = null) {
  if (app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS) {
    const currentLevel = getCurrentLevel(app);
    if (currentLevel?.project?.id) {
      return `bba:guided-project-workspace:${currentLevel.project.id}`;
    }
    return `${GUIDED_WORKSPACE_STORAGE_PREFIX}${app.state.currentLevelId || "unknown"}`;
  }
  if (app.state.freePlayMode === FREE_PLAY_MODES.PLAYER_VS_PLAYER) {
    const teamId = overrideTeamId ?? app.state.activeBlocklyTeamTab ?? 1;
    return `${FREE_PLAY_PVP_WORKSPACE_STORAGE_PREFIX}${teamId}`;
  }
  return FREE_PLAY_WORKSPACE_STORAGE_KEY;
}

function cacheWorkspaceXml(app, xmlText, overrideTeamId = null) {
  if (app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS) {
    return;
  }
  const key = app.state.freePlayMode === FREE_PLAY_MODES.PLAYER_VS_PLAYER
    ? getFreePlayProgramKey(overrideTeamId ?? app.state.activeBlocklyTeamTab ?? 1)
    : "player";
  app.state.freePlayPrograms[key] = xmlText;
}

function getCachedWorkspaceXml(app, overrideTeamId = null) {
  if (app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS) {
    return "";
  }
  const key = app.state.freePlayMode === FREE_PLAY_MODES.PLAYER_VS_PLAYER
    ? getFreePlayProgramKey(overrideTeamId ?? app.state.activeBlocklyTeamTab ?? 1)
    : "player";
  return app.state.freePlayPrograms[key] || "";
}

function ensureEventBlock(app) {
  if (!app.blocklyWorkspace) {
    return null;
  }
  let eventBlock = getEventBlock(app.blocklyWorkspace);
  if (eventBlock) {
    eventBlock.setDeletable(false);
    eventBlock.setMovable(false);
    eventBlock.setWarningText(null);
    eventBlock.setDisabledReason(false, IGNORED_BLOCK_REASON);
    return eventBlock;
  }

  const xml = Blockly.utils.xml.textToDom(buildDefaultWorkspaceXml());
  Blockly.Xml.domToWorkspace(xml, app.blocklyWorkspace);
  eventBlock = getEventBlock(app.blocklyWorkspace);
  if (eventBlock) {
    eventBlock.setDeletable(false);
    eventBlock.setMovable(false);
    eventBlock.setDisabledReason(false, IGNORED_BLOCK_REASON);
  }
  return eventBlock;
}

function applyGuidedDevBlocklyAssist(app) {
  if (
    app.state.currentModeView !== GAME_VIEW_MODES.GUIDED_LEVELS ||
    !app.state.guidedLevelDevAccessActive ||
    !app.state.guidedLevelBlocklyAssistActive ||
    app.state.guidedLevelBlocklyAssistApplied ||
    app.state.currentLevelId !== app.state.guidedLevelBlocklyAssistLevelId ||
    !app.blocklyWorkspace
  ) {
    return false;
  }

  const toolbox = app.blocklyWorkspace.getToolbox?.();
  const toolboxItems = toolbox?.getToolboxItems?.() || [];
  if (!toolbox || toolboxItems.length === 0) {
    console.warn("[BBA] Guided Blockly assist could not open the toolbox because no categories were available.");
    return false;
  }

  toolbox.selectItemByPosition?.(0);
  const flyout = toolbox.getFlyout?.();
  flyout?.reflow?.();
  const flyoutElement = document.querySelector(".blocklyToolboxFlyout");
  const blocklyElement = document.getElementById("blocklyDiv");
  const eventBlock = app.blocklyWorkspace.getBlocksByType(BLOCK_TYPES.ON_EACH_TURN, false)[0] || null;
  const flyoutRect = flyoutElement?.getBoundingClientRect?.() || null;
  const blocklyRect = blocklyElement?.getBoundingClientRect?.() || null;
  const blockRect = eventBlock?.getSvgRoot?.()?.getBoundingClientRect?.() || null;
  const revealStarterBlock = () => {
    const liveFlyoutRect = document.querySelector(".blocklyToolboxFlyout")?.getBoundingClientRect?.() || flyoutRect;
    const liveBlocklyRect = blocklyElement?.getBoundingClientRect?.() || blocklyRect;
    const liveBlockRect = eventBlock?.getSvgRoot?.()?.getBoundingClientRect?.() || blockRect;
    if (
      !liveFlyoutRect ||
      !liveBlocklyRect ||
      !liveBlockRect ||
      typeof app.blocklyWorkspace.scroll !== "function" ||
      liveBlockRect.left > liveFlyoutRect.right + 8 &&
      liveBlockRect.right <= liveBlocklyRect.right - 8
    ) {
      return;
    }

    const targetLeft = liveFlyoutRect.right + 24;
    const maxLeft = liveBlocklyRect.right - 8 - liveBlockRect.width;
    const desiredLeft = Math.min(targetLeft, maxLeft);
    const deltaX = desiredLeft - liveBlockRect.left;
    if (deltaX > 0) {
      app.blocklyWorkspace.scroll(
        (app.blocklyWorkspace.scrollX || 0) + deltaX,
        app.blocklyWorkspace.scrollY || 0
      );
    }
  };
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(revealStarterBlock);
  } else {
    revealStarterBlock();
  }
  app.state.guidedLevelBlocklyAssistApplied = true;
  return true;
}

function getConditionChildBlock(block) {
  return typeof block.getInputTargetBlock === "function" ? block.getInputTargetBlock("DO") : null;
}

function getElseChildBlock(block) {
  return typeof block.getInputTargetBlock === "function" ? block.getInputTargetBlock("ELSE") : null;
}

function getValueChildBlock(block, inputName) {
  return typeof block.getInputTargetBlock === "function" ? block.getInputTargetBlock(inputName) : null;
}

function getActionDecisionForBlock(block) {
  const actionType = getActionTypeForBlockType(block.type);
  if (!actionType) {
    return null;
  }

  if (block.type === BLOCK_TYPES.MOVE_TOWARD) {
    return {
      type: actionType,
      actionType,
      targetType: block.getFieldValue("TARGET")
    };
  }

  return { type: actionType, actionType, sourceBlockType: block.type };
}

function getConditionDescriptor(block) {
  if (block.type === BLOCK_TYPES.BOOLEAN_SENSOR_MATCHES) {
    return {
      type: BLOCK_TYPES.IF_SENSOR_MATCHES,
      objectType: block.getFieldValue("OBJECT"),
      relationType: block.getFieldValue("RELATION")
    };
  }
  if (block.type === BLOCK_TYPES.BOOLEAN_HAVE_ENEMY_FLAG) {
    return { type: BLOCK_TYPES.IF_HAVE_ENEMY_FLAG };
  }
  if (block.type === BLOCK_TYPES.BOOLEAN_CAN_JUMP) {
    return { type: BLOCK_TYPES.IF_CAN_JUMP };
  }
  if (block.type === BLOCK_TYPES.BOOLEAN_CAN_PLACE_BARRIER) {
    return { type: BLOCK_TYPES.IF_CAN_PLACE_BARRIER };
  }
  if (block.type === BLOCK_TYPES.BOOLEAN_AREA_FREEZE_READY) {
    return { type: BLOCK_TYPES.IF_AREA_FREEZE_READY };
  }
  if (block.type === BLOCK_TYPES.BOOLEAN_TEAMMATE_HAS_FLAG) {
    return { type: BLOCK_TYPES.IF_TEAMMATE_HAS_FLAG };
  }
  if (block.type === BLOCK_TYPES.BOOLEAN_ON_MY_SIDE) {
    return { type: BLOCK_TYPES.IF_ON_MY_SIDE };
  }
  if (block.type === BLOCK_TYPES.BOOLEAN_ON_ENEMY_SIDE) {
    return { type: BLOCK_TYPES.IF_ON_ENEMY_SIDE };
  }
  if (block.type === BLOCK_TYPES.IF_SENSOR_MATCHES || block.type === BLOCK_TYPES.IF_SENSOR_MATCHES_ELSE) {
    return {
      type: block.type,
      objectType: block.getFieldValue("OBJECT"),
      relationType: block.getFieldValue("RELATION")
    };
  }
  return { type: block.type };
}

function resolveMoveTowardTargetCell(state, runner, targetType) {
  switch (targetType) {
    case MOVE_TOWARD_TARGETS.ENEMY_FLAG: {
      const enemyFlag = state.gameFlags[getEnemyTeamId(runner.team)];
      if (!enemyFlag) {
        return null;
      }
      if (enemyFlag.carriedByRunnerId) {
        const carrier = state.allRunners.find((candidate) => candidate.id === enemyFlag.carriedByRunnerId);
        return carrier ? { x: carrier.gridX, y: carrier.gridY } : null;
      }
      return { x: enemyFlag.gridX, y: enemyFlag.gridY };
    }
    case MOVE_TOWARD_TARGETS.MY_BASE: {
      const flagHome = getTeamFlagHome(state, runner.team);
      return flagHome ? { x: flagHome.x + runner.playDirection, y: flagHome.y } : null;
    }
    case MOVE_TOWARD_TARGETS.HUMAN_RUNNER: {
      const human = state.allRunners.find((candidate) => candidate.team === runner.team && candidate.isHumanControlled);
      return human ? { x: human.gridX, y: human.gridY } : null;
    }
    case MOVE_TOWARD_TARGETS.CLOSEST_ENEMY: {
      const enemies = state.allRunners
        .filter((candidate) => candidate.team !== runner.team)
        .sort((left, right) => {
          const leftDistance = Math.abs(left.gridX - runner.gridX) + Math.abs(left.gridY - runner.gridY);
          const rightDistance = Math.abs(right.gridX - runner.gridX) + Math.abs(right.gridY - runner.gridY);
          return leftDistance - rightDistance || left.id.localeCompare(right.id);
        });
      return enemies[0] ? { x: enemies[0].gridX, y: enemies[0].gridY } : null;
    }
    default:
      return null;
  }
}

function evaluateBlocklyNumberValue(state, runner, block, collector = null) {
  if (!block) {
    return 0;
  }
  switch (block.type) {
    case BLOCK_TYPES.VALUE_NUMBER:
      return Number(block.getFieldValue("VALUE") || 0);
    case BLOCK_TYPES.VALUE_RUNNER_INDEX:
      return Number.isInteger(runner?.allyIndex) ? runner.allyIndex : 0;
    case BLOCK_TYPES.VALUE_DISTANCE_TO_TARGET: {
      const target = resolveMoveTowardTargetCell(state, runner, block.getFieldValue("TARGET"));
      return target ? Math.abs(target.x - runner.gridX) + Math.abs(target.y - runner.gridY) : 0;
    }
    case BLOCK_TYPES.VALUE_RANDOM_ROLL: {
      const randomFn = typeof state.randomFn === "function" ? state.randomFn : Math.random;
      return Math.floor(randomFn() * 6) + 1;
    }
    case BLOCK_TYPES.VALUE_PLAY_DIRECTION:
      return runner?.playDirection || 0;
    default:
      return 0;
  }
}

function evaluateBlocklyBooleanValue(state, runner, block, collector = null) {
  if (!block) {
    return false;
  }

  if (
    block.type === BLOCK_TYPES.BOOLEAN_SENSOR_MATCHES ||
    block.type === BLOCK_TYPES.BOOLEAN_HAVE_ENEMY_FLAG ||
    block.type === BLOCK_TYPES.BOOLEAN_CAN_JUMP ||
    block.type === BLOCK_TYPES.BOOLEAN_CAN_PLACE_BARRIER ||
    block.type === BLOCK_TYPES.BOOLEAN_AREA_FREEZE_READY ||
    block.type === BLOCK_TYPES.BOOLEAN_TEAMMATE_HAS_FLAG ||
    block.type === BLOCK_TYPES.BOOLEAN_ON_MY_SIDE ||
    block.type === BLOCK_TYPES.BOOLEAN_ON_ENEMY_SIDE
  ) {
    const result = evaluateCondition(state, runner, getConditionDescriptor(block));
    recordTraceStep(collector, block, "condition", { result });
    return result;
  }

  if (block.type === BLOCK_TYPES.LOGIC_AND) {
    const left = evaluateBlocklyBooleanValue(state, runner, getValueChildBlock(block, "LEFT"), collector);
    if (!left) {
      recordTraceStep(collector, block, "boolean", { result: false });
      return false;
    }
    const right = evaluateBlocklyBooleanValue(state, runner, getValueChildBlock(block, "RIGHT"), collector);
    const result = left && right;
    recordTraceStep(collector, block, "boolean", { result });
    return result;
  }
  if (block.type === BLOCK_TYPES.LOGIC_OR) {
    const left = evaluateBlocklyBooleanValue(state, runner, getValueChildBlock(block, "LEFT"), collector);
    if (left) {
      recordTraceStep(collector, block, "boolean", { result: true });
      return true;
    }
    const right = evaluateBlocklyBooleanValue(state, runner, getValueChildBlock(block, "RIGHT"), collector);
    const result = left || right;
    recordTraceStep(collector, block, "boolean", { result });
    return result;
  }
  if (block.type === BLOCK_TYPES.LOGIC_NOT) {
    const value = evaluateBlocklyBooleanValue(state, runner, getValueChildBlock(block, "VALUE"), collector);
    const result = !value;
    recordTraceStep(collector, block, "boolean", { result });
    return result;
  }
  if (block.type === BLOCK_TYPES.VALUE_COMPARE) {
    const left = evaluateBlocklyNumberValue(state, runner, getValueChildBlock(block, "LEFT"), collector);
    const right = evaluateBlocklyNumberValue(state, runner, getValueChildBlock(block, "RIGHT"), collector);
    let result = false;
    switch (block.getFieldValue("OPERATOR")) {
      case ADVANCED_COMPARE_OPERATORS.EQ:
        result = left === right;
        break;
      case ADVANCED_COMPARE_OPERATORS.NEQ:
        result = left !== right;
        break;
      case ADVANCED_COMPARE_OPERATORS.LT:
        result = left < right;
        break;
      case ADVANCED_COMPARE_OPERATORS.LTE:
        result = left <= right;
        break;
      case ADVANCED_COMPARE_OPERATORS.GT:
        result = left > right;
        break;
      case ADVANCED_COMPARE_OPERATORS.GTE:
        result = left >= right;
        break;
      default:
        result = false;
        break;
    }
    recordTraceStep(collector, block, "comparison", { result, numericLeft: left, numericRight: right });
    return result;
  }

  return false;
}

function collectStaticallyReachableBlocks(block, reachableIds) {
  let current = block;
  let canFallThrough = true;

  while (current && canFallThrough) {
    reachableIds.add(current.id);

    if (Array.isArray(current.inputList)) {
      for (const input of current.inputList) {
        if (!input?.name) {
          continue;
        }
        const connectedBlock = current.getInputTargetBlock?.(input.name);
        if (connectedBlock) {
          collectStaticallyReachableBlocks(connectedBlock, reachableIds);
        }
      }
    }

    if (getActionTypeForBlockType(current.type)) {
      canFallThrough = false;
      break;
    }

    if (isConditionBlockType(current.type)) {
      const childBlock = getConditionChildBlock(current);
      if (childBlock) {
        collectStaticallyReachableBlocks(childBlock, reachableIds);
      }
      const elseChildBlock = getElseChildBlock(current);
      if (elseChildBlock) {
        collectStaticallyReachableBlocks(elseChildBlock, reachableIds);
      }
    }

    current = current.getNextBlock();
  }
}

function clearBlocklyWarningsAndIgnoreState(block) {
  block.setDisabledReason(false, IGNORED_BLOCK_REASON);
  block.setWarningText(null);
  if (block.__bbaExecutionHintWarningActive) {
    block.__bbaExecutionHintWarningActive = false;
    Blockly.hideChaff?.();
  }
}

function applyIgnoredState(block, message) {
  block.setDisabledReason(true, IGNORED_BLOCK_REASON);
  block.setWarningText(message);
  block.__bbaExecutionHintWarningActive = true;
}

export function updateBlocklyExecutionHints(app) {
  if (!app.blocklyWorkspace) {
    return;
  }

  const eventBlock = ensureEventBlock(app);
  const allBlocks = app.blocklyWorkspace.getAllBlocks(false);
  const reachableIds = new Set();
  if (!eventBlock) {
    return;
  }

  reachableIds.add(eventBlock.id);
  collectStaticallyReachableBlocks(eventBlock.getNextBlock(), reachableIds);

  for (const currentBlock of allBlocks) {
    if (currentBlock.id === eventBlock.id) {
      clearBlocklyWarningsAndIgnoreState(currentBlock);
      continue;
    }

    if (!reachableIds.has(currentBlock.id)) {
      const isAttachedSomewhere = Boolean(currentBlock.getParent());
      applyIgnoredState(
        currentBlock,
        isAttachedSomewhere
          ? "Ignored for now: another action will happen before this block can run."
          : "Ignored for now: attach this under 'On Each Turn' to run it."
      );
      continue;
    }

    clearBlocklyWarningsAndIgnoreState(currentBlock);
    if (
      isConditionBlockType(currentBlock.type) &&
      !getConditionChildBlock(currentBlock) &&
      !getElseChildBlock(currentBlock)
    ) {
      currentBlock.setWarningText("Add a move or action inside this block so it can do something.");
      currentBlock.__bbaExecutionHintWarningActive = true;
    }
  }
}

function resolveFirstRunnableAction(state, runner, block, collector = null) {
  let current = block;

  while (current) {
    const actionDecision = getActionDecisionForBlock(current);
    if (actionDecision) {
      recordTraceStep(collector, current, "action");
      return actionDecision;
    }

    if (isConditionBlockType(current.type)) {
      const conditionPassed = current.type === BLOCK_TYPES.IF_BOOLEAN || current.type === BLOCK_TYPES.IF_BOOLEAN_ELSE
        ? evaluateBlocklyBooleanValue(state, runner, getValueChildBlock(current, "BOOL"), collector)
        : evaluateCondition(state, runner, getConditionDescriptor(current));
      recordTraceStep(collector, current, "condition", { result: conditionPassed });
      if (conditionPassed) {
        const branchAction = resolveFirstRunnableAction(state, runner, getConditionChildBlock(current), collector);
        if (branchAction) {
          return branchAction;
        }
      } else {
        const elseAction = resolveFirstRunnableAction(state, runner, getElseChildBlock(current), collector);
        if (elseAction) {
          return elseAction;
        }
      }
    }

    current = current.getNextBlock();
  }

  return null;
}

export function getFirstRunnableAction(app, runner) {
  if (!app.blocklyWorkspace) {
    return null;
  }
  const shouldUseVisibleWorkspace =
    app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS ||
    app.state.freePlayMode !== FREE_PLAY_MODES.PLAYER_VS_PLAYER ||
    Number(app.state.activeBlocklyTeamTab || 1) === Number(runner.team);

  if (shouldUseVisibleWorkspace) {
    const eventBlock = ensureEventBlock(app);
    return resolveFirstRunnableAction(app.state, runner, eventBlock?.getNextBlock() || null);
  }

  const xmlText = getStoredWorkspaceXmlText(app, runner.team, buildDefaultWorkspaceXml());
  const workspace = new Blockly.Workspace();
  try {
    const xml = Blockly.utils.xml.textToDom(xmlText || buildDefaultWorkspaceXml());
    Blockly.Xml.domToWorkspace(xml, workspace);
    const eventBlock = getEventBlock(workspace);
    return resolveFirstRunnableAction(app.state, runner, eventBlock?.getNextBlock() || null);
  } finally {
    workspace.dispose();
  }
}

export function getFirstRunnableActionWithTrace(app, runner) {
  if (!app.blocklyWorkspace) {
    return { action: null, trace: null };
  }

  const shouldUseVisibleWorkspace =
    app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS ||
    app.state.freePlayMode !== FREE_PLAY_MODES.PLAYER_VS_PLAYER ||
    Number(app.state.activeBlocklyTeamTab || 1) === Number(runner.team);

  if (shouldUseVisibleWorkspace) {
    const eventBlock = ensureEventBlock(app);
    const collector = createBlocklyTraceCollector(runner);
    const action = resolveFirstRunnableAction(app.state, runner, eventBlock?.getNextBlock() || null, collector);
    if (!action && eventBlock) {
      recordTraceStep(collector, eventBlock, "empty");
    }
    return { action, trace: collector.getSteps() };
  }

  const xmlText = getStoredWorkspaceXmlText(app, runner.team, buildDefaultWorkspaceXml());
  const workspace = new Blockly.Workspace();
  try {
    const xml = Blockly.utils.xml.textToDom(xmlText || buildDefaultWorkspaceXml());
    Blockly.Xml.domToWorkspace(xml, workspace);
    const eventBlock = getEventBlock(workspace);
    const action = resolveFirstRunnableAction(app.state, runner, eventBlock?.getNextBlock() || null);
    return { action, trace: null };
  } finally {
    workspace.dispose();
  }
}

export function initBlockly(app) {
  registerBattleBlocklyBlocks();
  const blocklyDiv = document.getElementById("blocklyDiv");
  const initialToolboxXml = buildToolboxXml(getFullToolboxBlockTypes());
  app.blocklyWorkspace = Blockly.inject(blocklyDiv, {
    toolbox: initialToolboxXml,
    scrollbars: true,
    trashcan: true
  });
  applyBlocklyPanelSize(app);
  loadWorkspaceXml(app, "");
  app.usageTracker?.recordWorkspaceSnapshot?.("editor_initialized", buildUsageWorkspaceCapture(app, "editor_initialized"));
  app.blocklyWorkspace.addChangeListener((event) => {
    if (event?.isUiEvent) {
      return;
    }
    updateBlocklyExecutionHints(app);
    if (app.blocklyWorkspace.__bbaSuppressUsageCapture) {
      return;
    }
    if (event?.type) {
      app.usageTracker?.recordWorkspaceChange?.({
        reason: event.type,
        modeView: app.state.currentModeView,
        levelId: app.state.currentLevelId,
        mapKey: app.state.currentMapKey,
        activeBlocklyTeamTab: app.state.activeBlocklyTeamTab,
        turnNumber: app.state.currentTurnNumber
      });
      app.usageTracker?.queueWorkspaceSnapshot?.(app, event.type);
    }
    saveWorkspaceToLocalStorage(app);
    app.syncUi?.();
  });
}

export function resizeBlocklyWorkspace(app) {
  if (!app.blocklyWorkspace) {
    return;
  }
  Blockly.svgResize(app.blocklyWorkspace);
}

export function setBlocklyEditable(app, isEditable) {
  const blocklyContainer = document.getElementById("blocklyDiv");
  if (!app.blocklyWorkspace) {
    return;
  }
  app.blocklyWorkspace.readOnly = !isEditable;
  if (blocklyContainer) {
    blocklyContainer.classList.toggle("blockly-area-read-only", !isEditable);
  }
  if (!isEditable) {
    Blockly.hideChaff();
  }
}

export function loadWorkspaceXml(app, xmlText) {
  if (!app.blocklyWorkspace) {
    return;
  }
  clearBlocklyTracePlayback(app);
  app.blocklyWorkspace.__bbaSuppressUsageCapture = true;
  try {
    app.blocklyWorkspace.clear();
    const workspaceXml = xmlText || buildDefaultWorkspaceXml();
    const xml = Blockly.utils.xml.textToDom(workspaceXml);
    Blockly.Xml.domToWorkspace(xml, app.blocklyWorkspace);
    ensureEventBlock(app);
    updateBlocklyExecutionHints(app);
    clearWorkspaceUndoHistory(app.blocklyWorkspace);
  } finally {
    app.blocklyWorkspace.__bbaSuppressUsageCapture = false;
  }
  app.syncUi?.();
}

export function getWorkspaceXmlText(app) {
  if (!app.blocklyWorkspace) {
    return "";
  }
  const xml = Blockly.Xml.workspaceToDom(app.blocklyWorkspace);
  return Blockly.Xml.domToText(xml);
}

export function setBlocklyToolboxForCurrentMode(app) {
  if (!app.blocklyWorkspace) {
    return [];
  }
  const currentLevel = app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS ? getCurrentLevel(app) : null;
  const sensorObjectTypes = currentLevel?.sensorObjectTypes || [];
  const sensorRelationTypes = currentLevel?.sensorRelationTypes || [];
  const moveTowardTargetTypes = currentLevel?.moveTowardTargetTypes || [];
  setAllowedSensorOptions(sensorObjectTypes, sensorRelationTypes);
  setAllowedMoveTowardTargets(moveTowardTargetTypes);
  app.state.currentSensorObjectTypes = getCurrentSensorObjectValues();
  app.state.currentSensorRelationTypes = getCurrentSensorRelationValues();
  app.state.currentMoveTowardTargetTypes = getCurrentMoveTowardTargetValues();
  const blockTypes = getToolboxBlockTypesForMode(app, currentLevel);
  const toolboxXml = buildToolboxXml(blockTypes);
  app.blocklyWorkspace.updateToolbox(toolboxXml);
  app.state.currentToolboxBlockTypes = [...blockTypes];
  updateBlocklyExecutionHints(app);
  return blockTypes;
}

export function getAvailableToolboxBlockTypes(app) {
  return [...(app.state.currentToolboxBlockTypes || [])];
}

export function getAvailableToolboxBlockLabels(app) {
  return getAvailableToolboxBlockTypes(app).map((blockType) => getBlockDisplayLabel(blockType));
}

export function getMoveTowardTargetLabels() {
  return getMoveTowardTargetOptionLabels();
}

export function getSensorObjectLabels() {
  return getSensorObjectOptionLabels();
}

export function getSensorRelationLabels() {
  return getSensorRelationOptionLabels();
}

export function getStoredWorkspaceXmlText(app, overrideTeamId = null, fallbackXml = "") {
  if (typeof window === "undefined" || !window.localStorage) {
    return getCachedWorkspaceXml(app, overrideTeamId) || fallbackXml;
  }
  return (
    window.localStorage.getItem(getWorkspaceStorageKey(app, overrideTeamId)) ||
    getCachedWorkspaceXml(app, overrideTeamId) ||
    fallbackXml
  );
}

export function saveWorkspaceToLocalStorage(app, overrideTeamId = null) {
  if (!app.blocklyWorkspace || typeof window === "undefined" || !window.localStorage) {
    return;
  }
  const xmlText = getWorkspaceXmlText(app);
  cacheWorkspaceXml(app, xmlText, overrideTeamId);
  window.localStorage.setItem(getWorkspaceStorageKey(app, overrideTeamId), xmlText);
}

export function switchActiveBlocklyTeamTab(app, teamId) {
  if (app.state.currentModeView !== GAME_VIEW_MODES.FREE_PLAY || app.state.freePlayMode !== FREE_PLAY_MODES.PLAYER_VS_PLAYER) {
    return;
  }
  clearBlocklyTracePlayback(app);
  saveWorkspaceToLocalStorage(app, app.state.activeBlocklyTeamTab || 1);
  app.state.activeBlocklyTeamTab = Number(teamId) === 2 ? 2 : 1;
  loadWorkspaceFromLocalStorage(app, "", app.state.activeBlocklyTeamTab);
  updateBlocklyExecutionHints(app);
}

export function loadWorkspaceFromLocalStorage(app, fallbackXml = "", overrideTeamId = null) {
  clearBlocklyTracePlayback(app);
  const xmlToLoad = getStoredWorkspaceXmlText(app, overrideTeamId, fallbackXml);
  const shouldShiftStarterWorkspace = Boolean(
    app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS &&
    app.state.guidedLevelDevAccessActive &&
    app.state.guidedLevelBlocklyAssistActive &&
    !app.state.guidedLevelBlocklyAssistApplied &&
    app.state.currentLevelId === app.state.guidedLevelBlocklyAssistLevelId &&
    xmlToLoad === fallbackXml
  );
  const xmlForWorkspace = shouldShiftStarterWorkspace
    ? buildGuidedAssistStarterWorkspaceXml(xmlToLoad)
    : xmlToLoad;
  loadWorkspaceXml(app, xmlForWorkspace);
  cacheWorkspaceXml(app, xmlToLoad, overrideTeamId);
  applyGuidedDevBlocklyAssist(app);
  app.usageTracker?.recordWorkspaceSnapshot?.("workspace_loaded", buildUsageWorkspaceCapture(app, "workspace_loaded"));
  return xmlToLoad;
}

export function importWorkspaceXml(app, xmlText) {
  if (!app.blocklyWorkspace) {
    return { ok: false, error: "Workspace is not ready." };
  }
  const previousXml = getWorkspaceXmlText(app);
  try {
    clearBlocklyTracePlayback(app);
    loadWorkspaceXml(app, xmlText);
    saveWorkspaceToLocalStorage(app);
    app.usageTracker?.recordWorkspaceImported?.({
      modeView: app.state.currentModeView,
      levelId: app.state.currentLevelId,
      mapKey: app.state.currentMapKey,
      turnNumber: app.state.currentTurnNumber
    });
    app.usageTracker?.recordWorkspaceSnapshot?.("workspace_imported", buildUsageWorkspaceCapture(app, "workspace_imported"));
    return { ok: true };
  } catch (error) {
    loadWorkspaceXml(app, previousXml);
    return { ok: false, error: error instanceof Error ? error.message : "Invalid XML." };
  }
}
