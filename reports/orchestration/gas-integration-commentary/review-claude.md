# Adversarial Review — Google Apps Script Cloud Integration Proposal

**Reviewer model type:** claude (Opus 5)

**Review date:** 2026-09-01

**Proposal reviewed:** `reports/orchestration/google-apps-script-cloud-integration-proposal.md` as of commit
`29f3d31` (*Fix proposal metadata formatting*). The proposal's own stated repository baseline is `a321be9`.

**Repository HEAD at review time:** `9f03f85` (*Add adversarial review of GAS cloud integration proposal*),
working tree clean.

**Independence note:** `review-gemini.md` was already committed at `9f03f85` when this review began. It was
deliberately **not read**, so the findings below are independent rather than differential. Overlap between the
two reviews should be treated as corroboration; divergence should be adjudicated by the orchestrator, not
assumed to be an error in either.

**Scope of this review:** no runtime source, packet, proposal, or documentation file was modified. No deployment,
no cloud resource access, no real student data. All evidence is repository code, repository documentation, and
public platform documentation.

---

## Evidence Inspected

**Documents read in full:** `AGENTS.md`; the proposal; `reports/orchestration/session-handoff.md`;
`docs/ARCHITECTURE.md`; `docs/TESTING.md`; `docs/TeacherGuide.md`; `docs/StudentGuide.md`;
`docs/subsystems/blockly-workspace.md`; `docs/subsystems/usage-and-admin.md`;
`docs/subsystems/file-pipelines.md`; `docs/subsystems/ui-mode-contract.md`; `docs/CohortUsageAnalysis.md`;
`docs/CohortUsageDataDictionary.md` (partial).

**Source inspected (directly or via read-only delegated inspection with line citations):**
`src/main.js`, `src/startup/loaders.js`, `src/ai/blockly/workspace.js`, `src/ai/blockly/starterVersioning.js`,
`src/core/levels.js`, `src/core/state.js`, `src/ui/controls.js`, `src/ui/preferences.js`,
`src/usage/usageTracker.js`, `src/usage/usageFormat.js`, `src/usage/learningLedger.js`,
`src/usage/runVersionStore.js`, `src/usage/usageAnalyzer.js`, `src/usage/usageAnalyzerBrowser.js`,
`src/usage/cohortAnalysis.js`, `src/admin/adminApp.js`, `vite.config.js`, `package.json`, `index.html`.

**Tests / artifacts inspected:** `tests/browser/persistence.spec.js` (test inventory);
`tests/regression/output/*.json` (sizes only — generated, gitignored, not committed).

**Platform documentation verified during review (2026-09-01):** Apps Script *HTML Service: Restrictions*,
*Migrate to IFRAME Sandbox Mode*, *Class Session*, *Class User*, *Class LockService*, *Quotas for Google
Services*; WHATWG HTML `iframe` element and sandboxed-modals-flag; MDN `<iframe>`, `requestStorageAccess`,
`StorageAccessHandle`; Chrome *Storage Partitioning*; Chrome 83 deprecations (sandboxed-iframe downloads).

**Measured repository facts used below:**

| Fact | Value | Source |
| --- | --- | --- |
| Guided level definition files | 47 | `src/config/levels/phases/**` |
| Regression export sizes | 107 KB – 285 KB | `tests/regression/output/*.json` (`wc -c`) |
| Usage session retention | 7 days / 20 sessions | `USAGE_RETENTION_DAYS`, `USAGE_MAX_SESSIONS`, `usageFormat.js:18-19` |
| Event tail cap | 400 events | `USAGE_MAX_EVENTS`, `usageFormat.js:20` |
| Snapshot cap | 48 | `USAGE_MAX_SNAPSHOTS`, `usageFormat.js:21` |
| Run-version budget | ~2 MB, local-only | `RUN_VERSION_BUDGET_BYTES`, `runVersionStore.js:26` |
| Boundary XML cap | K=5 per level | `RUN_VERSION_GUIDED_PER_LEVEL_CAP`, `runVersionStore.js:29` |
| `appVersion` | `0.1.0`, never bumped | `package.json:3`; `git log -S'"version"' -- package.json` returns one commit |

---

## Findings

Ordered by severity, then by likelihood in a real classroom.

---

### F1 — Cloud restore of starter-version metadata silently destroys student work, then overwrites the cloud copy with the starter program

- **Severity:** critical
- **Status:** confirmed
- **Proposal location:** *Canonical Artifact Recommendation → 1. Portable state*, bullet "guided starter-version
  metadata needed to preserve stale-starter replacement"; *Revision, Lease, And Conflict Model* → "No option
  silently deletes the losing copy."

**Finding.** `getStoredWorkspaceXmlText()` is a read accessor that performs destructive writes. On a
starter-hash mismatch it executes `window.localStorage.setItem(storageKey, fallbackXml)`
(`src/ai/blockly/workspace.js:983`), discarding the student's stored XML and replacing it with the level's
starter. This is correct, intentional, documented behavior today
(`docs/subsystems/blockly-workspace.md`, "Replace-on-mismatch (silent by design)"), because the loss is bounded
to one device and the student is seeing a genuinely corrected level.

Cloud sync removes that bound. The proposal transports `bba:guided-workspace-version:<levelId>` inside portable
state. The resulting sequence is:

1. Device A, running build X, saves workspace XML plus hash X.
2. The envelope is checkpointed to Drive.
3. Device B, running build Y (a shipped starter-XML authoring fix, or merely a differently cached bundle),
   restores both keys.
4. On the next load of that level, `storedVersion !== currentVersion` → the restored XML is overwritten with
   starter XML (`workspace.js:983`).
5. The next Blockly edit calls `saveWorkspaceToLocalStorage` (`workspace.js:1004`), persisting the starter.
6. The next coalesced checkpoint uploads the starter as the student's work. Compare-and-swap **succeeds** —
   the revision lineage is unbroken — so the cloud copy of the real work is replaced.

No user chose anything. Both copies are gone. This is a direct violation of the proposal's own "no option
silently deletes the losing copy" invariant, arriving through a path that offers no option at all.

There is no version gate that could detect it. `appVersion` is `0.1.0` in `package.json:3` and
`git log -S'"version"' -- package.json` returns exactly one commit (`9d23b7b`), so roughly 117 plans of change
have shipped under one version string. Any "reject unsupported schema/app combinations" rule built on
`appVersion` is a no-op today.

**Why it matters in a classroom.** The failure is invisible and total. A student opens a level they solved last
week and finds the starter program. Cloud sync was sold to them as the thing that keeps work safe; it is the
mechanism that destroyed it. The most likely trigger is the owner shipping a starter-XML fix mid-semester —
which this repository has already done once (`docs/subsystems/blockly-workspace.md`, 2026-05-17, bughunt-22).
On that day, every student's cloud copy of that level would be overwritten with the starter.

**Evidence.** `src/ai/blockly/workspace.js:943-996` (mismatch branch and the two `setItem` calls at 981/983);
`src/ai/blockly/workspace.js:998-1017` (unconditional save-back); `src/ai/blockly/starterVersioning.js:41-42`
(hash computed at module-load time from the *build's* `initialBlocklyXml`, so it is a build property, not a
student property); `package.json:3`.

**Smallest recommended change.** Two lines of contract, not a redesign:

1. The cloud restore adapter must not write a workspace and its version key blindly. When the restored version
   key does not match the local build's hash, preserve the displaced XML in a recoverable local slot
   (`bba:displaced-workspace:<levelId>`) **before** the starter replaces it, and set a portable-state flag
   `displacedByStarterUpdate: [levelId]`.
