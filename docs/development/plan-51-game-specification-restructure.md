# Plan 51: Game Specification Restructure

## Packet Metadata

- Packet id: plan-51
- Packet title: Game Specification Restructure
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-18
- Packet type: docs / cleanup
- Mutation level: docs only
- Approval gate: before changing any game rule, renaming the file, or modifying student-/teacher-facing content beyond what the rules doc strictly needs
- Expected artifacts:
  - restructured `docs/GameSpecification.md` that is shorter, more logically ordered, and free of "later:" / "not in this version" / "V1.1" / "(largely the same as the previous version)" framings
  - Blockly authoring content absorbed into `docs/subsystems/blockly-workspace.md`
  - Section 9 ("Fun Factor") content moved to a small note under `docs/development/future-directions-analysis/`
  - Section 7 (Scaffolded Levels) collapsed to a one-paragraph pointer to the concept matrix
  - internal cross-references in the spec repaired to match the new section numbering
  - progress report including a "board game test" walkthrough
- Progress report folder: `reports/development/plan-51-game-specification-restructure/`
- Progress report file: `reports/development/plan-51-game-specification-restructure/progress.md`

## Packet Summary

Goal: Restructure `docs/GameSpecification.md` into a cleaner foundational rules document. Preserve every game rule currently described. Cut repetition. Move authoring-medium and roadmap content out. Reorder sections so the doc reads as a description of the **game**, not the **software**.

The acceptance criterion is the **board game test**: a reader who has never seen the codebase should be able to read the new spec and play a tabletop version of Browser Battlegorithms with paper, dice, and tokens. Implementation details (Blockly, free-play UI tabs, technical stack, levels, future ideas) belong in subsystem notes, future-directions docs, or the README — not the rules doc.

This is **structural** work, not content work. No game rule changes. No new rules. No rule deletions. The same rules, organized so they are easier to find and harder to misread.

Non-goals:

- Do not change any game rule. Every behavior described in the current spec must remain described somewhere reachable after the restructure.
- Do not rename the file. Overwrite `docs/GameSpecification.md` in place; preserves every existing cross-reference (six load-bearing path-only references in the README, packet-creation-guidance, the three orchestrator/mini/level-editing starting prompts, and Plan 41).
- Do not touch the Plan 46-49 section-number references (Plans 46-48 are landed and bookkeeping-pending; Plan 49 is in flight). Plan 51 dispatches AFTER Plan 49 lands, by which point those four packets' section pointers are historical.
- Do not edit `docs/StudentGuide.md`, `docs/TeacherGuide.md`, `docs/TeacherFacilitationKit.md`, `docs/ARCHITECTURE.md`, or `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`. None of them link to the spec by section, and they each maintain their own self-contained descriptions of relevant rules. A future doc-hygiene packet may unify those if classroom evidence shows drift; that is out of scope here.
- Do not touch source code, tests, or level data.
- Do not deploy.

Depends on:

- Plans 46, 47, 48 landed (already complete in code; README bookkeeping pending).
- Plan 49 (area-freeze board visualization) landed. Plan 51 does not dispatch until Plan 49 is archived.
- The user's reference Battlegorithms spec at `C:\AI\Battlegorithms\docs\battlegorithms-game-specification.md` as a structural model. The implementer should read it for tone and layout, not content. Browser Battlegorithms is a simpler game with different rules; do not import any rule from that document.

Blocks:

- Cleaner authoring experience for every future spec-touching packet.
- A future doc-hygiene packet to unify cross-doc rule descriptions (out of scope here, queued for later).

Why this packet exists:

The current `docs/GameSpecification.md` is 322 lines of good content trapped in mediocre structure. It accreted from an earlier Java-based Battlegorithms spec via edits that left behind "V1.1" headers, "(largely the same as in the previous version)" parentheticals, "later:" markers, and explicit "not in this version" framings that only make sense to a reader holding both specs. Section 6 (Blockly) interrupts the rules narrative between Collision and Levels. Section 4.1 splits Human vs AI actions, tangling rules with input medium. Sections 7 (Levels), 8 (Tech Stack), and 9 (Fun Factor) belong elsewhere. The board game test fails today — too much implementation and roadmap to strip mentally.

