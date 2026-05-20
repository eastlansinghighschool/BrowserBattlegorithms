import { getLevelDefinitions } from "../config/levels.js";
import { GUIDED_LEVEL_MANIFEST } from "../config/levels/manifest.js";

const WORKBENCH_CONTEXT_PROMISE_KEY = Symbol.for("bba.workbench.contextPromise");
const WORKBENCH_ASSET_TEXT_PROMISE_KEY = Symbol.for("bba.workbench.assetTextPromise");

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

function toRepoRelativeFromGlobKey(key) {
  return new URL(key, import.meta.url).pathname.replace(/^\//, "");
}

function toRepoRelativeTextMap(moduleEntries) {
  const byRepoRelativePath = new Map();
  for (const [key, rawText] of Object.entries(moduleEntries)) {
    byRepoRelativePath.set(toRepoRelativeFromGlobKey(key), rawText);
  }
  return byRepoRelativePath;
}

async function loadLevelSourcePathMap() {
  const moduleEntries = import.meta.glob("../config/levels/phases/**/*.js", { eager: true });
  const byLevelId = new Map();
  for (const [key, module] of Object.entries(moduleEntries)) {
    const candidate = module?.default || null;
    if (!candidate || Array.isArray(candidate) || !candidate.id) {
      continue;
    }
    byLevelId.set(candidate.id, toRepoRelativeFromGlobKey(key));
  }
  return byLevelId;
}

async function loadWorkbenchAssetTextMaps() {
  if (!globalThis[WORKBENCH_ASSET_TEXT_PROMISE_KEY]) {
    globalThis[WORKBENCH_ASSET_TEXT_PROMISE_KEY] = (async () => ({
      conceptMatrixMarkdownByPath: toRepoRelativeTextMap(import.meta.glob("../../docs/GUIDED_LEVEL_CONCEPT_MATRIX.md", { eager: true, query: "?raw", import: "default" })),
      referenceSolutionsByPath: toRepoRelativeTextMap(import.meta.glob("../../tests/unit/fixtures/guided-reference-solutions/*.xml", { eager: true, query: "?raw", import: "default" })),
      projectFixturesByPath: toRepoRelativeTextMap(import.meta.glob("../../tests/unit/fixtures/guided-project-solutions/**/*.xml", { eager: true, query: "?raw", import: "default" }))
    }))();
  }

  return globalThis[WORKBENCH_ASSET_TEXT_PROMISE_KEY];
}

async function loadReferenceSolutionForLevel(level, referenceSolutionsByPath) {
  const filePath = `tests/unit/fixtures/guided-reference-solutions/${level.id}.xml`;
  const xmlText = referenceSolutionsByPath.get(filePath) || null;
  return xmlText == null ? null : { xmlText, filePath };
}

async function loadProjectFixturesForLevel(level, projectFixturesByPath) {
  if (!level.project?.id) {
    return null;
  }

  const projectId = level.project.id;
  const stepPath = `tests/unit/fixtures/guided-project-solutions/${projectId}/step-${level.project.step}.xml`;
  const finalPath = `tests/unit/fixtures/guided-project-solutions/${projectId}/final.xml`;
  const stepXmlText = projectFixturesByPath.get(stepPath) || null;
  const finalXmlText = projectFixturesByPath.get(finalPath) || null;

  return {
    stepFixtures: new Map(
      stepXmlText == null ? [] : [[level.project.step, { xmlText: stepXmlText, filePath: stepPath }]]
    ),
    finalFixture: finalXmlText == null ? null : { xmlText: finalXmlText, filePath: finalPath }
  };
}

async function loadWorkbenchShellContext() {
  if (!globalThis[WORKBENCH_CONTEXT_PROMISE_KEY]) {
    globalThis[WORKBENCH_CONTEXT_PROMISE_KEY] = (async () => {
      const levels = getLevelDefinitions();
      return {
        levels,
        levelById: new Map(levels.map((level) => [level.id, level]))
      };
    })();
  }

  return globalThis[WORKBENCH_CONTEXT_PROMISE_KEY];
}

async function loadWorkbenchReadinessContext(shellContext, levelId) {
  if (!shellContext.readinessContextPromises) {
    shellContext.readinessContextPromises = new Map();
  }
  if (!shellContext.readinessContextPromises.has(levelId)) {
    shellContext.readinessContextPromises.set(levelId, (async () => {
      const { buildLevelReadinessResultFromContext } = await import("../dev/levelReadiness.js");
      const { runLevelLint } = await import("../dev/levelLint.js");
      const level = shellContext.levelById.get(levelId);
      const [levelSourcePathById, assetTextMaps] = await Promise.all([
        loadLevelSourcePathMap(),
        loadWorkbenchAssetTextMaps()
      ]);
      const { conceptMatrixMarkdownByPath, referenceSolutionsByPath, projectFixturesByPath } = assetTextMaps;
      const conceptMatrixMarkdown = conceptMatrixMarkdownByPath.get("docs/GUIDED_LEVEL_CONCEPT_MATRIX.md") || "";
      const referenceSolution = await loadReferenceSolutionForLevel(level, referenceSolutionsByPath);
      const projectFixturesById = await loadProjectFixturesForLevel(level, projectFixturesByPath);
      const conceptMatrixRows = parseConceptMatrixRows(conceptMatrixMarkdown || "");
      const selectedLevel = {
        ...level,
        sourcePath: levelSourcePathById.get(level.id) || null
      };
      const lintDiagnostics = runLevelLint({
        levels: [selectedLevel],
        referenceSolutionsByLevelId: referenceSolution ? new Map([[level.id, referenceSolution]]) : new Map()
      });
      return {
        buildLevelReadinessResultFromContext,
        levelSourcePathById,
        conceptMatrixRows,
        referenceSolutionsByLevelId: referenceSolution ? new Map([[level.id, referenceSolution]]) : new Map(),
        projectFixturesById,
        lintDiagnostics
      };
    })());
  }

  return shellContext.readinessContextPromises.get(levelId);
}

function getLevelSelectionOptions(levels) {
  return GUIDED_LEVEL_MANIFEST.map((entry) => {
    const level = levels.find((candidate) => candidate.id === entry.id) || null;
    return {
      id: entry.id,
      order: entry.order,
      title: entry.title,
      levelKind: entry.levelKind,
      sourcePath: level?.sourcePath || null,
      project: level?.project ? structuredClone(level.project) : null
    };
  });
}

export async function loadWorkbenchData() {
  const shellContext = await loadWorkbenchShellContext();
  const levelOptions = getLevelSelectionOptions(shellContext.levels);
  return {
    context: shellContext,
    levelOptions,
    async getResult(levelId) {
      const readinessContext = await loadWorkbenchReadinessContext(shellContext, levelId);
      const level = shellContext.levelById.get(levelId);
      return readinessContext.buildLevelReadinessResultFromContext(levelId, {
        ...shellContext,
        levels: shellContext.levels.map((candidate) => ({
          ...candidate,
          sourcePath: candidate.id === level.id ? readinessContext.levelSourcePathById.get(candidate.id) || null : candidate.sourcePath || null
        })),
        levelById: new Map(shellContext.levels.map((candidate) => [candidate.id, {
          ...candidate,
          sourcePath: candidate.id === level.id ? readinessContext.levelSourcePathById.get(candidate.id) || null : candidate.sourcePath || null
        }])),
        ...readinessContext,
        referenceSolutionsByLevelId: readinessContext.referenceSolutionsByLevelId,
        projectFixturesById: readinessContext.projectFixturesById
      });
    }
  };
}
