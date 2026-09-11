import { TEAM_GLOW_COLORS } from "../config/constants.js";

/**
 * canvasPalette.js — Canonical palette tokens for the p5 canvas rendering layer.
 *
 * Rules:
 * 1. Tokens are named for functional role, never hue or appearance (Plan 126 / Charter V7).
 * 2. Alpha values are bundled with the token where static, rather than applied as magic numbers
 *    at call sites.
 * 3. Pure data module: no theme conditionals, no state reads, and no reduced-motion checks
 *    (Plan 126 R2). Theme variants belong to P3.
 * 4. Immutable: all tokens and structures are deeply frozen to prevent runtime mutation.
 */

export const CANVAS_PALETTE = Object.freeze({
  // Board cells and grid lines (src/render/drawBoard.js)
  boardGridLine: Object.freeze([180]),
  boardCellFloor: Object.freeze([245, 245, 245]),
  boardCellWall: Object.freeze([100, 100, 100]),
  boardCellJail: Object.freeze([200, 200, 200]),
  boardCellJailBorder: Object.freeze([50]),
  territoryTeam1Base: Object.freeze([173, 216, 230, 150]),
  territoryTeam2Base: Object.freeze([255, 165, 0, 150]),
  boardCellFallback: Object.freeze([255]),

  // Canvas backdrop and level goals (src/render/p5App.js)
  canvasBackground: Object.freeze([220]),
  levelGoalHighlight: Object.freeze([0, 140, 255]),

  // Game over overlay (src/render/drawEntities.js)
  gameOverBackdrop: Object.freeze([0, 0, 0, 180]),
  gameOverText: Object.freeze([255]),

  // Entity emoji text fills (src/entities/*.js)
  runnerGlyphText: Object.freeze([0]),
  runnerCarriedFlagText: Object.freeze([0]),
  flagGlyphText: Object.freeze([0]),
  barrierGlyphText: Object.freeze([0]),

  // Frozen countdown badge (src/render/effects.js)
  frozenBadgeBackground: Object.freeze([34, 58, 92, 210]),
  frozenBadgeBorder: Object.freeze([210, 240, 255, 210]),
  frozenBadgeText: Object.freeze([255]),

  // Runner index badge (src/render/effects.js)
  runnerIndexBadgeBorder: Object.freeze([255, 255, 255, 128]),
  runnerIndexBadgeText: Object.freeze([255, 255, 255, 217]),
  runnerIndexBadgeBackgroundAlpha: 128,

  // Jump animation base colours (src/render/effects.js - alphas are dynamic)
  jumpDropShadowBase: Object.freeze([40, 48, 60]),
  jumpTakeoffLineBase: Object.freeze([150, 160, 170]),
  jumpLandingDustBase: Object.freeze([170, 180, 190]),

  // Area freeze pulse & flash base colours (src/render/effects.js - alphas are dynamic)
  areaFreezePulseBase: Object.freeze([220, 245, 255]),
  areaFreezeFlashBase: Object.freeze([190, 230, 255]),

  // Team identity glow tokens (mirrors TEAM_GLOW_COLORS for canvas consumers)
  team1GlowFill: Object.freeze([...TEAM_GLOW_COLORS[1].fill]),
  team1GlowStroke: Object.freeze([...TEAM_GLOW_COLORS[1].stroke]),
  team2GlowFill: Object.freeze([...TEAM_GLOW_COLORS[2].fill]),
  team2GlowStroke: Object.freeze([...TEAM_GLOW_COLORS[2].stroke]),
  teamGlow: Object.freeze({
    1: Object.freeze({
      fill: Object.freeze([...TEAM_GLOW_COLORS[1].fill]),
      stroke: Object.freeze([...TEAM_GLOW_COLORS[1].stroke])
    }),
    2: Object.freeze({
      fill: Object.freeze([...TEAM_GLOW_COLORS[2].fill]),
      stroke: Object.freeze([...TEAM_GLOW_COLORS[2].stroke])
    })
  })
});