The integration owner's framing on 2026-05-18 makes the goal explicit: a foundational rules document that describes the **game**, not the **software**. The 2-way split (rules doc + Blockly into the subsystem note) achieves this while preserving every load-bearing cross-reference.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-18):

### Decision 1: 2-way split — rules doc, Blockly into subsystem note

- `docs/GameSpecification.md` becomes the rules doc, including a final "Modes of Play" section as an appendix (modeled on Section 9 of the reference Battlegorithms spec).
- The current Section 6 (Blockly Interface & Blocks) content is absorbed into `docs/subsystems/blockly-workspace.md`, which is already the authoritative subsystem note for Blockly behavior. The implementer should integrate, not duplicate — if the subsystem note already covers a topic, the spec's prior wording is reconciled with it rather than appended.
- The current Section 8 (Technical Stack & Deployment) content is mostly redundant with `docs/ARCHITECTURE.md`. Drop it from the spec entirely; do not duplicate elsewhere. If ARCHITECTURE.md is missing anything that was in Section 8, the implementer notes it in the progress report — but does NOT edit ARCHITECTURE.md in this packet.
- The current Section 9 (Fun Factor) content moves to a new small note under `docs/development/future-directions-analysis/` (filename per implementer choice, e.g. `fun-factor-enhancements.md`).
- Three-way split (separate `GameModes.md`) is explicitly rejected. The four modes are short enough to live as a final section of the rules doc.

### Decision 2: Overwrite `docs/GameSpecification.md` in place

No rename. Smallest diff for cross-references. Every existing link to `docs/GameSpecification.md` continues to work.

### Decision 3: Section 1.3 Learning Objectives — keep as short preamble

Educational goals stay in the rules doc as a brief preamble (≤ 10 lines). They explain why the game exists in a classroom context and are short enough not to muddy the rules narrative.

### Decision 4: Drop the V1.1 header; add a "Last reviewed" stamp

The title line becomes `# Browser Battlegorithms — Game Specification` with no version label. Immediately below, a small italicized "*Last reviewed: 2026-05-18*" stamp. Git history is the actual version record. Future revisions update the date.

### Decision 5: Strip "later:" and "not in this version" framings entirely

The spec describes what currently ships. "Later:" markers in block catalogs, "Traps are not a feature in this version" callouts, and "(largely the same as in the previous version)" parentheticals are removed. If a topic is not part of the current game, it is not in the spec. Period.

The Blockly subsystem note may carry "currently/eventually" framings since it lives closer to the implementation — but the rules doc does not.

### Decision 6: Section 7 Levels — collapse to a one-paragraph pointer

Replace the current Section 7 with one paragraph: "Browser Battlegorithms ships with a guided campaign of progressive levels. See [`GUIDED_LEVEL_CONCEPT_MATRIX.md`](./GUIDED_LEVEL_CONCEPT_MATRIX.md) for the canonical level inventory and [`StudentGuide.md`](./StudentGuide.md) for student-facing level descriptions." No level-by-level outline in the spec.

### Decision 7: Section 9 Fun Factor — move out cleanly to future-directions

Create `docs/development/future-directions-analysis/fun-factor-enhancements.md` (or similar) and move the Section 9 content there verbatim. No pointer back from the spec — future ideas belong in the development tree, not the canonical rules.

## Authority And Contracts

Sources of truth:

- The current `docs/GameSpecification.md` is the canonical list of rules to preserve. **Every rule in the current spec must appear somewhere reachable after the restructure.**
- `docs/subsystems/blockly-workspace.md` is the existing authority for Blockly behavior. Conflicts between Section 6 of the current spec and the subsystem note resolve in favor of the subsystem note (it is closer to implementation truth).
- `docs/ARCHITECTURE.md` is the existing authority for tech stack. The new spec does not duplicate it.
- The user's reference Battlegorithms spec at `C:\AI\Battlegorithms\docs\battlegorithms-game-specification.md` is a **structural and stylistic model only**. Do not import any rules or terminology from it. Browser Battlegorithms has different rules.

Required product contracts:

