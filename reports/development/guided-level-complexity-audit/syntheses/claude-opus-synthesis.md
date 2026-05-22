# Guided Level Complexity Audit Synthesis — Claude Opus

- Packet: Plan 76
- Model/thread: Claude Opus 4.7 orchestration thread (distinct from the Sonnet 4.7 family thread that authored `claude-audit.md`)
- Date: 2026-05-21
- Source audits reviewed:
  - Codex audit: yes (`reports/development/guided-level-complexity-audit/model-audits/codex-audit.md`)
  - Claude audit: yes (`reports/development/guided-level-complexity-audit/model-audits/claude-audit.md`)
- Evidence consulted beyond source audits: none for synthesis; Plan 73/74 summary indexes were available for factual settlement but no factual disagreement required reaching past the source audits.
- Scope notes:
  - No other Plan 76 synthesis file was opened (none existed at start).
  - Plan 75 source audits were not edited.
  - No new recommendations were introduced; every comparison row maps to a recommendation already present in one or both source audits.
  - Level identifiers are quoted by level-id (e.g. `freeze-the-lane`) because the two source audits sometimes use concept-matrix numbering and sometimes dossier-order numbering. The id is the unambiguous join key.
- Major assumptions:
  - "Silence" in one audit on a topic the other raises means `unique-to-<model>`, not implicit disagreement.
  - When both audits discuss the same area but recommend opposite directions (protect vs uplift), the row is `divergent`, even if the underlying concept matrix row is unchanged.
  - Synthesizer interpretation that goes beyond comparing the two audits is tagged `synthesizer judgment`.

---

## 1. Recommendation Comparison Table

