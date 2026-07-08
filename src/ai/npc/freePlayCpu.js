import {
  AI_ACTION_TYPES,
  AREA_FREEZE_RADIUS,
  GUIDED_GUARD_DEFAULT_RADIUS,
  MOVE_TOWARD_TARGETS,
  NPC_BEHAVIORS
} from "../../config/constants.js";
import { isAreaFreezeReady } from "../../core/areaFreeze.js";
import {
  getBarrierAtCell,
  getForwardCell,
  isCellBlockedForBarrierPlacement,
  isCellBlockedForRunner,
  resolveMoveTowardTarget,
  translateActionDecision
} from "../../core/movement.js";
import { hasRunnerBeenStuckForTurns } from "../../core/recentMovement.js";
import { getEnemyTeamId, getTeamConfig } from "../../core/teams.js";
import { calculateMoveTowardsTarget } from "./pathing.js";

const RUT_THRESHOLD_TURNS = 4;

function getRandomFn(state) {
  return typeof state.randomFn === "function" ? state.randomFn : Math.random;
}

function getRandomItem(items, randomFn) {
  if (!items.length) {
    return null;
  }
  const index = Math.max(0, Math.min(items.length - 1, Math.floor(randomFn() * items.length)));
  return items[index];
}

function getLegalActionCandidates(runner, state) {
  const candidates = [];
  candidates.push(...getLegalMovementCandidates(runner, state));

  if (runner.canJump) {
    const jumpCell = getForwardCell(runner, 2);
    if (!isCellBlockedForRunner(jumpCell.x, jumpCell.y, state.barriers, state.gameMap, state, runner)) {
      candidates.push({ type: AI_ACTION_TYPES.JUMP_FORWARD });
    }
  }

  if (runner.canPlaceBarrier && !runner.activeBarrierId) {
    const forwardCell = getForwardCell(runner, 1);
    if (!isCellBlockedForBarrierPlacement(forwardCell.x, forwardCell.y, state.barriers, state.gameMap, state)) {
      candidates.push({ type: AI_ACTION_TYPES.PLACE_BARRIER_FORWARD });
    }
  }

  if (isAreaFreezeReady(state, runner.team)) {
    candidates.push({ type: AI_ACTION_TYPES.FREEZE_OPPONENTS });
  }

  candidates.push({ type: AI_ACTION_TYPES.STAY_STILL });
  return candidates;
}

function getLegalMovementCandidates(runner, state) {
  const candidates = [];
  const movementDecisions = [
    { type: AI_ACTION_TYPES.MOVE_FORWARD },
    { type: AI_ACTION_TYPES.MOVE_BACKWARD },
    { type: AI_ACTION_TYPES.MOVE_UP_SCREEN },
    { type: AI_ACTION_TYPES.MOVE_DOWN_SCREEN }
  ];

  for (const decision of movementDecisions) {
    const translated = translateActionDecision(runner, decision, state);
    if (!isCellBlockedForRunner(translated.targetGridX, translated.targetGridY, state.barriers, state.gameMap, state, runner)) {
      candidates.push(decision);
    }
  }

  return candidates;
}

function getEnemyFlagCarrier(state, teamId) {
  return state.allRunners.find((runner) => runner.team === teamId && runner.hasEnemyFlag) || null;
}

function getOwnFlagCarrier(state, teamId) {
  const ownFlag = state.gameFlags?.[teamId];
  if (!ownFlag || !ownFlag.carriedByRunnerId) return null;
  return state.allRunners.find((r) => r.id === ownFlag.carriedByRunnerId) || null;
}

function getNearestUnfrozenEnemy(runner, state) {
  return state.allRunners
    .filter((candidate) => candidate.team !== runner.team && !candidate.isFrozen)
    .sort((a, b) => {
      const distA = Math.abs(a.gridX - runner.gridX) + Math.abs(a.gridY - runner.gridY);
      const distB = Math.abs(b.gridX - runner.gridX) + Math.abs(b.gridY - runner.gridY);
      return distA - distB || a.id.localeCompare(b.id);
    })[0] || null;
}

