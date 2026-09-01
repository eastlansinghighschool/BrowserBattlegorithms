# Adversarial Review: Google Apps Script Cloud Integration Proposal (Kimi)

**Reviewer:** Kimi (adversarial architecture, classroom-product, privacy, and implementation-readiness review)
**Date:** 2026-09-01
**Proposal reviewed:** `reports/orchestration/google-apps-script-cloud-integration-proposal.md`, dated 2026-09-01, landed in `e73a1ac` + `29f3d31`, reviewing working-tree state at HEAD `9f03f85` (clean tree).
**Prior review:** `reports/orchestration/gas-integration-commentary/review-gemini.md` (commit `9f03f85`). This review was written with full knowledge of that file. Agreements and disagreements are marked explicitly; findings that merely restate Gemini's are folded into confirmations rather than duplicated.

## Evidence inspected

Repository (read-only; nothing modified):

- Startup/persistence: `src/main.js`, `src/startup/loaders.js`, `src/ai/blockly/workspace.js`, `src/core/levels.js`, `src/ui/controls.js`, `src/crypto/privateProgramFile.js`, `tests/browser/persistence.spec.js`, `playwright.config.js`.
- Usage system: `src/usage/usageTracker.js`, `src/usage/usageFormat.js`, `src/usage/learningLedger.js`, `src/usage/runVersionStore.js`, `src/usage/usageAnalyzer.js`, `src/admin/adminApp.js`, `tests/regression/output/*.json` (real export sizes 107–285 KB confirmed), usage-v2 unit/regression tests.
- Docs: `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/TESTING.md`, `docs/TeacherGuide.md`, `docs/StudentGuide.md`, `docs/subsystems/blockly-workspace.md`, `docs/subsystems/usage-and-admin.md`, `docs/subsystems/file-pipelines.md`, `docs/subsystems/ui-mode-contract.md`, `docs/CohortUsageAnalysis.md`, `docs/CohortUsageDataDictionary.md`, `docs/TeacherFacilitationKit.md`, `reports/orchestration/session-handoff.md` (predates the proposal; nothing about it there).

Platform behavior verified against Google documentation and corroborating sources:

- Apps Script quotas: 30 simultaneous executions per user (consumer and Workspace), 6 min/execution — <https://developers.google.com/apps-script/guides/services/quotas>.
- `Session.getActiveUser().getEmail()` under execute-as-deployer: blank outside the deployer's domain; generally available same-domain — <https://developers.google.com/apps-script/reference/base/session>.
- HtmlService sandbox iframe served from a `*.script.googleusercontent.com` origin — <https://developers.google.com/apps-script/guides/html/restrictions>.
- Chrome storage partitioning double-keys third-party storage by (top-level site, resource origin) — <https://privacysandbox.google.com/cookies/storage-partitioning>.
- Drive revision retention: purgeable revisions kept ~30 days or until 100 unpinned revisions — <https://developers.google.com/workspace/drive/api/guides/manage-revisions>.
- Sheets version history: deleted rows remain recoverable to any editor via File → Version history for the life of the spreadsheet file.

Owner interaction during this review: none required. No blocking ambiguity arose; the five confirmed owner directions were treated as fixed. New decision points discovered during review are listed under *Missing owner decisions* rather than asked mid-review.

Every proposal claim checked against code held up; no outright fabrication was found. The problems below are mostly things the proposal does not say, plus two places where platform behavior defeats the design as written.

---

## Findings (ordered by severity and likelihood)

### Finding K1 — Local state has no account dimension: shared browser profiles cause wrong-account adoption and cross-student visibility

- **Severity:** critical
- **Status:** confirmed (mechanism); likelihood varies by school hardware model
- **Proposal location:** *Revision, Lease, And Conflict Model* conflict matrix (lines 534–543); *PvP And Shared-Computer Contract* (626–643)
- **Finding:** Chrome keys the embedded storage partition by (top-level site, child origin) — not by Google account. Every student who signs into the GAS web app from the same browser profile shares one `localStorage`/IndexedDB partition for the embedded app. The current storage keys carry no account component (`bba:guided-workspace:<levelId>`, `bba:guided-level-progress`, `bba:free-play-pvp-team:{1,2}` — `src/ai/blockly/workspace.js:36-41`, `src/core/levels.js:25`), and the proposal adds none. So when student B signs into their own Workspace account on a machine student A used earlier, the conflict-matrix row "Local exists / Cloud none → start locally; upload as revision 1" (line 537) silently adopts A's local progress, workspaces, and PvP team programs and uploads them as **B's** first cloud revision. Worse, guided progress hydrates synchronously at module import (`src/main.js:216` → `src/core/levels.js:232`), before any identity check could run, so B *sees and plays from A's unlock state immediately*. This extends Gemini's Finding 7 (which covered the case where A stays signed in); the account-switch case is worse because the misattribution is then durable in B's cloud record and in the teacher's Sheet, attributed to the wrong authenticated account — precisely the signal owner decision 1 tells the teacher to trust.
- **Why it matters in a classroom:** Shared desktops and cart laptops with one OS/Chrome profile but per-student Google web sign-in are common; owner decision 3 makes shared computers a supported scenario. Consequences: teacher sees B credited with A's levels; B sees A's PvP strategy and workspaces (a privacy leak the current local-only model limits to one machine at a time); A's own record is unaffected, so nobody gets an error that reveals what happened.
- **Evidence:** Chrome storage-partitioning double-keying (top-level site + origin, no account key); account-free key inventory at `src/ai/blockly/workspace.js:36-41` and `src/core/levels.js:25`; synchronous progress hydration `src/main.js:216`; conflict matrix line 537; no account-namespacing or mismatch guard anywhere in the proposal text.
- **Smallest recommended change:** Tag every locally persisted record (workspaces, guided progress, usage-session pointer, outbox) with the server-derived account identifier once bootstrap completes, and namespace new writes by it. On bootstrap, if untagged or differently-tagged local state exists under a different signed-in account, do **not** auto-adopt it: show an explicit "This device has saved work from a different school account — [Keep separate / Ask teacher]" state and keep it quarantined. Add the "wrong account on this device" status string to the student-facing state list (lines 688–695).
- **Falsification test:** (Probe 5 extension) In one Chrome profile: sign in as synthetic account A, pass a level, sync; sign out of Google, sign in as B (same profile), open the GAS app. Expected after the fix: B gets a clean or quarantined start, no A progress visible, no revision-1 upload of A's state.

