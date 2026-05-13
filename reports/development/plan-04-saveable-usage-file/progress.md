# Plan 04 Progress Report

## Summary

Implemented the saveable usage file workflow for Browser Battlegorithms.

What landed:

- A live in-memory usage tracker that records guided-level, free-play, tutorial, turn-action, scoring, and Blockly workspace evidence.
- IndexedDB persistence with startup hydration and age/bounded-count pruning so recent usage survives refreshes and tab closes.
- A student-facing `Export Usage` action in the Blockly toolbar with a name prompt and local JSON download.
- Deterministic SHA-256 integrity hashing over canonicalized export JSON.
- A local analyzer script for verifying usage files and flagging duplicate or suspiciously similar submissions.
- Focused unit and browser tests for canonical JSON, hash verification, analyzer behavior, export flow, and IndexedDB-backed persistence.

## Validation

Commands run:

- `node --test --test-isolation=none tests/unit/usage-file.test.js`
- `npm test`
- `npx playwright test tests/browser/persistence.spec.js --reporter=line`
- `npm run build`

Results:

- Unit tests passed.
- Browser persistence/export tests passed.
- Production build passed.

## Notes

- The browser-side hash computation uses Web Crypto, while the local analyzer uses Node `crypto`.
- Existing XML export/import behavior remains intact; usage tracking observes those actions without changing Blockly semantics or game rules.
- Local persistence stays in IndexedDB. LocalStorage remains in use only for the existing workspace restoration and preferences behavior.
