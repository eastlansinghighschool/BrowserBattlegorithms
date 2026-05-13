import {
  summarizeUsagePayloadAsync,
  compareUsageSummaries
} from "../usage/usageAnalyzerBrowser.js";

// ── State ──────────────────────────────────────────────────────────────────

const records = []; // { fileName, payload, summary }
const errors = [];  // { fileName, message }
let selectedIndex = null;

// ── DOM refs ───────────────────────────────────────────────────────────────

const dropZone = document.getElementById("dropZone");
const filePickerButton = document.getElementById("filePickerButton");
const clearButton = document.getElementById("clearButton");
const fileInput = document.getElementById("fileInput");
const fileCount = document.getElementById("fileCount");
const errorList = document.getElementById("errorList");
const flagsSection = document.getElementById("flagsSection");
const flagsList = document.getElementById("flagsList");
const tableSection = document.getElementById("tableSection");
const classTableBody = document.getElementById("classTableBody");
const detailSection = document.getElementById("detailSection");
const detailHeading = document.getElementById("detailHeading");
const detailContent = document.getElementById("detailContent");
const closeDetailButton = document.getElementById("closeDetailButton");

// ── File ingestion ─────────────────────────────────────────────────────────

async function ingestFiles(fileList) {
  for (const file of fileList) {
    if (!file.name.endsWith(".json")) {
      errors.push({ fileName: file.name, message: "Not a .json file." });
      continue;
    }
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      if (!payload || typeof payload !== "object" || !payload.sessionId) {
        errors.push({ fileName: file.name, message: "Not a recognized usage file (missing sessionId)." });
        continue;
      }
      const summary = await summarizeUsagePayloadAsync(payload);
      records.push({ fileName: file.name, payload, summary });
    } catch (err) {
      errors.push({ fileName: file.name, message: err instanceof Error ? err.message : String(err) });
    }
  }
  renderAll();
}

// ── Rendering ──────────────────────────────────────────────────────────────

function renderAll() {
  renderFileCount();
  renderErrors();
  renderFlags();
  renderTable();
  if (selectedIndex !== null && selectedIndex < records.length) {
    renderDetail(selectedIndex);
  } else {
    detailSection.hidden = true;
    selectedIndex = null;
  }
  clearButton.hidden = records.length === 0 && errors.length === 0;
}

function renderFileCount() {
  const total = records.length + errors.length;
  if (total === 0) {
    fileCount.textContent = "";
    return;
  }
  const parts = [];
  if (records.length > 0) {
    parts.push(`${records.length} file${records.length === 1 ? "" : "s"} loaded`);
  }
  if (errors.length > 0) {
    parts.push(`${errors.length} error${errors.length === 1 ? "" : "s"}`);
  }
  fileCount.textContent = parts.join(", ");
}

function renderErrors() {
  errorList.innerHTML = "";
  if (errors.length === 0) {
    errorList.hidden = true;
    return;
  }
  errorList.hidden = false;
  for (const { fileName, message } of errors) {
    const li = document.createElement("li");
    li.className = "adm-error-item";
    li.textContent = `${fileName}: ${message}`;
    errorList.appendChild(li);
  }
}

