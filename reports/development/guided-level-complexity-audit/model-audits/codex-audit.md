# Guided Level Complexity Audit — Codex

- Packet: Plan 75
- Model/thread: Codex orchestration audit
- Date: 2026-05-21
- Evidence baseline:
  - Plan 73 output reviewed: yes
  - Plan 74 output reviewed: yes
  - Evidence generation date or commit, if known: Plan 73/74 reports dated 2026-05-21; Plan 74 repair pass completed 2026-05-21
- Scope notes: scan-only; no source, level, fixture, generated-evidence, or other-model audit files edited
- Major assumptions: block counts are evidence, not verdicts; project levels are judged by shared-code and coordination burden; `ship now` / `cohort boundary` tags are inferred from documented pilot state in `docs/TeacherGuide.md`, prior packet history, and integration-owner notes, not direct classroom observation.

## Executive Read

The main issue is not that every guided level is too easy. The issue is that the campaign often teaches a new block in isolation, then waits until a challenge or project capstone before asking students to combine that block with prior reasoning under pressure. The first two challenge ramps are the sharpest: Challenge 15 jumps from several 2-4 block single-skill levels into a live-enemy 10-block synthesis, and Challenge 22 jumps from mostly one-branch resource/territory levels into a 14-block live scrimmage.

My recommendation is a small number of cluster packets, not a broad rewrite. Keep onboarding and some satisfying tiny puzzles protected. Add selective "old skill plus new skill" rehearsal in the pre-Challenge 15 and pre-Challenge 22 standalone arcs, then tune project arcs around explicit preservation/adaptation of shared code rather than merely adding more blocks.

## 1. Per-Level Worksheet

