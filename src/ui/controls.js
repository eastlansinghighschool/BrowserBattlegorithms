import {
  AI_ACTION_TYPES,
  BLOCKLY_TRACE_SPEED_THRESHOLD,
  FREE_PLAY_MODES,
  GAME_VIEW_MODES,
  LEVEL_RESULT,
  MAIN_GAME_STATES,
  P1_KEY_BINDINGS,
  P2_KEY_BINDINGS,
  TURN_STATES
} from "../config/constants.js";
import { enterFreePlay, goToNextLevel, startLevel, resetCurrentLevel, getCurrentLevel } from "../core/levels.js";
import { resetGameToSetup, startGame } from "../core/setup.js";
import { handlePlayerInput } from "../core/turnEngine.js";
import { playSound, setSoundEnabled } from "./sound.js";
import { setBlocklyPanelSize } from "./blocklyLayout.js";
import { dismissProjectStartCallout } from "./projectSignifiers.js";
import {
  decryptPrivateProgramXml,
  encryptPrivateProgramXml,
  parsePrivateProgramFileText,
  serializePrivateProgramFile
} from "../crypto/privateProgramFile.js";

export function getAnimationSpeedFactorFromSliderValue(sliderValue) {
  const numericValue = Number.parseInt(sliderValue, 10);
  let speed = ((numericValue - 1) / 19) * (2.0 - 0.1) + 0.1;
  speed = Math.max(0.05, speed);
  return Number.isFinite(speed) ? speed : 1.0;
}

function getCurrentProgramFileBaseName(app) {
  if (app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS) {
    return app.state.currentLevelId || "guided-level";
  }
  if (app.state.freePlayMode === FREE_PLAY_MODES.PLAYER_VS_PLAYER) {
    return `free-play-team-${app.state.activeBlocklyTeamTab || 1}`;
  }
  return "free-play-player-team";
}

function downloadTextFile(filename, mimeType, content) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function setModalMessage(element, tone, message) {
  if (!element) {
    return;
  }
  element.textContent = message || "";
  element.hidden = !message;
  element.className = message ? `program-modal-message program-modal-message-${tone}` : "program-modal-message";
}

function setExportModalPrivateFieldsVisibility(fieldsElement, checkboxElement) {
  if (!fieldsElement || !checkboxElement) {
    return;
  }
  fieldsElement.hidden = !checkboxElement.checked;
}

