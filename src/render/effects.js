import {
  CELL_SIZE,
  GLOW_DIAMETER_FACTOR,
  GLOW_PULSE_MAX_ALPHA,
  GLOW_PULSE_MIN_ALPHA,
  GLOW_PULSE_SPEED,
  GLOW_SOLID_ALPHA_ANIMATING,
  GLOW_SOLID_ALPHA_FROZEN_TURN,
  GLOW_STROKE_WEIGHT
} from "../config/constants.js";
import { getTeamGlowColors } from "../core/teams.js";
import { getJumpTakeoffLineOpacity } from "./animation.js";

const AREA_FREEZE_PULSE_COLOR = [220, 245, 255];
const AREA_FREEZE_FLASH_COLOR = [190, 230, 255];
const JUMP_DUST_COLOR = [170, 180, 190];
const JUMP_TAKEOFF_COLOR = [150, 160, 170];

export function prefersReducedMotion(state = null) {
  if (state && state.lowMotionOverride) {
    return true;
  }
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function drawDiamond(p, centerX, centerY, radius) {
  p.beginShape();
  p.vertex(centerX, centerY - radius);
  p.vertex(centerX + radius, centerY);
  p.vertex(centerX, centerY + radius);
  p.vertex(centerX - radius, centerY);
  p.endShape(p.CLOSE);
}

export function drawActiveRunnerGlow(p, state) {
  if (state.mainGameState !== "RUNNING" || !state.allRunners.length || state.activeRunnerIndex >= state.allRunners.length) {
    return;
  }

  const runnerToGlow = state.allRunners[state.activeRunnerIndex];
  const glowColors = runnerToGlow ? getTeamGlowColors(state, runnerToGlow.team) : null;
  if (!runnerToGlow || !glowColors) {
    return;
  }

  const [r, g, b] = glowColors.fill;
  const [strokeR, strokeG, strokeB] = glowColors.stroke;
  let showGlow = false;
  let alpha = GLOW_SOLID_ALPHA_ANIMATING;
  let isPulsing = false;

  if (state.currentTurnState === "AWAITING_INPUT") {
    if (runnerToGlow.isHumanControlled && !runnerToGlow.isFrozen) {
      showGlow = true;
      isPulsing = true;
    } else if (runnerToGlow.isFrozen) {
      showGlow = true;
      alpha = GLOW_SOLID_ALPHA_FROZEN_TURN;
    }
  } else if (state.currentTurnState === "ANIMATING" && (runnerToGlow.isMoving || runnerToGlow.isBouncing)) {
    showGlow = true;
  }

  if (!showGlow) {
    return;
  }

  p.push();
  const glowDiameter = CELL_SIZE * GLOW_DIAMETER_FACTOR;
  const centerX = runnerToGlow.pixelX + CELL_SIZE / 2;
  const centerY = runnerToGlow.pixelY + CELL_SIZE / 2;
  if (isPulsing) {
    const pulseAlpha = p.map(p.sin(p.frameCount * GLOW_PULSE_SPEED), -1, 1, GLOW_PULSE_MIN_ALPHA, GLOW_PULSE_MAX_ALPHA);
    p.fill(r, g, b, pulseAlpha);
  } else {
    p.fill(r, g, b, alpha);
  }
  p.stroke(strokeR, strokeG, strokeB);
  p.strokeWeight(GLOW_STROKE_WEIGHT);
  p.ellipse(centerX, centerY, glowDiameter, glowDiameter);
  p.pop();
}

export function drawAreaFreezePulse(p, app) {
  const effect = app.state.areaFreezeEffect;
  if (!effect) {
    return;
  }

  const reducedMotion = prefersReducedMotion(app?.state);
  const elapsedMs = Math.max(0, Date.now() - effect.startedAtMs);
  if (elapsedMs >= effect.durationMs) {
    return;
  }
  const progress = effect.durationMs > 0 ? Math.min(1, elapsedMs / effect.durationMs) : 1;
  const centerX = effect.casterCell.x * CELL_SIZE + CELL_SIZE / 2;
  const centerY = effect.casterCell.y * CELL_SIZE + CELL_SIZE / 2;
  const maxRadius = effect.radius * CELL_SIZE + CELL_SIZE / 2;
  const pulseRadius = reducedMotion ? maxRadius : maxRadius * (0.5 + (progress * 0.5));
  const pulseAlpha = reducedMotion ? 95 : Math.max(0, 140 - Math.round(progress * 140));

  p.push();
  p.noStroke();
  p.fill(AREA_FREEZE_PULSE_COLOR[0], AREA_FREEZE_PULSE_COLOR[1], AREA_FREEZE_PULSE_COLOR[2], pulseAlpha);
  drawDiamond(p, centerX, centerY, pulseRadius);

  p.noFill();
  p.stroke(AREA_FREEZE_PULSE_COLOR[0], AREA_FREEZE_PULSE_COLOR[1], AREA_FREEZE_PULSE_COLOR[2], reducedMotion ? 180 : Math.max(0, 220 - Math.round(progress * 180)));
  p.strokeWeight(reducedMotion ? 2 : 3);
  drawDiamond(p, centerX, centerY, pulseRadius);

  if (!reducedMotion) {
    p.stroke(AREA_FREEZE_PULSE_COLOR[0], AREA_FREEZE_PULSE_COLOR[1], AREA_FREEZE_PULSE_COLOR[2], Math.max(0, 120 - Math.round(progress * 120)));
    p.strokeWeight(1);
    drawDiamond(p, centerX, centerY, pulseRadius * 0.6);
  }

  p.pop();
}

export function drawAreaFreezeRunnerFlash(p, runner, effect, state = null) {
  if (!effect || !runner || !Array.isArray(effect.affectedRunners)) {
    return;
  }

  const affected = effect.affectedRunners.some((candidate) => candidate.runnerId === runner.id);
  if (!affected) {
    return;
  }

  const reducedMotion = prefersReducedMotion(state);
  const elapsedMs = Math.max(0, Date.now() - effect.startedAtMs);
  if (elapsedMs >= effect.durationMs) {
    return;
  }
  const progress = effect.durationMs > 0 ? Math.min(1, elapsedMs / effect.durationMs) : 1;
  const pulse = reducedMotion ? 1 : Math.sin(progress * Math.PI);
  const flashInset = reducedMotion ? 4 : 2;
  const flashAlpha = reducedMotion ? 90 : Math.max(0, 70 + Math.round(pulse * 110));
  const [r, g, b] = AREA_FREEZE_FLASH_COLOR;

  p.push();
  p.noFill();
  p.stroke(r, g, b, flashAlpha);
  p.strokeWeight(reducedMotion ? 2 : 3);
  p.rect(
    runner.pixelX + flashInset,
    runner.pixelY + flashInset,
    CELL_SIZE - flashInset * 2,
    CELL_SIZE - flashInset * 2,
    8
  );

  if (!reducedMotion) {
    p.stroke(r, g, b, Math.max(0, 60 + Math.round((1 - pulse) * 80)));
    p.strokeWeight(1);
    p.line(
      runner.pixelX + 6,
      runner.pixelY + CELL_SIZE / 2,
      runner.pixelX + CELL_SIZE - 6,
      runner.pixelY + CELL_SIZE / 2
    );
  }

  p.pop();
}

export function drawJumpDropShadow(p, runner, jumpProgress, state = null) {
  if (!runner?.isJumping) {
    return;
  }

  const reducedMotion = prefersReducedMotion(state);
  const groundPixelX = Number.isFinite(Number(runner.jumpGroundPixelX)) ? Number(runner.jumpGroundPixelX) : runner.pixelX;
  const groundPixelY = Number.isFinite(Number(runner.jumpGroundPixelY)) ? Number(runner.jumpGroundPixelY) : runner.pixelY;
  const progress = Number.isFinite(Number(jumpProgress)) ? Math.min(1, Math.max(0, Number(jumpProgress))) : 0;
  const heightRatio = reducedMotion
    ? 0
    : Math.min(1, Math.abs((groundPixelY ?? runner.pixelY) - runner.pixelY) / CELL_SIZE);
  const shadowScale = reducedMotion ? 0.78 : 1 - (heightRatio * 0.42) + (Math.abs(0.5 - progress) * 0.02);
  const shadowAlpha = reducedMotion ? 100 : Math.max(70, Math.round(150 - (heightRatio * 70)));

  p.push();
  p.noStroke();
  p.fill(40, 48, 60, shadowAlpha);
  p.ellipse(
    groundPixelX + CELL_SIZE / 2,
    groundPixelY + CELL_SIZE - 8,
    CELL_SIZE * shadowScale,
    CELL_SIZE * (0.23 + shadowScale * 0.15)
  );
  p.pop();
}

export function drawJumpTakeoffLines(p, runner, jumpProgress, state = null) {
  if (!runner?.isJumping || !Number.isFinite(Number(jumpProgress)) || jumpProgress >= 0.25) {
    return;
  }

  const reducedMotion = prefersReducedMotion(state);
  if (reducedMotion && jumpProgress > 0) {
    return;
  }

  const opacity = reducedMotion ? 1 : getJumpTakeoffLineOpacity(jumpProgress);
  if (opacity <= 0) {
    return;
  }

  const originPixelX = Number.isFinite(Number(runner.jumpOriginPixelX)) ? Number(runner.jumpOriginPixelX) : runner.pixelX;
  const originPixelY = Number.isFinite(Number(runner.jumpOriginPixelY)) ? Number(runner.jumpOriginPixelY) : runner.pixelY;
  const strokeWeight = reducedMotion ? 2.5 : 2;
  const lineLengths = [0.18, 0.24, 0.3];
  const lineAlpha = Math.round(170 * opacity);

  p.push();
  p.stroke(JUMP_TAKEOFF_COLOR[0], JUMP_TAKEOFF_COLOR[1], JUMP_TAKEOFF_COLOR[2], lineAlpha);
  p.strokeWeight(strokeWeight);
  p.noFill();

  const centerX = originPixelX + CELL_SIZE / 2;
  const centerY = originPixelY + CELL_SIZE - 11;
  for (const direction of [-1, 1]) {
    for (let index = 0; index < lineLengths.length; index += 1) {
      const length = CELL_SIZE * lineLengths[index] * (reducedMotion ? 1 : opacity);
      const verticalOffset = index * 2.5;
      p.line(
        centerX + (direction * 4),
        centerY - verticalOffset,
        centerX + (direction * (4 + length)),
        centerY - verticalOffset
      );
    }
  }

  p.pop();
}

export function drawJumpLandingDust(p, cellX, cellY, ringProgress, state = null) {
  if (!Number.isFinite(Number(cellX)) || !Number.isFinite(Number(cellY))) {
    return;
  }

  const progress = Number.isFinite(Number(ringProgress)) ? Math.min(1, Math.max(0, Number(ringProgress))) : 0;
  const reducedMotion = prefersReducedMotion(state);
  if (reducedMotion && progress > 0.12) {
    return;
  }

  const radius = reducedMotion ? CELL_SIZE * 0.6 : CELL_SIZE * (0.22 + (progress * 1.02));
  const alpha = reducedMotion ? 115 : Math.max(0, Math.round(145 - (progress * 145)));
  const weight = reducedMotion ? 2 : 2.5;

  p.push();
  p.noFill();
  p.stroke(JUMP_DUST_COLOR[0], JUMP_DUST_COLOR[1], JUMP_DUST_COLOR[2], alpha);
  p.strokeWeight(weight);
  p.circle(cellX * CELL_SIZE + CELL_SIZE / 2, cellY * CELL_SIZE + CELL_SIZE / 2, radius);
  p.pop();
}

export function drawFrozenCountdownBadge(p, runner, state = null) {
  if (state && state.showFrozenBadges === false) {
    return;
  }
  if (!runner?.isFrozen) {
    return;
  }

  const remainingTurns = Number(runner.frozenTurnsRemaining);
  const badgeText = Number.isFinite(remainingTurns) ? `❄ ${remainingTurns}` : "❄";
  const badgeHeight = 14;
  const badgeX = runner.pixelX + 3;
  const badgeY = runner.pixelY + CELL_SIZE - badgeHeight - 3; // lower-left — does not overlap the upper-left index badge
  const textSize = 9;
  let badgeWidth = Math.max(18, badgeText.length * 6 + 8);
  if (typeof p.textWidth === "function") {
    p.push();
    p.textSize(textSize);
    p.textStyle(p.BOLD);
    badgeWidth = Math.max(18, Math.round(p.textWidth(badgeText) + 8));
    p.pop();
  }

  p.push();
  p.textSize(textSize);
  p.textStyle(p.BOLD);
  p.noStroke();
  p.fill(34, 58, 92, 210);
  p.rect(badgeX, badgeY, badgeWidth, badgeHeight, 6);
  p.stroke(210, 240, 255, 210);
  p.strokeWeight(1);
  p.noFill();
  p.rect(badgeX, badgeY, badgeWidth, badgeHeight, 6);
  p.fill(255);
  p.noStroke();
  p.textAlign(p.LEFT, p.CENTER);
  p.text(badgeText, badgeX + 4, badgeY + badgeHeight / 2 + 0.5);
  p.pop();
}

export function drawIndexLabel(p, x, y, side, index, colors) {
  const badgeWidth = 14;
  const badgeHeight = 14;
  const textSize = 9;

  p.push();
  p.textSize(textSize);
  p.textStyle(p.BOLD);

  // Background: team-tinted color at ~50% opacity
  p.noStroke();
  p.fill(colors[0], colors[1], colors[2], 128);
  p.rect(x, y, badgeWidth, badgeHeight, 4);

  // Border: thin 0.75px white at ~50% opacity
  p.stroke(255, 255, 255, 128);
  p.strokeWeight(0.75);
  p.noFill();
  p.rect(x, y, badgeWidth, badgeHeight, 4);

  // Label: white at ~85% opacity, centered
  p.fill(255, 255, 255, 217);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.text(String(index), x + badgeWidth / 2, y + badgeHeight / 2 + 0.5);
  p.pop();
}

export function drawRunnerLabelBadge(p, runner, state) {
  if (state?.showRunnerIndexBadges !== true) {
    return;
  }
  if (!runner) {
    return;
  }

  // 1. Resolve side (for future extensions if needed)
  const side = runner.team === 1 ? "ally" : "enemy";

  // 2. Resolve index — single namespace per team.
  //    Code-controlled allies use their allyIndex (0, 1, 2, …).
  //    Runners without allyIndex (humans, NPCs) are numbered after the allyIndex range,
  //    so every runner on the same side has a unique badge number.
  let index = null;
  if (typeof runner.allyIndex === "number" && Number.isFinite(runner.allyIndex)) {
    index = runner.allyIndex;
  } else if (state?.allRunners) {
    const allyCount = state.allRunners.filter(
      (r) => r.team === runner.team && typeof r.allyIndex === "number" && Number.isFinite(r.allyIndex)
    ).length;
    const nonAllyRunners = state.allRunners.filter(
      (r) => r.team === runner.team && (typeof r.allyIndex !== "number" || !Number.isFinite(r.allyIndex))
    );
    const nonAllyIndex = nonAllyRunners.indexOf(runner);
    if (nonAllyIndex !== -1) {
      index = allyCount + nonAllyIndex;
    }
  }

  if (index === null) {
    console.warn(`Could not resolve index for runner: ${runner.id}`);
    return;
  }

  // 3. Resolve colors
  const teamColors = getTeamGlowColors(state, runner.team);
  const colors = teamColors ? teamColors.stroke : [128, 128, 128];

  // 4. Calculate position: upper-left by default so the index badge renders above the
  //    runner's feet and avoids covering the head sprite for tall badge text (e.g. "999").
  //    The frozen countdown badge occupies the lower-left, so there is no overlap.
  //    Human-controlled runners shift to the cell midline to avoid overlapping the
  //    "P1"/"P2" label drawn at pixelX+2, pixelY+2 by drawHumanPlayerLabels (PvP only).
  const badgeHeight = 14;
  const badgeX = runner.pixelX + 3;
  let badgeY = runner.pixelY + 3; // upper-left

  if (runner.isHumanControlled) {
    badgeY = runner.pixelY + (CELL_SIZE - badgeHeight) / 2; // midline
  }

  // 5. Delegate rendering
  drawIndexLabel(p, badgeX, badgeY, side, index, colors);
}