---

### Finding K2 — The promised purge is defeated by native version/revision history: Sheets version history keeps deleted identity rows indefinitely, and Drive revisions keep "deleted" envelope content ~30 days

- **Severity:** critical (privacy-compliance; gameplay unaffected)
- **Status:** confirmed (platform behavior)
- **Proposal location:** *Retention And Deletion Recommendation* (644–683), especially line 664 ("delete Drive current/archive files, the identity mapping, raw receipt rows, and file ids"); revision cap at 658–660
- **Finding:** Three legs, all platform-documented:
  1. **Sheet version history.** Deleting rows from the index Sheet does not delete them from the spreadsheet's version history; any editor can restore a version where the account↔record-key mapping and receipt rows still exist. Native Sheets keep version history for the life of the file. The retention plan's "delete the identity mapping" is therefore not achievable by row deletion — the exact artifact a district audit would check survives.
  2. **Drive revision history.** Every checkpoint overwrite of the current envelope creates a Drive revision; purgeable revisions are retained ~30 days (or until 100 unpinned revisions accumulate). So "remove the portable state section at day 30" (line 654) leaves the section readable in prior revisions for up to another month — and the proposal's own "no more than three recoverable revisions / seven days" cap (658–660) is **not implementable with DriveApp alone**; listing/deleting revisions requires the Advanced Drive Service, which the proposal never names.
  3. **Trash.** Gemini Finding 9 covers the 30-day Drive Trash leg; confirmed, not repeated here.
- **Why it matters in a classroom:** The retention section is the proposal's privacy contract with families and the district. As written, the mechanisms specified cannot deliver the promised deletion: student-account mapping persists indefinitely in Sheet history; envelope content persists weeks past its section purge. If the owner communicates the 90-day window to a district, the system as designed will be quietly noncompliant.
- **Evidence:** Google Sheets version-history restore behavior (deleted rows recoverable by editors); Drive revision purge rule (30 days / 100 revisions, `manage-revisions` doc); proposal lines 654–666 name deletion targets but no mechanism that reaches version/revision history.
- **Smallest recommended change:** (a) Move the account↔record-key identity mapping out of the long-lived index Sheet into a dedicated purgeable artifact — a Drive JSON mapping file or a dedicated mapping spreadsheet that is **replaced, not edited, at purge** (a fresh copy carries no version history; permanently delete the original via Advanced Drive Service `Drive.Files.remove` to bypass trash and revisions). (b) At section-purge time, replace the envelope file rather than overwriting it, and permanently delete the old file the same way. (c) State in the retention section that Advanced Drive Service is a required dependency for purge and revision-capping. (d) Add the residual-copies note: teacher-downloaded analyzer exports are governed by the repo's existing `local/` rules, and device-local outboxes/backups are outside server reach.
- **Falsification test:** (Probe 6 extension) Seed synthetic data, run the purge procedure, then attempt recovery three ways: Sheets version-history restore, Drive revision listing via Advanced Drive Service, and Drive Trash inspection. Purge passes only if all three return nothing.

---

### Finding K3 — Classroom checkpoint bursts hit two independent platform ceilings: script-wide lock serialization (Gemini F1) and the deployer's 30-simultaneous-executions quota

- **Severity:** critical
- **Status:** confirmed (quotas are documented); burst tolerance still needs the load probe
- **Proposal location:** *Save Frequency And GAS Load Budget* (389–438), specifically the `ScriptLock` critical section at 423–429
- **Finding:** I confirm Gemini Finding 1: a global `LockService.getScriptLock()` wrapped around per-student Drive writes (≈1–3 s each for `setContent` + Sheet row update) serializes the whole class; a 25–35-student burst queues tens of seconds and fails the tail. One correction to Gemini's evidence: the 30-second figure is the caller-supplied `waitLock` timeout and doc example, not a hard platform ceiling — the real constraints are queuing latency, UX, and the second ceiling below. The recommendation stands regardless.
  **The leg Gemini missed:** under execute-as-deployer, *every* student's web-app execution counts against the **deployer's** per-user quota of **30 simultaneous executions**. A 30–40-student class crossing a level boundary together — a bell-synchronized event, exactly when guided checkpoints fire (proposal lines 399–401) — can exceed the ceiling even after de-locking; the 31st+ concurrent RPC fails before user code runs, and client retries amplify the burst.
