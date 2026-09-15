# Plan 127 progress

## Overall summary

Plan 127 stopped during Work Plan step 1 under the packet's explicit distinct-value stop
condition. The mechanical survey found 159 distinct canonical CSS color values across the
stylesheets. A role-named `:root` layer with 159 exact-value tokens would not be a legible or
usable seam for P3; collapsing the near-duplicates would violate the packet's zero-visual-change
rule. No stylesheet, `index.html`, baseline fixture, token layer, or wiring test was changed.

The survey helper is retained as a mechanical, read-only extraction aid for a future scoped
decision. It is not registered in `package.json`, does not run in the Vite build, and has not been
used to alter source styles.

## Survey evidence

The survey parsed declarations in all 11 files under `src/assets/styles/` and extracted static
color operands mechanically.

| Measure | Result |
| --- | ---: |
| Packet's narrow lexical count (`#rgb`, `#rrggbb`, `rgb()`, `rgba()`), including runtime expressions | 252 |
| Narrow count that is a static, canonicalizable color | 244 |
| Runtime `rgba(var(--burst-*), ...)` expressions excluded from static extraction | 8 |
| Additional hard-coded keyword colors (`white`, `transparent`) | 29 |
| Hard-coded `hsla()` color occurrences | 3 |
| Total static hard-coded color occurrences, including keywords and `hsla()` | 276 |
| Distinct canonical static values, including keywords and `hsla()` | 159 |
| Distinct canonical values from static narrow syntax only | 155 |
| Existing declared custom properties before any change | 1 (`--blockly-height`) |
| Existing runtime palette-adjacent `var()` references | 36 (dynamic `--burst-*`/`--particle-*` references) |

The 29 keyword occurrences canonicalize into one opaque white value and one transparent value;
they are included in the 159 distinct total. `currentColor` is not a hard-coded color and was
left out of the static count. The `--burst-*` and `--particle-*` variables remain dynamic inline
animation inputs and were not treated as palette declarations.

Per-file static occurrence counts, including `white` and `transparent`, are:

| File | Occurrences |
| --- | ---: |
| `src/assets/styles/style.css` | 0 |
| `src/assets/styles/help.css` | 22 |
| `src/assets/styles/components/base.css` | 32 |
| `src/assets/styles/components/blockly.css` | 62 |
| `src/assets/styles/components/cellInspector.css` | 7 |
| `src/assets/styles/components/controls.css` | 27 |
| `src/assets/styles/components/layout.css` | 25 |
| `src/assets/styles/components/lesson-panel.css` | 66 |
| `src/assets/styles/components/loading.css` | 18 |
| `src/assets/styles/components/overlays.css` | 16 |
| `src/assets/styles/components/responsive.css` | 1 |
| **Total** | **276** |

`style.css` is an import-only entry point; its imported component files carry the declarations.
The packet's conditional `index.html` check found one additional inline hard-coded color at
`index.html:75`: `background-color: #fff`. It is outside the stylesheet totals and brings the
currently visible static-color scope to 277 occurrences. It should be included in a future
extraction decision if inline style attributes remain in scope.

## Canonicalizer evidence

The retained helper exposes `canonicalizeCssColor` as a named function. Direct execution produced:

```text
#ABC -> #aabbcc
rgb(0,0,0) -> #000000
rgba(0,0,0,1) -> #000000
rgba(0,0,0,0.5) -> rgba(0,0,0,0.5)
white -> #ffffff
transparent -> rgba(0,0,0,0)
rgba(var(--burst-fill-r), var(--burst-fill-g), var(--burst-fill-b), 0.7) -> null
```

The helper also now detects the three `hsla()` literals in `cellInspector.css` and preserves their
HSL syntax in the canonical key (`hsla(222,25%,10%,0.95)`, `hsla(217,16%,30%,0.6)`, and
`hsla(217,16%,30%,0.4)`) rather than converting them through a lossy RGB rounding step.

## Near-duplicate report

No near-duplicates were merged. The following table lists every distinct pair within an RGB
Euclidean distance of 4 with identical alpha, using the canonical values produced by the helper.
This is a deliberately strict small-distance threshold; alpha differences remain distinct even
when the RGB components are identical.

