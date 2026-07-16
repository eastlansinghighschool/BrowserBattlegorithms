# Plan 98: Strategy Brain Reframe Decision

## Decision Summary

**Recommendation: reframe Strategy Brain as a visible, named project arc about building and revising one ally's local decision rules. Keep runner-index role assignment in the subsequent Team Strategy Script project.**

This is not a recommendation to add a second coded ally to Strategy Brain. The current arc is a one-ally Boolean and sensing project; its strongest honest promise is accumulated rule design, not team coordination. The next project already supplies the shared-program, multi-ally, runner-index progression. Keeping that boundary makes the curriculum clearer and preserves the decentralized coordination goal rather than introducing a premature central-controller metaphor.

The approved follow-up is a bounded reframe-and-evidence packet, not a source edit in this scan. It should make project continuity and adaptation explicit at Levels 23-28, use the student-facing project name **Field Decisions**, and define a manual/film-review evidence protocol for Challenge 28's live-human capstone. The visible-name change preserves the stable `strategy-brain` project id; changing that id would change the localStorage workspace and callout keys and therefore requires a separate migration decision.

## Current Project-Arc Story

Strategy Brain starts at Level 23, `closest-threat`, as the first project-tagged advanced-logic level. It keeps one shared Blockly workspace while students add distance/comparison reasoning, two-condition decisions, OR, and NOT through Levels 24-27, then trace a Boolean bug before Challenge 28, `full-team-tactics`. The product story is therefore a growing decision program: students revise prior code rather than reset for isolated puzzles. The UI reinforces that this is a project and that changes persist across its levels.

The current story is only partly legible to a student. The project UI says that code is shared, but several level briefings still frame each level as a new block lesson or identify exact tactics. Plan 76 found that the cumulative Strategy Brain fixture has only six blocks at the capstone and that Challenge 28 cannot produce automated runtime evidence because it requires live human input. Challenge 28 is therefore not literally solo play: one Blockly-controlled ally runs local rules while the student also drives the human runner. Those facts do not prove the project is ineffective, but they do mean the current labels and fixture evidence cannot substantiate a strong claim that the arc has already become a rich coded-team strategy project.

## What Students Coordinate Today

### Strategy Brain (Levels 23-28)

- One Blockly-controlled ally applies a local rule each turn.
- Students use sensing, distance/comparisons, Boolean composition, flag state, and helper actions to decide the first action that fires.
- Shared workspace persistence asks students to preserve or adapt earlier rules.
- Challenge 28 adds live human input and a fuller match, but its behavior evidence is explicitly not applicable to automated simulation.

This is valid preparation for decentralized coordination, but it is **not** runner-index role coordination: the same one ally is making local decisions, and there is no teammate program role to divide.

### Team Strategy Script (Levels 29-37)

- One shared program runs on two, then three, coded allies.
- `runner index` assigns distinct local roles; carrier state, nearest-enemy targeting, freeze, barriers, and jump resources give roles different field conditions.
- The capstone asks the team to score in a live scrimmage while any ally may complete the point.

This later arc is the appropriate home for explicit role assignment. Its project metadata, runner counts, and reference evidence support the claim more directly than Strategy Brain's one-ally project does.

## Rehearsal Assessment

| Capability | Current evidence | Assessment |
| --- | --- | --- |
| Local sensing and first-action decisions | Strategy Brain Levels 23-27 introduce distance, comparisons, AND/OR/NOT, and continue one workspace. | Present, but continuity is under-signaled in level framing. |
| Boolean composition | The sequence exists; Plan 76 found disagreement over whether it needs deeper source-level composition. | Do not increase Boolean complexity as part of a reframe. Treat this as a separate owner decision. |
| Shared-workspace adaptation | Project metadata and UI persist code across the arc; current tests document cumulative exceptions for early checkpoints. | Real runtime contract, but students need clearer preservation/adaptation prompts. |
| Runner-index roles | Rehearsed in the prediction checkpoint and Team Strategy Script, beginning after Strategy Brain. | Not a Strategy Brain capability; do not claim otherwise. |
| Local-rule coordination | Stronger in Team Strategy Script where roles react to carrier/enemy/resource state. | Preserve the handoff: local rules first, role-based coordination second. |
| Live-board strategic pressure | Plan 86 gives stable evidence tooling; Challenge 28 remains a live-human evidence exception. | Any future Challenge 28 claim needs a manual/film-review protocol, not a fabricated automated pass result. |

