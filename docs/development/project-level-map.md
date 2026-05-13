# Guided Project Level Map

Date: 2026-05-12  
Status: authoritative Plan 08 level map  
Companion: `docs/development/project-sequence-decisions.md`

## Project Map Summary

| Project id | Student-facing name | Levels | Capstone | Toolbox unlock group |
| --- | --- | --- | --- | --- |
| `strategy-brain` | Strategy Brain | L23-L28 | L28 `full-team-tactics` | Strategy Brain broad single-ally advanced toolbox |
| `team-strategy-script` | Team Strategy Script | L29-L37 | L37 `advanced-scrimmage` | `ADVANCED_CAPSTONE_BLOCKS` |

L22 `show-what-you-know` remains a standalone gateway challenge before Strategy Brain.

## Strategy Brain Level Map

| Current level id/title | Proposed project id | Proposed project step | Final title | Final level kind | Focus | Toolbox unlock group | Keep/merge/condense/defer decision | Required follow-up packet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L22 `show-what-you-know` / Challenge 22 | none | none | Challenge 22: Show What You Know | challenge / gateway | Pre-advanced synthesis before the advanced project | existing non-project challenge toolbox | Keep outside project | Plan 03 for challenge badge; no project mutation |
| L23 `closest-threat` / Level 23: Closest Threat | `strategy-brain` | 1 | Level 23: Closest Threat | project-start | Start the shared Strategy Brain program; target closest enemy | Strategy Brain broad single-ally advanced toolbox | Keep; revise copy for project start | Plan 09 metadata; Plan 10 UI; Plan 11 curriculum copy/toolbox |
| L24 `how-far-away` / Level 24: How Far Away? | `strategy-brain` | 2 | Level 24: How Far Away? | project-step | Distance as a numeric value and comparison | Strategy Brain broad single-ally advanced toolbox | Keep but redesign board/setup so distance comparison is load-bearing | Plan 11 hard repair; Plan 13 fixture/test repair |
| L25 `two-conditions-at-once` / Level 25: Two Conditions At Once | `strategy-brain` | 3 | Level 25: Two Conditions At Once | project-step | `AND`; combine a tactical condition with resource readiness | Strategy Brain broad single-ally advanced toolbox | Keep | Plan 11 copy/toolbox alignment; Plan 13 fixtures |
| L26 `this-or-that` / Level 26: This Or That | `strategy-brain` | 4 | Level 26: This Or That | project-step | `OR`; respond to either of two warnings | Strategy Brain broad single-ally advanced toolbox | Keep separate from L27 | Plan 11 copy/toolbox alignment; Plan 13 fixtures |
| L27 `flip-the-answer` / Level 27: Flip The Answer | `strategy-brain` | 5 | Level 27: Flip The Answer | project-step | `NOT`; invert a boolean condition | Strategy Brain broad single-ally advanced toolbox | Keep separate from L26 | Plan 11 copy/toolbox alignment; Plan 13 fixtures |
| L28 `full-team-tactics` / Challenge 28: Full Team Tactics | `strategy-brain` | 6 | Challenge 28: Full Team Tactics | project-capstone / challenge | Use the evolved Strategy Brain in a solo scoring challenge | Strategy Brain capstone-compatible toolbox | Keep as capstone; revise from old-toolbox bridge into true advanced-logic payoff | Plan 10 dual project/challenge UI; Plan 11 capstone revision; Plan 13 fixture/test repair |

## Team Strategy Script Level Map

| Current level id/title | Proposed project id | Proposed project step | Final title | Final level kind | Focus | Toolbox unlock group | Keep/merge/condense/defer decision | Required follow-up packet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L29 `one-program-two-allies` / Level 29: One Program, Two Allies | `team-strategy-script` | 1 | Level 29: One Program, Two Allies | project-start | Introduce one shared program executed by multiple allies | `ADVANCED_CAPSTONE_BLOCKS` | Keep; revise copy for project start and shared-code model | Plan 09 metadata; Plan 10 UI; Plan 12 curriculum copy/toolbox |
| L30 `index-jobs` / Level 30: Index Jobs | `team-strategy-script` | 2 | Level 30: Index Jobs | project-step | Use runner index comparison for role assignment | `ADVANCED_CAPSTONE_BLOCKS` | Keep | Plan 12 copy/toolbox alignment; Plan 13 fixtures |
| L31 `first-two-defend` / Level 31: First Two Defend | `team-strategy-script` | 3 | Level 31: First Two Defend | project-step | Use index ranges to group allies | `ADVANCED_CAPSTONE_BLOCKS` | Keep | Plan 12 copy/toolbox alignment; Plan 13 fixtures |
| L32 `escort-the-carrier` / Level 32: Escort The Carrier | `team-strategy-script` | 4 | Level 32: Escort The Carrier | project-step | React to teammate/carrier state | `ADVANCED_CAPSTONE_BLOCKS` | Keep; add persistent state framing for lead ally starting with flag | Plan 10 UI note; Plan 12 copy/setup review; Plan 13 fixtures |
| L33 `closest-enemy-defender` / Level 33: Closest Enemy Defender | `team-strategy-script` | 5 | Level 33: Closest Enemy Defender | project-step | Split attack/defense behavior with live enemies | `ADVANCED_CAPSTONE_BLOCKS` | Keep; check deterministic test behavior | Plan 12 copy/setup review; Plan 13 test stability |
| L34 `freeze-support` / Level 34: Freeze Support | `team-strategy-script` | 6 | Level 34: Freeze Support | project-step | Add a freeze specialist role | `ADVANCED_CAPSTONE_BLOCKS` | Keep as separate specialist step | Plan 12 copy/setup review; Plan 13 fixtures |
| L35 `barrier-specialist` / Level 35: Barrier Specialist | `team-strategy-script` | 7 | Level 35: Barrier Specialist | project-step | Add a barrier specialist role | `ADVANCED_CAPSTONE_BLOCKS` | Keep as separate specialist step; consider 10-12 turn limit | Plan 12 turn-limit/setup review; Plan 13 fixtures |
| L36 `jump-team` / Level 36: Jump Team | `team-strategy-script` | 8 | Level 36: Jump Team | project-step | Add jump/path role assignment | `ADVANCED_CAPSTONE_BLOCKS` | Keep as separate specialist step; consider 10-12 turn limit | Plan 12 turn-limit/setup review; Plan 13 fixtures |
| L37 `advanced-scrimmage` / Level 37: Advanced Scrimmage | `team-strategy-script` | 9 | Challenge 37: Advanced Scrimmage | project-capstone / challenge | Use the evolved team script in a live scrimmage | `ADVANCED_CAPSTONE_BLOCKS` | Keep as capstone; replace thin reference solution; prefer any-ally team scoring | Plan 10 dual project/challenge UI; Plan 12 capstone revision; Plan 13 fixture/test repair |

## Notes For Implementation Agents

- Do not change level ids unless a later packet explicitly authorizes it.
- Do not merge or remove levels in the first project implementation.
- Use project metadata in level definitions and manifest output; do not hard-code project membership only in UI.
- Broad toolbox availability does not mean broad student attention. Lesson copy, hints, and UI should spotlight the current reasoning move.
- Plan 13 should treat the maps above as the expected project membership when building fixtures and tests.
