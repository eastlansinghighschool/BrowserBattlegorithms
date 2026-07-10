import { BOARD_DYNAMICS_TIERS, CELL_TYPE, HUMAN_TURN_BEHAVIORS, MAPS, MECHANIC_NECESSITY, NPC_BEHAVIORS } from "../config/constants.js";
import { deriveHomeSideFromPlayDirection, getDefaultSlotPosition, getRunnerSlotMetadata } from "../core/teams.js";
import {
  STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS,
  TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS
} from "../config/levels/shared/projectToolboxes.js";

const CONCEPT_MATRIX_PATH = "docs/GUIDED_LEVEL_CONCEPT_MATRIX.md";
const DEFAULT_MIN_TURN_LIMIT = 8;

const SEVERITIES = {
  ERROR: "error",
  WARNING: "warning"
};

const DIRECTED_SENSOR_RELATIONS = new Set([
  "DIRECTLY_IN_FRONT",
  "DIRECTLY_BEHIND",
  "DIRECTLY_ABOVE",
  "DIRECTLY_BELOW",
  "ANYWHERE_FORWARD",
  "ANYWHERE_BEHIND",
  "ANYWHERE_ABOVE",
  "ANYWHERE_BELOW"
]);

const SENSOR_RELATION_PAIR_REQUIREMENTS = [
  {
    name: "directed",
    horizontal: ["DIRECTLY_IN_FRONT", "DIRECTLY_BEHIND"],
    vertical: ["DIRECTLY_ABOVE", "DIRECTLY_BELOW"]
  },
  {
    name: "anywhere",
    horizontal: ["ANYWHERE_FORWARD", "ANYWHERE_BEHIND"],
    vertical: ["ANYWHERE_ABOVE", "ANYWHERE_BELOW"]
  }
];