| topic | Codex position (id + summary) | Claude position (id + summary) | agreement bucket | source references | synthesizer note (factual only) |
| --- | --- | --- | --- | --- | --- |
| Pre-Challenge 22 resource/territory rehearsal | CODEX-A: stand up a packet uplifting `build-the-barrier`, `my-side-their-side`, `bughunt-22` so readiness + state are rehearsed before the live scrimmage. | CLAUDE-A (freeze-the-lane compound), CLAUDE-B (jump-if-ready compound), CLAUDE-E (my-side-their-side + carrier state), CLAUDE-G (stay-still + readiness): treat the pre-22 cluster as the single highest-leverage uplift. | unanimous | Codex §6 Cluster 2, §7 CODEX-A; Claude §"Recommendation Clusters" Cluster 1, §"Prioritized Implementation Candidates" A/B/E/G | Both audits anchor their #1 priority here. They pick partially different levels: Codex centers on `build-the-barrier`/`my-side-their-side`/`bughunt-22`; Claude centers on `freeze-the-lane`/`jump-if-ready` and also names `my-side-their-side` and `stay-still-can-do-something`. The shared level is `my-side-their-side`. |
| Pre-Challenge 15 cross-skill rehearsal | CODEX-B: standalone cross-skill packet across `find-the-enemy-flag`, `move-toward-flag`, `enemy-nearby`, possibly `jump-the-gap` to smooth the first cliff. | Claude does not propose a standalone cross-skill cluster for pre-15; CLAUDE-I (enemy-nearby + position sensor) and CLAUDE-D (live-enemy unfreeze) are the closest neighbors but address different cuts. | divergent | Codex §6 Cluster 1, §7 CODEX-B; Claude CLAUDE-D, CLAUDE-I, §"Challenge-Ramp Analysis" Challenge 15 | Both audits identify Challenge 15 as a cliff. They prescribe different smoothing strategies: Codex broadens the prior arc; Claude narrows the gap to a single missing rehearsal axis (live enemies). |
| Live-enemy rehearsal before Challenge 15 | Codex does not raise live-enemy rehearsal as a distinct gap; the rehearsal-debt table omits the skill. | CLAUDE-D: unfreeze one `bughunt-15` enemy for the final phase (or add an optional lab) so students experience a moving threat once before Challenge 15. CLAUDE-L: alternative new optional lab between L14 and L16. | unique-to-Claude | Claude §"Challenge-Ramp Analysis" Challenge 15, §"Rehearsal-Debt Analysis" "Live enemy interaction" row, CLAUDE-D, CLAUDE-L | Claude calls this "the single biggest gap." Codex's worksheet notes Challenge 15 is abrupt but attributes the cliff to block-count and decision-count growth, not live-enemy novelty. |
| `enemy-nearby` distance + sensor composition | Codex §6 Cluster 1: combine distance with choose-wait-or-route around an enemy before Challenge 15. | CLAUDE-I: require distance compounded with a position sensor. | unanimous | Codex Cluster 1 / CODEX-B; Claude CLAUDE-I | Both want a compound condition layered on the distance lesson. Direction matches. |
| `my-side-their-side` territory + carrier-state composition | Codex Cluster 2: combine territory with flag state or enemy proximity. | CLAUDE-E: require territory sensor compounded with carrier state. | unanimous | Codex Cluster 2; Claude CLAUDE-E | Identical direction. |
| `find-the-enemy-flag` cross-skill uplift | Codex worksheet row 10: "combine flag sensing with simple flag-phase or wall/side fallback." | Claude worksheet row 10: "could require a return path planning step (after pickup), tying in carrying-flag awareness early." | unanimous | Codex worksheet row 10; Claude worksheet row 10 | Both want a flag-state / return-phase pairing added. Specific pairings differ. |
| `move-toward-flag` shortcut-block protection vs uplift | Codex worksheet row 12: thin/repetitive; "require a branch that uses helper only after an existing state check." | Claude worksheet row 12 and §"Protected-Level List": protect; "shortcut-block lesson; complication dilutes the point." | divergent | Codex worksheet row 12; Claude worksheet row 12, protected-level list | Direct disagreement on whether the shortcut-block lesson should be wrapped in a condition. |
| `build-the-barrier` resource intro protection vs uplift | Codex worksheet row 19 + CODEX-A: cohort-boundary uplift; "require readiness check or barrier placement followed by movement in a later companion." | Claude worksheet row 19 and §"Protected-Level List": protect as block-introduction. | divergent | Codex worksheet row 19, CODEX-A; Claude worksheet row 19, protected-level list | Direct disagreement on whether the block-introduction frame is sacrosanct. |
| `stay-still-can-do-something` protection vs uplift | Codex worksheet row 20 and §"Protected-Level List": protect as "good small surprise." | CLAUDE-G: uplift to gate STAY_STILL on resource readiness. | divergent | Codex worksheet row 20, protected-level list; Claude CLAUDE-G | Direct disagreement. Codex preserves the surprise; Claude wants the lesson tied to timing. |
| `freeze-the-lane` protection vs uplift | Codex worksheet row 23 and §"Protected-Level List": protect as "clean Area Freeze introduction with live enemy." | CLAUDE-A: uplift to require freeze-ready AND enemy-nearby compound condition. | divergent | Codex worksheet row 23, protected-level list; Claude CLAUDE-A | Direct disagreement. Codex sees clean intro; Claude treats this as the single largest single-level lever to close Challenge 22. Codex flagged in §"Comparison Summary" that other models might disagree here. |
| `jump-if-ready` resource intro | Codex worksheet row 18: "fine as-is; adding resource contention too early may blur readiness." | CLAUDE-B: uplift to require jump-if-ready paired with a sensor (e.g. wall-detected). | divergent | Codex worksheet row 18; Claude CLAUDE-B | Direct disagreement on whether resource intro should stay isolated. |
| `bughunt-22` uplift | CODEX-E: bughunt-22 calibration packet — strengthen plausibility, require branch/order reasoning. | Claude worksheet row 24 + CLAUDE-H Cluster 4: fine as-is for this individual hunt, but vary the bug type across the three repair-only bughunts. | divergent on direction within bughunt-22 specifically | Codex CODEX-E, Cluster 5; Claude worksheet row 24, CLAUDE-H | Both audits target the bughunt surface area but disagree on which bughunt to touch and how. |
| Bug-hunt type variety across the four hunts | Codex does not propose varying the type across the four bughunts. | CLAUDE-H Cluster 4: vary bug type across `bughunt-22`, `bughunt-28`, `bughunt-37` so the four hunts feel structurally different. | unique-to-Claude | Claude Cluster 4, CLAUDE-H | Codex §"Open Owner Decisions" does pose the meta question "Should bug hunts be confidence-building checkpoints or closer-to-challenge complexity rehearsals?" — adjacent but not the same proposal. |
| Strategy Brain project-arc framing | CODEX-D + Cluster 3: lesson-copy + framing pass on L24–L27 so prior branch remains visibly load-bearing; do not change toolbox. | CLAUDE-C + Cluster 2: pick (A) rebrand to "Boolean Toolkit" (copy-only) OR (B) add a second ally so the shared script accumulates substantively. | divergent on diagnosis severity | Codex CODEX-D, Cluster 3, §"Project Arc Analysis" Strategy Brain; Claude CLAUDE-C, Cluster 2, §"Project Arc Analysis" Strategy Brain | Both audits agree Strategy Brain has a project-shape issue. Codex's prescription is bounded copy-and-framing. Claude opens a larger fork including possible structural restructure. |
| Strategy Brain boolean composition (NOT / AND / OR) uplift | Codex worksheet rows 29/30: fine as-is; could connect to prior AND/OR in copy. | CLAUDE-F: `flip-the-answer` → `NOT (A OR B)`. CLAUDE-J: `this-or-that` → `(A AND B) OR C`. | divergent | Codex worksheet rows 29, 30; Claude CLAUDE-F, CLAUDE-J, Cluster 5 | Codex: copy-only. Claude: change reference solutions to compound boolean shapes for DeMorgan / short-circuit prep. |
| `how-far-away` preservation vs protection | Codex worksheet row 27: "L24 should make preservation of prior code explicit" (copy-uplift). | Claude protected-level list: protect as densest single-step in Strategy Brain. | divergent | Codex worksheet row 27, Cluster 3; Claude protected-level list, worksheet row 27 | Codex wants copy-level changes; Claude wants no change. |
| Challenge 28 (`full-team-tactics`) treatment | CODEX-H: evidence/framing decision packet; cap question is whether to add a runnable non-human reference fixture. | Claude CLAUDE-C addresses Challenge 28 only indirectly, via the Strategy Brain project decision. Claude worksheet row 33 flags the capstone step as small relative to challenge framing. | divergent framing | Codex CODEX-H, §"Open Owner Decisions"; Claude worksheet row 33, CLAUDE-C | Both audits surface a Challenge 28 concern but bring different evidence. Codex centers on the not-applicable runtime evidence boundary; Claude centers on accumulated-script fragility under three live enemies. These are compatible diagnoses but produce different packet shapes. |
| Team Strategy Script local-rule coordination uplift | CODEX-C + Cluster 4: substantive packet on `first-two-defend`, `closest-enemy-defender`, `freeze-support`, `barrier-specialist` to push index roles toward index-plus-state. CODEX-G (runner-index plus board-state for `first-two-defend`, `closest-enemy-defender`). | Claude §"Project Arc Analysis" Team Strategy Script: arc is in good shape; uplift opportunities are "small, optional"; explicit "fine as-is" on those same levels. | divergent | Codex CODEX-C, CODEX-G, Cluster 4, §"Project Arc Analysis" Team Strategy Script; Claude §"Project Arc Analysis" Team Strategy Script, worksheet rows 36–41 | Largest divergence on a multi-level project. Codex sees the four named TSS levels as the strongest concrete uplift slate. Claude protects them. Both agree TSS is healthier than Strategy Brain. |
| `one-program-two-allies` strengthening | Codex worksheet row 34 and protected-level list: protect as project-start shared-program onboarding. | CLAUDE-K: lean harder on runner index from the first level of TSS. | divergent | Codex worksheet row 34, protected-level list; Claude CLAUDE-K | Direct disagreement on whether the TSS opening is sacrosanct or under-promised. |
| Freeze/resource cooldown support-role packet | CODEX-F: standalone packet on `freeze-the-lane` + `freeze-support` to make save-vs-spend timing legible. | Claude folds the freeze portion into CLAUDE-A (single-level uplift) and treats `freeze-support` as protected. | divergent on scope | Codex CODEX-F, §"Rehearsal-Debt Analysis"; Claude CLAUDE-A, worksheet row 39, protected-level list | Codex makes cooldown timing its own arc; Claude treats it as a one-level fix. |
| Optional double-carrier prep / own-flag-home bridge | CODEX-I: optional double-carrier prep lab packet. | Claude Cluster 6: optional lab(s) for live-enemy rehearsal and for own-flag-home in a code-controlled-ally context (so it does not require human input). | unanimous | Codex CODEX-I, Cluster 6; Claude Cluster 6, CLAUDE-L | Both endorse additive optional labs. Specific lab counts/scopes differ. |
| Relay-race human-input gap | Codex worksheet row 21 + Cluster 2 + §"Open Owner Decisions": flag as needs-owner-decision; consider non-human evidence-backed teammate-state companion. | Claude worksheet row 21 + §"Protected-Level List": protect as pivotal handoff. | divergent | Codex worksheet row 21, Cluster 2, open owner decisions; Claude worksheet row 21, protected-level list | Direct disagreement on whether the human-input dependence is a teaching feature or an evidence/rehearsal hole. |
| Prediction-checkpoint design | Codex protects all three prediction checkpoints. | Claude worksheet rows 6, 31, 42: "needs owner decision (prediction redesign)" — open question on whether predictions should get harder options (e.g. short-circuit behavior). | divergent on whether to open a design question at all | Codex worksheet rows 6, 31, 42, protected-level list; Claude worksheet rows 6, 31, 42 | Claude treats prediction redesign as a live question; Codex closes the question by protection. |
| Protected-level annotation pass | CODEX-J: annotation pass over protected levels to prevent future agents from uplifting intentional simplicity. | Claude does not propose a protected-level annotation packet. | unique-to-Codex | Codex CODEX-J; Claude (silent) | Adjacent in spirit to Plan 34's level-authoring contract linter; the synthesizer notes (factual) that no equivalent packet is currently in flight. |
| `bughunt-37` placement | Codex worksheet row 43 + protected-level list: protect, "or modestly align with any role-uplift packet." | Claude worksheet row 43: "optional/lab only (could be moved or varied)"; also part of CLAUDE-H bug-variety cluster. | divergent | Codex worksheet row 43, protected-level list; Claude worksheet row 43, CLAUDE-H | Direct disagreement on whether the final bughunt's structural placement is fixed. |

