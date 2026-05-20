import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..");

const DEFAULT_REQUIRED_READING = [
  "docs/development/00-mini-packet-agent-starting-prompt.md",
  "docs/development/00-level-editing-agent-starting-prompt.md",
  "docs/packet-creation-guidance.md",
  "docs/TESTING.md",
  "docs/GUIDED_LEVEL_CONCEPT_MATRIX.md",
  "docs/subsystems/blockly-workspace.md",
  "docs/subsystems/turn-engine.md",
  "docs/subsystems/npc-and-cpu.md",
  "docs/subsystems/ui-mode-contract.md"
];

const DEFAULT_STOP_CONDITIONS = [
  "Stop if the fix would change core game rules, collision behavior, scoring, turn order, or level-result handling.",
  "Stop if the fix would broaden into unrelated levels, project arcs, or campaign redesign without owner review.",
  "Stop if the fix would require new Blockly semantics, new NPC behavior, a new dependency, browser UI work, or filesystem writes.",
  "Stop if a subsystem note or curriculum source of truth would become inaccurate and the packet does not already authorize updating it."
];

function toRepoRelative(filePath) {
  if (!filePath || typeof filePath !== "string") {
    return null;
  }

  let candidate = filePath;
  if (candidate.startsWith("file://")) {
    try {
      candidate = fileURLToPath(candidate);
    } catch {
      return candidate;
    }
  }

  if (path.isAbsolute(candidate)) {
    candidate = path.relative(REPO_ROOT, candidate);
  }

  return candidate.split(path.sep).join("/");
}

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
        .map(([key, entry]) => [key, sanitizeValue(entry)])
    );
  }

  if (typeof value === "string") {
    return toRepoRelative(value);
  }

  return value;
}

function stableStringify(value) {
  return JSON.stringify(sanitizeValue(value), null, 2);
}

function uniqueOrdered(values) {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    if (!value) {
      continue;
    }
    const normalized = toRepoRelative(value) || value;
    if (seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    output.push(normalized);
  }
  return output;
}

function isApplicableCheck(check) {
  return check && ["fail", "warning"].includes(check.status);
}

function summarizeChecks(checks = []) {
  const counts = {
    pass: 0,
    fail: 0,
    warning: 0,
    not_applicable: 0,
    not_run: 0
  };
  for (const check of checks) {
    if (Object.hasOwn(counts, check.status)) {
      counts[check.status] += 1;
    }
  }
  return counts;
}

function formatLevelMetadata(result) {
  const lines = [];
  lines.push("## Selected Level");
  lines.push(`- title: ${result.title || "(missing)"}`);
  lines.push(`- level id: \`${result.levelId}\``);
  lines.push(`- source: \`${toRepoRelative(result.sourcePath) || "(missing)"}\``);
  lines.push(`- order: \`${result.order ?? "(missing)"}\``);
  lines.push(`- kind: \`${result.levelKind || "(missing)"}\``);
  if (result.project) {
    lines.push(`- project: \`${result.project.id}\` step \`${result.project.step}\`${result.project.isCapstone ? " (capstone)" : ""}`);
  } else {
    lines.push("- project: none");
  }
  lines.push(`- concept matrix row: ${result.conceptMatrixRow ? "matched" : "missing"}`);
  return lines;
}

function formatRequiredReading(result) {
  const lines = [];
  lines.push("## Required Reading");
  for (const item of DEFAULT_REQUIRED_READING) {
    lines.push(`- \`${item}\``);
  }
  const extraFiles = uniqueOrdered([
    result.sourcePath,
    result.project ? result.fixtures?.project?.step?.path : null,
    result.project ? result.fixtures?.project?.final?.path : null,
    !result.project ? result.fixtures?.referenceSolution?.path : null
  ]).filter((entry) => !DEFAULT_REQUIRED_READING.includes(entry));
  if (extraFiles.length > 0) {
    lines.push("- Level-specific source and fixture files:");
    for (const filePath of extraFiles) {
      lines.push(`  - \`${filePath}\``);
    }
  }
  return lines;
}

