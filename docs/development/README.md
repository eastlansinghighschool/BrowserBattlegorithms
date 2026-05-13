# Development Packet Index

This folder holds bounded implementation packets and scan reports for Browser Battlegorithms. Packets are intended for smaller or cheaper implementation agents working under orchestration from the integration owner.

## Packet Index

| Packet | Status | Purpose |
| --- | --- | --- |
| [00 Mini Packet Agent Starting Prompt](00-mini-packet-agent-starting-prompt.md) | ready | Starting prompt for lower-cost implementation threads before assigning a specific packet. |
| [00 Orchestrator Thread Starting Prompt](00-orchestrator-thread-starting-prompt.md) | ready | Starting prompt for fresh orchestration threads that advise on product, curriculum, architecture, and packet sequencing. |
| [00 Plan 08 Project Report Review Prompt](00-plan-08-project-report-review-prompt.md) | ready | Starting prompt for independent orchestration reviewers evaluating the Plan 08 project audit without reading other review subfolders. |
| [Plan 01](plan-01-guided-level-source-split.md) | complete | Split large guided level source and reference solution fixture files into smaller modules without changing campaign behavior. |
| [Plan 02](plan-02-guided-test-contract-repair.md) | complete | Repair stale guided unit-test contracts and canonical guided reference solutions. |
| [Plan 03](plan-03-challenge-badge-and-synthesis-framing.md) | ready | Make synthesis/challenge levels visibly distinct in the level picker and lesson panel. |
| [Plan 04](plan-04-saveable-usage-file.md) | ready | Add local student usage export and a teacher-side analyzer for learning evidence, performance evidence, duplicate checks, and modest tamper detection. |
| [Plan 04b](plan-04b-local-usage-admin-report-page.md) | ready | Add a local-only browser admin page for drag-and-drop usage-file analysis, class tables, and per-student detail views without shipping it to GitHub Pages. |
| [Plan 05](plan-05-undo-redo-blockly.md) | ready | Add Blockly undo/redo controls and shortcuts, preferring Blockly-native history. |
| [Plan 06](plan-06-guided-playtest-triage.md) | ready | Browser-playtest the guided campaign one level at a time and produce a triage table before classroom rollout. |
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


## Backlog Triage After Plan 02

The initial backlog is smaller now. Plan 01 completed the source split, and Plan 02 brought guided unit tests and canonical reference solutions back to green.

Still necessary:

- Challenge badge / synthesis framing: source titles mark challenges, but the level picker does not yet visibly distinguish challenge/synthesis levels.
- Classroom-readiness support: local usage export, Blockly undo/redo, and guided playtest triage are now the highest-value items before student testing.
- Guided project sequences: promising but decision-heavy; Plan 08 must settle the project shape before implementation packets proceed.

Probably not necessary as broad packets:

- Broad demo XML redesign: current demos mostly use different objects, conditions, or actions than the active puzzle. Keep future work to audits or targeted fixes.
- Advanced transition copy: likely better handled as targeted copy edits if a playtest finds confusion, not a standalone packet yet.
- Level count and public docs alignment: only make this a packet if a quick doc scan finds current public docs still disagree with the 37 numbered levels plus optional lab structure.

Still a maybe:

- Late multi-ally level repair and map-variety/territory redesign may still matter pedagogically, but should wait until tests are green and the current guided campaign is manually playable.
- Build-size and Blockly loading review is low priority unless classroom load time becomes a visible problem.

## Suggested Next Packets

Create these as numbered `plan-XX-*.md` packet files when they are ready to hand off.

