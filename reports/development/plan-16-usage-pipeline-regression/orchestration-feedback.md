# Plan 16 Profile XML Orchestration Feedback

Date: 2026-05-13

Reviewed:

- `docs/development/plan-16-usage-pipeline-regression.md`
- `reports/development/plan-16-usage-pipeline-regression/profile-xml-suggestions.md`

## Decision

Approved with required revisions before implementation.

The proposed profile structure is strong and matches the intent of Plan 16: one perfect run, two struggle profiles, one abandonment profile, and one copy/similarity profile. The incorrect XMLs are mostly plausible student mistakes. However, three proposed incorrect programs are not valid failure fixtures in the current app because they pass the target level, and a few profile details should be tightened before the regression harness is written.

## Empirical Checks

I spot-checked the proposed wrong XMLs against the unit harness with `runGuidedLevelWithSolution(...)`. These results matter because every `expectPass: false` attempt in the regression needs to fail deterministically.

| Candidate | Target level | Observed result | Recommendation |
| --- | --- | --- | --- |
| `move-to-target` with `move_forward` | `move-to-target` | `PASSED` at turn 3 | Replace. Do not use this as a wrong attempt. |
| `move-to-target` with `move_up_screen` | `move-to-target` | `FAILED` at turn 9 | Use this instead. |
| `enemy-nearby` with `move_forward` | `enemy-nearby` | `FAILED` at turn 13 | Approved. |
| `enemy-nearby` with `WITHIN_3 -> up else forward` | `enemy-nearby` | `FAILED` at turn 13 | Approved. |
| `jump-the-gap` with blind `jump_forward` | `jump-the-gap` | `PASSED` at turn 1 | Replace. The blind jump is actually the correct move on this level. |
| `jump-the-gap` with `move_forward` | `jump-the-gap` | `FAILED` at turn 7 | Use this instead. |
| `jump-if-ready` with blind `jump_forward` | `jump-if-ready` | `FAILED` at turn 9 | Approved. |
| `how-far-away` with `distance > 5` branch | `how-far-away` | `FAILED` at turn 18 | Approved. |
| `how-far-away` with `distance <= 2` threshold | `how-far-away` | `FAILED` at turn 18 | Approved. |
| `two-conditions-at-once` with `OR` | `two-conditions-at-once` | `FAILED` at turn 11 | Approved. |
| `this-or-that` with `AND` | `this-or-that` | `FAILED` at turn 13 | Approved. |
| `flip-the-answer` without `NOT` | `flip-the-answer` | `FAILED` at turn 22 | Approved. |
| `index-jobs` wrong index branch | `index-jobs` | `FAILED` at turn 11 | Approved. |
| `one-program-two-allies` wrong index branch | `one-program-two-allies` | `FAILED` at turn 21 | Approved. |
| `one-program-two-allies` both branches chase flag | `one-program-two-allies` | `FAILED` at turn 21 | Approved. |
| `jump-team` blind first-runner jump | `jump-team` | `FAILED` at turn 16 | Approved. |
| `advanced-scrimmage` simple flag/base script | `advanced-scrimmage` | `PASSED` at turn 14 | Replace or reclassify. It is not currently wrong. |
| `advanced-scrimmage` wrong index branch | `advanced-scrimmage` | `FAILED` at turn 56 | Approved. |

## Required Revisions

### 1. Replace `move-to-target` wrong attempt

The proposed `move_forward` program passes Level 1, so it cannot be used for either Struggling Sam or Challenged Charlie.

Use this wrong XML instead:

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_up_screen"></block>
    </next>
  </block>
</xml>
```

Mistake explanation: moves vertically instead of moving toward the marked target lane.

### 2. Replace `jump-the-gap` blind-jump wrong attempt

The proposed blind `jump_forward` program passes `jump-the-gap`; on that level, jumping immediately is a valid solution.

Use this wrong XML instead:

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
    </next>
  </block>
</xml>
```

Mistake explanation: treats the gap like ordinary movement instead of using the one-time jump.

### 3. Replace the first `advanced-scrimmage` wrong attempt

The "thin flag/base script" currently passes `advanced-scrimmage`, so it is not suitable as a failed attempt. This is a useful discovery: after the project sequence implementation, the capstone can be solved by the simple score-and-return pattern.

For Challenged Charlie, use only the misassigned role split as the first failed attempt, or add a different deterministic failure such as:

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_toward">
        <field name="TARGET">ENEMY_FLAG</field>
      </block>
    </next>
  </block>
