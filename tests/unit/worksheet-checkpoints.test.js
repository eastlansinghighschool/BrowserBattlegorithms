import test from "node:test";
import assert from "node:assert/strict";
import {
  parseWorksheetCheckpointsParam,
  resolveWorksheetCheckpoints,
  getWorksheetCheckpointsFromLocation,
  initializeWorksheetCheckpoints,
  isWorksheetCheckpointLevel,
  renderWorksheetUnknownIdBanner,
  renderWorksheetResultMarker,
  renderWorksheetReminder,
  WORKSHEET_CHECKPOINT_PARAM
} from "../../src/ui/worksheetCheckpoints.js";
import { createApp } from "../../src/core/state.js";
import { getLevelDefinitions } from "../../src/config/levels.js";
import { GAME_VIEW_MODES, LEVEL_RESULT, LEVEL_STATUS } from "../../src/config/constants.js";
import { createExportPayload, createUsageSession, appendUsageEvent } from "../../src/usage/usageFormat.js";

test("parseWorksheetCheckpointsParam: parses valid comma-separated IDs", () => {
  const result = parseWorksheetCheckpointsParam("?worksheetAt=move-to-target,reach-enemy-flag");
  assert.equal(result.isPresent, true);
  assert.deepEqual(result.rawIds, ["move-to-target", "reach-enemy-flag"]);
});

test("parseWorksheetCheckpointsParam: trims whitespace and ignores empty entries and trailing commas", () => {
  const result = parseWorksheetCheckpointsParam("?worksheetAt=  move-to-target , , reach-enemy-flag,  ");
  assert.equal(result.isPresent, true);
  assert.deepEqual(result.rawIds, ["move-to-target", "reach-enemy-flag"]);
});

test("parseWorksheetCheckpointsParam: deduplicates while preserving order", () => {
  const result = parseWorksheetCheckpointsParam("?worksheetAt=move-to-target,reach-enemy-flag,move-to-target");
  assert.equal(result.isPresent, true);
  assert.deepEqual(result.rawIds, ["move-to-target", "reach-enemy-flag"]);
});

test("parseWorksheetCheckpointsParam: returns isPresent: false on absent parameter or empty query", () => {
  assert.deepEqual(parseWorksheetCheckpointsParam(""), { isPresent: false, rawIds: [] });
  assert.deepEqual(parseWorksheetCheckpointsParam("?"), { isPresent: false, rawIds: [] });
  assert.deepEqual(parseWorksheetCheckpointsParam("?otherParam=123"), { isPresent: false, rawIds: [] });
  assert.deepEqual(parseWorksheetCheckpointsParam(null), { isPresent: false, rawIds: [] });
  assert.deepEqual(parseWorksheetCheckpointsParam(undefined), { isPresent: false, rawIds: [] });
});

test("parseWorksheetCheckpointsParam: handles empty or blank parameter value", () => {
  const empty = parseWorksheetCheckpointsParam("?worksheetAt=");
  assert.equal(empty.isPresent, true);
  assert.deepEqual(empty.rawIds, []);

  const commas = parseWorksheetCheckpointsParam("?worksheetAt=,,,");
  assert.equal(commas.isPresent, true);
  assert.deepEqual(commas.rawIds, []);
});

test("F3 requirement: location.hash is strictly ignored", () => {
  // Scenario 1: search is empty, hash has worksheetAt
  const locOnlyHash = {
    search: "",
    hash: "#worksheetAt=move-to-target,reach-enemy-flag"
  };
  const result1 = getWorksheetCheckpointsFromLocation(locOnlyHash, [{ id: "move-to-target" }]);
  assert.equal(result1.isPresent, false);
  assert.equal(result1.resolvedLevelIds.size, 0);
  assert.equal(result1.unknownIds.length, 0);

  // Scenario 2: search has one param, hash has different param
  const locBoth = {
    search: "?worksheetAt=move-to-target",
    hash: "#worksheetAt=reach-enemy-flag"
  };
  const result2 = getWorksheetCheckpointsFromLocation(locBoth, [
    { id: "move-to-target" },
    { id: "reach-enemy-flag" }
  ]);
  assert.equal(result2.isPresent, true);
  assert.equal(result2.resolvedLevelIds.has("move-to-target"), true);
  assert.equal(result2.resolvedLevelIds.has("reach-enemy-flag"), false);
  assert.equal(result2.unknownIds.length, 0);
});

