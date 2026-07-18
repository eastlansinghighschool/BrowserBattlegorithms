---
id: plan-104
title: "Field Decisions Identity And Continuity"
status: complete
depends_on: [plan-98]
gate: "orchestration review before the Plan 95 advanced-logic copy dispatch"
superseded_by: null
resolution: "Verified Field Decisions visible identity, six-step continuity, stable strategy-brain persistence, accurate Challenge 28 framing, and Team Strategy Script handoff; corrected one stale active teacher-facing reference during orchestration review."
summary: >-
  Implement the approved Field Decisions visible identity and project-continuity UI for the existing one-ally strategy-brain arc while preserving its stable project id, shared workspace, mechanics, and later Team Strategy Script role boundary.
---
# Plan 104: Field Decisions Identity And Continuity

## Packet Metadata

- Packet id: `plan-104`
- Packet title: Field Decisions Identity And Continuity
- Status: (see frontmatter)
- Owner/model: bounded frontend/content implementer
- Date: 2026-07-16
- Packet type: feature / content / integration
- Mutation level: source-code, tests, docs
- Approval gate: orchestration review before the Plan 95 `advanced-logic` copy dispatch
- Depends on: Plan 98 complete
- Expected artifacts:
  - stable-id / visible-label implementation
  - Field Decisions continuity signifiers
  - focused tests and browser verification
  - aligned project/workspace docs
  - progress report

## Goal

Implement Plan 98's approved project identity: students see **Field Decisions**, a six-step project where one Blockly-controlled ally keeps and revises one local-rules program. Preserve the internal `strategy-brain` id and its localStorage keys. Make project continuity visible enough that a student understands that the same program carries forward, without performing Plan 95's complete Levels 23-28 voice rewrite.

## Non-goals

- Do not rename the internal `strategy-brain` id or migrate/delete localStorage keys.
- Do not add a second coded ally or runner-index logic to Levels 23-28.
- Do not change boards, NPCs, toolboxes, win/failure conditions, fixtures, Blockly XML, or Boolean complexity.
- Do not redesign Team Strategy Script.
- Do not perform the complete advanced-logic prose pass; Plan 95 owns that work after this packet lands.
- Do not implement Challenge 28 film review or usage tracking.

## Why This Packet Exists

Plan 98 found that the runtime arc is already a coherent one-ally shared-workspace project, but its student-facing identity overpromises a central “brain” and under-signals preservation and revision. The owner selected Option 3 and approved **Field Decisions** as the complete visible name. This packet settles that identity/UI contract before Plan 95 rewrites the phase copy.

## Authority And Contracts

Required reading:

- `AGENTS.md`
- `docs/development/plan-98-strategy-brain-reframe-decision.md`
- `reports/development/plan-98-strategy-brain-reframe-decision/strategy-brain-reframe-decision.md`
- `docs/development/plan-95-phase-copy-rewrites.md`
- `docs/CopyVoiceContract.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/ui-mode-contract.md`
- `src/config/levels/shared/project.js`
- `src/ui/projectSignifiers.js`
- Levels 23-28 under `src/config/levels/phases/advanced-logic/`
- focused project/workspace/UI tests located with `rg "strategy-brain|Strategy Brain|projectSignifiers|project-start" tests src`

Contracts to preserve:

- Internal project id remains exactly `strategy-brain`.
- Existing `bba:guided-project-workspace:strategy-brain` and project-callout keys remain valid.
- Field Decisions has one Blockly-controlled ally; Challenge 28 also has a human-controlled runner.
- Runner-index roles begin in Team Strategy Script, not Field Decisions.
- Shared project code persists across Levels 23-28 and backward navigation.
- Demo Blockly remains structural and no exact solution is revealed.
- Static Vite deployment and accessibility behavior remain intact.

## Scope

### In Scope