| Canonical A | Canonical B | RGB distance | A locations | B locations |
| --- | --- | ---: | --- | --- |
| `#1e2b33` | `#1f2a30` | 3.32 | `help.css:4 body color`; `components/base.css:7 body color`; `components/blockly.css:122 .program-modal-card color`; `components/lesson-panel.css:401 .lesson-inline-list strong color` | `components/overlays.css:173 .tutorial-card color` |
| `#eef4f8` | `#edf3f6` | 2.45 | `help.css:5 body background` | `help.css:131 .keycap background`; `components/controls.css:22 .app-keycap background` |
| `#eef4f8` | `#eef4fa` | 2.00 | `help.css:5 body background` | `components/blockly.css:201 .program-modal-message background` |
| `#eef4f8` | `#edf5f8` | 1.41 | `help.css:5 body background` | `components/layout.css:85 .board-narration-strip background` |
| `#eef4f8` | `#eef6fa` | 2.83 | `help.css:5 body background` | `components/lesson-panel.css:6 #level-panel background` |
| `#edf3f6` | `#edf5f8` | 2.83 | `help.css:131 .keycap background`; `components/controls.css:22 .app-keycap background` | `components/layout.css:85 .board-narration-strip background` |
| `#fff5d6` | `#fdf3d8` | 3.46 | `components/base.css:6 body background` | `components/layout.css:141 .board-coaching-strip background` |
| `#2f5c79` | `#315d79` | 2.24 | `components/blockly.css:195 .program-modal-actions button:hover background`; `components/lesson-panel.css:256 .blockly-project-callout-dismiss:hover background` | `components/controls.css:112 .lesson-panel-collapse-button:hover background` |
| `#eef4fa` | `#edf5f8` | 2.45 | `components/blockly.css:201 .program-modal-message background` | `components/layout.css:85 .board-narration-strip background` |
| `#eef4fa` | `#eef6fa` | 2.00 | `components/blockly.css:201 .program-modal-message background` | `components/lesson-panel.css:6 #level-panel background` |
| `#f8fafc` | `#f8fbff` | 3.16 | `components/cellInspector.css:5 #cell-inspector-tooltip color` | `components/controls.css:75 .control-keycaps-pill background` |
| `#f8fafc` | `#f7fbff` | 3.32 | `components/cellInspector.css:5 #cell-inspector-tooltip color` | `components/controls.css:143 .lesson-prediction background`; `components/layout.css:85 .board-narration-strip background` |
| `#f8fbff` | `#f7fbff` | 1.00 | `components/controls.css:75 .control-keycaps-pill background` | `components/controls.css:143 .lesson-prediction background`; `components/layout.css:85 .board-narration-strip background` |
| `#f8fbff` | `#f5fbff` | 3.00 | `components/controls.css:75 .control-keycaps-pill background` | `components/layout.css:118 .area-freeze-status-chip background` |
| `#f7fbff` | `#f5fbff` | 2.00 | `components/controls.css:143 .lesson-prediction background`; `components/layout.css:85 .board-narration-strip background` | `components/layout.css:118 .area-freeze-status-chip background` |
| `#edf5f8` | `#eef6fa` | 2.45 | `components/layout.css:85 .board-narration-strip background` | `components/lesson-panel.css:6 #level-panel background` |
| `rgba(241,248,254,0.98)` | `rgba(243,248,253,0.98)` | 2.24 | `components/lesson-panel.css:188 .lesson-project-start-callout background` | `components/lesson-panel.css:214 .blockly-project-callout background` |

The strict RGB table intentionally covers the hex and RGB-family values; the HSL-family values
are retained as exact HSL canonical keys and were not compared using an unverified color-space
conversion. The wider diagnostic threshold of RGB distance 8 and alpha distance 0.05 produced 98 pairs,
including many alpha-only distinctions such as `rgba(36,64,74,0.12)` versus
`rgba(36,64,74,0.08)`. Those are further evidence that visual tidying would violate the packet's
exact-value rule, but the strict table above is the bounded report artifact.

## Files changed

- `scripts/dev/css-palette.mjs` — mechanical CSS declaration/color survey helper and named
  canonicalizer, including the previously missed `hsla()` syntax. This is an analysis aid only;
  it does not import into the Vite build. Committed separately at `d43b4ff`.
