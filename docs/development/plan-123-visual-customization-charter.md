---
id: plan-123
title: "Student Visual Customization Charter"
status: draft
depends_on: []
gate: "before acceptance: owner rules on the five gate items in 'Owner Decisions Required'. This charter settles nothing on its own — it is a decision document, and no downstream packet is authorized until it is accepted."
superseded_by: null
resolution: null
summary: >-
  Settle the contract for per-student visual customization — alternate icon sets, board palettes, animation options, and a light/dark theme — before any of it is built. The governing rule is that base glyph carries identity and overlays carry state, which lets an alternate set supply six slots instead of twelve. Records that the codebase already provides four of the five needed pieces, that the difficulty ordering is counterintuitive (glyph sets easy, light/dark hardest, sprites deferred), and that extracting a canvas palette is a decision-independent prerequisite.
---
# Plan 123: Student Visual Customization Charter

## Packet Metadata

- Packet id: `plan-123`
- Packet title: Student Visual Customization Charter
- Status: (see frontmatter)
- Owner/model: orchestration
- Date: 2026-09-09
- Packet type: other (decision charter)
- Mutation level: docs-only
- Approval gate: before acceptance — the owner rules on the five items in *Owner Decisions Required*. **No source changes are authorized by this document.**
- Depends on: nothing
- Blocks: every downstream visual-customization packet (`P1`–`P5` in the slate below)
- Expected artifacts: this charter, accepted or amended; a decision-log entry recording the rulings
- Progress report folder: `reports/development/plan-123-visual-customization-charter/`
- Progress report file: `reports/development/plan-123-visual-customization-charter/progress.md`

## Why This Exists

The owner wants students to be able to change how the game looks: alternate icon sets (animals, robots, symbols rather than "people running"), board tile variants, a few animation options, and a global light/dark theme. The stated motivation is expressiveness and student agency, and it is a good one — this is a low-stakes place to give students ownership of something.

Two reasons to settle a contract before building any of it.

**First, appearance is load-bearing for the curriculum here.** Guided levels teach sensing, conditionals, and enemy discrimination. If a student picks a combination where an enemy is hard to tell from an ally, the *lesson* breaks, not just the aesthetics. That makes this a pedagogy question wearing a cosmetics costume, and it is the reason a legibility rule has to exist before a library of glyphs does.

**Second, the codebase is further along than it looks, and in a specific shape that should be preserved rather than rediscovered.** An orchestration pass on 2026-09-09 found four of the five needed pieces already present:

| Piece | Where | State |
| --- | --- | --- |
| A single appearance seam for runners | `resolveRunnerDisplayEmoji()`, `src/render/runnerVisuals.js` | 14-line pure table lookup: `RUNNER_EMOJI_BY_ROLE[role][state][direction]` |
| A state-overlay layer independent of the glyph | `src/render/effects.js` | Frozen glow and area-freeze pulse already drawn separately; already user-toggleable via `showFrozenBadges` |
| A visual/motion settings group | `index.html` settings modal | Five toggles already: low-motion, runner movement, jumping, frozen badges, index badges |
| Exception-safe preference storage | `src/ui/preferences.js` via `src/platform/safeStorage.js` | Delivered by `plan-118`; persists without throwing under blocked storage |

The missing fifth piece is the **contract**, not the art. This charter is that piece.

There is also a counterintuitive finding worth recording before anyone estimates: **alternate glyph sets are the easy win, light/dark is the hardest item, and sprite sheets are the one to defer.** The reasoning is in V7–V10.

## Proposed Positions (V1–V12)

These are orchestration proposals. They become settled only on owner acceptance.

### V1 — Identity vs. state layering (the governing rule)

**The base glyph carries identity. Overlays carry state.** A base glyph answers "what kind of thing is this" — human runner, ally, enemy, flag, barrier. An overlay answers "what is true of it right now" — frozen, carrying a flag, whose turn it is, runner index.

State must never be encoded by swapping to an unrelated base glyph.

The consequence is what makes a curated library feasible. The current matrix is 3 roles × 2 directions × 2 states = **12 glyphs per set**, and the frozen row is exactly the one with no natural analogue in most emoji families — there is no kneeling robot. But the overlay layer already exists, so **an alternate set may decline to supply frozen variants and compose active-glyph + frost overlay instead**, collapsing 12 slots to 6.

The current design half-follows this already: frozen has both a distinct glyph *and* a glow. V1 formalizes the overlay as the primary carrier and the glyph variant as an optional enhancement.

### V2 — Silhouette-first legibility

Glance-readability in games comes from **silhouette**, not hue or detail. Two consequences:

- **String-distinct is not visually distinct.** 🏃 and 🏃‍♂️ are different code points and indistinguishable at 24px on a classroom projector. A rule of "no duplicate glyphs" is therefore insufficient and must not be the whole check.
- **Role slots must differ in silhouette**, not merely in colour or skin tone. Board object types (flag, barrier) must never share a silhouette family with runners.

