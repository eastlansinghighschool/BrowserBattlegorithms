# Plan 25a: Blockly Trace Collection (Data Only)

## Packet Metadata

- Packet id: plan-25a
- Packet title: Blockly Trace Collection (Data Only)
- Status: ready
- Owner/model: implementation agent
- Date: 2026-05-15
- Packet type: implementation / source-code / tests / docs
- Mutation level: source-code / tests / docs-only
- Approval gate: none for implementation; integration owner reviews trace evidence before Plan 25b begins
- Expected artifacts:
  - configurable speed threshold constant and "trace mode active" helper
  - argument-threaded trace collector through Blockly action resolution
  - dev-only inspection hook for collected traces (no DOM/UI surface)
  - focused unit tests proving collection fidelity, short-circuit honesty, and action-selection invariance
  - subsystem note update describing the data-only collector and explicitly deferring playback to Plan 25b
  - progress report
- Progress report folder: `reports/development/plan-25a-blockly-trace-collection/`
- Progress report file: `reports/development/plan-25a-blockly-trace-collection/progress.md`

## Packet Summary

Goal: Add a data-only Blockly evaluation trace that records what the action resolver actually visited and evaluated for a Blockly-controlled runner's turn. No turn-engine state changes. No DOM highlighting. No playback. The trace is collected during the existing `getFirstRunnableAction` call and exposed for tests and dev-only inspection, so Plan 25b can later render a visual pre-action trace without touching the resolver semantics.

Non-goals:

- Do not add a turn-engine pause, animation, or pre-action delay.
- Do not change which action a Blockly program chooses.
- Do not change one-action-per-turn semantics.
- Do not render trace state in the DOM, in Blockly, or in any student-facing UI.
- Do not add a settings panel, threshold UI, or speed-slider behavior change.
- Do not trace human-controlled keyboard decisions.
- Do not trace NPC / free-play CPU internals.
- Do not trace Blockly action resolution for the inactive PvP team's hidden workspace.
- Do not add dependencies.
- Do not deploy.

Depends on:

- Current Blockly resolver in `src/ai/blockly/workspace.js` (`resolveFirstRunnableAction`, `evaluateBlocklyBooleanValue`, `evaluateBlocklyNumberValue`, `getFirstRunnableAction`).
- Current interpreter entry point in `src/ai/blockly/interpreter.js`.
- Current `animationSpeedFactor` state field in `src/core/state.js` and slider mapping in `src/ui/controls.js` (read-only for this packet).

Blocks:

- Plan 25b (pre-action trace playback UI), which consumes the collector shape this packet defines.

Why this packet exists:

The pedagogically useful part of a slow-speed trace — showing students which condition was checked, whether it was true or false, and which action was selected — is fundamentally a *data* problem before it is a *UI* problem. Splitting the data work out first lets us:

- Prove the resolver is unchanged with tracing enabled, exhaustively, in unit tests.
- Lock in short-circuit honesty (the trace contains only what the interpreter actually evaluated).
- Solve the PvP hidden-workspace re-entrancy hazard in the same place where the bug would otherwise live.
- Give Plan 06 browser-agent runs and the integration owner a dev-only console surface to inspect real traces from real student programs before the UI design is locked.

It also keeps the riskier turn-engine state machine and Blockly visual work in Plan 25b, where it can be reviewed on its own merits.

## Authority And Contracts

Sources of truth:

- Product and pedagogy:
  - `docs/GameSpecification.md`
  - `docs/TeacherGuide.md`
  - `docs/StudentGuide.md`
  - `docs/GUIDED_LEVEL_CONCEPT_MATRIX.md`
  - `docs/development/README.md`
- Architecture and testing:
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `package.json`
  - `src/ai/blockly/workspace.js`
  - `src/ai/blockly/interpreter.js`
  - `src/config/constants.js`
  - `src/core/state.js`
  - `tests/unit/`
- Runtime contracts:
  - `docs/subsystems/blockly-workspace.md`
  - `docs/subsystems/turn-engine.md`

Required product contracts:

- Blockly programs still choose exactly one first reached action per ally turn. The action returned to the engine when tracing is enabled is bitwise identical to the action returned when tracing is disabled.
- The collector is a passive observer. It must not mutate Blockly XML, saved workspaces, runner state, or game state.
- No turn-engine state changes, no animation changes, no Blockly highlighting, no DOM updates in this packet.
- The app remains static Vite output.
- The collector must be re-entrancy-safe so the visible-workspace path and the (skipped) PvP hidden-workspace path cannot corrupt one another.

