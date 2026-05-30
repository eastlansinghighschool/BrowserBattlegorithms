# Private Program Hidden-Import Repair Note

## Summary

Imported private program files are currently private only at rest. After decryption, the file is imported into the live Blockly workspace and becomes visible/editable like any other program. That means the feature does not satisfy the original “execute while hidden from visual view” goal that was described when private program files were planned.

## What is happening now

- Private export creates an encrypted JSON envelope in `src/crypto/privateProgramFile.js`.
- Private import in `src/ui/controls.js` decrypts the payload and immediately calls the normal XML import path.
- The XML import path in `src/ai/blockly/workspace.js` loads the blocks into the live workspace and persists them to localStorage.
- Browser tests currently assert the visible-import behavior, so the present implementation is not treating hidden execution as a requirement.

## Why this happens

The current architecture only supports running programs through the Blockly workspace. There is no separate “execute from imported code without rendering it” path.

The original packet for private program files explicitly allowed a fallback if hidden runnable import was not feasible:

- it asked for an `Allow editing after import` option only if it could be implemented honestly
- it said to stop and report rather than pretend code was hidden if the current architecture could not run the program without exposing blocks
- it allowed a fallback where import/decrypt happens only after the user chooses to allow editing

So the current behavior is not a crypto failure. It is an architectural mismatch between the stronger user expectation and the fallback that was implemented.

## Repair goal

Restore the product intent as clearly as possible:

- private code should not be casually readable after import
- the app should not show the decrypted blocks unless the user explicitly chooses a visible/editable import flow
- if hidden runnable execution is not feasible without a broader redesign, the code and UI should say that honestly instead of implying hidden execution exists

## Likely repair directions

1. Add an explicit import choice for private files:
   - `Import privately` or `Open and edit`
   - `Open hidden for execution` only if a true hidden-execution path exists

2. Prevent automatic rendering of decrypted XML into the live Blockly editor unless the user opted into editing.

3. Decide whether the engine can execute imported code from a non-visual representation:
   - if yes, wire that path up and keep the workspace hidden
   - if no, remove any implication that private files execute invisibly and keep the feature scoped to encrypted-at-rest exchange

4. Update tests so they assert the chosen truth:
   - hidden execution if implemented
   - or explicit visible-edit fallback if that is the final product decision

## Files that likely matter

- `src/ui/controls.js`
- `src/ai/blockly/workspace.js`
- `src/ui/blocklyPanel.js`
- `tests/browser/persistence.spec.js`
- `docs/subsystems/file-pipelines.md`
- `docs/development/archive/plan-07-private-free-play-program-files.md`

## Current evidence

- `src/ui/controls.js` decrypts private files and routes them into `importWorkspaceXml()`.
- `src/ai/blockly/workspace.js` imports XML directly into the live workspace and saves it.
- `tests/browser/persistence.spec.js` currently expects the imported private program to appear visibly in Blockly after import.
- `docs/development/archive/plan-07-private-free-play-program-files.md` already warned that hidden runnable import might require a larger architecture change.

## Validation expectations for the repair

- private file contents remain encrypted and do not contain readable XML
- wrong password leaves the current workspace unchanged
- the UI clearly distinguishes hidden/private-at-rest behavior from visible editing
- the browser tests match the chosen behavior and no longer imply hidden execution if it is not real
