import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadLevelReadinessContext } from "./levelReadiness.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

export const GUIDED_LEVEL_COPY_DIGEST_PATH = path.join(
  REPO_ROOT,
  "reports/development/guided-level-complexity-audit/copy-digest.md"
);

const COPY_VOICE_CONTRACTS = new Set([
  "copy-voice-banned-phrase",
  "copy-voice-spoiler-phrase",
  "copy-voice-prose-length"
]);

export function getPhaseFromSourcePath(sourcePath) {
  const parts = String(sourcePath || "").split(/[\\/]/);
  const phaseIndex = parts.indexOf("phases");
  return phaseIndex >= 0 && phaseIndex + 1 < parts.length
    ? parts[phaseIndex + 1]
    : "unassigned";
}

function countOpponentRunners(level) {
  const runners = level.setup?.teams?.opponent?.runners;
  if (!Array.isArray(runners)) {
    return { total: null, live: null, frozen: null };
  }

  const frozen = runners.filter((runner) => runner?.isFrozen === true).length;
  return {
    total: runners.length,
    live: runners.length - frozen,
    frozen
  };
}

function formatOpponentSummary(level) {
  const counts = countOpponentRunners(level);
  if (counts.total === null) {
    return "opponent runners: not found";
  }
  return `opponent runners: ${counts.live} live, ${counts.frozen} frozen`;
}

function formatWinCondition(level) {
  return level.winCondition ? JSON.stringify(level.winCondition) : "not found";
}

function appendTextField(lines, label, value) {
  lines.push(`- ${label}:`);
  lines.push("~~~text");
  lines.push(String(value ?? ""));
  lines.push("~~~");
}

function appendCopySection(lines, level) {
  const copy = level || {};
  appendTextField(lines, "description", copy.description);
  appendTextField(lines, "introText", copy.introText);

  lines.push("#### Tips");
  if (Array.isArray(copy.tips) && copy.tips.length > 0) {
    copy.tips.forEach((tip, index) => appendTextField(lines, `tip ${index + 1}`, tip));
  } else {
    lines.push("- none");
  }

  lines.push("#### Tutorial Steps");
  if (Array.isArray(copy.tutorialSteps) && copy.tutorialSteps.length > 0) {
    copy.tutorialSteps.forEach((step, index) => {
      lines.push(`##### Step ${index + 1}: ${step.title || "Untitled"}`);
      lines.push(`- id: ${step.id || "not found"}`);
      lines.push(`- demo Blockly: ${step.demoBlocklyXml ? "yes" : "no"}`);
      if (step.demoTitle) {
        appendTextField(lines, "demoTitle", step.demoTitle);
      }
      if (step.demoCaption) {
        appendTextField(lines, "demoCaption", step.demoCaption);
      }
      appendTextField(lines, "body", step.body);
    });
  } else {
    lines.push("- none");
  }
}

function appendLintSection(lines, level, lintDiagnostics) {
  const hits = (lintDiagnostics || []).filter(
    (diagnostic) => diagnostic.levelId === level.id && COPY_VOICE_CONTRACTS.has(diagnostic.contract)
  );
  lines.push("#### Copy-Voice Lint Hits");
  if (hits.length === 0) {
    lines.push("- none");
    return;
  }
  for (const hit of hits) {
    lines.push(`- ${hit.contract}: ${hit.message}`);
  }
}

function appendBoardSection(lines, level) {
  lines.push("#### Board Summary");
  lines.push(`- win condition: ${formatWinCondition(level)}`);
  lines.push(`- ${formatOpponentSummary(level)}`);
  lines.push(`- boardDynamicsTier: ${level.boardDynamicsTier || "not set"}`);
}

export function renderLevelCopyDigest({ levels = [], lintDiagnostics = [] } = {}) {
  const phaseGroups = new Map();
  for (const level of levels) {
    const phase = getPhaseFromSourcePath(level.sourcePath);
    if (!phaseGroups.has(phase)) {
      phaseGroups.set(phase, []);
    }
    phaseGroups.get(phase).push(level);
  }

  const lines = [
    "# Guided Level Copy Digest",
    "",
    "Generated from `getLevelDefinitions()` through the level readiness context. This file is regenerable; level source remains authoritative.",
    "",
    "The digest includes student-facing copy, current copy-voice lint hits, and a compact board summary so voice review can catch claims that no longer match a level's board.",
    ""
  ];

  for (const [phase, phaseLevels] of phaseGroups) {
    lines.push(`## Phase: ${phase}`);
    lines.push("");
    for (const level of phaseLevels) {
      lines.push(`### ${level.title || level.id}`);
      lines.push(`- id: \`${level.id}\``);
      lines.push(`- source: \`${level.sourcePath || "not found"}\``);
      lines.push("");
      appendBoardSection(lines, level);
      lines.push("");
      appendLintSection(lines, level, lintDiagnostics);
      lines.push("");
      appendCopySection(lines, level);
      lines.push("");
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

export async function generateLevelCopyDigest({ outputPath = GUIDED_LEVEL_COPY_DIGEST_PATH } = {}) {
  const context = await loadLevelReadinessContext();
  const markdown = renderLevelCopyDigest({
    levels: context.levels,
    lintDiagnostics: context.lintDiagnostics
  });
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, markdown, "utf8");
  return {
    outputPath,
    levelCount: context.levels.length,
    markdown
  };
}
