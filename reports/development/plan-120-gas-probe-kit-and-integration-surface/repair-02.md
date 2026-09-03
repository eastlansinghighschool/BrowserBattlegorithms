# Plan 120 — Repair 02

**Date:** 2026-09-01
**Raised by:** orchestrator re-verification of the post-completion commits `2cc0c5f` and `66cc484`
**Packet status:** reopened `complete` → `in-progress`
**Urgency:** the owner is actively deploying and running the probe. Do this before the next run.
**Scope:** a version bump, its operator-doc consequences, and one guardrail assertion. **No probe logic changes.**

## What re-verification confirmed is good

The handshake repair is correct and the bug was severe. `HTMLIFrameElement.sandbox` is a
`DOMTokenList` with no `.tokenList` property, so the previous
`Array.from(frame.sandbox.tokenList)` threw `TypeError` on every run — and it threw *after*
`clearTimeout(handshakeTimer)`, so the shell never posted `BBA_PROBE_CONTEXT` to the child and
never surfaced a timeout either. The child stayed un-framed, the framed storage path never armed,
and nothing reported an error. Silent, total handshake failure on every attempt. The replacement
guard (`typeof frame.sandbox[Symbol.iterator] === 'function'`, iterating the `DOMTokenList`
directly) is the right fix.

Also re-verified and intact after the change:

- `storageClassification` still gates on the operator-declared context, so an uncertain or
  different-device pairing still reports `unknown` rather than `partitioned`.
- Both `PLAN120_RESULT` blocks were re-audited field by field. The three new fields
  (`browser_family`, `browser_major`, `os_class`) are coarse derived values — a family name, a
  major version integer, and an OS name from a fixed set — never the raw user-agent string. The
  new `device_class` / `ou_class` selects on the identity page are controlled vocabularies. The
  deidentification invariant holds, and browser family plus major version is genuinely load-bearing
  for interpreting a storage-partitioning result.
- 566/566 unit tests, clean build, `dist/integration-probe/nested-frame-child.html` present, no
  `dist/integrations/`.

## The defect

**Probe behavior changed materially and the version literal did not.** All three surfaces still
report `plan-120-v1`:

- `public/integration-probe/nested-frame-child.html` — `const VERSION = 'plan-120-v1'`
- `integrations/google-apps-script/probes/nested-frame/Shell.html` — `const SHELL_VERSION = 'plan-120-v1'`
- `integrations/google-apps-script/probes/identity/Page.html` — `const VERSION = 'plan-120-v1'`

Why that is not cosmetic:

1. **`directions.md` step 3 makes the version the operator's only build check.** It tells the
   operator to confirm the page displays `plan-120-v1` and to treat a version mismatch as a failed
   run. That check now passes for both the broken build and the fixed build, so it cannot do the
   job it was written to do.
2. **The shell is hand-pasted into Apps Script, so a stale deployment is likely, not
   hypothetical.** If the owner deploys or re-runs a shell copied before this repair, the handshake
   dies silently again — and `SHELL_VERSION` matching the child's `VERSION` means the built-in
   version check waves it through. The one guard that should catch stale code cannot see the change.
3. **Returned result blocks are not distinguishable by provenance.** A block reading
   `probe_version=plan-120-v1` may have come from the broken shell, the fixed shell, or a
   browser-cached child lacking the new metadata fields. For evidence whose entire purpose is to
   decide an architecture question, indistinguishable provenance is the defect — not the missing
   feature.

## Required repair

1. **Bump all three version literals to `plan-120-v2`.** All three must match exactly; the
   shell↔child handshake check depends on it.
2. **Update `directions.md`** so step 3 verifies `plan-120-v2`, and add one explicit instruction:
   re-paste and re-deploy **both** Apps Script projects from the current repository source before
   the next run, because a shell copied earlier is broken in a way that produces no visible error.
3. **Update `TEMPLATE.md`** and any other operator-facing reference to the version string.
4. **State the discard rule plainly** in `directions.md` and in the progress report: any result
   block reporting `probe_version=plan-120-v1` is discarded and its condition re-run. Do not
   interpret v1 blocks; their handshake state cannot be established after the fact.
5. **Add a hygiene-test assertion** in `tests/unit/integration-surface-hygiene.test.js` that the
   version literal in the child, the shell, and the identity page are all **equal to each other**.
   Assert agreement rather than a hard-coded string, so the test keeps working across future bumps
   while catching the drift this repair exists to fix — one surface bumped and another forgotten.
6. **Correct the packet resolution string** in
   `docs/development/plan-120-gas-probe-kit-and-integration-surface.md`: it currently describes
   `plan-120-v1` and does not mention the handshake repair or the browser/OS metadata. It should
   describe the build that actually exists.

## Out of scope

- Any change to probe logic, the storage classification, the receipt workflow, the result-block
  field set, the shell validation, or the identity evaluation. The implementation is accepted.
- Re-running the full validation suite for the logic. Re-run `npm test` and `npm run build` after
  the version and test changes; nothing more is needed.
- Re-running or re-requesting an advisor consultation.

## Acceptance

- All three version literals read `plan-120-v2` and are asserted equal by the hygiene test.
- `directions.md` verifies v2, instructs a full re-paste and re-deploy of both Apps Script
  projects, and states the v1 discard rule.
- `TEMPLATE.md` references v2.
- The packet resolution describes the current build, including the handshake repair.
- `npm test` and `npm run build` pass; `git status` is clean.
- Packet returns to `delivered` for orchestrator re-review.

## Stop conditions

- If bumping the version would invalidate probe results the owner has **already collected and
  intends to keep**, stop and report rather than choosing for them. Discarding collected evidence
  is an owner decision. (Best current understanding is that no complete run has succeeded yet,
  precisely because the handshake was broken — but confirm rather than assume.)
