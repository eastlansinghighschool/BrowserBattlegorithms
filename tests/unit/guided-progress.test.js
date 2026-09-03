import test from "node:test";
import assert from "node:assert/strict";
import { getLevelDefinitions } from "../../src/config/levels/index.js";
import {
  appendUsageEvent,
  createUsageSession
} from "../../src/usage/usageFormat.js";
import { buildUsageExportWithIntegrity } from "../../src/usage/usageAnalyzer.js";
import {
  buildGuidedLevelProgressCatalog,
  deriveGuidedProgress,
  formatGuidedProgressLabel
} from "../../src/usage/guidedProgress.js";
import { initializeLevelState, completeLevel } from "../../src/core/levels.js";
import { LEVEL_STATUS, LEVEL_RESULT } from "../../src/config/constants.js";
import { setStorageForTesting } from "../../src/platform/safeStorage.js";

const GUIDED_LEVEL_CATALOG = buildGuidedLevelProgressCatalog(getLevelDefinitions());

function buildExport(events, { studentName = "Ada Lovelace", sessionId = "guided-progress-test", exportedAt = "2026-05-13T10:15:00.000Z" } = {}) {
  const session = createUsageSession({ sessionId, startedAt: "2026-05-13T10:00:00.000Z", updatedAt: "2026-05-13T10:15:00.000Z" });
  for (const { type, data, at } of events) {
    appendUsageEvent(session, type, data, at);
  }
  return buildUsageExportWithIntegrity(session, studentName, exportedAt);
}

function deriveFromEvents(events, options = {}) {
  const payload = buildExport(events, options);
  return deriveGuidedProgress({
    events: payload.events,
    summary: payload.summary,
    levelCatalog: GUIDED_LEVEL_CATALOG
  });
}

function start(levelId, at, extra = {}) {
  return {
    type: "level_started",
    at,
    data: {
      levelId,
      modeView: "GUIDED_LEVELS",
      mapKey: "wideAisle",
      levelKind: extra.levelKind || "guided",
      turnNumber: extra.turnNumber || 1,
      attemptNumber: extra.attemptNumber || 1
    }
  };
}

function complete(levelId, result, at, extra = {}) {
  return {
    type: "level_completed",
    at,
    data: {
      levelId,
      modeView: "GUIDED_LEVELS",
      mapKey: "wideAisle",
      levelKind: extra.levelKind || "guided",
      result,
      turnNumber: extra.turnNumber || 1,
      turnsSpent: extra.turnsSpent || 1
    }
  };
}

test("catalog marks optional labs as optional aside and not required progression", () => {
  const optionalEntry = GUIDED_LEVEL_CATALOG.find((entry) => entry.levelId === "optional-random-lab");
  const challengeEntry = GUIDED_LEVEL_CATALOG.find((entry) => entry.levelId === "show-what-you-know");

  assert.ok(optionalEntry, "optional lab exists in catalog");
  assert.equal(optionalEntry.isOptionalAside, true);
  assert.equal(optionalEntry.isRequiredProgression, false);
  assert.equal(optionalEntry.isChallenge, false);

  assert.ok(challengeEntry, "challenge level exists in catalog");
  assert.equal(challengeEntry.isChallenge, true);
  assert.equal(challengeEntry.isRequiredProgression, true);
});

test("highest reached stays on the highest required level even after revisiting an earlier level", () => {
  const progress = deriveFromEvents([
    start("move-to-target", "2026-05-13T10:00:02.000Z", { turnNumber: 1, attemptNumber: 1 }),
    complete("move-to-target", "PASSED", "2026-05-13T10:01:00.000Z", { turnNumber: 3, turnsSpent: 3 }),
    start("enemy-nearby", "2026-05-13T10:02:00.000Z", { turnNumber: 4, attemptNumber: 2 }),
    complete("enemy-nearby", "PASSED", "2026-05-13T10:03:00.000Z", { turnNumber: 7, turnsSpent: 3 }),
    start("move-to-target", "2026-05-13T10:04:00.000Z", { turnNumber: 8, attemptNumber: 3 }),
    start("optional-random-lab", "2026-05-13T10:05:00.000Z", { levelKind: null, turnNumber: 9, attemptNumber: 4 })
  ]);

  assert.equal(progress.highestReached.levelId, "enemy-nearby");
  assert.equal(progress.latestGuidedActivity.levelId, "optional-random-lab");
  assert.equal(progress.latestGuidedActivity.eventType, "level_started");
});

test("highest passed ignores later required levels that only failed", () => {
  const progress = deriveFromEvents([
    start("move-to-target", "2026-05-13T10:00:02.000Z", { turnNumber: 1, attemptNumber: 1 }),
    complete("move-to-target", "PASSED", "2026-05-13T10:01:00.000Z", { turnNumber: 3, turnsSpent: 3 }),
    start("enemy-nearby", "2026-05-13T10:02:00.000Z", { turnNumber: 4, attemptNumber: 2 }),
    complete("enemy-nearby", "FAILED", "2026-05-13T10:03:00.000Z", { turnNumber: 7, turnsSpent: 3 })
  ]);

  assert.equal(progress.highestPassed.levelId, "move-to-target");
  assert.equal(progress.highestReached.levelId, "enemy-nearby");
});

