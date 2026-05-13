**Plan 16 checkpoint table**

| Profile name | Student name | Behavior description | Levels where incorrect XML is used before the correct one | Level where student stops | Expected attempt count pattern |
| --- | --- | --- | --- | --- | --- |
| Perfect Pat | Pat Chen | Happy-path student who follows the reference solution every time and completes the required campaign. | None | None | 1 attempt per required level, no failures |
| Struggling Sam | Sam Rivera | Moderate struggler who makes a few plausible mistakes, then corrects them and completes the required campaign. | `move-to-target`, `enemy-nearby`, `jump-if-ready`, `how-far-away`, `one-program-two-allies`, `jump-team` | None | 6 failed levels, 1 failure each, then success |
| Challenged Charlie | Charlie Nguyen | Heavier struggler who needs repeated correction on many levels, but still completes the required campaign and skips optional labs. | `move-to-target`, `enemy-nearby`, `jump-the-gap`, `how-far-away`, `two-conditions-at-once`, `this-or-that`, `flip-the-answer`, `index-jobs`, `one-program-two-allies`, `advanced-scrimmage` | None | 10-14 failed attempts total, then required levels pass |
| Gave-Up Gabi | Gabi Torres | Completes through level 15, then fails level 16 three times and exports an incomplete usage file. | `jump-if-ready` | `jump-if-ready` | Levels 1-15 pass, level 16 fails 3 times, then export incomplete file |
| Copy-Cat Casey | Casey Chen | Uses the same solutions as Perfect Pat, but with a different student name and session id to exercise similarity detection. | None | None | Same as Perfect Pat |

**Proposed incorrect XMLs**

I’m using the standard outer wrapper from `tests/browser/helpers.js`:

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      ...
    </next>
  </block>
</xml>
```

### Perfect Pat
- No incorrect XMLs.

### Struggling Sam

1. `move-to-target`  
   Mistake: moves vertically instead of moving toward the target lane.  
   Fails once, then loads the correct solution.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_up_screen"></block>
    </next>
  </block>
</xml>
```

2. `enemy-nearby`  
   Mistake: uses `move_forward` without reacting to the nearby enemy.  
   Fails once, then loads the correct solution.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
    </next>
  </block>
</xml>
```

3. `jump-if-ready`  
   Mistake: jumps without checking whether jump is actually available.  
   Fails once, then loads the correct solution.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_jump_forward"></block>
    </next>
  </block>
</xml>
```

4. `how-far-away`  
   Mistake: reverses the distance comparison and only reacts when the enemy is farther away.  
   Fails once, then loads the correct solution.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_value_compare">
            <value name="LEFT">
              <block type="battlegorithms_value_distance_to_target">
                <field name="TARGET">CLOSEST_ENEMY</field>
              </block>
            </value>
            <field name="OPERATOR">GT</field>
            <value name="RIGHT">
              <block type="battlegorithms_value_number">
                <field name="VALUE">5</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

5. `one-program-two-allies`  
   Mistake: sends the attack branch to runner index 1 instead of runner index 0.  
   Fails once, then loads the correct solution.

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

6. `jump-team`  
   Mistake: tries to jump without checking `can jump`, so the first ally can stall when jump is unavailable.  
   Fails once, then loads the correct solution.

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
                <field name="VALUE">0</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_jump_forward"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_down_screen"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

### Challenged Charlie

I’d use these as the broader “struggle but finish the required campaign” set.

1. `move-to-target`  
   Two failures: first moves forward, then moves vertically, then corrects.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_up_screen"></block>
    </next>
  </block>
</xml>
```

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
    </next>
  </block>
</xml>
```

2. `enemy-nearby`  
   Two failures: first ignores the enemy, then reacts too late with the wrong sensor threshold, then corrects.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
    </next>
  </block>
</xml>
```

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_sensor_matches_else">
        <field name="OBJECT">ENEMY_RUNNER</field>
        <field name="RELATION">WITHIN_3</field>
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

3. `jump-the-gap`  
   One failure: moves forward instead of using the one-time jump.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
    </next>
  </block>
</xml>
```

4. `how-far-away`  
   Two failures: first uses a too-small threshold, then flips the comparison the wrong way.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_value_compare">
            <value name="LEFT">
              <block type="battlegorithms_value_distance_to_target">
                <field name="TARGET">CLOSEST_ENEMY</field>
              </block>
            </value>
            <field name="OPERATOR">LTE</field>
            <value name="RIGHT">
              <block type="battlegorithms_value_number">
                <field name="VALUE">2</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_value_compare">
            <value name="LEFT">
              <block type="battlegorithms_value_distance_to_target">
                <field name="TARGET">CLOSEST_ENEMY</field>
              </block>
            </value>
            <field name="OPERATOR">GT</field>
            <value name="RIGHT">
              <block type="battlegorithms_value_number">
                <field name="VALUE">5</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

5. `two-conditions-at-once`  
   One failure: uses `OR` instead of `AND`.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_logic_or">
            <value name="LEFT">
              <block type="battlegorithms_value_compare">
                <value name="LEFT">
                  <block type="battlegorithms_value_distance_to_target">
                    <field name="TARGET">CLOSEST_ENEMY</field>
                  </block>
                </value>
                <field name="OPERATOR">LTE</field>
                <value name="RIGHT">
                  <block type="battlegorithms_value_number">
                    <field name="VALUE">2</field>
                  </block>
                </value>
              </block>
            </value>
            <value name="RIGHT">
              <block type="battlegorithms_boolean_area_freeze_ready"></block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_freeze_opponents"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">ENEMY_FLAG</field>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

6. `this-or-that`  
   One failure: uses `AND` instead of `OR`.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_logic_and">
            <value name="LEFT">
              <block type="battlegorithms_boolean_on_enemy_side"></block>
            </value>
            <value name="RIGHT">
              <block type="battlegorithms_boolean_sensor_matches">
                <field name="OBJECT">ENEMY_RUNNER</field>
                <field name="RELATION">WITHIN_2</field>
              </block>
            </value>
          </block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

7. `flip-the-answer`  
   One failure: forgets the `NOT` and checks the condition directly.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_boolean_on_my_side"></block>
        </value>
        <statement name="DO">
          <block type="battlegorithms_move_up_screen"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_forward"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

8. `index-jobs`  
   One failure: gives the attack job to the wrong runner index.

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

9. `one-program-two-allies`  
   One failure: both branches chase the flag, which breaks the intended role split.

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
                <field name="VALUE">0</field>
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
          <block type="battlegorithms_move_toward">
            <field name="TARGET">ENEMY_FLAG</field>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>
```

10. `advanced-scrimmage`  
   Two failures: first a plain `move_toward ENEMY_FLAG` script that never switches to return-home logic, then a misassigned role split.

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

### Gave-Up Gabi

`jump-if-ready` repeated three times before stopping.

Mistake: jumps without checking readiness, then the student gives up after the third failure.

```xml
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_jump_forward"></block>
    </next>
  </block>
</xml>
```

## Profile notes
- `Perfect Pat` and `Copy-Cat Casey` use the same XML set for every required level.
- `Struggling Sam` and `Challenged Charlie` use the wrong XMLs above before loading the correct reference XML for the same level.
- `Gave-Up Gabi` should still export a usage file even though the campaign is incomplete.
- Recommended optional policy: skip optional random lab for all profiles unless Plan 16 explicitly adds an optional-lab case.

If this looks good to the orchestrator, I can move straight into the regression harness implementation after approval.
