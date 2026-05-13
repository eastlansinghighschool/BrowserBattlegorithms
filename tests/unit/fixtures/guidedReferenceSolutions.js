import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getLevelDefinitions } from '../../../src/config/levels.js';
import { HUMAN_TURN_BEHAVIORS } from '../../../src/config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildSolutionXml(innerBlockXml) {
  return `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="battlegorithms_on_each_turn" x="24" y="24">
        <next>
          ${innerBlockXml}
        </next>
      </block>
    </xml>
  `;
}

const solutionsDir = path.join(__dirname, 'guided-reference-solutions');
const GUIDED_LEVEL_REFERENCE_SOLUTIONS = {};
const expectedSolutionIds = getLevelDefinitions()
  .filter((level) => level.humanTurnBehavior !== HUMAN_TURN_BEHAVIORS.WAIT_FOR_INPUT && !level.project)
  .map((level) => level.id);

if (fs.existsSync(solutionsDir)) {
  const files = fs.readdirSync(solutionsDir);
  for (const file of files) {
    if (file.endsWith('.xml')) {
      const levelId = path.basename(file, '.xml');
      const xmlPath = path.join(solutionsDir, file);
      GUIDED_LEVEL_REFERENCE_SOLUTIONS[levelId] = fs.readFileSync(xmlPath, 'utf8');
    }
  }
} else {
  throw new Error(`Guided reference solutions directory not found: ${solutionsDir}`);
}

const missingSolutionIds = expectedSolutionIds.filter((levelId) => !GUIDED_LEVEL_REFERENCE_SOLUTIONS[levelId]);

if (missingSolutionIds.length > 0) {
  throw new Error(
    `Missing guided reference solution XML file(s): ${missingSolutionIds.join(', ')}. Expected them in ${solutionsDir}.`
  );
}

export { buildSolutionXml, GUIDED_LEVEL_REFERENCE_SOLUTIONS };
