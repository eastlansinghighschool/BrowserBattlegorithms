# Plan 08 Independent Recommendations: codex

## Executive Recommendation

Use two shared-code projects, but keep them deliberately different in shape:

- **Project A: Strategy Brain** should be a compact single-ally project from `closest-threat` through `full-team-tactics`. It should teach students to grow one decision tree from target choice into comparison and boolean logic.
- **Project B: Team Strategy Script** should run from `one-program-two-allies` through `advanced-scrimmage`. It should teach one shared program that assigns decentralized roles through runner index, teammate state, local sensing, and resource checks.

My main divergence from the audit is sequencing emphasis, not the broad map. I recommend making `full-team-tactics` part of Strategy Brain, not a standalone bridge, because the accepted direction says the first project should lead into it and because it is the natural payoff for the single-ally boolean toolbox. I also recommend keeping all current teamplay levels for the first implementation, but tagging L34-L36 as the highest-priority playtest compression candidate.

The two prerequisite repairs before classroom-facing rollout are:

- repair or redesign L24 so distance comparison is load-bearing
- replace the L37 reference solution with a role-based team script that actually demonstrates the project learning goal

## Audit Check

The audit accurately describes the current advanced-logic and advanced-teamplay levels in the important ways: level order, primary teaching roles, level kinds, win condition families, toolbox patterns, ally counts, live/frozen enemy shape, and the awkwardness of shared latest code on L24 and L32.

I verified the core claims against:

- `src/config/levels/phases/advanced-logic/`
- `src/config/levels/phases/advanced-teamplay/`
- `src/config/levels/shared/toolboxes.js`
- `src/ai/blockly/workspace.js`
- `tests/unit/fixtures/guided-reference-solutions/`
- `tests/unit/guided-reference-solutions.test.js`
- `tests/unit/guided-level-contracts.test.js`

Small correction: the audit calls L22 and L28 "full pre-advanced set" in the toolbox table. In source, those challenge toolboxes include many pre-advanced statement blocks and special-action/resource blocks, but they do not use the advanced boolean/value wrapper family from `ADVANCED_ALL_BLOCKS`. That is fine pedagogically; it reinforces that L22 is a pre-advanced synthesis gate and L28 is a solo tactics capstone, not a comparison/runner-index level.

The audit's highest-value findings are sound:

- L24 can be solved without the distance comparison, so it is weak as a shared-code project step.
- L32 has a confusing carried-flag start under backward navigation.
- L37's current reference solution does not represent multi-ally coordination.
- Current tests solve levels independently from fixtures, not as cumulative project programs.

## Proposed Project A: Strategy Brain

Project id: `strategy-brain`

Student-facing name: **Strategy Brain**

Placement: after `show-what-you-know`, ending at `full-team-tactics`

Learning meaning: students evolve a single ally program into a tactical decision tree. The AP CSA bridge is explicit: boolean-producing expressions, numeric comparisons, `AND`, `OR`, and `NOT` become conditions inside an event-driven method-like loop.

| Current level | Keep/merge/condense/defer | Proposed project step | Focus | Notes |
| --- | --- | --- | --- | --- |
| L22 `show-what-you-know` | Keep outside project | Gateway before project | Pre-advanced synthesis | Use as the "you are ready for Strategy Brain" moment, not shared-code carryover. |
| L23 `closest-threat` | Keep, rename optional | Step 1 | Choose a target based on local sensing | Should introduce the project and the idea that this program will keep growing. |
| L24 `how-far-away` | Keep only after repair | Step 2 | Numeric distance comparison | Must be redesigned so distance compare is required or strongly load-bearing. |
| L25 `two-conditions-at-once` | Keep | Step 3 | `AND` plus resource readiness | Good first compound condition because it ties logic to not wasting freeze. |
| L26 `this-or-that` | Keep | Step 4 | `OR` for either warning | Keep separate from L27; combining `OR` and `NOT` would be too dense. |
| L27 `flip-the-answer` | Keep | Step 5 | `NOT` for inverted tests | Needs copy that explains why inversion is clearer than writing the opposite branch by hand. |
| L28 `full-team-tactics` | Keep as project capstone | Step 6, capstone | Solo tactical scoring challenge | Make this the Strategy Brain payoff. Do not reset before it. |

I would not merge L26 and L27. Even if their boards feel similar, `OR` and `NOT` are different reasoning moves for novices. The right fix is better framing and playtest feedback, not compression in the first project version.

L24 is the one level I would block before implementation if no redesign authority is available. In a shared-code arc, students who pass Step 2 with a two-move workaround carry forward a program that did not learn the thing Step 3 assumes. That is exactly the kind of quiet curriculum debt project mode amplifies.

## Proposed Project B: Team Strategy Script

Project id: `team-strategy-script`

Student-facing name: **Team Strategy Script**

Placement: after `full-team-tactics`, ending at `advanced-scrimmage`