test("resolveWorksheetCheckpoints: resolves top-level IDs and isolates unknown IDs", () => {
  const levels = [
    { id: "move-to-target" },
    { id: "reach-enemy-flag" },
    { id: "barrier-detour" },
    { id: "sensor-barrier-branch" }
  ];

  // Nested tutorial / challenge IDs must NOT resolve as top-level levels
  const rawIds = [
    "move-to-target",
    "bughunt-22-trace",
    "reach-enemy-flag",
    "level-21-advanced-layer",
    "barrier-detour",
    "show-what-you-know-challenge",
    "sensor-barrier-branch",
    "nonexistent-level"
  ];

  const { resolvedLevelIds, unknownIds } = resolveWorksheetCheckpoints(rawIds, levels);

  // Bad IDs must NOT suppress good ones
  assert.equal(resolvedLevelIds.has("move-to-target"), true);
  assert.equal(resolvedLevelIds.has("reach-enemy-flag"), true);
  assert.equal(resolvedLevelIds.has("barrier-detour"), true);
  assert.equal(resolvedLevelIds.has("sensor-barrier-branch"), true);
  assert.equal(resolvedLevelIds.size, 4);

  // Nested IDs and nonexistent IDs land in unknownIds
  assert.deepEqual(unknownIds, [
    "bughunt-22-trace",
    "level-21-advanced-layer",
    "show-what-you-know-challenge",
    "nonexistent-level"
  ]);
});

test("resolveWorksheetCheckpoints: handles all-unknown IDs and empty inputs", () => {
  const levels = [{ id: "move-to-target" }];
  const { resolvedLevelIds, unknownIds } = resolveWorksheetCheckpoints(["bad-a", "bad-b"], levels);
  assert.equal(resolvedLevelIds.size, 0);
  assert.deepEqual(unknownIds, ["bad-a", "bad-b"]);

  const empty = resolveWorksheetCheckpoints([], levels);
  assert.equal(empty.resolvedLevelIds.size, 0);
  assert.deepEqual(empty.unknownIds, []);
});

test("Negative control: absent parameter costs nothing (no banner, no marker, no reminder)", () => {
  const app = createApp();
  app.state.levels = [{ id: "move-to-target" }, { id: "reach-enemy-flag" }];
  initializeWorksheetCheckpoints(app, { locationLike: { search: "" } });

  assert.equal(app.state.worksheetCheckpoints.isPresent, false);
  assert.equal(app.state.worksheetCheckpoints.resolvedLevelIds.size, 0);
  assert.equal(app.state.worksheetCheckpoints.unknownIds.length, 0);
  assert.equal(isWorksheetCheckpointLevel(app, "move-to-target"), false);

  const unknownBanner = renderWorksheetUnknownIdBanner(app);
  assert.equal(unknownBanner, "");

  const level = { id: "move-to-target" };
  const marker = renderWorksheetResultMarker(app, level);
  assert.equal(marker, "");

  const reminder = renderWorksheetReminder(app, level);
  assert.equal(reminder, "");
});

test("Unknown-ID notice: names bad IDs verbatim, attributes problem to the link, and is dismissible", () => {
  const app = createApp();
  app.state.levels = [{ id: "move-to-target" }, { id: "reach-enemy-flag" }];
  initializeWorksheetCheckpoints(app, {
    locationLike: { search: "?worksheetAt=move-to-target,bughunt-22-trace,bogus-level" }
  });

  const bannerHtml = renderWorksheetUnknownIdBanner(app);
  assert.match(bannerHtml, /id="worksheet-unknown-status"/);
  assert.match(bannerHtml, /bughunt-22-trace, bogus-level/);
  assert.match(bannerHtml, /This link lists worksheet checkpoints that do not match any level/);
  assert.match(bannerHtml, /The other checkpoints still work/);
  assert.match(bannerHtml, /Got it/);

  // Dismissing notice suppresses it for the tab session
  app.state.worksheetUnknownNoticeDismissed = true;
  assert.equal(renderWorksheetUnknownIdBanner(app), "");
});

