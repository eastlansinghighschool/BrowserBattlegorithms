---
id: plan-122
title: "Smoke Tier Concurrency Repair"
status: in-progress
depends_on: []
gate: "none — the diagnosis is complete and recorded below; the tier decision is made and reversible"
summary: >-
  Repair the deploy-blocking smoke-suite failure by dropping the smoke tier to workers 1. Diagnosed at orchestration: the key-capture D-key test passes alone and at workers 1, and fails only under workers-2 CPU contention. Measurement shows the parallelism saves about six seconds across the whole suite, so it is buying almost nothing and costing a blocked GitHub Pages deploy.
---
# Plan 122: Smoke Tier Concurrency Repair

## Packet Metadata

- Packet id: `plan-122`
- Packet title: Smoke Tier Concurrency Repair
- Status: (see frontmatter)
- Owner/model: implementation agent
- Date: 2026-09-01
- Packet type: testing
- Mutation level: repository config (`playwright.smoke.config.js`), docs
- Approval gate: none. The diagnosis below was completed at orchestration with reproductions; the tier decision is recorded and is a one-line revert if the owner disagrees.
- Depends on: nothing. (Write-scope is disjoint from `plan-116`, which is concurrently live in `src/core/`, `src/usage/`, and `docs/subsystems/`. This packet touches only `playwright.smoke.config.js` and `docs/TESTING.md`.)
- Blocks: the GitHub Pages deploy, and therefore Gate 1 — the nested-frame probe cannot run until `public/integration-probe/nested-frame-child.html` reaches the live site.
- Expected artifacts:
  - `playwright.smoke.config.js` at `workers: 1` with its stale comment corrected
  - `docs/TESTING.md` updated with the concurrency finding
  - repeated-run stability evidence in the progress report
  - progress report
- Progress report folder: `reports/development/plan-122-smoke-tier-concurrency-repair/`
- Progress report file: `reports/development/plan-122-smoke-tier-concurrency-repair/progress.md`

## Packet Summary

Goal: Unblock the Pages deploy by removing the concurrency condition that makes one smoke test fail, without removing the test from CI.

Non-goals:
- **Do not raise any test timeout.** See "Rejected fixes" below.
- **Do not add `console.log` inside a `waitForFunction`.** It executes in page context and does not reach the runner's output.
- Do not move `key-capture-passthrough.spec.js` out of smoke (see "Rejected fixes" — smoke is the tier CI actually runs).
- Do not change `src/` behavior, the key handling pipeline, keybindings, or any guided level.
- Do not change the release, focus, tooling, or regression tiers.
- Do not touch `plan-116`'s files.

Depends on: nothing.

Blocks: the Pages deploy and Gate 1.

Why this packet exists:
A push failed CI on `tests/browser/key-capture-passthrough.spec.js:303`, "guided keyboard-practice level accepts the Team 1 D key through the real browser event pipeline," with a 30s `waitForFunction` timeout. Because `deploy-pages.yml`'s `deploy` job has `needs: build`, and `build` runs `npm run test:browser:smoke`, this failure blocks the GitHub Pages deploy — which blocks the `plan-120` probe child page from reaching the live origin, which blocks Gate 1.

## Diagnosis (completed at orchestration 2026-09-01)

Reproductions, in order:

| Run | Result |
| --- | --- |
| The one spec alone, default config | 10/10 passed, 17.2s |
| The one test alone, smoke config, three times | passed, ~5.7s each |
| **Full smoke suite, `workers: 2` (exactly what CI runs)** | **60 passed, 1 failed — the same test, same timeout** |
| **Full smoke suite, `--workers=1`** | **61 passed, 1.1m** |

The trigger is concurrency. Two further facts from the failure's `error-context.md` page snapshot:

- **Neither Stage 0 notice was visible.** No storage-blocked banner, no displaced-workspace notice. The `plan-118` and `plan-119` UI additions are not implicated through visibility or focus stealing.
- **Focus was correct.** The snapshot shows `button "Reset Level" [active]`, so `page.locator("#playResetButton").focus()` did what the test intended.

The test is genuinely timing-sensitive: it calls `p5Instance.noLoop()`, then focuses a control, then dispatches a real key through the browser event pipeline, then waits for `queuedActionForCurrentRunner`. Under CPU contention from a second concurrent worker, that sequence loses the race.