function formatRuntimeSnapshot(result) {
  const lines = [];
  lines.push("## Readiness Snapshot");
  const counts = summarizeChecks(result.checks || []);
  lines.push(
    `- counts: ${counts.pass} pass, ${counts.warning} warning${counts.warning === 1 ? "" : "s"}, ${counts.fail} fail, ${counts.not_applicable} not-applicable, ${counts.not_run} not-run`
  );

  if (result.runtime?.kind === "reference") {
    const runtime = result.runtime.reference;
    lines.push(
      `- runtime: reference run ${runtime?.result || "(missing result)"} in ${runtime?.turnCount ?? "(missing)"} turns (${runtime?.lastLevelResultReason || "no reason"})`
    );
  } else if (result.runtime?.kind === "project") {
    lines.push(`- runtime: project readiness for \`${result.runtime.projectId}\``);
    if (result.runtime.step) {
      lines.push(
        `  - step: ${result.runtime.step.result} in ${result.runtime.step.turnCount ?? "(missing)"} turns (${result.runtime.step.lastLevelResultReason || "no reason"})`
      );
    }
    if (result.runtime.final) {
      lines.push(
        `  - final: ${result.runtime.final.result} in ${result.runtime.final.turnCount ?? "(missing)"} turns (${result.runtime.final.lastLevelResultReason || "no reason"})`
      );
    }
  } else {
    lines.push(`- runtime: not applicable (${result.runtime?.reason || "no reason"})`);
  }

  return lines;
}

function formatObservedFacts(result) {
  const lines = [];
  lines.push("## Observed Facts");

  const checks = result.checks || [];
  if (checks.length === 0) {
    lines.push("- No readiness checks were recorded.");
    return lines;
  }

  for (const check of checks) {
    lines.push(`- \`${check.id}\` -> \`${check.status}\` (\`${check.severity}\`): ${check.message}`);
    if (isApplicableCheck(check) && check.evidence != null) {
      lines.push("  - evidence:");
      lines.push("```json");
      lines.push(stableStringify(check.evidence));
      lines.push("```");
    }
    if (Array.isArray(check.relatedFiles) && check.relatedFiles.length > 0) {
      lines.push("  - related files:");
      for (const filePath of uniqueOrdered(check.relatedFiles)) {
        lines.push(`    - \`${filePath}\``);
      }
    }
  }

  return lines;
}

function formatLikelyRepairOptions(result) {
  const lines = [];
  lines.push("## Likely Repair Options");

  const actionableChecks = (result.checks || []).filter(isApplicableCheck);
  if (actionableChecks.length === 0) {
    lines.push("- No repair is suggested by the current readiness data.");
    lines.push("- If you are only validating the packet, stop here.");
    return lines;
  }

  for (const check of actionableChecks) {
    lines.push(`- \`${check.id}\`: ${recommendationForCheck(check)}`);
  }

  return lines;
}

function recommendationForCheck(check) {
  switch (check.id) {
    case "concept-matrix-row":
      return "Start with the selected level source and the concept matrix row. If the lesson goal itself is wrong, pause for owner review before changing curriculum language.";
    case "lint-diagnostics":
      return "Repair the files named in the lint evidence first. Keep the fix confined to those files unless the diagnostics explicitly point at a broader source-of-truth doc.";
    case "reference-fixture-exists":
      return "Restore or update the matching reference fixture together with the level source. Do not change unrelated levels.";
    case "reference-runtime":
      return "Repair the level source or the matching reference fixture so the reference solution runs again. If the lesson goal changed, stop for owner review before broadening scope.";
    case "toolbox-reference-compatibility":
      return "Keep the authored toolbox and the reference fixture aligned. If the level truly needs a new block, stop for owner review instead of silently widening the toolbox.";
    case "demo-blockly-does-not-solve":
      return "Adjust the demo Blockly so it teaches the shape of the solution without matching the solution exactly.";
    case "project-step-fixture-exists":
      return "Repair the project step fixture path together with the project source level. Use the matching project arc only.";
    case "project-step-runtime":
      return check.status === "warning"
        ? "This is a documented project exception. Keep it documented if it is still intended; otherwise update the project source and checkpoint together."
        : "Repair the project step source and checkpoint together.";
    case "project-final-fixture-exists":
      return "Repair the project final fixture path together with the project source level. Keep the work inside the named project arc.";
    case "project-final-runtime":
      return check.status === "warning"
        ? "This is a documented cumulative project exception. Keep it documented if it is still intended; otherwise update the project source and final checkpoint together."
        : "Repair the project final source and checkpoint together.";
    default:
      return "Inspect the files named in the readiness evidence and keep the repair as narrow as the evidence allows.";
  }
}

