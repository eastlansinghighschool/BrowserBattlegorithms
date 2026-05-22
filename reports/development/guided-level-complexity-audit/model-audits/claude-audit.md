# Guided Level Complexity Audit — Claude

- Packet: Plan 75
- Model/thread: Claude orchestrator (Sonnet 4.7 family), single-pass audit
- Date: 2026-05-21
- Evidence baseline:
  - Plan 73 output reviewed: yes (`summary-index.md` + 46 dossiers, sampled in depth)
  - Plan 74 output reviewed: yes (`behavior-summary-index.md` + 46 behavior evidence files, sampled in depth)
  - Evidence generation date: matches the current Plan 73/74 progress reports; no staleness signals encountered.
- Scope notes:
  - All 46 guided levels included in the worksheet, separated by category in downstream analysis.
  - No-peek rule honored: no other model's audit file was opened (none existed at start).
  - Cohort-safety tags are inferred from `docs/TeacherGuide.md`, prior packet history, and integration-owner notes in this thread. Not based on direct classroom observation.
- Major assumptions:
  - The reference-solution fixture is a reasonable proxy for "what minimal solution students could produce" — meaning a level whose canonical solution is 2 blocks gives most students no opportunity to produce more. This is the same caveat as packet section "do not use block count alone": block count is a *floor* indicator, not a ceiling judgment.
  - For project levels, the meaningful complexity metric is the accumulated shared-script (project final fixture), not the per-step fixture.
  - "Documented exception" in behavior evidence indicates the project-step level's final fixture intentionally doesn't satisfy that step's win condition (capstone shape) — not a defect.

---

## Executive Summary

The pilot feedback is well-founded. The standalone arc (L1–L21) produces solutions averaging ~3.5 blocks and ~0.8 decision points. Challenge 15 demands 10 blocks / 4 decisions / 5 action types. Challenge 22 demands 14 blocks / 6 decisions / 7 action types and the first composition of two resource-readiness checks. That is the cliff students experience.

The Strategy Brain project arc (L23–L28, leading to Challenge 28) is structurally different from how it presents itself: each level is essentially a one-boolean-operator practice exercise that doesn't accumulate into a substantively larger shared script. The final accumulated script is 6 blocks — barely larger than a standalone-arc solution. The "project" framing over-promises building-toward-something experience.

The Team Strategy Script arc (L29–L36, leading to Challenge 37) does accumulate properly. Its final fixture is 25 blocks, 11 distinct types, 10 decision points, with runner-index used 3 times and resource-readiness used twice. That arc is in better shape; uplift opportunities there are about coordination richness rather than accumulation.

Live enemy presence is rare outside challenges. Every standalone teaching level except the freeze intro (L21) has zero acting enemies. Static boards are pedagogically defensible for first exposure to a block, but the lack of moving threats across 20 levels means students never feel time pressure until Challenge 15 — that's a separate axis of the cliff beyond block count.

The single biggest near-term opportunity is the pre-Challenge 22 cluster (L18–L21). These levels are each one-block-in-isolation practice. Layering in one prior skill per level (e.g., teaching `freeze-readiness` while a sensor still matters, or teaching `stay-still` in a context where timing actually pays off) would close most of the pre-22 cliff without disturbing the Plan 47 carrier-collision arc that follows.

The bug-hunt levels (L16, L24, L32, L43) all use the "minor repair" pattern (1–3 block edits). They're functioning as debugging checkpoints, which is fine, but four of them with the same shape is one of the sources of "lots of boring challenges before the spike." Varying the bug *type* across the four would help.

---

## Per-Level Worksheet