**The repository already diagnosed this exact failure mode once.** `playwright.smoke.config.js`'s own comment block says it runs at `workers: 2` "because this file set has no timing-sensitive animation tests," and lists `blockly-trace-playback.spec.js` as excluded for "CPU-contention flake at workers: 2." That premise is now false: the D-key test is timing-sensitive under contention. The comment documents the hazard and the file set drifted past it.

**Why now.** Stage 0 did not break this test. `plan-118` added a storage round-trip probe at startup, `plan-119` added a displaced-slot read on guided level load, and both added a hidden notice element. Each is tiny, but together they shift startup timing enough to cross a contention threshold that was already marginal. This is a latent `workers: 2` flake that Stage 0 pushed over the edge, not a regression in Stage 0's behavior.

## The decision and its evidence

**Drop smoke to `workers: 1`.**

The measurement makes this one-sided: the suite takes **1.0m at `workers: 2`** and **1.1m at `workers: 1`**. Roughly six seconds of wall clock buys a deploy-blocking flake. That is a bad trade at any coverage level, and an especially bad one for the tier that gates deployment.

## Rejected fixes, and why

- **Raise the timeout (the GitHub explainer's recommendation).** Rejected. The test passes alone in 5.7s; it is not slow, it is losing a race. A larger timeout makes the flake rarer and less legible without removing it, and would leave a deploy gate that fails unpredictably.
- **Add diagnostic logging inside `waitForFunction`.** Rejected. That callback runs in page context; `console.log` there does not reach the runner output, so it adds noise and no evidence.
- **Investigate guided-mode keybindings (the explainer's alternative).** Rejected by evidence. The test passes in isolation and at `workers: 1`, so the binding, the guided-mode path, and the Blockly focus interaction all work correctly.
- **Move the spec out of smoke, matching the `blockly-trace-playback.spec.js` precedent.** Rejected, and this is the important one: `ci.yml` runs only `npm test`, `npm run build`, `test:browser:smoke`, and `test:browser:focus`. The release tier is **not** run in CI. Moving this spec to extended/release would silently stop it running in CI at all — trading a visible failure for invisible loss of coverage on the real-browser key pipeline.

## Work Plan

1. Read this diagnosis and confirm the two reproductions yourself: the full smoke suite at the default config, and at `--workers=1`. Record both in the progress report.
2. Set `workers: 1` in `playwright.smoke.config.js`.
3. Correct the config's comment block: the "no timing-sensitive animation tests" justification is now false and must not be left in place to mislead the next author. State that the tier runs serially because the key-capture D-key test loses a real-browser-event race under contention, and that `blockly-trace-playback.spec.js` remains excluded for its own reasons.
4. Run the full smoke suite **three times** to establish stability, not once.
5. Update `docs/TESTING.md` with the finding and the tier's serial requirement.
6. Write the progress report with all run results.

## Implementation Requirements

### R1 — Config change

`workers: 1` in `playwright.smoke.config.js`. Nothing else in that file changes except the comment block.

### R2 — Comment correction

The stale justification must go. A future author reading "this file set has no timing-sensitive animation tests" would reasonably restore `workers: 2`. Replace it with the actual reason and cite this packet.

### R3 — Stability evidence

Three consecutive full-suite runs, all 61/61. Record wall-clock time for each. If any run fails, **stop and report** — that would mean concurrency was not the whole cause and the diagnosis needs revisiting.

### R4 — Docs

`docs/TESTING.md`: record that the smoke tier runs serially, why, and the measured cost (about six seconds). Note the general lesson: a test that dispatches real browser input and then waits on resulting app state is timing-sensitive under CPU contention even when it contains no animation.

## Commands

```powershell
npm run test:browser:smoke
```

```powershell
npx playwright test --config=playwright.smoke.config.js --workers=1 --reporter=line
```

## Validation Checklist

- [ ] Both reproductions confirmed and recorded before the change.
- [ ] `workers: 1` set; no other functional change in the config.
- [ ] The stale "no timing-sensitive animation tests" justification is gone.
- [ ] Three consecutive full smoke runs at 61/61, with times recorded.
- [ ] `npm test` and `npm run build` still pass.
- [ ] `docs/TESTING.md` updated.
- [ ] No change to `src/`, keybindings, guided levels, or any other test tier.
- [ ] No `plan-116` files touched.

## Stop Conditions

Stop and ask for review if:

- the full smoke suite fails at `workers: 1` — concurrency was then not the whole cause;
- any of the three stability runs fails;
- removing the concurrency reveals a second, unrelated failure;
- the fix appears to require changing `src/` or the test's own logic (that would contradict the diagnosis and needs owner review before proceeding).
