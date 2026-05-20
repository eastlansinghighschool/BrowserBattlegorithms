import { getLevelDefinitions } from "../config/levels.js";
import { GUIDED_LEVEL_MANIFEST } from "../config/levels/manifest.js";
import { runLevelLint } from "../dev/levelLint.js";

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

function loadProjectFixtureIndex(projectFixturesByPath) {
  const byProjectId = new Map();

  for (const [filePath, xmlText] of projectFixturesByPath.entries()) {
    const match = filePath.match(/^tests\/unit\/fixtures\/guided-project-solutions\/([^/]+)\/(step-(\d+)|final)\.xml$/);
    if (!match) {
      continue;
    }

    const projectId = match[1];
    const projectEntry = byProjectId.get(projectId) || {
      stepFixtures: new Map(),
      finalFixture: null
    };

    if (match[2] === "final") {
      projectEntry.finalFixture = { xmlText, filePath };
    } else {
      projectEntry.stepFixtures.set(Number(match[3]), { xmlText, filePath });
    }

    byProjectId.set(projectId, projectEntry);
  }

  return byProjectId;
}

function getLevelFixtureTargetOptions(level) {
  if (!level) {
    return [];
  }
  if (level.project?.id) {
    return [
      { value: "step", label: "Project step fixture" },
      { value: "final", label: "Project final fixture" }
    ];
  }
  if (level.levelKind === "prediction" || level.humanTurnBehavior === "WAIT_FOR_INPUT") {
    return [];
  }
  return [{ value: "reference", label: "Reference fixture" }];
}

async function loadWorkbenchShellContext() {
  if (!globalThis[WORKBENCH_CONTEXT_PROMISE_KEY]) {
    globalThis[WORKBENCH_CONTEXT_PROMISE_KEY] = (async () => {
      const levels = getLevelDefinitions().map((level) => structuredClone(level));
      return {
        levels,
        levelById: new Map(levels.map((level) => [level.id, level]))
      };
    })();
  }

  return globalThis[WORKBENCH_CONTEXT_PROMISE_KEY];
}

async function loadWorkbenchReadinessContext(shellContext) {
  if (!shellContext.readinessContextPromise) {
    shellContext.readinessContextPromise = (async () => {
      const { buildLevelReadinessResultFromContext } = await import("../dev/levelReadiness.js");
      const [levelSourcePathById, assetTextMaps] = await Promise.all([
        loadLevelSourcePathMap(),
        loadWorkbenchAssetTextMaps()
      ]);
      const { conceptMatrixMarkdownByPath, referenceSolutionsByPath, projectFixturesByPath } = assetTextMaps;
      const conceptMatrixMarkdown = conceptMatrixMarkdownByPath.get("docs/GUIDED_LEVEL_CONCEPT_MATRIX.md") || "";
      const conceptMatrixRows = parseConceptMatrixRows(conceptMatrixMarkdown || "");
      const levels = shellContext.levels.map((level) => ({
        ...level,
        sourcePath: levelSourcePathById.get(level.id) || null
      }));
      const levelById = new Map(levels.map((level) => [level.id, level]));
      const referenceSolutionsByLevelId = new Map();
      const projectFixturesById = loadProjectFixtureIndex(projectFixturesByPath);

      for (const level of levels) {
        const referenceSolution = await loadReferenceSolutionForLevel(level, referenceSolutionsByPath);
        if (referenceSolution) {
          referenceSolutionsByLevelId.set(level.id, referenceSolution);
        }
      }

      const lintDiagnostics = runLevelLint({
        levels,
        conceptMatrix: conceptMatrixRows,
        referenceSolutionsByLevelId
      });

      return {
        buildLevelReadinessResultFromContext,
        levels,
        levelById,
        conceptMatrixRows,
        referenceSolutionsByLevelId,
        projectFixturesById,
        lintDiagnostics
      };
    })();
  }

  return shellContext.readinessContextPromise;
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
    getLevel(levelId) {
      const level = shellContext.levelById.get(levelId) || null;
      return level ? structuredClone(level) : null;
    },
    async getFixtureTargetOptions(levelId) {
      const level = shellContext.levelById.get(levelId) || null;
      return getLevelFixtureTargetOptions(level);
    },
    async getFixtureDescriptor(levelId, targetKind = null) {
      const readinessContext = await loadWorkbenchReadinessContext(shellContext);
      const level = readinessContext.levelById.get(levelId) || null;
      if (!level) {
        return null;
      }
      if (level.project?.id) {
        if (!targetKind) {
          return null;
        }
        const projectFixtures = readinessContext.projectFixturesById.get(level.project.id) || null;
        if (!projectFixtures) {
          return null;
        }
        if (targetKind === "step") {
          const stepFixture = projectFixtures.stepFixtures.get(level.project.step) || null;
          return stepFixture
            ? {
                kind: "step",
                label: "Project step fixture",
                path: stepFixture.filePath,
                xmlText: stepFixture.xmlText,
                exists: true
              }
            : null;
        }
        if (targetKind === "final") {
          const finalFixture = projectFixtures.finalFixture || null;
          return finalFixture
            ? {
                kind: "final",
                label: "Project final fixture",
                path: finalFixture.filePath,
                xmlText: finalFixture.xmlText,
                exists: true
              }
            : null;
        }
        return null;
      }

      if (targetKind && targetKind !== "reference") {
        return null;
      }
      const referenceSolution = readinessContext.referenceSolutionsByLevelId.get(level.id) || null;
      return referenceSolution
        ? {
            kind: "reference",
            label: "Reference fixture",
            path: referenceSolution.filePath,
            xmlText: referenceSolution.xmlText,
            exists: true
          }
        : null;
    },
    async getResult(levelId) {
      const readinessContext = await loadWorkbenchReadinessContext(shellContext);
      return readinessContext.buildLevelReadinessResultFromContext(levelId, readinessContext);
    }
  };
}
