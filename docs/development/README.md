# Development Packet Index

This folder holds bounded implementation packets and scan reports for Browser Battlegorithms. Packets are intended for smaller or cheaper implementation agents working under orchestration from the integration owner.

## Packet Index

### Active Packets

| Packet | Status | Purpose |
| --- | --- | --- |
| [00 Mini Packet Agent Starting Prompt](00-mini-packet-agent-starting-prompt.md) | ready | Starting prompt for lower-cost implementation threads before assigning a specific packet. |
| [00 Level Editing Agent Starting Prompt](00-level-editing-agent-starting-prompt.md) | ready | Starting prompt for focused guided-level editing threads that need the level source, Blockly XML, fixture, tutorial, and validation map before implementation. |
| [00 Orchestrator Thread Starting Prompt](00-orchestrator-thread-starting-prompt.md) | ready | Starting prompt for fresh orchestration threads that advise on product, curriculum, architecture, and packet sequencing. |
| [00 Cross-Doc Drift Scanner Agent Starting Prompt](00-cross-doc-drift-scanner-agent-starting-prompt.md) | ready | Starting prompt for scan-only agent sessions that audit the live `docs/` surface (excluding archive/history/reports) for rule, terminology, capability, cross-reference, numeric, roadmap, and scope-authority drift, producing a detailed report under `reports/development/cross-doc-drift-scans/` for a stronger model to resolve. |
| [Plan 41](plan-41-keyboard-gemini-guided-playthrough.md) | ready | Revive the archived Plan 06 guided playtest as a new keyboard-first Gemini campaign. Consumes Plan 40 keyboard workflows plus Plan 06/19/22 scaffolding, writes new reports under a Plan 41 folder, and leaves existing Plan 06 artifacts untouched. |
| [Plan 51](plan-51-game-specification-restructure.md) | ready | Restructure `docs/GameSpecification.md` into a foundational rules document (board-game-playable), absorb Blockly content into the subsystem note, move Fun Factor out to future-directions, and drop V1.1/"later:"/"not in this version" framings. Dispatches after Plan 49 lands. |
| [Plan 52](plan-52-jump-forward-animation-and-flair.md) | ready | Replace the slide-and-ease Jump Forward animation with a parabolic arc (apex over the skipped cell) plus drop shadow, converging takeoff lines, dust ring landing, takeoff/landing SFX, and a failed-jump partial-arc reversal. Visual+audio only — no game rule changes. Reduced-motion paths for every effect. Surfaced by 2026-05-18 pilot student feedback. |

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
| [Plan 25](archive/plan-25-slow-speed-blockly-trace.md) | deprecated | Superseded by Plan 25a (data) + Plan 25b (UI). Original single-packet design conflated trace collection with pre-action playback; the split separates pure-function data work from turn-engine state machine and Blockly visual risk. |
| [Plan 25a](archive/plan-25a-blockly-trace-collection.md) | complete | Data-only Blockly evaluation trace collected during action resolution, with action-selection invariance, short-circuit honesty, PvP hidden-workspace skip, and dev-only inspection hook. No turn-engine or UI changes. |
| [Plan 25b](archive/plan-25b-blockly-trace-playback.md) | complete | Pre-action trace playback UI: new `TRACING_PRE_ACTION` turn state, per-frame block highlighting with outline + glyph + redundant color, 6-step cost cap with "…" overflow badge, low-speed empty-program hint. Depends on Plan 25a. |
| [Plan 26](archive/plan-26-challenge-22-guided-vertical-patrol.md) | complete | Add a deterministic guided vertical patrol NPC behavior and use it to make Challenge 22 live defenders more readable and less chase-brittle. |
| [Plan 29](archive/plan-29-trace-visual-refinement.md) | complete | Refine Plan 25b trace visuals: fade result outlines to transparent over ~1s, keep glyphs persistent, add brightness + saturation boost on the current block, bump pacing constants with a min-per-step floor, add a speed-slider threshold marker, and finally honor `prefers-reduced-motion`. Amends Plan 25b Decisions 2 and 4. |
| [Plan 30](archive/plan-30-global-key-capture-bugfix.md) | complete | Fix `p.keyPressed` in `src/render/p5App.js` so the p5 window-level listener only calls `preventDefault()` when `handleKeyInput` actually consumed the key and never when a modifier is held. Restores Blockly text typing, Tab navigation, focused-button activation, range-slider arrow keys, page scrolling, browser shortcuts (Ctrl+R, F12, Ctrl+F), and Blockly's native shortcuts. |
| [Plan 31](archive/plan-31-modal-stability-regression-suite.md) | complete | Playwright regression suite covering every modal/overlay surface against a common stability matrix: focus survives 1500 ms idle time, Tab/Shift+Tab advance and retreat as currently designed, form fields accept typed characters, Enter activates focused buttons, and documented close triggers work. Tests-only by default; any bug found is reported, not fixed in this packet. |
| [Plan 32](archive/plan-32-future-directions-refresh.md) | complete | Refresh future-directions-analysis by consolidating the model-perspective files into `analysis-index.md`, rewriting `backlog.md`, and archiving the original Claude/Codex/Gemini notes. Docs-only. |
| [Plan 33](archive/plan-33-teacher-facilitation-kit.md) | complete | Single classroom-facing companion doc covering per-phase pacing, non-spoiler intervention prompts, AP CSA discussion prompts, Hour-of-Code subset (L1–L7), and a troubleshooting quick reference. v0.1 defaults recorded inline (phase taxonomy, time bands, stuck points from level-fix packets, five discussion themes); kit ships with a banner noting pacing is prediction-based pending classroom evidence. |
| [Plan 34](archive/plan-34-level-authoring-contract-linter.md) | complete | Developer-side `npm run lint:levels` script auditing every guided level against ten curriculum contracts (concept-matrix agreement, toolbox compatibility, demo-isn't-solution, challenge-introduces-no-new-block, project metadata and toolbox, turn-limit floor, sensor-relation policy, fixture-naming, mechanic-required-by-win-condition). Errors and warnings; no auto-fix. |
| [Plan 35](archive/plan-35-narration-event-log-foundation.md) | complete | Per-turn append-only event log on `state` with 9 v1 event kinds (`turn.started`, `runner.actionChosen`, `runner.actionResolved`, `runner.blockedOrBounced`, `flag.pickedUp`, `flag.dropped`, `team.scored`, `resource.unavailable`, `level.result`). Engine becomes a passive producer; no consumers in this packet. Foundation for narration, classifier, replay, and usage enrichment. |
| [Plan 36](archive/plan-36-aria-live-board-narration.md) | complete | Factual ARIA narration consuming the Plan 35 event log. Per-turn aria-live="polite" announcement summarizing coincident events into one short sentence; optional visible "Last turn" strip behind a settings toggle. Concise, mode-gated, no interpretation. Pairs with Plan 35; depends on it. |
| [Plan 37](archive/plan-37-learning-moment-classifier.md) | complete | Pure-function classifier emitting `LearningMoment[]` records across all six v1 kinds (bounced, resource_no_readiness_guard, no_action_selected, ignored_blocks_below_action, recurring_pattern, runner_index_unhandled). Persists the per-turn trace to `state.lastBlocklyTrace` with workspace-enriched metadata and introduces `state.classifierRecurrenceState` with documented reset rules. No prose, no UI. Multi-consumer data layer for Plan 38 coach + future usage enrichment and dashboards. |
| [Plan 38](archive/plan-38-learning-coach-text.md) | complete | Short opt-in coaching messages (≤ 25 words) tied to Plan 37 LearningMoments. Disciplined cadence (first-time-only or every-occurrence per kind), toolbox-aware tiered phrasing that never names blocks the student can't yet use, and a separate warm-yellow aria-live region from Plan 36 narration. Default off; persists to localStorage. |
| [Plan 39](archive/plan-39-browser-tts-delivery.md) | complete — pending manual smoke | Web Speech API wrapper that speaks Plan 36 narration and Plan 38 coach text. Handles user-gesture-first-speak, async voice loading, queue cancellation, SFX ducking (30% volume during speech), aria-live conflict suppression for screen-reader users, and beforeunload cancel. Voice rate slider and voice picker. Off by default; persists to localStorage. |
| [Plan 40](archive/plan-40-blockly-keyboard-navigation.md) | complete | Integrate Blockly's keyboard-navigation plugin so users and browser agents can author Blockly programs without drag/drop, while preserving Plan 30 key-capture protections, p5 gameplay input routing, modal/form/slider focus behavior, Blockly undo/redo, and dev-guided startup behavior. |
| [Plan 42](archive/plan-42-bug-hunt-guided-levels.md) | complete | Add one guided bug hunt level before each synthesis challenge so students practice tracing and repairing plausible broken Blockly programs before open-ended challenge work. |
| [Plan 43](archive/plan-43-multiple-choice-prediction-levels.md) | complete | Add a small multiple-choice prediction interaction for selected guided levels so students commit to expected program behavior before running and comparing the result. |
| [Plan 44](archive/plan-44-narration-controls-and-voice-bootstrap-repair.md) | complete | Fix three narration/coaching/voice UI defects surfaced by the Plan 39 escalation: tutorial scrim blocks controls, voice picker startup race, and a missing coaching-toggle initial sync. Manual Chrome smoke verified by integration owner. |
| [Plan 45](archive/plan-45-guided-workspace-starter-versioning.md) | complete | Add per-level starter XML versioning to guided workspaces so authored fixes (e.g. the 2026-05-17 bughunt-22 repair) reach returning students automatically, plus a "Reset Workspace to Starter" toolbar button as the manual escape hatch. Closes the localStorage staleness hole without DevTools access. |
| [Plan 46](archive/plan-46-flag-carrier-vulnerability-collision-rule.md) | complete | Change collision rules so flag carriers are always vulnerable: one-carrier collisions make the carrier lose, both-carrier collisions make the moving attacker lose, and no-carrier collisions keep home-side advantage. |
| [Plan 47](archive/plan-47-optional-double-carrier-showdown.md) | complete | Add a late optional guided level after the final project sequence where both teams begin with flag carriers and students must use human control plus two ally runners against at least three live NPCs to score under carrier-vulnerability pressure. |
| [Plan 48](archive/plan-48-area-freeze-cooldown-and-status-chip.md) | complete | Change Area Freeze from once-per-round to a configurable turn cooldown and add a compact snowflake status chip showing ready/cooldown state. |
| [Plan 49](archive/plan-49-area-freeze-board-effect-visualization.md) | complete | Add board-level Area Freeze visuals: caster pulse, affected-runner flash, persistent frozen countdown badges, and reduced-motion equivalents. |
| [Plan 50](plan-50-browser-test-suite-hygiene.md) | complete | Tier the Playwright browser suite into fast smoke and extended runs, validate safe parallelism, and move slow low-signal checks out of the frequent validation path without losing coverage. |


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

As of Plan 50 completion on 2026-05-18:

- `npm test` passes — 290/292 tests across 23 unit test files. 2 pre-existing failures in `guided-project-solutions.test.js` (strategy-brain full-team-tactics); not caused by recent changes.
- `npm run test:browser:smoke` passes — 64/64 tests, ~60s, `workers: 2`.
- `npm run test:browser` passes — 111/111 tests, ~2m30s, `workers: 1`.
- `npm run build` passes.
- Build output still warns that Blockly is both dynamically and statically imported, preventing the intended chunk split.
- Build output still warns that minified chunks exceed 500 kB.
- Plan 39 (voice narration) requires a manual smoke pass in a real browser; automated TTS audibility is not assertable from the unit suite.
