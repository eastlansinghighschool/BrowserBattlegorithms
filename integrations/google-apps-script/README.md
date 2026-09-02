# Google Apps Script integration surface

This directory contains owner-run probes and, later, the versioned source for the Google Apps
Script integration. It is deliberately outside the Vite build graph. Nothing under
`integrations/` is imported by `src/`, added as a Rollup input, or linked from a shipped app page.
The probes are diagnostic artifacts only; this packet does not implement the integration, a
protocol, an outbox, Drive storage, Sheets, roster checks, or an app account gate.

## Owner-only boundary

The implementing agent does not deploy, publish, install `clasp`, sign into Google, or run either
probe against Google Workspace. Only the owner performs those actions. The public child page is
plain static HTML/JS and is copied by Vite to `dist/integration-probe/`; it is not linked by the
game. The child stores only temporary random browser sentinels and sends nothing over the network.

## Secrets and privacy hygiene

Never commit or paste into a tracked file:

- script ids, deployment ids, `/macros/s/...` URLs, spreadsheet ids, or Drive folder ids;
- Script Property values, real `.clasp.json`, or deployment-specific configuration;
- roster data, student names/emails, raw identity output, or class exports.

The real `.clasp.json` is ignored. `clasp.json.example` contains only a deploy-time placeholder.
Raw console/JSON output, if troubleshooting requires retaining it, belongs under ignored `local/`.
Tracked results belong only under
`reports/orchestration/gas-integration-commentary/probe-results/` and must be deidentified
aggregates. The hygiene unit test is a backstop for common accidental artifacts, not a complete
secret scanner.

## Gate 1 — nested-frame capability probe

Source: `probes/nested-frame/`. Deploy this as its own web app with **execute as the deploying
user** and **who has access: anyone in the Workspace domain**. Gate 1 uses no student account.
Open the deployed shell, paste the exact public URL of
`/integration-probe/nested-frame-child.html`, and load it. The shell supplies that URL at runtime;
it is never hard-coded in tracked source. Use the child’s copyable JSON or its selectable textarea
fallback, then deidentify the results before tracking them.

The child must first be opened top-level at the exact URL and run **Direct top-level storage
control**. Then load that exact URL in the GAS shell. Run on a representative student-OU managed
device, recording the device class and OU (or `unknown OU`) alongside each storage result. A
teacher-device result does not establish student-device policy behavior. Use both cleanup controls
when finished.

Record the child origin across all four conditions: reload; a second signed-in user; a new version
of the same deployment; and a new deployment. One origin reading proves nothing. The probe reports
the explicit child-iframe sandbox attribute and what the child can introspect. It reports the
effective inherited GAS sandbox as unknown when the browser exposes no effective token set; the
individual capability observations are the evidence.

Use the operator confirmation buttons for direct and delayed blob downloads, `confirm()`,
`prompt()`, and speech. A JavaScript call that returns without throwing cannot prove a browser
download shelf, dialog, or audible speech was actually present. Also complete the keyboard
tab-in/tab-out check and record the numeric inner viewport.

Storage outcomes are independent:

- **partitioned**: direct control succeeded, the direct sentinel is absent in the frame, and a
  different framed sentinel round-trips;
- **unpartitioned**: the direct sentinel is visible in the frame;
- **blocked**: property/open access or a round-trip throws or is denied;
- **unknown**: the direct control is incomplete or the observations are contradictory.

An empty bucket is not evidence. Partitioned is expected and normal. Blocked is the Plan 118/F7
condition and is the point at which the owner may ask IT about domain allowlisting.

## Gate 2 — tenant identity probe

Source: `probes/identity/`. Deploy this as a **separate** web app, again with **execute as the
deploying user** and **who has access: anyone in the Workspace domain**. The deployment settings
are intentionally echoed from the operator’s deployment UI because the page cannot safely infer
them. The server evaluates `Session.getActiveUser().getEmail()` and
`Session.getEffectiveUser().getEmail()` and renders them only to the person viewing the page. It
writes and stores nothing. Never put the displayed email in a tracked result.

The architecture hard-fails for account-attributed cloud mode when active identity is blank,
wrong, outside the expected domain, or ambiguous. Do not work around that result by trusting a
client-supplied email. Local play may continue while cloud work stops for an owner decision.

Run the matrix in tiers:

| Tier | Condition | Needs | Falsifies |
| --- | --- | --- | --- |
| **A — hard fail** | Non-teacher active identity is nonblank, correct, and expected-domain under execute-as-deployer | One synthetic non-teacher account, or one real student | Account-attributed cloud mode entirely |
| **A — hard fail** | Teacher/deployer identity is nonblank, correct, and expected-domain | Owner’s account | Teacher-side operation |
| **B — pilot correctness** | Two accounts in one browser profile report the active account, not the first-signed-in account | Owner plus any one other domain account; teacher/student is sufficient | Shared-computer attribution story (the F2 failure mode) |
| **B — pilot correctness** | Account switching mid-session reports the newly active account | Same two accounts | Shared-computer attribution story |
| **C — degradation, deferrable** | Renamed account | IT-provisioned test account; cannot be done with a real student | Graceful mid-year rename behavior only |
| **C — degradation, deferrable** | Disabled account | IT-provisioned test account; cannot be done with a real student | Graceful withdrawal behavior only |

Tier C is not a Gate 2 blocker. Unrostered or late-enrollee rejection belongs to a later roster
validation packet and is not measured here.

Prefer one synthetic account for repeatability after redeploys or settings changes. One real
student may substitute for Tier A or B only if all three safeguards hold: record pass/fail only
and never an email in a tracked file; the student uses only their own normal sign-in and never
enters credentials in front of others; and the student is plainly told what is being tested. A
real student also reveals the actual student authorization/consent experience, which may be noted
without recording identity.

## Deploying from source

The owner may use the Apps Script editor by creating two separate projects and copying the files
from the relevant probe folder, or use `clasp` from a local working copy. For `clasp`, copy
`clasp.json.example` to an ignored `.clasp.json`, replace the local placeholder with the project’s
script id, set `rootDir` to the selected probe folder, and push/deploy from that local copy. Do not
put the local file back into this repository. In the Apps Script deployment dialog, select a web
app, choose the deploying user for **Execute as**, and choose **Anyone in the domain** for **Who
has access**. R1 needs only the owner; R2 then needs the owner plus the selected Tier A/B account.

Deployment URLs are entered into the browser or deployment UI only. They are never recorded in
tracked source or the deidentified results template.
