import { CELL_SIZE, COLS, ROWS } from "../config/constants.js";
import { getLevelGoalCell } from "../core/levels.js";
import { getTeamFlagHome } from "../core/teams.js";
import { FREE_PLAY_MODES } from "../config/gameModes.js";

let pinnedCell = null;
let hoveredCell = null;
let dismissedCell = null;
let lastMousePos = null;
let lastAnnouncedText = "";
let a11yDebounceTimer = null;

/**
 * Returns a team side label ('Ally', 'Enemy', 'Team 1', 'Team 2')
 * depending on local viewport perspective.
 */
export function getSideLabel(state, teamId) {
  const isPvP = state?.freePlayMode === FREE_PLAY_MODES.PLAYER_VS_PLAYER;
  if (isPvP) {
    return `Team ${teamId}`;
  }
  return Number(teamId) === 1 ? "Ally" : "Enemy";
}

/**
 * Returns a list of lines representing the cell contents at (col, row).
 * Returns null if (col, row) is out of bounds.
 */
export function buildInspectorLines(state, app, col, row) {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) {
    return null;
  }

  const lines = [`Cell: (${col}, ${row})`];

  // 2. Level goal
  if (app) {
    const goalCell = getLevelGoalCell(app);
    if (goalCell && goalCell.x === col && goalCell.y === row) {
      lines.push("Level goal");
    }
  }

  // 3. Flag base markers
  if (state?.teams) {
    for (const teamId of [1, 2]) {
      const flagHome = getTeamFlagHome(state, teamId);
      if (flagHome && flagHome.x === col && flagHome.y === row) {
        lines.push(`Team ${teamId} flag base`);
      }
    }
  }

  // 4. Flag markers (including carrier info)
  if (state?.gameFlags) {
    for (const teamId of [1, 2]) {
      const flag = state.gameFlags[teamId];
      if (flag && flag.gridX === col && flag.gridY === row) {
        lines.push(`Team ${teamId} flag`);
        if (flag.carriedByRunnerId && state.allRunners) {
          const carrier = state.allRunners.find(r => r.id === flag.carriedByRunnerId);
          if (carrier) {
            const side = getSideLabel(state, carrier.team);
            lines.push(`  carried by ${side.toLowerCase()} runner`);
          }
        }
      }
    }
  }

  // 5. Barrier marker
  if (state?.barriers) {
    for (const barrier of state.barriers) {
      if (barrier.gridX === col && barrier.gridY === row) {
        if (barrier.ownerRunnerId && state.allRunners) {
          const ownerRunner = state.allRunners.find(r => r.id === barrier.ownerRunnerId);
          if (ownerRunner) {
            lines.push(`Barrier (placed by Team ${ownerRunner.team})`);
          } else {
            lines.push("Barrier");
          }
        } else {
          lines.push("Barrier");
        }
      }
    }
  }

  // 6. Runners on the cell
  if (state?.allRunners) {
    for (const runner of state.allRunners) {
      if (runner.gridX === col && runner.gridY === row) {
        const side = getSideLabel(state, runner.team);
        if (runner.isHumanControlled) {
          lines.push(`${side} human player`);
        } else if (runner.isNPC) {
          lines.push(`${side} NPC runner`);
        } else {
          if (typeof runner.allyIndex === "number" && Number.isFinite(runner.allyIndex)) {
            lines.push(`${side} runner #${runner.allyIndex}`);
          } else {
            lines.push(`${side} runner`);
          }
        }

        if (runner.isFrozen) {
          lines.push(`  Frozen (${runner.frozenTurnsRemaining} turns remaining)`);
        }

        if (runner.hasEnemyFlag) {
          lines.push("  Carrying flag");
        }

        if (typeof runner.canJump === "boolean") {
          lines.push(`  Jump: ${runner.canJump ? "available" : "used this round"}`);
        }

        if (typeof runner.canPlaceBarrier === "boolean") {
          const barrierAvailable = runner.canPlaceBarrier && !runner.activeBarrierId;
          lines.push(`  Barrier: ${barrierAvailable ? "available" : "used this round"}`);
        }
      }
    }
  }

  return lines;
}

/**
 * Initializes the DOM-based cell inspector tooltip overlay.
 */
