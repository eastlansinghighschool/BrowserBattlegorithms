# Plan 120 progress report

Date: 2026-09-01

## Overall summary

Implemented the requested revision of the Plan 120 owner-run GAS probe workflow. The public child
page remains a standalone diagnostic shipped by the repository's existing GitHub Pages build at
`/integration-probe/nested-frame-child.html`; no separate hosting provider or p5.js surface is
required. The GAS shell and identity probe remain quarantined under `integrations/` and outside the
Vite build graph.

The handoff is now designed for distributed runs. The pages emit an allowlisted `PLAN120_RESULT`
block that an operator or student can paste into an email or chat message. It contains controlled
labels, statuses, viewport dimensions where relevant, and a random run id; it excludes exact
origins, URLs, sentinels, names, email addresses, expected domains, raw settings, and account ids.
The exact origin and identity values remain visible only on the local page for the operator's
comparison.

The Gate 1 storage workflow now requires separate localStorage and IndexedDB direct controls and a
short versioned receipt before framed classification. The directions require the direct and framed
steps to use the same device, browser, profile, and child URL with no cleanup between them; direct
and framed cleanup happen separately after the run. Gate 2 now uses fixed metadata/settings choices
and an explicit intended-viewer match control, including a wrong-account/same-domain check.

No app runtime, game, level, Blockly, production integration, Google Workspace deployment, or
classroom data changed. The implementation change is committed as `739bf9e`.

## Advisor consultation disposition

A requested read-only Sol consultation was dispatched as a projectless task with requested model
`gpt-5.6-sol` and high reasoning effort. It completed in approximately five minutes and made no
repository writes. The advisor's final message identified its model as `GPT-5 (Codex)`, so the
literal Sol model identity was not independently confirmed; this is recorded as advisory input,
not as a provider-capability claim. The repository state was checked after the consultation before
the edits below.

| Advisor recommendation | Disposition | Independent verification and result |
| --- | --- | --- |
| Replace raw JSON copying with an allowlisted email-safe report | Accepted change | Before implementation, the child and identity page were inspected for their copy controls and output construction; both probes now emit a `PLAN120_RESULT` block and provide a selectable textarea fallback. |
| Replace the blind direct-storage confirmation with separate controls and a receipt | Accepted change | Before implementation, the child’s storage state showed one operator confirmation could mark both APIs passed; the revised source has independent localStorage/IndexedDB statuses, and the framed path verifies probe version, random run id, and both statuses. |
| Require same device/browser/profile and no cleanup between direct and framed storage | Accepted change | Before implementation, the storage classifier was checked for provenance gating; the revised source gates classifications on the declared same-context value, receipt, and no-cleanup workflow, while uncertain context reports `unknown`. |
| Keep exact origins local and report only comparison statuses | Accepted change | Before implementation, the proposed copied payload was checked for exact origin values; the revised source retains them only in the local context table and exports controlled origin status. |
| Add a deidentified Gate 2 report | Accepted change | Before implementation, the identity page’s server-rendered values and free-text controls were inspected; the revised output contains only allowlisted statuses/labels and excludes email, domain, URL, raw settings, and account identifiers. |
| Add an intended-viewer match control | Accepted change | The identity workflow was checked for a wrong-account/same-domain blind spot; the revised page records pass/fail/unknown without asking the operator to type an email. |
| Replace free-text deployment settings with fixed choices | Accepted change | The page’s operator-entered execute-as/access fields were identified as unconstrained report inputs; the revised source uses controlled selects and keeps the expected domain as a private on-page input. |
| Validate HTTPS, expected pathname, event source/origin, and probe version in the shell | Accepted change | Before implementation, the shell’s URL and message handlers were inspected and accepted messages without all of these checks; the revised shell rejects invalid path/protocol, null or mismatched origins, and version mismatches, and the child rejects shell/version mismatches. |
| Add durable operator directions and student/email handoff rules | Accepted change | The report folder was checked and had no durable directions file; `directions.md` is now the owner/operator run sheet with the distributed handoff rules. |
| Improve labels, focus retention, captions, overflow, fixed prompt text, and cleanup wording | Accepted change | The child’s rendered capability table, prompt text, and cleanup controls were inspected; the revised source contains action-specific labels, focus restoration, table caption/overflow, fixed `TEST` wording, and context-specific cleanup. |
| Preserve isolation, no server result writes, random sentinels, and separate Gate 2 deployment | Endorsement of existing behavior; no change | Repository boundaries, server-write absence, random sentinel use, and separate deployment were verified as already present, so this was not an accepted implementation change. |

There were no genuinely rejected, narrowed, or deferred advisor recommendations. Ten recommendations
were accepted because they directly corrected the requested distributed probe workflow, while the
eleventh item was an endorsement of behavior already required by the packet; the independent checks
above document why this was evidence-based acceptance rather than automatic deference.

Consultation cost/disposition: one projectless read-only consultation, no advisor mutation authority,
and no recommendation was allowed to override the packet, privacy boundary, or owner deployment
gate.

## Files changed in this revision

- `docs/development/plan-120-gas-probe-kit-and-integration-surface.md` — aligned the copy contract
  with the deidentified email/chat result block and added the durable directions artifact.