---

## 2. Protected-Level Comparison Table

| level (or level group) | Codex protection rationale | Claude protection rationale | agreement bucket | source references | synthesizer note (factual only) |
| --- | --- | --- | --- | --- | --- |
| `move-to-target` (L1) | First success, `On Each Turn`, one-action model. | Onboarding, first event-block + first action. | unanimous | Codex §5; Claude §"Protected-Level List" | Identical reasoning. |
| `reach-enemy-flag` (L2) | "Flag vocabulary and backward movement with minimal load." | Not in Claude's protected list; Claude worksheet row 2 flags as `thin/repetitive` and suggests adding a barrier-detour step before pickup. | divergent | Codex §5; Claude worksheet row 2 | Codex protects; Claude wants uplift. |
| `score-a-point` (L3) | Worksheet "ship now / could obscure first scoring model"; named in protected-level list. | Protected; "first full carrier loop." | unanimous | Codex §5, worksheet row 3; Claude §"Protected-Level List" | Identical conclusion. |
| `barrier-detour` (L4) | Protected as satisfying first conditional detour. | Protected; first sensor lesson. | unanimous | Codex §5; Claude §"Protected-Level List" | Identical conclusion. |
| `mirror-forward` (L5) | Protected; "small orientation surprise; memorable because it is simple." | Protected; vocabulary-only lesson. | unanimous | Codex §5; Claude §"Protected-Level List" | Identical conclusion. |
| `prediction-06` | Protected; prediction habit should remain low-load. | Worksheet row 6 tags `needs owner decision (prediction redesign)`. | divergent | Codex §5, worksheet row 6; Claude worksheet row 6 | Codex protects; Claude opens redesign question. |
| `sensor-barrier-branch` (L7) | Cohort-boundary; "add a mild orientation or wall fallback only if ramp work needs it." | Not in protected list; worksheet row 7 says "could add a second condition." | unanimous on direction (mild uplift acceptable) | Codex worksheet row 7; Claude worksheet row 7 | Both audits leave this open to a small uplift. |
| `watch-the-wall` (L8) | Protected as satisfying small puzzle. | Protected; wall-vs-barrier disambiguation. | unanimous | Codex §5; Claude §"Protected-Level List" | Identical conclusion. |
| `find-the-human` (L9) | Protected; "already richer than neighbors." | Protected; highest-complexity standalone-arc level. | unanimous | Codex §5; Claude §"Protected-Level List" | Identical conclusion. |
| `find-the-enemy-flag` (L10) | Worksheet row 10: cohort-boundary; combine flag sensing with flag-phase or wall/side fallback. | Worksheet row 10: ship now; could require return-path planning. | unanimous on direction (both want uplift) | Codex worksheet row 10; Claude worksheet row 10 | Neither protects. |
| `human-runner-practice` (L11) | Protected; controls practice, not AI complexity. | Protected; controls familiarization. | unanimous | Codex §5; Claude §"Protected-Level List" | Identical conclusion. |
| `move-toward-flag` (L12) | Worksheet row 12: cohort-boundary uplift. | Protected; shortcut-block lesson. | divergent | Codex worksheet row 12; Claude §"Protected-Level List" | Direct disagreement. |
| `bring-it-home` (L13) | Worksheet row 13: "fine as-is or later add a minor wall detour variant" (effective protect). | Protected; pivotal "carrier loop" lesson. | unanimous | Codex worksheet row 13; Claude §"Protected-Level List" | Effectively identical. |
| `enemy-nearby` (L14) | Worksheet row 14: cohort-boundary; combine distance with choose-wait-or-route. | Worksheet row 14 + CLAUDE-I: ship now; combine distance with position sensor. | unanimous on direction (both want compound condition) | Codex worksheet row 14; Claude worksheet row 14 | Neither protects. |
| `jump-the-gap` (L15) | Worksheet row 15: "ship now; pure jump intro is satisfyingly direct." | Protected; block-introduction. | unanimous | Codex worksheet row 15; Claude §"Protected-Level List" | Both protect at this individual level (though Codex elsewhere flags `jump-the-gap` as a contributor to Challenge 15 thinness). |
| `bughunt-15` | Protected as first real pre-challenge trace. | Protected as strongest of the four bug hunts, but CLAUDE-D modifies it (unfreeze one enemy). | divergent | Codex §5, worksheet row 16; Claude §"Protected-Level List", CLAUDE-D | Both name the level as protected at the recommendation-list level, but Claude's headline recommendation modifies this specific level. |
| `dodge-and-deliver` / Challenge 15 | Worksheet row 17: needs owner decision; "no direct uplift; smooth the ramp before it." | Protected (challenge). | unanimous on direction (no in-place uplift) | Codex worksheet row 17; Claude protected-level list | Both protect the challenge itself; both want surrounding work. |
| `jump-if-ready` (L16) | Worksheet row 18: ship now; "adding resource contention too early may blur readiness." | CLAUDE-B uplift candidate. | divergent | Codex worksheet row 18; Claude CLAUDE-B | Direct disagreement. |
| `build-the-barrier` (L17) | Worksheet row 19: cohort-boundary uplift candidate. | Protected; block-introduction. | divergent | Codex worksheet row 19, CODEX-A; Claude §"Protected-Level List" | Direct disagreement. |
| `stay-still-can-do-something` (L18) | Protected; "satisfying small surprise." | CLAUDE-G uplift candidate. | divergent | Codex §5, worksheet row 20; Claude CLAUDE-G | Direct disagreement. |
| `relay-race` (L19/L21) | Worksheet row 21: needs owner decision; "human-input dependence makes automated evidence thin." | Protected; pivotal handoff lesson. | divergent | Codex worksheet row 21; Claude §"Protected-Level List" | Direct disagreement on whether the handoff is sacrosanct or an evidence/rehearsal hole. |
| `my-side-their-side` (L20/L22) | Cohort-boundary; "combine territory with flag state or enemy proximity." | CLAUDE-E ship-now uplift. | unanimous on direction (uplift) | Codex worksheet row 22, CODEX-A; Claude CLAUDE-E | Both want compound condition. |
| `freeze-the-lane` (L21/L23) | Protected; "clean Area Freeze introduction with live enemy." | CLAUDE-A: highest-leverage uplift. | divergent | Codex §5, worksheet row 23; Claude CLAUDE-A | Codex flagged this in its own §"Comparison Summary" as the most likely point of inter-model disagreement; it is. |
| `bughunt-22` | Worksheet row 24 + CODEX-E: cohort-boundary uplift packet. | Worksheet row 24: fine as-is for this level individually; varied as part of CLAUDE-H bug-type variety. | divergent on this level | Codex CODEX-E, worksheet row 24; Claude worksheet row 24, CLAUDE-H | Both audits target the bughunt surface area, but disagree on whether `bughunt-22` itself needs uplift. |
| `show-what-you-know` / Challenge 22 | Needs owner decision; smooth ramp before it. | Protected (challenge). | unanimous on direction (no in-place uplift) | Codex worksheet row 25; Claude protected-level list | Identical conclusion. |
| `closest-threat` (L23/L26) | Protected; project-start persistence onboarding. | Worksheet row 26: needs owner decision (project arc redesign?). | divergent | Codex §5, worksheet row 26; Claude worksheet row 26 | Codex protects; Claude opens project-arc question. |
| `how-far-away` (L24/L27) | Worksheet row 27 + Cluster 3: cohort-boundary; "make preservation/adaptation of previous closest-threat code explicit." | Protected; densest single-step in Strategy Brain. | divergent | Codex worksheet row 27, Cluster 3; Claude §"Protected-Level List" | Direct disagreement. |
| `two-conditions-at-once` (L25/L28) | Worksheet row 28: "strong as-is; maybe add clearer old-skill naming in tutorial later." | Protected; largest step in Strategy Brain. | unanimous | Codex worksheet row 28; Claude §"Protected-Level List" | Effectively identical. |
| `this-or-that` (L26/L29) | Worksheet row 29: fine as-is. | CLAUDE-J cohort-boundary uplift. | divergent | Codex worksheet row 29; Claude CLAUDE-J | Direct disagreement. |
| `flip-the-answer` (L27/L30) | Worksheet row 30: fine as-is; could connect to prior `AND`/`OR` in copy. | CLAUDE-F cohort-boundary uplift. | divergent | Codex worksheet row 30; Claude CLAUDE-F | Direct disagreement. |
| `prediction-25` | Protected. | Worksheet row 31: needs owner decision (prediction redesign). | divergent | Codex §5; Claude worksheet row 31 | Codex protects; Claude opens redesign question. |
| `bughunt-28` | Protected; "good capstone rehearsal." | Protected; "good bug; identifies which boolean is wrong." | unanimous | Codex §5; Claude §"Protected-Level List" | Identical conclusion. |
| `full-team-tactics` / Challenge 28 | Worksheet row 33: needs owner decision. | Worksheet row 33: needs owner decision. | unanimous on uncertainty | Codex worksheet row 33; Claude worksheet row 33 | Identical uncertainty; different specific concerns (see Recommendation table). |
| `one-program-two-allies` (L29/L34) | Protected; project-start shared-program contract. | CLAUDE-K cohort-boundary uplift. | divergent | Codex §5, worksheet row 34; Claude CLAUDE-K | Direct disagreement. |
| `index-jobs` (L30/L35) | Worksheet row 35: "fine as-is, but add stronger 'role split' reflection downstream." | Protected; worksheet row 35 "fine as-is." | unanimous | Codex worksheet row 35; Claude §"Protected-Level List" | Effectively identical. |
| `first-two-defend` (L31/L36) | Cohort-boundary uplift candidate (CODEX-C, CODEX-G). | Protected; worksheet row 36 "fine as-is." | divergent | Codex CODEX-C, CODEX-G, Cluster 4; Claude §"Protected-Level List", worksheet row 36 | Direct disagreement. |
| `escort-the-carrier` (L32/L37) | Protected; first carrier-role integration. | Protected; densest TSS step. | unanimous | Codex §5; Claude §"Protected-Level List" | Identical conclusion. |
| `closest-enemy-defender` (L33/L38) | Cohort-boundary uplift candidate (CODEX-C, CODEX-G). | Protected; first sustained live-enemy interaction in TSS. | divergent | Codex CODEX-C, CODEX-G, Cluster 4; Claude §"Protected-Level List" | Direct disagreement. |
| `freeze-support` (L34/L39) | Cohort-boundary uplift candidate (CODEX-C, CODEX-F). | Protected. | divergent | Codex CODEX-C, CODEX-F, Cluster 4; Claude §"Protected-Level List" | Direct disagreement. |
| `barrier-specialist` (L35/L40) | Cohort-boundary uplift candidate (CODEX-C, packet anchor). | Protected; widest action variety in TSS arc. | divergent | Codex CODEX-C, Cluster 4; Claude §"Protected-Level List" | Direct disagreement. |
| `jump-team` (L36/L41) | Worksheet row 41: ship now. | Protected. | unanimous | Codex worksheet row 41; Claude §"Protected-Level List" | Effectively identical. |
| `prediction-31` | Protected. | Worksheet row 42: needs owner decision (prediction redesign). | divergent | Codex §5; Claude worksheet row 42 | Codex protects; Claude opens redesign question. |
| `bughunt-37` | Protected, "or modestly align with any role-uplift packet." | Worksheet row 43: optional/lab only; CLAUDE-H bug-variety candidate. | divergent | Codex §5, worksheet row 43; Claude worksheet row 43, CLAUDE-H | Direct disagreement on whether the final bughunt's placement and type are fixed. |
| `advanced-scrimmage` / Challenge 37 | Needs owner decision; capstone is already long/high-load. | Protected (challenge). | unanimous on direction (no source change without explicit owner decision) | Codex worksheet row 44; Claude protected-level list | Both protect the challenge itself. |
| `optional-random-lab` | Optional/lab only — protected as novelty sandbox. | Protected. | unanimous | Codex §5; Claude worksheet row 45 | Identical conclusion. |
| `optional-double-carrier-showdown` | Optional/lab only; CODEX-I proposes a separate prep lab. | Protected; recent Plan 67 integration. | unanimous on protection of this specific level | Codex worksheet row 46, CODEX-I; Claude §"Protected-Level List" | Both leave the level itself protected; both endorse additive optional surface. |

