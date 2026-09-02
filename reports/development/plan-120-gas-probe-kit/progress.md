# Plan 120 progress report

Date: 2026-09-01

## Overall summary

Implemented the authoring-only GAS probe kit and repository surface. Gate 1 now has a separate
nested-frame Apps Script shell plus the public-origin child diagnostic page. Gate 2 has a separate
tenant identity Apps Script page. The repository documents the owner-only deployment boundary,
secrets hygiene, student-OU storage provenance, tiered identity run matrix, and deidentified-result
workflow. No app runtime, game, level, Blockly, UI, or `src/` behavior changed, and no Google
Workspace action was performed.

The three packet pre-mutation gates were confirmed resolved before editing: GAS source is under
`integrations/google-apps-script/`; the child is the owner-ratified
`public/integration-probe/nested-frame-child.html`; and tracked results are deidentified while
raw troubleshooting output belongs under ignored `local/`.

## Files changed

- `integrations/google-apps-script/README.md`
- `integrations/google-apps-script/clasp.json.example`
- `integrations/google-apps-script/probes/nested-frame/` — manifest, `Code.gs`, `Shell.html`,
  and probe README
- `integrations/google-apps-script/probes/identity/` — manifest, `Code.gs`, `Page.html`, and
  probe README
- `public/integration-probe/nested-frame-child.html`
- `reports/orchestration/gas-integration-commentary/probe-results/TEMPLATE.md`
- `tests/unit/integration-surface-hygiene.test.js`
- `.gitignore`, `package.json`, `AGENTS.md`, and `docs/ARCHITECTURE.md`

## Artifacts and behavior

The nested-frame child reports its own origin, the parent origin observed through referrer and
`postMessage`, the directly readable child iframe sandbox attribute, and an honest unknown for
the inherited GAS effective token set when it cannot be introspected. It provides independent
direct-click and delayed blob-download attempts, operator-confirmed dialog and speech results,
keyboard boundary instructions, viewport dimensions, copy-to-clipboard with selectable-textarea
fallback, and cleanup actions.

Storage is independently measured for localStorage and IndexedDB. A direct top-level sentinel
control is required before the framed page can classify the result. The child keeps partitioned,
unpartitioned, blocked, and unknown distinct; it requires the framed different-sentinel round-trip
for partitioned, treats property/open or round-trip errors as blocked, and leaves incomplete or
contradictory comparisons unknown. The page does not fetch, beacon, log, or send probe results.

The identity probe evaluates `Session.getActiveUser().getEmail()` and
`Session.getEffectiveUser().getEmail()` server-side and renders them only to the viewer. Expected
domain and deployment settings are entered for the current run and are not saved. Blank,
wrong-domain, or ambiguous active identity is stated as a hard stop for account-attributed cloud
mode. Tier C rename/disabled-account checks are explicitly deferrable and non-blocking.

## Owner operator instructions

These are the shortest run instructions; the owner does not need to infer deployment settings from
the source packet.

1. Build and publish the current `dist/` through the existing owner-controlled static-site
   process so the child is reachable at the public-origin path
   `/integration-probe/nested-frame-child.html`. Do not add the child to an app navigation link.
2. Create/deploy the **nested-frame** probe as its own Apps Script web app. Set **Execute as** to
   the deploying user and **Who has access** to anyone in the Workspace domain. Open its shell,
   paste the exact public child URL, and choose **Load child in frame**. Gate 1 needs no student
   account.
3. Open that same exact child URL top-level on the measurement device. Choose **Direct top-level
   storage control**, then return to the GAS shell and load that exact URL. If the child asks for
   confirmation that direct control completed, confirm only after the top-level localStorage and
   IndexedDB controls succeeded.
4. On a representative student-OU managed device (record device class and OU, or `unknown OU`),
   run the framed storage controls. Complete the direct/delayed download, confirm, prompt,
   speech, keyboard tab-in/tab-out, and viewport observations. Repeat the origin reading after a
   reload, with a second signed-in user, with a new version of the same deployment, and with a new
   deployment.
5. Copy the child JSON, or select the textarea if clipboard access is blocked. Put only aggregate
   pass/fail/unknown values into
   `reports/orchestration/gas-integration-commentary/probe-results/`; keep any raw output under
   ignored `local/`. Use both direct and framed cleanup controls.
6. Create/deploy the **identity** probe as a separate Apps Script web app with the same intended
   execute-as and domain-access settings. Open it as the teacher/deployer, then run Tier A with
   one non-teacher synthetic domain account if available. A real student may substitute only under
   the safeguards in the README: pass/fail only in tracked records, normal private sign-in, and
   informed participation.
7. Run Tier B with the teacher plus one other domain account in one Chrome profile, including
   account switching mid-session. Leave Tier C (renamed and disabled accounts) as a non-blocking
   pre-pilot checklist item unless IT provisions test accounts. Never record or report an email.
8. Fill out `TEMPLATE.md`. A blank or ambiguous server-derived active identity stops
   account-attributed cloud mode; do not substitute a client-provided email.

## Commands run and results

- `node scripts/dev/plan-status.js check 120` — passed: `RUNNABLE: plan-120 is ready to implement`.
- `node --test tests/unit/integration-surface-hygiene.test.js` — passed, 5/5 tests.
- `npm test` — passed, 559/559 tests.
- `npm run build` — passed. `dist/integration-probe/nested-frame-child.html` exists and
  `dist/integrations/` does not. The build retains the pre-existing Blockly dynamic/static import
  and large-chunk warnings.
- Inline browser-script compile check with `new Function(...)` — passed for the public child and
  GAS shell; both Apps Script manifests parsed as JSON.
- `git diff --check` — passed (only Git's normal LF-to-CRLF warnings were reported for Windows
  working-tree files).

## Guardrail proof

The hygiene test was run clean and passed. A temporary fake
`script.google.com/macros/s/FAKE_DEPLOYMENT_ID/exec` literal was inserted into a probe README;
the same test then failed on that file as intended. The temporary fixture was removed, and the
clean test passed again. Positive and negative fixtures cover deployment URLs, real `.clasp.json`
versus `clasp.json.example`, `src/` imports/requires in both directions, and the child `noindex`
meta tag.

## Consultation posture

**Orchestrator-gate-only (Branch C):** no advisor consultation ran. This hosted thread could not
confidently match itself to an advisor-capable provider entry, so it failed closed rather than
claiming a higher-tier review. The implementation was validated by the packet checks, unit suite,
build, source-boundary scan, and owner review gate.

## Problems encountered

The first sandboxed Git staging/commit attempt could not create `.git/index.lock` and returned
`Permission denied`; inspection confirmed that no lock file existed. The narrow approved Git
metadata path was then used to stage and commit the implementation. No lock file was deleted or
modified.

## Remaining risks and follow-ups

- The probes have not been deployed or run against Google Workspace by this agent. Origin
  stability, inherited sandbox behavior, student-OU storage policy, and tenant identity remain
  external measurements for the owner.
- Download, modal, speech, and keyboard outcomes require human observation because browser script
  cannot prove the visible/audible result. The JSON intentionally leaves them unknown until the
  operator records the observation.
- Apps Script editor/deployment UI wording can vary; the README specifies the required semantic
  settings, and the identity page provides an operator-entered settings echo rather than pretending
  to read deployment metadata.
- Build output retains unrelated existing warnings about Blockly chunking and chunk size.

Ready for orchestrator review: yes
