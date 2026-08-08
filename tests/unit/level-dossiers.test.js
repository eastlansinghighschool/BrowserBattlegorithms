import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildGuidedLevelDossierData,
  extractBlocklyXmlMetrics,
  generateGuidedLevelDossiers,
  renderGuidedLevelDossierMarkdown,
  renderGuidedLevelSummaryIndexMarkdown
} from "../../src/dev/levelDossiers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("XML metric extraction counts blocks and distinct types on a representative snippet", () => {
  const metrics = extractBlocklyXmlMetrics(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="battlegorithms_on_each_turn">
        <next>
          <block type="battlegorithms_if_sensor_matches_else">
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
  `);

  assert.equal(metrics.totalBlocks, 4);
  assert.equal(metrics.distinctBlockTypes, 4);
  assert.equal(metrics.actionBlockCount, 2);
  assert.equal(metrics.conditionBlockCount, 1);
  assert.equal(metrics.booleanComparisonValueBlockCount, 0);
  assert.equal(metrics.maxNestingDepth, 3);
  assert.equal(metrics.branchDecisionCount, 1);
  assert.equal(metrics.runnerIndexUsage, 0);
  assert.equal(metrics.resourceReadinessUsage, 0);
});

test("decision-point and max-depth calculations stay stable for nested conditionals", () => {
  const metrics = extractBlocklyXmlMetrics(`
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="battlegorithms_on_each_turn">
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
              <block type="battlegorithms_if_sensor_matches_else">
                <statement name="DO">
                  <block type="battlegorithms_move_up_screen"></block>
                </statement>
                <statement name="ELSE">
                  <block type="battlegorithms_move_down_screen"></block>
                </statement>
              </block>
            </statement>
            <statement name="ELSE">
              <block type="battlegorithms_move_forward"></block>
            </statement>
          </block>
        </next>
      </block>
    </xml>
  `);

  assert.equal(metrics.branchDecisionCount, 3);
  assert.equal(metrics.maxNestingDepth, 4);
  assert.equal(metrics.runnerIndexUsage, 1);
  assert.equal(metrics.booleanComparisonValueBlockCount >= 3, true);
});

test("ordinary level dossiers include identity, concept row, toolbox facts, and XML metrics", async () => {
  const { dossiers } = await buildGuidedLevelDossierData();
  const dossier = dossiers.find((entry) => entry.id === "move-to-target");
  assert.ok(dossier, "expected move-to-target dossier");

  const markdown = renderGuidedLevelDossierMarkdown(dossier);
  assert.match(markdown, /## Level Identity/);
  assert.match(markdown, /## Curriculum Row/);
  assert.match(markdown, /## Toolbox Facts/);
  assert.match(markdown, /## XML Facts/);
  assert.match(markdown, /## Facts Only/);
  assert.match(markdown, /move-to-target/);
  assert.match(markdown, /focus:/);
  assert.match(markdown, /starter XML/);
  assert.match(markdown, /reference XML/);
  assert.match(markdown, /decision points/);
});

test("project level dossiers include project id and shared-workspace signals", async () => {
  const { dossiers } = await buildGuidedLevelDossierData();
  const dossier = dossiers.find((entry) => entry.id === "advanced-scrimmage");
  assert.ok(dossier, "expected advanced-scrimmage dossier");

  const markdown = renderGuidedLevelDossierMarkdown(dossier);
  assert.match(markdown, /project team-strategy-script/);
  assert.match(markdown, /shared workspace project team-strategy-script/);
  assert.match(markdown, /Project XML Fixtures/);
  assert.match(markdown, /project id: team-strategy-script/);
});

test("project rows in the summary index expose fixture complexity instead of n/a", async () => {
  const { dossiers } = await buildGuidedLevelDossierData();
  const summary = renderGuidedLevelSummaryIndexMarkdown(dossiers);
  const fullTeamTacticsRow = summary
    .split(/\r?\n/)
    .find((line) => line.includes("`full-team-tactics`"));

  assert.ok(fullTeamTacticsRow, "expected a summary row for full-team-tactics");
  assert.match(fullTeamTacticsRow, /\| 4 \| 3 \| 1 \| 4 \| 6 \|/);
  assert.equal(fullTeamTacticsRow.includes("| n/a | n/a | 0 |"), false);
});

test("dossiers include wall and jail terrain coordinates for maps with terrain", async () => {
  const { dossiers } = await buildGuidedLevelDossierData();
  const dossier = dossiers.find((entry) => entry.id === "watch-the-wall");
  assert.ok(dossier, "expected watch-the-wall dossier");

  const markdown = renderGuidedLevelDossierMarkdown(dossier);
  assert.match(markdown, /wall cells:/);
  assert.match(markdown, /jail cells:/);
  assert.match(markdown, /goal cell:/);
});

test("summary index generation contains relative links to generated dossier files", async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "bba-level-dossiers-"));
  const result = await generateGuidedLevelDossiers({ outputDir: tempDir });
  const summaryPath = path.join(tempDir, "summary-index.md");
  const summary = await fs.readFile(summaryPath, "utf8");

  assert.match(summary, /\[dossier\]\(level-dossiers\/01-move-to-target\.md\)/);
  assert.match(summary, /\[behavior\]\(behavior-evidence\/01-move-to-target\.md\)/);
  assert.match(summary, /\[dossier\]\(level-dossiers\/46-optional-double-carrier-showdown\.md\)/);
  assert.equal(result.dossiers.length, 47);
  assert.equal(await fs.stat(path.join(tempDir, "level-dossiers", "01-move-to-target.md")).then(() => true), true);
});
