# Google Apps Script Cloud Integration Proposal

**Document status:** Discussion draft for owner and orchestrator review  
**Date:** 2026-09-01  
**Repository baseline:** `a321be9d4ed7aab50ab292d6611a02d087ef65ac`  
**Scope:** Architecture and sequencing proposal only; not an implementation packet or authorization to deploy  
**Intended reviewers:** Browser Battlegorithms integration owner and orchestrator-class models

## Executive Recommendation

Browser Battlegorithms can support a practical Google Workspace classroom mode without adding
Firestore, a custom GCP service, or a server dependency to the public Vite application. The
recommended shape is:

1. Keep the existing GitHub Pages deployment as the static game client.
2. Put a domain-restricted Google Apps Script (GAS) HtmlService web app around it as the
   authenticated parent shell.
3. Let the parent and child communicate through a versioned, origin-checked `postMessage`
   protocol. Only the parent calls `google.script.run`.
4. Derive the active Google Workspace account on the GAS server for every read and write. Never
   accept a student email, stable student UUID, record key, or Drive file id supplied by the
   Browser Battlegorithms client as authorization.
5. Continue saving immediately to browser storage. Treat GAS as an asynchronous, optional
   classroom synchronization adapter with a durable local outbox and an explicit offline state.
6. Store one coalesced **current cloud envelope** per account and cohort in a private Drive JSON
   file. The envelope contains two semantically distinct sections:
   - portable state used to resume play; and
   - the latest sanitized schema-v2 usage evidence used for teacher review.
7. Store only an index and derived teacher-readable summary in Google Sheets. Do not put the full
   JSON payload in a Sheet cell and do not maintain one shared class JSON file.
8. Use server revisions and compare-and-swap writes. Do not resolve conflicts from timestamps
   alone and do not silently overwrite divergent student work.
9. Support PvP and shared computers by attributing the origin session to the signed-in account
   while labeling the other hot-seat participant as unauthenticated/self-reported. PvP evidence is
   retained for product insight but is excluded from grading-oriented defaults.

This design preserves the public app's static deployment, improves classroom continuity, gives
the teacher a whole-class review surface, and limits cloud writes to meaningful checkpoints rather
than Blockly edits or individual usage events.

## Why This Proposal Exists

The current classroom workflow asks students to download a usage JSON file and later submit it to
the teacher. That workflow is privacy-conscious and offline-capable, but it creates avoidable
friction across several days of work and makes cross-device continuation difficult.

The owner wants an optional school-hosted entry point with these properties:

- students enter through their school Google Workspace accounts;
- the game remains the separately hosted Browser Battlegorithms static application;
- the GAS page is a thin parent shell around an iframe;
- workspaces, guided progress, and useful usage evidence can follow a student across devices;
- meaningful checkpoints are saved without manual download/upload cycles;
- the teacher can inspect a whole class without Google Classroom integration; and
- the design does not add Firestore or another new cloud platform.

The proposal deliberately separates convenience/account attribution from authorship claims. The
GAS server can establish which signed-in account made a request. It cannot prove that the person
behind that account personally authored every Blockly change, because the game remains a static,
modifiable browser client.

## Confirmed Owner Direction

The following points are owner decisions as of 2026-09-01 and should not be reopened silently by
implementation planning:

1. **Teacher-visible account attribution:** The teacher should see the authenticated Workspace
   account associated with a cloud record and decide how much evidentiary weight to give it.
2. **Schema-v2 migration floor:** Clients with usage schema v2 should be able to build and send a
   cloud package. Supporting legacy usage-v1 clients after integration is not required.
3. **PvP and shared computers remain supported:** The signed-in account owns the origin session.
   The system does not pretend to authenticate the other hot-seat student. PvP evidence may be
   useful for product improvement even when it is not grading evidence.
4. **One active device expectation:** Simultaneous editing across multiple tabs or devices does
   not need collaborative merge semantics. It does require detection, revision guards, and a
   clear student choice when local and cloud copies diverge.
5. **No Classroom integration and no additional cloud platform:** The teacher needs a convenient
   cohort view, not assignment posting or Classroom API behavior.

## Current Repository Truth

The integration is not a wrapper around one existing save object. Browser Battlegorithms currently
has several persistence contracts:

- `src/ai/blockly/workspace.js` stores ordinary guided workspaces per level, shared project
  workspaces per stable project id, one PvCPU Free Play workspace, and separate PvP team workspaces
  in `localStorage`.
- `src/core/levels.js` stores passed guided levels in `bba:guided-level-progress` and treats that
  progression ledger as the writer of record for unlock state.
- `src/usage/usageTracker.js` persists a schema-v2 usage session and durable learning ledger in
  IndexedDB. The tracker intentionally survives reloads and degrades to memory when IndexedDB is
  unavailable.
- `src/usage/usageFormat.js` produces the sanitized schema-v2 teacher export: durable ledger,
  pass/fail boundary XMLs, run-version hashes, completeness flags, sanitized events, and sanitized
  snapshots.