export function bindControls(app) {
  const speedSlider = document.getElementById("speedSlider");
  const speedValueDisplay = document.getElementById("speedValue");
  const controlsPanel = document.getElementById("game-controls");
  const instructionsPanel = document.getElementById("instructions");
  const exportWorkspaceButton = document.getElementById("exportWorkspaceButton");
  const exportUsageButton = document.getElementById("exportUsageButton");
  const importWorkspaceButton = document.getElementById("importWorkspaceButton");
  const importWorkspaceInput = document.getElementById("importWorkspaceInput");
  const undoWorkspaceButton = document.getElementById("undoWorkspaceButton");
  const redoWorkspaceButton = document.getElementById("redoWorkspaceButton");
  const programExportModal = document.getElementById("programExportModal");
  const privateExportCheckbox = document.getElementById("privateExportCheckbox");
  const privateExportFields = document.getElementById("privateExportFields");
  const privateExportPassword = document.getElementById("privateExportPassword");
  const privateExportConfirm = document.getElementById("privateExportConfirm");
  const programExportModalMessage = document.getElementById("programExportModalMessage");
  const privateImportModal = document.getElementById("privateImportModal");
  const privateImportModalSummary = document.getElementById("privateImportModalSummary");
  const privateImportPassword = document.getElementById("privateImportPassword");
  const privateImportModalMessage = document.getElementById("privateImportModalMessage");
  const soundToggleButton = document.getElementById("soundToggleButton");
  const blocklyProgramTabs = document.getElementById("blockly-program-tabs");
  const blocklySizeControls = document.getElementById("blockly-size-controls");
  const blocklyRegion = document.getElementById("blockly-region");
  const boardRetryButton = document.getElementById("board-loading-retry");
  const blocklyRetryButton = document.getElementById("blockly-loading-retry");
  let pendingPrivateImportPayload = null;
  let pendingPrivateImportFileName = "";
  if (speedSlider && speedValueDisplay) {
    const updateSpeed = () => {
      const previousSpeed = Number(app.state.animationSpeedFactor);
      app.state.animationSpeedFactor = getAnimationSpeedFactorFromSliderValue(speedSlider.value);
      const value = Number.parseInt(speedSlider.value, 10);
      speedValueDisplay.textContent = value === 10 ? "Normal" : value < 10 ? "Slower" : "Faster";
      if (
        Number.isFinite(previousSpeed) &&
        previousSpeed <= BLOCKLY_TRACE_SPEED_THRESHOLD &&
        app.state.animationSpeedFactor > BLOCKLY_TRACE_SPEED_THRESHOLD &&
        app.state.currentTurnState === TURN_STATES.TRACING_PRE_ACTION
      ) {
        app.hooks.clearBlocklyTracePlayback?.(app);
        app.state.currentTurnState = TURN_STATES.PROCESSING_ACTION;
      }
    };
    speedSlider.addEventListener("input", updateSpeed);
    updateSpeed();
  }

  const closeProgramExportModal = () => {
    if (!programExportModal) {
      return;
    }
    programExportModal.hidden = true;
    programExportModal.setAttribute("aria-hidden", "true");
    setModalMessage(programExportModalMessage, "error", "");
  };

  const openProgramExportModal = () => {
    if (!programExportModal) {
      return;
    }
    programExportModal.hidden = false;
    programExportModal.setAttribute("aria-hidden", "false");
    if (privateExportCheckbox) {
      privateExportCheckbox.checked = false;
    }
    if (privateExportFields) {
      privateExportFields.hidden = true;
    }
    if (privateExportPassword) {
      privateExportPassword.value = "";
    }
    if (privateExportConfirm) {
      privateExportConfirm.value = "";
    }
    setModalMessage(programExportModalMessage, "error", "");
    privateExportCheckbox?.focus();
  };

  const closePrivateImportModal = () => {
    if (!privateImportModal) {
      return;
    }
    privateImportModal.hidden = true;
    privateImportModal.setAttribute("aria-hidden", "true");
    pendingPrivateImportPayload = null;
    pendingPrivateImportFileName = "";
    setModalMessage(privateImportModalMessage, "error", "");
  };

  const openPrivateImportModal = ({ fileName, payload }) => {
    if (!privateImportModal) {
      return;
    }
    pendingPrivateImportPayload = payload;
    pendingPrivateImportFileName = fileName || "private-program.json";
    if (privateImportModalSummary) {
      privateImportModalSummary.textContent = `File: ${pendingPrivateImportFileName}`;
    }
    if (privateImportPassword) {
      privateImportPassword.value = "";
    }
    setModalMessage(privateImportModalMessage, "error", "");
    privateImportModal.hidden = false;
    privateImportModal.setAttribute("aria-hidden", "false");
    privateImportPassword?.focus();
  };

  const exportReadableWorkspaceXml = () => {
    const xmlText = app.hooks.getWorkspaceXmlText?.() || "";
    app.usageTracker?.recordWorkspaceExported?.({
      modeView: app.state.currentModeView,
      levelId: app.state.currentLevelId,
      mapKey: app.state.currentMapKey,
      xmlLength: xmlText.length
    });
    const modeLabel = getCurrentProgramFileBaseName(app);
    downloadTextFile(`${modeLabel}.xml`, "text/xml;charset=utf-8", xmlText);
    app.state.workspaceImportStatus = {
      tone: "success",
      message: "Program XML saved locally."
    };
    app.syncUi();
  };

  const exportPrivateWorkspaceFile = async () => {
    const password = `${privateExportPassword?.value || ""}`.trim();
    const confirmPassword = `${privateExportConfirm?.value || ""}`.trim();
    if (!password) {
      setModalMessage(programExportModalMessage, "error", "Enter a password or PIN to make a private file.");
      return;
    }
    if (password.length < 4) {
      setModalMessage(programExportModalMessage, "error", "Use at least 4 characters so the password is not too easy to guess.");
      return;
    }
    if (password !== confirmPassword) {
      setModalMessage(programExportModalMessage, "error", "Password and confirmation do not match.");
      return;
    }

    const xmlText = app.hooks.getWorkspaceXmlText?.() || "";
    const payload = await encryptPrivateProgramXml({
      xmlText,
      password,
      programLabel: app.hooks.getActiveProgramLabel?.() || "Free Play",
      teamNumber: app.state.freePlayMode === FREE_PLAY_MODES.PLAYER_VS_PLAYER ? app.state.activeBlocklyTeamTab : null
    });
    const modeLabel = getCurrentProgramFileBaseName(app);
    downloadTextFile(
      `${modeLabel}.private.json`,
      "application/json;charset=utf-8",
      serializePrivateProgramFile(payload)
    );
    app.state.workspaceImportStatus = {
      tone: "success",
      message: "Private program file saved locally."
    };
    app.syncUi();
  };

  const importNormalWorkspaceXml = async (xmlText) => {
    const result = app.hooks.importWorkspaceXml?.(xmlText);
    app.state.workspaceImportStatus = result?.ok
      ? { tone: "success", message: "Program imported successfully." }
      : { tone: "error", message: `Import failed. ${result?.error || "Please check the XML and try again."}` };
    app.syncUi();
  };

  const importPrivateWorkspaceFile = async () => {
    if (!pendingPrivateImportPayload) {
      return;
    }
    const password = `${privateImportPassword?.value || ""}`;
    try {
      const xmlText = await decryptPrivateProgramXml(pendingPrivateImportPayload, password);
      const result = app.hooks.importWorkspaceXml?.(xmlText);
      if (!result?.ok) {
        setModalMessage(privateImportModalMessage, "error", `Import failed. ${result?.error || "Please check the XML and try again."}`);
        return;
      }
      app.state.workspaceImportStatus = {
        tone: "success",
        message: "Private program imported."
      };
      closePrivateImportModal();
      app.syncUi();
    } catch (error) {
      setModalMessage(
        privateImportModalMessage,
        "error",
        `Import failed. ${error instanceof Error ? error.message : "Please check the password or file and try again."}`
      );
    }
  };

  app.hooks.updateControlsVisibility = () => {
    if (instructionsPanel) {
      instructionsPanel.style.display = app.state.showModePicker ? "none" : "";
    }
    if (controlsPanel) {
      controlsPanel.style.display = app.state.showModePicker ? "none" : "";
    }
  };

  const playResetButton = document.getElementById("playResetButton");
  const showTutorialButton = document.getElementById("showTutorialButton");
  const nextLevelButton = document.getElementById("nextLevelButton");
  if (playResetButton) {
    playResetButton.addEventListener("click", () => {
      if (app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS) {
      if (
        app.state.mainGameState === MAIN_GAME_STATES.RUNNING ||
        app.state.activeLevelResult === LEVEL_RESULT.PASSED ||
        app.state.activeLevelResult === LEVEL_RESULT.FAILED
      ) {
        app.hooks.setBlocklyEditable?.(true);
        resetCurrentLevel(app);
      } else {
        startLevel(app, app.state.currentLevelId);
      }
      } else if (app.state.mainGameState === MAIN_GAME_STATES.SETUP || app.state.mainGameState === MAIN_GAME_STATES.GAME_OVER) {
        app.hooks.setBlocklyEditable?.(false);
        startGame(app);
      } else if (app.state.mainGameState === MAIN_GAME_STATES.RUNNING) {
        app.hooks.setBlocklyEditable?.(true);
        resetGameToSetup(app);
      } else {
        app.hooks.setBlocklyEditable?.(true);
        enterFreePlay(app);
      }
      app.syncUi();
    });
  }

  if (nextLevelButton) {
    nextLevelButton.addEventListener("click", () => {
      goToNextLevel(app);
      app.syncUi();
    });
  }

  if (showTutorialButton) {
    showTutorialButton.addEventListener("click", () => {
      app.hooks.startCurrentLevelTutorial?.(true);
    });
  }

  if (exportWorkspaceButton) {
    exportWorkspaceButton.addEventListener("click", () => {
      openProgramExportModal();
    });
  }

  if (undoWorkspaceButton) {
    undoWorkspaceButton.addEventListener("click", () => {
      if (app.hooks.undoBlocklyWorkspace?.()) {
        app.syncUi();
      }
    });
  }

  if (redoWorkspaceButton) {
    redoWorkspaceButton.addEventListener("click", () => {
      if (app.hooks.redoBlocklyWorkspace?.()) {
        app.syncUi();
      }
    });
  }

  if (exportUsageButton) {
    exportUsageButton.addEventListener("click", async () => {
      const studentName = window.prompt("Enter the student name for this usage file:", "");
      if (studentName === null) {
        app.state.usageExportStatus = {
          tone: "error",
          message: "Usage export cancelled."
        };
        app.syncUi();
        return;
      }

      app.state.usageExportStatus = {
        tone: "success",
        message: "Preparing usage file..."
      };
      app.syncUi();

      const result = await app.usageTracker?.exportUsageFile?.(studentName);
      if (!result?.ok) {
        app.state.usageExportStatus = {
          tone: "error",
          message: `Usage export failed. ${result?.error || "Please try again."}`
        };
        app.syncUi();
        return;
      }

      const blob = new Blob([JSON.stringify(result.payload, null, 2)], { type: "application/json;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = result.filename || "usage.json";
      link.click();
      URL.revokeObjectURL(link.href);

      app.state.usageExportStatus = {
        tone: "success",
        message: "Usage file saved locally. Share it with your teacher."
      };
      app.syncUi();
    });
  }

  if (importWorkspaceButton && importWorkspaceInput) {
    importWorkspaceButton.addEventListener("click", () => {
      importWorkspaceInput.click();
    });
    importWorkspaceInput.addEventListener("change", async () => {
      const file = importWorkspaceInput.files?.[0];
      if (!file) {
        return;
      }
      const fileText = await file.text();
      const trimmedText = fileText.trimStart();
      if (trimmedText.startsWith("<")) {
        await importNormalWorkspaceXml(fileText);
        importWorkspaceInput.value = "";
        return;
      }

      try {
        const payload = parsePrivateProgramFileText(fileText);
        openPrivateImportModal({ fileName: file.name, payload });
      } catch (error) {
        app.state.workspaceImportStatus = {
          tone: "error",
          message: `Import failed. ${error instanceof Error ? error.message : "Please check the file and try again."}`
        };
        app.syncUi();
      }
      importWorkspaceInput.value = "";
    });
  }

  if (privateExportCheckbox && privateExportFields) {
    privateExportCheckbox.addEventListener("change", () => {
      setExportModalPrivateFieldsVisibility(privateExportFields, privateExportCheckbox);
      setModalMessage(programExportModalMessage, "error", "");
    });
  }

  if (programExportModal) {
    programExportModal.addEventListener("click", async (event) => {
      const action = event.target.closest("[data-program-modal-action]")?.dataset.programModalAction;
      if (!action) {
        return;
      }
      if (action === "cancel") {
        closeProgramExportModal();
        return;
      }
      if (action === "confirm") {
        try {
          if (privateExportCheckbox?.checked) {
            await exportPrivateWorkspaceFile();
          } else {
            exportReadableWorkspaceXml();
          }
          closeProgramExportModal();
        } catch (error) {
          setModalMessage(
            programExportModalMessage,
            "error",
            `Export failed. ${error instanceof Error ? error.message : "Please try again."}`
          );
        }
      }
    });
  }

  if (privateImportModal) {
    privateImportModal.addEventListener("click", async (event) => {
      const action = event.target.closest("[data-private-import-action]")?.dataset.privateImportAction;
      if (!action) {
        return;
      }
      if (action === "cancel") {
        closePrivateImportModal();
        return;
      }
      if (action === "confirm") {
        await importPrivateWorkspaceFile();
      }
    });
  }

  if (blocklyProgramTabs) {
    blocklyProgramTabs.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-blockly-team-tab]");
      if (!target) {
        return;
      }
      app.hooks.switchActiveBlocklyTeamTab?.(Number(target.dataset.blocklyTeamTab));
      app.syncUi();
    });
  }

  if (blocklyRegion) {
    blocklyRegion.addEventListener("click", (event) => {
      const target = event.target.closest("[data-project-callout-action]");
      if (!target) {
        return;
      }
      if (target.dataset.projectCalloutAction === "dismiss") {
        dismissProjectStartCallout(getCurrentLevel(app));
        app.syncUi();
      }
    });
  }

  if (soundToggleButton) {
    const syncSoundButton = () => {
      soundToggleButton.textContent = `Sound: ${app.state.soundEnabled ? "On" : "Off"}`;
    };
    soundToggleButton.addEventListener("click", () => {
      setSoundEnabled(app.state, !app.state.soundEnabled);
      syncSoundButton();
      playSound(app.state, "flag-pickup");
    });
    syncSoundButton();
  }

  if (blocklySizeControls) {
    const syncBlocklySizeControls = () => {
      const selectedSize = app.state.blocklyPanelSize || "standard";
      [...blocklySizeControls.querySelectorAll("button[data-blockly-size]")].forEach((button) => {
        button.disabled = button.dataset.blocklySize === selectedSize;
      });
    };

    blocklySizeControls.addEventListener("click", (event) => {
      const target = event.target.closest("button[data-blockly-size]");
      if (!target) {
        return;
      }
      setBlocklyPanelSize(app, target.dataset.blocklySize);
      syncBlocklySizeControls();
    });

    app.hooks.syncBlocklySizeControls = syncBlocklySizeControls;
    syncBlocklySizeControls();
  }

  if (boardRetryButton) {
    boardRetryButton.addEventListener("click", () => {
      app.hooks.retryBoardLoad?.();
    });
  }

  if (blocklyRetryButton) {
    blocklyRetryButton.addEventListener("click", () => {
      app.hooks.retryEditorLoad?.();
    });
  }
}

