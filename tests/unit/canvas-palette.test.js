import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CANVAS_PALETTE } from "../../src/render/canvasPalette.js";
import { TEAM_GLOW_COLORS } from "../../src/config/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "../..");

const baselinePath = path.resolve(REPO_ROOT, "tests/fixtures/canvas-palette-baseline.json");
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

test("Canvas Palette — baseline fixture integrity", () => {
  assert.equal(baseline.meta.totalSites, 34, "Baseline must contain exactly 34 surveyed call sites");
  assert.equal(baseline.meta.staticSites, 21, "Baseline must contain exactly 21 static sites");
  assert.equal(baseline.meta.dynamicSites, 13, "Baseline must contain exactly 13 dynamic sites");
  assert.equal(baseline.sites.length, 34, "Sites array must have length 34");
});

test("Canvas Palette — immutability and data-only contract", () => {
  assert.ok(Object.isFrozen(CANVAS_PALETTE), "CANVAS_PALETTE object must be frozen");

  for (const [key, value] of Object.entries(CANVAS_PALETTE)) {
    if (typeof value === "object" && value !== null) {
      assert.ok(Object.isFrozen(value), `Token ${key} must be frozen`);
      if (key === "teamGlow") {
        for (const [teamKey, teamVal] of Object.entries(value)) {
          assert.ok(Object.isFrozen(teamVal), `teamGlow.${teamKey} must be frozen`);
          assert.ok(Object.isFrozen(teamVal.fill), `teamGlow.${teamKey}.fill must be frozen`);
          assert.ok(Object.isFrozen(teamVal.stroke), `teamGlow.${teamKey}.stroke must be frozen`);
        }
      }
    }
  }
});

test("Canvas Palette — static tokens resolve to committed baseline values exactly", () => {
  const staticSites = baseline.sites.filter((s) => s.nature === "static");
  assert.equal(staticSites.length, 21);

  for (const site of staticSites) {
    const tokenVal = CANVAS_PALETTE[site.token];
    assert.ok(tokenVal !== undefined, `Token ${site.token} for site ${site.id} (${site.file}:${site.line}) must exist in CANVAS_PALETTE`);
    assert.deepEqual(
      [...tokenVal],
      site.resolvedColor,
      `Token ${site.token} must match committed baseline for ${site.file}:${site.line}`
    );
  }
});

test("Canvas Palette — dynamic base color tokens resolve to committed baseline values", () => {
  // Area Freeze pulse base
  assert.deepEqual([...CANVAS_PALETTE.areaFreezePulseBase], [220, 245, 255]);

  // Area Freeze flash base
  assert.deepEqual([...CANVAS_PALETTE.areaFreezeFlashBase], [190, 230, 255]);

  // Jump animation bases
  assert.deepEqual([...CANVAS_PALETTE.jumpDropShadowBase], [40, 48, 60]);
  assert.deepEqual([...CANVAS_PALETTE.jumpTakeoffLineBase], [150, 160, 170]);
  assert.deepEqual([...CANVAS_PALETTE.jumpLandingDustBase], [170, 180, 190]);

  // Runner index badge background alpha
  assert.equal(CANVAS_PALETTE.runnerIndexBadgeBackgroundAlpha, 128);
});

test("Canvas Palette — team glow tokens match core team constants", () => {
  assert.deepEqual([...CANVAS_PALETTE.team1GlowFill], [...TEAM_GLOW_COLORS[1].fill]);
  assert.deepEqual([...CANVAS_PALETTE.team1GlowStroke], [...TEAM_GLOW_COLORS[1].stroke]);
  assert.deepEqual([...CANVAS_PALETTE.team2GlowFill], [...TEAM_GLOW_COLORS[2].fill]);
  assert.deepEqual([...CANVAS_PALETTE.team2GlowStroke], [...TEAM_GLOW_COLORS[2].stroke]);

  assert.deepEqual([...CANVAS_PALETTE.teamGlow[1].fill], [...TEAM_GLOW_COLORS[1].fill]);
  assert.deepEqual([...CANVAS_PALETTE.teamGlow[1].stroke], [...TEAM_GLOW_COLORS[1].stroke]);
  assert.deepEqual([...CANVAS_PALETTE.teamGlow[2].fill], [...TEAM_GLOW_COLORS[2].fill]);
  assert.deepEqual([...CANVAS_PALETTE.teamGlow[2].stroke], [...TEAM_GLOW_COLORS[2].stroke]);
});

test("Canvas Palette — no raw colour literals remain in surveyed render files", () => {
  const callRegex = /\bp\.(fill|stroke|background)\(([^)]*)\)/g;
  const rawLiteralRegex = /\b\d{1,3}\b/;

  for (const relPath of baseline.meta.targetFiles) {
    const fullPath = path.resolve(REPO_ROOT, relPath);
    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i += 1) {
      const lineText = lines[i];
      let match;
      while ((match = callRegex.exec(lineText)) !== null) {
        const rawArgs = match[2].trim();
        // If the call contains CANVAS_PALETTE or variable names like (r, g, b) or (colors[0]...)
        // it is acceptable. If it contains raw RGB literals like (245, 245, 245) or (180), it must fail.
        const isUsingPalette = rawArgs.includes("CANVAS_PALETTE");
        const isDynamicRgb = rawArgs.startsWith("r, g, b") || rawArgs.startsWith("strokeR, strokeG") || rawArgs.startsWith("colors[0]") || rawArgs.startsWith("...color");
        assert.ok(
          isUsingPalette || isDynamicRgb,
          `File ${relPath}:${i + 1} contains un-tokenized colour call: ${match[0]}`
        );
      }
    }
  }
});