| primary concept | category | static program complexity from Plan 73 | runtime/reference behavior complexity from Plan 74 | cognitive engagement level | prior-skill integration currently present | prior-skill integration opportunity, if any | risk if uplifted | cohort-safety tag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 `move-to-target`: Move to target | ordinary | 2 blocks, 2 types, 0 decisions | pass; 3 turns; 3 actions; movement only | onboarding/simple by design | none; first contact with `On Each Turn` and one action | fine as-is | damaging first success and one-action clarity | ship now |
| 2 `reach-enemy-flag`: Reach enemy flag | ordinary | 2 blocks, 2 types, 0 decisions | pass; 1 turn; flag pickup | onboarding/simple by design | Level 1 board vocabulary | fine as-is | too early to add branch/load | ship now |
| 3 `score-a-point`: Score a point | ordinary | 4 blocks, 4 types, 1 decision | pass; 20 turns; pickup + score | appropriate integration | flag possession plus forward/backward movement | optionally ask students to predict branch swap, not board redesign | could obscure first scoring model | ship now |
| 4 `barrier-detour`: Barrier detour | ordinary | 4 blocks, 4 types, 1 decision | pass; 6 turns; detour movement | satisfying small puzzle | first named branch plus movement | fine as-is, maybe later used as template | adding live pressure would blur branch intro | ship now |
| 5 `mirror-forward`: Forward works both ways | ordinary | 2 blocks, 2 types, 0 decisions | pass; 3 turns; movement only | satisfying small puzzle | orientation after movement basics | fine as-is | the point is the small surprise | ship now |
| 6 `prediction-06`: First move prediction | prediction | 2 blocks, 2 types, 0 decisions | not run by design | appropriate integration | trace habit after relative movement | fine as-is | prediction should stay low-load | ship now |
| 7 `sensor-barrier-branch`: Enemy sensor branch | ordinary | 4 blocks, 4 types, 1 decision | pass; 6 turns; two movement types | appropriate integration | conditional branch shape from Level 4 | add a mild orientation or wall fallback only if ramp work needs it | overloading first generic sensor | cohort boundary |
| 8 `watch-the-wall`: Watch the wall | ordinary | 4 blocks, 4 types, 1 decision | pass; 5 turns; wall response | satisfying small puzzle | generic sensor reused on terrain | fine as-is; use in later rehearsal rather than uplift | wall surprise may become mechanical | ship now |
| 9 `find-the-human`: Find the human | ordinary | 6 blocks, 5 types, 2 decisions | pass; 7 turns; directional movement | appropriate integration | directional sensing plus earlier branch form | preserve; this is already richer than neighbors | adding more may make support-square goal opaque | ship now |
| 10 `find-the-enemy-flag`: Find the enemy flag | ordinary | 4 blocks, 4 types, 1 decision | pass; 12 turns; flag pickup | thin/repetitive | same sensor structure on flag target | combine flag sensing with simple flag-phase or wall/side fallback | modest risk to concept focus | cohort boundary |
| 11 `human-runner-practice`: Human runner practice | ordinary | 1 starter/reference block, 0 decisions | not run; live human input | onboarding/simple by design | controls practice | fine as-is | not an AI-program complexity level | ship now |
| 12 `move-toward-flag`: Move Toward flag | ordinary | 2 blocks, 2 types, 0 decisions | pass; 13 turns; helper movement | thin/repetitive | helper target after manual flag sensing | require a branch that uses helper only after an existing state check | may undermine "shortcut block" clarity | cohort boundary |
| 13 `bring-it-home`: Bring it home | ordinary | 4 blocks, 3 types, 1 decision | pass; 21 turns; pickup + score | appropriate integration | helper target plus flag possession | fine as-is or later add a minor wall detour variant | helper target swap can get hidden if crowded | ship now |
| 14 `enemy-nearby`: Enemy nearby | ordinary | 4 blocks, 4 types, 1 decision | pass; 6 turns; distance-sensing movement | thin/repetitive | generic sensor idea plus distance | combine distance with choose-wait-or-route around an enemy before Challenge 15 | can make distance intro feel punitive | cohort boundary |
| 15 `jump-the-gap`: Jump the gap | ordinary | 2 blocks, 2 types, 0 decisions | pass; 1 action; jump only | thin/repetitive | movement basics only | add a low-risk post-jump movement or branch variant elsewhere, not necessarily here | pure jump intro is satisfyingly direct | ship now |
| 16 `bughunt-15`: Trace the flag bug | bug hunt | 8 blocks, 5 types, 3 decisions | pass; 18 actions; live enemies act | appropriate integration | flag phase, branch order, challenge rehearsal | protect as first real pre-challenge trace | increasing may defeat bug-hunt confidence | ship now |
| 17 `dodge-and-deliver`: Dodge and Deliver | challenge/synthesis | 10 blocks, 8 types, 4 decisions | pass; 26 turns; live enemies, collision, flag drop | appropriate integration | Levels 1-14 synthesis | no direct uplift; smooth the ramp before it | challenge identity depends on spike, but spike is currently too abrupt | needs owner decision |
| 18 `jump-if-ready`: Jump if ready | ordinary | 4 blocks, 4 types, 1 decision | pass; 4 turns; jump + move | appropriate integration | jump action plus readiness check | fine as-is | adding resource contention too early may blur readiness | ship now |
| 19 `build-the-barrier`: Build the barrier | ordinary | 2 blocks, 2 types, 0 decisions | pass; 1 action; barrier placement only | thin/repetitive | barrier idea from Level 4 only | require readiness check or barrier placement followed by movement in a later companion | pure one-action win teaches too little resource timing | cohort boundary |
| 20 `stay-still-can-do-something`: Stay Still Can Do Something | ordinary | 4 blocks, 4 types, 1 decision | pass; 4 turns; stay still + move | satisfying small puzzle | barrier sensing and barrier removal | protect; this is a good small surprise | extra complexity hides the stay-still lesson | ship now |
| 21 `relay-race`: Relay race | ordinary | 4 blocks, 4 types, 1 decision | not run; human input required | appropriate integration | teammate flag state plus scoring support | use as model for a non-human rehearsal of teammate state later | human-input dependence makes automated evidence thin | needs owner decision |
| 22 `my-side-their-side`: My Side, Their Side | ordinary | 4 blocks, 4 types, 1 decision | pass; 9 turns; territory condition | thin/repetitive | board orientation and movement | combine territory with flag state or enemy proximity before Challenge 22 | side vocabulary can be fragile | cohort boundary |
| 23 `freeze-the-lane`: Freeze the lane | ordinary | 4 blocks, 4 types, 1 decision | pass; 5 turns; freeze + enemy acts | appropriate integration | resource readiness plus live enemy | fine as intro; later add freeze cooldown/choice rehearsal | too much pressure may make freeze feel magical | ship now |
| 24 `bughunt-22`: First Action Matters | bug hunt | 4 blocks, 4 types, 1 decision | pass; 1 action; barrier placement | thin/repetitive | first-action contract and barrier readiness | strengthen bug by preserving two plausible actions but requiring order reasoning | currently a very small pre-Challenge 22 bridge | cohort boundary |
| 25 `show-what-you-know`: Show What You Know | challenge/synthesis | 14 blocks, 10 types, 6 decisions | pass; 35 turns; live enemies, freeze, collisions | appropriate integration | Levels 1-21 synthesis | no direct uplift; add resource/territory rehearsal before it | direct edits risk challenge balance | needs owner decision |
| 26 `closest-threat`: Closest threat | project step | step 2 blocks; final 6 blocks | documented exception; checkpoint/final run evidence available | onboarding/simple by design | project-start helper target | protect as project-start persistence onboarding | adding logic at project start can hide shared-code contract | ship now |
| 27 `how-far-away`: How Far Away? | project step | step 7 blocks, 2 decisions; final 6 | documented exception; live enemy/barrier bounce evidence | appropriate integration | distance from Level 13 plus comparison | make preservation/adaptation of previous closest-threat code explicit | project persistence confusion | cohort boundary |
| 28 `two-conditions-at-once`: Two Conditions At Once | project step | step 9 blocks, 3 decisions; final 6 | documented exception; freeze/action evidence | appropriate integration | comparison plus `AND` | strong as-is; maybe add clearer old-skill naming in tutorial later | `AND` intro already high-load | ship now |
| 29 `this-or-that`: This Or That | project step | step 7 blocks, 2 decisions; final 6 | pass; checkpoint/final 7 actions | appropriate integration | boolean value blocks plus `OR` | fine as-is | OR semantics can get muddied by extra state | ship now |
| 30 `flip-the-answer`: Flip The Answer | project step | step 6 blocks, 2 decisions; final 6 | documented exception; score in final run | appropriate integration | boolean expression plus `NOT` | fine as-is; could connect to prior `AND`/`OR` in copy | NOT is cognitively slippery | ship now |
| 31 `prediction-25`: Two Truths | prediction | 7 blocks, 6 types, 2 decisions | not run by design | appropriate integration | boolean trace after Strategy Brain operators | fine as-is | prediction should stay trace-focused | ship now |
| 32 `bughunt-28`: Boolean Trap | bug hunt | 9 blocks, 9 types, 3 decisions | pass; 12 turns; freeze + live enemy | appropriate integration | boolean gate, freeze timing | protect; good capstone rehearsal | uplift could blur bug diagnosis | ship now |
| 33 `full-team-tactics`: Full Team Tactics | project capstone | step 4 blocks, final 6; broad toolbox | not applicable; live human input required | overloaded/confusing risk | Strategy Brain synthesis under live defenders | owner review: decide whether capstone needs an analyzable reference/demo or an extra rehearsal level | hard to judge without classroom observation/runtime evidence | needs owner decision |
| 34 `one-program-two-allies`: One program, two allies | project step | step 7 blocks, 2 decisions; final 25 | documented exception; two allies, 23/40 actions | appropriate integration | project-start shared program plus multiple allies | preserve; this is the Team Strategy Script onboarding | extra roles too early may obscure shared-program model | ship now |
| 35 `index-jobs`: Index jobs | project step | step 7 blocks, 2 decisions; final 25 | documented exception; out-of-bounds evidence | appropriate integration | runner index after shared program | fine as-is, but add stronger "role split" reflection downstream | early index comparison is already load-bearing | ship now |
| 36 `first-two-defend`: First two defend | project step | step 7 blocks, 2 decisions; final 25 | documented exception; collisions/barriers in final evidence | thin/repetitive | runner-index grouping | combine index grouping with enemy/flag state so defense is conditional, not just positional | raises complexity before escort | cohort boundary |
| 37 `escort-the-carrier`: Escort The Carrier | project step | step 10 blocks, 3 decisions; final 25 | documented exception; scoring evidence | appropriate integration | teammate-has-flag plus index | protect as first carrier-role integration | too much enemy pressure could hide escort idea | ship now |
| 38 `closest-enemy-defender`: Closest enemy defender | project step | step 7 blocks, 2 decisions; final 25 | documented exception; live enemies/collisions | appropriate integration | closest enemy plus index role | add a branch that distinguishes carrier threat vs generic closest enemy later | moderate risk to role clarity | cohort boundary |
| 39 `freeze-support`: Freeze support | project step | step 7 blocks, 2 decisions; final 25 | pass; freeze cooldown unavailable events observed | appropriate integration | index role plus freeze readiness | good candidate to require resource check before repeated freeze attempts | could become noisy if cooldown feedback dominates | cohort boundary |
| 40 `barrier-specialist`: Barrier specialist | project step | step 9 blocks, 3 decisions; final 25 | documented exception; barrier/action mix | appropriate integration | index role plus barrier readiness | use as packet anchor for richer support-role local rules | barrier placement can create brittle pathing | cohort boundary |
| 41 `jump-team`: Jump team | project step | step 9 blocks, 3 decisions; final 25 | documented exception; jump and barrier bounces | appropriate integration | index role plus jump resource | fine as late resource-role rehearsal | extra constraints may make final ramp harder | ship now |
| 42 `prediction-31`: Role Split | prediction | 7 blocks, 7 types, 2 decisions | not run by design | appropriate integration | runner index trace | protect | prediction before final bug hunt should stay focused | ship now |
| 43 `bughunt-37`: Role Split | bug hunt | 7 blocks, 7 types, 2 decisions | pass; 23 actions; flag pickup | appropriate integration | runner-index branch split | protect, or modestly align with any role-uplift packet | too much change can break final review value | ship now |
| 44 `advanced-scrimmage`: Advanced scrimmage | project capstone | step 5 blocks, final 25; wall map | documented exception; 56 turns, 70 actions, live enemies | appropriate integration | Team Strategy Script synthesis | no direct source change until after project-uplift decisions | capstone is already long/high-load | needs owner decision |
| 45 `optional-random-lab`: Move Randomly | optional lab | 2 blocks, 2 types, 0 decisions | pass; 3 turns; random movement types | onboarding/simple by design | movement basics in optional sandbox | fine as-is | optional novelty lab, not ramp repair | optional/lab only |
| 46 `optional-double-carrier-showdown`: Double Carrier Showdown | optional lab | 1 starter block; broad toolbox | not run; live human input required; live enemies present | overloaded/confusing risk | own-flag-home, escort, intercept, runner index | keep as optional or split into a future optional prep lab | high complexity and human-control dependence | optional/lab only |

