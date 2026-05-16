import * as Blockly from "blockly";

const TRACE_CURRENT_CLASS = "bba-trace-current";
const TRACE_TRUE_CLASS = "bba-trace-result-true";
const TRACE_FALSE_CLASS = "bba-trace-result-false";
const TRACE_SELECTED_ACTION_CLASS = "bba-trace-selected-action";
const TRACE_OVERFLOW_CLASS = "bba-trace-overflow-badge";
const TRACE_EMPTY_HINT_CLASS = "bba-trace-empty-hint";
const TRACE_GLYPH_ATTR = "data-bba-trace-glyph";
const TRACE_OVERFLOW_ATTR = "data-bba-trace-overflow";
const TRACE_OVERFLOW_TEXT = "…";
const TRACE_EMPTY_HINT_TEXT = "No action selected this turn — your conditions all evaluated false, or your program has no action blocks.";

function getBlockSvgRoot(block) {
  return block?.getSvgRoot?.() || null;
}

function getWorkspaceShellElement() {
  if (typeof document === "undefined") {
    return null;
  }
  return document.getElementById("blockly-workspace-shell");
}

function getTraceHintNode(createIfMissing = false) {
  const shell = getWorkspaceShellElement();
  if (!shell) {
    return null;
  }
  let hint = shell.querySelector(`.${TRACE_EMPTY_HINT_CLASS}`);
  if (!hint && createIfMissing) {
    hint = document.createElement("div");
    hint.className = TRACE_EMPTY_HINT_CLASS;
    hint.hidden = true;
    hint.setAttribute("role", "status");
    hint.setAttribute("aria-live", "polite");
    shell.appendChild(hint);
  }
  return hint;
}

function showTraceHint() {
  const hint = getTraceHintNode(true);
  if (!hint) {
    return;
  }
  hint.textContent = TRACE_EMPTY_HINT_TEXT;
  hint.hidden = false;
}

function hideTraceHint() {
  const hint = getTraceHintNode(false);
  if (!hint) {
    return;
  }
  hint.hidden = true;
  hint.textContent = "";
}

function removeTraceAdornment(svgRoot, selector) {
  if (!svgRoot) {
    return;
  }
  svgRoot.querySelectorAll(selector).forEach((node) => node.remove());
}

function createOrReplaceTraceAdornment(block, selector, attrs, textValue) {
  const svgRoot = getBlockSvgRoot(block);
  if (!svgRoot) {
    return null;
  }
  removeTraceAdornment(svgRoot, selector);
  const { width = 0 } = block.getHeightWidth?.() || {};
  const group = Blockly.utils.dom.createSvgElement("g", {
    ...attrs,
    transform: `translate(${Math.max(4, width - 24)}, 4)`
  }, svgRoot);
  Blockly.utils.dom.createSvgElement("rect", {
    width: 18,
    height: 18,
    rx: 9,
    ry: 9,
    class: `${attrs.class || ""}-bg`.trim()
  }, group);
  const text = Blockly.utils.dom.createSvgElement("text", {
    x: 9,
    y: 13,
    "text-anchor": "middle",
    class: `${attrs.class || ""}-mark`.trim()
  }, group);
  text.textContent = textValue;
  return group;
}

function getTraceBlock(blockOrWorkspace, blockId) {
  if (!blockOrWorkspace || !blockId) {
    return null;
  }
  const workspace = typeof blockOrWorkspace.getBlockById === "function"
    ? blockOrWorkspace
    : blockOrWorkspace?.workspace || null;
  return workspace?.getBlockById?.(blockId) || null;
}

function getEventBlock(workspace) {
  return workspace?.getBlocksByType?.("battlegorithms_on_each_turn", false)?.[0] || null;
}

export function showTraceEmptyHint(workspace) {
  if (!workspace) {
    return;
  }
  showTraceHint();
}

export function hideTraceEmptyHint(workspace) {
  if (!workspace) {
    return;
  }
  hideTraceHint();
}

export function setTraceOverflowBadge(workspace, isVisible) {
  if (!workspace) {
    return;
  }
  const eventBlock = getEventBlock(workspace);
  const svgRoot = getBlockSvgRoot(eventBlock);
  if (!svgRoot) {
    return;
  }
  svgRoot.classList.toggle(TRACE_OVERFLOW_CLASS, Boolean(isVisible));
  removeTraceAdornment(svgRoot, `[${TRACE_OVERFLOW_ATTR}]`);
  if (!isVisible) {
    return;
  }
  createOrReplaceTraceAdornment(
    eventBlock,
    `[${TRACE_OVERFLOW_ATTR}]`,
    {
      [TRACE_OVERFLOW_ATTR]: "true",
      class: TRACE_OVERFLOW_CLASS
    },
    TRACE_OVERFLOW_TEXT
  );
}

export function applyTraceStep(workspace, step) {
  if (!workspace || !step?.blockId) {
    if (step?.kind === "empty") {
      showTraceHint();
    }
    return;
  }

  const block = getTraceBlock(workspace, step.blockId);
  const svgRoot = getBlockSvgRoot(block);
  if (!block || !svgRoot) {
    return;
  }

  svgRoot.classList.add(TRACE_CURRENT_CLASS);
  svgRoot.classList.remove(TRACE_TRUE_CLASS, TRACE_FALSE_CLASS, TRACE_SELECTED_ACTION_CLASS);
  if (step.kind === "condition" || step.kind === "boolean" || step.kind === "comparison") {
    svgRoot.classList.add(step.result ? TRACE_TRUE_CLASS : TRACE_FALSE_CLASS);
    createOrReplaceTraceAdornment(
      block,
      `[${TRACE_GLYPH_ATTR}]`,
      {
        [TRACE_GLYPH_ATTR]: "true",
        class: step.result ? TRACE_TRUE_CLASS : TRACE_FALSE_CLASS
      },
      step.result ? "✓" : "✕"
    );
  } else if (step.kind === "action") {
    svgRoot.classList.add(TRACE_SELECTED_ACTION_CLASS);
  } else if (step.kind === "empty") {
    showTraceHint();
    return;
  }

  workspace.highlightBlock?.(step.blockId);
}

export function clearTraceStepCurrent(workspace, step) {
  if (!workspace) {
    return;
  }
  if (step?.kind === "empty") {
    hideTraceHint();
    return;
  }
  const block = getTraceBlock(workspace, step?.blockId);
  const svgRoot = getBlockSvgRoot(block);
  if (!svgRoot) {
    workspace.highlightBlock?.(null);
    return;
  }
  svgRoot.classList.remove(TRACE_CURRENT_CLASS);
  workspace.highlightBlock?.(null);
}

export function clearAllTraceClasses(workspace) {
  if (!workspace) {
    hideTraceHint();
    return;
  }

  if (typeof workspace.getAllBlocks === "function") {
    for (const block of workspace.getAllBlocks(false)) {
      const svgRoot = getBlockSvgRoot(block);
      if (!svgRoot) {
        continue;
      }
      svgRoot.classList.remove(
        TRACE_CURRENT_CLASS,
        TRACE_TRUE_CLASS,
        TRACE_FALSE_CLASS,
        TRACE_SELECTED_ACTION_CLASS,
        TRACE_OVERFLOW_CLASS
      );
      removeTraceAdornment(svgRoot, `[${TRACE_GLYPH_ATTR}]`);
      removeTraceAdornment(svgRoot, `[${TRACE_OVERFLOW_ATTR}]`);
    }
  }

  workspace.highlightBlock?.(null);
  hideTraceHint();
}

