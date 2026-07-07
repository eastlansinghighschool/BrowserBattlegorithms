import {
  BASE_ANIMATION_SPEED,
  CELL_SIZE
} from "../config/constants.js";
import { resetRecentMovementState } from "../core/recentMovement.js";
import { easeInOutQuad, getJumpAnimationProgressIncrement, getJumpArcOffset, getJumpArcProgress } from "../render/animation.js";
import {
  drawAreaFreezeRunnerFlash,
  drawFrozenCountdownBadge,
  drawJumpDropShadow,
  drawJumpTakeoffLines,
  drawRunnerLabelBadge,
  prefersReducedMotion
} from "../render/effects.js";
import { resolveRunnerDisplayEmoji, shouldMirrorRunnerEmoji } from "../render/runnerVisuals.js";

export class Runner {
  constructor(x, y, team, isHumanControlled = false, idSuffix = "", isNPC = false) {
    this.initialGridX = x;
    this.initialGridY = y;
    this.gridX = x;
    this.gridY = y;
    this.pixelX = this.gridX * CELL_SIZE;
    this.pixelY = this.gridY * CELL_SIZE;
    this.isMoving = false;
    this.isJumping = false;
    this.animationProgress = 0;
    this.isBouncing = false;
    this.bounceProgress = 0;
    this.targetGridX = this.gridX;
    this.targetGridY = this.gridY;
    this.targetPixelX = this.pixelX;
    this.targetPixelY = this.pixelY;
    this.bounceOriginPixelX = this.pixelX;
    this.bounceOriginPixelY = this.pixelY;
    this.bounceMidPixelX = this.pixelX;
    this.bounceMidPixelY = this.pixelY;
    this.jumpOriginGridX = this.gridX;
    this.jumpOriginGridY = this.gridY;
    this.jumpOriginPixelX = this.pixelX;
    this.jumpOriginPixelY = this.pixelY;
    this.jumpGroundPixelX = this.pixelX;
    this.jumpGroundPixelY = this.pixelY;
    this.jumpMidPixelX = this.pixelX;
    this.jumpMidPixelY = this.pixelY;
    this.animationCompletionType = null;
    this.team = team;
    this.isHumanControlled = isHumanControlled;
    this.isNPC = isNPC;
    this.id = `runner_${team}_${idSuffix || Math.random().toString(16).slice(2, 8)}`;
    this.playDirection = 1;
    this.guidedVerticalPatrolDirection = null;
    this.runnerRole = this.isHumanControlled ? "human" : (this.isNPC ? "npc" : "ally");
    this.allyIndex = null;
    this.carriedFlagEmoji = null;

    this.resetToInitial();
  }

  getDisplayEmoji() {
    return resolveRunnerDisplayEmoji(this);
  }

  shouldMirrorEmojiDisplay() {
    return shouldMirrorRunnerEmoji(this);
  }

  setFrozen(turns) {
    this.isFrozen = true;
    this.frozenTurnsRemaining = turns;
    this.isMoving = false;
    this.isJumping = false;
    this.jumpFailedReversal = false;
    this.isBouncing = false;
    this.animationProgress = 0;
    this.bounceProgress = 0;
    this.pixelX = this.gridX * CELL_SIZE;
    this.pixelY = this.gridY * CELL_SIZE;
    this.isGracePeriod = false;
    this.animationCompletionType = null;
  }

  display(p, state = null) {
    const emojiToDisplay = this.getDisplayEmoji();
    const centerX = this.pixelX + CELL_SIZE / 2;
    const centerY = this.pixelY + CELL_SIZE / 2;
    const freezeEffect = state?.areaFreezeEffect || null;
    const jumpProgress = this.animationProgress;

    p.push();
    drawJumpDropShadow(p, this, jumpProgress, state);
    drawJumpTakeoffLines(p, this, jumpProgress, state);
    drawAreaFreezeRunnerFlash(p, this, freezeEffect, state);
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(CELL_SIZE * 0.7);
    if (this.shouldMirrorEmojiDisplay()) {
      p.translate(centerX, centerY);
      p.scale(-1, 1);
      p.text(emojiToDisplay, 0, 0);
    } else {
      p.text(emojiToDisplay, centerX, centerY);
    }
    p.pop();

    if (this.hasEnemyFlag) {
      p.push();
      p.fill(0);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(CELL_SIZE * 0.3);
      p.text(
        this.carriedFlagEmoji || "⚑",
        this.pixelX + CELL_SIZE * 0.8,
        this.pixelY + CELL_SIZE * 0.2
      );
      p.pop();
    }

    drawFrozenCountdownBadge(p, this, state);
    drawRunnerLabelBadge(p, this, state);
  }