## 2. Challenge-Ramp Analysis

| challenge inflection | skills expected by challenge | introduced where | rehearsed in combination | sudden jump |
| --- | --- | --- | --- | --- |
| Challenge 15: Dodge and Deliver | movement, flag phase, branch order, sensing, jump, live enemy avoidance | L1-L14; bughunt-15 | L8 and bughunt-15 are the strongest combined rehearsals | abrupt: L14 is a 2-block one-action jump, then bughunt-15 helps, but challenge jumps to 10 blocks, 4 decisions, live enemies, collision/flag drop |
| Challenge 22: Show What You Know | jump readiness, barrier readiness/removal, teammate state, territory, freeze, first-action ordering, live scrimmage | L16-L21 plus bughunt-22 | L18, L21, and bughunt-22 combine pieces, but mostly one branch at a time | abrupt: several preceding levels are 2-4 blocks/one decision; challenge requires 14 blocks, 6 decisions, live enemies, freeze, collisions |
| Challenge 28: Full Team Tactics | Strategy Brain boolean logic, comparison, AND/OR/NOT, closest threat, freeze timing, live defenders | L23-L27, prediction-25, bughunt-28 | L25-L27 and bughunt-28 provide the best reasoning ramp | uneven: boolean ramp is decent, but capstone has no runnable behavior evidence due to live human input, so its real difficulty is under-instrumented |
| Challenge 37: Advanced Scrimmage | shared program, runner index roles, teammate flag state, closest enemy, freeze/barrier/jump support, wall map | L29-L36, prediction-31, bughunt-37 | L32-L36 rehearse roles; final fixture is 25 blocks and runtime is long | smoother than earlier ramps but long: the final scrimmage has 56 turns and 70 actions, so debugging burden may exceed prior per-level rehearsal |

