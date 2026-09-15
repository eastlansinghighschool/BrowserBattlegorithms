---
id: plan-127
title: "CSS Custom Property Extraction"
status: in-progress
depends_on: [plan-123, plan-126]
gate: "none. This is the decision-independent structural half of plan-123's P3, in the same sense V7 made canvas palette extraction decision-independent. No owner decision is pending; the appearance of a dark theme is P3's question, not this packet's."
summary: >-
  Extract the stylesheets' hard-coded colours into a declared custom-property layer, with zero visual change. The DOM has essentially no design tokens today - a survey found 252 hard-coded colour values against exactly one declared custom property - so light/dark has nowhere to attach on the DOM side just as it had nowhere on the canvas side before plan-126. The governing trap is different from plan-126's: in CSS the temptation is to unify near-duplicate colours, and that silently changes pixels. Identical values may collapse to one token; near-duplicates may not.
---
# Plan 127: CSS Custom Property Extraction

## Packet Metadata

- Packet id: `plan-127`
- Packet title: CSS Custom Property Extraction
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-14
- Packet type: implementation (refactor)
- Mutation level: source-code (stylesheets), tests, docs
- Approval gate: none.
- Depends on: `plan-123` (charter V8), `plan-126` (the pattern and its two hard-won standards)
- Blocks: P3 (light/dark). P2 and P4 are unaffected.
- Expected artifacts:
  - a declared custom-property layer on `:root`
  - every hard-coded colour in `src/assets/styles/` replaced by a `var()` reference
  - a baseline fixture committed before the refactor, plus a per-declaration wiring test
  - a subsystem note recording the convention
  - progress report
- Progress report folder: `reports/development/plan-127-css-custom-property-extraction/`
- Progress report file: `reports/development/plan-127-css-custom-property-extraction/progress.md`

## Packet Summary

Goal: give DOM colour a declared token layer, changing nothing a student can see.

Non-goals:
- **No dark theme, and no `prefers-color-scheme` block.** That is P3. A token layer with an unused
  dark variant is the same mistake `plan-126` R2 forbade on the canvas side.
- **No visual change of any kind**, including "tidying" two nearly-identical greys into one. See the
  standard below — that is this packet's central trap, not a side note.
- No canvas work. `plan-126` finished that and `CANVAS_PALETTE` is not touched here.
- No Blockly theme. Blockly has no theme configured at all (charter V8); configuring one is P3's
  third system and is not authorized here.
- No layout, spacing, typography, or component structure changes.

Why this packet exists:
Charter V8 established that light/dark spans three separate systems. `plan-126` built the seam for
one of them. This builds the seam for the second. Both halves are decision-independent in the same
way: the tokens have to exist before anything can swap them, and extracting them is worth doing
whichever way the theme question is eventually answered.

## Survey — verify before trusting

An orchestrator survey of `src/assets/styles/` found:

| Measure | Count |
|---|---|
| Hard-coded colour values (`#rgb`, `#rrggbb`, `rgb()`, `rgba()`) | **252** |
| Declared custom properties | **1** (`--blockly-height`) |
| `var()` references | 36 |

The gap between 1 and 36 is not a defect and is worth understanding before you start: the
`--burst-*` and `--particle-*` properties referenced in the stylesheets are **set from JavaScript as
inline styles at runtime**, not declared in CSS. They are dynamic animation parameters, not a
palette. Leave them exactly as they are.

So the honest summary is that **the DOM has no design-token layer at all** — the same finding V7
made about the canvas, roughly seven times larger.

Re-run the survey yourself with your own method and record the real figures. `252` counts
*occurrences*, not distinct colours, and the distinct count is the number that actually matters for
sizing the token set. Report both.

Files in scope: `src/assets/styles/style.css`, `src/assets/styles/help.css`, and the nine files in
`src/assets/styles/components/`. `index.html` is in scope only if it carries style attributes with
colours; check and say.

## The standard this packet lives or dies by

`plan-126` proved two things the hard way. Both apply here, and there is a third that is specific to
CSS and is the one most likely to sink this packet.

### 1. Identical values collapse; near-duplicates do not

This is the new one and it is the whole difficulty. On the canvas, each site had one literal and
there was nothing to unify. In a stylesheet, 252 occurrences will include many colours that are
*almost* the same — `#333` and `#333333` and `#343434`, three greys that a reader would call
identical and a screen would not.

**Rule:** two occurrences may share a token only if their values are **byte-equal after
normalisation to a canonical form** (lowercase hex, `#rgb` expanded to `#rrggbb`, `rgb()` and
`rgba()` compared numerically including alpha). Anything else gets its own token, however close it
looks and however much it seems like an oversight by whoever wrote it.

