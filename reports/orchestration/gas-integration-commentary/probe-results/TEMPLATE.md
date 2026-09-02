# GAS probe results (deidentified)

No real student identity or data are recorded in this file. Record only aggregate pass/fail/
unknown observations. Keep raw console or JSON output, if needed, under ignored `local/`.

## Run header

| Field | Value |
| --- | --- |
| Date |  |
| Probe version |  |
| Browser and version |  |
| Operating system |  |
| Device class | e.g. managed Chromebook 1366x768 |
| Organizational unit |  or `unknown OU` |
| Gate | 1 nested-frame / 2 tenant identity |
| Execute as |  |
| Who has access |  |
| Deployment version/revision label | deidentified label only |
| Raw output location | ignored `local/` path, if retained |

## Origin stability (Gate 1)

Record the origin values without deployment URLs, account names, or other identifiers. All four
readings are required; a single reading proves nothing.

| Reading condition | Child origin | Parent origin observed by child | Pass/fail/unknown | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- | --- |
| Reload of same deployment |  |  |  | Unstable/unverifiable origin assumption |  |
| Second signed-in user |  |  |  | User-dependent origin assumption |  |
| New version of same deployment |  |  |  | Version-dependent origin assumption |  |
| New deployment |  |  |  | Deployment-dependent origin assumption |  |

## Gate 1 measurements

| Measurement | Observed value | Pass/fail/unknown | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- |
| Child `location.origin` |  |  | Origin stability/authentication assumption |  |
| Parent origin from child `document.referrer` |  |  | Parent-origin observability assumption |  |
| Parent origin from `postMessage` `event.origin` |  |  | Parent-origin observability/strict message assumption |  |
| Direct child-iframe sandbox attribute/tokens |  |  | Explicit sandbox assumption |  |
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
| Deployment settings echo |  |  | Intended execute-as/access configuration | Deidentified labels only |
