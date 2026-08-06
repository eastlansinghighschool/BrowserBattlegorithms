import test from "node:test";
import assert from "node:assert/strict";

import { LEVEL_RESULT, LEVEL_STATUS } from "../../src/config/constants.js";
import { getLevelStarState } from "../../src/core/levels.js";
import { renderLevelPickerStars, renderResultBannerMessage } from "../../src/ui/levels.js";
import { createTrackerSession, initializeUsageTracking } from "../../src/usage/usageTracker.js";

test("getGuidedStarState on tracker reads durable ledger cleanly", () => {
  const dummyApp = {
    state: { currentModeView: "GUIDED_LEVELS", currentMapKey: "wideAisle", currentLevelId: "level-12-bring-it-home", currentTurnNumber: 1 },
    hooks: {}
  };
  const tracker = initializeUsageTracking(dummyApp);
  const session = dummyApp.usageTrackerSessionInternal;
  assert.ok(session, "test hook should expose the live session");
  session.learningLedger.guided["level-12-bring-it-home"] = {
    levelId: "level-12-bring-it-home",
    reached: true,
    passed: true,
    starsEarned: 2,
    parBeaten: true,
    turnPar: 25,
    masteryAchieved: false
  };

  const starState = tracker.getGuidedStarState("level-12-bring-it-home");
  assert.equal(starState.starsEarned, 2);
  assert.equal(starState.parBeaten, true);
  assert.equal(starState.turnPar, 25);
  assert.equal(starState.passed, true);

  assert.equal(tracker.getGuidedStarState("non-existent-level"), null);
  assert.equal(tracker.getGuidedStarState(null), null);
});

test("getLevelStarState handles level-kind matrix correctly", () => {
  const metadataLevel = {
    id: "level-12-bring-it-home",
    starCriteria: { turnPar: 25 }
  };
  const protectedLevel = {
    id: "move-toward-flag"
  };

  // Case 1: Metadata level, unpassed -> 0 stars earned, 2 offered (shows ☆☆)
  const appUnpassed = {
    state: { levelProgress: { "level-12-bring-it-home": LEVEL_STATUS.AVAILABLE } },
    usageTracker: { getGuidedStarState: () => null }
  };
  const unpassedState = getLevelStarState(appUnpassed, metadataLevel);
  assert.equal(unpassedState.starsEarned, 0);
  assert.equal(unpassedState.maxStarsOffered, 2);

  // Case 2: Metadata level, passed 1 star -> 1 star earned, 2 offered (shows ★☆)
  const appPassedOneStar = {
    state: { levelProgress: { "level-12-bring-it-home": LEVEL_STATUS.PASSED } },
    usageTracker: {
      getGuidedStarState: () => ({ starsEarned: 1, parBeaten: false, turnPar: 25 })
    }
  };
  const passedOneState = getLevelStarState(appPassedOneStar, metadataLevel);
  assert.equal(passedOneState.starsEarned, 1);
  assert.equal(passedOneState.maxStarsOffered, 2);

  // Case 3: Protected/Pass-only level, unpassed -> 0 stars offered (shows nothing)
  const appProtectedUnpassed = {
    state: { levelProgress: { "move-toward-flag": LEVEL_STATUS.AVAILABLE } },
    usageTracker: { getGuidedStarState: () => null }
  };
  const protectedUnpassedState = getLevelStarState(appProtectedUnpassed, protectedLevel);
  assert.equal(protectedUnpassedState.maxStarsOffered, 0);

  // Case 4: Protected/Pass-only level, passed -> 1 star earned, 1 offered (shows ★)
  const appProtectedPassed = {
    state: { levelProgress: { "move-toward-flag": LEVEL_STATUS.PASSED } },
    usageTracker: { getGuidedStarState: () => ({ starsEarned: 1, passed: true }) }
  };
  const protectedPassedState = getLevelStarState(appProtectedPassed, protectedLevel);
  assert.equal(protectedPassedState.starsEarned, 1);
  assert.equal(protectedPassedState.maxStarsOffered, 1);
});

test("renderLevelPickerStars produces compliant HTML and aria-labels", () => {
  const metadataLevel = {
    id: "level-12-bring-it-home",
    starCriteria: { turnPar: 25 }
  };
  const protectedLevel = {
    id: "move-toward-flag"
  };

  const appTwoStars = {
    state: { levelProgress: { "level-12-bring-it-home": LEVEL_STATUS.PASSED } },
    usageTracker: { getGuidedStarState: () => ({ starsEarned: 2, parBeaten: true, turnPar: 25 }) }
  };
  const htmlTwo = renderLevelPickerStars(appTwoStars, metadataLevel);
  assert.ok(htmlTwo.includes('aria-label="2 of 2 stars earned"'));
  assert.ok(htmlTwo.includes("★★"));

  const appUnpassedProtected = {
    state: { levelProgress: { "move-toward-flag": LEVEL_STATUS.AVAILABLE } },
    usageTracker: { getGuidedStarState: () => null }
  };
  assert.equal(renderLevelPickerStars(appUnpassedProtected, protectedLevel), "");
});