function getNearestEnemyOnMySide(runner, state) {
  const myTeam = getTeamConfig(state, runner.team);
  const enemies = state.allRunners
    .filter((candidate) => candidate.team !== runner.team && !candidate.isFrozen)
    .filter((candidate) => myTeam.homeSide === "left" ? candidate.gridX < state.gameMap[0].length / 2 : candidate.gridX >= state.gameMap[0].length / 2)
    .sort((left, right) => {
      const leftDistance = Math.abs(left.gridX - runner.gridX) + Math.abs(left.gridY - runner.gridY);
      const rightDistance = Math.abs(right.gridX - runner.gridX) + Math.abs(right.gridY - runner.gridY);
      return leftDistance - rightDistance || left.id.localeCompare(right.id);
    });
  return enemies[0] || null;
}

function getMidfieldDefenseCell(runner, state) {
  const homeSide = getTeamConfig(state, runner.team)?.homeSide || "left";
  const anchorX = homeSide === "left" ? Math.floor(state.gameMap[0].length / 2) - 2 : Math.floor(state.gameMap[0].length / 2) + 1;
  return { x: anchorX, y: runner.initialGridY };
}

function getRandomLegalFallbackMove(runner, state, target) {
  const randomFn = getRandomFn(state);
  const options = getLegalMovementCandidates(runner, state)
    .map((decision) => translateActionDecision(runner, decision, state))
    .sort((left, right) => {
      if (!target) {
        return 0;
      }
      const leftDistance = Math.abs(target.x - left.targetGridX) + Math.abs(target.y - left.targetGridY);
      const rightDistance = Math.abs(target.x - right.targetGridX) + Math.abs(target.y - right.targetGridY);
      return leftDistance - rightDistance;
    });

  const bestDistance = target && options.length
    ? Math.abs(target.x - options[0].targetGridX) + Math.abs(target.y - options[0].targetGridY)
    : null;
  const shortlisted = bestDistance === null
    ? options
    : options.filter((option) => Math.abs(target.x - option.targetGridX) + Math.abs(target.y - option.targetGridY) === bestDistance);
  return getRandomItem(shortlisted, randomFn) || { actionType: AI_ACTION_TYPES.STAY_STILL };
}

function getRandomLegalMovementDecision(runner, state) {
  const randomFn = getRandomFn(state);
  const candidates = getLegalMovementCandidates(runner, state);
  return getRandomItem(candidates, randomFn) || { type: AI_ACTION_TYPES.STAY_STILL };
}

function getGuidedVerticalPatrolAction(runner, state) {
  const preferredDirection = runner.guidedVerticalPatrolDirection === 1 ? 1 : -1;
  const patrolDirections = [preferredDirection, -preferredDirection];

  for (const direction of patrolDirections) {
    const targetGridY = runner.gridY + direction;
    if (!isCellBlockedForRunner(runner.gridX, targetGridY, state.barriers, state.gameMap, state, runner)) {
      runner.guidedVerticalPatrolDirection = direction;
      return {
        actionType: direction < 0 ? AI_ACTION_TYPES.MOVE_UP_SCREEN : AI_ACTION_TYPES.MOVE_DOWN_SCREEN
      };
    }
  }

  return { actionType: AI_ACTION_TYPES.STAY_STILL };
}

// Guard archetype (charter S2 / Appendix A, Plan 99): stands at a post, chases
// the nearest player-team runner within its aggro radius, and returns to post
// when nothing is in range. Deterministic — no randomness, fixed tie-break.
// The post defaults to the runner's spawn cell (initialGridX/initialGridY,
// captured by setup) and the radius defaults to GUIDED_GUARD_DEFAULT_RADIUS.
// A future level that needs a non-default post/radius can set runner.guardPost
// / runner.guardRadius directly; no level today wires this through setup.js.
function getGuardPost(runner) {
  if (runner.guardPost && Number.isFinite(runner.guardPost.x) && Number.isFinite(runner.guardPost.y)) {
    return runner.guardPost;
  }
  return { x: runner.initialGridX, y: runner.initialGridY };
}

function getGuardRadius(runner) {
  return Number.isFinite(runner.guardRadius) ? runner.guardRadius : GUIDED_GUARD_DEFAULT_RADIUS;
}

function getNearestPlayerRunnerWithinRadius(runner, state, radius) {
  return state.allRunners
    .filter((candidate) => candidate.team !== runner.team)
    .map((candidate) => ({
      candidate,
      distance: Math.abs(candidate.gridX - runner.gridX) + Math.abs(candidate.gridY - runner.gridY)
    }))
    .filter((entry) => entry.distance <= radius)
    .sort((a, b) => a.distance - b.distance || a.candidate.id.localeCompare(b.candidate.id))[0]?.candidate || null;
}