test("Free Play disposition (D3): unknown-ID notice is suppressed in Free Play", () => {
  const app = createApp();
  app.state.levels = [{ id: "move-to-target" }];
  initializeWorksheetCheckpoints(app, {
    locationLike: { search: "?worksheetAt=bad-level" }
  });

  // In guided mode, banner renders
  app.state.currentModeView = GAME_VIEW_MODES.GUIDED_LEVELS;
  assert.notEqual(renderWorksheetUnknownIdBanner(app), "");

  // In free play mode, banner is suppressed
  app.state.currentModeView = GAME_VIEW_MODES.FREE_PLAY;
  assert.equal(renderWorksheetUnknownIdBanner(app), "");
});

test("R1 condition: reminder does NOT appear on entry to a checkpoint level, and DOES appear after pass", () => {
  const app = createApp();
  const level = { id: "reach-enemy-flag" };
  app.state.levels = [{ id: "move-to-target" }, level];
  initializeWorksheetCheckpoints(app, {
    locationLike: { search: "?worksheetAt=reach-enemy-flag" }
  });

  // Level entry: level has not been passed in this tab session
  assert.equal(renderWorksheetReminder(app, level), "");

  // Level passes in this tab session
  app.state.worksheetCheckpointsReached.add(level.id);

  // Now reminder appears
  const reminderHtml = renderWorksheetReminder(app, level);
  assert.match(reminderHtml, /class="lesson-worksheet-reminder"/);
  assert.match(reminderHtml, /Worksheet Checkpoint/);
  assert.match(reminderHtml, /Remember to check your worksheet for this level/);
  assert.match(reminderHtml, /data-worksheet-action="dismiss-reminder"/);
  assert.match(reminderHtml, /Got it/);
});

test("R1 condition: reminder survives level reset and is present for a second attempt", () => {
  const app = createApp();
  const level = { id: "reach-enemy-flag" };
  app.state.levels = [{ id: "move-to-target" }, level];
  initializeWorksheetCheckpoints(app, {
    locationLike: { search: "?worksheetAt=reach-enemy-flag" }
  });

  // Pass level
  app.state.worksheetCheckpointsReached.add(level.id);
  app.state.activeLevelResult = LEVEL_RESULT.PASSED;
  assert.notEqual(renderWorksheetReminder(app, level), "");

  // Reset level: activeLevelResult resets to NONE
  app.state.activeLevelResult = LEVEL_RESULT.NONE;

  // Reminder is STILL present for replay / second star attempt
  const reminderAfterReset = renderWorksheetReminder(app, level);
  assert.match(reminderAfterReset, /class="lesson-worksheet-reminder"/);

  // Dismissing reminder for this level hides it
  app.state.worksheetReminderDismissedLevels.add(level.id);
  assert.equal(renderWorksheetReminder(app, level), "");
});

test("Completion marker: appears on completion of a checkpoint level and NOT on non-checkpoint level", () => {
  const app = createApp();
  const checkpointLevel = { id: "reach-enemy-flag" };
  const nonCheckpointLevel = { id: "move-to-target" };
  app.state.levels = [nonCheckpointLevel, checkpointLevel];
  initializeWorksheetCheckpoints(app, {
    locationLike: { search: "?worksheetAt=reach-enemy-flag" }
  });

  // Non-checkpoint level
  const nonCpMarker = renderWorksheetResultMarker(app, nonCheckpointLevel);
  assert.equal(nonCpMarker, "");

  // Checkpoint level
  const cpMarker = renderWorksheetResultMarker(app, checkpointLevel);
  assert.match(cpMarker, /class="worksheet-checkpoint-marker"/);
  assert.match(cpMarker, /Check your worksheet!/);

  // R3 check: copy does NOT mention "paper"
  assert.equal(cpMarker.toLowerCase().includes("paper"), false);
});