function normalizeText(value) {
  return String(value || "")
    .replace(/\r?\n/g, " ")
    .replace(/[`\[\]*_]/g, "")
    .replace(/[:|]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeConceptMatrixLabel(levelLabel, focusLabel) {
  return normalizeText(`${levelLabel} ${focusLabel}`).replace(/^level\s+/, "");
}

function normalizeLevelTitle(title) {
  return normalizeText(title).replace(/^level\s+/, "");
}

function normalizeMatrixLevelLabel(label) {
  return normalizeText(label);
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

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function getFailureConditions(level) {
  if (Array.isArray(level.failureConditions) && level.failureConditions.length > 0) {
    return level.failureConditions;
  }
  return level.failureCondition ? [level.failureCondition] : [];
}

function getRoleFromTeamId(teamId) {
  return Number(teamId) === 1 ? "player" : "opponent";
}

function getTeamIdFromRole(role) {
  return role === "player" ? 1 : 2;
}

function normalizeToolboxBlockTypes(blockTypes = []) {
  return uniqueSorted(
    blockTypes.filter((blockType) => blockType && blockType !== "battlegorithms_on_each_turn")
  );
}

function parseXmlBlockTypes(xmlText) {
  const blockTypes = [];
  const regex = /<block\b[^>]*\btype="([^"]+)"/g;
  for (const match of String(xmlText || "").matchAll(regex)) {
    blockTypes.push(match[1]);
  }
  return blockTypes;
}

function parseXmlFieldValues(xmlText, fieldName) {
  const values = [];
  const regex = new RegExp(`<field\\s+name="${fieldName}">([^<]+)</field>`, "g");
  for (const match of String(xmlText || "").matchAll(regex)) {
    values.push(match[1]);
  }
  return values;
}

function normalizeXmlForComparison(xmlText) {
  return String(xmlText || "")
    .replace(/\s+(x|y)="[^"]*"/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
}

function makeDiagnostic({ severity, levelId, contract, message, file }) {
  return { severity, levelId, contract, message, file: file || null };
}

function buildRunnerIndex(level) {
  const runnerIndex = new Map();
  const teamEntries = Object.entries(level.setup?.teams || {});

  for (const [role, teamSetup] of teamEntries) {
    const teamId = getTeamIdFromRole(role);
    for (const runnerSpec of teamSetup?.runners || []) {
      const slotMetadata = getRunnerSlotMetadata(teamId, runnerSpec.slot);
      const idSuffix = runnerSpec.idSuffix || slotMetadata.idSuffix;
      runnerIndex.set(`runner_${teamId}_${idSuffix}`, {
        teamId,
        role,
        runnerSpec,
        slotMetadata
      });
    }
  }

  return runnerIndex;
}

function getBaseAreaCellSet(level, teamId) {
  const map = MAPS[level.mapKey];
  const role = getRoleFromTeamId(teamId);
  const teamSetup = level.setup?.teams?.[role] || null;
  const homeSide = teamSetup?.homeSide || deriveHomeSideFromPlayDirection(teamSetup?.playDirection);
  const baseCellType = teamSetup?.baseCellType ?? (homeSide === "left" ? CELL_TYPE.TEAM1_BASE : CELL_TYPE.TEAM2_BASE);

  if (!map || baseCellType === undefined || baseCellType === null) {
    return new Set();
  }

  const cells = new Set();
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === baseCellType) {
        cells.add(`${x},${y}`);
      }
    }
  }
  return cells;
}

function resolveRunnerPosition(teamSetup, runnerSpec) {
  const homeSide = teamSetup?.homeSide || deriveHomeSideFromPlayDirection(teamSetup?.playDirection);
  const defaultPosition = getDefaultSlotPosition(homeSide, runnerSpec.slot);
  return {
    x: runnerSpec.gridX ?? defaultPosition.gridX,
    y: runnerSpec.gridY ?? defaultPosition.gridY
  };
}

function getLevelRef(level, referenceSolutionsByLevelId) {
  return referenceSolutionsByLevelId.get(level.id) || null;
}

function getStarterXml(level) {
  return typeof level.initialBlocklyXml === "string" ? level.initialBlocklyXml : "";
}

function getProjectToolboxPolicy(level) {
  if (level.project?.id === "strategy-brain") {
    return new Set(STRATEGY_BRAIN_PROJECT_TOOLBOX_BLOCKS);
  }
  if (level.project?.id === "team-strategy-script") {
    return new Set(TEAM_STRATEGY_SCRIPT_PROJECT_TOOLBOX_BLOCKS);
  }
  return null;
}

export function checkConceptMatrixAgreement(levels, conceptMatrix) {
  const diagnostics = [];
  const normalizedLevels = levels.map((level) => expectedMatrixLabelFromTitle(level.title));
  const normalizedMatrix = conceptMatrix.map((row) => normalizeMatrixLevelLabel(row.levelLabel));

  if (normalizedLevels.length !== normalizedMatrix.length) {
    diagnostics.push(
      makeDiagnostic({
        severity: SEVERITIES.ERROR,
        levelId: "campaign",
        contract: "concept-matrix-agreement",
        message: `campaign has ${normalizedLevels.length} levels but concept matrix has ${normalizedMatrix.length} rows`,
        file: CONCEPT_MATRIX_PATH
      })
    );
  }

  for (let index = 0; index < Math.min(normalizedLevels.length, normalizedMatrix.length); index += 1) {
    if (normalizedLevels[index] !== normalizedMatrix[index]) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: levels[index]?.id || `row-${index + 1}`,
          contract: "concept-matrix-agreement",
          message: `campaign order/title "${levels[index]?.title || "(missing)"}" does not match matrix row "${conceptMatrix[index]?.levelLabel}"`,
          file: levels[index]?.sourcePath || CONCEPT_MATRIX_PATH
        })
      );
    }
  }

  for (const level of levels) {
    const row = conceptMatrix.find((entry) => normalizeMatrixLevelLabel(entry.levelLabel) === expectedMatrixLabelFromTitle(level.title));
    if (!row) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "concept-matrix-agreement",
          message: "level is missing from the concept matrix",
          file: level.sourcePath || CONCEPT_MATRIX_PATH
        })
      );
    }
  }

  for (const row of conceptMatrix) {
    const rowKey = normalizeMatrixLevelLabel(row.levelLabel);
    const matches = levels.filter((level) => expectedMatrixLabelFromTitle(level.title) === rowKey);
    if (matches.length === 0) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: row.levelLabel,
          contract: "concept-matrix-agreement",
          message: "concept matrix row does not match any campaign level",
          file: CONCEPT_MATRIX_PATH
        })
      );
    }
  }

  return diagnostics;
}

export function checkReferenceSolutionToolboxCompatibility(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];

  for (const level of levels) {
    const ref = getLevelRef(level, referenceSolutionsByLevelId);
    if (!ref) {
      continue;
    }

    const usedBlocks = uniqueSorted(
      parseXmlBlockTypes(ref.xmlText).filter((blockType) => blockType !== "battlegorithms_on_each_turn")
    );
    const toolbox = new Set(level.toolboxBlockTypes || []);
    for (const blockType of usedBlocks) {
      if (!toolbox.has(blockType)) {
        diagnostics.push(
          makeDiagnostic({
            severity: SEVERITIES.ERROR,
            levelId: level.id,
            contract: "reference-solution-toolbox-compatibility",
            message: `block "${blockType}" missing from toolbox`,
            file: ref.filePath || level.sourcePath || null
          })
        );
      }
    }
  }

  return diagnostics;
}

export function checkDemoBlocklyDoesNotSolveLevel(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];

  for (const level of levels) {
    const ref = getLevelRef(level, referenceSolutionsByLevelId);
    if (!ref) {
      continue;
    }

    for (const step of level.tutorialSteps || []) {
      if (!step.demoBlocklyXml) {
        continue;
      }
      if (normalizeXmlForComparison(step.demoBlocklyXml) === normalizeXmlForComparison(ref.xmlText)) {
        diagnostics.push(
          makeDiagnostic({
            severity: SEVERITIES.ERROR,
            levelId: level.id,
            contract: "demo-does-not-solve-level",
            message: `demo Blockly XML matches the reference solution for tutorial step "${step.id}"`,
            file: level.sourcePath || ref.filePath || null
          })
        );
      }
    }
  }

  return diagnostics;
}

function checkCumulativeNoNewBlock(levels, { targetLevelKinds, contract, severity }) {
  const diagnostics = [];
  const introducedBlockTypes = new Set();

  for (const level of levels) {
    const currentToolbox = normalizeToolboxBlockTypes(level.toolboxBlockTypes);
    if (targetLevelKinds.has(level.levelKind)) {
      for (const blockType of currentToolbox) {
        if (!introducedBlockTypes.has(blockType)) {
          diagnostics.push(
            makeDiagnostic({
              severity,
              levelId: level.id,
              contract,
              message: `block "${blockType}" is first seen here`,
              file: level.sourcePath || null
            })
          );
        }
      }
    }

    for (const blockType of currentToolbox) {
      introducedBlockTypes.add(blockType);
    }
  }

  return diagnostics;
}

export function checkChallengeLevelsIntroduceNoNewBlock(levels) {
  return checkCumulativeNoNewBlock(levels, {
    targetLevelKinds: new Set(["challenge"]),
    contract: "challenge-introduces-no-new-block",
    severity: SEVERITIES.WARNING
  });
}

export function checkBugHuntLevelsIntroduceNoNewBlock(levels) {
  return checkCumulativeNoNewBlock(levels, {
    targetLevelKinds: new Set(["bug_hunt"]),
    contract: "bug-hunt-introduces-no-new-block",
    severity: SEVERITIES.WARNING
  });
}

export function checkBugHuntHasBrokenStarter(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];

  for (const level of levels) {
    if (level.levelKind !== "bug_hunt") {
      continue;
    }

    const starterXml = getStarterXml(level);
    const ref = getLevelRef(level, referenceSolutionsByLevelId);
    if (!starterXml.trim()) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "bug-hunt-has-broken-starter",
          message: "bug hunt starter XML is missing or empty",
          file: level.sourcePath || null
        })
      );
      continue;
    }

    if (ref && normalizeXmlForComparison(starterXml) === normalizeXmlForComparison(ref.xmlText)) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "bug-hunt-has-broken-starter",
          message: "bug hunt starter XML matches the reference solution",
          file: level.sourcePath || ref.filePath || null
        })
      );
    }
  }

  return diagnostics;
}

export function checkBugHuntHasReferenceSolution(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];

  for (const level of levels) {
    if (level.levelKind !== "bug_hunt") {
      continue;
    }

    const ref = getLevelRef(level, referenceSolutionsByLevelId);
    if (!ref || !ref.xmlText || !String(ref.xmlText).trim()) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "bug-hunt-has-reference-solution",
          message: "bug hunt reference solution XML is missing or empty",
          file: level.sourcePath || ref?.filePath || null
        })
      );
    }
  }

  return diagnostics;
}

// Detects malformed Blockly XML where a <next> element appears as a sibling of a
// <block> element instead of as that block's child. Blockly silently drops the
// dangling <next> chain when this happens, so authored blocks vanish without an
// error. The signature pattern is `</block>` followed immediately by `<next>` —
// in well-formed Blockly XML, `</block>` is only ever followed by another
// closing tag (`</next>`, `</statement>`, `</value>`, `</xml>`) or by an
// independent top-level sibling block at the workspace root.
//
// Scans both the starter XML on the level definition and the matching reference
// solution XML when one is present.
export function checkStarterXmlWellFormedNextNesting(
  levels,
  { referenceSolutionsByLevelId = new Map() } = {}
) {
  const diagnostics = [];
  const danglingNextPattern = /<\/block>\s*<next\b/;

  function scan(xmlText, { levelId, sourcePath, role }) {
    if (typeof xmlText !== "string" || !xmlText.trim()) return;
    if (danglingNextPattern.test(xmlText)) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId,
          contract: "starter-xml-well-formed-next-nesting",
          message:
            `${role} XML contains a <next> element as a sibling of a <block> ` +
            "element; Blockly will silently drop the dangling chain. Move the " +
            "<next> inside the preceding <block>'s opening/closing tags.",
          file: sourcePath || null
        })
      );
    }
  }

  for (const level of levels) {
    scan(getStarterXml(level), {
      levelId: level.id,
      sourcePath: level.sourcePath,
      role: "starter"
    });

    const ref = getLevelRef(level, referenceSolutionsByLevelId);
    if (ref) {
      scan(ref.xmlText, {
        levelId: level.id,
        sourcePath: ref.filePath || level.sourcePath,
        role: "reference solution"
      });
    }
  }

  return diagnostics;
}

export function checkProjectMetadata(levels) {
  const diagnostics = [];

  const expectedByLevelId = new Map([
    ["closest-threat", "strategy-brain"],
    ["how-far-away", "strategy-brain"],
    ["two-conditions-at-once", "strategy-brain"],
    ["this-or-that", "strategy-brain"],
    ["flip-the-answer", "strategy-brain"],
    ["full-team-tactics", "strategy-brain"],
    ["one-program-two-allies", "team-strategy-script"],
    ["index-jobs", "team-strategy-script"],
    ["first-two-defend", "team-strategy-script"],
    ["escort-the-carrier", "team-strategy-script"],
    ["closest-enemy-defender", "team-strategy-script"],
    ["freeze-support", "team-strategy-script"],
    ["barrier-specialist", "team-strategy-script"],
    ["jump-team", "team-strategy-script"],
    ["advanced-scrimmage", "team-strategy-script"]
  ]);

  for (const level of levels) {
    const expectedProjectId = expectedByLevelId.get(level.id);
    if (!expectedProjectId) {
      continue;
    }
    if (level.project?.id !== expectedProjectId) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "project-metadata",
          message: `expected project.id="${expectedProjectId}"`,
          file: level.sourcePath || null
        })
      );
      continue;
    }
    if (!level.project || typeof level.project.step !== "number") {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "project-metadata",
          message: "project metadata is missing a numeric step",
          file: level.sourcePath || null
        })
      );
    }
  }

  return diagnostics;
}

export function checkProjectToolboxPolicy(levels) {
  const diagnostics = [];

  for (const level of levels) {
    let expected = null;
    if (level.project?.id === "strategy-brain") {
      expected = "strategy-brain";
    } else if (level.project?.id === "team-strategy-script") {
      expected = "team-strategy-script";
    }
    if (!expected) {
      continue;
    }

    const expectedToolbox = getProjectToolboxPolicy(level);
    const currentToolbox = new Set(level.toolboxBlockTypes || []);
    const missing = [...expectedToolbox].filter((blockType) => !currentToolbox.has(blockType));

    if (missing.length) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "project-toolbox-policy",
          message: `missing ${missing.join(", ")}`,
          file: level.sourcePath || null
        })
      );
    }
  }

  return diagnostics;
}

export function checkPredictionHasValidSchema(levels) {
  const diagnostics = [];

  for (const level of levels) {
    if (level.levelKind !== "prediction") {
      continue;
    }

    const prediction = level.prediction || null;
    if (!prediction || typeof prediction !== "object") {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "prediction-has-valid-schema",
          message: "prediction levels must define a prediction object",
          file: level.sourcePath || null
        })
      );
      continue;
    }

    const prompt = `${prediction.prompt || ""}`.trim();
    const choices = Array.isArray(prediction.choices) ? prediction.choices : [];
    const choiceIds = choices
      .map((choice) => choice && typeof choice.id === "string" ? choice.id.trim() : "")
      .filter(Boolean);
    const choiceLabels = choices
      .map((choice) => choice && typeof choice.label === "string" ? choice.label.trim() : "")
      .filter(Boolean);
    const correctChoiceId = `${prediction.correctChoiceId || ""}`.trim();

    if (!prompt) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "prediction-has-valid-schema",
          message: "prediction prompt must be a non-empty string",
          file: level.sourcePath || null
        })
      );
    }

    if (choices.length < 2) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "prediction-has-valid-schema",
          message: "prediction levels must define at least two choices",
          file: level.sourcePath || null
        })
      );
    } else if (choiceIds.length !== choices.length || choiceLabels.length !== choices.length) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "prediction-has-valid-schema",
          message: "prediction choices must each define string id and label fields",
          file: level.sourcePath || null
        })
      );
    }

    if (!correctChoiceId || !choiceIds.includes(correctChoiceId)) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "prediction-has-valid-schema",
          message: "prediction correctChoiceId must match one of the choice ids",
          file: level.sourcePath || null
        })
      );
    }
  }

  return diagnostics;
}

export function checkTurnLimitFloor(levels, minTurnLimit = DEFAULT_MIN_TURN_LIMIT) {
  const diagnostics = [];

  for (const level of levels) {
    const turnLimit =
      getFailureConditions(level).find((condition) => condition?.type === "turn_limit_exceeded")?.maxTurns
      ?? level.turnLimit
      ?? null;
    if (typeof turnLimit !== "number" || turnLimit < minTurnLimit) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "turn-limit-floor",
          message: `turn limit ${turnLimit ?? "(missing)"} is below minimum ${minTurnLimit}`,
          file: level.sourcePath || null
        })
      );
    }
  }

  return diagnostics;
}

function mechanicEvidenceFromLevel(level) {
  const failureConditions = getFailureConditions(level);
  const structuredHaystack = [
    level.winCondition?.type,
    ...failureConditions.map((condition) => condition?.type),
    JSON.stringify(level.winCondition || {}),
    JSON.stringify(failureConditions || []),
    JSON.stringify(level.sensorObjectTypes || []),
    JSON.stringify(level.sensorRelationTypes || []),
    JSON.stringify(level.moveTowardTargetTypes || []),
    JSON.stringify(level.toolboxBlockTypes || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const proseHaystack = [
    level.title,
    level.description,
    level.introText,
    ...(level.tips || []),
    ...(level.tutorialSteps || []).map((step) => `${step.title || ""} ${step.body || ""}`)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return { structuredHaystack, proseHaystack };
}

const MECHANIC_NECESSITY_VALUES = new Set(Object.values(MECHANIC_NECESSITY));
const NAIVE_SOLUTIONS_FIXTURE_DIR = "tests/unit/fixtures/guided-naive-solutions";

// Charter S8 (Plan 85) / Plan 100: a level may declare mechanicNecessity:
// "dynamic" when its taught mechanic is made mandatory by a live enemy
// rather than by win-condition structure (a runner_reaches_cell win
// condition cannot statically encode "or you get captured"). The claim is
// only accepted when a degenerate/naive fixture is discoverable for the
// level, so the annotation cannot silently bypass this check on its own.
export function checkWinConditionRequiresNamedMechanic(levels, conceptMatrix, { naiveSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];

  for (let index = 0; index < levels.length; index += 1) {
    const level = levels[index];
    const necessity = level.mechanicNecessity;

    if (necessity !== undefined && necessity !== null && !MECHANIC_NECESSITY_VALUES.has(necessity)) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "win-condition-requires-named-mechanic",
          message: `mechanicNecessity "${necessity}" is not one of: ${[...MECHANIC_NECESSITY_VALUES].join(", ")}`,
          file: level.sourcePath || null
        })
      );
      continue;
    }

    const row = conceptMatrix[index];
    if (!row) {
      continue;
    }

    const mechanicText = normalizeText(`${row.newVocabulary} ${row.newBlockly} ${row.focus}`);
    const interestingKeywords = [
      "and",
      "or",
      "not",
      "barrier",
      "freeze",
      "jump",
      "distance",
      "runner index",
      "teammate",
      "compare",
      "move toward"
    ].filter((keyword) => mechanicText.includes(keyword));

    if (!interestingKeywords.length) {
      continue;
    }

    const { structuredHaystack, proseHaystack } = mechanicEvidenceFromLevel(level);
    const structuredMatches = interestingKeywords.some((keyword) => structuredHaystack.includes(keyword));
    const proseMatches = interestingKeywords.some((keyword) => proseHaystack.includes(keyword));

    if (structuredMatches) {
      // Static structure alone proves necessity; clean regardless of any
      // mechanicNecessity annotation (either proof suffices, no double-report).
      continue;
    }

    if (necessity === MECHANIC_NECESSITY.DYNAMIC) {
      if (naiveSolutionsByLevelId.has(level.id)) {
        // Silenced by dynamic proof: annotation + a discoverable degenerate
        // fixture stand in for the static check this win condition can't express.
        continue;
      }
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "win-condition-requires-named-mechanic",
          message: `mechanicNecessity "dynamic" claimed for concept-matrix entry "${row.levelLabel} ${row.focus}" but no degenerate fixture found at ${NAIVE_SOLUTIONS_FIXTURE_DIR}/${level.id}.xml`,
          file: level.sourcePath || null
        })
      );
      continue;
    }

    if (proseMatches) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "win-condition-requires-named-mechanic",
          message: `mechanic appears only in prose for concept-matrix entry "${row.levelLabel} ${row.focus}" (no static structure and no dynamic-necessity annotation)`,
          file: level.sourcePath || null
        })
      );
    } else {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "win-condition-requires-named-mechanic",
          message: `no obvious structured reference to mechanic words from concept-matrix entry "${row.levelLabel} ${row.focus}" (no dynamic-necessity annotation either)`,
          file: level.sourcePath || null
        })
      );
    }
  }

  return diagnostics;
}

export function checkReferenceSolutionFixtureNameMatchesLevelId(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];

  for (const level of levels) {
    if (level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT) {
      continue;
    }
    const ref = getLevelRef(level, referenceSolutionsByLevelId);
    if (!ref) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "reference-solution-fixture-name",
          message: `missing reference solution fixture for ${level.id}`,
          file: level.sourcePath || null
        })
      );
      continue;
    }

    const fileName = String(ref.filePath || "")
      .replace(/\\/g, "/")
      .split("/")
      .pop();
    if (fileName !== `${level.id}.xml`) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "reference-solution-fixture-name",
          message: `expected ${level.id}.xml but found ${fileName}`,
          file: ref.filePath
        })
      );
    }
  }

  return diagnostics;
}

export function checkSensorRelationPolicy(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];

  for (const level of levels) {
    const sensorRelations = new Set(level.sensorRelationTypes || []);
    for (const pair of SENSOR_RELATION_PAIR_REQUIREMENTS) {
      const hasHorizontalPairRelation = pair.horizontal.some((relation) => sensorRelations.has(relation));
      const hasVerticalPairRelation = pair.vertical.some((relation) => sensorRelations.has(relation));

      if (hasHorizontalPairRelation && !pair.horizontal.every((relation) => sensorRelations.has(relation))) {
        diagnostics.push(
          makeDiagnostic({
            severity: SEVERITIES.WARNING,
            levelId: level.id,
            contract: "sensor-relation-policy",
            message: `${pair.name} sensor relations should be declared together`,
            file: level.sourcePath || null
          })
        );
        continue;
      }

      if (hasHorizontalPairRelation && !pair.vertical.every((relation) => sensorRelations.has(relation))) {
        diagnostics.push(
          makeDiagnostic({
            severity: SEVERITIES.WARNING,
            levelId: level.id,
            contract: "sensor-relation-policy",
            message: `${pair.name} sensor relations should include above/below when forward/backward relations are declared`,
            file: level.sourcePath || null
          })
        );
      }

      if (hasVerticalPairRelation && !pair.vertical.every((relation) => sensorRelations.has(relation))) {
        diagnostics.push(
          makeDiagnostic({
            severity: SEVERITIES.WARNING,
            levelId: level.id,
            contract: "sensor-relation-policy",
            message: `${pair.name} sensor relations should be declared together`,
            file: level.sourcePath || null
          })
        );
      }
    }

    const ref = getLevelRef(level, referenceSolutionsByLevelId);
    if (!ref) {
      continue;
    }

    const usedRelations = uniqueSorted(parseXmlFieldValues(ref.xmlText, "RELATION"));
    const missing = usedRelations.filter(
      (relation) => DIRECTED_SENSOR_RELATIONS.has(relation) && !sensorRelations.has(relation)
    );
    if (missing.length) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "sensor-relation-policy",
          message: `reference solution uses undeclared relation(s): ${missing.join(", ")}`,
          file: ref.filePath
        })
      );
    }
  }

  return diagnostics;
}

export function checkFlagSetupGameSpecCompliance(levels) {
  const diagnostics = [];

  for (const level of levels) {
    const flagEntries = Object.entries(level.setup?.flags || {});
    if (!flagEntries.length) {
      continue;
    }

    const runnerIndex = buildRunnerIndex(level);

    for (const [role, flag] of flagEntries) {
      if (!flag || typeof flag !== "object") {
        continue;
      }

      const teamId = getTeamIdFromRole(role);
      const teamSetup = level.setup?.teams?.[role];
      if (!teamSetup) {
        continue;
      }

      const baseCells = getBaseAreaCellSet(level, teamId);
      const flagHasExplicitPosition = flag.gridX !== undefined || flag.gridY !== undefined;
      const resolvedFlagX = flag.gridX ?? teamSetup.flagHome?.x ?? null;
      const resolvedFlagY = flag.gridY ?? teamSetup.flagHome?.y ?? null;
      const resolvedFlagCell = resolvedFlagX !== null && resolvedFlagY !== null
        ? `${resolvedFlagX},${resolvedFlagY}`
        : null;
      const carrierId = flag.carriedByRunnerId || null;

      if (carrierId) {
        const carrier = runnerIndex.get(carrierId) || null;
        if (!carrier) {
          diagnostics.push(
            makeDiagnostic({
              severity: SEVERITIES.WARNING,
              levelId: level.id,
              contract: "flag-setup-game-spec-compliance",
              message: `flag for team ${teamId} is carried by missing runner "${carrierId}"`,
              file: level.sourcePath || null
            })
          );
          continue;
        }

        if (carrier.teamId === teamId) {
          diagnostics.push(
            makeDiagnostic({
              severity: SEVERITIES.WARNING,
              levelId: level.id,
              contract: "flag-setup-game-spec-compliance",
              message: `flag for team ${teamId} is carried by same-team runner "${carrierId}"`,
              file: level.sourcePath || null
            })
          );
        }

        if (!carrier.runnerSpec.hasEnemyFlag) {
          diagnostics.push(
            makeDiagnostic({
              severity: SEVERITIES.WARNING,
              levelId: level.id,
              contract: "flag-setup-game-spec-compliance",
              message: `runner "${carrierId}" should start with hasEnemyFlag=true when carrying flag for team ${teamId}`,
              file: level.sourcePath || null
            })
          );
        }

        const carrierPosition = resolveRunnerPosition(level.setup.teams[carrier.role], carrier.runnerSpec);
        if (
          flagHasExplicitPosition &&
          resolvedFlagCell &&
          (carrierPosition.x !== resolvedFlagX || carrierPosition.y !== resolvedFlagY)
        ) {
          diagnostics.push(
            makeDiagnostic({
              severity: SEVERITIES.WARNING,
              levelId: level.id,
              contract: "flag-setup-game-spec-compliance",
              message: `flag for team ${teamId} should match carrier "${carrierId}" position when carried`,
              file: level.sourcePath || null
            })
          );
        }

        if (flag.isAtBase === true) {
          diagnostics.push(
            makeDiagnostic({
              severity: SEVERITIES.WARNING,
              levelId: level.id,
              contract: "flag-setup-game-spec-compliance",
              message: `flag for team ${teamId} is carried but still marked at base`,
              file: level.sourcePath || null
            })
          );
        }

        continue;
      }

      if (flag.isAtBase === false) {
        diagnostics.push(
          makeDiagnostic({
            severity: SEVERITIES.WARNING,
            levelId: level.id,
            contract: "flag-setup-game-spec-compliance",
            message: `flag for team ${teamId} is marked off-base without a carrier`,
            file: level.sourcePath || null
          })
        );
        continue;
      }

      if (!resolvedFlagCell || !baseCells.has(resolvedFlagCell)) {
        diagnostics.push(
          makeDiagnostic({
            severity: SEVERITIES.WARNING,
            levelId: level.id,
            contract: "flag-setup-game-spec-compliance",
            message: `flag for team ${teamId} should start on that team's base area`,
            file: level.sourcePath || null
          })
        );
      }
    }
  }

  return diagnostics;
}