- **Why it matters in a classroom:** Teacher says "finish level 4 and we'll discuss"; half the class checkpoints within the same 30 seconds. Failures surface as red pending/error states at the worst possible moment — at the front of the room, during a graded transition.
- **Evidence:** Quotas doc (30 simultaneous executions per user; under execute-as-me the effective user is the deployer for all executions); proposal's own serialization requirement at 423–429; Drive/Sheet write latencies in the seconds range; `persistence.spec.js`/docs confirm level completion is a class-wide synchronized event in the 50-minute lesson structure (`docs/TeacherFacilitationKit.md:25-32`).
- **Smallest recommended change:** (a) Adopt Gemini's de-locking: no global lock around Drive writes; per-student CAS via the student's own file; micro-lock only the Sheet row append/update or batch index updates. (b) Add client-side jitter (spread coalesced checkpoints over tens of seconds) and server-side idempotent retry/backoff so a burst disperses instead of colliding. (c) Write the 30-concurrent-execution ceiling explicitly into the load budget section and make Probe 4 measure it.
- **Falsification test:** (Probe 4) 35 concurrent synthetic checkpoint RPCs; record `Service invoked too many times` / lock-timeout rates and p95 ack latency, with and without the global lock and with jitter enabled.

---

### Finding K4 — Evidence continuity depends on an archive trigger that almost never fires; displaced sessions must be archived server-side on every `sessionId` change