Team identity may continue to ride colour, because it is reinforced by position, base tint, and glow. Object *type* may not.

### V3 — Curated library, slot-level mix-and-match

Students choose from a curated library. They do not supply arbitrary emoji or images.

Mix-and-match **is** supported — the owner asked for it and it is the feature's charm — but at **slot granularity across curated sets**, not as free per-glyph text entry. The reason is verifiability: a legibility contract can be checked at authoring time over a finite library and cannot be checked over arbitrary student input. Free entry would move the legibility guarantee from a lint into a hope.

### V4 — Semantics are invariant under skin

Skin is presentation only. The accessible name, the cell-inspector description, voice narration text, coaching copy, and any analyzer or evidence semantics **do not change** when the skin changes.

Concretely: the `aria-narration` and voice-narration browser specs must pass unchanged under every allowed combination. A student using the robot set and a student using the default must hear and read the same words.

### V5 — Skin choice is a device-local preference, never evidence

It does not enter the usage export, does not affect the event fingerprint, and is not learning data. GAS Stage 2 portable state *may* carry it as a convenience if that is cheap, but it is explicitly not evidence and must never be treated as such. Recording this now so it is not swept into an evidence payload later by accident.

### V6 — Guided mode has a legibility floor

Guided levels teach enemy discrimination. Every allowed combination must preserve role discriminability. **If the V2 lint genuinely holds, no separate guided-mode restriction is needed** — that is the design intent. Whether to also pin a guided subset as belt-and-braces is gate item 2.

### V7 — Extracting a canvas palette is a prerequisite, and is worth doing regardless

**There is no palette abstraction on the canvas today.** `src/render/drawBoard.js` renders all five cell types with inline RGB literals — `p.fill(245, 245, 245)` for floor, `p.fill(100, 100, 100)` for wall, `p.fill(200, 200, 200)` for jail, and tinted fills for the two team bases. Across `drawBoard.js`, `drawEntities.js`, `effects.js`, and `p5App.js` there are roughly **29 inline `p.fill(` / `p.stroke(` call sites**.

Team colours are the exception and the precedent: `getTeamGlowColors(state, team)` in `src/core/teams.js` already resolves colour at runtime from state. Board tiles have no equivalent.

Extracting a named canvas palette is therefore the first downstream packet. It is **decision-independent** — valuable whether or not tilesets or light/dark ever ship — and both of those features are blocked behind it.

### V8 — Light/dark is a three-system change, not a toggle

It reads as one switch and is three parallel colour systems:

1. **CSS** — straightforward with custom properties.
2. **The p5 canvas** — colours are JS constants and inline literals, with no cascade. This is V7's prerequisite.
3. **Blockly** — has its own theming API, and **no theme is configured today**; the workspace uses Blockly's default. A dark shell around a light Blockly workspace looks broken, so this is a from-scratch addition, not a modification.

Plus contrast obligations in *both* modes, on projectors and for colourblind students. Note also that `prefers-color-scheme` is currently used nowhere in the stylesheets, so there is no groundwork to build on — unlike `prefers-reduced-motion`, which is already respected in `blockly.css` and `cellInspector.css`.

Light/dark is worth doing and is sequenced on its own.

### V9 — "Tileset" v1 means palette, not texture

Board rendering is flat `p.rect()` fills. There are no tile images anywhere. So a tileset feature splits into two separable things: **palette variants** (reachable once V7 lands) and **textured or glyph tiles** (which do not exist at all and are a different, later project). V1 of the feature is palettes.

### V10 — Sprite sheets are deferred behind an explicit gate

The owner is right that storage minimisation is obsolete and that GitHub Pages will serve an atlas happily. The costs are elsewhere, and they are the reason to wait:

- **Licensing.** Any sprite set needs a licence permitting redistribution on a public site used by minors. Emoji sidestep this entirely.
- **Accessibility regression.** Emoji carry implicit semantics and scale with the user's system font settings. Sprites do neither, and this app has voice narration and ARIA contracts that depend on stable semantics (V4).
- **Load path.** Atlas preloading touches `src/startup/`, the most failure-sensitive part of the app.
- **Art labour.** 12 slots × N sets, and half-finished art looks worse than emoji.

**Build the indirection so sprites could slot in later; do not build them now.** The gate for reconsidering is stated in the slate.

### V11 — Animation options extend an existing group

Low-motion, runner movement, runner jumping, frozen badges, and index badges already exist as toggles. Additions are incremental rather than new architecture, and must continue to respect `prefers-reduced-motion`, for which precedent already exists.

### V12 — Test coupling must be broken deliberately

Three test files assert on literal glyphs today: `tests/browser/key-capture-passthrough.spec.js`, `tests/unit/cell-inspector.test.js`, and `tests/unit/display-and-controls.test.js`. When glyphs become configurable, these must either assert on semantic role or explicitly pin the default skin. This is a named requirement in the downstream packet, not a discovery during it.