---

## 3. Challenge-Ramp Comparison

| challenge ramp | Codex verdict | Claude verdict | agreement bucket | factual disagreement, if any | owner attention needed |
| --- | --- | --- | --- | --- | --- |
| Challenge 15 (`dodge-and-deliver`) | "First visible cliff." Cliff diagnosed as block-count/decision-count growth (2 → 10 blocks, 1 → 4 decisions) compounded by `jump-the-gap` being "especially thin." Smooth via Codex Clusters 1/2. | "Abrupt cliff." Cliff diagnosed primarily as the **first live-enemy experience**: 20 preceding levels are static-enemy boards or frozen-999 props. Smooth via CLAUDE-D (unfreeze a bughunt-15 enemy) or CLAUDE-L (new optional lab). | unanimous that ramp is abrupt; divergent on root cause | Both factual: both audits agree on counts. The divergence is about which axis (combinatorial complexity vs live-enemy novelty) dominates the perceived cliff. | Yes — choose ramp-smoothing strategy: cross-skill standalone levels (Codex) vs live-enemy rehearsal (Claude). The two approaches are not mutually exclusive but represent different first packets. |
| Challenge 22 (`show-what-you-know`) | "Biggest standalone rehearsal debt." Cliff diagnosed as resource timing + live-enemy prediction landing on top of mostly one-branch lessons. Smooth via Codex Cluster 2 (CODEX-A). | "Abrupt cliff, larger than Challenge 15." Cliff diagnosed specifically as **first composition of two resource-readiness checks** (freeze + jump). Smooth via CLAUDE-A + CLAUDE-B (compound conditions in `freeze-the-lane` and `jump-if-ready`). | unanimous | Both audits agree Challenge 22 is the largest cliff. Both agree resource composition is the central problem. They disagree on which prior level to uplift: Codex targets `build-the-barrier`/`my-side-their-side`/`bughunt-22`; Claude targets `freeze-the-lane`/`jump-if-ready`. | Yes — this is the single most important owner decision because both audits rank it #1 but disagree on the slate of levels to touch. |
| Challenge 28 (`full-team-tactics`) | "Evidence opacity." Cliff diagnosed as not-applicable runtime evidence due to human input; "human audit should be cautious before deciding whether it is too hard or merely under-measured." | "Structurally different ramp; cliff isn't program complexity, it's the *fragility* of the accumulated 6-block script under 3 live enemies." Strategy Brain accumulates only 6 blocks total; project framing over-promises. | divergent | Codex centers diagnosis on the **not-applicable** runtime evidence boundary (a Plan 74 limitation). Claude centers diagnosis on **insufficient project accumulation** (a content judgment). Both observations are factually supported by the dossiers; they target different repair shapes. | Yes — decide whether Challenge 28 needs (a) a runnable non-human reference fixture, (b) a Strategy Brain reframe (rebrand or restructure per CLAUDE-C), (c) both, or (d) neither pending pilot signal. |
| Challenge 37 (`advanced-scrimmage`) | "Best ramp conceptually." Risk: endurance/debugging — 25-block final fixture, 56 turns, 70 actions. | "Well-ramped. The model for what a project arc should look like — Strategy Brain is not." | unanimous | No factual disagreement. Only Codex names an endurance concern; Claude does not. | Low for ramp-smoothing per se. Codex's endurance flag is worth noting if a TSS-uplift packet (CODEX-C) is dispatched, because such a packet could compound runtime length. |

