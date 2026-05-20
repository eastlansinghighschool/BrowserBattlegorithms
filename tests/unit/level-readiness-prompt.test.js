import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { buildLevelReadinessResult } from "../../src/dev/levelReadiness.js";
import { formatLevelReadinessPrompt } from "../../src/dev/levelReadinessPrompt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.join(__dirname, "../../scripts/level-readiness.js");

function makeSyntheticReadinessResult() {
  return {
    levelId: "synthetic-level",
    title: "Synthetic Level",
    sourcePath: "C:/AI/BrowserBattlegorithms/src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js",
    order: 17,
    levelKind: "challenge",
    project: null,
    conceptMatrixRow: {
      levelLabel: "Challenge 15"
    },
    fixtures: {
      referenceSolution: {
        path: "C:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml",
        exists: false,
        applicability: "required"
      },
      project: null
    },
    checks: [
      {
        id: "concept-matrix-row",
        label: "Concept matrix row",
        status: "pass",
        severity: "info",
        message: "Matched concept matrix row \"Challenge 15\"",
        evidence: { levelLabel: "Challenge 15" },
        relatedFiles: [
          "C:/AI/BrowserBattlegorithms/src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js",
          "C:/AI/BrowserBattlegorithms/docs/GUIDED_LEVEL_CONCEPT_MATRIX.md"
        ]
      },
      {
        id: "lint-diagnostics",
        label: "Lint diagnostics",
        status: "fail",
        severity: "error",
        message: "1 diagnostic applies to this level",
        evidence: {
          contract: "demo-does-not-solve-level",
          file: "C:/AI/BrowserBattlegorithms/src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js",
          message: "demo matches reference"
        },
        relatedFiles: [
          "C:/AI/BrowserBattlegorithms/src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js",
          "C:/AI/BrowserBattlegorithms/docs/GUIDED_LEVEL_CONCEPT_MATRIX.md"
        ]
      },
      {
        id: "reference-runtime",
        label: "Reference runtime",
        status: "warning",
        severity: "warning",
        message: "Reference solution failed with a documented exception",
        evidence: {
          result: "FAILED",
          traceTail: [
            {
              state: "SETUP_DISPLAY",
              turn: 56,
              runner: "runner_1_HumanP1"
            }
          ]
        },
        relatedFiles: [
          "C:/AI/BrowserBattlegorithms/src/config/levels/phases/movement-helpers/level-15-dodge-and-deliver.js",
          "C:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml"
        ]
      }
    ],
    validationCommands: [
      {
        label: "Targeted readiness JSON",
        command: "npm run level:readiness -- --level synthetic-level --json"
      },
      {
        label: "Full test suite",
        command: "npm test"
      }
    ],
    runtime: {
      kind: "reference",
      reference: {
        path: "C:/AI/BrowserBattlegorithms/tests/unit/fixtures/guided-reference-solutions/dodge-and-deliver.xml",
        result: "FAILED",
        turnCount: 56,
        lastLevelResultReason: "turn_limit_exceeded",
        traceTail: []
      }
    }
  };
}

test("prompt renderer includes selected level metadata and validation commands", async () => {
  const result = await buildLevelReadinessResult("dodge-and-deliver");
  const prompt = formatLevelReadinessPrompt(result);

  assert.match(prompt, /# Level Readiness Repair Prompt/);
  assert.match(prompt, /## Selected Level/);
  assert.match(prompt, /Challenge 15: Dodge and Deliver/);
  assert.match(prompt, /`dodge-and-deliver`/);
  assert.match(prompt, /src\/config\/levels\/phases\/movement-helpers\/level-15-dodge-and-deliver\.js/);
  assert.match(prompt, /## Required Reading/);
  assert.match(prompt, /## Validation/);
  assert.match(prompt, /npm run level:readiness -- --level dodge-and-deliver --prompt/);
  assert.match(prompt, /npm run level:readiness -- --level dodge-and-deliver --json/);
  assert.equal(/C:\\|C:\/AI\//.test(prompt), false);
});

test("prompt renderer separates observed facts from recommendations and sanitizes paths", () => {
  const prompt = formatLevelReadinessPrompt(makeSyntheticReadinessResult());

  assert.match(prompt, /## Observed Facts/);
  assert.match(prompt, /`lint-diagnostics` -> `fail`/);
  assert.match(prompt, /`reference-runtime` -> `warning`/);
  assert.match(prompt, /## Likely Repair Options/);
  assert.match(prompt, /## Owner Decisions To Avoid Making Silently/);
  assert.match(prompt, /## Allowed Files and Areas/);
  assert.match(prompt, /demo-does-not-solve-level/);
  assert.match(prompt, /traceTail/);
  assert.equal(/C:\\|C:\/AI\//.test(prompt), false);
});

test("project and human-input levels render the appropriate readiness framing", async () => {
  const projectPrompt = formatLevelReadinessPrompt(await buildLevelReadinessResult("advanced-scrimmage"));
  assert.match(projectPrompt, /team-strategy-script/);
  assert.match(projectPrompt, /Documented step exception for advanced-scrimmage/);
  assert.match(projectPrompt, /Documented cumulative exception for advanced-scrimmage/);

  const humanPrompt = formatLevelReadinessPrompt(await buildLevelReadinessResult("human-runner-practice"));
  assert.match(humanPrompt, /runtime: not applicable/);
  assert.match(humanPrompt, /Reference-run checks are not applicable to prediction or human-input levels/);
});

test("prompt mode works on the CLI and conflicts clearly with JSON mode", () => {
  const promptRun = spawnSync(process.execPath, [CLI_PATH, "--level", "dodge-and-deliver", "--prompt"], {
    encoding: "utf8"
  });
  assert.equal(promptRun.status, 0, promptRun.stderr);
  assert.match(promptRun.stdout, /# Level Readiness Repair Prompt/);
  assert.match(promptRun.stdout, /## Observed Facts/);

  const conflictRun = spawnSync(process.execPath, [CLI_PATH, "--level", "dodge-and-deliver", "--json", "--prompt"], {
    encoding: "utf8"
  });
  assert.notEqual(conflictRun.status, 0);
  assert.match(conflictRun.stderr, /Use only one of --json or --prompt/);
});