## Owner Decisions Required

The charter cannot be accepted until these five are ruled on.

1. **Mix-and-match granularity.** Slot-level across curated sets (recommended, per V3), or whole-set selection only? Slot-level is more expressive and is what was asked for; whole-set is trivially safe and needs no compatibility check.
2. **Guided-mode floor.** Does the V2 lint suffice on its own (recommended), or should guided mode additionally pin a known-safe subset?
3. **Default skin.** Does "people running" remain the default with alternates opt-in (recommended — no change for existing students, no screenshot churn in guides), or does the default change?
4. **V1 library scope.** How many sets, and which families? The owner named animals, robots, and symbols. Recommendation: three sets plus the existing default, sized so every slot in every set can be checked by hand.
5. **Portability.** Does skin choice ride GAS Stage 2 portable state as a convenience, or stay strictly device-local?

## Deferred, Recorded So It Is Not Lost

- **Textured/animated sprite tiles** (V9, V10) — gated.
- **Per-level or per-arc skin overrides** — not requested; would complicate the legibility guarantee.
- **Teacher-level skin policy** (e.g. locking a class to one set) — plausible classroom need, no evidence it is wanted yet.
- **Colourblind-specific palettes** — distinct from light/dark and arguably more valuable; deserves its own consideration rather than being folded in.

## Downstream Packet Slate

| Packet | Scope | Notes |
| --- | --- | --- |
| **P1 — Canvas palette extraction** | Replace ~29 inline `p.fill`/`p.stroke` literals across four render files with a named palette; no visual change | Decision-independent, do first, ships with zero user-visible diff. Golden-image or per-call-site assertions should pin "no visual change" |
| **P2 — Skin registry and picker** | Skin registry, generalise the `resolveRunnerDisplayEmoji` seam, 2–3 curated sets, settings UI, the V2 lint, V12 test decoupling | The visible win. Cheap because the seam already exists |
| **P3 — Light/dark theme** | CSS custom properties, canvas palette variants (needs P1), Blockly theme from scratch, contrast validation in both modes | Own packet, own gate. The largest of the four |
| **P4 — Animation options** | Extend the existing toggle group | Small, incremental |
| **P5 — Sprite support** | Gated. Reconsider only if a licensing-clean set is identified *and* the V4 semantic contract can be preserved *and* P2's indirection held | Do not schedule speculatively |

Recommended order: **P1 → P2 → P4 → P3**, with P5 unscheduled. P1 first because it unblocks two others and is safe. P3 late because it is the biggest and benefits from P1 being settled.

## Falsification Check For This Charter's Own Claims

The claims most likely to be wrong, and what would falsify each:

- *"The resolve seam is the single appearance point for runners."* Falsified if any render path draws a runner glyph without going through `resolveRunnerDisplayEmoji`. **P2 must verify this by search before relying on it.**
- *"The overlay layer can carry frozen state alone."* Falsified if removing the distinct frozen glyph makes frozen state unreadable at projector distance for any curated set. Testable cheaply with one mockup before committing V1.
- *"~29 inline colour call sites."* A count from a single grep. P1 should re-derive it rather than trust this number.
- *"Skin choice is not evidence."* Falsified if any analyzer, ledger, or fingerprint path turns out to read a presentation preference. Worth one search during P2.

## Authority And Contracts

Required reading for downstream packets:

- This charter.
- `src/render/runnerVisuals.js`, `src/render/drawBoard.js`, `src/render/effects.js` — the seam, the palette gap, the overlay layer.
- `src/config/constants.js` — `RUNNER_EMOJI_BY_ROLE`, the directional-glyph flags, cell types.
- `docs/subsystems/ui-mode-contract.md` and `docs/subsystems/p5-surface-map.md`.
- `docs/CopyVoiceContract.md` — any student-facing settings copy is in scope for it.
- `docs/TESTING.md` — tier policy, and the `plan-122` note on timing-sensitive browser tests.

Contracts that constrain all downstream work:

- Game rules, one-action-per-turn semantics, level content, and Blockly behaviour are untouched by every packet in this slate. **Visual customization changes no game outcome.**
- The app stays a static Vite build with no server dependency.
- Accessibility does not regress: keyboard reachability, contrast, screen-reader semantics, and reduced-motion behaviour hold under every allowed combination.
- Subsystem notes are updated in the same patch as the behaviour they describe.

## Stop Conditions

Downstream packets stop and ask if:

- a legibility rule cannot be expressed as a check and would have to rely on authoring discipline alone;
- a skin choice turns out to affect any game outcome, narration string, or evidence field;
- light/dark work reaches into game-rule or level code rather than presentation;
- the sprite gate (P5) looks like it is being opened by momentum rather than by its stated conditions.