function getGuidedGuardAction(runner, state) {
  const radius = getGuardRadius(runner);
  const target = getNearestPlayerRunnerWithinRadius(runner, state, radius);

  if (target) {
    return calculateMoveTowardsTarget(runner, target.gridX, target.gridY, state.barriers, state.gameMap, state);
  }

  const post = getGuardPost(runner);
  if (runner.gridX !== post.x || runner.gridY !== post.y) {
    return calculateMoveTowardsTarget(runner, post.x, post.y, state.barriers, state.gameMap, state);
  }

  return { actionType: AI_ACTION_TYPES.STAY_STILL };
}

// Charger archetype (charter S2 / Appendix A, Plan 101): stands still until a
// player-team runner shares its row or column, then commits to a straight-line
// charge down that line until a wall, barrier, or board edge stops it. Unlike
// the Guard, it does not path toward a target and does not return to a post —
// it just charges, which is what makes "jump to dodge the lane" the legible
// counterplay. Committed direction is stored on the runner instance
// (runner.chargeDirection, a {dx, dy} unit vector or null when idle/stopped),
// the same pattern as guidedVerticalPatrolDirection. Determinism: tie-break
// among multiple aligned runners is row before column, then nearest along the
// line, then lowest runner id (ascending, localeCompare) — no randomness.
// Optional per-runner chargeRange bounds the trigger distance along the line;
// absent means unbounded (any same-row/column alignment triggers), the
// deliberate default per this packet's own scope note.
function getChargeRange(runner) {
  return Number.isFinite(runner.chargeRange) ? runner.chargeRange : Number.POSITIVE_INFINITY;
}

function findChargeTrigger(runner, state, range) {
  const candidates = [];
  for (const candidate of state.allRunners) {
    if (candidate.team === runner.team) {
      continue;
    }
    const sameRow = candidate.gridY === runner.gridY;
    const sameColumn = candidate.gridX === runner.gridX;
    if (!sameRow && !sameColumn) {
      continue;
    }
    const axis = sameRow ? "row" : "column";
    const distance = axis === "row"
      ? Math.abs(candidate.gridX - runner.gridX)
      : Math.abs(candidate.gridY - runner.gridY);
    if (distance > range) {
      continue;
    }
    candidates.push({ candidate, axis, distance });
  }

  candidates.sort((a, b) => {
    if (a.axis !== b.axis) {
      return a.axis === "row" ? -1 : 1;
    }
    return a.distance - b.distance || a.candidate.id.localeCompare(b.candidate.id);
  });

  return candidates[0] || null;
}

function getChargeDirectionToward(runner, candidate, axis) {
  if (axis === "row") {
    return { dx: Math.sign(candidate.gridX - runner.gridX), dy: 0 };
  }
  return { dx: 0, dy: Math.sign(candidate.gridY - runner.gridY) };
}

function getGuidedChargerAction(runner, state) {
  let direction = runner.chargeDirection || null;

  if (!direction) {
    const trigger = findChargeTrigger(runner, state, getChargeRange(runner));
    if (!trigger) {
      return { actionType: AI_ACTION_TYPES.STAY_STILL };
    }
    direction = getChargeDirectionToward(runner, trigger.candidate, trigger.axis);
    if (direction.dx === 0 && direction.dy === 0) {
      // Degenerate: the triggering runner occupies the Charger's own cell.
      // Nothing to charge toward; stay idle rather than commit to a no-op.
      return { actionType: AI_ACTION_TYPES.STAY_STILL };
    }
  }

  const nextX = runner.gridX + direction.dx;
  const nextY = runner.gridY + direction.dy;
  if (isCellBlockedForRunner(nextX, nextY, state.barriers, state.gameMap, state, runner)) {
    runner.chargeDirection = null;
    return { actionType: AI_ACTION_TYPES.STAY_STILL };
  }

  runner.chargeDirection = direction;
  return { actionType: "MOVE", dx: direction.dx, dy: direction.dy };
}

