# Progress Report: Plan 122 — Smoke Tier Concurrency Repair

**Date**: 2026-09-02  
**Implementer Thread**: Antigravity / Gemini  
**Packet**: `docs/development/plan-122-smoke-tier-concurrency-repair.md`  
**Status**: STOP CONDITION TRIGGERED — Stopped before mutating repository files; awaiting orchestrator/owner review.

---

## 1. Overall Summary

Plan 122 was initiated to address the deploy-blocking CI smoke failure at `tests/browser/key-capture-passthrough.spec.js:303` ("guided keyboard-practice level accepts the Team 1 D key through the real browser event pipeline") by serializing the smoke suite to `workers: 1`. The packet's diagnosis hypothesized that the failure was caused purely by CPU contention under `workers: 2`.

During Step 1 of the Work Plan ("Read this diagnosis and confirm the two reproductions yourself: the full smoke suite at the default config, and at `--workers=1`"), empirical testing revealed that:
1. The full smoke suite at `--workers=1` **failed 60 passed, 1 failed** on consecutive runs with the exact same 30-second `waitForFunction` timeout on test 303.
2. Even in complete isolation, running `key-capture-passthrough.spec.js:303` with `--repeat-each 10 --workers=1` reproduces the failure (~10-20% failure rate).
3. The underlying issue is **not worker concurrency or CPU contention between workers**. Rather, it is an intrinsic race condition inside the test itself between `p5Instance.noLoop()`, the asynchronous browser event dispatch (`page.keyboard.press("d")`), and the p5 `requestAnimationFrame` draw loop.

Per the explicit Stop Conditions of Plan 122:
> **Stop Conditions**: Stop and ask for review if:
> - the full smoke suite fails at `workers: 1` — concurrency was then not the whole cause;
> - any of the three stability runs fails;
> - the fix appears to require changing `src/` or the test's own logic (that would contradict the diagnosis and needs owner review before proceeding).

Execution was halted before modifying `playwright.smoke.config.js` or `docs/TESTING.md`.

---

## 2. Advisor Consultation Declaration

- **Branch**: **Branch C** — Not advisor-capable (fail-closed per Step 1).
- **Detail**: The host environment is Antigravity / Gemini. Checking `advisor-capable-providers.json` reveals that only `claude-code`, `codex-cli`, and `kimi-code` are listed. Because this thread does not match an entry in `advisor-capable-providers.json`, per the strict instructions it fails closed to "not capable" and operates in **orchestrator-gate-only mode**.

---

## 3. Reproduction Runs & Measurement Evidence

### 3.1 Baseline Reproductions (Work Plan Step 1)

| Run | Command | Result | Duration | Notes |
| --- | --- | --- | --- | --- |
| 1 | `npm run test:browser:smoke` (config `workers: 2`) | **61 passed** | 40.0s | Passed on this attempt |
| 2 | `npx playwright test --config=playwright.smoke.config.js --workers=1 --reporter=line` | **60 passed, 1 failed** | 1.6m (96s) | `key-capture-passthrough.spec.js:303` timed out (30s) |
| 3 | `npx playwright test --config=playwright.smoke.config.js --workers=1 --reporter=line` (re-run) | **60 passed, 1 failed** | 1.6m (96s) | Exact same failure on test 303 |
| 4 | `npm run test:browser:smoke` (config `workers: 2`, re-check) | **60 passed, 1 failed** | 59.9s | Exact same failure on test 303 |

### 3.2 Targeted Sub-Suite & Isolation Runs

| Run | Command | Result | Notes |
| --- | --- | --- | --- |
| 5 | `npx playwright test tests/browser/key-capture-passthrough.spec.js` | **10 passed** (13.8s) | Full spec file passed when run alone |
| 6 | `npx playwright test tests/browser/key-capture-passthrough.spec.js --repeat-each 3 --workers=1` | **30 passed** (35.4s) | 3 consecutive full-spec passes |
| 7 | `npx playwright test tests/browser/guided-play.spec.js tests/browser/key-capture-passthrough.spec.js --workers=1` | **17 passed, 1 failed** (49.5s) | Test 18 (test 303) timed out (30s) |
| 8 | `npx playwright test tests/browser/key-capture-passthrough.spec.js:303 --repeat-each 10 --workers=1` | **9 passed, 1 failed** (57.9s) | **Run 2 failed at 30.1s; Runs 1 and 3-10 passed (~1s each)** |

---

## 4. Root Cause Analysis of the Race Condition

The failure is a classic frame-scheduling race condition between Playwright and the browser's render loop:

1. **Test Setup**:
   In `tests/browser/key-capture-passthrough.spec.js:303`:
   ```javascript
   await page.waitForFunction(() => {
     // waits for RUNNING, AWAITING_INPUT, activeRunnerIndex === human
   });
   await page.evaluate(() => {
     window.__BBA_TEST_HOOKS__.app.p5Instance?.noLoop?.();
   });
   await page.locator("#playResetButton").focus();
   await page.keyboard.press("d");
   const queuedActionHandle = await page.waitForFunction(() => {
     const queued = window.__BBA_TEST_HOOKS__?.app?.state?.queuedActionForCurrentRunner;
     if (!queued) return null;
     return { ... };
   });
   ```

