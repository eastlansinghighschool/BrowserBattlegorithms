import { formatLevelReadinessPrompt } from "../dev/levelReadinessPrompt.js";
import { loadWorkbenchData } from "./workbenchData.js";

const levelSelect = document.getElementById("levelSelect");
const selectionMeta = document.getElementById("selectionMeta");
const loadStatus = document.getElementById("loadStatus");
const contextPanel = document.getElementById("contextPanel");
const checksPanel = document.getElementById("checksPanel");
const validationPanel = document.getElementById("validationPanel");
const promptOutput = document.getElementById("promptOutput");
const copyPromptButton = document.getElementById("copyPromptButton");
const selectPromptButton = document.getElementById("selectPromptButton");

const state = {
  data: null,
  currentResult: null,
  loading: false
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

function renderPrompt(result) {
  promptOutput.value = formatLevelReadinessPrompt(result);
}

function renderSelectionMeta(result) {
  const counts = checkCounts(result.checks);
  selectionMeta.textContent = `${result.title} | ${counts.fail} fail, ${counts.warning} warning${counts.warning === 1 ? "" : "s"}, ${counts.pass} pass`;
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
    state.currentResult = result;
    renderSelectionMeta(result);
    renderContextPanel(result);
    renderChecksPanel(result);
    renderValidationPanel(result);
    renderPrompt(result);
    loadStatus.textContent = `Loaded ${result.title} (${result.levelId})`;
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : String(error);
    loadStatus.textContent = message;
    contextPanel.innerHTML = `<p class="wb-toolbar-meta">${escapeHtml(message)}</p>`;
    checksPanel.innerHTML = "";
    validationPanel.innerHTML = "";
    promptOutput.value = "";
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

levelSelect.addEventListener("change", () => {
  void updateSelectedLevel(levelSelect.value);
});

async function start() {
  try {
    loadStatus.textContent = "Loading workbench data…";
    state.data = await loadWorkbenchData();

    for (const option of state.data.levelOptions) {
      const opt = document.createElement("option");
      opt.value = option.id;
      opt.textContent = `${String(option.order).padStart(2, "0")} · ${option.title}`;
      levelSelect.appendChild(opt);
    }

    const defaultLevelId = state.data.levelOptions[0]?.id || "";
    levelSelect.value = defaultLevelId;
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