- Every game rule currently in `docs/GameSpecification.md` (sections 1-9) appears in either:
  - the restructured spec,
  - `docs/subsystems/blockly-workspace.md`, or
  - the new future-directions note (only for Section 9 content).
- No rule is silently changed. If the implementer finds wording ambiguity, the resolution is documented in the progress report and the spec uses the clearer wording — but only after confirming the resolution does not change observed game behavior.
- The board game test passes: a reader who has never seen the codebase can describe gameplay (board, runners, actions, collisions, scoring, win condition) accurately from the new spec.
- All path-only cross-references to `docs/GameSpecification.md` from other docs continue to work (overwrite, no rename).
- The "Last reviewed" stamp is set to the date the packet lands.

Do not redefine:

- Game rules (rules are preserved verbatim in meaning even if reworded for clarity).
- The file path `docs/GameSpecification.md`.
- The independent rule descriptions in `docs/StudentGuide.md`, `docs/TeacherGuide.md`, `docs/TeacherFacilitationKit.md`, or `docs/ARCHITECTURE.md`. Out of scope.
- Any subsystem note other than `docs/subsystems/blockly-workspace.md`.

## Required Reading

- `docs/packet-creation-guidance.md`
- `docs/GameSpecification.md` — read entirely before any mutation; this is the "preserve every rule" baseline
- `docs/subsystems/blockly-workspace.md` — read entirely; this is where Section 6 content lands
- `docs/subsystems/turn-engine.md` — cross-reference target; do not edit, but verify the new spec's collision section is consistent
- `docs/subsystems/ui-mode-contract.md` — verify the new spec's modes section is consistent
- `docs/ARCHITECTURE.md` — verify the new spec correctly defers to it for tech stack
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — destination for the Section 7 pointer
- `README.md`, `docs/StudentGuide.md`, `docs/TeacherGuide.md` — read briefly to confirm none rely on spec section numbers (they do not, per orchestrator scan 2026-05-18)
- The reference Battlegorithms spec at `C:\AI\Battlegorithms\docs\battlegorithms-game-specification.md` — read for structural model only, not rules

Use `rg "GameSpecification"` from the repository root to confirm the touch list before final commit.

## Scope

### In scope

- Restructure `docs/GameSpecification.md` into the following sections (numbering subject to small adjustments during authoring, but the order is fixed):
  1. Overview (one paragraph; describes the game in one sentence and the audience in one sentence)
  2. Learning Objectives (short preamble per Decision 3, ≤ 10 lines)
  3. Board and Setup
  4. Game Entities (runners, flags, barriers — no per-action attribute restatements)
  5. Turn Structure (single canonical place for per-turn flow; no overlap with action sections)
  6. Actions (unified list; no Human vs AI split inside this section — input medium is mode-orthogonal)
  7. Collision Resolution
  8. Area Freeze (the one special action that justifies its own section)
  9. Scoring and Win Conditions
  10. Configurable Parameters (board size, team size, points to win, freeze cooldown, etc.)
  11. Levels (one-paragraph pointer per Decision 6)
  12. Modes of Play (PvNPC, Hot-Seat, Free-Play PvP, Free-Play PvCPU Easy, Free-Play PvCPU Tactical — short descriptions; cross-link to `docs/subsystems/ui-mode-contract.md` for runtime behavior)
- Absorb the current Section 6 (Blockly Interface & Blocks) content into `docs/subsystems/blockly-workspace.md`. If a topic is already covered there, integrate rather than duplicate.
- Create `docs/development/future-directions-analysis/fun-factor-enhancements.md` with the current Section 9 content moved verbatim.
- Repair internal "see Section N" cross-references inside the new spec to match the new numbering.
- Write the progress report including a board game test walkthrough.

### Files and areas likely touched

- `docs/GameSpecification.md` (overwrite)
- `docs/subsystems/blockly-workspace.md` (absorb Section 6 content)
- `docs/development/future-directions-analysis/fun-factor-enhancements.md` (new file from Section 9 content)
- `reports/development/plan-51-game-specification-restructure/progress.md` (new)

### Out of scope

