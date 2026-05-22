# Guided Level Complexity Audit Synthesis — Gemini

- Packet: Plan 76
- Model/thread: Gemini orchestration audit synthesis
- Date: 2026-05-21
- Source audits reviewed:
  - Codex audit: yes
  - Claude audit: yes
- Evidence consulted beyond source audits: None
- Scope notes: Pure synthesis of the Codex and Claude Plan 75 audits. Factual discrepancies were minor and resolved by comparing the audits' own worksheets.
- Major assumptions: Where one model did not mention a specific topic or level raised by the other, it is treated as `unique-to-[model]` rather than `divergent`, preserving the possibility that the silent model simply prioritized other findings.

## 1. Recommendation Comparison Table

| topic | Codex position | Claude position | agreement bucket | source references | synthesizer note |
| --- | --- | --- | --- | --- | --- |
| Pre-Challenge 22 Integration | CODEX-A: Add readiness + state checks (L17, L20, bughunt-22) | CLAUDE-A/G/E: Require compound conditions combining resource/territory with prior sensors (L21, L20, L22) | `unanimous` | Codex Cluster 2; Claude Cluster 1 | Both agree that one-branch resource levels need compound conditions before Challenge 22. They target slightly different levels but the same arc and goal. |
| Pre-Challenge 15 Integration | CODEX-B: Cross-skill integration (L9, L11, L13, L14) to combine sensing/helper with existing movement | CLAUDE-I/B: Uplift L14 and L18 to require compound conditions | `unanimous` | Codex Cluster 1; Claude Cluster 1 | Both identify a steep ramp and recommend adding compound checks to existing levels in the L14-L18 range. |
| First Live Enemy | (Silent on specifically adding live enemies before C15) | CLAUDE-D/L: Unfreeze a bughunt-15 enemy or add a new optional lab | `unique-to-Claude` | Claude Cluster 3 | Claude specifically isolates the "live enemy" shock as the main C15 cliff. |
| Strategy Brain Arc | CODEX-D: Emphasize persistence/adaptation through copy; don't add more blocks | CLAUDE-C: Rebrand as "Boolean Toolkit" or restructure to add a second ally | `divergent` | Codex Cluster 3; Claude Cluster 2 | Both agree the arc fails to feel like an accumulating project. Codex wants copy fixes; Claude thinks it either needs a structural rewrite or an honest rebranding. |
| Team Strategy Script (TSS) Arc | CODEX-C/F/G: Shift role logic from static jobs to index + local board state (L31, L33-L35) | CLAUDE-K: Strengthen L29 to use index; otherwise arc is healthy | `divergent` | Codex Cluster 4; Claude Cluster 2/TSS | Codex sees static roles as a missed opportunity for decentralized coordination; Claude sees the arc as already highly successful. |
| Bug-Hunt Variety | CODEX-E: Strengthen starter bug plausibility and require order reasoning (bughunt-22) | CLAUDE-H: Vary bug types across L24, L32, L43 (missing guard, wrong operator) | `unanimous` | Codex Cluster 5; Claude Cluster 4 | Both agree bug-hunts are repetitive. Codex focuses on bughunt-22; Claude broadens the recommendation to all bug-hunts. |
| Boolean Composition | (Silent) | CLAUDE-F/J: Require `NOT (A OR B)` and `(A AND B) OR C` composition in Strategy Brain | `unique-to-Claude` | Claude Cluster 5 | Claude wants AP CSA DeMorgan prep; Codex finds the current boolean ramp coherent. |
| Challenge 28 Evidence | CODEX-H: Decide if capstone needs an analyzable reference artifact | (Silent on evidence pipeline, though notes it is a flawed challenge) | `unique-to-Codex` | Codex Cluster 3 | Codex flags the lack of runtime evidence due to human-input dependence. |
| Own-Flag-Home Prep | CODEX-I: Add an optional double-carrier prep lab | CLAUDE-L: Add optional lab after L46 for own-flag-home scoring | `unanimous` | Codex Cluster 6; Claude Cluster 6 | Both agree that own-flag-home needs a non-human-input rehearsal lab. |
| Protected-Level Annotation | CODEX-J: Annotate protected levels to prevent future agent uplift | (Provides a protected list but no explicit pass recommendation) | `unique-to-Codex` | Codex Cluster 6 | Codex explicitly recommends a packet to document these protections. |

## 2. Protected-Level Comparison Table

