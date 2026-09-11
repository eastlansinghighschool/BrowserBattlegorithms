'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');

const TARGET_FILES = [
  'src/render/drawBoard.js',
  'src/render/p5App.js',
  'src/render/drawEntities.js',
  'src/entities/Runner.js',
  'src/entities/Flag.js',
  'src/entities/Barrier.js',
  'src/render/effects.js'
];

// Pre-refactor named constants
const NAMED_CONSTANTS = {
  AREA_FREEZE_PULSE_COLOR: [220, 245, 255],
  AREA_FREEZE_FLASH_COLOR: [190, 230, 255],
  JUMP_TAKEOFF_COLOR: [150, 160, 170],
  JUMP_DUST_COLOR: [170, 180, 190],
  TEAM1_GLOW_FILL: [173, 216, 230],
  TEAM1_GLOW_STROKE: [100, 149, 237],
  TEAM2_GLOW_FILL: [255, 200, 100],
  TEAM2_GLOW_STROKE: [255, 165, 0]
};

// Known role mappings for the 34 call sites
const ROLE_MAPPINGS = {
  'src/render/drawBoard.js:4': {
    token: 'boardGridLine',
    nature: 'static',
    resolvedColor: [180],
    description: 'Grid lines separating board cells'
  },
  'src/render/drawBoard.js:23': {
    token: 'boardCellFloor',
    nature: 'static',
    resolvedColor: [245, 245, 245],
    description: 'Floor / empty cell background'
  },
  'src/render/drawBoard.js:27': {
    token: 'boardCellWall',
    nature: 'static',
    resolvedColor: [100, 100, 100],
    description: 'Wall / barrier cell background'
  },
  'src/render/drawBoard.js:31': {
    token: 'boardCellJail',
    nature: 'static',
    resolvedColor: [200, 200, 200],
    description: 'Jail cell background'
  },
  'src/render/drawBoard.js:32': {
    token: 'boardCellJailBorder',
    nature: 'static',
    resolvedColor: [50],
    description: 'Jail cell stroke border'
  },
  'src/render/drawBoard.js:36': {
    token: 'territoryTeam1Base',
    nature: 'static',
    resolvedColor: [173, 216, 230, 150],
    description: 'Team 1 base territory fill with alpha'
  },
  'src/render/drawBoard.js:40': {
    token: 'territoryTeam2Base',
    nature: 'static',
    resolvedColor: [255, 165, 0, 150],
    description: 'Team 2 base territory fill with alpha'
  },
  'src/render/drawBoard.js:44': {
    token: 'boardCellFallback',
    nature: 'static',
    resolvedColor: [255],
    description: 'Fallback cell background'
  },
  'src/render/p5App.js:36': {
    token: 'levelGoalHighlight',
    nature: 'static',
    resolvedColor: [0, 140, 255],
    description: 'Guided level goal highlight stroke'
  },
  'src/render/p5App.js:53': {
    token: 'canvasBackground',
    nature: 'static',
    resolvedColor: [220],
    description: 'Canvas clear background color'
  },
  'src/render/drawEntities.js:49': {
    token: 'humanPlayerLabelColor',
    nature: 'dynamic',
    resolvedColor: null,
    baseTokens: {
      team1: [100, 149, 237],
      team2: [255, 165, 0]
    },
    description: 'Human player label (P1/P2) text color resolved from team glow stroke'
  },
  'src/render/drawEntities.js:67': {
    token: 'gameOverBackdrop',
    nature: 'static',
    resolvedColor: [0, 0, 0, 180],
    description: 'Game-over overlay backdrop fill with alpha'
  },
  'src/render/drawEntities.js:69': {
    token: 'gameOverText',
    nature: 'static',
    resolvedColor: [255],
    description: 'Game-over overlay text fill'
  },
  'src/entities/Runner.js:95': {
    token: 'runnerGlyphText',
    nature: 'static',
    resolvedColor: [0],
    description: 'Runner emoji glyph text fill'
  },
  'src/entities/Runner.js:109': {
    token: 'runnerCarriedFlagText',
    nature: 'static',
    resolvedColor: [0],
    description: 'Carried flag badge emoji text fill'
  },
  'src/entities/Flag.js:16': {
    token: 'flagGlyphText',
    nature: 'static',
    resolvedColor: [0],
    description: 'Board flag emoji text fill'
  },
  'src/entities/Barrier.js:13': {
    token: 'barrierGlyphText',
    nature: 'static',
    resolvedColor: [0],
    description: 'Placed barrier emoji text fill'
  },
  'src/render/effects.js:76': {
    token: 'activeRunnerGlowFill',
    nature: 'dynamic',
    resolvedColor: null,
    baseTokens: {
      team1: [173, 216, 230],
      team2: [255, 200, 100]
    },
    description: 'Active runner pulsing glow fill; base RGB from team glow fill, alpha computed via sin/frameCount'
  },
  'src/render/effects.js:78': {
    token: 'activeRunnerGlowFill',
    nature: 'dynamic',
    resolvedColor: null,
    baseTokens: {
      team1: [173, 216, 230],
      team2: [255, 200, 100]
    },
    description: 'Active runner solid glow fill; base RGB from team glow fill, alpha from turn state constant'
  },
  'src/render/effects.js:80': {
    token: 'activeRunnerGlowStroke',
    nature: 'dynamic',
    resolvedColor: null,
    baseTokens: {
      team1: [100, 149, 237],
      team2: [255, 165, 0]
    },
    description: 'Active runner glow stroke; resolved from team glow stroke'
  },
  'src/render/effects.js:106': {
    token: 'areaFreezePulseBase',
    nature: 'dynamic',
    resolvedColor: [220, 245, 255],
    description: 'Area Freeze inner diamond fill; base RGB is areaFreezePulseBase, alpha computed from elapsed animation progress'
  },
  'src/render/effects.js:110': {
    token: 'areaFreezePulseBase',
    nature: 'dynamic',
    resolvedColor: [220, 245, 255],
    description: 'Area Freeze outer diamond stroke; base RGB is areaFreezePulseBase, alpha computed from progress / reduced motion'
  },
  'src/render/effects.js:115': {
    token: 'areaFreezePulseBase',
    nature: 'dynamic',
    resolvedColor: [220, 245, 255],
    description: 'Area Freeze secondary diamond stroke; base RGB is areaFreezePulseBase, alpha computed from progress'
  },
  'src/render/effects.js:146': {
    token: 'areaFreezeFlashBase',
    nature: 'dynamic',
    resolvedColor: [190, 230, 255],
    description: 'Area Freeze affected runner flash outer rect stroke; base RGB is areaFreezeFlashBase, alpha computed from pulse'
  },
  'src/render/effects.js:157': {
    token: 'areaFreezeFlashBase',
    nature: 'dynamic',
    resolvedColor: [190, 230, 255],
    description: 'Area Freeze affected runner flash midline stroke; base RGB is areaFreezeFlashBase, alpha computed from pulse'
  },
  'src/render/effects.js:187': {
    token: 'jumpDropShadowBase',
    nature: 'dynamic',
    resolvedColor: [40, 48, 60],
    description: 'Jump drop shadow fill; base RGB is jumpDropShadowBase, alpha computed from runner heightRatio'
  },
  'src/render/effects.js:219': {
    token: 'jumpTakeoffLineBase',
    nature: 'dynamic',
    resolvedColor: [150, 160, 170],
    description: 'Jump takeoff lines stroke; base RGB is jumpTakeoffLineBase, alpha computed from takeoff opacity'
  },
  'src/render/effects.js:258': {
    token: 'jumpLandingDustBase',
    nature: 'dynamic',
    resolvedColor: [170, 180, 190],
    description: 'Jump landing dust ring stroke; base RGB is jumpLandingDustBase, alpha computed from ringProgress'
  },
  'src/render/effects.js:291': {
    token: 'frozenBadgeBackground',
    nature: 'static',
    resolvedColor: [34, 58, 92, 210],
    description: 'Frozen countdown badge background fill with alpha'
  },
  'src/render/effects.js:293': {
    token: 'frozenBadgeBorder',
    nature: 'static',
    resolvedColor: [210, 240, 255, 210],
    description: 'Frozen countdown badge border stroke with alpha'
  },
  'src/render/effects.js:297': {
    token: 'frozenBadgeText',
    nature: 'static',
    resolvedColor: [255],
    description: 'Frozen countdown badge text fill'
  },
  'src/render/effects.js:315': {
    token: 'runnerIndexBadgeBackground',
    nature: 'dynamic',
    resolvedColor: null,
    baseAlpha: 128,
    description: 'Runner index badge background fill; base RGB from team glow stroke (or fallback [128, 128, 128]), alpha fixed at 128'
  },
  'src/render/effects.js:319': {
    token: 'runnerIndexBadgeBorder',
    nature: 'static',
    resolvedColor: [255, 255, 255, 128],
    description: 'Runner index badge border stroke with alpha'
  },
  'src/render/effects.js:325': {
    token: 'runnerIndexBadgeText',
    nature: 'static',
    resolvedColor: [255, 255, 255, 217],
    description: 'Runner index badge text fill with alpha'
  }
};

