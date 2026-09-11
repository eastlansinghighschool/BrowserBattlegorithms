import { BARRIER_EMOJI, CELL_SIZE } from "../config/constants.js";
import { CANVAS_PALETTE } from "../render/canvasPalette.js";

export class Barrier {
  constructor(gridX, gridY, ownerRunnerId) {
    this.gridX = gridX;
    this.gridY = gridY;
    this.ownerRunnerId = ownerRunnerId;
    this.emojiChar = BARRIER_EMOJI;
    this.id = `barrier_${ownerRunnerId}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
  }

  display(p) {
    p.fill(...CANVAS_PALETTE.barrierGlyphText);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(CELL_SIZE * 0.6);
    p.text(this.emojiChar, this.gridX * CELL_SIZE + CELL_SIZE / 2, this.gridY * CELL_SIZE + CELL_SIZE / 2);
  }
}