Challenge 15 feels like the first visible cliff. The small isolated lessons are valuable, but the immediate predecessor `jump-the-gap` is especially thin, so students can perceive the challenge as a different game rather than a synthesis of familiar moves.

Challenge 22 has the biggest standalone rehearsal debt. Students meet useful resource blocks, but several are solved by a single obvious action or one guard. The challenge asks for resource timing plus live-enemy prediction, which is a qualitatively different load.

Challenge 28 is less about block-count cliff and more about evidence opacity. The Strategy Brain project arc introduces boolean logic reasonably, but the capstone is not runnable in the generated evidence, so a human audit should be cautious before deciding whether it is too hard or merely under-measured.

Challenge 37 has the best ramp conceptually because Team Strategy Script repeatedly uses runner index and shared code. The risk is endurance/debugging: the capstone runtime is long, and some mid-arc role lessons could require more conditional role adaptation instead of simple index splits.

## 3. Rehearsal-Debt Analysis

| skill | introduced at | next load-bearing use | rehearsal gap | recommended repair type |
| --- | --- | --- | --- | --- |
| Jump action vs jump readiness | L14, L16 | Challenge 15 and later Team Strategy Script | L14 is one action; L16 is one guard; limited synthesis before live pressure | add one pre-Challenge 15/22 rehearsal where jump is a choice, not only the answer |
| Barrier placement readiness | L17 | bughunt-22 and Challenge 22 | L17 is one action; bughunt-22 is only one runtime action | uplift L17 or bughunt-22 so readiness/order matters across turns |
| Territory/side checks | L20 | Challenge 22 and later optional own-flag play | one ordinary level before synthesis | add territory + flag/enemy state combination |
| Teammate flag state | L19 | L32 and optional double-carrier | relay is human-input and not runnable by Plan 74 | add non-human or clearer evidence-backed teammate-state rehearsal |
| Resource timing / Area Freeze cooldown | L21 | Challenge 22, bughunt-28, freeze-support | freeze intro succeeds quickly; cooldown/resource-unavailable appears mainly later | add explicit "save vs spend" or cooldown-safe support role |
| Boolean AND/OR/NOT | L25-L27 | bughunt-28 and Challenge 28 | rehearsal is compact but coherent | no broad repair; protect, maybe enrich project copy with plain-English conditions |
| Comparison | L24 | L25+ and Strategy Brain capstone | comparison immediately feeds boolean operators | acceptable, but L24 should make preservation of prior code explicit |
| Runner index | L29-L31 | L32-L37 | good repeated exposure, but early roles are mostly positional | add one conditional role split where index combines with board state |
| Shared project code | L23 and L29 | all project levels | students may not notice persistence; final fixtures reveal more code than step fixtures | add project-start/preservation prompts or a small "keep old branch, add new branch" check |
| Own-flag-home scoring pressure | optional lab only after Plan 67 | optional double-carrier showdown and Free Play | guided mandatory path does not rehearse it | keep optional unless owner wants post-campaign Free Play bridge |

