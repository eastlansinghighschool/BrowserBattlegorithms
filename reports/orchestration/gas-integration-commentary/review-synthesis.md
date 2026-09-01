# GAS Integration Review Synthesis

**Date:** 2026-09-01  
**Status:** synthesis for owner review; no source packet is authorized by this document  
**Proposal reviewed:** `reports/orchestration/google-apps-script-cloud-integration-proposal.md` at `29f3d31`  
**Review corpus:** `review-gemini.md`, `review-codex.md`, `review-claude.md`, and `review-kimi.md`

## Executive Result

All four reviewers reached the same verdict class: **the architecture is viable after bounded proposal revisions, but the proposal as written is not ready to become implementation packets**. None recommended adding Firestore, a custom backend, or Google Classroom integration. The durable core remains:

- the public Browser Battlegorithms build stays static and local-first;
- a domain-restricted GAS shell supplies server-derived Workspace account attribution;
- rich evidence stays in private Drive artifacts rather than Sheet cells;
- the Sheet, if retained, is a teacher index rather than the system of record;
- account attribution, client-integrity checks, and authorship remain distinct claims;
- cloud failure never prevents local play; and
- tenant, browser, and class-load behavior must be proven with synthetic probes.

The reviews materially improve the deployment shape. The best next architecture is now **two stages**:

1. **Stage 1 — account-attributed evidence relay:** remove the student download/upload ritual, preserve local gameplay, receive explicit and scheduled evidence submissions, and give the teacher a class review surface. Do not restore portable gameplay state yet.
2. **Stage 2 — cross-device continuity:** add portable-state restore only after account isolation, startup ordering, recovery, migration, and conflict behavior have separate contracts and tests.

That staging decision, recorded during the Claude review, removes most of the highest-risk startup and conflict work from the first classroom pilot while still solving the request's primary classroom-friction problem.

## How This Synthesis Weighs Findings

The reviews use severity labels inconsistently. This synthesis instead sorts claims into four decision classes:

1. **Ratified direction:** an owner choice was recorded during a review and is treated as current direction.
2. **Convergent design defect:** at least two reviews independently identified the same mechanism, or one supplied direct repository evidence that closes the question.
3. **Probe or policy gate:** the outcome depends on the district tenant, managed-browser policy, deployed GAS behavior, or measured class load.
4. **Disputed remedy:** reviewers agree on the hazard but recommend incompatible fixes; the proposal must not silently choose one before the deciding evidence exists.

“Confirmed” in an individual review is not automatically treated as measured platform fact. In particular, exact lock-failure thresholds, popup migration failure, and HtmlService origin stability remain empirical questions even where a reviewer used stronger wording.

## Ratified Direction Recorded During Review

The Claude review records eight owner decisions made during its back-and-forth. They should be carried into the next proposal revision as decisions, not reopened inside implementation packets:

| Topic | Recorded direction | Consequence |
| --- | --- | --- |
| Pilot scope | Stage the work: submission relay first, cross-device restore second | Stage 1 excludes portable-state restore, migration, leases, and conflict resolution |
| Canonical artifacts | Two Drive files with separate revisions: portable state and evidence | In Stage 1 only the evidence artifact is active; Stage 2 adds the state artifact |
| Shared computers | Require an explicit signed-in-account gate once per page load | The shell must show the account and offer Continue / Switch account before cloud mode |
| Evidence preservation | Use a scheduled cadence plus explicit Submit; do not rely on usage-session rollover | Evidence archives need a bounded schedule and an explicit-submission rule |
| Conflict experience | Never block play; pause cloud writes and show a non-blocking Compare path | Stage 2 conflict handling preserves both copies without consuming startup time |
| Mode scope | Sync PvCPU Free Play in Stage 2; exclude both PvP team workspaces | PvP remains local and unattributed; Free Play remains outside grading defaults |
| Teacher class view | Keep stars visible and unlabeled | This preserves the owner choice despite the reviewer’s pedagogical objection; observe use during pilot |
| Analyzer identity | Put account attribution in the downloaded filename, not inside hashed v2 evidence | Cloud evidence must strip self-reported names and leave the payload/hash contract intact |

These decisions settle several disagreements in the review corpus. They do **not** eliminate the need for account-bound local isolation in Stage 2, nor do they make filename contents public: the filename should be generated only in the teacher’s private extraction workflow. The server-side Drive filenames should remain opaque.