---

## 4. Rehearsal-Debt Comparison

| skill or debt topic | Codex concern | Claude concern | agreement bucket | likely downstream packet area | owner attention needed |
| --- | --- | --- | --- | --- | --- |
| Jump action vs jump readiness | L14 (`enemy-nearby`) is one action; L16 (`jump-if-ready`) is one guard; limited synthesis before live pressure of Challenge 15 and Challenge 22. | Resource readiness (`if_can_jump_else`) has a 6-level gap from L16 introduction to Challenge 22 load-bearing use. (Claude considers jump-into-Challenge-15 "ok" because the block, not the readiness check, is what Challenge 15 needs.) | unanimous on Challenge 22; divergent on Challenge 15 | Pre-Challenge 22 cluster | Yes — confirm whether Challenge 15 requires jump readiness at all. Settling this scopes the pre-15 cluster. |
| Barrier placement readiness | L17 (`build-the-barrier`) is a one-action win; `bughunt-22` is one runtime action. Recommend uplift so readiness/order matters across turns. | Not raised as a distinct rehearsal-debt row, though Cluster 1 touches L17 indirectly. | unique-to-Codex | Pre-Challenge 22 cluster | Yes — decide whether `build-the-barrier` is a protected block-introduction or a rehearsal-debt site. |
| Territory / side checks | One ordinary level (L20/`my-side-their-side`) before synthesis. Add territory + flag/enemy state combination. | OK in standalone arc; load-bearing in Strategy Brain. (CLAUDE-E still uplifts this level.) | unanimous on direction (uplift) but divergent on framing as "debt" vs not | Pre-Challenge 22 cluster | Low — both agree on action. |
| Teammate flag state | `relay-race` is human-input and not runnable by Plan 74; add non-human or clearer evidence-backed teammate-state rehearsal. | OK; `teammate-has-flag` introduced L32 and load-bearing thereafter. | divergent | TSS / optional-lab area | Yes — Codex flags a Plan 74 evidence boundary as a curriculum gap; Claude does not. |
| Resource timing / Area Freeze cooldown | Freeze intro (L21) succeeds quickly; cooldown / resource-unavailable appears mainly later. Recommend explicit "save vs spend" / cooldown-safe support role packet (CODEX-F). | Uplift `freeze-the-lane` itself to require a compound condition (CLAUDE-A). | unanimous on the area; divergent on scope (multi-level packet vs single-level uplift) | Pre-Challenge 22 cluster + TSS area | Yes — decide packet scope. |
| Boolean AND / OR / NOT | No broad repair; protect; maybe enrich project copy with plain-English conditions. | NOT is taught in isolation; never composed with AND/OR. CLAUDE-F adds `NOT (A OR B)`; CLAUDE-J adds `(A AND B) OR C`. | divergent | Strategy Brain composition packet | Yes — owner decides whether boolean composition is owed before Challenge 28 or covered well enough. |
| Comparison + distance | Acceptable, but L24 should make preservation of prior code explicit. | OK. | divergent on tiny copy lift | Strategy Brain framing packet | Low — small lift either way. |
| Runner index | Good repeated exposure, but early roles are mostly positional. Recommend one conditional role split combining index with board state (CODEX-C / CODEX-G). | Well rehearsed within TSS. | divergent | TSS local-rule coordination packet | Yes — direct disagreement on whether TSS uplift is warranted. |
| Shared project code (preservation across project steps) | Students may not notice persistence; final fixtures reveal more code than step fixtures. Add project-start/preservation prompts or a small "keep old branch, add new branch" check. | Strategy Brain's final accumulated script is only 6 blocks; project framing over-promises. Either reframe (CLAUDE-C option A) or restructure to actually accumulate (option B). | unanimous on existence of issue; divergent on severity and prescription | Strategy Brain framing/restructure packet | Yes — Codex prescribes copy/framing; Claude opens a bigger fork including structural restructure. |
| Own-flag-home scoring pressure | Guided mandatory path does not rehearse it. Keep optional unless owner wants post-campaign Free Play bridge. | Acceptable for optional content; if it becomes load-bearing in future levels, would need rehearsal. | unanimous | Optional-lab area | Low — both endorse current optional treatment. |
| Live enemy interaction | Not raised as a distinct rehearsal-debt row. | "Biggest rehearsal debt." Zero live-enemy reaction practice before Challenge 15 (every pre-challenge level has static or frozen-999 enemies). | unique-to-Claude | Pre-Challenge 15 packet | Yes — if Claude's diagnosis is correct, this becomes the highest-leverage Challenge 15 lever. |
| Bug-hunt structural variety | Not raised as a debt; CODEX-E targets only `bughunt-22`. | Four bug hunts use the same "minor repair" pattern (1–3 block edits); recommend varying bug type across hunts (CLAUDE-H). | unique-to-Claude | Bug-hunt variety packet | Yes — confirm whether bug hunts are confidence checks (current state) or rehearsal sites. |
| Prediction-checkpoint design | Not raised as a debt; predictions are protected. | Worksheet entries flag predictions as `needs owner decision (prediction redesign)` — short-circuit prediction options, etc. | unique-to-Claude | Prediction redesign (held-back) | Yes — owner decides whether to open the question at all. |

