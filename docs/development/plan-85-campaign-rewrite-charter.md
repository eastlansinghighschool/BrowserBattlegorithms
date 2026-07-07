---
id: plan-85-campaign-rewrite-charter
title: "Campaign Rewrite Charter"
status: complete
depends_on: []
gate: "this charter IS the gate — no campaign rewrite implementation packet may run until the owner accepts the settled positions below; any change to a settled position requires owner sign-off"
superseded_by: null
resolution: "Accepted by the owner on 2026-07-07; downstream slate unlocked."
summary: >-
  Campaign Rewrite Charter: settled positions S1–S12 for the guided-campaign rewrite (board-dynamics taxonomy + lint, enemy bestiary, visible mini-arcs, earned-hint reveal policy, in-world voice contract, default star/par mastery layer with protected-level override, trace-based film review, degenerate-solution test standard, Plan 77 supersession, Tracker V2 amendment coordination, movement-helpers 11–14 pilot, two-tier protected levels). All five gate items resolved by adopting recommendations; initial 7-archetype bestiary roster recorded in Appendix A. Downstream slate Plans 86–98 unlocked.
---
# Plan 85: Campaign Rewrite Charter

- Packet id: Plan 85
- Packet title: Campaign Rewrite Charter
- Status: (see frontmatter)
- Owner/model: orchestration design contract (three-way: Claude orchestrator ideation A–F, Codex orchestrator guardrails, integration owner direction)
- Date: 2026-07-06
- Packet type: design / contract / docs
- Mutation level: docs-only
- Approval gate: this charter IS the gate — no campaign rewrite implementation packet may run until the owner accepts the settled positions below; any change to a settled position requires owner sign-off
- Expected artifacts:
  - this settled design contract
  - downstream packet slate defined below, with infrastructure packets ready and charter-dependent packets draft/gated until owner acceptance
  - `docs/development/README.md` index row
- Progress report folder: `reports/development/plan-85-campaign-rewrite-charter/`
- Progress report file: `reports/development/plan-85-campaign-rewrite-charter/progress.md`

## Why This Exists

The guided campaign teaches real concepts on dead boards with a designer's voice. Evidence, all already in the repo:

- **Boards are dead.** 39 of 46 guided levels place enemies frozen for 999 turns — 62 statue placements total. Students see no live opponent movement until Challenge 15, then hit the campaign's first documented cliff with zero live-enemy rehearsal behind them.
- **Copy narrates pedagogy from the designer's chair.** Student-facing text says things like "This level teaches…" and "beginner-friendly sensing target in this phase." Students reported the copy "smells of AI." The narration belongs in `docs/TeacherGuide.md`, not in the mission window.
- **Tips state solutions before play.** Level 18's tip gives away the entire puzzle. Prediction, debugging, and iteration — the packet-guidance pedagogy checks — are pre-empted by the level itself.
- **Standalone levels are trivially thin.** The Plan 75/76 audits (`reports/development/guided-level-complexity-audit/`) measured standalone lesson levels at ~3.5 solution blocks and ~0.8 decisions on average, against Challenge 22's 14 blocks and 6 decisions.
- **The unanimous fix was drafted against stale assumptions.** Plan 77 (pre-Challenge-22 compound uplift) was the #1 unanimous fast-track across all three Plan 76 synthesis models but was never implemented, and its board assumptions (frozen enemies stay frozen, single-level scope) predate this rethink.

This charter records the settled positions from the three-way orchestration conversation so the rewrite proceeds as a coherent program instead of piecemeal level patches. It is the same genre as Plan 84: a decisions record, not a work order. Implementation lives in the downstream slate.

## Settled Orchestration Positions

Each position below is an orchestration default in the style of Plan 84's B1–B7: settled unless the owner overrides at the acceptance gate.

### S1 — Board Dynamics Taxonomy

Every guided level gets authored metadata `boardDynamicsTier`, one of:

| Tier | Meaning |
|---|---|
| `static-prop` | Frozen object used as terrain or vocabulary; never moves |
| `background-motion` | Live movement that cannot interfere with the student's runner |
| `timing-threat` | Deterministic, recoverable live movement that makes a condition useful |
| `collision-threat` | A live enemy can capture or block the student's runner |
| `scrimmage-threat` | Multiple live enemies applying strategic pressure |

The tier is **both** authored metadata (source of truth for intent) **and** verified by a new lint rule that cross-checks the authored tier against the actual level setup (frozen flags, NPC behavior constants). Authored-only drifts; inferred-only can't express intent — so both, cross-checked.

