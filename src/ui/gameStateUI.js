import { GAME_VIEW_MODES, LEVEL_RESULT } from "../config/constants.js";
import { getCurrentLevel, getNextAvailableLevelId } from "../core/levels.js";

function getPauseButtonIcon(state) {
  if (state.pauseRequested) {
    return `
      <svg class="app-inline-icon-button-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 5h3v14H8z" />
        <path d="M13 5h3v14h-3z" />
      </svg>
    `;
  }

  if (state.gameplayPaused) {
    return `
      <svg class="app-inline-icon-button-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 5v14l10-7z" />
      </svg>
    `;
  }

  return `
    <svg class="app-inline-icon-button-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 5v14" />
      <path d="M16 5v14" />
    </svg>
  `;
}

function setPauseButtonAccessibility(button, state) {
  if (state.pauseRequested) {
    button.setAttribute("aria-label", "Pausing after this runner (P)");
    button.setAttribute("title", "Pausing after this runner (P)");
    button.setAttribute("aria-pressed", "false");
    button.disabled = true;
    return;
  }

  if (state.gameplayPaused) {
    button.setAttribute("aria-label", "Resume game (P)");
    button.setAttribute("title", "Resume game (P)");
    button.setAttribute("aria-pressed", "true");
    button.disabled = false;
    return;
  }

  button.setAttribute("aria-label", "Pause game (P)");
  button.setAttribute("title", "Pause game (P)");
  button.setAttribute("aria-pressed", "false");
  button.disabled = false;
}

export function setPauseButtonState(app) {
  const button = document.getElementById("pauseResumeButton");
  if (!button) {
    return;
  }

  if (
    app.state.showModePicker ||
    app.state.activeTutorial ||
    app.state.mainGameState !== "RUNNING" ||
    app.state.currentTurnState === "GAME_OVER" ||
    app.state.activeLevelResult === LEVEL_RESULT.PASSED ||
    app.state.activeLevelResult === LEVEL_RESULT.FAILED
  ) {
    button.hidden = true;
    button.style.display = "none";
    return;
  }

  button.hidden = false;
  button.style.display = "";
  button.innerHTML = getPauseButtonIcon(app.state);
  setPauseButtonAccessibility(button, app.state);
}

export function setPlayButtonState(app) {
  const button = document.getElementById("playResetButton");
  const tutorialButton = document.getElementById("showTutorialButton");
  const nextLevelButton = document.getElementById("nextLevelButton");
  if (!button) {
    return;
  }

  if (app.state.showModePicker) {
    button.style.display = "none";
    if (tutorialButton) {
      tutorialButton.style.display = "none";
    }
    if (nextLevelButton) {
      nextLevelButton.style.display = "none";
    }
    return;
  }

  button.style.display = "";
  if (tutorialButton) {
    tutorialButton.style.display = "none";
  }
  if (nextLevelButton) {
    nextLevelButton.style.display = "none";
  }

  if (app.state.currentModeView === GAME_VIEW_MODES.GUIDED_LEVELS) {
    const currentLevel = getCurrentLevel(app);
    const predictionNeedsChoice =
      currentLevel?.levelKind === "prediction" &&
      Boolean(currentLevel.prediction) &&
      !app.state.predictionForCurrentLevel?.choiceId &&
      app.state.mainGameState !== "RUNNING" &&
      app.state.activeLevelResult === LEVEL_RESULT.NONE;
    if (tutorialButton) {
      tutorialButton.style.display = "";
    }
    if (app.state.mainGameState === "RUNNING") {
      button.textContent = "Reset Level";
    } else if (app.state.activeLevelResult === LEVEL_RESULT.PASSED) {
      button.textContent = "Reset Level";
      if (nextLevelButton && getNextAvailableLevelId(app)) {
        nextLevelButton.style.display = "";
      }
    } else if (app.state.activeLevelResult === LEVEL_RESULT.FAILED) {
      button.textContent = "Reset Level";
    } else {
      button.textContent = "Start Level";
    }
    button.disabled = predictionNeedsChoice;
    if (predictionNeedsChoice) {
      button.setAttribute("aria-disabled", "true");
      const affordanceId = currentLevel ? `prediction-start-affordance-${currentLevel.id}` : "";
      if (affordanceId) {
        button.setAttribute("aria-describedby", affordanceId);
      }
    } else {
      button.removeAttribute("aria-disabled");
      button.removeAttribute("aria-describedby");
    }
    return;
  }

  if (app.state.mainGameState === "RUNNING") {
    button.textContent = "Reset";
  } else if (app.state.mainGameState === "GAME_OVER") {
    button.textContent = "Reset Game";
  } else {
    button.textContent = "Play";
  }
}
