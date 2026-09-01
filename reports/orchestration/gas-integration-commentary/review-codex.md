# Adversarial Review: Google Apps Script Cloud Integration Proposal

**Reviewer:** Codex  
**Review date:** 2026-09-01  
**Proposal reviewed:** `reports/orchestration/google-apps-script-cloud-integration-proposal.md` (2026-09-01 discussion draft)  
**Proposal baseline:** `a321be9d4ed7aab50ab292d6611a02d087ef65ac`  
**Repository inspected:** `9f03f85a2cd546546281e70dd815df7756655f76`

The runtime source is unchanged between the proposal baseline and the inspected commit; that range adds the proposal and another review only. No student, roster, Drive, Sheet, deployment, or tenant data was accessed. No owner questions were asked during this review; the open policy choices below should be decided before packet ratification.

## Findings

### 1. The proposed recovery and deletion promises cannot be met by unspecified Drive revisions

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Revision, Lease, And Conflict Model* (lines 500-550); *Retention And Deletion Recommendation* (lines 648-682); *Drive And Sheet Layout* (lines 440-460).
- **Finding:** The conflict UI promises that neither losing copy is silently deleted, while retention promises no more than three recoverable revisions for seven days. The design names only an overwritten current Drive file and lifecycle archives; it never defines an application-managed copy of the losing package before an overwrite. Native Drive blob revisions do not supply the stated policy: purgeable revisions are normally retained for about 30 days and may be purged earlier under Drive's own conditions. `DriveApp.File.setTrashed(true)` moves a file to trash rather than permanently deleting it. This leaves both the recovery guarantee and the effective retention period undefined.
- **Why it matters in a classroom:** A student who chooses the wrong conflict option may not have a recoverable copy when the teacher needs it, or a student program/evidence package can remain recoverable longer than the stated 30/90-day lifecycle. Both are especially harmful when work is on a shared device.
- **Evidence:** The proposal requires preservation but does not define a pre-overwrite recovery artifact. Google documents automatic blob-revision retention independently of an app's desired period and documents that `setTrashed(true)` moves a file to trash, not permanent deletion. See [Drive revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions) and [Apps Script File](https://developers.google.com/apps-script/reference/drive/file).
- **Likelihood / classroom impact:** High if a conflict or purge occurs; impact is high because it affects loss recovery and retention accuracy.
- **Smallest recommended change:** Define an explicit `recovery/` artifact created *before* accepting either conflict winner. Give it a server receipt id, source revision/digest, disposition, expiry, and an idempotency key. Cap and purge those files directly as part of the same retention job. Do not describe native Drive revision history as the seven-day recovery mechanism. The retention contract must also state whether the project uses a permanent Drive API delete, a documented trash window, or district-controlled retention; it must inventory Cloud/Execution logs separately.
- **Falsification test:** With synthetic data, force both conflict choices and an interrupted overwrite. Confirm that the losing state is readable through the documented recovery path, that only the configured number of recovery artifacts remain after expiry, and that current/archive/recovery files, Sheet rows, Drive trash/revisions, and logs match the documented deletion disposition.

