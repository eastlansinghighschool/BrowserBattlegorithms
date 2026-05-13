# Plan 17 — Documentation Cleanup

- Packet id: plan-17
- Packet title: Documentation Cleanup For Agent Onboarding
- Status: ready
- Owner/model: integration owner + sequenced mini-model phases
- Date: 2026-05-13
- Packet type: docs
- Mutation level: docs-only (plus optional moves of historical docs)
- Approval gate: before mutation in Phase 1, and again between each phase that produces new prose
- Expected artifacts:
  - revised `README.md`
  - revised `docs/ARCHITECTURE.md` (acts as the index)
  - revised `docs/GameSpecification.md` (correctness fixes only)
  - new `docs/subsystems/` notes (set defined in Phase 1)
  - updated `docs/development/README.md` packet index
  - progress report at `reports/development/plan-17-doc-cleanup/progress.md`
- Progress report folder: `reports/development/plan-17-doc-cleanup/`
- Progress report file: `progress.md`

## Goal

Bring the documentation into a state where a fresh agent can quickly find the right layer to edit and an existing agent can read the actual operational contracts without having to reconstruct them from source. The docs should be concise enough that they don't decay every time a feature lands.

## Why this packet exists

- `README.md` still describes the build as the "Phase 8 expansion," several phases behind where the project actually is, and predates the handoff-packet workflow.
- `docs/ARCHITECTURE.md` is still serviceable as a high-level map but is silent on multi-mode persistence, project workspaces, mode-aware UI, file pipelines, and the warning/execution-hint lifecycle.
- `docs/GameSpecification.md` mis-describes turn order and the collision rule tree.
- Several runtime contracts (Blockly workspace lifecycle, UI mode state, turn execution order, three export pipelines, usage/admin pipeline, NPC vs CPU split, p5 game-tick coupling) live only in code and tests right now.
- The cleanup must avoid swinging the other way: long subsystem essays that each restate the spec and rot in parallel.

## Non-goals

- No source-code changes. (One exception is permitted: deleting obviously dead references inside docs, e.g. links to retired files.)
- No curriculum, level, or pedagogy redesign.
- No rewrites of `docs/development/plan-*.md` packet files.
- No expansion of `StudentGuide.md` or `TeacherGuide.md` beyond fixing factual stale lines. Those are learner-facing.
- No new docs outside the set agreed in Phase 1.

## Authority and contracts

Sources of truth the implementing agent must obey:

- The doc-cleanup reports under `reports/development/doc-cleanup/`. These are the agent's primary input. They are uneven in style on purpose; quote facts (file paths, event names, storage keys) directly from them rather than re-deriving from source.
- Project-level contracts in `docs/development/README.md` and `docs/packet-creation-guidance.md`.
- The integration owner's Phase 1 decisions about which docs retire and what new notes are created.

Decisions this packet must NOT redefine:

- The browser-based Blockly capture-the-flag premise.
- The one-action-per-turn execution model.
- The two project arcs (`strategy-brain` L23-L28, `team-strategy-script` L29-L37) and the project workspace contract from Plan 08.
- The `src/core/` / `src/render/` / `src/ui/` / `src/ai/` boundary.
- Static Vite deployment.

## Required reading

Before Phase 1, the implementing agent reads:

