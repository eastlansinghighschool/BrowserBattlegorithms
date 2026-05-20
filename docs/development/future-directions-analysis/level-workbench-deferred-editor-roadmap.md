# Level Workbench Deferred Editor Roadmap

Date: 2026-05-20

This note records the future work intentionally deferred by the Plan 60-64 level workbench MVP sequence. The MVP is a local-dev readiness and prompt-generation tool, not a full level editor. That choice is deliberate: it gives the integration owner faster level-repair loops without granting a browser page broad authority to mutate the repository.

## Current Recommendation

Build the first workbench as a read-only and soft-edit tool:

1. standardize readiness checks into structured data
2. render deterministic agent prompts
3. show a local-dev workbench shell
4. run canonical reference/project fixtures
5. allow scratch Blockly experimentation and mutation prompts

Stop there for MVP. Do not add direct filesystem writes, level setup editing, lesson regrouping, or generated documentation until the readiness/prompt loop proves useful.

## Deferred Work

### Direct Filesystem Writes

Deferred until after Plan 64.

Why defer:

- A browser page cannot safely write repo files without a local dev server endpoint, Vite middleware, or a separate Node helper.
- Once the browser can write, the project needs permission boundaries, file-target rules, backup behavior, error recovery, and tests for accidental writes.
- Static GitHub Pages deployment must remain unaffected.

Likely future packet:

- Add local-dev-only fixture save support for reference XML and project checkpoint XML.
- Require explicit confirmation and show a diff before saving.
- Save only to whitelisted fixture directories at first.

Do not start with:

- arbitrary source-file writes
- map file writes
- docs writes
- campaign-order rewrites

### Level Setup Preview Editing

Deferred until after scratch Blockly preview.

High-value edit surfaces:

- turn limit and failure conditions
- runner start positions
- flags and carried-flag setup
- frozen state / frozen turn counters
- starting barriers
- win-condition target runner/cell
- toolbox, sensor, and move-toward availability

Why defer:

- These changes need a preview patch representation before they can become prompts.
- They also need before/after simulation evidence so the workbench does not merely suggest plausible but untested edits.
- Several setup fields are normalized through legacy setup helpers, so the edit UI must respect source shape versus normalized shape.

Recommended future design:

```js
{
  levelId: "freeze-the-lane",
  previewPatch: [
    { path: "failureConditions[0].maxTurns", from: 8, to: 10 },
    { path: "setup.teams.opponent.runners[0].gridX", from: 7, to: 8 }
  ],
  beforeResult: "FAILED",
  afterResult: "PASSED",
  validationCommands: [...]
}
```

The workbench should generate a mutation prompt from this patch before it ever writes files.

### Visual Board Editing

Deferred beyond setup preview editing.

Why defer:

- Dragging runners, flags, and barriers is a real editor UX, not just a readiness workbench feature.
- It touches p5/DOM boundaries, hit testing, coordinate display, selection states, keyboard accessibility, and source patch generation.
- It also creates design questions about whether the board editor should use the live p5 board, a static preview board, or a separate DOM/grid editor.

Recommended approach:

- First implement textual/setup-field preview edits.
- Then add a board preview that edits the same patch object.
- Do not make visual editing the source of truth.

### Map Geometry Editing

Deferred well beyond MVP.

Why defer:

- Map geometry affects core movement, pathing, barriers, flag bases, collision expectations, visual layout, and level difficulty.
- Mistakes can invalidate many levels at once.
- A map editor would need validation for bases, walls, goal cells, spawn legality, path existence, and visual readability.

Recommendation:

- Treat map editing as a separate future product, not an extension of the first level readiness workbench.

### Lesson Grouping And Guided Campaign Decluttering

Deferred until structured lesson metadata exists.

Why defer:

- The current campaign sequence is represented across phase folders, level order, project metadata, concept matrix rows, teacher docs, and natural-language project references.
- Visual decluttering of Guided Levels is desirable, but it should not be smuggled into a developer tool packet.

Recommended future sequence:

1. Add structured `lesson` or `module` metadata to levels.
2. Validate that metadata against the concept matrix.
3. Update Guided Levels UI to group/collapse lessons.
4. Update docs to point at generated or metadata-backed lesson sequences.

Open design questions:

