# Development Packet Index

This folder holds bounded implementation packets and scan reports for Browser Battlegorithms. Packets are intended for smaller or cheaper implementation agents working under orchestration from the integration owner.

## Packet Index

### Active Packets

| Packet | Status | Purpose |
| --- | --- | --- |
| [00 Mini Packet Agent Starting Prompt](00-mini-packet-agent-starting-prompt.md) | ready | Starting prompt for lower-cost implementation threads before assigning a specific packet. |
| [00 Orchestrator Thread Starting Prompt](00-orchestrator-thread-starting-prompt.md) | ready | Starting prompt for fresh orchestration threads that advise on product, curriculum, architecture, and packet sequencing. |
| [Plan 06](plan-06-guided-playtest-triage.md) | in-progress | Playtest the revised guided campaign for pilot readiness, project carry-forward clarity, AP CSA transfer, usage/export smoke confidence, and tournament preparation. |
| [Plan 25](plan-25-slow-speed-blockly-trace.md) | deprecated | Superseded by Plan 25a (data) + Plan 25b (UI). Original single-packet design conflated trace collection with pre-action playback; the split separates pure-function data work from turn-engine state machine and Blockly visual risk. |
| [Plan 27](plan-27-completed-packet-archiving.md) | ready | Move complete packets into `docs/development/archive/`, split the packet index into active vs completed tables, and ship a reusable archival prompt at `docs/development/archive-packets-prompt.md` for future hygiene passes. |
| [Plan 28](plan-28-style-css-component-split.md) | ready | Split the 1560-line `style.css` into 6-10 component partials under `src/assets/styles/components/`, keeping `style.css` as a small `@import` entry point. Cascade-preserving, no visual change, no rule rewrites. |

### Completed Packets

| Packet | Status | Purpose |
| --- | --- | --- |
| [Plan 01](archive/plan-01-guided-level-source-split.md) | complete | Split large guided level source and reference solution fixture files into smaller modules without changing campaign behavior. |
| [Plan 02](archive/plan-02-guided-test-contract-repair.md) | complete | Repair stale guided unit-test contracts and canonical guided reference solutions. |
| [Plan 03](archive/plan-03-challenge-badge-and-synthesis-framing.md) | complete | Make synthesis/challenge levels visibly distinct in the level picker and lesson panel. |
| [Plan 04](archive/plan-04-saveable-usage-file.md) | complete | Add local student usage export and a teacher-side analyzer for learning evidence, performance evidence, duplicate checks, and modest tamper detection. |
| [Plan 04b](archive/plan-04b-local-usage-admin-report-page.md) | complete | Add a local-only browser admin page for drag-and-drop usage-file analysis, class tables, and per-student detail views without shipping it to GitHub Pages. |
| [Plan 05](archive/plan-05-undo-redo-blockly.md) | complete | Add Blockly undo/redo controls and shortcuts, preferring Blockly-native history. |
| [Plan 07](archive/plan-07-private-free-play-program-files.md) | complete | Add optional password-encrypted Free Play program files for local hot-seat code privacy, and remove import/export from guided levels. |
| [Plan 08](archive/plan-08-guided-project-sequence-design.md) | complete | Decided the two guided project arcs, their level membership, toolbox policy, shared-code semantics, and downstream contracts. |
| [Plan 09](archive/plan-09-project-metadata-and-workspace-architecture.md) | complete | Implement project metadata and shared latest workspace persistence for project levels. |
| [Plan 10](archive/plan-10-project-start-ui-and-level-picker-signifiers.md) | complete | Add project badges, project-start callouts, and shared-code explanations in the UI. |
| [Plan 11](archive/plan-11-strategy-brain-project-revision.md) | complete | Revise L23-L28 into the Strategy Brain shared-code project, including L24 repair and L28 capstone revision. |
| [Plan 12](archive/plan-12-team-strategy-script-project-revision.md) | complete | Revise L29-L37 into the Team Strategy Script shared-code project, including L37 capstone repair. |
| [Plan 13](archive/plan-13-project-reference-solutions-and-test-harness-repair.md) | complete | Repair canonical solution fixtures and tests for one-off and project guided levels. |
| [Plan 14](archive/plan-14-project-version-history-design.md) | complete | Design a future project version-history interface for recovering earlier shared-code states. |
| [Plan 15](archive/plan-15-pilot-readiness.md) | complete | Pre-pilot fixes: disable all-levels-unlocked, expand help page with Projects and Usage Export sections, expand advanced block descriptions, verify L28 badge interaction. |
| [Plan 16](archive/plan-16-usage-pipeline-regression.md) | complete | End-to-end Playwright regression: 5 parallel student profiles play the campaign, export usage, verify CLI analyzer, upload to admin page, capture screenshots. |
| [Plan 17](archive/plan-17-doc-cleanup.md) | complete | Documentation cleanup. Refresh README/ARCHITECTURE, add focused subsystem notes under `docs/subsystems/`, correct stale rules in the spec, and retire obsolete phase-era docs. Sequenced and gated for mini-model phases. |
| [Plan 18](archive/plan-18-subsystem-doc-workflow.md) | complete | Wire `docs/subsystems/` notes into the packet workflow. Promote them to authoritative status in packet-creation-guidance and route both the mini-packet and orchestrator starting prompts to read the matching note when scoping or implementing covered behavior. |
| [Plan 19](archive/plan-19-guided-playtest-harness-and-gemini-scaffolding.md) | complete | Add a local-dev-only guided-level deep link and Plan 06 Gemini scaffolding so guided playtest triage can run level-by-level with small reusable context. |
| [Plan 20](archive/plan-20-gitignore-and-untracking.md) | complete | Repo hygiene: untrack `.claude/settings.local.json`, `.env`, `local/`, and any tracked `scratch/` files; add `.env.example`; expand `.gitignore` with OS/editor cruft and standard env-file patterns. |
| [Plan 21](archive/plan-21-absolute-path-sweep-in-reports.md) | complete | Replace hardcoded `C:/Codex/BrowserBattlegorithms_CODEX/` absolute paths in twelve tracked `reports/*.md` files with relative links so they work for anyone cloning the repo. |
| [Plan 22](archive/plan-22-dev-guided-blockly-assist.md) | complete | Add dev-guided Blockly assist for Plan 06 browser-agent runs: open the first toolbox category and place `On Each Turn` visibly to the right when `devGuidedLevel` is active. |
| [Plan 23](archive/plan-23-level-15-defender-and-wanderer.md) | complete | Revise Challenge 15 with a stationary active defender and movement-only wandering enemy so the synthesis challenge is more game-like without becoming random trial-and-error. |
| [Plan 24](archive/plan-24-level-19-relay-race-repair.md) | complete | Repair Level 19 so the human retrieves the flag and the ally must use teammate-has-flag to switch from defensive staging to carrier support. |
| [Plan 25a](archive/plan-25a-blockly-trace-collection.md) | complete | Data-only Blockly evaluation trace collected during action resolution, with action-selection invariance, short-circuit honesty, PvP hidden-workspace skip, and dev-only inspection hook. No turn-engine or UI changes. |
| [Plan 25b](archive/plan-25b-blockly-trace-playback.md) | complete | Pre-action trace playback UI: new `TRACING_PRE_ACTION` turn state, per-frame block highlighting with outline + glyph + redundant color, 6-step cost cap with "…" overflow badge, low-speed empty-program hint. Depends on Plan 25a. |
| [Plan 26](archive/plan-26-challenge-22-guided-vertical-patrol.md) | complete | Add a deterministic guided vertical patrol NPC behavior and use it to make Challenge 22 live defenders more readable and less chase-brittle. |
| [Plan 29](archive/plan-29-trace-visual-refinement.md) | complete | Refine Plan 25b trace visuals: fade result outlines to transparent over ~1s, keep glyphs persistent, add brightness + saturation boost on the current block, bump pacing constants with a min-per-step floor, add a speed-slider threshold marker, and finally honor `prefers-reduced-motion`. Amends Plan 25b Decisions 2 and 4. |


