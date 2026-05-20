const DEFAULT_DO_NOT_TOUCH = [
  "Any unrelated level definitions",
  "Guided workspace persistence",
  "Student save data in localStorage",
  "The workbench shell UI structure"
];

function toRepoRelative(filePath) {
  if (!filePath || typeof filePath !== "string") {
    return null;
  }
  return filePath.replace(/^.*?(?:BrowserBattlegorithms[\\/])?/, "").replace(/\\/g, "/");
}

function escapeFence(text) {
  return String(text || "").replace(/```/g, "\\`\\`\\`");
}

function titleCaseStatus(status) {
  switch (status) {
    case "pass":
      return "Pass";
    case "warning":
      return "Warning";
    case "fail":
      return "Fail";
    case "not_applicable":
      return "Not applicable";
    case "not_run":
      return "Not run";
    default:
      return status || "Unknown";
  }
}

function formatRunLine(run) {
  if (!run) {
    return "Not run";
  }
  const parts = [titleCaseStatus(run.status)];
  if (Number.isFinite(run.turnCount)) {
    parts.push(`${run.turnCount} turn${run.turnCount === 1 ? "" : "s"}`);
  }
  if (run.finalTurnState) {
    parts.push(`state ${run.finalTurnState}`);
  }
  if (run.mainGameState) {
    parts.push(`game ${run.mainGameState}`);
  }
  if (run.lastLevelResultReason) {
    parts.push(`reason ${run.lastLevelResultReason}`);
  }
  return parts.join(" | ");
}

function formatFixtureTarget(target) {
  if (!target) {
    return "(missing target)";
  }
  return `${target.label || target.kind || "fixture"} (${target.kind || "unknown"})`;
}

function formatValidationCommands(commands = []) {
  const lines = [];
  for (const entry of commands) {
    lines.push(`- \`${entry.command}\``);
  }
  return lines;
}

function formatDoNotTouchList(extraFiles = []) {
  const lines = [];
  const ordered = [...DEFAULT_DO_NOT_TOUCH, ...extraFiles.map((filePath) => toRepoRelative(filePath)).filter(Boolean)];
  const seen = new Set();
  for (const filePath of ordered) {
    if (seen.has(filePath)) {
      continue;
    }
    seen.add(filePath);
    lines.push(`- \`${filePath}\``);
  }
  return lines;
}

export function formatWorkbenchMutationPrompt({
  levelId,
  title,
  sourcePath,
  fixtureTarget,
  scratchXmlText,
  scratchRun,
  canonicalRun,
  validationCommands = [],
  extraDoNotTouchFiles = []
}) {
  const scratchStatus = titleCaseStatus(scratchRun?.status || "not_run");
  const canonicalStatus = titleCaseStatus(canonicalRun?.status || "not_run");
  const passes = scratchRun?.status === "pass";
  const canonicalPath = fixtureTarget?.path || "(missing fixture path)";
  const lines = [];

  lines.push("# Scratch Blockly Mutation Prompt");
  lines.push("");
  lines.push("## Selected Level");
  lines.push(`- title: ${title || "(missing)"}`);
  lines.push(`- level id: \`${levelId || "(missing)"}\``);
  lines.push(`- source: \`${toRepoRelative(sourcePath) || "(missing)"}\``);
  lines.push(`- fixture target: ${formatFixtureTarget(fixtureTarget)}`);
  lines.push(`- fixture path: \`${toRepoRelative(canonicalPath) || "(missing)"}\``);
  lines.push(`- workbench note: The workbench did not write files.`);
  lines.push("");
  lines.push("## Scratch Result");
  lines.push(`- status: ${scratchStatus}`);
  if (scratchRun) {
    lines.push(`- turn count: \`${Number.isFinite(scratchRun.turnCount) ? scratchRun.turnCount : "(missing)"}\``);
    lines.push(`- final turn state: \`${scratchRun.finalTurnState || "(missing)"}\``);
    lines.push(`- main game state: \`${scratchRun.mainGameState || "(missing)"}\``);
    lines.push(`- result reason: \`${scratchRun.lastLevelResultReason || "(missing)"}\``);
  }
  lines.push(`- canonical comparison: ${canonicalStatus}`);
  if (passes) {
    lines.push("- This scratch candidate passed, so it is a ready repair candidate.");
  } else {
    lines.push("- This is an experiment, not a ready repair.");
  }
  lines.push("");
  lines.push("## Canonical Target");
  lines.push(`- target status: ${canonicalStatus}`);
  if (canonicalRun) {
    lines.push(`- target turn count: \`${Number.isFinite(canonicalRun.turnCount) ? canonicalRun.turnCount : "(missing)"}\``);
    lines.push(`- target final turn state: \`${canonicalRun.finalTurnState || "(missing)"}\``);
    lines.push(`- target main game state: \`${canonicalRun.mainGameState || "(missing)"}\``);
    lines.push(`- target reason: \`${canonicalRun.lastLevelResultReason || "(missing)"}\``);
  }
  lines.push("");
  lines.push("## Scratch XML");
  lines.push("```xml");
  lines.push(escapeFence(scratchXmlText || ""));
  lines.push("```");
  lines.push("");
  lines.push("## Do Not Touch");
  lines.push(...formatDoNotTouchList(extraDoNotTouchFiles));
  lines.push("");
  lines.push("## Validation");
  if (validationCommands.length === 0) {
    lines.push("- No validation commands were provided.");
  } else {
    lines.push(...formatValidationCommands(validationCommands));
  }
  lines.push("");
  lines.push("## Repair Guidance");
  lines.push("- Update only the named fixture with the XML above.");
  lines.push("- Do not claim files were changed from the workbench.");
  lines.push("- If the scratch run does not pass, stop and investigate before editing the fixture.");
  return lines.join("\n");
}