function renderFlags() {
  flagsList.innerHTML = "";
  if (records.length < 2) {
    flagsSection.hidden = true;
    return;
  }
  const summaries = records.map((r) => r.summary);
  const { duplicateSessionIds, duplicateHashes, similarSequencesDifferentNames } = compareUsageSummaries(summaries);
  const items = [];

  for (const { sessionId, indices } of duplicateSessionIds) {
    const names = indices.map((i) => records[i].summary.studentName || records[i].fileName).join(", ");
    items.push(`<strong>Possible duplicate:</strong> Same session ID across ${names} — session ${sessionId.slice(0, 12)}…`);
  }
  for (const { indices } of duplicateHashes) {
    const names = indices.map((i) => records[i].summary.studentName || records[i].fileName).join(", ");
    items.push(`<strong>Identical integrity hash:</strong> ${names} — files may be exact copies.`);
  }
  for (const { labels } of similarSequencesDifferentNames) {
    items.push(`<strong>Similarity flag:</strong> ${labels.join(", ")} — identical event sequence under different names. Review recommended.`);
  }

  if (items.length === 0) {
    flagsSection.hidden = true;
    return;
  }
  flagsSection.hidden = false;
  for (const html of items) {
    const li = document.createElement("li");
    li.className = "adm-flag-item";
    li.innerHTML = html;
    flagsList.appendChild(li);
  }
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function shortSession(sessionId) {
  if (!sessionId) return "—";
  return sessionId.slice(0, 12) + (sessionId.length > 12 ? "…" : "");
}

function integrityBadge(hashStatus) {
  const ok = hashStatus === "verified hash";
  return `<span class="adm-badge ${ok ? "adm-badge-ok" : "adm-badge-err"}">${ok ? "✓ verified" : "✗ mismatch"}</span>`;
}

function flagChips(signals) {
  if (!signals.length) return "";
  return signals.map((s) => `<span class="adm-flag-chip">${s.replace(/_/g, " ")}</span>`).join("");
}

function renderTable() {
  classTableBody.innerHTML = "";
  if (records.length === 0) {
    tableSection.hidden = true;
    return;
  }
  tableSection.hidden = false;

  records.forEach(({ summary }, index) => {
    const tr = document.createElement("tr");
    if (index === selectedIndex) {
      tr.className = "adm-row-selected";
    }
    tr.setAttribute("tabindex", "0");
    tr.setAttribute("aria-label", `Student ${summary.studentName || "(blank)"}`);
    tr.innerHTML = `
      <td>${escHtml(summary.studentName || "(blank)")}</td>
      <td class="adm-mono" title="${escHtml(summary.sessionId)}">${escHtml(shortSession(summary.sessionId))}</td>
      <td>${escHtml(formatDate(summary.exportedAt))}</td>
      <td>${integrityBadge(summary.hashStatus)}</td>
      <td>${summary.guided.passed} / ${summary.guided.completed}</td>
      <td>${escHtml(summary.challengeSummary)}</td>
      <td>${summary.freePlay.wins}W / ${summary.freePlay.losses}L</td>
      <td>${summary.playTimeMinutes}</td>
      <td>${summary.totalEvents}</td>
      <td>${summary.totalSnapshots}</td>
      <td>${flagChips(summary.suspiciousSignals)}</td>
    `;
    tr.addEventListener("click", () => selectRow(index));
    tr.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectRow(index);
      }
    });
    classTableBody.appendChild(tr);
  });
}

function selectRow(index) {
  selectedIndex = index;
  renderTable();
  renderDetail(index);
}

