import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BLOCK_TYPES, COLS, HUMAN_TURN_BEHAVIORS, ROWS } from "../config/constants.js";
import { CELL_TYPE, MAPS } from "../config/maps.js";
import { GUIDED_LEVEL_MANIFEST } from "../config/levels/manifest.js";
import { getBlockDisplayLabel } from "../ai/blockly/blocks.js";
import { deriveHomeSideFromPlayDirection, getDefaultSlotPosition, getRunnerSlotMetadata } from "../core/teams.js";
import { loadLevelReadinessContext } from "./levelReadiness.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
export const GUIDED_LEVEL_DOSSIER_OUTPUT_DIR = path.join(
  REPO_ROOT,
  "reports/development/guided-level-complexity-audit"
);

const ACTION_BLOCK_TYPES = new Set([
  BLOCK_TYPES.MOVE_FORWARD,
  BLOCK_TYPES.MOVE_BACKWARD,
  BLOCK_TYPES.MOVE_UP_SCREEN,
  BLOCK_TYPES.MOVE_DOWN_SCREEN,
  BLOCK_TYPES.MOVE_RANDOMLY,
  BLOCK_TYPES.MOVE_TOWARD,
  BLOCK_TYPES.STAY_STILL,
  BLOCK_TYPES.JUMP_FORWARD,
  BLOCK_TYPES.PLACE_BARRIER,
  BLOCK_TYPES.FREEZE_OPPONENTS
]);

const DECISION_BLOCK_TYPES = new Set([
  BLOCK_TYPES.IF_SENSOR_MATCHES,
  BLOCK_TYPES.IF_SENSOR_MATCHES_ELSE,
  BLOCK_TYPES.IF_BARRIER_IN_FRONT,
  BLOCK_TYPES.IF_BARRIER_IN_FRONT_ELSE,
  BLOCK_TYPES.IF_ENEMY_IN_FRONT,
  BLOCK_TYPES.IF_HAVE_ENEMY_FLAG,
  BLOCK_TYPES.IF_HAVE_ENEMY_FLAG_ELSE,
  BLOCK_TYPES.IF_CAN_JUMP,
  BLOCK_TYPES.IF_CAN_JUMP_ELSE,
  BLOCK_TYPES.IF_CAN_PLACE_BARRIER,
  BLOCK_TYPES.IF_CAN_PLACE_BARRIER_ELSE,
  BLOCK_TYPES.IF_AREA_FREEZE_READY,
  BLOCK_TYPES.IF_AREA_FREEZE_READY_ELSE,
  BLOCK_TYPES.IF_TEAMMATE_HAS_FLAG,
  BLOCK_TYPES.IF_TEAMMATE_HAS_FLAG_ELSE,
  BLOCK_TYPES.IF_ON_MY_SIDE,
  BLOCK_TYPES.IF_ON_MY_SIDE_ELSE,
  BLOCK_TYPES.IF_ON_ENEMY_SIDE,
  BLOCK_TYPES.IF_ON_ENEMY_SIDE_ELSE,
  BLOCK_TYPES.IF_BOOLEAN,
  BLOCK_TYPES.IF_BOOLEAN_ELSE,
  BLOCK_TYPES.VALUE_COMPARE,
  BLOCK_TYPES.LOGIC_AND,
  BLOCK_TYPES.LOGIC_OR,
  BLOCK_TYPES.LOGIC_NOT
]);

const CONDITION_BLOCK_TYPES = new Set(
  [...DECISION_BLOCK_TYPES].filter((blockType) => String(blockType).startsWith("battlegorithms_if_"))
);

const BOOLEAN_COMPARISON_VALUE_BLOCK_TYPES = new Set([
  BLOCK_TYPES.BOOLEAN_SENSOR_MATCHES,
  BLOCK_TYPES.BOOLEAN_HAVE_ENEMY_FLAG,
  BLOCK_TYPES.BOOLEAN_CAN_JUMP,
  BLOCK_TYPES.BOOLEAN_CAN_PLACE_BARRIER,
  BLOCK_TYPES.BOOLEAN_AREA_FREEZE_READY,
  BLOCK_TYPES.BOOLEAN_TEAMMATE_HAS_FLAG,
  BLOCK_TYPES.BOOLEAN_ON_MY_SIDE,
  BLOCK_TYPES.BOOLEAN_ON_ENEMY_SIDE,
  BLOCK_TYPES.LOGIC_AND,
  BLOCK_TYPES.LOGIC_OR,
  BLOCK_TYPES.LOGIC_NOT,
  BLOCK_TYPES.VALUE_COMPARE,
  BLOCK_TYPES.VALUE_NUMBER,
  BLOCK_TYPES.VALUE_RUNNER_INDEX,
  BLOCK_TYPES.VALUE_DISTANCE_TO_TARGET,
  BLOCK_TYPES.VALUE_COUNT_WITHIN,
  BLOCK_TYPES.VALUE_RANDOM_ROLL,
  BLOCK_TYPES.VALUE_PLAY_DIRECTION
]);

const RESOURCE_READINESS_BLOCK_TYPES = new Set([
  BLOCK_TYPES.BOOLEAN_CAN_JUMP,
  BLOCK_TYPES.BOOLEAN_CAN_PLACE_BARRIER,
  BLOCK_TYPES.BOOLEAN_AREA_FREEZE_READY,
  BLOCK_TYPES.IF_CAN_JUMP,
  BLOCK_TYPES.IF_CAN_JUMP_ELSE,
  BLOCK_TYPES.IF_CAN_PLACE_BARRIER,
  BLOCK_TYPES.IF_CAN_PLACE_BARRIER_ELSE,
  BLOCK_TYPES.IF_AREA_FREEZE_READY,
  BLOCK_TYPES.IF_AREA_FREEZE_READY_ELSE
]);

function toRepoRelative(filePath) {
  if (!filePath) {
    return null;
  }
  if (path.isAbsolute(filePath)) {
    return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
  }
  return String(filePath).replace(/\\/g, "/");
}

