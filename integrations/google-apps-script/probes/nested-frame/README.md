# Gate 1: nested-frame capability probe


This probe is a disposable Apps Script shell around the exact public-origin child page at
`/integration-probe/nested-frame-child.html`. It is a measurement tool, not the production GAS
shell. It has no Drive, Sheets, Script Properties, fetch, beacon, or server-side result path. The
child is prepared by the repository's existing GitHub Pages workflow; it is not a separately hosted
HTML file and does not need a p5.js surface.

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
   in the shell. It writes random sentinels to localStorage and IndexedDB, then displays a short
   direct-control receipt. Copy that receipt, load the same URL in the shell, paste it into the
   framed page, and choose **Verify direct-control receipt**. The direct and framed steps must use
   the same device, browser, and profile, with no cleanup between them. A missing bucket without a
   verified receipt is **unknown**, not partitioned. A receipt is an operator attestation, not a
   cryptographic proof, so do not use it to combine different devices or profiles.
6. Use the individual action-specific observation controls for dialogs, speech, and downloads. A call
   that returned without throwing is not proof that the user-visible action happened.
7. Record the device class and organizational unit with each storage result. Run storage on a
   representative student-OU managed device, such as a spare Chromebook in a student session,
   not only on a teacher device. No student needs to be present and the probe sends nothing.
8. Choose the fixed run condition, device class, OU class, and origin-comparison status. Use
   **Copy email-safe report**. If clipboard access is blocked, select and copy that visible
   textarea. It is suitable for a student to paste into an email or this chat: it contains only
   statuses, controlled labels, a random run id, coarse browser family/major version, OS class, and
   viewport dimensions. Never email screenshots,
   raw JSON, exact origins, URLs, sentinels, names, emails, or account identifiers.
9. After the framed measurements and report copy are complete, clean the current framed context.
   Return to the exact top-level child URL and clean that context separately. Cleanup before the
   framed comparison invalidates the storage classification.

## What to record and what it falsifies

The child displays the child origin and the parent origin observed through both `document.referrer`
and the parent `postMessage` origin. Repeat the origin reading across all four conditions: reload,
a second signed-in user, a new version of the same deployment, and a new deployment. One reading
proves nothing. Use the fixed origin-comparison choice in the email-safe report; do not copy exact
origins into email, chat, or tracked files. An unstable or unverifiable origin falsifies the current
exact-origin parent/child-authentication assumption and requires an owner decision before protocol
work.

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
without device class, OU class, verified same-device receipt, and no-cleanup sequence is not
evidence.

## Owner deployment notes

The child URL is entered at runtime in `Shell.html`; no deployment URL is tracked here. Keep the
real `.clasp.json` local and never commit it. This probe is intentionally separate from the
identity probe so the owner can run Gate 1 without reading an identity or requiring a student
account, while still using a student-OU device when that policy behavior is the condition under
test.

## One deliberate exception, recorded so it is not copied forward

The child announces readiness with `postMessage(..., '*')`. That is correct in a probe and wrong in
the product. The child cannot know the GAS parent origin in advance — discovering it is the whole
point of this probe — and the announcement carries only a message type and a version. The inbound
handler still verifies `event.source` and records `event.origin` as the measurement.

The Stage 1 protocol must use an exact `targetOrigin` in both directions, per the proposal's
"Protocol invariants". This is one concrete instance of the packet's rule that probe code is never
promoted in place into the real shell or into `src/`: a later packet writes that surface fresh.
