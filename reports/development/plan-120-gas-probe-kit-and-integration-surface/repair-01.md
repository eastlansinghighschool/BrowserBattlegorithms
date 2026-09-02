# Plan 120 — Repair 01

**Date:** 2026-09-01
**Raised by:** orchestrator review of commits `739bf9e` and `ac5ea8f`
**Packet status:** flipped `delivered` → `in-progress` for this repair
**Scope:** one section of one file. **No code changes. No probe behavior changes. No re-validation of the implementation.**

## What is not wrong

The implementation was independently verified and is accepted. Do not revise it for this repair.
Specifically confirmed by the orchestrator, not taken from the report:

- `storageClassification` gates on the operator-declared context (`sameContext ? classification : 'unknown'`),
  so an uncertain or different-device pairing reports `unknown` rather than `partitioned`. This is the
  single most important correctness property in the probe and it is right.
- Both `PLAN120_RESULT` blocks were read field by field. Neither contains an email address, an exact
  origin, a URL, a sentinel value, a domain, or an account id.
- The raw-JSON copy control is gone; only the allowlisted block ships.
- The shell validates HTTPS, the exact expected pathname, `event.origin` against the loaded child
  origin, the literal `'null'` origin, and the probe version. The child rejects shell/version mismatch.
- Origin readings export as `baseline` / `same-as-baseline` / `changed` / `unknown`. This preserves the
  stability information Gate 1 actually needs while keeping the values local — a better resolution of
  that tension than the packet asked for.
- Version pinned consistently at `plan-120-v1` across child, shell, and identity page.
- 560/560 unit tests, clean build, `dist/integration-probe/nested-frame-child.html` present, no
  `dist/integrations/`.

The Sol/`GPT-5 (Codex)` identity discrepancy was handled correctly: flagged rather than glossed, the
Sol identity not claimed, and the input recorded as advisory rather than as a provider-capability
claim. That is the honest posture and it is not a defect. Do not change it.

## The defect

`reports/development/plan-120-gas-probe-kit-and-integration-surface/progress.md`, section **Advisor consultation disposition**.

The table records **eleven recommendations and eleven acceptances, with no rejections and no
independent-verification reasoning.** Under this repository's advisor-consultation convention, a
disposition record containing only accepted findings is incomplete by definition — rejections and
the reasoning behind them are required content, and their absence reads as a completeness gap rather
than as "the advisor found nothing wrong."

Two specific symptoms, beyond the bare count:

1. **One row is not an accepted recommendation at all.** "Preserve isolation, no server result writes,
   random sentinels, and separate Gate 2 deployment | Accepted | Existing boundaries remain intact"
   records the advisor endorsing what the code already did. Endorsements are not acceptances, and
   counting them inflates the record.
2. **The Result column reports what was implemented, not what was verified.** "Accepted → implemented X"
   does not establish that the advisor's underlying claim was checked before being acted on. The
   convention asks for independent verification per finding, because the pilot behind this capability
   found that advisor review biases work toward hardening disproportionate to real risk.

## Required repair

Revise only that section. Specifically:

1. **Record the rejections.** If the advisor made recommendations that were declined, narrowed, or
   deferred, list them with the reasoning. Scope creep, disproportionate hardening, conflict with the
   packet, and "correct but out of scope for a disposable probe" are all legitimate rejection
   reasons — this packet is a probe kit, and the project's own scope-discipline norms apply.
2. **If nothing was genuinely rejected, say so explicitly and defend it in one or two sentences** —
   naming why eleven-for-eleven was the right outcome here rather than deference. An explicit,
   reasoned "no rejections" is compliant. Silence is not.
3. **Reclassify the endorsement row** as an endorsement of existing behavior rather than an accepted
   change, and correct the count accordingly.
4. **For the findings with a behavioral claim** — at minimum the receipt/pairing recommendation and
   the shell-validation recommendation — add one clause each on how the claim was checked against the
   repository before it was implemented, rather than only what was built.

## Out of scope

- Any change to the child page, either GAS probe, the shell, the hygiene test, `directions.md`,
  the results template, or the packet.
- Re-running the full validation suite. The implementation is unchanged, so the existing
  validation record stands.
- Re-running or re-requesting an advisor consultation. This repair is about recording the one that
  already ran.

## Acceptance

- The disposition section names rejections with reasoning, **or** explicitly declares and defends
  "no rejections."
- The endorsement row is no longer counted as an accepted change.
- The receipt/pairing and shell-validation rows each carry a verification clause.
- `git status` is clean and the commit touches only `progress.md` and, if needed, this file.
- Packet returns to `delivered` for orchestrator re-review.

## Stop conditions

- If revising the record surfaces an advisor recommendation that was implemented but should
  **not** have been, stop and report it rather than quietly reverting code. That is a separate
  decision, not part of this repair.
