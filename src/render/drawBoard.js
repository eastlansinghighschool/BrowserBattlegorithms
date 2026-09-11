import { CELL_SIZE, COLS, ROWS, CELL_TYPE } from "../config/constants.js";
import { CANVAS_PALETTE } from "./canvasPalette.js";

export function drawGrid(p) {
  p.stroke(...CANVAS_PALETTE.boardGridLine);
  p.strokeWeight(1);
  for (let c = 0; c <= COLS; c += 1) {
    p.line(c * CELL_SIZE, 0, c * CELL_SIZE, ROWS * CELL_SIZE);
  }
  for (let r = 0; r <= ROWS; r += 1) {
    p.line(0, r * CELL_SIZE, COLS * CELL_SIZE, r * CELL_SIZE);
  }
}

export function drawMapElements(p, gameMap) {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      const cellType = gameMap[r][c];
      const xPos = c * CELL_SIZE;
      const yPos = r * CELL_SIZE;
      p.push();
      switch (cellType) {
        case CELL_TYPE.FLOOR:
          p.fill(...CANVAS_PALETTE.boardCellFloor);
          p.noStroke();
          break;
        case CELL_TYPE.WALL:
          p.fill(...CANVAS_PALETTE.boardCellWall);
          p.noStroke();
          break;
        case CELL_TYPE.JAIL:
          p.fill(...CANVAS_PALETTE.boardCellJail);
          p.stroke(...CANVAS_PALETTE.boardCellJailBorder);
          p.strokeWeight(2);
          break;
        case CELL_TYPE.TEAM1_BASE:
          p.fill(...CANVAS_PALETTE.territoryTeam1Base);
          p.noStroke();
          break;
        case CELL_TYPE.TEAM2_BASE:
          p.fill(...CANVAS_PALETTE.territoryTeam2Base);
          p.noStroke();
          break;
        default:
          p.fill(...CANVAS_PALETTE.boardCellFallback);
          p.noStroke();
      }
      p.rect(xPos, yPos, CELL_SIZE, CELL_SIZE);
      p.pop();
    }
  }
}
