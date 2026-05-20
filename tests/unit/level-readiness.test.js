import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { LEVEL_RESULT } from "../../src/config/constants.js";
import { buildLevelReadinessResult } from "../../src/dev/levelReadiness.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLI_PATH = path.join(__dirname, "../../scripts/level-readiness.js");

function assertCheckShape(check) {
  assert.equal(typeof check.id, "string");
  assert.equal(typeof check.label, "string");
  assert.ok(["pass", "fail", "warning", "not_applicable", "not_run"].includes(check.status));
  assert.equal(typeof check.severity, "string");
  assert.equal(typeof check.message, "string");
  assert.ok(Array.isArray(check.relatedFiles));
}

test("ordinary level readiness result includes the expected shape and passing reference run", async () => {
  const result = await buildLevelReadinessResult("dodge-and-deliver");

  assert.equal(result.levelId, "dodge-and-deliver");
  assert.equal(result.found, true);
  assert.match(result.sourcePath, /level-15-dodge-and-deliver\.js$/);
  assert.equal(result.project, null);
  assert.ok(result.conceptMatrixRow);
  assert.equal(result.fixtures.referenceSolution.applicability, "required");
  assert.equal(result.fixtures.referenceSolution.exists, true);
  assert.equal(result.fixtures.project, null);
  assert.equal(result.runtime.kind, "reference");
  assert.equal(result.runtime.reference.result, LEVEL_RESULT.PASSED);
  assert.ok(result.runtime.reference.turnCount > 0);
  assert.ok(result.runtime.reference.lastLevelResultReason);
  assert.ok(result.runtime.reference.traceTail.length > 0);
  assert.equal(result.checks.some((check) => check.id === "reference-runtime" && check.status === "pass"), true);
  assert.equal(result.checks.some((check) => check.id === "lint-diagnostics"), true);
  assert.equal(result.validationCommands.some((entry) => entry.command.includes("--json")), true);

  for (const check of result.checks) {
    assertCheckShape(check);
  }

  const roundTrip = JSON.parse(JSON.stringify(result));
  assert.deepEqual(roundTrip, result);
});

test("project level readiness reports documented exception metadata", async () => {
  const result = await buildLevelReadinessResult("advanced-scrimmage");

  assert.equal(result.project.id, "team-strategy-script");
  assert.equal(result.fixtures.referenceSolution.applicability, "not_applicable");
  assert.equal(result.fixtures.project.step.path.endsWith("step-09.xml"), true);
  assert.equal(result.fixtures.project.step.exists, true);
  assert.equal(result.fixtures.project.step.documentedException.length > 0, true);
  assert.equal(result.fixtures.project.final.path.endsWith("final.xml"), true);
  assert.equal(result.fixtures.project.final.exists, true);
  assert.equal(result.fixtures.project.final.documentedException.length > 0, true);
  assert.equal(result.runtime.kind, "project");
  assert.equal(result.runtime.step.documentedException.length > 0, true);
  assert.equal(result.runtime.final.documentedException.length > 0, true);
  assert.equal(result.checks.some((check) => check.id === "reference-runtime"), false);
  assert.equal(result.checks.find((check) => check.id === "project-step-runtime")?.status, "warning");
  assert.equal(result.checks.find((check) => check.id === "project-final-runtime")?.status, "warning");
});

test("human-input or prediction levels mark reference-run checks not applicable", async () => {
  const result = await buildLevelReadinessResult("human-runner-practice");

  assert.equal(result.levelKind, null);
  assert.equal(result.fixtures.referenceSolution.applicability, "not_applicable");
  assert.equal(result.runtime.kind, "not_applicable");
  assert.equal(result.checks.find((check) => check.id === "reference-runtime")?.status, "not_applicable");
  assert.equal(result.checks.find((check) => check.id === "toolbox-reference-compatibility")?.status, "not_applicable");
});

test("unknown level ids fail clearly with nearby suggestions", async () => {
  await assert.rejects(
    () => buildLevelReadinessResult("not-a-real-level"),
    /Unknown level id "not-a-real-level"/
  );
});

test("readiness JSON output is deterministic and matches the builder result", async () => {
  const first = await buildLevelReadinessResult("dodge-and-deliver");
  const second = await buildLevelReadinessResult("dodge-and-deliver");
  assert.equal(JSON.stringify(first), JSON.stringify(second));

  const cli = spawnSync(process.execPath, [CLI_PATH, "--level", "dodge-and-deliver", "--json"], {
    encoding: "utf8"
  });
  assert.equal(cli.status, 0, cli.stderr);
  const parsed = JSON.parse(cli.stdout);
  assert.equal(parsed.levelId, "dodge-and-deliver");
  assert.equal(parsed.runtime.kind, "reference");
  assert.equal(parsed.checks.find((check) => check.id === "reference-runtime").status, "pass");
});