  pickupFlag(flag) {
    if (flag.teamId === this.team) {
      return;
    }
    this.hasEnemyFlag = true;
    flag.carriedByRunnerId = this.id;
    flag.isAtBase = false;
  }

  dropFlag(flagToDrop) {
    if (this.hasEnemyFlag && flagToDrop && flagToDrop.carriedByRunnerId === this.id) {
      this.hasEnemyFlag = false;
      flagToDrop.carriedByRunnerId = null;
    }
  }

  resetToInitial() {
    this.gridX = this.initialGridX;
    this.gridY = this.initialGridY;
    this.pixelX = this.gridX * CELL_SIZE;
    this.pixelY = this.gridY * CELL_SIZE;
    this.targetGridX = this.gridX;
    this.targetGridY = this.gridY;
    this.targetPixelX = this.pixelX;
    this.targetPixelY = this.pixelY;
    this.hasEnemyFlag = false;
    this.isMoving = false;
    this.isJumping = false;
    this.animationProgress = 0;
    this.isBouncing = false;
    this.bounceProgress = 0;
    this.isFrozen = false;
    this.frozenTurnsRemaining = 0;
    this.isAutoSkipFrozen = false;
    this.canJump = true;
    this.canPlaceBarrier = true;
    this.guidedVerticalPatrolDirection = null;
    this.activeBarrierId = null;
    this.isGracePeriod = false;
    this.animationCompletionType = null;
    this.jumpFailedReversal = false;
    this.jumpOriginGridX = this.gridX;
    this.jumpOriginGridY = this.gridY;
    this.jumpOriginPixelX = this.pixelX;
    this.jumpOriginPixelY = this.pixelY;
    this.jumpGroundPixelX = this.pixelX;
    this.jumpGroundPixelY = this.pixelY;
    this.jumpMidPixelX = this.pixelX;
    this.jumpMidPixelY = this.pixelY;
    resetRecentMovementState(this);
  }

  startJumpAnimation(targetGridX, targetGridY) {
    if (this.isMoving || this.isJumping || this.isBouncing || this.isFrozen || !this.canJump) {
      return false;
    }
    this.targetGridX = targetGridX;
    this.targetGridY = targetGridY;
    this.targetPixelX = targetGridX * CELL_SIZE;
    this.targetPixelY = targetGridY * CELL_SIZE;
    this.jumpOriginGridX = this.gridX;
    this.jumpOriginGridY = this.gridY;
    this.jumpOriginPixelX = this.gridX * CELL_SIZE;
    this.jumpOriginPixelY = this.gridY * CELL_SIZE;
    this.jumpGroundPixelX = this.jumpOriginPixelX;
    this.jumpGroundPixelY = this.jumpOriginPixelY;
    this.jumpMidPixelX = this.jumpOriginPixelX + (this.targetPixelX - this.jumpOriginPixelX) * 0.5;
    this.jumpMidPixelY = this.jumpOriginPixelY + (this.targetPixelY - this.jumpOriginPixelY) * 0.5;
    this.pixelX = this.jumpOriginPixelX;
    this.pixelY = this.jumpOriginPixelY;
    this.isMoving = true;
    this.isJumping = true;
    this.jumpFailedReversal = false;
    this.animationProgress = 0;
    this.animationCompletionType = null;
    this.canJump = false;
    return true;
  }

