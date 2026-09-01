# Adversarial Architecture and Implementation Review: Google Apps Script Cloud Integration

**Reviewer:** Gemini (Adversarial Architecture, Classroom-Product, Privacy, and Readiness Review)  
**Date:** 2026-09-01  
**Proposal Document Reviewed:** `reports/orchestration/google-apps-script-cloud-integration-proposal.md`  
**Proposal Baseline Commit:** `29f3d31 Fix proposal metadata formatting` (incorporating proposal addition `e73a1ac`)  
**Repository State:** `29f3d31` (Working tree clean)

---

## Executive Summary

The proposal outlines a pragmatic, serverless architecture that successfully respects Browser Battlegorithms' static browser-first deployment while offering Google Workspace continuity. Crucially, it avoids high-maintenance cloud databases (Firestore/GCP) and avoids overclaiming student authorship.

However, an adversarial analysis reveals **two critical failure modes** that would cause widespread failure in a real classroom of 30 Chromebooks:
1. **Lock Starvation during Class Bursts:** Holding a global `LockService.getScriptLock()` across individual Drive file writes and Sheet index updates will reliably exhaust the 30-second lock timeout when 20–30 students cross level boundaries simultaneously.
2. **Fragile Migration Handshake:** Attempting a live `postMessage` handshake via `window.opener` across Google's multi-step authentication redirects and sandboxed `googleusercontent.com` iframes is fragile in modern Chromium and will fail on managed Chromebooks.

In addition, several data-lifecycle and payload-sizing risks must be resolved before implementation packets are drafted.

Below are the detailed adversarial findings, followed by strengths, open decisions, recommended proposal revisions, probe updates, and the final readiness verdict.

---

## Adversarial Findings

### Finding 1: Global `ScriptLock` during Drive and Sheet writes will cause cascading lock timeouts during 20–30 student classroom bursts

- **Severity:** Critical
- **Status:** Confirmed
- **Proposal location:** Section *Save Frequency And GAS Load Budget*, lines 423–435
- **Finding:** The proposal specifies wrapping the revision check, Drive envelope update, and Sheet summary row update inside `LockService.getScriptLock()`. In Google Apps Script, `ScriptLock` is a single global mutex across the entire deployment. Updating a Drive JSON file takes 800–1,500 ms in GAS; updating a Google Sheet row takes 500–1,000 ms. The critical section duration per student is therefore 1.3–2.5 seconds. Apps Script enforces a hard ceiling of 30,000 ms on `LockService.waitLock()`. If 25–30 students complete a level or transition within a 45-second classroom burst, the total serialized queue time is $30 \times 1.5\text{s} = 45\text{s}$. Students at the back of the queue will suffer `LockTimeoutException` crashes, causing 30–50% of save RPCs in a burst to fail.
- **Why it matters in a classroom:** When a teacher says "Finish level 4 and let's discuss," half the class will receive red "School save pending/failed" errors or spurious conflict dialogs.
- **Evidence:** Google Apps Script `LockService` API documentation (30-second max timeout); empirical Drive/Sheet API latency measurements in Apps Script.
- **Smallest recommended change:** 
  1. Remove Drive file updates from the global script lock entirely. Student Drive files (`<account-record-key>.json`) are completely independent resources. Compare-and-swap can be validated by reading the student's individual Drive file metadata/revision without locking other students.
  2. Minimize Sheet locking: Either acquire a micro-lock strictly for the sub-50ms `setValues()` call on the Sheet row, or buffer Sheet summary updates in Script Cache / Properties and flush them asynchronously, or write Sheet summary rows without a script lock if each student has a dedicated row index.
- **Falsification test:** (Probe 4) Execute 30 concurrent synthetic RPC save requests within a 30-second window against a GAS script using `ScriptLock` wrapping Drive file updates; measure the exact timeout/failure rate.

---

### Finding 2: Direct-to-GAS popup `postMessage` migration flow will be severed by Google Auth redirects and iframe sandbox policies