- **Severity:** major
- **Status:** confirmed (code); design fix is small
- **Proposal location:** *Terms* "Evidence archive" (162–165), *Canonical Artifact* "Replace the latest evidence snapshot… Archive a session once on rollover" (339–342)
- **Finding:** The proposal models session rollover as a routine lifecycle event. In the code, a usage session rolls over **only** when the app loads after a ≥7-day inactivity gap (`src/usage/usageTracker.js:161-167`, `maybeContinueExistingSession`); there is no manual, mid-session, or version-triggered rollover. A student working daily keeps one session all week, so "archive on rollover" fires rarely and unpredictably. Meanwhile Gemini Finding 4's displacement case (new `sessionId` overwrites `latestEvidence`, destroying the prior session's evidence) applies not only cross-device but also **same-device** after any 7-day gap — e.g., a student returns from a school break, a fresh session starts, the next checkpoint erases pre-break evidence from the envelope. Separately, the local client prunes sessions older than 7 days / beyond 20 sessions (`usageFormat.js:18-21`, `usageTracker.js:103-145`), so owner question 2 ("migrate all retained historical sessions?") is bounded by construction: at most ~20 sessions spanning ~7 days can ever exist to migrate (worst case several MB; typical far less). That bound should be stated and the question effectively closed.
- **Why it matters in a classroom:** The teacher's review surface (existing `admin.html` workflow) is per-session evidence. Losing pre-break or pre-device-switch sessions silently means the "whole-class review surface" shows a student as starting from zero mid-course.
- **Evidence:** `src/usage/usageTracker.js:161-167` (7-day continuation), `usageFormat.js:18-21` + `usageTracker.js:103-145` (pruning), `docs/subsystems/usage-and-admin.md:96-98` (session continuation semantics); proposal lines 162–165, 339–342.
- **Smallest recommended change:** Make server-side archive-on-displace mandatory (not an owner option): when a checkpoint's `sessionId` differs from the envelope's, archive the displaced `latestEvidence` first (Gemini F4's fix), with a per-student archive cap (e.g., 5–10 sessions) plus explicit-submit and cohort-close archives. Update owner question 2 with the 7-day/20-session bound.
- **Falsification test:** (Probe 5) Same account, two session ids (simulate the 7-day gap by backdating `updatedAt`); verify the displaced session's evidence lands in `evidence-archive/` on the next checkpoint.

---

### Finding K5 — The boot-barrier plan understates a startup refactor: guided progress hydrates synchronously at module import, and usage tracking starts at import

- **Severity:** major
- **Status:** confirmed (code)
- **Proposal location:** *Boot And Restore Sequence* (274–294), which concedes "a meaningful startup refactor" without saying what it touches
- **Finding:** Today there is no async gate anywhere before hydration: `createApp()` and `initializeUsageTracking(app)` run at module evaluation (`src/main.js:40-45` — the tracker opens IndexedDB and begins recording immediately), and guided progress is read synchronously from `localStorage` during import (`src/main.js:216` → `src/core/levels.js:232` → `loadPersistedGuidedProgression` at `levels.js:31-52`). Only workspace hydration is naturally deferred (behind the async editor import, `main.js:93-118`, `src/startup/loaders.js:85-89`). The proposal's step 5 ("reads local… state… without yet starting the normal game/editor lifecycle") therefore requires converting import-time synchronous initialization into a sequenced async boot — touching `main.js`, `levels.js` init, and everything that reads `state.levelProgress` before editor-ready. Also relevant: production code has **no** URL-parameter handling at all (the only param, `devGuidedLevel`, is dev-only — `main.js:217-220`), so `integration=gas-v1` detection is entirely new surface, not an extension.
- **Why it matters in a classroom:** This is the highest-risk refactor in the whole plan because it gates every existing behavior (progress restore, tracker continuity) on new async ordering, and it is where K1's wrong-account adoption must be intercepted. Under-scoping it in workstream sequencing guarantees a too-large packet later.
- **Evidence:** `src/main.js:40-45, 216, 217-220, 230`; `src/core/levels.js:31-52, 232`; `src/startup/loaders.js:85-89`; zero matches for iframe/embed/postMessage handling in `src/` and `tests/`.
- **Smallest recommended change:** Name the boot coordinator as its own workstream item between current items 4 and 6 ("integration-aware boot sequencing: defer progress hydration, tracker start, and workspace load behind a bounded bootstrap barrier; direct mode must be byte-for-byte behaviorally unchanged"), with startup-ordering tests listed in its validation.
- **Falsification test:** Unit/browser test: in integration mode with a delayed bootstrap, assert no progress hydration, no tracker session creation, and no workspace load occur before the barrier resolves; in direct mode assert current behavior identical (existing `persistence.spec.js` suite passes unmodified).

---

### Finding K6 — Origin validation must pin the exact parent origin; Gemini's regex-plus-nonce suggestion does not authenticate the parent and widens the leak surface

- **Severity:** major
- **Status:** plausible-needs-probe (origin stability); confirmed that a channel nonce authenticates nothing
- **Proposal location:** *Protocol invariants* (254–259)
- **Finding:** The proposal correctly defers the allowlist to Probe 2. I explicitly **disagree** with Gemini Finding 3's remedy (validate the parent against a broad `*.script.googleusercontent.com`-style regex plus the ephemeral nonce): the nonce is minted by the parent itself, so it cannot authenticate the parent — any teacher, student, or outsider who deploys their own GAS web app anywhere in the world gets a matching googleusercontent origin and a self-minted nonce, and could then embed the game and receive students' save payloads (workspaces + sanitized evidence) or return forged acknowledgements. The only thing that authenticates the parent is the exact origin (which encodes the specific deployment) checked against a build-time constant. Note also the asymmetry of available defenses: GitHub Pages sends no `X-Frame-Options`/`frame-ancestors` and cannot be configured to (no custom headers; `frame-ancestors` in a `<meta>` CSP is ignored), so malicious embedding cannot be header-blocked — exact-origin pinning and never trusting parent-supplied data are the entire defense. If Probe 2 shows the sandbox origin is unstable across routine redeployments, the fallback is to treat the parent as unauthenticated until server correlation (e.g., a server-issued, account-bound bootstrap token the parent must present), not to broaden the origin pattern.
- **Why it matters in a classroom:** A lookalike shell linked from a student forum could harvest a class's work products and fabricate "saved" states; the teacher's Sheet would show nothing wrong because no server writes occur.
- **Evidence:** HtmlService sandbox origin on `*.script.googleusercontent.com` (restrictions doc); proposal line 122-125 (observed: no frame headers on the Pages deployment); GitHub Pages has no custom-header mechanism; nonce generation is parent-side per the proposal's own handshake (249).
- **Smallest recommended change:** Pin the exact measured parent origin as build config; document a redeployment runbook (new deployment ⇒ new origin ⇒ rebuild/redeploy the static app or update config); add a student-visible "school connection could not be verified" fail-closed state. Reject regex allowlisting in the proposal text.
- **Falsification test:** (Probe 2) Measure the sandbox origin across versions of one deployment, across a *new* deployment, and across two user sessions; report whether exact pinning survives routine "manage deployments → new version" and what breaks on "new deployment".

---

### Finding K7 — Districts that block third-party site data break the fail-open promise: unguarded `localStorage` access throws, and embedded storage may be ephemeral

- **Severity:** major in affected districts; moderate fleet-wide
- **Status:** plausible-needs-probe (district policy prevalence); confirmed that current availability probes are not exception-guarded
- **Proposal location:** *Failure Behavior* "Fail open for gameplay/local persistence" (698–700); Probe 3 (760–768)
- **Finding:** In the GAS-embedded context the app is third-party. Chrome's storage partitioning normally still allows partitioned `localStorage`/IndexedDB, but a district that blocks third-party cookies/site data (a one-line admin policy) can make embedded storage denied or ephemeral. Today's availability checks are bare `Boolean(window.localStorage)` reads (`src/core/levels.js:27-29`, `src/ai/blockly/workspace.js:944, 999`) that themselves throw `SecurityError` in blocked contexts, and the workspace save's `setItem` is not try/catch'd (`workspace.js:1004`) — so the failure is not graceful degradation but an exception during boot or play, breaking the proposal's core fail-open guarantee exactly where it is most needed. Even without a hard block, ephemeral (cleared-on-exit) embedded storage means "local-first" silently becomes "memory-only" between sessions.
- **Why it matters in a classroom:** One district policy change turns the classroom mode into a crash-on-load for every student, with no in-app explanation.
- **Evidence:** unguarded access at `levels.js:27-29`, `workspace.js:944/999-1004`; tracker-side degradation already exists and is the model to copy (`usageTracker.js:240-242` keeps a memory-only tracker); Chrome storage-partitioning and 3P-blocking behavior per partitioning docs.
- **Smallest recommended change:** Exception-guard every storage availability probe (cheap, independent of the cloud work); detect denied/ephemeral storage at bootstrap and show an explicit "browser storage is blocked on this device — your work will not be saved between sessions" state; add a blocked-3P-storage configuration to Probe 3.
- **Falsification test:** (Probe 3) Chrome with "Block third-party cookies/site data" enabled (or equivalent policy): app must boot, play, and report storage status without an uncaught exception.

---

### Finding K8 — The manual migration fallback's upload half does not exist; the "fallback" is a new import surface that must be scoped and validated

- **Severity:** moderate
- **Status:** confirmed
- **Proposal location:** *Schema-v2 Migration* (574–590), "A manual download/upload remains the fallback" (589)
- **Finding:** The proposal's phrasing implies download/upload exists. It does not: usage exports are explicitly "evidence, not a save file" with no import path (`docs/subsystems/file-pipelines.md:80-88`; zero import matches in `src/`), guided progress has no import path, and the only import UI is Free-Play-only workspace XML / encrypted private programs (`src/ui/controls.js:343-376`), hidden in Guided mode by design (`docs/subsystems/ui-mode-contract.md:48-54`). So the fallback requires a new package-import surface (file picker or paste box, schema validation, size caps) reachable in the migration context. Since Gemini Finding 2 (popup `postMessage` fragility across Google auth redirects — I concur) likely demotes the live handshake to optional, this import surface is probably the **primary** migration path, not a fallback, and should be built first in the migration workstream. Its validation must treat the file as hostile: a student can hand-edit a downloaded package to inflate their own progress — acceptable (self-harm, same trust level as today's self-reported export), but restored state must never be presented as evidence, and the envelope should carry an honest `migrationFlags` marker.
- **Why it matters in a classroom:** On managed Chromebooks with popup restrictions, the manual path will be the common path; if it is scoped as an afterthought, migration week stalls the whole class.
- **Evidence:** `docs/subsystems/file-pipelines.md:80-88`; `src/ui/controls.js:343-376, 532-561`; `docs/subsystems/ui-mode-contract.md:48-54`.
- **Smallest recommended change:** Amend the migration section: the package import surface is a first-class deliverable of the migration workstream; the popup handshake is an optional convenience layered on it if Probe 3 shows it survives.
- **Falsification test:** (Probe 3) Round-trip a synthetic migration package through file export → import on a second device/profile; verify schema validation, size caps, and conflict-matrix integration.