- `reports/development/plan-127-css-custom-property-extraction/progress.md` — this stop report.

No baseline fixture was created because the packet's distinct-value stop condition was reached
before the refactor step. Consequently there is no baseline-before-refactor or refactor commit
hash to report.

## Commands run and results

- `node scripts/dev/plan-status.js check 127` — passed: `RUNNABLE: plan-127 is ready to implement`.
- Mechanical survey using `scripts/dev/css-palette.mjs` — passed; figures recorded above.
- Direct canonicalizer examples using `scripts/dev/css-palette.mjs` — passed; output recorded
  above.
- `npm test` — not run; the packet stop condition was reached before any runtime or test change.
- `npm run build` — not run; the packet stop condition was reached before any build-graph change.

## Advisor consultation disposition

- Requested model: `gpt-5.6-sol`, explicitly authorized by the owner.
- Observed model: `gpt-5.6-sol` / GPT-5.6 Sol. The advisor stated this directly in its response;
  the delegated runtime model assignment was the available session-level observation, while the
  shell/task listing did not expose a separate model-name field.
- Effective posture: depth-1 bounded read-only reviewer request; the advisor was instructed not
  to edit files, write reports, spawn children, or change status. The parent remains the sole
  writer. A post-consultation status check was performed before the helper commit and showed no
  advisor-authored files or packet-status changes.
- Findings and disposition:
  - **Accepted:** 159 exact canonical values (after correcting the helper to include three
    `hsla()` literals) meet the packet's legibility stop. Sol independently reasoned that 156 was
    already too large and that role naming could require more than one token per value; the
    corrected count strengthens that conclusion.
  - **Accepted:** `white` and `transparent` are hard-coded colors and `currentColor` is inherited
    behavior; the former belong in a future extraction scope and the latter remains untouched.
  - **Accepted:** the inline `index.html:75` color is explicitly in the packet's conditional scope
    and must be handled if extraction proceeds.
  - **Accepted:** the first helper was incomplete because it omitted `hsla()`, and the baseline/test
    approach must fail closed on unsupported syntax and assert completeness rather than sharing an
    omission.
  - **Accepted:** a future implementation must preserve exact numeric distinctions, reject or
    explicitly support unsupported CSS color syntax, and place `:root` after the existing import
    sequence in `style.css` (or use an explicitly ordered imported palette file).
  - **Rejected:** none. Each advisory finding was consistent with the packet or exposed a real
    completeness hazard, and the helper was corrected where the finding applied.
- Independent verification: after the consultation, `git status --short` showed only the parent
  changes (`scripts/dev/css-palette.mjs` and this progress report); the advisor did not edit files,
  write reports, spawn children, or change packet status.
- Coarse cost: four bounded waits, roughly 5 minutes elapsed, plus the local survey work and one
  helper correction.

## Problems encountered and resolution

The first draft of the helper used the repository's `scripts/dev/package.json` boundary and was
therefore loaded as CommonJS despite the repository root being ESM. It was corrected to the
`.mjs` extension before use. Sol then identified three omitted `hsla()` occurrences; the helper
was extended to detect them without lossy RGB conversion, and the figures above were recomputed.
No source stylesheet was modified while resolving these issues.

## Remaining risks and follow-ups

- The packet needs an owner/orchestrator decision on whether 159 exact role tokens is acceptable
  or whether a narrower, role-scoped follow-up should be written. Merging near-duplicates in Plan
  127 is not safe.
- If extraction is reauthorized, the next implementation must decide explicitly whether the
  `index.html:75` inline `#fff` is included, while keeping it separate from the stylesheet survey
  totals.
- The eventual implementation still requires a baseline committed before stylesheet edits, a
  directly tested canonicalizer, a per-declaration wiring test with a demonstrated deliberate
  swap failure, and a subsystem note. None of those implementation artifacts exist yet.
- The helper parser should receive a focused test before being relied on for a future refactor;
  this packet did not register it because the packet stopped before implementation.

## Ready for orchestrator review

Yes — the stop condition is documented and no packet status field was changed. The packet is not
ready to be marked delivered or complete; the orchestrator should decide whether to accept the
stop and supersede/re-scope the extraction before any stylesheet mutation.