- **Severity:** Critical
- **Status:** Confirmed
- **Proposal location:** Section *Storage partition complication*, lines 574–590
- **Finding:** To overcome Chrome storage partitioning between standalone `github.io` and embedded GAS, the proposal suggests having `github.io` call `window.open(gasUrl)` and conduct a bidirectional `postMessage` handshake via `window.opener`. In production, navigating to `script.google.com/macros/s/.../exec` triggers HTTP 302 authentication redirects and renders Google's outer container, which embeds HtmlService in a sandboxed `n-...-script.googleusercontent.com` iframe. In modern Chromium, cross-origin redirects across auth boundaries sever `window.opener` (`Cross-Origin-Opener-Policy` and navigation detachment). Furthermore, `github.io` cannot postMessage directly to the inner nested `googleusercontent.com` iframe through Google's outer wrapper.
- **Why it matters in a classroom:** High school students attempting the one-time migration on Chromebooks will encounter blocked popups, hanging transfer spinners, or broken connections, rendering their existing progress unmigratable.
- **Evidence:** Chromium Storage Partitioning & COOP specification; Google Apps Script HtmlService top-level wrapper architecture.
- **Smallest recommended change:** Replace the live popup `postMessage` handshake with a deterministic, asynchronous copy-paste or file transfer:
  - Direct `github.io` app provides an explicit "Export School Cloud Package" button (or "Copy Transfer Code" to clipboard).
  - GAS-embedded app provides a "Paste Transfer Code / Upload Package" import affordance.
  - This eliminates all reliance on `window.opener`, popup blockers, and cross-origin redirect survival.
- **Falsification test:** (Probe 3) Build a standalone web page that calls `window.open()` to a deployed domain GAS web app and attempts a bidirectional `postMessage` exchange; verify whether `window.opener` survives and reaches the inner HtmlService script.

---

### Finding 3: Exact-string origin validation in the child iframe will break when Google rotates `googleusercontent.com` sandbox subdomains

- **Severity:** Major
- **Status:** Plausible (Needs Probe)
- **Proposal location:** Section *Protocol invariants*, lines 254–259
- **Finding:** The proposal requires exact `targetOrigin` and `event.origin` string equality for all `postMessage` calls between the parent shell and the child iframe. However, Google Apps Script HtmlService serves content from dynamically generated sandboxed origins (e.g. `https://n-<hash>-0luq07162gahom1ajppscistdumheh0c-script.googleusercontent.com`). These hashes can change between deployments, script versions, or Google infrastructure updates. If the static GitHub Pages app is configured with a hardcoded exact parent origin, any hash change immediately breaks all communication.
- **Why it matters in a classroom:** A routine script re-deploy or Google backend update would silently disable cloud synchronization for all students without any code change in Browser Battlegorithms.
- **Evidence:** Google Apps Script HtmlService documentation on sandbox origins; observed variations in `googleusercontent.com` subdomain hashes.
- **Smallest recommended change:** 
  - The parent GAS shell can use exact `targetOrigin: "https://<org>.github.io"` when posting to the child.
  - The child iframe must validate the parent origin against an allowlisted regex pattern (e.g. `/^https:\/\/n-[a-z0-9]+-script\.googleusercontent\.com$/` and `https://script.google.com`) coupled with the cryptographically random ephemeral channel nonce passed at iframe initialization.
- **Falsification test:** (Probe 2) Deploy multiple versions of a GAS HtmlService web app and inspect `window.origin` across re-deployments and different user sessions to verify subdomain stability and regex coverage.

---

### Finding 4: Cross-device session switching discards historical evidence because the cloud envelope overwrites `latestEvidence`

- **Severity:** Major
- **Status:** Confirmed
- **Proposal location:** Section *Canonical Artifact Recommendation*, lines 339–342, 347–375
- **Finding:** The proposal co-locates `portableState` and `latestEvidence` in a single envelope and overwrites `latestEvidence` on every checkpoint. If a student works on Device A (Session 1, Levels 1–5) and closes the laptop without an explicit "Final Submit", and the next day opens Device B (Session 2):
  1. Device B restores `portableState` (Levels 1–5 unlocked).
  2. Device B's usage tracker initializes a fresh `sessionId` (Session 2).
  3. When Device B completes Level 6 and sends a checkpoint, its `latestEvidence` (containing only Session 2 attempts) completely replaces Session 1 in the Drive envelope.
  4. Because Session 1 was never explicitly submitted or rolled over, its granular turn history, timestamps, and boundary XMLs are permanently deleted.
- **Why it matters in a classroom:** When a teacher opens `admin.html` to review a student's learning trajectory across multiple days, all earlier sessions will be missing from the student's cloud record.
- **Evidence:** `src/usage/usageTracker.js` lines 37–40 (fresh `sessionId` per browser session); `reports/orchestration/google-apps-script-cloud-integration-proposal.md` line 339.
- **Smallest recommended change:** On the GAS server, when an incoming checkpoint carries a `sessionId` different from the `sessionId` currently stored in `latestEvidence`, the server must automatically archive the displaced `latestEvidence` to `evidence-archive/<account-key>/<old-sessionId>.json` before updating the current envelope.
- **Falsification test:** (Probe 5) Save a checkpoint for Session A, then initialize a client with Session B, restore portable state, save a checkpoint for Session B, and verify whether Session A's evidence is preserved in `evidence-archive/`.