- Editing any subsystem note other than `docs/subsystems/blockly-workspace.md`.
- Editing `docs/StudentGuide.md`, `docs/TeacherGuide.md`, `docs/TeacherFacilitationKit.md`, `docs/ARCHITECTURE.md`, `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`, or the README.
- Editing any packet under `docs/development/` (including the four packets with section-number references — they are landed/in-flight and will be archived by dispatch time).
- Any source code, test, level data, or fixture change.
- Renaming `docs/GameSpecification.md`.
- Adding new game rules, removing existing rules, or changing rule semantics. Wording may change for clarity; meaning may not.
- Reconciling cross-doc drift between the spec and Student/Teacher/Architecture docs. Future packet's job.
- Deployment.

## Work Plan

1. Read every required-reading doc end-to-end before any mutation. Confirm the four section-number-referencing packets (46-49) are archived.
2. Make a working list of every rule in the current spec, mapped to its target location in the new structure (rules doc / blockly subsystem note / future-directions note). This is the preservation contract — keep it in the progress report.
3. Author the new `docs/GameSpecification.md` from scratch using the section order from the In Scope list. Pull rules from the working list, reword for clarity where needed, and check off the working list as each rule lands.
4. Absorb Section 6 content into `docs/subsystems/blockly-workspace.md`. Integrate, don't append. Where the subsystem note already covers a topic, reconcile in favor of the subsystem note.
5. Create the future-directions fun-factor note. Verbatim copy of Section 9 content is acceptable.
6. Repair internal cross-references in the new spec. Verify every "see Section N" pointer resolves.
7. Walk through the board game test in the progress report. Describe what a tabletop player would do, turn by turn, from the new spec alone.
8. Final preservation pass: confirm every item in the working list is checked. Any item not checked is either documented as moved to subsystem/future-directions (with link), or surfaces a stop condition.
9. Write the progress report including the working list, the board game test walkthrough, and the diff statistics (line count delta).

## Implementation Requirements

### Requirement 1: Rule preservation contract

Required behavior:

- Build a working list of every rule from the current spec before authoring the new one. Format: `[ ] <one-sentence rule summary> → <target location>`. Example: `[ ] Captured runners are frozen for 2 turns and bounced to attacker's origin cell → new spec, Collision Resolution section`.
- The list is included verbatim in the progress report.
- Every item must be checked at the end. Items moved to the blockly subsystem note or the future-directions note count as checked, with a path/anchor link recorded next to the check.
- No item may be silently dropped. If a rule is genuinely obsolete (e.g., contradicted by implementation), it is removed AND surfaced in the progress report as a separate "removed obsolete rule" entry with one-sentence justification.

Constraints:

- The working list is the load-bearing artifact for this packet. Do not skip building it.
- If the working list reveals a rule the implementer cannot confidently classify (rule vs implementation detail vs roadmap), stop and surface for owner judgment.

### Requirement 2: New rules-doc structure

Required behavior:

- The new `docs/GameSpecification.md` uses the section order specified in the In Scope list (Overview through Modes of Play, 12 sections).
- Each section has a clear, descriptive heading. No "(Initial Outline)" or "(Example Refinements)" parentheticals.
- The doc opens with the title line `# Browser Battlegorithms — Game Specification` and a single italicized "*Last reviewed: 2026-05-18*" stamp on the next line.
- Total line count target: 200-225 lines (down from the current 322). Hard cap: 250 lines. Going under is acceptable; going over indicates the restructure has absorbed unnecessary content.
- Internal cross-references use descriptive language ("see the Collision Resolution section") OR markdown anchor links (`[Collision Resolution](#collision-resolution)`). Avoid "see Section N" numeric pointers — numbering may shift in future packets and descriptive references stay stable.

Constraints:

