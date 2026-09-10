import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  evaluateLevelStars,
  getCriterionEvaluator
} from "../../src/core/starEvaluation.js";
import { getAttemptCounters } from "../../src/core/attemptCounters.js";
import { LEVEL_RESULT } from "../../src/config/constants.js";
import { runGuidedLevelWithSolution } from "./helpers/testHarness.js";
import {
  GUIDED_LEVEL_REFERENCE_SOLUTIONS,
  buildSolutionXml
} from "./fixtures/guidedReferenceSolutions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("no-wasted-resource: pure evaluator function behavior and fail-closed absence handling", () => {
  const evaluator = getCriterionEvaluator("no-wasted-resource");
  assert.equal(typeof evaluator, "function", "no-wasted-resource evaluator must be registered");

  // Clean run with 0 waste
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: 0, ineffectiveFreezeUses: 0 } }),
    true,
    "Clean run with 0 resource unavailable attempts and 0 ineffective freeze uses must earn criterion"
  );

  // Wasted unavailable attempt
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: 1, ineffectiveFreezeUses: 0 } }),
    false,
    "Non-zero resource unavailable attempts must fail criterion"
  );

  // Ineffective freeze use
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: 0, ineffectiveFreezeUses: 1 } }),
    false,
    "Non-zero ineffective freeze uses must fail criterion"
  );

  // Both non-zero
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: 2, ineffectiveFreezeUses: 3 } }),
    false,
    "Multiple wasted attempts must fail criterion"
  );

  // Fail-closed absent counter handling (R1 requirement)
  assert.equal(evaluator(null), false, "Null context must return false");
  assert.equal(evaluator({}), false, "Context without details must return false");
  assert.equal(evaluator({ details: {} }), false, "Empty details must return false");
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: 0 } }),
    false,
    "Missing ineffectiveFreezeUses must return false"
  );
  assert.equal(
    evaluator({ details: { ineffectiveFreezeUses: 0 } }),
    false,
    "Missing resourceUnavailableAttempts must return false"
  );
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: null, ineffectiveFreezeUses: 0 } }),
    false,
    "Null counter value must return false"
  );
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: "0", ineffectiveFreezeUses: 0 } }),
    false,
    "String counter value must return false"
  );
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: NaN, ineffectiveFreezeUses: 0 } }),
    false,
    "NaN counter value must return false"
  );
  assert.equal(
    evaluator({ details: { resourceUnavailableAttempts: Infinity, ineffectiveFreezeUses: 0 } }),
    false,
    "Non-finite counter value must return false"
  );
});

test("Plan 124 Amendment 01: no-collision is not registered", () => {
  const evaluator = getCriterionEvaluator("no-collision");
  assert.equal(
    evaluator,
    null,
    "no-collision must not be registered in the closed vocabulary (Amendment 01 scope reduction)"
  );
});

test("evaluateLevelStars: cumulative tier semantics with no-wasted-resource", () => {
  const level = {
    id: "show-what-you-know",
    starCriteria: {
      turnPar: 41,
      masteryCriterionId: "no-wasted-resource"
    }
  };

  // Par beaten + mastery achieved => 3 stars
  const pass3Star = evaluateLevelStars(level, LEVEL_RESULT.PASSED, {
    turnsSpent: 35,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  });
  assert.equal(pass3Star.starsEarned, 3);
  assert.equal(pass3Star.parBeaten, true);
  assert.equal(pass3Star.turnPar, 41);
  assert.equal(pass3Star.masteryAchieved, true);
  assert.equal(pass3Star.masteryCriterionId, "no-wasted-resource");

  // Par beaten + mastery failed (waste incurred) => 2 stars
  const pass2Star = evaluateLevelStars(level, LEVEL_RESULT.PASSED, {
    turnsSpent: 37,
    resourceUnavailableAttempts: 1,
    ineffectiveFreezeUses: 0
  });
  assert.equal(pass2Star.starsEarned, 2);
  assert.equal(pass2Star.parBeaten, true);
  assert.equal(pass2Star.masteryAchieved, false);

  // Par missed + mastery achieved => 1 star with masteryAchieved: true recorded (2026-08-05 ruling)
  const pass1StarSlow = evaluateLevelStars(level, LEVEL_RESULT.PASSED, {
    turnsSpent: 45,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  });
  assert.equal(pass1StarSlow.starsEarned, 1);
  assert.equal(pass1StarSlow.parBeaten, false);
  assert.equal(pass1StarSlow.masteryAchieved, true);

  // Level failed => 0 stars, no star outcome fields
  const failedRun = evaluateLevelStars(level, LEVEL_RESULT.FAILED, {
    turnsSpent: 30,
    resourceUnavailableAttempts: 0,
    ineffectiveFreezeUses: 0
  });
  assert.equal(failedRun.starsEarned, 0);
  assert.equal("parBeaten" in failedRun, false);
  assert.equal("masteryAchieved" in failedRun, false);
});