Learning meaning: students evolve one shared program that multiple allies execute independently. Coordination is decentralized: each ally uses runner index, current state, local sensing, and resource checks to choose its own first reached action.

| Current level | Keep/merge/condense/defer | Proposed project step | Focus | Notes |
| --- | --- | --- | --- | --- |
| L29 `one-program-two-allies` | Keep | Step 1 | Shared workspace mental model | This is orientation, not just a puzzle. Keep it spacious and explicit. |
| L30 `index-jobs` | Keep | Step 2 | Index comparison for role assignment | This is the first real role split; do not merge with L29. |
| L31 `first-two-defend` | Keep | Step 3 | Index ranges and 3-ally grouping | Important AP-style comparison/generalization step. |
| L32 `escort-the-carrier` | Keep with stronger state framing | Step 4 | Teammate flag state plus support role | Needs persistent copy/indicator that one ally starts with the flag. |
| L33 `closest-enemy-defender` | Keep | Step 5 | Attack/defense split with live enemies | This is where team code starts feeling like strategy. |
| L34 `freeze-support` | Keep for first implementation | Step 6 | Index-gated team resource | Strong role/resource example. Watch repetition in playtest. |
| L35 `barrier-specialist` | Keep, consider more turn slack | Step 7 | Barrier specialist role | Same structural pattern as L34/L36, but resource semantics differ enough to validate once. |
| L36 `jump-team` | Keep, consider more turn slack | Step 8 | Jump route assigned by role | Keep because jump has path-planning implications, not only resource gating. |
| L37 `advanced-scrimmage` | Keep as project capstone | Step 9, capstone | Full team script in live CTF | Must require or at least reward role-based behavior; current reference is too thin. |

I recommend against condensing L34-L36 before the first shared-code implementation. Those levels look repetitive in source, but in a classroom they may be the first place students experience the same index skeleton being reused with different strategic resources. That repetition can be good transfer practice. The integration owner should ask Plan 06 or a later playtest to watch for fatigue, then merge L35/L36 only if students are editing mechanically without new prediction/debugging.

## Toolbox And Persistence Contracts

Project toolboxes should be technically broad from the project start, with UI attention narrowing the student task.

Reason: the accepted backtracking behavior requires shared latest code everywhere inside a project. If a student uses a later block and navigates backward, the earlier level must still let them view, edit, save, and debug that carried code. A growing toolbox would either strand blocks or force complicated read-only behavior that is worse for learning.

Recommended unlocks:

| Project | Unlock at project start | Why |
| --- | --- | --- |
| Strategy Brain | `ADVANCED_ALL_BLOCKS`, `MOVE_TOWARD_BLOCKS`, `AREA_FREEZE_BLOCKS`, `EXTENDED_MOVEMENT_BLOCKS`; move-toward targets needed across L23-L28 | Keeps all Strategy Brain code editable, including distance/comparison logic and freeze decisions. |
| Team Strategy Script | `ADVANCED_CAPSTONE_BLOCKS` | By L29, the individual resources have already been taught; the project goal is composition and role assignment. |

UI should focus attention without hiding blocks. Examples for downstream contracts:

- project step header names the current focus, such as "Focus: distance comparison"
- toolbox category or lesson copy can spotlight relevant blocks
- hints and demos should show structure, not final solutions
- no source-level toolbox narrowing inside a project unless the system can still edit all carried blocks safely

Persistence contracts:

- Non-project guided levels keep current per-level storage.
- Each project has one shared latest workspace key, separate from ordinary guided and from other projects.
- Entering any level in the same project loads the shared latest project workspace if it exists.
- The first project level loads its starter XML only when no shared project workspace exists.
- Later project levels also load the shared project workspace when it exists; fallback starter behavior is only for first-time/no-project-code states.
- Going backward inside a project loads the same latest code, even if it contains later-step blocks.
- `Reset Level` resets board/runtime state but preserves the shared project code.
- A separate "restart project code" or future version-history action can clear/recover code, but ordinary reset should not.
- Import/export rules should be decided with Plans 07 and 09: if guided import/export is removed, project code still needs a classroom-safe way to avoid accidental irreversible loss, probably through the later version-history packet rather than XML buttons.

## UI And Student-Facing Framing

Project starts need explicit signifiers because the persistence model changes the meaning of a guided level. Students should not discover shared code by accident.

Minimum UI/copy contracts:

- Level picker shows a project badge distinct from challenge badges.
- First project step has a one-time project-start callout near Blockly.
- Every project step has a small persistent indicator: "Shared code across this project" or similar.
- Capstone project levels can show both project and challenge/synthesis status.
- L32 needs a visible state note: the lead ally already has the flag, so the program should react to teammate/carrier state instead of chasing the flag.
- Backtracking should not be framed as "restoring older code"; it should be framed as testing the latest project script on earlier scenarios.

Student-facing language should keep the decentralized model clear:

- "Each ally runs this same program on its own turn."
- "Runner index helps each ally choose its role."
- "The first action reached is the only action that happens this turn."
- "Your script is getting more general, not receiving central commands."

## Testing Implications

Plan 13 is the major risk packet. It should not simply update XML fixtures and call the project done.

Recommended test strategy: **hybrid**.

- Keep isolated per-level reference solutions so each authored level has a small known-good program.
- Add cumulative project acceptance fixtures: one final Strategy Brain program should pass all Strategy Brain steps, and one final Team Strategy Script should pass all Team Strategy Script steps, with caveats for levels that intentionally require distinct starts.
- Add workspace persistence tests in browser coverage after Plan 09: forward navigation, backward navigation, reset preserves code, ordinary guided isolation, and no leakage between project ids.
- Add toolbox/editability tests: every block used by the final project fixture remains available/editable on every step of that project.
- For L37, replace the current two-branch fixture with a role-based solution using runner index at minimum.
- Consider loosening L37's `runnerId` restriction so any ally scoring can satisfy the team capstone, or explicitly decide that ally 0 is the named attacker and encode that in copy.
- L33 and any live-NPC capstone tests should be checked for deterministic behavior or repeated seeded runs if the harness supports it.

Biggest Plan 13 risks:

- cumulative fixtures become brittle if live enemies or turn order produce nondeterminism
- broad toolbox tests may pass while the UI still fails to focus student attention
- per-level win conditions may reward reaching a cell rather than demonstrating the named concept
- L37 can pass with a non-coordinated program unless its board, win condition, or reference fixture is strengthened
- shared latest code may make "previous level" tests fail in ways that are pedagogically acceptable but harness-hostile

## Downstream Packet Contracts

Plans 09-14 should treat these as fixed unless the integration owner overrides them:

- There are exactly two first-pass project ids: `strategy-brain` and `team-strategy-script`.
- `strategy-brain` includes L23-L28; L22 remains a non-project gateway.
- `team-strategy-script` includes L29-L37.
- `full-team-tactics` is the Strategy Brain capstone and remains before Team Strategy Script.
- `advanced-scrimmage` is the Team Strategy Script capstone.
- Project code is shared latest code by project id, including backward navigation.
- Reset level preserves project code.
- Project starts use broad technical toolboxes; UI/copy narrows attention.
- Project metadata belongs in guided level definitions/manifest, not hard-coded only in UI.
- Project workspace storage belongs in Blockly workspace/state infrastructure, not level source.
- Project UI signifiers belong in `src/ui/`, not core rules.
- Source-of-truth decisions should be written to `docs/development/project-sequence-decisions.md` and `docs/development/project-level-map.md` after review comparison.
- Version history is out of scope for the first implementation, but Plan 09 should not make storage choices that block it.

Suggested packet-specific handoff:

- Plan 09: implement metadata and shared latest workspace only; no level redesign.
- Plan 10: implement badges, project-start callout, persistent indicator, and L32 state framing.
- Plan 11: repair L24 and revise L23-L28 copy/toolbox metadata for Strategy Brain.
- Plan 12: revise L29-L37 copy and turn limits/framing for Team Strategy Script; defer merging unless owner chooses compression.
- Plan 13: implement hybrid fixture strategy and cumulative project tests.
- Plan 14: design recovery/version history against the actual project storage key policy.

## Open Questions For The Integration Owner

1. Should `full-team-tactics` be formally approved as the Strategy Brain capstone, with shared code carrying into it?
2. Should L24 repair be a hard blocker before Plan 09/10, or can metadata/UI work proceed while Plan 11 repairs the level before classroom rollout?
3. Should L37 accept any team ally scoring, or remain pinned to ally 0 as the intended attacker?
4. Should L35 and L36 turn limits be loosened before playtest to encourage iteration, or should playtest first measure whether the tight limits are actually frustrating?
5. Should Project B ship in the first classroom trial, or should Project A plus the existing non-project teamplay sequence be the first trial path?
6. Should guided import/export removal from Plan 07 happen before project persistence, or should project persistence include a temporary recovery/export affordance until version history exists?
7. What exact student-facing names do you want? I like "Strategy Brain" and "Team Strategy Script", but the second could be warmer as "Team Playbook" if the owner wants less code-centric language.

## Confidence And Risks

Confidence is high on the two-project membership recommendation because it matches the concept matrix, source organization, and accepted owner direction. Confidence is medium on keeping all L34-L36 steps because the source-level repetition is real; only classroom playtest can tell whether it feels like useful transfer practice or busywork.

The biggest unresolved risk is that project mode changes student psychology. A one-off puzzle can tolerate a minimal pass; a project step has to produce code worth carrying. That makes L24 and L37 disproportionately important. If those two are repaired thoughtfully, the project idea is pedagogically strong: it moves Browser Battlegorithms toward the real long-term goal of students designing local, role-based ally behavior instead of solving isolated Blockly riddles.