function getRutEscapeAction(runner, state) {
  const recentPositions = runner.recentMovementState?.recentEndPositions ?? [];
  const recentSet = new Set(recentPositions.map((p) => `${p.gridX},${p.gridY}`));
  const randomFn = getRandomFn(state);

  const candidates = getLegalMovementCandidates(runner, state)
    .map((decision) => translateActionDecision(runner, decision, state));

  const escapeCandidates = candidates.filter(
    (c) => !recentSet.has(`${c.targetGridX},${c.targetGridY}`)
  );

  const pool = escapeCandidates.length > 0 ? escapeCandidates : candidates;
  return getRandomItem(pool, randomFn) || { actionType: AI_ACTION_TYPES.STAY_STILL };
}

function getBlockedCarrierAction(runner, state) {
  const ownFlagCarrier = getOwnFlagCarrier(state, runner.team);
  if (ownFlagCarrier) {
    const dist = Math.abs(ownFlagCarrier.gridX - runner.gridX) + Math.abs(ownFlagCarrier.gridY - runner.gridY);
    if (isAreaFreezeReady(state, runner.team) && dist <= AREA_FREEZE_RADIUS) {
      return { actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS };
    }
    const moveToward = calculateMoveTowardsTarget(
      runner,
      ownFlagCarrier.gridX,
      ownFlagCarrier.gridY,
      state.barriers,
      state.gameMap,
      state
    );
    if (moveToward.actionType !== AI_ACTION_TYPES.STAY_STILL) {
      return moveToward;
    }
  }
  return getRandomLegalFallbackMove(runner, state, null);
}

function getAttackerAction(runner, state) {
  // 1. Rut escape overrides everything when stuck in a small local area.
  if (hasRunnerBeenStuckForTurns(runner, RUT_THRESHOLD_TURNS)) {
    return getRutEscapeAction(runner, state);
  }

  // 2. Blocked-scoring: own flag is away — chase the runner holding it instead.
  if (runner.hasEnemyFlag && !(state.gameFlags?.[runner.team]?.isAtBase)) {
    return getBlockedCarrierAction(runner, state);
  }

  // 3. Carrier freeze: while returning home with the enemy flag, freeze nearby threats.
  if (runner.hasEnemyFlag && isAreaFreezeReady(state, runner.team)) {
    const threat = getNearestUnfrozenEnemy(runner, state);
    if (threat) {
      const dist = Math.abs(threat.gridX - runner.gridX) + Math.abs(threat.gridY - runner.gridY);
      if (dist <= AREA_FREEZE_RADIUS) {
        return { actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS };
      }
    }
  }

  // 4. Resolve the tactical target and its coordinates.
  const moveTarget = runner.hasEnemyFlag
    ? resolveMoveTowardTarget(state, runner, MOVE_TOWARD_TARGETS.MY_BASE)
    : resolveMoveTowardTarget(state, runner, MOVE_TOWARD_TARGETS.ENEMY_FLAG);
  const targetX = runner.hasEnemyFlag
    ? (moveTarget?.x ?? runner.gridX)
    : (state.gameFlags[getEnemyTeamId(runner.team)]?.gridX ?? runner.gridX);
  const targetY = runner.hasEnemyFlag
    ? (moveTarget?.y ?? runner.gridY)
    : (state.gameFlags[getEnemyTeamId(runner.team)]?.gridY ?? runner.gridY);

  // 5. Jump if the landing cell is legal and meaningfully reduces distance to target.
  if (runner.canJump) {
    const jumpCell = getForwardCell(runner, 2);
    if (!isCellBlockedForRunner(jumpCell.x, jumpCell.y, state.barriers, state.gameMap, state, runner)) {
      const distCurrent = Math.abs(targetX - runner.gridX) + Math.abs(targetY - runner.gridY);
      const distAfterJump = Math.abs(targetX - jumpCell.x) + Math.abs(targetY - jumpCell.y);
      if (distAfterJump < distCurrent) {
        return { actionType: AI_ACTION_TYPES.JUMP_FORWARD };
      }
    }
  }

  // 6. Normal pathing move toward target.
  const preferred = calculateMoveTowardsTarget(runner, targetX, targetY, state.barriers, state.gameMap, state);

  if (preferred.actionType !== AI_ACTION_TYPES.STAY_STILL) {
    return preferred;
  }

  // 7. If blocked by a barrier directly ahead, stay still rather than random-wandering.
  const forwardCell = getForwardCell(runner, 1);
  if (getBarrierAtCell(forwardCell.x, forwardCell.y, state.barriers)) {
    return { actionType: AI_ACTION_TYPES.STAY_STILL };
  }

  // 8. Random legal fallback biased toward target.
  return getRandomLegalFallbackMove(runner, state, moveTarget);
}

