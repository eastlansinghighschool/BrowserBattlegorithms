# GAS probe results (deidentified)

No real student identity or data are recorded in this file. Record only aggregate pass/fail/
unknown observations. Keep raw console or JSON output, if needed, under ignored `local/`.

## Run header

| Field | Value |
| --- | --- |
| Date | 2026-09-16 |
| Probe version | `plan-120-v2` |
| Browser and version | Chrome 153 |
| Operating system | Windows |
| Device class | Personal Windows device |
| Organizational unit | `unknown OU` |
| Gate | 1 nested-frame |
| Execute as | deploying user |
| Who has access | Workspace domain |
| Deployment version/revision label | baseline-run-1 |
| Raw output location | none (transcribed directly from verbatim result block) |

## Origin stability (Gate 1)

Do not record or paste origin values. All four readings are required; a single reading proves
nothing. Use only the fixed status labels from the probe: `baseline`, `same-as-baseline`, `changed`,
or `unknown`. Exact origins may remain in the operator's local browser view for comparison only.

| Reading condition | Origin comparison status | Child-origin observation status | Parent-origin observation status | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- | --- |
| Reload of same deployment | same-as-baseline | pass | pass | Falsifies the hypothesis that parent origin is unstable or ephemeral across reloads of the same deployment. | run_id: un-2074483103-2267613245. Matches approved baseline exactly (baseline established in run_id: un-1323078584-1327889834). |
| Second signed-in user |  |  |  | User-dependent origin assumption |  |
| New version of same deployment |  |  |  | Version-dependent origin assumption |  |
| New deployment |  |  |  | Deployment-dependent origin assumption |  |

## Gate 1 measurements

| Measurement | Observed value | Pass/fail/unknown | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- |
| Child `location.origin` observation | observed | pass | Origin stability/authentication assumption | Child origin observed successfully |
| Parent origin from child `document.referrer` observation | observed | pass | Parent-origin observability assumption | Referrer origin observed |
| Parent origin from `postMessage` `event.origin` observation | observed | pass | Parent-origin observability/strict message assumption | Parent origin observed via message |
| Direct child-iframe sandbox attribute/tokens observation | observed | pass | Explicit sandbox assumption | Shell passed sandbox tokens in context |
| Effective inherited sandbox token set | unknown | unknown | Ability to inspect effective token set | GAS HtmlService inherited sandbox is opaque as expected |
| Blob download from direct click handler | observed | pass | User-activated download capability | Direct click download observed |
| Blob download from `setTimeout` callback | observed | pass | Delayed download capability | Delayed download observed |
| `window.confirm()` dialog | observed | pass | Reset confirmation capability | Confirm dialog appeared and responded |
| `window.prompt()` dialog | observed | pass | Export-name prompt capability | Prompt dialog appeared and responded |
| `speechSynthesis.speak()` | observed | pass | Voice narration capability | Audio narration heard |
| Keyboard tab into child and back out | observed | pass | Keyboard reachability/focus boundary | Focus traversed into child and reached outer boundary |
| Usable inner viewport width and height | 1066 × 620 | pass | Student-facing framed layout | Measured on personal Windows screen; target Chromebook (1366x768) will be smaller |

### Storage controls and classifications

Record device class and OU in the header for every storage result. Do not infer partitioning from
an empty bucket. Each API must have a successful direct top-level control before classification.

| Storage API / step | Observed value | Pass/fail/unknown | What this observation would have falsified | Notes |
| --- | --- | --- | --- | --- |
| localStorage — direct top-level control | pass | pass | Direct localStorage availability | Top-level direct sentinel round-trip passed |
| localStorage — framed direct-sentinel observation | pass (direct sentinel visible) | pass | Embedded localStorage sharing/partitioning assumption | Direct sentinel visible from iframe context |
| localStorage — framed different-sentinel round-trip | pass | pass | Embedded localStorage write/read capability | Framed round-trip passed |
| localStorage — cleanup in direct context | pending | unknown | Direct cleanup path |  |
| localStorage — cleanup in framed context | pending | unknown | Framed cleanup path |  |
| localStorage — final disposition | unpartitioned | pass | Embedded localStorage policy conclusion | Storage is unpartitioned on this personal Windows Chrome configuration |
| IndexedDB — direct top-level control | pass | pass | Direct IndexedDB availability | Top-level direct sentinel round-trip passed |
| IndexedDB — framed direct-sentinel observation | pass (direct sentinel visible) | pass | Embedded IndexedDB sharing/partitioning assumption | Direct sentinel visible from iframe context |
| IndexedDB — framed different-sentinel round-trip | pass | pass | Embedded IndexedDB write/read capability | Framed round-trip passed |
| IndexedDB — cleanup in direct context | pending | unknown | Direct cleanup path |  |
| IndexedDB — cleanup in framed context | pending | unknown | Framed cleanup path |  |
| IndexedDB — final disposition | unpartitioned | pass | Embedded IndexedDB policy conclusion | Storage is unpartitioned on this personal Windows Chrome configuration |

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

## Intake log

### Run 1: Gate 1 baseline (2026-09-16)

```text
PLAN120_RESULT
gate=1
probe_version=plan-120-v2
run_id=un-1323078584-1327889834
condition=same-deployment-reload
device_class=personal-windows-device
ou_class=unknown-ou
storage_context=same-device-browser-profile
origin_comparison=baseline
browser_family=Chrome
browser_major=153
os_class=Windows
child_origin_observed=pass
parent_referrer_observation=pass
parent_message_observation=pass
sandbox_observation=observed
effective_inherited_sandbox=unknown
blob_direct=pass
blob_timeout=pass
confirm=pass
prompt=pass
speech=pass
keyboard=pass
viewport_width=1066
viewport_height=620
localStorage=unpartitioned
indexedDB=unpartitioned
localStorage_cleanup=unknown
indexedDB_cleanup=unknown
raw_origins_sentinels_and_identifiers=excluded
```

### Run 2: Gate 1 reload of same deployment (2026-09-16)

```text
PLAN120_RESULT
gate=1
probe_version=plan-120-v2
run_id=un-2074483103-2267613245
condition=same-deployment-reload
device_class=personal-windows-device
ou_class=unknown-ou
storage_context=different-context
origin_comparison=same-as-baseline
browser_family=Chrome
browser_major=153
os_class=Windows
child_origin_observed=pass
parent_referrer_observation=pass
parent_message_observation=pass
sandbox_observation=observed
effective_inherited_sandbox=unknown
blob_direct=unknown
blob_timeout=unknown
confirm=unknown
prompt=unknown
speech=unknown
keyboard=unknown
viewport_width=1066
viewport_height=620
localStorage=unknown
indexedDB=unknown
localStorage_cleanup=unknown
indexedDB_cleanup=unknown
raw_origins_sentinels_and_identifiers=excluded
```

