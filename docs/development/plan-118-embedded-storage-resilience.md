---
id: plan-118
title: "Embedded And Blocked Storage Resilience"
status: complete
resolution: "Exception-safe storage delivered and orchestrator-verified. New src/platform/safeStorage.js guards every window.localStorage property access, memoizes a real round-trip probe, and classifies QuotaExceededError as accessible-but-full rather than blocked; rg confirms no module outside it touches window.localStorage. Nine call sites migrated mechanically, plus resetWorkspaceToCurrentStarter, a third storage writer the packet requirements had not named. Guided levels gain an in-memory workspace fallback strictly gated behind !isLocalStorageAvailable() and inert whenever storage works, with the Plan 45 starter-version compare correctly skipped in the memory-only path. One dismissible per-page-load notice in the existing status surface carries the owner-approved copy verbatim. The preflight-added guided-progress test proves unlock state cannot become more permissive under blocked storage: every level beyond the first stays LOCKED, and a fresh session after a completed level returns LOCKED, proving the write did not persist. A new Playwright spec injects a throwing localStorage getter and proves the banner appears and dismisses in a real browser. 571/571 unit tests, clean build, browser spec passes; dead hasWindowStorage removed. One orchestrator correction at review: the progress report claimed a clearLocalStorage() export that does not exist."
depends_on: []
gate: "CLEARED 2026-09-01. Banner copy, fallback posture, and banner placement all resolved in the Gate section; restate them in the preflight plan and proceed. Nothing remains to stop for before mutation."
summary: >-
  Make every browser-storage access exception-safe behind one shared platform adapter, extend the existing in-memory workspace fallback to guided levels when persistent storage is unavailable, and show one honest banner. Latent defect today, reachable the moment the app is embedded or a student uses strict privacy settings. No GAS dependency.
---
# Plan 118: Embedded And Blocked Storage Resilience

## Packet Metadata