test("Plan 124 R4 / R5: show-what-you-know discriminating pair (reference earns 3 stars, degraded earns 2 stars)", () => {
  // Reference solution: passes in 35 turns (par 41), 0 wasted resources, earns star 3
  const refXml = GUIDED_LEVEL_REFERENCE_SOLUTIONS["show-what-you-know"];
  const { app: refApp } = runGuidedLevelWithSolution("show-what-you-know", refXml);

  assert.equal(refApp.state.activeLevelResult, LEVEL_RESULT.PASSED);
  const refCounters = getAttemptCounters(refApp.state);
  assert.equal(refCounters.resourceUnavailableAttempts, 0, "Reference run must have 0 unavailable attempts");
  assert.equal(refCounters.ineffectiveFreezeUses, 0, "Reference run must have 0 ineffective freeze uses");
  assert.equal(refCounters.mapBlockageBounces, 1, "Reference run maps 1 blockage bounce (recorded observation R5)");
  assert.equal(refApp.state.lastStarOutcome.starsEarned, 3, "Reference run must earn 3 stars");
  assert.equal(refApp.state.lastStarOutcome.parBeaten, true);
  assert.equal(refApp.state.lastStarOutcome.masteryAchieved, true);

  // Degraded solution fixture: fires Area Freeze into empty air while returning
  // Passes in 37 turns (<= 41 par), incurs ineffectiveFreezeUses: 2, earns 2 stars
  const naiveFixturePath = path.join(__dirname, "fixtures/guided-naive-solutions/show-what-you-know.xml");
  assert.ok(fs.existsSync(naiveFixturePath), "show-what-you-know.xml naive fixture must exist");
  const naiveXml = fs.readFileSync(naiveFixturePath, "utf8");

  const { app: naiveApp } = runGuidedLevelWithSolution("show-what-you-know", naiveXml);
  assert.equal(naiveApp.state.activeLevelResult, LEVEL_RESULT.PASSED, "Degraded solution must still pass the level");
  const naiveCounters = getAttemptCounters(naiveApp.state);
  assert.equal(naiveCounters.ineffectiveFreezeUses, 2, "Degraded solution must fail mastery via ineffective freeze uses");
  assert.ok(naiveApp.state.lastStarOutcome.turnsSpent <= 41, "Degraded solution must beat par 41");
  assert.equal(naiveApp.state.lastStarOutcome.starsEarned, 2, "Degraded solution must earn exactly 2 stars (par beaten, mastery failed)");
  assert.equal(naiveApp.state.lastStarOutcome.parBeaten, true);
  assert.equal(naiveApp.state.lastStarOutcome.masteryAchieved, false);
});

test("Plan 124 R3: empirical verification that degraded runs fail on candidate levels", () => {
  // 1. dodge-and-deliver (L15) — attempting jump when exhausted fails (tagged / timeout)
  const dodgeDeliverRef = GUIDED_LEVEL_REFERENCE_SOLUTIONS["dodge-and-deliver"];
  const dodgeDeliverDegraded = dodgeDeliverRef.replace(
    '<block type="battlegorithms_move_down_screen" id="iq0odl3U*z+#iX#a*p*;"></block>',
    '<block type="battlegorithms_jump_forward"></block>'
  );
  const { app: appL15 } = runGuidedLevelWithSolution("dodge-and-deliver", dodgeDeliverDegraded);
  assert.equal(appL15.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(getAttemptCounters(appL15.state).resourceUnavailableAttempts, 30);

  // 2. jump-if-ready (L16) — unguarded jump attempts loop indefinitely and timeout
  const jumpIfReadyDegraded = buildSolutionXml(`
    <block type="battlegorithms_jump_forward"></block>
  `);
  const { app: appL16 } = runGuidedLevelWithSolution("jump-if-ready", jumpIfReadyDegraded);
  assert.equal(appL16.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(getAttemptCounters(appL16.state).resourceUnavailableAttempts, 7);

  // 3. freeze-the-lane (L21) — unguarded freeze keeps ally stationary; charger tags ally
  const freezeTheLaneDegraded = buildSolutionXml(`
    <block type="battlegorithms_if_sensor_matches_else">
      <field name="OBJECT">ENEMY_RUNNER</field>
      <field name="RELATION">WITHIN_2</field>
      <statement name="DO">
        <block type="battlegorithms_freeze_opponents"></block>
      </statement>
      <statement name="ELSE">
        <block type="battlegorithms_move_toward">
          <field name="TARGET">ENEMY_FLAG</field>
        </block>
      </statement>
    </block>
  `);
  const { app: appL21 } = runGuidedLevelWithSolution("freeze-the-lane", freezeTheLaneDegraded);
  assert.equal(appL21.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(getAttemptCounters(appL21.state).resourceUnavailableAttempts, 9);

  // 4. two-conditions-at-once (L25) — missing readiness check keeps ally stationary; charger tags ally
  const twoCondDegraded = buildSolutionXml(`
    <block type="battlegorithms_if_boolean_else">
      <value name="BOOL">
        <block type="battlegorithms_value_compare">
          <value name="LEFT">
            <block type="battlegorithms_value_distance_to_target">
              <field name="TARGET">CLOSEST_ENEMY</field>
            </block>
          </value>
          <field name="OPERATOR">LTE</field>
          <value name="RIGHT">
            <block type="battlegorithms_value_number">
              <field name="VALUE">2</field>
            </block>
          </value>
        </block>
      </value>
      <statement name="DO">
        <block type="battlegorithms_freeze_opponents"></block>
      </statement>
      <statement name="ELSE">
        <block type="battlegorithms_move_toward">
          <field name="TARGET">ENEMY_FLAG</field>
        </block>
      </statement>
    </block>
  `);
  const { app: appL25 } = runGuidedLevelWithSolution("two-conditions-at-once", twoCondDegraded);
  assert.equal(appL25.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(getAttemptCounters(appL25.state).resourceUnavailableAttempts, 3);

  // 5. bughunt-37 — both allies moving without role split collide and timeout
  const bughunt37Degraded = buildSolutionXml(`
    <block type="battlegorithms_move_toward">
      <field name="TARGET">ENEMY_FLAG</field>
    </block>
  `);
  const { app: appBh37 } = runGuidedLevelWithSolution("bughunt-37", bughunt37Degraded);
  assert.equal(appBh37.state.activeLevelResult, LEVEL_RESULT.FAILED);
  assert.equal(getAttemptCounters(appBh37.state).runnerCollisionBounces, 9);
});