| order | level id | category | primary concept | static complexity (blocks / decisions / distinct / runner-index / resource-readiness) | runtime complexity (turns / actions / distinct action types / live enemy / interactions) | cognitive engagement | prior skills currently integrated | prior-skill integration opportunity | risk if uplifted | cohort-safety tag |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | move-to-target | ordinary | Move to target | 2 / 0 / 2 / 0 / 0 | 3 / 3 / 1 / no / none | onboarding/simple by design | none (first level) | none — protect | high (onboarding) | n/a (protect) |
| 2 | reach-enemy-flag | ordinary | Reach enemy flag | 2 / 0 / 2 / 0 / 0 | 1 / 1 / 1 / no / flag pickup | thin/repetitive | move basics | could add a second sensor check before pickup (e.g. one barrier detour step) without breaking the "reach the flag" frame | medium | ship now |
| 3 | score-a-point | ordinary | Score a point | 4 / 1 / 4 / 0 / 0 | 20 / 20 / 2 / no / scored | satisfying small puzzle (full carry-and-return loop) | move basics | fine as-is | high (satisfying first carry loop) | n/a (protect) |
| 4 | barrier-detour | ordinary | Barrier detour | 4 / 1 / 4 / 0 / 0 | 6 / 6 / 2 / no / none | satisfying small puzzle | move basics + first sensor | fine as-is | medium (first sensor lesson) | n/a (protect) |
| 5 | mirror-forward | ordinary | Forward works both ways | 2 / 0 / 2 / 0 / 0 | 3 / 3 / 1 / no / none | onboarding (team-2-perspective lesson) | move basics | fine as-is — concept is "forward depends on which side" and any complexity dilutes that | high (vocabulary-only lesson) | n/a (protect) |
| 6 | prediction-06 | prediction | First move prediction | 2 / 0 / 2 / 0 / 0 | n/a (not runnable) | onboarding (prediction checkpoint) | move basics | predictions are a separate mode; uplift = harder prediction options, not bigger code | low–medium | needs owner decision (prediction redesign) |
| 7 | sensor-barrier-branch | ordinary | Enemy sensor branch | 4 / 1 / 4 / 0 / 0 | 6 / 6 / 2 / no / none | thin/repetitive (essentially L4 with explicit sensor) | move + barrier-sensor (L4) | could add a second condition (e.g. distinguish two sensor types) without breaking the "branching on sensor" essence | medium | ship now |
| 8 | watch-the-wall | ordinary | Watch the wall | 4 / 1 / 4 / 0 / 0 | 5 / 5 / 2 / no / none | satisfying small puzzle | sensor branch (L7) | fine as-is (wall-vs-barrier disambiguation is its own lesson) | medium | n/a (protect) |
| 9 | find-the-human | ordinary | Find the human | 6 / 2 / 5 / 0 / 0 | 7 / 7 / 2 / no / none | satisfying small puzzle (highest pre-Challenge-15 complexity) | sensor + branching + multi-direction | fine as-is | medium | n/a (protect) |
| 10 | find-the-enemy-flag | ordinary | Find the enemy flag | 4 / 1 / 4 / 0 / 0 | 12 / 12 / 2 / no / flag pickup | thin/repetitive (mostly L9 with a different target) | sensor + branching | could require a return path planning step (after pickup), tying in carrying-flag awareness early | medium | ship now |
| 11 | human-runner-practice | ordinary | Human runner practice | 1 / 0 / 1 / 0 / 0 | n/a (human input) | onboarding/simple by design | n/a | controls-practice; uplift = none | high (controls familiarity) | n/a (protect) |
| 12 | move-toward-flag | ordinary | Move Toward flag | 2 / 0 / 2 / 0 / 0 | 13 / 13 / 2 / no / flag pickup | thin/repetitive (shortcut block intro) | none required | fine as-is — concept is "one helper block replaces three" and complication dilutes it | high (shortcut-block lesson) | n/a (protect) |
| 13 | bring-it-home | ordinary | Bring it home | 4 / 1 / 3 / 0 / 0 | 21 / 21 / 3 / no / scored | satisfying small puzzle | move-toward + flag-carrying condition | fine as-is — pivotal "carrier loop" lesson | high | n/a (protect) |
| 14 | enemy-nearby | ordinary | Enemy nearby (distance) | 4 / 1 / 4 / 0 / 0 | 6 / 6 / 2 / no / none | thin/repetitive (same shape as every prior if-else level) | sensor branching | could require *combining* distance with another sensor (the introduced concept is "distance" — pairing with a position sensor would reinforce why distance matters) | low | ship now |
| 15 | jump-the-gap | ordinary | Jump Forward intro | 2 / 0 / 2 / 0 / 0 | 1 / 1 / 1 / no / none | onboarding (one-shot block demo) | none required | demonstrating jump in isolation is the point; uplift would damage essence | high (block intro) | n/a (protect) |
| 16 | bughunt-15 | bug hunt | Trace the flag bug | starter 4 → solution 8 / 3 / 5 / 0 / 0 | 18 / 18 / 2 / no (2 live frozen) / scored | appropriate integration (only bughunt that *adds* blocks rather than repairs) | flag carry + sensor branch | fine as-is — strongest of the four bug hunts | low | n/a (protect) |
| 17 | dodge-and-deliver | challenge | Dodge and Deliver (Challenge 15) | 10 / 4 / 8 / 0 / 0 | 26 / 23 / 5 / yes / pickup, drop, collision, re-pickup | appropriate integration | nearly every L1–L15 skill | n/a — this is the synthesis | n/a | n/a (challenge) |
| 18 | jump-if-ready | ordinary | Jump if ready (resource intro) | 4 / 1 / 4 / 0 / 0 | 4 / 4 / 2 / no / none | thin/repetitive (same shape — guard wraps the new block in if-else) | jump (L14) + resource readiness | could integrate sensor (e.g. jump-if-ready AND wall-detected) rather than jump-if-ready as the only condition | low | ship now |
| 19 | build-the-barrier | ordinary | Build the barrier | 2 / 0 / 2 / 0 / 0 | 1 / 1 / 1 / no / none | onboarding (block intro) | none required | demonstrating barrier in isolation is the point | high (block intro) | n/a (protect) |
| 20 | stay-still-can-do-something | ordinary | Stay Still as deliberate choice | 4 / 1 / 4 / 0 / 0 | 4 / 4 / 2 / no / none | thin/repetitive (single condition wraps STAY_STILL) | sensor + branching | could combine with resource-readiness ("stay still until freeze ready") — would teach why STAY_STILL is more than a no-op | low | ship now |
| 21 | relay-race | ordinary | Relay race (human→ally handoff) | 4 / 1 / 4 / 0 / 0 | n/a (human input) | satisfying small puzzle (handoff is genuinely novel) | flag carry + teammate awareness | fine as-is — pivotal handoff lesson | high | n/a (protect) |
| 22 | my-side-their-side | ordinary | Territory sensors | 4 / 1 / 4 / 0 / 0 | 9 / 9 / 2 / no / none | thin/repetitive (one new sensor wrapped in if-else) | sensor branching | could require a side-aware return decision (after picking up flag, only return when "on enemy side" — combines two sensors with carrier state) | low | ship now |
| 23 | freeze-the-lane | ordinary | Team freeze intro | 4 / 1 / 4 / 0 / 1 | 5 / 5 / 2 / yes (1) / pickup | thin/repetitive (single resource check wraps freeze) | resource readiness + move-toward | could combine with sensor ("freeze only if enemy is nearby and freeze ready") — would actually teach when to use freeze, not just that you can | low | ship now (critical to closing the Challenge 22 gap) |
| 24 | bughunt-22 | bug hunt | Trace the first action | starter 5 → solution 4 / 1 / 4 / 0 / 1 | 1 / 1 / 1 / no / none | thin/repetitive (3rd repair-only bughunt) | resource readiness | fine as-is (essence is "first action wins"; adding stuff would obscure the trace) | low | n/a (consider varying bug type, not size) |
| 25 | show-what-you-know | challenge | Synthesis (Challenge 22) | 14 / 6 / 10 / 0 / 2 | 35 / 29 / 5 / yes (3) / bounces, collision, pickup | appropriate integration | every L1–L22 skill (incl. two resource-readiness checks) | n/a — synthesis | n/a | n/a (challenge) |
| 26 | closest-threat | project step | Closest threat (project entry) | step 2 / 0 / 2 / 0 / 0; final 6 / 2 / 5 / 0 / 0 | 5 turns checkpoint / 16 final / no live | thin/repetitive (project intro is a 2-block "move toward" exercise — barely a step) | move-toward | could require an initial role assignment using runner index (this project introduces multi-ally thinking; starting with index would be appropriate) | medium (sets project tone) | needs owner decision (project arc redesign?) |
| 27 | how-far-away | project step | Distance comparison | step 7 / 2 / 7 / 0 / 0; final 6 | 6 / 18 / 2 / yes (1) / barrier bounces | appropriate integration (introduces value+compare+distance together) | move + sensor + value composition | fine as-is — densest single-step jump in the arc | low | n/a (protect) |
| 28 | two-conditions-at-once | project step | AND composition | step 9 / 3 / 9 / 0 / 1 | 5 / 11 / 2 / yes (1) / pickup | appropriate integration (largest step in arc) | distance + AND + freeze readiness | fine as-is | low | n/a (protect) |
| 29 | this-or-that | project step | OR composition | step 7 / 2 / 7 / 0 / 0 | 7 / 7 / 2 / no / none | thin/repetitive (parallel to L25 with OR instead of AND — no real escalation) | OR + on-enemy-side | could require an `(A AND B) OR C` composition rather than a flat OR | low | ship now (pre-Challenge-28 ramp) |
| 30 | flip-the-answer | project step | NOT composition | step 6 / 2 / 6 / 0 / 0 | 20 / 20 / 2 / no / scored | thin/repetitive (NOT in isolation) | NOT + on-my-side | could require composing NOT with one of the prior boolean ops (e.g., `NOT (A OR B)`) — would prep for the DeMorgan intuition AP CSA needs | low | ship now |
| 31 | prediction-25 | prediction | Boolean prediction checkpoint | 7 / 2 / 6 / 0 / 0 | n/a | onboarding (prediction checkpoint) | boolean ops | uplift = harder prediction options (e.g., predict the *short-circuit* behavior), not bigger code | low–medium | needs owner decision |
| 32 | bughunt-28 | bug hunt | Trace the boolean | starter 9 → solution 9 / 3 / 9 / 0 / 0 | 12 / 12 / 2 / yes (1) / pickup | satisfying small puzzle (good bug; identifies which boolean is wrong) | full boolean toolkit | fine as-is | low | n/a (protect) |
| 33 | full-team-tactics | challenge (project capstone) | Challenge 28 | step 4 / 1 / 3 / 0 / 0; final 6 | n/a (not runnable) | appropriate integration in capstone framing — but the *step* itself is small | full Strategy Brain toolkit + accumulated 6-block script | the capstone could require a substantive synthesis step rather than a 4-block addition (the accumulated final is only 6 blocks total, so the "challenge" feels thin compared to Challenge 22) | medium (capstone shape change) | needs owner decision |
| 34 | one-program-two-allies | project step (TSS entry) | Runner index intro | step 7 / 2 / 7 / 1 / 0; final 25 / 10 / 11 / 3 / 2 | checkpoint 12 / 23 / 3 / no / pickup + bounces | appropriate integration | runner index + value compare | fine as-is | low | n/a (protect) |
| 35 | index-jobs | project step | Index comparison | step 7 / 2 / 7 / 1 / 0 | 9 / 18 / 2 / no / bounces | appropriate integration | index-based role split | fine as-is | low | n/a (protect) |
| 36 | first-two-defend | project step | Index + team logic | step 7 / 2 / 7 / 1 / 0 | 3 / 9 / 2 / no / bounces | appropriate integration | runner index | fine as-is | low | n/a (protect) |
| 37 | escort-the-carrier | project step | teammate-has-flag + index | step 10 / 3 / 9 / 1 / 0 | 3 / 6 / 2 / no / scored | satisfying small puzzle | teammate awareness + role | fine as-is — densest TSS step | low | n/a (protect) |
| 38 | closest-enemy-defender | project step | Closest enemy + role | step 7 / 2 / 6 / 1 / 0 | 10 / 19 / 2 / yes (2) / runner collisions | appropriate integration | distance + role + live enemy | fine as-is — first sustained live-enemy interaction in TSS | low | n/a (protect) |
| 39 | freeze-support | project step | Freeze readiness + role | step 7 / 2 / 7 / 1 / 1 | 5 / 9 / 2 / yes (1) / freeze cooldown observed | appropriate integration | freeze + role + cooldown awareness | fine as-is | low | n/a (protect) |
| 40 | barrier-specialist | project step | Barrier + role | step 9 / 3 / 8 / 1 / 1 | 11 / 21 / 5 / yes (1) / pickup + bounces | appropriate integration (widest action variety in TSS arc) | barrier + role + sensor | fine as-is | low | n/a (protect) |
| 41 | jump-team | project step | Jump role | step 9 / 3 / 9 / 1 / 1 | 3 / 5 / 3 / no / barrier bounces | appropriate integration | jump readiness + role | fine as-is | low | n/a (protect) |
| 42 | prediction-31 | prediction | Runner index prediction | 7 / 2 / 7 / 0 / 0 | n/a | onboarding (prediction checkpoint) | runner index | predictions are separate; uplift = harder prediction options | low–medium | needs owner decision |
| 43 | bughunt-37 | bug hunt | Trace the roles | starter 7 → solution 7 / 2 / 7 / 0 / 0 | 12 / 23 / 3 / no / pickup | thin/repetitive (4th repair-only bughunt, role-based) | runner index + role logic | could vary the bug type — e.g. introduce one bug where the fix requires ADDING a guard, not just repairing index comparison | low | optional/lab only (could be moved or varied) |
| 44 | advanced-scrimmage | challenge (project capstone) | Challenge 37 | step 5 / 1 / 4 / 0 / 0; final 25 | 56 / 56-70 / 1-2 / yes (3) / wall + collision bounces | appropriate integration in capstone framing | accumulated 25-block TSS script + live enemies | the step is small but the accumulated final does the work — this is structurally healthier than Challenge 28 | n/a | n/a (challenge) |
| 45 | optional-random-lab | optional lab | Randomness in action | 2 / 0 / 2 / 0 / 0 | 3 / 3 / 3 / no / none | onboarding (optional concept demo) | move basics | fine as-is (optional concept demo) | low | n/a |
| 46 | optional-double-carrier-showdown | optional lab | Own-flag-home scoring + escort/intercept | 1 / 0 / 1 / 0 / 0 (human-input) | n/a (human input) | satisfying small puzzle (post-Plan-67 rule integration) | every TSS skill | fine as-is | high (recent integration of Plan 67 scoring rule) | n/a |

