# Plan 115 Repair Directions (Repair 01)

**Date:** 2026-08-10
**Source:** Orchestration review of the Plan 115 implementation pass. Verdict: send back — narrow. The adoption content is excellent (managed blocks done right, zero local-content loss, tooling resync verified feature-complete). What failed is the honesty layer, which matters doubly in a process-contracts packet.
**Status of this file:** durable work order for the repair pass. The packet and the approved triage (decision log 2026-08-10) remain the contract.

## What the pass got right (do not regress these)

- All upstream content landed in marked `<!-- bootstrap:* -->` managed blocks; local prompt/guidance content fully preserved (including the 2026-08-10 date-stamping rule at `orchestrator-prompt.md:173-175`).
- Manifest correctly drops the stale "ahead-of-bootstrap" claim; resync to 1.3.0 verified feature-complete (canonical-ID lint, filename check, duplicate rejection all present).
- `scripts/dev/plan-status.test.js` runs standalone under `node --test` (121/121) — no vitest dependency leaked into this repo.
- Scope clean; datestamps correct.

## Repair 1 (MAJOR): The progress report's validation section must say where things ran

- **Defect:** `progress.md` (~line 48) claims `npm test` → "331 passed across 20 test suites" — that is upstream C:\AI\Bootstrap's vitest run, not this repo's (ours is 554 tests via `node --test`, which has no "suites" concept). The report presents another repository's validation as evidence for this one. Same class of falsehood as plan-106's "479/479".
- **Fix:** rewrite the validation section to state plainly: which commands were run in the upstream repo (and why that does not validate this adoption), and the actual local validation — you may cite the orchestrator's independently verified results from review: `npm test` 554/554, `npm run build` clean, `node scripts/dev/plan-status.js lint/check/render` OK, `node --test scripts/dev/plan-status.test.js` 121/121. If you re-run the local commands yourself, quote their real output.

## Repair 2 (MAJOR): Make the .claude roster actually committable (owner decision made)

- **Defect:** `.gitignore:23` ignores all of `.claude/`, so the roster files copied to `.claude/agents/` can never be committed — invisible in `git status`, absent from the adoption's stated artifacts.
- **Owner decision (2026-08-10):** add a `!.claude/agents/` exception to `.gitignore` so the roster commits while `.claude/settings.local.json` and everything else stays ignored. Verify with `git check-ignore -v .claude/agents/reviewer.md` (should NOT be ignored) and `git check-ignore -v .claude/settings.local.json` (should STILL be ignored), and quote both in the progress report. Ensure `.claude/settings.local.json` does not appear in your staged set.

## Repair 3 (MINOR): Correct the advisor declaration to match the contract this packet installs

- **Defect:** the report's advisor declaration claims Branch B "not warranted — tooling/prompt/docs packet." But the advisor-consultation prose this same packet merges states that "not warranted" does not apply to a packet that produced or modified code, scripts, or schemas with a behavioral surface — and this packet rewrote `scripts/dev/plan-status.js`, our packet tooling. Per the just-adopted contract, that declaration is non-compliant.
- **Fix:** correct the declaration to Branch C (degraded, orchestrator-gate-only) with the reason: kimi-code is `advisorCapable: false` in `advisor-capable-providers.json`, so consultation runs owner-mediated. One-line fix; make it verbatim-consistent with the adopted contract's vocabulary.

## Process requirements

- Do NOT run `plan-status.js set` at any status.
- Keep the diff scoped to these repairs.
- If a repair forces a choice this file does not cover, stop and surface.

## Validation gate for the repair pass

1. Progress report validation section names which repo each command ran in; local validation numbers are real (554/554, build, lint, 121/121).
2. `git check-ignore` evidence quoted for both the roster exception and settings.local.json's continued privacy.
3. Advisor declaration uses Branch C vocabulary.
4. `node scripts/dev/plan-status.js lint` OK; `npm test` 554/554; `npm run build` clean.