// Charter S1 (Plan 85) / Plan 99: boardDynamicsTier is optional authored metadata,
// cross-checked here against provable setup facts only (frozen flags, cpuBehavior
// constants). This does not — and cannot — verify whether a live enemy can actually
// reach or interfere with the player; that is a semantic claim beyond a static linter.
// A live opponent counts as "static" only when it is authored frozen (isFrozen) or
// uses GUIDED_STAY_STILL. Any other opponent runner (including one with no
// cpuBehavior at all, which falls back to a moving guided teaching NPC) counts as live.
function isOpponentRunnerSpecStatic(runnerSpec) {
  return Boolean(runnerSpec.isFrozen) || runnerSpec.cpuBehavior === NPC_BEHAVIORS.GUIDED_STAY_STILL;
}

export function checkBoardDynamicsTierAgreement(levels) {
  const diagnostics = [];
  const validTiers = new Set(Object.values(BOARD_DYNAMICS_TIERS));

  for (const level of levels) {
    const tier = level.boardDynamicsTier;

    if (tier === undefined || tier === null) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.WARNING,
          levelId: level.id,
          contract: "board-dynamics-tier",
          message: "untiered: level has no boardDynamicsTier metadata",
          file: level.sourcePath || null
        })
      );
      continue;
    }

    if (!validTiers.has(tier)) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "board-dynamics-tier",
          message: `boardDynamicsTier "${tier}" is not one of: ${[...validTiers].join(", ")}`,
          file: level.sourcePath || null
        })
      );
      continue;
    }

    const opponentRunners = level.setup?.teams?.opponent?.runners || [];
    const liveOpponentCount = opponentRunners.filter((runnerSpec) => !isOpponentRunnerSpecStatic(runnerSpec)).length;

    if (tier === BOARD_DYNAMICS_TIERS.STATIC_PROP && liveOpponentCount > 0) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "board-dynamics-tier",
          message: `tier "static-prop" contradicts setup: ${liveOpponentCount} live opponent runner(s) found`,
          file: level.sourcePath || null
        })
      );
    }

    if (tier !== BOARD_DYNAMICS_TIERS.STATIC_PROP && liveOpponentCount === 0) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "board-dynamics-tier",
          message: `tier "${tier}" contradicts setup: all opponents are static (frozen or GUIDED_STAY_STILL), nothing moves`,
          file: level.sourcePath || null
        })
      );
    }

    if (tier === BOARD_DYNAMICS_TIERS.SCRIMMAGE_THREAT && liveOpponentCount < 2) {
      diagnostics.push(
        makeDiagnostic({
          severity: SEVERITIES.ERROR,
          levelId: level.id,
          contract: "board-dynamics-tier",
          message: `tier "scrimmage-threat" requires multiple live opponents but found ${liveOpponentCount}`,
          file: level.sourcePath || null
        })
      );
    }
  }

  return diagnostics;
}

