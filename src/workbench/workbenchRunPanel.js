import { LEVEL_RESULT } from "../config/constants.js";

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

function formatCellLabel(cell) {
  if (!cell || typeof cell.x !== "number" || typeof cell.y !== "number") {
    return "—";
  }
  return `row ${cell.y + 1}, column ${cell.x + 1}`;
}

function formatEventTail(events = []) {
  if (!Array.isArray(events) || events.length === 0) {
    return ["(none)"];
  }

  return events.map((event) => {
    const payload = event?.payload && typeof event.payload === "object" ? event.payload : {};
    const action = payload.actionType || payload.result || payload.reason || "";
    const runnerId = payload.runnerId || payload.scoringTeam || payload.levelId || "";
    const details = [event.kind, action, runnerId].filter(Boolean).join(" / ");
    return details || event.kind || "(event)";
  });
}

function formatTraceTail(trace = []) {
  if (!Array.isArray(trace) || trace.length === 0) {
    return ["(none)"];
  }

  return trace.map((entry) => {
    const parts = [
      `tick ${entry.tick}`,
      `turn ${entry.turn}`,
      entry.runner ? `runner ${entry.runner}` : null,
      entry.state ? `state ${entry.state}` : null,
      entry.result ? `result ${entry.result}` : null
    ].filter(Boolean);
    return parts.join(" | ");
  });
}

function buildRunSummaryLine(run) {
  const parts = [titleCaseStatus(run.status)];
  if (Number.isFinite(run.turnCount)) {
    parts.push(`${run.turnCount} turn${run.turnCount === 1 ? "" : "s"}`);
  }
  if (run.finalTurnState) {
    parts.push(`state ${run.finalTurnState}`);
  }
  if (run.lastLevelResultReason) {
    parts.push(`reason ${run.lastLevelResultReason}`);
  } else if (run.documentedException) {
    parts.push(`exception ${run.documentedException}`);
  }
  return parts.join(" | ");
}

function buildRunTextSection(run) {
  const lines = [];
  lines.push(`${run.label}`);
  lines.push(`Status: ${titleCaseStatus(run.status)}`);
  if (run.path) {
    lines.push(`Fixture: ${run.path}`);
  }
  if (run.documentedException) {
    lines.push(`Documented exception: ${run.documentedException}`);
  }
  if (Number.isFinite(run.turnCount)) {
    lines.push(`Turn count: ${run.turnCount}`);
  }
  if (run.finalTurnState) {
    lines.push(`Final turn state: ${run.finalTurnState}`);
  }
  if (run.mainGameState) {
    lines.push(`Main game state: ${run.mainGameState}`);
  }
  if (run.lastLevelResultReason) {
    lines.push(`Result reason: ${run.lastLevelResultReason}`);
  }
  lines.push("Trace tail:");
  for (const entry of formatTraceTail(run.traceTail)) {
    lines.push(`- ${entry}`);
  }
  lines.push("Event log tail:");
  for (const entry of formatEventTail(run.eventTail)) {
    lines.push(`- ${entry}`);
  }
  return lines;
}

function buildRunFromRuntime(label, runtime = {}, path = null, documentedException = null, fallbackStatus = "not_run") {
  const hasRuntime = runtime && typeof runtime === "object" && (runtime.result || runtime.turnCount || runtime.lastLevelResultReason || (Array.isArray(runtime.traceTail) && runtime.traceTail.length > 0));
  const status =
    documentedException && hasRuntime
      ? "warning"
      : hasRuntime
        ? runtime.result === LEVEL_RESULT.PASSED
          ? "pass"
          : runtime.result === LEVEL_RESULT.FAILED
            ? "fail"
            : fallbackStatus
        : fallbackStatus;

  return {
    label,
    status,
    path,
    documentedException,
    turnCount: Number.isFinite(runtime?.turnCount) ? runtime.turnCount : null,
    finalTurnState: runtime?.finalTurnState || null,
    mainGameState: runtime?.mainGameState || null,
    lastLevelResultReason: runtime?.lastLevelResultReason || null,
    traceTail: Array.isArray(runtime?.traceTail) ? runtime.traceTail : [],
    eventTail: Array.isArray(runtime?.eventTail) ? runtime.eventTail : []
  };
}

export function buildWorkbenchRunPanelModel(result) {
  if (!result) {
    return {
      title: "Canonical Solution Run",
      status: "not_run",
      summary: "No run is available.",
      runs: [],
      copyText: "No run is available."
    };
  }

  if (result.project) {
    const stepRuntime = result.runtime?.step || null;
    const finalRuntime = result.runtime?.final || null;
    const step = buildRunFromRuntime(
      "Project step checkpoint",
      stepRuntime,
      result.fixtures?.project?.step?.path || null,
      result.fixtures?.project?.step?.documentedException || null
    );
    const final = buildRunFromRuntime(
      "Project final checkpoint",
      finalRuntime,
      result.fixtures?.project?.final?.path || null,
      result.fixtures?.project?.final?.documentedException || null
    );
    const overallStatus = [step.status, final.status].includes("fail")
      ? "fail"
      : [step.status, final.status].includes("warning")
        ? "warning"
        : [step.status, final.status].includes("pass")
          ? "pass"
          : "not_run";
    const summary = `${titleCaseStatus(overallStatus)} | step ${titleCaseStatus(step.status)} | final ${titleCaseStatus(final.status)}`;
    const copyText = [
      `Canonical solution run: ${result.title} (${result.levelId})`,
      `Overall status: ${titleCaseStatus(overallStatus)}`,
      "",
      ...buildRunTextSection(step),
      "",
      ...buildRunTextSection(final)
    ].join("\n");
    return {
      title: "Canonical Solution Run",
      status: overallStatus,
      summary,
      runs: [step, final],
      copyText
    };
  }

  if (result.runtime?.kind === "reference") {
    const run = buildRunFromRuntime(
      "Reference solution run",
      result.runtime.reference,
      result.fixtures?.referenceSolution?.path || null,
      null
    );
    const summary = buildRunSummaryLine(run);
    const copyText = [
      `Canonical solution run: ${result.title} (${result.levelId})`,
      `Overall status: ${titleCaseStatus(run.status)}`,
      "",
      ...buildRunTextSection(run)
    ].join("\n");
    return {
      title: "Canonical Solution Run",
      status: run.status,
      summary,
      runs: [run],
      copyText
    };
  }

  const summary = `Not applicable | ${result.runtime?.reason || "no run available"}`;
  return {
    title: "Canonical Solution Run",
    status: "not_applicable",
    summary,
    runs: [],
    copyText: [
      `Canonical solution run: ${result.title} (${result.levelId})`,
      `Overall status: Not applicable`,
      `Reason: ${result.runtime?.reason || "no run available"}`
    ].join("\n")
  };
}
