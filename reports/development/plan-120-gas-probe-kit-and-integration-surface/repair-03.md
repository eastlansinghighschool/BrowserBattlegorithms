# Plan 120 — Repair 03

**Date:** 2026-09-01
**Raised by:** orchestrator review of an owner probe run (first live Gate 1 reading)
**Packet status:** reopened `complete` → `in-progress`
**Scope:** one guard in the shell's `load` handler, plus docs. **Display-only. No measurement changes. No version bump — see below.**

## The implementer's diagnosis is correct, and confirmed independently

The handshake **succeeded**. The parent banner is stale. Both halves verified by the orchestrator
against source rather than inferred:

1. **The child proves the round trip completed.** `records.parentOriginMessage` initializes to
   `{ value: 'unknown', status: 'unknown' }` and is only assigned inside the
   `BBA_PROBE_CONTEXT` handler, which itself requires `event.source === window.parent`. Its status
   becomes `pass` only when `event.origin === event.data.parentOrigin` — the message's actual origin
   matching the parent's self-reported origin. A `pass` on that row cannot occur unless the parent
   received `BBA_PROBE_READY`, accepted it, and replied. The screenshot shows `pass`.
2. **The shell overwrites its own success.** `frame.addEventListener('load', ...)` unconditionally
   calls `setStatus('Frame load event received; waiting for the child diagnostic handshake…')`
   whenever `loadedUrl` is set. The child posts `BBA_PROBE_READY` from an inline script at parse
   time, which can easily precede the iframe's `load` event (which waits on subresources). So the
   ordering is: READY → context sent → child renders its passes → `load` fires → banner reverts.

**One detail worth adding, because it explains why the banner never recovers:** the handshake
handler calls `clearTimeout(handshakeTimer)` *before* setting success. Once the `load` handler
overwrites the banner, the 15-second timeout has already been cancelled, so nothing will ever
correct the display. The operator is left staring at "waiting…" indefinitely on a run that actually
worked. That is why this is worth repairing before the remaining Gate 1 readings rather than after:
an operator could reasonably abandon three valid runs.

## Required repair

1. **Guard the `load` handler.** Track a `handshakeReceived` flag (or equivalent) set in the
   `BBA_PROBE_READY` handler, and have the `load` handler leave the status alone once it is set.
2. **Consider an explicit child acknowledgement.** The implementer suggests a child→parent ack
   after `BBA_PROBE_CONTEXT` is processed, so the parent can state round-trip completion on its own
   authority rather than inferring it from READY. This is optional and a judgment call: it makes the
   parent banner trustworthy, at the cost of one more message in a protocol whose purpose is
   measurement. **If you add it, it must not become a new failure mode** — a missing ack must
   degrade to the current "handshake accepted" state, never to a false failure.
3. **Docs.** Note in the probe README that the child's *message-origin row* is the authoritative
   handshake indicator, not the parent banner, and that a run showing child passes with a stale
   parent banner was valid.

## Version policy for this change — no bump, and here is why

`repair-02` established that a probe's version is provenance: when behavior changes, the version
must change, or results cannot be attributed to a build. That rule is deliberately being **not**
applied here, and the reasoning is recorded so it is not mistaken for an oversight:

- This change alters **no measurement, no classification, and no field of either
  `PLAN120_RESULT` block.** It changes only which string the parent displays.
- Bumping to `plan-120-v3` would invalidate readings the owner is collecting **right now**, forcing
  a redo of valid data for a cosmetic fix.

So: keep `plan-120-v2`, and state explicitly in the probe README and the progress report that the
status-banner fix is display-only and results remain comparable across it. **If the repair grows
beyond the display — if it touches the protocol, the ack, or any measured value — the version must
bump and this exemption no longer applies.** Adding the optional child acknowledgement in item 2
*does* change the protocol; if you implement it, bump to `plan-120-v3` and say so.

## Do not record the sandbox explanation as a finding

The implementer suggests the sandbox warning is incidental — that GAS supplies both `allow-scripts`
and `allow-same-origin` and Chrome warns about the theoretical escape. That is plausible and it is
**not measured**. The child correctly reports
`effectiveInherited: "unknown: inherited GAS HtmlService sandbox is not exposed here"`, which is the
honest answer, and the packet anticipated exactly this.

The substitute for introspection is **behavioral**: the blob download from a click handler and from
an async callback, `confirm()`, `prompt()`, `speechSynthesis`, and the storage round trips. Those
tests answer the question the sandbox token list was only a proxy for. Record their outcomes; leave
the token set `unknown`. Do not let a plausible story about sandbox flags become a recorded fact —
that is the failure mode this probe was built to avoid.

## Out of scope

- Any change to the child page, the identity probe, the storage classification, the result blocks,
  or the origin-reading protocol.
- Re-running any completed measurement. Readings taken under the stale banner are valid.

## Acceptance

- The `load` handler cannot overwrite a completed handshake status.
- Version stays `plan-120-v2` unless the optional ack is implemented, in which case it bumps to v3.
- The probe README states that the child's message-origin row is the authoritative handshake
  indicator and that the banner fix is display-only.
- `npm test` and `npm run build` pass; the hygiene test still passes; `git status` clean.
- Packet returns to `delivered`.

## Stop conditions

- If the `load`/`message` ordering turns out to vary in a way that a flag cannot cover, stop and
  report rather than adding retries or delays.
- If the deployed shell the owner ran has diverged from the repository copy, stop and report — the
  repair must be written against whatever is actually deployed, and a diverged shell is itself a
  provenance problem worth surfacing.