## Diagnosis

The issue is primarily **framing and evidence**, with a possible later mechanics question. It is not currently justified as a full structural redesign.

- **Framing:** “Strategy Brain” and capstone language can imply a whole-team brain, while the project is mostly a single ally accumulating local Boolean rules.
- **Sequencing:** The conceptual handoff into Team Strategy Script is sound but should be explicit: a reliable local rulebook is the prerequisite for shared-program roles.
- **Mechanics:** There is no evidence that adding another coded ally to Levels 23-28 is necessary. That would overlap the following project, increase fixtures and collision interactions, and risk obscuring the Boolean focus.
- **Evidence:** Existing project fixtures validate persistence/contracts, and Plan 86 makes generated evidence stable. Challenge 28's `WAIT_FOR_INPUT` boundary remains intentional and needs a different evidence method.

## Owner Options

### Option 1: Leave Strategy Brain As-Is

Keep the name, current level framing, project UI, and source unchanged.

**Benefits:** no implementation cost; preserves the present Boolean sequence.

**Costs:** the project may continue to read as a sequence of fresh micro-puzzles; “strategy” remains broader than the one-ally mechanics demonstrate; Challenge 28's evidence boundary remains unexplained to curriculum reviewers.

### Option 2: Copy-Only Boolean Toolkit Reframe

Rename/rewrite Strategy Brain as a Boolean toolkit project and explicitly tell students to preserve and adapt their rule set.

**Benefits:** lowest implementation risk; makes persistence legible; no board, fixture, or toolbox changes.

**Costs:** understates the authentic local sensing/decision-strategy work; can make the project feel like a vocabulary unit rather than an applied program.

### Option 3: Named Local-Rules Project Arc (Recommended)

Keep the current one-ally mechanics and shared workspace, but make the project visibly about building a reusable local rulebook. Use the approved visible name **Field Decisions**, show stage continuity, and frame the final live match as testing how a rulebook holds up under changing field conditions. Add an explicit transition to Team Strategy Script: the next arc runs one program on several allies and uses runner index for roles.

**Benefits:** truthful to the current mechanics; strengthens preservation/adaptation; makes the decentralized progression legible; avoids duplicating Team Strategy Script; compatible with static deployment and existing workspace contracts.

**Costs:** requires a carefully bounded UI/copy/project-metadata implementation packet and manual Challenge 28 evidence protocol; does not itself solve any separately approved Boolean-composition or living-board mechanics question.

### Option 4: Structural Second-Ally Strategy Brain Redesign

Add a second Blockly-controlled ally and runner-index roles within Strategy Brain.

**Benefits:** makes a literal team-strategy claim sooner.

**Costs:** high blast radius across boards, reference/project fixtures, win conditions, behavior evidence, accessibility/tutorial scaffolding, and the subsequent Team Strategy Script arc. It duplicates the later role curriculum and risks central-command framing. **Not recommended without a new owner-approved design packet.**

## Interaction With Other Work

### Living Boards

Do not couple this reframe to unapproved board-dynamics changes. Plan 92's pilot and Plan 86's stable evidence tooling provide the correct process: name only observable archetype behavior, retain a reference-pass plus naive-failure proof where complexity changes, and distinguish background motion from collision pressure. A future Strategy Brain living-board proposal must be a separate level-design decision.

### Stars And Film Review

Plan 85's stars/par and film-review direction can reinforce the project only after their own implementation decisions land. A later arc implementation may display project progress or recap which local branches fired, but it must not use a block-count target as a proxy for strategy quality. Fully preserve the one-action-per-turn rule and structural-demo-only contract.

### Usage Tracking

Usage Tracker V2 already has the charter-level reason to retain arc/project identifiers and stage position. If Option 3 is approved, its implementation should verify that the chosen visible project/arc identity maps cleanly to existing project IDs and does not create a new private-data requirement. Possible future measures are stage revisits, project workspace edits, and manual capstone outcome capture; none should be interpreted as learning effectiveness without cohort review and truncation caveats.