  startFailedJumpAnimation(attemptedTargetGridX, attemptedTargetGridY) {
    if (this.isMoving || this.isJumping || this.isBouncing || this.isFrozen) {
      return false;
    }
    this.targetGridX = attemptedTargetGridX;
    this.targetGridY = attemptedTargetGridY;
    this.targetPixelX = attemptedTargetGridX * CELL_SIZE;
    this.targetPixelY = attemptedTargetGridY * CELL_SIZE;
    this.jumpOriginGridX = this.gridX;
    this.jumpOriginGridY = this.gridY;
    this.jumpOriginPixelX = this.gridX * CELL_SIZE;
    this.jumpOriginPixelY = this.gridY * CELL_SIZE;
    this.jumpGroundPixelX = this.jumpOriginPixelX;
    this.jumpGroundPixelY = this.jumpOriginPixelY;
    this.jumpMidPixelX = this.jumpOriginPixelX + (this.targetPixelX - this.jumpOriginPixelX) * 0.5;
    this.jumpMidPixelY = this.jumpOriginPixelY + (this.targetPixelY - this.jumpOriginPixelY) * 0.5;
    this.pixelX = this.jumpOriginPixelX;
    this.pixelY = this.jumpOriginPixelY;
    this.isMoving = true;
    this.isJumping = true;
    this.jumpFailedReversal = true;
    this.animationProgress = 0;
    this.animationCompletionType = null;
    this.canJump = false;
    return true;
  }

  startMoveAnimation(targetGridX, targetGridY) {
    if (this.isMoving || this.isBouncing || this.isFrozen) {
      return false;
    }
    this.targetGridX = targetGridX;
    this.targetGridY = targetGridY;
    this.targetPixelX = targetGridX * CELL_SIZE;
    this.targetPixelY = targetGridY * CELL_SIZE;
    this.pixelX = this.gridX * CELL_SIZE;
    this.pixelY = this.gridY * CELL_SIZE;
    this.isMoving = true;
    this.isJumping = false;
    this.jumpFailedReversal = false;
    this.animationCompletionType = null;
    this.animationProgress = 0;
    return true;
  }

  startBounceAnimation(attemptedTargetGridX, attemptedTargetGridY) {
    if (this.isMoving || this.isBouncing || this.isFrozen) {
      return false;
    }
    this.isBouncing = true;
    this.isJumping = false;
    this.jumpFailedReversal = false;
    this.animationCompletionType = null;
    this.bounceProgress = 0;
    this.bounceOriginPixelX = this.gridX * CELL_SIZE;
    this.bounceOriginPixelY = this.gridY * CELL_SIZE;
    const bounceDistanceFactor = 0.3;
    this.bounceMidPixelX =
      this.bounceOriginPixelX +
      (attemptedTargetGridX * CELL_SIZE - this.bounceOriginPixelX) * bounceDistanceFactor;
    this.bounceMidPixelY =
      this.bounceOriginPixelY +
      (attemptedTargetGridY * CELL_SIZE - this.bounceOriginPixelY) * bounceDistanceFactor;
    this.pixelX = this.bounceOriginPixelX;
    this.pixelY = this.bounceOriginPixelY;
    return true;
  }

