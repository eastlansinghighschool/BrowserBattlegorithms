# Plan 58: Runner Index Badges

## Packet Metadata

- Packet id: plan-58
- Packet title: Runner Index Badges
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-19
- Packet type: implementation / visual / source-code / tests
- Mutation level: source-code / tests / docs
- Approval gate: before changing the badge to anything other than a small team-tinted numeric label, before exposing any new state field, before drawing badges for entities other than runners
- Expected artifacts:
  - new `drawRunnerLabelBadge(p, runner, state)` helper in `src/render/effects.js`
  - badge wired into `Runner.display` for every runner (allies AND enemies) when `state.showRunnerIndexBadges` is true
  - badge component takes `(side, index)` internally so a future labeling scheme can extend without a rewrite
  - placement rules that avoid collision with the existing frozen countdown badge
  - reduced-motion path (badge renders identically; no animation)
  - unit tests for the gating logic and the side-resolution logic
  - Playwright smoke spec: with toggle on, badges appear over every runner on Level 30; with toggle off, none appear
  - subsystem note update in `docs/subsystems/p5-surface-map.md` (badges are a new on-canvas decoration)
  - progress report
- Progress report folder: `reports/development/plan-58-runner-index-badges/`
- Progress report file: `reports/development/plan-58-runner-index-badges/progress.md`

## Packet Summary

Goal: When the `showRunnerIndexBadges` setting is on, draw a small numeric badge on every runner on the board — allies AND enemies. The badge is team-tinted (background color matches team color, low opacity) and shows a numeric index that disambiguates runners of the same side. Default: off (controlled by the Plan 57 gear toggle). On Level 30 (Index Jobs) and any future role-coordination level, the badge becomes the canonical visual answer to "which ally is index 0?" and also to "which enemy is enemy #1?".

Why this matters: students writing index-based jobs need to *see* which runner is which, immediately and persistently. The cell inspector (Plan 56) answers the question on demand; the badge answers it always. The two are complementary: the inspector is for debugging, the badge is for following along.

Non-goals:

- Do not change game rules, scoring, or any state.
- Do not introduce a new toggle. The Plan 57 toggle `state.showRunnerIndexBadges` is the only control.
- Do not show any field other than a numeric index. No letters, no side prefix, no role label. Side is conveyed by color.
- Do not animate the badge. No pulse, no fade-in.
- Do not draw badges for non-runner entities (flags, barriers, goals). Those are out of scope.
- Do not draw a badge for the human player's actively-controlled runner if the existing human-player label already overlaps the badge position — instead, displace the badge per Req 3 (no human-player suppression).
- Do not deploy.

Depends on:

- Plan 57 (Settings Gear Panel) lands the `showRunnerIndexBadges` state property, persistence, and toggle. This packet only adds rendering.
- Plan 49 visual vocabulary in `src/render/effects.js` (existing badge precedents: frozen countdown badge).
- `src/core/teams.js` for team color resolution — reuse, do not redefine.

Blocks:

- Future role-coordination guided levels that assume on-board index visibility is available.

Why this packet exists:

A pilot session on 2026-05-19 surfaced that Level 30 (Index Jobs) — which explicitly teaches index-based role assignment — gives students no visual way to tell ally #0 from ally #1. The cell inspector (Plan 56) helps for one cell at a time; the badge helps for the whole board at once. The integration owner has explicitly asked that the badge cover *all* runners (ally and enemy), not just allies, so that the visual vocabulary is symmetric and so future scenarios that involve enemy disambiguation are already supported.

## Recorded Decisions

Resolved by integration owner before dispatch (2026-05-19):

### Decision 1: All runners, both sides

Badge renders for every runner on the board when the toggle is on, ally or enemy. Side is conveyed by background color (team-tinted). The numeric index disambiguates runners on the same side.

### Decision 2: Default off

The Plan 57 toggle defaults to off so that levels which do not need index disambiguation stay clean. Students enable when relevant; the Level 30 lesson copy and any future role-coordination lesson copy can suggest enabling.

### Decision 3: Numeric only, no letter prefix

Background color carries side information. The numeric label carries index. No `A0`/`E0` prefixes. This is language-agnostic and consistent with the project's visual vocabulary (Plan 48's snowflake chip, Plan 49's countdown badge).

### Decision 4: Component takes `(side, index)` internally

Even though v1 displays only the index, the function signature accepts both so that a future "labeling scheme" change (e.g., showing role badges instead of index, or showing `R0`/`E0` as a teacher option) does not require a rewrite. This is the only forward-compat allowance in the packet.