test("D4 requirement: no worksheet field reaches the usage export payload", () => {
  const session = createUsageSession({
    sessionId: "test-session-1",
    startedAt: "2026-09-13T10:00:00.000Z"
  });

  appendUsageEvent(session, "mode_entered", {
    modeView: "GUIDED_LEVELS",
    levelId: "reach-enemy-flag"
  });

  appendUsageEvent(session, "level_completed", {
    levelId: "reach-enemy-flag",
    result: "PASSED"
  });

  const exportPayload = createExportPayload(session, "Student A");
  const payloadString = JSON.stringify(exportPayload);

  // Must not include any worksheet keys or data
  assert.equal(payloadString.includes("worksheet"), false);
  assert.equal(payloadString.includes("worksheetAt"), false);
  assert.equal(exportPayload.worksheetCheckpoints, undefined);
  assert.equal(exportPayload.worksheetCheckpointsReached, undefined);
});

test("renderResultBannerMessage integration: includes marker on checkpoint pass, excludes on fail or non-checkpoint", async () => {
  const { renderResultBannerMessage } = await import("../../src/ui/levels.js");

  const app = createApp();
  const cpLevel = { id: "reach-enemy-flag", starCriteria: { turnPar: 5 } };
  const nonCpLevel = { id: "move-to-target", starCriteria: { turnPar: 5 } };
  app.state.levels = [nonCpLevel, cpLevel];

  initializeWorksheetCheckpoints(app, {
    locationLike: { search: "?worksheetAt=reach-enemy-flag" }
  });

  // 1. Pass on checkpoint level -> banner includes marker
  app.state.activeLevelResult = LEVEL_RESULT.PASSED;
  const passCpBanner = renderResultBannerMessage(app, cpLevel, "win_condition_met");
  assert.match(passCpBanner, /level-result success/);
  assert.match(passCpBanner, /worksheet-checkpoint-marker/);
  assert.match(passCpBanner, /Check your worksheet!/);

  // 2. Pass on non-checkpoint level -> banner does NOT include marker
  const passNonCpBanner = renderResultBannerMessage(app, nonCpLevel, "win_condition_met");
  assert.match(passNonCpBanner, /level-result success/);
  assert.equal(passNonCpBanner.includes("worksheet-checkpoint-marker"), false);
  assert.equal(passNonCpBanner.includes("Check your worksheet!"), false);

  // 3. Fail on checkpoint level -> banner is failure, no marker
  app.state.activeLevelResult = LEVEL_RESULT.FAILED;
  const failBanner = renderResultBannerMessage(app, cpLevel, "turn_limit_exceeded");
  assert.match(failBanner, /level-result failure/);
  assert.equal(failBanner.includes("worksheet-checkpoint-marker"), false);
});

test("Real level definitions: resolve against getLevelDefinitions() preserves valid levels and isolates nested step IDs", () => {
  const actualLevels = getLevelDefinitions();
  assert.ok(actualLevels.length > 20);

  // Known actual top-level IDs
  const validIds = ["move-to-target", "reach-enemy-flag", "barrier-detour", "sensor-barrier-branch"];
  // Known nested step / challenge variant IDs that exist in actual level files but are not level IDs
  const nestedOrBogusIds = ["bughunt-22-trace", "level-21-advanced-layer", "show-what-you-know-challenge", "completely-bogus-id"];

  const rawIds = [...validIds, ...nestedOrBogusIds];
  const { resolvedLevelIds, unknownIds } = resolveWorksheetCheckpoints(rawIds, actualLevels);

  for (const id of validIds) {
    assert.equal(resolvedLevelIds.has(id), true, `Expected valid id ${id} to be resolved`);
  }
  assert.equal(resolvedLevelIds.size, validIds.length);

  assert.deepEqual(unknownIds, nestedOrBogusIds);
});

