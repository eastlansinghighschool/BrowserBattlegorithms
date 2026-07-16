function escapeHtml(value) {
  return `${value || ""}`
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getProjectMetadata(level) {
  return level?.project?.id ? level.project : null;
}

export function getProjectStartCalloutStorageKey(level) {
  const project = getProjectMetadata(level);
  return project ? `bba:project-start-callout-seen:${project.id}` : null;
}

function getStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  return window.localStorage;
}

export function isProjectLevel(level) {
  return Boolean(getProjectMetadata(level));
}

export function isProjectStartLevel(level) {
  return Boolean(getProjectMetadata(level)?.isStart);
}

export function isProjectCapstoneLevel(level) {
  return Boolean(getProjectMetadata(level)?.isCapstone);
}

export function getProjectDisplayName(level) {
  return getProjectMetadata(level)?.label || "";
}

export function hasSeenProjectStartCallout(level) {
  const key = getProjectStartCalloutStorageKey(level);
  const storage = getStorage();
  if (!key || !storage) {
    return false;
  }
  return storage.getItem(key) === "true";
}

export function dismissProjectStartCallout(level) {
  const key = getProjectStartCalloutStorageKey(level);
  const storage = getStorage();
  if (!key || !storage) {
    return;
  }
  try {
    storage.setItem(key, "true");
  } catch {
    // Ignore storage failures and keep the callout usable in-memory.
  }
}

export function renderProjectBadge(level) {
  if (!isProjectLevel(level)) {
    return "";
  }

  const projectName = escapeHtml(getProjectDisplayName(level));
  return `<span class="level-kind-badge level-kind-badge-project" aria-label="Project: ${projectName}" title="Project: ${projectName}">Project</span>`;
}

export function renderProjectIndicator(level) {
  const project = getProjectMetadata(level);
  if (!project) {
    return "";
  }

  const projectName = escapeHtml(project.label);
  const stepText = Number.isInteger(project.step) && Number.isInteger(project.totalSteps)
    ? `Step ${project.step} of ${project.totalSteps}`
    : "";
  const indicatorBody = escapeHtml(project.indicatorBody || "Shared code across this project.");
  return `
    <div class="lesson-project-indicator">
      <p class="lesson-project-indicator-label">Project: ${projectName}</p>
      ${stepText ? `<p class="lesson-project-indicator-step" aria-label="Project ${stepText.toLowerCase()}">${stepText}</p>` : ""}
      <p class="lesson-project-indicator-body">${indicatorBody}</p>
    </div>
  `;
}

export function renderProjectStartLessonCallout(level) {
  const project = getProjectMetadata(level);
  if (!isProjectStartLevel(level) || !project) {
    return "";
  }

  const calloutBody = escapeHtml(project.startCalloutBody || "This project keeps one shared script. Going back tests the latest project script on an earlier scenario.");

  return `
    <div class="lesson-project-start-callout">
      <p class="lesson-project-start-callout-label">Project Start</p>
      <p class="lesson-project-start-callout-body">${calloutBody}</p>
    </div>
  `;
}

export function renderProjectStateNote(level) {
  if (level?.id !== "escort-the-carrier") {
    return "";
  }

  return `
    <div class="lesson-project-state-note">
      <p class="lesson-project-state-note-label">Special start state</p>
      <p class="lesson-project-state-note-body">The lead ally starts with the flag already, so this level checks how the shared script reacts to a carrier start.</p>
    </div>
  `;
}

export function renderProjectStartWorkspaceCallout(level) {
  if (!isProjectStartLevel(level) || hasSeenProjectStartCallout(level)) {
    return "";
  }

  const projectName = escapeHtml(getProjectDisplayName(level));
  const workspaceCalloutBody = escapeHtml(getProjectMetadata(level)?.workspaceCalloutBody || "This icon means this level is part of a larger project. Changes will be saved across these levels.");
  return `
    <div class="blockly-project-callout" role="note" aria-label="Project start note for ${projectName}">
      <div class="blockly-project-callout-copy">
        <span class="blockly-project-callout-badge" aria-hidden="true">Project</span>
        <p class="blockly-project-callout-body">${workspaceCalloutBody}</p>
      </div>
      <button
        type="button"
        class="blockly-project-callout-dismiss"
        data-project-callout-action="dismiss"
        aria-label="Dismiss the project start note for ${projectName}"
      >
        Got it
      </button>
    </div>
  `;
}
