# Plan 124 — Repair 01

**Date:** 2026-09-10
**Raised by:** orchestrator review of `f79c591` / `462d560`
**Packet status:** `delivered` → `in-progress`
**Scope:** the R4 ride-along fixture only. **The authoring work is accepted and must not be touched.**

## The authoring work is correct and independently verified

Before the defect, what passed review. The orchestrator re-ran the falsifiable pair rather than
reading the report's numbers:

| Run | Result | Turns / par | Stars | parBeaten | mastery | badFreeze |
|---|---|---|---|---|---|---|
| reference solution | PASSED | 35 / 41 | **3** | true | **true** | 0 |
| degraded fixture | PASSED | 37 / 41 | **2** | true | **false** | **2** |

This is a textbook discriminating pair: both runs pass, **both beat par**, and the only thing
separating three stars from two is the criterion itself. Neither run produced a Blockly parse
warning. `no-wasted-resource` is correctly registered and fail-closed; `no-collision` is correctly
absent per Amendment 01; `show-what-you-know` is correctly authored at the corrected
`advanced-logic` path; the R3 simulations are recorded per level with real turn counts and
counters; and the R5 and R6 observations are all present.

One thing the report undersells, worth stating because it closes a gap noted in the decision log:
the `bughunt-37` degraded run recorded **`collide: 9`**. That is the first `runner_collision_bounce`
ever driven through the real engine in a test context — `plan-116` only ever exercised that counter
with synthetic payloads. It also confirms the Amendment 01 mechanism concretely: two same-team
allies bouncing off each other is exactly the ally-obstruction case, and it happens on a run that
**fails**, which is why the criterion is unauthorable rather than merely unused.

## The defect: the extracted fixture is not the program it replaced

`tests/unit/fixtures/guided-naive-solutions/advanced-scrimmage.xml` differs from the inline XML it
was extracted from. On the `battlegorithms_value_compare` block, four tags changed:

```diff
-                <value name="LEFT">
+                <field name="LEFT">
                    <block type="battlegorithms_value_runner_index"></block>
-                </value>
+                </field>
-                <value name="RIGHT">
+                <field name="RIGHT">
                    <block type="battlegorithms_value_number">
                      <field name="VALUE">0</field>
                    </block>
-                </value>
+                </field>
```

`value` → `field` is the same character count, which is why the file lengths match exactly and a
size check would not catch it.

**Blockly silently discards them.** Loading the fixture emits
`Ignoring non-existent field LEFT in block battlegorithms_value_compare` (and the same for RIGHT),
so the runner-index comparison is dropped and the role split with it. Replaying both versions
against the level:

| Version | Ally 1 actions | Allies 2 and 3 actions | collide | Result |
|---|---|---|---|---|
| inline (pre-extraction) | move up / forward / down | **`STAY_STILL` only** | 0 | FAILED |
| extracted fixture | move up / forward / down | **move up / forward / down** | **86** | FAILED |

**The support allies are no longer idled.** In the fixture they run the same program as ally 1 and
jam into each other 86 times.

The test is named `Plan 114: advanced-scrimmage discriminating power - idled support allies cause
failure` and asserts only `activeLevelResult === FAILED`. Both versions fail, so the test is green
while its stated premise is false. It now proves that three allies running one program deadlock —
not that idling support allies costs you the level.

**This is the exact hazard the standing open question described**, quoted verbatim from
`docs/open-questions.md`: *"a future fixture repair could leave the test passing while proving
something weaker than it claims."* The ride-along authorized to remove that hazard instead
triggered it. That is not a reason to regret the extraction — it is the argument for finishing it
properly, because the same corruption sitting inside a 122-line template literal would have been
even harder to see.

## Required repair

1. **Restore the four tags** so the fixture is byte-identical to the pre-extraction inline XML,
   modulo leading and trailing whitespace. Recover the original from
   `git show 3ef2e56:tests/unit/star-evaluation-campaign.test.js` rather than hand-editing, and
   diff the result to confirm.
2. **Give the test the mechanical link the open question asked for.** Failing the level is too weak
   an assertion to protect this fixture — it passed for the wrong reason and nobody noticed. Assert
   the premise directly: the two support allies must have acted, and their action history must
   contain `STAY_STILL` and nothing else. Then a future corruption fails loudly instead of
   silently changing what the test proves.
3. Re-run `npm test` and confirm the count and the campaign test both still pass **with** the
   strengthened assertion — a green suite is not evidence here unless the new assertion is the
   thing being checked.

**Optional, and stop rather than force it.** A general guard would be worth having: fixture-driven
tests could fail on Blockly's `Ignoring non-existent field…` warnings, which is the mechanical
anti-drift rule this repository already uses elsewhere (the `plan-120` hygiene test pinning version
literals is the same idea). If it turns out other existing fixtures already emit warnings, **stop
and report the list rather than fixing them here** — that is a separate packet, not a ride-along on
a ride-along.

## Out of scope — do not touch

- The evaluator, the authored level, `package.json`, or the `show-what-you-know` degraded fixture.
  All verified correct.
- The 26-row triage table, the R3 simulations, and the R5/R6 observations. All accepted.
- Any other level, criterion, or `both-allies-active` file.
- Re-running the R3 simulations. They are recorded and accepted.

## Already corrected inline by the orchestrator — do not redo

`docs/subsystems/usage-and-admin.md`: the `2-Star Max & Concept-Mandatory Levels` bullet was
re-indented from five spaces to six by the edit, nesting it under the criterion-registry bullet
instead of leaving it a sibling. Restored to five spaces. No other change to that file; the new
sub-bullets documenting `no-wasted-resource` and the Amendment 01 rationale are correct and stay.

## Acceptance

- The fixture is byte-identical to the pre-extraction inline XML modulo surrounding whitespace, and
  loading it emits no Blockly warning.
- Allies 2 and 3 idle, proven by an assertion on action history, not inferred from a failed level.
- `npm test`, `npm run build`, `npm run lint:levels` clean.
- `git status` clean.
- Packet returns to `delivered`.

## Stop conditions

- If the restored fixture makes the campaign test **fail**, stop and report. That would mean the
  test's premise was already wrong before this packet, which is a finding about `plan-114` and not
  something to fix by adjusting the fixture until the test goes green.
- If the strengthened assertion cannot be written from `runnerActionHistory` alone, stop and report
  rather than reaching into engine internals for it.
