import foundations from "./phases/foundations/index.js";
import sensing from "./phases/sensing/index.js";
import movementHelpers from "./phases/movement-helpers/index.js";
import resourcesAndTerritory from "./phases/resources-and-territory/index.js";
import advancedLogic from "./phases/advanced-logic/index.js";
import advancedTeamplay from "./phases/advanced-teamplay/index.js";
import optional from "./phases/optional/index.js";
import { normalizeLegacyLevelSetup } from "./shared/normalizeSetup.js";
import { hashStarterXml } from "../../ai/blockly/starterVersioning.js";

const RAW_LEVEL_DEFINITIONS = [
  ...foundations,
  ...sensing,
  ...movementHelpers,
  ...resourcesAndTerritory,
  ...advancedLogic,
  ...advancedTeamplay,
  ...optional
];

export function getLevelDefinitions() {
  return RAW_LEVEL_DEFINITIONS.map((level) => ({
    ...level,
    toolboxBlockTypes: [...level.toolboxBlockTypes],
    sensorObjectTypes: [...(level.sensorObjectTypes || [])],
    sensorRelationTypes: [...(level.sensorRelationTypes || [])],
    moveTowardTargetTypes: [...(level.moveTowardTargetTypes || [])],
    tips: [...(level.tips || [])],
    legendItems: structuredClone(level.legendItems || []),
    tutorialSteps: structuredClone(level.tutorialSteps || []),
    project: level.project ? structuredClone(level.project) : null,
    winCondition: { ...level.winCondition },
    failureConditions: Array.isArray(level.failureConditions)
      ? structuredClone(level.failureConditions)
      : level.failureCondition
        ? [{ ...level.failureCondition }]
        : [],
    failureCondition: level.failureCondition
      ? { ...level.failureCondition }
      : Array.isArray(level.failureConditions) && level.failureConditions[0]
        ? { ...level.failureConditions[0] }
        : null,
    setup: normalizeLegacyLevelSetup(level.setup || level.setupOverrides),
    // Plan 45: content-derived hash for stale-replace versioning (Decision 4 approach b).
    // Null for levels without a starter (those are not subject to stale-replace).
    starterXmlVersion: level.initialBlocklyXml ? hashStarterXml(level.initialBlocklyXml) : null
  }));
}