// Copy voice contract (charter S5, Plan 94): student-facing text has an
// in-world scout/coach speaker. These three checks are transparent
// phrase/length rules, not NLP -- see docs/CopyVoiceContract.md for the
// contract and examples. All are warnings: existing copy is not rewritten by
// this packet, and the default lint mode must not fail CI on it.
const COPY_VOICE_PROSE_FIELDS = ["description", "introText"];
const COPY_VOICE_BANNED_PHRASES = ["this level teaches", "beginner-friendly", "this is a good level for"];
const COPY_VOICE_SPOILER_PHRASES = [
  "the solution is",
  "the answer is",
  "the correct order is",
  "the correct sequence is",
  "the trick is to"
];
const PRE_PLAY_PROSE_WORD_CAP = 35;

function collectCopyVoiceFields(level) {
  const fields = [];
  for (const fieldName of COPY_VOICE_PROSE_FIELDS) {
    if (level[fieldName]) {
      fields.push({ fieldName, text: level[fieldName] });
    }
  }
  (level.tips || []).forEach((tip, index) => {
    if (tip) {
      fields.push({ fieldName: `tips[${index}]`, text: tip });
    }
  });
  (level.tutorialSteps || []).forEach((step, index) => {
    if (step?.body) {
      fields.push({ fieldName: `tutorialSteps[${index}].body`, text: step.body });
    }
  });
  return fields;
}

