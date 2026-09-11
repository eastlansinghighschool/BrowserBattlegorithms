---
id: plan-126
title: "Canvas Palette Extraction"
status: in-progress
depends_on: [plan-123]
gate: "none. plan-123 V7 settled this as a decision-independent prerequisite; no owner decision is pending."
summary: >-
  Extract every hard-coded canvas colour into one named palette module, with zero visual change. This is plan-123's P1 and the charter's V7 prerequisite: no canvas palette exists today, so a light/dark theme or an alternate tileset has nowhere to attach. The survey found 34 colour call sites across seven files, not the 29 across four the charter estimated. The no-visual-change claim must be proven mechanically against a baseline committed before the refactor, in the shape plan-121 used for byte-identity, not asserted in a progress report.
---
# Plan 126: Canvas Palette Extraction

## Packet Metadata

- Packet id: `plan-126`
- Packet title: Canvas Palette Extraction
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-10
- Packet type: implementation (refactor)
- Mutation level: source-code (render layer), tests, docs
- Approval gate: none.
- Depends on: `plan-123` (complete) — this is its P1.
- Blocks: P2 (skin registry), P3 (light/dark). Neither is written.
- Expected artifacts:
  - a palette module exporting named colour tokens
  - every hard-coded canvas colour replaced by a token
  - a committed baseline fixture and a test pinning the palette to it
  - a subsystem note, or a section in an existing one, recording the convention
  - progress report
- Progress report folder: `reports/development/plan-126-canvas-palette-extraction/`
- Progress report file: `reports/development/plan-126-canvas-palette-extraction/progress.md`

## Packet Summary

Goal: give canvas colour a single named home, changing nothing a student can see.

Non-goals — all of these are later packets or non-packets:
- **No light/dark theme.** That is P3, it spans three separate systems, and it is not authorized here.
- **No alternate skins, tilesets, or glyph sets.** That is P2.
- **No visual change of any kind.** Not a "slight improvement", not a rounding, not a tidy-up of a colour someone finds ugly. If a colour looks wrong, record it and leave it.
- No change to layout, sizing, `CELL_SIZE`, animation timing, or motion preferences.
- No change to DOM/CSS colours. This packet is the p5 canvas only.

Depends on: `plan-123`, complete 2026-09-10.

Why this packet exists:
Charter position V7 found that **no canvas palette exists at all** — colours are inline literals at
the point of use. That is why the charter's difficulty ordering is counterintuitive: a light/dark
theme is the hardest item on the slate, not the easiest, because two of its three systems have no
seam to attach to. V7 named this extraction as decision-independent, meaning it is worth doing
whichever way every other visual question is answered. It is the only P-slate item that can be
dispatched without an owner ruling.

## Survey — verify, then correct the charter if needed

An orchestrator survey found **34 call sites across seven files**, not the roughly 29 across four
render files the charter estimated:

| File | Sites |
|---|---|
| `src/render/effects.js` | 17 |
| `src/render/drawBoard.js` | 8 |
| `src/render/drawEntities.js` | 3 |
| `src/render/p5App.js` | 2 |
| `src/entities/Runner.js` | 2 |
| `src/entities/Barrier.js` | 1 |
| `src/entities/Flag.js` | 1 |

The charter counted the `src/render/` files and missed the three entity files. **Re-run the survey
yourself and treat neither number as authoritative** — the counting method matters (`p.fill`,
`p.stroke`, `p.background`, and any other colour-taking p5 call). Record the real figure, and if it
differs from 34, say so and correct V7 in the charter with a dated note rather than leaving the
charter wrong.

**Some colours are already named** and live in `src/config/constants.js`: `TEAM_GLOW_COLORS`,
`AREA_FREEZE_PULSE_COLOR`, `JUMP_TAKEOFF_COLOR`, `JUMP_DUST_COLOR`. These are the existing
convention and a partial precedent. Decide deliberately whether they move into the palette module
or stay where they are, and say why in the report — what must not happen is two competing homes for
canvas colour, which is the drift this packet exists to end.

## The standard this packet lives or dies by

**"No visual change" is a claim, and a progress report asserting it is not evidence.**

A refactor that silently alters one alpha value is worse than no refactor, because it lands under a
commit message promising the opposite and nobody will look again. So the claim must be mechanically
checkable, in the shape `plan-121` used for export byte-identity:

1. **Capture the baseline first and commit it in its own commit, before any refactor.** Enumerate
   every colour call site and its resolved arguments as they are today, and write that to a
   fixture. The commit order matters and is not a formality — a baseline captured after the
   refactor proves only that the code agrees with itself.
