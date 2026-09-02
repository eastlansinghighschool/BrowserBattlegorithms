# GAS probe results (deidentified)

No real student identity or data are recorded in this file. Record only aggregate pass/fail/
unknown observations. Keep raw console or JSON output, if needed, under ignored `local/`.

## Run header

| Field | Value |
| --- | --- |
| Date |  |
| Probe version |  |
| Browser and version | coarse family/major only; do not record raw user-agent string |
| Operating system | coarse OS class only |
| Device class | e.g. managed Chromebook 1366x768 |
| Organizational unit |  or `unknown OU` |
| Gate | 1 nested-frame / 2 tenant identity |
| Execute as | controlled label only: deploying user / accessing user / unknown |
| Who has access | controlled label only: Workspace domain / anyone / restricted / unknown |
| Deployment version/revision label | deidentified label only |
| Raw output location | ignored `local/` path, if retained |

## Origin stability (Gate 1)

Do not record or paste origin values. All four readings are required; a single reading proves
nothing. Use only the fixed status labels from the probe: `baseline`, `same-as-baseline`, `changed`,
or `unknown`. Exact origins may remain in the operator's local browser view for comparison only.

| Reading condition | Origin comparison status | Child-origin observation status | Parent-origin observation status | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- | --- |
| Reload of same deployment |  |  |  | Unstable/unverifiable origin assumption |  |
| Second signed-in user |  |  |  | User-dependent origin assumption |  |
| New version of same deployment |  |  |  | Version-dependent origin assumption |  |
| New deployment |  |  |  | Deployment-dependent origin assumption |  |

## Gate 1 measurements

| Measurement | Observed value | Pass/fail/unknown | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- |
| Child `location.origin` observation |  |  | Origin stability/authentication assumption |  |
| Parent origin from child `document.referrer` observation |  |  | Parent-origin observability assumption |  |
| Parent origin from `postMessage` `event.origin` observation |  |  | Parent-origin observability/strict message assumption |  |
| Direct child-iframe sandbox attribute/tokens observation |  |  | Explicit sandbox assumption |  |
| Effective inherited sandbox token set | unknown unless browser exposes it | unknown | Ability to inspect effective token set |  |
| Blob download from direct click handler |  |  | User-activated download capability |  |
| Blob download from `setTimeout` callback |  |  | Delayed download capability |  |
| `window.confirm()` dialog |  |  | Reset confirmation capability |  |
| `window.prompt()` dialog |  |  | Export-name prompt capability |  |
| `speechSynthesis.speak()` |  |  | Voice narration capability |  |
| Keyboard tab into child and back out |  |  | Keyboard reachability/focus boundary |  |
| Usable inner viewport width and height |  |  | Student-facing framed layout |  |

### Storage controls and classifications

Record device class and OU in the header for every storage result. Do not infer partitioning from
an empty bucket. Each API must have a successful direct top-level control before classification.

| Storage API / step | Observed value | Pass/fail/unknown | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- |
| localStorage — direct top-level control |  |  | Direct localStorage availability |  |
| localStorage — framed direct-sentinel observation |  |  | Embedded localStorage sharing/partitioning assumption |  |
| localStorage — framed different-sentinel round-trip |  |  | Embedded localStorage write/read capability |  |
| localStorage — cleanup in direct context |  |  | Direct cleanup path |  |
| localStorage — cleanup in framed context |  |  | Framed cleanup path |  |
| localStorage — final disposition | partitioned / unpartitioned / blocked / unknown |  | Embedded localStorage policy conclusion |  |
| IndexedDB — direct top-level control |  |  | Direct IndexedDB availability |  |
| IndexedDB — framed direct-sentinel observation |  |  | Embedded IndexedDB sharing/partitioning assumption |  |
| IndexedDB — framed different-sentinel round-trip |  |  | Embedded IndexedDB write/read capability |  |
| IndexedDB — cleanup in direct context |  |  | Direct cleanup path |  |
| IndexedDB — cleanup in framed context |  |  | Framed cleanup path |  |
| IndexedDB — final disposition | partitioned / unpartitioned / blocked / unknown |  | Embedded IndexedDB policy conclusion |  |

## Gate 2 identity measurements

| Tier/condition | Observed value | Pass/fail/unknown | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- |
| A: non-teacher active identity nonblank/correct/domain |  |  | Account-attributed cloud mode entirely | Do not record email |
| A: teacher/deployer active identity nonblank/correct/domain |  |  | Teacher-side operation | Do not record email |
| B: two accounts in one browser report active account |  |  | Shared-computer attribution story | Do not record email |
| B: account switch mid-session |  |  | Shared-computer attribution story | Do not record email |
| C: renamed account |  |  | Graceful rename degradation only; non-blocking | Provisioned test account only |
| C: disabled account |  |  | Graceful disabled-account degradation only; non-blocking | Provisioned test account only |
| Deployment settings echo |  |  | Intended execute-as/access configuration | Controlled labels only; no raw settings |

## Email/chat intake

The operator or student should send only the text block produced by **Copy email-safe report**.
It is acceptable to paste into an email or this chat session. Do not send screenshots, raw JSON,
exact origins, deployment URLs, sentinels, names, email addresses, expected domains, account ids, or
free-text deployment settings. A block with the wrong probe version, missing fields, or an
unverified storage receipt is incomplete and should be rerun rather than repaired by hand.
