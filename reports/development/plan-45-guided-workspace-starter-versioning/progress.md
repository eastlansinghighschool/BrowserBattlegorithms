# Plan 45 Progress Report

## Original Implementation Record

Plan 45 implemented guided workspace starter versioning and the manual reset affordance.

### Core implementation

- Added `src/ai/blockly/starterVersioning.js` with the pure starter-hashing helpers:
  - `normalizeStarterXmlForHashing(xml)`
  - `hashStarterXml(xml)`
- Derived `starterXmlVersion` at level-load time in `src/config/levels/index.js` for every guided level with `initialBlocklyXml`.
- Updated `src/ai/blockly/workspace.js` so guided non-project workspaces use a sibling version key alongside the stored XML:
  - matching version preserves the stored workspace,
  - missing version key grace-stamps the current version and preserves the stored workspace,
  - mismatched version silently replaces the stored workspace with the current starter XML.
- Added the `Reset Workspace to Starter` toolbar button with native `confirm()` handling and the same internal reset path as stale-replace.
- Kept free play and project shared workspaces out of scope, as planned.

### Docs and tests

- Added the new unit coverage in `tests/unit/blockly-workspace.test.js`.
- Added browser coverage in `tests/browser/workspace-starter-versioning.spec.js` and `tests/browser/workspace-reset-button.spec.js`.
- Updated `docs/subsystems/blockly-workspace.md` with the starter versioning contract and reset affordance.
- Archived the packet doc and updated the development README to reflect Plan 45 completion.

### Original bughunt-22 self-heal walkthrough

The packet’s canonical classroom recovery scenario was the 2026-05-17 bughunt-22 starter fix:

1. Seed localStorage with the previously cached workspace XML for bughunt-22.
2. Seed the sibling version key with a stale hash.
3. Load the guided bughunt-22 level in the browser.
4. Observe that the current authored starter XML is loaded instead of the stale cached workspace.
5. Confirm the version key is stamped to the current hash so the author fix now reaches returning students automatically.

That is the self-heal behavior the packet was created to guarantee.

### Original validation summary

Passed during the implementation pass:
- `node --test --test-isolation=none tests/unit/blockly-workspace.test.js`
- `npx playwright test tests/browser/workspace-starter-versioning.spec.js --reporter=line`
- `npx playwright test tests/browser/workspace-reset-button.spec.js --reporter=line`
- `npm test`
- `npm run build`
- `npm run lint:levels`

The implementation pass also established that the broader browser suite remained green at the time.

## Follow-Up Repair

The browser specs initially asserted against `#blockly-region` text, which includes toolbox and flyout labels. That made the checks brittle and caused false failures because labels like `Move Forward` and `Stay Still` can appear in the toolbox even when the live workspace content is different.

I repaired the browser assertions so they inspect the actual Blockly workspace instead:

- `tests/browser/workspace-starter-versioning.spec.js`
  - now reads `window.__BBA_TEST_HOOKS__.getBlocklyWorkspace().getAllBlocks(false).map((block) => block.type)`
  - asserts the real workspace contains `battlegorithms_move_forward` for stale-replace and matching-version cases where the starter should be restored or preserved
  - asserts the real workspace contains `battlegorithms_stay_still` only when the stored XML is intentionally preserved

- `tests/browser/workspace-reset-button.spec.js`
  - now uses the same live-workspace block-type inspection after confirm/ cancel
  - keeps the native dialog text assertion
  - keeps the Free Play, project-level, and guided-level visibility checks

No production source changes were required for the follow-up.

## Final Validation

Passed after the follow-up repair:
- `node --test --test-isolation=none tests/unit/blockly-workspace.test.js`
- `npx playwright test tests/browser/workspace-starter-versioning.spec.js --reporter=line`
- `npx playwright test tests/browser/workspace-reset-button.spec.js --reporter=line`
- `npm test`
- `npm run build`
- `npm run lint:levels`
- `npm run test:browser`

Final counts:
- `workspace-starter-versioning.spec.js`: 5/5 passed
- `workspace-reset-button.spec.js`: 6/6 passed
- `npm test`: 276/276 passed
- `npm run test:browser`: 106/106 passed

## Notes

The follow-up failure was a test-targeting issue, not a product regression. The implementation is still correct; the browser specs now assert against the live Blockly workspace, which is the intended contract for Plan 45.