- Section 4 (Game Entities) does not restate runner attributes in action contexts. Each attribute is defined once, in the entity section.
- Section 5 (Turn Structure) is the canonical description of per-turn flow. Section 6 (Actions) describes individual actions without re-narrating the turn flow.
- Section 6 (Actions) presents actions as a unified list. Do not split into "Human keyboard actions" and "AI Blockly actions" — those are mode/medium concerns. Mention that the human-controlled runner uses keyboard input and AI allies select actions via Blockly, in one short paragraph at the start of the section, then describe the actions once.
- Section 12 (Modes of Play) is brief: one short paragraph per mode (PvNPC, Hot-Seat, Free-Play PvP, Free-Play PvCPU Easy, Free-Play PvCPU Tactical). Each paragraph names the mode, says who controls what, and points to `docs/subsystems/ui-mode-contract.md` for runtime details.

### Requirement 3: Blockly absorption into subsystem note

Required behavior:

- The current Section 6 (Blockly Interface & Blocks) content is migrated into `docs/subsystems/blockly-workspace.md`. The migration is integrative — existing subsystem note content takes precedence where they overlap.
- The block catalog (current 6.2) lands in the subsystem note as the canonical "Current block inventory" section, with any "later:" markers stripped.
- The execution model (current 6.3) lands in the subsystem note as part of its existing execution-model coverage. If the subsystem note already describes the first-action-only rule, the spec's prior wording is reconciled in favor of the subsystem note.
- The new spec does NOT have a Blockly section. The Actions section may mention "AI allies select actions via Blockly programs; see [`blockly-workspace.md`](./subsystems/blockly-workspace.md) for the authoring environment" in one sentence.

Constraints:

- Do not duplicate block names or execution semantics between the spec and the subsystem note. One canonical home.
- If absorption surfaces a contradiction (the spec says X, the subsystem note says Y, and they actually disagree), stop and surface for owner judgment. Do not silently resolve.

### Requirement 4: Future-directions note for Fun Factor

Required behavior:

- Create `docs/development/future-directions-analysis/fun-factor-enhancements.md`.
- Move the current Section 9 content verbatim. Add a one-line header indicating it was extracted from the spec on 2026-05-18.
- No pointer from the new spec back to this note. Future ideas live in the development tree, not the canonical rules.

Constraints:

- Verbatim move is acceptable. Reword for clarity only if a sentence is genuinely ambiguous.

### Requirement 5: Section 7 Levels pointer

Required behavior:

- Replace the current Section 7 (Scaffolded Levels) with one paragraph in the new spec's Levels section.
- The paragraph names that Browser Battlegorithms ships with a guided campaign, and points at `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` for the level inventory and `docs/StudentGuide.md` for student-facing descriptions. No further detail in the spec.

Constraints:

- Do not list any levels by name.
- Do not describe level pass conditions in the spec — those live in the level definitions and concept matrix.

### Requirement 6: Acceptance — the board game test

Required behavior:

- The progress report includes a "Board game test" section walking through one full point (round) of a tabletop Browser Battlegorithms game using ONLY the new `docs/GameSpecification.md`. The implementer plays both sides on paper or in their head.
- The walkthrough names every rule it consults from the new spec. If a rule needed is not findable in the new spec without consulting the Blockly subsystem note or other docs, that is a failure — flag and resolve before declaring the packet complete.
- The walkthrough is short (under 1 page). It exists to prove the spec stands alone, not to be exhaustive.

Constraints:

- The walkthrough must be done after the restructure, not from memory of the old spec.
- If the walkthrough surfaces a missing rule in the new spec, the rule is added to the spec (preserving Requirement 1 — every original rule must be reachable).

### Requirement 7: Cross-reference integrity

Required behavior:

- Run `rg "GameSpecification"` from the repository root after the restructure.
- Verify every active-file reference still resolves. Path-only references work automatically. Section-number references in archived packets (46-48 will be archived; 49 will be archived by dispatch) become historical and are not touched.
- The two internal "see Section 5" pointers currently inside `docs/GameSpecification.md` are replaced with descriptive references per Requirement 2.

Constraints:

- Do not edit any packet under `docs/development/` to update section pointers. Those packets are landed or archived.
- Do not edit `docs/development/00-*` starting prompts beyond the path-only references they already have. The semantic "must stay true when setup or rules imply game-spec behavior" wording in the level-editing starter remains valid after the restructure.

## Commands

Run from the repository root:

