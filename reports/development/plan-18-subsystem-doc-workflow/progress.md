# Plan 18 Progress Report — Wire Subsystem Notes Into The Packet Workflow

## Status

Wording drafted. Stopped per approval gate. No files have been edited yet.

## Reading pass notes

All three target files read in full.

### `docs/packet-creation-guidance.md`

- "Authority And Contracts" has three groups: Product and pedagogy, Architecture and testing, Current packet tracking.
- Subsystem notes group goes between Architecture/testing and Current packet tracking.
- "Implementation Requirements" ends with a pedagogy checklist (`Include pedagogy checks when...`). The doc-tail check lands as a conditional paragraph after that list.
- "Validation Checklist" ends with three general items (no unrelated files, final report). Subsystem freshness check lands before the final-report item.
- "Stop Conditions" ends with `production deployment or repository settings changes are needed`. New stop appends to that list.

### `docs/development/00-mini-packet-agent-starting-prompt.md`

- "Before the first packet assignment" step 1 is a skim list. One line appended to that list.
- "When a packet or follow-up task is assigned" step 2 is "Read required references named by the packet." The subsystem-routing sub-step attaches to step 2 as an indented bullet.

### `docs/development/00-orchestrator-thread-starting-prompt.md`

- "First Orientation Pass" is a flat bullet list. One line appended.
- "Packet Creation Rules" is a flat bullet list. One bullet appended.
- "When reviewing another model's work" is a flat bullet list. One bullet appended.

No stop conditions triggered during reading. No stale subsystem notes found.

---

## Proposed wording — all six requirements

### Requirement 1 — Promote subsystem notes in `packet-creation-guidance.md` Authority And Contracts

In the bullet group list, between "Architecture and testing" and "Current packet tracking", add:

```
- Subsystem runtime contracts:
  - `docs/subsystems/` — each note is the authoritative source of truth for the runtime contract it covers. Code, tests, and other docs that disagree with a subsystem note are bugs.
```

Full context after the change (showing neighboring groups for placement check):

```
- Architecture and testing:
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `package.json`
  - `vite.config.js`
  - `playwright.config.js`
  - `src/`
  - `tests/`
- Subsystem runtime contracts:
  - `docs/subsystems/` — each note is the authoritative source of truth for the runtime contract it covers. Code, tests, and other docs that disagree with a subsystem note are bugs.
- Current packet tracking:
  - `docs/development/README.md`
```

### Requirement 2 — Add the doc-tail rule to "Implementation Requirements"

After the pedagogy checklist (the last bullet: `Are keyboard, color contrast, sound, motion, and screen reader basics preserved?`), add:

```

If the packet changes runtime behavior covered by a subsystem note (`docs/subsystems/`), it must either include the matching note update in the same patch, or stop and surface the conflict for owner review. Silent divergence from a subsystem note is not allowed.
```

This is a standalone paragraph — conditional framing ("If the packet changes...") is load-bearing and makes clear this is not a mandate for every packet.

### Requirement 3 — Add a validation-checklist item

After `- [ ] No unrelated files were changed.` and before `- [ ] Final report lists commands run and any remaining risks.`, insert:

```
- [ ] If the packet changed behavior described in a subsystem note, the note still reads true post-change (or the conflict was surfaced and approved).
```

### Requirement 4 — Add to "Stop Conditions"

After the last existing stop condition (`production deployment or repository settings changes are needed`), append:

```
- the packet change invalidates a statement in a `docs/subsystems/*.md` note and the corrected wording requires pedagogy, architecture, or contract judgment beyond the packet scope
```

### Requirement 5 — Route the mini-packet starting prompt to subsystem notes

**5a — Orientation reading list.**

In step 1 of "Before the first packet assignment", after `- \`docs/GUIDED_LEVEL_CONCEPT_MATRIX.md\``, append:

```
   - `docs/subsystems/` — runtime-contract reference notes; skim the index in `docs/ARCHITECTURE.md` so you know which note covers which subsystem
```

**5b — Per-task workflow.**

Step 2 currently reads:

```
2. Read required references named by the packet.
```

Change to:

```
2. Read required references named by the packet.
   - Before changing code in an area covered by a subsystem note (Blockly workspace, UI mode contract, turn engine, file pipelines, usage/admin, NPC/CPU, p5 surface), read the matching `docs/subsystems/*.md` note for the current contract. If your change will make that note untrue, plan to update the note in the same patch or surface the conflict before editing.
```

### Requirement 6 — Route the orchestrator starting prompt to subsystem notes

**6a — First Orientation Pass skim list.**

After `- \`docs/StudentGuide.md\``, append:

```
- `docs/subsystems/` — runtime-contract reference notes; know which note covers which subsystem so you can cite the right one when scoping packets and reviewing reports
```

**6b — Packet Creation Rules.**

After the last existing bullet (`Make downstream contracts explicit so later packets do not reinvent earlier decisions.`), append:

```
- When a proposed packet would change behavior described in a `docs/subsystems/*.md` note, name the relevant note in the packet's required reading and include the doc-tail expectation per `docs/packet-creation-guidance.md`. Do not let an implementation packet land that silently invalidates a subsystem note.
```

**6c — When reviewing another model's work.**

After the last existing bullet (`Prefer a short list of actionable recommendations over a broad rewrite.`), append:

```
- Verify any subsystem note touched by the work still reads true post-change; the Plan 17 collision-tail incident is the canonical example of why this matters.
```

---

## Implementation — 2026-05-13

Owner approved all six requirements without changes. Edits applied.

**Files changed:**
- `docs/packet-creation-guidance.md` — Reqs 1, 2, 3, 4 (subsystem authority group, doc-tail paragraph, checklist item, stop condition)
- `docs/development/00-mini-packet-agent-starting-prompt.md` — Reqs 5a, 5b (orientation list line, per-task sub-step)
- `docs/development/00-orchestrator-thread-starting-prompt.md` — Reqs 6a, 6b, 6c (orientation list line, packet creation bullet, review bullet)

**Files not touched:** none of the seven subsystem notes; no `src/` or `tests/` files.

**Validation:**
- `npm test`: 99 pass, 0 fail
- `npm run build`: clean (same pre-existing Blockly chunk warnings, no new issues)
- `git diff --name-only`: confirms only the three target docs files were modified by this packet

**Owner observation logged:** Req 6c anchors itself to the Plan 17 collision-tail incident. That reference is intentional and concrete now; if a later packet produces a cleaner canonical example, update this line to point at the better one.

## Final status: complete