- `src/ui/controls.js` currently couples usage export to a student-name prompt and a local Blob
  download.
- UI preferences, tutorial/callout history, layout choices, and accessibility settings occupy
  additional localStorage keys but are not all learning records.

Authoritative subsystem references:

- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/usage-and-admin.md`
- `docs/subsystems/file-pipelines.md`
- `docs/subsystems/ui-mode-contract.md`

Important current constraints:

- The public application remains static and browser-first.
- The usage export is evidence, not currently an import/restore format.
- Full run-version XML is intentionally local-only; schema-v2 exports expose bounded boundary XML
  and hashes instead.
- The SHA-256 export hash detects accidental or casual modification. It is not a signature and
  does not establish identity.
- Raw student data and identity mappings must never enter tracked repository paths.

On 2026-09-01, a live HEAD request to the deployed GitHub Pages URL returned HTTP 200 with neither
`X-Frame-Options` nor a CSP `frame-ancestors` restriction. The site is therefore embeddable at the
time of this proposal. This is an observed deployment property, not a permanent GitHub Pages
guarantee, and should become a release probe.

## Terms And Artifact Roles

### Account identity

The Workspace account derived by the GAS server. It is the storage namespace and teacher-visible
account attribution. It is not provided by the child iframe and is not proof of authorship.

### Cohort context

A teacher-controlled course/section/time-bound context. The server, not an arbitrary client query
parameter, validates that an account belongs to a cohort. A manually maintained private roster
Sheet is adequate; Google Classroom is not required.

### Client instance

A random identifier for one browser storage partition/device installation. It is used for conflict
and lease diagnostics, not for human identity. A separate tab id distinguishes concurrent tabs.

### Portable state

The minimum state needed to resume meaningful work on another device. It is not a raw browser
storage dump.

### Usage evidence

A sanitized schema-v2 evidence payload derived from the current usage tracker, preserved with all
existing v2 completeness and integrity caveats.

### Current cloud envelope

The latest server-revisioned Drive JSON file for one account and cohort. It co-locates portable
state and the latest evidence to permit one coalesced Drive update, but it does not confuse their
semantics.

### Evidence archive

An immutable or write-once copy created only when a usage session rolls over, the student performs
an explicit submission, or the teacher closes the cohort. Ordinary background saves do not create
new Drive files.

## Trust Boundaries

| Component | May trust | Must not claim or trust |
| --- | --- | --- |
| Browser Battlegorithms child | Its in-memory/local state and acknowledged server revision | Google identity, teacher authority, other students' records |
| GAS HtmlService parent | The configured child window, exact child origin, protocol shape | That a well-shaped client payload proves authorship |
| GAS server | Workspace session identity when available, server receipt time, server revision | Student-supplied email, UUID, record key, cohort, file id, timestamp, or digest as authorization |
| Drive/Sheets | Teacher-controlled storage permissions | Immutability or authorship merely because data is stored there |
| Teacher analyzer | Existing v2 fields, completeness flags, client hash, server receipt metadata | That a verified client hash or account receipt proves independent work |

No OAuth token, teacher credential, spreadsheet id, Drive folder id, roster, or other student's
data should ever be sent to the child iframe.

## Identity And Deployment Model

### Preferred deployment

- Deploy the GAS web app for the school Workspace domain only.
- Prefer execution as the deploying teacher so the backing Sheet and Drive folder stay private and
  teacher-owned.
- On every RPC, call `Session.getActiveUser().getEmail()` and verify a nonblank, expected-domain
  account.
- Fail closed when identity is blank, outside the domain, absent from an allowed cohort, or
  otherwise ambiguous. Local play may continue, but cloud reads/writes must not.
- Use a server-held HMAC secret from Script Properties to derive an opaque, cohort-scoped file key.
  Do not put the email in Drive filenames.
- Keep the email/account-to-record mapping only in a teacher-private index Sheet.

Google documents that active-user email is unavailable in some execute-as-deployer contexts, while
same-domain Workspace cases generally avoid that restriction. "Generally" is not a sufficient
production guarantee. A tenant probe with real teacher and student accounts is an architecture
gate. If identity is blank, the fallback choices—execute as the accessing user, changed resource
permissions, or owner-mediated enrollment—must return to the owner rather than silently weakening
identity.

`Session.getTemporaryActiveUserKey()` is not the semester identity fallback because Google rotates
it every 30 days.

### Cohort selection

Recommended initial shape:

- The teacher maintains a private roster/index Sheet with account and cohort membership.
- The parent shell may offer a cohort selector when an account belongs to more than one active
  cohort.
- The server validates every selection against the roster.
- A URL may carry a nonsecret requested cohort slug for convenience, but the server must ignore it
  unless roster validation succeeds.
- Record keys and HMAC inputs include the cohort id so the cloud system does not create an
  indefinite cross-course student identifier.

## Parent/Child Architecture

### GAS parent responsibilities

- Render the minimal shell and cloud-status region.
- Resolve account/cohort status through `google.script.run`.
- Hold the exact Browser Battlegorithms iframe window reference.
- Translate versioned `postMessage` requests into asynchronous RPC calls.
- Serialize/correlate calls and return success or failure acknowledgements.
- Display signed-in account information outside the child iframe when useful.
- Never expose backend credentials or other student data to the child.

### Browser Battlegorithms child responsibilities

- Detect the supported integration mode, for example `integration=gas-v1`.
- Pause application hydration behind a bounded cloud-bootstrap barrier.
- Establish a strict parent handshake.
- Read local portable state and local sync metadata.
- Compare local and cloud revisions before the normal level/tracker/editor initialization finishes.
- Preserve current immediate local persistence.
- Maintain a durable local outbox for unsent checkpoints.
- Surface `saved locally`, `syncing`, `synced`, `offline/pending`, and `conflict` states.
- Keep a local download/backup path even in cloud mode.

### Protocol invariants

Every parent/child message should include:

- protocol name and version;
- message type;
- correlation/request id;
- ephemeral per-page channel nonce;
- client instance id and tab id where relevant;
- payload schema version;
- bounded payload; and
- success, retryable failure, nonretryable failure, or conflict result.

Both frames must verify `event.origin` and `event.source`. Both must use an exact `targetOrigin`,
never `*`. The production GAS HtmlService origin seen by the child must be measured before fixing
the allowlist; Google serves HtmlService inside its own iframe sandbox and the effective origin may
not be obvious from the public `/exec` URL.

Suggested message families:

- `BBA_READY`
- `BBA_BOOTSTRAP_REQUEST` / `BBA_BOOTSTRAP_RESULT`
- `BBA_SAVE_REQUEST` / `BBA_SAVE_RESULT`
- `BBA_EVIDENCE_SUBMIT_REQUEST` / `BBA_EVIDENCE_SUBMIT_RESULT`
- `BBA_LEASE_CONFLICT`
- `BBA_ERROR`

The GAS parent should allow only one state-changing RPC at a time per page. Calls made while one is
in flight are coalesced into one trailing save containing the newest state.

## Boot And Restore Sequence

Cloud restore should not happen after the game has already hydrated and begun recording events.
The new integration needs an explicit boot coordinator:

1. GAS shell loads and asks the server for account/cohort/bootstrap metadata.
2. Shell creates or activates the Browser Battlegorithms iframe.
3. Child loads the lightweight integration bootstrap, creates its instance/tab identifiers, and
   announces `BBA_READY`.
4. Parent and child validate origins/window references and complete the channel handshake.
5. Child reads local sync metadata, portable state, and schema-v2 tracker availability without yet
   starting the normal game/editor lifecycle.
6. Parent supplies the cloud envelope metadata and payload for the server-derived account/cohort.
7. Child applies the conflict matrix below.
8. Any accepted cloud state is validated and written through explicit adapters before normal level,
   tracker, and Blockly hydration.
9. The normal application starts. It records whether the origin was local-only, cloud-restored, or
   conflict-resolved without treating that label as learning evidence.
10. A bounded timeout permits local-only startup when GAS is unavailable. The outbox retries later.

This is a meaningful startup refactor. A late `localStorage` overwrite or direct IndexedDB mutation
after `initializeUsageTracking()` would be substantially harder to reason about and test.

## Canonical Artifact Recommendation

There should not be one artifact pretending to serve all meanings. There should be two canonical
sections with different roles, co-located in one current envelope to reduce writes.

### 1. Portable state is canonical for cross-device resume

Proposed contents:

- ordinary guided workspace XML by level id;
- guided starter-version metadata needed to preserve stale-starter replacement;
- shared project workspace XML by stable project id;
- Free Play PvCPU workspace XML;
- PvP team 1 and team 2 workspace XML;
- guided passed-level ledger;
- durable guided learning/star ledger fields required by the current UI;
- current mode/level as a convenience pointer, not proof of completion;
- source app/schema versions;
- last acknowledged server revision; and
- completeness/migration flags.

Do not sync by default:

- full run-version XML history;
- raw unbounded workspace churn;
- developer keys;
- browser-specific layout dimensions;
- voice choice, motion preference, or other device/accessibility preferences unless a later owner
  decision explicitly makes them portable;
- teacher roster data or email identity.

Tutorial/callout-seen state is an owner-review detail. Syncing it improves continuity; keeping it
local lets a new device replay orientation. The first implementation packet should not decide this
silently.

### 2. Latest schema-v2 evidence is canonical for teacher review at that revision

- Build it through a reusable evidence-builder API separated from the current name prompt and Blob
  download.
- Preserve the existing v2 sanitization, boundary XML cap, hashes, flags, session id, and app version.
- Do not insert a client-supplied email into the payload.
- Store server account attribution and server receipt metadata in an outer server envelope.
- Preserve the client integrity hash and optionally add a server receipt digest. Neither is an
  authorship signature.
- Replace the latest evidence snapshot for the same active usage session rather than appending a
  complete new file at every checkpoint.
- Archive a session once on rollover, explicit final submission, or cohort close.

### One Drive update per coalesced checkpoint

The current envelope can contain both sections:

```json
{
  "cloudSchemaVersion": 1,
  "recordRevision": 18,
  "serverUpdatedAt": "server timestamp",
  "cohortRecordKey": "opaque value",
  "appVersion": "0.1.0",
  "lease": {
    "generation": 4,
    "clientInstanceId": "opaque random value",
    "expiresAt": "server timestamp"
  },
  "portableState": {
    "schemaVersion": 1,
    "workspaces": {},
    "guidedProgress": {},
    "learningState": {},
    "currentContext": {},
    "flags": {}
  },
  "latestEvidence": {
    "usageSchemaVersion": 2,
    "sessionId": "client session id",
    "clientPayload": {},
    "clientIntegrity": {},
    "serverReceipt": {}
  }
}
```

The actual contract should use explicit allowlisted fields, size limits, and canonical serialization.
The example shows role separation, not final field names.

### Local versus cloud authority

- While a student is actively working, local browser persistence remains the immediate operational
  source so gameplay never waits on GAS.
- The latest acknowledged cloud revision is the cross-device transfer checkpoint.
- An unsynced local change is not discarded merely because the cloud has a later timestamp.
- Teacher review uses the latest acknowledged evidence revision and its server receipt metadata.
- A local JSON download remains the emergency recovery artifact.

## Save Frequency And GAS Load Budget

The integration should never send one RPC per Blockly event, usage event, turn, or workspace
snapshot. Recommended initial budget:

- **Session load:** one bootstrap RPC, with a second only if the user selects a different validated
  cohort or resolves a conflict.
- **Immediate local save:** unchanged from current behavior.
- **Dirty background checkpoint:** at most once every two minutes per active client, and only if
  portable state changed.
- **Guided checkpoint:** request a coalesced save after level completion/transition. If a save is
  already in flight or occurred very recently, fold it into the pending/trailing save.
- **Free Play checkpoint:** at most once every five minutes while dirty, plus mode/team-tab exit.
- **PvP evidence:** update on the slower Free Play cadence and on session exit/explicit submit; do
  not upload turn-by-turn telemetry.
- **Evidence rebuild:** level completion, explicit `Save/Submit progress`, usage-session rollover,
  and cohort close. A state-only checkpoint may reuse the prior evidence section.
- **Unload:** write only to the local outbox. Do not assume an RPC started during `pagehide` or
  `beforeunload` will finish.
- **One in flight:** coalesce all changes that arrive during an RPC into one trailing request.

These intervals are recommended starting values, not ratified performance promises. A load probe
must test a realistic class arriving at level boundaries together. Thirty students producing one
coalesced checkpoint each is a normal target scenario; thirty students producing writes every few
seconds is a design failure.

The server path for an ordinary checkpoint should perform one authenticated execution that:

1. validates identity, cohort, schema, size, lease, and base revision;
2. updates the existing per-student Drive file content rather than creating a new file;
3. updates that student's Sheet summary row;
4. records minimal receipt/health metadata; and
5. returns the new revision and server timestamp.

Apps Script does not provide a database transaction spanning Drive and Sheets. Use a short
`LockService.getScriptLock()` critical section for the revision check and coordinated Drive/index
write, then prove under load that this global serialization is tolerable. Write the revisioned
Drive envelope before advancing the Sheet index row; if the Sheet update then fails, the next
read/reconciliation can recover the row from the envelope. Advancing the Sheet first would risk
pointing the class index at state that was never durably written. The server should detect and
repair mismatched envelope/index revisions rather than treating either copy as silently correct.

Do not assume `getUserLock()` produces one independent lock per active student when the web app
runs as the deployer; that behavior must be verified before it is used to avoid the script-wide
lock. Lock wait time, critical-section duration, partial Drive/Sheet failures, and reconciliation
belong in the class-load falsification probe.

Do not use PropertiesService for student state. Google currently limits one property value to 9 KB
and a property store to 500 KB. Script Properties remain appropriate for private configuration such
as folder ids, spreadsheet ids, HMAC material, and retention settings.

## Drive And Sheet Layout

### Private Drive folder

Suggested conceptual layout:

```text
Browser-Battlegorithms-Cloud/
  <opaque-cohort-key>/
    current/
      <opaque-account-record-key>.json
    evidence-archive/
      <opaque-account-record-key>/
        <session-id-or-server-receipt-id>.json
