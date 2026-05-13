# Plan 15 Progress Report — Pilot Readiness

Date: 2026-05-13  
Status: **Complete**

---

## Changes Made

### 1. `src/config/constants.js`
- Set `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING` from `true` to `false` (line 18, one-character change).
- Progressive scaffolding is now active for all builds including local dev.

### 2. `src/core/levels.js` — new exported functions
- `unlockAllGuidedLevels(app)`: sets every LOCKED guided level to AVAILABLE without changing PASSED levels.
- `restoreProgressionState(app)`: rebuilds the correct sequential state — level 1 AVAILABLE, all PASSED levels stay PASSED, the level immediately after the last PASSED run is AVAILABLE, all others LOCKED.
- Both functions are used by the dev-only toggle (below) and exported for test use.

### 3. `src/main.js` — dev-only unlock toggle
Added a dev-only "Unlock levels / Lock levels" button to the app header alongside the existing admin link. Guarded by `import.meta.env.DEV` so the toggle is tree-shaken out of production builds entirely.

- Button id: `#devUnlockLevelsButton`
- CSS class: `app-header-icon-button` (matches other header controls)
- Label: "Unlock levels" (default) / "Lock levels" (when active)
- State persisted in `sessionStorage` under key `bba:dev-unlock-all-levels`; sessionStorage is scoped to the browser tab and never reaches exported files
- Clicking "Unlock levels" calls `unlockAllGuidedLevels(app)` and re-renders
- Clicking "Lock levels" calls `restoreProgressionState(app)` and re-renders
- On page load, the persisted state is restored immediately so the teacher doesn't lose their unlock after a refresh

### 4. `help.html` — Sidebar additions
- Added `<a href="#general-saving">Saving your work</a>` to the existing **General** nav group.
- Added a new **Projects** nav group (between General and Blocks) with a single link: `<a href="#general-projects">What is a project?</a>`.

### 5. `help.html` — New main-content sections
**`#general-saving` — "Saving Your Work"**
Explains: progress is auto-saved in browser; to share with teacher, click the download icon in the top-right header; type the expected name; a file downloads; the file includes progress, code snapshots, and a verification code.

**`#general-projects` — "What Is A Project?"**
Explains: some levels are grouped into projects; code carries forward; Reset Level keeps project code; the two projects are Strategy Brain (solo logic) and Team Strategy Script (multi-ally coordination).

### 6. `help.html` — Expanded existing sections
**"Guided Levels Vs Free Play" (`#general-modes`)**  
Added bullet: _"Some guided levels are grouped into **projects** where your code carries forward from one level to the next."_

**"How Block Programs Work" (`#blocks-how`)**  
Added paragraph: _"In project levels and free play, multiple allies can share the same program. Each ally runs the program on its own turn, so two allies may take different branches of the same `if/else` block depending on their position, what they are carrying, or their runner index."_

### 7. `help.html` — Advanced block description expansions
Six block cards in `#blocks-advanced` received a second `<p>` usage-example sentence:

| Block | Added sentence |
|---|---|
| AND | "Use it when two things must both be true before acting — for example, an enemy is nearby AND you have freeze ready." |
| OR | "Use it when either warning sign should trigger the same response." |
| NOT | "Use it to say 'do this when the condition is NOT true' instead of writing a separate else branch." |
| Runner index | "Use it with Compare values to give different allies different jobs — for example, make index 0 chase the flag while index 1 defends." |
| Distance to target | "This counts how many squares away the target is. Use it with Compare values to react when something gets close or far away." |
| Compare values | "Use it with Runner index or Distance to target to make number-based decisions." |

### 8. `tests/unit/guided-level-contracts.test.js` — test fixes
- Replaced "guided mode initializes with all levels available during testing" with **"guided mode cold start: level 1 available, all others locked"**. The new test asserts that `move-to-target` is `AVAILABLE` and every other level is `LOCKED` on cold init. The AUTO_SKIP assertion is preserved.
- Replaced the single "generic sensing authored levels unlock sequentially and preserve open target cells at runtime" test with **two focused tests**:
  - **"guided levels unlock sequentially when completed"** — calls `completeLevel(app, LEVEL_RESULT.PASSED, "win_condition_met")` directly on sensor-barrier-branch and watch-the-wall, then asserts the next level becomes AVAILABLE. This tests the actual unlock gate without relying on actor positioning.
  - **"generic sensing authored levels place target cells with no runner blocking them at runtime"** — preserves the original open-cell assertions for find-the-human (5,2) and relay-race (6,3), now using `Object.keys(levelProgress).forEach(id => PASSED)` to reach those levels legally.