  updateAnimation(animationSpeedFactor, p, state = null) {
    let animationCompletedThisFrame = false;
    const currentFrameSpeed = this.isJumping
      ? getJumpAnimationProgressIncrement(animationSpeedFactor)
      : BASE_ANIMATION_SPEED * animationSpeedFactor;

    if (this.isJumping) {
      this.animationProgress += currentFrameSpeed;
      const reducedMotion = prefersReducedMotion(state);
      const jumpProgress = Math.min(1, this.animationProgress);

      if (this.jumpFailedReversal) {
        const travelProgress = Math.sin(jumpProgress * Math.PI);
        const groundPixelX = p.lerp(this.jumpOriginPixelX, this.jumpMidPixelX, travelProgress);
        const groundPixelY = p.lerp(this.jumpOriginPixelY, this.jumpMidPixelY, travelProgress);
        this.jumpGroundPixelX = groundPixelX;
        this.jumpGroundPixelY = groundPixelY;
        this.pixelX = groundPixelX;
        this.pixelY = groundPixelY + getJumpArcOffset(jumpProgress, reducedMotion ? 0.2 : 0.6);
      } else {
        const arcProgress = getJumpArcProgress(jumpProgress);
        const easedProgress = easeInOutQuad(arcProgress);
        const groundPixelX = p.lerp(this.jumpOriginPixelX, this.targetPixelX, easedProgress);
        const groundPixelY = p.lerp(this.jumpOriginPixelY, this.targetPixelY, easedProgress);
        this.jumpGroundPixelX = groundPixelX;
        this.jumpGroundPixelY = groundPixelY;
        this.pixelX = groundPixelX;
        this.pixelY = groundPixelY + getJumpArcOffset(jumpProgress, reducedMotion ? 0.3 : 1.0);
      }

      if (this.animationProgress >= 1 || (state && state.runnerJumpingAnimations === false)) {
        this.animationProgress = 1;
        if (this.jumpFailedReversal) {
          this.gridX = this.jumpOriginGridX;
          this.gridY = this.jumpOriginGridY;
          this.pixelX = this.jumpOriginPixelX;
          this.pixelY = this.jumpOriginPixelY;
          this.jumpGroundPixelX = this.jumpOriginPixelX;
          this.jumpGroundPixelY = this.jumpOriginPixelY;
          this.animationCompletionType = "jump_failed";
        } else {
          this.gridX = this.targetGridX;
          this.gridY = this.targetGridY;
          this.pixelX = this.targetPixelX;
          this.pixelY = this.targetPixelY;
          this.jumpGroundPixelX = this.targetPixelX;
          this.jumpGroundPixelY = this.targetPixelY;
          this.animationCompletionType = "jump_success";
        }
        this.isMoving = false;
        this.isJumping = false;
        this.jumpFailedReversal = false;
        animationCompletedThisFrame = true;
      }

      return animationCompletedThisFrame;
    }

    if (this.isMoving) {
      this.animationProgress += currentFrameSpeed;
      const easedProgress = easeInOutQuad(this.animationProgress);
      if (this.animationProgress >= 1 || (state && state.runnerMovementAnimations === false)) {
        this.animationProgress = 1;
        this.pixelX = this.targetPixelX;
        this.pixelY = this.targetPixelY;
        this.gridX = this.targetGridX;
        this.gridY = this.targetGridY;
        this.isMoving = false;
        this.animationCompletionType = "move";
        animationCompletedThisFrame = true;
      } else {
        this.pixelX = p.lerp(this.gridX * CELL_SIZE, this.targetPixelX, easedProgress);
        this.pixelY = p.lerp(this.gridY * CELL_SIZE, this.targetPixelY, easedProgress);
      }
    } else if (this.isBouncing) {
      this.bounceProgress += currentFrameSpeed * 2;
      const easedBounceProgress = easeInOutQuad(this.bounceProgress);
      if (this.bounceProgress >= 1 || (state && state.runnerMovementAnimations === false)) {
        this.pixelX = this.bounceOriginPixelX;
        this.pixelY = this.bounceOriginPixelY;
        this.isBouncing = false;
        this.bounceProgress = 0;
        this.animationCompletionType = "bounce";
        animationCompletedThisFrame = true;
      } else if (this.bounceProgress < 0.5) {
        this.pixelX = p.lerp(this.bounceOriginPixelX, this.bounceMidPixelX, easedBounceProgress * 2);
        this.pixelY = p.lerp(this.bounceOriginPixelY, this.bounceMidPixelY, easedBounceProgress * 2);
      } else if (this.bounceProgress < 1) {
        this.pixelX = p.lerp(this.bounceMidPixelX, this.bounceOriginPixelX, (easedBounceProgress - 0.5) * 2);
        this.pixelY = p.lerp(this.bounceMidPixelY, this.bounceOriginPixelY, (easedBounceProgress - 0.5) * 2);
      }
    }

    return animationCompletedThisFrame;
  }
}
