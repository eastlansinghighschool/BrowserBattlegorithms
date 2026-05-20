# Testing

## Command-Line Tests

- `npm run test:unit`

These tests focus on:

- team/setup contracts and free-play roster generation
- movement, collision, and own-flag occupancy rules
- scoring, reset, and guided level-state progression
- authored guided-level contracts, unlock matrices, and content metadata
- Blockly interpreter semantics and execution-hint behavior
- condition and generic sensor evaluation
- level readiness CLI output and per-level readiness reports
- reference solution existence and solvability across the guided campaign
- free-play-only toolbox, random-move, and Area Freeze contracts
- pure display and keyboard-mapping logic

## Browser Tests

The Playwright browser suite is split into two tiers:

### Smoke — frequent validation

- `npm run test:browser:smoke` — fast subset (~78 tests, ~60s, `workers: 2`)

Run this after most changes. Covers:

- startup shell, welcome chooser, and lazy-load placeholders
- guided play progression, tutorial demos, special-action flow, keyboard-practice flow, and a representative advanced level
- actual keyboard input in representative guided and PvP scenarios
- live pause/resume coverage in Guided Levels and Free Play, including the guarded `P` shortcut
- free-play setup controls for mode, team size, and map selection
- PvP free-play team tab switching and separate programs per side
- free-play mode smoke coverage for PvP, PvCPU Easy, and PvCPU Tactical
- student-visible jump flair coverage for Jump Forward arc and blocked-jump reversal
- local-dev workbench shell coverage for dev gating, readiness display, prompt rendering, and storage isolation
- help-link behavior and standalone help-page navigation
- usage export flow, admin page file review, and integrity verification
- dev-only unlock-all-levels toggle behavior and production bundle exclusion
- narration controls blocked by tutorial scrim (accessibility contract)

### Extended — full matrix

- `npm run test:browser` or `npm run test:browser:extended` — complete suite (~113 tests, ~2m30s, `workers: 1`)

Run before releases or after changes to persistence, modal focus, dev harness, or workspace versioning. Adds:

- `guided-ui.spec.js` — broad guided UI matrix, including level picker, HUD, panel collapse, Blockly resizing, and desktop workspace size controls (~19s)
- `persistence.spec.js` — full file pipeline and private export edge cases (~19s)
- `modal-stability.spec.js` — focus-stability matrix with fixed waits (~11s)
- `dev-guided-level-link.spec.js` — dev harness, contains long waits (~8s)
- `workspace-starter-versioning.spec.js` — localStorage versioning edge cases
- `blockly-trace-playback.spec.js` — timing-sensitive animation test (CPU-contention flake at `workers: 2`; runs only at `workers: 1`)

### Focus/accessibility

- `npm run test:browser:focus` — narration, modal stability, key-capture, ARIA narration tests

Targeted run for accessibility or UI focus-management changes.

## Level Readiness CLI

- `npm run level:readiness -- --level <levelId>` — human-readable readiness summary for one guided level
- `npm run level:readiness -- --level <levelId> --json` — machine-readable readiness result
- `npm run level:readiness -- --level <levelId> --prompt` — deterministic Markdown repair prompt for an implementation agent
- `--json` and `--prompt` are mutually exclusive; the command fails clearly if both are supplied.

Use this when you need a deterministic per-level health check that combines concept-matrix agreement, lint diagnostics, fixture availability, and representative runtime checks.

## Regression Harness

`tests/regression/` contains an end-to-end usage-pipeline harness. It simulates student profiles, exports usage files, post-processes timestamps, runs the CLI analyzer, and uploads results to `admin.html`. Output files under `tests/regression/output/` and `tests/regression/screenshots/` are generated artifacts — not committed source fixtures. See [`docs/subsystems/usage-and-admin.md`](./subsystems/usage-and-admin.md).

## Notes

- The suite is intentionally split between pure JavaScript rule coverage and browser integration coverage.
- Unit tests are now split by subsystem under `tests/unit/` instead of living in one catch-all file.
- Browser tests now focus on student-visible journeys and breakable UI transitions, not exhaustive authored-level or engine-detail assertions.
- Blockly workspace loading for tests still uses a narrow test hook to avoid brittle drag-and-drop automation for most scenarios.
- Authored level contracts, toolbox gates, engine invariants, and decision-selection details belong in `npm run test:unit` unless the learner can directly see the behavior in the browser.
- Release validation should include `npm test`, `npm run build`, and `npm run test:browser` (full extended suite) before shipping or deploying.
- Routine packet validation can use `npm run test:browser:smoke` for faster feedback.
- `workers: 2` is stable for the smoke suite; the full suite runs at `workers: 1` because `blockly-trace-playback.spec.js` has CPU-contention timing sensitivity under parallelism.
- `jump-animation.spec.js` and `workbench.spec.js` are included in smoke because they are short, learner/dev-visible, and exercise local-only entrypoints without timing-sensitive broad UI coverage.
