import { defineConfig } from "@playwright/test";

// Smoke browser suite — fast, representative coverage for frequent validation.
// Runs at workers: 2 because this file set has no timing-sensitive animation tests.
//
// Release suite: `npm run test:browser` / `npm run test:browser:extended` (126 tests, workers: 1, stable, excludes deferred workbench).
// Focus/accessibility suite: `npm run test:browser:focus`
// Tooling suite: `npm run test:browser:tooling`
//
// Files excluded from smoke (moved to extended):
//   guided-ui.spec.js           — broad guided UI matrix (~19s)
//   persistence.spec.js         — full file pipeline + private export edge cases (~19s)
//   modal-stability.spec.js     — focus-stability matrix with fixed 1500ms waits (~11s)
//   dev-guided-level-link.spec.js — dev harness, contains waitForTimeout(3500) (~8s)
//   workspace-starter-versioning.spec.js — versioning edge cases (localStorage pre-seeding)
//   blockly-trace-playback.spec.js — timing-sensitive animation test (CPU-contention flake at workers: 2)
//   admin.spec.js                — local usage admin matrix
//   dev-unlock.spec.js           — local-dev unlock toggle matrix
//   workbench.spec.js            — local-dev readiness/workbench shell and scratch tooling (deferred/manual)
//
// Smoke includes jump-animation.spec.js because it is short, learner-visible,
// and exercises a local-only entrypoint without timing-sensitive broad UI coverage.

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: [
    "**/startup.spec.js",
    "**/guided-play.spec.js",
    "**/free-play.spec.js",
    "**/key-capture-passthrough.spec.js",
    "**/aria-narration.spec.js",
    "**/blockly-keyboard-navigation.spec.js",
    "**/help.spec.js",
    "**/workspace-reset-button.spec.js",
    "**/prediction-levels.spec.js",
    "**/jump-animation.spec.js",
    "**/cell-inspector.spec.js",
    "**/settings-gear.spec.js",
    "**/runner-index-badge.spec.js"
  ],
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:4173",
    headless: true
  },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120000
  }
});
