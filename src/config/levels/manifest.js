import { getLevelDefinitions } from "./index.js";

const LEVEL_DEFINITIONS = getLevelDefinitions();

export const GUIDED_LEVEL_MANIFEST = LEVEL_DEFINITIONS.map((level, index) => ({
  order: index + 1,
  id: level.id,
  title: level.title,
  levelKind: level.levelKind || null,
  project: level.project ? structuredClone(level.project) : null,
  hasDemoBlocklyXml: level.tutorialSteps?.some((step) => step.demoBlocklyXml),
  winConditionType: level.winCondition?.type,
  turnLimit: level.failureCondition?.maxTurns
}));
