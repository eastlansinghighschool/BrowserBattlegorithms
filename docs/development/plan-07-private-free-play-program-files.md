# Plan 07: Private Free Play Program Files

## Packet Metadata

- Packet id: plan-07
- Packet title: Private Free Play Program Files
- Status: ready
- Owner/model: implementation agent with Web Crypto care
- Date: 2026-05-12
- Packet type: frontend / Blockly / local file workflow
- Mutation level: source-code / tests
- Approval gate: none
- Expected artifacts:
  - XML import/export removed or hidden from guided levels
  - normal editable Free Play program export/import preserved
  - optional encrypted private Free Play program export/import
  - password/PIN-based unlock using browser Web Crypto
  - "allow editing after import" option where technically honest
  - focused tests
  - progress report
- Progress report folder: `reports/development/plan-07-private-free-play-program-files/`
- Progress report file: `reports/development/plan-07-private-free-play-program-files/progress.md`

## Packet Summary

Goal: Support hot-seat Free Play by letting students exchange runnable program files without casually handing opponents readable Blockly XML.

Non-goals:

- Do not implement networked multiplayer.
- Do not add server storage, Google Drive integration, OAuth, or online file hosting in this first version.
- Do not claim this is DRM or strong protection against a determined user with browser devtools.
- Do not obfuscate JavaScript.
- Do not change guided level progression or Blockly execution semantics.

Depends on:

- Current workspace import/export flow.
- Plan 05 is helpful but not required.

Blocks:

- Classroom hot-seat multiplayer where students want to keep strategy private from their opponent.

Why this packet exists:

In local hot-seat play, students may want to send or load programs without showing the readable block XML to the other player sitting next to them. A password/PIN-encrypted file adds appropriate UI friction while avoiding the much larger lift of networked multiplayer.

## Authority And Contracts

Required product contracts:

- Browser-only encryption uses the Web Crypto API.
- The browser necessarily sees decrypted program content in order to run it. This feature is classroom privacy friction, not a secure anti-inspection boundary.
- Import/export should be Free Play only after this packet.
- Guided levels should not expose XML import/export controls.
- Existing normal Free Play XML import/export should remain available unless replaced by an equivalent editable program file flow.

Do not redefine:

- Blockly block definitions.
- Program execution.
- Free Play setup rules.
- Guided mode starter code and persistence.

## Required Reading

Read these first:

- `src/ai/blockly/workspace.js`
- `src/ui/blocklyPanel.js`
- `src/ui/controls.js`
- `src/ui/programContext.js`
- `src/core/levels.js`
- `tests/browser/persistence.spec.js`
- `tests/browser/free-play.spec.js`
- `tests/unit/blockly-interpreter.test.js`

Use `rg "importWorkspaceInput|export|XML|getWorkspaceXmlText|importWorkspaceXml|currentModeView|Free Play|Guided"` from the repository root.

## Scope

In scope:

- Restrict program import/export UI to Free Play.
- Preserve normal readable export/import for Free Play.
- Add a single export button that opens a modal offering normal XML export or private export.
- Add private export:
  - ask for password/PIN
  - encrypt workspace XML
  - save a JSON-based private program file
- Add a single import button/file picker that handles both normal XML and private program files.
- Add private import:
  - detect private program file format
  - ask for password/PIN
  - decrypt XML
  - load runnable program
- Add "allow editing after import" option if it can be implemented honestly.
- Add clear student-facing copy that this keeps code from being casually read, not from determined inspection.
- Add tests.

Out of scope:

- Google Drive URL loading.
- Email workflow.
- Multiplayer networking.
- Strong secret management.
- Server verification.
- JavaScript bundle obfuscation.

Files and areas likely touched:

- `src/ai/blockly/workspace.js`
- `src/ui/blocklyPanel.js`
- `src/ui/controls.js`
- `src/ui/programContext.js`
- `src/assets/styles/style.css`
- `src/crypto/` or similar new helper folder
- `tests/unit/`
- `tests/browser/persistence.spec.js`
- `tests/browser/free-play.spec.js`

