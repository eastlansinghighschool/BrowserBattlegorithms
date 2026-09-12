# Progress Report: Plan 126 — Canvas Palette Extraction

## Overall Summary

Plan 126 extracted every hard-coded canvas colour into one named palette module (`src/render/canvasPalette.js`) with zero visual change, delivering Plan 123's P1 prerequisite for skin registry (P2) and light/dark theme (P3).

The mechanical pre-refactor survey confirmed exactly 34 colour call sites across 7 files (correcting the charter's initial estimate of ~29 sites across 4 files, which missed the 3 entity files `Runner.js`, `Flag.js`, and `Barrier.js`). The survey was mechanical for **discovering** all 34 call sites, capturing their verbatim `rawArgs`, and enforcing a strict guard against unmapped sites. Authoring decisions — semantic token names, role descriptions, and static vs dynamic classification — were hand-specified in `ROLE_MAPPINGS`. In Repair 01, the static `resolvedColor` values are now also mechanically derived by parsing `rawArgs` and asserting exact agreement with the table (21/21 matched with 0 mismatches). The orchestrator also independently re-derived all 21 static colours directly from the pre-refactor source at `12c6fb9` with 0 mismatches.

The refactor replaced every hard-coded colour literal with a semantic role-named token, leaving pure data in the palette, preserving dynamic animation alpha computations at call sites, maintaining architectural separation between core and render, and adding a suite of pinning and call-site wiring tests asserting zero visual divergence.

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
3. **Documentation Commit**: `d292412` (`Add progress report for Plan 126 canvas palette extraction`)
   - Committed initial progress report.
4. **Repair 01 Commit**: (this repair)
   - Updated `scripts/dev/extract-canvas-palette-baseline.js` to mechanically derive static colours from `rawArgs` and assert against `ROLE_MAPPINGS`.
   - Added per-file ordinal call-site token wiring verification test in `tests/unit/canvas-palette.test.js`.
   - Documented behavioural falsification proof and updated progress report.

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

## Repair 01: Call-Site Verification and Mechanical Color Derivation

### 1. Defect Analysis
Orchestrator review highlighted that the initial test suite only verified that `CANVAS_PALETTE[token]` matched baseline values and that render calls mentioned `CANVAS_PALETTE`, but never verified that each call site was wired to the *correct* token. When `boardCellFloor` and `boardCellWall` were swapped in `src/render/drawBoard.js` (inverting the entire game board visuals), all 6 unit tests in `canvas-palette.test.js` and all 619 tests in `npm test` still passed.

### 2. Call-Site Token Wiring Verification Test
Added `Canvas Palette — call-site token wiring matches baseline by per-file ordinal` in `tests/unit/canvas-palette.test.js`:
- For each target file, inspects the current source in order, extracts the token referenced at each canvas colour call (`p.fill`, `p.stroke`, `p.background`), resolves the token through `CANVAS_PALETTE`, and asserts that the resulting color tuple equals the same-ordinal entry in the committed baseline fixture.
- Compares by **per-file ordinal**, which is stable under pure substitution (unlike line numbers which shift during refactoring).
- Explicitly lists and validates the 4 wholly-computed dynamic skips where no `CANVAS_PALETTE` token is directly passed to the call:
  1. `src/render/drawEntities.js:0` (`humanPlayerLabelColor`: `p.fill(...color)` from team glow stroke)
  2. `src/render/effects.js:0` (`activeRunnerGlowFill`: `p.fill(r, g, b, pulseAlpha)`)
  3. `src/render/effects.js:1` (`activeRunnerGlowFill`: `p.fill(r, g, b, alpha)`)
  4. `src/render/effects.js:2` (`activeRunnerGlowStroke`: `p.stroke(strokeR, strokeG, strokeB)`)
- Validates the dynamic alpha token at `src/render/effects.js:14` (`runnerIndexBadgeBackground` -> `runnerIndexBadgeBackgroundAlpha: 128`).
- Asserts that both the resolved color tuple and the token name match the baseline entry.

### 3. Behavioural Acceptance Proof (Falsification Experiment)
To prove that the new test catches the defect it was designed to catch:
1. Swapped lines 24 and 28 in `src/render/drawBoard.js`:
   `p.fill(...CANVAS_PALETTE.boardCellFloor)` ↔ `p.fill(...CANVAS_PALETTE.boardCellWall)`.
2. Ran `node --test tests/unit/canvas-palette.test.js`.
3. The first 6 tests passed, but the new call-site wiring test **failed immediately** with the following exact error:

```text
✖ Canvas Palette — call-site token wiring matches baseline by per-file ordinal (1.5277ms)
  AssertionError [ERR_ASSERTION]: Call site colour mismatch at src/render/drawBoard.js ordinal 1 (line 24, token "boardCellWall"): expected [245,245,245], got [100,100,100]
  + actual - expected
  
    [
  +   100,
  +   100,
  +   100
  -   245,
  -   245,
  -   245
    ]
  
      at file:///C:/AI/BrowserBattlegorithms/tests/unit/canvas-palette.test.js:179:14
      at Array.forEach (<anonymous>)
      at TestContext.<anonymous> (file:///C:/AI/BrowserBattlegorithms/tests/unit/canvas-palette.test.js:143:18)
      ...
    code: 'ERR_ASSERTION',
    actual: [ 100, 100, 100 ],
    expected: [ 245, 245, 245 ],
    operator: 'deepStrictEqual',
    diff: 'simple'
```

4. Reverted `src/render/drawBoard.js` via `git checkout src/render/drawBoard.js`.
5. Re-ran `node --test tests/unit/canvas-palette.test.js`: all 7 tests passed cleanly.

### 4. Mechanical Color Derivation in Baseline Script
In `scripts/dev/extract-canvas-palette-baseline.js`:
- Added `deriveColorFromRawArgs(rawArgs)` to mechanically parse numeric color tuples from raw call arguments (e.g. `"245, 245, 245"` -> `[245, 245, 245]`).
- Added `getPreRefactorSource(relPath)` to read pre-refactor source directly from git commit `12c6fb9` when the working copy contains `CANVAS_PALETTE`.
- For all 21 static sites, asserts that the mechanically derived color tuple strictly deep-equals the hand-recorded `mapping.resolvedColor`, throwing an error on any disagreement.
- Executed `node scripts/dev/extract-canvas-palette-baseline.js`: all 21 static sites derived with 0 mismatches. Output baseline fixture diff is clean.

### 5. Qualification of Claims
- **Mechanical**: Discovery of all 34 call sites, the unmapped-call guard throwing on unknown sites, capture of verbatim `rawArgs`, derivation of numeric color tuples from `rawArgs` for all 21 static sites, and verification of call-site wiring by per-file ordinal.
- **Hand-Authored**: Semantic token naming (`boardCellFloor`, `territoryTeam1Base`, etc.), role descriptions, and classification into static vs dynamic nature.
- **Independent Verification**: The orchestrator independently re-derived all 21 static colours directly from the pre-refactor source at `12c6fb9`, confirming 21 checked with 0 mismatches.

## Files Changed

- `scripts/dev/extract-canvas-palette-baseline.js` — mechanical extraction script generating baseline fixture; updated in Repair 01 to mechanically derive static colours from `rawArgs` and assert against `ROLE_MAPPINGS`.
- `tests/fixtures/canvas-palette-baseline.json` — committed pre-refactor baseline fixture.
- `src/render/canvasPalette.js` — immutable, role-named canvas palette module.
- `src/render/drawBoard.js` — replaced 8 inline colour literals with `CANVAS_PALETTE` tokens.
- `src/render/drawEntities.js` — replaced 3 colour call sites with `CANVAS_PALETTE` tokens.
- `src/render/effects.js` — replaced 17 colour call sites with `CANVAS_PALETTE` tokens / bases.
- `src/render/p5App.js` — replaced 2 colour call sites with `CANVAS_PALETTE` tokens.
- `src/entities/Runner.js` — replaced 2 emoji text fill sites with `CANVAS_PALETTE` tokens.
- `src/entities/Flag.js` — replaced 1 emoji text fill site with `CANVAS_PALETTE` token.
- `src/entities/Barrier.js` — replaced 1 emoji text fill site with `CANVAS_PALETTE` token.
- `tests/unit/canvas-palette.test.js` — unit tests pinning palette values to baseline fixture, asserting immutability, and verifying call-site token wiring by per-file ordinal.
- `package.json` — registered `tests/unit/canvas-palette.test.js` in `test:unit` (unchanged in Repair 01).
- `docs/subsystems/p5-surface-map.md` — recorded convention, single-home rule, role-naming rule, and constant disposition.
- `docs/development/plan-123-visual-customization-charter.md` — dated note correcting V7 call site count.
- `reports/development/plan-126-canvas-palette-extraction/progress.md` — this progress report.

## Validation Checks Performed

1. `node scripts/dev/plan-status.js check 126`: Passed (`RUNNABLE: plan-126 is ready to implement`).
2. `node scripts/dev/extract-canvas-palette-baseline.js`: Extracted exactly 34 call sites across 7 files; 21 static site colors derived mechanically with 0 mismatches against `ROLE_MAPPINGS`.
3. `node --test tests/unit/canvas-palette.test.js`: All 7 tests passed (fixture integrity, immutability, exact static value equality, dynamic base value equality, team glow equality, absence of raw colour literals in surveyed files, and call-site token wiring by per-file ordinal).
4. Behavioural falsification experiment: reproduced `boardCellFloor` ↔ `boardCellWall` swap in `drawBoard.js`, confirmed failure on ordinal wiring test, reverted, and confirmed pass.
5. `npm test`: Full unit test suite passed (620/620 tests).
6. `npm run build`: Vite client production build completed cleanly with no errors.
7. `npm run test:browser:smoke`: All 61 browser smoke tests passed (36.6s).

## Problems Encountered and Resolution

- *Survey Count Discrepancy*: Charter V7 estimated ~29 inline sites across 4 render files. Re-running the mechanical survey found 34 sites across 7 files (the charter had omitted `src/entities/Runner.js`, `Flag.js`, and `Barrier.js`). Resolved by including all 7 files in the baseline extraction and adding a dated correction note to Charter V7.
- *Constants Location Discrepancy*: Plan 126 noted that four constants lived in `src/config/constants.js`. Investigation revealed that `AREA_FREEZE_PULSE_COLOR`, `JUMP_TAKEOFF_COLOR`, and `JUMP_DUST_COLOR` (plus `AREA_FREEZE_FLASH_COLOR`) actually resided locally in `effects.js`, while only `TEAM_GLOW_COLORS` was in `constants.js`. Resolved by moving the local effect constants completely into `canvasPalette.js` while retaining `TEAM_GLOW_COLORS` in `constants.js` for core team initialization to preserve layer independence.
- *Call-Site Wiring Verification Gap (Repair 01)*: Addressed by introducing ordinal call-site verification test and demonstrating failure on token swap.
- *Baseline Derivation Gap (Repair 01)*: Addressed by deriving static colors from `rawArgs` and asserting against table in extraction script.

## Remaining Risks or Follow-ups

- None. No visual changes were introduced; all call sites are verified to reference the exact canonical tokens matching the committed pre-refactor baseline fixture.
- Unblocks Plan 123 P2 (Skin Registry) and P3 (Light/Dark Theme).

## Ready for Orchestrator Review

Yes. Delivered.