- `reports/development/doc-cleanup/blockly-doc-report.md`
- `reports/development/doc-cleanup/free-play-doc-report.md`
- `reports/development/doc-cleanup/guided-level-doc-report.md`
- `reports/development/doc-cleanup/import-export-doc-report.md`
- `reports/development/doc-cleanup/npc-and-free-play-cpu-doc-report.md`
- `reports/development/doc-cleanup/p5-doc-report.md`
- `reports/development/doc-cleanup/turn-engine-doc-report.md`
- `reports/development/doc-cleanup/ui-overlays-doc-report.md`
- `reports/development/doc-cleanup/usage-export-and-admin-doc-report.md`
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/GameSpecification.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/TESTING.md`
- `docs/development/README.md`
- `docs/development/project-sequence-decisions.md`
- `docs/development/project-level-map.md`

Optional / contextual:
- `docs/DevelopmentPhases.md`, `docs/DevelopmentLog.md`, `docs/FRESH_SETUP.md` — read once to judge whether they still earn their place.
- Source files referenced inside the reports — read only the specific file the report cites when a fact needs to be double-checked.

## Cross-cutting writing rules

These apply to every phase that produces new prose.

1. **One owner per fact.** Each runtime contract belongs to exactly one doc. If a sentence repeats what another doc says, link instead of copy. ARCHITECTURE is the index; subsystem notes are the contract; learner guides are the experience.
2. **Lead each note with a Scope block** stating what the note owns and what it does NOT own (with a link to whoever does). This is the main defense against drift.
3. **Bullet-first.** Skim-friendly bullets and small tables beat paragraphs. Reserve paragraphs for genuinely sequential explanations (e.g. the turn resolution order).
4. **Cite paths inline** as `src/...` (no absolute Windows paths). Use `path.js:lineno` only when a specific symbol is being named.
5. **Do not invent terminology.** Use the same names the code uses (`currentModeView`, `freePlayMode`, `cpuBehavior`, `goalBurstEffect`, etc.).
6. **Target length per subsystem note: roughly 80–150 lines.** If a note wants to be longer, that's a signal it's swallowing more than one slice — stop and surface.
7. **No "as of date" stamps in subsystem notes.** Dates rot. Status belongs in `docs/development/README.md`.
8. **No new emoji, no decorative headers.**

## Work plan — phased and gated

Each phase ends with a hard stop for integration-owner approval. The mini model does not advance to the next phase on its own.

### Phase 1 — Inventory and ToC proposal (no mutations)

The mini model:

1. Reads everything in Required Reading.
2. Produces `reports/development/plan-17-doc-cleanup/progress.md` with:
   - a table of every current `docs/*.md` file (top level only, excluding `docs/development/`) with one of: `keep`, `revise`, `retire`, `move-to-history`.
   - a proposed list of new files under `docs/subsystems/` with a one-line scope statement each. Initial recommended set (the mini model may argue for additions/removals with reasoning):
     - `docs/subsystems/blockly-workspace.md` — workspace lifecycle, storage keys, ignored vs disabled blocks, warning lifecycle, project-shared workspaces, undo/redo wrapping
     - `docs/subsystems/ui-mode-contract.md` — `currentModeView` vs `freePlayMode` vs `activeBlocklyTeamTab`, which controls are visible in which mode, mode-aware scoreboard/button text, tutorial-overlay gating
     - `docs/subsystems/turn-engine.md` — runtime order of a turn, bounce vs illegal vs skipped, scoring vs level completion vs round reset, collision rule tree with real exceptions
     - `docs/subsystems/file-pipelines.md` — the three file flows (workspace XML, private encrypted JSON, usage evidence JSON), which mode shows which control, integrity model contrast
     - `docs/subsystems/usage-and-admin.md` — event taxonomy, tracker → IndexedDB → export ladder, analyzer signal-vs-noise philosophy, admin app surface, regression artifacts are generated
     - `docs/subsystems/npc-and-cpu.md` — teaching NPC vs free-play CPU split, what is deterministic, where randomness is allowed, the shared pathing helper, `state.randomFn` test hook
     - `docs/subsystems/p5-surface-map.md` — `draw()` is part tick part paint, canvas-adjacent DOM overlays are not p5 features, who owns what
   - a short retirement proposal for `DevelopmentPhases.md`, `DevelopmentLog.md`, `FRESH_SETUP.md` with a recommendation (`docs/history/`, delete, or keep) plus reasoning.
   - any contracts or facts found in the reports that the agent thinks are wrong or already out of date — surfaced, not silently fixed.

**Stop.** Wait for integration-owner approval on the inventory, the new-notes set, the retirement plan, and any flagged contradictions before doing anything else.

### Phase 2 — README, ARCHITECTURE, and retirements

Once Phase 1 is approved:

1. Rewrite `README.md`:
   - Strip the "Phase 8 expansion" framing and the long current-state bullet list.
   - Keep: one paragraph on what the app is, the dev/build commands, the dev-server port note, and a short links section to the main docs.
   - Add a link to `docs/development/README.md` as the packet index.
   - Target length: under 60 lines.
2. Update `docs/ARCHITECTURE.md` so it functions as the index:
   - Keep the folder-roles table and team-first runtime sections.
   - Replace the Phase 8/Phase 9 narrative sections with a short "Subsystem map" section that lists each `docs/subsystems/*.md` note with its scope statement.
   - Remove or correct the stale "one Local Storage key per guided level" line and similar single-bucket persistence claims; point to the Blockly workspace note for the real storage map instead of restating it here.
3. Execute the approved retirements:
   - If `move-to-history`: create `docs/history/` and move the file in via git, leaving no link from `README.md` or `ARCHITECTURE.md`. `docs/development/README.md` may keep a one-line breadcrumb if the file is still referenced from packet history.
   - If `delete`: delete only with explicit owner approval recorded in the progress report.
4. Update `docs/development/README.md` so any links to retired files are corrected, and add a row for Plan 17.

**Stop.** Wait for owner review of README, ARCHITECTURE, and retirements before any subsystem note is authored.

### Phase 3 — Author subsystem notes

For each approved note in `docs/subsystems/`:

1. Author the note in this shape:
   - **Scope** — three to five bullets stating what this note owns and what it does NOT own. Link the "does not own" items to the responsible doc.
   - **Surface map** — small table or bullet list of the relevant files in `src/`, with one line each.
   - **Contract sections** — the actual runtime contract, drawn from the corresponding report and the cited source files.
   - **Common traps** — short list of mistakes this note exists to prevent.
   - **Related** — links to neighboring subsystem notes.
2. Copy facts from the matching report verbatim where helpful (event names, storage keys, file paths). Do not re-derive them from source unless a fact in the report looks wrong; if one does, stop and surface it before changing it.
3. Authoring order — write the first two notes (`blockly-workspace.md` and `ui-mode-contract.md`) first, then **stop** for an owner sanity check on tone, length, and scope discipline before authoring the rest. The remaining notes (`turn-engine.md`, `file-pipelines.md`, `usage-and-admin.md`, `npc-and-cpu.md`, `p5-surface-map.md`) can then be authored in one pass.

**Stop** after the first two notes are written. Resume on approval. Stop again at the end of Phase 3.

### Phase 4 — Targeted correctness fixes to existing docs

Once subsystem notes exist, the implementing agent does focused fixes — not rewrites — to:

1. `docs/GameSpecification.md`:
   - Correct the turn-order description (the engine now advances through runners in a deterministic active-runner sequence, not the alternating/randomized story currently in §2.4).
   - Soften or correct the collision rule narrative in §5 so it does not state "the defender always wins" without the carrying/flag exceptions; link to `docs/subsystems/turn-engine.md` for the full tree.
   - Remove or update the "Implementation Status Note" preamble so it points to the subsystem notes rather than listing features.
   - Remove the export/import paragraph in §8 that implies a single XML flow; link to `docs/subsystems/file-pipelines.md`.
2. `docs/TESTING.md`:
   - Confirm command names match `package.json` (`npm run test:unit`, `npm test`, `npm run test:browser`). Correct any drift.
   - Add a short pointer to the regression harness under `tests/regression/` as "generated artifacts, not committed fixtures" — one line, link to `docs/subsystems/usage-and-admin.md`.
3. `docs/TeacherGuide.md` and `docs/StudentGuide.md`:
   - Fix factual lines only (e.g. control names that drifted). Do not expand into runtime contracts.
4. `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`:
   - Leave content alone unless a flagged contradiction surfaced in Phase 1. The matrix is curriculum-facing.

**Stop** for owner review. Spec corrections in particular need eyes.

### Phase 5 — Cross-link audit and validation

1. Grep every doc for links to retired files; fix or remove dead links.
2. Confirm each subsystem note links to its neighbors and that ARCHITECTURE links to every note.
3. Confirm `docs/development/README.md`'s Packet Index includes Plan 17 with the correct status.
4. Run validation commands (see below).
5. Write the final entry in `reports/development/plan-17-doc-cleanup/progress.md` summarizing files changed, decisions encoded, and any contracts surfaced for owner review.

## Files likely touched

Mutated:
- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/GameSpecification.md`
- `docs/TESTING.md`
- `docs/TeacherGuide.md` (light)
- `docs/StudentGuide.md` (light)
- `docs/development/README.md`
- new files under `docs/subsystems/`
- `reports/development/plan-17-doc-cleanup/progress.md`

Possibly moved (only on owner approval in Phase 1):
- `docs/DevelopmentPhases.md` → `docs/history/`
- `docs/DevelopmentLog.md` → `docs/history/`
- `docs/FRESH_SETUP.md` → `docs/history/` or kept in place

Not touched:
- `src/`, `tests/`, `package.json`, `vite.config.js`, `playwright.config.js`
- `docs/development/plan-*.md` packet bodies
- `docs/development/project-sequence-decisions.md`, `docs/development/project-level-map.md`
- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` (unless Phase 1 surfaces a contradiction)
- `reports/development/doc-cleanup/*` reports

## Commands

```powershell
npm install
npm test
npm run build
```

`npm run test:browser` is not required for a docs-only packet but should still pass if the integration owner is staging the cleanup near a release.

## Validation checklist

- [ ] Phase 1 inventory exists in the progress report and was approved before any doc mutation.
- [ ] `README.md` no longer references "Phase 8 expansion" and is under ~60 lines.
- [ ] `docs/ARCHITECTURE.md` lists every `docs/subsystems/*.md` note with a scope line.
- [ ] Every subsystem note opens with a Scope block stating what it does NOT own.
- [ ] No subsystem note exceeds ~200 lines without owner sign-off.
- [ ] No subsystem note restates content that already lives in another subsystem note; cross-links are used instead.
- [ ] `docs/GameSpecification.md` no longer claims alternating/randomized runner execution and no longer presents the collision rule without exceptions.
- [ ] All links in `README.md`, `docs/ARCHITECTURE.md`, `docs/development/README.md`, and subsystem notes resolve.
- [ ] `docs/development/README.md` lists Plan 17.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] No files under `src/` or `tests/` were modified.
- [ ] Final progress report lists every file changed and any surfaced contradictions for owner follow-up.

## Stop conditions

Stop and ask the integration owner before continuing if:

- A report contradicts the current code on a load-bearing fact (storage key, event name, control visibility rule). Surface the contradiction rather than guessing which is right.
- A subsystem note's scope would force a second note to shrink to almost nothing — that's a sign the cut is wrong; propose a new split.
- The spec correction would change a rule a student or teacher relies on (e.g. collision exceptions that look incorrect rather than just under-documented).
- Retirement of `DevelopmentPhases.md`, `DevelopmentLog.md`, or `FRESH_SETUP.md` would orphan a link from an active packet.
- The docs disagree with each other in a way that can't be resolved without reading source; ask before deciding which doc to keep.
- Any phase wants to grow into source-code changes — out of scope here.

## Model-specific instructions

- Summarize the current phase's job in two or three sentences before editing anything.
- Edit only the files this phase authorizes.
- Prefer small, reviewable patches per file over sweeping rewrites.
- Treat the doc-cleanup reports as the trusted source for facts. If a report and the code disagree, stop and surface; do not silently pick one.
- Do not introduce new doc folders beyond `docs/subsystems/` and (if approved) `docs/history/`.
- Do not expand the packet itself or invent new contracts during writing.