- Should projects be lessons, arcs, or a separate grouping layer?
- Should prediction and bug-hunt levels appear inside a lesson or as checkpoint separators?
- Should optional labs live in their own collapsed group?
- How should progress badges roll up to lessons?

### Test Authoring UI

Deferred.

Why defer:

- The first step is to display standardized checks, not let the user author new checks.
- Test authoring raises policy questions: which checks are universal, which are level-specific, and which require owner approval?
- Arbitrary JavaScript test snippets would recreate the current scattered-context problem in a new place.

Recommended direction:

- Make checks data-driven through named check ids.
- Allow future levels to opt into named checks with parameters.
- Avoid arbitrary code in level definitions unless explicitly approved.

Potential future check model:

```js
readinessChecks: [
  { id: "referenceSolutionPasses" },
  { id: "passesAcrossSeeds", seeds: ["low", "mid", "high"] },
  { id: "winConditionRequiresMechanic", mechanic: "areaFreezeReady" }
]
```

### Generated Documentation

Deferred until level/lesson metadata is stable.

Why defer:

- Natural-language docs currently mention sequences, ranges, project arcs, and lesson intent.
- Deterministic tools are good at generating tables, but bad at maintaining nuanced prose unless the source data is explicit.
- Recent cross-doc drift around project ranges is evidence that hand-maintained sequence references will keep drifting.

Recommended direction:

- Use structured metadata as the source for lesson/project sequences.
- Generate or validate tables such as concept matrix rows, project membership, and teacher-facing sequence summaries.
- Reduce hard-coded level ranges in prose where possible.

Docs that may eventually need generated or validated sequence references:

- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
- `docs/TeacherGuide.md`
- `docs/TeacherFacilitationKit.md`
- `docs/StudentGuide.md`
- `docs/development/future-directions-analysis/backlog.md`
- subsystem notes that name level ranges

### Full Level Source Editor

Deferred.

Why defer:

- Level source files are JavaScript modules, not plain JSON.
- They use imports, constants, spreads, helper functions, starter XML constants, and project metadata helpers.
- A deterministic editor must decide whether it edits source text, edits a data schema that then generates source, or stores overrides elsewhere.

Recommended long-term direction:

- If full editing becomes important, introduce a canonical data representation first.
- Consider whether levels should eventually become data files plus small imports, rather than hand-authored JS modules.
- Preserve escape hatches for complex levels, but keep ordinary levels structured.

### Project Arc Editing

Deferred.

Why defer:

- Project arcs involve shared workspace persistence, broad toolboxes, step fixtures, final fixtures, documented cumulative exceptions, and capstone behavior.
- Editing one project step can invalidate multiple checkpoint and final-fixture expectations.

Recommended future support:

- Inspect project arcs in the workbench early.
- Add project fixture run panels early.
- Delay project-arc mutation tools until one-off level workflows are stable.

### Student-Facing Editor Or Teacher Authoring

Deferred and probably separate from this tool.

Why defer:

- A local-dev workbench for the integration owner has different trust, complexity, and UI requirements than a teacher-facing level authoring tool.
- Teacher authoring would need guardrails, import/export, classroom sharing, durable storage, and much more forgiving UX.

Recommendation:

- Keep the first workbench explicitly local-dev/admin.
- Treat teacher-authored challenges as a separate product direction after pilot evidence.

## Suggested Post-MVP Roadmap

After Plan 64, consider this order:

1. fixture save support for XML only
2. turn-limit/failure-condition preview edits
3. runner/flag/barrier setup preview edits
4. toolbox/sensor/move-target preview edits
5. structured lesson metadata
6. guided UI lesson grouping
7. generated/validated docs sequence tables
8. board-based setup editor
9. full level source editor or data-schema migration

## Owner Decisions To Preserve

Future packets should not silently decide:

- whether lesson grouping changes the student-facing campaign sequence
- whether direct browser writes are acceptable
- whether level files should remain JS modules or migrate toward data
- whether project arcs should be rebalanced while tooling is being built
- whether teacher authoring is in scope for the same tool
- whether docs should become generated artifacts

## Summary

The MVP workbench should be a level context compiler plus scratch solution lab. It should make hidden contracts visible, run existing validation, and generate precise prompts for implementation agents. That is enough to reduce churn now.

The deferred editor work is real and valuable, but it should build on structured readiness data, preview patches, and explicit owner decisions rather than growing out of a browser page that can mutate files too early.
