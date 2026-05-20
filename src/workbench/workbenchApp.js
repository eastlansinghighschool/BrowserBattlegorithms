import { formatLevelReadinessPrompt } from "../dev/levelReadinessPrompt.js";
import { loadWorkbenchData } from "./workbenchData.js";
import { buildWorkbenchRunPanelModel } from "./workbenchRunPanel.js";
import { formatWorkbenchMutationPrompt } from "./workbenchMutationPrompt.js";
import { createWorkbenchScratchController } from "./workbenchScratch.js";

const levelSelect = document.getElementById("levelSelect");
const selectionMeta = document.getElementById("selectionMeta");
const loadStatus = document.getElementById("loadStatus");
const contextPanel = document.getElementById("contextPanel");
const checksPanel = document.getElementById("checksPanel");
const runSummary = document.getElementById("runSummary");
const runOutput = document.getElementById("runOutput");
const runReferenceButton = document.getElementById("runReferenceButton");
const copyRunButton = document.getElementById("copyRunButton");
const scratchStatus = document.getElementById("scratchStatus");
const scratchFixtureLabel = document.getElementById("scratchFixtureLabel");
const scratchTargetSelect = document.getElementById("scratchTargetSelect");
const scratchTargetWrap = document.getElementById("scratchTargetWrap");
const scratchComparison = document.getElementById("scratchComparison");
const loadScratchCanonicalButton = document.getElementById("loadScratchCanonicalButton");
const applyScratchXmlButton = document.getElementById("applyScratchXmlButton");
const runScratchButton = document.getElementById("runScratchButton");
const generateMutationPromptButton = document.getElementById("generateMutationPromptButton");
const copyScratchXmlButton = document.getElementById("copyScratchXmlButton");
const mutationPromptOutput = document.getElementById("mutationPromptOutput");
const copyMutationPromptButton = document.getElementById("copyMutationPromptButton");
const selectMutationPromptButton = document.getElementById("selectMutationPromptButton");
const validationPanel = document.getElementById("validationPanel");
const promptOutput = document.getElementById("promptOutput");
const copyPromptButton = document.getElementById("copyPromptButton");
const selectPromptButton = document.getElementById("selectPromptButton");
const scratchBlocklyHost = document.getElementById("scratchBlocklyHost");
const scratchXmlOutput = document.getElementById("scratchXmlOutput");

const state = {
  data: null,
  currentResult: null,
  loading: false,
  scratchController: null,
  scratchSnapshot: null,
  mutationPromptText: ""
};

