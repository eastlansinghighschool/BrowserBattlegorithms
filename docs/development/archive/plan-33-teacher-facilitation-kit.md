# Plan 33: Teacher Facilitation Kit

## Packet Metadata

- Packet id: plan-33
- Packet title: Teacher Facilitation Kit
- Status: ready
- Owner/model: implementation agent (docs-only)
- Date: 2026-05-17
- Packet type: docs / classroom-readiness
- Mutation level: docs-only
- Approval gate: none for implementation. The Recorded Defaults below are v0.1 estimates pending classroom evidence; the kit ships with a banner noting that pacing and stuck points are predictions subject to revision after the first pilot session.
- Expected artifacts:
  - new `docs/TeacherFacilitationKit.md` — single-document classroom-running companion
  - one-line cross-link added to `docs/TeacherGuide.md` pointing at the new kit
  - progress report
- Progress report folder: `reports/development/plan-33-teacher-facilitation-kit/`
- Progress report file: `reports/development/plan-33-teacher-facilitation-kit/progress.md`

## Packet Summary

Goal: Create a single classroom-facing companion document that a teacher running Browser Battlegorithms for the first time can read in ~10 minutes and use to confidently facilitate a session. The kit covers per-phase pacing estimates, common stuck points and non-spoiler interventions, discussion prompts that surface AP CSA reasoning, "if students finish early" extensions, and an Hour-of-Code-subset recommendation. It is *not* a curriculum redesign or a level-by-level walkthrough — it's a pacing-and-facilitation layer over the existing campaign.

Non-goals:

- Do not rewrite `docs/TeacherGuide.md` or `docs/StudentGuide.md`. The new kit complements those, doesn't replace them.
- Do not redesign levels, win conditions, or toolboxes.
- Do not author new tutorial content inside the app.
- Do not produce printable worksheets, slide decks, or other formats — single markdown document only.
- Do not deploy.

Depends on:

- Current state of `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` (per-level concept introduced).
- Current state of `src/config/levels/` (level count, ordering, names).
- Plan 06 progress report (`reports/development/plan-06-...` if it exists) — for any stuck-point observations from the playtest triage.
- Integration owner's pacing input (see "Owner Inputs Required").

Blocks:

- Pilot readiness. A teacher receiving the campaign without facilitation guidance will pace badly, intervene too soon or too late, and miss the AP CSA bridge conversations that justify the activity.

Why this packet exists:

Browser Battlegorithms is positioned as an hour-of-code classroom activity and an AP CSA bridge. Both audiences depend on a teacher who is making real-time facilitation decisions: when to let students struggle, when to intervene, what to ask, when to advance, when to extend. The app currently provides no such artifact. A teacher's only options today are to run the campaign themselves first (high cost) or improvise (high risk). The kit is the lowest-cost intervention to make the pilot succeed.

## Recorded Defaults