### Decision 5: Collision avoidance with frozen badge

The frozen countdown badge (Plan 49) already renders in the upper-left area of the runner glyph. The index badge renders in the **lower-left** of the runner glyph. If both apply (a frozen indexed runner), both render without overlap. Specifics in Req 3.

### Decision 6: Index source

For allies, use the existing `allyIndex` property (assigned in `src/core/setup.js`). For enemies, the implementing agent verifies whether an analogous property exists on enemy runners; if it does, use it; if not, derive an index from order-of-creation within the enemy team (e.g., array index in the enemy collection) and document the derivation in the progress report. Do not invent a new persisted property without owner approval.

### Decision 7: Index is stable across the level

Whatever derivation is used, the same runner must show the same number for the entire level. If the derivation is order-of-creation, that is naturally stable as long as runners are not reshuffled mid-level. Verify by reading `src/core/setup.js` and confirming runner identity is stable; if it is not, surface and stop.

## Required Reading

- `docs/development/plan-57-settings-gear-panel.md` — adds the toggle this packet consumes; confirm landing order before starting.
- `docs/subsystems/p5-surface-map.md` — canvas vs DOM seam; badges live on canvas.
- `src/render/effects.js` — pattern for badge rendering. `drawFrozenCountdownBadge` is the structural reference.
- `src/entities/Runner.js` — where `display()` lives and where the badge call goes.
- `src/core/setup.js` — where ally and enemy runners are constructed; confirm `allyIndex` and whether an enemy equivalent exists.
- `src/core/teams.js` — team color helpers. Reuse, do not redefine.
- `src/config/constants.js` — `CELL_SIZE` for placement math.
- `tests/unit/freeze-visualization.test.js` — example of how badge rendering is unit-tested. New badge tests follow the same pattern.

Optional / contextual:

- `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md` — for the list of guided levels that teach runner index reasoning (Level 30 is the canonical one; others may exist).

## Scope

In scope:

- New `drawRunnerLabelBadge(p, runner, state)` in `src/render/effects.js`. Signature uses runner + state; internally resolves side and index, then calls a small private helper `drawIndexLabel(p, x, y, index, sideColors)` that takes side colors and index directly. This keeps the internal helper testable in isolation and ready for future labeling schemes.
- Wire `drawRunnerLabelBadge` into `Runner.display(p, state)` after the existing frozen badge call.
- Render gate: `if (state?.showRunnerIndexBadges !== true) return;` (default off; explicit opt-in only).
- Side resolution: read runner's team from the existing property; resolve background color via `src/core/teams.js`.
- Index resolution: ally → `allyIndex`; enemy → existing property if found, else stable order-of-creation derivation (documented in progress report).
- Placement: lower-left corner of the runner cell, with sub-pixel inset so the badge sits cleanly inside the cell border. See Req 3 for exact coordinates.
- Visual: rounded-rect background, team-tinted at ~50% opacity; white numeric label at high opacity; thin 0.75 px white border at ~50% opacity for legibility on dark/light backgrounds.
- Reduced-motion: badge renders identically; no animation either way. So `prefersReducedMotion` is not relevant to the badge.
- Unit tests:
  - badge no-ops when `state.showRunnerIndexBadges` is unset or false
  - badge renders when `state.showRunnerIndexBadges` is true and runner has an index
  - badge skips when runner has no resolvable index (and this is logged as a one-time warning, not a crash)
  - ally side resolution and enemy side resolution produce different background colors
  - index value used matches the source property
- Playwright smoke spec: load Level 30 with toggle on; assert badges visible over each ally and each enemy; toggle off via gear; assert no badges.

Out of scope:

- Any change to `showRunnerIndexBadges` defaults, persistence, or the gear UI. That is Plan 57.
- A teacher-facing labeling scheme (e.g., role names). The component takes `(side, index)` so this can be a future packet.
- Badges for non-runner entities.
- Tooltip integration: the cell inspector (Plan 56) already shows index in its text output; do not add a redundant inspector hook.
- Any change to how `allyIndex` is assigned.

Files and areas likely touched:

- `src/render/effects.js` — new helper.
- `src/entities/Runner.js` — call site in `display()`.
- `src/core/teams.js` — read-only; reuse color helpers.
- `tests/unit/runner-label-badge.test.js` (new)
- `tests/browser/specs/runner-index-badge.spec.js` (new, smoke tier)
- `docs/subsystems/p5-surface-map.md` — short addition to the on-canvas badge inventory.

