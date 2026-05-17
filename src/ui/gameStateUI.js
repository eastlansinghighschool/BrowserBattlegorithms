import { GAME_VIEW_MODES, LEVEL_RESULT } from "../config/constants.js";
import { getCurrentLevel, getNextAvailableLevelId } from "../core/levels.js";

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