function inferAllowedFiles(result) {
  const files = [];

  if (result.sourcePath) {
    files.push(result.sourcePath);
  }

  if (result.conceptMatrixRow) {
    files.push("docs/GUIDED_LEVEL_CONCEPT_MATRIX.md");
  }

  for (const check of result.checks || []) {
    if (!isApplicableCheck(check)) {
      continue;
    }
    if (Array.isArray(check.relatedFiles)) {
      files.push(...check.relatedFiles);
    }
  }

  if (result.fixtures?.referenceSolution?.path) {
    files.push(result.fixtures.referenceSolution.path);
  }
  if (result.fixtures?.project?.step?.path) {
    files.push(result.fixtures.project.step.path);
  }
  if (result.fixtures?.project?.final?.path) {
    files.push(result.fixtures.project.final.path);
  }

  return uniqueOrdered(files);
}

function formatAllowedFilesAndAreas(result) {
  const lines = [];
  lines.push("## Allowed Files and Areas");

  const files = inferAllowedFiles(result);
  if (files.length === 0) {
    lines.push("- No specific files were identified by the readiness result.");
  } else {
    for (const filePath of files) {
      lines.push(`- \`${filePath}\``);
    }
  }

  return lines;
}

function formatOwnerDecisionWarnings() {
  const lines = [];
  lines.push("## Owner Decisions To Avoid Making Silently");
  for (const entry of DEFAULT_STOP_CONDITIONS) {
    lines.push(`- ${entry}`);
  }
  return lines;
}

function formatValidation(result, options = {}) {
  const lines = [];
  lines.push("## Validation");

  const commands = uniqueOrdered(
    [
      `npm run level:readiness -- --level ${result.levelId} --prompt`,
      ...(options.includeJsonCommand === false
        ? []
        : [`npm run level:readiness -- --level ${result.levelId} --json`]),
      ...(result.validationCommands || []).map((entry) => entry.command)
    ]
  ).map((command) => {
    if (command === `npm run level:readiness -- --level ${result.levelId} --prompt`) {
      return { label: "Targeted prompt", command };
    }
    if (command === `npm run level:readiness -- --level ${result.levelId} --json`) {
      return { label: "Targeted JSON", command };
    }
    const matched = (result.validationCommands || []).find((entry) => entry.command === command);
    return {
      label: matched?.label || "Validation",
      command
    };
  });

  for (const entry of commands) {
    lines.push(`- ${entry.label}: \`${entry.command}\``);
  }

  return lines;
}

function formatExpectedFinalReportFields() {
  return [
    "## Expected Final Report Fields",
    "- Task or packet",
    "- Summary of work completed",
    "- Files changed",
    "- Artifacts produced",
    "- Commands run and results",
    "- Approval gates honored",
    "- Stop conditions encountered, if any",
    "- Remaining risks or follow-ups",
    "- Ready for integration"
  ];
}

export function formatLevelReadinessPrompt(result, options = {}) {
  const lines = [];
  lines.push("# Level Readiness Repair Prompt");
  lines.push("");
  lines.push("## Task");
  lines.push(
    `Repair the selected guided level using the readiness evidence for \`${result.levelId}\` (${result.title || "untitled"}). Keep the fix narrow and grounded in the checks below.`
  );
  lines.push("");
  lines.push(...formatLevelMetadata(result));
  lines.push("");
  lines.push(...formatRequiredReading(result));
  lines.push("");
  lines.push(...formatRuntimeSnapshot(result));
  lines.push("");
  lines.push(...formatObservedFacts(result));
  lines.push("");
  lines.push(...formatLikelyRepairOptions(result));
  lines.push("");
  lines.push(...formatAllowedFilesAndAreas(result));
  lines.push("");
  lines.push(...formatOwnerDecisionWarnings());
  lines.push("");
  lines.push(...formatValidation(result, options));
  lines.push("");
  lines.push(...formatExpectedFinalReportFields());

  return lines.join("\n");
}
