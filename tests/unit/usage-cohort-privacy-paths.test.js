import test from "node:test";
import assert from "node:assert/strict";
import { resolve, sep } from "node:path";
import { isCohortPathSafe } from "../../src/usage/cohortPrivacyPaths.js";

const dummyProjectRoot = resolve("/fake/project/root");

test("isCohortPathSafe allows valid paths within local/usage-cohorts/", () => {
  assert.equal(isCohortPathSafe("local/usage-cohorts/cohort-a/raw-exports/student.json", dummyProjectRoot), true);
  assert.equal(isCohortPathSafe("local/usage-cohorts/cohort-b/anonymized/tables.csv", dummyProjectRoot), true);
  assert.equal(isCohortPathSafe("local/usage-cohorts/cohort-c/analysis/db.sqlite", dummyProjectRoot), true);
  assert.equal(isCohortPathSafe("local/usage-cohorts/cohort-d/identity-map/map.json", dummyProjectRoot), true);
  assert.equal(isCohortPathSafe("local/usage-cohorts", dummyProjectRoot), true);
  assert.equal(isCohortPathSafe("local/usage-cohorts/", dummyProjectRoot), true);
});

test("isCohortPathSafe allows absolute paths resolved within local/usage-cohorts/", () => {
  const absolutePath = resolve(dummyProjectRoot, "local/usage-cohorts/cohort-a/file.json");
  assert.equal(isCohortPathSafe(absolutePath, dummyProjectRoot), true);
});

test("isCohortPathSafe rejects paths that traverse out of local/usage-cohorts/", () => {
  assert.equal(isCohortPathSafe("local/usage-cohorts/../../docs/leak.json", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("local/usage-cohorts/../other/file.json", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("local/usage-cohorts/../../src/usage/usageTracker.js", dummyProjectRoot), false);
});

test("isCohortPathSafe rejects paths targeting sibling directories with similar prefixes", () => {
  assert.equal(isCohortPathSafe("local/usage-cohorts-sibling/foo.json", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("local/usage-cohorts-sibling", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("local/usage-cohortsother", dummyProjectRoot), false);
});

test("isCohortPathSafe rejects tracked directories specifically", () => {
  assert.equal(isCohortPathSafe("src/usage/usageTracker.js", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("docs/subsystems/usage-and-admin.md", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("reports/development/progress.md", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("tests/unit/usage-file.test.js", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("public/index.html", dummyProjectRoot), false);
});

test("isCohortPathSafe rejects invalid inputs", () => {
  assert.equal(isCohortPathSafe(null, dummyProjectRoot), false);
  assert.equal(isCohortPathSafe(undefined, dummyProjectRoot), false);
  assert.equal(isCohortPathSafe(12345, dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("", dummyProjectRoot), false);
  assert.equal(isCohortPathSafe("   ", dummyProjectRoot), false);
});

if (process.platform === "win32") {
  test("isCohortPathSafe handles Windows case-insensitivity and backslashes", () => {
    const root = resolve("C:\\Fake\\Project\\Root");
    assert.equal(isCohortPathSafe("LOCAL\\usage-cohorts\\cohort-a\\file.json", root), true);
    assert.equal(isCohortPathSafe("local\\usage-cohorts\\..\\..\\docs\\leak.json", root), false);
    assert.equal(isCohortPathSafe("C:\\Fake\\Project\\Root\\local\\usage-cohorts\\cohort-a\\file.json", root), true);
    assert.equal(isCohortPathSafe("C:\\Fake\\Project\\Root\\docs\\leak.json", root), false);
  });
} else {
  test("isCohortPathSafe handles POSIX backslashes (treated as literal backslashes, resolving outside if traversal is attempted)", () => {
    // POSIX path with backslashes should resolve incorrectly or outside cohort-root and thus be rejected
    assert.equal(isCohortPathSafe("local\\usage-cohorts\\cohort-a\\file.json", dummyProjectRoot), false);
  });
}
