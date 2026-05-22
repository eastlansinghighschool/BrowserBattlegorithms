# Repair Instructions — Plan 73 Guided Level Dossier Generator

- Packet: Plan 73 — Guided Level Dossier Generator
- Date: 2026-05-21
- Review status: tooling works and tests pass, but generated artifacts need one focused repair pass before Plan 74/75 consume them

## Summary

The implementation successfully added `npm run level:dossiers`, generated 46 dossiers, and produced a useful first summary index. Focused tests pass.

Two evidence-quality gaps should be repaired before using the dossier bundle as the main input for orchestration-grade curriculum analysis:

1. Project-level summary rows currently look artificially trivial because the summary index reports starter-only complexity while project fixture metrics are only buried inside individual dossiers.
2. Board/setup facts do not include wall/terrain layout or an ASCII/coordinate board representation, even though the packet asked for barriers/walls where available and a compact Markdown board representation if feasible.

These are not curriculum decisions. They are evidence-packaging repairs.

## Required Reading

- `docs/development/plan-73-guided-level-dossier-generator.md`
- `src/dev/levelDossiers.js`
- `scripts/level-dossiers.js`
- `tests/unit/level-dossiers.test.js`
- `src/config/maps.js`
- `reports/development/guided-level-complexity-audit/summary-index.md`
- Representative generated dossiers:
  - `reports/development/guided-level-complexity-audit/level-dossiers/01-move-to-target.md`
  - `reports/development/guided-level-complexity-audit/level-dossiers/33-full-team-tactics.md`
  - `reports/development/guided-level-complexity-audit/level-dossiers/44-advanced-scrimmage.md`

## Repair 1: Make Project-Level Complexity Visible In The Summary Index

Current issue:

- `reports/development/guided-level-complexity-audit/summary-index.md` shows project levels such as `full-team-tactics`, `one-program-two-allies`, and `advanced-scrimmage` with `reference blocks = n/a`, `distinct reference block types = n/a`, and `decision points = 0`.
- Example: `full-team-tactics` summary row reports starter-only complexity, while its dossier contains project step/final fixture metrics with nonzero blocks and decision points.
- Relevant implementation area: `src/dev/levelDossiers.js`, especially the `summaryXmlSource`, `referenceBlockCount`, and summary table rendering logic.

Required behavior:

- Keep starter/demo/reference columns if useful, but add project-aware summary columns or replace the ambiguous reference-only columns with a neutral solution/fixture summary.
- The summary index should let Plan 75 see project fixture complexity without opening every project dossier first.
- At minimum, add columns such as:
  - `project step blocks`
  - `project final blocks`
  - `solution/fixture blocks`
  - `solution/fixture distinct types`
  - `solution/fixture decision points`
- For non-project levels, populate solution/fixture fields from reference XML when available.
- For project levels, populate solution/fixture fields from the matching project step fixture when present, and optionally include final fixture fields separately.
- Update the summary heading text so it no longer says counts fall back only from reference XML to starter XML if project fixtures are included.

Suggested test updates:

- Add a test that `renderGuidedLevelSummaryIndexMarkdown` or generated `summary-index.md` exposes nonzero project fixture metrics for `full-team-tactics` or another project level with a project fixture.
- Assert the project row no longer shows only `n/a`/`0` for the primary complexity fields.

## Repair 2: Include Wall/Terrain Layout Evidence

Current issue:

- Dossiers include base cells, flags, barriers, and runners, but not map wall coordinates or an ASCII/coordinate board representation.
- `src/config/maps.js` defines `CELL_TYPE.WALL`, and several maps include walls.
- The packet requested: "barriers/walls if available" and "a compact text representation of each level's starting state if feasible."

Required behavior:

- Add wall/terrain facts to each dossier. Either of these is acceptable:
  - a coordinate list of wall cells plus jail cells if present, or
  - a compact ASCII grid with a legend.
- Prefer a searchable Markdown representation over image output.
- Include dynamic entities in the board evidence if feasible:
  - human runner
  - ally runners
  - NPC/enemy runners
  - flags
  - barriers
  - goal cell
  - walls/base/jail cells
- If a full ASCII overlay is too much for this repair, at least add:
  - `wall cells: (...)`
  - `jail cells: (...)`
  - `goal cell: (...)`
  - existing flags/barriers/runners remain as separate facts.

Suggested test updates:

- Add a test using a level/map with known walls, or a direct helper test against `MAP_COMPLEX`, that verifies wall cells are included in rendered board/setup facts.
- Add a test that a generated dossier contains either `wall cells:` or a clearly labeled ASCII board section.

## Keep Out Of Scope

- Do not run reference solutions or add behavior transcripts. That belongs to Plan 74.
- Do not make curriculum judgments.
- Do not edit guided level source, fixtures, concept matrix, or tutorial copy.
- Do not add dependencies.
- Do not add browser screenshots.

## Validation Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/level-dossiers.test.js
npm run level:dossiers
npm test
```

Run `npm run build` only if source/module changes suggest a build risk. This is developer tooling, so targeted unit + generator output + full unit suite should be sufficient.

## Stop Conditions

Stop and report if:

- Project fixture metrics cannot be mapped reliably to project levels.
- Board rendering becomes ambiguous enough to mislead readers about runtime state.
- Fixing board facts requires runtime simulation.
- The repair starts changing level content rather than generated evidence.