| Proposed Packet | Priority | Purpose |
| --- | --- | --- |
| `plan-03-challenge-badge-and-synthesis-framing.md` | P1 | Ready packet. Make synthesis/challenge levels visibly distinct in the level picker and lesson panel so students understand "no new tools" moments. |
| `plan-04-saveable-usage-file.md` | P1 | Ready packet. Add a local student usage export and teacher analyzer that summarize learning evidence, performance evidence, code snapshots, completion, duplicate/reuse signals, and SHA-256 integrity checks for modest tamper detection. No server components. |
| `plan-04b-local-usage-admin-report-page.md` | P1 | Ready packet. Add a local-only browser admin page where the teacher can drop usage files, see a class table, inspect one student at a time, and keep the admin page/link out of the GitHub Pages build. |
| `plan-05-undo-redo-blockly.md` | P1 | Ready packet. Add Blockly undo/redo controls and keyboard shortcuts, preferring Blockly-native history before considering any custom sessionStorage or IndexedDB stack. |
| `plan-06-guided-playtest-triage.md` | P1 | Ready packet. Use a browser-capable agent or human playtester in small guided batches to attempt each guided level like a student and produce a triage table before classroom rollout. |
| `plan-07-private-free-play-program-files.md` | P2 | Ready packet. Add optional password/PIN-encrypted Free Play program files using browser Web Crypto for hot-seat code privacy, preserve normal Free Play import/export, and remove import/export controls from guided levels. |
| `plan-08-guided-project-sequence-design.md` | P1 | Complete. Produced an audit, independent orchestration reviews, an approved decision record, and a project level map for two shared-code guided projects. |
| `plan-09-project-metadata-and-workspace-architecture.md` | P1 | Ready. Implement project metadata and shared latest project workspace persistence while preserving ordinary guided and Free Play behavior. |
| `plan-10-project-start-ui-and-level-picker-signifiers.md` | P1 | Blocked by Plan 09. Add project badges, project-start workspace bubble/callout, and persistent project indicators. |
| `plan-11-strategy-brain-project-revision.md` | P1 | Ready after Plans 09-10. Revise L23-L28 into a coherent shared-code Strategy Brain project, including a load-bearing L24 and a true L28 capstone. |
| `plan-12-team-strategy-script-project-revision.md` | P1 | Ready after Plans 09-10. Revise L29-L37 into a coherent shared-code Team Strategy Script project, keeping L34-L36 separate and repairing L37. |
| `plan-13-project-reference-solutions-and-test-harness-repair.md` | P1 | Blocked by Plans 09-12. Repair canonical fixtures and tests so one-off and project guided levels both have clear validation. |
| `plan-14-project-version-history-design.md` | P2 | Complete. Design, but do not yet implement, a project version-history interface for recovering earlier shared-code states. |
| `plan-15-pilot-readiness.md` | P1 | Ready. Pre-pilot fixes: disable all-levels-unlocked flag, expand help page, verify L28 badge interaction. |
| `plan-16-usage-pipeline-regression.md` | P1 | Ready. End-to-end Playwright regression with 5 parallel student profiles, usage export, CLI analyzer, admin page upload, and screenshots. |
| `plan-17-doc-cleanup.md` | P1 | Ready. Phased docs refresh and subsystem note authoring, using the `reports/development/doc-cleanup/` reports as source material. |
| `plan-20-advanced-ai-opponents.md` | P2 | Add more challenging Free Play AI opponents with distinct playstyles and optional guided showcase/counterplay levels. |
| `plan-21-build-size-and-blockly-loading-review.md` | P3 | Investigate Vite build chunk warnings and whether Blockly/p5 loading can be split without hurting classroom reliability. |
| `plan-17-game-history-and-replays.md` | P2 | Add local game history and replay export/import, separate from Plan 04 usage evidence. |
| `plan-18-advanced-multi-ally-coordination-levels.md` | P3 | Design and implement additional challenging multi-ally coordination levels after the project arcs are settled. |
| `plan-19-automated-barrier-path-counting.md` | P3 | Create a visual analytics tool that counts possible paths and flags overly broad level path spaces. |

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
- Static Vite build must remain functional.

## Current Validation Baseline

As of Plan 02 completion on 2026-05-12:

- `npm test` passes.
- `npm run build` passes.
- Build output still warns that Blockly is both dynamically and statically imported, preventing the intended chunk split.
- Build output still warns that minified chunks exceed 500 kB.
