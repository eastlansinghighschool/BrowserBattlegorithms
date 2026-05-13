# Plan 08 Independent Recommendations: gemini

## Executive Recommendation

I recommend proceeding with the two-project arc (Strategy Brain and Team Strategy Script) as they form cohesive pedagogical units that guide students from single-ally advanced logic to multi-ally coordination. Project starts should adopt broad toolboxes to safely support backward navigation under a shared-code model. The highest priority blocking issues are the pedagogical repair of Level 24 and replacing the trivial capstone reference solution for Level 37 before downstream packets begin.

## Audit Check

The audit report accurately characterizes the `advanced-logic/` and `advanced-teamplay/` phases. It correctly identifies the core tension of shared-code projects: balancing the step-by-step introduction of concepts with the necessity of a broad toolbox to prevent backward navigation from breaking evolved student code. The risks regarding reference solutions (`advanced-scrimmage.xml`), fragile test states (L33, L35), and pinned `runnerId` win conditions are legitimate architectural concerns that must be addressed to ensure a stable classroom experience.

## Proposed Project A: Strategy Brain

| Current level | Keep/merge/condense/defer | Proposed project step | Focus | Notes |
| --- | --- | --- | --- | --- |
| L22 `show-what-you-know` | Keep | Pre-Project Gateway | Synthesis | Gate before project start; not part of shared code. |
| L23 `closest-threat` | Keep | Step 1 | `MOVE_TOWARD CLOSEST_ENEMY` | Project start. |
| L24 `how-far-away` | Keep (Redesign) | Step 2 | Distance numeric value | Redesign board so distance comparison is load-bearing. |
| L25 `two-conditions-at-once`| Keep | Step 3 | `AND` | |
| L26 `this-or-that` | Keep | Step 4 | `OR` | |
| L27 `flip-the-answer` | Keep | Step 5 | `NOT` | |
| L28 `full-team-tactics` | Keep | Step 6 (Capstone) | Synthesis | Open scrimmage to cap the single-ally logic project. |

## Proposed Project B: Team Strategy Script

| Current level | Keep/merge/condense/defer | Proposed project step | Focus | Notes |
| --- | --- | --- | --- | --- |
| L29 `one-program-two-allies`| Keep | Step 1 | Shared program; index 0/1 | Project start. |
| L30 `index-jobs` | Keep | Step 2 | Index comparison | |
| L31 `first-two-defend` | Keep | Step 3 | Index range | 3-ally setup. |
| L32 `escort-the-carrier` | Keep | Step 4 | Teammate-has-flag + index | |
| L33 `closest-enemy-defender`| Keep | Step 5 | Attacker/defender split | Live enemies. |
| L34 `freeze-support` | Keep (Flag for playtest) | Step 6 | Freeze specialist | Consider condensing with L35 if playtests show fatigue. |
| L35 `barrier-specialist` | Keep (Flag for playtest) | Step 7 | Barrier specialist | |
| L36 `jump-team` | Keep (Flag for playtest) | Step 8 | Jump role assignment | |
| L37 `advanced-scrimmage` | Keep | Step 9 (Capstone) | Synthesis | 3-ally capstone; needs new reference solution. |

## Toolbox And Persistence Contracts

- **Toolboxes:** Project A starts with `ADVANCED_ALL_BLOCKS + AREA_FREEZE_BLOCKS + MOVE_TOWARD_BLOCKS + EXTENDED_MOVEMENT_BLOCKS`. Project B starts with `ADVANCED_CAPSTONE_BLOCKS` (everything). Toolboxes must be broad at project start so evolved code containing later blocks doesn't break or visually disappear when a student navigates backward to an earlier project step.
- **Persistence:** Inside a project, all levels share a single "latest code" workspace. Backtracking loads this unified code.
- **Reset:** The "Reset Level" function must only reset the board state, leaving the shared project code completely intact.

## UI And Student-Facing Framing

- The UI must clearly indicate when a student enters a project (e.g., via badges, a "Project Workspace" callout, or distinct color coding).
- Since toolboxes are technically broad from the start, UI highlighting or tutorial callouts should visually focus student attention on newly introduced blocks for that specific level to avoid overwhelming them.
- When navigating backward (e.g., from L33 to L32), a persistent notice should remind students they are editing their shared project code. Specific edge cases (like L32's flag-already-carried setup) should be surfaced via tooltips or overlays to prevent confusion.

## Testing Implications

- **Testing Strategy:** Plan 13 must decide on a cumulative vs. isolated testing strategy. The ideal is cumulative testing, verifying that a single evolved script can pass the entire project arc. If that's too heavy, isolated testing is acceptable but fixtures must accurately represent expected student logic.
- **L37 Reference Solution:** The `advanced-scrimmage.xml` test fixture must be rewritten to utilize runner index role assignments. A minimal 2-branch heuristic defeats the purpose of the capstone test.
- **Win Condition Pinning:** Relying on a specific `runnerId` (usually ally 0) to score limits student creativity. The capstone win conditions should be relaxed to allow any valid ally to score.
- **Fragility & Limits:** L33 needs seeded NPC turn-order for test determinism. L35 and L36 may need slightly increased turn limits (e.g., 10-12) to allow iteration room for evolving student scripts.

## Downstream Packet Contracts

- Plans 09-14 must treat the two-project structure, broad toolboxes at project start, and shared latest code semantics as fixed, immutable contracts.
- Plan 11 will handle Project A implementation, incorporating the L24 board redesign.
- Plan 12 will handle Project B implementation.
- Plan 13 will handle the reference solution repairs, the new L37 solution, and the test harness updates based on the chosen testing strategy.

## Open Questions For The Integration Owner

1. **L24 Redesign:** Should the L24 board repair block the launch of Project 1, or can it be staged as a fast-follow?
2. **Testing Strategy (Plan 13):** Should we build a cumulative project test harness, or maintain isolated per-level test fixtures?
3. **Capstone Constraints:** Do you approve relaxing the `runnerId` win conditions on L37 to allow any ally to score, supporting creative solutions?
4. **L34-L36 Condensation:** Do you want to launch with 9 steps in Project B and rely on Plan 06 playtesting to decide on condensing, or preemptively combine L34 and L35 into a "resource specialist" level now?
5. **Gateway Framing:** Should Challenge 22 (`show-what-you-know`) remain a standard challenge level, or be framed as a UI-enforced gate that must be passed before Project 1 unlocks?

## Confidence And Risks

- **Confidence:** High. The proposed structure strongly supports the AP CSA learning objectives and guides students effectively from sequential logic to decentralized ally coordination.
- **Risks:** The largest pedagogical risk is students carrying trivial solutions through early steps (like L24) and hitting a wall later. The primary architectural risk lies in the test harness: if reference solutions remain overly narrow, the automated tests will fail to validate the complex, multi-ally logic students will actually write.
