import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as Blockly from "blockly";
import { AI_ACTION_TYPES, HUMAN_TURN_BEHAVIORS, LEVEL_RESULT } from "../config/constants.js";
import { getLevelDefinitions } from "../config/levels.js";
import { GUIDED_LEVEL_MANIFEST } from "../config/levels/manifest.js";
import { registerBattleBlocklyBlocks } from "../ai/blockly/blocks.js";
import { loadWorkspaceXml, getFirstRunnableAction } from "../ai/blockly/workspace.js";
import { createApp } from "../core/state.js";
import { initializeLevelState, startLevel } from "../core/levels.js";
import { processTurnActions } from "../core/turnEngine.js";
import { runLevelLint } from "./levelLint.js";
import { PROJECT_READINESS_POLICY } from "./levelReadinessProjectPolicy.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const LEVEL_INDEX_PATH = path.join(REPO_ROOT, "src/config/levels/index.js");
const CONCEPT_MATRIX_PATH = path.join(REPO_ROOT, "docs/GUIDED_LEVEL_CONCEPT_MATRIX.md");
const REFERENCE_SOLUTIONS_DIR = path.join(REPO_ROOT, "tests/unit/fixtures/guided-reference-solutions");
const PROJECT_SOLUTIONS_DIR = path.join(REPO_ROOT, "tests/unit/fixtures/guided-project-solutions");
const TRACE_TAIL_LENGTH = 8;
const MAX_SIMULATION_TICKS = 4000;

let readinessContextPromise = null;