test("renderResultBannerMessage formats verbatim approved copy across scenarios", () => {
  const levelWithPar = {
    id: "level-12-bring-it-home",
    starCriteria: { turnPar: 25 },
    winCondition: { type: "runner_reaches_cell" }
  };
  const levelPassOnly = {
    id: "move-toward-flag",
    winCondition: { type: "runner_reaches_cell" }
  };

  // Scenario 1: 1-Star pass with turnPar (finished in 28 turns > 25 par)
  const appOneStar = {
    state: {
      activeLevelResult: LEVEL_RESULT.PASSED,
      currentTurnNumber: 28,
      lastStarOutcome: { starsEarned: 1, parBeaten: false, turnPar: 25, turnsSpent: 28 }
    },
    usageTracker: { getGuidedStarState: () => ({ starsEarned: 1, parBeaten: false, turnPar: 25 }) }
  };
  const banner1 = renderResultBannerMessage(appOneStar, levelWithPar, "Challenge complete.");
  assert.ok(banner1.includes("Level passed! ★☆ — Finished in 28 turns. Beat par (25 turns) to earn a second star!"));

  // Scenario 2: 2-Star pass with turnPar (finished in 20 turns <= 25 par)
  const appTwoStar = {
    state: {
      activeLevelResult: LEVEL_RESULT.PASSED,
      currentTurnNumber: 20,
      lastStarOutcome: { starsEarned: 2, parBeaten: true, turnPar: 25, turnsSpent: 20 }
    },
    usageTracker: { getGuidedStarState: () => ({ starsEarned: 2, parBeaten: true, turnPar: 25 }) }
  };
  const banner2 = renderResultBannerMessage(appTwoStar, levelWithPar, "Challenge complete.");
  assert.ok(banner2.includes("Level passed! ★★ — Finished in 20 turns (par is 25). Par beaten!"));

  // Scenario 3: 3-Star pass with mastery criterion
  const appThreeStar = {
    state: {
      activeLevelResult: LEVEL_RESULT.PASSED,
      currentTurnNumber: 15,
      lastStarOutcome: { starsEarned: 3, parBeaten: true, turnPar: 25, masteryAchieved: true, turnsSpent: 15 }
    },
    usageTracker: { getGuidedStarState: () => ({ starsEarned: 3, parBeaten: true, turnPar: 25, masteryAchieved: true }) }
  };
  const banner3 = renderResultBannerMessage(appThreeStar, levelWithPar, "Challenge complete.");
  assert.ok(banner3.includes("Level passed! ★★★ — Finished in 15 turns. Par beaten and mastery challenge completed!"));

  // Scenario 4: Pass-only level
  const appPassOnly = {
    state: {
      activeLevelResult: LEVEL_RESULT.PASSED,
      currentTurnNumber: 10,
      lastStarOutcome: { starsEarned: 1, turnsSpent: 10 }
    },
    usageTracker: { getGuidedStarState: () => ({ starsEarned: 1, passed: true }) }
  };
  const bannerPassOnly = renderResultBannerMessage(appPassOnly, levelPassOnly, "Challenge complete.");
  assert.ok(bannerPassOnly.includes("Level passed! ★"));
  // Owner decision 2026-07-22: the humanized reason follows the star line.
  assert.ok(bannerPassOnly.includes("Level passed! ★ Challenge complete."));

  // Scenario 4b: score-point levels restore the tailored lead after the star line
  const scorePointLevel = {
    id: "score-a-point",
    winCondition: { type: "team_scores_point" }
  };
  const appScorePoint = {
    state: {
      activeLevelResult: LEVEL_RESULT.PASSED,
      currentTurnNumber: 12,
      lastStarOutcome: { starsEarned: 1, turnsSpent: 12 }
    },
    usageTracker: { getGuidedStarState: () => ({ starsEarned: 1, passed: true }) }
  };
  const bannerScorePoint = renderResultBannerMessage(appScorePoint, scorePointLevel, "Your team scored a point.");
  assert.ok(bannerScorePoint.includes("Level passed! ★ Scoring a point completed the challenge. Your team scored a point."));

  // Scenario 5: Failure
  const appFailed = {
    state: {
      activeLevelResult: LEVEL_RESULT.FAILED,
      lastStarOutcome: null
    }
  };
  const bannerFailed = renderResultBannerMessage(appFailed, levelWithPar, "The turn limit was reached before the goal was met.");
  assert.ok(bannerFailed.includes("level-result failure"));
  assert.ok(!bannerFailed.includes("★"));
});