- Added `completeLevel` to the test file's import from `../../src/core/levels.js`.

### 9. `tests/browser/dev-unlock.spec.js` — new browser spec
Five browser tests covering the dev-only toggle:

| Test | What it checks |
|---|---|
| dev unlock button appears in the app header during local dev | `#devUnlockLevelsButton` visible with "unlock levels" text |
| dev unlock button is absent from the production build | No JS bundle in `dist/assets/` contains the string `devUnlockLevelsButton` |
| enabling the dev unlock toggle makes all guided levels available | After click, `levelProgress` has zero LOCKED entries |
| disabling the dev unlock toggle restores progression state | After enable then disable, level 1 is AVAILABLE and level 2 is LOCKED |
| level picker can navigate to a late level after dev unlock | Level picker shows "Full Team Tactics" without a "locked" label |

---

## L28 Badge Interaction — Requirement 6 Findings

**File inspected:** `src/ui/levels.js` (badge rendering) and `src/ui/projectSignifiers.js` (project badge).

Level 28 (`full-team-tactics`) has both `levelKind: "challenge"` and `project: createProjectMetadata(STRATEGY_BRAIN_PROJECT, 6, { isCapstone: true })`.

Badge rendering in `renderLevelSignifiers(level)` at `src/ui/levels.js:133`:
```js
function renderLevelSignifiers(level) {
  return `${renderProjectBadge(level)}${renderChallengeBadge(level)}`;
}
```

- `renderProjectBadge` emits `<span class="level-kind-badge level-kind-badge-project">Project</span>` (because L28 has project.id)
- `renderChallengeBadge` emits `<span class="level-kind-badge">Challenge</span>` (because levelKind === "challenge")

**Result: Both badges render side by side. No conflict.** The `isCapstone` flag has no dedicated badge; it only affects workspace callouts (which fire on project-start levels, not capstone levels), utility predicates, and tutorial copy.

> Note: The plan referenced `src/ui/levelPicker.js`, which does not exist. Badge rendering is handled in `src/ui/levels.js` and `src/ui/projectSignifiers.js`. The reference was stale; the relevant files are named above.

---

## Test Results

### Unit tests — `npm test`
**96 pass, 0 fail** (up from 93 pass / 2 fail before the repair pass; the extra test is the new sequential-unlock test split from the old omnibus test).

### Browser tests — `npm run test:browser -- --reporter=line`
**61 pass, 0 fail** on a clean server start.

### Production build — `npm run build`
**Passes cleanly.** 122 modules transformed.
- `dist/help.html` emitted at 20.61 kB (new sections included).
- `dist/admin.html` not emitted (correct).
- Production bundle verified: `devUnlockLevelsButton`, `DEV_UNLOCK_KEY`, `unlockAllGuidedLevels`, and `restoreProgressionState` strings are absent from all `dist/assets/*.js` files — the `import.meta.env.DEV` guard tree-shakes the toggle out completely.
- Pre-existing chunk-size warnings for Blockly and p5 bundles are unchanged.

---

## Validation Checklist

- [x] `UNLOCK_ALL_GUIDED_LEVELS_FOR_TESTING` is `false` in `src/config/constants.js`.
- [x] `help.html` has a "Projects" section in the sidebar and main content.
- [x] `help.html` has a "Saving Your Work" section in the sidebar and main content.
- [x] "How Block Programs Work" mentions shared programs and multiple allies.
- [x] "Guided Levels vs Free Play" mentions project levels.
- [x] Runner index, Distance to target, AND, OR, NOT, and Compare values block cards have expanded descriptions.
- [x] L28 badge interaction is documented (no conflict — badges compose correctly).
- [x] `npm test` passes (96/96).
- [x] `npm run build` passes.
- [x] `npm run test:browser -- --reporter=line` passes (61/61).
- [x] Dev-only unlock toggle present in local dev, absent from production bundle.
- [x] No unrelated files were changed.
- [x] Progress report reflects final state.

---

## Remaining Risks

None. All stop conditions were resolved:
- The two test failures caused by the unlock flag change were fixed with proper test rewrites (no restore of the flag).
- The dev-only toggle provides the teacher/developer convenience that the flag previously supplied, without exposing it to students.
- The `levelPicker.js` reference in the plan was stale; the correct files were found and inspected.