- Change the visible project label from Strategy Brain to Field Decisions while retaining the internal id.
- Make the project indicator/callout communicate that one saved ally program carries through six project steps and should be revised as field conditions change.
- Show meaningful stage continuity, such as `Step N of 6`, using project metadata rather than level-number string parsing.
- Ensure accessible names/text expose Field Decisions and stage information without relying on color or icon alone.
- Make only the minimum Levels 23/28 identity and transition edits needed to avoid visible contradictions before Plan 95:
  - Level 23 introduces Field Decisions and the carried-forward one-ally program.
  - Challenge 28 describes human-plus-ally play, not “solo” execution.
  - The handoff says Team Strategy Script will run one shared program on several allies and introduce runner-index roles.
- Replace remaining student-visible `Strategy Brain` identity tokens in Levels 23-28, but do not broadly rewrite their prose.
- Update authoritative docs and subsystem notes so visible label and internal id are clearly distinguished.
- Add focused tests for label, stage continuity, stable id/key behavior, and escaped/accessibility-safe rendering.

### Out Of Scope

- Broad copy polishing beyond identity/continuity contradictions.
- Mechanics, level geometry, reference/project fixtures, behavior evidence, or challenge difficulty.
- Workspace migration or compatibility fallback code; none is needed because the id does not change.
- New dependencies, server code, deployment, or analytics.

## Implementation Requirements

### 1. Stable Identity Split

- Set the student-visible project label to `Field Decisions`.
- Keep `STRATEGY_BRAIN_PROJECT.id === "strategy-brain"`.
- Preserve existing storage-key construction and prove it with a focused test.
- If metadata needs a step total, add it declaratively to project metadata; do not hardcode level ids in UI rendering.

### 2. Student-Legible Continuity

- The project indicator must identify Field Decisions and show the current step out of six.
- The project-start callout must plainly say that blocks carry forward and students revise the same ally program as the field changes.
- Keep the copy short, concrete, and in the Plan 94 scout/coach voice. Do not discuss curriculum sequencing or implementation internals.
- Do not imply that one central program directly commands several allies in this project.

### 3. Bounded Source-Copy Alignment

- Use `rg "Strategy Brain|solo" src/config/levels/phases/advanced-logic src/ui` to find visible contradictions.
- Make exact identity/continuity corrections only.
- Record every touched level prose field in the progress report so Plan 95 can distinguish foundation edits from its complete voice pass.

### 4. Documentation Tail

- Update `docs/subsystems/blockly-workspace.md` with the visible-label/internal-id distinction and any metadata/UI contract added here.
- Update `docs/subsystems/ui-mode-contract.md` if the project indicator or callout contract changes.
- Update `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`, `docs/TeacherGuide.md`, and `docs/StudentGuide.md` wherever students/teachers would otherwise see the stale project name or wrong solo/team description.
- Do not rewrite historical packet/report evidence merely because it uses the old historical name.

## Validation Checklist

- [ ] `node scripts/dev/plan-status.js check plan-104` passes before work.
- [ ] Internal project id and storage keys remain unchanged.
- [ ] Field Decisions and `Step N of 6` appear in the appropriate visible project UI.
- [ ] Challenge 28 copy distinguishes the human runner from the one coded ally.
- [ ] Team Strategy Script remains the first runner-index role project.
- [ ] Focused project/workspace/UI tests pass.
- [ ] `npm run lint:levels` introduces no new errors or copy-voice warnings in Levels 23-28.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Browser verification covers project start, a middle step, Challenge 28, narrow viewport, and keyboard/screen-reader-visible text when practical.
- [ ] Relevant subsystem notes still read true.
- [ ] Progress report exists at `reports/development/plan-104-field-decisions-identity-continuity/progress.md`.

## Stop Conditions

Stop and report if:

- Any implementation path requires changing `strategy-brain` or migrating storage.
- Stage continuity requires inferring project membership from titles or level numbers.
- The work starts changing boards, Blockly structures, fixtures, or Team Strategy Script behavior.
- Existing source makes the approved one-ally/human-plus-ally distinction untrue.
- The packet would need to perform Plan 95's whole-phase prose rewrite to achieve consistency.

## Progress Report

`reports/development/plan-104-field-decisions-identity-continuity/progress.md`

