import { BASE_ANIMATION_SPEED, CELL_SIZE, FPS } from "../config/constants.js";

const JUMP_ANTICIPATION_PROGRESS = 0.15;
const JUMP_ARC_PROGRESS = 0.85;
const JUMP_MIN_DURATION_MS = 320;

export function easeInOutQuad(t) {
  let normalized = t / 0.5;
  if (normalized < 1) {
    return 0.5 * normalized * normalized;
  }
  normalized -= 1;
  return -0.5 * (normalized * (normalized - 2) - 1);
}

export function getJumpArcProgress(progress) {
  if (!Number.isFinite(progress) || progress <= JUMP_ANTICIPATION_PROGRESS) {
    return 0;
  }
  return Math.min(1, Math.max(0, (progress - JUMP_ANTICIPATION_PROGRESS) / JUMP_ARC_PROGRESS));
}

export function getJumpArcOffset(progress, arcAmplitude = 1) {
  const arcProgress = getJumpArcProgress(progress);
  if (arcProgress <= 0) {
    return 0;
  }
  return Math.sin(arcProgress * Math.PI) * -CELL_SIZE * arcAmplitude;
}

export function getJumpTakeoffLineOpacity(progress) {
  if (!Number.isFinite(progress) || progress <= JUMP_ANTICIPATION_PROGRESS) {
    return 1;
  }
  if (progress >= 0.25) {
    return 0;
  }
  return 1 - ((progress - JUMP_ANTICIPATION_PROGRESS) / 0.1);
}

export function getJumpAnimationProgressIncrement(animationSpeedFactor) {
  const speedFactor = Number(animationSpeedFactor);
  const scaledIncrement = Number.isFinite(speedFactor) ? BASE_ANIMATION_SPEED * speedFactor : BASE_ANIMATION_SPEED;
  const floorIncrement = (1000 / FPS) / JUMP_MIN_DURATION_MS;
  return Math.min(scaledIncrement, floorIncrement);
}