```powershell
rg "GameSpecification" --no-heading
wc -l docs/GameSpecification.md docs/subsystems/blockly-workspace.md docs/development/future-directions-analysis/fun-factor-enhancements.md
```

No code changes; `npm test`, `npm run build`, and `npm run lint:levels` are not required for this packet but should still be clean (this packet does not touch their inputs).

## Validation Checklist

- [ ] Working list of every original-spec rule is in the progress report.
- [ ] Every working-list item is checked: present in the new spec, the Blockly subsystem note, or the future-directions note (with link).
- [ ] No game rule is silently changed; any wording-only change preserves meaning.
- [ ] New spec follows the 12-section order in the In Scope list.
- [ ] New spec opens with `# Browser Battlegorithms — Game Specification` and a `*Last reviewed: 2026-05-18*` stamp.
- [ ] No "V1.1" header, no "(largely the same as the previous version)" parentheticals, no "later:" markers, no "not in this version" callouts.
- [ ] Actions section is unified — no Human vs AI split inside the section.
- [ ] Modes of Play is a brief final section (~one paragraph per mode).
- [ ] Section 7 collapsed to one-paragraph pointer.
- [ ] Section 9 content moved to `docs/development/future-directions-analysis/fun-factor-enhancements.md`.
- [ ] Blockly content absorbed into `docs/subsystems/blockly-workspace.md` without duplication or contradiction.
- [ ] Internal "see Section N" pointers replaced with descriptive references.
- [ ] New spec line count is between 200 and 250 (target 200-225).
- [ ] Board game test walkthrough in the progress report demonstrates the spec stands alone.
- [ ] `rg "GameSpecification"` shows no broken paths.
- [ ] Path-only references in README, packet-creation-guidance, the three 00-starting-prompts, and Plan 41 still work.
- [ ] No subsystem note other than `docs/subsystems/blockly-workspace.md` was edited.
- [ ] No file outside `docs/` was edited.

## Stop Conditions

Stop and report for owner review if:

- A rule in the current spec cannot be confidently classified as rule, implementation detail, or roadmap during the working-list build.
- The Blockly absorption surfaces a contradiction between the current spec and `docs/subsystems/blockly-workspace.md` that requires owner judgment to resolve.
- The board game test walkthrough surfaces a gap that cannot be closed without changing an actual game rule.
- The new spec exceeds 250 lines despite the restructure (indicates absorbed content that should have moved out).
- Any cross-reference in a non-archived file would break under the restructure.
- Plan 49 has not yet landed when the implementer is ready to start.
- The reference Battlegorithms spec at `C:\AI\Battlegorithms\docs\battlegorithms-game-specification.md` is genuinely needed for a structural decision that the current spec does not resolve — surface rather than improvise.

## Notes For Future Self

- **Cross-doc rule drift is a real but separate concern.** The Student Guide, Teacher Guide, Teacher Facilitation Kit, and ARCHITECTURE all describe their own subsets of game rules independently of the spec. Plan 51 does not unify them. A future packet (call it Plan 5N — doc-hygiene cross-reference unification) should:
  - Audit each non-spec doc for rule statements.
  - Decide whether the non-spec docs should link back to the spec for canonical wording or maintain independent prose for audience-specific reasons.
  - Resolve any actual contradictions (the spec says X, the Student Guide says Y, and they differ).
  This is a worthwhile cleanup but it requires reading every doc carefully and is not bounded enough to bundle here.
- **Future rules additions should land directly in the right section** of the restructured spec, not as "later:" markers or appended subsections. The restructure's section ordering is intended to last.
- **Future subsystem notes should link to the spec** rather than restate rules. If a subsystem note finds itself describing a rule, the right move is "see [Rules section name] in `docs/GameSpecification.md`" plus the subsystem-specific implementation detail.
- **The "Last reviewed" stamp is load-bearing for staleness detection.** Any future packet that touches the spec should update the date. A future doc-linter contract could check the stamp against git mtime and warn if they drift.
- **The reference Battlegorithms spec** at `C:\AI\Battlegorithms\docs\battlegorithms-game-specification.md` is the structural model. It is NOT the source of rules. Browser Battlegorithms is a different game. Future implementers should remember this distinction.
