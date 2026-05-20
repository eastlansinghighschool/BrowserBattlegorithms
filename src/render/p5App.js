import p5 from "p5";
import { CELL_SIZE, COLS, FPS, MAIN_GAME_STATES, ROWS, TURN_STATES } from "../config/constants.js";
import { processTurnActions } from "../core/turnEngine.js";
import { getLevelGoalCell } from "../core/levels.js";
import { drawGrid, drawMapElements } from "./drawBoard.js";
import { drawBarriers, drawFlags, drawGameOverOverlay, drawHumanPlayerLabels, drawRunners } from "./drawEntities.js";
import { drawActiveRunnerGlow, drawAreaFreezePulse, drawJumpLandingDust } from "./effects.js";
import { handleKeyInput } from "../ui/controls.js";

function isBlocklyKeyboardFocusActive() {
  if (typeof document === "undefined") {
    return false;
  }

  const activeElement = document.activeElement;
  if (!activeElement || typeof activeElement.closest !== "function") {
    return false;
  }

  return Boolean(
    activeElement.closest("#blockly-region") ||
    activeElement.closest("#shortcuts") ||
    activeElement.closest(".blocklyWidgetDiv") ||
    activeElement.closest(".blocklyDropDownDiv")
  );
}

function drawLevelGoal(p, app) {
  const goalCell = getLevelGoalCell(app);
  if (!goalCell) {
    return;
  }

  p.push();
  p.noFill();
  p.stroke(0, 140, 255);
  p.strokeWeight(4);
  p.rect(goalCell.x * CELL_SIZE + 4, goalCell.y * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8, 10);
  p.strokeWeight(2);
  p.circle(goalCell.x * CELL_SIZE + CELL_SIZE / 2, goalCell.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE * 0.45);
  p.pop();
}

export function initializeP5App(app) {
  app.p5Instance = new p5((p) => {
    p.setup = () => {
      const canvas = p.createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);
      canvas.parent("canvas-container");
      p.frameRate(FPS);
    };

    p.draw = () => {
      p.background(220);
      if (app.state.mainGameState === MAIN_GAME_STATES.RUNNING && app.state.currentTurnState !== TURN_STATES.GAME_OVER) {
        processTurnActions(app, p);
      }

      for (const teamId of Object.keys(app.state.gameFlags)) {
        const flag = app.state.gameFlags[teamId];
        if (flag && flag.carriedByRunnerId) {
          const carrier = app.state.allRunners.find((runner) => runner.id === flag.carriedByRunnerId);
          if (carrier) {
            flag.gridX = carrier.gridX;
            flag.gridY = carrier.gridY;
          }
        }
      }

      drawMapElements(p, app.state.gameMap);
      drawGrid(p);
      drawLevelGoal(p, app);
      if (app.state.activeJumpLandingDust) {
        const dust = app.state.activeJumpLandingDust;
        const elapsedMs = Math.max(0, Date.now() - dust.startedAtMs);
        const ringProgress = dust.durationMs > 0 ? Math.min(1, elapsedMs / dust.durationMs) : 1;
        if (elapsedMs < dust.durationMs) {
          drawJumpLandingDust(p, dust.cellX, dust.cellY, ringProgress);
        }
      }
      drawAreaFreezePulse(p, app);
      drawActiveRunnerGlow(p, app.state);
      drawFlags(p, app.state);
      drawBarriers(p, app.state);
      drawRunners(p, app.state);
      drawHumanPlayerLabels(p, app.state);
      drawGameOverOverlay(p, app.state);
      app.hooks.refreshCellInspector?.();
    };

    p.keyPressed = (event) => {
      if (isBlocklyKeyboardFocusActive()) {
        return undefined;
      }
      if (event && (event.ctrlKey || event.altKey || event.metaKey)) {
        return undefined;
      }

      const handled = handleKeyInput(app, p.key);
      return handled === true ? false : undefined;
    };
  });
}
