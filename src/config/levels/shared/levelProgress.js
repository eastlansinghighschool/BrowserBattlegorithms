import { LEVEL_STATUS, UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING } from "../../constants.js";

export function createInitialLevelProgress(levelDefinitions) {
  return Object.fromEntries(
    levelDefinitions.map((level, index) => [
      level.id,
      UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING
        ? LEVEL_STATUS.AVAILABLE
        : (index === 0 ? LEVEL_STATUS.AVAILABLE : LEVEL_STATUS.LOCKED)
    ])
  );
}