function escapeHtml(str) {
  return `${str ?? ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }
  if (typeof value === "object") {
    return escapeHtml(JSON.stringify(value, null, 2));
  }
  return escapeHtml(value);
}

function statusLabel(status) {
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
      return status;
  }
}

function checkCounts(checks = []) {
  const counts = {
    pass: 0,
    warning: 0,
    fail: 0,
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

function groupChecks(checks = []) {
  return checks.reduce((groups, check) => {
    const key = check.status || "unknown";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(check);
    return groups;
  }, new Map());
}

function renderMetadataTable(rows) {
  return `
    <table class="wb-meta-table">
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <th scope="row">${escapeHtml(label)}</th>
                <td>${value}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderChecklistItem(check) {
  const relatedFiles = Array.isArray(check.relatedFiles) && check.relatedFiles.length > 0
    ? `
      <ul class="wb-check-files">
        ${[...new Set(check.relatedFiles)].map((filePath) => `<li><code>${escapeHtml(filePath)}</code></li>`).join("")}
      </ul>
    `
    : "";

  const evidence = check.evidence != null
    ? `
      <details class="wb-check-details">
        <summary>Evidence</summary>
        <pre class="wb-code">${escapeHtml(JSON.stringify(check.evidence, null, 2))}</pre>
      </details>
    `
    : "";

  return `
    <li class="wb-check-item">
      <div class="wb-check-head">
        <span class="wb-badge" data-status="${escapeHtml(check.status)}">${escapeHtml(statusLabel(check.status))}</span>
        <strong>${escapeHtml(check.label)}</strong>
        <span class="wb-mono">${escapeHtml(check.severity || "none")}</span>
      </div>
      <p class="wb-check-message">${escapeHtml(check.message)}</p>
      ${relatedFiles}
      ${evidence}
    </li>
  `;
}

function renderChecksPanel(result) {
  const counts = checkCounts(result.checks);
  const grouped = groupChecks(result.checks);
  const order = ["fail", "warning", "pass", "not_applicable", "not_run"];
  const sections = order
    .filter((status) => grouped.has(status))
    .map(
      (status) => `
        <section class="wb-group">
          <h3 class="wb-group-title" data-status="${status}">
            ${statusLabel(status)} (${grouped.get(status).length})
          </h3>
          <ul class="wb-check-list">
            ${grouped.get(status).map(renderChecklistItem).join("")}
          </ul>
        </section>
      `
    );

  checksPanel.innerHTML = `
    <p class="wb-toolbar-meta">
      ${counts.pass} pass, ${counts.warning} warning${counts.warning === 1 ? "" : "s"},
      ${counts.fail} fail, ${counts.not_applicable} not-applicable, ${counts.not_run} not-run
    </p>
    ${sections.join("") || "<p>No checks available.</p>"}
  `;
}

function renderContextPanel(result) {
  const projectText = result.project
    ? `${result.project.id}${result.project.step ? ` step ${result.project.step}` : ""}${result.project.isCapstone ? " (capstone)" : ""}`
    : "none";

  const sourcePath = result.sourcePath || "(missing)";
  const conceptRow = result.conceptMatrixRow
    ? `
      <p class="wb-toolbar-meta">Matched row <code>${escapeHtml(result.conceptMatrixRow.levelLabel)}</code></p>
      <pre class="wb-code">${escapeHtml(result.conceptMatrixRow.raw)}</pre>
    `
    : `<p class="wb-toolbar-meta">No matching concept matrix row.</p>`;

  const fixtureSection = result.project
    ? `
      <h3 class="wb-group-title">Project fixtures</h3>
      <ul class="wb-check-files">
        <li><code>${escapeHtml(result.fixtures?.project?.step?.path || "(missing step fixture)")}</code> ${escapeHtml(result.fixtures?.project?.step?.exists ? "" : "(missing)")}</li>
        <li><code>${escapeHtml(result.fixtures?.project?.final?.path || "(missing final fixture)")}</code> ${escapeHtml(result.fixtures?.project?.final?.exists ? "" : "(missing)")}</li>
      </ul>
    `
    : `
      <h3 class="wb-group-title">Reference fixture</h3>
      <ul class="wb-check-files">
        <li><code>${escapeHtml(result.fixtures?.referenceSolution?.path || "(missing reference fixture)")}</code> ${escapeHtml(result.fixtures?.referenceSolution?.exists ? "" : "(missing)")}</li>
      </ul>
    `;

  contextPanel.innerHTML = `
    <div class="wb-group">
      ${renderMetadataTable([
        ["Title", escapeHtml(result.title || "(missing)")],
        ["Level id", `<code>${escapeHtml(result.levelId)}</code>`],
        ["Order", `<code>${escapeHtml(result.order ?? "(missing)")}</code>`],
        ["Kind", `<code>${escapeHtml(result.levelKind || "(missing)")}</code>`],
        ["Source path", `<code>${escapeHtml(sourcePath)}</code>`],
        ["Project", escapeHtml(projectText)],
        ["Concept matrix", result.conceptMatrixRow ? "matched" : "missing"]
      ])}
    </div>
    <div class="wb-group">
      <h3 class="wb-group-title">Fixture paths</h3>
      ${fixtureSection}
    </div>
    <div class="wb-group">
      <h3 class="wb-group-title">Concept matrix row</h3>
      ${conceptRow}
    </div>
  `;
}

function renderValidationPanel(result) {
  validationPanel.innerHTML = `
    <ul class="wb-command-list">
      ${result.validationCommands
        .map(
          (entry) => `
            <li class="wb-command-item">
              <strong>${escapeHtml(entry.label)}</strong>
              <div><code>${escapeHtml(entry.command)}</code></div>
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function renderRunPanel(result) {
  const model = buildWorkbenchRunPanelModel(result);
  const badgeClass = model.status || "not_run";
  runSummary.innerHTML = `
    <span class="wb-badge" data-status="${escapeHtml(badgeClass)}">${escapeHtml(statusLabel(model.status))}</span>
    ${escapeHtml(model.summary || "No run available.")}
  `;
  runOutput.value = model.copyText || "";
  runReferenceButton.disabled = false;
  copyRunButton.disabled = false;
}

function renderPrompt(result) {
  promptOutput.value = formatLevelReadinessPrompt(result);
}

function getScratchTargetKind(result) {
  if (!result) {
    return null;
  }
  if (result.project) {
    const value = scratchTargetSelect?.value || "";
    return value === "step" || value === "final" ? value : null;
  }
  return "reference";
}

function getScratchFixtureDescriptor(result, targetKind) {
  if (!result || !targetKind) {
    return null;
  }
  if (result.project) {
    if (targetKind === "step") {
      return {
        kind: "step",
        label: "Project step fixture",
        path: result.fixtures?.project?.step?.path || null,
        exists: Boolean(result.fixtures?.project?.step?.exists)
      };
    }
    if (targetKind === "final") {
      return {
        kind: "final",
        label: "Project final fixture",
        path: result.fixtures?.project?.final?.path || null,
        exists: Boolean(result.fixtures?.project?.final?.exists)
      };
    }
    return null;
  }
  if (targetKind !== "reference") {
    return null;
  }
  return {
    kind: "reference",
    label: "Reference fixture",
    path: result.fixtures?.referenceSolution?.path || null,
    exists: Boolean(result.fixtures?.referenceSolution?.exists)
  };
}

function getCanonicalScratchRun(result, targetKind) {
  if (!result || !targetKind) {
    return null;
  }
  const normalize = (runtime) => {
    if (!runtime) {
      return null;
    }
    return {
      status:
        runtime.result === "PASSED"
          ? "pass"
          : runtime.result === "FAILED"
            ? "fail"
            : "not_run",
      turnCount: Number.isFinite(runtime.turnCount) ? runtime.turnCount : null,
      finalTurnState: runtime.finalTurnState || null,
      mainGameState: runtime.mainGameState || null,
      lastLevelResultReason: runtime.lastLevelResultReason || null,
      traceTail: Array.isArray(runtime.traceTail) ? runtime.traceTail : [],
      eventTail: Array.isArray(runtime.eventTail) ? runtime.eventTail : [],
      documentedException: runtime.documentedException || null
    };
  };
  if (result.project) {
    if (targetKind === "step") {
      return normalize(result.runtime?.step || null);
    }
    if (targetKind === "final") {
      return normalize(result.runtime?.final || null);
    }
    return null;
  }
  if (targetKind !== "reference") {
    return null;
  }
  return normalize(result.runtime?.reference || null);
}

function compareRuns(left, right) {
  if (!left || !right) {
    return null;
  }
  return (
    left.status === right.status &&
    left.turnCount === right.turnCount &&
    left.finalTurnState === right.finalTurnState &&
    left.mainGameState === right.mainGameState &&
    left.lastLevelResultReason === right.lastLevelResultReason
  );
}

function renderScratchComparison() {
  if (!scratchComparison) {
    return;
  }
  const result = state.currentResult;
  const snapshot = state.scratchSnapshot;
  if (!result || !snapshot) {
    scratchComparison.innerHTML = "<p class=\"wb-toolbar-meta\">Select a level to load the scratch workspace.</p>";
    return;
  }

  const targetKind = getScratchTargetKind(result);
  const targetDescriptor = getScratchFixtureDescriptor(result, targetKind);
  const canonicalRun = getCanonicalScratchRun(result, targetKind);
  const scratchRun = snapshot.scratchRun;
  const comparison = compareRuns(scratchRun, canonicalRun);
  const targetLabel = targetDescriptor?.label || "Choose a fixture target";
  const targetPath = targetDescriptor?.path || "(missing)";
  const scratchLine = scratchRun
    ? `${statusLabel(scratchRun.status)} | ${Number.isFinite(scratchRun.turnCount) ? `${scratchRun.turnCount} turn${scratchRun.turnCount === 1 ? "" : "s"}` : "turn count missing"}${scratchRun.lastLevelResultReason ? ` | ${scratchRun.lastLevelResultReason}` : ""}`
    : "Not run";
  const canonicalLine = canonicalRun
    ? `${statusLabel(canonicalRun.status)} | ${Number.isFinite(canonicalRun.turnCount) ? `${canonicalRun.turnCount} turn${canonicalRun.turnCount === 1 ? "" : "s"}` : "turn count missing"}${canonicalRun.lastLevelResultReason ? ` | ${canonicalRun.lastLevelResultReason}` : ""}`
    : "Not applicable";
  const compareLine =
    comparison === null
      ? "Comparison unavailable until a fixture target is chosen."
      : comparison
        ? "Scratch result matches the canonical target."
        : "Scratch result differs from the canonical target.";

  scratchComparison.innerHTML = `
    <div class="wb-group">
      <table class="wb-meta-table">
        <tbody>
          <tr><th scope="row">Target</th><td>${escapeHtml(targetLabel)}</td></tr>
          <tr><th scope="row">Target path</th><td><code>${escapeHtml(targetPath)}</code></td></tr>
          <tr><th scope="row">Scratch</th><td>${escapeHtml(scratchLine)}</td></tr>
          <tr><th scope="row">Canonical</th><td>${escapeHtml(canonicalLine)}</td></tr>
          <tr><th scope="row">Match</th><td>${escapeHtml(compareLine)}</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderMutationPrompt() {
  if (!mutationPromptOutput) {
    return;
  }
  mutationPromptOutput.value = state.mutationPromptText || "";
}

function updateScratchTargetControls(result) {
  if (!scratchTargetSelect || !scratchTargetWrap || !loadScratchCanonicalButton) {
    return;
  }

  const isProject = Boolean(result?.project);
  const selectedTargetKind = state.scratchSnapshot?.targetKind || (isProject ? "" : "reference");
  scratchTargetWrap.hidden = !isProject;
  scratchTargetSelect.innerHTML = "";

  if (!isProject) {
    const referenceOption = document.createElement("option");
    referenceOption.value = "reference";
    referenceOption.textContent = "Reference fixture";
    scratchTargetSelect.appendChild(referenceOption);
    scratchTargetSelect.value = "reference";
    loadScratchCanonicalButton.textContent = "Load reference fixture";
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose project fixture…";
  placeholder.disabled = true;
  placeholder.selected = true;
  scratchTargetSelect.appendChild(placeholder);

  const stepOption = document.createElement("option");
  stepOption.value = "step";
  stepOption.textContent = "Project step fixture";
  scratchTargetSelect.appendChild(stepOption);

  const finalOption = document.createElement("option");
  finalOption.value = "final";
  finalOption.textContent = "Project final fixture";
  scratchTargetSelect.appendChild(finalOption);
  scratchTargetSelect.value = selectedTargetKind === "step" || selectedTargetKind === "final" ? selectedTargetKind : "";
  loadScratchCanonicalButton.textContent = "Load canonical fixture";
}

function renderScratchPanel() {
  const result = state.currentResult;
  const snapshot = state.scratchSnapshot;

  if (!scratchStatus || !scratchFixtureLabel || !scratchComparison || !runScratchButton || !generateMutationPromptButton) {
    return;
  }

  if (!result || !snapshot) {
    scratchStatus.textContent = "Select a level to begin.";
    scratchFixtureLabel.textContent = "";
    scratchComparison.innerHTML = "<p class=\"wb-toolbar-meta\">Scratch workspace is not ready yet.</p>";
    runScratchButton.disabled = true;
    generateMutationPromptButton.disabled = true;
    if (loadScratchCanonicalButton) {
      loadScratchCanonicalButton.disabled = true;
    }
    if (applyScratchXmlButton) {
      applyScratchXmlButton.disabled = true;
    }
    if (copyScratchXmlButton) {
      copyScratchXmlButton.disabled = true;
    }
    return;
  }

  updateScratchTargetControls(result);
  const targetKind = getScratchTargetKind(result);
  const targetDescriptor = getScratchFixtureDescriptor(result, targetKind);
  const canUseTarget = Boolean(targetDescriptor && targetDescriptor.exists);
  const statusBits = [];
  statusBits.push(snapshot.loadedFrom === "canonical" ? "Canonical XML loaded" : "Starter XML loaded");
  if (snapshot.xmlError) {
    statusBits.push(`XML error: ${snapshot.xmlError}`);
  }
  if (!targetKind) {
    statusBits.push("Choose a project fixture target before loading canonical XML or generating a prompt.");
  }
  scratchStatus.textContent = statusBits.join(" | ");
  scratchFixtureLabel.textContent = targetDescriptor
    ? `${targetDescriptor.label}${targetDescriptor.path ? ` · ${targetDescriptor.path}` : ""}`
    : result.project
      ? "Choose step or final fixture before comparing scratch XML."
      : "Reference fixture";

  const enableActions = canUseTarget || targetKind === "reference";
  if (loadScratchCanonicalButton) {
    loadScratchCanonicalButton.disabled = !enableActions;
  }
  if (applyScratchXmlButton) {
    applyScratchXmlButton.disabled = !snapshot.level;
  }
  if (copyScratchXmlButton) {
    copyScratchXmlButton.disabled = !snapshot.level;
  }

  const canGeneratePrompt = Boolean(snapshot.scratchRun && targetDescriptor?.path && snapshot.scratchRun.status !== "not_run");
  const canRunScratch = Boolean(snapshot.level && canUseTarget);
  runScratchButton.disabled = !canRunScratch;
  generateMutationPromptButton.disabled = !canGeneratePrompt;
  renderScratchComparison();
  renderMutationPrompt();
}

function renderSelectionMeta(result) {
  const counts = checkCounts(result.checks);
  selectionMeta.textContent = `${result.title} | ${counts.fail} fail, ${counts.warning} warning${counts.warning === 1 ? "" : "s"}, ${counts.pass} pass`;
}

function buildMutationPromptText() {
  const result = state.currentResult;
  const snapshot = state.scratchSnapshot;
  if (!result || !snapshot?.scratchRun) {
    return "";
  }
  const targetKind = getScratchTargetKind(result);
  const targetDescriptor = getScratchFixtureDescriptor(result, targetKind);
  if (!targetDescriptor) {
    return "";
  }
  const canonicalRun = getCanonicalScratchRun(result, targetKind);
  const extraDoNotTouchFiles = result.project
    ? targetKind === "step"
      ? [result.fixtures?.project?.final?.path]
      : [result.fixtures?.project?.step?.path]
    : [];

  return formatWorkbenchMutationPrompt({
    levelId: result.levelId,
    title: result.title,
    sourcePath: result.sourcePath,
    fixtureTarget: targetDescriptor,
    scratchXmlText: snapshot.xmlText,
    scratchRun: snapshot.scratchRun,
    canonicalRun,
    validationCommands: result.validationCommands,
    extraDoNotTouchFiles
  });
}

async function updateSelectedLevel(levelId) {
  if (!state.data || !levelId) {
    return;
  }
  state.loading = true;
  selectionMeta.textContent = levelSelect.selectedOptions[0]?.textContent || levelId;
  loadStatus.textContent = `Rendering ${levelId}…`;
  try {
    const result = await state.data.getResult(levelId);
    const level = state.data.getLevel(levelId);
    state.currentResult = result;
    renderSelectionMeta(result);
    renderContextPanel(result);
    renderChecksPanel(result);
    renderRunPanel(result);
    renderValidationPanel(result);
    renderPrompt(result);
    state.mutationPromptText = "";
    renderMutationPrompt();
    if (state.scratchController && level) {
      state.scratchController.setLevel(level, { targetKind: result.project ? null : "reference" });
    }
    loadStatus.textContent = `Loaded ${result.title} (${result.levelId})`;
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    loadStatus.textContent = message;
    contextPanel.innerHTML = `<p class="wb-toolbar-meta">${escapeHtml(message)}</p>`;
    checksPanel.innerHTML = "";
    runSummary.innerHTML = "";
    runOutput.value = "";
    validationPanel.innerHTML = "";
    promptOutput.value = "";
    state.scratchSnapshot = null;
    state.mutationPromptText = "";
    renderScratchPanel();
    renderMutationPrompt();
    if (scratchStatus) {
      scratchStatus.textContent = "";
    }
  } finally {
    state.loading = false;
  }
}

copyPromptButton.addEventListener("click", async () => {
  const text = promptOutput.value || "";
  try {
    await navigator.clipboard.writeText(text);
    loadStatus.textContent = "Prompt copied to clipboard.";
  } catch {
    promptOutput.focus();
    promptOutput.select();
    loadStatus.textContent = "Prompt selected for manual copy.";
  }
});

selectPromptButton.addEventListener("click", () => {
  promptOutput.focus();
  promptOutput.select();
  loadStatus.textContent = "Prompt selected.";
});

runReferenceButton.addEventListener("click", () => {
  if (state.loading) {
    return;
  }
  void updateSelectedLevel(levelSelect.value);
});

copyRunButton.addEventListener("click", async () => {
  const text = runOutput.value || "";
  try {
    await navigator.clipboard.writeText(text);
    loadStatus.textContent = "Run evidence copied to clipboard.";
  } catch {
    runOutput.focus();
    runOutput.select();
    loadStatus.textContent = "Run evidence selected for manual copy.";
  }
});

scratchTargetSelect?.addEventListener("change", () => {
  if (!state.scratchController) {
    return;
  }
  state.scratchController.setTargetKind(scratchTargetSelect.value || null);
  state.mutationPromptText = "";
  renderScratchPanel();
});

loadScratchCanonicalButton?.addEventListener("click", async () => {
  if (!state.currentResult || !state.scratchController || !state.data) {
    return;
  }
  const targetKind = getScratchTargetKind(state.currentResult);
  const descriptor = await state.data.getFixtureDescriptor(state.currentResult.levelId, targetKind);
  if (!descriptor) {
    loadStatus.textContent = "Choose a fixture target before loading canonical XML.";
    return;
  }
  state.scratchController.loadCanonicalXml(descriptor.xmlText);
  state.mutationPromptText = "";
  renderScratchPanel();
  loadStatus.textContent = `Loaded ${descriptor.label}.`;
});

applyScratchXmlButton?.addEventListener("click", () => {
  if (!state.scratchController) {
    return;
  }
  const result = state.scratchController.applyEditorXml();
  state.mutationPromptText = "";
  renderScratchPanel();
  loadStatus.textContent = result?.ok ? "Scratch XML applied." : result?.error || "Scratch XML could not be applied.";
});

runScratchButton?.addEventListener("click", () => {
  if (!state.scratchController) {
    return;
  }
  const runtime = state.scratchController.runScratch();
  state.mutationPromptText = "";
  renderScratchPanel();
  loadStatus.textContent = runtime ? "Scratch solution run complete." : "Scratch solution could not run.";
});

generateMutationPromptButton?.addEventListener("click", () => {
  const promptText = buildMutationPromptText();
  state.mutationPromptText = promptText;
  renderMutationPrompt();
  loadStatus.textContent = promptText ? "Mutation prompt generated." : "Scratch candidate is not ready for a mutation prompt yet.";
});

copyScratchXmlButton?.addEventListener("click", async () => {
  if (!scratchXmlOutput) {
    return;
  }
  const text = scratchXmlOutput.value || "";
  try {
    await navigator.clipboard.writeText(text);
    loadStatus.textContent = "Scratch XML copied to clipboard.";
  } catch {
    scratchXmlOutput.focus();
    scratchXmlOutput.select();
    loadStatus.textContent = "Scratch XML selected for manual copy.";
  }
});

copyMutationPromptButton?.addEventListener("click", async () => {
  const text = mutationPromptOutput?.value || "";
  try {
    await navigator.clipboard.writeText(text);
    loadStatus.textContent = "Mutation prompt copied to clipboard.";
  } catch {
    mutationPromptOutput?.focus();
    mutationPromptOutput?.select();
    loadStatus.textContent = "Mutation prompt selected for manual copy.";
  }
});

selectMutationPromptButton?.addEventListener("click", () => {
  mutationPromptOutput?.focus();
  mutationPromptOutput?.select();
  loadStatus.textContent = "Mutation prompt selected.";
});

levelSelect.addEventListener("change", () => {
  void updateSelectedLevel(levelSelect.value);
});

async function start() {
  try {
    loadStatus.textContent = "Loading workbench data…";
    state.data = await loadWorkbenchData();
    state.scratchController = createWorkbenchScratchController({
      hostElement: scratchBlocklyHost,
      xmlTextareaElement: scratchXmlOutput,
      onChange(snapshot) {
        state.scratchSnapshot = snapshot;
        state.mutationPromptText = "";
        renderScratchPanel();
      }
    });

    for (const option of state.data.levelOptions) {
      const opt = document.createElement("option");
      opt.value = option.id;
      opt.textContent = `${String(option.order).padStart(2, "0")} · ${option.title}`;
      levelSelect.appendChild(opt);
    }

    const defaultLevelId = state.data.levelOptions[0]?.id || "";
    levelSelect.value = defaultLevelId;
    renderScratchPanel();
    loadStatus.textContent = "Workbench ready.";
    if (!defaultLevelId) {
      loadStatus.textContent = "No guided levels were found.";
    }
  } catch (error) {
    console.error(error);
    loadStatus.textContent = error instanceof Error ? error.message : String(error);
  }
}

void start();