## Convergent Design Defects

### 1. Shared-browser state is not account-scoped

Codex, Claude, and Kimi independently identify the same core failure: Chrome partitions embedded storage by top-level site and child origin, not by the Workspace account currently recognized by GAS. Browser Battlegorithms’ current storage keys also have no account dimension.

The explicit account gate reduces the common “previous student is still signed in” failure, but it does not by itself prevent local records or an outbox created under account A from being adopted and uploaded under account B. Stage 2 therefore needs all embedded-mode local records to be bound to an opaque server-issued record identity, with differently bound or unbound state quarantined rather than displayed, merged, or auto-uploaded.

Required contract:

- show the server-derived signed-in account before cloud mode begins;
- bind workspaces, progress, usage state, client identity, and outbox records to the opaque record key;
- on account mismatch, do not disclose or auto-adopt the previous account’s content;
- keep the prior data recoverable for an explicitly defined teacher- or prior-account-mediated path; and
- test account A to account B in one Chrome profile.

Stage 1 avoids most local-state adoption risk because it does not restore gameplay state, but its evidence outbox and any retry receipts still require account binding.

### 2. The current app has no safe, atomic portable-state restore contract

Codex, Claude, and Kimi agree that portable state is not merely a JSON field list. Guided progression hydrates synchronously, usage tracking starts early, and no sanctioned usage-ledger hydration API exists. A late cloud response could also mutate an already interactive local session.

Stage 2 must define a versioned portable-state codec and a staged, whole-package restore transaction. The transaction must either commit all authoritative resume state or leave the current local state intact. It must never field-merge additive usage counters. It also needs a first-class boot coordinator that resolves account/local/cloud state before tracker start, level progress hydration, Blockly workspace load, and board interaction. A response received after the bounded bootstrap window must be advisory only and must never auto-apply over edits made since local play began.

This is a dedicated runtime-contract workstream, not a small storage adapter.

### 3. Starter-version handling can destroy restored work

Claude found a specific, high-confidence repository hazard not surfaced by the other reviews. The current workspace getter intentionally replaces stored XML with starter XML when the saved starter hash differs from the current build. Transporting both workspace XML and starter-version metadata across devices can therefore cause a newer build to replace restored student work and then upload the starter through a valid revision lineage. The current `appVersion` value is not maintained frequently enough to serve as a compatibility gate.

Before Stage 2, starter mismatch must preserve the displaced XML in a recoverable slot, mark the condition, notify the student, and suppress promotion of the replacement starter to cloud state until acknowledged. This is also a worthwhile independent local client-hardening packet even if Stage 2 is never built.

### 4. Evidence continuity cannot depend on current session rollover

Gemini, Codex, Claude, and Kimi all identify evidence displacement. The tracker can retain one session for a long period while bounded event, snapshot, and run-version windows churn. A new session or device can also replace `latestEvidence` before the older evidence is archived.

The recorded owner direction resolves the primary policy: archive on a bounded schedule and every explicit Submit, with session-change archiving retained as a defensive rule. The server must archive displaced evidence before accepting a different `sessionId`, and archive counts/age must be bounded. A losing branch in a future conflict should also be preserved as evidence with a completeness flag rather than silently disappearing.

### 5. Portable state and evidence need separate canonical artifacts

Gemini, Codex, and Claude favor separating frequently changing state from larger, less frequently changing v2 evidence. Claude also demonstrates a semantic conflict in the combined envelope: the learning ledger is resume state and is also copied into evidence, but the proposal gives the sections different refresh cadences without a precedence rule.

The recorded owner decision resolves the artifact question:

- the portable-state file is authoritative for resume and owns its own revision;
- the evidence file is authoritative for teacher review at its receipt and owns a separate revision;
- the evidence file’s embedded ledger is a point-in-time copy and is never hydrated back into the tracker; and
- Stage 1 writes only evidence, avoiding repeated state traffic entirely.

Kimi initially preferred retaining a combined envelope unless probes disproved it, but that recommendation predates and is superseded by the owner’s two-file choice.

### 6. Save idempotency and recovery are named but not specified

Codex gives the clearest formulation: a revision check alone does not distinguish an intentional retry from a second write after the client missed the first acknowledgement. Drive success followed by Sheet failure, or successful receipt followed by a lost response, otherwise creates ambiguous retries.