export function checkCopyVoiceBannedPhrases(levels) {
  const diagnostics = [];

  for (const level of levels) {
    for (const { fieldName, text } of collectCopyVoiceFields(level)) {
      const normalized = normalizeText(text);
      for (const phrase of COPY_VOICE_BANNED_PHRASES) {
        if (normalized.includes(phrase)) {
          diagnostics.push(
            makeDiagnostic({
              severity: SEVERITIES.WARNING,
              levelId: level.id,
              contract: "copy-voice-banned-phrase",
              message: `${fieldName} contains banned meta phrase "${phrase}" (charter S5 voice contract)`,
              file: level.sourcePath || null
            })
          );
        }
      }
    }
  }

  return diagnostics;
}

export function checkCopyVoiceSpoilerPhrasing(levels) {
  const diagnostics = [];

  for (const level of levels) {
    for (const { fieldName, text } of collectCopyVoiceFields(level)) {
      const normalized = normalizeText(text);
      for (const phrase of COPY_VOICE_SPOILER_PHRASES) {
        if (normalized.includes(phrase)) {
          diagnostics.push(
            makeDiagnostic({
              severity: SEVERITIES.WARNING,
              levelId: level.id,
              contract: "copy-voice-spoiler-phrase",
              message: `${fieldName} contains solution-spoiler phrasing "${phrase}" (charter S5: never state the solution before play)`,
              file: level.sourcePath || null
            })
          );
        }
      }
    }
  }

  return diagnostics;
}