2. That flag must suppress the next checkpoint's upload of that level's workspace until the student
   acknowledges, so a starter program is never promoted to the cloud as student work.

Do **not** solve this by dropping the version key from portable state — that reintroduces the exact bug Plan 45
fixed, and the grace-stamp branch (`workspace.js:966`) would then bless genuinely stale work.

**Falsification test.** Playwright, no GAS required. Seed `bba:guided-workspace:<L>` and
`bba:guided-workspace-version:<L>` with a deliberately wrong hash, load the level, and assert whether the stored
XML survives. Then assert whether a subsequent simulated checkpoint payload contains the starter or the original.
If the current build preserves the student XML, this finding is wrong.

---

### F2 — On a shared computer the previous student's Google session silently owns the next student's work, and every guard in the design passes

- **Severity:** critical
- **Status:** confirmed (mechanism); owner-decision (mitigation, resolved 2026-09-01)
- **Proposal location:** *PvP And Shared-Computer Contract*; *Identity And Deployment Model*.

**Finding.** The proposal treats "shared computer" as a PvP hot-seat problem. The far more common case is
sequential: period 2 ends, a student walks away without signing out of Chrome, period 3 sits down at the same
Chromebook and starts playing. The GAS server derives identity from the live Google session, so period 3's
guided progress, evidence, and ledger are written into period 2's cloud envelope.

Critically, **nothing in the design detects this**. The record's revision lineage is unbroken, so
compare-and-swap accepts every write. It is the same browser storage partition, so the `BroadcastChannel`
duplicate-tab guard sees nothing. It is the same client instance id, so the lease is held by the "correct"
device. The Sheet shows a normal, healthy, actively-syncing student. The contamination is undetectable and, by
the time anyone notices, unrecoverable: period 2's real work has been legitimately superseded revision by
revision.

**Why it matters in a classroom.** Two students lose a grade's worth of evidence and neither can prove what
happened. Unlike a conflict, there is no second copy — the displaced work was overwritten by valid,
authenticated writes. This is more likely than every PvP scenario the proposal spends a section on, and it is
the single hazard that cloud attribution *creates* rather than inherits: today, a student who plays on a
classmate's machine simply produces a local file with the wrong name typed into it, which the teacher can see
and question.

**Evidence.** Design-level, derived from the proposal's own guards: compare-and-swap
(*Revision, Lease, And Conflict Model*), the same-partition `BroadcastChannel` tab guard, and the cross-device
lease all key on record revision, storage partition, and client instance — none of which changes when the human
changes.

**Smallest recommended change.** **Owner decision 2026-09-01: explicit account gate.** Before the child enters
cloud mode, the GAS shell shows `You are signed in as <account>` with **Continue** and **Switch account**,
required once per page load. It costs a few seconds and is the only point in the flow where a human can observe
the mismatch. Pair it with a Teacher Guide procedure ("sign out at the end of the period"), but do not rely on
the procedure alone.

**Falsification test.** Two synthetic domain accounts, one browser profile. Sign in as A, play, do not sign out;
sign in as B in the same Chrome profile, play, checkpoint. Inspect whether B's writes land in A's record. If they
land in B's record, this finding is wrong — and that result would be worth documenting, since it would mean
derived identity refreshes correctly per RPC.

---

### F3 — A class-sized checkpoint burst sits exactly on a documented hard quota, and the global lock makes it a positive-feedback failure

- **Severity:** major
- **Status:** confirmed (quota); plausible-needs-probe (exact failure threshold)
- **Proposal location:** *Save Frequency And GAS Load Budget*; *Falsification Probes → Probe 4*.

**Finding.** Google documents **30 simultaneous executions per user** for both consumer and Workspace accounts.
Under execute-as-deployer — the proposal's *preferred* deployment — every student's RPC runs as the deployer, so
an entire class shares one pool of 30. The proposal names "thirty students producing one coalesced checkpoint
each" as the *normal target scenario*. That is not a normal target; it is the ceiling, with zero headroom, before
any retry, before any second class period overlapping, and before a class of 35.

The global `LockService.getScriptLock()` around the Drive+Sheet critical section converts a static ceiling into a
positive-feedback loop: lock wait extends each execution's *duration*, longer executions raise the number of
*simultaneous* executions, which increases contention, which lengthens lock wait. There is no back-pressure term
anywhere in the design.

Three compounding factors the proposal does not account for:

1. **The burst is teacher-synchronized.** Guided checkpoints fire on level completion/transition. A teacher
   saying "everyone move on to level 12" produces a near-simultaneous class-wide checkpoint by construction. The
   cadence design contains no jitter or stagger.
2. **Each write is large.** With one envelope, a checkpoint carries portable state (up to ~47 guided workspace
   XMLs plus project, Free Play, and PvP workspaces) *plus* 107–285 KB of evidence. Drive `setContent` on a
   ~300–500 KB file is not a fast operation to hold a global lock across.
3. **Community-reported `google.script.run` concurrency is lower than the quota** — around 10 simultaneous calls
   before queuing. This is not documented by Google and must be measured, but it points the wrong way.

**Why it matters in a classroom.** The failure lands precisely at the moment of highest pedagogical value — a
whole class crossing a level boundary together — and presents to students as "school save pending" for everyone
at once, immediately after the teacher told them the cloud would keep their work.

**Evidence.** Apps Script *Quotas for Google Services* (simultaneous executions per user: 30). Apps Script
*Class Session* / *Web Apps* (execute-as-deployer runs as the deploying account). Proposal, *Save Frequency And
GAS Load Budget* ("Thirty students producing one coalesced checkpoint each is a normal target scenario") and its
`getScriptLock()` recommendation. Fixture sizes 107–285 KB (`tests/regression/output/`).

**Smallest recommended change.** Four cheap moves, in order of value:

1. **Take the Sheet out of the hot path.** The class index is a teacher convenience view; it does not need to be
   transactionally consistent with Drive. Rebuild it from the Drive folder on teacher demand and/or a
   time-driven trigger. This deletes the Drive/Sheet dual-write problem, the write-ordering rule, the
   partial-failure reconciliation logic, and most of the reason for a global lock — an entire section of the
   proposal simply evaporates.
2. **Jitter guided checkpoints** by a random 0–45 s. Costs nothing; converts a spike into a ramp.
3. **Shrink the hot-path payload** (see F5 — two artifacts).
4. **Make "busy, retry later" a first-class, non-alarming server response** that the outbox absorbs silently.
   The student-facing states list has no word for "the class is saving; yours is queued."

**Falsification test.** Probe 4 as written, plus three additions: (a) run at 35 concurrent clients, not 30;
(b) instrument *simultaneous execution count* from the Apps Script dashboard, not just latency; (c) run one arm
with the Sheet write removed from the critical section and compare. If Sheet removal does not materially change
lock time and failure rate, recommendation 1 is unnecessary.

---

### F4 — The evidence archive trigger effectively never fires, so cloud sync loses evidence that today's download workflow preserves

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Canonical Artifact Recommendation → 2*, "Replace the latest evidence snapshot for the
  same active usage session… Archive a session once on rollover, explicit final submission, or cohort close."

**Finding.** Session rollover is purely time-based and evaluated **once, at app load**: a persisted session is
continued when `Date.now() - updatedAt < 7 days` (`usageFormat.js:18`, `usageTracker.js:161-167`). A student who
plays even weekly never rolls over. One `sessionId` therefore spans an entire semester.

