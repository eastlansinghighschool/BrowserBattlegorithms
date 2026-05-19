# Plan 50 Progress Report

## Summary

Implemented browser test suite tiering by adding a `playwright.smoke.config.js` and four `package.json` scripts. No test files were deleted or rewritten. All existing browser coverage remains available via `npm run test:browser`.

## Approach

The tiering is implemented through a second Playwright config file (`playwright.smoke.config.js`) that selects a subset of spec files via `testMatch`. No grep tags or Playwright `projects` restructuring was needed — the file-list approach is explicit and easy to audit.

- `npm run test:browser:smoke` → `playwright.smoke.config.js`, `workers: 2`, ~64 tests
- `npm run test:browser` / `npm run test:browser:extended` → `playwright.config.js`, `workers: 1`, ~111 tests
- `npm run test:browser:focus` → modal-stability + aria-narration + narration-controls + key-capture-passthrough

## Timings

| Suite | Tests | Workers | Time |
|---|---|---|---|
| Baseline full (workers: 1) | 111 | 1 | ~2m30s |
| Smoke (workers: 2) | 64 | 2 | ~58.9s |
| Full extended (workers: 1) | 111 | 1 | ~2m30s (unchanged) |

Smoke suite is ~2.5× faster than the full suite.

## Workers: 2 Decision

`workers: 2` was tested on the full suite. 110/111 tests passed; `blockly-trace-playback.spec.js:31` ("trace playback highlights condition, result, and selected action blocks at low speed") failed intermittently. The failure is a CPU-contention timing flake — the test polls for CSS class changes driven by animation state that is sensitive to scheduler pressure under parallelism. It passes reliably when run alone.

Decision: `workers: 2` adopted for the **smoke suite only**. The smoke suite explicitly excludes `blockly-trace-playback.spec.js`. The full suite keeps `workers: 1`.

`clearStorageBeforeEach` in `tests/browser/helpers.js` is an empty `beforeEach` — storage isolation comes from Playwright's per-test fresh browser context, so shared-state bugs are not hidden by this decision.

## Tests Moved to Extended Only

The following specs are excluded from the smoke suite and available only via `npm run test:browser` (extended):

| Spec | Reason |
|---|---|
| `guided-ui.spec.js` | Broad guided UI matrix, ~19s |
| `persistence.spec.js` | Full file pipeline + private export edge cases, ~19s |
| `modal-stability.spec.js` | Focus-stability matrix with fixed 1500ms waits, ~11s |
| `dev-guided-level-link.spec.js` | Dev harness, contains `waitForTimeout(3500)`, ~8s |
| `workspace-starter-versioning.spec.js` | localStorage versioning edge cases, infrequent risk area |
| `blockly-trace-playback.spec.js` | CPU-contention timing flake at `workers: 2`; must run at `workers: 1` |

No tests were deleted. All six remain in the extended suite and run on `npm run test:browser`.

## Tests Kept in Smoke

All other spec files remain in the smoke suite, covering:

- App startup and mode chooser (`startup.spec.js`)
- Guided play flow (`guided-play.spec.js`)
- Free play setup and mode flows (`free-play.spec.js`)
- Keyboard input passthrough (`key-capture-passthrough.spec.js`)
- ARIA narration live region (`aria-narration.spec.js`)
- Narration controls blocked during tutorial (`narration-controls-during-tutorial.spec.js`) — preserved per ui-mode-contract: tutorial scrim blocks gameplay narration controls
- Blockly keyboard navigation (`blockly-keyboard-navigation.spec.js`)
- Help page (`help.spec.js`)
- Admin page file review (`admin.spec.js`)
- Dev unlock toggle (`dev-unlock.spec.js`)
- Workspace reset button (`workspace-reset-button.spec.js`)
- Prediction levels (`prediction-levels.spec.js`)

## Low-Signal Cleanup

No browser assertions were deleted or converted to unit tests. The packet scope (tiering + parallelism characterization) did not require removing coverage. Future packets can review `help.spec.js` static content checks and `admin.spec.js` table content cases as candidates for unit conversion.

## Commands Run

```powershell
# Validate workers: 2 on full suite
npx playwright test --workers=2 --reporter=line
# → 110/111 pass; blockly-trace-playback timing flake at line 31

# Validate smoke suite
npm run test:browser:smoke
# → 64/64 pass, 58.9s

# Validate extended (full) suite
npm run test:browser
# → 111/111 pass

# Unit tests
npm test
# → 292/292 pass on orchestration review rerun

# Build
npm run build
# → pass, pre-existing Vite chunk-size warnings only
```

## Artifacts Changed

- `package.json` — added `test:browser:smoke`, `test:browser:extended`, updated `test:browser:focus`
- `playwright.smoke.config.js` — new file; smoke config with explicit `testMatch` list and `workers: 2`
- `docs/TESTING.md` — documented the three tiers, timing, and workers decision

## Remaining Risks

- `blockly-trace-playback.spec.js` timing sensitivity: could fail intermittently on heavily loaded CI machines even at `workers: 1`. No action taken; the test is animation-state dependent by design.
- `help.spec.js` and `admin.spec.js` static content checks in smoke add a small amount of noise for pure-logic changes, but removing them would require unit-level equivalents first.
