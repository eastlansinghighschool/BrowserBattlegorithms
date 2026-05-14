# Development Packet Index

This folder holds bounded implementation packets and scan reports for Browser Battlegorithms. Packets are intended for smaller or cheaper implementation agents working under orchestration from the integration owner.

## Packet Index

| Packet | Status | Purpose |
| --- | --- | --- |
| [00 Mini Packet Agent Starting Prompt](00-mini-packet-agent-starting-prompt.md) | ready | Starting prompt for lower-cost implementation threads before assigning a specific packet. |
| [00 Orchestrator Thread Starting Prompt](00-orchestrator-thread-starting-prompt.md) | ready | Starting prompt for fresh orchestration threads that advise on product, curriculum, architecture, and packet sequencing. |
| [Plan 01](plan-01-guided-level-source-split.md) | complete | Split large guided level source and reference solution fixture files into smaller modules without changing campaign behavior. |
| [Plan 02](plan-02-guided-test-contract-repair.md) | complete | Repair stale guided unit-test contracts and canonical guided reference solutions. |
| [Plan 03](plan-03-challenge-badge-and-synthesis-framing.md) | ready | Make synthesis/challenge levels visibly distinct in the level picker and lesson panel. |
| [Plan 04](plan-04-saveable-usage-file.md) | ready | Add local student usage export and a teacher-side analyzer for learning evidence, performance evidence, duplicate checks, and modest tamper detection. |
| [Plan 04b](plan-04b-local-usage-admin-report-page.md) | ready | Add a local-only browser admin page for drag-and-drop usage-file analysis, class tables, and per-student detail views without shipping it to GitHub Pages. |
| [Plan 05](plan-05-undo-redo-blockly.md) | ready | Add Blockly undo/redo controls and shortcuts, preferring Blockly-native history. |
| [Plan 06](plan-06-guided-playtest-triage.md) | ready | Playtest the revised guided campaign for pilot readiness, project carry-forward clarity, AP CSA transfer, usage/export smoke confidence, and tournament preparation. |
| [Plan 07](plan-07-private-free-play-program-files.md) | ready | Add optional password-encrypted Free Play program files for local hot-seat code privacy, and remove import/export from guided levels. |
| [Plan 08](plan-08-guided-project-sequence-design.md) | complete | Decided the two guided project arcs, their level membership, toolbox policy, shared-code semantics, and downstream contracts. |
| [Plan 09](plan-09-project-metadata-and-workspace-architecture.md) | ready | Implement project metadata and shared latest workspace persistence for project levels. |
| [Plan 10](plan-10-project-start-ui-and-level-picker-signifiers.md) | blocked by Plan 09 | Add project badges, project-start callouts, and shared-code explanations in the UI. |
| [Plan 11](plan-11-strategy-brain-project-revision.md) | ready after Plans 09-10 | Revise L23-L28 into the Strategy Brain shared-code project, including L24 repair and L28 capstone revision. |
| [Plan 12](plan-12-team-strategy-script-project-revision.md) | ready after Plans 09-10 | Revise L29-L37 into the Team Strategy Script shared-code project, including L37 capstone repair. |
| [Plan 13](plan-13-project-reference-solutions-and-test-harness-repair.md) | blocked by Plans 09-12 | Repair canonical solution fixtures and tests for one-off and project guided levels. |
| [Plan 14](plan-14-project-version-history-design.md) | complete | Design a future project version-history interface for recovering earlier shared-code states. |
| [Plan 15](plan-15-pilot-readiness.md) | ready | Pre-pilot fixes: disable all-levels-unlocked, expand help page with Projects and Usage Export sections, expand advanced block descriptions, verify L28 badge interaction. |
| [Plan 16](plan-16-usage-pipeline-regression.md) | ready | End-to-end Playwright regression: 5 parallel student profiles play the campaign, export usage, verify CLI analyzer, upload to admin page, capture screenshots. |
| [Plan 17](plan-17-doc-cleanup.md) | complete | Documentation cleanup. Refresh README/ARCHITECTURE, add focused subsystem notes under `docs/subsystems/`, correct stale rules in the spec, and retire obsolete phase-era docs. Sequenced and gated for mini-model phases. |
| [Plan 18](plan-18-subsystem-doc-workflow.md) | complete | Wire `docs/subsystems/` notes into the packet workflow. Promote them to authoritative status in packet-creation-guidance and route both the mini-packet and orchestrator starting prompts to read the matching note when scoping or implementing covered behavior. |
| [Plan 19](plan-19-guided-playtest-harness-and-gemini-scaffolding.md) | ready | Add a local-dev-only guided-level deep link and Plan 06 Gemini scaffolding so guided playtest triage can run level-by-level with small reusable context. |


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
- Static Vite build must remain functional.

## Current Validation Baseline

As of Plan 02 completion on 2026-05-12:

- `npm test` passes.
- `npm run build` passes.
- Build output still warns that Blockly is both dynamically and statically imported, preventing the intended chunk split.
- Build output still warns that minified chunks exceed 500 kB.