- Packet id: `plan-118`
- Packet title: Embedded And Blocked Storage Resilience
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-01
- Packet type: implementation
- Mutation level: source-code, tests, docs (subsystem notes)
- Approval gate: **cleared 2026-09-01** — banner copy, fallback posture, and placement are all resolved (see Gate below). The implementer restates them in the preflight plan and proceeds.
- Depends on: nothing
- Blocks: `plan-119` (shares `getStoredWorkspaceXmlText` / `saveWorkspaceToLocalStorage`; 119 must write its recovery slot through this packet's safe accessors), and any future embedded/GAS integration work
- Expected artifacts:
  - new `src/platform/safeStorage.js` exception-safe local-storage adapter
  - every current unguarded `window.localStorage` access migrated to it
  - guided-level in-memory workspace fallback active only when persistent storage is unavailable
  - one session-scoped student-facing banner when storage is unavailable
  - unit tests driven by a throwing storage stub
  - updated `docs/subsystems/blockly-workspace.md` and `docs/subsystems/ui-mode-contract.md` as applicable
  - progress report
- Progress report folder: `reports/development/plan-118-embedded-storage-resilience/`
- Progress report file: `reports/development/plan-118-embedded-storage-resilience/progress.md`

## Packet Summary

Goal: The app must never throw, and must never silently lose guided work without saying so, when the browser denies site-storage access.

Non-goals:
- Do not add networking, cloud sync, an outbox, or any Google Apps Script surface. This packet is local-only hardening.
- Do not change what is stored, the key names, or the storage schema.
- Do not build a general "storage service" abstraction with quotas, migrations, or namespacing. One narrow adapter, matching current call shapes.
- Do not make the in-memory guided fallback persistent or authoritative.
- Do not touch IndexedDB or `src/usage/`: the usage tracker already degrades to memory when IndexedDB is unavailable. Verify that claim holds; do not extend it.

Depends on: nothing.

Blocks: `plan-119`; all embedded-mode work.

Why this packet exists:
The GAS integration review (`reports/orchestration/gas-integration-commentary/review-claude.md`, finding F7, ratified in `review-synthesis.md` section 10) found that the app's only storage guard is a presence check — `typeof window === "undefined" || !window.localStorage` (`src/ai/blockly/workspace.js:944`, `:999`, and seven sibling sites). When Chrome denies site-storage access to a frame (district `BlockThirdPartyCookies` policy, Incognito, Tracking Protection), **evaluating `window.localStorage` is itself the throwing operation**, so the guard does not guard. Worse, `saveWorkspaceToLocalStorage` (`workspace.js:998-1017`) has no try/catch at all and runs on every non-UI Blockly change event — the highest-churn write path in the app and the least protected. And the existing in-memory fallback (`cacheWorkspaceXml` / `getCachedWorkspaceXml`, `workspace.js:277-295`) explicitly no-ops for Guided Levels, so Free Play degrades gracefully while guided work — where students spend most of their time — has zero fallback.

This is not currently reachable, because direct GitHub Pages is first-party. It becomes reachable the instant the app is framed, and it is already reachable today for any student with strict privacy settings. Fixing it improves the direct-site product and is a hard precondition for any embedding experiment.

## Authority And Contracts

Required reading:

- `docs/subsystems/blockly-workspace.md` — storage key classes, the two-key starter-version shape, and the Free Play in-memory cache contract.
- `docs/subsystems/ui-mode-contract.md` — guided vs Free Play mode behavior.
- `src/ai/blockly/workspace.js:270-300` (the in-memory cache), `:829-850` (the change-event save trigger), `:943-1017` (`getStoredWorkspaceXmlText` and `saveWorkspaceToLocalStorage`).
- `src/ui/preferences.js:29-95` — the closest existing prior art. Note its try/catch covers `getItem`/`setItem` but **not** the `window.localStorage` property access inside `getStorage()`, so it is not exception-safe either.
- `src/core/levels.js:26-74` — guided progress ledger, same pattern.
- `reports/orchestration/gas-integration-commentary/review-claude.md` finding F7 (evidence and falsification test).

Find remaining call sites with `rg "window\.localStorage" src/` rather than trusting this list; at authoring time it was `src/ai/blockly/workspace.js`, `src/core/levels.js`, `src/ui/preferences.js`, `src/ui/blocklyLayout.js`, `src/ui/levels.js`, `src/ui/projectSignifiers.js`, `src/ui/tutorialOverlay.js`, `src/ui/voiceNarration.js`.

Contracts to preserve:

- Storage key names, value shapes, and the Plan 45 two-key starter-version semantics are unchanged by this packet.
- The Free Play in-memory cache keeps its current keying (`player`, `freeplay:teamN`).
- Guided progress unlock state still comes from `bba:guided-level-progress`; an in-memory fallback must not fabricate unlocks that outlive the tab.
- One-action-per-turn semantics, game rules, level content, and Blockly behavior are untouched.
- The app stays a static Vite build with no server dependency.

## Gate (before mutation) — CLEARED 2026-09-01

All three items are resolved. Restate them in the preflight plan; there is nothing to stop for.

1. **Banner copy — RESOLVED.** Exactly this sentence:

   > This browser is blocking saving. You can keep playing, but your program will be lost if you reload or close this tab.

   This is a small correction to the packet's original recommendation, which said only "when you
   close the tab." A reload also loses the work, and students reload constantly — the original
   wording would have been a promise the app could not keep. Do not reword it without owner
   approval; if implementation finds it does not fit the chosen surface, stop and ask rather than
   trimming it.

2. **Fallback posture — RESOLVED as specified.** When storage works, guided levels use storage
   exactly as they do today and the in-memory guided map stays inert. The map activates **only**
   when the capability probe reports storage unavailable, and it is never read alongside a working
   storage. There is no merge, no fallback-on-read-miss, and no second source of truth.

3. **Banner placement and dismissal — RESOLVED as recommended.** Use the existing non-blocking
   status/notice surface other app messages already use; find it rather than inventing a modal.
   Dismissible, shown once per page load, not once per level.

**Voice note.** This string is a systems message, not coaching. It does not belong in the
lesson/coaching channel students read for strategy guidance, and it must not read as though the
student did something wrong. `docs/CopyVoiceContract.md`'s scout/coach speaker governs student
guidance, not honest failure reporting; plain second person is correct here.

## Scope

In scope:
- `src/platform/safeStorage.js` (new file, new directory).
- Migration of all unguarded `window.localStorage` reads/writes/presence checks in `src/` to the adapter.
- Guided in-memory workspace fallback in `src/ai/blockly/workspace.js`.
- One storage-unavailable banner.
- Unit tests.
- Subsystem note updates.

Out of scope:
- IndexedDB, `src/usage/`, `sessionStorage`, cookies.
- Any account-scoped or namespaced key scheme (that is Stage 2 of the GAS work; this packet deliberately leaves the seam clean rather than pre-building it).
- Retry, quota-exceeded eviction, or storage pressure handling.
- `src/workbench/`, `src/admin/`, `scripts/` (not student-facing runtime).

Files and areas likely touched: `src/platform/safeStorage.js`, `src/ai/blockly/workspace.js`, `src/core/levels.js`, `src/ui/preferences.js`, `src/ui/blocklyLayout.js`, `src/ui/levels.js`, `src/ui/projectSignifiers.js`, `src/ui/tutorialOverlay.js`, `src/ui/voiceNarration.js`, one UI notice surface, `tests/unit/safe-storage.test.js` (new), `tests/unit/blockly-workspace.test.js`, `package.json` (`test:unit` file list), `docs/subsystems/blockly-workspace.md`, `docs/subsystems/ui-mode-contract.md`.

### New code surface: `src/platform/`

This packet creates one new top-level source directory. Its contract, to be recorded in `AGENTS.md` "Where Things Live" and `docs/ARCHITECTURE.md`:

> `src/platform/` — thin, dependency-free adapters over browser capabilities that can be denied or absent (storage, and later others). Modules here import nothing from `src/core/`, `src/ui/`, `src/render/`, or `src/ai/`; every other layer may import from here. Each module answers "is this capability available?" without throwing, and provides a no-throw operation for it.

Rationale for a new directory rather than a home in an existing one: this code is not a game rule (`src/core/`), not DOM/UI state (`src/ui/`), and not Blockly (`src/ai/blockly/`), but all three need it. Putting it in any of them would create a layering inversion the project's own placement contract forbids.

## Work Plan

1. Inspect current state; enumerate every `window.localStorage` site with `rg`. Confirm the "presence check itself throws" claim by writing the failing test first (a stub whose `localStorage` getter throws `SecurityError`).
2. Present the gate items above. **Stop for owner approval.**
3. Write `src/platform/safeStorage.js`.
4. Migrate call sites mechanically, one module at a time, running the relevant unit test after each.
5. Add the guided in-memory fallback, active only under storage-unavailable.
6. Wire the banner.
7. Update subsystem notes.
8. Run validation; write the progress report.

## Implementation Requirements

### R1 — `src/platform/safeStorage.js`

Required behavior. Export at minimum:

- `isLocalStorageAvailable()` — memoized boolean for the distinction this packet owns: accessible
  browser storage versus denied/absent storage. Acquire the property inside try/catch, then use a
  write/read/delete probe to catch silent no-op storage. Memoize per page load; do not re-probe on
  every call.
- `readLocalStorage(key)` returning `string | null`. Never throws.
- `writeLocalStorage(key, value)` returning `boolean` (did it persist). Never throws.
- `removeLocalStorage(key)` returning `boolean`. Never throws.
- `setStorageForTesting(storageLike | null)` — test seam, mirroring the existing `setCustomStorage` idea in `src/ui/preferences.js`. Resets the memoized capability result.

Constraints:
- No imports from anywhere else in `src/`.
- Every access to the `window.localStorage` **property** happens inside try/catch, not only the method calls.
- Failure is silent to the caller by return value; log at most once per page load via `console.warn`, not once per write (the Blockly change path would flood the console).

Edge cases: `window` undefined (node tests); property access throws; `getItem` throws; storage
present but a silent no-op sink — the round-trip probe catches this. Classify
`QuotaExceededError` separately: if the storage property was acquired but the capability probe
cannot write because quota is full, return `true` for *accessible/not blocked*, while the
individual write returns `false`. Do not activate the memory-only path or the "browser is
blocking saving" banner for a quota error. Storage-pressure UX is existing debt and explicitly
out of scope; document this distinction so a later packet can address it honestly.

### R2 — Call-site migration

Required behavior: no module outside `src/platform/` touches `window.localStorage` directly. `rg "window\.localStorage" src/` returns hits only in `src/platform/safeStorage.js`.

Constraints:
- Preserve each call site's existing semantics exactly, including `src/ui/preferences.js`'s legacy-key migration and its `setCustomStorage` test seam (rewire that seam to the adapter rather than deleting it, or update its tests in the same patch).
- Preserve `src/core/levels.js`'s current behavior when storage is missing (returns defaults, does not throw, does not fabricate unlocks).
- Do not "improve" any call site's logic while migrating it. Mechanical only.

### R3 — Guided in-memory workspace fallback

Required behavior: when `isLocalStorageAvailable()` is false, guided-level workspace XML round-trips through an in-memory map for the life of the page, so a student can move between a level and the picker and back without losing their program.

Constraints:
- When storage **is** available, guided behavior is byte-for-byte what it is today — the guided branch of `cacheWorkspaceXml`/`getCachedWorkspaceXml` keeps its current no-op.
- The guided in-memory map is keyed by the same storage key the level would have used, so no new keying concept is introduced.
- The Plan 45 starter-version compare is skipped entirely in the memory-only path (there is no persisted version key to compare against, and inventing one would resurrect the bug Plan 45 fixed). Document this.
- The map is never written back to storage if storage later becomes available mid-session. Do not attempt recovery-on-reconnect; that is unbounded scope.

Edge cases: project shared workspaces (`bba:guided-project-workspace:<projectId>`) and PvP team workspaces must use the same fallback path as their storage path; do not special-case them differently from today.

### R4 — Student-facing banner

Required behavior: exactly one visible notice per page load when `isLocalStorageAvailable()` is false, using the owner-approved copy from the gate.

Constraints:
- Non-blocking. It must never gate play, gate a level, or steal focus.
- Reuse the existing app notice/status surface. Do not add a modal.
- Keyboard reachable and dismissible; announced to assistive technology the same way the app's other status messages are (match the existing pattern; do not invent a second live region if one already serves this).
- Do not show it when storage works, and do not show it for a `QuotaExceededError` write failure (different problem, different message, out of scope).

Pedagogy check: the banner is a truthful systems message, not feedback about the student's program. It must not read as though the student did something wrong, and must not appear inside the lesson/coaching voice channel where students read strategy guidance.

### R5 — Tests

Add `tests/unit/safe-storage.test.js` and extend `tests/unit/blockly-workspace.test.js`:

- A storage stub whose `localStorage` property getter throws: assert `isLocalStorageAvailable()` is false and that no export throws.
- A storage stub whose `setItem` throws: assert `writeLocalStorage` returns false and does not throw.
- A quota-error stub: assert the capability flag stays true.
- **Regression proof for the real bug:** simulate the Blockly change-event save path (`saveWorkspaceToLocalStorage`) against a throwing storage and assert it completes without throwing. Verify this test *fails* against the pre-packet code and record that in the progress report — a test that passes both before and after has proved nothing.
- Guided fallback: with storage unavailable, save a guided workspace, read it back, assert the XML survives; assert the same sequence with storage available takes the storage path and leaves the memory map empty.
- **Guided-progress unlock behavior under blocked storage (added 2026-09-01 at preflight review).** `src/core/levels.js` is the one migration this packet's stop conditions single out as ambiguity-prone, and "returns defaults, fabricates no unlocks" is an assertion that needs a test rather than a claim. Extend `tests/unit/guided-progress.test.js`: with a throwing storage, assert reading progress returns the default locked state without throwing, and assert that writing progress neither throws nor reports success. Unlock state must never become *more* permissive because storage was denied — that would hand students the whole campaign on a locked-down Chromebook.

Append every new test file to the `test:unit` list in `package.json` (it is an explicit file list, not a glob).

## Commands

```powershell
node --test tests/unit/safe-storage.test.js tests/unit/blockly-workspace.test.js
```

```powershell
npm test
```

```powershell
npm run build
```

```powershell
npm run test:browser:smoke
```

## Validation Checklist

- [ ] `rg "window\.localStorage" src/` matches only `src/platform/safeStorage.js`.
- [ ] The regression test fails on pre-packet code and passes after (evidence recorded in the progress report).
- [ ] `npm test` passes; new test files are registered in `package.json`.
- [ ] `npm run build` passes.
- [ ] `npm run test:browser:smoke` passes (storage behavior is load-bearing for smoke).
- [ ] Guided, Free Play PvCPU, Free Play PvP, and project-arc workspaces all still persist normally when storage works.
- [ ] The banner does not appear in ordinary conditions, and its text matches the gate wording exactly.
- [ ] `docs/subsystems/blockly-workspace.md` and `docs/subsystems/ui-mode-contract.md` read true post-change.
- [ ] `AGENTS.md` "Where Things Live" and `docs/ARCHITECTURE.md` document `src/platform/`.
- [ ] No unrelated files changed.

## Stop Conditions

Stop and ask for review if:

- the approved banner sentence does not fit the chosen notice surface (stop and ask; do not trim it);
- a call site's current behavior is ambiguous enough that migrating it requires a product decision (especially `src/core/levels.js` unlock semantics under memory-only storage);
- the guided in-memory fallback turns out to require changes to level loading, the picker, or progress hydration beyond the workspace accessors;
- the banner cannot be placed in an existing notice surface without new UI structure;
- the pre-packet regression test does **not** fail — that would mean F7's mechanism is wrong and the packet's premise needs owner review before proceeding;
- `npm run test:browser:smoke` fails in a way that suggests the adapter changed real persistence behavior.
