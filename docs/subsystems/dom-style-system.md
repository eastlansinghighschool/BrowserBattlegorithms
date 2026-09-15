# DOM style system

The shared DOM channel layer lives in `src/assets/styles/channel-tokens.css`. The game entry point
`src/assets/styles/style.css` imports it after its existing load-bearing component import order;
the independent `help.html` entry point imports it at the top of `src/assets/styles/help.css`.
Both entry points therefore resolve the same primitives without importing each other's page styles,
changing selector specificity, or changing cascade structure.

## Channel primitive convention

The `--c-*` properties are space-separated RGB channel triples, not semantic roles. For example:

```css
:root {
  --c-slate: 36 64 74;
}

.example {
  color: rgb(var(--c-slate));
  box-shadow: 0 2px 4px rgb(var(--c-slate) / 0.12);
}
```

Plan 127 declares only the 21 RGB triples that occur in at least two stylesheet files. Alpha
stays at each call site, where the original opacity remains visible. Different RGB triples never
share a channel token, even when they are visually close. The 60 single-occurrence triples and
the single-file long tail remain literal by deliberate scope; they must not grow accidentally or
be tidied into an existing token. The three `hsla()` declarations in `cellInspector.css` also
remain `hsla()` because converting them to rounded RGB channels could change pixels.

The `--c-*` names are intentionally primitive labels rather than roles. P3 may later decide that
a primitive is a panel surface, text color, border, or other semantic role, but this extraction
does not make that design decision.

## DOM and canvas correspondence

The DOM layer and the canvas layer are separate systems. DOM colors live in the `--c-*` channel
properties declared by `channel-tokens.css`, which is imported by the `style.css` and `help.css`
entry points; canvas colors live in the role-named `CANVAS_PALETTE` in
`src/render/canvasPalette.js`. A matching numeric value may appear in both layers, but neither
layer imports from the other. Canvas role naming remains governed by Plan 126; DOM primitive
naming is the narrower Amendment 01 exception.

## Anti-drift rules

- Do not add a new hard-coded color to the in-scope stylesheet surfaces when a declared channel
  primitive already covers its RGB triple.
- Do not merge different RGB triples or alter alpha values while adding a reference.
- Do not add theme variants, `[data-theme]`, or `prefers-color-scheme` rules here; P3 owns theme
  behavior.
- The runtime-injected `--burst-*` and `--particle-*` properties are animation parameters, not
  palette tokens. They remain JavaScript-provided and unchanged.
- `currentColor` remains an inheritance reference and is not replaced by a channel primitive.

The baseline and wiring test in `tests/fixtures/css-palette-baseline.json` and
`tests/unit/css-palette.test.js` are the evidence surface for preserving the original value at
each file/declaration/occurrence coordinate.
