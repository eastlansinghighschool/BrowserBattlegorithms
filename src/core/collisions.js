import { COLS, FROZEN_DURATION_TURNS } from "../config/constants.js";
import { emit } from "./events.js";
import { getTeamConfig } from "./teams.js";

function getMapSideDefenderTeam(state, collisionX) {
  const cellSide = collisionX < COLS / 2 ? "left" : "right";
  for (const teamId of [1, 2]) {
    if (getTeamConfig(state, teamId)?.homeSide === cellSide) {
      return teamId;
    }
  }
  return null;
}

export function resolveCollision(state, attacker, defenderInCell, collisionX, collisionY, attackerOriginCell) {
  const mapSideDefenderTeam = getMapSideDefenderTeam(state, collisionX);
  let winner;
  let loser;
  const attackerHasFlag = attacker.hasEnemyFlag === true;
  const defenderHasFlag = defenderInCell.hasEnemyFlag === true;

  if (attackerHasFlag && defenderHasFlag) {
    winner = defenderInCell;
    loser = attacker;
  } else if (attackerHasFlag) {
    winner = defenderInCell;
    loser = attacker;
  } else if (defenderHasFlag) {
    winner = attacker;
    loser = defenderInCell;
  } else if (attacker.team === mapSideDefenderTeam) {
    winner = attacker;
    loser = defenderInCell;
  } else if (defenderInCell.team === mapSideDefenderTeam) {
    winner = defenderInCell;
    loser = attacker;
  } else {
    winner = defenderInCell;
    loser = attacker;
  }

  if (!loser.isGracePeriod) {
    loser.setFrozen(FROZEN_DURATION_TURNS);
  }

  let resetFlag = null;
  if (loser.hasEnemyFlag) {
    const enemyTeamOfLoser = loser.team === 1 ? 2 : 1;
    const flagCarriedByLoser = state.gameFlags[enemyTeamOfLoser];
    if (flagCarriedByLoser) {
      loser.dropFlag(flagCarriedByLoser);
      emit(state, "flag.dropped", {
        flagTeam: enemyTeamOfLoser,
        previousCarrierRunnerId: loser.id,
        cell: {
          x: collisionX,
          y: collisionY
        },
        reason: "collision_lost"
      });
      flagCarriedByLoser.resetToInitialPosition();
      resetFlag = flagCarriedByLoser;
    }
  }

  const loserCell = {
    x: attackerOriginCell?.x ?? attacker.gridX,
    y: attackerOriginCell?.y ?? attacker.gridY
  };

  return {
    winner,
    loser,
    loserCell,
    attackerWon: winner === attacker,
    loserAvoidedFreezeDueToGrace: loser.isGracePeriod && !loser.isFrozen,
    resetFlag
  };
}