function extractBaseline() {
  const sites = [];
  const callRegex = /\bp\.(fill|stroke|background)\(([^)]*)\)/;

  for (const relPath of TARGET_FILES) {
    const fullPath = path.resolve(REPO_ROOT, relPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i += 1) {
      const lineNum = i + 1;
      const lineText = lines[i];
      const match = lineText.match(callRegex);
      if (match) {
        const method = match[1];
        const rawArgs = match[2].trim();
        const siteKey = `${relPath}:${lineNum}`;
        const mapping = ROLE_MAPPINGS[siteKey];

        if (!mapping) {
          throw new Error(`Unmapped call site found at ${siteKey}: ${lineText.trim()}`);
        }

        sites.push({
          id: `site_${sites.length + 1}`,
          file: relPath,
          line: lineNum,
          call: `p.${method}`,
          rawArgs,
          token: mapping.token,
          nature: mapping.nature,
          resolvedColor: mapping.resolvedColor,
          baseTokens: mapping.baseTokens || null,
          baseAlpha: mapping.baseAlpha ?? null,
          description: mapping.description
        });
      }
    }
  }

  return {
    meta: {
      capturedAt: '2026-09-10T22:53:00.000Z',
      generator: 'scripts/dev/extract-canvas-palette-baseline.js',
      totalSites: sites.length,
      staticSites: sites.filter((s) => s.nature === 'static').length,
      dynamicSites: sites.filter((s) => s.nature === 'dynamic').length,
      targetFiles: TARGET_FILES
    },
    sites
  };
}

if (require.main === module) {
  const baseline = extractBaseline();
  console.log(`Extracted ${baseline.sites.length} canvas colour call sites across ${TARGET_FILES.length} files.`);
  console.log(`Static sites: ${baseline.meta.staticSites}`);
  console.log(`Dynamic sites: ${baseline.meta.dynamicSites}`);

  const outDir = path.resolve(REPO_ROOT, 'tests/fixtures');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'canvas-palette-baseline.json');
  fs.writeFileSync(outFile, JSON.stringify(baseline, null, 2) + '\n', 'utf8');
  console.log(`Baseline saved to: ${outFile}`);
}

module.exports = {
  extractBaseline,
  TARGET_FILES,
  ROLE_MAPPINGS
};
