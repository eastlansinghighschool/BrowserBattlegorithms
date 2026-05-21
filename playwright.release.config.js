import { defineConfig } from "@playwright/test";

// Release browser suite — the broad CI/release matrix.
// Keeps local-dev tooling and the known-deferred workbench suite out of the
// routine release command so the contract stays internally consistent.
//
// Smoke suite: `npm run test:browser:smoke`
// Focus suite: `npm run test:browser:focus`
// Tooling suite: `npm run test:browser:tooling`
// Workbench diagnostic: `npm run test:browser:workbench`
//
// Files excluded from release:
//   workbench.spec.js            — local-dev readiness/workbench shell and scratch tooling (deferred/manual)
//
// Broader, slower browser matrices such as guided-ui, persistence, modal
// stability, dev-guided links, admin, and dev-unlock remain in this release
// command; they are only excluded from the fast smoke tier.
//
// This release suite intentionally keeps the student-facing browser coverage
// while omitting the deferred workbench diagnostics.

export default defineConfig({
  testDir: "./tests/browser",
  testIgnore: ["**/workbench.spec.js"],
  workers: 1,
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