---

### Finding K9 — Owner decision 6 (student self-service "Use this device's copy") rests on recovery machinery that does not exist yet

- **Severity:** moderate
- **Status:** owner-decision (premise currently unmet)
- **Proposal location:** *Remaining Owner Decisions* item 6 (889–891); conflict options at 545–551
- **Finding:** The decision's premise is "provided the displaced cloud revision is recoverable for seven days." But the seven-day recovery requires Drive revision management that DriveApp cannot do (K2), the "recoverable local backup" of a displaced local copy is device-bound (on a shared machine it can be wiped or belongs to another student's profile), and no packet yet implements either. Ratifying student self-service overwrite before the recovery mechanism exists and passes Probe 5 converts a recoverable mistake into permanent loss.
- **Why it matters in a classroom:** A 15-year-old facing a conflict dialog at 8:55 AM will click something; the safety net must exist before the scissors are handed over.
- **Evidence:** proposal lines 545–551 and 658–660 promise recovery windows; no implementing mechanism is specified anywhere; DriveApp revision limitations per K2.
- **Smallest recommended change:** Sequence the ratification: decision 6 takes effect only after revision/archival recovery is implemented and probed; until then default to "Download both / ask teacher."
- **Falsification test:** (Probe 5) Force a diverged conflict, choose "Use this device's copy," then recover the displaced cloud revision seven days later using only the implemented recovery path.

---

### Finding K10 — Identity lifecycle edges: multi-login misattribution, account renames, disabled accounts, substitutes; and HMAC keys should become plain random roster keys

- **Severity:** moderate
- **Status:** plausible-needs-probe (multi-login); confirmed that email-derived keys break on rename
- **Proposal location:** *Identity And Deployment Model* (180–216), HMAC at 191–193
- **Finding:** Four edges the proposal does not address: (1) **Multi-login**: students signed into several Google accounts at once can hit the web app under the wrong authuser, and known GAS behavior can attribute to the browser's default account; within one domain (e.g., siblings on a family device, or a teacher demoing while signed in as a student too) that yields a *valid-domain but wrong* account — fail-closed does not catch it. (2) **Renames**: district email renames (name changes, corrections) break any email-derived key, including the HMAC input. (3) **Disabled accounts** fail closed — fine, but the teacher needs a documented roster procedure, not a sync error. (4) **Substitutes/late enrollees** not on the roster fail closed — the roster-maintenance procedure belongs in the TeacherGuide before pilot. On the HMAC question the review prompt raises: HMAC(email+cohort) buys deterministic derivation but costs a managed secret, rotation questions, and rename fragility. A random per-cohort record key stored in the teacher-private roster Sheet achieves the same opacity without any secret, and roster membership is already a Sheet lookup, so no query is saved. I also **disagree** with Gemini Finding 6's remedy of human-readable email filenames — that reintroduces identity into Drive UI surfaces (screenshots, shared screens, accidental link shares) the proposal's checklist deliberately excludes; Gemini's underlying triage concern is real, but the right fix is making the index Sheet the triage surface plus a teacher-only "open current file for this account" server action, not readable filenames.
- **Why it matters in a classroom:** Misattributed records corrupt the one signal the teacher is told to trust; rename handling decides whether mid-semester account changes orphan a student's record.
- **Evidence:** `Session` identity caveats (Session doc; known multi-account/default-account behavior in GAS HTML contexts); proposal lines 191–193 (HMAC), 209–216 (roster Sheet already required); privacy checklist lines 856–869.
- **Smallest recommended change:** Replace HMAC derivation with random record keys in the roster Sheet; add Probe 1 cases for multi-login, rename, disabled, and unrostered accounts; add a signed-in-account display in the GAS shell (already suggested at line 227) with an explicit "Not you? Switch account" affordance so misattribution is visible before any save.
- **Falsification test:** (Probe 1) Two synthetic accounts signed into one browser profile; verify which account the server derives from each authuser context, and whether the shell display lets a student notice the wrong one.