If the survey turns up near-duplicates that look like genuine mistakes, **record them in a table in
the progress report and change nothing.** That list is a useful artifact for P3 and possibly a
future cleanup packet; acting on it here would convert a zero-visual-change refactor into an
unreviewed restyle.

### 2. Baseline before refactor, committed separately

Capture every colour declaration and its value mechanically, write it to a fixture, and **commit
that fixture on its own before touching any stylesheet.** `plan-121` did this at `315a776` before
`34cbd14`; `plan-126` at `64828dc` before `7ec9482`. A baseline captured afterwards proves only
that the code agrees with itself.

Derive the values by parsing the stylesheets. **Do not hand-transcribe them.** `plan-126` shipped a
hand-typed table described as mechanical extraction and needed a repair for it; the values happened
to be right, and that was luck, not method.

### 3. Prove the wiring, not just the token table

This is `plan-126`'s repair-01 lesson and it is the acceptance criterion that matters most.

Its original test asserted that each token held the right value — and passed at 619/619 while two
tokens were swapped at their call sites, inverting the entire game board. Pinning a token table
proves the table. It says nothing about whether a declaration references the token it should.

**Required:** for each colour declaration in the current stylesheets, resolve its `var()` reference
against the declared `:root` layer and assert the resolved value equals the baseline value **for
that same declaration**. Key by file and per-file ordinal, not by line number, since line numbers
shift.

**Acceptance is behavioural.** Swap two tokens at two declaration sites, confirm the test fails,
revert, and quote the failure message in the report. A test not demonstrated to fail on the defect
it exists to catch has not been shown to work.

## Amendment 01 (2026-09-15) — the token model, after the survey gate

**The stop was correct and the stop condition worked as designed.** The survey is accepted as
delivered: 276 static occurrences, 159 distinct canonical values, 17 near-duplicate pairs, none
merged, the 8 runtime `rgba(var(--burst-*))` expressions correctly excluded, and three `hsla()`
values in `cellInspector.css` that the orchestrator's own survey had missed. The figures reconcile
exactly with the orchestrator's original count — 252 was 244 static plus the 8 dynamic — so the
method is sound.

**But 159 is the wrong number to have stopped on, and that is the orchestrator's error, not the
implementer's.** This packet defined canonicalisation to treat alpha as part of colour identity —
correct, and necessary for the zero-visual-change rule — and then used the resulting count as a
proxy for *palette size*. Those are different quantities. Re-measuring the same data by RGB triple:

| Measure | Count |
|---|---|
| Static occurrences | 276 |
| Distinct canonical values (alpha significant) | 159 |
| **Distinct RGB triples (alpha ignored)** | **100** |
| **RGB triples used in 2 or more files** | **21** |
| RGB triples occurring exactly once | 60 |
| Non-RGB distinct values (3 `hsla()`) | 3 |

The inflation is almost entirely one brand colour appearing at many opacities:

| Colour | Occurrences | Distinct alphas | Files |
|---|---|---|---|
| `#24404a` | 41 | **10** | 7 |
| `#ffffff` | 36 | **12** | 8 |
| `#000000` | 22 | 9 | 9 |
| `#3b6f90` | 16 | 3 | 4 |
| `#1e2b33` | 7 | 3 | 5 |

Those five account for **122 of 276 occurrences**. The top 20 RGB triples cover 63%.

So there is a coherent small palette here after all; it was hidden because `rgba(36,64,74,0.12)`
and `rgba(36,64,74,0.24)` counted as two unrelated colours when they are one colour at two
opacities — which is exactly how the stylesheets already treat them.

### The revised model

**1. Base tokens are channel triples, not colours.** Declare the cross-file RGB triples as
space-separated channels so alpha composes at the call site:

```css
:root { --c-slate: 36 64 74; }
/* rgba(36,64,74,.12)  ->  rgb(var(--c-slate) / .12) */
/* #24404a             ->  rgb(var(--c-slate))       */
```

One token replaces `#24404a` and its ten alpha variants, and the alpha stays visible at the call
site where the author put it. Scope the base layer to the **21 triples used in two or more files**.
That is a legible layer, and it is the right 21: a colour used across files is precisely the kind
that has to flip for a dark theme, which is what this seam exists for.

**2. The long tail is left alone, deliberately.** Sixty triples occur exactly once, and 130 of the
159 canonical values live in a single file. They have no cross-cutting role, naming them by role
would mean inventing roles, and tokenising them is what would produce the illegible layer the stop
condition exists to prevent. Record them in the report as explicitly out of scope with this reason.
A later packet can tokenise file-locally if P3 turns out to need it.

**3. The three `hsla()` values stay `hsla()`.** Converting to RGB rounds, and rounding is a visual
change. Record and leave.

### What this changes in the requirements above