Broad tier plan across the campaign: levels 1–5 `static-prop` (protected onboarding, see S12); most levels 6–14 default toward `background-motion`; most levels 16–21 default toward `timing-threat`; challenges and late project levels default toward `collision-threat` / `scrimmage-threat`. This is a planning default, not a blanket override: the protected-level rules in S12 are stronger than the broad tier plan, and downstream packets must assign final tiers level by level.

### S2 — Enemy Bestiary

Live enemies become named, legible archetypes with strictly deterministic rules students can reverse-engineer by watching — e.g. a "Sentry" that patrols a fixed lane. The existing `GUIDED_VERTICAL_PATROL` and `GUIDED_RANDOM_MOVE_ONLY` NPC behaviors seed the bestiary. Each sensing/condition concept pairs with an archetype whose behavior that concept reads. Scouting — watch first, code second — becomes a taught activity. Bestiary names replace generic "enemy runner" in student-facing copy. No hidden intent is revealed: the rules are learnable by observation, preserving prediction-as-strategy.

### S3 — Mini-Arc Semantics

Escalation arcs are consecutive ordinary level ids sharing a workspace via arc metadata — a generalization of the existing project shared-workspace mechanism — **not** hidden stages inside one level. Arc membership is visible to students ("Mission 4 — Part 2 of 3"): continuity is the point, not a surprise. Stage 2+ of an arc changes one board condition so the naive prior-stage solution fails; the arc's concept becomes necessary, not decorative.

### S4 — Reveal/Hint Policy

- Titles become mission-named, not concept-named ("This Or That" → mission framing).
- Pre-play prose hard cap: ~35 words.
- Static spoiler tips are removed. Hints become earned: a "Stuck?" affordance unlocks a tier-1 hint after 2 failed runs and a tier-2 hint after 4.
- Integration with the Plan 37/38 learning-moment classifier is a follow-up, not v1 — the classifier is not yet a per-level hint engine, and this charter does not pretend it is.
- Pedagogy-narration copy moves to `docs/TeacherGuide.md`.

### S5 — Voice Contract

Student-facing text has an in-world speaker (scout/coach). Rules:

- Every sentence contains only what a player inside the game could know.
- Never state the solution before play.
- Name specific board features, never abstractions.
- Banned phrases include "this level teaches", "beginner-friendly", "this is a good level for".
- Fragments allowed; uniform rhythm discouraged.
- Demo Blockly stays structural — no solution reveal (unchanged project contract).

Rewrites happen per-phase, **after** that phase's board changes land, so copy describes live boards rather than the boards being replaced. Each phase's rewrite has an explicit owner approval gate — voice is taste-sensitive.

### S6 — Stars/Par Mastery Layer

Default mastery model for eligible levels:

- ⭐ pass — the unchanged current floor.
- ⭐⭐ beat a generous turn par, seeded from Plan 74 reference-run turn data, then authored/reviewed — not purely generated forever.
- ⭐⭐⭐ meet an authored mastery criterion chosen from a **closed** vocabulary per level: `concept-used`, `no-wasted-resource`, `both-allies-active`, `no-collision`, `under-block-budget`.

The closed vocabulary keeps criteria testable, lintable, and trackable in Usage Tracker V2. Block budget is one option, not the default — the AP CSA bridge is clear correct conditions, not code golf.

Protected-level override: fully protected levels in S12 may expose only the pass star until the owner explicitly approves par/mastery criteria for them. Do not force stars 2/3 onto onboarding or pure-introduction levels just to keep the system uniform.

### S7 — Post-Level Film Review

After completing a level, show a short auto-generated recap from existing Plan 25a trace data: turns vs par, which program branches actually fired, which blocks never executed ("Your OR branch never fired — the left condition was always true"). v1 is text-only. Piloted in the first living-board pilot phase (S11).

### S8 — Degenerate-Solution Test Standard

Every complexity-uplift packet must include tests that the **old trivial solution fails** the new level — not only that the reference solution passes. (Plan 77 already carried this per-level; this makes it a standing standard.) The standard is added to `docs/packet-creation-guidance.md` when the first uplift packet lands.

### S9 — Plan 77 Disposition

Plan 77 is marked superseded — kept in place per repo convention (like Plan 25 → 25a/25b) — and replaced by a "Pre-Challenge 22 Living Resource Uplift" packet designed against this charter's board tiers (Plan 93 in the slate below). Its four target levels and compound-condition intent survive; its frozen-board assumptions do not.

### S10 — Usage Tracker V2 Coordination

