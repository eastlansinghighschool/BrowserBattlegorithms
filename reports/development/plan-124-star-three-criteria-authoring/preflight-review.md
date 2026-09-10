# Plan 124 — Preflight Review

**Date:** 2026-09-10
**Reviewer:** orchestrator
**Verdict:** **approved to proceed, with one scope reduction and five required changes.**
**Packet status:** stays `in-progress`.

## Summary

The triage is good work and the headline outcome is right. One authored level out of twenty-six is
exactly the shape the packet predicted, and the plan resisted the temptation to pad the yield. The
two empirical claims that matter most were re-run independently by the orchestrator and **both hold
exactly as reported.**

The scope reduction is that `no-collision` should not be registered at all — see R1, which rests on
a mechanical finding neither the packet nor the gate had right.

## Independent verification — what the orchestrator re-ran

Reference solutions were replayed through `runGuidedLevelWithSolution` with counters read from
`getAttemptCounters`:

| Level | Result | Turns / par | collide | mapBlock | resUnavail | badFreeze |
|---|---|---|---|---|---|---|
| `show-what-you-know` | PASSED | 35 / 41 | 0 | **1** | 0 | 0 |
| `bughunt-28` | PASSED | 12 / 14 | 0 | 0 | 0 | **1** |
| `bughunt-37` | PASSED | 12 / 14 | 0 | 0 | 0 | 0 |
| `freeze-the-lane` | PASSED | 5 / 7 | 0 | 0 | 0 | 0 |
| `two-conditions-at-once` | PASSED | 5 / 7 | 0 | 0 | 0 | 0 |
| `closest-threat` | PASSED | 5 / 7 | 0 | 0 | 0 | 0 |
| `this-or-that` | PASSED | 7 / 9 | 0 | 0 | 0 | 0 |
| `flip-the-answer` | PASSED | 7 / 9 | 0 | 0 | 0 | 0 |
| `how-far-away` | PASSED | 6 / 8 | 0 | 0 | 0 | 0 |

**Confirmed:** `show-what-you-know` passes in 35 turns against par 41 with zero wasted resources, so
the reference half of the falsifiable pair is real. **Confirmed:** `bughunt-28`'s reference solution
does fire a freeze that affects nobody, so it fails `no-wasted-resource` on its own clean run and
the rejection is correct.

## R1 — Do not register `no-collision`. Register only `no-wasted-resource`.

This is a scope reduction, and the reason is a mechanical finding that reframes the criterion.

`runner_collision_bounce` is emitted from exactly one place, `src/core/turnEngine.js:592-605`, and
only when the target cell holds a runner that is **either on the same team, or frozen**:

```js
const runnerInTargetCell = getRunnerAtCell(targetGridX, targetGridY, state.allRunners, actionRunner.id);
if (runnerInTargetCell) {
  if (runnerInTargetCell.team === actionRunner.team || runnerInTargetCell.isFrozen) {
    // ... emitBlockedOrBounced(..., "runner_collision_bounce")
  } else {
    resolveCollision(...);   // tag / capture — no bounce event at all
  }
}
```

So `runnerCollisionBounces` does **not** count enemy contact. It counts two things: bumping into
your own teammate, and walking into an enemy you have already frozen.

That matters more than the authoring outcome:

- The implementer's conclusion is right, and their stated reason is right in effect but imprecise.
  The precise statement is not "collisions resolve as tags rather than bounces on these boards" —
  it is that **live enemy contact can never produce this counter on any board**, and the only two
  routes to it are the ally teammate and a frozen enemy.
- **The gate's rationale for including runner collision was wrong.** The recommendation the owner
  accepted said runner collision "is the enemy-sensing concept the living-board levels teach." It
  is not. The *ruling* — exclude `mapBlockageBounces` — stands and is now independently vindicated
  (see R5), but the reasoning that admitted `runnerCollisionBounces` does not survive contact with
  the engine.
- **`no-collision` is therefore a misleading name for what the counter measures.** Registering an
  id by that name, used by no level, bakes a wrong promise into a closed vocabulary. The packet's
  own standard — do not award a criterion that discriminates nothing — extends to this: do not
  register an evaluator nothing uses, under a name that misdescribes it.

**Required:** register `no-wasted-resource` only. Record `no-collision` in the progress report as
investigated and not authorable, with the mechanism above stated exactly. Note that if a future
level ever discriminates on it, it should be named for what it measures (an ally-obstruction
criterion, not an enemy-collision one) and that renaming is a charter conversation, exactly as
`mapBlockageBounces` already is.

The absent-counter fail-closed tests still apply to `no-wasted-resource` and are still required.

## R2 — The level file path in the plan is wrong

The plan targets
`src/config/levels/phases/resources-and-territory/level-22-show-what-you-know.js`. **That file does
not exist.** The level lives at
`src/config/levels/phases/advanced-logic/level-22-show-what-you-know.js`, and the triage table's
"Resources & Territory" phase attribution for it is wrong too.

`turnPar: 41` and `maxTurns: 56` are confirmed correct at lines 59-61 and 57.