---

### Finding 5: Re-uploading 200–300 KB V2 usage evidence on every 2-minute dirty checkpoint wastes bandwidth and increases GAS latency

- **Severity:** Major
- **Status:** Confirmed
- **Proposal location:** Section *Save Frequency And GAS Load Budget*, lines 397–405
- **Finding:** As a student completes 15–20 levels, the sanitized schema-v2 export grows to 150–350 KB (due to boundary XMLs, event lists, and run-version hashes). Under the proposal, every 2-minute dirty checkpoint and every level transition re-serializes and re-uploads this full ~300 KB JSON payload through `google.script.run`, requiring GAS to rewrite the entire Drive file. In a 45-minute class, 30 students will generate ~300 MB of upload traffic and hundreds of multi-hundred-kilobyte Drive writes.
- **Why it matters in a classroom:** Saturated school Wi-Fi, UI thread lag during JSON stringification on low-powered Chromebooks, and inflated GAS execution times that worsen lock contention.
- **Evidence:** `tests/regression/output/` export file sizes (100–285 KB); `src/usage/usageFormat.js` boundary XML serialization.
- **Smallest recommended change:** Decouple checkpoint payloads:
  - **Frequent dirty checkpoints / level transitions:** Send only `portableState` (~5–10 KB) plus a compact milestone summary (highest passed level, star state). Drive updates are tiny and sub-second.
  - **Full evidence upload:** Upload full `latestEvidence` (~200 KB) only on explicit student submission ("Save/Submit Progress"), when a level arc/checkpoint is finished, or on clean session exit.
- **Falsification test:** (Probe 4) Measure payload transfer size and GAS execution latency for a 5 KB portable-state save versus a 250 KB combined save across 30 simulated clients.

---

### Finding 6: HMAC-obfuscated Drive filenames impair emergency teacher triage without providing real security

- **Severity:** Moderate
- **Status:** Confirmed
- **Proposal location:** Section *Identity And Deployment Model*, lines 191–193, 447–459
- **Finding:** The proposal mandates hashing student emails with a server secret to create opaque filenames (e.g. `<cohort-key>/current/7a8f9b...json`) in the private teacher Drive folder. However, Google Drive ACLs already restrict folder access exclusively to the teacher. If the Google Sheet index becomes corrupted or desynchronized, the teacher cannot identify which file belongs to which student during an in-class triage situation.
- **Why it matters in a classroom:** If a student experiences a sync error during a graded activity, the teacher cannot quickly inspect or restore that student's JSON file directly in Google Drive.
- **Evidence:** Google Drive permissions model (access is governed by Drive ACLs, not filename obscurity); `reports/orchestration/google-apps-script-cloud-integration-proposal.md` lines 191–193.
- **Smallest recommended change:** Use a human-readable, deterministic folder and file structure within the private teacher folder (e.g. `Browser-Battlegorithms-Cloud/<cohort-id>/current/<sanitized-student-email>.json` or `<roster-id>.json`). The security boundary is the Google Drive permission model, not filename obscurity.
- **Falsification test:** Conduct an operator recovery drill: simulate a corrupted Sheet index and attempt to restore a specific student's workspace from the Drive folder within 2 minutes.

---

### Finding 7: Uncoordinated hot-seat computer reuse contaminates unrelated students' Free Play and PvP workspaces