function normalizeText(value) {
  return String(value || "")
    .replace(/\r?\n/g, " ")
    .replace(/[`\[\]*_]/g, "")
    .replace(/[:|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function expectedMatrixLabelFromTitle(title) {
  const normalized = normalizeText(title);
  if (normalized.startsWith("level ")) {
    const match = normalized.match(/^level\s+(\d+)/);
    return match ? match[1] : normalized;
  }
  if (normalized.startsWith("prediction ")) {
    const match = normalized.match(/^prediction\s+(\d+)/);
    return match ? `prediction ${match[1]}` : normalized;
  }
  if (normalized.startsWith("challenge ")) {
    const match = normalized.match(/^challenge\s+(\d+)/);
    return match ? `challenge ${match[1]}` : normalized;
  }
  if (normalized.startsWith("optional lab")) {
    return normalized;
  }
  return normalized;
}

function escapeMarkdown(value) {
  return String(value ?? "").replace(/\|/g, "\\|");
}

function inlineCode(value) {
  return `\`${String(value ?? "")}\``;
}

function padOrder(order) {
  return String(order).padStart(2, "0");
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanizeKey(key) {
  return String(key || "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function parseAttributes(attributeText) {
  const attrs = {};
  for (const match of String(attributeText || "").matchAll(/([A-Za-z_][\w:-]*)="([^"]*)"/g)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function parseXmlTree(xmlText) {
  const root = { name: "#document", attrs: {}, children: [] };
  const stack = [root];
  const tagPattern = /<!--[\s\S]*?-->|<\/?([A-Za-z_][\w:-]*)([^>]*)>/g;

  for (const match of String(xmlText || "").matchAll(tagPattern)) {
    const fullMatch = match[0];
    if (fullMatch.startsWith("<!--")) {
      continue;
    }

    const isClose = fullMatch.startsWith("</");
    const name = String(match[1] || "").toLowerCase();
    if (!name) {
      continue;
    }

    if (isClose) {
      if (stack.length > 1) {
        stack.pop();
      }
      continue;
    }

    const attrText = match[2] || "";
    const node = {
      name,
      attrs: parseAttributes(attrText),
      children: []
    };
    stack[stack.length - 1].children.push(node);

    const isSelfClosing = /\/\s*>$/.test(fullMatch);
    if (!isSelfClosing) {
      stack.push(node);
    }
  }

  return root;
}

function isBlockElement(node) {
  return node && (node.name === "block" || node.name === "shadow");
}

function traverseXmlTree(node, visitor, depth = 0) {
  visitor(node, depth);
  for (const child of node.children || []) {
    traverseXmlTree(child, visitor, depth + 1);
  }
}

function getFirstChildElement(node, childName) {
  return (node.children || []).find((child) => child.name === childName) || null;
}

function getFirstBlockChild(node) {
  return (node.children || []).find(isBlockElement) || null;
}

function getMainBlockChain(rootXmlNode) {
  const topLevelBlocks = (rootXmlNode.children || []).filter(isBlockElement);
  if (topLevelBlocks.length === 0) {
    return [];
  }

  const chain = [];
  let currentBlock = topLevelBlocks[0];
  while (currentBlock) {
    chain.push(currentBlock);
    const nextContainer = getFirstChildElement(currentBlock, "next");
    currentBlock = nextContainer ? getFirstBlockChild(nextContainer) : null;
  }

  return chain;
}

function countBlocksInTree(rootNode) {
  let totalBlocks = 0;
  const blockTypes = [];
  const blockNodes = [];
  traverseXmlTree(rootNode, (node, depth) => {
    if (!isBlockElement(node)) {
      return;
    }
    totalBlocks += 1;
    blockTypes.push(node.attrs.type || null);
    blockNodes.push({ node, depth });
  });
  return { totalBlocks, blockTypes, blockNodes };
}

function getMaxBlockDepth(node, depth = 0) {
  let maxDepth = depth;
  if (isBlockElement(node)) {
    depth += 1;
    maxDepth = Math.max(maxDepth, depth);
  }
  for (const child of node.children || []) {
    maxDepth = Math.max(maxDepth, getMaxBlockDepth(child, depth));
  }
  return maxDepth;
}

function collectUniqueBlockTypes(blockTypes) {
  return [...new Set(blockTypes.filter(Boolean))].sort((left, right) => left.localeCompare(right));
}

export function extractBlocklyXmlMetrics(xmlText) {
  const parsed = parseXmlTree(xmlText);
  const rootXmlNode = parsed.children.find((node) => node.name === "xml") || parsed;
  const { totalBlocks, blockTypes, blockNodes } = countBlocksInTree(rootXmlNode);
  const distinctBlockTypes = collectUniqueBlockTypes(blockTypes);
  const actionBlockCount = blockNodes.filter(({ node }) => ACTION_BLOCK_TYPES.has(node.attrs.type)).length;
  const conditionBlockCount = blockNodes.filter(({ node }) => CONDITION_BLOCK_TYPES.has(node.attrs.type)).length;
  const booleanComparisonValueBlockCount = blockNodes.filter(({ node }) =>
    BOOLEAN_COMPARISON_VALUE_BLOCK_TYPES.has(node.attrs.type)
  ).length;
  const maxNestingDepth = getMaxBlockDepth(rootXmlNode);
  const decisionPointCount = blockNodes.filter(({ node }) => DECISION_BLOCK_TYPES.has(node.attrs.type)).length;
  const runnerIndexUsage = blockNodes.filter(({ node }) => node.attrs.type === BLOCK_TYPES.VALUE_RUNNER_INDEX).length;
  const resourceReadinessUsage = blockNodes.filter(({ node }) =>
    RESOURCE_READINESS_BLOCK_TYPES.has(node.attrs.type)
  ).length;

  const topLevelBlocks = (rootXmlNode.children || []).filter(isBlockElement);
  const mainChain = getMainBlockChain(rootXmlNode);
  const mainChainActionCount = mainChain.filter((blockNode) => ACTION_BLOCK_TYPES.has(blockNode.attrs.type)).length;
  const firstActionOnlyRiskMarkers = [];

  if (topLevelBlocks.length > 1) {
    firstActionOnlyRiskMarkers.push(`${topLevelBlocks.length} top-level blocks appear in the XML; only the first attached path can execute per turn.`);
  }
  if (mainChainActionCount > 1) {
    firstActionOnlyRiskMarkers.push(
      `${mainChainActionCount} action blocks appear on the main On Each Turn chain; only the first action reached in a turn will execute.`
    );
  }

  return {
    totalBlocks,
    distinctBlockTypes: distinctBlockTypes.length,
    distinctBlockTypeNames: distinctBlockTypes,
    actionBlockCount,
    conditionBlockCount,
    booleanComparisonValueBlockCount,
    maxNestingDepth,
    branchDecisionCount: decisionPointCount,
    runnerIndexUsage,
    resourceReadinessUsage,
    firstActionOnlyRiskMarkers
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
    return "challenge";
  }
  if (String(level.id || "").startsWith("optional-") || normalizeText(level.title).includes("optional lab")) {
    return "optional lab";
  }
  return "ordinary";
}

function getPhaseFromSourcePath(sourcePath) {
  if (!sourcePath) {
    return "not found";
  }
  const parts = sourcePath.split("/");
  const phaseIndex = parts.indexOf("phases");
  if (phaseIndex === -1 || phaseIndex + 1 >= parts.length) {
    return "not found";
  }
  return parts[phaseIndex + 1];
}

function getMapLabel(mapKey) {
  return humanizeKey(mapKey);
}

function getMapDimensions(mapKey) {
  const map = MAPS[mapKey] || null;
  if (!map || map.length === 0) {
    return { cols: "not found", rows: "not found" };
  }
  return {
    cols: map[0]?.length ?? COLS,
    rows: map.length
  };
}

function getMapCellCoords(mapKey, cellType) {
  const map = MAPS[mapKey] || null;
  if (!map) {
    return [];
  }
  const coords = [];
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === cellType) {
        coords.push({ x, y });
      }
    }
  }
  return coords;
}

function formatCoordinateList(coords) {
  if (!Array.isArray(coords) || coords.length === 0) {
    return "none";
  }
  return coords.map((cell) => `(${cell.x}, ${cell.y})`).join(", ");
}

function getGoalCell(level) {
  const winCondition = level.winCondition || {};
  if (winCondition.type === "runner_reaches_cell") {
    return winCondition.targetCell ? { ...winCondition.targetCell } : null;
  }
  if (winCondition.type === "runner_reaches_enemy_flag") {
    const enemyRole = String(winCondition.runnerId || "").includes("runner_1_") ? "opponent" : "player";
    const enemyFlag = level.setup?.flags?.[enemyRole] || null;
    if (enemyFlag && Number.isFinite(enemyFlag.gridX) && Number.isFinite(enemyFlag.gridY)) {
      return { x: enemyFlag.gridX, y: enemyFlag.gridY };
    }
  }
  if (winCondition.type === "team_scores_point") {
    const ownRole = Number(winCondition.teamId) === 2 ? "opponent" : "player";
    const ownFlag = level.setup?.flags?.[ownRole] || null;
    if (ownFlag && Number.isFinite(ownFlag.gridX) && Number.isFinite(ownFlag.gridY)) {
      return { x: ownFlag.gridX, y: ownFlag.gridY };
    }
  }
  return null;
}

function getTerrainFacts(mapKey) {
  return {
    wallCells: getMapCellCoords(mapKey, CELL_TYPE.WALL),
    jailCells: getMapCellCoords(mapKey, CELL_TYPE.JAIL)
  };
}

function getFlagFacts(level) {
  const facts = [];
  const flagEntries = Object.entries(level.setup?.flags || {});
  for (const [role, flag] of flagEntries) {
    facts.push({
      role,
      x: flag?.gridX ?? flag?.x ?? "not found",
      y: flag?.gridY ?? flag?.y ?? "not found",
      carriedByRunnerId: flag?.carriedByRunnerId || null
    });
  }
  return facts.sort((left, right) => left.role.localeCompare(right.role));
}

function getBarrierFacts(level) {
  const barriers = Array.isArray(level.setup?.barriers) ? level.setup.barriers : [];
  return barriers.map((barrier, index) => ({
    index: index + 1,
    x: barrier?.gridX ?? barrier?.x ?? "not found",
    y: barrier?.gridY ?? barrier?.y ?? "not found",
    ownerRunnerId: barrier?.ownerRunnerId || null
  }));
}

function getRunnerControlLabel(runnerSpec) {
  if (runnerSpec.isHumanControlled) {
    return "human";
  }
  if (runnerSpec.isNPC) {
    return "npc";
  }
  return "ally";
}

function getRunnerSlotLabel(slot) {
  if (slot === "human") {
    return "human";
  }
  if (slot === "ally") {
    return "ally 0";
  }
  if (/^ally\d+$/.test(slot)) {
    return `ally ${Number(slot.replace("ally", "")) - 1}`;
  }
  if (/^npc\d+$/.test(slot)) {
    return `npc ${Number(slot.replace("npc", "")) - 1}`;
  }
  return slot;
}

function getRunnerFacts(level) {
  const teams = level.setup?.teams || {};
  const facts = [];
  for (const [role, teamSetup] of Object.entries(teams)) {
    const teamId = role === "player" ? 1 : 2;
    const homeSide = teamSetup?.homeSide || deriveHomeSideFromPlayDirection(teamSetup?.playDirection);
    const runners = Array.isArray(teamSetup?.runners) ? teamSetup.runners : [];
    runners.forEach((runnerSpec, runnerIndex) => {
      const slotMetadata = getRunnerSlotMetadata(teamId, runnerSpec.slot);
      const idSuffix = runnerSpec.idSuffix || slotMetadata.idSuffix;
      const runnerId = `runner_${teamId}_${idSuffix}`;
      const defaultPosition = getDefaultSlotPosition(homeSide, runnerSpec.slot);
      const startX = runnerSpec.gridX ?? defaultPosition.gridX ?? "not found";
      const startY = runnerSpec.gridY ?? defaultPosition.gridY ?? "not found";
      const isHumanControlled = runnerSpec.isHumanControlled ?? slotMetadata.isHumanControlled ?? false;
      const isNPC = runnerSpec.isNPC ?? slotMetadata.isNPC ?? false;
      facts.push({
        role,
        teamId,
        runnerIndex,
        slot: runnerSpec.slot,
        slotLabel: getRunnerSlotLabel(runnerSpec.slot),
        runnerId,
        control: getRunnerControlLabel({ isHumanControlled, isNPC }),
        isNPC,
        isHumanControlled,
        npcBehavior: runnerSpec.cpuBehavior || null,
        cpuRole: runnerSpec.cpuRole || null,
        playDirection: teamSetup?.playDirection ?? "not found",
        homeSide,
        x: startX,
        y: startY,
        frozen: Boolean(runnerSpec.isFrozen),
        frozenTurnsRemaining: runnerSpec.frozenTurnsRemaining ?? null,
        hasEnemyFlag: Boolean(runnerSpec.hasEnemyFlag),
        canJump: runnerSpec.canJump ?? true,
        canPlaceBarrier: runnerSpec.canPlaceBarrier ?? false
      });
    });
  }
  return facts.sort((left, right) =>
    left.teamId - right.teamId || left.runnerIndex - right.runnerIndex || left.slot.localeCompare(right.slot)
  );
}

function getToolboxFamily(blockType) {
  if (blockType === BLOCK_TYPES.ON_EACH_TURN) {
    return "event";
  }
  if (ACTION_BLOCK_TYPES.has(blockType)) {
    return "action";
  }
  if (String(blockType).startsWith("battlegorithms_if_")) {
    return "condition";
  }
  if (String(blockType).startsWith("battlegorithms_boolean_") || String(blockType).startsWith("battlegorithms_logic_")) {
    return "boolean/logic";
  }
  if (String(blockType).startsWith("battlegorithms_value_")) {
    return "value";
  }
  return "advanced";
}

function buildToolboxFacts(level) {
  const blockTypes = Array.isArray(level.toolboxBlockTypes) ? [...level.toolboxBlockTypes] : [];
  const byFamily = new Map();
  for (const blockType of blockTypes) {
    const family = getToolboxFamily(blockType);
    if (!byFamily.has(family)) {
      byFamily.set(family, []);
    }
    byFamily.get(family).push({
      blockType,
      label: getBlockDisplayLabel(blockType)
    });
  }

  for (const items of byFamily.values()) {
    items.sort((left, right) => left.label.localeCompare(right.label) || left.blockType.localeCompare(right.blockType));
  }

  return {
    blockTypes,
    byFamily: [...byFamily.entries()].sort(([left], [right]) => left.localeCompare(right))
  };
}

function summarizeXmlSource(level, sourceKind, xmlText, label, pathOrNull) {
  const metrics = extractBlocklyXmlMetrics(xmlText);
  return {
    kind: sourceKind,
    label,
    path: pathOrNull ? toRepoRelative(pathOrNull) : null,
    present: Boolean(xmlText),
    metrics
  };
}

function aggregateDemoXmlSources(demoSources) {
  if (demoSources.length === 0) {
    return null;
  }

  const totalBlocks = demoSources.reduce((sum, entry) => sum + entry.metrics.totalBlocks, 0);
  const distinctBlockTypes = collectUniqueBlockTypes(
    demoSources.flatMap((entry) => entry.metrics.distinctBlockTypeNames || [])
  );
  const maxNestingDepth = demoSources.reduce((max, entry) => Math.max(max, entry.metrics.maxNestingDepth), 0);
  const actionBlockCount = demoSources.reduce((sum, entry) => sum + entry.metrics.actionBlockCount, 0);
  const conditionBlockCount = demoSources.reduce((sum, entry) => sum + entry.metrics.conditionBlockCount, 0);
  const booleanComparisonValueBlockCount = demoSources.reduce(
    (sum, entry) => sum + entry.metrics.booleanComparisonValueBlockCount,
    0
  );
  const branchDecisionCount = demoSources.reduce((sum, entry) => sum + entry.metrics.branchDecisionCount, 0);
  const runnerIndexUsage = demoSources.reduce((sum, entry) => sum + entry.metrics.runnerIndexUsage, 0);
  const resourceReadinessUsage = demoSources.reduce((sum, entry) => sum + entry.metrics.resourceReadinessUsage, 0);
  const firstActionOnlyRiskMarkers = demoSources.flatMap((entry) => entry.metrics.firstActionOnlyRiskMarkers);

  return {
    totalBlocks,
    distinctBlockTypes: distinctBlockTypes.length,
    distinctBlockTypeNames: distinctBlockTypes,
    actionBlockCount,
    conditionBlockCount,
    booleanComparisonValueBlockCount,
    maxNestingDepth,
    branchDecisionCount,
    runnerIndexUsage,
    resourceReadinessUsage,
    firstActionOnlyRiskMarkers
  };
}

function getReferenceXmlSource(context, level) {
  if (level.project?.id) {
    return null;
  }
  const referenceFixture = context.referenceSolutionsByLevelId.get(level.id) || null;
  if (!referenceFixture) {
    return null;
  }
  return summarizeXmlSource(level, "reference", referenceFixture.xmlText, "Reference solution", referenceFixture.filePath);
}

function getProjectXmlSources(context, level) {
  if (!level.project?.id) {
    return [];
  }
  const projectFixtures = context.projectFixturesById.get(level.project.id) || null;
  const sources = [];
  if (projectFixtures?.stepFixtures?.has(level.project.step)) {
    const fixture = projectFixtures.stepFixtures.get(level.project.step);
    sources.push(
      summarizeXmlSource(level, "project-step", fixture.xmlText, `Project step fixture ${level.project.step}`, fixture.filePath)
    );
  }
  if (projectFixtures?.finalFixture) {
    sources.push(
      summarizeXmlSource(level, "project-final", projectFixtures.finalFixture.xmlText, "Project final fixture", projectFixtures.finalFixture.filePath)
    );
  }
  return sources;
}

function getStarterXmlSource(level) {
  if (typeof level.initialBlocklyXml !== "string" || !level.initialBlocklyXml.trim()) {
    return null;
  }
  return summarizeXmlSource(level, "starter", level.initialBlocklyXml, "Starter XML", level.sourcePath || null);
}

function getDemoXmlSources(level) {
  const tutorialSteps = Array.isArray(level.tutorialSteps) ? level.tutorialSteps : [];
  const sources = [];
  tutorialSteps.forEach((step, index) => {
    if (typeof step.demoBlocklyXml !== "string" || !step.demoBlocklyXml.trim()) {
      return;
    }
    sources.push(
      summarizeXmlSource(
        level,
        "demo",
        step.demoBlocklyXml,
        `Tutorial step ${index + 1}${step.title ? `: ${step.title}` : ""}`,
        level.sourcePath || null
      )
    );
  });
  return sources;
}

function summarizeFlags(level) {
  const flagFacts = getFlagFacts(level);
  if (flagFacts.length === 0) {
    return "not found";
  }
  return flagFacts
    .map((flag) => {
      const carried = flag.carriedByRunnerId ? ` carried by ${flag.carriedByRunnerId}` : "";
      return `${flag.role}: (${flag.x}, ${flag.y})${carried}`;
    })
    .join("; ");
}

function summarizeBarriers(level) {
  const barriers = getBarrierFacts(level);
  if (barriers.length === 0) {
    return "none";
  }
  return barriers
    .map((barrier) => {
      const owner = barrier.ownerRunnerId ? ` owner ${barrier.ownerRunnerId}` : "";
      return `(${barrier.x}, ${barrier.y})${owner}`;
    })
    .join("; ");
}

function summarizeRunMode(level) {
  if (level.project?.id) {
    return `project ${level.project.id}`;
  }
  if (level.levelKind === "prediction") {
    return "prediction checkpoint";
  }
  if (level.levelKind === "bug_hunt") {
    return "bug hunt";
  }
  if (level.levelKind === "challenge") {
    return "challenge";
  }
  if (level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT) {
    return "human input";
  }
  if (String(level.id || "").startsWith("optional-")) {
    return "optional lab";
  }
  return "ordinary";
}

function summarizeNpcPresence(level) {
  const opponentRunners = Array.isArray(level.setup?.teams?.opponent?.runners)
    ? level.setup.teams.opponent.runners
    : [];
  const liveOpponents = opponentRunners.filter((runner) => !runner.isFrozen).length;
  const npcOpponents = opponentRunners.filter((runner) => runner.isNPC).length;
  if (opponentRunners.length === 0) {
    return "none";
  }
  return `npc ${npcOpponents}; live ${liveOpponents}`;
}

function buildObjectiveFacts(level) {
  const winCondition = level.winCondition || {};
  if (winCondition.type === "runner_reaches_cell") {
    return `runner ${winCondition.runnerId || "not found"} reaches (${winCondition.targetCell?.x ?? "not found"}, ${winCondition.targetCell?.y ?? "not found"})`;
  }
  if (winCondition.type === "runner_reaches_enemy_flag") {
    const enemyTeamRole = String(winCondition.runnerId || "").includes("_1_") ? "opponent" : "player";
    const enemyFlag = level.setup?.flags?.[enemyTeamRole] || null;
    return enemyFlag
      ? `runner ${winCondition.runnerId || "not found"} reaches enemy flag at (${enemyFlag.gridX ?? "not found"}, ${enemyFlag.gridY ?? "not found"})`
      : `runner ${winCondition.runnerId || "not found"} reaches enemy flag (position not found)`;
  }
  if (winCondition.type === "team_scores_point") {
    return `team ${winCondition.teamId ?? "not found"} scores a point${winCondition.runnerId ? ` with ${winCondition.runnerId}` : ""}`;
  }
  return "not found";
}

function buildConceptRowFacts(level, conceptMatrixRow) {
  if (!conceptMatrixRow) {
    return {
      focus: "not found",
      newVocabulary: "not found",
      newBlockly: "not found",
      assumes: "not found"
    };
  }
  return {
    focus: conceptMatrixRow.focus || "not found",
    newVocabulary: conceptMatrixRow.newVocabulary || "not found",
    newBlockly: conceptMatrixRow.newBlockly || "not found",
    assumes: conceptMatrixRow.assumes || "not found"
  };
}

function buildValidationPointers(level, context) {
  const pointers = [
    {
      label: "Readiness command",
      command: `npm run level:readiness -- --level ${level.id} --json`
    },
    {
      label: "Linter command",
      command: "npm run lint:levels"
    }
  ];

  if (level.project?.id) {
    const projectFixtures = context.projectFixturesById.get(level.project.id) || null;
    if (projectFixtures?.stepFixtures?.has(level.project.step)) {
      pointers.push({
        label: "Project step fixture",
        command: toRepoRelative(projectFixtures.stepFixtures.get(level.project.step).filePath)
      });
    }
    if (projectFixtures?.finalFixture) {
      pointers.push({
        label: "Project final fixture",
        command: toRepoRelative(projectFixtures.finalFixture.filePath)
      });
    }
  } else {
    const referenceFixture = context.referenceSolutionsByLevelId.get(level.id) || null;
    if (referenceFixture?.filePath) {
      pointers.push({
        label: "Reference fixture",
        command: toRepoRelative(referenceFixture.filePath)
      });
    }
  }

  return pointers;
}

function buildLevelDossierData(level, context) {
  const manifestEntry = getLevelManifestEntry(level.id);
  const conceptMatrixRow = context.conceptMatrixRows.find(
    (row) => normalizeText(row.levelLabel) === expectedMatrixLabelFromTitle(level.title)
  ) || null;
  const starterXml = getStarterXmlSource(level);
  const demoXmlSources = getDemoXmlSources(level);
  const referenceXml = getReferenceXmlSource(context, level);
  const projectXmlSources = getProjectXmlSources(context, level);
  const projectStepXmlSource = projectXmlSources.find((source) => source.kind === "project-step") || null;
  const projectFinalXmlSource = projectXmlSources.find((source) => source.kind === "project-final") || null;
  const summaryXmlSource = referenceXml || projectStepXmlSource || starterXml || demoXmlSources[0] || null;
  const starterMetrics = starterXml?.metrics || null;
  const demoMetrics = aggregateDemoXmlSources(demoXmlSources);
  const solutionMetrics = summaryXmlSource?.metrics || null;
  const referenceMetrics = referenceXml?.metrics || null;
  const projectStepMetrics = projectStepXmlSource?.metrics || null;
  const projectFinalMetrics = projectFinalXmlSource?.metrics || null;
  const category = getLevelCategory(level);
  const conceptFacts = buildConceptRowFacts(level, conceptMatrixRow);
  const toolboxFacts = buildToolboxFacts(level);
  const mapKey = level.mapKey || "not found";
  const dimensions = getMapDimensions(level.mapKey);
  const baseCells = {
    team1: getMapCellCoords(level.mapKey, CELL_TYPE.TEAM1_BASE),
    team2: getMapCellCoords(level.mapKey, CELL_TYPE.TEAM2_BASE)
  };
  const terrainFacts = getTerrainFacts(level.mapKey);
  const goalCell = getGoalCell(level);

  return {
    order: manifestEntry?.order ?? null,
    id: level.id,
    title: level.title,
    category,
    levelKind: level.levelKind || null,
    mode: level.mode || null,
    humanTurnBehavior: level.humanTurnBehavior || null,
    project: level.project ? structuredClone(level.project) : null,
    sourcePath: level.sourcePath || "not found",
    phase: getPhaseFromSourcePath(level.sourcePath),
    manifestEntry,
    conceptMatrixRow,
    conceptFacts,
    signals: {
      challenge: level.levelKind === "challenge",
      prediction: level.levelKind === "prediction",
      bugHunt: level.levelKind === "bug_hunt",
      projectId: level.project?.id || null,
      optionalLab: category === "optional lab",
      humanInput: level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT,
      demoBlockly: demoXmlSources.length > 0,
      referenceXml: Boolean(referenceXml),
      projectFixtures: projectXmlSources.length > 0
    },
    copy: {
      description: level.description || "not found",
      introText: level.introText || "not found",
      tips: Array.isArray(level.tips) && level.tips.length > 0 ? [...level.tips] : [],
      tutorialSteps: Array.isArray(level.tutorialSteps)
        ? level.tutorialSteps.map((step, index) => ({
            index: index + 1,
            id: step.id || "not found",
            title: step.title || "not found",
            body: step.body || "not found",
            hasDemoBlocklyXml: Boolean(step.demoBlocklyXml)
          }))
        : []
    },
    board: {
      mapKey,
      mapLabel: getMapLabel(level.mapKey),
      dimensions,
      rows: dimensions.rows,
      cols: dimensions.cols,
      baseCells,
      terrainFacts,
      goalCell,
      flagFacts: getFlagFacts(level),
      barrierFacts: getBarrierFacts(level),
      winCondition: level.winCondition || null,
      objectiveFacts: buildObjectiveFacts(level)
    },
    runners: getRunnerFacts(level),
    toolbox: toolboxFacts,
    npcPresence: summarizeNpcPresence(level),
    xmlSources: {
      starter: starterXml,
      demos: demoXmlSources,
      reference: referenceXml,
      project: projectXmlSources
    },
    xmlSummary: {
      starterBlockCount: starterMetrics?.totalBlocks ?? null,
      demoBlockCount: demoMetrics?.totalBlocks ?? null,
      solutionBlockCount: solutionMetrics?.totalBlocks ?? null,
      solutionDistinctBlockTypes: solutionMetrics?.distinctBlockTypes ?? null,
      solutionDecisionPointCount: solutionMetrics?.branchDecisionCount ?? null,
      projectStepBlockCount: projectStepMetrics?.totalBlocks ?? null,
      projectStepDistinctBlockTypes: projectStepMetrics?.distinctBlockTypes ?? null,
      projectStepDecisionPointCount: projectStepMetrics?.branchDecisionCount ?? null,
      projectFinalBlockCount: projectFinalMetrics?.totalBlocks ?? null,
      projectFinalDistinctBlockTypes: projectFinalMetrics?.distinctBlockTypes ?? null,
      projectFinalDecisionPointCount: projectFinalMetrics?.branchDecisionPointCount ?? projectFinalMetrics?.branchDecisionCount ?? null,
      referenceBlockCount: referenceMetrics?.totalBlocks ?? null,
      referenceDistinctBlockTypes: referenceMetrics?.distinctBlockTypes ?? null,
      decisionPointCount: solutionMetrics?.branchDecisionCount ?? null
    },
    xmlMetrics: {
      starter: starterMetrics,
      demo: demoMetrics,
      reference: referenceMetrics,
      solution: solutionMetrics,
      projectStep: projectStepMetrics,
      projectFinal: projectFinalMetrics
    },
    validationPointers: buildValidationPointers(level, context),
    factsOnly: buildFactsOnly(level, {
      conceptMatrixRow,
      starterXml,
      demoXmlSources,
      referenceXml,
      projectXmlSources,
      toolboxFacts
    })
  };
}

function buildFactsOnly(level, data) {
  const facts = [];
  if (level.project?.id) {
    facts.push(`shared workspace project ${level.project.id} step ${level.project.step}`);
  }
  if (level.levelKind === "prediction") {
    facts.push("prediction checkpoint");
  }
  if (level.levelKind === "bug_hunt") {
    facts.push("bug hunt checkpoint");
  }
  if (String(level.id || "").startsWith("optional-")) {
    facts.push("optional lab");
  }
  if (data.conceptMatrixRow) {
    facts.push(`concept focus present: ${data.conceptMatrixRow.focus || "not found"}`);
  }
  if (data.starterXml?.metrics) {
    facts.push(`starter XML contains ${data.starterXml.metrics.totalBlocks} blocks`);
  }
  if (data.demoXmlSources.length > 0) {
    facts.push(`demo XML present in ${data.demoXmlSources.length} tutorial step${data.demoXmlSources.length === 1 ? "" : "s"}`);
  }
  if (data.referenceXml?.metrics) {
    facts.push(`reference XML contains ${data.referenceXml.metrics.totalBlocks} blocks`);
  }
  if (data.projectXmlSources.length > 0) {
    facts.push(`project fixture XML present (${data.projectXmlSources.length} file${data.projectXmlSources.length === 1 ? "" : "s"})`);
  }
  if (data.toolboxFacts.blockTypes.length > 0) {
    facts.push(`toolbox exposes ${data.toolboxFacts.blockTypes.length} authored block type${data.toolboxFacts.blockTypes.length === 1 ? "" : "s"}`);
  }
  return facts;
}

function formatMetricsList(metrics) {
  if (!metrics) {
    return "not found";
  }
  const parts = [
    `blocks ${metrics.totalBlocks}`,
    `distinct types ${metrics.distinctBlockTypes}`,
    `actions ${metrics.actionBlockCount}`,
    `conditions ${metrics.conditionBlockCount}`,
    `boolean/comparison/value ${metrics.booleanComparisonValueBlockCount}`,
    `max depth ${metrics.maxNestingDepth}`,
    `decision points ${metrics.branchDecisionCount}`,
    `runner index ${metrics.runnerIndexUsage}`,
    `resource readiness ${metrics.resourceReadinessUsage}`
  ];
  return parts.join("; ");
}

function formatBlockTypeSamples(metrics) {
  if (!metrics || metrics.distinctBlockTypeNames.length === 0) {
    return "not found";
  }
  const sample = metrics.distinctBlockTypeNames.slice(0, 8).map((blockType) => inlineCode(blockType));
  const suffix = metrics.distinctBlockTypeNames.length > sample.length ? ", ..." : "";
  return `${metrics.distinctBlockTypeNames.length} types: ${sample.join(", ")}${suffix}`;
}

function renderKeyValueList(entries, indent = "") {
  return entries
    .map(([label, value]) => `${indent}- ${label}: ${value}`)
    .join("\n");
}

function renderXmlSourceSection(title, source, metrics) {
  const lines = [];
  lines.push(`### ${title}`);
  if (!source) {
    lines.push("- status: not found");
    return lines;
  }
  lines.push(`- source: ${source.path ? inlineCode(source.path) : "inline in source"}`);
  lines.push(`- present: ${source.present ? "yes" : "no"}`);
  lines.push(`- metrics: ${formatMetricsList(metrics)}`);
  lines.push(`- distinct block types: ${formatBlockTypeSamples(metrics)}`);
  if (metrics?.firstActionOnlyRiskMarkers?.length > 0) {
    lines.push("- first-action-only risk markers:");
    for (const marker of metrics.firstActionOnlyRiskMarkers) {
      lines.push(`  - ${marker}`);
    }
  } else {
    lines.push("- first-action-only risk markers: none found");
  }
  return lines;
}

function renderDemoSourceSection(demoSources, demoMetrics) {
  const lines = [];
  lines.push("### Demo XML");
  if (demoSources.length === 0) {
    lines.push("- status: not found");
    return lines;
  }

  lines.push(`- tutorial steps with demo Blockly: ${demoSources.length}`);
  lines.push(`- aggregate metrics: ${formatMetricsList(demoMetrics)}`);
  lines.push(`- aggregate distinct block types: ${formatBlockTypeSamples(demoMetrics)}`);
  demoSources.forEach((source, index) => {
    lines.push(`- demo ${index + 1}: ${source.label}`);
    lines.push(`  - source: ${source.path ? inlineCode(source.path) : "inline in source"}`);
    lines.push(`  - metrics: ${formatMetricsList(source.metrics)}`);
    lines.push(`  - distinct block types: ${formatBlockTypeSamples(source.metrics)}`);
  });
  return lines;
}

function renderProjectSourceSection(projectSources) {
  const lines = [];
  lines.push("### Project XML Fixtures");
  if (projectSources.length === 0) {
    lines.push("- status: not applicable");
    return lines;
  }
  for (const source of projectSources) {
    lines.push(`- ${source.label}: ${source.path ? inlineCode(source.path) : "inline in source"}`);
    lines.push(`  - metrics: ${formatMetricsList(source.metrics)}`);
    lines.push(`  - distinct block types: ${formatBlockTypeSamples(source.metrics)}`);
  }
  return lines;
}

function renderToolboxSection(toolbox) {
  const lines = [];
  lines.push("## Toolbox Facts");
  if (toolbox.blockTypes.length === 0) {
    lines.push("- status: not found");
    return lines;
  }

  lines.push(`- authored toolbox block types: ${toolbox.blockTypes.length}`);
  for (const [family, items] of toolbox.byFamily) {
    lines.push(`- ${family}: ${items.length}`);
    for (const item of items) {
      lines.push(`  - ${item.label} (${inlineCode(item.blockType)})`);
    }
  }
  return lines;
}

function renderBoardSection(dossier) {
  const lines = [];
  lines.push("## Board / Setup Facts");
  lines.push(`- map key: ${inlineCode(dossier.board.mapKey)}`);
  lines.push(`- map label: ${dossier.board.mapLabel}`);
  lines.push(`- dimensions: ${dossier.board.cols} x ${dossier.board.rows}`);
  lines.push(`- win condition: ${dossier.board.winCondition ? JSON.stringify(dossier.board.winCondition) : "not found"}`);
  lines.push(`- objective: ${dossier.board.objectiveFacts}`);
  lines.push(`- team 1 base cells: ${dossier.board.baseCells.team1.length > 0 ? dossier.board.baseCells.team1.map((cell) => `(${cell.x}, ${cell.y})`).join(", ") : "not found"}`);
  lines.push(`- team 2 base cells: ${dossier.board.baseCells.team2.length > 0 ? dossier.board.baseCells.team2.map((cell) => `(${cell.x}, ${cell.y})`).join(", ") : "not found"}`);
  lines.push(`- goal cell: ${dossier.board.goalCell ? `(${dossier.board.goalCell.x}, ${dossier.board.goalCell.y})` : "not found"}`);
  lines.push(`- wall cells: ${formatCoordinateList(dossier.board.terrainFacts.wallCells)}`);
  lines.push(`- jail cells: ${formatCoordinateList(dossier.board.terrainFacts.jailCells)}`);
  lines.push(`- flags: ${summarizeFlags({ setup: { flags: Object.fromEntries(dossier.board.flagFacts.map((flag) => [flag.role, flag])) } })}`);
  lines.push(`- barriers: ${summarizeBarriers({ setup: { barriers: dossier.board.barrierFacts } })}`);
  return lines;
}

function renderRunnerSection(runners) {
  const lines = [];
  lines.push("## Runner Facts");
  if (runners.length === 0) {
    lines.push("- status: not found");
    return lines;
  }

  for (const runner of runners) {
    lines.push(
      `- ${runner.role} runner ${runner.runnerIndex} (${runner.runnerId}) slot ${runner.slotLabel} at (${runner.x}, ${runner.y}); control ${runner.control}; frozen ${runner.frozen ? "yes" : "no"}; enemy flag ${runner.hasEnemyFlag ? "yes" : "no"}`
    );
    lines.push(
      `  - play direction: ${runner.playDirection}; home side: ${runner.homeSide}; can jump: ${runner.canJump ? "yes" : "no"}; can place barrier: ${runner.canPlaceBarrier ? "yes" : "no"}`
    );
    if (runner.npcBehavior || runner.cpuRole) {
      lines.push(
        `  - cpu behavior: ${runner.npcBehavior || "not found"}${runner.cpuRole ? `; cpu role: ${runner.cpuRole}` : ""}`
      );
    }
    if (runner.frozenTurnsRemaining !== null) {
      lines.push(`  - frozen turns remaining: ${runner.frozenTurnsRemaining}`);
    }
  }
  return lines;
}

function renderCopySection(copy) {
  const lines = [];
  lines.push("## Lesson Copy");
  lines.push(`- objective: ${copy.description}`);
  lines.push(`- intro: ${copy.introText}`);
  if (copy.tips.length > 0) {
    lines.push("- tips:");
    for (const tip of copy.tips) {
      lines.push(`  - ${tip}`);
    }
  } else {
    lines.push("- tips: not found");
  }
  if (copy.tutorialSteps.length > 0) {
    lines.push("- tutorial steps:");
    for (const step of copy.tutorialSteps) {
      lines.push(`  - ${step.index}. ${step.title} (${step.id})`);
      lines.push(`    - body: ${step.body}`);
      lines.push(`    - demo Blockly: ${step.hasDemoBlocklyXml ? "present" : "not found"}`);
    }
  } else {
    lines.push("- tutorial steps: not found");
  }
  return lines;
}

function renderSignalsSection(dossier) {
  const lines = [];
  lines.push("## Tags / Signals");
  lines.push(`- category: ${dossier.category}`);
  lines.push(`- run mode: ${summarizeRunMode(dossier)}`);
  lines.push(`- project id: ${dossier.project?.id || "not applicable"}`);
  lines.push(`- challenge: ${dossier.signals.challenge ? "yes" : "no"}`);
  lines.push(`- prediction: ${dossier.signals.prediction ? "yes" : "no"}`);
  lines.push(`- bug hunt: ${dossier.signals.bugHunt ? "yes" : "no"}`);
  lines.push(`- optional lab: ${dossier.signals.optionalLab ? "yes" : "no"}`);
  lines.push(`- human input: ${dossier.signals.humanInput ? "yes" : "no"}`);
  lines.push(`- demo Blockly present: ${dossier.signals.demoBlockly ? "yes" : "no"}`);
  lines.push(`- reference XML present: ${dossier.signals.referenceXml ? "yes" : "no"}`);
  lines.push(`- project fixture XML present: ${dossier.signals.projectFixtures ? "yes" : "no"}`);
  return lines;
}

function renderXmlFactsSection(dossier) {
  const lines = [];
  lines.push("## XML Facts");
  lines.push(...renderXmlSourceSection("Starter XML", dossier.xmlSources.starter, dossier.xmlMetrics.starter));
  lines.push(...renderDemoSourceSection(dossier.xmlSources.demos, dossier.xmlMetrics.demo));
  lines.push(...renderXmlSourceSection("Reference XML", dossier.xmlSources.reference, dossier.xmlMetrics.reference));
  lines.push(...renderProjectSourceSection(dossier.xmlSources.project));
  return lines;
}

function renderFactsOnlySection(factsOnly) {
  const lines = [];
  lines.push("## Facts Only");
  if (factsOnly.length === 0) {
    lines.push("- not found");
    return lines;
  }
  for (const fact of factsOnly) {
    lines.push(`- ${fact}`);
  }
  return lines;
}

function renderValidationSection(dossier) {
  const lines = [];
  lines.push("## Validation Pointers");
  for (const pointer of dossier.validationPointers) {
    lines.push(`- ${pointer.label}: ${pointer.command}`);
  }
  return lines;
}

export function renderGuidedLevelDossierMarkdown(dossier) {
  const lines = [];
  lines.push(`# Guided Level Dossier: ${dossier.title}`);
  lines.push("");
  lines.push("## Level Identity");
  lines.push(`- order: ${dossier.order ?? "not found"}`);
  lines.push(`- id: ${inlineCode(dossier.id)}`);
  lines.push(`- title: ${dossier.title}`);
  lines.push(`- category: ${dossier.category}`);
  lines.push(`- level kind: ${dossier.levelKind || "not found"}`);
  lines.push(`- phase: ${dossier.phase}`);
  lines.push(`- source file: ${inlineCode(dossier.sourcePath)}`);
  lines.push(`- project: ${dossier.project ? inlineCode(`${dossier.project.id} step ${dossier.project.step}`) : "not applicable"}`);
  lines.push("");
  lines.push("## Curriculum Row");
  lines.push(`- focus: ${dossier.conceptFacts.focus}`);
  lines.push(`- new vocabulary: ${dossier.conceptFacts.newVocabulary}`);
  lines.push(`- new Blockly: ${dossier.conceptFacts.newBlockly}`);
  lines.push(`- assumptions: ${dossier.conceptFacts.assumes}`);
  lines.push("");
  lines.push(...renderSignalsSection(dossier));
  lines.push("");
  lines.push(...renderCopySection(dossier.copy));
  lines.push("");
  lines.push(...renderBoardSection(dossier));
  lines.push("");
  lines.push(...renderRunnerSection(dossier.runners));
  lines.push("");
  lines.push(...renderToolboxSection(dossier.toolbox));
  lines.push("");
  lines.push(...renderXmlFactsSection(dossier));
  lines.push("");
  lines.push(...renderFactsOnlySection(dossier.factsOnly));
  lines.push("");
  lines.push(...renderValidationSection(dossier));
  return lines.join("\n");
}

function getSummaryBlockCount(value) {
  return value === null || value === undefined ? "n/a" : String(value);
}

function getSummaryDistinctTypeCount(value) {
  return value === null || value === undefined ? "n/a" : String(value);
}

function getSummaryNpcPresence(dossier) {
  return dossier.npcPresence || "none";
}

export function renderGuidedLevelSummaryIndexMarkdown(dossiers) {
  const lines = [];
  lines.push("# Guided Level Dossier Summary Index");
  lines.push("");
  lines.push("Counts use the primary solution fixture when available; for project levels that means the authored step fixture. Demo counts aggregate authored demo snippets, and project rows also expose step/final fixture complexity.");
  lines.push("");
  lines.push("| order | level id | title | category | project id | concept focus | starter blocks | demo blocks | solution/fixture blocks | solution/fixture distinct block types | solution/fixture decision points | project step blocks | project final blocks | NPC/live enemy presence | dossier link | behavior evidence link |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const dossier of dossiers) {
    const dossierLink = dossier.dossierRelativePath || `level-dossiers/${padOrder(dossier.order)}-${slugify(dossier.id)}.md`;
    const behaviorLink = `behavior-evidence/${padOrder(dossier.order)}-${slugify(dossier.id)}.md`;
    lines.push(
      `| ${dossier.order ?? "n/a"} | ${inlineCode(dossier.id)} | ${escapeMarkdown(dossier.title)} | ${escapeMarkdown(dossier.category)} | ${escapeMarkdown(dossier.project?.id || "n/a")} | ${escapeMarkdown(dossier.conceptFacts.focus)} | ${getSummaryBlockCount(dossier.xmlSummary.starterBlockCount)} | ${getSummaryBlockCount(dossier.xmlSummary.demoBlockCount)} | ${getSummaryBlockCount(dossier.xmlSummary.solutionBlockCount)} | ${getSummaryDistinctTypeCount(dossier.xmlSummary.solutionDistinctBlockTypes)} | ${getSummaryBlockCount(dossier.xmlSummary.solutionDecisionPointCount)} | ${getSummaryBlockCount(dossier.xmlSummary.projectStepBlockCount)} | ${getSummaryBlockCount(dossier.xmlSummary.projectFinalBlockCount)} | ${escapeMarkdown(dossier.npcPresence || getSummaryNpcPresence(dossier))} | [dossier](${escapeMarkdown(dossierLink)}) | [behavior](${escapeMarkdown(behaviorLink)}) |`
    );
  }
  return lines.join("\n");
}

export async function buildGuidedLevelDossierData() {
  const context = await loadLevelReadinessContext();
  const dossiers = context.levels.map((level) => buildLevelDossierData(level, context));
  dossiers.sort((left, right) => left.order - right.order || left.id.localeCompare(right.id));
  for (const dossier of dossiers) {
    dossier.dossierRelativePath = `level-dossiers/${padOrder(dossier.order)}-${slugify(dossier.id)}.md`;
  }
  return { context, dossiers };
}

export async function generateGuidedLevelDossiers({
  outputDir = GUIDED_LEVEL_DOSSIER_OUTPUT_DIR
} = {}) {
  const { dossiers } = await buildGuidedLevelDossierData();
  const levelDossierDir = path.join(outputDir, "level-dossiers");
  await fs.rm(levelDossierDir, { recursive: true, force: true });
  await fs.mkdir(levelDossierDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  const writtenFiles = [];
  for (const dossier of dossiers) {
    const fileName = `${padOrder(dossier.order)}-${slugify(dossier.id)}.md`;
    const absolutePath = path.join(levelDossierDir, fileName);
    dossier.dossierRelativePath = `level-dossiers/${fileName}`;
    const markdown = renderGuidedLevelDossierMarkdown(dossier);
    await fs.writeFile(absolutePath, `${markdown}\n`, "utf8");
    writtenFiles.push({
      levelId: dossier.id,
      path: absolutePath,
      relativePath: toRepoRelative(absolutePath)
    });
  }

  const summaryIndexPath = path.join(outputDir, "summary-index.md");
  const summaryMarkdown = renderGuidedLevelSummaryIndexMarkdown(dossiers);
  await fs.writeFile(summaryIndexPath, `${summaryMarkdown}\n`, "utf8");

  return {
    outputDir,
    levelDossierDir,
    summaryIndexPath,
    dossiers,
    writtenFiles
  };
}
