import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLevelDefinitions } from '../../src/config/levels.js';
import { evaluateLevelStars, getCriterionEvaluator } from '../../src/core/starEvaluation.js';
import { LEVEL_RESULT } from '../../src/config/constants.js';
import { runGuidedLevelWithSolution } from './helpers/testHarness.js';

test('Plan 113: Campaign star metadata authoring validation', () => {
  const levels = getLevelDefinitions();

  const expectedPars = {
    'reach-enemy-flag': 3,
    'barrier-detour': 8,
    'sensor-barrier-branch': 8,
    'watch-the-wall': 7,
    'find-the-human': 9,
    'find-the-enemy-flag': 13,
    'bring-it-home': 25,
    'enemy-nearby': 10,
    'jump-the-gap': 3,
    'bughunt-15': 21,
    'dodge-and-deliver': 21,
    'jump-if-ready': 4,
    'build-the-barrier': 3,
    'stay-still-can-do-something': 6,
    'my-side-their-side': 11,
    'freeze-the-lane': 7,
    'bughunt-22': 3,
    'show-what-you-know': 41,
    'closest-threat': 7,
    'how-far-away': 8,
    'two-conditions-at-once': 7,
    'this-or-that': 9,
    'flip-the-answer': 9,
    'bughunt-28': 14,
    'one-program-two-allies': 14,
    'index-jobs': 11,
    'first-two-defend': 5,
    'escort-the-carrier': 5,
    'closest-enemy-defender': 12,
    'freeze-support': 7,
    'barrier-specialist': 12,
    'jump-team': 5,
    'bughunt-37': 14,
    'optional-random-lab': 3
  };

  const expectedBothAlliesActiveLevels = [
    'one-program-two-allies',
    'index-jobs',
    'first-two-defend',
    'escort-the-carrier',
    'closest-enemy-defender',
    'freeze-support',
    'barrier-specialist',
    'jump-team'
  ];

  for (const [levelId, expectedPar] of Object.entries(expectedPars)) {
    const level = levels.find((l) => l.id === levelId);
    assert.ok(level, `Level ${levelId} must exist`);
    assert.ok(level.starCriteria, `Level ${levelId} must carry starCriteria`);
    assert.equal(level.starCriteria.turnPar, expectedPar, `Level ${levelId} turnPar must match expected ${expectedPar}`);

    const limit = level.failureConditions?.find((c) => c.type === 'turn_limit_exceeded')?.maxTurns ?? level.failureCondition?.maxTurns;
    assert.ok(level.starCriteria.turnPar < limit, `Level ${levelId} turnPar (${level.starCriteria.turnPar}) must be strictly less than turnLimit (${limit})`);

    if (expectedBothAlliesActiveLevels.includes(levelId)) {
      assert.equal(level.starCriteria.masteryCriterionId, 'both-allies-active', `Level ${levelId} must carry masteryCriterionId both-allies-active`);
    } else {
      assert.equal(level.starCriteria.masteryCriterionId, undefined, `Level ${levelId} should not carry masteryCriterionId (2-star max)`);
    }
  }
});

test('Plan 113: S12, prediction, human-input, and deferred levels remain pass-star-only', () => {
  const levels = getLevelDefinitions();

  const passStarOnlyLevelIds = [
    'move-to-target',
    'score-a-point',
    'mirror-forward',
    'prediction-06',
    'human-runner-practice',
    'move-toward-flag',
    'relay-race',
    'prediction-25',
    'full-team-tactics',
    'prediction-31',
    'optional-double-carrier-showdown'
  ];

  for (const levelId of passStarOnlyLevelIds) {
    const level = levels.find((l) => l.id === levelId);
    assert.ok(level, `Level ${levelId} must exist`);
    assert.equal(level.starCriteria, null, `Level ${levelId} must not carry starCriteria (pass-star-only)`);

    const evalResult = evaluateLevelStars(level, LEVEL_RESULT.PASSED, { turnsSpent: 1 });
    assert.equal(evalResult.starsEarned, 1, `Level ${levelId} must evaluate to max 1 star`);
    assert.equal(evalResult.turnPar, undefined);
    assert.equal(evalResult.parBeaten, undefined);
    assert.equal(evalResult.masteryCriterionId, undefined);
  }
});