---

## Challenge-Ramp Analysis

### Challenge 15 (`dodge-and-deliver`)

- **Skills expected:** sensor branching (incl. compound conditions), jump usage (resource readiness optional but useful), four-direction movement, carrier-state branching, dodging live enemies that interrupt the path.
- **Introduced at:** sensor branch L7, jump L14, jump-if-ready L18 (wait — L18 is AFTER Challenge 15 in order); bring-it-home L13; multi-direction movement implicit since L8.
- **Rehearsed in combination at:** essentially nowhere before the challenge. Each precedent level uses one mechanic; no pre-Challenge-15 level combines (carrier state) + (sensor branching) + (jump) in one program.
- **Sudden jump signals:** program complexity 4 → 10 blocks (+150%), decision points 1 → 4 (+300%), distinct action types 2 → 5, **first level with live enemies** outside the bug hunt directly preceding.

**Verdict: abrupt cliff.** The pre-Challenge-15 sequence is structurally a series of one-concept-per-level practices. The challenge demands integration of carrier state + sensor + jump + multi-direction movement under live enemy pressure. The single biggest gap is the **first live-enemy experience** — no static-board level prepared students for moving threats. Bug Hunt 15 immediately before the challenge has 2 live enemies (frozen 999 turns = static props), so the bug hunt doesn't actually prepare for live enemies either.