Every save needs an immutable `saveOperationId`, content digest, base revision, artifact role, and persisted receipt. Repeating the same operation id and digest must return the original result without creating another revision; reusing an id with a different digest must fail closed. The server contract must state what happens after each partial-failure point. Losing-copy recovery must be an application-managed artifact or archive with explicit creation and purge rules, not an unspecified reliance on Drive’s native revision UI.

### 7. The proposed global lock and hot-path Sheet write are unsafe at class scale

All four reviews converge on load risk. Under the preferred execute-as-deployer model, a class shares the deployer’s simultaneous-execution quota. A global ScriptLock held across Drive and Sheet work serializes unrelated students and lengthens executions during the exact teacher-synchronized burst produced by level transitions. Exact failure thresholds remain a probe question, but the positive-feedback mechanism is credible enough that it should not be the default design.

The revised design should:

- keep Drive writes out of a global critical section;
- use per-record compare-and-swap/idempotency rather than whole-class serialization;
- remove the Sheet from the student-save hot path and rebuild/update the index asynchronously or on teacher demand;
- jitter background and boundary saves;
- coalesce duplicates and apply bounded retry/backoff;
- make “queued; continuing locally” a calm, first-class client state; and
- test at 35 synthetic concurrent clients using real 100–300 KB evidence fixtures.

Stage 1 cuts the number of write paths, but explicit whole-class Submit can still create the same burst and must be included in the load test.

### 8. Cloud-mode v2 evidence needs an explicit identity policy

Codex, Claude, and Kimi confirm that today’s v2 export can contain the self-reported student name at top level and inside export events. Server-side injection of an authenticated name would invalidate the existing integrity hash; leaving the typed name in place risks confusing it with account attribution.

The cloud evidence builder must remove the self-reported name from every occurrence, preserve the existing v2 hash semantics, and keep the authenticated account outside the payload. The teacher extraction filename may carry the account attribution because the current browser analyzer can fall back to filenames; the CLI analyzer should be made consistent. Teacher surfaces must continue to label account receipt, payload integrity, server receipt, and authorship separately.

### 9. Retention and purge promises exceed the mechanisms specified

Gemini, Codex, Claude, and Kimi all find gaps in deletion or recovery. Drive trash, Drive file revisions, Sheet version history, Apps Script execution logs, teacher-downloaded files, and device-local outboxes are separate residual-copy surfaces. Row deletion does not erase Sheet history, and DriveApp alone cannot enforce the proposal’s “three revisions / seven days” promise.

The proposal must either require and validate the Advanced Drive Service for permanent deletion/revision handling or weaken its retention claims to what the platform actually guarantees. The account-to-record mapping should live in a separately purgeable cohort artifact rather than in the history of a long-lived operational Sheet. Purge must have a synthetic drill that attempts recovery through Sheet history, Drive revisions, and Drive trash. The teacher procedure must separately cover downloaded copies; the server cannot truthfully claim to purge them or a device-local outbox.

No production retention number should be ratified until the district records/appeal schedule is known.

### 10. Embedded storage failure is not currently graceful

Claude and Kimi identify unguarded localStorage access that can throw when third-party storage is blocked. Guided workspaces also lack the same useful in-memory fallback available in other paths. Embedding makes this latent weakness reachable under managed Chrome policy.

Before Stage 1, storage capability checks should be exception-safe and the app should remain playable in memory-only mode with one honest warning. This hardening benefits direct mode as well. The district’s `BlockThirdPartyCookies`/site-data policy is a pre-probe question, not something to discover during a class pilot.

## Probe And Policy Gates

### Gate 0: district permission and policy

Ask district IT before scheduling technical work:

1. May a teacher deploy a domain-restricted Apps Script web app for students?
2. Is third-party cookie/site-data access blocked by policy on student Chromebooks?
3. Does the district permit student learning records in the teacher’s Drive under its privacy agreement?
4. What retention, deletion, grading-appeal, or records schedule overrides the proposed defaults?

A negative answer to the first two can invalidate the iframe shape cheaply. A negative privacy/records answer may invalidate Drive storage even if the code works.

### Gate 1: minimal nested-frame capability probe

Claude’s proposed Probe 0 has the highest information value per unit of work. A static child inside a real GAS shell should measure:

- actual child and parent origins across reloads, users, version updates, and a new deployment;
- effective sandbox behavior;
- blob download from direct user activation and an async callback;
- `confirm()`/`prompt()` behavior;
- speech synthesis;
- localStorage and IndexedDB reads/writes, including blocked third-party storage;
- keyboard navigation and help-dialog behavior; and
- usable viewport on a representative 1366×768 managed Chromebook.

This probe should precede roster setup and implementation packets.

### Gate 2: tenant identity

Using synthetic domain accounts, verify server-derived active-user email under the exact deployment settings. Include two Google accounts in one browser profile, renamed account, disabled account, unrostered/late-enrollee account, and account switching. Display the resolved account before any cloud action. Blank or ambiguous identity is a hard fail for account-attributed cloud mode.

### Gate 3: load and failure semantics

Run at least 35 concurrent synthetic clients with representative payload sizes. Compare designs with and without a global lock, with the Sheet removed from the write path, and with save jitter. Measure p50/p95 acknowledgement time, simultaneous executions, failures, retry amplification, duplicate receipts, and Drive-success/Sheet-failure recovery.

### Stage 2 gates

Only after Stage 1 is stable, prove account-bound storage, atomic restore, late-bootstrap non-mutation, starter mismatch recovery, conflict losing-copy recovery, duplicate-tab/device behavior, and migration. Migration should have a validated file/package import as the dependable baseline; a popup/opener handshake is optional convenience only if real Google authorization and popup behavior survive the probe.

## Disputed Remedies And Their Disposition

### Parent-origin authentication

Gemini and Claude recommend tolerating a changing `*.script.googleusercontent.com` origin using source identity, a nonce, and a suffix/regex check. Kimi argues that a parent-minted nonce cannot authenticate the parent and recommends exact origin pinning, with a server-bound token if the origin is unstable. Both sides agree that the real origin behavior is undocumented enough to require measurement.

**Disposition:** do not ratify either broad suffix acceptance or fixed exact-origin pinning yet. Probe origin stability first. Prefer exact pinning if stable. If it is not stable, design a server-issued, short-lived, account/deployment-bound bootstrap proof rather than pretending a broad Google-hosted suffix plus a parent-created nonce authenticates the shell. Continue to verify `event.source`, use a per-page channel nonce, and fail closed for cloud authority. Put transient secrets in the URL fragment rather than query parameters where feasible.

### Migration mechanism

Gemini treats popup/opener migration as effectively broken; Codex and Kimi call it plausible but unproven. Claude notes that the GAS sandbox supports popups but not the Storage Access API token needed for a simpler shared-storage path.

**Disposition:** Stage 1 does not need migration. For Stage 2, build a bounded, validated package export/import path first. Treat popup migration as optional UX enhancement after a redirect-aware real-tenant probe, not as the only route to student work.

### Human-readable Drive filenames

Gemini recommends readable account filenames for emergency triage. Kimi objects that this reintroduces identity into Drive browsing and recommends opaque random record keys plus a teacher index/open-file action. Claude’s owner-mediated decision concerns the filename of a teacher-downloaded analyzer export, not the server’s stored Drive artifact.

**Disposition:** keep server-side Drive filenames opaque. Make the index and a teacher-only “open current evidence” action reliable enough for triage. Put account attribution into the teacher’s downloaded filename only, consistent with the recorded owner decision.

### Free Play and PvP scope

Gemini recommends Guided-only sync; Kimi initially recommends all modes behind account isolation; Claude records the owner’s middle path.

**Disposition:** Stage 1 stores evidence only. In Stage 2, portable state includes PvCPU Free Play and excludes both PvP team workspaces. PvP remains usable locally and excluded from grading defaults.

### Conflict UX and stars

The original proposal blocks startup on unresolved divergence; the recorded owner direction is to let play continue locally while cloud writes pause. Claude also objects that an unlabeled star column looks grade-like despite the Student Guide’s “never grades” promise; the owner chose to keep it unlabeled.

**Disposition:** preserve both recorded choices, but instrument them during the pilot. Track how long divergence banners remain unresolved and whether the star column influences grades. These observations provide explicit triggers for revisiting the choices.

## Recommended Revised Architecture

### Stage 1 — Account-Attributed Evidence Relay

The first deliverable should include only:

1. domain-restricted GAS deployment and proven server-derived identity;
2. explicit signed-in-account gate;
3. strict parent/child protocol proven by Gate 1;
4. a cloud-mode v2 evidence builder that strips self-reported identity while preserving integrity semantics;
5. one opaque per-student current evidence file plus bounded scheduled/explicit archives;
6. operation-id idempotency and durable receipts;
7. an account-bound local retry outbox;
8. asynchronous or teacher-triggered class-index refresh, not a Sheet write inside every student save;
9. teacher extraction with account-attributed filenames for the existing analyzer;
10. explicit retention/purge controls and synthetic proof; and
11. direct/local mode as the immediate fallback.

It should not include cloud restore, portable state, migration, leases, duplicate-device conflict resolution, or PvP/Free Play workspace sync. That boundary is the main risk-reduction result of the review round.

### Stage 2 — Cross-Device Continuity

Stage 2 may begin only after a separate owner gate and should add:

- account-bound local namespaces and quarantine;
- the portable-state codec and tracker hydration API;
- an integration-aware boot coordinator;
- atomic whole-package restore with no field-level ledger merge;
- late-result non-mutation;
- starter-version displaced-work recovery;
- independent state revisions and recovery copies;
- non-blocking conflict Compare UX with cloud writes paused;
- completeness flags for restored/discarded branches;
- validated package migration, with popup transfer optional; and
- PvCPU Free Play portability, while keeping PvP team workspaces local.

## Remaining Owner And District Decisions

The review round closes the eight items recorded above but leaves these decisions before production:

1. Ratify the district’s actual Apps Script deployment permission, managed-storage policy, and privacy/records constraints after asking IT.
2. Choose an initial evidence archive cadence and archive cap for Stage 1. Recommendation for the proposal: make both configuration values rather than hard-coded universal policy.
3. Decide whether immediate permanent deletion is required. If yes, accept the Advanced Drive Service as an explicit dependency and prove it; if no, disclose the real residual windows.
4. Define recovery for an account-bound dirty outbox found on a shared device after account switch.
5. Decide whether a returning student in a new cohort starts fresh or may explicitly import prior portable state in Stage 2.
6. Choose the opaque record-key mechanism. Recommendation: use a random per-cohort key held in the private roster mapping rather than an email-derived HMAC, avoiding secret rotation and account-rename breakage.
7. Confirm the repository location for GAS source. Keeping it under `integrations/google-apps-script/` remains sensible, with one versioned protocol/schema source consumed or mechanically checked by both sides.
8. Defer tutorial/callout portability until the nested-frame probe and student usability test.
9. Reframe manual overwrite authority under the non-blocking conflict choice; no overwrite should be enabled until losing-copy recovery is implemented and tested.

## Proposed Next Steps

1. **Owner reads and ratifies this synthesis**, especially the recorded review decisions and the Stage 1/Stage 2 boundary.
2. **Ask the four district-policy questions.** Their answers can stop or reshape the work before code is written.
3. **Run the minimal nested-frame capability probe** and record only synthetic/deidentified results.
4. **Run the tenant identity probe** with synthetic domain accounts.
5. **Revise the proposal** around the staged architecture, two artifacts, account binding, idempotency/recovery, load back-pressure, and honest purge semantics.
6. **Write a Stage 1 packet slate only after those gates pass.** The first source packet should include the independent storage exception hardening; the starter-version hardening can proceed independently before Stage 2.
7. **Pilot Stage 1 with a small cohort**, measuring setup minutes, acknowledgement latency, queued saves, failed saves, explicit submissions, teacher extraction time, and any attribution confusion.
8. **Use pilot evidence for a new owner gate** before writing Stage 2 implementation packets.

## Bottom-Line Assessment

The review round did not uncover a reason to abandon GAS. It did uncover a reason to resist building cloud restore first. The proposal’s strongest value can be delivered with a much smaller Stage 1: authenticated evidence relay and teacher extraction. Cross-device restore remains feasible, but it is where nearly every serious data-loss, shared-device, startup-ordering, and migration hazard lives.

The project is therefore **ready for a bounded proposal revision and two cheap external gates, not yet for implementation planning**. The simplest success condition is also pedagogically strong: students keep playing in the familiar local-first app, submission friction disappears, and the teacher gains account-attributed evidence without making cloud continuity a prerequisite for class.
