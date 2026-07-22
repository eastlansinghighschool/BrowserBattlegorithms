# Plan 107 Repair Directions (Repair 01)

**Date:** 2026-07-21
**Source:** Orchestration review of the first Plan 107 implementation pass. Verdict: send back. Three contract-level gaps, one untested core behavior, four minors.
**Status of this file:** durable work order for the repair pass. The packet (`docs/development/plan-107-usage-tracker-v2-run-version-store-and-value-based-pruning.md`) remains the contract; note that its D2 line was amended 2026-07-21 per the owner decision below.

## What the first pass got right (do not regress these)

- Scope discipline: only claimed files changed; `run-version-store.test.js` registered in `test:unit`; package.json otherwise untouched.
- D1 guided window (8-level LRU), K = 5 semantics (first + last + most-recent-5, honestly documented as 7 entries), per-level caps — correct with real tests.
- B7 snapshot coalescing (`reason` dropped, 600 ms debounce intact).
- Capture is execution-path-only (no firing on edits/imports) and reuses `hashStarterXml`.
- Plan 106 carried follow-ups (a) negative eviction test, (b) `durationMs` doc, (c) `usageTrackerSessionInternal` rename — all done.
- No `plan-status.js set` call. Correct.

## Repair 1 (MAJOR + owner decision): Free-play keying per team slot

- **Defect:** `recordRunVersion` fires per runner per turn (`src/ai/blockly/workspace.js:758, 769, 794, 805`), and in Free Play PvP the two teams' programs alternate in the single free-play bucket, so last-stored dedupe (`src/usage/runVersionStore.js:121-124, 132-135`) fails nearly every runner-turn. The D2 window churns into a per-turn XML log and `runVersionStoreTruncated` fires during normal play.
- **Owner decision (docs/decision-log.md, 2026-07-21):** free-play contexts are keyed **per team slot** — `freeplay:team1` / `freeplay:team2` — mirroring the existing per-team stored workspaces (`getStoredWorkspaceXmlText(app, runner.team)`). Each team key has its own dedupe chain and its own ~20-version window; the ~2 MB budget bounds the total.
- **Fix:** derive the free-play context key from `runner.team` (the same team identity the stored workspaces already use), not a single shared bucket. Guided context (`levelId`) is unchanged — guided always uses the single visible workspace, no interleaving.
- **Proof:** a test that simulates two interleaved PvP team programs over multiple turns and asserts each team's dedupe chain is stable (no new versions when neither program changed; new version only when that team's program changed). This is the test whose absence let the defect ship — it is mandatory.

## Repair 2 (MAJOR): Implement the settled age-eviction exemption

- **Defect:** `pruneSessions` (`src/usage/usageTracker.js:101-143`) is untouched — whole sessions are still deleted at 7 days / >20 sessions, taking the durable ledger and run-version store with them; new sessions start with empty durable tiers (`usageTracker.js:216-222`). The decision-log posture (2026-07-21: durable tiers exempt from age eviction) and the subsystem note's "retained across session lifecycles" claim are both false at rollover.
- **Fix (owner-approved direction):** carry the durable tiers forward. When session rollover happens (age or count expiry of the previous active session), the new session inherits the prior session's durable learning ledger, pass-ledger mirror, and run-version store (with a flag noting the carry-over, e.g. `durableTiersCarriedFrom: <priorSessionId>`). Age/count pruning continues to apply to sessions' ephemeral churn and event tails as before — an expired session's events/snapshots die with it; its durable tiers survive in the successor.
- **Constraint:** carry-over must not resurrect data the value-based cascade already evicted; carry the post-pruning state.
- **Proof:** tests for (a) rollover preserves ledger + run-version store across a simulated 7-day boundary, (b) churn/event tails do NOT carry over, (c) `reached`/pass data readable in the new session without the old one.

## Repair 3 (MAJOR): Quota-failure graceful degradation

- **Defect:** `schedulePersist` (`src/usage/usageTracker.js:236-246`) has no error handling on the IndexedDB `put`; a quota rejection becomes an unhandled promise rejection with no eviction cascade and no flag. Packet Req 3 explicitly covers this; the progress report claimed it done.
- **Fix:** catch persist failures; on quota-type errors run the documented eviction cascade (churn/event tails first, then oldest free-play versions, then oldest guided windows — ledger never touched), retry the persist once, and set the truncation flag if data was discarded. Never throw into student-facing flows.
- **Proof:** a test with an injected failing persist that asserts: no unhandled rejection, cascade ran in order, flag set, retry attempted.

## Repair 4 (MAJOR): Test the B2 eviction cascade itself

- **Defect:** `evictLowestValueEvents` (`src/usage/usageFormat.js:203-247`) has zero tests asserting tier order; existing truncation tests use only `workspace_changed` events and pass identically under plain FIFO. The progress report's "old FIFO assertions replaced" was hollow (there were none).
- **Fix:** add tests that construct mixed-tier sessions and assert eviction order: `workspace_changed` first, then `workspace_snapshot`/`export_*`, then `tutorial_replayed`, then oldest remaining events — and that a regression to plain front-splice FIFO would fail these tests (say so in a comment; better: include a fixture where FIFO and B2 order observably differ).
- **Proof:** the new tests fail if the cascade is replaced by splice-from-front (verify by mentally or temporarily simulating; state the check in the progress report).

## Repair 5 (MINOR): Snapshot cap disclosure

- `usageFormat.js:436-438` still splice-from-front on the snapshot cap. Defensible (snapshots are churn) — keep it, but say so explicitly in the subsystem note so the note's eviction description matches code.

## Repair 6 (MINOR): Account for XML-heavy events in cap sizing

- Carried follow-up (d) from plan-106 is unaddressed: `level_*` events now carry full `xmlText` and sit in protected tiers, so ~400 events × multi-KB XML can accumulate. Either scope an event-payload byte cap for the event tail (evicting oldest first regardless of tier when the byte cap trips, ledger unaffected) or document in the subsystem note why count-based caps remain safe with XML payloads (with rough math). Implementer's choice; silence is not acceptable.

## Repair 7 (MINOR): Flag propagation on hydration

- `normalizeRunVersionStore` (`usageFormat.js:506`) can set `store.flags.runVersionStoreTruncated` without propagating to `session.flags` (propagation currently only in `recordRunVersion` when `stored` is true). Propagate hydration-time flags too, with a test.

## Repair 8: Progress report honesty

- Rewrite the progress report's validation/risk sections: the quota-degradation and FIFO-replacement claims were false, and the PvP risk note missed the interleaving churn entirely. Record the repair-pass commands, real counts, the Repair-6 choice, and remaining risks.
- Restore `package.json`'s trailing newline.

## Process requirements

- Do NOT run `plan-status.js set` at any status. Status flips happen only after orchestration re-review.
- Keep the diff scoped to the repairs above. No export-shape changes (plan-108), no analyzer changes (plan-109).
- If a repair forces a choice this file does not cover, stop and surface — do not decide silently.

## Validation gate for the repair pass

1. `npm test` passes with `run-version-store.test.js` registered (report counts).
2. New tests mandatory from Repairs 1, 2, 3, 4 present and green.
3. `npm run build` passes.
4. Subsystem note true on: lifecycle retention, snapshot FIFO disclosure, Repair-6 outcome, per-team free-play keying.
5. Progress report rewritten per Repair 8.