## 4. Project Arc Analysis

### Strategy Brain (`strategy-brain`, L23-L28)

This arc is pedagogically sound: closest threat, distance, comparison, `AND`, `OR`, and `NOT` are the right AP CSA bridge sequence. The evidence shows a compact final fixture (6 blocks) and several documented exceptions, so this project is less about accumulating a large program and more about refining a small decision rule.

The opportunity is to make preservation/adaptation more explicit. L23 is rightly simple as project onboarding, but L24-L27 should repeatedly communicate: "keep the previous strategic idea, then add one sharper condition." If students treat each step as a fresh micro-puzzle, Challenge 28 can feel like a sudden demand for strategic continuity even if the block count is not high.

I would not broaden the toolbox differently; Plan 08's broad-project-toolbox decision should stand. I would consider one future packet that reviews L24-L27 lesson copy, goals, and fixtures for whether the prior branch remains visibly load-bearing.

### Team Strategy Script (`team-strategy-script`, L29-L37)

This arc has the stronger accumulation story: final fixture complexity is 25 blocks from L29 onward, and behavior evidence shows multiple allies acting over long runs. The first levels appropriately teach shared program and runner index, then later levels add carrier escort, closest enemy, freeze, barrier, and jump roles.

The risk is that index roles can become static job labels: runner 0 attacks, runner 1 waits, first two defend. The long-term learning goal wants decentralized local rules. The best uplift here is not "more blocks" but "role + local state": a defender changes behavior if the carrier is threatened; a support runner freezes only when the carrier is close enough; a barrier specialist places only when a teammate's route needs it.

