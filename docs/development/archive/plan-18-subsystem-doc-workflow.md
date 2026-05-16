# Plan 18 — Wire Subsystem Notes Into The Packet Workflow

- Packet id: plan-18
- Packet title: Wire Subsystem Notes Into The Packet Workflow
- Status: ready
- Owner/model: integration owner + mini-model implementer
- Date: 2026-05-13
- Packet type: docs
- Mutation level: docs-only
- Approval gate: before mutation (the implementing agent must show its proposed wording inline before editing either file)
- Expected artifacts:
  - revised `docs/packet-creation-guidance.md`
  - revised `docs/development/00-mini-packet-agent-starting-prompt.md`
  - revised `docs/development/00-orchestrator-thread-starting-prompt.md`
  - progress report at `reports/development/plan-18-subsystem-doc-workflow/progress.md`
- Progress report folder: `reports/development/plan-18-subsystem-doc-workflow/`
- Progress report file: `progress.md`

## Goal

Make `docs/subsystems/*.md` notes load-bearing in the packet workflow: implementation agents are routed to them before touching code, and packets are required to keep them true. Encode the lesson from Plan 17 that runtime contracts live in the subsystem notes, not just in source.

## Why this packet exists

Plan 17 produced seven subsystem notes that act as the source of truth for runtime contracts (Blockly workspace, UI mode contract, turn engine, file pipelines, usage/admin, NPC/CPU, p5 surface). That investment only pays off if:

- implementation agents read the relevant note before changing the corresponding code,
- orchestrators cite the matching note when sequencing packets and reviewing implementation reports, and
- packets that change behavior keep the note true rather than letting it drift.

During Plan 17 itself a related source fix (`src/core/collisions.js` map-side defender) landed cleanly in code and in `GameSpecification.md`, but the matching subsystem note was left stale until an orchestrator caught it. That's the exact failure mode this packet prevents.

## Non-goals

- No new subsystem notes. The set from Plan 17 stays as is.
- No changes to existing packets (Plans 01–17).
- No "every packet must update docs" mandate. The contract is *if you change what a note describes, the note must remain true* — not *every packet adds a doc section*. Force the wrong rule and notes bloat to satisfy checklists.

## Authority and contracts

- `docs/packet-creation-guidance.md`, `docs/development/00-mini-packet-agent-starting-prompt.md`, and `docs/development/00-orchestrator-thread-starting-prompt.md` are the only files this packet touches.
- The seven subsystem notes are not modified; this packet only changes the workflow that points at them.
- The wording added must respect Plan 17's "one owner per fact" rule. The contract goes in `packet-creation-guidance.md`; the routing goes in the two starting prompts. Don't duplicate the contract into the prompts.

## Required reading

- `docs/packet-creation-guidance.md` — entire file.
- `docs/development/00-mini-packet-agent-starting-prompt.md` — entire file.
- `docs/development/00-orchestrator-thread-starting-prompt.md` — entire file.
- `docs/ARCHITECTURE.md` — the Subsystem Map section.
- `docs/subsystems/` directory listing (no need to read each note; just know they exist).
- `docs/development/plan-17-doc-cleanup.md` — for context on why the notes exist.
- `reports/development/plan-17-doc-cleanup/progress.md` — for the collision-tail incident that motivated this packet.

## Scope

**In scope:**
- Promote subsystem notes to authoritative status alongside ARCHITECTURE in the packet contract.
- Add a rule that packets which change behavior described in a subsystem note must keep the note true or surface the conflict and stop.
- Add matching items to the validation checklist and stop conditions.
- Add subsystem-note routing to the mini-packet starting prompt's orientation reading and per-task workflow.
- Add subsystem-note routing to the orchestrator starting prompt's orientation reading, packet-creation rules, and review-of-other-models step.

**Out of scope:**
- Editing the subsystem notes themselves.
- Changing other packets' validation checklists retroactively.
- Any source-code or test changes.

**Files touched:**
- `docs/packet-creation-guidance.md`
- `docs/development/00-mini-packet-agent-starting-prompt.md`
- `docs/development/00-orchestrator-thread-starting-prompt.md`
- `reports/development/plan-18-subsystem-doc-workflow/progress.md`

## Implementation requirements

### Requirement 1 — Promote subsystem notes in `packet-creation-guidance.md`

In the "Authority And Contracts" section, the bullet list that names sources of truth currently lists product/pedagogy docs and architecture/testing docs. Add subsystem notes as a peer authority. Suggested wording (the implementing agent should propose final text inline before editing):

> - Subsystem runtime contracts:
>   - `docs/subsystems/` — each note is the authoritative source of truth for the runtime contract it covers. Code, tests, and other docs that disagree with a subsystem note are bugs.

Place this entry adjacent to the "Architecture and testing" group so the grouping reads naturally.

### Requirement 2 — Add the doc-tail rule to "Implementation Requirements"

The "Implementation Requirements" section asks each requirement to include behavior, constraints, edge cases, and expected artifacts, and lists pedagogy checks. Add a new check (not a new top-level section) phrased roughly as:

> - Does this packet change behavior described in a `docs/subsystems/*.md` note? If yes, the packet must either include the matching note update in the same patch, or stop and surface the conflict for owner review. Silent divergence from a subsystem note is not allowed.