---

### Finding K11 — Classroom time and comprehension: first-day auth/migration cost, missing status strings, and new teacher visibility of PvP strategies are unbudgeted

- **Severity:** moderate
- **Status:** plausible-needs-probe (time cost); confirmed (new visibility)
- **Proposal location:** *Failure Behavior* states list (686–695); *PvP contract* (626–643); teacher workflow (718–735)
- **Finding:** (1) The documented lesson shape is a 50-minute period with 35 minutes of main play (`docs/TeacherFacilitationKit.md:25-32`). Day-0 Google authorization plus roster enrollment plus migration for 30 students can plausibly consume 10–20 minutes of that — the proposal never budgets it or scripts it for teachers. Direct mode remaining the zero-setup path is the mitigation; say so in the TeacherGuide. (2) The status list is good but lacks the two states this review shows are necessary: "signed-in account differs from this device's saved work" (K1) and "another tab/device is active" (the duplicate-tab guard at 513–518 has no corresponding status string). (3) Cloud storage makes both PvP team workspaces visible in the teacher's Drive folder; today strategy privacy is scoped to classmates via the encrypted-file "privacy friction" model (`docs/subsystems/file-pipelines.md:43-56`). Teacher visibility is acceptable — teachers may inspect work — but it is a documented-semantics change that belongs in the subsystem note and TeacherGuide so nobody believes encrypted export still bounds visibility. (4) On pedagogy: honestly, nothing in the docs frames the manual export ritual as a learning goal — saving is already automatic (`help.html:121`), and reflection pedagogy lives in prediction checkpoints, not file handling. Cloud sync removes friction without eroding a documented responsibility ritual; the "responsibility" concern in the review prompt is not supported by repo docs.
- **Why it matters in a classroom:** Unbudgeted setup time is the classic way sound systems get abandoned after one chaotic period.
- **Evidence:** `docs/TeacherFacilitationKit.md:25-32`; `docs/subsystems/file-pipelines.md:43-56`; `help.html:121`; proposal lines 227, 513–518, 686–695.
- **Smallest recommended change:** Add the two status strings; add a TeacherGuide "first cloud day" procedure (roster first, direct mode as fallback, migration as homework-or-lab choice); document teacher Drive visibility of PvP workspaces in `file-pipelines.md` when the time comes.
- **Falsification test:** Pilot dry-run with one small class or even the teacher plus two students: measure wall-clock from "open the link" to "first checkpoint acked."

---

### Finding K12 — Conflict-matrix row mislabeled (documentation defect)

- **Severity:** minor
- **Status:** confirmed
- **Proposal location:** Conflict matrix, line 539
- **Finding:** The row "Local dirty, cloud still at local base revision" puts "Older than local changes" in the *Cloud state* column, which describes a relationship, not a state; as written it invites an implementer to invent a timestamp comparison the adjacent text forbids (508–510).
- **Why it matters in a classroom:** The matrix is the implementer's contract for not losing student work; ambiguity here is how silent-overwrite bugs get written.
- **Evidence:** proposal line 539 vs 508–510.
- **Smallest recommended change:** Reword the cloud column to "Unchanged since local base revision."
- **Falsification test:** n/a (documentation).

---

### Finding K13 — The self-reported student name still rides inside the "sanitized" payload

- **Severity:** minor
- **Status:** confirmed
- **Proposal location:** *Export And Submission Behavior* (600–624)
- **Finding:** The v2 export carries the typed `studentName` at top level **and** inside the `export_requested` event (`src/usage/usageFormat.js:554-578`; verified in a real regression export). The proposal says the child payload's self-reported name must not be authoritative (616, 622) but never says the evidence builder must drop or blank it. If the reusable builder is carved out of `exportUsageFile` as-is, the self-reported name ships to the cloud and into teacher surfaces where it can be mistaken for identity.
- **Why it matters in a classroom:** A jokey or wrong typed name appearing next to an authenticated account undermines the attribution clarity owner decision 1 is paying for.
- **Evidence:** `src/usage/usageFormat.js` export assembly; `tests/regression/output/` real exports contain the name twice.
- **Smallest recommended change:** The evidence-builder API omits (or explicitly labels as self-reported) the name field in GAS mode; teacher UI labels it "self-reported" if displayed at all.
- **Falsification test:** Unit test: GAS-mode evidence package contains no authoritative name field; existing v2 analyzer contract unchanged.

---

### Finding K14 — Index-Sheet operational gaps: "bounded" receipts with no bounder, and no protection against teacher hand-edits during writes

- **Severity:** minor
- **Status:** confirmed (underspecification)
- **Proposal location:** *Teacher index Sheet* (463–498)
- **Finding:** (1) Receipts are specified as "bounded rows" but nothing bounds them — no pruning trigger, no cap number, and time-driven triggers carry their own quotas; for v1 a manual teacher "compact receipts" action is an acceptable answer and should be stated. (2) The Students tab is simultaneously the server's write target and the teacher's browsing surface; a teacher hand-editing a computed row mid-burst gets silently overwritten (or worse, their edit survives and desynchronizes the index from the envelope, which the reconciliation logic then "repairs" in the wrong direction).
- **Why it matters in a classroom:** Teachers will sort, annotate, and "fix" spreadsheets; that is what spreadsheets invite.
- **Evidence:** proposal lines 482–495 (no pruning mechanism); reconciliation promise at 428–429.
- **Smallest recommended change:** State the v1 receipts bound (e.g., keep latest N rows per student; manual compaction); mark roster/config tabs as teacher-editable and computed tabs as do-not-edit, enforced by Sheet protected ranges (the server, executing as owner, is unaffected by protection).
- **Falsification test:** Probe 6: hand-edit a computed row during a synthetic save burst; verify reconciliation behavior matches a written expectation.

