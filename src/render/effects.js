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

const AREA_FREEZE_PULSE_COLOR = [220, 245, 255];
const AREA_FREEZE_FLASH_COLOR = [190, 230, 255];

function prefersReducedMotion() {
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

  const reducedMotion = prefersReducedMotion();
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

export function drawAreaFreezeRunnerFlash(p, runner, effect) {
  if (!effect || !runner || !Array.isArray(effect.affectedRunners)) {
    return;
  }

  const affected = effect.affectedRunners.some((candidate) => candidate.runnerId === runner.id);
  if (!affected) {
    return;
  }

  const reducedMotion = prefersReducedMotion();
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

export function drawFrozenCountdownBadge(p, runner) {
  if (!runner?.isFrozen) {
    return;
  }

  const remainingTurns = Number(runner.frozenTurnsRemaining);
  const badgeText = Number.isFinite(remainingTurns) ? `❄ ${remainingTurns}` : "❄";
  const badgeX = runner.pixelX + 3;
  const badgeY = runner.pixelY + CELL_SIZE - 17;
  const badgeHeight = 14;
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
