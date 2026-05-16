# Plan 29 Progress Report

## What Changed

- Raised the trace playback pacing cap from 45 to 60 frames and added a 10-frame minimum floor per step.
- Refined Blockly trace visuals so result outlines fade out while glyphs remain as the durable history, and the current block gets a brighter orange live treatment.
- Added a trace speed threshold marker next to the speed slider using JS-created DOM plus CSS styling.
- Added a reduced-motion fallback that removes the fade and current-block brightness boost while keeping glyph history and the orange current-step signal.
- Updated the Blockly workspace subsystem note to describe the new fade-and-glyph contract.
- Archived Plan 29 in the development packet index and marked the packet complete.

## Validation

- `node --test --test-isolation=none tests/unit/blockly-trace-playback.test.js tests/unit/blockly-trace-collection.test.js`
- `npm test`
- `npm run build`
- `npm run test:browser`
- Manual browser smoke on the local dev server confirmed the speed-threshold marker rendered, its tooltip/title was present, pointer events were disabled, and the reduced-motion media query suppressed the live-block brightness while keeping the marker visible.
- The browser trace-playback spec covered the actual nested-step trace path and passed against the new fade/brightness/pacing behavior.

## Visual Smoke

- The speed slider marker sits at the trace threshold position and stays non-interactive.
- The reduced-motion pass keeps the marker and current-step orange signal while suppressing the brightness/filter emphasis.
- The trace browser spec passes, covering the fade, glyph persistence, current-step styling, empty hint, and overflow cleanup flow.

## Notes

- The renderer did not rely on persistent result classes for correctness, so the fade stayed CSS-only.
- The marker uses a resize listener and slider geometry; if the layout changes materially, the marker may need a quick visual tune-up.
- A direct ad hoc smoke script against the local dev server did not reproduce the exact trace-start timing that the browser harness exercises, so the browser spec remains the authoritative trace-path verification for this packet.

## Follow-up Cleanup

- Re-asserted the orange current-step stroke on condition blocks under reduced motion so the live signal stays visible even when a result class is also present.
- Restored a lead-in sentence in the Blockly workspace trace section so the existing bullet list reads as a complete paragraph again.
- Manual reduced-motion smoke on the live app confirmed that a current condition block keeps the orange stroke (`rgb(245, 158, 11)`) and `stroke-opacity: 1` while `filter` is `none`, and the speed-threshold marker remains visible.