---

## Strengths worth preserving

1. **Server-derived identity with fail-closed semantics, and the explicit refusal to let attribution become an authorship claim** (trust table, 169–179; honesty framing, 61–64). This matches the repo's existing integrity language exactly (`docs/subsystems/usage-and-admin.md:149-154` — hash is not identity) and protects teachers from overclaiming.
2. **Compare-and-swap revisions with clocks demoted to advisory** (502–510) — the correct conflict primitive; timestamps-as-winner would have been a silent-loss machine.
3. **The probe gate**: "No source implementation packet should be ratified until the first four probes succeed" (739) is the right posture for tenant- and browser-dependent claims, and the proposal's falsifiers are genuinely falsifying.
4. **Local-first fail-open with a durable outbox**, preserving the current behavior where gameplay never waits on a network (382–387, 698–700) — this is what keeps the change from being a classroom reliability regression. (K7 covers the one place the promise currently leaks.)
5. **Evidence-builder separation from the name prompt + Blob download** (331–338): the current coupling (`src/ui/controls.js:489-522`) is real, and the proposal's direction preserves the existing v2 contract rather than inventing a parallel one.
6. **Retention thoughtfulness**: cohort-scoped keys, dry-run-before-automation purge, and "cloud collection does not automatically authorize indefinite analytics retention" (669) align with the repo's existing privacy rules (`docs/CohortUsageAnalysis.md:26-28`).
7. **Keeping `admin.html` as the analyzer** and the Sheet as a glance surface (718–735) instead of reimplementing analytics inside Apps Script — the correct scope cut.
8. **PvP honesty**: the second hot-seat player is `unattributed`, labels are self-reported display metadata, and PvP is excluded from grading defaults (626–643) — consistent with the repo's documented "privacy friction, not a security boundary" stance.

## Missing owner decisions (new; proposal's seven and Gemini's four remain open)