### Challenge 22 (`show-what-you-know`)

- **Skills expected:** two resource-readiness checks composed (freeze + jump), sensor branching with carrier state, four-direction movement, all under live enemy pressure.
- **Introduced at:** freeze L21 (resource intro), jump-if-ready L18 (resource intro), every other skill before L15.
- **Rehearsed in combination at:** nowhere. L23 has 1 resource check. The challenge wants 2 composed.
- **Sudden jump signals:** program complexity 4 → 14 blocks (+250%), decision points 1 → 6, distinct action types 2 → 5, resource readiness checks 1 → 2.

**Verdict: abrupt cliff, larger than Challenge 15.** The "compose two resource-readiness checks" jump is the specific cognitive load that lands without preparation. Students have used `if-freeze-ready` once and `if-can-jump` once, never both in the same program. Two compounding sources of difficulty here: (a) richer resource composition, (b) the bug hunt 22 immediately before is a *repair* exercise that shrinks code rather than expanding it.

### Challenge 28 (`full-team-tactics`)

- **Skills expected:** the accumulated Strategy Brain script (6 blocks) plus an integration touch (the step fixture adds 4 blocks for the capstone).
- **Introduced at:** boolean ops AND/OR/NOT across L25–L27, distance/value L24, accumulated through the project arc.
- **Rehearsed in combination at:** the project arc is meant to be the rehearsal. But the Strategy Brain final fixture is only 6 blocks total — the per-step fixtures (7, 9, 7, 6 blocks) are individually *larger* than the accumulated final.

