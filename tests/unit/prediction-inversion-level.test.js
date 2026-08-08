import test from "node:test";
import assert from "node:assert/strict";
import { getLevelDefinitions } from "../../src/config/levels.js";
import { selectPredictionChoice, initializeLevelState, startLevel } from "../../src/core/levels.js";
import { createApp } from "../../src/core/state.js";

test("optional-inversion-lab: level metadata and prediction configuration contract", () => {
  const levels = getLevelDefinitions();
  const level = levels.find((l) => l.id === "optional-inversion-lab");
  assert.ok(level, "optional-inversion-lab level definition exists");
  assert.equal(level.levelKind, "prediction");
  assert.equal(level.starCriteria, null, "pass-star-only prediction level has no starCriteria");
  assert.ok(level.prediction);
  assert.equal(level.prediction.choices.length, 3);
  assert.equal(level.prediction.correctChoiceId, "clear-aisle");
  assert.equal(level.prediction.choices[0].id, "clear-aisle");
  assert.equal(level.prediction.choices[1].id, "barrier-ahead");
  assert.equal(level.prediction.choices[2].id, "both-cases");
});

test("optional-inversion-lab: prediction state initialization and selection flow", () => {
  const app = createApp();
  initializeLevelState(app);
  startLevel(app, "optional-inversion-lab");

  assert.ok(app.state.predictionForCurrentLevel);
  assert.equal(app.state.predictionForCurrentLevel.choiceId, null);
  assert.equal(app.state.predictionForCurrentLevel.lockedAt, "unselected");

  // Select choice
  const selectRes1 = selectPredictionChoice(app, "barrier-ahead");
  assert.equal(selectRes1, true);
  assert.equal(app.state.predictionForCurrentLevel.choiceId, "barrier-ahead");

  // Re-select correct choice before locking
  const selectRes2 = selectPredictionChoice(app, "clear-aisle");
  assert.equal(selectRes2, true);
  assert.equal(app.state.predictionForCurrentLevel.choiceId, "clear-aisle");
});