Plan 84 remains the settled tracker contract, but must be amended **before** its downstream implementation runs: arc ids, stage position, star/mastery fields, and bestiary-encounter signals if cheap. Numbering note: this charter's packet numbering (85+) collides with Plan 84's internal references to "Plans 85–87" for tracker work; the amendment packet (Plan 91 below) renumbers those references. This is numbering housekeeping only — no decision content in Plan 84 changes without owner sign-off, per Plan 84's own gate.

### S11 — Pilot Scope

The first implementation wave is movement-helpers levels 11–14 **only**, ending at Challenge 15, testing living boards + reveal policy + voice + film-review v1 together. This pilot still respects S12: `move-toward-flag` participates as a protected baseline unless the owner later removes its fully protected status; active board-dynamics edits concentrate on the eligible levels in the arc (`bring-it-home`, `enemy-nearby`, `jump-the-gap`). Rationale:

- It terminates at the first documented cliff, so Challenge 15 pass/attempt rates give a built-in measuring stick.
- It exercises both `background-motion` and `timing-threat` tiers plus the flag-carry loop.
- The unanimous Plan 76 uplift candidate `enemy-nearby` lives here and is the pilot's one complexity-uplift target. The phase's other eligible levels (`bring-it-home`, `jump-the-gap`) participate for dynamics-tier and copy treatment only — their lesson shapes are protected per S12. (The other unanimous candidates, `my-side-their-side` and `find-the-enemy-flag`, sit outside this phase and are handled by Plan 93.)

Campaign-wide extension happens only after pilot review.

### S12 — Protected Levels