The strongest candidates are `first-two-defend`, `closest-enemy-defender`, `freeze-support`, and `barrier-specialist`. `escort-the-carrier` should be protected because it is the first clean carrier-role concept. `advanced-scrimmage` should wait for owner review because it is already long and has documented fixture exceptions.

## 5. Protected-Level List

| level | reason to protect |
| --- | --- |
| L1 `move-to-target` | first success, `On Each Turn`, one-action model |
| L2 `reach-enemy-flag` | flag vocabulary and backward movement with minimal load |
| L3 `score-a-point` | first scoring model; already has one branch |
| L4 `barrier-detour` | satisfying first conditional detour |
| L5 `mirror-forward` | small orientation surprise; memorable because it is simple |
| `prediction-06` | prediction habit should remain low-load |
| L8 `find-the-human` | already has two decisions and support-square reasoning |
| L10 `human-runner-practice` | controls practice, not AI complexity |
| L18 `stay-still-can-do-something` | satisfying small surprise around a non-move action |
| L21 `freeze-the-lane` | clean Area Freeze introduction with live enemy |
| `bughunt-15`, `bughunt-28`, `prediction-25`, `prediction-31`, `bughunt-37` | trace/debugging checkpoints already carry review value |
| L23 `closest-threat` and L29 `one-program-two-allies` | project-start onboarding and shared-code contract |
| L32 `escort-the-carrier` | first carrier-role integration in Team Strategy Script |
| Optional Lab `move-randomly` | optional novelty sandbox, not ramp repair |

## 6. Recommendation Clusters

### Cluster 1: Early Standalone Cross-Skill Integration