export function checkPrePlayProseLength(levels, maxWords = PRE_PLAY_PROSE_WORD_CAP) {
  const diagnostics = [];

  for (const level of levels) {
    for (const fieldName of COPY_VOICE_PROSE_FIELDS) {
      const text = level[fieldName];
      if (!text) {
        continue;
      }
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount > maxWords) {
        diagnostics.push(
          makeDiagnostic({
            severity: SEVERITIES.WARNING,
            levelId: level.id,
            contract: "copy-voice-prose-length",
            message: `${fieldName} is ${wordCount} words, over the ~${maxWords}-word pre-play prose cap (charter S4)`,
            file: level.sourcePath || null
          })
        );
      }
    }
  }

  return diagnostics;
}

export function runLevelLint({
  levels,
  conceptMatrix,
  referenceSolutionsByLevelId = new Map(),
  naiveSolutionsByLevelId = new Map(),
  minTurnLimit = DEFAULT_MIN_TURN_LIMIT
}) {
  return [
    ...checkConceptMatrixAgreement(levels, conceptMatrix),
    ...checkReferenceSolutionToolboxCompatibility(levels, { referenceSolutionsByLevelId }),
    ...checkDemoBlocklyDoesNotSolveLevel(levels, { referenceSolutionsByLevelId }),
    ...checkChallengeLevelsIntroduceNoNewBlock(levels),
    ...checkBugHuntLevelsIntroduceNoNewBlock(levels),
    ...checkBugHuntHasBrokenStarter(levels, { referenceSolutionsByLevelId }),
    ...checkBugHuntHasReferenceSolution(levels, { referenceSolutionsByLevelId }),
    ...checkStarterXmlWellFormedNextNesting(levels, { referenceSolutionsByLevelId }),
    ...checkProjectMetadata(levels),
    ...checkProjectToolboxPolicy(levels),
    ...checkPredictionHasValidSchema(levels),
    ...checkTurnLimitFloor(levels, minTurnLimit),
    ...checkWinConditionRequiresNamedMechanic(levels, conceptMatrix, { naiveSolutionsByLevelId }),
    ...checkReferenceSolutionFixtureNameMatchesLevelId(levels, { referenceSolutionsByLevelId }),
    ...checkSensorRelationPolicy(levels, { referenceSolutionsByLevelId }),
    ...checkFlagSetupGameSpecCompliance(levels),
    ...checkBoardDynamicsTierAgreement(levels),
    ...checkCopyVoiceBannedPhrases(levels),
    ...checkCopyVoiceSpoilerPhrasing(levels),
    ...checkPrePlayProseLength(levels)
  ];
}