test("optional labs do not inflate highest reached or highest passed", () => {
  const progress = deriveFromEvents([
    start("move-to-target", "2026-05-13T10:00:02.000Z", { turnNumber: 1, attemptNumber: 1 }),
    complete("move-to-target", "PASSED", "2026-05-13T10:01:00.000Z", { turnNumber: 3, turnsSpent: 3 }),
    start("optional-random-lab", "2026-05-13T10:02:00.000Z", { levelKind: null, turnNumber: 4, attemptNumber: 2 }),
    complete("optional-random-lab", "PASSED", "2026-05-13T10:03:00.000Z", { levelKind: null, turnNumber: 6, turnsSpent: 2 })
  ]);

  assert.equal(progress.highestReached.levelId, "move-to-target");
  assert.equal(progress.highestPassed.levelId, "move-to-target");
  assert.equal(progress.highestPassedChallenge, null);
});

test("contiguous passed-through stops at the first missed required level", () => {
  const progress = deriveFromEvents([
    start("move-to-target", "2026-05-13T10:00:02.000Z", { turnNumber: 1, attemptNumber: 1 }),
    complete("move-to-target", "PASSED", "2026-05-13T10:01:00.000Z", { turnNumber: 3, turnsSpent: 3 }),
    start("enemy-nearby", "2026-05-13T10:02:00.000Z", { turnNumber: 4, attemptNumber: 2 }),
    complete("enemy-nearby", "FAILED", "2026-05-13T10:03:00.000Z", { turnNumber: 7, turnsSpent: 3 }),
    start("show-what-you-know", "2026-05-13T10:04:00.000Z", { levelKind: "challenge", turnNumber: 8, attemptNumber: 3 }),
    complete("show-what-you-know", "PASSED", "2026-05-13T10:10:00.000Z", { levelKind: "challenge", turnNumber: 18, turnsSpent: 10 })
  ]);

  assert.equal(progress.highestPassed.levelId, "show-what-you-know");
  assert.equal(progress.contiguousPassedThrough.levelId, "move-to-target");
  assert.equal(formatGuidedProgressLabel(progress.highestPassedChallenge), "Challenge 22: Show What You Know");
});

test("repeated attempts aggregate per level", () => {
  const progress = deriveFromEvents([
    start("move-to-target", "2026-05-13T10:00:02.000Z", { turnNumber: 1, attemptNumber: 1 }),
    complete("move-to-target", "PASSED", "2026-05-13T10:01:00.000Z", { turnNumber: 3, turnsSpent: 3 }),
    start("move-to-target", "2026-05-13T10:02:00.000Z", { turnNumber: 4, attemptNumber: 2 }),
    complete("move-to-target", "FAILED", "2026-05-13T10:03:00.000Z", { turnNumber: 6, turnsSpent: 2 })
  ]);

  const entry = progress.guidedLevelProgress.find((item) => item.levelId === "move-to-target");
  assert.ok(entry);
  assert.equal(entry.startedCount, 2);
  assert.equal(entry.passedCount, 1);
  assert.equal(entry.failedCount, 1);
  assert.equal(entry.revisits, 1);
  assert.equal(entry.turnsSpent, 5);
});

test("unknown level ids are preserved and trigger a review signal", () => {
  const progress = deriveFromEvents([
    start("mystery-level", "2026-05-13T10:00:02.000Z", { turnNumber: 1, attemptNumber: 1 }),
    complete("mystery-level", "PASSED", "2026-05-13T10:01:00.000Z", { turnNumber: 4, turnsSpent: 4 })
  ]);

  assert.deepEqual(progress.unknownLevelIds, ["mystery-level"]);
  assert.equal(progress.needsReview, true);
  assert.ok(progress.reviewSignals.some((signal) => signal.type === "unknown_level_ids"));
  assert.ok(progress.guidedLevelProgress.some((entry) => entry.isUnknown && entry.levelId === "mystery-level"));
});

test("guided progression under throwing storage returns default locked state and writing does not throw", () => {
  const throwingStorage = {
    getItem() {
      const err = new Error("Blocked by policy");
      err.name = "SecurityError";
      throw err;
    },
    setItem() {
      const err = new Error("Blocked by policy");
      err.name = "SecurityError";
      throw err;
    },
    removeItem() {
      const err = new Error("Blocked by policy");
      err.name = "SecurityError";
      throw err;
    }
  };

  setStorageForTesting(throwingStorage);

  try {
    const app = {
      state: {},
      ui: {},
      hooks: {}
    };

    // Initialize level state with throwing storage
    assert.doesNotThrow(() => {
      initializeLevelState(app);
    });

    // Verify initial unlock state is default locked state
    assert.equal(app.state.levels.length > 0, true);
    const firstLevelId = app.state.levels[0].id;
    assert.equal(app.state.levelProgress[firstLevelId], LEVEL_STATUS.AVAILABLE);

    for (let i = 1; i < app.state.levels.length; i++) {
      const levelId = app.state.levels[i].id;
      assert.equal(
        app.state.levelProgress[levelId],
        LEVEL_STATUS.LOCKED,
        `Level "${levelId}" must remain LOCKED by default; no unlocks fabricated under blocked storage`
      );
    }

    // Now complete the first level to trigger savePersistedGuidedProgression
    assert.doesNotThrow(() => {
      completeLevel(app, LEVEL_RESULT.PASSED, "win_condition_met");
    });

    // In-memory state advances next level in current session
    const secondLevelId = app.state.levels[1].id;
    assert.equal(app.state.levelProgress[secondLevelId], LEVEL_STATUS.AVAILABLE);

    // But persistent storage was throwing, so re-initializing a new app state returns the clean default
    const freshApp = {
      state: {},
      ui: {},
      hooks: {}
    };
    initializeLevelState(freshApp);
    assert.equal(
      freshApp.state.levelProgress[secondLevelId],
      LEVEL_STATUS.LOCKED,
      "Fresh session must return default locked state; write did not persist to blocked storage"
    );
  } finally {
    setStorageForTesting(undefined);
  }
});
