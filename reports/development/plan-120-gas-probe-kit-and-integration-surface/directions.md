# Plan 120 probe directions

This is the owner/operator run sheet for the two disposable GAS probes. The probes measure the
proposed integration boundary; they do not implement the integration, send results to a server, or
store classroom data.

## Before anyone runs a probe

1. Obtain orchestrator sign-off on the approved repository changes.
2. The owner pushes the approved commits to `main`. The existing GitHub Pages workflow runs the
   repository tests and build, then publishes `dist/`. It prepares the child page at:
   `/integration-probe/nested-frame-child.html`.
3. Wait for the GitHub Actions Pages workflow to finish successfully. Open the child URL over
   HTTPS and verify that the page displays probe version `plan-120-v1`. If the page is missing,
   served over HTTP, or shows another version, stop and report that condition; do not run a GAS
   probe against it.
4. Do not use a commercial host, a p5.js sketch, or a manually uploaded alternate copy as the
   official child. The child is part of the GitHub Pages build. The GAS shell is the separate
   Apps Script project that frames it.

The owner performs deployment and account setup. A student or colleague may perform an assigned
measurement on their own device/account and return only the generated result block.

## Gate 1 — nested-frame capability and storage

### Deploy the shell

1. Create/deploy `integrations/google-apps-script/probes/nested-frame/` as its own Apps Script web
   app. Use **Execute as: deploying user** and **Who has access: anyone in the Workspace domain**.
   Gate 1 does not read identity and does not require a student account, although a student-OU
   managed device may be the condition under test.
2. Open the deployed GAS shell. Enter the exact GitHub Pages child URL and select **Load child in
   frame**. The shell accepts only HTTPS URLs ending in
   `/integration-probe/nested-frame-child.html`.
3. Wait for the successful handshake. A timeout, rejected origin, rejected path, or version
   mismatch is a failed/incomplete run. Do not interpret an empty frame as a capability pass.

### Required same-device storage sequence

The direct and framed portions are one paired measurement. They must use the same physical device,
browser, profile, and child URL. Do not clean up between them.

1. Open the exact child URL top-level on the measurement device.
2. Select **Direct top-level storage control**. Wait for both localStorage and IndexedDB controls
   to finish. The page creates random temporary sentinels and displays a short direct-control
   receipt containing only probe version, random run id, and separate localStorage/IndexedDB pass
   statuses.
3. Copy the direct-control receipt.
4. Return to the GAS shell, load the same exact child URL, paste the receipt into the framed page,
   and select **Verify direct-control receipt**.
5. Run the framed storage checks. Do not clean up until all framed storage observations and the
   email-safe report are complete. A missing direct sentinel without a verified receipt is
   **unknown**, not partitioned.
6. After the report is copied, select **Clean current context** in the framed page. Then return to
   the exact top-level child URL and select **Clean current context** there. Direct and framed
   cleanup are separate; a cleanup failure is recorded as a cleanup failure.

If the paired steps occur on different devices/profiles, or if cleanup happened between them,
choose **Different device/profile or context uncertain**. The storage classifications must then be
treated as `unknown`, even if the browser observations look plausible. Run a complete new pair for
each additional device, account tier, browser profile, or OU condition.

### Capability and origin observations

Choose the fixed **run condition**, **device class**, **OU class**, and **origin comparison** values.
For a non-district machine, use a `personal-*` device choice; for this Windows computer, choose
**Personal Windows device**. Keep the OU class as `unknown-ou` unless the device is actually
managed in a known organizational unit. The report automatically includes coarse browser family,
browser major version, and OS class so results from different computers can be compared; it never
includes the raw user-agent string.
Complete the action-specific observations for:

- direct-click blob download and delayed `setTimeout` blob download;
- `confirm()` and `prompt()` visibility;
- speech audibility;
- keyboard tab into and back out of the child; and
- usable inner viewport dimensions.

For origins, inspect the on-page context table locally and repeat the reading for all four
conditions: reload of the same deployment, second signed-in user, new version of the same
deployment, and new deployment. Use only `baseline`, `same-as-baseline`, `changed`, or `unknown` in
the report. Never copy exact origins into email, chat, or a tracked file.

Select **Copy email-safe report** only after the run is complete. If the clipboard is unavailable,
the page selects the report textarea for manual copying. This block is deliberately suitable for a
student to paste into an email or this chat. It contains controlled labels, statuses, viewport
   dimensions, and a random run id. It does not contain screenshots, raw JSON, raw user-agent strings, URLs, origins,
sentinels, names, emails, or account ids. Do not send the direct-control receipt as the result; it
is an intermediate same-device control.

## Gate 2 — tenant identity

1. Deploy `integrations/google-apps-script/probes/identity/` as a separate Apps Script web app,
   again using **Execute as: deploying user** and **Who has access: anyone in the Workspace
   domain**.
2. Open the page as the assigned account. Select the fixed account role, test condition, device
   class, OU class, and deployment-setting labels. For a non-district machine, use the matching
   `personal-*` device choice; for this Windows computer, choose **Personal Windows device** and
   normally use `unknown-ou`. Enter the expected Workspace domain only for the private on-page
   comparison, then choose **Evaluate private domain check**.
3. Without typing or sharing an email address, choose whether the displayed active identity
   matches the intended viewer. The server-derived active/effective values remain visible only to
   the current viewer.
4. Select **Copy email-safe report**. Send only that text block by email or chat. It contains the
   probe version, random run id, controlled condition/settings labels, fixed device/OU labels,
   nonblank/read statuses, intended-viewer result, domain-match status, active/effective
   relationship, and coarse browser/OS information. It excludes email addresses, expected domain,
   raw settings, raw user-agent
   strings, URLs, and account ids.

Run the assigned matrix as separate complete runs:

| Condition | Suggested operator | Required interpretation |
| --- | --- | --- |
| Tier A — teacher/deployer | Owner | Teacher-side identity must be nonblank, readable, and expected-domain. |
| Tier A — non-teacher | Synthetic non-teacher, preferably | A failure is a hard stop for account-attributed cloud mode. |
| Tier B — two-account comparison | Owner plus another domain account | Active identity must follow the intended viewer, not the first account. |
| Tier B — account switch | Same two accounts | Reload/reopen as needed; compare the newly active account without sharing it. |
| Tier C — renamed or disabled | IT-provisioned test account only | Deferrable degradation evidence; never use a real student for this. |

A real student may substitute for Tier A/B only with informed participation, their normal private
sign-in, and no identity value recorded or shared. A blank, unreadable, wrong, outside-domain, or
ambiguous active identity is a hard stop for account-attributed cloud mode. Do not repair it with a
client-supplied email.

## Returning results

The sender should paste the complete `PLAN120_RESULT` block into an email or chat message, with no
manual edits. A missing block, wrong `probe_version`, missing statuses, unverified storage receipt,
or a version mismatch is incomplete; rerun the assigned condition instead of guessing or editing
the block. Screenshots, raw JSON, browser-console output, exact origins, deployment URLs, sentinels,
names, email addresses, expected domains, and account ids must not be returned.

The teacher/orchestrator can copy these deidentified blocks into the tracked results template at
`reports/orchestration/gas-integration-commentary/probe-results/TEMPLATE.md`. Keep any troubleshooting
material under ignored `local/`. No student or operator needs access to this ChatGPT session to
perform a run; the result block is the handoff artifact.
