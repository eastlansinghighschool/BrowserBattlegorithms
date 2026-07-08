import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import packageScriptsPkg from "../../scripts/lib/package-scripts.js";
import controlConsolePkg from "../../scripts/dev/control-console.js";

const { buildPackageScriptInvocation, spawnPackageScript } = packageScriptsPkg;
const { commandRegistry, buildActionArgs } = controlConsolePkg;

test("package.json exposes dev:console script", () => {
  const pkgPath = resolve(process.cwd(), "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  assert.ok(pkg.scripts);
  assert.equal(pkg.scripts["dev:console"], "node scripts/dev/control-console.js");
});

test("centralized package-script invocation helper builds safe Windows/non-Windows commands", () => {
  const win = buildPackageScriptInvocation("test", ["file.js"], "win32");
  assert.equal(win.command, "cmd.exe");
  assert.deepEqual(win.args, ["/d", "/s", "/c", "npm run test -- file.js"]);
  assert.equal(win.displayString, "npm run test -- file.js");

  const unix = buildPackageScriptInvocation("test", ["file.js"], "linux");
  assert.equal(unix.command, "npm");
  assert.deepEqual(unix.args, ["run", "test", "--", "file.js"]);
  assert.equal(unix.displayString, "npm run test -- file.js");
});

test("command display string matches executed script representation", () => {
  const invocation = buildPackageScriptInvocation("plan:set", ["plan-102", "complete"]);
  assert.equal(invocation.displayString, "npm run plan:set -- plan-102 complete");
});

test("spawnPackageScript surfaces launch errors distinctly from non-zero exits", () => {
  const invocation = {
    command: "nonexistent-cmd",
    args: [],
    options: { shell: false }
  };
  
  // Mock spawnSync to return a launch error object
  const mockSpawnSyncError = () => {
    return { error: new Error("ENOENT: command not found") };
  };

  const errResult = spawnPackageScript(invocation, { spawnSync: mockSpawnSyncError });
  assert.equal(errResult.success, false);
  assert.equal(errResult.isLaunchError, true);
  assert.ok(errResult.error.message.includes("ENOENT"));

  // Mock spawnSync to return a nonzero exit status
  const mockSpawnSyncExit = () => {
    return { status: 127 };
  };

  const exitResult = spawnPackageScript(invocation, { spawnSync: mockSpawnSyncExit });
  assert.equal(exitResult.success, false);
  assert.equal(exitResult.isLaunchError, false);
  assert.equal(exitResult.status, 127);
});

test("registry marks mutating/generated-output actions as confirmation-required", () => {
  const actions = Object.values(commandRegistry).flatMap(group => group.actions);
  
  const planSet = actions.find(a => a.id === "plan:set");
  assert.ok(planSet);
  assert.equal(planSet.confirm, true);

  const levelDossiers = actions.find(a => a.id === "level:dossiers");
  assert.ok(levelDossiers);
  assert.equal(levelDossiers.confirm, true);

  const planRender = actions.find(a => a.id === "plan:render");
  assert.ok(planRender);
  assert.equal(planRender.confirm, true);

  const levelBehavior = actions.find(a => a.id === "level:behavior-evidence");
  assert.ok(levelBehavior);
  assert.equal(levelBehavior.confirm, true);

  const usageCohort = actions.find(a => a.id === "usage:cohort");
  assert.ok(usageCohort);
  assert.equal(usageCohort.confirm, true);
});

test("buildActionArgs constructs flagged arguments for level:readiness and usage:cohort", () => {
  const actions = Object.values(commandRegistry).flatMap(group => group.actions);

  const levelReadiness = actions.find(a => a.id === "level:readiness");
  assert.ok(levelReadiness);
  const readinessArgs = buildActionArgs(levelReadiness, ["move-to-target"]);
  assert.deepEqual(readinessArgs, ["--level", "move-to-target"]);

  const usageCohort = actions.find(a => a.id === "usage:cohort");
  assert.ok(usageCohort);
  const cohortArgs = buildActionArgs(usageCohort, ["synthetic-demo"]);
  assert.deepEqual(cohortArgs, ["--cohort", "synthetic-demo"]);

  const planCheck = actions.find(a => a.id === "plan:check");
  assert.ok(planCheck);
  const planCheckArgs = buildActionArgs(planCheck, ["plan-102"]);
  assert.deepEqual(planCheckArgs, ["plan-102"]);
});