### Plan 95 Copy Sequencing

Plan 95 owns the campaign's phase-level student-copy rewrite. If Option 3 is approved, the reframe packet should settle the project identity, continuity contract, UI signifiers, and transition language first while avoiding a competing whole-phase prose pass. The Plan 95 `advanced-logic` dispatch should then consume that settled contract and perform the complete voice rewrite for Levels 23-28. The `advanced-teamplay` copy dispatch should follow only after the handoff language between the two projects is settled.

## Downstream Packet Slate (High Level)

1. **Strategy Brain local-rules reframe implementation** (only if Option 2 or 3 is approved): settle the student-facing project identity, continuity contract, transition to Team Strategy Script, and any project-indicator changes; preserve the `strategy-brain` project id and source mechanics unless separately authorized. Author the contract and only the minimum UI copy needed for it; defer the complete Levels 23-28 voice pass to Plan 95.
2. **Challenge 28 capstone evidence protocol**: define a teacher/manual film-review or playtest record for the live-human capstone, explicitly separate from automated fixture evidence.
3. **Strategy Brain Boolean-composition decision** (optional): decide whether the existing AND/OR/NOT sequence needs a separate source-level uplift; do not bundle it into reframe work.
4. **Team Strategy Script local-rule review** (deferred): revisit only after the Strategy Brain direction is accepted; protect the current healthy role arc unless new evidence justifies change.

## Owner Decisions Resolved

1. Adopt Option 3, the named one-ally local-rules project arc.
2. Use **Field Decisions** as the complete student-facing project name; do not retain “Strategy Brain” in the visible label.
3. Keep one coded ally in Field Decisions and reserve runner-index role assignment for Team Strategy Script.
4. Create a separate manual/film-review evidence protocol for Challenge 28 before making claims about live capstone performance.
5. Defer Boolean-composition depth and living-board changes to separate future decisions.
6. Change the visible label only and preserve the stable `strategy-brain` id; no workspace-key migration is approved.

## Owner Direction Recorded 2026-07-16

The owner selected **Option 3: Named Local-Rules Project Arc** as the implementation direction. The approved complete student-facing name is **Field Decisions**. “Strategy Brain” remains only in internal historical references and the stable `strategy-brain` project id unless the owner later approves a separate workspace-key migration.

## Evidence And Limits

- Project metadata and UI currently establish real shared workspaces and project-start persistence messaging.
- Plan 73's dossiers use project fixtures for project-step/final complexity because ordinary reference XML is not the primary project evidence.
- Plan 74 and the current behavior evidence classify Challenge 28 as not applicable for automated simulation because of live human input; that is an instrumentation boundary, not a failure.
- Plan 86's repaired generator provides stable behavior evidence for runnable cases, including live-NPC timelines and block coverage.
- Plan 75/76 identified the same Strategy Brain concern but differed on severity: one synthesis favored preservation/adaptation framing, while another offered a high-risk second-ally fork. This recommendation chooses the lowest-risk path that stays truthful to the current curriculum.

## Source References

- [Plan 98 packet](../../../docs/development/plan-98-strategy-brain-reframe-decision.md)
- [Plan 85 campaign rewrite charter](../../../docs/development/plan-85-campaign-rewrite-charter.md)
- [Plan 76 Codex synthesis](../../guided-level-complexity-audit/syntheses/codex-plan76-synthesis.md)
- [Plan 76 Claude synthesis](../../guided-level-complexity-audit/syntheses/claude-opus-synthesis.md)
- [Strategy Brain capstone dossier](../../guided-level-complexity-audit/level-dossiers/33-full-team-tactics.md)
- [Strategy Brain capstone behavior evidence](../../guided-level-complexity-audit/behavior-evidence/33-full-team-tactics.md)
- [Team Strategy Script capstone dossier](../../guided-level-complexity-audit/level-dossiers/44-advanced-scrimmage.md)
- [Team Strategy Script capstone behavior evidence](../../guided-level-complexity-audit/behavior-evidence/44-advanced-scrimmage.md)
- [Blockly workspace subsystem contract](../../../docs/subsystems/blockly-workspace.md)
- [Turn engine subsystem contract](../../../docs/subsystems/turn-engine.md)