Do not redefine:

- Existing Blockly block set.
- Existing action-selection model.
- Speed slider behavior or `animationSpeedFactor` mapping.
- Free Play CPU behavior.
- Usage/export file formats.

## Required Reading

Read these first:

- `docs/packet-creation-guidance.md`
- `docs/subsystems/blockly-workspace.md`
- `docs/subsystems/turn-engine.md`
- `src/ai/blockly/workspace.js`
- `src/ai/blockly/interpreter.js`
- `src/ai/blockly/blocks.js`
- `src/config/constants.js`
- `src/core/state.js`
- `tests/unit/blockly-interpreter.test.js`

Use `rg "resolveFirstRunnableAction|evaluateBlocklyBooleanValue|evaluateBlocklyNumberValue|getFirstRunnableAction|getActionDecisionForBlock|getConditionDescriptor|animationSpeedFactor|FREE_PLAY_MODES|activeBlocklyTeamTab"` from the repository root if symbol names have moved.

Optional/contextual:

- `tests/unit/helpers/testHarness.js`
- `src/ui/controls.js` (only to confirm the existing speed-factor mapping; do not modify)

## Scope

### In scope

- A single named configurable threshold constant for trace activation. Start at the owner-suggested default of `0.5` animation speed factor. Export from a central config module so Plan 25b can read the same constant without duplicating it.
- A small helper such as `isBlocklyTraceCollectionActive(state)` that returns true when `state.animationSpeedFactor <= BLOCKLY_TRACE_SPEED_THRESHOLD`. The helper does not consult mode, runner kind, or visibility — those checks happen at the call site.
- An optional `collector` argument threaded through `resolveFirstRunnableAction`, `evaluateBlocklyBooleanValue`, and (where relevant) `evaluateBlocklyNumberValue`. When the collector is omitted, behavior is unchanged.
- A `BlocklyTraceCollector` shape with a clear append API and a finalize/read API. Implementation can be a class or a plain factory that returns `{ recordStep, getSteps }` — the choice is the implementing agent's, but it must not be module-level mutable state.
- A new exported entry point such as `getFirstRunnableActionWithTrace(app, runner)` that returns `{ action, trace }`. Existing `getFirstRunnableAction(app, runner)` keeps returning the action only and remains the call path used by `getAIAllyAction`.
- Trace steps record at minimum:
  - `blockId`
  - `blockType`
  - `kind` — one of `"condition"`, `"boolean"`, `"comparison"`, `"action"`, `"empty"` (see Requirement 2 for exact set)
  - `result` — boolean for condition/boolean/comparison steps; absent for action steps
  - `numericLeft` / `numericRight` for comparison steps (resolved numeric values)
  - `runnerId`, `runnerTeam`
- Dev-only inspection hook: after each visible-workspace `getFirstRunnableActionWithTrace` call from `getAIAllyAction`, stash the most recent trace on `window.__bbaLastBlocklyTrace` when `window` exists. This is for Plan 06 browser-agent runs and owner inspection. It is read-only and does not affect game state. No code path may read this back.
- Skip trace collection entirely on the PvP inactive-team hidden-workspace path (the branch in `getFirstRunnableAction` that builds a throwaway `new Blockly.Workspace()`). Do not pass a collector down that branch.
- Unit tests.
- One small update to `docs/subsystems/blockly-workspace.md` describing the data-only collector and pointing at Plan 25b for playback.
- Plan 25a progress report.

### Files and areas likely touched

- `src/config/constants.js` — threshold constant and any new exported names.
- `src/ai/blockly/workspace.js` — collector parameter threading, new `getFirstRunnableActionWithTrace`.
- `src/ai/blockly/interpreter.js` — call site changes to use the new entry point on the visible-workspace path, dev-only window stash.
- `tests/unit/blockly-interpreter.test.js` — extended coverage, or a new sibling file `tests/unit/blockly-trace-collection.test.js`.
- `docs/subsystems/blockly-workspace.md` — short addition describing the collector.
- `reports/development/plan-25a-blockly-trace-collection/progress.md` — progress report.

### Out of scope

