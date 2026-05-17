export const BUGHUNT_15_REFERENCE_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_have_enemy_flag_else">
        <statement name="DO">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">MY_BASE</field>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_if_sensor_matches_else">
            <field name="OBJECT">ENEMY_RUNNER</field>
            <field name="RELATION">WITHIN_2</field>
            <statement name="DO">
              <block type="battlegorithms_if_sensor_matches_else">
                <field name="OBJECT">ENEMY_RUNNER</field>
                <field name="RELATION">DIRECTLY_IN_FRONT</field>
                <statement name="DO">
                  <block type="battlegorithms_jump_forward"></block>
                </statement>
                <statement name="ELSE">
                  <block type="battlegorithms_move_toward">
                    <field name="TARGET">ENEMY_FLAG</field>
                  </block>
                </statement>
              </block>
            </statement>
            <statement name="ELSE">
              <block type="battlegorithms_move_toward">
                <field name="TARGET">ENEMY_FLAG</field>
              </block>
            </statement>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();

export const BUGHUNT_15_STARTER_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_have_enemy_flag_else">
        <statement name="DO">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">ENEMY_FLAG</field>
          </block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_move_toward">
            <field name="TARGET">MY_BASE</field>
          </block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();

export const BUGHUNT_22_REFERENCE_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_can_place_barrier_else">
        <statement name="DO">
          <block type="battlegorithms_place_barrier"></block>
        </statement>
        <statement name="ELSE">
          <block type="battlegorithms_stay_still"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();

export const BUGHUNT_22_STARTER_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_move_forward"></block>
      <next>
        <block type="battlegorithms_if_can_place_barrier_else">
          <statement name="DO">
            <block type="battlegorithms_place_barrier"></block>
          </statement>
          <statement name="ELSE">
            <block type="battlegorithms_stay_still"></block>
          </statement>
        </block>
      </next>
    </next>
  </block>
</xml>
`.trim();

export const BUGHUNT_28_REFERENCE_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="battlegorithms_on_each_turn" x="24" y="24">
    <next>
      <block type="battlegorithms_if_boolean_else">
        <value name="BOOL">
          <block type="battlegorithms_logic_and">
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
`.trim();

export const BUGHUNT_28_STARTER_XML = `
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
`.trim();

export const BUGHUNT_37_REFERENCE_XML = `
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
          <block type="battlegorithms_stay_still"></block>
        </statement>
      </block>
    </next>
  </block>
</xml>
`.trim();

export const BUGHUNT_37_STARTER_XML = `
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
`.trim();
