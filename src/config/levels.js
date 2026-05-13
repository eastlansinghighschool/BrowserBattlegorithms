import { getLevelDefinitions as getLevels } from "./levels/index.js";
import { createInitialLevelProgress as createProgress } from "./levels/shared/levelProgress.js";

export function getLevelDefinitions() {
  return getLevels();
}

export function createInitialLevelProgress() {
  return createProgress(getLevels());
}