- Any turn-engine changes (no new turn state, no pre-action pause, no animation timing change).
- Any DOM, CSS, or Blockly visual change.
- Any speed-slider or settings UI change.
- New Blockly blocks.
- Reading the dev-only `window.__bbaLastBlocklyTrace` back from any source code path.
- Usage analytics schema changes.
- Playwright/browser tests (Plan 25b owns those).
- Dependency installs, workflow edits, deployment.

## Work Plan

1. Read the resolver and interpreter call sites; confirm the visible-workspace vs hidden-workspace branches in `getFirstRunnableAction`.
2. Add the threshold constant and `isBlocklyTraceCollectionActive` helper in `src/config/constants.js` (or the appropriate central config module if a better location already exists; if you move it, say so in the progress report).
3. Add the collector factory/class. Keep its surface small: `recordStep(step)`, `getSteps()`.
4. Add the optional `collector` parameter to `resolveFirstRunnableAction`, `evaluateBlocklyBooleanValue`, and `evaluateBlocklyNumberValue` (the latter only if comparison steps need to record resolved numeric values; if `evaluateBlocklyNumberValue` is currently pure and side-effect free, recording can also happen at the comparison block in `evaluateBlocklyBooleanValue`).
5. Add `getFirstRunnableActionWithTrace(app, runner)`. Only the visible-workspace branch builds a collector. The hidden-workspace branch returns `{ action, trace: null }`.
6. Update `getAIAllyAction` in `src/ai/blockly/interpreter.js` to call the new entry point when `isBlocklyTraceCollectionActive(app.state)` is true and the runner is on the visible workspace; otherwise call the existing `getFirstRunnableAction`. Stash the trace on `window.__bbaLastBlocklyTrace` when available.
7. Add unit tests (Requirement 5).
8. Update `docs/subsystems/blockly-workspace.md`.
9. Run validation. Write the progress report.

## Implementation Requirements

### Requirement 1: Threshold constant and active helper

Required behavior:

- One exported constant `BLOCKLY_TRACE_SPEED_THRESHOLD` initialized to `0.5`.
- One exported helper `isBlocklyTraceCollectionActive(state)` returning `state.animationSpeedFactor <= BLOCKLY_TRACE_SPEED_THRESHOLD`.
- Both live in a single module. No duplicate threshold literals elsewhere.

Constraints:

- The helper takes the app state object, not the raw factor, so future callers can extend the gate without changing every call site.
- The helper does not check mode, runner kind, workspace visibility, or playback state. Those concerns belong to the call site (today only `getAIAllyAction`) and to Plan 25b.

Edge cases:

- If `state.animationSpeedFactor` is missing or non-numeric, return `false`.
- If the threshold is set to `0`, the helper returns `true` only when the factor is also `0`; this is fine for a kill-switch since `0` is the paused state.

Expected artifact:

- Threshold constant + helper exported from a central config module.

### Requirement 2: Trace step shape

Required behavior:

- A `BlocklyTraceStep` object has the following fields. Use plain objects; do not invent a class.
  - `blockId: string`
  - `blockType: string`
  - `kind: "condition" | "boolean" | "comparison" | "action" | "empty"`
  - `result?: boolean` — present for `condition`, `boolean`, and `comparison` kinds; absent for `action` and `empty`.
  - `numericLeft?: number`, `numericRight?: number` — present for `comparison` kind only; record the resolved values that fed the comparison.
  - `runnerId: string | number`, `runnerTeam: number`
- Step ordering reflects the order in which the resolver actually visited and evaluated the block. Short-circuited boolean operands are not recorded. Branches not taken are not recorded.
- A `"condition"` kind covers `IF_*` style blocks evaluated by `evaluateCondition` or by direct boolean child evaluation. A `"boolean"` kind covers AND/OR/NOT/literal-boolean operand evaluations recorded as the recursion proceeds. A `"comparison"` kind covers `VALUE_COMPARE` blocks.
- An `"action"` step is recorded immediately before the resolver returns the chosen action.
- An `"empty"` step is recorded once at the end of a resolution that produced no action (the resolver returned `null`). This makes "program produced no action" observable without re-walking the program.

Constraints:

- Preserve AND/OR short-circuit exactly: if the left operand of `AND` is `false`, the right operand is not evaluated and is not in the trace. Same for `OR` with a `true` left.
- The trace must not cause `evaluateCondition`, `evaluateBlocklyBooleanValue`, or `evaluateBlocklyNumberValue` to be invoked more times than they would be without tracing.
- The trace must never mutate Blockly state — no `setWarningText`, no `setDisabledReason`, no `highlightBlock`, no XML changes.

Edge cases:

- Empty event block: resolver returns `null`; trace has one `"empty"` step with `blockId` set to the event block id and `blockType` set to its type.
- Missing branch block (e.g. `IF` with no child): no extra step is recorded for the missing branch; resolver continues to the next sibling per existing semantics.
- A condition block whose condition evaluates true but whose child branch produces no action: the condition is recorded with `result: true`, then resolution falls through to the next sibling — no synthetic step is added for the empty branch.

Expected artifact:

- Documented step shape in a JSDoc comment on the collector entry point or in a short README-style comment block at the top of the new tests file. Do not add a new public docs file.

### Requirement 3: Collector threading and re-entrancy

Required behavior:

- The collector is passed as an explicit argument to `resolveFirstRunnableAction`, `evaluateBlocklyBooleanValue`, and any other resolver-side function that needs to record a step.
- The collector argument is optional. When omitted, every function behaves exactly as it did before this packet.
- No module-level mutable trace state. No singleton collector.

Constraints:

- The visible-workspace branch of `getFirstRunnableAction` and the hidden-workspace branch can both be invoked in the same JS tick (today they are not, but the recursion is mutually accessible). The collector must therefore be a per-call value, not a shared one.
- The hidden-workspace branch does not allocate a collector and does not pass one down.

Edge cases:

- If a future caller decides to collect traces for the hidden-workspace branch, this packet does not enable it. The branch must remain trace-free until Plan 25b (or later) explicitly opts in.

Expected artifact:

- Optional `collector` parameters on the threaded resolver functions; new entry point `getFirstRunnableActionWithTrace`.

### Requirement 4: Dev-only inspection hook

Required behavior:

- After `getAIAllyAction` invokes the visible-workspace trace path, stash the resulting trace on `window.__bbaLastBlocklyTrace` if `typeof window !== "undefined"`. Stash an object like `{ runnerId, runnerTeam, turnNumber, levelId, steps }`.
- The stash is overwritten each turn. No history is kept.
- No source code path reads this back. It exists solely for Plan 06 browser-agent inspection and integration-owner debugging.

Constraints:

- Do not stash when tracing is inactive (i.e. when the existing `getFirstRunnableAction` path is taken).
- Do not stash on Node / unit-test runs (no `window`).
- Do not record to `localStorage`, `console`, usage tracker, or any other surface.

Edge cases:

- If the trace is `null` (hidden-workspace path was taken — should not happen from `getAIAllyAction` today, but defensively), do not overwrite the stash.

Expected artifact:

- Small block in `interpreter.js` that performs the conditional window stash.

### Requirement 5: Unit tests

Required behavior:

- Action-selection invariance: for a representative set of programs (empty event block, single action, nested `if`, `if/else`, AND short-circuit, OR short-circuit, NOT, VALUE_COMPARE), the action returned by `getFirstRunnableActionWithTrace` equals the action returned by `getFirstRunnableAction` for the same state.
- Trace fidelity:
  - An empty event block produces exactly one `"empty"` step.
  - A single unconditional action produces one `"action"` step and no condition steps.
  - An `if` whose condition evaluates true and contains an action produces a `"condition"` step with `result: true` followed by an `"action"` step.
  - An `if/else` whose condition evaluates false and whose else branch contains an action produces a `"condition"` step with `result: false` followed by an `"action"` step. No step is recorded for the (skipped) true branch.
  - An `AND` whose left operand is false records the left boolean operand once with `result: false`; the right operand is not in the trace.
  - An `OR` whose left operand is true records the left boolean operand once with `result: true`; the right operand is not in the trace.
  - A `VALUE_COMPARE` records a `"comparison"` step with the resolved `numericLeft` and `numericRight` and the correct `result`.
- Re-entrancy safety: invoking `getFirstRunnableActionWithTrace` twice in succession on two different runners returns independent trace arrays.

Constraints:

- Build test workspaces using existing test harness helpers (or direct Blockly XML loading). Do not use drag-and-drop.
- Tests live in `tests/unit/`. Either extend `tests/unit/blockly-interpreter.test.js` or add `tests/unit/blockly-trace-collection.test.js`. Pick whichever produces a clearer file.
- All existing unit tests must continue to pass unchanged.

Expected artifact:

- Unit test coverage as described.

### Requirement 6: Documentation

Required behavior:

- Add a short section to `docs/subsystems/blockly-workspace.md` (under the existing "Warning and execution-hint lifecycle" section, or as a new sibling section titled "Trace collection") describing:
  - The collector is a passive, argument-threaded data path that records what the resolver actually evaluated.
  - It does not mutate workspace state and is not rendered anywhere in this packet.
  - It is skipped on the inactive PvP team's hidden-workspace path.
  - Pre-action visual playback is explicitly deferred to Plan 25b.

Constraints:

- Keep the addition under ~20 lines.
- Do not edit `docs/subsystems/turn-engine.md` in this packet. Plan 25b owns that note's update.

Expected artifact:

- Updated `docs/subsystems/blockly-workspace.md`.

## Model-Specific Instructions

- Start by summarizing the intended scope in one paragraph: data-only collector, no UI, no turn-engine changes, action selection unchanged.
- Read `getFirstRunnableAction` carefully — note the two branches and the disposable hidden workspace. The hidden branch must not receive a collector.
- Prefer threading a single optional `collector` parameter over splitting resolver functions into "with-trace" and "without-trace" twins.
- Do not introduce async, promises, `setTimeout`, or `setInterval` anywhere in the resolver or the new entry point.
- Do not call `Blockly.highlightBlock`, `setWarningText`, `setDisabledReason`, or `hideChaff` from this packet's code paths.
- Do not change `processTurnActions`, `Runner.updateAnimation`, the speed slider, or any DOM. Plan 25b owns those surfaces.
- Stop and report if action-selection invariance cannot be preserved with a passive collector. That is a contract violation and indicates a resolver structural issue this packet should not silently rewrite.
- Stop and report if the existing resolver already has shared mutable state that would make per-call collectors unsafe; the fix is bigger than this packet.

## Commands

Run from the repository root:

```powershell
node --test --test-isolation=none tests/unit/blockly-interpreter.test.js
npm test
npm run build
```

`npm run test:browser` is not required for this packet (no DOM/UI changes), but a green run is welcome if cheap to execute.

## Validation Checklist

- [ ] Threshold constant exported from a single central config module.
- [ ] `isBlocklyTraceCollectionActive(state)` helper exported from the same module.
- [ ] No duplicate threshold literals elsewhere in the codebase.
- [ ] `getFirstRunnableActionWithTrace(app, runner)` exists and returns `{ action, trace }`.
- [ ] Existing `getFirstRunnableAction` and `getAIAllyAction` callers that do not need traces receive the same action they did before.
- [ ] Collector is argument-threaded; no module-level mutable trace state.
- [ ] Hidden PvP workspace branch does not allocate or pass a collector.
- [ ] Short-circuit AND/OR semantics preserved in trace contents.
- [ ] `evaluateCondition` / `evaluateBlocklyBooleanValue` / `evaluateBlocklyNumberValue` are not invoked more times than before.
- [ ] No Blockly UI mutation from this packet's code paths.
- [ ] `window.__bbaLastBlocklyTrace` is written only on the visible-workspace path and only when tracing is active.
- [ ] Unit tests cover the cases listed in Requirement 5 and pass.
- [ ] `npm test` passes.
- [ ] `npm run build` passes.
- [ ] `docs/subsystems/blockly-workspace.md` describes the data-only collector and defers playback to Plan 25b.
- [ ] No unrelated files were changed.
- [ ] Progress report lists commands run, threshold module location, collector entry-point name, and any remaining risks.

## Stop Conditions

Stop and report for integration-owner review if:

- Action-selection invariance cannot be preserved with a passive collector.
- The resolver has shared mutable state that prevents per-call collectors from being safe.
- The threshold constant has no natural home in the existing central config module and creating one would broaden the change.
- The PvP hidden-workspace branch needs structural work to remain trace-free.
- Test infrastructure cannot construct condition/AND/OR/VALUE_COMPARE programs without drag-and-drop.
- Any required change here would also require touching `processTurnActions`, the speed slider, or the DOM. That is Plan 25b territory.
