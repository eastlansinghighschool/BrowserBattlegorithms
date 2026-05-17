# Plan 38 Progress Report — Learning Coach Text

**Date:** 2026-05-17  
**Status:** complete  
**Tests:** 29/29 unit (coaching-narration), 134/134 full suite  
**Build:** clean (no new errors)

---

## Artifacts delivered

| Artifact | Notes |
|---|---|
| `src/ui/coachingNarration.js` | New module — templates, cadence, delivery |
| `src/ai/learningMoments.js` | Unchanged from Plan 37 |
| `tests/unit/coaching-narration.test.js` | 29 tests covering all 6 kinds + cadence + integration |
| `index.html` | Added `#board-coaching-strip`, `#board-coaching`, coaching toggle |
| `src/assets/styles/components/layout.css` | Added `.board-coaching-strip` warm-yellow styles |
| `src/ui/narration.js` | Exported `getRunnerLabel` (one-line change) |
| `src/ui/controls.js` | Coaching toggle binding |
| `src/core/state.js` | `coachingModeEnabled`, `lastCoachingText` |
| `src/core/setup.js` | Reset `lastCoachingText` in `initializeMatch` and `initializeDisplayState` |
| `src/core/turnEngine.js` | `app.hooks.announceCoachingMoments?.(app)` in `finalizeCompletedTurn` |
| `src/main.js` | Import + hook wiring + `syncCoachingNarration` in `syncUi` |

---

## Open Decisions resolved (2026-05-17)

| # | Decision | Resolution |
|---|---|---|
| 1 | Cadence defaults | Confirmed as proposed: bounced/ignored/index_unhandled = first-per-attempt; resource_guard/recurring = every time; no_action_selected = slow-trace only |
| 2 | Delivery surface | Option B — sibling `#board-coaching` + `#board-coaching-strip`, separate from Plan 36 narration surface |
| 3 | Curriculum gating | Option C — tiered phrasing: specific block-named text when guard block is in the current toolbox, generic otherwise |
| 4 | Default setting | Packet proposal confirmed: default off (`coachingModeEnabled: false`) |

---

## Design notes

### Cadence implementation
`shouldShowCoachingMoment` mutates `recurrenceState.perLevelAttempt["shown:kind:runnerId"]` for FIRST_TIME_ONLY kinds. The recurrence state is shared with Plan 37's occurrence counters but uses distinct key prefixes (`"shown:"` vs `"count:"`). Both reset together on level reset via `initializeDisplayState` / `initializeMatch`.

### Slow-trace threshold
`no_action_selected` coaching fires only when `state.animationSpeedFactor <= 0.5`. This matches the existing slow-trace UI mode semantics. When running at normal speed the message would appear and vanish too quickly for a student to read.

### Curriculum gating (tiered phrasing)
`formatCoachingMessage` receives `state.currentToolboxBlockTypes` and produces either:
- **Specific**: names the block (e.g. `"Try wrapping that in a 'Can Jump?' check."`) when the guard block is available to the student
- **Generic**: uses concept-only language (e.g. `"Try adding a readiness check before that action."`) otherwise

This ensures coaching never names a tool the student can't yet use.

### Runner label sharing
`getRunnerLabel` was already in `narration.js`. One-line export change rather than duplicating the logic. The coaching module imports it directly.

### No scope deviations
Plan 38 shipped within its stated bounds. No changes to the Plan 37 classifier shape, no new event kinds, no voice synthesis.

---

## Test coverage summary

- `formatCoachingMessage`: all 6 moment kinds including all obstacle reasons for `bounced`, specific vs generic phrasing for `resource_no_readiness_guard`, occurrence count inclusion for `recurring_pattern`, graceful null handling for `runner_index_unhandled`, empty string for unknown kind
- `shouldShowCoachingMoment`: first-time / suppressed on second call for FIRST_TIME_ONLY kinds, every-time for ALWAYS_SHOW kinds, slow-trace gating for `no_action_selected`, per-runner independence
- `computeCoachingText`: coaching-off short-circuit, cadence suppression on second call, empty log → empty string, toolbox-gated phrasing (specific and generic)

---

## Addendum: test:unit allowlist hygiene (bundled with Plan 38 commit)

The `test:unit` script in `package.json` is an explicit file allowlist that does not self-update. Four narration-sequence test files introduced in Plans 35–38 were never added to it, so `npm test` was silently omitting them:

| File | Tests |
|---|---|
| `tests/unit/narration-event-log.test.js` | 10 |
| `tests/unit/narration-templater.test.js` | 9 |
| `tests/unit/learning-moments.test.js` | 34 |
| `tests/unit/coaching-narration.test.js` | 29 |

All four files were added to the allowlist in this commit. New suite total: **216/216** (was 134). No source changes — `package.json` only.