- `integrations/google-apps-script/README.md` — documented GitHub Pages child hosting, safe result
  copying, the same-device storage receipt, and the post-sign-off owner push handoff.
- `integrations/google-apps-script/probes/nested-frame/Shell.html` — strict HTTPS/path/origin/
  source/version handshake validation.
- `integrations/google-apps-script/probes/nested-frame/README.md` — revised receipt, no-cleanup,
  origin-status, and email-safe workflows.
- `integrations/google-apps-script/probes/identity/Page.html` — fixed metadata controls, intended
  viewer check, and allowlisted identity report.
- `integrations/google-apps-script/probes/identity/README.md` — revised distributed-run and safe
  result instructions.
- `public/integration-probe/nested-frame-child.html` — email-safe report, direct-storage receipt,
  separate storage attestations, safer capability controls, and cleanup/focus refinements.
- `reports/development/plan-120-gas-probe-kit-and-integration-surface/directions.md` — durable owner/operator directions
  for GitHub Pages preparation, both gates, distributed student runs, and result return.
- `reports/orchestration/gas-integration-commentary/probe-results/TEMPLATE.md` — removed exact
  origin fields from the tracked deidentified template and added email/chat intake rules.
- `tests/unit/integration-surface-hygiene.test.js` — guards the report, receipt, origin validation,
  and identity-viewer controls.

## Validation

- `node --test tests/unit/integration-surface-hygiene.test.js` — passed, 6/6.
- `npm test` — passed, 560/560.
- `npm run build` — passed. `dist/integration-probe/nested-frame-child.html` exists and
  `dist/integrations/` does not. The build retains the pre-existing Blockly dynamic/static import
  and large-chunk warnings.
- Inline browser-script compilation — passed for the public child, GAS shell, and identity page
  after replacing the Apps Script template expression with a test object.
- Headless browser smoke check against the local Vite page — passed: child loaded, no page errors,
  email-safe report rendered, direct storage receipt generated with separate statuses, and cleanup
  completed.
- Both Apps Script manifests parsed as JSON.
- `git diff --check` — passed; only normal Windows LF-to-CRLF warnings were reported.
- `node scripts/dev/plan-status.js check 120` — returned `BLOCKED: plan-120 has status "delivered"`.
  This is the expected status-tool guard for a delivered packet, not a validation failure or a
  request to change packet status.

The earlier Plan 120 hygiene proof remains valid: the guard catches a temporary fake deployment
URL, and the fixture was removed before the clean run. No deployment URL, real `.clasp.json`,
identity value, roster data, or class data was added.

## Owner next step and boundaries

After orchestrator sign-off, the owner may push the approved commit(s) to `main`. The existing
`.github/workflows/deploy-pages.yml` is configured to run on pushes to `main`; it installs
dependencies, runs tests and browser checks, builds the site, and deploys `dist/` to GitHub Pages.
The owner should wait for that workflow to succeed and verify the live child page and displayed
`plan-120-v1` version before deploying/running the GAS probes. This agent did not push or deploy.

## Remaining risks and follow-ups

- Neither probe has been deployed or run against Google Workspace by this agent. Real origin
  stability, inherited GAS sandbox behavior, student-OU storage policy, and tenant identity remain
  owner-run measurements.
- The browser check validated the standalone child locally, not the cross-origin GAS iframe
  handshake. The shell/child handshake still needs a real Apps Script deployment and HTTPS Pages
  URL.
- Download, modal, speech, and keyboard outcomes still require human observation; JavaScript cannot
  prove that a download shelf, dialog, audio output, or focus transition was perceived.
- Gate 2 Tier C renamed/disabled-account checks remain deferrable and require IT-provisioned test
  accounts. A blank, wrong, outside-domain, or ambiguous active identity remains a hard stop for
  account-attributed cloud mode.
- Build output retains unrelated existing warnings about Blockly chunking and chunk size.

## Follow-up repair and preliminary owner run

On 2026-09-02, the owner supplied a preliminary result from a personal Windows computer using the
then-available `managed-windows-device` / `staff-ou` selections. Those selections do not describe
the actual device context, so this is not district-device evidence and should not be entered as a
final tracked result. The page-level observations were all reported as human-observed pass:
direct-click blob download, delayed blob download, `confirm()`, `prompt()`, speech, and keyboard
reachability. The observed viewport was 1066 × 620; both storage APIs were reported unpartitioned;
cleanup remained unknown.

The run was still incomplete because the GAS shell crashed while handling the child handshake at
`Array.from(frame.sandbox.tokenList)`. Consequently, parent-origin, referrer, and sandbox context
fields remained unknown. The corrected shell now uses a defensive iterable check. The child and
identity pages also now offer `personal-windows-device` and other personal-device choices, capture
`unknown-ou` when appropriate, and include coarse browser family/major version and OS class in the
email-safe block without exporting the raw user-agent string.

The follow-up implementation is committed as `2cc0c5f`. Targeted hygiene (6/6), the full unit suite
(560/560), inline script compilation, production build, manifest parsing, `git diff --check`, and a
headless child-page check passed. The child page check is local only; the corrected cross-origin GAS
handshake still requires the owner to push, wait for GitHub Pages deployment, and rerun the real GAS
test. No new Google Workspace action was performed by this agent.

Ready for orchestrator review: yes