- Affected levels: L9 `find-the-enemy-flag`, L11 `move-toward-flag`, L13 `enemy-nearby`, possibly L14 `jump-the-gap`
- Learning goal: make students combine new sensing/helper/jump ideas with existing movement/flag-state reasoning before Challenge 15
- Proposed uplift pattern: add one prior-skill branch or board constraint per selected level; preserve primary concept
- Likely touched files: guided level source files, reference fixtures, lesson copy, maybe demos
- Validation needs: `npm run lint:levels`, focused reference-solution run, generated dossier/evidence refresh, targeted browser smoke for changed levels
- Subsystem notes likely affected: `blockly-workspace.md` only if toolbox/demo semantics change; `turn-engine.md` if win/failure semantics change
- Cohort-safety tag: cohort boundary
- Owner decisions needed: choose whether to edit in place or add optional variants

### Cluster 2: Pre-Challenge 22 Resource And Territory Rehearsal

- Affected levels: L17 `build-the-barrier`, L20 `my-side-their-side`, L22 bug hunt, possibly L19 `relay-race`
- Learning goal: reduce the jump from one-branch resource lessons to Challenge 22's live scrimmage
- Proposed uplift pattern: require readiness plus state check, or territory plus flag/enemy condition
- Likely touched files: level source, fixtures, tutorial copy, concept matrix if focus wording changes
- Validation needs: linter, reference solution, behavior evidence, Playwright guided smoke if human-input relay changes
- Subsystem notes likely affected: `turn-engine.md` if resource or human-input semantics are touched; probably avoid that
- Cohort-safety tag: cohort boundary
- Owner decisions needed: whether `relay-race` should remain human-control special or gain a non-human evidence-backed companion

### Cluster 3: Strategy Brain Preservation/Adaptation Pass

- Affected levels: L24-L27 and Challenge 28 framing
- Learning goal: make shared-code persistence and "add one condition to the existing strategy" legible
- Proposed uplift pattern: revise lesson goals/copy and possibly level boards so prior branch remains useful
- Likely touched files: project level source, tutorial copy, fixtures, Teacher Facilitation Kit
- Validation needs: project fixture runs, linter, dossier/evidence refresh
- Subsystem notes likely affected: `blockly-workspace.md` only if project persistence behavior changes; avoid behavior changes
- Cohort-safety tag: needs owner decision
- Owner decisions needed: whether Challenge 28's human-input capstone needs a separate analyzable reference artifact

### Cluster 4: Team Strategy Script Local-Rule Coordination

- Affected levels: L31, L33-L35, possibly L36
- Learning goal: shift role logic from static index jobs toward index plus local board state
- Proposed uplift pattern: require a support runner to check carrier/threat/resource state before acting
- Likely touched files: advanced-teamplay level source, project fixtures, tutorial copy
- Validation needs: project fixture runs, behavior evidence, browser smoke for final arc
- Subsystem notes likely affected: `blockly-workspace.md` if toolbox policy changes; should not change
- Cohort-safety tag: cohort boundary
- Owner decisions needed: how much to change mid-project without disrupting pilot students

### Cluster 5: Bug-Hunt And Prediction Calibration

- Affected levels: bughunt-22 primarily; optionally prediction checkpoints if copy overpromises complexity
- Learning goal: make pre-challenge trace tasks match the complexity students are about to face
- Proposed uplift pattern: strengthen starter bug plausibility and require branch/order reasoning, not just one obvious action
- Likely touched files: bug-hunt level source/starter XML, reference fixture, lesson copy
- Validation needs: linter, reference solution, manual review for non-spoiler bug design
- Subsystem notes likely affected: `blockly-workspace.md` if ignored-block behavior is relied on; likely no note change
- Cohort-safety tag: cohort boundary
- Owner decisions needed: whether bug hunts should become harder or remain confidence checks

### Cluster 6: Optional/Post-Campaign Own-Flag Pressure

