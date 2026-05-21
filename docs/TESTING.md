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

The Playwright browser coverage is split across purpose-built commands:

### Smoke — frequent validation

- `npm run test:browser:smoke` — fast subset (~60 tests, ~45-60s, `workers: 2`)

Run this after most changes. Covers:

- startup shell, welcome chooser, and lazy-load placeholders
- guided play progression, tutorial demos, special-action flow, keyboard-practice flow, and a representative advanced level
- actual keyboard input in representative guided and PvP scenarios
- live pause/resume coverage in Guided Levels and Free Play, including the guarded `P` shortcut
- one core accessibility/narration announcement contract
- one visible animation/effect contract where unit tests cannot substitute
- free-play setup controls for mode, team size, and map selection
- PvP free-play team tab switching and separate programs per side
- free-play mode smoke coverage for PvP, PvCPU Easy, and PvCPU Tactical
- student-visible jump flair coverage for Jump Forward arc and blocked-jump reversal
- help-link behavior and standalone help-page navigation
- workspace reset / starter restoration behavior
- key-capture routing in representative browser scenarios

### Release — broad browser matrix

- `npm run test:browser` or `npm run test:browser:extended` — release browser matrix (~126 tests, ~2m10s, `workers: 1`)

Run before releases or after changes to persistence, modal focus, dev harness, or workspace versioning. This release matrix intentionally excludes the deferred workbench diagnostics. Adds:

- `guided-ui.spec.js` — broad guided UI matrix, including level picker, HUD, panel collapse, Blockly resizing, and desktop workspace size controls (~19s)
- `persistence.spec.js` — full file pipeline and private export edge cases (~19s)
- `modal-stability.spec.js` — focus-stability matrix with fixed waits (~11s)
- `dev-guided-level-link.spec.js` — dev harness, contains long waits (~8s)
- `workspace-starter-versioning.spec.js` — localStorage versioning edge cases
- `blockly-trace-playback.spec.js` — timing-sensitive animation test (CPU-contention flake at `workers: 2`; runs only at `workers: 1`)

CI currently runs the smoke and focus tiers separately. The release matrix is optional for routine CI but is the supported pre-release browser check when you want broad browser coverage without the deferred workbench suite.
The local-dev/tooling suites are also optional and should be run directly when you are changing the related surfaces:

- `npm run test:browser:tooling` — admin file analyzer, dev unlock toggle, and dev-guided deep-link checks (~21 tests, ~1m, `workers: 1`)
- `npm run test:browser:workbench` — local-dev readiness/workbench shell, canonical-solution runner, scratch preview, and mutation prompt checks (currently deferred/manual and known failing until the lazy-boot packet lands)

### Focus/accessibility

- `npm run test:browser:focus` — modal stability and tutorial narration-control tests (~5 tests, ~45s, `workers: 1`)

Targeted run for accessibility focus-management changes and tutorial scrim behavior.

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
- Release validation should include `npm test`, `npm run build`, and `npm run test:browser` (release matrix without the deferred workbench suite) before shipping or deploying.
- Routine packet validation can use `npm run test:browser:smoke` for faster feedback.
- `workers: 2` is stable for the smoke suite; the full suite runs at `workers: 1` because `blockly-trace-playback.spec.js` has CPU-contention timing sensitivity under parallelism.
- `jump-animation.spec.js` remains in smoke because it is short and learner-visible.
- `aria-narration.spec.js` and `key-capture-passthrough.spec.js` remain in smoke because they cover student-facing announcement and keyboard-routing contracts.
- `narration-controls-during-tutorial.spec.js` is kept out of smoke so the accessibility focus-management matrix stays targeted rather than duplicated across tiers.
- `admin.spec.js`, `dev-unlock.spec.js`, and `dev-guided-level-link.spec.js` are kept out of smoke so local-dev/admin/tooling paths do not slow or destabilize routine CI; use `npm run test:browser:tooling` for targeted validation.
- `workbench.spec.js` is kept out of smoke and release validation while the workbench boot path is deferred; use `npm run test:browser:workbench` as a targeted manual/diagnostic command for the known-failing suite.