2. **The Race**:
   - `p5.noLoop()` does **not** abort a `requestAnimationFrame` callback that is already queued in the browser event loop. It only sets `p5._loop = false`, ensuring no *subsequent* animation frame is scheduled after the currently queued one fires.
   - When Playwright invokes `page.locator("#playResetButton").focus()` and `page.keyboard.press("d")`, the keyboard event is processed immediately by p5's `window.onkeydown` listener.
   - `handleKeyInput` -> `handlePlayerInput` successfully queues the human move:
     ```javascript
     state.queuedActionForCurrentRunner = createQueuedHumanAction(runner, actionData);
     state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
     ```
   - If the pending `requestAnimationFrame` fires *after* `page.keyboard.press("d")` queues the action but *before* Playwright's subsequent `page.waitForFunction` begins polling:
     - `p.draw()` runs.
     - `p.draw()` calls `processTurnActions(app, p)`.
     - In `src/core/turnEngine.js` lines 772-776:
       ```javascript
       if (state.currentTurnState === TURN_STATES.PROCESSING_ACTION && state.queuedActionForCurrentRunner) {
         if (state.queuedActionForCurrentRunner.runner === runner) {
           executeQueuedAction(app, runner, state.queuedActionForCurrentRunner);
           state.queuedActionForCurrentRunner = null;
         }
       }
       ```
     - `state.queuedActionForCurrentRunner` is executed and reset to `null` in ~0-16ms.
   - When Playwright's `page.waitForFunction` starts polling `state.queuedActionForCurrentRunner`, the property is **already `null`**.
   - Because no further action is queued, `page.waitForFunction` waits until the 30-second Playwright timeout expires.

3. **Why the test passes alone most of the time**:
   When CPU/IPC timing allows `page.waitForFunction` to attach before the final animation frame executes, or when the final frame fires *before* `press("d")`, `queuedActionForCurrentRunner` remains non-null until the test explicitly calls `hooks.processTurn()`. However, any timing perturbation (such as running earlier tests in the suite, or slight scheduling delays) shifts this boundary and triggers the failure.

---

## 5. Why the Plan 122 Fix Cannot Proceed As Written

1. Plan 122's remedy was exclusively:
   - Set `workers: 1` in `playwright.smoke.config.js`.
   - Update comments and `docs/TESTING.md`.
2. As proven above, `workers: 1` does not fix the failure. The smoke suite still fails under `workers: 1` (Runs 2, 3, and 7 above).
3. Requirement R3 ("Three consecutive full-suite runs, all 61/61") cannot be met under the current test implementation.
4. Plan 122 explicit Non-goals prohibit:
   - Modifying test logic in `key-capture-passthrough.spec.js`.
   - Raising test timeouts.
   - Modifying `src/`.
   - Moving `key-capture-passthrough.spec.js` out of smoke without approval.
5. Therefore, Stop Condition 1 ("the full smoke suite fails at `workers: 1` — concurrency was then not the whole cause") and Stop Condition 4 ("the fix appears to require changing `src/` or the test's own logic") are both active.

---

## 6. Files Changed & Tree Status

- **Files modified in `src/` or config**: None.
- **Artifacts created**:
  - `reports/development/plan-122-smoke-tier-concurrency-repair/progress.md` (this report)
- **Git status**: Clean working tree except for this newly created progress report.
- **Baseline checks**:
  - `npm test`: 595 passed, 0 failed (10.7s)
  - `npm run build`: built in 7.82s without errors

---

## 7. Recommended Options for the Orchestrator / Owner

To properly fix the failure and unblock the Pages deploy:

1. **Fix the race condition in `tests/browser/key-capture-passthrough.spec.js:303` (Recommended)**:
   Ensure the animation loop is truly idle before sending the key press (e.g. wait for one frame after `noLoop()`, or have `waitForFunction` check either `queuedActionForCurrentRunner` OR `human.actionHistory.includes("MOVE")`), so the test does not flake regardless of whether the action is still queued or was already processed in the final frame.
2. **Move `key-capture-passthrough.spec.js` or the D-key test to extended / release tier**:
   (Previously rejected in Plan 122 because release does not run in routine CI, but worth re-evaluating if browser event dispatch tests require relaxed timing guarantees).
3. **Serialize smoke tier (`workers: 1`) in conjunction with Option 1**:
   Serializing smoke may still be desirable for deterministic execution across slower CI runners, but it must be paired with Option 1 to achieve stability.

---

## 8. Readiness

- **Ready for orchestrator review**: **YES** (Stop condition reached; awaiting owner decision on test repair).