function toRepoRelative(filePath) {
  if (!filePath) {
    return null;
  }
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
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

function parseConceptMatrixRows(markdown) {
  const rows = [];
  for (const line of String(markdown || "").split(/\r?\n/)) {
    if (!line.startsWith("|")) {
      continue;
    }
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (cells.length < 5) {
      continue;
    }
    if (/^---+$/.test(cells[0]) || /^Level$/.test(cells[0])) {
      continue;
    }
    rows.push({
      levelLabel: cells[0].replace(/\*\*/g, "").replace(/`/g, "").trim(),
      focus: cells[1].replace(/\*\*/g, "").replace(/`/g, "").trim(),
      newVocabulary: cells[2].replace(/\*\*/g, "").replace(/`/g, "").trim(),
      newBlockly: cells[3].replace(/\*\*/g, "").replace(/`/g, "").trim(),
      assumes: cells[4].replace(/\*\*/g, "").replace(/`/g, "").trim(),
      raw: line
    });
  }
  return rows;
}

function splitCsvImportList(importSpec) {
  return String(importSpec)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function discoverLevelModulePaths() {
  const indexSource = await fs.readFile(LEVEL_INDEX_PATH, "utf8");
  const phaseIndexPaths = [];
  for (const match of indexSource.matchAll(/import\s+\w+\s+from\s+"\.\/phases\/([^"]+)\/index\.js";/g)) {
    phaseIndexPaths.push(path.join(REPO_ROOT, "src/config/levels/phases", match[1], "index.js"));
  }

  const levelModulePaths = [];
  for (const phaseIndexPath of phaseIndexPaths) {
    const phaseSource = await fs.readFile(phaseIndexPath, "utf8");
    const phaseDir = path.dirname(phaseIndexPath);
    const importMap = new Map();
    for (const match of phaseSource.matchAll(/import\s+(\w+)\s+from\s+"\.\/([^"]+)";/g)) {
      importMap.set(match[1], path.join(phaseDir, match[2]));
    }

    const exportMatch = phaseSource.match(/export default \[([^\]]+)\]/);
    if (exportMatch) {
      for (const name of splitCsvImportList(exportMatch[1])) {
        const filePath = importMap.get(name);
        if (filePath) {
          levelModulePaths.push(filePath);
        }
      }
    } else {
      for (const filePath of importMap.values()) {
        levelModulePaths.push(filePath);
      }
    }
  }

  return levelModulePaths;
}

async function loadLevelCatalog() {
  const module = await import(pathToFileURL(path.join(REPO_ROOT, "src/config/levels.js")).href);
  const levelFilePaths = await discoverLevelModulePaths();
  const levelDefinitions = module.getLevelDefinitions();
  const sourcePathById = new Map();

  for (let index = 0; index < levelFilePaths.length; index += 1) {
    const levelId = levelDefinitions[index]?.id;
    if (levelId) {
      sourcePathById.set(levelId, levelFilePaths[index]);
    }
  }

  return levelDefinitions.map((level) => ({
    ...level,
    sourcePath: sourcePathById.get(level.id) ? toRepoRelative(sourcePathById.get(level.id)) : null
  }));
}

async function readTextIfExists(absPath) {
  try {
    return await fs.readFile(absPath, "utf8");
  } catch (error) {
    if (error && typeof error === "object" && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

async function loadConceptMatrixRows() {
  const markdown = await fs.readFile(path.join(REPO_ROOT, "docs/GUIDED_LEVEL_CONCEPT_MATRIX.md"), "utf8");
  return parseConceptMatrixRows(markdown);
}

async function loadReferenceSolutionIndex(levels) {
  const byLevelId = new Map();
  for (const level of levels) {
    const candidatePath = path.join(REFERENCE_SOLUTIONS_DIR, `${level.id}.xml`);
    const xmlText = await readTextIfExists(candidatePath);
    if (xmlText == null) {
      continue;
    }
    byLevelId.set(level.id, {
      xmlText,
      filePath: toRepoRelative(candidatePath)
    });
  }
  return byLevelId;
}

async function loadProjectFixtureIndex() {
  const byProjectId = new Map();
  for (const projectId of Object.keys(PROJECT_READINESS_POLICY)) {
    const projectDir = path.join(PROJECT_SOLUTIONS_DIR, projectId);
    const projectEntry = {
      stepFixtures: new Map(),
      finalFixture: null
    };

    const files = await fs.readdir(projectDir).catch((error) => {
      if (error && typeof error === "object" && error.code === "ENOENT") {
        return [];
      }
      throw error;
    });

    for (const file of files) {
      if (!file.endsWith(".xml")) {
        continue;
      }
      const absPath = path.join(projectDir, file);
      const xmlText = await fs.readFile(absPath, "utf8");
      if (file === "final.xml") {
        projectEntry.finalFixture = {
          filePath: toRepoRelative(absPath),
          xmlText
        };
        continue;
      }
      const match = file.match(/^step-(\d+)\.xml$/);
      if (match) {
        projectEntry.stepFixtures.set(Number(match[1]), {
          filePath: toRepoRelative(absPath),
          xmlText
        });
      }
    }

    byProjectId.set(projectId, projectEntry);
  }
  return byProjectId;
}

async function loadReadinessContext() {
  if (!readinessContextPromise) {
    readinessContextPromise = (async () => {
      const levels = await loadLevelCatalog();
      const levelById = new Map(levels.map((level) => [level.id, level]));
      const conceptMatrixRows = await loadConceptMatrixRows();
      const referenceSolutionsByLevelId = await loadReferenceSolutionIndex(levels);
      const projectFixturesById = await loadProjectFixtureIndex();
      const lintDiagnostics = runLevelLint({
        levels,
        conceptMatrix: conceptMatrixRows,
        referenceSolutionsByLevelId
      });
      return {
        levels,
        levelById,
        conceptMatrixRows,
        referenceSolutionsByLevelId,
        projectFixturesById,
        lintDiagnostics
      };
    })();
  }
  return readinessContextPromise;
}

function makeCheck({
  id,
  label,
  status,
  severity,
  message,
  evidence = null,
  relatedFiles = []
}) {
  return {
    id,
    label,
    status,
    severity,
    message,
    evidence,
    relatedFiles
  };
}

function getDiagnosticSeverityLevel(diagnostics = []) {
  if (diagnostics.some((diagnostic) => diagnostic.severity === "error")) {
    return { status: "fail", severity: "error" };
  }
  if (diagnostics.some((diagnostic) => diagnostic.severity === "warning")) {
    return { status: "warning", severity: "warning" };
  }
  return { status: "pass", severity: "info" };
}

function groupDiagnosticsByContract(diagnostics = []) {
  const grouped = new Map();
  for (const diagnostic of diagnostics) {
    const key = diagnostic.contract || "unknown";
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(diagnostic);
  }
  return grouped;
}

function makeTraceTail(trace = [], tailLength = TRACE_TAIL_LENGTH) {
  return trace.slice(Math.max(0, trace.length - tailLength)).map((entry) => ({ ...entry }));
}

function createSeededRandom(seedText) {
  let seed = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
  }
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

function createReadinessApp(xmlText, { randomFn = null } = {}) {
  registerBattleBlocklyBlocks();
  const app = createApp();
  app.blocklyWorkspace = new Blockly.Workspace();
  app.hooks.getAIAllyAction = (runnerOverride = null) => {
    const runner =
      runnerOverride ||
      app.state.allRunners.find((candidate) => candidate.team === 1 && !candidate.isHumanControlled && !candidate.isNPC);
    return getFirstRunnableAction(app, runner) || { type: AI_ACTION_TYPES.STAY_STILL };
  };
  app.state.randomFn = typeof randomFn === "function" ? randomFn : () => 0;
  initializeLevelState(app);
  return { app, xmlText };
}

function runLevelSimulation(level, xmlText, { randomFn = null } = {}) {
  const { app } = createReadinessApp(xmlText, { randomFn });
  startLevel(app, level.id);
  loadWorkspaceXml(app, xmlText);

  const trace = [];
  for (let tick = 0; tick < MAX_SIMULATION_TICKS; tick += 1) {
    const activeRunner = app.state.allRunners[app.state.activeRunnerIndex];
    trace.push({
      tick,
      turn: app.state.currentTurnNumber,
      runner: activeRunner?.id || null,
      state: app.state.currentTurnState,
      result: app.state.activeLevelResult
    });
    if (app.state.activeLevelResult === LEVEL_RESULT.PASSED || app.state.activeLevelResult === LEVEL_RESULT.FAILED) {
      break;
    }
    processTurnActions(app, {
      lerp(start, end, amount) {
        return start + (end - start) * amount;
      }
    });
  }

  return {
    result: app.state.activeLevelResult,
    turnCount: app.state.currentTurnNumber,
    lastLevelResultReason: app.state.lastLevelResultReason || null,
    traceTail: makeTraceTail(trace),
    finalState: app.state
  };
}

function findConceptMatrixRow(level, conceptMatrixRows) {
  const rowKey = expectedMatrixLabelFromTitle(level.title);
  return conceptMatrixRows.find((row) => normalizeText(row.levelLabel) === rowKey) || null;
}

function getRelevantLintDiagnostics(level, lintDiagnostics) {
  return lintDiagnostics.filter((diagnostic) => diagnostic.levelId === level.id || diagnostic.levelId === "campaign");
}

function buildLintCheck(level, diagnostics, sourcePath, conceptMatrixRow) {
  const grouped = groupDiagnosticsByContract(diagnostics);
  const summary = getDiagnosticSeverityLevel(diagnostics);
  const evidence = {};
  for (const [contract, contractDiagnostics] of grouped.entries()) {
    evidence[contract] = contractDiagnostics.map((diagnostic) => ({
      severity: diagnostic.severity,
      message: diagnostic.message,
      file: diagnostic.file || null
    }));
  }
  return makeCheck({
    id: "lint-diagnostics",
    label: "Lint diagnostics",
    status: summary.status,
    severity: summary.severity,
    message:
      diagnostics.length > 0
        ? `${diagnostics.length} diagnostic${diagnostics.length === 1 ? "" : "s"} apply to this level or the campaign`
        : "No lint diagnostics apply to this level",
    evidence,
    relatedFiles: uniquePaths([
      sourcePath,
      conceptMatrixRow ? CONCEPT_MATRIX_PATH : null,
      ...diagnostics.map((diagnostic) => diagnostic.file || null)
    ])
  });
}

function uniquePaths(paths) {
  return [...new Set(paths.filter(Boolean))];
}

function buildConceptMatrixCheck(level, conceptMatrixRow, sourcePath) {
  if (!conceptMatrixRow) {
    return makeCheck({
      id: "concept-matrix-row",
      label: "Concept matrix row",
      status: "fail",
      severity: "error",
      message: "No matching concept matrix row was found for this level",
      evidence: null,
      relatedFiles: [sourcePath, CONCEPT_MATRIX_PATH].filter(Boolean)
    });
  }

  return makeCheck({
    id: "concept-matrix-row",
    label: "Concept matrix row",
    status: "pass",
    severity: "info",
    message: `Matched concept matrix row "${conceptMatrixRow.levelLabel}"`,
    evidence: conceptMatrixRow,
    relatedFiles: [sourcePath, CONCEPT_MATRIX_PATH].filter(Boolean)
  });
}

function buildReferenceLevelChecks(level, context, sourcePath, conceptMatrixRow) {
  if (level.project?.id) {
    return [];
  }

  const ordinaryLevel =
    level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT &&
    !level.project &&
    level.levelKind !== "prediction";
  const ref = context.referenceSolutionsByLevelId.get(level.id) || null;
  const relatedFiles = uniquePaths([sourcePath, ref?.filePath, CONCEPT_MATRIX_PATH]);
  const checks = [];

  if (!ordinaryLevel) {
    checks.push(
      makeCheck({
        id: "reference-fixture-exists",
        label: "Reference fixture",
        status: "not_applicable",
        severity: "none",
        message: level.levelKind === "prediction" || level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT
          ? "Reference-run checks are not applicable to prediction or human-input levels"
          : "Reference solution fixture is not used for this level",
        evidence: {
          applicability: "not_applicable",
          reason:
            level.levelKind === "prediction" || level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT
              ? "prediction or human-input level"
              : "non-ordinary level"
        },
        relatedFiles: [sourcePath, CONCEPT_MATRIX_PATH].filter(Boolean)
      })
    );
    checks.push(
      makeCheck({
        id: "reference-runtime",
        label: "Reference runtime",
        status: "not_applicable",
        severity: "none",
        message:
          level.levelKind === "prediction" || level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT
            ? "Reference-run simulation is not applicable because the level requires a prediction choice or human input"
            : "Reference-run simulation is not applicable for this level category",
        evidence: {
          applicability: "not_applicable"
        },
        relatedFiles: [sourcePath, CONCEPT_MATRIX_PATH].filter(Boolean)
      })
    );
    checks.push(
      makeCheck({
        id: "toolbox-reference-compatibility",
        label: "Reference toolbox compatibility",
        status: "not_applicable",
        severity: "none",
        message: "No reference fixture is available for toolbox compatibility validation",
        evidence: null,
        relatedFiles: [sourcePath, CONCEPT_MATRIX_PATH].filter(Boolean)
      })
    );
    checks.push(
      makeCheck({
        id: "demo-blockly-does-not-solve",
        label: "Demo Blockly comparison",
        status: "not_applicable",
        severity: "none",
        message: "No reference fixture is available for demo Blockly comparison",
        evidence: null,
        relatedFiles: [sourcePath, CONCEPT_MATRIX_PATH].filter(Boolean)
      })
    );
    return checks;
  }

  const runtime = ref
    ? runLevelSimulation(level, ref.xmlText, {
        randomFn: null
      })
    : null;
  const runtimePass = runtime?.result === LEVEL_RESULT.PASSED;
  const runtimeStatus = runtimePass ? "pass" : "fail";
  checks.push(
    makeCheck({
      id: "reference-fixture-exists",
      label: "Reference fixture",
      status: ref ? "pass" : "fail",
      severity: ref ? "info" : "error",
      message: ref ? `Found reference fixture ${ref.filePath}` : `Missing reference fixture for ${level.id}`,
      evidence: {
        path: ref?.filePath || null,
        exists: Boolean(ref)
      },
      relatedFiles: uniquePaths([sourcePath, ref?.filePath, CONCEPT_MATRIX_PATH])
    })
  );
  checks.push(
    makeCheck({
      id: "reference-runtime",
      label: "Reference runtime",
      status: runtimeStatus,
      severity: runtimePass ? "info" : "error",
      message: runtimePass
        ? "Reference solution passes this level"
        : runtime
          ? `Reference solution failed with ${runtime.lastLevelResultReason || "an unknown reason"}`
          : "Reference solution could not be simulated because the fixture is missing",
      evidence: {
        result: runtime?.result || null,
        turnCount: runtime?.turnCount || null,
        lastLevelResultReason: runtime?.lastLevelResultReason || null,
        traceTail: runtime?.traceTail || []
      },
      relatedFiles: uniquePaths([sourcePath, ref?.filePath])
    })
  );
  const lintDiagnostics = getRelevantLintDiagnostics(level, context.lintDiagnostics).filter((diagnostic) =>
    diagnostic.contract === "reference-solution-toolbox-compatibility" || diagnostic.contract === "demo-does-not-solve-level"
  );
  const lintSummary = getDiagnosticSeverityLevel(lintDiagnostics);
  checks.push(
    makeCheck({
      id: "toolbox-reference-compatibility",
      label: "Reference toolbox compatibility",
      status: lintDiagnostics.some((diagnostic) => diagnostic.contract === "reference-solution-toolbox-compatibility")
        ? lintSummary.status
        : "pass",
      severity: lintSummary.severity,
      message: lintDiagnostics.some((diagnostic) => diagnostic.contract === "reference-solution-toolbox-compatibility")
        ? "Reference fixture uses blocks not present in the authored toolbox"
        : "Reference fixture uses only authored toolbox blocks",
      evidence: lintDiagnostics.filter((diagnostic) => diagnostic.contract === "reference-solution-toolbox-compatibility").map((diagnostic) => ({
        severity: diagnostic.severity,
        message: diagnostic.message,
        file: diagnostic.file || null
      })),
      relatedFiles: uniquePaths([sourcePath, ref?.filePath])
    })
  );
  checks.push(
    makeCheck({
      id: "demo-blockly-does-not-solve",
      label: "Demo Blockly comparison",
      status: lintDiagnostics.some((diagnostic) => diagnostic.contract === "demo-does-not-solve-level")
        ? lintSummary.status
        : "pass",
      severity: lintSummary.severity,
      message: lintDiagnostics.some((diagnostic) => diagnostic.contract === "demo-does-not-solve-level")
        ? "At least one demo Blockly step matches the reference solution"
        : "Demo Blockly does not match the reference solution",
      evidence: lintDiagnostics.filter((diagnostic) => diagnostic.contract === "demo-does-not-solve-level").map((diagnostic) => ({
        severity: diagnostic.severity,
        message: diagnostic.message,
        file: diagnostic.file || null
      })),
      relatedFiles: uniquePaths([sourcePath, ref?.filePath])
    })
  );

  return checks;
}

function buildProjectLevelChecks(level, context, sourcePath) {
  const projectId = level.project?.id || null;
  const policy = projectId ? PROJECT_READINESS_POLICY[projectId] || null : null;
  const projectFixtures = projectId ? context.projectFixturesById.get(projectId) || null : null;
  const stepFixture = projectFixtures?.stepFixtures?.get(level.project?.step) || null;
  const finalFixture = projectFixtures?.finalFixture || null;
  const relatedBase = uniquePaths([sourcePath, stepFixture?.filePath, finalFixture?.filePath, CONCEPT_MATRIX_PATH]);
  const checks = [];

  const stepRuntime = stepFixture ? runLevelSimulation(level, stepFixture.xmlText, {
    randomFn: projectId === "strategy-brain" ? createSeededRandom("0") : null
  }) : null;
  const stepException = policy?.stepExceptions?.[level.id] || null;
  const stepPass = stepRuntime?.result === LEVEL_RESULT.PASSED;
  const stepStatus = stepException ? "warning" : stepPass ? "pass" : "fail";
  checks.push(
    makeCheck({
      id: "project-step-fixture-exists",
      label: "Project step fixture",
      status: stepFixture ? "pass" : "fail",
      severity: stepFixture ? "info" : "error",
      message: stepFixture
        ? `Found project step fixture ${stepFixture.filePath}`
        : `Missing project step fixture for ${projectId} step ${level.project?.step}`,
      evidence: {
        projectId,
        step: level.project?.step || null,
        path: stepFixture?.filePath || null,
        exists: Boolean(stepFixture)
      },
      relatedFiles: relatedBase
    })
  );
  checks.push(
    makeCheck({
      id: "project-step-runtime",
      label: "Project step runtime",
      status: stepStatus,
      severity: stepStatus === "pass" ? "info" : stepStatus === "warning" ? "warning" : "error",
      message: stepException
        ? `Documented step exception for ${level.id}${stepPass ? " unexpectedly now passes" : " is still reproduced"}`
        : stepPass
          ? "Project step fixture passes this level"
          : `Project step fixture failed with ${stepRuntime?.lastLevelResultReason || "an unknown reason"}`,
      evidence: {
        projectId,
        step: level.project?.step || null,
        result: stepRuntime?.result || null,
        turnCount: stepRuntime?.turnCount || null,
        lastLevelResultReason: stepRuntime?.lastLevelResultReason || null,
        traceTail: stepRuntime?.traceTail || [],
        documentedException: stepException
      },
      relatedFiles: uniquePaths([sourcePath, stepFixture?.filePath])
    })
  );

  const finalRuntime = finalFixture ? runLevelSimulation(level, finalFixture.xmlText, {
    randomFn: projectId === "strategy-brain" ? createSeededRandom("0") : null
  }) : null;
  const finalException = policy?.cumulativeExceptions?.[level.id] || null;
  const finalPass = finalRuntime?.result === LEVEL_RESULT.PASSED;
  const finalStatus = finalException ? "warning" : finalPass ? "pass" : "fail";
  checks.push(
    makeCheck({
      id: "project-final-fixture-exists",
      label: "Project final fixture",
      status: finalFixture ? "pass" : "fail",
      severity: finalFixture ? "info" : "error",
      message: finalFixture
        ? `Found project final fixture ${finalFixture.filePath}`
        : `Missing project final fixture for ${projectId}`,
      evidence: {
        projectId,
        path: finalFixture?.filePath || null,
        exists: Boolean(finalFixture)
      },
      relatedFiles: relatedBase
    })
  );
  checks.push(
    makeCheck({
      id: "project-final-runtime",
      label: "Project final runtime",
      status: finalStatus,
      severity: finalStatus === "pass" ? "info" : finalStatus === "warning" ? "warning" : "error",
      message: finalException
        ? `Documented cumulative exception for ${level.id}${finalPass ? " unexpectedly now passes" : " is still reproduced"}`
        : finalPass
          ? "Project final fixture passes this level"
          : `Project final fixture failed with ${finalRuntime?.lastLevelResultReason || "an unknown reason"}`,
      evidence: {
        projectId,
        result: finalRuntime?.result || null,
        turnCount: finalRuntime?.turnCount || null,
        lastLevelResultReason: finalRuntime?.lastLevelResultReason || null,
        traceTail: finalRuntime?.traceTail || [],
        documentedException: finalException
      },
      relatedFiles: uniquePaths([sourcePath, finalFixture?.filePath])
    })
  );

  return checks;
}

function buildUnknownLevelError(levelId, levelIds) {
  const lower = String(levelId || "").toLowerCase();
  const scored = levelIds
    .map((candidate) => {
      const normalized = candidate.toLowerCase();
      let score = 0;
      if (normalized === lower) {
        score -= 100;
      }
      if (normalized.includes(lower) || lower.includes(normalized)) {
        score -= 20;
      }
      score += levenshteinDistance(lower, normalized);
      return { candidate, score };
    })
    .sort((left, right) => left.score - right.score || left.candidate.localeCompare(right.candidate))
    .slice(0, 5)
    .map((entry) => entry.candidate);

  return new Error(`Unknown level id "${levelId}". Nearby ids: ${scored.join(", ") || "(none)"}.`);
}

function levenshteinDistance(a, b) {
  const left = String(a || "");
  const right = String(b || "");
  if (left === right) {
    return 0;
  }
  if (!left.length) {
    return right.length;
  }
  if (!right.length) {
    return left.length;
  }

  const matrix = Array.from({ length: left.length + 1 }, () => new Array(right.length + 1).fill(0));
  for (let i = 0; i <= left.length; i += 1) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= right.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= left.length; i += 1) {
    for (let j = 1; j <= right.length; j += 1) {
      const cost = left[i - 1] === right[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[left.length][right.length];
}

export function buildLevelReadinessResultFromContext(levelId, context, options = {}) {
  const level = context.levelById.get(levelId) || null;
  if (!level) {
    throw buildUnknownLevelError(levelId, context.levels.map((entry) => entry.id));
  }

  const manifestEntry = GUIDED_LEVEL_MANIFEST.find((entry) => entry.id === level.id) || null;
  const sourcePath = level.sourcePath || null;
  const conceptMatrixRow = findConceptMatrixRow(level, context.conceptMatrixRows);
  const lintDiagnostics = getRelevantLintDiagnostics(level, context.lintDiagnostics);
  const checks = [
    buildConceptMatrixCheck(level, conceptMatrixRow, sourcePath),
    buildLintCheck(level, lintDiagnostics, sourcePath, conceptMatrixRow),
    ...buildReferenceLevelChecks(level, context, sourcePath, conceptMatrixRow),
    ...(level.project?.id ? buildProjectLevelChecks(level, context, sourcePath) : [] )
  ];

  const ordinaryLevel =
    level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT &&
    !level.project &&
    level.levelKind !== "prediction";
  let runtime = {
    kind: "not_applicable",
    reason:
      level.levelKind === "prediction"
        ? "prediction level requires a choice before play"
        : level.humanTurnBehavior === HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT
          ? "human-input level requires live player input"
          : level.project
            ? "project level uses project checkpoint fixtures"
            : "reference simulation is not applicable"
  };

  if (ordinaryLevel) {
    const ref = context.referenceSolutionsByLevelId.get(level.id) || null;
    if (ref) {
      runtime = {
        kind: "reference",
        reference: {
          path: ref.filePath,
          result: null,
          turnCount: null,
          lastLevelResultReason: null,
          traceTail: []
        }
      };
      const sim = runLevelSimulation(level, ref.xmlText);
      runtime.reference.result = sim.result;
      runtime.reference.turnCount = sim.turnCount;
      runtime.reference.lastLevelResultReason = sim.lastLevelResultReason;
      runtime.reference.traceTail = sim.traceTail;
    }
  } else if (level.project?.id) {
    const projectId = level.project.id;
    const projectPolicy = PROJECT_READINESS_POLICY[projectId] || null;
    const projectFixtures = context.projectFixturesById.get(projectId) || null;
    runtime = {
      kind: "project",
      projectId,
      step: null,
      final: null
    };
    const stepFixture = projectFixtures?.stepFixtures?.get(level.project.step) || null;
    const finalFixture = projectFixtures?.finalFixture || null;
    if (stepFixture) {
      const sim = runLevelSimulation(level, stepFixture.xmlText, {
        randomFn: projectId === "strategy-brain" ? createSeededRandom("0") : null
      });
      runtime.step = {
        path: stepFixture.filePath,
        result: sim.result,
        turnCount: sim.turnCount,
        lastLevelResultReason: sim.lastLevelResultReason,
        traceTail: sim.traceTail,
        documentedException: projectPolicy?.stepExceptions?.[level.id] || null
      };
    }
    if (finalFixture) {
      const sim = runLevelSimulation(level, finalFixture.xmlText, {
        randomFn: projectId === "strategy-brain" ? createSeededRandom("0") : null
      });
      runtime.final = {
        path: finalFixture.filePath,
        result: sim.result,
        turnCount: sim.turnCount,
        lastLevelResultReason: sim.lastLevelResultReason,
        traceTail: sim.traceTail,
        documentedException: projectPolicy?.cumulativeExceptions?.[level.id] || null
      };
    }
  }

  const result = {
    levelId: level.id,
    found: true,
    sourcePath,
    title: level.title,
    order: manifestEntry?.order ?? null,
    levelKind: level.levelKind || null,
    project: level.project ? structuredClone(level.project) : null,
    conceptMatrixRow,
    fixtures: buildFixtureSummary(level, context, runtime),
    checks,
    validationCommands: buildValidationCommands(level),
    runtime
  };

  if (options.includeGeneratedAt) {
    result.generatedAt = new Date().toISOString();
  }

  return result;
}

export async function buildLevelReadinessResult(levelId, options = {}) {
  const context = await loadReadinessContext();
  return buildLevelReadinessResultFromContext(levelId, context, options);
}

function buildFixtureSummary(level, context, runtime) {
  if (level.project?.id) {
    const projectId = level.project.id;
    const projectFixtures = context.projectFixturesById.get(projectId) || null;
    const policy = PROJECT_READINESS_POLICY[projectId] || null;
    return {
      referenceSolution: {
        applicability: "not_applicable",
        path: null,
        exists: false
      },
      project: {
        projectId,
        step: {
          path: projectFixtures?.stepFixtures?.get(level.project.step)?.filePath || null,
          exists: Boolean(projectFixtures?.stepFixtures?.get(level.project.step)),
          applicability: "required",
          documentedException: policy?.stepExceptions?.[level.id] || null
        },
        final: {
          path: projectFixtures?.finalFixture?.filePath || null,
          exists: Boolean(projectFixtures?.finalFixture),
          applicability: "required",
          documentedException: policy?.cumulativeExceptions?.[level.id] || null
        }
      }
    };
  }

  const ref = context.referenceSolutionsByLevelId.get(level.id) || null;
  const ordinaryLevel =
    level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT &&
    !level.project &&
    level.levelKind !== "prediction";
  return {
    referenceSolution: {
      path: ref?.filePath || null,
      exists: Boolean(ref),
      applicability: ordinaryLevel ? "required" : "not_applicable"
    },
    project: null
  };
}

function buildValidationCommands(level) {
  const commandLevel = level.id;
  return [
    {
      label: "Targeted readiness JSON",
      command: `npm run level:readiness -- --level ${commandLevel} --json`
    },
    {
      label: "Targeted readiness summary",
      command: `npm run level:readiness -- --level ${commandLevel}`
    },
    {
      label: "Level linter",
      command: "npm run lint:levels"
    },
    {
      label: "Guided solution and contract tests",
      command:
        "node --test --test-isolation=none tests/unit/guided-reference-solutions.test.js tests/unit/guided-project-solutions.test.js tests/unit/guided-level-contracts.test.js tests/unit/guided-bug-hunt-contracts.test.js tests/unit/level-readiness.test.js"
    },
    {
      label: "Full test suite",
      command: "npm test"
    },
    {
      label: "Production build",
      command: "npm run build"
    }
  ];
}

export async function formatLevelReadinessReport(levelId, options = {}) {
  const result = await buildLevelReadinessResult(levelId, options);
  return formatReadinessSummary(result);
}

export function formatReadinessSummary(result) {
  const lines = [];
  lines.push(`Level readiness: ${result.title} (${result.levelId})`);
  lines.push(`- source: ${result.sourcePath || "(missing)"}`);
  lines.push(`- order: ${result.order ?? "(missing)"} | kind: ${result.levelKind || "(missing)"}`);
  if (result.project) {
    lines.push(`- project: ${result.project.id} step ${result.project.step}${result.project.isCapstone ? " (capstone)" : ""}`);
  } else {
    lines.push(`- project: none`);
  }
  lines.push(`- concept matrix: ${result.conceptMatrixRow ? "matched" : "missing"}`);

  for (const check of result.checks) {
    lines.push(`- ${check.label}: ${check.status} — ${check.message}`);
  }

  lines.push("Validation commands:");
  for (const command of result.validationCommands) {
    lines.push(`  - ${command.command}`);
  }
  lines.push("Use --json for machine-readable output.");
  return lines.join("\n");
}

export async function loadLevelReadinessResult(levelId, options = {}) {
  return buildLevelReadinessResult(levelId, options);
}