Protection has two tiers, keyed by **level id** (the repo's order-number vs title-number ambiguity has already caused drift; ids are unambiguous):

- **Fully protected — voice rewrite only:** `move-to-target`, `score-a-point`, `mirror-forward`, `human-runner-practice`, `move-toward-flag`. No dynamics, arc, or star-criterion changes beyond the pass star. These rules override the broad S1 tier plan and the default S6 star model. The foundations levels among these additionally stay `static-prop` per S1.
- **Complexity-protected — dynamics and voice allowed, lesson shape preserved:** the remaining Plan 75 audit protected list (`barrier-detour`, `watch-the-wall`, `find-the-human`, `bring-it-home`, `jump-the-gap`, `build-the-barrier`, `relay-race`, `bughunt-15`). These may gain `background-motion` and mission copy, but their win conditions, required solution shape, and core lesson stay unchanged. "Protected" in the Plan 75 audit meant *do not raise required complexity* — it was never a ban on making the board feel alive.

## Owner Decisions — Resolved 2026-07-07

All five gate items were resolved by adopting the recommendations:

1. Pilot phase: **movement-helpers 11–14** (S11). ✔
2. S6 star-criterion vocabulary: **adopted as the initial closed set**. ✔
3. Arc visibility framing: **"Part 2 of 3" naming** (S3). ✔
4. Bestiary: **adopted** (named archetypes, S2); initial roster in Appendix A below — archetype *rules* are contract, archetype *names* remain owner-taste and may be renamed before Plan 92 copy lands.
5. Film review (S7): **included in the pilot**. ✔

## Recorded For Later (Deferred, Out Of First Wave)

Explicitly deferred future-directions candidates — recorded so they are not re-litigated from scratch:

- **Robustness gauntlet mode.** Run the student program against N seeded enemy-placement variations; score = survival count. Teaches algorithm-vs-instance generalization.
- **Strategy-card exchange.** Export/import opponent programs via file for asynchronous classroom PvP, building on Plan 07 program-export crypto.
- **Student runner naming.**
- **Student-facing program-growth portfolio**, powered by the Plan 84 run-version store.
- **Strategy Brain arc reframe** — a separate design decision, per Plan 75/76 CLAUDE-C / synthesis; carried as Plan 98 below.

## Downstream Packet Slate

Candidates. Plans 86–90 are infrastructure/evidence packets that can be drafted before charter acceptance because they do not decide level content. Plans 91–98 are charter-dependent and must remain draft/gated until the owner accepts or revises S1–S12.

| Packet | Title | Notes |
|---|---|---|
| Plan 86 | Dynamic Board Evidence Upgrade | Decision-independent; in parallel draft |
| Plan 87 | Bootstrap Consumer Core Setup | Adopt Bootstrap packet-status core, manifest, and local compatibility shims before the rewrite wave |
| Plan 88 | Bootstrap Packet Frontmatter and Generated Index Migration | Convert packet docs/index to the Bootstrap status model |
| Plan 89 | Bootstrap Agent Prompts and Falsification Adoption | Bring in orchestrator/implementer/design-review/coverage-scan prompts and falsification-check convention |
| Plan 90 | Bootstrap Audit Closure and Path Hygiene Triage | Re-run Bootstrap audit, record adoption state, and triage path-hygiene issues |
| Plan 91 | Usage Tracker V2 Semantics Amendment | S10; runs before Plan 84's implementation packets; includes the old 85–87 renumbering housekeeping |
| Plan 92 | Pre-Challenge-15 Living Board Pilot (levels 11–14) | S11 pilot wave |
| Plan 93 | Pre-Challenge-22 Living Resource Uplift | Supersedes Plan 77 (S9) |
| Plan 94 | Copy Voice Contract + lint warnings | S5 rules as lint |
| Plan 95 | Phase Copy Rewrites | Per-phase, owner-gated (S5) |
| Plan 96 | Stars/Par V1 Implementation | Design settled here in S6 after owner gate |
| Plan 97 | Inversion Level Prototype | Locked program + preset perturbation choices, reusing the prediction-level interaction |
| Plan 98 | Strategy Brain Reframe Decision | Separate design decision |

## Authority And Contracts

Sources of truth this charter and its downstream packets must respect:

- `docs/GameSpecification.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md` / `docs/StudentGuide.md`
- `docs/ARCHITECTURE.md`, `docs/TESTING.md`
- `docs/subsystems/` — runtime contract notes; code/tests/docs that disagree are bugs
- `docs/development/plan-84-usage-tracker-v2-design-contract.md` — tracker contract, amended per S10 only
- `docs/packet-creation-guidance.md`
- Plan 75/76 evidence: `reports/development/guided-level-complexity-audit/`

Project decisions this charter does **not** redefine:

- One-action-per-turn execution and the `On Each Turn` model.
- Guided mode teaches one primary concept at a time; synthesis levels are marked "no new tools." Arcs (S3) rehearse a concept across stages; they do not add multiple new concepts per level.
- Demo Blockly shows structure, not the solution.
- AP CSA boolean-reasoning bridge remains the priority audience contract.
- Decentralized ally coordination through local sensing, roles, and state — bestiary legibility (S2) serves this, it does not replace it.
- Static Vite deployment, no server, no new dependencies without owner approval.
- Layer ownership: `src/core/` rules, `src/render/` drawing, `src/ui/` DOM, `src/ai/blockly/` Blockly, `src/ai/npc/` NPC logic.

## Required Reading

For any agent drafting a downstream packet from this charter:

- This charter end-to-end.
- `docs/packet-creation-guidance.md`
- `docs/development/plan-84-usage-tracker-v2-design-contract.md` (for Plans 91/96 coordination)
- `docs/development/plan-77-pre-challenge-22-compound-condition-uplift.md` (for Plan 93 — the superseded per-level specs remain useful raw material)
- Plan 75 audits and Plan 76 syntheses under `reports/development/guided-level-complexity-audit/`
- `docs/subsystems/blockly-workspace.md` and `docs/subsystems/turn-engine.md` for any packet touching boards or NPC behavior
- `rg boardDynamicsTier` before assuming the metadata does or does not exist yet.

## Scope

### In scope

- Recording the settled positions S1–S12, the open gate items, the deferred list, and the downstream slate.
- This file only.

### Out of scope

- Any source, test, level, copy, lint, or tracker change. All implementation belongs to Plans 86–98.
- Editing Plan 77 or Plan 84 (status/amendment changes land via Plans 93 and 91).
- Editing `docs/packet-creation-guidance.md` (S8 lands with the first uplift packet).

### Files and areas likely touched

- `docs/development/plan-85-campaign-rewrite-charter.md` (this file) — nothing else.

## Work Plan

1. Owner reads the charter and resolves the five open gate items.
2. Owner accepts, overrides, or rejects each settled position S1–S12. Overrides are edited into this file with a dated note, not tracked in side channels.
3. On acceptance: record the acceptance date in this file, add the README index row, and begin drafting/revising the charter-dependent downstream slate in dependency order (Plan 91 before any Plan 84 implementation packet; Plan 92 before campaign-wide extension; Plan 93 replaces Plan 77).
4. On rejection of any position: revise the charter, do not work around it.

## Validation Checklist

- [ ] This packet is docs-only; no code, tests, levels, or other docs changed.
- [ ] All twelve settled positions are recorded with enough specificity that a downstream packet can be drafted without re-opening the decision.
- [ ] The five open gate items are listed and none is silently treated as settled.
- [ ] The Plan 77 supersession path and Plan 84 amendment path are stated clearly.
- [ ] The Plan 84 numbering collision (85–87) is flagged for the Plan 91 amendment.
- [ ] Acceptance = owner confirms the settled positions and resolves the gate items; recorded in this file with a date before any downstream packet is drafted (Plan 86 excepted, decision-independent).
- [ ] No unrelated files were changed.

## Stop Conditions (for this charter and downstream packets, recorded here)

- Owner rejects a settled position → revise the charter; do not work around it in an implementation packet.
- Pilot evidence (Plan 92 review) contradicts a charter assumption — e.g. Challenge 15 pass rates worsen, or timing-threat boards prove unrecoverable for the protected-adjacent levels → stop, surface, revise before campaign-wide extension.
- Any implementation packet discovers the shared-workspace mechanism cannot generalize to arcs (S3) without engine changes → stop, surface; arc semantics are a curriculum-data decision, not an engine rewrite mandate.
- Any downstream packet finds a `docs/subsystems/*.md` note would become untrue → stop and surface per standing packet guidance.

## Appendix A — Initial Bestiary Roster (added 2026-07-07 on charter acceptance)

Orchestration proposal accompanying gate item 4. **Rules are the contract; names are owner-taste** and may be renamed any time before Plan 92's copy lands. Three archetypes wrap behaviors that already exist in `src/ai/npc/`; four are new. Every rule must be learnable by watching — that is the S2 test for admitting any future archetype.

| Archetype | Rule (student-observable) | Exists today? | Tier range | Concept it teaches | First appearance |
|---|---|---|---|---|---|
| **Dummy** | Never moves. Training prop. | `GUIDED_STAY_STILL` (rename/reframe of frozen statues where a statue is genuinely intended) | `static-prop` | Basic sensing without risk | Foundations (1–5) |
| **Sentry** | Walks a fixed route, never deviates. Route varies per level (vertical lane today; horizontal / rectangle circuit as authored routes). | `GUIDED_VERTICAL_PATROL` (extend to authored waypoint routes) | `background-motion` → `timing-threat` | Timing; above/below sensing; "wait for the gap" | Pilot (11–14), background |
| **Wanderer** | Moves one random step each turn, stays inside its zone. *No pattern — you cannot time it, you must sense it.* | `GUIDED_RANDOM_MOVE_ONLY` (add zone bound) | `background-motion` → `timing-threat` | Why sensors beat memorized routes | Bug hunts; sensing refreshers |
| **Guard** | Stands at a post. If you come within K cells, it steps toward you; leave the radius and it returns to post. | New — simple deterministic rule over existing distance helpers | `timing-threat` → `collision-threat` | Distance (`enemy-nearby`, `count-within`) made visible: its aggro radius *is* the concept | Pilot uplift target `enemy-nearby` (Plan 92) |
| **Charger** | Stands still until a runner enters its row/column, then charges straight down that line; stops at walls/barriers. | New — deterministic trigger + straight-line move | `collision-threat` | Row/column alignment; jump-to-dodge; gives barriers and freeze a real purpose (block or stop a charge) | Pre-Challenge-22 wave (Plan 93: `jump-if-ready`, `build-the-barrier`, `freeze-the-lane`) |
| **Raider** | Runs the shortest path to your flag; if it grabs it, runs home. | New — deterministic reuse of `calculateMoveTowardsTarget` (`src/ai/npc/pathing.js`); a simplified, fully deterministic cousin of the Free Play attacker | `collision-threat` → `scrimmage-threat` | Flag-state awareness, interception, defense roles; makes the Plan 67 own-flag-home rule matter in guided play | Team Strategy Script defense levels; Challenge 22+ |
| **Shadow** | Mirrors your ally's moves (flipped) each turn. Moves only when you move. | New — needs last-player-action access; slightly more engine coupling | `background-motion` → `timing-threat` | Prediction and relative direction; cause-and-effect of your own program | Prediction checkpoints; inversion prototype (Plan 97). Defer if coupling cost is high |

Interpretation note for S2: the Wanderer's movement is random, not deterministic — but its *rule* ("random one step, never leaves its zone, never chases") is fully legible, which is what S2 actually requires. S2's "strictly deterministic" phrasing is satisfied by six of seven archetypes; the Wanderer is the deliberate exception whose lesson is that unpredictable things must be sensed, not timed. Determinism in guided *tests* is preserved via the existing seeded `state.randomFn` harness convention.

Rollout guidance: Plan 92 needs Dummy, Sentry, and Guard only. Charger and Raider land with Plan 93 and the Team Strategy Script wave respectively. Shadow is optional and gated on the Plan 97 prototype. Do not build archetypes ahead of the level that needs them.