- Affected levels: Optional Double Carrier Showdown; possible new optional prep lab
- Learning goal: bridge guided campaign to Free Play carrier-intercept/own-flag-home strategy
- Proposed uplift pattern: keep optional, add a smaller pre-lab or clearer staged goals
- Likely touched files: optional level source, optional fixture/copy, StudentGuide/TeacherGuide optional notes
- Validation needs: manual/browser because live human input dominates
- Subsystem notes likely affected: `turn-engine.md` only if scoring explanation changes; avoid rule changes
- Cohort-safety tag: optional/lab only
- Owner decisions needed: whether this belongs in guided path or remains extension

## 7. Prioritized Implementation Candidates

| id | opportunity | affected levels | why this ranks here | cohort-safety tag | validation cost | owner review needed |
| --- | --- | --- | --- | --- | --- | --- |
| CODEX-A | Pre-Challenge 22 resource/territory rehearsal packet | L17, L20, bughunt-22 | biggest visible ramp into a 14-block live challenge; high AP CSA value around readiness + conditions | cohort boundary | medium | yes |
| CODEX-B | Pre-Challenge 15 cross-skill integration packet | L9, L11, L13, possibly L14 | smooths the first major cliff without touching the challenge itself | cohort boundary | medium | yes |
| CODEX-C | Team Strategy Script local-rule coordination packet | L31, L33-L35 | directly supports decentralized ally coordination, the long-term learning goal | cohort boundary | high | yes |
| CODEX-D | Strategy Brain preservation/adaptation review packet | L24-L27, Challenge 28 framing | improves project learning without necessarily increasing block count | needs owner decision | medium | yes |
| CODEX-E | Bughunt-22 calibration packet | bughunt-22 | small blast radius; strengthens first-action reasoning before Challenge 22 | cohort boundary | low-medium | yes |
| CODEX-F | Freeze/resource cooldown support-role packet | L21, L34 | turns resource checks from "use when ready" into timing strategy | cohort boundary | medium | yes |
| CODEX-G | Runner-index plus board-state role packet | L31-L33 | AP CSA transfer: comparisons plus conditional role methods | cohort boundary | medium-high | yes |
| CODEX-H | Challenge 28 evidence/framing decision packet | full-team-tactics | resolves uncertainty caused by not-applicable runtime evidence | needs owner decision | low if report-only, high if source | yes |
| CODEX-I | Optional double-carrier prep lab packet | optional-double-carrier-showdown | builds own-flag-home strategy without disturbing main path | optional/lab only | medium-high | yes |
| CODEX-J | Protected-level annotation pass | L1-L5, prediction checkpoints, project starts | prevents future agents from "uplifting" intentional simplicity | ship now | low | light owner review |

## Open Owner Decisions

- Should uplift happen in-place, or should any harder variants become optional labs to avoid disturbing pilot students mid-arc?
- Should Challenge 28 gain a runnable non-human evidence fixture or remain explicitly human-input and judged manually?
- Should bug hunts be confidence-building checkpoints or closer-to-challenge complexity rehearsals?
- Is own-flag-home scoring pressure intended to remain optional/Free Play, or should a late guided non-optional level rehearse it?

## Comparison Summary

- Top 5 recommendations: CODEX-A, CODEX-B, CODEX-C, CODEX-D, CODEX-E.
- Top 5 protected levels: L1 `move-to-target`, L5 `mirror-forward`, L18 `stay-still-can-do-something`, L23 `closest-threat`, L29 `one-program-two-allies`.
- Biggest challenge-ramp concern: Challenge 22, because resource/territory lessons remain mostly one-branch before a 14-block, 6-decision live scrimmage.
- Biggest rehearsal-debt concern: resource readiness/timing and territory checks before they are expected in synthesis play.
- Least confident recommendation: CODEX-H, because Challenge 28 lacks runnable behavior evidence and needs human judgment before design conclusions.
- Guess, without reading other models' audits: another model might reasonably disagree with protecting `freeze-the-lane`; it may see the quick 5-turn freeze intro as an obvious uplift target rather than a clean first exposure.
