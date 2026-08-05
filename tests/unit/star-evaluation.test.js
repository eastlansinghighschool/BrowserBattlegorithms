import test from "node:test";
import assert from "node:assert/strict";
import { evaluateLevelStars, registerCriterionEvaluator, getCriterionEvaluator } from "../../src/core/starEvaluation.js";
import { runGuidedLevelWithSolution } from "./helpers/testHarness.js";
import { GUIDED_LEVEL_REFERENCE_SOLUTIONS } from "./fixtures/guidedReferenceSolutions.js";

test("evaluateLevelStars: absent star metadata defaults to pass-star-only", () => {
  const level = { id: "move-toward-flag" };
  const passResult = evaluateLevelStars(level, "PASSED", { turnsSpent: 13 });

  assert.deepEqual(passResult, { starsEarned: 1 });

  const failResult = evaluateLevelStars(level, "FAILED", { turnsSpent: 14 });
  assert.deepEqual(failResult, { starsEarned: 0 });
});

test("evaluateLevelStars: evaluates turnPar generous threshold correctly (turnsSpent <= turnPar)", () => {
  const level = {
    id: "bring-it-home",
    starCriteria: {
      turnPar: 25
    }
  };

  // Exactly at par (25 turns) => parBeaten = true, 2 stars
  const atParResult = evaluateLevelStars(level, "PASSED", { turnsSpent: 25 });
  assert.equal(atParResult.starsEarned, 2);
  assert.equal(atParResult.parBeaten, true);
  assert.equal(atParResult.turnPar, 25);
  assert.equal("masteryAchieved" in atParResult, false);
  assert.equal("masteryCriterionId" in atParResult, false);

  // Under par (21 turns) => parBeaten = true, 2 stars
  const underParResult = evaluateLevelStars(level, "PASSED", { turnsSpent: 21 });
  assert.equal(underParResult.starsEarned, 2);
  assert.equal(underParResult.parBeaten, true);

  // Over par (26 turns) => parBeaten = false, 1 star
  const overParResult = evaluateLevelStars(level, "PASSED", { turnsSpent: 26 });
  assert.equal(overParResult.starsEarned, 1);
  assert.equal(overParResult.parBeaten, false);
  assert.equal(overParResult.turnPar, 25);
});

test("evaluateLevelStars: handles mastery criteria and unknown criterion IDs safely", () => {
  const levelWithConcept = {
    id: "test-level",
    starCriteria: {
      turnPar: 10,
      masteryCriterionId: "concept-used",
      conceptActionTypes: ["MOVE_TOWARD"]
    }
  };

  // Par beaten + concept used => 3 stars
  const pass3Star = evaluateLevelStars(levelWithConcept, "PASSED", {
    turnsSpent: 8,
    runnerActionHistory: { runner_1: ["MOVE_FORWARD", "MOVE_TOWARD"] }
  });
  assert.equal(pass3Star.starsEarned, 3);
  assert.equal(pass3Star.parBeaten, true);
  assert.equal(pass3Star.masteryAchieved, true);
  assert.equal(pass3Star.masteryCriterionId, "concept-used");

  // Unknown criterion ID => fails open safely (false), max 2 stars if par beaten
  const levelWithUnknown = {
    id: "test-unknown",
    starCriteria: {
      turnPar: 10,
      masteryCriterionId: "unknown-future-criterion"
    }
  };
  const unknownResult = evaluateLevelStars(levelWithUnknown, "PASSED", { turnsSpent: 5 });
  assert.equal(unknownResult.starsEarned, 2);
  assert.equal(unknownResult.parBeaten, true);
  assert.equal(unknownResult.masteryAchieved, false);
  assert.equal(unknownResult.masteryCriterionId, "unknown-future-criterion");
});

test("evaluateLevelStars: failed level returns 0 stars and no star fields", () => {
  const level = {
    id: "enemy-nearby",
    starCriteria: {
      turnPar: 10
    }
  };
  const result = evaluateLevelStars(level, "FAILED", { turnsSpent: 12 });
  assert.deepEqual(result, { starsEarned: 0 });
});

test("end-of-level path populates durable learning ledger fields for pilot levels", () => {
  // Drive real end-of-level path for bring-it-home (turnPar: 25)
  const xmlText = GUIDED_LEVEL_REFERENCE_SOLUTIONS["bring-it-home"];
  const { app } = runGuidedLevelWithSolution("bring-it-home", xmlText);

  assert.equal(app.state.activeLevelResult, "PASSED");

  // Check ledger entry populated via recordLevelEnded
  const session = app.usageTrackerSessionInternal;
  const entry = session.learningLedger.guided["bring-it-home"];

  assert.ok(entry, "ledger entry for bring-it-home must exist");
  assert.equal(entry.passed, true);
  assert.equal(entry.starsEarned, 2, "reference run (21 turns <= 25 turnPar) must earn 2 stars");
  assert.equal(entry.parBeaten, true);
  assert.equal(entry.turnPar, 25);
  assert.equal("masteryAchieved" in entry, false, "pilot level must have no masteryAchieved slot populated");
  assert.equal("masteryCriterionId" in entry, false, "pilot level must have no masteryCriterionId slot populated");
});

test("end-of-level path populates durable learning ledger fields for S12 protected level", () => {
  // Drive real end-of-level path for move-toward-flag (S12 protected baseline)
  const xmlText = GUIDED_LEVEL_REFERENCE_SOLUTIONS["move-toward-flag"];
  const { app } = runGuidedLevelWithSolution("move-toward-flag", xmlText);

  assert.equal(app.state.activeLevelResult, "PASSED");

  const session = app.usageTrackerSessionInternal;
  const entry = session.learningLedger.guided["move-toward-flag"];

  assert.ok(entry, "ledger entry for move-toward-flag must exist");
  assert.equal(entry.passed, true);
  assert.equal(entry.starsEarned, 1, "S12 protected level must earn 1 pass star");
  assert.equal("parBeaten" in entry, false);
  assert.equal("turnPar" in entry, false);
  assert.equal("masteryAchieved" in entry, false);
});