---

## 5. Owner-Decision Items

Each item lists both audits' reasoning when both are present. The synthesizer recommends a resolution path, not a resolution. Synthesizer interpretation that goes beyond comparing the two audits is tagged `synthesizer judgment`.

### 5.1 Which slate of levels owns the pre-Challenge 22 ramp packet?

- Codex CODEX-A: target `build-the-barrier`, `my-side-their-side`, `bughunt-22` — the resource-and-territory triad before the live scrimmage.
- Claude CLAUDE-A / CLAUDE-B / CLAUDE-E / CLAUDE-G: target `freeze-the-lane`, `jump-if-ready`, `my-side-their-side`, `stay-still-can-do-something` — the compound-condition slate.
- Overlap: `my-side-their-side`.
- Resolution path: owner asks for a focused level-design packet that names exactly which levels to touch, since both audits rank this work #1 but disagree on the slate. **Synthesizer judgment**: the overlap (`my-side-their-side`) plus the two highest-confidence single-level levers from each audit (Codex's `bughunt-22`, Claude's `freeze-the-lane`) would form a defensible four-level packet.

### 5.2 `freeze-the-lane`: protect or uplift?

- Codex worksheet row 23: protect; "clean Area Freeze introduction with live enemy"; explicitly named in Codex's own §"Comparison Summary" as the most likely inter-model disagreement.
- Claude CLAUDE-A: highest-leverage single uplift; require freeze-ready AND enemy-nearby compound condition.
- Resolution path: owner chooses one direction. Notable that Codex anticipated this exact disagreement.

### 5.3 Strategy Brain project-arc framing — copy or restructure?

- Codex CODEX-D + Cluster 3: copy/framing pass on L24–L27; do not change toolbox; make preservation/adaptation explicit.
- Claude CLAUDE-C: choose between (A) rebrand as "Boolean Toolkit" (copy-only, ship-now) or (B) add a second ally so the shared script accumulates substantively (cohort-boundary, structural).
- Resolution path: owner chooses one direction. Codex's prescription overlaps with Claude's option A. Claude's option B is a Codex non-recommendation. **Synthesizer judgment**: Claude option A and Codex CODEX-D are close enough to merge into a single low-risk copy packet if the owner declines option B.

### 5.4 Challenge 28 — runnable evidence, framing, or both?

- Codex CODEX-H: stand up a Challenge 28 evidence/framing decision packet because of the not-applicable runtime evidence boundary.
- Claude worksheet row 33 + CLAUDE-C: capstone step is small relative to the challenge framing; accumulated script is 6 blocks; address via the Strategy Brain project decision.
- Resolution path: owner decides whether Challenge 28 needs (a) a runnable non-human reference artifact, (b) a project-arc reframe per CLAUDE-C, (c) both, or (d) defer to pilot signal.

### 5.5 Team Strategy Script — local-rule uplift or leave alone?

- Codex CODEX-C + Cluster 4 + CODEX-G: substantive packet across `first-two-defend`, `closest-enemy-defender`, `freeze-support`, `barrier-specialist` to shift index roles toward index-plus-state.
- Claude: TSS is "in good shape"; uplift opportunities are "small, optional"; explicit protection on those same levels.
- Resolution path: owner asks for a focused level-design packet **only if** the long-term decentralized-coordination learning goal is judged to outweigh pilot stability. This is the largest single divergence in the comparison.

### 5.6 `relay-race` — protect the handoff or close the evidence/rehearsal gap?

- Codex worksheet row 21: needs owner decision; human-input dependence makes automated evidence thin; consider non-human evidence-backed teammate-state companion.
- Claude protected-level list: protect as pivotal handoff lesson.
- Resolution path: owner asks for a factual evidence refresh decision (specifically: is the human-input boundary a teaching feature or an evidence/rehearsal hole?) or defers to optional-lab additions for non-human teammate-state rehearsal.

### 5.7 Live-enemy rehearsal before Challenge 15

- Codex: not raised.
- Claude CLAUDE-D: highest-impact lever for Challenge 15; unfreeze one bughunt-15 enemy or add an optional lab.
- Resolution path: owner chooses one direction. Because this is unique-to-Claude, the owner should consider whether Codex's silence implies the gap is acceptable or implies the gap was simply not surfaced.

### 5.8 Bug-hunt structural variety

- Codex CODEX-E: only `bughunt-22` needs calibration.
- Claude CLAUDE-H Cluster 4: vary bug type across `bughunt-22`, `bughunt-28`, `bughunt-37`.
- Codex §"Open Owner Decisions" poses a related meta question: "Should bug hunts be confidence-building checkpoints or closer-to-challenge complexity rehearsals?"
- Resolution path: owner chooses one direction (meta-question first; the level slate follows).

### 5.9 Prediction-checkpoint redesign

- Codex: predictions are protected.
- Claude: worksheet entries flag predictions as `needs owner decision (prediction redesign)` — e.g. introduce short-circuit prediction options.
- Resolution path: owner chooses whether to open the question. **Synthesizer judgment**: opening this question is low-cost (a scan-only packet), and the question itself is implicit in the original Plan 43 design discussion. Closing it without exploration is also defensible.

### 5.10 `one-program-two-allies` and `move-toward-flag` — protect or uplift?

