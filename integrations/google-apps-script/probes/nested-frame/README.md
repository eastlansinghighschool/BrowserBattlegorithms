# Gate 1: nested-frame capability probe


This probe is a disposable Apps Script shell around the exact public-origin child page at
`/integration-probe/nested-frame-child.html`. It is a measurement tool, not the production GAS
shell. It has no Drive, Sheets, Script Properties, fetch, beacon, or server-side result path.

## Run

1. Deploy this folder as its own Apps Script web app. Use **execute as the deploying user** and
   **who has access: anyone in the Workspace domain**. Gate 1 needs no student account; a teacher
   can run it immediately. Do not use an anonymous deployment for a district measurement.
2. Open the deployed shell in the browser where the probe will be measured.
3. Paste the exact public URL of the deployed child page into the shell and choose **Load child in
   frame**. Do not add a query parameter containing an identity or deployment id.
4. Wait for the child handshake. If the shell reports no handshake after 15 seconds, record the
   child-load result as **fail** and investigate the URL/deployment separately; do not infer that
   browser APIs passed from an empty frame.
5. Run **Direct top-level storage control** on the child URL itself before loading that exact URL
   in the shell. It writes random sentinels to localStorage and IndexedDB. Then load the same URL
   in the shell and use the framed controls. A missing bucket without a successful direct control
   is **unknown**, not partitioned.
6. Use the individual operator confirmation controls for dialogs, speech, and downloads. A call
   that returned without throwing is not proof that the user-visible action happened.
7. Record the device class and organizational unit with each storage result. Run storage on a
   representative student-OU managed device, such as a spare Chromebook in a student session,
   not only on a teacher device. No student needs to be present and the probe sends nothing.
8. Use **Copy JSON**. If clipboard access is blocked, select and copy the visible textarea. Put
   only deidentified aggregates in `reports/orchestration/gas-integration-commentary/probe-results/`;
   raw console/JSON output, if retained for troubleshooting, belongs under ignored `local/`.
9. Use the cleanup buttons in both the direct and framed contexts after the run.

## What to record and what it falsifies

The child reports the child origin and the parent origin observed through both `document.referrer`
and the parent `postMessage` origin. Repeat the origin reading across all four conditions: reload,
a second signed-in user, a new version of the same deployment, and a new deployment. One reading
proves nothing. An unstable or unverifiable origin falsifies the current exact-origin parent/
child-authentication assumption and requires an owner decision before protocol work.

The shell reports its directly readable child-iframe `sandbox` attribute. The child reports only
what it can introspect; the inherited GAS HtmlService effective token set is explicitly unknown
when the browser does not expose it. Individual capability observations are authoritative. A
failure or need to weaken origin checks falsifies the proposed frame shape.

The child measures direct-click and delayed blob-download attempts separately, `confirm()`,
`prompt()`, speech synthesis, keyboard tab-in/tab-out, and usable inner viewport dimensions.
These observations falsify the corresponding student-visible capability if they fail. The
download, dialog, and speech results deliberately wait for operator confirmation because browser
JavaScript cannot prove that a download shelf, dialog, or speaker was actually visible/audible.

Storage is classified independently as **partitioned**, **unpartitioned**, **blocked**, or
**unknown**. Partitioned requires: a successful top-level sentinel control; the direct sentinel
absent in the frame; and a different framed sentinel that round-trips. Unpartitioned requires the
direct sentinel to be visible in the frame. Property/open errors or failed round trips are blocked.
Contradictory or incomplete runs are unknown. Partitioned is expected and is not a failure; blocked
is the F7 / Plan 118 condition and may require a student-domain policy question. A storage result
without device class and OU provenance is not evidence.

## Owner deployment notes

The child URL is entered at runtime in `Shell.html`; no deployment URL is tracked here. Keep the
real `.clasp.json` local and never commit it. This probe is intentionally separate from the
identity probe so the owner can run Gate 1 without scheduling a non-teacher account.

## One deliberate exception, recorded so it is not copied forward

The child announces readiness with `postMessage(..., '*')`. That is correct in a probe and wrong in
the product. The child cannot know the GAS parent origin in advance — discovering it is the whole
point of this probe — and the announcement carries only a message type and a version. The inbound
handler still verifies `event.source` and records `event.origin` as the measurement.

The Stage 1 protocol must use an exact `targetOrigin` in both directions, per the proposal's
"Protocol invariants". This is one concrete instance of the packet's rule that probe code is never
promoted in place into the real shell or into `src/`: a later packet writes that surface fresh.
