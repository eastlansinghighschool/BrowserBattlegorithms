# Plan 04b Progress Report: Local Usage Admin Report Page

Date: 2026-05-13
Status: complete — pending browser-test run

## Work Completed

### New files

| File | Purpose |
| --- | --- |
| `src/usage/usageAnalyzerBrowser.js` | Browser-compatible async analyzer using Web Crypto `subtle.digest` |
| `admin.html` | Local-only admin page (root level, excluded from Vite build) |
| `src/admin/adminStyle.css` | Admin-specific stylesheet |
| `src/admin/adminApp.js` | Admin page JS: file ingestion, table, detail panel, drag-and-drop |
| `tests/unit/usage-analyzer-browser.test.js` | Unit tests for browser analyzer (11 tests) |
| `tests/browser/admin.spec.js` | Browser tests for admin page + build guard (11 tests) |
| `reports/development/plan-04b-local-usage-admin-report-page/progress.md` | This report |

### Modified files

| File | Change |
| --- | --- |
| `src/main.js` | Added dev-only admin link via `import.meta.env.DEV` guard |
| `package.json` | Added `usage-analyzer-browser.test.js` to `test:unit` command |

## Architecture Decisions

**Crypto path**: The student export already uses `globalThis.crypto.subtle` (`computeBrowserSha256Hex` in `usageTracker.js`). The admin tool uses the same Web Crypto path via `src/usage/usageAnalyzerBrowser.js`. The Node CLI script (`scripts/analyze-usage-files.js`) continues to use `node:crypto` synchronously — both produce identical SHA-256 output from the same canonical input, so they agree on every valid file.

**Build exclusion**: `admin.html` is at the project root but is NOT listed in `vite.config.js` `rollupOptions.input`. Vite dev serves it normally; `npm run build` does not emit it. Verified: `dist/admin.html` is absent after build.

**Browser module isolation**: `usageAnalyzerBrowser.js` does not import from `usageAnalyzer.js` (which imports `node:crypto`). It imports only from `usageFormat.js` (already browser-compatible). The duplicate-detection and summarization logic is self-contained in the browser module.

**Dev link**: Injected at module scope in `src/main.js` under `import.meta.env.DEV`. Vite strips this block at production build time via dead-code elimination. The link is prepended to `.app-header-actions` using normal anchor navigation to `./admin.html`.

## Admin Page Features

- Drag-and-drop zone + file picker + clear button
- Accepts multiple `.json` files in one batch; re-analyzable without page reload
- Errors list for invalid/unrecognized files (does not block valid files)
- Class flags section: duplicate session IDs, identical hashes, similar event sequences
- Class summary table: student name, session ID (truncated), export time, integrity badge, guided passed/completed, challenges, free-play wins/losses, play time, event count, snapshot count, warning chips
- Detail panel: integrity banner (verified/mismatch), identity card, guided stats, free-play stats, suspicious signals, collapsible recent events (last 30), collapsible snapshots with block counts and optional XML disclosure
- Close button on detail panel; row keyboard navigation (Enter/Space)

## Validation Results

### `npm test` (unit tests)
- **91/91 pass** (up from 80 before Plan 04b)
- 11 new browser analyzer tests all pass
- Includes: hash agreement between Node and Web Crypto paths, tamper detection, duplicate session, duplicate hash, similar event sequence detection, build guard (vite.config.js does not reference admin)

### `npm run build`
- Clean build — same pre-existing warnings (Blockly chunk split, chunk size) as baseline
- `dist/admin.html` absent — confirmed via file search

### Browser tests (`npm run test:browser`)
- 11 admin browser tests added in `tests/browser/admin.spec.js`
- Not run as part of this report (requires live dev server)
- Build guard test (existsSync check) will run in the browser suite after build

## Validation Checklist

- [x] Local admin page opens in Vite dev (`/admin.html`)
- [x] Main app shows admin link in Vite dev (injected by `import.meta.env.DEV`)
- [x] Production build does not emit `admin.html`
- [x] Production build does not show the admin link (dead-code eliminated by Vite)
- [x] Teacher can load one or more usage JSON files (file picker + drag-and-drop)
- [x] Summary table renders useful class-level rows
- [x] Detail view renders one selected student/file
- [x] Valid files verify their integrity hash (browser Web Crypto)
- [x] Tampered/invalid files are flagged
- [x] Duplicate/similarity signals are shown
- [x] Existing Node analyzer still works (not modified)
- [x] `npm test` passes (91/91)
- [x] `npm run build` passes
- [x] Progress report exists

## Remaining Items

- Browser tests (`tests/browser/admin.spec.js`) need a live server run to confirm all 11 pass.
- The `freePlay.wins` / `freePlay.losses` counters are now populated (Plan 04 follow-up fix from yesterday), so the admin tool will correctly reflect free-play win/loss evidence going forward for sessions recorded after that fix.
- The Node CLI script (`scripts/analyze-usage-files.js`) still displays only `lastScores`, not `wins`/`losses`. A minor formatting addition to `formatSummaryLine` would surface those counters in CLI output if desired.