| level or level group | Codex protection rationale | Claude protection rationale | agreement bucket | source references | synthesizer note |
| --- | --- | --- | --- | --- | --- |
| `move-to-target` (L1) | First success, one-action model | Onboarding | `unanimous` | Codex sec 5; Claude sec 5 | Both protect as absolute beginner onboarding. |
| `reach-enemy-flag` (L2) | Flag vocabulary, minimal load | (Wants to uplift with second sensor check) | `divergent` | Codex sec 5; Claude sec 1 | Codex values the simplicity; Claude finds it thin. |
| `score-a-point` (L3) | First scoring model | Pivotal first carrier loop | `unanimous` | Codex sec 5; Claude sec 5 | Both recognize it as a satisfying, essential loop. |
| `barrier-detour` (L4) | Satisfying first conditional detour | First sensor lesson | `unanimous` | Codex sec 5; Claude sec 5 | Both protect as a strong first-branch puzzle. |
| `mirror-forward` (L5) | Small orientation surprise | Vocabulary lesson (forward depends on team) | `unanimous` | Codex sec 5; Claude sec 5 | Both agree adding complexity dilutes the point. |
| `watch-the-wall` (L8) | Already has two decisions | Wall-vs-barrier disambiguation | `unanimous` | Codex sec 5; Claude sec 5 | Both protect. |
| `find-the-human` (L9) | Already richer than neighbors | Highest-complexity standalone level | `unanimous` | Codex sec 1; Claude sec 5 | Both view it as a local maximum for complexity. |
| `move-toward-flag` (L12) | (Wants to require a branch) | Shortcut-block essence | `divergent` | Codex sec 1; Claude sec 5 | Claude protects the "shortcut" lesson; Codex finds it thin. |
| `bring-it-home` (L13) | Fine as-is or minor detour | Carrier-return lesson | `unanimous` | Codex sec 5; Claude sec 5 | Both protect. |
| `jump-the-gap` (L15) | Pure jump intro satisfying | Block-introduction level | `unanimous` | Codex sec 1; Claude sec 5 | Both protect the pure demonstration. |
| `bughunt-15` (L16) | Trace/debugging checkpoint | Strongest bug hunt (adds blocks) | `unanimous` | Codex sec 5; Claude sec 5 | Both protect. |
| `jump-if-ready` (L18) | Adding resource contention blurs readiness | (Wants to combine with sensor) | `divergent` | Codex sec 1; Claude sec 1 | Codex protects the pure intro; Claude wants a compound check. |
| `build-the-barrier` (L19) | (Wants to require readiness check) | Block-introduction | `divergent` | Codex sec 1; Claude sec 5 | Codex wants uplift; Claude protects as an intro. |
| `stay-still-can-do-something` (L20) | Satisfying small surprise | (Wants to gate by resource readiness) | `divergent` | Codex sec 5; Claude sec 1 | Codex protects the novelty; Claude wants timing utility. |
| `relay-race` (L21) | Use as model/needs owner decision | Human→ally handoff lesson | `unanimous` | Codex sec 1; Claude sec 5 | Both protect the core handoff, though Codex wants a non-human companion. |
| `freeze-the-lane` (L23) | Clean Area Freeze intro with live enemy | (Wants to compound with enemy-nearby) | `divergent` | Codex sec 5; Claude sec 1 | Codex protects the pure intro; Claude sees it as thin and in need of a compound check. |
| `closest-threat` (L26) | Project-start onboarding | (Wants to require initial role assignment) | `divergent` | Codex sec 5; Claude sec 1 | Codex protects onboarding simplicity; Claude wants to establish multi-ally logic immediately. |
| `two-conditions-at-once` (L28) | Strong as-is | Largest step in Strategy Brain | `unanimous` | Codex sec 1; Claude sec 5 | Both protect. |
| `this-or-that` (L29) | Fine as-is | (Wants to require compound `(A AND B) OR C`) | `divergent` | Codex sec 1; Claude sec 1 | Codex protects; Claude wants AP CSA DeMorgan prep. |
| `flip-the-answer` (L30) | Fine as-is | (Wants to require compound `NOT (A OR B)`) | `divergent` | Codex sec 1; Claude sec 1 | Codex protects; Claude wants AP CSA DeMorgan prep. |
| `bughunt-28` (L32) | Trace/debugging checkpoint | Satisfying small puzzle | `unanimous` | Codex sec 5; Claude sec 5 | Both protect. |
| `one-program-two-allies` (L34) | Project-start shared program | (Suggests small touchup to use index early) | `unanimous` | Codex sec 5; Claude sec 1 | Both largely protect it as an intro. |
| `escort-the-carrier` (L37) | First carrier-role integration | Densest TSS step | `unanimous` | Codex sec 5; Claude sec 5 | Both protect. |

## 3. Challenge-Ramp Comparison

