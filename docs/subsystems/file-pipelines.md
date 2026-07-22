# File Pipelines

## Scope

This note owns:
- The three distinct file flows: workspace XML, private encrypted program JSON, and usage evidence JSON.
- Which mode exposes which file controls.
- The integrity model contrast between private program files and usage files.
- The rationale for why Guided Levels hide import/export controls.

This note does NOT own:
- Blockly workspace persistence (localStorage, per-level keys) — see [blockly-workspace.md](./blockly-workspace.md).
- The usage event model and analyzer behavior — see [usage-and-admin.md](./usage-and-admin.md).
- Mode state and control visibility rules — see [ui-mode-contract.md](./ui-mode-contract.md).

## Surface map

| File | Role |
|---|---|
| `src/ui/controls.js` | Binds file export/import controls; enforces mode-based visibility. |
| `src/ai/blockly/workspace.js` | Provides the XML text for workspace export; accepts XML text on import. |
| `src/crypto/privateProgramFile.js` | PBKDF2 + AES-GCM encryption and decryption for private program files. |
| `src/usage/usageTracker.js` | Assembles the usage evidence payload and triggers the JSON download. |
| `src/usage/usageAnalyzer.js` | Node-side CLI analyzer: verifies hash, summarizes sessions, flags anomalies. |
| `src/usage/usageAnalyzerBrowser.js` | Browser-side analyzer: same semantics as the CLI analyzer, used by the admin page. |

## The three pipelines

### 1. Workspace XML (student program portability)

**Purpose:** Save and share a student's Blockly program as a human-readable XML file.

**Format:** Plain XML. Blockly's native serialization format. Readable and re-importable.

**Flow:**
- Export: reads the current Blockly workspace via `workspace.getWorkspaceXmlText()`, downloads as `.xml`.
- Import: uploads an `.xml` file, calls `workspace.importWorkspaceXml()`, replaces the current program. Malformed XML rolls back safely.

**Mode availability:** Free Play only. Guided Levels hide the import/export controls entirely. This is by design: guided level workspace state is managed through per-level localStorage persistence (see [blockly-workspace.md](./blockly-workspace.md)), not user-initiated file export. Hiding the controls removes a potential source of confusion for students who might otherwise wonder why their saved file does not affect their guided progress.

**Integrity model:** None. The file is plaintext XML; any editor can open and modify it.

### 2. Private encrypted program files (Free Play hot-seat privacy)

**Purpose:** Let a student save their Free Play strategy as an encrypted file so a classmate using the same computer cannot read or copy it without the password.

**Format:** JSON containing an AES-GCM encrypted ciphertext blob, IV, and PBKDF2 salt. Not valid workspace XML.

**Flow:**
- Export: the Free Play export modal offers a "private" option. Student enters a password. `privateProgramFile.js` uses Web Crypto (PBKDF2 key derivation + AES-GCM) to encrypt the current workspace XML, wraps it in a JSON envelope, downloads as `.json`.
- Import: the file importer detects the JSON envelope and prompts for the password. On success, decrypts back to XML and loads the workspace.
- The same import path handles both plain XML and private JSON; detection is format-based, not extension-based.

**Mode availability:** Free Play only.

**Integrity model:** Password-protected. The encryption is privacy friction for a classroom hot-seat scenario, not a strong security boundary. A student who knows the password can decrypt the file. There is no server-side key management.

### 3. Usage evidence JSON (classroom evidence pipeline)

**Purpose:** Capture a session record that a teacher can analyze for learning evidence, completion, and potential duplicate submissions.

**Format:** JSON. Contains structured session events, workspace snapshots, a canonical JSON string, and a SHA-256 integrity hash. Supports two schema versions: legacy `schemaVersion: 1` (event-reconstruction export with event XML) and `schemaVersion: 2` (Plan 108 V2 export carrying durable learning ledger, pass ledger, capped pass/fail boundary XMLs, run-version hash list, and completeness flags). In V2 exports, full `xmlText` is stripped from level events and snapshots (retaining `xmlHash`), ensuring full XML travels strictly inside `boundaryXmls`. Not a program file. Not importable into Blockly.

**Flow:**
- Capture: `usageTracker.js` records events throughout the session in memory, persisted to IndexedDB.
- Export: student clicks the usage export button, enters their name, receives a JSON download.
- Analysis: teacher uploads the file to `admin.html` (local only, not on GitHub Pages) or runs the CLI analyzer. The analyzer verifies the SHA-256 hash, summarizes sessions, and flags duplicate/similar submissions.

**Mode availability:** Available in both Guided Levels and Free Play. The export button is always present; it is not a program file control.

**Integrity model:** SHA-256 hash over the canonical JSON payload (excluding the integrity field itself). Detects accidental or casual modification. Not a cryptographic signature; does not prove identity or prevent determined tampering.

## Contrast table

| Attribute | Workspace XML | Private program JSON | Usage evidence JSON |
|---|---|---|---|
| Audience | Student (program portability) | Student (hot-seat privacy) | Teacher (classroom evidence) |
| Mode | Free Play only | Free Play only | Both modes |
| Format | Plain XML | Encrypted JSON (AES-GCM) | Structured JSON |
| Importable into Blockly | Yes | Yes (after decryption) | No |
| Integrity protection | None | Password encryption | SHA-256 hash |
| Re-importable as workspace | Yes | Yes | No |

## Common traps

- **Confusing workspace export with usage export.** They are triggered by different buttons, produce different file formats, and serve different audiences. Do not route one through the other's code path.
- **Assuming private program files are Guided Level features.** Both private files and workspace XML export are Free Play only.
- **Treating the usage file as a backup program file.** Usage JSON cannot be re-imported as a Blockly workspace. It is evidence, not a save file.
- **Assuming the SHA-256 hash is a security signature.** It detects casual modification but does not prove identity.
- **Assuming the import modal accepts only one format.** The importer detects XML vs private JSON by content; it handles both.

## Related

- [blockly-workspace.md](./blockly-workspace.md) — per-level and per-mode localStorage persistence (separate from file export)
- [ui-mode-contract.md](./ui-mode-contract.md) — which controls are visible per mode
- [usage-and-admin.md](./usage-and-admin.md) — the usage event model, analyzer, and admin page