Correct the path and re-check the phase column for the other rows before the report is written; a
wrong phase in a durable evidence table is the kind of error that gets quoted later.

## R3 — Five rejections rest on an unsimulated empirical claim

Most of the twenty-six are disqualified by inspection — no resources in the toolbox, no reachable
counter — and that reasoning is sound and cheap, which is what the packet asked for.

But five rejections turn on the claim that a degraded run **fails**, which is an empirical claim
about engine behaviour and not an inspection result:

- `dodge-and-deliver` (L15) — "ally is tagged (fails)"
- `jump-if-ready` (L16) — "loops indefinitely, level times out"
- `freeze-the-lane` (L21) — "charger tagging ally or timeout"
- `two-conditions-at-once` (L25) — "tag/timeout failure"
- `bughunt-37` — "if both allies move, they collide and fail"

A wrong claim here is a **false rejection**: a level that could honestly carry star 3 silently does
not. Run the degraded variant for each of these five and record the actual result and counters in
the evidence table. The harness call is cheap and you have already used it.

The rejections resting on toolbox contents or immediate win conditions need no simulation.

## R4 — The degraded variant is a fixture, not an inline string

`plan-100` established the convention: a deliberately degraded guided solution lives at
`tests/unit/fixtures/guided-naive-solutions/<level-id>.xml`. Five already exist. The
`show-what-you-know` degraded variant is precisely that kind of artifact and must be written to
`tests/unit/fixtures/guided-naive-solutions/show-what-you-know.xml` rather than embedded in the
test file.

**Ride-along, optional but wanted.** `tests/unit/star-evaluation-campaign.test.js` — a file this
packet already modifies — embeds a 122-line hand-modified derivative of the advanced-scrimmage
solution at lines 166-276, with no mechanical link to the fixture it derives from. It is a standing
open question, flagged as small enough to ride along with the next packet touching that area, and
this is that packet. Extract it to the same convention if it is mechanical. **Stop and say so if it
is not** — do not force it, and do not let it delay the authoring work.

## R5 — Record the map-blockage reading on `show-what-you-know`

The verification run found something the triage did not report: **the reference solution for the one
authored level bumps into map geometry once** (`mapBlockageBounces: 1`).

It changes nothing under the ruling as made, because `no-wasted-resource` does not read that
counter. But it is worth recording, because it converts the gate's map-blockage exclusion from a
judgment call into an evidenced one: **had map blockage been folded in, the reference solution for
the only authorable level in the campaign would have failed its own criterion** — the exact defect
that disqualified `bughunt-28`. Put this in the progress report.

## R6 — Two observations to record, not to fix

Both are out of scope. Record them and move on; do not repair either in this packet.

1. **`bughunt-28`'s reference solution wastes a freeze.** The canonical solution to a bug-hunt level
   fires an Area Freeze that affects nobody. Whether that is acceptable in a level whose lesson is
   about a boolean trap is a curriculum question for the owner, not an authoring question for this
   packet. State it plainly in the report.
2. **Two of `plan-116`'s four counters end this packet unspent.** `mapBlockageBounces` was
   deliberately unused by design; `runnerCollisionBounces` turns out to be unauthorable for the
   structural reason in R1. Worth noting alongside it: `runnerCollisionBounces` was only ever tested
   with synthetic payloads — the four engine-driven tests in `tests/unit/attempt-counters.test.js`
   cover a clean run, a map blockage, a resource exhaustion, and an ineffective freeze, but never a
   real runner-collision bounce. That is not a defect in `plan-116` and is not cause to reopen it,
   but it should be recorded so a future thread does not assume the counter is proven in situ.

## Accepted as proposed — do not change these

- The evaluator shape and the fail-closed handling of absent, null, and non-finite counters.
- The cumulative-tier test set, including par-missed-plus-mastery-achieved earning 1 star with
  `masteryAchieved: true`.
- Leaving all nine `both-allies-active` levels untouched.
- Branch C advisor declaration. The provider is not on the capable list, the fail-closed reading is
  correct, and a docs-and-authoring packet of this size would not warrant a consultation regardless.
- The rejection reasoning for every candidate disqualified on toolbox contents or an immediate win
  condition.
- Registering the new test file explicitly in `package.json`.

## Acceptance for the next review

- `no-collision` is **not** registered; the mechanism from R1 is stated in the report.
- The `show-what-you-know` path is corrected and the phase column re-checked.
- The five R3 rejections carry simulated results, not reasoning alone.
- The degraded variant is a `guided-naive-solutions` fixture.
- The `mapBlockageBounces: 1` reading and both R6 observations appear in the report.
- The evidence table still covers all 26 candidates.
- `npm test`, `npm run build`, `npm run lint:levels` clean (the two known optional-lab untiered
  warnings are expected and pre-existing).
- Packet returns to `delivered`.

## Stop conditions, unchanged from the packet, plus one

- If the R3 simulations show that any of those five levels **does** discriminate, stop and report
  before authoring it. That is a good outcome, not a problem, but it changes the packet's shape and
  the orchestrator should see the evidence first.