| challenge ramp | Codex verdict | Claude verdict | agreement bucket | factual disagreement | owner attention needed |
| --- | --- | --- | --- | --- | --- |
| Challenge 15 | Abrupt cliff | Abrupt cliff | `unanimous` | Codex focuses on the jump to 10 blocks/4 decisions; Claude focuses on the lack of prior live-enemy exposure. | Decide if the fix is more compound-block practice or specifically introducing a live enemy beforehand. |
| Challenge 22 | Biggest standalone rehearsal debt (resource timing + prediction) | Abrupt cliff, larger than C15 | `unanimous` | Codex notes the overall block/branch jump; Claude specifically isolates the "two resource-readiness checks composed" as the un-rehearsed load. | Decide which pre-C22 levels receive compound resource conditions. |
| Challenge 28 | Evidence opacity (human-input capstone lacks runnable behavior evidence) | Structurally different ramp (cliff is fragility of small script under live enemies) | `divergent` | Codex focuses on the lack of evidence; Claude focuses on the small accumulated block count (6 blocks) facing a live threat. | Decide if Strategy Brain needs a second ally or just a copy reframing. |
| Challenge 37 | Best conceptual ramp, but high endurance/debugging fatigue (70 actions) | Well-ramped; honestly accumulates | `unanimous` | None. | Low. |

## 4. Rehearsal-Debt Comparison

| skill or debt topic | Codex concern | Claude concern | agreement bucket | likely downstream packet area | owner attention needed |
| --- | --- | --- | --- | --- | --- |
| Live enemy interaction | (Focused on static logic integration) | No rehearsal before Challenge 15 | `unique-to-Claude` | Pre-Challenge 15 | Yes: Add a live enemy to a bug-hunt or optional lab? |
| Resource readiness composition | Uplift L17/bughunt-22 so readiness matters | Biggest gap before C22 (freeze + jump) | `unanimous` | Pre-Challenge 22 (L18, L20, L21, L22) | Yes: Approve adding compound resource checks to intro levels. |
| Boolean composition | Coherent rehearsal | NOT never composed with AND/OR | `divergent` | Strategy Brain (L26, L27) | Yes: Is DeMorgan-style composition required for the target AP CSA audience? |
| Runner index & local rules | Roles too static; need local board state | Well rehearsed | `divergent` | Team Strategy Script | Yes: Should TSS teach decentralized local state, or is it successful enough as-is? |
| Territory/side checks | Needs combination with flag/enemy | OK | `divergent` | Pre-Challenge 22 | Low. |
| Shared project code | Students might not notice persistence | Doesn't accumulate meaningfully (6 blocks) | `unanimous` | Strategy Brain | Yes: Decide between copy reframing ("Boolean Toolkit") vs. structural rewrite (second ally). |
| Own-flag-home scoring | Keep optional unless owner wants a bridge | Acceptable for optional | `unanimous` | Post-Campaign Labs | Yes: Approve a new optional lab. |

## 5. Owner-Decision Items

*   **Strategy Brain Identity (Divergent):** The audits unanimously agree Strategy Brain fails to feel like an accumulating project. Codex recommends making the preservation of prior code explicit in the copy (`CODEX-D`). Claude recommends either rebranding it honestly as a "Boolean Toolkit" or fundamentally restructuring it to include a second ally (`CLAUDE-C`).
    *   *Resolution Path:* Owner chooses one direction (copy rebrand vs. structural rewrite).
*   **Team Strategy Script (TSS) Ambition (Divergent):** Codex sees TSS as falling short of the project's long-term goal of decentralized coordination, recommending a heavy uplift to combine index roles with local board state (`CODEX-C`). Claude views TSS as structurally healthy and highly successful, recommending almost no changes.
    *   *Resolution Path:* Owner chooses one direction based on AP CSA goals vs. pilot disruption risk.
*   **Live Enemy Pre-Exposure (Unique-to-Claude):** Claude isolates the lack of live-enemy exposure as the primary reason Challenge 15 is a cliff, recommending unfreezing an enemy in bughunt-15 or adding a new optional lab (`CLAUDE-D/L`). Codex focuses on integrating static skills.
    *   *Resolution Path:* Owner asks for a focused level-design packet to unfreeze a bughunt enemy or add an optional lab.
*   **Resource Introductions vs. Compound Checks (Divergent):** Codex fiercely protects "intro" levels (L18 jump-if-ready, L21 freeze-the-lane, L20 stay-still) to preserve their satisfying simplicity. Claude identifies these exact levels as the places that *must* receive compound conditions to prevent the Challenge 22 cliff.
    *   *Resolution Path:* Owner chooses one direction (protect purity vs. force compound rehearsal).
*   **DeMorgan Boolean Composition (Unique-to-Claude):** Claude recommends forcing `(A AND B) OR C` and `NOT (A OR B)` in Strategy Brain for AP CSA transfer. Codex is silent.
    *   *Resolution Path:* Owner defers to cohort boundary or asks for a focused level-design packet.

## 6. Fast-Track Candidates

*(Unanimous recommendations ready for packet drafting)*