## Future Directions

Loose backlog triage and unnumbered future packet ideas live in [future-directions-analysis/backlog.md](future-directions-analysis/backlog.md).

## Cross-Packet Contracts

- Guided levels should teach one primary concept at a time unless clearly marked as synthesis/challenge levels.
- Project levels may carry shared latest code across multiple levels, but only when marked by project metadata and explained clearly to students.
- Demo Blockly should show reusable structure, not encode the exact solution for the current board.
- Win conditions should require the mechanic the lesson claims to teach.
- Turn limits should allow learning and debugging, not only perfect first attempts.
- Blockly toolboxes should be scoped to the current lesson plus genuinely mastered concepts.
- The app should preserve the one-action-per-turn execution model.
- Multi-ally strategy should teach local rules, role assignment, and decentralized coordination through `runner index`, sensing, and state checks.
- Core rule changes require tests in `tests/unit/`; workflow and visible UI changes usually require Playwright coverage.
- Documentation, level source, reference solutions, and tests must agree before a packet is complete.
- Plans 09-14 must consume the decision artifacts from Plan 08 instead of inventing new project membership, naming, toolbox, or testing policies.
- Approved projects are `strategy-brain` for L23-L28 and `team-strategy-script` for L29-L37.
- Project toolboxes are broad from project start; UI and copy focus attention without hiding carried-code blocks.
- Project reset/version history is separate from ordinary level reset; `Reset Level` preserves project code.
- Plan 19 must run before Plan 06 so Plan 06 can consume the dev deep link, reusable Gemini prompt, level-context files, and per-level report scaffold.
- Plan 22 extends the Plan 19 local-dev `devGuidedLevel` harness for Plan 06 browser-agent runs; it must not change normal student-facing Blockly startup behavior.
- Static Vite build must remain functional.

## Current Validation Baseline

As of Plan 02 completion on 2026-05-12:

- `npm test` passes.
- `npm run build` passes.
- Build output still warns that Blockly is both dynamically and statically imported, preventing the intended chunk split.
- Build output still warns that minified chunks exceed 500 kB.
