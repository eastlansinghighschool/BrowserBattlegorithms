import * as Blockly from "blockly";
import { GAME_VIEW_MODES, LEVEL_RESULT } from "../config/constants.js";
import { buildToolboxXml, loadWorkspaceXml, getWorkspaceXmlText, setBlocklyToolboxForCurrentMode } from "../ai/blockly/workspace.js";
import { getFullToolboxBlockTypes } from "../ai/blockly/blocks.js";
import { createApp } from "../core/state.js";
import { createSeededRandom, simulateLevelXml } from "../dev/levelReadiness.js";

function normalizeSimulationResult(runtime) {
  const status =
    runtime?.result === LEVEL_RESULT.PASSED
      ? "pass"
      : runtime?.result === LEVEL_RESULT.FAILED
        ? "fail"
        : "not_run";
  return {
    status,
    turnCount: Number.isFinite(runtime?.turnCount) ? runtime.turnCount : null,
    finalTurnState: runtime?.finalTurnState || null,
    mainGameState: runtime?.mainGameState || null,
    lastLevelResultReason: runtime?.lastLevelResultReason || null,
    traceTail: Array.isArray(runtime?.traceTail) ? runtime.traceTail : [],
    eventTail: Array.isArray(runtime?.eventTail) ? runtime.eventTail : []
  };
}

function parseXmlSafely(xmlText) {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(xmlText || "<xml></xml>", "application/xml");
  if (parsed.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Invalid XML: the scratch candidate could not be parsed.");
  }
  return Blockly.utils.xml.textToDom(xmlText || "<xml></xml>");
}

function cloneSnapshot(snapshot) {
  return structuredClone(snapshot);
}

export function createWorkbenchScratchController({
  hostElement,
  xmlTextareaElement,
  onChange = () => {}
}) {
  if (!hostElement) {
    throw new Error("Scratch Blockly host element is required.");
  }
  if (!xmlTextareaElement) {
    throw new Error("Scratch XML textarea element is required.");
  }

  const scratchApp = createApp();
  scratchApp.state.currentModeView = GAME_VIEW_MODES.GUIDED_LEVELS;
  scratchApp.syncUi = () => {};
  scratchApp.blocklyWorkspace = Blockly.inject(hostElement, {
    toolbox: buildToolboxXml(getFullToolboxBlockTypes()),
    scrollbars: true,
    trashcan: true
  });

  const snapshot = {
    level: null,
    targetKind: null,
    xmlText: "",
    xmlError: null,
    loadedFrom: "starter",
    scratchRun: null
  };

  let suppressWorkspaceSync = false;

  function emitChange() {
    onChange(cloneSnapshot(snapshot));
  }

  function syncTextareaFromWorkspace() {
    if (!scratchApp.blocklyWorkspace) {
      return;
    }
    const xmlText = getWorkspaceXmlText(scratchApp);
    snapshot.xmlText = xmlText;
    xmlTextareaElement.value = xmlText;
  }

  function clearRunState() {
    snapshot.scratchRun = null;
  }

  function loadXml(xmlText, loadedFrom = "editor") {
    if (!scratchApp.blocklyWorkspace) {
      snapshot.xmlError = "Scratch workspace is not ready.";
      emitChange();
      return { ok: false, error: snapshot.xmlError };
    }

    try {
      parseXmlSafely(xmlText || "<xml></xml>");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      snapshot.xmlError = message;
      emitChange();
      return { ok: false, error: message };
    }

    suppressWorkspaceSync = true;
    try {
      loadWorkspaceXml(scratchApp, xmlText || "");
      syncTextareaFromWorkspace();
      snapshot.xmlError = null;
      snapshot.loadedFrom = loadedFrom;
      clearRunState();
    } finally {
      suppressWorkspaceSync = false;
    }
    emitChange();
    return { ok: true };
  }

  scratchApp.blocklyWorkspace.addChangeListener((event) => {
    if (event?.isUiEvent || suppressWorkspaceSync) {
      return;
    }
    syncTextareaFromWorkspace();
    snapshot.xmlError = null;
    clearRunState();
    emitChange();
  });

  function setLevel(level, { targetKind = null } = {}) {
    snapshot.level = level ? structuredClone(level) : null;
    snapshot.targetKind = level?.project?.id ? targetKind : "reference";
    scratchApp.state.levels = level ? [structuredClone(level)] : [];
    scratchApp.state.currentLevelId = level?.id || null;
    setBlocklyToolboxForCurrentMode(scratchApp);
    loadXml(level?.initialBlocklyXml || "", "starter");
  }

  function setTargetKind(nextTargetKind) {
    snapshot.targetKind = nextTargetKind || null;
    clearRunState();
    emitChange();
  }

  function loadCanonicalXml(xmlText) {
    return loadXml(xmlText, "canonical");
  }

  function applyEditorXml() {
    return loadXml(xmlTextareaElement.value, "editor");
  }

  function getXmlText() {
    return getWorkspaceXmlText(scratchApp);
  }

  function runScratch() {
    if (!snapshot.level) {
      snapshot.xmlError = "Select a level before running scratch XML.";
      emitChange();
      return null;
    }
    const randomFn = snapshot.level.project?.id === "strategy-brain" ? createSeededRandom("0") : null;
    const runtime = simulateLevelXml(snapshot.level, getWorkspaceXmlText(scratchApp), {
      randomFn
    });
    snapshot.scratchRun = normalizeSimulationResult(runtime);
    snapshot.xmlError = null;
    emitChange();
    return snapshot.scratchRun;
  }

  function resetToStarter() {
    return loadXml(snapshot.level?.initialBlocklyXml || "", "starter");
  }

  function destroy() {
    scratchApp.blocklyWorkspace?.dispose?.();
    scratchApp.blocklyWorkspace = null;
  }

  return {
    setLevel,
    setTargetKind,
    loadCanonicalXml,
    applyEditorXml,
    runScratch,
    resetToStarter,
    getXmlText,
    getSnapshot: () => cloneSnapshot(snapshot),
    destroy
  };
}