The wording should make clear that this is conditional ("if yes"), not a mandate that every packet touches docs.

### Requirement 3 — Add a validation-checklist item

In the "Validation Checklist" section, add an item near the existing doc-alignment items:

> - [ ] If the packet changed behavior described in a subsystem note, the note still reads true post-change (or the conflict was surfaced and approved).

Do not require every packet to check every subsystem note. The check is conditional on whether the packet touched behavior a note describes.

### Requirement 4 — Add to "Stop Conditions"

Append to the stop-conditions list:

> - the packet change invalidates a statement in a `docs/subsystems/*.md` note and the corrected wording requires pedagogy, architecture, or contract judgment beyond the packet scope

### Requirement 5 — Route the mini-packet starting prompt to subsystem notes

In `docs/development/00-mini-packet-agent-starting-prompt.md`:

- In the orientation reading list (the "Before the first packet assignment" step that names skim files), add a single line directing the agent to the subsystem index. Suggested form:
  > - `docs/subsystems/` — runtime-contract reference notes; skim the index in `docs/ARCHITECTURE.md` so you know which note covers which subsystem

- In the "When a packet or follow-up task is assigned" step, after the existing "read required references" instruction, add a new sub-step:
  > - Before changing code in an area covered by a subsystem note (Blockly workspace, UI mode contract, turn engine, file pipelines, usage/admin, NPC/CPU, p5 surface), read the matching `docs/subsystems/*.md` note for the current contract. If your change will make that note untrue, plan to update the note in the same patch or surface the conflict before editing.

Keep the additions tight. The starting prompt is already dense; do not let these additions balloon into paragraphs.

### Requirement 6 — Route the orchestrator starting prompt to subsystem notes

In `docs/development/00-orchestrator-thread-starting-prompt.md`:

- In the "First Orientation Pass" skim list, add a single line directing the orchestrator to the subsystem index. Suggested form:
  > - `docs/subsystems/` — runtime-contract reference notes; know which note covers which subsystem so you can cite the right one when scoping packets and reviewing reports

- In the "Packet Creation Rules" section, append a bullet:
  > - When a proposed packet would change behavior described in a `docs/subsystems/*.md` note, name the relevant note in the packet's required reading and include the doc-tail expectation per `docs/packet-creation-guidance.md`. Do not let an implementation packet land that silently invalidates a subsystem note.

- In the "When reviewing another model's work" list, append a bullet:
  > - Verify any subsystem note touched by the work still reads true post-change; the Plan 17 collision-tail incident is the canonical example of why this matters.

Same length discipline applies: tight additions, no paragraphs.

## Work plan

1. Read both target files in full.
2. Draft the exact wording for all five requirements and post it inline in the progress report.
3. **Stop for owner approval of wording before editing either file.**
4. After approval, apply the edits in a single pass per file.
5. Verify the edits read naturally in context (no broken markdown, no orphaned bullets).
6. Run validation.
7. Write the final progress report entry.

## Commands

```powershell
npm test
npm run build
```

These commands should pass unchanged because no source or test files are modified. Running them confirms the docs-only patch did not accidentally touch anything else.

## Validation checklist

- [ ] `docs/packet-creation-guidance.md` Authority And Contracts section lists `docs/subsystems/` as an authoritative source.
- [ ] `docs/packet-creation-guidance.md` Implementation Requirements includes the conditional doc-tail check.
- [ ] `docs/packet-creation-guidance.md` Validation Checklist includes the conditional subsystem-note-freshness item.
- [ ] `docs/packet-creation-guidance.md` Stop Conditions includes the subsystem-note-invalidation stop.
- [ ] `docs/development/00-mini-packet-agent-starting-prompt.md` orientation reading mentions `docs/subsystems/`.
- [ ] `docs/development/00-mini-packet-agent-starting-prompt.md` per-task workflow tells the agent to read the matching subsystem note before changing code in a covered area.
- [ ] `docs/development/00-orchestrator-thread-starting-prompt.md` orientation reading mentions `docs/subsystems/`.
- [ ] `docs/development/00-orchestrator-thread-starting-prompt.md` packet-creation rules require that packets touching subsystem-covered behavior name the matching note in required reading.
- [ ] `docs/development/00-orchestrator-thread-starting-prompt.md` review checklist includes verifying subsystem notes still read true post-change.
- [ ] None of the seven subsystem notes were modified by this packet.
- [ ] No files under `src/` or `tests/` were modified.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Progress report records the approved wording and the final diff summary.

## Stop conditions

Stop and ask the integration owner before continuing if:

- the proposed wording would change the packet workflow in any way beyond the five requirements above (scope creep)
- an existing section in `packet-creation-guidance.md` already covers the rule and the right move is to amend it rather than add a new bullet
- the starting prompt additions would push it past comfortable length and a different file (e.g. a separate quick-reference) would serve better
- a subsystem note is found to already be stale during the reading pass — surface it but do not fix it here; that is a separate task

## Model-specific instructions

- This is a small, high-leverage packet. Wording matters more than speed. Draft and pause for owner approval before editing.
- Do not invent additional rules or sections. The five requirements above are the entire scope.
- Do not paraphrase the suggested wording into something looser; the conditional framing ("if yes") is load-bearing.
- Keep both files readable. If an edit makes a section feel cluttered, propose a reorganization in the progress report instead of forcing the bullet in.
