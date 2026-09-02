---
id: plan-120
title: "GAS Probe Kit And Integration Repository Surface"
status: delivered
depends_on: []
gate: "All three pre-mutation gate items RESOLVED 2026-09-01: repository location integrations/google-apps-script/ confirmed; probe child ships in public/; results split deidentified-tracked / raw-local. Before deploy: only the owner deploys or runs anything against Google Workspace."
summary: >-
  Build the artifacts the two cheapest GAS gates need — a nested-frame capability probe (Gate 1 / review Probe 0) and a tenant identity probe (Gate 2) — plus the repository conventions for GAS source, secrets hygiene, and deidentified probe results. Authoring only; the owner deploys and runs. No app behavior changes and no cloud integration is authorized by this packet.
---
# Plan 120: GAS Probe Kit And Integration Repository Surface

## Packet Metadata

- Packet id: `plan-120`
- Packet title: GAS Probe Kit And Integration Repository Surface
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-01
- Packet type: integration (authoring only)
- Mutation level: source-code (new non-shipping directory; one `public/` diagnostic page), docs, tests, repository config (`.gitignore`)
- Approval gate: before mutation — **all items resolved 2026-09-01**; the implementer restates them in the preflight plan and proceeds. Before deploy — this packet **never** deploys, publishes, or runs anything against Google Workspace; the owner does that.
- Depends on: nothing in-repo. (Gate 0 is effectively closed as of 2026-09-01 — see
  `reports/orchestration/gas-integration-commentary/district-it-questions.md`. Apps Script
  publishing, teacher-Drive storage, and unbounded retention are all permitted; the
  third-party-storage question was reclassified into this packet's own Gate 1 measurement.
  A synthetic non-teacher account is preferred for Gate 2 repeatability, but is not outstanding
  as a blocker: one real student may substitute for tiers A/B under R2's privacy conditions.)
- Blocks: every GAS Stage 1 packet. Per `review-synthesis.md`, no Stage 1 implementation packet is ratified until Gates 1 and 2 pass.
- Expected artifacts:
  - `integrations/google-apps-script/README.md` — operator deployment doc and secrets-hygiene rules
  - `integrations/google-apps-script/probes/nested-frame/` — GAS shell probe (server + parent page)
  - `integrations/google-apps-script/probes/identity/` — tenant identity probe (server + page)
  - `public/integration-probe/nested-frame-child.html` — the nested-frame probe child page (gate option A, owner-ratified 2026-09-01)
  - `reports/orchestration/gas-integration-commentary/probe-results/TEMPLATE.md` — deidentified results template with an explicit falsifier line per measurement
  - `.gitignore` entries for GAS tooling state and deployment ids
  - a repository-hygiene unit test catching common committed deployment URLs/config files and
    preventing cross-imports; it is a backstop, not a complete secret scanner
  - `AGENTS.md` and `docs/ARCHITECTURE.md` updates describing the new surface
  - progress report
- Progress report folder: `reports/development/plan-120-gas-probe-kit/`
- Progress report file: `reports/development/plan-120-gas-probe-kit/progress.md`

## Packet Summary

Goal: Put the two cheapest, highest-information GAS gates within one owner action of being answerable, and establish the repository conventions that all later GAS work will inherit.

Non-goals:
- **This packet does not implement the integration.** No protocol module, no outbox, no cloud evidence path, no Drive schema, no Sheet, no roster, no account gate in the app.
- No app behavior changes. The shipped game is unchanged except, at most, one standalone diagnostic page.
- No deployment. No `clasp` install, no `npm install`, no Google account action of any kind by the implementing agent.
- No real class data and no student identity in tracked probe results. Raw identity output, if it
  must be retained for troubleshooting, stays in ignored `local/` and is never quoted into a
  progress report. A synthetic account
  is preferred, but one real student may supply the non-teacher Gate 2 session under R2's
  pass/fail-only, normal-sign-in, informed-participation conditions.
- Do not resolve the parent-origin authentication dispute. Measuring origin stability is the *point* of the probe; choosing exact-pinning versus a server-issued proof is a decision for after the measurement (`review-synthesis.md`, "Disputed Remedies").

Depends on: nothing in-repo.

Blocks: all GAS Stage 1 packets.

Why this packet exists:
Four independent reviews agreed the GAS architecture is viable and that the proposal is not yet ready for implementation packets. The gating unknowns are not code questions — they are platform and tenant questions that only a real deployment can answer: what origin the child actually sees, what the inherited iframe sandbox actually permits, whether embedded storage actually works under district policy, and whether `Session.getActiveUser().getEmail()` is actually nonblank under execute-as-deployer in this tenant. The Claude review judged the nested-frame probe the highest information-per-minute item in the whole slate and recommended promoting it to run first, before any roster or account scheduling.

Right now the owner cannot run either probe, because the artifacts do not exist. This packet's entire job is to remove that blocker cheaply, and to do it in a way that does not prejudge any of the architecture decisions the probes are supposed to inform.

## Authority And Contracts

Required reading:

- `reports/orchestration/gas-integration-commentary/review-synthesis.md` — Gate 0/1/2/3 definitions; the Stage 1 / Stage 2 boundary; the disputed remedies and their dispositions.
- `reports/orchestration/gas-integration-commentary/review-claude.md` finding F13 and "Recommended Changes To The Probe Sequence" — the exact measurement list for the nested-frame probe and why each item matters.
- `reports/orchestration/google-apps-script-cloud-integration-proposal.md` — "Identity And Deployment Model", "Falsification Probes", and the Privacy And Operations Checklist.
- `AGENTS.md` — "Where Things Live", the static-deployment rule, and the never-commit-student-data rule.
- `vite.config.js` — the build graph is two explicit rollup inputs (`index.html`, `help.html`), so files outside that graph do not ship; `public/` **is** copied into `dist/`.
- `.gitignore` — current ignore families and the `local/` convention.

Contracts to preserve:

- The public app stays a static Vite deployment with no server dependency. `integrations/` must be outside the Vite build graph and must not become an app dependency.
- No secret, deployment id, script id, spreadsheet id, Drive folder id, roster, or student data enters a tracked path — ever, including in a probe.
- Probe results committed to the repository are deidentified aggregates only. Raw output goes to `local/` (already git-ignored).
- Game rules, levels, Blockly, UI, and pedagogy are untouched by this packet.

## Gate (before mutation)

**All three items resolved by the owner on 2026-09-01.** Item 1 = confirmed as recommended;
item 2 = **option A** (the probe child ships at `public/integration-probe/nested-frame-child.html`);
item 3 = as recommended. Restate them in the preflight plan; there is nothing left to stop for.
The rationale is retained below because later GAS packets inherit these conventions.

1. **Repository location — RESOLVED: confirmed.** Recommendation (matching `review-synthesis.md` remaining-decision 7): keep GAS source in this repository under `integrations/google-apps-script/`, excluded from the Vite build, with no committed deployment ids. Rationale: one repository keeps the protocol/schema source and its client consumer in the same commit, which is the only mechanism that reliably prevents client/server schema drift. The alternative — a companion repository — decouples versioning at exactly the seam where drift is most expensive. Owner ratifies or overrides.
2. **The probe child page location — RESOLVED: option A.** The nested-frame probe must measure the *real* pairing: a GAS shell framing a page served from the app's own public origin. That requires a page reachable at that origin. Options:
   - **(A, recommended)** Ship a standalone diagnostic page at `public/integration-probe/nested-frame-child.html`. It is copied to `dist/` by the existing build, is not linked from anywhere in the app, collects and transmits nothing, and carries a `noindex` meta tag. Cost: one unlisted public page on the live site.
   - **(B)** Serve the child from a temporary second static host. Cheaper politically, but it measures a different origin than production, which weakens exactly the origin-stability answer the probe exists to produce.
   - **(C)** Defer the probe until the deferred GitHub Pages publishing question is reopened. Slowest; the handoff records that the owner explicitly deferred that investigation.
   Note the interaction with the handoff: option A does not require reopening the publishing investigation, but it does require that a deploy of the current `dist/` reach the live site at some point. If that pipeline is not currently working, say so at the gate rather than discovering it during the probe.
3. **Probe results location — RESOLVED as recommended.** deidentified summary at `reports/orchestration/gas-integration-commentary/probe-results/`, raw console/JSON output in `local/` only.

## Scope

In scope:
- New `integrations/google-apps-script/` tree (README, two probe apps).
- The probe child page (location per gate).
- Results template.
- `.gitignore` additions.
- One repository-hygiene test.
- `AGENTS.md` / `docs/ARCHITECTURE.md` documentation of the new surface.

Out of scope:
- Everything in "Non-goals" above.
- `src/integration/` — the client-side integration module family is named in the Stage 1 sequence but is **not** created by this packet. Creating it now would mean writing a protocol against unmeasured platform behavior.
- Any change to `index.html`, `help.html`, `admin.html`, `workbench.html`, or any `src/` module.
- Any `package.json` dependency. `clasp` is an owner-side tool, not a repository dependency; the README documents its use without adding it.

Files and areas likely touched: `integrations/**` (new), `public/integration-probe/nested-frame-child.html` (new, gate-dependent), `reports/orchestration/gas-integration-commentary/probe-results/TEMPLATE.md` (new), `.gitignore`, `tests/unit/integration-surface-hygiene.test.js` (new), `package.json` (`test:unit` file list only), `AGENTS.md`, `docs/ARCHITECTURE.md`.

### New repository surface: `integrations/`

Proposed layout, to be documented in `AGENTS.md` "Where Things Live":

```text
integrations/
  google-apps-script/
    README.md                    # operator deployment steps; secrets-hygiene rules
    clasp.json.example           # placeholder only; the real .clasp.json is git-ignored
    probes/
      nested-frame/
        appsscript.json          # manifest (no ids)
        Code.gs                  # doGet -> HtmlService page
        Shell.html               # parent shell; child URL supplied at runtime, never hard-coded
        README.md                # how to run it, what each measurement falsifies
      identity/
        appsscript.json
        Code.gs
        Page.html
        README.md
    # (later, not this packet)
    # protocol/                  # versioned protocol + evidence schema, source of truth
    # src/                       # the real shell and server
```

Conventions this packet establishes, and that every later GAS packet inherits:

- **Not in the Vite build graph.** `integrations/` is never imported by `src/`, never added as a rollup input, and never referenced from a shipped HTML entry point. A future client-side integration module lives under `src/integration/` and talks to the shell only over `postMessage` — the two trees never import each other.
- **Schema drift is prevented mechanically, not by discipline.** When the protocol/evidence schema arrives (a Stage 1 packet), it lives in exactly one file under `integrations/google-apps-script/protocol/`. Because Apps Script cannot import ES modules from `src/`, the server-side copy must be *generated* from that source by a script under `scripts/`, with a test asserting the generated file is not stale — the lockfile pattern. Hand-maintained parallel copies are prohibited. This packet does not build that; it records the rule so no later packet invents a worse one.
- **No deployment-specific identifiers or configuration are committed.** The tracked probe source
  and manifests are intentionally deployable by the owner, but contain no script ids, deployment
  ids, `/macros/s/...` URLs, spreadsheet ids, folder ids, Script Property values, or `.clasp.json`.
  Runtime configuration is entered by the operator at deploy time or read from Script Properties,
  never from a tracked file.
- **Probes are quarantined from the real shell.** Probe code lives under `probes/` and is never promoted in place into `src/`; a later packet writes the real shell fresh. This prevents a diagnostic page with permissive settings from drifting into a production deployment.

## Work Plan

1. Read the required reading. Summarize, in the preflight plan, the exact measurement list for each probe and what each one falsifies.
2. Restate the three resolved gate items. Proceed unless current repository truth conflicts with
   the decision log; if it does, stop rather than choosing a side.
3. Create the `integrations/` tree, the README, and the hygiene rules.
4. Build the nested-frame probe (server, shell, child page).
5. Build the identity probe.
6. Write the results template.
7. Add `.gitignore` entries and the hygiene test.
8. Update `AGENTS.md` and `docs/ARCHITECTURE.md`.
9. Run validation; write the progress report, including explicit operator run instructions for the owner.

## Implementation Requirements

### R1 — Nested-frame capability probe (Gate 1)

Required behavior: a GAS HtmlService page that frames the child page and displays, from *inside the nested child*, every measurement below — on screen, in a copyable JSON block, with each result labeled pass / fail / unknown.

Measurements (from `review-claude.md` F13; do not drop any):

- child `location.origin` and the parent origin as the child observes it;
- the sandbox attributes the GAS parent can directly report for the child iframe, plus any
  sandbox information the nested child can actually introspect. Do not claim a directly readable
  "effective token set" if the browser exposes none; report that portion as `unknown` and treat
  the individual capability observations below as the authoritative evidence;
- blob download triggered **directly inside a click handler**, and separately from a `setTimeout` callback (these can differ; the app does both — `src/ui/controls.js` uses blob downloads for the usage export and the private program file);
- `window.confirm()` — does a dialog appear, or does it return `false` with no dialog (which would make *Reset Workspace to Starter* silently do nothing);
- `window.prompt()` — same question (the usage export name prompt depends on it);
- `speechSynthesis.speak()` — does audio play (voice narration is an accessibility feature);
- `localStorage` and `indexedDB`: report **partitioned**, **unpartitioned**, **blocked**, or
  **unknown** as distinct outcomes, never as one pass/fail. Emptiness alone proves nothing. The
  child page must support a top-level control run that writes a random sentinel to both stores;
  the operator then loads that exact child URL inside the GAS frame. Report *partitioned* only
  when the sentinel is readable in the direct top-level context, absent in the frame, and the
  framed context can round-trip its own different sentinel. Report *unpartitioned* when the
  direct sentinel is visible in the frame. Report *blocked* when property/open or round-trip
  access throws or is denied. Any incomplete or contradictory sequence is *unknown*. Provide a
  cleanup action for both contexts. Partitioned is expected and normal; blocked is the F7 /
  `plan-118` condition. Apply the same controlled comparison independently to localStorage and
  IndexedDB;
- keyboard reachability: can the operator tab into the child and back out;
- usable inner viewport width and height, reported as numbers.

**Device and organizational-unit protocol, recorded in the probe README:** the storage measurement must be taken on a **representative student-OU device**, not a teacher device. Chrome enterprise policy is applied per organizational unit and teacher and student OUs commonly differ, so a clean result on a staff machine says nothing about a student Chromebook. A spare managed device in a student session is sufficient — no students need to be present, and the probe collects and transmits nothing. Record the device class and OU (or "unknown OU") alongside every storage result; a storage result with no device provenance is not evidence.

Repeat-measurement protocol, recorded in the probe README: the operator must record `location.origin` across **at least** a reload, a second signed-in user, a new *version* of the same deployment, and a *new* deployment. Origin stability across those four is the evidence that decides the parent-authentication dispute; a single reading proves nothing.

Constraints:
- The child page must be served from the app's real public origin (per the gate decision) and must be plain static HTML+JS with no build step, no framework, and no imports from `src/`.
- The child transmits nothing anywhere. It renders results locally and offers copy-to-clipboard. No fetch, no beacon, no logging to the server.
- The shell takes the child URL at runtime (a form field or Script Property), never hard-coded into a tracked file.
- The child page carries `<meta name="robots" content="noindex">` and a visible one-line statement that it is a diagnostic page that stores and sends nothing.
- Failures must be reported as failures, not thrown. Every measurement is individually wrapped; one blocked API must not blank the page.

Edge cases: the child fails to load at all (the shell must say so rather than showing an empty frame); a measurement is inconclusive (report `unknown`, never guess); the sandbox blocks the copy-to-clipboard path itself (provide a selectable `<textarea>` fallback).

### R2 — Tenant identity probe (Gate 2)

Required behavior: a separate minimal GAS web app that reports, for whoever opens it, whether server-derived identity is usable.

Displays: whether `Session.getActiveUser().getEmail()` is nonblank; whether it matches the expected domain; the value of `Session.getEffectiveUser().getEmail()`; and an echo of the deployment's execute-as and access settings as configured. It writes nothing and stores nothing.

Constraints:
- Separate deployment from R1. Do not merge them: R1 needs no non-teacher account at all and should run immediately; R2 needs at least one and some scheduling.
- **Displays identity only to the person viewing it.** No Drive file, no Sheet row, no Script Property, no execution-log write of any email.
- The README states the hard fail plainly: blank or ambiguous identity is a stop for account-attributed cloud mode, not a thing to work around by trusting a client-supplied email.

**Run matrix, tiered by what each condition can actually falsify.** The README must present it this
way rather than as one undifferentiated list, because the tiers have very different account
requirements and only tier A is architecture-deciding:

| Tier | Condition | Needs | Falsifies |
| --- | --- | --- | --- |
| **A — hard fail** | Server-derived identity is nonblank, correct, and expected-domain for a **non-teacher** domain account under execute-as-deployer | One non-teacher domain account: a synthetic account **or** one real student | Account-attributed cloud mode entirely. If this fails, nothing downstream is worth building |
| **A — hard fail** | Same, for the teacher/deployer account | The owner's own account | Teacher-side operation |
| **B — pilot correctness** | Two accounts signed into one browser profile: does the probe report the **active** account, not the first-signed-in one | The owner's account **plus** any one other domain account — the teacher/student pair is a valid multi-login pair; a second synthetic account is **not** required | The shared-computer story. A wrong answer here is the F2 failure mode: one student's work attributed to another |
| **B — pilot correctness** | Account switching mid-session | Same two accounts | Same |
| **C — degradation, deferrable** | Renamed account | IT provisioning; **cannot** be done with a real student | Graceful behavior after a mid-year name change. An operational annoyance, not an architecture invalidator |
| **C — degradation, deferrable** | Disabled account | IT provisioning; **cannot** be done with a real student | Graceful behavior after a withdrawal |

- **Tier C is not a Gate 2 blocker.** Record it as a pre-pilot checklist item to run if and when
  provisioned accounts become available. Do not hold Stage 1 packet writing on it.
- Unrostered/late-enrollee rejection belongs to the later Stage 1 roster-validation and pilot
  checklist. This identity-only probe has no roster and must not pretend to test that behavior.
- **A real student may stand in for a synthetic account in tiers A and B**, with three conditions
  stated in the README: record pass/fail only and never an email address in any tracked file; do
  not create any situation where a student enters credentials in front of others beyond their own
  normal sign-in; and tell the student plainly what is being tested. Note that a real student also
  surfaces the true student-side authorization experience, including any consent screen, which is
  itself worth observing.
- **Prefer a synthetic account where one exists**, for a reason unrelated to privacy: repeatability.
  The probe should be re-runnable after a redeploy or a settings change without scheduling a
  student. One synthetic account has ongoing value past this single test; two are not needed.

### R3 — Operator README and secrets hygiene

`integrations/google-apps-script/README.md` must cover: what this directory is and is not; that
nothing here is part of the Vite build; step-by-step deployment for each probe (including the
execute-as and who-has-access settings each one requires, and why); the prohibited-artifacts list
(script ids, deployment ids, `/macros/s/...` URLs, spreadsheet and folder ids, Script Property
values, `.clasp.json`, any roster or student data); where raw results go (`local/`) versus
deidentified summaries (`reports/orchestration/gas-integration-commentary/probe-results/`); and
an explicit statement that Gate 1 uses no student account, while Gate 2 prefers a synthetic
account but permits one real student for tiers A/B only under R2's safeguards.

### R4 — Results template

`reports/orchestration/gas-integration-commentary/probe-results/TEMPLATE.md`, one row per
measurement, with columns: measurement, observed value, pass/fail/unknown, **what this observation
would have falsified**, and notes. Include the four-reading origin-stability table as its own
section with a blank row per reading condition. Include a header block for date, probe version,
browser and OS, device class (e.g. managed Chromebook 1366x768), and deployment settings — and an
explicit "no real student identity or data are recorded in this file" line. Give localStorage and
IndexedDB separate direct-control, framed-observation, framed-round-trip, cleanup, and disposition
rows so the report cannot infer partitioning from an empty bucket.

### R5 — Repository hygiene guardrail

Add `tests/unit/integration-surface-hygiene.test.js` asserting, over the tracked contents of `integrations/` and `public/integration-probe/`:

- no `script.google.com/macros/s/` literal;
- no `.clasp.json` file (only `clasp.json.example`);
- no `import` or `require` of anything under `src/`;
- the probe child page contains the `noindex` meta tag.

Add `.gitignore` entries for `integrations/**/.clasp.json` and `integrations/**/*.local.*`. Register the new test in the `test:unit` list in `package.json`.

Use positive and negative fixtures for every prohibited pattern. Do not invent a generic
"opaque-id-looking" regex: Google ids are not reliably distinguishable from benign hashes or
tokens, so such a test would be brittle and would overstate its protection. The test is a
backstop for common accidental artifacts, not proof that a tracked tree contains no secret;
state that limitation in its file header so a future agent neither deletes it as noise nor trusts
it as a complete secret scanner.

## Commands

```powershell
node --test tests/unit/integration-surface-hygiene.test.js
```

```powershell
npm test
```

```powershell
npm run build
```

Deployment commands are deliberately **not** listed. The implementing agent does not deploy.

## Validation Checklist

- [ ] `npm run build` passes and `dist/` contains no `integrations/` output.
- [ ] `dist/integration-probe/nested-frame-child.html` exists (gate option A, owner-ratified) and nothing in the app links to it.
- [ ] `npm test` passes; the hygiene test is registered in `package.json`.
- [ ] The hygiene test fails when a fake deployment URL is temporarily added (prove the guardrail works, then revert — record this in the progress report).
- [ ] No file under `integrations/` imports from `src/`, and no `src/` file imports from `integrations/`.
- [ ] Every F13 measurement appears in the probe and in the results template, with a falsifier stated for each.
- [ ] Each storage API has a successful top-level sentinel control before any partitioned /
  unpartitioned conclusion; incomplete comparisons report unknown. Partitioned, unpartitioned,
  blocked, and unknown remain distinct, and the template captures device class and OU.
- [ ] The origin-stability section requires all four reading conditions.
- [ ] The identity probe writes nothing and stores nothing.
- [ ] The identity run matrix is presented in tiers, tier C is marked non-blocking, and the real-student substitution conditions are stated in the README.
- [ ] `AGENTS.md` and `docs/ARCHITECTURE.md` describe `integrations/` and state it is outside the build graph.
- [ ] The progress report contains copy-paste operator instructions the owner can follow without reading the packet.
- [ ] No game, level, Blockly, UI, or `src/` behavior changed.

## Stop Conditions

Stop and ask for review if:

- any pre-mutation gate item appears unsettled after all three were resolved on 2026-09-01 (that would mean the packet and the decision log disagree — surface it rather than picking one);
- the probe cannot measure something on the F13 list without also collecting or transmitting data;
- building a faithful probe appears to require changing app source;
- the work starts drifting from "measure the platform" into "design the protocol" — the protocol is a later packet and depends on these measurements;
- the current build/deploy pipeline turns out to be unable to publish the probe child page (surface it; do not attempt to repair the publishing pipeline, which the owner has explicitly deferred).
