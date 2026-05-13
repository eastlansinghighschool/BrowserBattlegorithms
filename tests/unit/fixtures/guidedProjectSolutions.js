import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getLevelDefinitions } from '../../../src/config/levels.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPECTED_PROJECT_STEP_COUNTS = {
  'strategy-brain': 6,
  'team-strategy-script': 9
};

const PROJECT_FIXTURES_DIR = path.join(__dirname, 'guided-project-solutions');

function readProjectFixtures(projectId) {
  const projectDir = path.join(PROJECT_FIXTURES_DIR, projectId);
  if (!fs.existsSync(projectDir)) {
    throw new Error(`Guided project solutions directory not found: ${projectDir}`);
  }

  const entries = {
    steps: {},
    final: null
  };

  for (const file of fs.readdirSync(projectDir)) {
    if (!file.endsWith('.xml')) {
      continue;
    }
    const xmlText = fs.readFileSync(path.join(projectDir, file), 'utf8');
    if (file === 'final.xml') {
      entries.final = xmlText;
      continue;
    }
    const match = file.match(/^step-(\d+)\.xml$/);
    if (match) {
      entries.steps[Number(match[1])] = xmlText;
    }
  }

  return entries;
}

export const GUIDED_PROJECT_REFERENCE_SOLUTIONS = Object.fromEntries(
  Object.keys(EXPECTED_PROJECT_STEP_COUNTS).map((projectId) => [projectId, readProjectFixtures(projectId)])
);

export function getProjectStepReferenceSolution(projectId, step) {
  return GUIDED_PROJECT_REFERENCE_SOLUTIONS[projectId]?.steps?.[step] || null;
}

export function getProjectFinalReferenceSolution(projectId) {
  return GUIDED_PROJECT_REFERENCE_SOLUTIONS[projectId]?.final || null;
}

const projectLevels = getLevelDefinitions().filter((level) => level.project?.id);
for (const [projectId, expectedStepCount] of Object.entries(EXPECTED_PROJECT_STEP_COUNTS)) {
  const projectLevelIds = projectLevels
    .filter((level) => level.project.id === projectId)
    .map((level) => level.id);
  const missingSteps = [];
  for (let step = 1; step <= expectedStepCount; step += 1) {
    if (!getProjectStepReferenceSolution(projectId, step)) {
      missingSteps.push(step);
    }
  }
  if (missingSteps.length > 0) {
    throw new Error(
      `Missing guided project solution XML file(s) for ${projectId}: steps ${missingSteps.join(', ')}.`
    );
  }
  if (!getProjectFinalReferenceSolution(projectId)) {
    throw new Error(`Missing guided project final solution XML file for ${projectId}.`);
  }
  if (projectLevelIds.length !== expectedStepCount) {
    throw new Error(
      `Project ${projectId} has ${projectLevelIds.length} authored levels but expected ${expectedStepCount}.`
    );
  }
}