**Verdict: structurally different ramp; the cliff isn't program complexity, it's the *fragility* of the accumulated 6-block script under 3 live enemies.** Challenge 28 introduces live enemies on a project that taught no live-enemy interaction prior. Live enemies arrived in L23 (`closest-threat`) only structurally; no preceding Strategy Brain step required reacting to a moving threat. The Strategy Brain accumulated final is also surprisingly small for a capstone — only 6 blocks. The challenge framing implies bigger.

### Challenge 37 (`advanced-scrimmage`)

- **Skills expected:** the accumulated TSS script (25 blocks, 10 decisions, 3 runner-index uses, 2 resource-readiness uses) plus a small capstone step (5 blocks).
- **Introduced at:** all skills across L29–L36.
- **Rehearsed in combination at:** the TSS arc does this well — by L40 (`barrier-specialist`) students have seen 5 distinct action types in a reference solution, role-based logic with index 3 times.

**Verdict: well-ramped.** The TSS arc accumulates honestly. Final is substantial. Challenge 37 is the model for what a project arc should look like — Strategy Brain is not.

---

## Rehearsal-Debt Analysis

| skill | introduced at | next load-bearing use | rehearsal gap | recommended repair type |
| --- | --- | --- | --- | --- |
| Sensor branching (`if_sensor_matches_else`) | L6 (`sensor-barrier-branch`) | Challenge 15 (L17) | ~10 levels with single-sensor use, no compound | add compound sensor at L14 or L20 |
| Jump Forward | L14 (`jump-the-gap`, isolated) | Challenge 15 (L17) | 2 levels (jump-if-ready L18 is *after* the challenge in order; actually fine — Challenge 15 doesn't strictly need jump readiness, just the block) | ok |
| Resource readiness (`if_can_jump_else`) | L16 (`jump-if-ready`) | Challenge 22 (L25) | 6 levels with no resource-readiness use | introduce a "stay still until jump ready" composite at L18 or L20 |
| Resource readiness (`if_area_freeze_ready_else`) | L21 (`freeze-the-lane`) | Challenge 22 (L25) | 3 levels, none use it | uplift L21 itself to require a compound condition (freeze ready AND enemy nearby) |
| Territory sensors (`on-my-side`, `on-enemy-side`) | L20 (`my-side-their-side`) | L26/L29 (project boolean ops) | OK in standalone arc; load-bearing in Strategy Brain | ok |
| Boolean `AND` | L25 (project step 3) | Challenge 28, Challenge 37 | covered within the project arc | ok |
| Boolean `OR` | L26 | Challenge 28, Challenge 37 | covered within the project arc | ok |
| Boolean `NOT` | L27 | Challenge 28, Challenge 37 | covered within the project arc, but NOT is taught in isolation — never composed with AND/OR | add a compound NOT-with-OR exercise to L27 (`flip-the-answer` uplift) |
| Comparison + distance | L24 (project step 2) | L25 (next step), Challenge 28 | OK | ok |
| Runner index | L29 (TSS step 1) | every TSS level after | well rehearsed within TSS | ok |
| `teammate-has-flag` | L32 (`escort-the-carrier`) | Challenge 37, optional double-carrier (L46) | OK | ok |
| Live enemy interaction | Bug Hunt 15 (L16) frozen-only, Challenge 15 (L17) first real | Challenge 15 directly | **no rehearsal at all** — biggest gap | add at least one live-enemy practice level before Challenge 15 (or unfreeze the bughunt-15 enemies for one phase) |
| Own-flag-home scoring (Plan 67) | optional double-carrier L46 only | only in optional lab | acceptable for optional content; if it becomes load-bearing in future levels, would need rehearsal | ok |

**Biggest rehearsal debts:** (1) live enemy interaction before Challenge 15, (2) compound resource-readiness before Challenge 22, (3) compound boolean composition (especially NOT-with-OR) within Strategy Brain.

---

## Project Arc Analysis

### Strategy Brain (L23–L28 → Challenge 28)

**Shared-code accumulation:** the project's final fixture is **6 blocks, 2 decisions, no runner index, no resource readiness, 5 distinct types.** That is structurally indistinguishable from a typical L4-tier ordinary level.

**Step fixtures (the work in each level):** 2 → 7 → 9 → 7 → 6 → 4 blocks. The middle steps (L24, L25) are denser than the final. That suggests the project's "accumulation" is actually a *rotation* — each step exercises a boolean operator in isolation, and the synthesis at Challenge 28 doesn't carry all of them forward.

**Coordination demand:** zero. No runner index in any Strategy Brain step or final. No teammate awareness. The "project" is single-ally throughout. Live enemies appear only in Challenge 28 (3) and incidentally in L24, L25.

**Diagnosis:** the Strategy Brain arc is presented as a project but functions as a sequence of boolean-operator practice exercises. The shared workspace mechanic exists but doesn't carry meaningful state across levels. The capstone is thin because there's not much accumulated to synthesize.

**Recommendations:** either (a) reframe Strategy Brain's branding to make clear it's a boolean-toolkit arc rather than a coordination-building project (low-risk copy work), or (b) introduce one coordination element — e.g., a second ally that needs different logic — somewhere mid-arc to give the shared script something to genuinely accumulate (medium-risk; requires fixture and level redesign). Option (a) is safer for pilots mid-arc; option (b) is the larger learning win.

### Team Strategy Script (L29–L36 → Challenge 37)

**Shared-code accumulation:** final fixture is **25 blocks, 10 decisions, 11 distinct types, runner index 3x, resource readiness 2x.** Substantial. Eight steps of 5–10 blocks each accumulate honestly.

**Coordination demand:** real. Runner index used from L29 onward. `teammate-has-flag` introduced L32 and load-bearing thereafter. Live enemies appear at L33 and L38–L40, and Challenge 37 has 3.

**Diagnosis:** TSS is in good shape and is the curriculum's strongest project demonstration. Action variety is highest at L40 (5 distinct action types in the step fixture, including barrier placement, stay-still, and multi-direction movement). The arc teaches what its name promises.

**Uplift opportunities (small, optional):**
- L29 (`one-program-two-allies`) reference solution uses both `MOVE_DOWN_SCREEN` and `MOVE_FORWARD` but no index-aware differentiation in the basic checkpoint — that lesson lives at L30 (`index-jobs`). L29's step could lean a bit harder on index from the start to make the "one program drives both allies differently" promise more visible in the very first project level.
- The TSS final fixture only uses `MOVE_FORWARD` and `JUMP_FORWARD` in its outermost loop. Most decisions live in early branches. A future optional lab could exercise barrier placement coordination more, but the arc as-is is fine.

---

## Protected-Level List

Levels that should remain at current complexity, with reason:

- **L1 (`move-to-target`)** — onboarding, first event-block + first action.
- **L3 (`score-a-point`)** — first full carrier loop; satisfying as-is.
- **L4 (`barrier-detour`)** — first sensor lesson; satisfying.
- **L5 (`mirror-forward`)** — vocabulary lesson (forward depends on team); any added complexity dilutes the point.
- **L8 (`watch-the-wall`)** — wall-vs-barrier disambiguation; lesson is its own focus.
- **L9 (`find-the-human`)** — highest-complexity standalone-arc level (6 blocks, 2 decisions); already at a good local maximum.
- **L11 (`human-runner-practice`)** — controls familiarization.
- **L12 (`move-toward-flag`)** — shortcut-block lesson; "this one block replaces three" is the essence.
- **L13 (`bring-it-home`)** — pivotal carrier-return lesson.
- **L15 (`jump-the-gap`)** — block-introduction level; demonstration purpose.
- **L16 (`bughunt-15`)** — strongest of the four bug hunts; only one that adds blocks.
- **L19 (`build-the-barrier`)** — block-introduction.
- **L21 (`relay-race`)** — pivotal human→ally handoff lesson (do not uplift the handoff itself; could uplift a *companion* level).
- **L27 (`how-far-away`)** — densest single-step in Strategy Brain (7 blocks, value/compare introduction).
- **L28 (`two-conditions-at-once`)** — largest step in Strategy Brain.
- **L32 (`bughunt-28`)** — boolean-trap bug; satisfying small puzzle.
- **L34–L41 (TSS body)** — arc is structurally healthy.
- **L44 (`advanced-scrimmage`)** — challenge.
- **L17, L25, L33** — all challenge levels (analyzed separately).
- **L46 (`optional-double-carrier-showdown`)** — recently integrated Plan 67 rule; touch only if Plan 67 surfaces a new concern.

---

## Recommendation Clusters

### Cluster 1 — Pre-Challenge 22 cross-skill integration (highest leverage)

- **Affected levels:** L18 (`jump-if-ready`), L20 (`stay-still-can-do-something`), L21 (`freeze-the-lane`), L23 (`freeze-the-lane` — duplicate id check; this is the same level appearing at order 23, not L23 the project level). Also touch L14 (`enemy-nearby` at order 14) and L22 (`my-side-their-side`).
- **Learning goal:** close the Challenge 22 cliff by introducing compound conditions before they become load-bearing. Specifically: require composing one new block with one prior block at each of these levels.
- **Proposed uplift pattern:** each affected level's win condition or reference solution gains one compound condition that pairs the introduced concept with a prior one. Examples: L18 jump-if-ready PLUS sensor on landing cell. L21 freeze PLUS enemy-nearby. L22 territory PLUS carrier state.
- **Likely touched files:** the level source for each, the reference fixture XML, possibly the demo Blockly.
- **Validation needs:** reference fixtures must still solve under the linter. `npm run lint:levels` per Plan 34 contract. New reference solutions for each touched level.
- **Subsystem notes likely affected:** none (curriculum-only).
- **Cohort-safety tag:** **cohort boundary** for L18, L21 (these are pilot-active); **ship now** acceptable for L20, L22.
- **Owner decisions needed:** which prior block to pair with which (the matrix above suggests candidates; owner picks).

### Cluster 2 — Strategy Brain framing or accumulation repair

- **Affected levels:** L26 (`closest-threat`), L33 (`full-team-tactics`).
- **Learning goal:** make Strategy Brain feel like a project rather than five disconnected boolean exercises. Either reframe (option A) or actually accumulate (option B).
- **Proposed uplift pattern:** Option A is copy-only — rebrand the project arc as a "Boolean Toolkit" practice sequence. Option B is structural — give Strategy Brain a second ally so runner-index and teammate-awareness become load-bearing, then the accumulated script genuinely grows.
- **Likely touched files (option A):** lesson copy in L23, L26, L33; project introduction strings; concept matrix row updates; TeacherGuide if it characterizes Strategy Brain as a coordination project.
- **Likely touched files (option B):** every Strategy Brain level source, every step fixture, the final fixture, the toolbox if needed.
- **Cohort-safety tag:** Option A `ship now`; Option B `cohort boundary`.
- **Owner decisions needed:** A or B (the bigger question of this audit).

### Cluster 3 — Live-enemy rehearsal before Challenge 15

- **Affected levels:** L16 (`bughunt-15`), possibly add an L15.5 between Jump the Gap and Bug Hunt 15, or unfreeze one of bughunt-15's enemies for one phase of the level.
- **Learning goal:** introduce live enemy reaction once before the first challenge demands it.
- **Proposed uplift pattern:** the simplest move is to unfreeze one of bughunt-15's two enemies for the final few turns of that level's run, giving students one taste of dodging. Alternative: add a small new optional lab specifically for live-enemy reaction.
- **Likely touched files:** L16 source, the bughunt-15 fixture if needed.
- **Validation needs:** reference solution must still pass; linter must remain green.
- **Cohort-safety tag:** **cohort boundary** (changes a level pilots may have just played).
- **Owner decisions needed:** unfreeze-bughunt-enemy vs new-optional-lab.

### Cluster 4 — Bug-hunt variety

- **Affected levels:** L24 (`bughunt-22`), L32 (`bughunt-28`), L43 (`bughunt-37`).
- **Learning goal:** make the four bug hunts feel structurally different from each other rather than four "find the bad block" exercises.
- **Proposed uplift pattern:** vary bug type across the four. L16 already adds blocks (good). L24 could be a "missing guard" bug where the fix is to ADD a resource-readiness check, not just reorder. L32 could be a "wrong boolean operator" bug (already close to this). L43 could be a "wrong comparison value" bug requiring a value tweak. Each becomes a different reasoning exercise.
- **Likely touched files:** the starter XML for each bughunt; the canonical fixture.
- **Cohort-safety tag:** **cohort boundary** (changes a feature pilots may have engaged with).
- **Owner decisions needed:** which bugs go where; whether to keep all four bug hunts.

### Cluster 5 — Strategy Brain boolean composition uplift

- **Affected levels:** L26 (`this-or-that`), L27 (`flip-the-answer`).
- **Learning goal:** practice composing boolean operators with each other before Challenge 28 expects students to do it under pressure.
- **Proposed uplift pattern:** L26 reference solution requires `(A AND B) OR C` rather than a flat OR. L27 reference requires `NOT (A OR B)` rather than NOT in isolation. Both within the project's existing block budget.
- **Likely touched files:** L26 and L27 sources, both step fixtures, possibly the project final fixture.
- **Validation needs:** new fixtures; linter green.
- **Cohort-safety tag:** **cohort boundary** if Strategy Brain pilots are mid-arc; otherwise `ship now`.
- **Owner decisions needed:** whether to layer this on top of Cluster 2 or replace it.

### Cluster 6 — Optional-lab additions for live enemy + own-flag-home

- **Affected:** new optional lab(s), no existing levels touched.
- **Learning goal:** create cohort-safe practice surface for skills the existing campaign under-rehearses (live enemy reaction, own-flag-home scoring in non-human contexts).
- **Proposed uplift pattern:** one new optional lab between L14 and L16 for live-enemy reaction; one new optional lab after L46 for own-flag-home scoring in code-controlled-ally context (currently L46 requires human input).
- **Likely touched files:** new level source files, new fixture files, manifest, possibly concept matrix.
- **Cohort-safety tag:** **optional/lab only** — these are additive and don't affect the main campaign.
- **Owner decisions needed:** whether to add new levels at all (a packet decision held back since Plan 54).

---

## Prioritized Implementation Candidates

Ranked by learning benefit × ramp-smoothing × AP CSA transfer × low blast radius × low pilot risk:

| id | recommendation | cluster | benefit | risk | cohort-safety |
| --- | --- | --- | --- | --- | --- |
| CLAUDE-A | Uplift L21 (`freeze-the-lane`) reference to require freeze-ready AND enemy-nearby compound condition | 1 | high (closes the largest single Challenge 22 gap) | low | cohort boundary |
| CLAUDE-B | Uplift L18 (`jump-if-ready`) reference to require jump-if-ready paired with a sensor (e.g. wall-detected) | 1 | high | low | cohort boundary |
| CLAUDE-C | Decide Strategy Brain reframing: rebrand as "Boolean Toolkit" (copy-only, ship-now) OR commit to second-ally restructure (cohort-boundary) | 2 | high (sets the entire project's pedagogy honesty) | medium (copy) / high (restructure) | needs owner decision |
| CLAUDE-D | Unfreeze one bughunt-15 enemy for last N turns, giving students first live-enemy experience before Challenge 15 | 3 | high (closes the live-enemy gap) | low | cohort boundary |
| CLAUDE-E | Uplift L22 (`my-side-their-side`) to require territory sensor compounded with carrier state | 1 | medium-high | low | ship now |
| CLAUDE-F | Uplift L27 (`flip-the-answer`) to require `NOT (A OR B)` composition | 5 | medium-high (DeMorgan prep for AP CSA) | low | cohort boundary |
| CLAUDE-G | Uplift L20 (`stay-still-can-do-something`) to require STAY_STILL gated by resource readiness | 1 | medium | low | ship now |
| CLAUDE-H | Vary bug type across L24, L32, L43 (Cluster 4) | 4 | medium | low | cohort boundary |
| CLAUDE-I | Uplift L14 (`enemy-nearby`) to require distance compounded with position sensor | 1 | medium | low | ship now |
| CLAUDE-J | Uplift L26 (`this-or-that`) to require `(A AND B) OR C` composition | 5 | medium | low | cohort boundary |
| CLAUDE-K | Strengthen L29 (`one-program-two-allies`) reference to use index from the first level of TSS | tss-touchup | low-medium (makes the project promise visible earlier) | low | cohort boundary |
| CLAUDE-L | Consider new optional lab between L14 and L16 for live-enemy reaction (alternative to CLAUDE-D) | 6 | medium | low (additive) | optional/lab only |

**Open owner decisions preserved:**
- Strategy Brain framing (Cluster 2 / CLAUDE-C) is the single biggest decision and should be made before downstream Strategy Brain uplifts.
- Pilot cohort boundary timing: cluster 1 has 4–5 cohort-boundary items concentrated in the L18–L23 range. If a pilot cohort is currently in or past that range, all of cluster 1 should hold.
- Whether Plan 75 follow-ups can include new optional labs at all (per Plan 54 history, the policy was "no new mandatory levels mid-arc"; optional labs may have a different threshold).

---

## Comparison Summary

- **Top 5 recommendations:**
  1. CLAUDE-A (L21 compound freeze condition)
  2. CLAUDE-B (L18 compound jump-ready condition)
  3. CLAUDE-D (live-enemy rehearsal before Challenge 15)
  4. CLAUDE-C (Strategy Brain framing decision)
  5. CLAUDE-F (NOT composition at L27)
- **Top 5 protected levels:**
  1. L1 (`move-to-target`) — onboarding
  2. L3 (`score-a-point`) — pivotal first carrier loop
  3. L12 (`move-toward-flag`) — shortcut-block essence
  4. L13 (`bring-it-home`) — carrier-return lesson
  5. L21 (`relay-race`) — human→ally handoff
- **Biggest challenge-ramp concern:** Challenge 22's two-resource-readiness composition. No prior level composes two resource checks. The cliff is in compound readiness more than in raw block count.
- **Biggest rehearsal-debt concern:** zero live-enemy reaction practice before Challenge 15. Twenty pre-challenge levels, all static-enemy boards (or frozen-999 bug hunt props), then a challenge with two live enemies.
- **Recommendation I am least confident about:** CLAUDE-C (Strategy Brain reframing) — the choice between copy reframing and structural restructure is genuinely difficult and the evidence here doesn't settle it. Pilot signal is needed to decide whether students currently experience Strategy Brain as a project that's underdelivering or as a boolean-toolkit arc that's fine. I'm guessing it's the latter, but it's a guess.
- **One place where another model might reasonably disagree** *(speculative — written without reading any other model audit, per the packet's no-peek rule)*: Codex may rate the Strategy Brain arc's structural problem as smaller than I have, since the per-step block counts (7–9) are individually respectable and the linter passes. My weight on "the accumulated final is only 6 blocks" reflects a project-shape judgment that's not visible from any single level's evidence — a reviewer focused on level-by-level evidence might reasonably conclude the arc is fine.

---

## Stop Conditions Assessment

No stop conditions triggered:
- Plan 73 and 74 outputs were complete and consistent.
- Generated evidence did not contradict source files (spot-checked a half-dozen dossiers against the summary index — all matched).
- No recommendation in this audit requires changing the guided concept sequence; all uplifts respect the existing concept matrix row for the level they touch.
- No recommendation requires renumbering or adding mandatory new levels; the only new-level recommendation is for optional labs (Cluster 6 / CLAUDE-L) and is explicitly flagged as needing owner decision.
- Another model's audit file (`codex-audit.md`) was not present at the time this audit was written; if present later, this report should not be edited to react to it.