- `one-program-two-allies`: Codex protects (project-start shared-program onboarding); Claude CLAUDE-K wants index leaned-on harder from the first level of TSS.
- `move-toward-flag`: Codex wants the helper wrapped in a state check; Claude protects (shortcut-block essence).
- Resolution path: owner chooses for each individually. **Synthesizer judgment**: these two divergences are stylistically symmetric — each model protects one "block-essence" level and uplifts the other. They may be a stand-in for a deeper philosophical choice (does a block introduction stay clean, or does it carry a small compound from the start?). Resolving this philosophy once would settle both.

### 5.11 `build-the-barrier`, `stay-still-can-do-something`, `jump-if-ready` — protect or uplift?

- Codex worksheet rows 19, 20, 18: protect `stay-still-can-do-something` and `jump-if-ready` as small surprises / clean intros; uplift `build-the-barrier`.
- Claude CLAUDE-G, CLAUDE-B (uplift), §"Protected-Level List" for `build-the-barrier` (protect).
- Resolution path: owner chooses one direction per level. **Synthesizer judgment**: these three are the same disagreement as 5.10 applied to the resource-intro family. A single "block-intro protection policy" decision would resolve all five levels (`build-the-barrier`, `stay-still-can-do-something`, `jump-if-ready`, `move-toward-flag`, `one-program-two-allies`).

### 5.12 Protected-level annotation pass (CODEX-J)

- Codex CODEX-J: small annotation pass to prevent future agents from uplifting intentional simplicity.
- Claude: silent.
- Resolution path: owner chooses one direction. **Synthesizer judgment**: low blast radius; adjacent to Plan 34's level-authoring contract linter. Likely a small docs-only packet.

### 5.13 `bughunt-37` placement

- Codex: protect, or modestly align with any role-uplift packet.
- Claude worksheet row 43: "optional/lab only (could be moved or varied)"; part of CLAUDE-H bug-variety cluster.
- Resolution path: owner chooses whether `bughunt-37` is a fixed final-arc trace checkpoint or a candidate for relocation. Resolves itself if 5.8 is resolved first.

---

## 6. Fast-Track Block

Recommendations where both audits agree in the same direction and could move into packet drafting with minimal additional owner reading. **All entries are fast-track to packet drafting, not implementation.** Owner approval is still required before any downstream packet is dispatched.

| rank | candidate | source ids | rationale |
| --- | --- | --- | --- |
| 1 | `my-side-their-side` compound territory + carrier-state uplift | CODEX-A (Cluster 2), CLAUDE-E | The single unanimously named uplift level in the pre-Challenge 22 cluster. Lowest cohort-safety risk among that cluster's candidates. |
| 2 | `enemy-nearby` distance + sensor composition | CODEX-B (Cluster 1), CLAUDE-I | Both audits prescribe the same direction; small blast radius. |
| 3 | `find-the-enemy-flag` flag-state / return-phase composition | Codex worksheet row 10 (Cluster 1), Claude worksheet row 10 | Both audits prescribe the same direction. Specific pairing differs but both want flag-state added. |
| 4 | Optional double-carrier prep / own-flag-home bridge optional lab | CODEX-I, Claude Cluster 6 | Both endorse additive optional surface for own-flag-home rehearsal. Lab additions are cohort-safe. |
| 5 | Pre-Challenge 22 resource/territory rehearsal **packet skeleton** (level slate left to owner per §5.1) | CODEX-A, CLAUDE-A/B/E/G | Both audits rank this work #1. The slate disagreement is owner-decision §5.1, but the **packet** itself is unanimous. |
| 6 | Strategy Brain copy/framing pass (Codex CODEX-D + Claude CLAUDE-C option A merged) | CODEX-D, Cluster 3, CLAUDE-C option A | Unanimous on the copy-level work even if Claude's option B is divergent. Drafting a copy-only packet does not preclude later restructure. |
| 7 | Protected-level annotation pass | CODEX-J | Unique-to-Codex but low blast radius and no inter-audit conflict. Drafting cost is small. **Synthesizer judgment**: includable as fast-track despite being unique-to-Codex because Claude is silent rather than disagreeing. |

---

## 7. Candidate Plan 77+ Packet Map

| candidate packet | source recommendation ids | agreement bucket | likely scope | owner decision needed | suggested implementation model tier | validation risk |
| --- | --- | --- | --- | --- | --- | --- |
| Plan 77 — Pre-Challenge 22 compound-condition uplift | CODEX-A; CLAUDE-A, CLAUDE-B, CLAUDE-E, CLAUDE-G | unanimous (with §5.1 slate divergence) | 3–5 guided levels; reference fixture updates; concept-matrix copy; `npm run lint:levels`; targeted browser smoke | §5.1 (slate), §5.2 (`freeze-the-lane` direction), §5.11 (block-intro protection policy) | level-editing specialist after owner picks slate | medium — touches pilot-active arc; cohort-boundary |
| Plan 78 — Pre-Challenge 15 ramp (Codex variant: cross-skill standalone) | CODEX-B; partial Codex worksheet rows 10, 12, 14 | divergent (Claude does not endorse) | 2–4 guided levels in pre-15 standalone arc | choose Plan 78 vs Plan 79 (or run both) | level-editing specialist | medium |
| Plan 79 — Pre-Challenge 15 ramp (Claude variant: live-enemy rehearsal) | CLAUDE-D; CLAUDE-L | unique-to-Claude | unfreeze one `bughunt-15` enemy phase, or add small optional lab between L14 and L16 | choose Plan 78 vs Plan 79 (or run both) | level-editing specialist; bughunt variant is lower risk | low–medium |
| Plan 80 — Strategy Brain copy/framing pass | CODEX-D, Cluster 3; CLAUDE-C option A | unanimous on copy work | lesson copy in L23, L26 (`closest-threat`), L33 (`full-team-tactics`); concept-matrix row updates; TeacherGuide; no fixture changes | confirm option A vs option B; if B, hold packet | lower-cost implementation model (docs-only) | low |
| Plan 81 — Strategy Brain restructure (second-ally accumulation) | CLAUDE-C option B | unique-to-Claude | structural change to Strategy Brain levels + fixtures + final fixture | §5.3 must resolve toward option B before drafting | orchestration-grade design first | high (mid-arc pilot disturbance, fixture cascade) |
| Plan 82 — Challenge 28 evidence/framing decision | CODEX-H; Claude CLAUDE-C indirect | divergent framing | report-only first; possible follow-on adding a runnable non-human reference artifact | §5.4 | orchestration-grade design first | low if report-only, high if source changes |
| Plan 83 — Team Strategy Script local-rule coordination | CODEX-C, CODEX-G, Cluster 4 | divergent (Claude protects target levels) | 3–4 TSS levels; index + board-state branching; project fixture refresh | §5.5 must resolve toward uplift | orchestration-grade design first | high — mid-project pilot disturbance |
| Plan 84 — Freeze/resource cooldown support-role packet | CODEX-F | divergent (Claude folds into Plan 77) | `freeze-the-lane` + `freeze-support` cooldown timing rehearsal | §5.2, §5.5 | level-editing specialist | medium |
| Plan 85 — Bug-hunt variety packet | CODEX-E (`bughunt-22` only); CLAUDE-H (`bughunt-22`, `bughunt-28`, `bughunt-37`) | divergent scope | starter XML + canonical fixture revisions for 1–3 bug hunts | §5.8 | level-editing specialist | medium |
| Plan 86 — Strategy Brain boolean composition uplift | CLAUDE-F, CLAUDE-J, Cluster 5 | unique-to-Claude | `flip-the-answer` `NOT (A OR B)`; `this-or-that` `(A AND B) OR C`; step + final fixture refresh | §5.3 (interacts with Strategy Brain framing) | level-editing specialist | medium |
| Plan 87 — Optional double-carrier prep / own-flag-home bridge lab | CODEX-I; Claude Cluster 6 | unanimous | new optional lab(s); fixture(s); concept-matrix optional rows | confirm scope (one lab vs two) | level-editing specialist | low (additive) |
| Plan 88 — Relay-race teammate-state non-human companion | Codex Cluster 2; Codex worksheet row 21 | unique-to-Codex (Claude protects) | new or companion guided level to rehearse `teammate-has-flag` without human input | §5.6 | level-editing specialist | medium |
| Plan 89 — Protected-level annotation pass | CODEX-J | unique-to-Codex | docs-only annotation across the protected-level set | §5.12 | lower-cost implementation model (docs-only) | low |
| Plan 90 — Prediction-checkpoint redesign exploration | Claude worksheet rows 6, 31, 42 | unique-to-Claude | scan-only design packet first; possible short-circuit prediction options | §5.9 must open the question | orchestration-grade design first | low if scan-only |
| Plan 91 — `one-program-two-allies` (CLAUDE-K) + `move-toward-flag` block-intro policy resolution | Codex worksheet row 12; CLAUDE-K | divergent (symmetric) | block-intro protection policy decision + downstream per-level edits | §5.10, §5.11 (one policy decision) | orchestration-grade design first | low if policy-only, medium if per-level edits |