## Implementation Requirements

### 1. Free Play Only Import/Export

Required behavior:

- Guided mode should not show XML/program import or export controls.
- Free Play should show import/export controls.
- Existing guided workspace persistence and reset behavior must still work.

### 2. Private Program File Format

Required behavior:

- Use a JSON file format, not raw XML.
- Include:
  - `schemaVersion`
  - `kind: "browser-battlegorithms-private-program"`
  - `createdAt`
  - `kdf` metadata
  - `salt`
  - `iv`
  - `ciphertext`
  - optional metadata such as program label or team number, but not readable XML
- Use random salt and IV per export.

Recommended crypto:

- PBKDF2 with SHA-256 to derive an AES-GCM key from password/PIN.
- AES-GCM for encryption/decryption.
- Reasonable PBKDF2 iterations for classroom devices; document the chosen value.

Constraints:

- Use browser Web Crypto API.
- Do not add a crypto dependency without a strong reason.
- Password/PIN is not stored.

### 3. Private Export UI

Required behavior:

- Keep a single export button with a small modal that offers normal XML export or private export.
- Private export prompts for password/PIN and confirmation.
- Warn gently if the password/PIN is empty or very short.
- Show success/failure status.

### 4. Private Import UI

Required behavior:

- Use one import button and one file picker for both normal XML and private program files.
- Detect private program files by `kind`/schema.
- Ask for password/PIN.
- On failure, keep current workspace unchanged and show a clear error.
- On success, load the program.

Editable behavior:

- Provide an `Allow editing after import` checkbox if feasible.
- If unchecked, the UI should not casually display editable blocks after import.
- If the current architecture cannot run the program without displaying it in a Blockly workspace, stop and report rather than pretending the code is hidden.
- A fallback acceptable path is: decrypt and import only after the importing player chooses to allow editing. If non-editable runnable import requires a larger architecture change, document that and keep the first version to encrypted-at-rest exchange.

### 5. Student-Facing Honesty

Required behavior:

- Include concise copy such as:
  - `Private files keep your program from being casually read during local play. They are not a security system against someone inspecting the browser.`
- Do not use words like "secure against cheating" or "impossible to view."

### 6. Tests

Required behavior:

- Unit-test crypto helpers if structured for Node-compatible testing.
- Browser-test normal Free Play import/export still works.
- Browser-test guided mode does not expose import/export controls.
- Browser-test private export/import happy path.
- Browser-test wrong password keeps current workspace unchanged.
- Test that private file does not contain readable XML.

## Work Plan

1. Inspect current import/export UI and workspace hooks.
2. Restrict import/export controls to Free Play.
3. Implement Web Crypto helpers.
4. Implement private export/import UI.
5. Decide honestly whether non-editable runnable import is feasible in current architecture.
6. Add tests.
7. Run validation.
8. Write progress report.

## Validation Commands

```powershell
npm test
npm run build
npm run test:browser
```

## Validation Checklist

- [ ] Guided levels do not show program import/export controls.
- [ ] Free Play still supports normal readable program export/import.
- [ ] Free Play supports encrypted private export/import.
- [ ] Free Play import/export stays compact with one export modal and one import path.
- [ ] Wrong password does not alter the current workspace.
- [ ] Private file does not contain readable XML.
- [ ] Student-facing copy accurately states the limits.
- [ ] Tests cover guided restriction and private file workflow.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] Progress report exists.

## Stop Conditions

Stop and report if:

- Running an imported private program without exposing editable blocks requires a broad execution architecture redesign.
- Web Crypto behavior is not testable enough to validate import/export.
- The implementation would mislead students about the strength of privacy.
- The work expands into Google Drive, networking, accounts, or multiplayer infrastructure.