## Work Plan

1. Confirm Plan 57 has landed and `state.showRunnerIndexBadges` exists in `createInitialState`. If not, stop and ask.
2. Read `src/core/setup.js` to confirm `allyIndex` for allies and to determine the enemy index source.
3. Implement the internal helper `drawIndexLabel(p, x, y, index, sideColors)` with unit tests first. Pure rendering; takes pre-resolved inputs.
4. Implement `drawRunnerLabelBadge(p, runner, state)` that resolves side + index from the runner and delegates to the helper.
5. Wire into `Runner.display` after the frozen-badge call. Verify on Level 30 in browser smoke.
6. Run frozen-badge regression: the previously-frozen countdown badge must remain unaffected. If a frozen runner also has an index, both badges must render without visual overlap.
7. Add smoke spec.
8. Update subsystem note.
9. Write progress report listing the side-resolution path, the index-resolution path, and any runners (e.g., human-controlled) for which the badge had to be displaced.

## Implementation Requirements

### Req 1: Toggle gate

Required behavior: `drawRunnerLabelBadge` is a no-op unless `state?.showRunnerIndexBadges === true`. The gate is explicit (`=== true`), not `!== false`, because the *default* is off.

Constraints:

- Must not crash if `state` is undefined or has no `showRunnerIndexBadges` key (tests sometimes pass minimal mock state). Treat both as "off".
- Single-flag gate. Do not introduce per-level or per-runner overrides.

Edge cases:

- Plan 57 has not yet landed: the property does not exist; behavior is "off". That is the correct fallback; do not error.

Expected artifact: gate at the top of `drawRunnerLabelBadge`.

### Req 2: Side and index resolution

Required behavior: Given a runner, resolve `(side, index)`:

- Side: ally or enemy, based on the existing team property. Translate to a `sideColors` object via `src/core/teams.js` helpers.
- Index: for allies use `allyIndex`. For enemies use an analogous property if it exists; otherwise compute a stable order-of-creation index from the enemy collection on `state` and document the derivation in the progress report.

Constraints:

- If side cannot be resolved, no badge. Log a one-time console warning, do not crash.
- If index cannot be resolved, no badge for that runner. Same warning policy.
- Stability: a given runner must always resolve to the same index for the lifetime of the level.

Edge cases:

- Human-controlled runners: still get a badge (humans count toward "ally runners" and have an index in the existing setup; verify). If the existing human-player label overlay collides visually with the badge, displace per Req 3.
- NPC enemies: get a badge. Their index is the enemy-team derivation per Decision 6.

Expected artifact: `drawRunnerLabelBadge` + supporting unit tests covering both side and index resolution paths.

### Req 3: Placement and collision avoidance

Required behavior:

- Badge dimensions: ~14×14 px box, rounded 4 px corners.
- Default position: **lower-left of the runner cell**, inset 3 px from the cell's left edge and 3 px from the cell's bottom edge. (Frozen badge currently lives in the upper-left; lower-left puts the two corner badges on opposite vertical sides.)
- If the runner has an active human-player label or other overlay that already occupies the lower-left region, shift the badge upward by `CELL_SIZE / 2 - badgeHeight - 4` so it sits at the cell's vertical midline on the left edge. Document any case where displacement was needed.
- Text style: bold, ~9 px, centered in the badge.

Constraints:

- Badge must remain fully inside the cell bounds. No overflow into neighboring cells.
- Badge must remain legible on top of every territory zone tint and every team body color.

Edge cases:

- Frozen + indexed runner: frozen badge upper-left, index badge lower-left. Verify on a level that produces a frozen ally.
- Two runners on the same cell (rare but possible mid-collision frame): each runner draws its own badge; visual overlap is acceptable for the one-frame collision window.

Expected artifact: placement constants and rendering math in `drawIndexLabel`.

### Req 4: Visual style

Required behavior:

- Background: team-tinted color from `src/core/teams.js` at ~50% opacity (sufficient to convey side without saturating the cell).
- Border: thin 0.75 px white at ~50% opacity for legibility on both dark and light cell backgrounds.
- Label: white at ~85% opacity, centered.
- No drop shadow. No gradient. No animation.

Constraints:

- Color contrast for the numeric label vs the tinted background: aim for legibility at projector distance. The implementer may darken the background tint floor if a particular team color produces poor contrast — but document the override and prefer adjusting opacity rather than choosing a different hue.
- Match the visual *family* of the frozen countdown badge (rounded rect, thin border, semi-transparent fill). Do not invent a new visual language.

Expected artifact: rendering implementation matching Plan 49's badge idiom.

### Req 5: Subsystem note

Required behavior: `docs/subsystems/p5-surface-map.md` lists the index badge under canvas-owned overlays. Add one row to the canvas-vs-DOM table:

```
| Runner index badge (when state.showRunnerIndexBadges is true) | p5 canvas (effects.js, Runner.js) |
```

Constraints:

- Note must remain accurate. Do not add description text that overstates the badge (e.g., do not call it "animated").
- If the note already references frozen badges as "on canvas," the new line should follow the same idiom.

Expected artifact: updated subsystem note in the same patch.

### Pedagogy checks

- Does this help students reason about runner index? **Yes** — directly.
- Does it help with `if`, `else`, comparisons over index? **Yes** — the badge makes `myIndex == 0` visible.
- Does it support decentralized ally coordination via roles? **Yes** — index-based job assignment becomes legible.
- Does it preserve the one-action-per-turn execution model? **Yes** — render-only.
- Does it preserve demo Blockly's no-spoilers policy? **Yes** — badges are runtime state, not solution structure.
- Classroom projector / narrow screens: ~14×14 px badge with team color is visible at typical classroom distance. Acceptable.
- Accessibility: the cell inspector (Plan 56) already announces index via `aria-live`. The badge is a visual reinforcement, not a sole channel.
- Reduced motion: badge is static. No issue.

## Model-Specific Instructions

- Summarize the job in your own words before editing. Confirm Plan 57 landed.
- Write the internal `drawIndexLabel` helper and its unit tests first. The wrapping `drawRunnerLabelBadge` comes second.
- Do not modify `src/core/setup.js` to add a persisted `enemyIndex` property. Derivation from collection order is acceptable for v1; persisted enemy indices are a future packet if needed.
- Do not modify the frozen badge in any way. If you find yourself editing `drawFrozenCountdownBadge`, stop — you are out of scope.
- Do not add intent, role, or non-state fields to the badge. Numeric only.
- Do not draw on enemies *only* or allies *only*. Both sides, always, when toggle is on.
- Do not introduce animation. Static badge.
- If Plan 57 has not landed, stop and report. Do not invent the toggle yourself.
- If the existing human-player label collides with the badge position and Req 3's displacement is insufficient, surface and stop — do not change the human-player label.
- Do not run `git checkout` to recover from a bad edit.
- Do not deploy.

## Commands

```powershell
npm install
npm test
npm run build
npm run test:browser:smoke
```

## Validation Checklist

- [ ] Plan 57 has landed; `state.showRunnerIndexBadges` exists with default false.
- [ ] Unit tests for `drawIndexLabel` and `drawRunnerLabelBadge` pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser:smoke` passes including the new index-badge smoke spec.
- [ ] With the gear toggle off (default), no badges render on any level.
- [ ] With the gear toggle on, every ally on Level 30 shows a numeric badge with the ally team color tint.
- [ ] With the gear toggle on, every enemy on Level 30 shows a numeric badge with the enemy team color tint.
- [ ] A frozen ally shows BOTH the frozen countdown badge (upper-left) AND the index badge (lower-left) without visual overlap.
- [ ] Indices are stable across an entire level run (no flicker, no reshuffle).
- [ ] No badge overflows into a neighboring cell.
- [ ] Plan 49 frozen-badge tests still pass unchanged.
- [ ] Plan 56 cell inspector still shows the same index value the badge displays (cross-check via smoke).
- [ ] `docs/subsystems/p5-surface-map.md` reads true post-change; new row added to the canvas/DOM table.
- [ ] No unrelated files changed.
- [ ] Final report lists the side-resolution path, the index-resolution path (especially for enemies), any displacement edge cases, and any open follow-ups.

## Stop Conditions

Stop and request review if:

- Plan 57 has not landed; the gating toggle does not exist.
- The enemy team has no stable identity-to-index mapping reachable from current state; this would require an authoring change.
- A team color produces unreadable badge contrast even after opacity tuning.
- The human-player label or another overlay collides with the badge in a way Req 3's displacement does not fully resolve.
- A pedagogy concern surfaces — e.g., the badge would reveal something other than ground-truth index.
- A subsystem note other than `p5-surface-map.md` turns out to also need editing.