Integration owner approved v0.1 defaults on 2026-05-17. Plan 06 playtest evidence was thin (Gemini-driven browser-agent runs were abandoned after Gemini couldn't reliably click selection blocks); the stuck-point list below is derived from the *level-fix packets* (Plans 23, 24, 26 and the project-arc packets 11, 12) which represent the integration owner's manual playtest findings. Predictions where evidence is absent are tagged explicitly so the first pilot session can refine them.

The kit must include a top-of-file banner: **"v0.1 — pacing estimates and stuck points are predictions pending classroom evidence. Refine after the first pilot session and update this file in place."**

### Decision 1: Phase taxonomy

Confirmed:

- **Foundations** — L1–L5
- **Sensors & Branches** — L6–L14
- **Synthesis Challenge 15** — L15 alone
- **Advanced Logic** — L16–L21
- **Synthesis Challenge 22** — L22 alone
- **Strategy Brain project** — L23–L28
- **Team Strategy Script project** — L29–L37

### Decision 2: Per-phase time bands

v0.1 estimates based on concept-load density, not yet from classroom evidence:

| Phase | Time band | Rationale |
|---|---|---|
| Foundations (L1–L5) | 10–15 min | Simple movement; one new concept per level. |
| Sensors & Branches (L6–L14) | 25–35 min | First conditional thinking; sensor variety; first ignored-blocks moment. |
| Challenge 15 | 5–10 min | One synthesis level; no new blocks. Was repaired in Plan 23 with stationary defender + wandering enemy framing. |
| Advanced Logic (L16–L21) | 30–40 min | AND/OR/NOT, comparisons, runner-index introduction. Highest concept-per-minute density in the campaign. |
| Challenge 22 | 5–10 min | Was repaired in Plan 26 with deterministic vertical-patrol defenders. |
| Strategy Brain (L23–L28) | 30–45 min | First project arc; shared-code persistence is a new mental model. L24 is the load-bearing level (Plan 11); L28 is the capstone (Plan 11 + Plan 15 badge interaction). |
| Team Strategy Script (L29–L37) | 30–45 min | Second project arc; team coordination via runner index. L37 capstone repaired in Plan 12. |
| **Full campaign total** | **~2.5–3 hours** | Distribute across 3–5 class sessions for a typical AP CSA bridge unit. |

### Decision 3: Hour-of-Code subset

**Primary subset (50-minute single-session visit):** L1–L7 + warmup + wrap-up.

- ~5 min warmup: introduce the board, the Blockly workspace, the one-action-per-turn rule.
- ~35 min play: L1 through L7. Covers basic movement, first scoring, first barrier sensor, first conditional, first `if/else`, first `Move Toward`. Students leave with the execution-model lesson plus first conditional reasoning.
- ~5 min wrap-up: discussion prompt 1 (conditional control flow), share-out.
- ~5 min buffer for stuck students.

**Stretch goal (if students fly through):** continue to L8 then attempt Challenge 15 (now with the L23 redesign, it's a satisfying mini-game). Pilot-friendly stopping point.

### Decision 4: Known stuck points

Pulled from level-fix packet evidence and from concept-introduction density. Each entry tagged `[evidence]` (from a repair packet's own findings) or `[predicted]` (concept-load prediction, confirm in pilot).

- **L5** [predicted]: first conditional. Students may copy the demo instead of building the if/else structure; intervention prompts should redirect to "what do you want your ally to do when the barrier *is* there?"
- **L13** [predicted]: AND introduction. Students often write nested if/if instead of using AND.
- **L15** [evidence]: Challenge 15 was repaired in Plan 23 with stationary defender + wandering enemy to remove pure-luck attempts. Stuck pattern: students don't realize "no new tools" means they apply L1–L14 concepts in combination. Intervention: ask "which sensors haven't we used yet that might help here?"
- **L19** [evidence]: Relay race was repaired in Plan 24 so the human retrieves the flag and the ally needs `teammate-has-flag`. Stuck pattern: students miss the role split between human and ally. Intervention: ask "how does your ally know when it's time to help the human?"
- **L22** [evidence]: Challenge 22 was repaired in Plan 26 with deterministic vertical-patrol defenders. Stuck pattern: students try to chase live defenders without sensing position. Intervention: ask "where will the defender be next turn? what does that tell you about *when* to move forward?"
- **L23–L24** [evidence]: Project start. Students don't realize code carries forward across levels. Intervention: point at the project-start callout and the persistent project indicator badge.
- **L24** [evidence]: First Strategy Brain working level (Plan 11). Stuck pattern: runner-index introduction confuses students who haven't seen index-based dispatch. Intervention: "what's different about how runner 0 and runner 1 should behave?"
- **L28** [evidence]: Strategy Brain capstone (Plan 11 + Plan 15). Stuck pattern: synthesis of all project concepts is genuinely hard. Intervention: encourage slow-trace mode (Plan 25b) to observe each runner's branch.
- **L29** [evidence]: Team Strategy Script project start (Plan 12). Stuck pattern: similar to L23, plus role-based thinking is more demanding here.
- **L37** [evidence]: Team Strategy Script capstone (Plan 12). Same family as L28.

### Decision 5: AP CSA discussion-prompt themes

Five themes, each anchored to a specific campaign moment:

| Theme | Anchor | Prompt |
|---|---|---|
| Conditional control flow | After L5 (or end-of-foundations) | "Looking at your program, what part runs only when the barrier is in front? What part runs otherwise?" |
| Boolean composition (AND/OR/NOT) | After L14 (end of Sensors & Branches) | "Why did we need AND/OR/NOT? What's a condition you can't express without combining sensors?" |
| Trace before run | Before any Challenge level | "Before you press Play: which branch of your code will fire first? Where will your ally end up? Slow-speed trace mode will show you." |
| Method-like decomposition via `runner index` | Start of Strategy Brain (L23/L24) | "Each runner in your team has its own index. How is `index = 0` different from `index = 1` in your program? In Java, this is what method parameters do." |
| Resource management (one-shot actions) | After L12 (freeze introduction) or Challenge 22 | "Freeze is a one-shot — your team gets one per match. What conditions should be true before your code decides to use it?" |

## Authority And Contracts

Sources of truth:

- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — authoritative for which concept each level teaches.
- `docs/development/README.md` Completed Packets table — for any campaign-shaping decisions worth name-dropping (projects from Plans 11/12, Challenge 15 from Plan 23, Challenge 22 from Plan 26).
- `docs/TeacherGuide.md` — existing teacher guidance; the new kit links to it for product overview and complements it for facilitation.
- `docs/StudentGuide.md` — for confirming what the teacher should expect a student to already know going in.
- Integration owner's answers to the "Owner Inputs Required" section.

Required product contracts:

- The kit must agree with the concept matrix on which level teaches which concept.
- The kit must agree with the README packet table on which projects exist and which levels they span.
- The kit must not introduce conflicting names for phases, levels, or concepts.
- Facilitation guidance must respect student agency — interventions should preserve the student's ability to debug their own program. No "tell them the answer" prompts.

Do not redefine:

- Campaign structure (level order, project membership, challenge framing).
- The concept matrix.
- Existing TeacherGuide content.

## Required Reading

- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/development/README.md`
- `reports/development/plan-06-guided-playtest-triage/` (any existing playtest evidence)
- `src/config/levels/index.js` or the level-loading entry point — to confirm the campaign's authoritative level list and order

## Scope

### In scope

- One new markdown file: `docs/TeacherFacilitationKit.md`.
- File structure (recommended):
  1. **At a Glance** — 5-line summary: what the campaign is, who it's for, how long it takes, what students should know going in, what teachers should be ready to discuss.
  2. **Hour-of-Code Subset** — the named subset for a 50-minute session, plus a 10-minute warmup and a 5-minute wrap-up.
  3. **Per-Phase Facilitation** — one section per phase from the agreed taxonomy. Each phase section contains:
     - Concept introduced (linked to the concept matrix).
     - Expected time band (provided by owner).
     - Likely stuck points (named levels + the common confusion pattern).
     - Non-spoiler intervention prompts (one-sentence questions to ask a stuck student that point at the right mental move without revealing the solution).
     - Discussion questions for the whole class (one per phase, tied to the AP CSA theme it most exercises).
     - Extension ideas for early finishers (one per phase).
  4. **Project Sections** — Strategy Brain and Team Strategy Script each get an additional callout: what shared-code behavior students need to internalize, how to handle the project-start callout, what to do when a team gets stuck on the capstone.
  5. **Discussion Prompts by AP CSA Theme** — 3–5 themes from owner input, each with one prompt and a "best moment to ask" anchor in the campaign.
  6. **Troubleshooting Quick Reference** — one-page lookup: "student says my ally won't move" → "ask them to turn on slow-speed trace and watch which condition fired." Cover the 5–7 most likely classroom support requests.
  7. **What to Do Next Session** — pointers to the projects, free play, and future Tournament mode (if shipped).
- Cross-link added to `docs/TeacherGuide.md` (probably one line at the top: "For pacing, intervention prompts, and discussion questions while running a session, see [Teacher Facilitation Kit](TeacherFacilitationKit.md).").
- Plan 33 progress report.

### Files and areas likely touched

- `docs/TeacherFacilitationKit.md` (new).
- `docs/TeacherGuide.md` (one-line cross-link added).
- `reports/development/plan-33-teacher-facilitation-kit/progress.md` (new).

### Out of scope

- Slide decks, printable worksheets, video walkthroughs.
- A second student-facing document.
- Any code, test, or subsystem-note change.
- Any change to existing level content, tutorials, or copy.
- Any new tutorial step authored into a level.
- A facilitation-mode toggle inside the app.
- Discussion-prompt authoring beyond what the owner-provided themes support — if a theme has no obvious campaign-moment anchor, surface the gap in the progress report rather than invent.

## Work Plan

1. Confirm the Owner Inputs Required section has been completed (phase taxonomy, time bands, Hour-of-Code subset, known stuck points, AP CSA themes). If any are missing, stop and report.
2. Read the required reading. Build a phase-by-phase outline before writing prose.
3. Draft `docs/TeacherFacilitationKit.md` section by section. Keep each phase section under ~30 lines.
4. Add the cross-link in `docs/TeacherGuide.md`.
5. Re-read the kit end-to-end. Cut anything that's repeating the TeacherGuide. Cut anything that's a redesign suggestion rather than facilitation.
6. Write the progress report.

## Implementation Requirements

### Requirement 1: Phase coverage

Required behavior:

- Every phase named in the agreed phase taxonomy has its own section.
- Each phase section follows the structure: Concept introduced → Expected time band → Likely stuck points → Intervention prompts → Discussion question → Extension idea.
- No phase section exceeds ~30 lines. The kit's value is scannability mid-class.

Constraints:

- Concepts named per phase must match `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`. Discrepancies are stop conditions, not opportunities to rewrite the matrix.
- Intervention prompts are questions, not statements. They preserve student agency.

Edge cases:

- A phase with no playtest-evidenced stuck point: write "Predicted stuck point based on concept load: [pattern]. Confirm with classroom evidence." and surface in the progress report for future-pass refinement.

Expected artifact:

- Per-phase sections in the kit.

### Requirement 2: Intervention prompt discipline

Required behavior:

- Every intervention prompt is a non-spoiler question the teacher can ask a stuck student.
- Prompts point the student at the relevant mental move (e.g. "What does your code do when there's no enemy nearby?") rather than the solution.
- Each phase has at least 2 and at most 5 prompts.

Constraints:

- Do not write prompts of the form "Try changing X to Y" — that's solution-revealing.
- Do not write prompts that require the teacher to have memorized a specific reference solution. Prompts should work for any student program shape.

Edge cases:

- A phase has only one obvious stuck point with one obvious intervention. Write the one prompt and note the brevity in the progress report rather than padding.

Expected artifact:

- Intervention prompts that match the discipline above.

### Requirement 3: AP CSA discussion prompts

Required behavior:

- The "Discussion Prompts by AP CSA Theme" section lists each theme provided by the owner with:
  - one short discussion prompt suitable for a class-wide pause;
  - one "best moment to ask" anchor (a specific level, phase boundary, or project transition).
- Prompts surface reasoning, not recitation. They invite students to compare programs, explain trace outcomes, or predict before running.

Constraints:

- Maximum one prompt per theme. The kit is a pacing artifact, not a question bank.
- Prompts should connect to a Blockly construct that has a clear Java analog (boolean composition, conditionals, method-like decomposition via runner index, etc.).

Expected artifact:

- A short discussion-prompt section.

### Requirement 4: Hour-of-Code subset

Required behavior:

- A clearly labeled section names the levels that comprise the 50-minute version, plus a 10-minute warmup recommendation and a 5-minute wrap-up.
- The subset hits the core execution-model lesson (one action per turn, conditional branching) without requiring projects or capstones.
- The section explicitly states what students should leave with (one or two sentences) so the teacher can frame the activity.

Constraints:

- The subset levels must be a contiguous prefix of the campaign or a clearly labeled curated sequence; arbitrary jumps are confusing to teachers.

Expected artifact:

- The subset section.

### Requirement 5: Troubleshooting quick reference

Required behavior:

- A one-page lookup-style section listing the 5–7 most likely classroom support requests, each as a one-line student symptom mapped to a one-line teacher action.
- Examples to cover (final list confirmed during drafting):
  - "Student says my ally won't move."
  - "Student types into a number block and nothing happens."
  - "Student's program looks right but the runner does the wrong thing."
  - "Student is stuck on a synthesis/challenge level."
  - "Student finished the campaign in 20 minutes."
  - "Student's PvP partner imported their code."
  - "Student lost their project workspace by clicking Reset."

Constraints:

- One symptom → one teacher action. No multi-step debug procedures here; those belong in `TeacherGuide.md` if anywhere.

Expected artifact:

- The troubleshooting section.

### Requirement 6: Cross-link in TeacherGuide

Required behavior:

- `docs/TeacherGuide.md` gains exactly one new line near the top that points to the new kit. Do not restructure or rewrite `TeacherGuide.md`.

Expected artifact:

- One-line edit.

## Model-Specific Instructions

- Treat this packet as authoring, not engineering. The implementer is writing teacher-facing prose under the integration owner's facilitation strategy, not designing classroom pedagogy from scratch.
- Read the existing TeacherGuide first. Anything the TeacherGuide already covers, the kit links to rather than duplicates.
- Keep tone direct and respectful of the teacher's expertise. The kit assumes a teacher who knows their classroom and just needs a pacing-and-prompts reference for *this specific activity*.
- Length target: 4–7 printed pages (≈600–1200 lines markdown). Anything longer is hurting scannability.
- Stop and report if:
  - any owner input is missing or ambiguous;
  - the concept matrix disagrees with the levels' actual concept introductions;
  - a discussion-prompt theme has no natural anchor in the campaign;
  - the playtest evidence directly contradicts a pacing estimate the owner provided.

## Commands

```powershell
git status
npm test
npm run build
```

(Docs-only packet; commands are a sanity check.)

## Validation Checklist

- [ ] Owner Inputs Required have been collected and recorded in the packet body or in a sibling notes file before drafting.
- [ ] `docs/TeacherFacilitationKit.md` exists and follows the section structure in Requirement 1.
- [ ] Every phase in the taxonomy has a section.
- [ ] Every phase section is ≤30 lines.
- [ ] Intervention prompts are non-spoiler questions.
- [ ] AP CSA discussion prompts are one per theme with a campaign-moment anchor.
- [ ] Hour-of-Code subset is named and clearly bounded.
- [ ] Troubleshooting quick reference covers 5–7 entries.
- [ ] One-line cross-link added in `docs/TeacherGuide.md`.
- [ ] No level, code, test, or subsystem-note file changed.
- [ ] Progress report flags any phase with thin playtest evidence so a future pass can refine.

## Stop Conditions

Stop and report for integration-owner review if:

- Any of the five Owner Inputs Required is missing.
- The concept matrix disagrees with current level content.
- A discussion-prompt theme has no plausible anchor moment in the campaign.
- The implementer is tempted to author classroom pedagogy beyond the owner-provided strategy.
- The implementer needs more than the markdown surface (slides, video, in-app overlay) to deliver the value.