---

## 8. Open Questions Surfaced By Comparison

The items below are gaps that become visible only after comparing the two audits.

1. **Both audits infer cohort-safety tags from `docs/TeacherGuide.md`, prior packet history, and integration-owner notes — neither has direct classroom observation.** This is stated explicitly in both audits' assumptions. Several `cohort boundary` recommendations rest on an assumed pilot-state that the synthesis cannot confirm.
2. **Both audits hit the not-applicable runtime evidence boundary in different ways.** Codex turns it into a Challenge 28 evidence packet (CODEX-H) and a `relay-race` open question. Claude turns it into a Strategy Brain accumulation diagnosis. The underlying Plan 74 limitation (human-input levels are not runnable in deterministic evidence) is the same observation; the curriculum implications diverge.
3. **Both audits agree that the pre-Challenge 22 cluster is the highest-leverage work, but they disagree on the slate of levels to touch.** A single packet cannot serve both prescriptions without owner choice. The overlap is exactly one level (`my-side-their-side`).
4. **Block-intro protection is the unstated philosophical divide.** Across §5.10 and §5.11, the same five levels (`build-the-barrier`, `stay-still-can-do-something`, `jump-if-ready`, `move-toward-flag`, `one-program-two-allies`) trigger symmetric protect-vs-uplift disagreement. The disagreement is recoverable into a single policy question. Neither audit names this policy directly.
5. **Live-enemy rehearsal is either the biggest rehearsal debt or not a debt at all.** Claude treats it as the #1 Challenge 15 lever; Codex's rehearsal-debt table omits it entirely. This is a unique-to-Claude diagnosis, but it is so load-bearing in Claude's recommendations that the owner should treat it as a yes/no question rather than a silent disagreement.
6. **Strategy Brain accumulation is either a copy problem (Codex), a copy-or-structural problem (Claude option A vs B), or a project-arc identity problem (Claude's diagnosis if pilot signal supports option B).** The three possibilities scale from a small docs-only packet to a mid-arc structural rewrite.
7. **Both audits explicitly avoid declaring whether bug hunts should be confidence checks or rehearsal sites.** Codex names the meta question; Claude implicitly answers it via CLAUDE-H but does not name the policy. The Plan 85 packet hinges on this answer.
8. **Both audits agree on optional-lab additions but disagree on their count and exact purpose.** Codex names one (CODEX-I, double-carrier prep). Claude names up to two (live-enemy rehearsal lab + own-flag-home code-controlled-ally lab). The owner question is "how many additive optional labs are appropriate."

---

## 9. Comparison Summary

- **Top unanimous packet candidates (drafting fast-track):**
  - Plan 77 — Pre-Challenge 22 compound-condition uplift (slate per §5.1).
  - Plan 80 — Strategy Brain copy/framing pass (Codex CODEX-D + Claude CLAUDE-C option A merged).
  - Plan 87 — Optional own-flag-home / double-carrier bridge lab.
- **Top divergent owner decisions:**
  - §5.1 Which slate of levels owns the pre-Challenge 22 packet (the two audits' #1 recommendations target different levels).
  - §5.5 Team Strategy Script local-rule uplift (largest single divergence; four TSS levels at stake).
  - §5.3 Strategy Brain copy vs structural restructure (CODEX-D vs CLAUDE-C option B).
- **Top unique-to-Codex item:** CODEX-C / Cluster 4 / CODEX-G — substantive Team Strategy Script local-rule coordination packet across `first-two-defend`, `closest-enemy-defender`, `freeze-support`, `barrier-specialist`. Claude protects all four.
- **Top unique-to-Claude item:** CLAUDE-D — unfreeze one `bughunt-15` enemy (or add an optional lab) to give students their first live-enemy reaction before Challenge 15. Codex does not raise live-enemy rehearsal as a debt.
- **Biggest shared challenge-ramp concern:** Challenge 22. Both audits rank it as the largest cliff and both diagnose the central problem as resource-readiness composition landing without prior rehearsal.
- **Biggest shared rehearsal-debt concern:** Resource readiness (freeze cooldown and jump readiness) before Challenge 22. Both audits prescribe uplift in the pre-Challenge 22 area; they disagree on the level slate but not on the debt.
- **One place the synthesizer is least confident:** `synthesizer judgment` — whether §5.10 and §5.11 reduce to a single block-intro protection policy question. The two audits' symmetric disagreements across five levels suggest a hidden policy axis, but neither audit names that axis. The synthesis may be over-organizing the divergence; the alternative reading is that each level is a separate judgment call and the symmetry is coincidence. The owner is better positioned to settle this than the synthesis is.