1.  **Pre-Challenge 22 Compound Condition Packet:** Draft a packet to add compound conditions (combining resource/territory with prior sensors) to 2-3 levels in the L17-L22 range to smooth the Challenge 22 cliff. (High learning benefit, pilot-safe if applied at the cohort boundary).
2.  **Pre-Challenge 15 Integration Packet:** Draft a packet to cross-integrate existing movement, sensing, and helper blocks in the L9-L14 range. (High learning benefit, moderate validation cost).
3.  **Bug-Hunt Variety Packet:** Draft a packet to vary the bug types in L24, L32, and L43 to include missing guards and wrong operators, rather than just simple order repairs. (Low risk, high AP CSA value).
4.  **Own-Flag-Home Prep Lab:** Draft a packet for a new optional lab rehearsing the Plan 67 own-flag-home rule in a non-human-input context. (Zero risk to main campaign).

## 7. Candidate Plan 77+ Packet Map

| candidate packet | source recommendation ids | agreement bucket | likely scope | owner decision needed | suggested implementation model tier | validation risk |
| --- | --- | --- | --- | --- | --- | --- |
| Pre-Challenge 22 Integration | CLAUDE-A/E/G, CODEX-A | `unanimous` | Add compound conditions to L17-L22 range | Select exact levels | level-editing specialist | Medium |
| Pre-Challenge 15 Integration | CODEX-B, CLAUDE-I | `unanimous` | Add cross-skill checks to L9-L14 | Select exact levels | level-editing specialist | Medium |
| Live-Enemy Rehearsal | CLAUDE-D/L | `unique-to-Claude` | Unfreeze bughunt-15 enemy OR add new lab | Choose method | level-editing specialist | Low-Medium |
| Strategy Brain Identity | CLAUDE-C, CODEX-D | `divergent` | Copy-only rebrand OR structural second-ally rewrite | Choose direction | orchestration-grade design first | High |
| TSS Local-Rule Uplift | CODEX-C/F/G | `divergent` | Combine index roles with local board state in L31-L35 | Approve or reject | level-editing specialist | High |
| Bug-Hunt Variety | CLAUDE-H, CODEX-E | `unanimous` | Change bug types in L24, L32, L43 | Approve | lower-cost implementation model | Low |
| Boolean Composition | CLAUDE-F/J | `unique-to-Claude`| Require `NOT (A OR B)` in L26/L27 | Approve or reject | level-editing specialist | Medium |
| Optional Double-Carrier Lab | CODEX-I, CLAUDE-L | `unanimous` | Add new optional prep lab | Approve | level-editing specialist | Low |
| Protected-Level Annotation | CODEX-J | `unique-to-Codex`| Add annotations/comments to protect simple levels | Approve | lower-cost implementation model | Low |

## 8. Open Questions Surfaced By Comparison

*   **The Intro Purity vs. Ramp Smoothing Conflict:** Both audits agree on the cliffs (C15, C22). However, Codex's instinct is to protect the "intro" levels (e.g., L18, L21) because they are satisfying standalone puzzles, while Claude's instinct is to sacrifice that purity by adding compound conditions directly to them to solve the ramp. A decision must be made on whether a level can be *both* an introduction and a compound-rehearsal step.
*   **The Pilot Disruption Threshold:** Both audits frequently cite the `cohort boundary` tag. If pilot students are currently playing through L20-L30, the recommended fixes for the C22 cliff and Strategy Brain might be too disruptive to deploy live, forcing a deferral to a future cohort.

## 9. Comparison Summary

*   **Top unanimous packet candidates:** Pre-Challenge 22 Integration, Bug-Hunt Variety, Optional Double-Carrier Lab.
*   **Top divergent owner decisions:** Strategy Brain Identity (copy rebrand vs. structural rewrite) and Team Strategy Script Ambition (static roles vs. local-rule uplift).
*   **Top unique-to-Codex item:** Annotating protected levels to prevent future AI agents from uplifting them.
*   **Top unique-to-Claude item:** Unfreezing an enemy in bughunt-15 to provide live-enemy rehearsal before Challenge 15.
*   **Biggest shared challenge-ramp concern:** Challenge 22. It expects students to compose two resource-readiness checks under live-enemy pressure without any prior compound-resource rehearsal.
*   **Biggest shared rehearsal-debt concern:** Resource readiness and territory checks are taught in isolation and never compounded before synthesis challenges.
*   **Synthesizer judgment:** I am least confident in resolving the "Intro Purity vs. Ramp Smoothing" conflict. Codex makes a strong pedagogical case that jumping straight into compound conditions ruins the "satisfying small puzzle" feeling of learning a new block. Claude makes a mathematically compelling case that failing to do so causes the Challenge 22 cliff. The owner must decide which is worse.
