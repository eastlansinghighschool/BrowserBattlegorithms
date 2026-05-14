# Future Directions Backlog

This backlog is intentionally unnumbered. Assign packet numbers only when a future direction is ready to become a concrete `docs/development/plan-*.md` handoff.

## Backlog Triage After Plan 02

The initial backlog is smaller now. Plan 01 completed the source split, and Plan 02 brought guided unit tests and canonical reference solutions back to green.

Still necessary:

- Challenge badge / synthesis framing: source titles mark challenges, but the level picker does not yet visibly distinguish challenge/synthesis levels.
- Classroom-readiness support: local usage export, Blockly undo/redo, and guided playtest triage are now the highest-value items before student testing.
- Guided project sequences: promising but decision-heavy. Plan 08 settled the project shape; Plans 09-13 now carry that decision into implementation and validation.

Probably not necessary as broad packets:

- Broad demo XML redesign: current demos mostly use different objects, conditions, or actions than the active puzzle. Keep future work to audits or targeted fixes.
- Advanced transition copy: likely better handled as targeted copy edits if a playtest finds confusion, not a standalone packet yet.
- Level count and public docs alignment: only make this a packet if a quick doc scan finds current public docs still disagree with the 37 numbered levels plus optional lab structure.

Still a maybe:

- Late multi-ally level repair and map-variety/territory redesign may still matter pedagogically, but should wait until tests are green and the current guided campaign is manually playable.
- Build-size and Blockly loading review is low priority unless classroom load time becomes a visible problem.

## Near-Term Packet Queue

These items already have packet files or approved sequencing. Keep their canonical status in `docs/development/README.md`.

| Direction | Priority | Purpose |
| --- | --- | --- |
| Challenge badge and synthesis framing | P1 | Make synthesis/challenge levels visibly distinct in the level picker and lesson panel so students understand "no new tools" moments. |
| Saveable usage file | P1 | Add a local student usage export and teacher analyzer that summarize learning evidence, performance evidence, code snapshots, completion, duplicate/reuse signals, and SHA-256 integrity checks for modest tamper detection. No server components. |
| Local usage admin report page | P1 | Add a local-only browser admin page where the teacher can drop usage files, see a class table, inspect one student at a time, and keep the admin page/link out of the GitHub Pages build. |
| Blockly undo/redo | P1 | Add Blockly undo/redo controls and keyboard shortcuts, preferring Blockly-native history before considering any custom sessionStorage or IndexedDB stack. |
| Guided playtest triage | P1 | Use a browser-capable agent or human playtester in small guided batches to attempt each guided level like a student and produce a triage table before classroom rollout. |
| Private Free Play program files | P2 | Add optional password/PIN-encrypted Free Play program files using browser Web Crypto for hot-seat code privacy, preserve normal Free Play import/export, and remove import/export controls from guided levels. |
| Project metadata and workspace architecture | P1 | Implement project metadata and shared latest project workspace persistence while preserving ordinary guided and Free Play behavior. |
| Project-start UI and level-picker signifiers | P1 | Add project badges, project-start workspace bubble/callout, and persistent project indicators after project metadata lands. |
| Strategy Brain project revision | P1 | Revise L23-L28 into a coherent shared-code Strategy Brain project, including a load-bearing L24 and a true L28 capstone. |
| Team Strategy Script project revision | P1 | Revise L29-L37 into a coherent shared-code Team Strategy Script project, keeping L34-L36 separate and repairing L37. |
| Project reference solutions and test harness repair | P1 | Repair canonical fixtures and tests so one-off and project guided levels both have clear validation. |
| Pilot readiness | P1 | Pre-pilot fixes: disable all-levels-unlocked flag, expand help page, verify L28 badge interaction. |
| Usage pipeline regression | P1 | End-to-end Playwright regression with 5 parallel student profiles, usage export, CLI analyzer, admin page upload, and screenshots. |

## Loose Future Ideas

These are not ready packets yet. They need owner judgment, sequencing, and fresh packet numbers before handoff.

| Direction | Priority | Purpose |
| --- | --- | --- |
| Advanced AI opponents | P2 | Add more challenging Free Play AI opponents with distinct playstyles and optional guided showcase/counterplay levels. |
| Build size and Blockly loading review | P3 | Investigate Vite build chunk warnings and whether Blockly/p5 loading can be split without hurting classroom reliability. |
| Game history and replays | P2 | Add local game history and replay export/import, separate from usage evidence. |
| Advanced multi-ally coordination levels | P3 | Design and implement additional challenging multi-ally coordination levels after the project arcs are settled. |
| Automated barrier path counting | P3 | Create a visual analytics tool that counts possible paths and flags overly broad level path spaces. |