1. **Account-dimensioned local state** (from K1): ratify account-namespaced/quarantined local state with a wrong-account status and no auto-adoption. *Recommendation: yes — this is the cheapest fix in the review relative to the harm prevented.*
2. **Purge mechanics** (from K2): approve Advanced Drive Service as a dependency, purge-by-file-replacement, and a replaceable identity-mapping artifact; and confirm with the district, as questions not conclusions: (a) is a post-purge exposure window of up to 30 days (Drive trash/revisions) acceptable or must deletion be immediate; (b) does any grading/appeal window exceed the 90-day evidence default; (c) is Sheets version-history visibility to the teacher alone (no students/parents) acceptable for the active-cohort period.
3. **Cross-cohort continuation** (new): when a student returns next term under a new cohort-scoped key, do they resume prior portable state (if within grace) or start fresh? The current text implies fresh; confirm, because teachers will ask.
4. **Free Play/PvP sync scope** (Gemini's decision 2 — I disagree with his remedy): Gemini recommends excluding Free Play/PvP from automatic sync. The contamination he diagnoses is real, but its mechanism is the missing account dimension (K1), not the modes; excluding the modes also excludes exactly the workspaces students most want to keep across shared machines. *Recommendation: keep sync for all modes behind the K1 account guard, with PvP excluded from grading defaults as proposed.* If the K1 guard is rejected, Gemini's scoping is the correct fallback.
5. **Migration import acceptance** (from K8): confirm students may import a package file they could have edited, given schema validation and "restored state is not evidence" labeling. *Recommendation: yes; same trust level as today's self-reported exports.*

## Recommended revisions to the proposal

1. Add an **account dimension to the local storage model**: account-tagged records, quarantine-on-mismatch, "wrong account" status string (K1).
2. Rewrite the **retention/purge mechanics**: Advanced Drive Service dependency, purge-by-replacement for envelope and mapping artifacts, explicit statement that row deletion ≠ history deletion, residual-copies note (K2).
3. Rewrite the **load budget** to de-lock Drive writes (adopt Gemini F1's fix), name the 30-simultaneous-executions deployer ceiling, and mandate client jitter + idempotent retry (K3).
4. Make **archive-on-displace mandatory** on `sessionId` change, and close the historical-migration question with the 7-day/20-session bound (K4).
5. Promote the **boot coordinator** to a named workstream item with startup-ordering tests, and state that production URL-param/embed detection is new surface (K5).
6. Replace the open origin question with **exact-origin pinning + redeployment runbook**; explicitly reject regex allowlists and state the no-headers constraint of GitHub Pages (K6).
7. Add **blocked-storage hardening** (exception-guarded probes, memory-only status) to the integration work; note it also fixes a latent direct-mode bug (K7).
8. Make the **manual package import** the primary migration path deliverable; demote the popup handshake to optional (K8, confirming Gemini F2's diagnosis).
9. Sequence **owner decision 6** behind implemented, probed recovery (K9).
10. Replace **HMAC keys with random roster-stored keys**; add identity-lifecycle probe cases; keep opaque filenames and make the Sheet + a teacher "open current file" action the triage path (K10; disagreeing with Gemini F6's remedy).
11. Add the two **missing status strings**, the day-0 teacher procedure, and the PvP-visibility doc note (K11).
12. Fix the conflict-matrix label (K12); strip/label the self-reported name in GAS-mode evidence (K13); specify the receipts bound and Sheet tab protection (K14).

## Recommended changes to the probe sequence

- **Probe 1 (identity):** add multi-login (two accounts, one profile), renamed account, disabled account, and unrostered account cases. Record which account the server derives in each authuser context.
- **Probe 2 (iframe/origins):** measure sandbox-origin stability across (a) new version of the same deployment, (b) a new deployment, (c) two user sessions; decide exact-pin feasibility from data, not assumption. Recheck Pages frame headers (already listed).
- **Probe 3 (embedded storage/migration):** add a run with third-party site data **blocked**; add the same-profile two-account case (K1 falsifier); make the file/paste import round-trip the primary migration test and the popup handshake secondary.
- **Probe 4 (load):** explicitly measure the 30-concurrent-execution ceiling (35 simultaneous synthetic checkpoints) and lock-timeout/p95 latency with and without the global lock and with jitter; include the 100–285 KB real export sizes as payload fixtures (they already exist under `tests/regression/output/`); ignore `scratch/test-v2-export.json` (1,230 B) as size evidence.
- **Probe 5 (conflict/offline):** add the account-mismatch adoption test and the displaced-revision recovery drill (seven-day path).
- **Probe 6 (teacher extraction/purge):** add three-channel recovery attempts after purge (Sheets version history, Drive revisions via Advanced Drive Service, Drive Trash), a whole-spreadsheet-replacement purge drill, and the teacher-edit-during-burst case.
- Add to every probe: tracked artifacts record only synthetic/deidentified aggregates (consistent with the repo's `local/` rules).

## Rival designs reconsidered

For each: what observation would make it preferable to the proposal's shape.

1. **GAS final-submission relay only (no cloud restore).** Preferable if Probe 2 or 3 fails (origin pinning impossible, embedded storage unreliable, boot-barrier refactor proves destabilizing): it keeps the teacher-visible account receipt and kills the manual-download friction while deleting the entire CAS/lease/conflict/outbox/migration surface. Also the correct pilot-fallback if conflict dialogs prove confusing in the classroom pilot.
2. **Sheet-only bounded summaries.** Preferable only if the teacher workflow demonstrably never needs per-student evidence detail. Contradicted today: the existing teacher workflow centers on feeding full v2 exports into `admin.html`/CLI analyzers (`docs/subsystems/usage-and-admin.md:158-178`), and Sheet cells cap at 50K characters — real exports (107–285 KB) do not fit. Rejected for anything beyond the index role the proposal already gives it.
3. **Drive-only per-student files, no Sheet index.** Preferable if the Sheet's privacy surface (version history, K2) or concurrent-edit hazards (K14) prove unmanageable, at the cost of the whole-class glance. Note the roster must still live somewhere, so this does not eliminate the identity-mapping problem — it relocates it.
4. **Separate portable-state and evidence files.** Preferable if probes show envelope coupling bugs (state-only saves clobbering evidence) or if the tiered cadence (Gemini F5: frequent tiny state writes, rare heavy evidence writes) cannot be expressed safely in one file. Cost: two Drive writes per full checkpoint instead of one, doubling K3's critical-section pressure. The single envelope with tiered payloads achieves the same decoupling without the extra write; keep the envelope unless evidence-clobbering appears in Probe 5.
5. **One combined current envelope (the proposal's choice).** Reasonable with tiered payloads and archive-on-displace; the example JSON's role separation is clear.
6. **GAS hosting a copied build instead of framing GitHub Pages.** Preferable if Probes 2/3 fail outright: serving the app from HtmlService eliminates cross-origin `postMessage`, storage partitioning, and frame-header risk entirely, at the price of release drift (every app release requires a teacher redeploy), single-file bundling constraints, and stale-service-content risk. It is the strongest fallback architecture and should be named as such in the proposal.
7. **Remain entirely local/manual.** Preferable if Probe 1 fails tenant-wide (no reliable active-user identity) or if the pilot shows sync consuming class time without continuity payoff. The proposal already preserves this as fail-open; that preservation is non-negotiable whichever shape ships.

## Verdict

**Ready after bounded proposal revisions.**

The architecture's spine — static client, domain-restricted GAS parent, server-derived identity, CAS revisions, local-first outbox, probe-gated implementation — is sound and honestly scoped. I agree with Gemini's verdict class and his two critical findings, but the revision set is larger than his: this review adds the missing account dimension in local state (K1), the version-history/revision-history defeat of the promised purge (K2), the 30-simultaneous-executions ceiling (K3), the boot-refactor scoping (K5), and a reasoned rejection of two of Gemini's remedies (regex origin allowlisting, K6; readable filenames, K10) and one of his owner-decision recommendations (Free Play/PvP sync exclusion, decision 4 above).

Nothing here requires a third architecture round: every critical/major finding has a bounded revision stated above. The flip conditions are explicit: if Probe 1 fails tenant-wide, fall to rival 7 (local/manual); if Probes 2–3 fail, fall to rival 6 (GAS-hosted copy) or rival 1 (submission relay) rather than weakening identity or origin checks.

**What should change next:** the owner answers the five new decisions above (plus the previously open eleven), the proposal text absorbs revisions 1–14, and only then do probes 1–4 run as the architecture gate they were designed to be.