Against that single long-lived session, three caps are continuously evicting:

- `USAGE_MAX_EVENTS = 400` (`usageFormat.js:20`) — the event tail is a rolling window.
- `USAGE_MAX_SNAPSHOTS = 48` (`usageFormat.js:21`).
- Boundary XMLs are drawn from the run-version store, whose guided window D1 is the **last ~8 levels
  encountered** (`runVersionStore.js`; `docs/subsystems/usage-and-admin.md`).

So "replace the latest evidence for the same session, archive on rollover" means: the teacher's cloud evidence is
a rolling window over the most recent ~8 levels and most recent 400 events, and the archive that was supposed to
preserve the rest never fires. By November, September is gone.

The current workflow does not have this problem — and not by design. Students downloading a file at each
checkpoint *accidentally* creates an archive series. Cloud sync would replace a series of immutable snapshots
with a single mutable one.

**Why it matters in a classroom.** The teacher loses exactly the longitudinal record the cohort analysis
pipeline (`docs/CohortUsageAnalysis.md`, `docs/CohortUsageDataDictionary.md`) was built to consume. The durable
learning ledger survives (it is exempt from eviction), so *counts* remain — but the boundary XMLs, the actual
student programs at pass and fail, are the part that supports a conversation with a student about their thinking,
and those are the part that churns out.

**Evidence.** `src/usage/usageFormat.js:18-21`; `src/usage/usageTracker.js:148-167` and `219-244` (rollover
evaluated inside the load-time `ready` IIFE only); `src/usage/runVersionStore.js` D1 window;
`docs/subsystems/usage-and-admin.md` ("Session rollover and durable-tier carry-over", "Snapshot cap disclosure",
"XML-heavy event cap sizing").

**Smallest recommended change.** **Owner decision 2026-09-01: scheduled + explicit submit.** Archive
automatically at a cohort-defined cadence (weekly, or at teacher-marked checkpoints) **and** on every explicit
student *Submit progress*. Drop "on session rollover" from the trigger list — it is dead code in practice; keep
it only as a defensive extra. Bound the archive count per student per term explicitly in the schema so Drive file
counts stay predictable.

**Falsification test.** Replay a synthetic 12-week profile against the tracker (the regression harness already
simulates multi-level profiles), asserting the session id at week 12 and whether week-1 boundary XMLs are still
present in the export. If a new session id appears without a 7-day gap, this finding is wrong.

---

### F5 — The two "semantically distinct" envelope sections both contain the learning ledger, with no precedence rule

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Canonical Artifact Recommendation* — the whole section, plus the example envelope JSON.

**Finding.** The proposal's central claim is that portable state and evidence are distinct roles co-located for
write efficiency. For the learning ledger that claim is false: the ledger is simultaneously resume state and
grading evidence.

- The UI reads stars and mastery through `app.usageTracker.getGuidedStarState(levelId)`, which reads
  `session.learningLedger.guided[levelId]` from IndexedDB (`usageTracker.js:478-492`), and `getLevelStarState`
  in `src/core/levels.js:260-300` depends on it. So the ledger **must** be in portable state or restored
  students lose their stars.
- The v2 export payload also carries `learningLedger` as a top-level field (`usageFormat.js:547-563`). So the
  ledger is **also** in the evidence section.

The proposal then specifies different refresh cadences for the two: portable state at every dirty checkpoint
(≤ 2 min), evidence only at meaningful boundaries — and explicitly permits "a state-only checkpoint may reuse the
prior evidence section." The envelope will therefore *routinely* contain two disagreeing copies of the same
ledger, under one shared revision counter, with no stated precedence. On restore, which wins? On teacher review,
which does the Sheet's star summary derive from? Undefined in both directions.

**Why it matters in a classroom.** Two plausible bugs: a student restores and their star count regresses to the
last boundary; or a teacher's dashboard disagrees with what the student sees on screen. Both are the kind of
thing that destroys trust quickly and is very hard to debug after the fact.