- The **role-not-appearance** rule (`plan-126` R1) is **relaxed for the base layer only**: a channel
  triple is a primitive, not a role, and `--c-slate` is an honest name for it. Do not invent
  semantic roles for primitives. Assigning roles — which token is "panel surface", which is "body
  text" — is an authoring decision that belongs with P3, where there is a design to assign roles
  *to*. This packet supplies the primitives and nothing more.
- The **near-duplicate rule is unchanged and still binding.** Two different RGB triples never share
  a token no matter how close. Alpha variants of the *same* triple are not near-duplicates; they are
  the same colour, and composing them from one token is not a merge.
- The **baseline-before-refactor** and **prove-the-wiring** standards are unchanged and still the
  acceptance criteria. Note that `rgb(var(--c) / .12)` is a syntax change as well as a
  substitution, so the wiring test must compare **resolved colour values**, not text.

### Verification this amendment adds

`rgb(r g b / a)` slash-alpha syntax must be confirmed equivalent to `rgba(r,g,b,a)` on the target
browser before the substitution is trusted. It is standard and widely supported, but the target is a
specific managed-Chromebook Chrome and this packet's entire claim is that nothing changes. Confirm
it, in the browser tier if that is where it can be confirmed, and say so.

## Authority And Contracts

Required reading:

- `docs/development/plan-126-canvas-palette-extraction.md` and
  `reports/development/plan-126-canvas-palette-extraction/repair-01.md` — the pattern and the
  failure it hit. Read the repair note before designing your tests.
- `docs/development/plan-123-visual-customization-charter.md`, V7 and V8.
- `src/render/canvasPalette.js` — the role-naming convention to mirror.

Contracts to preserve:

- **Rendered output is identical.** This is the whole packet.
- Token names describe **role, not appearance** — the same rule `plan-126` R1 set, for the same
  reason: a hue-named token must be renamed by the very change the extraction exists to enable.
  Mirror the canvas naming where the same role appears on both sides, and say in the docs where the
  two layers correspond.
- The runtime-injected `--burst-*` / `--particle-*` properties are untouched.
- No change to specificity, cascade order, or selector structure. A `var()` substitution must not
  become a refactor of how a rule is targeted.

## Work Plan

1. Survey mechanically. Record occurrences, distinct values after canonicalisation, and per-file
   counts.
2. Commit the baseline fixture **on its own**.
3. Design the token set from the distinct values. Name by role.
4. Declare the layer on `:root` and replace references file by file.
5. Add the per-declaration wiring test, and demonstrate it fails on a deliberate swap.
6. Document the convention and the canvas↔DOM correspondence.
7. Validation and progress report.

## Implementation Requirements

### R1 — Canonicalisation is explicit and tested

Write the canonicaliser as a named function and test it directly: `#ABC` → `#aabbcc`,
`rgb(0,0,0)` → `#000000`, `rgba(0,0,0,1)` → `#000000`, `rgba(0,0,0,0.5)` stays distinct from
`#000000`. Colour-value equality is the hinge this whole packet turns on and it should not be an
inline regex.

### R2 — No theme variants

`:root` only. No `prefers-color-scheme`, no `[data-theme]`, no dark block, no commented-out dark
block. P3 owns that and must find the seam clean.

### R3 — Near-duplicate report

A table of colours within a small distance of each other but not equal, with their files and
selectors. Changes nothing; informs P3.

### R4 — Docs

A subsystem note recording where DOM colour lives, the role-naming rule, the canvas↔DOM
correspondence, the rule that no new hard-coded colour may enter the stylesheets, and the
untouched status of the runtime-injected properties.

## Commands

```powershell
npm test
```

```powershell
npm run build
```

## Validation Checklist

- [ ] Baseline committed **before** the refactor commit; the report names both hashes.
- [ ] Survey figures reported for occurrences **and** distinct canonical values.
- [ ] Canonicaliser is a named, directly tested function.
- [ ] Per-declaration wiring test exists and was **demonstrated to fail** on a deliberate two-token
      swap, with the message quoted.
- [ ] No near-duplicates merged; the R3 table lists them instead.
- [ ] No theme variant, in any form, anywhere.
- [ ] `--burst-*` / `--particle-*` untouched.
- [ ] `npm test` passes with any new file registered; `npm run build` passes.

## Stop Conditions

Stop and report if:

- the baseline cannot be derived mechanically — do not hand-transcribe it;
- a colour appears inside a shorthand property (`border`, `background`, `box-shadow`) in a way that
  a `var()` substitution would change parsing or fallback behaviour;
- any declaration's resolved value would differ from baseline, including by canonicalisation
  rounding;
- the distinct-value count is large enough that the token set stops being legible — report the
  number and stop rather than shipping two hundred tokens nobody can use;
- a colour turns out to be load-bearing for a browser default or a `currentColor` inheritance chain,
  where substitution changes behaviour rather than value.
