import { createApp } from "../../../src/core/state.js";
import { initializeMatch } from "../../../src/core/setup.js";
import { createRandomizedFreePlayTeamSetup } from "../../../src/core/teams.js";

export function buildMatch(options = {}) {
  const app = createApp();
  if (options.currentGameMode) {
    app.state.currentGameMode = options.currentGameMode;
  }
  const randomFn = typeof options.randomFn === "function" ? options.randomFn : () => 0;
  app.state.activeTeamSetup = createRandomizedFreePlayTeamSetup(app.state.currentGameMode, randomFn);
  initializeMatch(app);
  return app;
}