function getDefenderAction(runner, state) {
  if (hasRunnerBeenStuckForTurns(runner, RUT_THRESHOLD_TURNS)) {
    return getRutEscapeAction(runner, state);
  }

  const enemyCarrier = getEnemyFlagCarrier(state, getEnemyTeamId(runner.team));
  if (enemyCarrier) {
    const carrierDistance = Math.abs(enemyCarrier.gridX - runner.gridX) + Math.abs(enemyCarrier.gridY - runner.gridY);
    if (isAreaFreezeReady(state, runner.team) && carrierDistance <= AREA_FREEZE_RADIUS) {
      return { actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS };
    }
    return calculateMoveTowardsTarget(runner, enemyCarrier.gridX, enemyCarrier.gridY, state.barriers, state.gameMap, state);
  }

  const nearbyIntruder = getNearestEnemyOnMySide(runner, state);
  if (nearbyIntruder) {
    const intruderDistance = Math.abs(nearbyIntruder.gridX - runner.gridX) + Math.abs(nearbyIntruder.gridY - runner.gridY);
    if (isAreaFreezeReady(state, runner.team) && intruderDistance <= AREA_FREEZE_RADIUS) {
      return { actionType: AI_ACTION_TYPES.FREEZE_OPPONENTS };
    }
    return calculateMoveTowardsTarget(runner, nearbyIntruder.gridX, nearbyIntruder.gridY, state.barriers, state.gameMap, state);
  }

  const defenseCell = getMidfieldDefenseCell(runner, state);
  if (runner.gridX !== defenseCell.x || runner.gridY !== defenseCell.y) {
    return calculateMoveTowardsTarget(runner, defenseCell.x, defenseCell.y, state.barriers, state.gameMap, state);
  }

  const barrierCell = getForwardCell(runner, 1);
  if (
    runner.canPlaceBarrier &&
    !runner.activeBarrierId &&
    !isCellBlockedForBarrierPlacement(barrierCell.x, barrierCell.y, state.barriers, state.gameMap, state)
  ) {
    return { actionType: AI_ACTION_TYPES.PLACE_BARRIER_FORWARD };
  }

  return { actionType: AI_ACTION_TYPES.STAY_STILL };
}

export function calculateFreePlayCpuAction(runner, state) {
  if (runner.cpuBehavior === NPC_BEHAVIORS.FREE_PLAY_EASY) {
    const randomFn = getRandomFn(state);
    const choice = getRandomItem(getLegalActionCandidates(runner, state), randomFn);
    return choice || { type: AI_ACTION_TYPES.STAY_STILL };
  }

  if (runner.cpuBehavior === NPC_BEHAVIORS.GUIDED_STAY_STILL) {
    return { actionType: AI_ACTION_TYPES.STAY_STILL };
  }

  if (runner.cpuBehavior === NPC_BEHAVIORS.GUIDED_RANDOM_MOVE_ONLY) {
    return getRandomLegalMovementDecision(runner, state);
  }

  if (runner.cpuBehavior === NPC_BEHAVIORS.GUIDED_VERTICAL_PATROL) {
    return getGuidedVerticalPatrolAction(runner, state);
  }

  if (runner.cpuBehavior === NPC_BEHAVIORS.GUIDED_GUARD) {
    return getGuidedGuardAction(runner, state);
  }

  if (runner.cpuBehavior === NPC_BEHAVIORS.GUIDED_CHARGER) {
    return getGuidedChargerAction(runner, state);
  }

  if (runner.cpuBehavior === NPC_BEHAVIORS.FREE_PLAY_TACTICAL_ATTACKER) {
    return getAttackerAction(runner, state);
  }

  if (runner.cpuBehavior === NPC_BEHAVIORS.FREE_PLAY_TACTICAL_DEFENDER) {
    return getDefenderAction(runner, state);
  }

  return { actionType: AI_ACTION_TYPES.STAY_STILL };
}