</xml>
```

Mistake explanation: always chases the enemy flag and never switches to returning home after a pickup.

This candidate failed in the harness at turn 56. The already proposed misassigned role split also failed and is approved:

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_value_compare">
            <value name="LEFT">
              <block type="battlegorithms_value_runner_index"></block>
            </value>
            <field name="OPERATOR">EQ</field>
            <value name="RIGHT">
              <block type="battlegorithms_value_number">
                <field name="VALUE">1</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">ENEMY_FLAG</field>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

## Profile-Level Recommendations

### Perfect Pat

Approved.

Use every current non-optional guided reference solution, plus project fixtures if the active level is part of a project and the project fixture is the canonical source. The implementation agent should not hard-code "37 levels"; the campaign currently has 38 definitions including the optional random lab. Build the happy-path list from `getLevelDefinitions()` and then apply the chosen optional policy.

Recommended optional policy: Perfect Pat and Copy-Cat Casey complete all required guided levels and skip optional labs unless Plan 16 explicitly decides to include the optional random lab. This keeps the regression deterministic.

### Struggling Sam

Approved after replacing `move-to-target` with the `move_up_screen` failure.

The six failed levels are a good moderate profile:

- `move-to-target`: wrong vertical movement, then success
- `enemy-nearby`: ignores nearby enemy, then success
- `jump-if-ready`: jumps without readiness check, then success
- `how-far-away`: reversed comparison, then success
- `one-program-two-allies`: wrong runner index, then success
- `jump-team`: jumps without readiness/role guard, then success

### Challenged Charlie

Approved after replacing the two unsafe candidates:

- Replace `move-to-target` first failure with `move_up_screen`; do not use `move_forward`.
- Replace `jump-the-gap` blind jump with `move_forward`.
- Replace the first `advanced-scrimmage` thin flag/base failure with `move_toward ENEMY_FLAG` only, or omit that first advanced-scrimmage failure and keep the misassigned role split.

One additional recommendation: keep Charlie as "completes the required campaign but skips optional labs" rather than "completes most of the campaign." Plan 16's table says Charlie completes most and skips optional levels "if applicable"; the implementation should encode that explicitly so the expected analyzer output is stable.

### Gave-Up Gabi

Approved.

Completing levels 1-15 and failing `jump-if-ready` three times is a good abandonment profile. The blind `jump_forward` attempt fails deterministically on `jump-if-ready`.

Important implementation detail: even though Gabi stops early, she should still export a usage file. The phrase "stops without exporting a complete campaign" should mean "exports an incomplete campaign file," not "does not export at all." Otherwise the admin/analyzer stage loses the abandonment case.

### Copy-Cat Casey

Approved with one caveat.

Casey should use the same solution XML sequence as Perfect Pat, but not the same timestamps or session id. If the analyzer's similarity logic keys on event fingerprints, this should still flag similar or identical event sequences. If timestamp spreading changes event order or metadata in a way that prevents the duplicate flag, preserve a shared deterministic event/action sequence and vary only student name, session id, and time fields.

## Implementation Guardrails

1. Add a preflight assertion in `tests/regression/student-profiles.js` or the regression spec that every `expectPass: false` attempt actually produces `FAILED` before proceeding with export/analyzer/admin assertions. This prevents accidental future level changes from turning a struggle profile into a hidden pass.

2. Do not rely on exact turn numbers for failed attempts unless needed. Assert pass/fail and then let the usage summary/analyzer validate aggregate attempts and failures.

3. Prefer loading XML files from the existing fixture directories for correct attempts:

- Non-project one-off levels: `tests/unit/fixtures/guided-reference-solutions/<levelId>.xml`
- Project levels: use the relevant project checkpoint/final fixtures where that is now the canonical source, rather than forcing old per-level fixtures if project fixtures are supposed to represent shared-code progression.

4. Build the level list from `getLevelDefinitions()` rather than a duplicated static list. Then profile definitions can add overrides for wrong attempts and stop points.

5. Keep optional level handling explicit. Recommended: skip optional random lab for all profiles in this Plan 16 regression unless a separate optional-lab profile is added later.

6. Confirm that the CLI analyzer actually has a duplicate/similarity signal that can satisfy the Plan 16 assertion. If the analyzer output does not name "Copy-Cat Casey" and "Perfect Pat" directly in a comparable way, adjust the assertion to the current analyzer contract rather than inventing new analyzer behavior in this packet.

7. The timestamp spreader must re-run `buildUsageExportWithIntegrity(...)` after all timestamp/session mutations. Do not manually update the hash.

## Approved Revised Profile Table

| Profile name | Student name | Behavior description | Incorrect levels before success | Stop point | Expected attempt pattern |
| --- | --- | --- | --- | --- | --- |
| Perfect Pat | Pat Chen | Happy path; completes required guided campaign with canonical solutions. | None | None | 1 attempt per required level |
| Struggling Sam | Sam Rivera | Moderate struggler; makes one plausible mistake on six levels, then corrects and finishes. | `move-to-target`, `enemy-nearby`, `jump-if-ready`, `how-far-away`, `one-program-two-allies`, `jump-team` | None | 6 failed attempts total, then all required levels pass |
| Challenged Charlie | Charlie Nguyen | Heavier struggler; repeated mistakes on early movement/sensing, boolean logic, project role assignment, and capstone strategy; still finishes required levels. | `move-to-target`, `enemy-nearby`, `jump-the-gap`, `how-far-away`, `two-conditions-at-once`, `this-or-that`, `flip-the-answer`, `index-jobs`, `one-program-two-allies`, `advanced-scrimmage` | None | 10-14 failed attempts total, then required levels pass |
| Gave-Up Gabi | Gabi Torres | Completes through level 15, fails level 16 three times, exports an incomplete usage file. | `jump-if-ready` | after third failed `jump-if-ready` attempt | levels 1-15 pass; level 16 has 3 failures; no later guided completions |
| Copy-Cat Casey | Casey Chen | Same canonical solution sequence as Perfect Pat, different student/session metadata. | None | None | same pass sequence as Perfect Pat |

## Final Approval Gate

The implementation agent may proceed after applying the three required XML revisions above. Before writing the full regression harness, it should run a small local preflight equivalent to:

- all `expectPass: false` XMLs produce `FAILED`
- all canonical success XMLs used by profiles produce `PASSED`
- Gabi's stop point still exports a usage file

If any proposed wrong XML passes, replace the XML rather than weakening the assertion.