```

- Files and folders remain private to the teacher/deployer or an explicitly approved teacher group.
- Students never receive file ids or direct Drive permissions.
- File names contain no email, name, student number, or class period.
- A current file is overwritten only after revision validation.
- Archives are created only at bounded lifecycle events.

### Teacher index Sheet

Recommended tabs:

**Students**

- teacher-visible Workspace account;
- optional roster display name;
- cohort;
- opaque record key;
- current revision;
- last server receipt time;
- current app/cloud schema version;
- last mode;
- highest reached/passed and star/mastery summary;
- active usage session id;
- sync completeness/conflict/error flags;
- current Drive file id/link for teacher use; and
- retention dates.

**Receipts**

- bounded rows for explicit submissions, session archives, conflict takeovers, and purges;
- server receipt time, account/cohort key, revision, session id, payload digest, and outcome;
- no raw JSON, boundary XML, or event arrays.

**Cohorts / Configuration**

- active/closed status;
- start/end/grace/purge dates;
- roster membership or pointer to a private roster tab;
- teacher-controlled labels;
- never exposed wholesale to the child.

The Sheet is the convenient whole-class operational surface. It is not the full evidence database.
A later teacher-only GAS view may read this Sheet and offer batch download of current/archive v2
payloads for the existing local analyzer.

## Revision, Lease, And Conflict Model

### Compare-and-swap revision

Every save supplies `baseRevision`. The server accepts it only when it equals the current record
revision. On success, the server writes the envelope and returns `baseRevision + 1`. On mismatch,
the server returns conflict metadata without overwriting either copy.

Client clocks are advisory only. Display local/cloud timestamps to help the student understand the
choice, but never use them as the sole winner rule.

### Same-browser duplicate-tab guard

- Use `BroadcastChannel` or an equivalent same-partition coordination mechanism to announce an
  active tab.
- A second tab starts in a blocked/read-only conflict screen rather than editing immediately.
- Give the student a deliberate `Take over in this tab` action.
- This guard is convenience, not security, and must be tested inside the GAS storage partition.

### Cross-device soft lease

- On bootstrap, the server issues a lease generation to the active client instance.
- The lease has a short server-time expiry and is renewed during existing save RPCs; it should not
  require separate frequent heartbeat calls.
- A second device sees an active lease and asks whether to take over.
- Taking over increments the lease generation. A stale device's next write is rejected even if its
  base revision has not otherwise changed.
- Lease expiry must not discard local work. Revision comparison still governs every write.

The exact expiry should be chosen after latency testing. Ten to fifteen minutes is a reasonable
probe value, not a settled contract.

### Conflict decision matrix

| Local state | Cloud state | Default behavior |
| --- | --- | --- |
| None | Exists | Restore validated cloud state |
| Exists | None | Start locally; upload as revision 1 after consent/status confirmation |
| Same acknowledged revision and same digest | Same | Continue normally |
| Local dirty, cloud still at local base revision | Older than local changes | Save local through compare-and-swap |
| Local clean, cloud revision advanced | Newer cloud | Restore cloud |
| Local dirty and cloud revision advanced | Diverged | Block normal startup and show conflict choices |
| Schema/app incompatibility | Any | Preserve both; do not auto-restore or overwrite |

Conflict UI should offer:

1. **Use school-cloud copy** — preserve the displaced local package as a recoverable local backup.
2. **Use this device's copy** — explicit confirmation, server takeover, and new revision.
3. **Download both / ask teacher** — safest fallback for ambiguity.

No option silently deletes the losing copy.

## Schema-v2 Migration

### What can migrate

The integration-capable Browser Battlegorithms build should expose a reusable package builder that:

- reads the current portable workspace/progression state;
- reads the active schema-v2 usage state through an explicit tracker API;
- produces the sanitized v2 evidence shape using the current export contract;
- attaches app/cloud schema versions and completeness flags;
- excludes server identity; and
- writes the package to the local outbox before transmission.

Legacy usage-v1 support is not required. If the client has v1 only, cloud migration may start from
workspace/progression state or begin fresh, with an honest migration flag.

### Storage partition complication

Chrome partitions localStorage and IndexedDB used by a cross-site iframe according to the top-level
site. An existing student's data from opening GitHub Pages directly may therefore be invisible to
the same GitHub Pages origin when it is embedded under GAS.

Recommended one-time migration path:

1. Student opens the new integration-capable build directly at the existing GitHub Pages origin,
   where its existing v2/local state is available.
2. Student activates `Transfer to school cloud` through a user gesture.
3. The direct app opens the domain-restricted GAS shell in a new window/tab.
4. The two windows perform the same strict-origin, nonce-bound `postMessage` handshake.
5. The direct app sends the bounded migration package to the GAS shell.
6. The shell calls the server, which derives the active account and stores revision 1 or returns a
   conflict.
7. The student then enters the normal GAS-hosted mode, which restores from cloud into the embedded
   storage partition.

This avoids assuming that the Storage Access API will expose unpartitioned state on managed
Chromebooks. A manual download/upload remains the fallback if popup, origin, or district browser
policy blocks the transfer window.

### Historical v2 sessions

The owner direction establishes v2 as the migration floor but does not yet say whether migration
must upload every retained historical v2 session or only the active session plus durable ledger.
Recommendation: migrate the active v2 session, portable state, and durable learning ledger first.
Earlier retained sessions can substantially increase package size and do not improve resume
behavior. If historical evidence is needed, add it as an explicit, size-capped optional archive
step after measuring real v2 payloads.

## Export And Submission Behavior

The current usage export button should become context-aware without removing student recovery:

### Ordinary/direct mode

- Keep the current local name prompt and JSON download behavior.

### GAS classroom mode

- Primary action: `Save/submit progress to school account`.
- Build the current sanitized v2 evidence without asking the student to type an identity.
- Send it inside the next coalesced cloud envelope update.
- Show success only after a server acknowledgement with revision/receipt id.
- Preserve a secondary `Download backup` action.
- Display account attribution in the GAS shell and teacher surface; do not make the child payload's
  self-reported name field the authoritative label.

The teacher UI should distinguish:

- **Account received from:** authenticated Workspace account;
- **Client evidence integrity:** verified/tampered under the existing hash contract;
- **Server received:** server timestamp and revision; and
- **Authorship:** not asserted.

## PvP And Shared-Computer Contract

PvP remains available in GAS mode with these semantics:

- The signed-in Workspace account owns the cloud record and origin session.
- Both PvP team workspaces are included in portable state.
- Usage evidence records the mode and may include bounded PvP experience signals already supported
  by the tracker.
- The second hot-seat participant is `unattributed` by default.
- Optional team/student labels are self-reported display metadata only. They do not create an
  account record, grant progress, or alter authorization.
- Teacher summaries exclude PvP from grading-oriented default rollups unless the teacher explicitly
  chooses otherwise.
- Product-analysis exports may use PvP data only under the existing local/cohort privacy rules and
  without treating the second player as identified.

The first release does not attempt to credit one PvP session to two authenticated accounts. Doing
so would require an explicit second-account join flow and is a separate architecture decision.

## Retention And Deletion Recommendation

Retention should be cohort-scoped and date-driven rather than indefinite.

### Recommended default lifecycle

1. **Active cohort:** Keep the current envelope, bounded evidence archives, index row, and receipt
   metadata while the course/cohort is active.
2. **Portable-state grace:** Keep portable state for **30 days after the cohort end date** so late
   work, device recovery, and teacher/student mistakes can be resolved. Then remove the portable
   state section and any transient conflict/outbox copies from Drive.
3. **Teacher-evidence grace:** Keep sanitized v2 evidence and account attribution for **90 days
   after the cohort end date**, or through the district's applicable grading/appeal window if that
   requires a different period. The district rule overrides this proposal.
4. **Revision recovery:** Keep no more than the latest three recoverable envelope revisions and no
   revision older than seven days. This is corruption recovery, not longitudinal surveillance.
5. **Receipts/errors:** Keep minimal sync error and conflict-takeover metadata for 30 days; explicit
   submission/archive receipts may follow the 90-day evidence window.
6. **Purge:** At evidence expiry, delete Drive current/archive files, the identity mapping, raw
   receipt rows, and file ids for that account/cohort. Keep only a minimal cohort-level purge log
   long enough to verify completion, then delete it under the same operator procedure.
7. **Rollover:** A new course/cohort creates a new cohort-scoped record key. Do not carry a stable
   cloud identifier across school years merely because the Workspace email is unchanged.
8. **Deidentified product insight:** Retain anything beyond the evidence window only through the
   repository's separately approved deidentification/cohort-analysis process. Cloud collection does
   not automatically authorize indefinite analytics retention.

### Required teacher controls

- Close cohort.
- Extend a cohort's end/retention date with a visible reason.
- Purge one student/cohort record.
- Purge an entire closed cohort.
- Export current evidence before purge.
- Preview the number and categories of files/rows to be deleted.
- Record success/failure without copying raw student content into logs.

No automatic purge should be implemented until it has a dry-run/report mode and recoverability has
been tested with synthetic data. A manual owner-triggered purge is acceptable for the first cohort.

## Failure Behavior And Observability

### Student-facing states

- `Saved on this device`
- `Syncing to school account`
- `Saved to school account at <time>`
- `School save pending; you can keep working`
- `Cloud copy changed elsewhere; choose which copy to use`
- `School account could not be identified; cloud save is unavailable`
- `This version cannot safely read the cloud record; download a backup and ask the teacher`

### Fail-open versus fail-closed

- **Fail open for gameplay/local persistence:** GAS outage, quota exhaustion, or RPC failure must
  not prevent local play or local export.
- **Fail closed for cloud authority:** missing identity, invalid origin, unknown schema, oversized
  payload, bad cohort, stale revision, stale lease, or malformed data must not read or write a cloud
  record.

### Server validation

- allowlist all fields and message types;
- cap total package size and individual XML strings;
- reject unsupported schema/app combinations;
- derive identity, cohort membership, record key, file id, revision, and server timestamps on the
  server;
- use idempotency keys so a retry receives the prior acknowledgement instead of duplicating an
  archive or receipt;
- keep client and server timestamps distinct;
- sanitize errors before returning them to the browser;
- keep PII and payload bodies out of ordinary execution logs; and
- monitor Apps Script execution failures and quota health through the Apps Script dashboard.

## Teacher Review Experience

The first useful teacher surface does not need to reproduce `admin.html` inside GAS.

Minimum viable teacher workflow:

1. Open the private index Sheet.
2. See account, cohort, last successful sync, current revision, highest reached/passed, star/mastery
   summary, active session, and review/conflict flags for the full class.
3. Follow a teacher-only link to the current Drive envelope when raw inspection is necessary.
4. Use a teacher-only GAS action to download the latest v2 evidence for one student or the cohort.
5. Feed those files into the existing local admin analyzer for detailed v1/v2 caveats, similarity
   review, and per-level stories. The cloud path only promises v2, but the analyzer may retain v1
   compatibility for historical local files.

Later work may host a read-only teacher dashboard in the GAS shell, but analyzer parity, access
control, accessibility, and privacy make that a separate bounded project rather than part of the
first cloud-save packet.

## Falsification Probes Before Implementation Packets

No source implementation packet should be ratified until the first four probes succeed.

### Probe 1: Domain identity

- Deploy a minimal domain-only web app as the intended teacher/deployer.
- Open it using the teacher account and at least two real domain student accounts.
- Verify whether `Session.getActiveUser().getEmail()` is nonblank and correct under
  execute-as-deployer.
- Record only deidentified pass/fail aggregates in tracked artifacts.
- Falsifier: blank/wrong identity or a required authorization shape that makes teacher-owned
  central storage impractical.

### Probe 2: Real iframe and origin behavior

- Embed the production GitHub Pages app in the real GAS HtmlService shell.
- Record the actual parent/child origins and sandbox behavior.
- Verify strict `postMessage` with no wildcard target.
- Recheck the deployed app's frame headers.
- Falsifier: unstable/unverifiable parent origin, iframe refusal, blocked required APIs, or a need to
  weaken origin checks.

### Probe 3: Embedded persistence and migration

- Exercise ordinary guided, shared project, Free Play, and both PvP team workspaces.
- Verify localStorage and IndexedDB across reload, browser close/reopen, and managed-Chromebook
  policy if available.
- Compare direct GitHub Pages storage with GAS-embedded storage.
- Exercise the top-level-to-GAS one-time migration handshake.
- Falsifier: unreliable embedded persistence without a safe local fallback, or no practical path to
  move existing v2 state.

### Probe 4: RPC payload and class load

- Use synthetic current regression exports, including the existing roughly 100-285 KB examples.
- Simulate a realistic class checkpoint burst and retry behavior.
- Measure RPC time, Drive update time, Sheet lock time, duplicates, failures, and quota/error output.
- Include malformed and oversized payloads.
- Falsifier: ordinary class bursts cause material save failure, lock starvation, or response sizes
  that require a different store/transport shape.

### Probe 5: Conflict/offline behavior

- Use two tabs and two devices against one synthetic account.
- Verify tab warning, lease takeover, compare-and-swap rejection, local backup preservation, offline
  outbox recovery, idempotent retry, and no silent overwrite.
- Falsifier: either copy can be lost without a deliberate user choice.

### Probe 6: Teacher extraction and purge

- Generate only synthetic student records.
- Verify cohort summary rows, evidence extraction for the existing analyzer, individual purge,
  cohort dry-run purge, partial failure recovery, and retention field behavior.
- Falsifier: raw data or identity remains in an undocumented location after a successful purge.

## Proposed Workstream Sequence

This is sequencing guidance, not a packet slate. Packet creation happens only after owner and
orchestrator review.

1. **Tenant and browser probes:** Identity, HtmlService origin, iframe storage, payload/load.
2. **Owner contract amendment:** Ratify cloud collection as an optional exception to the current
   local-only/no-server runtime contract; ratify identity, canonical sections, retention, PvP, and
   failure language.
3. **Versioned data/protocol contract:** Define portable-state schema, cloud envelope, v2 evidence
   builder boundary, message protocol, size caps, revisions, leases, errors, and migration flags.
4. **Pure client extraction:** Refactor evidence building away from UI download and introduce
   storage/portable-state adapters without networking. Preserve direct/local mode exactly.
5. **GAS proof implementation:** Minimal parent/server with private synthetic Drive/Sheet storage,
   no real class deployment.
6. **Cloud bootstrap and local outbox:** Add integration-mode boot barrier, restore/conflict UI,
   coalesced checkpoints, acknowledgements, and offline behavior.
7. **V2 migration bridge:** Direct-site transfer flow plus manual fallback.
8. **PvP/shared-computer semantics:** Both workspaces, origin-account labels, slower evidence cadence,
   and teacher default exclusion.
9. **Teacher index/extraction:** Whole-class summary and batch evidence download compatible with the
   local analyzer.
10. **Retention/purge tooling:** Dry run first, then owner-triggered deletion with synthetic proof.
11. **Limited classroom pilot:** Small cohort, explicit rollback/export path, observed quota and
    conflict evidence before broader use.

Each workstream should remain separately reviewable. The GAS adapter must not be allowed to broaden
ordinary game-rule, curriculum, Blockly, or guided-level content packets.

## Documentation And Test Impact

Likely authoritative docs requiring later updates:

- `docs/ARCHITECTURE.md`
- `docs/TESTING.md`
- `docs/TeacherGuide.md`
- `docs/StudentGuide.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/file-pipelines.md`
- `docs/subsystems/usage-and-admin.md`
- `docs/subsystems/ui-mode-contract.md`
- `docs/CohortUsageAnalysis.md`
- `docs/CohortUsageDataDictionary.md`

Likely test families:

- pure protocol/origin/schema validation unit tests;
- portable-state extraction/import tests for every workspace class;
- usage-v2 evidence-builder and analyzer-parity tests;
- startup ordering and cloud-timeout tests;
- browser persistence tests in direct and embedded modes;
- duplicate-tab, stale-revision, lease-takeover, and conflict-choice tests;
- offline outbox/idempotency tests;
- synthetic GAS server/storage tests where practical;
- class-burst load probes outside ordinary unit CI; and
- teacher extraction/purge tests using synthetic records only.

The current direct/local workflow must remain fully functional and should be the fallback during a
cloud outage. Passing unit tests alone cannot validate Workspace tenant identity, HtmlService
origins, storage partition behavior, or real Apps Script quotas.

## Privacy And Operations Checklist

- [ ] Domain identity is server-derived and fails closed.
- [ ] No student UUID/email appears in the Browser Battlegorithms URL.
- [ ] No email or student name appears in Drive filenames.
- [ ] No secret, roster, folder id, or spreadsheet id is committed or sent to the child.
- [ ] Teacher Drive folder and Sheet are private.
- [ ] Cloud payload excludes raw run-version XML history.
- [ ] Evidence preserves schema-v2 boundary XML and completeness contracts.
- [ ] PvP second participant is explicitly unattributed/self-reported.
- [ ] Student UI distinguishes local from cloud save state.
- [ ] Conflict handling preserves both copies.
- [ ] Retention dates are created with the cohort.
- [ ] Individual and cohort purge have dry-run evidence.
- [ ] Tracked reports contain synthetic/deidentified results only.
- [ ] Cloud records are not treated as authenticated authorship evidence.

## Remaining Owner Decisions And Review Questions

The owner's responses are sufficient for this proposal, but several choices remain before packet
ratification:

1. **GAS source location:** Keep version-controlled GAS source under a non-Vite
   `integrations/google-apps-script/` directory in this repository, or use a separate companion
   repository? Recommendation: same repository for schema/version coordination, excluded from the
   Vite build, with no committed deployment ids or secrets.
2. **Historical migration breadth:** Migrate active v2 session + durable ledger only, or offer an
   optional capped upload of all retained v2 sessions? Recommendation: active session first.
3. **Tutorial/callout state:** Portable or device-local? Recommendation: sync project continuity
   callout state; leave general tutorials device-local until student testing says repetition is a
   problem.
4. **Account presentation:** Show full school email, directory display name, or both in the teacher
   index? Recommendation: account email plus optional roster name, both private to the teacher.
5. **Retention override:** Confirm whether district policy requires evidence longer than the
   proposed 90-day post-cohort window.
6. **Manual overwrite authority:** May a student choose `Use this device's copy` without teacher
   approval, provided the displaced cloud revision is recoverable for seven days? Recommendation:
   yes for ordinary conflicts; require teacher review only for incompatible/corrupt schemas.