2. **Refactor.**
3. **Assert the palette resolves to the baseline exactly**, token by token, including alpha.

`plan-121` committed its fixture at `315a776` and the implementation at `34cbd14`, in that order.
Do the same. If you cannot produce the baseline mechanically, stop and report rather than
hand-transcribing it — a hand-typed baseline proves nothing about the code.

## Authority And Contracts

Required reading:

- `docs/development/plan-123-visual-customization-charter.md`, especially V7, V8, and V9.
- `src/config/constants.js` — the four existing named colour constants.
- `src/render/` and the three entity files listed above.
- `docs/development/plan-121-cloud-evidence-builder-and-analyzer-identity.md` — the
  baseline-before-implementation pattern, including its commit ordering.

Contracts to preserve:

- **Rendered output is identical, pixel for pixel.** This is the whole packet.
- V9 stands: board rendering stays flat fills; this packet introduces no texture and no tiles.
- Motion and accessibility preferences are untouched. `effects.js` reads reduced-motion state in
  several places; that logic moves nowhere.
- No new runtime dependency, and no per-frame allocation added to the draw path. A palette lookup
  must not become work inside the render loop.

## Work Plan

1. Survey and record every colour call site and its current resolved value.
2. Commit the baseline fixture **on its own**, before touching the render code.
3. Create the palette module with names that describe **role, not appearance** — what the colour is
   for, not what it looks like. A token named for a hue has to be renamed the first time the theme
   changes, which is precisely the change this extraction exists to enable.
4. Replace call sites file by file.
5. Add the pinning test.
6. Document the convention: where canvas colour lives now, and the rule that no new inline colour
   literal may be added to the render path.
7. Validation and progress report.

## Implementation Requirements

### R1 — Naming

Tokens are named for role. `boardCellEmpty`, `boardCellWall`, `territoryTeam1` and the like — not
`lightGrey`, `darkGrey`, `paleBlue`. State the naming rule in the docs so P2 and P3 inherit it.

Where a colour carries alpha, keep alpha with the token rather than re-applying a magic number at
the call site; an alpha applied separately is a colour that will drift.

### R2 — No behaviour in the palette

The palette module is data and pure lookups. No conditionals on theme, no reduced-motion checks, no
state reads. Theme variants are P3's job and must not be half-built here — a palette with an unused
`dark` branch is an invitation to a later packet to assume it works.

### R3 — Baseline test

A test asserting that each token's resolved value equals the committed baseline, including alpha,
covering every site found in the survey. It must fail if any value changes.

Register any new test file in `package.json` (explicit list, not a glob).

### R4 — The dynamic sites

Several `effects.js` sites compute colour components at runtime (`p.fill(r, g, b, pulseAlpha)`,
alpha derived from animation progress). These are **not** simple literals and must not be forced
into static tokens. Extract the fixed base colour where one exists and leave the computed component
computed. Where a site is wholly dynamic, leave it and record it in the survey table as
out-of-scope-by-nature, with a one-line reason. An honest "not extractable" row is a correct
outcome; a token that flattens an animation is not.

### R5 — Docs

Record the convention in a subsystem note — where canvas colour lives, the role-naming rule, the
anti-drift rule that no new inline literal enters the render path, and the disposition of the four
pre-existing constants in `src/config/constants.js`.

## Commands

```powershell
npm test
```

```powershell
npm run build
```

## Validation Checklist

- [ ] Baseline fixture committed **before** the refactor commit, and the report names both hashes.
- [ ] Every surveyed site is either tokenised or recorded as dynamic with a reason.
- [ ] The pinning test covers every token including alpha, and fails on any change.
- [ ] No theme conditional, state read, or unused variant branch in the palette module.
- [ ] The four pre-existing colour constants have a stated disposition; there is exactly one home.
- [ ] `npm test` passes; new test files registered.
- [ ] `npm run build` passes.
- [ ] Charter V7's count corrected if the survey disagrees with it.

## Stop Conditions

Stop and report if:

- the baseline cannot be produced mechanically — do not hand-transcribe it;
- extracting a colour would change any rendered value, including by rounding or alpha
  normalisation;
- a site turns out to depend on p5 colour-mode state (`colorMode`) such that the same tuple renders
  differently in different contexts — that is a real finding and changes the packet;
- the work appears to need a theme conditional to proceed, which means P3 scope has leaked in;
- the count or the file list differs materially from the survey above, which would mean the charter
  and this packet were both working from a bad map.
