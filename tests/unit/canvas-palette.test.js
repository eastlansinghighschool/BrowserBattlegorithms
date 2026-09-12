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

test("Canvas Palette — call-site token wiring matches baseline by per-file ordinal", () => {
  // Wholly computed dynamic sites where the call does not reference CANVAS_PALETTE directly.
  // These must be explicitly listed and accounted for rather than silently passed.
  const WHOLLY_COMPUTED_SKIPS = new Set([
    "src/render/drawEntities.js:0", // humanPlayerLabelColor: p.fill(...color) computed from team glow stroke
    "src/render/effects.js:0", // activeRunnerGlowFill: p.fill(r, g, b, pulseAlpha) from team glow
    "src/render/effects.js:1", // activeRunnerGlowFill: p.fill(r, g, b, alpha) from team glow
    "src/render/effects.js:2" // activeRunnerGlowStroke: p.stroke(strokeR, strokeG, strokeB) from team glow
  ]);

  const encounteredSkips = [];

  for (const relPath of baseline.meta.targetFiles) {
    const fullPath = path.resolve(REPO_ROOT, relPath);
    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split(/\r?\n/);

    const fileBaseline = baseline.sites.filter((s) => s.file === relPath);
    const currentCalls = [];

    lines.forEach((line, idx) => {
      const match = line.match(/\bp\.(fill|stroke|background)\((.*)\)/);
      if (match) {
        currentCalls.push({ line: idx + 1, call: match[0], raw: match[2] });
      }
    });

    assert.equal(
      currentCalls.length,
      fileBaseline.length,
      `Call count mismatch in ${relPath}: expected ${fileBaseline.length}, found ${currentCalls.length}`
    );

    currentCalls.forEach((currentCall, ordinal) => {
      const siteKey = `${relPath}:${ordinal}`;
      const baseEntry = fileBaseline[ordinal];

      if (WHOLLY_COMPUTED_SKIPS.has(siteKey)) {
        encounteredSkips.push(siteKey);
        assert.equal(baseEntry.nature, "dynamic", `Wholly-computed site ${siteKey} must be dynamic in baseline`);
        assert.equal(baseEntry.resolvedColor, null, `Wholly-computed site ${siteKey} must have null resolvedColor`);
        return;
      }

      const tokenMatch = currentCall.raw.match(/CANVAS_PALETTE\.([a-zA-Z0-9_]+)/);
      assert.ok(
        tokenMatch,
        `Call site at ${relPath} ordinal ${ordinal} (line ${currentCall.line}) must reference CANVAS_PALETTE: ${currentCall.call}`
      );
      const extractedToken = tokenMatch[1];

      if (baseEntry.token === "runnerIndexBadgeBackground") {
        assert.equal(
          extractedToken,
          "runnerIndexBadgeBackgroundAlpha",
          `Runner badge background call site at line ${currentCall.line} must reference runnerIndexBadgeBackgroundAlpha`
        );
        assert.equal(
          CANVAS_PALETTE[extractedToken],
          baseEntry.baseAlpha,
          `Resolved alpha for ${extractedToken} must equal baseAlpha (${baseEntry.baseAlpha})`
        );
        return;
      }

      const resolvedTuple = Array.isArray(CANVAS_PALETTE[extractedToken])
        ? [...CANVAS_PALETTE[extractedToken]]
        : CANVAS_PALETTE[extractedToken];

      assert.deepEqual(
        resolvedTuple,
        baseEntry.resolvedColor,
        `Call site colour mismatch at ${relPath} ordinal ${ordinal} (line ${currentCall.line}, token "${extractedToken}"): expected ${JSON.stringify(baseEntry.resolvedColor)}, got ${JSON.stringify(resolvedTuple)}`
      );

      assert.equal(
        extractedToken,
        baseEntry.token,
        `Call site token mismatch at ${relPath} ordinal ${ordinal} (line ${currentCall.line}): expected token "${baseEntry.token}", got "${extractedToken}"`
      );
    });
  }

  assert.equal(
    encounteredSkips.length,
    WHOLLY_COMPUTED_SKIPS.size,
    `Expected exactly ${WHOLLY_COMPUTED_SKIPS.size} wholly-computed dynamic skips, but found ${encounteredSkips.length}`
  );
});

