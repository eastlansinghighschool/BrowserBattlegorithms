import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, relative } from "node:path";

// This is a narrow backstop for common accidental artifacts, not a complete secret scanner.
// It deliberately does not guess at opaque-id formats: benign hashes and tokens are not
// reliably distinguishable from Google identifiers by a repository regex.
const root = process.cwd();
const surfaceRoots = ["integrations", "public/integration-probe"];

function surfaceFiles() {
  const output = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "--", ...surfaceRoots], { cwd: root, encoding: "utf8" });
  return output.split(/\r?\n/).filter(Boolean).map((file) => resolve(root, file));
}

function surfaceText() {
  return surfaceFiles().filter((file) => !file.endsWith(".clasp.json")).map((file) => ({ file, text: readFileSync(file, "utf8") }));
}

function trackedSourceFiles() {
  const output = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "--", "src"], { cwd: root, encoding: "utf8" });
  return output.split(/\r?\n/).filter(Boolean).map((file) => resolve(root, file));
}

function containsDeploymentUrl(text) { return /script\.google\.com\/macros\/s\//i.test(text); }
function containsSrcImport(text) {
  const importOrRequire = /\b(?:import\s+(?:(?:[^;\n]*?)\s+from\s+)?|require\s*\(\s*|import\s*\(\s*)["']([^"']+)["']/g;
  return [...text.matchAll(importOrRequire)].some((match) => /(^|\/)src(\/|$)/.test(match[1].replaceAll("\\", "/")));
}
function hasNoindex(text) { return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i.test(text); }
function containsIntegrationImport(text) {
  const importOrRequire = /\b(?:import\s+(?:(?:[^;\n]*?)\s+from\s+)?|require\s*\(\s*|import\s*\(\s*)["']([^"']+)["']/g;
  return [...text.matchAll(importOrRequire)].some((match) => /(^|\/)integrations(\/|$)/.test(match[1].replaceAll("\\", "/")));
}

test("tracked integration surfaces contain no deployment URL literals", () => {
  for (const { file, text } of surfaceText()) assert.equal(containsDeploymentUrl(text), false, file);
  assert.equal(containsDeploymentUrl("https://script.google.com/macros/s/FAKE_DEPLOYMENT_ID/exec"), true);
  assert.equal(containsDeploymentUrl("deployment URL is entered at runtime"), false);
});

test("only the example clasp configuration is allowed", () => {
  for (const file of surfaceFiles()) {
    if (file.endsWith(".clasp.json")) assert.fail(`real .clasp.json must not be present: ${relative(root, file)}`);
  }
  assert.equal(relative(root, resolve(root, "integrations/google-apps-script/clasp.json.example")).endsWith("clasp.json.example"), true);
  assert.equal("integrations/google-apps-script/.clasp.json".endsWith(".clasp.json"), true);
});

test("integration surfaces do not import or require src modules", () => {
  for (const { file, text } of surfaceText()) assert.equal(containsSrcImport(text), false, file);
  assert.equal(containsSrcImport('import helper from "../../src/core/state.js";'), true);
  assert.equal(containsSrcImport('require("../src/ui/controls.js")'), true);
  assert.equal(containsSrcImport('import helper from "https://example.test/src/module.js";'), true);
  assert.equal(containsSrcImport('import helper from "./helpers.js";'), false);
});

test("src does not import or require the quarantined integration tree", () => {
  for (const file of trackedSourceFiles()) assert.equal(containsIntegrationImport(readFileSync(file, "utf8")), false, file);
  assert.equal(containsIntegrationImport('import bridge from "../integrations/google-apps-script/protocol.js";'), true);
  assert.equal(containsIntegrationImport('require("./helpers.js")'), false);
});

test("nested-frame child is noindex", () => {
  const child = resolve(root, "public/integration-probe/nested-frame-child.html");
  assert.equal(existsSync(child), true);
  assert.equal(hasNoindex(readFileSync(child, "utf8")), true);
  assert.equal(hasNoindex('<meta name="robots" content="index">'), false);
  assert.equal(hasNoindex('<meta name="robots" content="noindex">'), true);
});

test("probe reports are explicitly deidentified and storage pairing is receipt-gated", () => {
  const child = readFileSync(resolve(root, "public/integration-probe/nested-frame-child.html"), "utf8");
  const shell = readFileSync(resolve(root, "integrations/google-apps-script/probes/nested-frame/Shell.html"), "utf8");
  const identity = readFileSync(resolve(root, "integrations/google-apps-script/probes/identity/Page.html"), "utf8");
  assert.match(child, /Copy email-safe report/);
  assert.match(child, /BBA_PLAN120_DIRECT_STORAGE_RECEIPT/);
  assert.match(child, /verify-direct-receipt/);
  assert.match(child, /personal-windows-device/);
  assert.match(child, /browser_family/);
  assert.match(child, /raw_origins_sentinels_and_identifiers=excluded/);
  assert.doesNotMatch(child, /id="copy-json"|id="json-output"/);
  assert.match(shell, /EXPECTED_CHILD_PATH/);
  assert.match(shell, /event\.origin === 'null'/);
  assert.match(shell, /event\.origin !== expectedChildOrigin/);
  assert.match(identity, /intended-viewer-match/);
  assert.match(identity, /personal-windows-device/);
  assert.match(identity, /browser_family/);
  assert.match(identity, /raw_identity_domain_settings_and_identifiers=excluded/);
  assert.match(identity, /Copy email-safe report/);
});