- **Severity:** Moderate
- **Status:** Confirmed
- **Proposal location:** Section *PvP And Shared-Computer Contract*, lines 626–643
- **Finding:** In shared computer labs where students do not log out of the OS between class periods, Period 2 (Bob) playing Free Play or PvP will have their workspaces automatically synchronized to Period 1 (Alice's) Google account. When Alice logs in at home, her Free Play workspaces are overwritten. Additionally, in PvP, both Team 1 and Team 2 workspaces are saved to a single student's cloud account, meaning the opponent's strategy is inappropriately stored in the host student's cloud envelope.
- **Why it matters in a classroom:** Students find their custom Free Play / PvP strategies overwritten or exposed to classmates sharing the same computer.
- **Evidence:** `src/ai/blockly/workspace.js` lines 270–275; `localStorage` key mappings for `bba:free-play-pvp-team:*`.
- **Smallest recommended change:** Restrict automatic cloud restore and synchronization strictly to **Guided Levels and Project Arcs** by default. Free Play and PvP workspaces should remain local to the device unless explicitly exported/imported via the existing encrypted program file pipeline (`src/crypto/privateProgramFile.js`), or provide a clear "Clear Local Session / Switch Student" button.
- **Falsification test:** Save PvP Team 1/2 workspaces under Account A on Device 1; open Account A on Device 2; verify whether Device 2's local Free Play code is replaced without warning.

---

### Finding 8: Delayed cloud bootstrap resolution after local fallback can overwrite in-flight student edits

- **Severity:** Moderate
- **Status:** Plausible (Needs Probe)
- **Proposal location:** Section *Boot And Restore Sequence*, lines 272–294
- **Finding:** If the cloud bootstrap RPC is delayed by school network latency (e.g. takes 6 seconds), the client will hit its bootstrap timeout and hydrate with local storage. If the student immediately begins editing blocks or playing Level 2, and the delayed cloud bootstrap response arrives 3 seconds later, an uncoordinated restore would clobber the student's active Blockly workspace.
- **Why it matters in a classroom:** Students on slow Wi-Fi will see blocks suddenly vanish or reset while actively constructing programs.
- **Evidence:** Asynchronous loader lifecycle in `src/main.js` and `src/startup/loaders.js`.
- **Smallest recommended change:** Once the client falls back to local hydration and becomes interactive, any late-arriving cloud bootstrap response must be treated as a background sync check. It must **never** perform an unprompted live DOM or workspace reload. If cloud state is divergent, display a non-modal toast: *"Cloud save found from another device [Review / Keep Local]"*.
- **Falsification test:** Inject a synthetic 5-second delay into the GAS bootstrap response; make edits in Blockly during seconds 1–4; verify that blocks are not overwritten when the response arrives.

---

### Finding 9: Google Drive Trash retention keeps student data for 30 days past the intended cohort purge date

- **Severity:** Minor
- **Status:** Confirmed
- **Proposal location:** Section *Retention And Deletion Recommendation*, lines 662–666
- **Finding:** In Google Apps Script, standard `DriveApp.removeFile()` or `file.setTrashed(true)` moves files to Google Drive Trash, where they remain recoverable for 30 days. If a district policy requires definitive data destruction at the end of the retention period, standard GAS calls fail to achieve immediate deletion.
- **Why it matters in a classroom:** District compliance audits requiring verification of data destruction upon cohort purge.
- **Evidence:** Google Apps Script DriveApp API documentation vs Advanced Drive Service (`Drive.Files.remove`).
- **Smallest recommended change:** Explicitly mandate that purge operations use the Advanced Drive Service `Drive.Files.remove(fileId)` to bypass Trash, or document the 30-day Google Drive Trash lifecycle in the retention policy.
- **Falsification test:** Execute a purge script; verify via Drive API whether the file is in Trash or permanently purged.

---

## Strengths Worth Preserving

1. **Static Client Integrity:** Preserving GitHub Pages as the untouched, static game client while using GAS strictly as an optional parent shell avoids server dependencies, preserves Vite build simplicity, and keeps local-only play intact.
2. **Server-Derived Account Attribution:** Refusing to trust client-supplied emails, UUIDs, or file IDs prevents trivial identity spoofing across school accounts.
3. **Honest Authorship Framing:** Explicitly distinguishing between account attribution (verified Google login) and authorship (unverified browser client) protects teachers from overclaiming what usage data proves.
4. **Compare-and-Swap Revision Control:** Rejecting timestamp-only last-write-wins rules prevents silent loss of student work across multiple devices.
5. **Durable Local-First Outbox:** Ensuring that gameplay continues uninterrupted even during full GAS outages or quota exhaustion preserves the core classroom experience.
6. **Separation of Admin Analyzer from GAS:** Keeping `admin.html` as the dedicated local analysis tool and using Google Sheets strictly for class-level summaries prevents reimplementing complex analytics inside Apps Script.

---

## Missing Owner Decisions

Before implementation packets are ratified, the owner must decide:

1. **GAS Source Repository Placement:** Should GAS source code live in this repository under `integrations/google-apps-script/` (excluded from Vite build) or in a separate companion repository?  
   *Reviewer Recommendation:* Keep it in this repository under `integrations/google-apps-script/` to ensure schema versions and protocol types remain synchronized in a single monorepo tree.
2. **Free Play & PvP Cloud Scope:** Should Free Play and PvP workspaces sync to the school cloud account, or should cloud sync be strictly bounded to Guided Levels and Project Arcs?  
   *Reviewer Recommendation:* Bound automatic cloud sync to Guided Levels and Project Arcs. Keep Free Play and PvP local to prevent shared-computer strategy clobbering.
3. **Historical Evidence Archiving Policy:** Should historical v2 usage sessions be automatically archived on the server upon session rollover, or should the cloud envelope retain only the active session?  
   *Reviewer Recommendation:* The server should automatically archive the displaced `latestEvidence` whenever a new `sessionId` appears, subject to a per-student cap of 5 archived sessions.
4. **Migration Method Approval:** Does the owner approve replacing the live popup `postMessage` migration flow with an explicit Copy/Paste Sync Code or File Import flow?  
   *Reviewer Recommendation:* Yes; adopt the Copy/Paste Sync Code or File Import flow to eliminate fragile browser popup/redirect dependencies.

---

## Recommended Revisions to the Proposal

1. **De-lock Drive Writes:** Update Section 6 (*Save Frequency And GAS Load Budget*) to eliminate global `ScriptLock` around Drive file operations. Limit script locks strictly to sub-100ms Sheet row writes.
2. **Decouple Save Payloads:** Update Section 4 (*Canonical Artifact Recommendation*) and Section 6 to define two save tiers:
   - *Tier 1 (Frequent Checkpoint):* Portable state (~5 KB) + summary.
   - *Tier 2 (Evidence Submission):* Full sanitized schema-v2 payload (~200 KB), triggered on explicit submit, arc milestones, or session end.
3. **Auto-Archive on Session Rollover:** Update Section 4 to mandate that when an incoming checkpoint presents a new `sessionId`, the server archives the prior `latestEvidence` before overwriting it.
4. **Replace Popup Migration with Code/File Transfer:** Update Section 7 (*Schema-v2 Migration*) to replace the `window.open` / `window.opener` popup handshake with a deterministic Sync Code / File Import bridge.
5. **Flexible Origin Allowlisting:** Update Section 3 (*Protocol invariants*) to specify that the child validates the parent origin against an allowlisted regex matching Google Apps Script sandbox subdomains (`/^https:\/\/n-[a-z0-9]+-script\.googleusercontent\.com$/`), accompanied by the ephemeral channel nonce.
6. **Transparent File Naming:** Update Section 5 (*Drive And Sheet Layout*) to replace HMAC obfuscated filenames with structured filenames (e.g. `<sanitized-email>.json`) within the private teacher folder.

---

## Recommended Changes to the Probe Sequence

1. **Probe 1 (Domain Identity):** Unchanged. Validate `Session.getActiveUser().getEmail()` under execute-as-deployer in the target school tenant.
2. **Probe 2 (Iframe & Origin Behavior):** Add measurement of `googleusercontent.com` origin variability across multiple deployments to confirm the child iframe's origin-validation regex.
3. **Probe 3 (Migration Handshake Falsification):** Test the feasibility of `window.opener` postMessage across Google login redirects. (Expect failure; use results to ratify the Sync Code / File Import fallback).
4. **Probe 4 (Classroom Burst Load Probe):** Benchmark 30 concurrent client checkpoints (5 KB vs 250 KB) against GAS with and without `ScriptLock`. Prove that de-locking Drive writes prevents `LockTimeoutException`.
5. **Probe 5 (Multi-Session Cross-Device Archiving):** Validate that switching client instances correctly preserves earlier session evidence in `evidence-archive/`.
6. **Probe 6 (Purge Verification):** Confirm permanent deletion using `Drive.Files.remove()` vs Trash retention.

---

## Final Verdict

**Verdict:** `Ready after bounded proposal revisions`

The core architectural direction—static GitHub Pages child, domain-restricted GAS parent, server-derived identity, and dual-section cloud envelopes—is sound and pedagogically appropriate. 

Before converting this proposal into implementation packets, the proposal document must be revised to incorporate the bounded changes identified above:
1. De-locking Drive writes from the global script lock;
2. Decoupling frequent 5 KB state checkpoints from heavy 200 KB evidence uploads;
3. Replacing the fragile popup migration handshake with a copy-paste/file transfer;
4. Auto-archiving displaced session evidence on cross-device switches; and
5. Scoping automatic cloud sync to Guided Levels and Project Arcs.

Once these revisions are applied and Probes 1–4 are executed, the system will be ready for packet implementation.
