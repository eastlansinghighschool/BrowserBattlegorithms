function normalizeXmlForComparison(xmlText) {
  return String(xmlText || "")
    .replace(/\s+(x|y)="[^"]*"/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
}

function parseXmlBlockTypes(xmlText) {
  const blockTypes = [];
  const regex = /<block\b[^>]*\btype="([^"]+)"/g;
  for (const match of String(xmlText || "").matchAll(regex)) {
    blockTypes.push(match[1]);
  }
  return blockTypes;
}

function getFailureConditions(level) {
  if (Array.isArray(level.failureConditions) && level.failureConditions.length > 0) {
    return level.failureConditions;
  }
  return level.failureCondition ? [level.failureCondition] : [];
}

function makeDiagnostic({ severity, levelId, contract, message, file }) {
  return { severity, levelId, contract, message, file: file || null };
}

function collectDemoBlocklyXml(level) {
  const xmls = [];
  for (const step of level.tutorialSteps || []) {
    if (step?.demoBlocklyXml) {
      xmls.push(step.demoBlocklyXml);
    }
  }
  return xmls;
}

function checkReferenceSolutionToolboxCompatibility(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];
  for (const level of levels) {
    const ref = referenceSolutionsByLevelId.get(level.id);
    if (!ref) {
      continue;
    }
    const toolboxBlockTypes = new Set(level.toolboxBlockTypes || []);
    const blockTypes = parseXmlBlockTypes(ref.xmlText);
    const missing = [...new Set(blockTypes)].filter((blockType) => !toolboxBlockTypes.has(blockType));
    if (missing.length > 0) {
      diagnostics.push(
        makeDiagnostic({
          severity: "warning",
          levelId: level.id,
          contract: "reference-solution-toolbox-compatibility",
          message: `reference fixture uses blocks not present in the authored toolbox: ${missing.join(", ")}`,
          file: ref.filePath
        })
      );
    }
  }
  return diagnostics;
}

function checkDemoBlocklyDoesNotSolveLevel(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];
  for (const level of levels) {
    const ref = referenceSolutionsByLevelId.get(level.id);
    if (!ref) {
      continue;
    }
    const normalizedRef = normalizeXmlForComparison(ref.xmlText);
    for (const demoXml of collectDemoBlocklyXml(level)) {
      if (normalizeXmlForComparison(demoXml) === normalizedRef) {
        diagnostics.push(
          makeDiagnostic({
            severity: "warning",
            levelId: level.id,
            contract: "demo-does-not-solve-level",
            message: "at least one demo Blockly step matches the reference solution",
            file: ref.filePath
          })
        );
        break;
      }
    }
  }
  return diagnostics;
}

function checkTurnLimitFloor(levels, minTurnLimit = 8) {
  const diagnostics = [];
  for (const level of levels) {
    const turnLimit = level.failureConditions?.find((condition) => condition?.type === "turn_limit_exceeded")?.maxTurns
      ?? level.failureCondition?.maxTurns
      ?? null;
    if (turnLimit !== null && turnLimit < minTurnLimit) {
      diagnostics.push(
        makeDiagnostic({
          severity: "error",
          levelId: level.id,
          contract: "turn-limit-floor",
          message: `turn limit ${turnLimit} is lower than the floor of ${minTurnLimit}`,
          file: level.sourcePath || null
        })
      );
    }
  }
  return diagnostics;
}

function checkReferenceSolutionFixtureNameMatchesLevelId(levels, { referenceSolutionsByLevelId = new Map() } = {}) {
  const diagnostics = [];
  for (const level of levels) {
    const ref = referenceSolutionsByLevelId.get(level.id);
    if (!ref) {
      diagnostics.push(
        makeDiagnostic({
          severity: "error",
          levelId: level.id,
          contract: "reference-solution-fixture-name-matches-level-id",
          message: `missing reference fixture for ${level.id}`,
          file: level.sourcePath || null
        })
      );
      continue;
    }
    if (!ref.filePath.endsWith(`${level.id}.xml`)) {
      diagnostics.push(
        makeDiagnostic({
          severity: "warning",
          levelId: level.id,
          contract: "reference-solution-fixture-name-matches-level-id",
          message: `reference fixture path does not match level id: ${ref.filePath}`,
          file: ref.filePath
        })
      );
    }
  }
  return diagnostics;
}

function checkProjectMetadata(levels) {
  const diagnostics = [];
  for (const level of levels) {
    if (!level.project) {
      continue;
    }
    if (!level.project.id || !Number.isInteger(level.project.step)) {
      diagnostics.push(
        makeDiagnostic({
          severity: "error",
          levelId: level.id,
          contract: "project-metadata",
          message: "project levels must include a project id and integer step",
          file: level.sourcePath || null
        })
      );
    }
  }
  return diagnostics;
}

function checkWinConditionRequiresNamedMechanic(levels) {
  const diagnostics = [];
  for (const level of levels) {
    if (!level.winCondition?.type) {
      diagnostics.push(
        makeDiagnostic({
          severity: "error",
          levelId: level.id,
          contract: "win-condition-requires-named-mechanic",
          message: "win condition must declare a type",
          file: level.sourcePath || null
        })
      );
    }
  }
  return diagnostics;
}

function checkFlagSetupGameSpecCompliance() {
  return [];
}

export function runWorkbenchLint({
  levels,
  referenceSolutionsByLevelId = new Map(),
  minTurnLimit = 8
}) {
  return [
    ...checkReferenceSolutionToolboxCompatibility(levels, { referenceSolutionsByLevelId }),
    ...checkDemoBlocklyDoesNotSolveLevel(levels, { referenceSolutionsByLevelId }),
    ...checkProjectMetadata(levels),
    ...checkWinConditionRequiresNamedMechanic(levels),
    ...checkTurnLimitFloor(levels, minTurnLimit),
    ...checkReferenceSolutionFixtureNameMatchesLevelId(levels, { referenceSolutionsByLevelId }),
    ...checkFlagSetupGameSpecCompliance(levels)
  ];
}