function renderDetail(index) {
  const { fileName, payload, summary } = records[index];
  detailHeading.textContent = summary.studentName ? `Detail: ${summary.studentName}` : `Detail: ${fileName}`;
  detailSection.hidden = false;
  detailSection.scrollIntoView({ behavior: "smooth", block: "nearest" });

  const integrityOk = summary.hashStatus === "verified hash";
  const bannerClass = integrityOk ? "ok" : "warn";
  const bannerLabel = integrityOk ? "✓ Verified hash" : "✗ Hash mismatch — file may have been edited";

  const signalsHtml = summary.suspiciousSignals.length
    ? `<ul class="adm-signals-list">${summary.suspiciousSignals.map((s) => `<li>${escHtml(s.replace(/_/g, " "))}</li>`).join("")}</ul>`
    : `<p style="font-size:0.85rem;color:var(--adm-text-muted)">No suspicious signals detected.</p>`;

  const events = Array.isArray(payload.events) ? payload.events : [];
  const recentEvents = events.slice(-30).reverse();
  const eventsHtml = recentEvents.length
    ? `<ul class="adm-event-list">${recentEvents.map((e) => `<li class="adm-event-item"><span class="adm-event-type">${escHtml(e.type || "unknown")}</span> <span>${escHtml(e.at || "")}</span></li>`).join("")}</ul>`
    : `<p style="font-size:0.85rem;color:var(--adm-text-muted)">No events recorded.</p>`;

  const snapshots = Array.isArray(payload.snapshots) ? payload.snapshots : [];
  const snapshotsHtml = snapshots.length
    ? `<ul class="adm-snapshot-list">${snapshots.map((snap) => snapshotItemHtml(snap)).join("")}</ul>`
    : `<p style="font-size:0.85rem;color:var(--adm-text-muted)">No snapshots recorded.</p>`;

  detailContent.innerHTML = `
    <div class="adm-integrity-banner ${bannerClass}">
      <strong>${bannerLabel}</strong>
      <span class="adm-integrity-hash">${escHtml(summary.hash || "no hash")}</span>
    </div>

    <div class="adm-detail-grid">
      <div class="adm-detail-card">
        <p class="adm-detail-card-title">Identity</p>
        ${statRow("Student", escHtml(summary.studentName || "(blank)"))}
        ${statRow("Session ID", `<span class="adm-mono" title="${escHtml(summary.sessionId)}">${escHtml(summary.sessionId.slice(0, 20))}${summary.sessionId.length > 20 ? "…" : ""}</span>`)}
        ${statRow("Exported", escHtml(formatDate(summary.exportedAt)))}
        ${statRow("App version", escHtml(summary.appVersion || "—"))}
        ${statRow("File", escHtml(fileName))}
      </div>
      <div class="adm-detail-card">
        <p class="adm-detail-card-title">Guided Levels</p>
        ${statRow("Started", summary.guided.started)}
        ${statRow("Completed", summary.guided.completed)}
        ${statRow("Passed", summary.guided.passed)}
        ${statRow("Failed", summary.guided.failed)}
        ${statRow("Attempts", summary.guided.attempts)}
        ${statRow("Turns taken", summary.guided.turns)}
        ${statRow("Challenges", escHtml(summary.challengeSummary))}
      </div>
      <div class="adm-detail-card">
        <p class="adm-detail-card-title">Free Play</p>
        ${statRow("Sessions entered", summary.freePlay.entered)}
        ${statRow("Turns taken", summary.freePlay.turns)}
        ${statRow("Score events", summary.freePlay.scoreEvents)}
        ${statRow("Wins (team 1)", summary.freePlay.wins)}
        ${statRow("Losses (team 1)", summary.freePlay.losses)}
        ${statRow("Last score", `${summary.freePlay.lastScores[1]}–${summary.freePlay.lastScores[2]}`)}
        ${statRow("Config changes", summary.freePlay.configChanges)}
      </div>
      <div class="adm-detail-card">
        <p class="adm-detail-card-title">Activity</p>
        ${statRow("Events", summary.totalEvents)}
        ${statRow("Snapshots", summary.totalSnapshots)}
        ${statRow("Play time (min)", summary.playTimeMinutes)}
      </div>
    </div>

    <div class="adm-detail-subsection">
      <p class="adm-detail-subsection-title">Suspicious Signals</p>
      ${signalsHtml}
    </div>

    <div class="adm-detail-subsection">
      <details class="adm-collapsible">
        <summary>Recent events (last ${recentEvents.length} of ${events.length})</summary>
        ${eventsHtml}
      </details>
    </div>

    <div class="adm-detail-subsection">
      <details class="adm-collapsible">
        <summary>Code snapshots (${snapshots.length})</summary>
        ${snapshotsHtml}
      </details>
    </div>
  `;
}

function snapshotItemHtml(snap) {
  const blockCounts = snap.data?.blockCounts || {};
  const blockSummary = Object.entries(blockCounts)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ") || "no blocks";
  const xmlText = snap.data?.xmlText || "";
  const xmlSection = xmlText
    ? `<details class="adm-collapsible"><summary>View XML</summary><pre class="adm-xml-pre">${escHtml(xmlText)}</pre></details>`
    : "";
  return `
    <li class="adm-snapshot-item">
      <p class="adm-snapshot-meta">${escHtml(snap.type || "snapshot")} · ${escHtml(formatDate(snap.at))} · ${escHtml(blockSummary)}</p>
      ${xmlSection}
    </li>
  `;
}

function statRow(label, value) {
  return `<div class="adm-detail-stat"><span class="adm-detail-stat-label">${label}</span><span class="adm-detail-stat-value">${value}</span></div>`;
}

function escHtml(str) {
  return `${str ?? ""}`.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Event wiring ───────────────────────────────────────────────────────────

filePickerButton.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", () => {
  if (fileInput.files?.length) {
    ingestFiles(fileInput.files);
    fileInput.value = "";
  }
});

clearButton.addEventListener("click", () => {
  records.length = 0;
  errors.length = 0;
  selectedIndex = null;
  renderAll();
});

closeDetailButton.addEventListener("click", () => {
  selectedIndex = null;
  detailSection.hidden = true;
  renderTable();
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("adm-drop-active");
});

dropZone.addEventListener("dragleave", (e) => {
  if (!dropZone.contains(e.relatedTarget)) {
    dropZone.classList.remove("adm-drop-active");
  }
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("adm-drop-active");
  const files = e.dataTransfer?.files;
  if (files?.length) {
    ingestFiles(files);
  }
});
