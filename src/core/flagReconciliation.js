import { COLS, ROWS } from "../config/constants.js";
import { getRunnerAtCell, isCellBlockedForRunner, snapRunnerToCell } from "./movement.js";
import { checkForFlagPickup } from "./scoring.js";

// Deterministic displacement search order: left, right, up, down at radius 1,
// then expanding Manhattan radius. Offsets within a radius are ordered by dx
// ascending, then dy ascending, so the search is reproducible for tests and
// classroom debugging.
function offsetsAtRadius(radius) {
  if (radius === 1) {
    return [
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 }
    ];
  }

  const offsets = [];
  for (let dx = -radius; dx <= radius; dx += 1) {
    const remaining = radius - Math.abs(dx);
    if (remaining === 0) {
      offsets.push({ x: dx, y: 0 });
    } else {
      offsets.push({ x: dx, y: -remaining });
      offsets.push({ x: dx, y: remaining });
    }
  }
  return offsets;
}

function isCellLegalForDisplacement(state, runner, cellX, cellY) {
  if (isCellBlockedForRunner(cellX, cellY, state.barriers, state.gameMap, state, runner)) {
    return false;
  }
  if (getRunnerAtCell(cellX, cellY, state.allRunners, runner.id)) {
    return false;
  }
  return true;
}

function findDeterministicDisplacementCell(state, runner, originX, originY) {
  const maxRadius = COLS + ROWS;
  for (let radius = 1; radius <= maxRadius; radius += 1) {
    for (const offset of offsetsAtRadius(radius)) {
      const cellX = originX + offset.x;
      const cellY = originY + offset.y;
      if (isCellLegalForDisplacement(state, runner, cellX, cellY)) {
        return { x: cellX, y: cellY };
      }
    }
  }
  return null;
}

// Called after a collision causes a carried flag to reset to its home cell.
// A same-team runner may not remain on their own loose at-base flag cell, and
// an opposing runner already standing there should pick the flag up
// immediately rather than requiring a move-away-and-return workaround.
// Must not be called for a flag that is still carried, and must not run as
// part of ordinary scoring round resets.
export function reconcileFlagHomeOccupancy(state, flag) {
  if (!flag || flag.carriedByRunnerId || !flag.isAtBase) {
    return;
  }

  const occupant = getRunnerAtCell(flag.gridX, flag.gridY, state.allRunners);
  if (!occupant) {
    return;
  }

  if (occupant.team !== flag.teamId) {
    checkForFlagPickup(state, occupant);
    return;
  }

  const displacement = findDeterministicDisplacementCell(state, occupant, flag.gridX, flag.gridY);
  if (!displacement) {
    // Unreachable on authored maps: a 96-cell board with a handful of runners
    // always has a free cell in range. If it ever happens, degrade rather than
    // halt the turn engine (Plan 78's no-new-halt-paths goal): leave the runner
    // where it is and surface a diagnostic for owner review. The leftover
    // runner-on-own-loose-flag state is the same mild oddity reconciliation
    // normally prevents, and invariants.js will flag it if it matters.
    if (typeof console !== "undefined" && console.warn) {
      console.warn(
        `flagReconciliation: no legal displacement cell for runner ${occupant.id} ` +
        `on home flag cell (${flag.gridX}, ${flag.gridY}); leaving runner in place.`
      );
    }
    return;
  }
  snapRunnerToCell(occupant, displacement.x, displacement.y);
}