7. **First pilot boundary:** Guided-only cloud restore with PvP storage preserved but evidence
   minimally summarized, or full Guided/Free Play/PvP behavior at first pilot? Recommendation: all
   modes preserve workspaces, but grading-oriented evidence and UI focus on Guided first.

## External Platform References

- Google Apps Script web apps and execution identity:
  <https://developers.google.com/apps-script/guides/web>
- Apps Script `Session` identity behavior:
  <https://developers.google.com/apps-script/reference/base/session>
- HtmlService client/server communication and asynchronous call behavior:
  <https://developers.google.com/apps-script/guides/html/communication>
- HtmlService iframe restrictions:
  <https://developers.google.com/apps-script/guides/html/restrictions>
- Apps Script quotas and limitations:
  <https://developers.google.com/apps-script/guides/services/quotas>
- Apps Script Drive service:
  <https://developers.google.com/apps-script/reference/drive>
- Apps Script LockService:
  <https://developers.google.com/apps-script/reference/lock/lock-service>
- Browser `postMessage` security guidance:
  <https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage>
- Chrome storage partitioning:
  <https://privacysandbox.google.com/cookies/storage-partitioning>

## Change Log

- **2026-09-01:** Initial proposal. Encodes owner direction on teacher-visible account attribution,
  schema-v2 migration floor, PvP/shared computers, one-active-device conflict posture, no Classroom
  integration, coalesced portable-state/evidence storage, and recommended retention windows.
