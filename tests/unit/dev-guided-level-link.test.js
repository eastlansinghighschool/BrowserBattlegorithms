import test from "node:test";
import assert from "node:assert/strict";
import { GAME_VIEW_MODES, LEVEL_STATUS } from "../../src/config/constants.js";
import { createApp } from "../../src/core/state.js";
import { initializeLevelState } from "../../src/core/levels.js";
import {
  applyDevGuidedLevelShortcut,
  getDevGuidedLevelIdFromLocation
} from "../../src/ui/devGuidedLevelLink.js";

test("dev guided level location parser reads query and hash values", () => {
  assert.equal(getDevGuidedLevelIdFromLocation({ search: "?devGuidedLevel=closest-threat", hash: "" }), "closest-threat");
  assert.equal(getDevGuidedLevelIdFromLocation({ search: "", hash: "#devGuidedLevel=one-program-two-allies" }), "one-program-two-allies");
  assert.equal(getDevGuidedLevelIdFromLocation({ search: "?devGuidedLevel=", hash: "#devGuidedLevel=ignored" }), "ignored");
  assert.equal(getDevGuidedLevelIdFromLocation({ search: "", hash: "" }), null);
  assert.equal(getDevGuidedLevelIdFromLocation({ search: "?other=1", hash: "#still=2" }), null);
});

test("dev guided level shortcut is ignored outside dev mode", () => {
  const app = createApp();
  initializeLevelState(app);

  const result = applyDevGuidedLevelShortcut(app, {
    isDev: false,
    locationLike: { search: "?devGuidedLevel=closest-threat", hash: "" }
  });

  assert.equal(result, null);
  assert.equal(app.state.showModePicker, true);
  assert.equal(app.state.currentLevelId, "move-to-target");
  assert.equal(app.state.guidedLevelBlocklyAssistActive, false);
  assert.equal(app.state.levelProgress["closest-threat"], LEVEL_STATUS.LOCKED);
});

test("dev guided level shortcut stays inactive when no level id is provided", () => {
  const app = createApp();
  initializeLevelState(app);

  const result = applyDevGuidedLevelShortcut(app, {
    isDev: true,
    locationLike: { search: "", hash: "" }
  });

  assert.equal(result, null);
  assert.equal(app.state.guidedLevelDevAccessActive, false);
  assert.equal(app.state.guidedLevelBlocklyAssistActive, false);
  assert.equal(app.state.currentLevelId, "move-to-target");
});

test("dev guided level shortcut unlocks and selects the requested level in dev mode", () => {
  const app = createApp();
  initializeLevelState(app);

  const result = applyDevGuidedLevelShortcut(app, {
    isDev: true,
    locationLike: { search: "?devGuidedLevel=closest-threat", hash: "" }
  });

  assert.equal(result?.id, "closest-threat");
  assert.equal(app.state.showModePicker, false);
  assert.equal(app.state.guidedLevelDevAccessActive, true);
  assert.equal(app.state.guidedLevelDevAccessLevelId, "closest-threat");
  assert.equal(app.state.guidedLevelBlocklyAssistActive, true);
  assert.equal(app.state.guidedLevelBlocklyAssistApplied, false);
  assert.equal(app.state.guidedLevelBlocklyAssistLevelId, "closest-threat");
  assert.equal(app.state.currentModeView, GAME_VIEW_MODES.GUIDED_LEVELS);
  assert.equal(app.state.currentLevelId, "closest-threat");
  assert.equal(app.state.currentLevelStatus, LEVEL_STATUS.AVAILABLE);
  assert.equal(app.state.levelProgress["full-team-tactics"], LEVEL_STATUS.LOCKED);
});