**Evidence.** `src/usage/usageTracker.js:478-492`; `src/core/levels.js:260-300`;
`src/usage/usageFormat.js:547-563`; proposal *Save Frequency And GAS Load Budget* ("A state-only checkpoint may
reuse the prior evidence section").

**Smallest recommended change.** **Owner decision 2026-09-01: split into two Drive files** — one portable-state
artifact, one evidence artifact, each with its own revision. This is not only a semantic fix; it is cheaper on
the hot path, because a state-only checkpoint stops rewriting 107–285 KB of unchanged evidence bytes. It also
makes the proposal's own retention policy tractable: portable state at 30 days and evidence at 90 days becomes
*delete one file*, instead of rewriting the evidence artifact — and thereby mutating the revision history of the
very thing being preserved for grading appeals. The extra Drive call occurs only at boundaries, where both
sections genuinely changed.

Then state the ledger rule once, explicitly: **the portable-state artifact is authoritative for resume; the
evidence artifact's embedded ledger is a point-in-time copy for review and must never be read back into the
tracker.**

**Falsification test.** Instrument a synthetic 45-minute session and measure bytes written per checkpoint under
one-envelope versus two-file layouts, plus the count of checkpoints where evidence was unchanged. If evidence
changes on nearly every checkpoint anyway, the byte argument fails and only the semantic argument remains.

---

### F6 — Cloud-mode evidence breaks the teacher analyzer's identity, and any server-side fix breaks the integrity hash

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Export And Submission Behavior → GAS classroom mode*; *Teacher Review Experience*
  step 5.

**Finding.** The proposal says the teacher will "feed those files into the existing local admin analyzer." Two
concrete obstacles:

1. **Blank identity.** In cloud mode the student never types a name, so `studentName` is `""`. `admin.html`
   renders `"(blank)"` for every row (`src/admin/adminApp.js:302-304, 411`), and the CLI analyzer's similarity
   labels degrade to `submission-N` (`src/usage/usageAnalyzer.js:215`). The teacher opens a class table of 30
   identical blanks.
2. **The hash forbids the obvious fix.** `verifyUsageExport` recomputes SHA-256 over the *entire* payload minus
   `integrity` (`src/usage/usageAnalyzer.js:39-49`). Injecting server attribution into the payload makes every
   downloaded file report `tampered`. Wrapping it in an outer envelope means the analyzer must be handed the
   *inner* payload, at which point the attribution is not in the file at all.

There is also a **privacy inversion** the proposal misses in the other direction: `studentName` is embedded in
**three** places today, not one. Beyond the top-level field (`usageFormat.js:557`), it appears inside
`events[].data.studentName` for both `export_requested` and `export_completed`
(`usageTracker.js:498-503, 516-521`), and `sanitizeEventsForV2Export` strips only `xmlText`, not names
(`usageFormat.js:452-473`). The fingerprint helper does strip them (`usageFormat.js:174-187`), but that stripped
copy never ships. A cloud evidence builder that clears only the top-level field will still upload self-reported
student names to Drive.

**Why it matters in a classroom.** The teacher's whole reason for wanting this is to stop chasing files. Handing
them 30 anonymous JSON files is worse than the current workflow, not better. And the "we never put student
identity in the payload" privacy claim would be quietly false.

**Evidence.** `src/admin/adminApp.js:112, 116, 302-304, 336, 411`; `src/usage/usageAnalyzer.js:39-49, 215`;
`src/usage/usageAnalyzerBrowser.js:113, 198`; `src/usage/cohortAnalysis.js:75`;
`src/usage/usageFormat.js:174-187, 452-473, 557`; `src/usage/usageTracker.js:493-529`.

**Smallest recommended change.** **Owner decision 2026-09-01: encode attribution in the download filename.**
`adminApp.js:112` and `:302-304` already fall back to `fileName` when `studentName` is blank, so the class table
works with **zero** payload change and **zero** hash change. Add a matching `fileName` fallback to the CLI
analyzer (`usageAnalyzer.js:215`) so both paths agree, per the subsystem note's rule that CLI and browser
analyzers must not diverge. Separately, the evidence builder must strip `studentName` from all three locations —
add a unit test asserting the string does not appear anywhere in a cloud-mode payload.

Note for the cohort pipeline: `getStableKey` keys on `fileName + payloadHash + sessionId`
(`src/usage/cohortAnalysis.js:32-37`), so blank names do not break anonymization — but
`identityMap.details[].studentName` becomes empty and longitudinal linking will rely on filename. Worth one line
in `docs/CohortUsageDataDictionary.md`.

**Falsification test.** Take a real regression export, blank `studentName` in all three places, re-hash, load it
into `admin.html`, and confirm the class table shows the filename and the hash still verifies. Then run the CLI
analyzer on the same file and compare output semantics.

---

### F7 — Embedded-mode storage access is unguarded, and guided levels have no in-memory fallback

- **Severity:** major
- **Status:** confirmed (code fragility); plausible-needs-probe (trigger frequency)
- **Proposal location:** *Schema-v2 Migration → Storage partition complication*; *Falsification Probes → Probe 3*.

**Finding.** The proposal correctly identifies that Chrome *partitions* storage for a cross-site iframe. It does
not address the separate case where Chrome *blocks* it. When a district sets the `BlockThirdPartyCookies` Chrome
policy — or a student opens Incognito, or Tracking Protection applies — cross-site frames lose site-storage
access entirely, and property access itself raises `SecurityError`.

The code is not prepared for this:

- The only guard is a presence check, `typeof window === "undefined" || !window.localStorage`
  (`workspace.js:944`, `workspace.js:999`). Evaluating `!window.localStorage` is itself the throwing operation
  when access is denied, so the guard does not guard.
- `saveWorkspaceToLocalStorage` has **no try/catch** and runs on **every non-UI Blockly change event**
  (`workspace.js:829-850, 998-1017`). This is the highest-churn write path in the app and the least protected —
  `levels.js:62-73` and `preferences.js:84-88` both wrap their writes; this one does not.
- The in-memory fallback (`cacheWorkspaceXml` / `getCachedWorkspaceXml`, `workspace.js:277-295`) explicitly
  **no-ops for Guided Levels**. Free Play degrades gracefully; guided work has zero fallback.

**Why it matters in a classroom.** Under a district policy the owner does not control, embedding turns a
graceful-degradation story into an uncaught throw inside the Blockly change listener on every edit, in the exact
mode students spend most of their time in. Note this is *not* currently reachable: direct GitHub Pages is
first-party. Embedding creates the reachability.

**Evidence.** `src/ai/blockly/workspace.js:277-295, 829-850, 943-1017`; `src/core/levels.js:54-74`;
`src/ui/preferences.js:79-89`; Chrome *Storage Partitioning* documentation.

**Smallest recommended change.** Independent of GAS and worth doing regardless: wrap the storage read and write
in try/catch, extend the existing in-memory cache to guided levels, and surface a single honest banner
(`This browser is blocking saving — your work will be lost when you close the tab`). This is a small, testable
client-hardening packet that must land **before** any embedding work, and it improves the direct-site product for
students with strict privacy settings.

**Falsification test.** Two minutes, no GAS. Set Chrome to *Block third-party cookies*, load the app in an iframe
on any other origin, edit a block, and watch the console. The owner can settle the frequency question separately
with one email to district IT: *is `BlockThirdPartyCookies` set by policy on student Chromebooks?*

---

### F8 — Portable state has no import path, and restoring it requires a new usage-tracker contract, not a "storage adapter"

- **Severity:** major
- **Status:** confirmed
- **Proposal location:** *Proposed Workstream Sequence → 4. Pure client extraction* ("introduce
  storage/portable-state adapters without networking").

**Finding.** Workstream 4 is scoped as an extraction refactor. Half of it is already done and the other half is
larger than described.

*Already done:* `createExportPayload(session, studentName, exportedAt, options)` is a **pure function** with no
DOM and no `app` reference (`usageFormat.js:520-579`). The evidence-builder boundary the proposal wants mostly
exists; only `tracker.exportUsageFile()`'s wrapper reads `app.state` and calls Web Crypto
(`usageTracker.js:493-529`).

*Larger than described:* there is **no import path anywhere**. A grep across `src/` for import/restore patterns
returns nothing; the only code that parses a usage export is `src/admin/adminApp.js:40`, which is read-only
display and never touches the tracker or IndexedDB. `createLearningLedger(overrides)`
(`learningLedger.js:111-126`) is only ever called with an IndexedDB-sourced session or nothing.

Because stars and mastery live in the tracker's durable ledger (F5), restoring portable state means **writing
into the usage tracker's IndexedDB session**. The only current accessor is `app.usageTrackerSessionInternal`,
explicitly labeled *"Test-scaffolding accessor only. Do not treat as a general mutable-session backdoor"*
(`usageTracker.js:533-534`). And `initializeUsageTracking` is fire-and-forget from `main.js:41-45` — nothing
awaits `tracker.ready`, so a restore must add that await.

So the real work is a **new sanctioned tracker hydration API** with its own contract, its own tests, and its own
update to `docs/subsystems/usage-and-admin.md`. That is a usage-subsystem contract change, not a storage adapter.

**Why it matters in a classroom.** Mis-scoping this makes the packet slate wrong: the schema round would ratify a
portable-state shape whose consumer does not exist, and the implementer would discover mid-packet that they need
to open a documented invariant ("the ledger is never reconstructed from the event tail at read time").

**Evidence.** `src/usage/usageFormat.js:520-579`; `src/usage/usageTracker.js:207-244, 493-534`;
`src/usage/learningLedger.js:111-126`; `src/admin/adminApp.js:40`; `src/main.js:41-45`;
`docs/subsystems/usage-and-admin.md` (Core Invariants 1, 2, 4).

**Smallest recommended change.** Split workstream 4 into 4a (*evidence-builder boundary + name stripping* —
small, already mostly done) and 4b (*tracker hydration API* — `hydrateDurableTiersFromPortableState()`, with an
explicit rule that hydration replaces the ledger wholesale and never merges, plus a new completeness flag; see
F10). Sequence 4b before any restore work.

**Falsification test.** Attempt a spike: restore a synthetic ledger into a live tracker and read it back through
`getGuidedStarState`. If it can be done through existing public API without touching
`usageTrackerSessionInternal`, this finding overstates the work.

**Boot-barrier note (useful for whoever writes the packet).** The insertion point is concrete. Boot is
synchronous with two unawaited async tails: `startHeavyBoot(app)` (`loaders.js:85-89`) fires
`ensureEditorLoaded` and `ensureBoardLoaded` without awaiting. The localStorage workspace restore happens deep
inside that chain, via `onEditorReady → syncEditorForCurrentMode → loadCurrentLevelWorkspace`
(`main.js:101-118, 175-178`), strictly after Blockly injection (`workspace.js:820`). The cheapest barrier is
inside `ensureEditorLoaded` between the dynamic import (`loaders.js:37-40`) and `initBlockly` (`loaders.js:41`) —
that function already awaits, so one added `await` gates both Blockly injection and the localStorage restore.
Top-level await is already proven viable in `main.js` (the DEV-only block at `main.js:217-220`).

---

### F9 — Blocking startup on a conflict contradicts the proposal's own fail-open principle and lands at the worst moment of the period

- **Severity:** moderate
- **Status:** confirmed (tension); owner-decision (resolved 2026-09-01)
- **Proposal location:** *Boot And Restore Sequence* steps 7-8; *Conflict decision matrix*, "Block normal startup
  and show conflict choices"; *Failure Behavior And Observability → Fail-open versus fail-closed*.

**Finding.** The proposal declares "fail open for gameplay/local persistence," then specifies that divergence
blocks the game from starting. These are not literally contradictory (an outage is not a conflict), but the
student experiences them identically: the game will not start. A divergence prompt arrives in the first sixty
seconds of a fifty-minute period and asks a fifteen-year-old to make an irreversible-feeling choice between two
copies they cannot inspect. Compare-and-swap already prevents overwrite regardless of what they pick, so blocking
buys the *system* nothing — it only buys the *student* pressure.

**Why it matters in a classroom.** The most likely way a student loses work under this design is choosing wrong
at a blocking prompt they did not understand, under time pressure, with a teacher moving around the room. That is
a worse expected outcome than deferring the decision.

**Evidence.** Proposal, *Boot And Restore Sequence* steps 7-9 and *Conflict decision matrix* row 6, against
*Failure Behavior And Observability → Fail-open versus fail-closed*.

**Smallest recommended change.** **Owner decision 2026-09-01: never block play; block cloud writes only.** Start
locally, always. Surface a persistent non-blocking banner with a **Compare** action showing, for each copy:
levels passed, block count, and last-changed time. Cloud writes stay paused until the student (or teacher)
resolves. This preserves both copies, costs zero class minutes, and moves the decision to a moment when the
student can think.

**Falsification test.** Not a code test — a classroom one. In the pilot, log how many divergence banners appear
per class period and how long they remain unresolved. If banners are routinely ignored for days, blocking (or
teacher escalation) becomes justified.

---

### F10 — Divergence resolution silently discards ledger evidence, and no flag tells the analyzer a record crossed devices

- **Severity:** moderate
- **Status:** confirmed
- **Proposal location:** *Revision, Lease, And Conflict Model*; *Canonical Artifact Recommendation → 2*.

**Finding.** The durable ledger's counters are **additive and non-idempotent** — `entry.completedCount += 1`,
`entry.turnsSpent += turnsSpent` (`learningLedger.js:228, 262`) — while `starsEarned`, `parBeaten`, and
`masteryAchieved` are monotonic maxima (`learningLedger.js:237-251`). No merge function exists anywhere in the
repository; the only carry-over path is a single linear chain within one browser's IndexedDB.

The proposal's whole-record compare-and-swap is therefore **the right call**, and it deserves explicit credit: a
field-level merge would double-count attempts and durations, or fabricate implausible attempt histories from two
divergent branches. But the consequence needs stating plainly, and the proposal does not state it: when a student
resolves a divergence by choosing the cloud copy, the twenty minutes of ledger evidence accumulated on the losing
device are **not merged** — they are gone from the teacher's record. The workspace XML is preserved as a local
backup; the learning evidence is not.

Separately, `flags.durableTiersCarriedFrom` records only intra-device session lineage
(`learningLedger.js:128-136`). Nothing tells the analyzer that a ledger was assembled across devices or restored
from cloud, so the completeness caveats the analyzer surfaces (`docs/subsystems/usage-and-admin.md`,
"Dual-Version & Completeness Labels") would be silently incomplete for every cloud student.

**Why it matters in a classroom.** The teacher's evidence quietly undercounts, and the analyzer — which is
carefully honest about `historyPartial`, `eventTailTruncated`, and `ledgerBackfilled` — would present a
cross-device record with the same confidence as a single-device one.

**Evidence.** `src/usage/learningLedger.js:171-306` (additive counters), `:237-251` (monotonic star fields),
`:128-136` (flags); absence of any merge function (grep across `src/`).

**Smallest recommended change.** Add one completeness flag, e.g. `portableStateRestored` (carrying the count of
restores and whether a divergence was resolved by discarding a local branch), stored in the ledger and surfaced
by both analyzers alongside the existing caveats. Cheap, and it keeps the analyzer's honesty contract intact.
Additionally, when a divergence is resolved against the local copy, write the losing evidence package to the
outbox as a one-time archive upload rather than dropping it.

**Falsification test.** Unit test: hydrate two divergent synthetic ledgers, resolve one way, and assert what the
export reports. Confirm no existing flag distinguishes the result from a clean single-device session.

---

### F11 — Purge leaves identity and content behind in Drive revisions, Sheets version history, and Apps Script execution logs

- **Severity:** moderate
- **Status:** confirmed (mechanism); plausible-needs-probe (exact retention values)
- **Proposal location:** *Retention And Deletion Recommendation*, items 4 and 6; *Privacy And Operations
  Checklist*.

**Finding.** The proposal promises "no more than the latest three recoverable envelope revisions and no revision
older than seven days," and a purge that deletes "Drive current/archive files, the identity mapping, raw receipt
rows, and file ids." Three copies survive that procedure:

1. **Drive revision history.** Drive retains prior revisions of a file automatically. `DriveApp` has no
   revision-pruning API — enforcing a three-revision / seven-day rule requires the **Advanced Drive Service**
   (`Drive.Revisions`), which the proposal never mentions. As written, the retention control cannot be
   implemented with the API surface the proposal assumes.
2. **Google Sheets version history.** Deleting a row from the Students tab does **not** remove it from the
   spreadsheet's version history — and the Students tab is precisely where the account-to-record-key identity
   mapping lives. The identity mapping the purge is supposed to destroy remains recoverable.
3. **Apps Script execution logs.** The Executions dashboard and Cloud Logging retain per-execution records
   (roughly 30 days). The proposal correctly says to keep payload bodies and PII out of logs, but the execution
   *transcript itself* is a record of activity that no purge step touches.

Two more copies the checklist omits: the **teacher's own downloaded evidence files**, which land outside every
automation the proposal describes, and the **student's local outbox**, which holds evidence packages at rest in a
shared-Chromebook browser partition after the student leaves.

**Why it matters in a classroom.** A teacher who runs "purge cohort" and tells a parent the data is gone would be
saying something that is not true, through no fault of their own.

**Evidence.** Apps Script *Drive Service* reference (no revision management in `DriveApp`); Google Sheets version
history behavior; Apps Script Executions dashboard / Cloud Logging retention; proposal *Retention And Deletion
Recommendation* items 4 and 6, and the *Privacy And Operations Checklist*.

**Smallest recommended change.** Three concrete moves:

1. Keep the identity mapping in a **separate spreadsheet file per cohort**, so purge = trash + permanently delete
   the file, which removes its version history with it. (Script Properties is the alternative and would fit a
   150-student roster inside the 500 KB store, but a separate file is easier to audit.)
2. Either adopt the Advanced Drive Service for revision pruning, or **restate the revision-recovery promise
   honestly** as "Drive's default revision retention applies," and stop claiming a three-revision / seven-day
   ceiling the platform will not enforce.
3. Add to the operations checklist: *teacher-downloaded evidence copies* and *student local outbox contents*,
   with a stated handling rule for each.

**Falsification test.** Synthetic account only. Write five revisions to a Drive JSON via Apps Script, then
enumerate `Drive.Revisions.list` before deletion and confirm what a `DriveApp`-only purge leaves behind.
Separately, delete a row from a test Sheet and check whether the prior value is visible in *File → Version
history*.

---

### F12 — Exact-origin `postMessage` validation is probably not achievable, and the proposal should plan for that rather than measure and hope

- **Severity:** moderate
- **Status:** plausible-needs-probe
- **Proposal location:** *Protocol invariants* ("Both must use an exact `targetOrigin`, never `*`… The production
  GAS HtmlService origin seen by the child must be measured before fixing the allowlist").

**Finding.** The proposal treats the HtmlService origin as an unknown constant to be measured once. Google
documents **nothing** about the `n-<hash>-…script.googleusercontent.com` subdomain scheme or its stability — not
across reloads, not across users, not across deployments. (The "one-time URL at `script.googleusercontent.com`"
language in Google's docs applies to Content Service, not HtmlService; conflating them would be an error.)
Community reports describe the subdomain as effectively opaque and variable.

If it varies, an exact-string allowlist is impossible and the check degrades to a suffix match such as
`/^https:\/\/[a-z0-9-]+\.script\.googleusercontent\.com$/` — which any Apps Script web app in the world
satisfies. In a CS classroom, students who can publish their own Apps Script web app are exactly the population
that could frame the game and complete the handshake.

**Two things materially reduce the blast radius, and the proposal should say so:**

- The GAS server derives identity from *its own* session, so a hostile shell cannot forge writes to another
  student's record. It can only observe what the child sends to *it*.
- **Storage partitioning — the thing that makes migration hard — is simultaneously the main defense.** A child
  loaded under a hostile top-level site gets an *empty* storage partition. It cannot read the real shell's
  workspaces or evidence; it can only observe play that happens inside that hostile session.

**Why it matters in a classroom.** Not catastrophic, but the trust-boundary table asserts the child may trust
"exact child origin," and a design that quietly cannot deliver that should not present it as delivered.

**Evidence.** Apps Script *HTML Service: Restrictions* (documents the sandbox tokens; documents nothing about the
user-content origin); Apps Script *Content Service* (the "one-time URL" language, applicable to a different
service); Chrome *Storage Partitioning*.

**Smallest recommended change.** Do not treat this as a measurement detail. State in the protocol contract that
the real guards are, in order: (1) `event.source` identity against the held window reference, (2) the ephemeral
channel nonce, (3) an origin **suffix** match — and that exact-origin equality is a best-effort tightening, not a
guarantee. Also: deliver the nonce in the iframe URL **fragment**, not the query string, so it is not sent in
`Referer` headers.

**Falsification test.** Deploy a trivial HtmlService page that prints `location.origin` and posts it to a nested
frame. Load it as two different domain users, reload five times each, then redeploy and repeat. If the string is
identical across all twelve loads, exact-origin validation is viable and this finding is wrong.

---

### F13 — The nested-frame sandbox is more favorable than feared, but must be probed once, cheaply, before anything else

- **Severity:** moderate
- **Status:** plausible-needs-probe
- **Proposal location:** *Falsification Probes → Probe 2*.

**Finding.** I expected this to be the architecture's fatal flaw and it probably is not — which is worth
recording precisely, so the probe is neither skipped nor over-feared.

Google's *HTML Service: Restrictions* page documents the IFRAME sandbox token set as including
`allow-same-origin`, `allow-forms`, `allow-scripts`, `allow-popups`, **`allow-downloads`**, **`allow-modals`**,
and `allow-popups-to-escape-sandbox`. Per the HTML Standard, sandbox flags cascade to nested browsing contexts,
so the GitHub Pages child inherits *at most* that set — but that set is sufficient for the app's needs:

- `<a download>` + blob downloads (`src/ui/controls.js:63-64, 519-520`) — covered by `allow-downloads`.
- `window.confirm()` for *Reset Workspace to Starter* and `window.prompt()` for the export name
  (`src/ui/controls.js:480, 491`) — covered by `allow-modals`. Without it these are spec-mandated to return
  `false` and `null` **with no dialog and no error**, which would make the reset button silently do nothing.
- The Help link's `target="_blank"` (`index.html:44`) — covered by `allow-popups`.

Two residual risks: (a) a possible additional Chromium requirement that downloads carry **user activation** even
when `allow-downloads` is present, which matters if any download is triggered from an async callback rather than
directly inside a click handler; (b) whether Google's own wrapper imposes an *undocumented additional* layer
between its document and nested third-party content.

Notably, `allow-storage-access-by-user-activation` is **absent** from the documented set — which independently
**vindicates** the proposal's decision to build a two-window migration rather than trust the Storage Access API.

Not a sandbox question but belonging in the same probe: `speechSynthesis` (voice narration — an accessibility
feature), Blockly keyboard navigation and its `/` help dialog, tutorial-overlay focus traps, and **usable
viewport**. On a 1366×768 managed Chromebook, `script.google.com` chrome plus the shell plus the nested frame all
subtract from a layout in which the Blockly panel and the p5 canvas already compete for space.

**Why it matters in a classroom.** Every one of these failures is silent. A student clicks Reset-to-Starter and
nothing happens; a student clicks Download Backup and nothing happens; a screen-reader student loses voice
narration. None of them throw.

**Evidence.** Apps Script *HTML Service: Restrictions* (token list); WHATWG HTML §4.8.5 (sandbox inheritance) and
the sandboxed-modals-flag definition (`confirm()` → `false`, `prompt()` → `null`, no dialog); Chrome 83
deprecations (sandboxed-iframe download blocking, with console message); `src/ui/controls.js:60-67, 480, 491,
519-520`; `index.html:44`.

**Smallest recommended change.** Promote this to **Probe 0** and make it a single static HTML page. It needs no
roster, no student accounts, no Drive schema, no identity, and no scheduling — one teacher account and thirty
minutes. It should print, from inside the nested child: `location.origin`, the effective sandbox token set,
whether a blob download succeeds from a click handler *and* from a `setTimeout`, whether `confirm()` shows a
dialog, whether `speechSynthesis.speak()` produces audio, whether `localStorage`/`indexedDB` read and write, and
the usable inner viewport at 1366×768. It can kill or reshape the architecture before anyone schedules student
accounts.

**Falsification test.** The probe itself is the test.

---

### F14 — Cosmetic block dragging marks portable state dirty and triggers cloud writes

- **Severity:** minor
- **Status:** confirmed
- **Proposal location:** *Save Frequency And GAS Load Budget* → "Dirty background checkpoint: at most once every
  two minutes per active client, and only if portable state changed."

**Finding.** Stored workspace XML preserves Blockly's `x`/`y` block-position attributes, while the FNV-1a starter
hash deliberately strips them (`src/ai/blockly/starterVersioning.js:41-42`). A student who drags a block two
pixels without changing the program produces different stored XML, sets the dirty flag, and buys a cloud write.
Students rearrange blocks constantly.

**Why it matters in a classroom.** It is pure waste against a quota budget that F3 shows is already tight, and it
inflates the revision counter with changes that carry no learning signal.

**Evidence.** `src/ai/blockly/workspace.js:894-900` (`domToText(workspaceToDom(...))`, positions preserved);
`src/ai/blockly/starterVersioning.js:41-42` (positions stripped for hashing).

**Smallest recommended change.** Compute the dirty flag from the **normalized** hash the repository already has,
not from raw XML equality — reuse `hashStarterXml`'s normalization. Keep the raw XML as the synced payload so
layout still travels; only the *trigger* changes.

**Falsification test.** Drag one block without editing, wait past the checkpoint interval, and assert whether a
checkpoint fires.

---

### F15 — PvP and Free Play in the cloud (owner-decided, with one residual note)

- **Severity:** moderate
- **Status:** owner-decision — resolved 2026-09-01
- **Proposal location:** *PvP And Shared-Computer Contract*; *Canonical Artifact Recommendation → 1*.

**Finding.** The proposal includes both PvP team workspaces in portable state. Free Play already ships
password-encrypted private program files specifically so a hot-seat opponent cannot read a strategy
(`docs/subsystems/file-pipelines.md`, pipeline 2). Cloud restore would move an opponent's *plaintext* program
onto the account-holder's other devices — a quiet inversion of a deliberate design intent, and a hole in the
decentralized-strategy learning model the repository guide asks agents to preserve.

**Owner decision 2026-09-01:** sync the PvCPU Free Play workspace; **exclude both PvP team workspaces** from
cloud storage and restore.

**Residual note (my recommendation differed).** I recommended excluding Free Play as well for the first pilot,
on payload and privacy-surface grounds. The owner's middle ground is defensible — a student's own sandbox program
is genuinely theirs and portable — and the disagreement is recorded only so a later orchestrator knows it was
considered, not overlooked. Two consequences follow from the chosen option and should be written into the schema:
the portable-state contract needs an explicit `freePlayWorkspace` section separate from any PvP section, and the
teacher-facing default rollups must continue to exclude Free Play from grading views as the proposal already
specifies.

**Falsification test.** Not applicable; policy.

---

### F16 — A class-wide star column contradicts the student-facing promise that stars are never grades (owner-decided; disagreement recorded)

- **Severity:** moderate
- **Status:** owner-decision — resolved 2026-09-01
- **Proposal location:** *Drive And Sheet Layout → Teacher index Sheet*, "highest reached/passed and star/mastery
  summary."

**Finding.** `docs/StudentGuide.md` tells students plainly: *"Stars measure iteration and efficiency as optional
challenges, never grades."* A per-student star column in a whole-class spreadsheet is the single most
gradebook-shaped artifact the design produces. The architecture does not cause the problem; the surface does.

**Owner decision 2026-09-01:** keep stars in the class view, unlabeled, treating interpretation as the teacher's
call — consistent with the ratified owner direction on account attribution.

**Disagreement recorded.** I recommended a header label such as *"Optional challenge stars — not a grade."* The
reasoning: the owner direction on attribution deliberately pairs a signal with an explicit statement of what it
does and does not prove (*Export And Submission Behavior* does exactly this for authorship), and stars are the one
signal where the app has already made a promise directly to students. A one-line header costs nothing and keeps
that promise visible to the adult reading the sheet. The owner's decision stands; note only that if students later
report stars being graded, this header is the cheapest available correction.

**Falsification test.** Pilot observation: ask the pilot teacher, after the first grading cycle, whether the star
column influenced any recorded grade.

---

## Strengths Worth Preserving

These are load-bearing and should survive any revision:

1. **Server-derived identity, fail-closed for cloud authority, fail-open for gameplay.** The trust-boundary table
   is the best part of the document. Never accepting a client-supplied email, UUID, record key, or file id as
   authorization is exactly right, and stating it as a table makes it enforceable in review.
2. **Refusing to conflate account attribution with authorship.** The four-line teacher UI distinction
   (*Account received from* / *Client evidence integrity* / *Server received* / *Authorship: not asserted*) is
   pedagogically and ethically correct, and it matches the existing analyzer's careful "possible duplicate" /
   "review recommended" language.
3. **Whole-record compare-and-swap instead of field-level merge.** F10 confirms this is the *only* safe choice
   given additive, non-idempotent ledger counters. A merge-based design would have silently corrupted evidence.
4. **Rejecting the Storage Access API in favor of an explicit two-window migration.** Independently vindicated:
   `allow-storage-access-by-user-activation` is absent from the documented GAS sandbox token set.
5. **Rejecting PropertiesService for student state**, with the correct 9 KB / 500 KB reasoning.
6. **Naming identity as an architecture gate** rather than an implementation detail, and refusing to let a blank
   `getActiveUser()` be silently worked around. The hedging in that section ("'Generally' is not a sufficient
   production guarantee") is precisely calibrated to what Google actually documents.
7. **Cohort-scoped record keys with no cross-year stable identifier.** A genuinely thoughtful privacy default
   that most designs get wrong.
8. **Recognizing that this is a startup refactor**, not a bolt-on. The observation that "a late `localStorage`
   overwrite or direct IndexedDB mutation after `initializeUsageTracking()` would be substantially harder to
   reason about" is correct and matches the code (`main.js:41-45`, `loaders.js:85-89`).
9. **Writing Drive before the Sheet index**, with the stated reasoning. Correct ordering — though F3 recommends
   removing the Sheet from the hot path entirely, which makes the question moot.

---

## Owner Decisions Made During This Review (2026-09-01)

| # | Question | Decision |
| --- | --- | --- |
| 1 | Pilot scope | **Stage it:** submission relay first; cross-device restore ratified separately as stage 2. |
| 2 | Canonical artifacts | **Two Drive files** (portable state, evidence), separate revisions. |
| 3 | Shared computers | **Explicit account gate** before cloud mode starts, once per page load. |
| 4 | Evidence archive trigger | **Scheduled cadence + explicit submit.** Drop reliance on session rollover. |
| 5 | Conflict UX | **Never block play.** Block cloud writes only; non-blocking banner with Compare. |
| 6 | PvP / Free Play | **Sync PvCPU Free Play; exclude both PvP team workspaces.** |
| 7 | Star column | **Keep stars in the class view, unlabeled.** (Reviewer recommended a label; see F16.) |
| 8 | Analyzer identity | **Encode attribution in the download filename**; no payload or hash change. |

Decision 1 is the largest and reshapes everything below.

---

## Missing Owner Decisions

Still open, in rough order of how much they block:

1. **District Chrome policy: is `BlockThirdPartyCookies` set on student Chromebooks?** One email to IT. If yes,
   the embedded frame may have no storage at all, and the entire framing architecture needs rethinking before any
   probe is worth running. This is the cheapest decisive question available and it is not in the proposal.
2. **Does the district permit teacher-deployed, domain-restricted Apps Script web apps?** Many tenants restrict
   Apps Script publishing to admins. Probe 1 would discover this the hard way; asking discovers it for free.
3. **District retention/records-schedule override** for the proposed 90-day post-cohort evidence window (the
   proposal raises this; it remains unanswered).
4. **Does the district's data-privacy agreement cover student learning records stored in a teacher's Drive?**
   Teacher-owned storage is operationally right and may be contractually awkward. This is a question for the
   district, not a legal conclusion for this review to draw.
5. **GAS source location** — the proposal recommends `integrations/google-apps-script/` in this repository. I
   agree, with one addition: the postMessage protocol constants and payload schema must live in **one** file that
   both the Vite app and the GAS source consume, with a unit test asserting they match. Two hand-maintained
   copies will drift within one packet.
6. **Tutorial/callout portability** (proposal question 3) — unresolved and safe to defer to student testing.
7. **Manual overwrite authority** (proposal question 6) — the owner's conflict-UX answer changes the framing of
   this question, and it should be re-asked in the new shape.

---

## Recommended Revisions To The Proposal

Bounded edits, not a rewrite. In priority order:

1. **Restructure around the two-stage decision.** Split the document into *Stage 1: classroom submission relay*
   and *Stage 2: cross-device continuity*. Stage 1 needs identity, cohort validation, one Drive evidence file per
   student, archive cadence, teacher extraction, retention/purge, and the account gate. Stage 1 does **not** need
   the boot barrier, the conflict matrix, leases, the duplicate-tab guard, portable state, the migration bridge,
   or the tracker hydration API. This removes F1, F5, F8, F9, F10, and F14 from the first deployment entirely,
   and roughly halves F3's payload.
2. **Replace the single-envelope section with the two-artifact contract**, and state the ledger precedence rule
   explicitly (F5).
3. **Add the shared-computer account-carryover hazard** as a first-class section with the account gate as its
   mitigation (F2). Today the proposal's shared-computer section is about PvP; the real hazard is sequential.
4. **Rewrite the save-cadence section around back-pressure**: the 30-execution ceiling, jitter on guided
   checkpoints, Sheet out of the hot path, and "queued" as a first-class student-facing state (F3).
5. **Fix the archive trigger list** — scheduled + explicit submit; demote rollover to a defensive extra, citing
   the 7-day / 400-event / D1-8-level constants so the next reader understands why (F4).
6. **Add the starter-version hazard and its mitigation** to the portable-state section, and stop implying
   `appVersion` can gate compatibility (F1).
7. **Add a client-hardening prerequisite**: storage try/catch and a guided-level in-memory fallback, landing
   before any embedding work (F7).
8. **Downgrade "exact origin" to "source identity + nonce + origin suffix"** in the protocol invariants, move the
   nonce to the URL fragment, and note storage partitioning as the compensating defense (F12).
9. **Correct the retention section**: name the Advanced Drive Service or drop the three-revision promise; move
   the identity map to a separate per-cohort spreadsheet file; add teacher-downloaded copies and the student
   outbox to the operations checklist (F11).
10. **Add name-stripping to the evidence-builder requirements** — all three locations, with a test (F6).
11. **Add a `portableStateRestored` completeness flag** to the analyzer honesty contract (F10).
12. **Replace the "download a backup" student-facing string** with wording that does not assume downloads work,
    until Probe 0 confirms they do (F13).

---

## Recommended Changes To The Probe Sequence

The proposal's probes are good. Three changes:

1. **Insert Probe 0 (nested-frame capability), and run it first.** One static HTML page, one teacher account,
   thirty minutes, no roster and no scheduling. Measures: child `location.origin` (across reloads, users, and a
   redeploy — this doubles as the F12 test), effective sandbox tokens, blob download from a click handler *and*
   from an async callback, `confirm()`, `speechSynthesis`, `localStorage`/`indexedDB` read+write, Blockly keyboard
   navigation and the `/` help dialog, and usable inner viewport at 1366×768. Highest information-per-minute in
   the whole slate, and it can reshape the architecture before anyone schedules student accounts (F13).
2. **Ask the two district-policy questions before Probe 1** (third-party cookie policy; Apps Script publishing
   permission). Either answer can invalidate probe work that costs real scheduling.
3. **Strengthen Probe 4** with 35 concurrent clients rather than 30; instrumentation of *simultaneous execution
   count*, not only latency; and an A/B arm with the Sheet write removed from the critical section (F3).

Under the staged decision, **Probe 5 (conflict/offline) and the migration half of Probe 3 move to Stage 2** and
should not gate the first packet slate.

One test-harness recommendation the proposal gestures at but should require: build a **fake parent harness** — a
local page that speaks the postMessage protocol plus an in-memory fake server — so the boot barrier, outbox,
idempotency, and conflict matrix are covered in ordinary Playwright CI without GAS. Everything else GAS-specific
is manual, so this is the only way most of Stage 2 gets automated coverage at all.

---

## Simpler Rival Designs

| Rival | What would make it preferable |
| --- | --- |
| **GAS submission relay only, no restore** | **Now the owner's chosen Stage 1.** It was already preferable on the evidence: the proposal's opening pain is *submission* friction, and this solves it completely while removing F1, F5, F8, F9, F10, F14 and halving F3. Cross-device resume is a genuine but separate want, and staging it costs almost nothing because the identity, cohort, Drive, retention, and teacher-extraction work is shared. |
| **Sheet-only bounded summaries** | Preferable if the teacher's real need is progress monitoring rather than forensic review. Cheap test: ask the pilot teacher which `admin.html` views they actually opened last term. If the answer is "the class table and highest-passed," the Drive layer is over-built for the need. |
| **Drive-only per-student files, no Sheet index** | Preferable if Probe 4 shows Sheet writes dominate lock time. F3's recommendation is a near-variant: keep the Sheet, but rebuild it asynchronously so it is never in the write path. |
| **Separate portable-state and evidence files** | **Chosen.** Preferable on hot-path bytes, revision semantics, and retention separability (F5). |
| **One combined envelope** | Would be preferable if evidence turned out to change on nearly every checkpoint anyway (making the byte argument moot) *and* the team wanted the simplest possible server. Measurable; see F5's falsification test. |
| **GAS hosting a copied build instead of framing GitHub Pages** | Fixes storage partitioning and eliminates the migration bridge, the cross-origin protocol, and origin allowlisting. Costs: the classroom build diverges from the public build, the static-deployment invariant in `AGENTS.md` breaks, and serving a Vite bundle with Blockly and p5 through HtmlService is genuinely painful. It does *not* escape the sandbox — HtmlService is always sandboxed. Preferable only if Probe 0/3 shows embedded third-party storage is blocked or unreliable under district policy — at which point the honest conclusion is more likely "do not use GAS as a shell at all" than "host a copy." |
| **Remain entirely local/manual** | Preferable if Probe 1 returns blank identity, if the district blocks teacher Apps Script deployment, or if first-run login/authorization/migration costs more class minutes than the download workflow it replaces. Worth measuring before committing: how many minutes per period does the current download/submit workflow actually consume? Nobody has written that number down, and the entire project is justified against it. |

---

## Verdict

**Ready after bounded proposal revisions.**

Not "another architecture round": the proposal's core judgments — server-derived identity, fail-closed cloud
authority with fail-open gameplay, whole-record compare-and-swap, refusing authorship claims, refusing the
Storage Access API, refusing PropertiesService, treating identity as a gate — are correct and well-evidenced, and
several are conclusions a weaker document would have gotten wrong. Not "replace with a simpler design" either:
the owner's staging decision *is* the simpler design, and it is reachable from this document by restructuring
rather than restarting.

The revisions that must land before packet ratification are items 1–7 in *Recommended Revisions*. Items 8–12 can
land alongside the schema packet. Probe 0 and the two district-policy questions should happen before any packet
is written, because either could change the answer.

One caution for the next orchestrator. Two findings are latent defects that exist in the code *today* and are
merely made reachable, or made catastrophic, by embedding: the unguarded storage access (F7) and the destructive
getter in `getStoredWorkspaceXmlText` (F1). Both deserve small independent client-hardening packets regardless of
whether the GAS integration ever ships. Sequencing them first de-risks the integration and improves the current
product at the same time, which is the cheapest kind of progress available here.

---

## Change Log

- **2026-09-01:** Initial review by claude (Opus 5). Reviewed the proposal at commit `29f3d31`; repository HEAD
  `9f03f85`. Sixteen findings; eight owner decisions taken during review; verdict *ready after bounded proposal
  revisions*. Reviewer disagreement recorded and preserved on two owner decisions (F15 Free Play scope, F16 star
  column labeling).
