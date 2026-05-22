import { TURN_STATES, MAIN_GAME_STATES } from "../config/constants.js";
import { getTeamBaseCellType } from "./teams.js";
import { emit } from "./events.js";

export function checkForFlagPickup(state, runner) {
  if (runner.hasEnemyFlag) {
    return;
  }
  const enemyTeamId = runner.team === 1 ? 2 : 1;
  const enemyFlag = state.gameFlags[enemyTeamId];
  if (enemyFlag && !enemyFlag.carriedByRunnerId) {
    if (runner.gridX === enemyFlag.gridX && runner.gridY === enemyFlag.gridY) {
      runner.pickupFlag(enemyFlag);
      emit(state, "flag.pickedUp", {
        flagTeam: enemyTeamId,
        carrierRunnerId: runner.id,
        cell: {
          x: runner.gridX,
          y: runner.gridY
        }
      });
    }
  }
}

export function checkForScoring(state, runner) {
  if (!runner.hasEnemyFlag) {
    return false;
  }

  const runnerBaseCellType = getTeamBaseCellType(state, runner.team);
  const currentCellType = state.gameMap[runner.gridY][runner.gridX];
  if (currentCellType !== runnerBaseCellType) {
    return false;
  }

  // Own-flag-home prerequisite: the runner can only score when their own team's flag
  // is at home and not carried.  If it is away, emit a factual event and return false
  // without changing any score, flag, or round state.
  const ownFlag = state.gameFlags?.[runner.team];
  if (!ownFlag || !ownFlag.isAtBase) {
    emit(state, "score.blocked", {
      blockedTeam: runner.team,
      carrierRunnerId: runner.id,
      reason: "own_flag_away"
    });
    return false;
  }

  const enemyTeamId = runner.team === 1 ? 2 : 1;
  const scoredFlag = state.gameFlags[enemyTeamId];
  if (scoredFlag && scoredFlag.carriedByRunnerId === runner.id) {
    runner.dropFlag(scoredFlag);
    scoredFlag.resetToInitialPosition();
  } else {
    runner.hasEnemyFlag = false;
  }

  scorePointForTeam(state, runner.team);
  emit(state, "team.scored", {
    scoringTeam: runner.team,
    newScore: state.teamScores[runner.team],
    pointsToWin: state.pointsToWin
  });
  return true;
}

export function scorePointForTeam(state, teamId) {
  state.teamScores[teamId] += 1;
  state.lastScoringTeam = teamId;
  if (state.teamScores[teamId] >= state.pointsToWin) {
    state.currentTurnState = TURN_STATES.GAME_OVER;
    state.mainGameState = MAIN_GAME_STATES.GAME_OVER;
  }
}