test('Plan 113: both-allies-active evaluator functionality & team metadata requirements', () => {
  const evaluator = getCriterionEvaluator('both-allies-active');
  assert.ok(typeof evaluator === 'function', 'both-allies-active evaluator must be registered');

  // 1. Single active ally program fails
  const singleActiveState = {
    allRunners: [
      { id: 'custom_a1', team: 1, isHumanControlled: false, isNPC: false },
      { id: 'custom_a2', team: 1, isHumanControlled: false, isNPC: false },
      { id: 'npc_1', team: 2, isHumanControlled: false, isNPC: true }
    ]
  };
  const singleActiveHistory = {
    custom_a1: ['MOVE_FORWARD']
  };
  const singleResult = evaluator({
    details: {
      runnerActionHistory: singleActiveHistory,
      appState: singleActiveState
    }
  });
  assert.equal(singleResult, false, 'Single active ally must fail both-allies-active');

  // 2. STAY_STILL defender counts as active
  const stayStillHistory = {
    custom_a1: ['MOVE_FORWARD'],
    custom_a2: ['STAY_STILL']
  };
  const stayStillResult = evaluator({
    details: {
      runnerActionHistory: stayStillHistory,
      appState: singleActiveState
    }
  });
  assert.equal(stayStillResult, true, 'STAY_STILL defender must count as active execution');

  // 3. Team metadata (not runner-id string prefixes) drives selection
  const nonStandardIdState = {
    allRunners: [
      { id: 'team1_unit_alpha', team: 1, isHumanControlled: false, isNPC: false },
      { id: 'team1_unit_beta', team: 1, isHumanControlled: false, isNPC: false },
      { id: 'runner_1_HumanP1', team: 1, isHumanControlled: true, isNPC: false },
      { id: 'runner_1_AI_AllyP1', team: 2, isHumanControlled: false, isNPC: true }
    ]
  };
  const nonStandardHistory = {
    team1_unit_alpha: ['JUMP_FORWARD'],
    team1_unit_beta: ['STAY_STILL']
  };
  const nonStandardResult = evaluator({
    details: {
      runnerActionHistory: nonStandardHistory,
      appState: nonStandardIdState
    }
  });
  assert.equal(nonStandardResult, true, 'Team metadata on appState.allRunners must drive selection regardless of ID string formatting');
});

test('Plan 114: advanced-scrimmage discriminating power - idled support allies cause failure', () => {
  const idledSupportXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_boolean_have_enemy_flag"></block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_if_boolean_else">
            <value name="BOOL">
              <block type="battlegorithms_logic_and">
                <value name="LEFT">
                  <block type="battlegorithms_logic_not">
                    <value name="VALUE">
                      <block type="battlegorithms_boolean_sensor_matches">
                        <field name="OBJECT">EDGE_OR_WALL</field>
                        <field name="RELATION">DIRECTLY_ABOVE</field>
                      </block>
                    </value>
                  </block>
                </value>
                <value name="RIGHT">
                  <block type="battlegorithms_logic_not">
                    <value name="VALUE">
                      <block type="battlegorithms_boolean_on_my_side"></block>
                    </value>
                  </block>
                </value>
              </block>
            </value>
            <statement name="DO">
              <block type="battlegorithms_move_up_screen"></block>
            </statement>
            <statement name="ELSE">
              <block type="battlegorithms_move_toward">
                <field name="TARGET">MY_BASE</field>
              </block>
            </statement>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_if_boolean_else">
            <value name="BOOL">
              <block type="battlegorithms_value_compare">
                <field name="OPERATOR">EQ</field>
                <value name="LEFT">
                  <block type="battlegorithms_value_runner_index"></block>
                </value>
                <value name="RIGHT">
                  <block type="battlegorithms_value_number">
                    <field name="VALUE">0</field>
                  </block>
                </value>
              </block>
            </value>
            <statement name="DO">
              <block type="battlegorithms_if_boolean_else">
                <value name="BOOL">
                  <block type="battlegorithms_boolean_on_my_side"></block>
                </value>
                <statement name="DO">
                  <block type="battlegorithms_if_boolean_else">
                    <value name="BOOL">
                      <block type="battlegorithms_boolean_sensor_matches">
                        <field name="OBJECT">HUMAN_RUNNER</field>
                        <field name="RELATION">DIRECTLY_ABOVE</field>
                      </block>
                    </value>
                    <statement name="DO">
                      <block type="battlegorithms_move_forward"></block>
                    </statement>
                    <statement name="ELSE">
                      <block type="battlegorithms_if_boolean_else">
                        <value name="BOOL">
                          <block type="battlegorithms_logic_not">
                            <value name="VALUE">
                              <block type="battlegorithms_boolean_sensor_matches">
                                <field name="OBJECT">EDGE_OR_WALL</field>
                                <field name="RELATION">DIRECTLY_ABOVE</field>
                              </block>
                            </value>
                          </block>
                        </value>
                        <statement name="DO">
                          <block type="battlegorithms_move_up_screen"></block>
                        </statement>
                        <statement name="ELSE">
                          <block type="battlegorithms_move_toward">
                            <field name="TARGET">ENEMY_FLAG</field>
                          </block>
                        </statement>
                      </block>
                    </statement>
                  </block>
                </statement>
                <statement name="ELSE">
                  <block type="battlegorithms_move_toward">
                    <field name="TARGET">ENEMY_FLAG</field>
                  </block>
                </statement>
              </block>
            </statement>
            <statement name="ELSE">
              <block type="battlegorithms_stay_still"></block>
            </statement>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>
  `;

  const { app } = runGuidedLevelWithSolution('advanced-scrimmage', idledSupportXml);
  assert.equal(
    app.state.activeLevelResult,
    LEVEL_RESULT.FAILED,
    'Idling support allies in advanced-scrimmage must fail the level, proving both-allies-active discriminating power'
  );
});
