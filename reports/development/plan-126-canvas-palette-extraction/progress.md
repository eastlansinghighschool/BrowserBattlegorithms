# Progress Report: Plan 126 — Canvas Palette Extraction

## Overall Summary

Plan 126 extracted every hard-coded canvas colour into one named palette module (`src/render/canvasPalette.js`) with zero visual change, delivering Plan 123's P1 prerequisite for skin registry (P2) and light/dark theme (P3).

The mechanical pre-refactor survey confirmed exactly 34 colour call sites across 7 files (correcting the charter's initial estimate of ~29 sites across 4 files, which missed the 3 entity files `Runner.js`, `Flag.js`, and `Barrier.js`). The pre-refactor baseline fixture was mechanically extracted and committed in its own commit before any render code was altered. The refactor replaced every hard-coded colour literal with a semantic role-named token, leaving pure data in the palette, preserving dynamic animation alpha computations at call sites, maintaining architectural separation between core and render, and adding a suite of pinning tests asserting zero visual divergence.

## Commits and Ordering

Following the pattern from Plan 121:
1. **Baseline Fixture Commit**: `64828dc` (`Capture pre-refactor canvas palette baseline fixture (plan-126)`)
   - Committed `scripts/dev/extract-canvas-palette-baseline.js` and `tests/fixtures/canvas-palette-baseline.json`.
2. **Implementation Commit**: `7ec9482` (`Extract canvas colour palette to named module (plan-126)`)
   - Created `src/render/canvasPalette.js`.
   - Replaced all 34 call sites across the 7 surveyed files.
   - Added and registered `tests/unit/canvas-palette.test.js`.
   - Updated subsystem note `docs/subsystems/p5-surface-map.md`.
   - Added dated correction note to Plan 123 V7.

## Advisor Consultation

- **Capability & Branch**: Branch C — orchestrator-gate-only.
- **Rationale**: Not advisor-capable under the `advisor-capable-providers.json` fail-closed rule (current provider/tool environment Antigravity / Gemini 3.8 Flash is not an entry in `advisor-capable-providers.json`). No consultation ran; standard orchestrator review gate applies.

## Survey and Call Site Breakdown

The mechanical survey found 34 call sites across 7 files (21 static, 13 dynamic):

| File | Sites | Classification & Tokens |
|---|---|---|
| `src/render/drawBoard.js` | 8 | All static: `boardGridLine`, `boardCellFloor`, `boardCellWall`, `boardCellJail`, `boardCellJailBorder`, `territoryTeam1Base`, `territoryTeam2Base`, `boardCellFallback`. |
| `src/render/p5App.js` | 2 | Both static: `levelGoalHighlight`, `canvasBackground`. |
| `src/render/drawEntities.js` | 3 | 2 static: `gameOverBackdrop`, `gameOverText`. 1 dynamic: `drawHumanPlayerLabels` team stroke colour (`CANVAS_PALETTE.teamGlow[runner.team].stroke`). |
| `src/entities/Runner.js` | 2 | Both static: `runnerGlyphText`, `runnerCarriedFlagText`. |
| `src/entities/Flag.js` | 1 | Static: `flagGlyphText`. |
| `src/entities/Barrier.js` | 1 | Static: `barrierGlyphText`. |
| `src/render/effects.js` | 17 | 5 static: `frozenBadgeBackground`, `frozenBadgeBorder`, `frozenBadgeText`, `runnerIndexBadgeBorder`, `runnerIndexBadgeText`. 12 dynamic: active runner glow fill (2 sites, pulsing sin / solid alpha) and stroke (1 site, team stroke); Area Freeze pulse fill & strokes (3 sites, base `areaFreezePulseBase` with dynamic alpha); Area Freeze runner flash (2 sites, base `areaFreezeFlashBase` with dynamic alpha); jump drop shadow (1 site, base `jumpDropShadowBase` with heightRatio alpha); jump takeoff lines (1 site, base `jumpTakeoffLineBase` with takeoff opacity alpha); jump landing dust (1 site, base `jumpLandingDustBase` with ring progress alpha); runner index badge background (1 site, team stroke with `runnerIndexBadgeBackgroundAlpha: 128`). |

Total: **34 call sites across 7 files**.

## Disposition of Pre-Existing Named Constants

1. **`AREA_FREEZE_PULSE_COLOR`**, **`AREA_FREEZE_FLASH_COLOR`**, **`JUMP_TAKEOFF_COLOR`**, and **`JUMP_DUST_COLOR`**:
   - *Previous state*: Defined as file-local constants in `src/render/effects.js`.
   - *Disposition*: Removed from `effects.js` and migrated into `src/render/canvasPalette.js` as canonical role tokens (`areaFreezePulseBase`, `areaFreezeFlashBase`, `jumpTakeoffLineBase`, `jumpLandingDustBase`).
2. **`TEAM_GLOW_COLORS`**:
   - *Previous state*: Exported from `src/config/constants.js`.
   - *Disposition*: Retained in `src/config/constants.js` to preserve the invariant that `src/core/teams.js` initializes team identity defaults without depending on `src/render/` (preventing core-to-render layer inversion). In `src/render/canvasPalette.js`, tokens `team1GlowFill`, `team1GlowStroke`, `team2GlowFill`, `team2GlowStroke`, and `teamGlow` mirror these values. Render callers (`drawEntities.js`, `effects.js`) obtain canvas colors exclusively from `CANVAS_PALETTE` or runtime team state (`getTeamGlowColors`), removing all direct imports of `TEAM_GLOW_COLORS` in the render layer.

## Files Changed

- `scripts/dev/extract-canvas-palette-baseline.js` (new) — mechanical extraction script generating baseline fixture.
- `tests/fixtures/canvas-palette-baseline.json` (new) — committed pre-refactor baseline fixture.
- `src/render/canvasPalette.js` (new) — immutable, role-named canvas palette module.
- `src/render/drawBoard.js` — replaced 8 inline colour literals with `CANVAS_PALETTE` tokens.
- `src/render/drawEntities.js` — replaced 3 colour call sites with `CANVAS_PALETTE` tokens.
- `src/render/effects.js` — replaced 17 colour call sites with `CANVAS_PALETTE` tokens / bases.
- `src/render/p5App.js` — replaced 2 colour call sites with `CANVAS_PALETTE` tokens.
- `src/entities/Runner.js` — replaced 2 emoji text fill sites with `CANVAS_PALETTE` tokens.
- `src/entities/Flag.js` — replaced 1 emoji text fill site with `CANVAS_PALETTE` token.
- `src/entities/Barrier.js` — replaced 1 emoji text fill site with `CANVAS_PALETTE` token.
- `tests/unit/canvas-palette.test.js` (new) — unit tests pinning palette values to baseline fixture and asserting immutability.
- `package.json` — registered `tests/unit/canvas-palette.test.js` in `test:unit`.
- `docs/subsystems/p5-surface-map.md` — recorded convention, single-home rule, role-naming rule, and constant disposition.
- `docs/development/plan-123-visual-customization-charter.md` — dated note correcting V7 call site count.

## Validation Checks Performed

1. `node scripts/dev/plan-status.js check 126`: Passed (`RUNNABLE: plan-126 is ready to implement`).
2. `node scripts/dev/extract-canvas-palette-baseline.js`: Extracted exactly 34 call sites across 7 files (21 static, 13 dynamic).
3. `node --test tests/unit/canvas-palette.test.js`: All 6 tests passed (fixture integrity, immutability, exact static value equality, dynamic base value equality, team glow equality, absence of raw colour literals in surveyed files).
4. `npm test`: Full unit test suite passed (619/619 tests).
5. `npm run build`: Vite client production build completed cleanly with no errors.
6. `npm run test:browser:smoke`: All 61 browser smoke tests passed (36.6s).

## Problems Encountered and Resolution

- *Survey Count Discrepancy*: Charter V7 estimated ~29 inline sites across 4 render files. Re-running the mechanical survey found 34 sites across 7 files (the charter had omitted `src/entities/Runner.js`, `Flag.js`, and `Barrier.js`). Resolved by including all 7 files in the baseline extraction and adding a dated correction note to Charter V7.
- *Constants Location Discrepancy*: Plan 126 noted that four constants lived in `src/config/constants.js`. Investigation revealed that `AREA_FREEZE_PULSE_COLOR`, `JUMP_TAKEOFF_COLOR`, and `JUMP_DUST_COLOR` (plus `AREA_FREEZE_FLASH_COLOR`) actually resided locally in `effects.js`, while only `TEAM_GLOW_COLORS` was in `constants.js`. Resolved by moving the local effect constants completely into `canvasPalette.js` while retaining `TEAM_GLOW_COLORS` in `constants.js` for core team initialization to preserve layer independence.

## Remaining Risks or Follow-ups

- None. No visual changes were introduced; all values match the committed pre-refactor baseline fixture.
- Unblocks Plan 123 P2 (Skin Registry) and P3 (Light/Dark Theme).

## Ready for Orchestrator Review

Yes.
