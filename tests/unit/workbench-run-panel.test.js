import test from "node:test";
import assert from "node:assert/strict";
import { buildLevelReadinessResult } from "../../src/dev/levelReadiness.js";
import { buildWorkbenchRunPanelModel } from "../../src/workbench/workbenchRunPanel.js";

test("ordinary levels expose a single reference-run summary with trace and event tails", async () => {
  const result = await buildLevelReadinessResult("dodge-and-deliver");
  const model = buildWorkbenchRunPanelModel(result);

  assert.equal(model.title, "Canonical Solution Run");
  assert.equal(model.status, "pass");
  assert.equal(model.runs.length, 1);
  assert.match(model.summary, /Pass/);
  assert.match(model.copyText, /Reference solution run/);
  assert.match(model.copyText, /Turn count:/);
  assert.match(model.copyText, /Final turn state:/);
  assert.match(model.copyText, /Trace tail:/);
  assert.match(model.copyText, /Event log tail:/);
  assert.ok(model.runs[0].traceTail.length > 0);
  assert.ok(model.runs[0].eventTail.length > 0);
});

test("project levels expose both checkpoint runs and documented exception text", async () => {
  const result = await buildLevelReadinessResult("advanced-scrimmage");
  const model = buildWorkbenchRunPanelModel(result);

  assert.equal(model.status, "warning");
  assert.equal(model.runs.length, 2);
  assert.match(model.copyText, /Project step checkpoint/);
  assert.match(model.copyText, /Project final checkpoint/);
  assert.match(model.copyText, /Documented exception:/);
  assert.ok(model.runs[0].documentedException);
  assert.ok(model.runs[1].documentedException);
});

test("non-applicable levels produce a clear no-run summary", async () => {
  const result = await buildLevelReadinessResult("human-runner-practice");
  const model = buildWorkbenchRunPanelModel(result);

  assert.equal(model.status, "not_applicable");
  assert.equal(model.runs.length, 0);
  assert.match(model.copyText, /Not applicable/);
  assert.match(model.copyText, /human-input level requires live player input/);
});