export function initCellInspectorOverlay(app) {
  let tooltipEl = document.getElementById("cell-inspector-tooltip");
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "cell-inspector-tooltip";
    tooltipEl.setAttribute("role", "tooltip");
    tooltipEl.classList.add("cell-inspector-tooltip");
    tooltipEl.hidden = true;
    document.body.appendChild(tooltipEl);
  }

  let mirrorEl = document.getElementById("cell-inspector-a11y-mirror");
  if (!mirrorEl) {
    mirrorEl = document.createElement("div");
    mirrorEl.id = "cell-inspector-a11y-mirror";
    mirrorEl.setAttribute("aria-live", "polite");
    mirrorEl.setAttribute("aria-atomic", "true");
    mirrorEl.classList.add("sr-only");
    document.body.appendChild(mirrorEl);
  }

  const container = document.getElementById("canvas-container");
  if (!container) return;

  function updatePosition() {
    if (tooltipEl.hidden) return;
    const canvasRect = container.getBoundingClientRect();
    const tooltipWidth = tooltipEl.offsetWidth || 180;
    const tooltipHeight = tooltipEl.offsetHeight || 120;
    const offset = 12;

    let posX = 0;
    let posY = 0;

    if (pinnedCell) {
      const cellLeft = canvasRect.left + pinnedCell.col * CELL_SIZE;
      const cellTop = canvasRect.top + pinnedCell.row * CELL_SIZE;

      posX = cellLeft + CELL_SIZE + offset;
      posY = cellTop;

      if (posX + tooltipWidth > window.innerWidth) {
        posX = cellLeft - tooltipWidth - offset;
      }
      if (posY + tooltipHeight > window.innerHeight) {
        posY = window.innerHeight - tooltipHeight - offset;
      }
      if (posY < 0) posY = offset;
    } else if (lastMousePos) {
      posX = lastMousePos.x + offset;
      posY = lastMousePos.y + offset;

      if (posX + tooltipWidth > window.innerWidth) {
        posX = lastMousePos.x - tooltipWidth - offset;
      }
      if (posY + tooltipHeight > window.innerHeight) {
        posY = lastMousePos.y - tooltipHeight - offset;
      }
      if (posX < 0) posX = offset;
      if (posY < 0) posY = offset;
    }

    tooltipEl.style.left = `${posX}px`;
    tooltipEl.style.top = `${posY}px`;
  }

  function announceA11y(text) {
    if (text === lastAnnouncedText) return;
    lastAnnouncedText = text;

    if (a11yDebounceTimer) {
      clearTimeout(a11yDebounceTimer);
    }

    a11yDebounceTimer = setTimeout(() => {
      const m = document.getElementById("cell-inspector-a11y-mirror");
      if (m) m.textContent = text;
    }, 150);
  }

  function clearA11y() {
    lastAnnouncedText = "";
    if (a11yDebounceTimer) {
      clearTimeout(a11yDebounceTimer);
      a11yDebounceTimer = null;
    }
    const m = document.getElementById("cell-inspector-a11y-mirror");
    if (m) m.textContent = "";
  }

  function showTooltip(col, row) {
    const lines = buildInspectorLines(app.state, app, col, row);
    if (!lines || lines.length === 0) {
      hideTooltip();
      return;
    }

    const htmlContent = lines.map(line => {
      if (line.startsWith("  ")) {
        return `<div class="cell-inspector-subline">${line.trim()}</div>`;
      }
      return `<div class="cell-inspector-line">${line}</div>`;
    }).join("");

    if (tooltipEl.innerHTML !== htmlContent || tooltipEl.hidden) {
      tooltipEl.innerHTML = htmlContent;
      tooltipEl.hidden = false;
      announceA11y(lines.join(". "));
    }
    updatePosition();
  }

  function hideTooltip() {
    tooltipEl.hidden = true;
    clearA11y();
  }

  function pinCell(col, row) {
    pinnedCell = { col, row };
    showTooltip(col, row);
  }

  function unpinCell() {
    if (!pinnedCell) {
      return false;
    }
    pinnedCell = null;
    dismissedCell = hoveredCell;
    hideTooltip();
    return true;
  }

  container.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse") {
      lastMousePos = { x: e.clientX, y: e.clientY };
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const col = Math.floor(mouseX / CELL_SIZE);
      const row = Math.floor(mouseY / CELL_SIZE);

      if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
        if (dismissedCell && (dismissedCell.col !== col || dismissedCell.row !== row)) {
          dismissedCell = null;
        }
        hoveredCell = { col, row };
        if (!pinnedCell && (!dismissedCell || dismissedCell.col !== col || dismissedCell.row !== row)) {
          showTooltip(col, row);
        }
      } else {
        hoveredCell = null;
        dismissedCell = null;
        if (!pinnedCell) {
          hideTooltip();
        }
      }
    }
  });

  container.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") {
      hoveredCell = null;
      dismissedCell = null;
      lastMousePos = null;
      if (!pinnedCell) {
        hideTooltip();
      }
    }
  });

  container.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || e.pointerType === "pen") {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const col = Math.floor(clickX / CELL_SIZE);
      const row = Math.floor(clickY / CELL_SIZE);

      if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
        if (pinnedCell && pinnedCell.col === col && pinnedCell.row === row) {
          unpinCell();
        } else {
          pinnedCell = null;
          dismissedCell = null;
          pinCell(col, row);
        }
      }
    }
  });

  const handleReposition = () => {
    updatePosition();
  };
  window.addEventListener("resize", handleReposition);
  window.addEventListener("scroll", handleReposition, { passive: true });

  app.hooks.refreshCellInspector = () => {
    if (pinnedCell) {
      showTooltip(pinnedCell.col, pinnedCell.row);
    } else if (hoveredCell && (!dismissedCell || dismissedCell.col !== hoveredCell.col || dismissedCell.row !== hoveredCell.row)) {
      showTooltip(hoveredCell.col, hoveredCell.row);
    } else if (!tooltipEl.hidden) {
      hideTooltip();
    }
  };

  app.hooks.unpinCellInspector = () => {
    return unpinCell();
  };
}