export function handleKeyInput(app, rawKey) {
  const state = app.state;
  if (state.activeTutorial) {
    return false;
  }
  if (state.mainGameState !== MAIN_GAME_STATES.RUNNING || state.currentTurnState === "GAME_OVER") {
    return false;
  }

  const currentPlayer = state.allRunners[state.activeRunnerIndex];
  if (!currentPlayer || !currentPlayer.isHumanControlled || currentPlayer.isMoving || currentPlayer.isBouncing || state.currentTurnState !== "AWAITING_INPUT") {
    return false;
  }

  const key = `${rawKey || ""}`.toLowerCase();
  let actionData = {};
  let validKeyPress = false;

  if (currentPlayer.team === 1) {
    if (key === P1_KEY_BINDINGS.UP) { actionData = { type: "MOVE", dy: -1 }; validKeyPress = true; }
    else if (key === P1_KEY_BINDINGS.DOWN) { actionData = { type: "MOVE", dy: 1 }; validKeyPress = true; }
    else if (key === P1_KEY_BINDINGS.LEFT) { actionData = { type: "MOVE", dx: -1 }; validKeyPress = true; }
    else if (key === P1_KEY_BINDINGS.RIGHT) { actionData = { type: "MOVE", dx: 1 }; validKeyPress = true; }
    else if (key === P1_KEY_BINDINGS.JUMP) { actionData = { type: AI_ACTION_TYPES.JUMP_FORWARD }; validKeyPress = true; }
    else if (key === P1_KEY_BINDINGS.PLACE_BARRIER) { actionData = { type: AI_ACTION_TYPES.PLACE_BARRIER_FORWARD }; validKeyPress = true; }
    else if (key === P1_KEY_BINDINGS.STAY_STILL) { actionData = { type: AI_ACTION_TYPES.STAY_STILL }; validKeyPress = true; }
  } else if (currentPlayer.team === 2) {
    if (key === P2_KEY_BINDINGS.UP) { actionData = { type: "MOVE", dy: -1 }; validKeyPress = true; }
    else if (key === P2_KEY_BINDINGS.DOWN) { actionData = { type: "MOVE", dy: 1 }; validKeyPress = true; }
    else if (key === P2_KEY_BINDINGS.LEFT) { actionData = { type: "MOVE", dx: -1 }; validKeyPress = true; }
    else if (rawKey === P2_KEY_BINDINGS.RIGHT) { actionData = { type: "MOVE", dx: 1 }; validKeyPress = true; }
    else if (key === P2_KEY_BINDINGS.JUMP) { actionData = { type: AI_ACTION_TYPES.JUMP_FORWARD }; validKeyPress = true; }
    else if (key === P2_KEY_BINDINGS.PLACE_BARRIER) { actionData = { type: AI_ACTION_TYPES.PLACE_BARRIER_FORWARD }; validKeyPress = true; }
    else if (rawKey === P2_KEY_BINDINGS.STAY_STILL) { actionData = { type: AI_ACTION_TYPES.STAY_STILL }; validKeyPress = true; }
  }

  if (validKeyPress) {
    handlePlayerInput(app, currentPlayer, actionData);
    return true;
  }
  return false;
}