### 2. Shared computers need account-bound local isolation before any cloud restore or save

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Parent/Child Architecture* (lines 220-240); *Schema-v2 Migration* (lines 568-589); *PvP And Shared-Computer Contract* (lines 625-642).
- **Finding:** The proposal correctly attributes the cloud record to the signed-in account, but it does not define how the embedded browser partition distinguishes Account A's local, possibly unsynced package from Account B's. Today ordinary guided, project, PvCPU, and both PvP programs use fixed `bba:` localStorage keys, while usage sessions live in a fixed IndexedDB database. They are not account-scoped. Chrome partitions an embedded frame by origin and top-level site, not by the Workspace account that happens to sign into the parent. An account switch in the same Chrome profile can therefore expose or upload the preceding student's local workspace unless the bootstrap layer binds and quarantines it.
- **Why it matters in a classroom:** A later student at the same Chromebook could see a previous student's guided or hot-seat strategy, choose that device copy during a conflict, or upload it under their own account. The proposal's promise to keep shared computers usable would become a privacy and attribution failure.
- **Evidence:** [docs/subsystems/blockly-workspace.md](../../../docs/subsystems/blockly-workspace.md) documents fixed per-mode keys; [`workspace.js`](../../../src/ai/blockly/workspace.js) resolves those fixed keys at lines 262-275 and loads/saves them at lines 943-1016. [`usageTracker.js`](../../../src/usage/usageTracker.js) uses the single `bba-usage-tracker` IndexedDB database at lines 24-48. Chrome documents that localStorage and IndexedDB in an iframe are partitioned by both origin and top-level site, including nested-frame handling, not by application login ([Storage Partitioning](https://privacysandbox.google.com/cookies/storage-partitioning)).
- **Likelihood / classroom impact:** High in a shared Chromebook lab; impact is high because the previous student's work can be disclosed or misattributed.
- **Smallest recommended change:** After the parent authenticates, provide the child only a server-derived opaque account/cohort record key. Bind every GAS-mode local envelope and outbox to that key. If the local binding is absent or belongs to another key, quarantine it without rendering it to the newly signed-in account; offer only a generic recovery instruction to sign into the previous account or ask the teacher. Preserve current direct-mode keys and behavior unchanged. This is a bounded adapter concern, not a reason to remove PvP or shared-computer play.
- **Falsification test:** On one managed-Chromebook-like profile, save dirty state for synthetic Account A while offline, then open the shell as synthetic Account B. Assert that B cannot view, restore, submit, or learn the content of A's package; then verify A can recover its own package after signing back in.

### 3. Portable state needs a restore precedence and atomicity contract, not only a list of fields

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Canonical Artifact Recommendation* (lines 295-387); *Boot And Restore Sequence* (lines 272-293).
- **Finding:** The proposed portable-state list places guided progress and durable learning/star fields together, but it does not say which wins when they disagree or how a multi-store import succeeds atomically enough to be honest about completeness. Current guided unlock state is written to localStorage and is explicitly the writer of record. The usage tracker independently mirrors its pass ledger and durable star records in IndexedDB. A guided workspace load can also silently replace a restored non-project workspace when the stored starter hash differs from the current authored starter. Restoring these pieces as a generic storage dump or one-by-one without a declared precedence can yield unlocked levels, stars, and workspace XML from different points in history.
- **Why it matters in a classroom:** A student can arrive on a second device with a visible pass or star that does not agree with the program or evidence the teacher later reviews. A failed partial restore may look successful and is difficult for a student to diagnose.
- **Evidence:** [`levels.js`](../../../src/core/levels.js) persists and restores the guided pass ledger at lines 25-88 and mirrors it to usage at lines 358-362/510-516. [`usage-and-admin.md`](../../../docs/subsystems/usage-and-admin.md) defines the separate durable ledger and pass-ledger mirror. [`workspace.js`](../../../src/ai/blockly/workspace.js) applies starter-version replacement at lines 943-988. Existing browser coverage treats guided workspace, guided progression, PvCPU workspace, and both PvP workspaces as distinct persistence contracts in [`persistence.spec.js`](../../../tests/browser/persistence.spec.js).
- **Likelihood / classroom impact:** Medium whenever a restore meets an older app, starter change, interrupted write, or cross-device divergence; impact is high because progression and teacher-visible evidence can conflict.
- **Smallest recommended change:** Put a portable-state codec before networking. Its contract should (1) name the source of truth for guided progress, (2) define the ledger mirror operation, (3) validate every workspace class and its starter-version metadata, (4) apply all local writes in a staged transaction with a `restoreIncomplete` marker until verification passes, and (5) reject rather than merge a package with an unrecognized app/state schema. A conflict selection chooses a whole state package; it must not field-merge progression, stars, or Blockly XML.
- **Falsification test:** Round-trip every storage class, then inject failures after each write and a mismatch between `bba:guided-level-progress` and the durable pass ledger. Verify no normal startup exposes a mixed state, and verify a stale guided starter is handled according to the existing replacement contract rather than silently treated as a cloud conflict.

### 4. The intended bootstrap barrier is incompatible with the current initialization order until made a first-class runtime contract

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Boot And Restore Sequence* (lines 272-293); *Proposed Workstream Sequence* (lines 798-809).
- **Finding:** The proposal rightly says cloud restore cannot happen after game/tracker/editor hydration, but the present entry point begins usage tracking before level initialization and immediately starts the heavy editor/board boot. A cloud adapter added after those calls would restore into live state and risks overwriting local work or recording misleading lifecycle events. The proposal calls this a meaningful refactor, but it does not yet require the initialization ordering as a testable contract.
- **Why it matters in a classroom:** A delayed response can make a student's blocks or progress change after they begin working, particularly on slow school Wi-Fi. That is more confusing than an explicit offline state.
- **Evidence:** [`main.js`](../../../src/main.js) calls `initializeUsageTracking(app)` at lines 40-45, `initializeLevelState(app)` later in the same startup, and `startHeavyBoot(app)` at line 230. `initializeLevelState()` applies persisted local guided progression immediately ([`levels.js`](../../../src/core/levels.js):227-247); the loader initializes Blockly and then invokes ready hooks ([`loaders.js`](../../../src/startup/loaders.js):29-53).
- **Likelihood / classroom impact:** Certain without a startup refactor; impact is high for slow/failed bootstrap paths.
- **Smallest recommended change:** Add a small, explicit bootstrap coordinator before tracker, level, and heavy-system initialization. It may resolve to `cloud-restored`, `local-only`, or `conflict` only once. If its bounded timeout chooses local-only, a late response becomes a non-destructive background conflict check; it must never auto-apply state after the UI becomes interactive.
- **Falsification test:** Instrument startup and delay the synthetic bootstrap response past the timeout. Assert that no tracker, level, or Blockly lifecycle event occurs before the coordinator resolves and that a later result cannot overwrite a Blockly edit made after local-only startup.

### 5. The current evidence builder contains student identity fields, so cloud mode needs an explicit v2 identity policy

- **Severity:** moderate
- **Status:** confirmed
- **Proposal location:** *Latest schema-v2 evidence* (lines 330-341); *Export And Submission Behavior* (lines 600-623).
- **Finding:** The proposal says cloud mode should build current v2 evidence without a student identity prompt and store account attribution outside the child payload. The current v2 builder nevertheless accepts `studentName`, serializes it into the payload, and the current UI requires a nonblank name before it exports. A refactor that merely reuses the existing export call will either retain a stale/self-reported name in the cloud payload or silently change the v2 shape/analyzer assumptions without a contract.
- **Why it matters in a classroom:** The teacher could see two contradictory identity labels, and an unnecessary self-reported name could be retained in the cloud record despite the stronger Workspace receipt.
- **Evidence:** [`usageTracker.js`](../../../src/usage/usageTracker.js):493-528 requires a name for the local-export flow. [`usageFormat.js`](../../../src/usage/usageFormat.js):520-578 includes `studentName` in schema-v2 payloads. [`controls.js`](../../../src/ui/controls.js):489-523 implements the prompt and download; [`persistence.spec.js`](../../../tests/browser/persistence.spec.js):174-195 asserts that direct behavior.
- **Likelihood / classroom impact:** Certain in an unmodified extraction; impact is moderate but touches identity minimization and teacher interpretation.
- **Smallest recommended change:** Split the pure v2 evidence builder from `exportUsageFile`. Specify that GAS-mode evidence contains an omitted or empty self-reported-name field only if the existing v2 analyzer accepts that form, while the server envelope carries the account receipt. Keep direct mode's prompt, download, filename, and regression test unchanged. Do not add the Workspace email to the child payload.
- **Falsification test:** Generate direct and GAS-mode payloads from the same synthetic session. Confirm the direct path remains byte-for-byte compatible with its existing contract, the GAS payload has no self-reported identity, and the current analyzer reports the intended account/evidence distinctions without treating either as authorship proof.

### 6. Compare-and-swap and idempotency are named but not specified enough to recover from partial acknowledgements

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Save Frequency And GAS Load Budget* (lines 415-434); *Revision, Lease, And Conflict Model* (lines 500-550); *Server validation* (lines 704-716).
- **Finding:** The proposal correctly orders Drive before the Sheet and calls for idempotency keys, but it does not define the operation identifier, where its completed outcome is persisted, or how a retry distinguishes a lost acknowledgement from a genuine stale write. A Drive success followed by a Sheet/RPC failure changes the current revision. Retrying the old `baseRevision` could become a conflict even though the exact save succeeded, or an archive/receipt could be duplicated. "Reconciliation" needs deterministic input and output rules before an implementation packet can test it.
- **Why it matters in a classroom:** A student whose save actually reached Drive may see a conflict or a permanent pending state after a Wi-Fi interruption. The teacher Sheet can be temporarily wrong precisely when the student needs reassurance.
- **Evidence:** The proposal mandates Drive-then-Sheet and later repair (lines 423-429) and mentions idempotency keys (lines 704-716), but the envelope example has no operation receipt/idempotency record. Google documents that `google.script.run` calls are asynchronous and can execute out of order; a page can have up to ten concurrent calls ([HTML Service communication](https://developers.google.com/apps-script/guides/html/communication)).
- **Likelihood / classroom impact:** Medium under Wi-Fi loss or quota errors; impact is high because it creates false conflicts and can lose the only acknowledgement.
- **Smallest recommended change:** Define an immutable `saveOperationId` and payload digest, generated before writing the outbox and retained across retries. Persist the accepted operation id, revision, and receipt inside the Drive envelope in the same write. The server behavior must be: same record/key/op-id/digest returns the original acknowledgement; a different op-id with a stale base revision returns a conflict; a Drive/Sheet mismatch is repaired from the accepted envelope without creating another archive. Bound the receipt history to the retry window.
- **Falsification test:** For synthetic records, inject each failure boundary: before Drive, after Drive/before Sheet, after Sheet/before response, duplicate request, delayed/out-of-order response, and stale lease takeover. Assert exactly one revision/receipt/archive per operation and a usable response after retry.

### 7. Account attribution remains an architecture gate, not a deployment detail

- **Severity:** major
- **Status:** plausible-needs-probe
- **Proposal location:** *Identity And Deployment Model* (lines 180-203); *Probe 1* (lines 741-749).
- **Finding:** The proposal's preferred combination is teacher-owned Drive/Sheet (execute as deployer) plus `Session.getActiveUser().getEmail()` on every request. Google documents that active-user email can be blank for a web app deployed to execute as the developer, with a same-domain case described only as a general exception. If the target tenant returns blank identity, using `getEffectiveUser()` would identify the teacher, not the student. This is therefore a hard viability gate, not an implementation fallback.
- **Why it matters in a classroom:** A failure would either disable the desired account-attributed cloud mode for the whole class or tempt an unsafe fallback that writes every student's work under the teacher identity.
- **Evidence:** The proposal already acknowledges the uncertainty. The current [Apps Script Session reference](https://developers.google.com/apps-script/reference/base/session) states that `getActiveUser().getEmail()` can be blank in execute-as-me web apps and that `getEffectiveUser()` returns the developer in that mode.
- **Likelihood / classroom impact:** Unknown until tenant testing; impact is critical if it fails.
- **Smallest recommended change:** Make Probe 1 a no-code, recorded go/no-go before data/schema packets. Its sole safe success condition is a correct nonblank active account for the actual deployer/teacher and representative student accounts. If it fails, return the documented alternatives to the owner; do not substitute a temporary user key or effective user as account attribution.
- **Falsification test:** In the target Workspace tenant, test the minimal web app as the intended deployer with the teacher and at least two student accounts, including an account in multiple active cohorts. Store only deidentified pass/fail outcomes and authorization-friction observations.

### 8. The direct-to-GAS migration handshake and HtmlService origin need an end-to-end, redirect-aware proof

- **Severity:** major
- **Status:** plausible-needs-probe
- **Proposal location:** *Protocol invariants* (lines 242-270); *Storage partition complication* (lines 568-589); *Probe 2-3* (lines 751-768).
- **Finding:** The migration needs a direct GitHub Pages tab to open a GAS URL, survive Workspace authorization/redirects, reach the actual HtmlService frame, and then exchange a nonce-bound message through a valid `window.opener`/frame relationship. Neither a successful top-level `window.open()` nor a simple iframe smoke test proves that chain. HtmlService is itself iframe-sandboxed, while browser `postMessage` requires the exact current target origin and receiver validation of origin and source. A fixed origin allowlist also needs an update/rotation strategy if the effective HtmlService origin differs from the public `/exec` URL.
- **Why it matters in a classroom:** A one-time migration that fails after students authenticate consumes class time and leaves prior progress in an unfamiliar partition. A weak origin fallback would create a security problem.
- **Evidence:** Google documents that HtmlService uses IFRAME sandboxing and restricts navigation/popup behavior ([HtmlService restrictions](https://developers.google.com/apps-script/guides/html/restrictions)). MDN requires an exact target origin when known and advises validating both `event.origin` and `event.source`; it also notes that an origin is not guaranteed to remain current after navigation ([`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)). The proposal already makes this a probe, correctly.
- **Likelihood / classroom impact:** Unknown and environment-dependent; impact is high at first migration.
- **Smallest recommended change:** Keep the strict protocol, but require the probe to exercise the *actual* first-use authorization path, all redirects, the inner HtmlService frame, popup blocking, iframe reload/navigation, and a managed Chromebook. Define a manual package download/upload path as a first-class recovery flow, not a footnote. Do not weaken `targetOrigin` to `*` if the observed origin is inconvenient.
- **Falsification test:** Start with direct synthetic v2/local state, invoke migration by a single student gesture in a managed browser profile, complete authentication, and verify exactly one nonce-bound transfer. Repeat with blocked popup, expired auth, iframe reload, and a forged/stale nonce; all failures must preserve the direct local state and offer the manual recovery path.

### 9. Global locking and a combined envelope require a measured classroom-load decision

- **Severity:** moderate
- **Status:** plausible-needs-probe
- **Proposal location:** *Save Frequency And GAS Load Budget* (lines 389-438); *Canonical Artifact Recommendation* (lines 343-377).
- **Finding:** The proposal chooses a global ScriptLock across revision check, Drive write, and Sheet index update, then asks the class-load probe whether that serialization is tolerable. It also co-locates evidence with state so a state-only checkpoint still requires the server to read/write an envelope containing the latest evidence. `google.script.run` calls are asynchronous and ordering is not guaranteed; Apps Script also has quota/concurrency limits. There is no measured service-time budget or success criterion for a 20-40-student level boundary, so neither global serialization nor one combined artifact can yet be called proportionate.
- **Why it matters in a classroom:** A synchronized level transition can turn a conservative two-minute cadence into a burst of long pending states. If the evidence payload is large, a routine state checkpoint also does needless storage work.
- **Evidence:** The proposal explicitly serializes with `LockService.getScriptLock()` (lines 423-434) and mentions roughly 100-285 KB synthetic exports for the load probe (lines 770-777). Existing v2 payloads include boundary XML, ledger, events, and snapshots ([`usageFormat.js`](../../../src/usage/usageFormat.js):547-578). Google documents asynchronous/out-of-order `google.script.run` calls and a ten-call per-page limit ([HTML Service communication](https://developers.google.com/apps-script/guides/html/communication)); its quota guide lists limits that may change ([Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas)).
- **Likelihood / classroom impact:** Medium to high in synchronized class transitions; impact is moderate to high, depending on measured Drive/Sheet time.
- **Smallest recommended change:** Add a service-level success criterion to the probe before fixing the artifact shape: for example, a synthetic 40-client boundary burst with bounded retry must retain every local package, yield a clear pending state, and reach a specified acknowledgement percentile without lock timeouts. Compare (a) one combined envelope with server-side evidence reuse against (b) separate `state` and `latest-evidence` artifacts. Separate artifacts are preferable if state checkpoints otherwise transfer or rewrite evidence, or if the 30-day state and 90-day evidence retentions cannot be enforced independently.
- **Falsification test:** Run both shapes against synthetic 5 KB state packages and representative 100-285 KB v2 evidence, with 20, 30, and 40 simultaneous clients, forced retry, and a teacher index read. Capture queue time, lock wait, Drive/Sheet latency, acknowledgement rate, duplicate receipts, and time until the local outbox drains.

### 10. A new client session from another device must not erase prior cloud evidence by default

- **Severity:** moderate
- **Status:** confirmed
- **Proposal location:** *Latest schema-v2 evidence* (lines 330-341); *Schema-v2 Migration* (lines 591-598).
- **Finding:** The current envelope replaces `latestEvidence` for the same active usage session and archives evidence on rollover, explicit submission, or cohort close. A second device creates a fresh usage session id; it does not participate in the first device's IndexedDB rollover. The proposal does not say whether the server archives the prior latest evidence before accepting a different session id. Without that rule, a student who continues work on another device can preserve portable progression while losing the preceding session's event tail/boundary evidence.
- **Why it matters in a classroom:** Teacher review would show the newest session only, making normal cross-device continuation look like missing history. This undermines the proposal's stated evidence value even though the student did nothing wrong.
- **Evidence:** [`usageTracker.js`](../../../src/usage/usageTracker.js):147-158 and 219-239 show session creation and same-store rollover; a new storage partition has no prior session. The proposed `latestEvidence` section contains one session id (proposal lines 367-373) and says it is replaced (lines 339-341).
- **Likelihood / classroom impact:** Medium whenever students move devices; impact is moderate for teacher evidence and recovery.
- **Smallest recommended change:** In the server contract, an accepted save with a different evidence session id must explicitly choose one outcome: archive the displaced latest v2 evidence once before replacement, reject the switch for review, or retain only a documented compact summary. The recommended classroom default is bounded automatic archive with idempotent server receipt and retention consistent with the evidence window.
- **Falsification test:** Save a synthetic Session A, restore its portable state into a fresh client Session B, save B, then verify the declared disposition of A in the Drive layout, Sheet receipt/index, extraction path, and purge job.

## Strengths Worth Preserving

- Keeping Browser Battlegorithms static and local-first, with GAS as an optional integration surface, protects the current offline classroom workflow.
- The proposal accurately separates Workspace account receipt, client-integrity hash, server receipt, authorship, and learning claims.
- It refuses client-supplied identity, record ids, and Drive ids as authorization inputs.
- It keeps rich evidence out of a shared Sheet and retains the existing local analyzer rather than recreating it in GAS.
- It requires strict `postMessage` origin/source validation, a nonce, bounded local outbox, conflict choices, and no RPC attempt during unload.
- It treats tenant identity, iframe behavior, storage partitioning, and classroom load as probes rather than pretending ordinary unit tests can prove them.

## Missing Owner Decisions

1. **Account-switch recovery:** What is the teacher-approved recovery path for dirty, unsynced GAS-mode data that is bound to a different account on a shared computer? The recommended default is quarantine without content disclosure, then recover only after the prior account signs in or through teacher-mediated recovery.
2. **Recovery retention implementation:** Is an application-managed, bounded conflict-recovery artifact acceptable, and what deletion disposition is required for Drive trash/revisions and Apps Script/Cloud logs under district policy?
3. **Evidence-session transition:** Should a new device session automatically archive the prior latest v2 evidence, or should only an explicit submit create an archive? The recommended default is bounded automatic archive so ordinary cross-device continuation does not discard evidence.
4. **Pilot cloud scope:** The owner direction keeps PvP/shared computers usable, but the first pilot should explicitly choose whether their workspaces are cloud-portable or remain local while Guided restores are piloted. Either choice must preserve offline/local PvP use and the signed-account/second-player distinction.
5. **Identity/retention approval:** After the tenant probe, confirm whether the district permits the exact attribution display and evidence retention/deletion behavior proven by the synthetic purge test.

## Recommended Revisions to the Proposal

1. Replace the single generic envelope claim with two declared canonical artifacts: a frequently updated portable-state artifact and a latest-evidence artifact updated only at meaningful evidence boundaries. Permit a combined implementation only if the load and retention probes demonstrate equivalent bounded behavior.
2. Add a small server-side recovery/receipt model: immutable save operation id, digest, revision, conflict disposition, and an explicit bounded losing-copy artifact.
3. Add an opaque record-key binding to all embedded-mode local state and outbox records, with account-switch quarantine rules that never render the prior account's data.
4. Elevate bootstrap ordering to an invariant: cloud/local/conflict resolution precedes usage, levels, Blockly, and board hydration; a late result cannot mutate an interactive session.
5. Define the GAS-mode schema-v2 identity form and analyzer behavior; direct export remains unchanged.
6. Define server behavior when an incoming evidence `sessionId` differs from the current one, including archive, retry, receipt, and purge semantics.
7. Add measurable performance criteria before choosing global ScriptLock scope and the one-vs-two-artifact implementation.

## Recommended Probe and Packet Sequence

1. **Tenant, embedding, and shared-device probes:** Test active-user identity, actual parent/child origin and sandbox behavior, direct-to-shell migration through real authorization, nested storage, iframe reload, and Account A-to-B isolation. Use only synthetic payloads and deidentified outcomes.
2. **Owner contract amendment:** Ratify the identity outcome, account-switch quarantine, evidence-session archival, retention/deletion disposition, and pilot scope. Do not decide these inside source packets.
3. **Versioned contracts:** Specify the portable-state codec, two artifact roles/retention, v2 identity form, bootstrap state machine, operation-id idempotency, conflict recovery, maximum sizes, and error vocabulary.
4. **Pure client work:** Implement and test storage codecs, staged restore, account-key binding, outbox, and direct-mode regression protection without GAS networking.
5. **Synthetic GAS proof:** Implement only the parent/server protocol and synthetic Drive/Sheet operations; prove duplicate retry, partial failure reconciliation, losing-copy recovery, and class-burst behavior before live student data.
6. **Guided-only cloud pilot:** Pilot Guided restore and teacher extraction with a small cohort and a clear local export rollback. Keep Free Play/PvP usable locally; add their cloud portability only after their shared-device and attribution behavior passes dedicated probes.
7. **Retention/purge operations:** Add dry-run and synthetic full-lifecycle proof before enabling owner-triggered purge. A permanent production rollout follows observed pilot conflict, quota, and recovery evidence.

## Rival Designs and Decision Observations

| Rival | Prefer it when this observation is true | What it gives up / preserves |
| --- | --- | --- |
| GAS final-submission relay only | Tenant identity works but embedded storage, migration, or conflict probes fail; cross-device resume is not worth the class-time cost. | Preserves teacher account receipt and local-first play; gives up automatic cross-device restore. |
| Sheet-only bounded summaries | The teacher's routine need is attendance/progress milestones, not program/evidence recovery; minimization is more valuable than raw v2 extraction. | Lowest data volume and simplest class view; gives up full evidence storage and program portability. |
| Drive-only per-student files, no Sheet index | Burst measurements show Sheet work or global locking is the bottleneck, and the teacher can tolerate a less convenient cohort overview. | Keeps private per-record artifacts and reduces coupled writes; gives up a live class index unless a later read-only tool lists files. |
| Two current artifacts: state plus evidence | State changes more often than evidence, or their 30/90-day retentions cannot be enforced independently. | Avoids rewriting evidence for a state save and clarifies deletion; adds one artifact lookup/update at evidence boundaries. |
| One combined current envelope | Measured class load shows a small, bounded envelope and one write is reliably faster, while explicit recovery copies and state/evidence deletion remain enforceable. | Fewer current files; retains coupling between two different semantics and retention schedules. |
| GAS-hosted copied build | The framing/origin/storage probes fail but the district can support a controlled build-release process. | Avoids nested third-party storage/frame behavior; gives up the proposal's single public GitHub Pages runtime and increases release drift risk. |
| Remain entirely local/manual | Identity cannot be safely derived, district retention approval is absent, or the pilot does not save classroom time. | Preserves the existing privacy-conscious workflow and no cloud operations; gives up automatic account-attributed continuity. |

## Verdict

**Ready after bounded proposal revisions, but not yet ready for implementation packets.**

The static-client, optional-GAS, server-derived-account direction remains proportionate for the stated classroom goal. The proposal first needs an explicit local account-isolation rule, controlled recovery/deletion artifacts, a portable-state precedence/restore contract, deterministic idempotency behavior, and the tenant/browser/load probes above. Those are bounded design changes; they do not require Firestore, Classroom, a custom backend, or a rewrite of the game.

## Review Evidence Inspected

- Repository contracts: `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/TeacherGuide.md`, `docs/StudentGuide.md`, `docs/subsystems/blockly-workspace.md`, `docs/subsystems/usage-and-admin.md`, `docs/subsystems/file-pipelines.md`, `docs/subsystems/ui-mode-contract.md`, `docs/CohortUsageAnalysis.md`, and `docs/CohortUsageDataDictionary.md`.
- Runtime/tests: `src/main.js`, `src/startup/loaders.js`, `src/ai/blockly/workspace.js`, `src/core/levels.js`, `src/usage/usageTracker.js`, `src/usage/usageFormat.js`, `src/usage/learningLedger.js`, `src/usage/runVersionStore.js`, `src/ui/controls.js`, relevant usage-v2 tests, and `tests/browser/persistence.spec.js`.
- Current platform references: [Apps Script Session](https://developers.google.com/apps-script/reference/base/session), [HtmlService communication](https://developers.google.com/apps-script/guides/html/communication), [HtmlService restrictions](https://developers.google.com/apps-script/guides/html/restrictions), [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas), [Drive revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions), [Apps Script logging](https://developers.google.com/apps-script/guides/logging), [MDN postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), and [Chrome Storage Partitioning](https://privacysandbox.google.com/cookies/storage-partitioning).
