import test from "node:test";
import assert from "node:assert/strict";
import * as Blockly from "blockly";
import { GAME_VIEW_MODES } from "../../src/config/constants.js";
import {
  hashStarterXml,
  normalizeStarterXmlForHashing,
  getStoredWorkspaceXmlText,
  getWorkspaceXmlText,
  saveWorkspaceToLocalStorage,
  resetWorkspaceToCurrentStarter,
  _clearGuidedInMemoryWorkspacesForTesting,
  DISPLACED_WORKSPACE_STORAGE_PREFIX,
  DISPLACED_WORKSPACE_INDEX_KEY,
  MAX_DISPLACED_WORKSPACES,
  DISPLACED_WORKSPACE_NOTICE_TEXT,
  DISPLACED_WORKSPACE_RESTORE_BUTTON_LABEL,
  DISPLACED_WORKSPACE_PRESERVATION_FAILURE_TEXT,
  DISPLACED_WORKSPACE_RESTORE_FAILURE_TEXT,
  getDisplacedWorkspaceIndex,
  getDisplacedWorkspace,
  saveDisplacedWorkspace,
  restoreDisplacedWorkspace,
  _clearPreservationBlockedLevelsForTesting
} from "../../src/ai/blockly/workspace.js";
import { setStorageForTesting } from "../../src/platform/safeStorage.js";
import { registerBattleBlocklyBlocks } from "../../src/ai/blockly/blocks.js";
import { getLevelDefinitions } from "../../src/config/levels/index.js";

// ─── In-memory localStorage shim ─────────────────────────────────────────────

function makeLocalStorageShim() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    get size() {
      return store.size;
    },
    _store: store
  };
}

// ─── App mock builder for guided non-project levels ──────────────────────────

function makeGuidedApp(levelId, starterXml, starterXmlVersion, isProject = false) {
  const level = {
    id: levelId,
    initialBlocklyXml: starterXml,
    starterXmlVersion,
    project: isProject ? { id: "proj-1" } : null
  };
  return {
    state: {
      currentModeView: GAME_VIEW_MODES.GUIDED_LEVELS,
      currentLevelId: levelId,
      levels: [level],
      freePlayPrograms: {}
    },
    blocklyWorkspace: null
  };
}

// ─── normalizeStarterXmlForHashing ──────────────────────────────────────────

test("normalizeStarterXmlForHashing strips x and y attributes", () => {
  const xml = `<xml><block type="foo" x="24" y="48"></block></xml>`;
  const normalized = normalizeStarterXmlForHashing(xml);
  assert.ok(!normalized.includes('x="'), "should remove x attribute");
  assert.ok(!normalized.includes('y="'), "should remove y attribute");
  assert.ok(normalized.includes('type="foo"'), "should preserve type attribute");
});

test("normalizeStarterXmlForHashing collapses whitespace", () => {
  const xml = `<xml>\n  <block\n    type="foo"\n  ></block>\n</xml>`;
  const normalized = normalizeStarterXmlForHashing(xml);
  assert.ok(!normalized.includes("\n"), "should remove newlines");
  assert.ok(!normalized.includes("  "), "should collapse multiple spaces");
});

test("normalizeStarterXmlForHashing trims leading and trailing whitespace", () => {
  const xml = "   <xml></xml>   ";
  assert.equal(normalizeStarterXmlForHashing(xml), "<xml></xml>");
});

test("normalizeStarterXmlForHashing handles null", () => {
  assert.equal(normalizeStarterXmlForHashing(null), "");
});

test("normalizeStarterXmlForHashing handles undefined", () => {
  assert.equal(normalizeStarterXmlForHashing(undefined), "");
});

test("normalizeStarterXmlForHashing handles empty string", () => {
  assert.equal(normalizeStarterXmlForHashing(""), "");
});

// ─── hashStarterXml ──────────────────────────────────────────────────────────

test("hashStarterXml returns exactly 8 lowercase hex characters", () => {
  const digest = hashStarterXml('<xml><block type="battlegorithms_on_each_turn"></block></xml>');
  assert.match(digest, /^[0-9a-f]{8}$/, "digest should be 8 lowercase hex chars");
});

test("hashStarterXml returns 8 hex chars for empty string", () => {
  const digest = hashStarterXml("");
  assert.match(digest, /^[0-9a-f]{8}$/, "empty string digest should be 8 lowercase hex chars");
});

test("hashStarterXml returns 8 hex chars for null", () => {
  const digest = hashStarterXml(null);
  assert.match(digest, /^[0-9a-f]{8}$/, "null digest should be 8 lowercase hex chars");
});

test("hashStarterXml returns 8 hex chars for undefined", () => {
  const digest = hashStarterXml(undefined);
  assert.match(digest, /^[0-9a-f]{8}$/, "undefined digest should be 8 lowercase hex chars");
});

test("hashStarterXml is deterministic: same input always produces same output", () => {
  const xml = '<xml><block type="battlegorithms_on_each_turn"></block></xml>';
  assert.equal(hashStarterXml(xml), hashStarterXml(xml));
});

test("hashStarterXml is stable under whitespace-only differences", () => {
  const xmlA = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="battlegorithms_on_each_turn">
        <next>
          <block type="battlegorithms_move_forward"></block>
        </next>
      </block>
    </xml>
  `;
  const xmlB = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn"><next><block type="battlegorithms_move_forward"></block></next></block></xml>`;
  assert.equal(hashStarterXml(xmlA), hashStarterXml(xmlB), "whitespace-only difference should yield same hash");
});

test("hashStarterXml is stable under x/y attribute differences", () => {
  const xmlA = `<xml><block type="battlegorithms_on_each_turn" x="24" y="48"></block></xml>`;
  const xmlB = `<xml><block type="battlegorithms_on_each_turn" x="360" y="120"></block></xml>`;
  assert.equal(hashStarterXml(xmlA), hashStarterXml(xmlB), "position attribute changes should yield same hash");
});

test("hashStarterXml produces different digests for different block types", () => {
  const xmlA = `<xml><block type="battlegorithms_move_forward"></block></xml>`;
  const xmlB = `<xml><block type="battlegorithms_stay_still"></block></xml>`;
  assert.notEqual(hashStarterXml(xmlA), hashStarterXml(xmlB), "different block types should yield different hashes");
});

test("hashStarterXml produces different digests for different field values", () => {
  const xmlA = `<xml><block type="battlegorithms_on_each_turn"><next><block type="battlegorithms_move_toward"><field name="TARGET">ENEMY_FLAG</field></block></next></block></xml>`;
  const xmlB = `<xml><block type="battlegorithms_on_each_turn"><next><block type="battlegorithms_move_toward"><field name="TARGET">MY_BASE</field></block></next></block></xml>`;
  assert.notEqual(hashStarterXml(xmlA), hashStarterXml(xmlB), "different field values should yield different hashes");
});

test("hashStarterXml produces different digests for different <next> nesting", () => {
  const xmlWithNext = `<xml><block type="battlegorithms_on_each_turn"><next><block type="battlegorithms_move_forward"></block></next></block></xml>`;
  const xmlWithoutNext = `<xml><block type="battlegorithms_on_each_turn"></block></xml>`;
  assert.notEqual(hashStarterXml(xmlWithNext), hashStarterXml(xmlWithoutNext), "different nesting should yield different hashes");
});

// ─── starterXmlVersion on level definitions ──────────────────────────────────

test("every guided level definition with initialBlocklyXml has a non-empty starterXmlVersion", () => {
  const levels = getLevelDefinitions();
  const levelsWithStarter = levels.filter((level) => level.initialBlocklyXml);
  assert.ok(levelsWithStarter.length > 0, "at least one level should have initialBlocklyXml");
  for (const level of levelsWithStarter) {
    assert.ok(
      typeof level.starterXmlVersion === "string" && /^[0-9a-f]{8}$/.test(level.starterXmlVersion),
      `level "${level.id}" should have an 8-char hex starterXmlVersion, got: ${JSON.stringify(level.starterXmlVersion)}`
    );
  }
});

test("level definitions without initialBlocklyXml have starterXmlVersion null", () => {
  const levels = getLevelDefinitions();
  const levelsWithoutStarter = levels.filter((level) => !level.initialBlocklyXml);
  for (const level of levelsWithoutStarter) {
    assert.equal(
      level.starterXmlVersion,
      null,
      `level "${level.id}" has no starter so starterXmlVersion should be null`
    );
  }
});

// ─── getStoredWorkspaceXmlText — version logic ───────────────────────────────

const STORED_XML = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_stay_still"></block></xml>';
const STARTER_XML = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_move_forward"></block></xml>';
const LEVEL_ID = "test-level-unit-45";
const WORKSPACE_KEY = `bba:guided-workspace:${LEVEL_ID}`;
const VERSION_KEY = `bba:guided-workspace-version:${LEVEL_ID}`;
const CURRENT_VERSION = "abc12345";

function withWindowMock(shim, fn) {
  const originalWindow = globalThis.window;
  globalThis.window = { localStorage: shim };
  setStorageForTesting(undefined);
  try {
    return fn();
  } finally {
    if (typeof originalWindow === "undefined") {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
    setStorageForTesting(undefined);
  }
}

test("getStoredWorkspaceXmlText returns stored XML when stored version matches current version", () => {
  const shim = makeLocalStorageShim();
  shim.setItem(WORKSPACE_KEY, STORED_XML);
  shim.setItem(VERSION_KEY, CURRENT_VERSION);
  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  const result = withWindowMock(shim, () =>
    getStoredWorkspaceXmlText(app, null, STARTER_XML)
  );

  assert.equal(result, STORED_XML, "matching version should return the stored XML");
  assert.equal(shim.getItem(VERSION_KEY), CURRENT_VERSION, "version key should be unchanged");
});

test("getStoredWorkspaceXmlText returns fallbackXml, stamps new version, and preserves displaced XML when stored version differs (Plan 119 R1)", () => {
  const shim = makeLocalStorageShim();
  shim.setItem(WORKSPACE_KEY, STORED_XML);
  shim.setItem(VERSION_KEY, "deadbeef"); // wrong version
  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  const result = withWindowMock(shim, () =>
    getStoredWorkspaceXmlText(app, null, STARTER_XML)
  );

  assert.equal(result, STARTER_XML, "stale version should return fallbackXml (the current starter)");
  assert.equal(shim.getItem(VERSION_KEY), CURRENT_VERSION, "stale-replace should stamp current version key");
  assert.equal(shim.getItem(WORKSPACE_KEY), STARTER_XML, "stale-replace should overwrite workspace key with starter");

  // Plan 119: displaced slot must exist and contain the displaced XML and metadata
  const displacedRaw = shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`);
  assert.ok(displacedRaw, "displaced workspace slot should be written");
  const displacedData = JSON.parse(displacedRaw);
  assert.equal(displacedData.levelId, LEVEL_ID);
  assert.equal(displacedData.xml, STORED_XML);
  assert.equal(displacedData.storedVersion, "deadbeef");
  assert.equal(displacedData.currentVersion, CURRENT_VERSION);
  assert.ok(displacedData.displacedAt);

  // Plan 119: displaced index must include this level
  const indexRaw = shim.getItem(DISPLACED_WORKSPACE_INDEX_KEY);
  assert.ok(indexRaw, "displaced workspace index should be written");
  const indexData = JSON.parse(indexRaw);
  assert.ok(indexData.some((e) => e.levelId === LEVEL_ID));

  // Plan 119: app notice should be set to recoverable-copy with verbatim approved copy
  assert.deepEqual(app.state.displacedNotice, {
    type: "recoverable-copy",
    levelId: LEVEL_ID,
    message: DISPLACED_WORKSPACE_NOTICE_TEXT
  });
});

test("getStoredWorkspaceXmlText preserves stored XML and grace-stamps when version key absent (Decision 5)", () => {
  const shim = makeLocalStorageShim();
  shim.setItem(WORKSPACE_KEY, STORED_XML);
  // No VERSION_KEY — simulates pre-packet stored workspace
  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  const result = withWindowMock(shim, () =>
    getStoredWorkspaceXmlText(app, null, STARTER_XML)
  );

  assert.equal(result, STORED_XML, "absent version key should preserve stored XML (grace stamp)");
  assert.equal(shim.getItem(VERSION_KEY), CURRENT_VERSION, "absent version key should be grace-stamped with current version");
  assert.equal(shim.getItem(WORKSPACE_KEY), STORED_XML, "workspace key should be untouched during grace stamp");
});

test("getStoredWorkspaceXmlText returns fallbackXml when workspace key is absent (no stored content)", () => {
  const shim = makeLocalStorageShim();
  // No WORKSPACE_KEY, no VERSION_KEY
  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  const result = withWindowMock(shim, () =>
    getStoredWorkspaceXmlText(app, null, STARTER_XML)
  );

  assert.equal(result, STARTER_XML, "no stored content should return fallbackXml");
  assert.equal(shim.getItem(VERSION_KEY), null, "no stored content should not write version key");
});

test("getStoredWorkspaceXmlText skips version logic for project levels", () => {
  const shim = makeLocalStorageShim();
  // Seed the project shared workspace key (different prefix) so getItem can return it
  const projectKey = "bba:guided-project-workspace:proj-1";
  shim.setItem(projectKey, STORED_XML);
  shim.setItem(VERSION_KEY, "deadbeef"); // wrong version but should be ignored

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION, /* isProject= */ true);
  // For project levels, getWorkspaceStorageKey returns the project prefix key
  // The function should return the stored project XML without stale-replace.
  const result = withWindowMock(shim, () =>
    getStoredWorkspaceXmlText(app, null, STARTER_XML)
  );

  // The project shared key is used; stored content is returned regardless of the (wrong) version
  // In this test the projectKey has STORED_XML, so that should be returned.
  assert.equal(result, STORED_XML, "project levels should return stored content without stale-replace");
});

test("getStoredWorkspaceXmlText skips version logic for free play", () => {
  const shim = makeLocalStorageShim();
  shim.setItem("bba:free-play-workspace", STORED_XML);
  shim.setItem(VERSION_KEY, "deadbeef"); // should be ignored

  const app = {
    state: {
      currentModeView: GAME_VIEW_MODES.FREE_PLAY,
      currentLevelId: LEVEL_ID,
      levels: [],
      freePlayPrograms: {}
    },
    blocklyWorkspace: null
  };

  const result = withWindowMock(shim, () =>
    getStoredWorkspaceXmlText(app, null, STARTER_XML)
  );

  assert.equal(result, STORED_XML, "free play should return stored content without stale-replace");
});

// ─── saveWorkspaceToLocalStorage — version key write ─────────────────────────

test("saveWorkspaceToLocalStorage writes version key for guided non-project levels", () => {
  registerBattleBlocklyBlocks();
  const shim = makeLocalStorageShim();

  // Build a minimal workspace in Node
  const workspace = new Blockly.Workspace();
  const xmlText = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn" x="24" y="24"></block></xml>`;
  const domXml = Blockly.utils.xml.textToDom(xmlText);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};

  withWindowMock(shim, () => saveWorkspaceToLocalStorage(app));

  assert.ok(shim.getItem(WORKSPACE_KEY) !== null, "workspace key should be written");
  assert.equal(shim.getItem(VERSION_KEY), CURRENT_VERSION, "version sibling key should be written for guided non-project level");

  workspace.dispose();
});

test("saveWorkspaceToLocalStorage does NOT write version key for project levels", () => {
  registerBattleBlocklyBlocks();
  const shim = makeLocalStorageShim();

  const workspace = new Blockly.Workspace();
  const xmlText = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn" x="24" y="24"></block></xml>`;
  const domXml = Blockly.utils.xml.textToDom(xmlText);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION, /* isProject= */ true);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};

  withWindowMock(shim, () => saveWorkspaceToLocalStorage(app));

  assert.equal(shim.getItem(VERSION_KEY), null, "version key should NOT be written for project levels");

  workspace.dispose();
});

test("saveWorkspaceToLocalStorage does NOT write version key for free play", () => {
  registerBattleBlocklyBlocks();
  const shim = makeLocalStorageShim();

  const workspace = new Blockly.Workspace();
  const xmlText = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn" x="24" y="24"></block></xml>`;
  const domXml = Blockly.utils.xml.textToDom(xmlText);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  const app = {
    state: {
      currentModeView: GAME_VIEW_MODES.FREE_PLAY,
      currentLevelId: LEVEL_ID,
      levels: [],
      freePlayPrograms: {}
    },
    blocklyWorkspace: workspace,
    syncUi: () => {}
  };

  withWindowMock(shim, () => saveWorkspaceToLocalStorage(app));

  assert.ok(shim.getItem("bba:free-play-workspace") !== null, "free-play workspace key should be written");
  assert.equal(shim.getItem(VERSION_KEY), null, "version key should NOT be written for free play");

  workspace.dispose();
});

// ─── Plan 118: Blocked storage resilience & guided in-memory fallback ────────

test("saveWorkspaceToLocalStorage does not throw when window.localStorage getter throws SecurityError (Regression Proof)", () => {
  registerBattleBlocklyBlocks();
  const originalWindow = globalThis.window;
  const throwingWindow = {
    get localStorage() {
      const err = new Error("SecurityError: access denied");
      err.name = "SecurityError";
      throw err;
    }
  };
  globalThis.window = throwingWindow;
  setStorageForTesting(undefined);

  const workspace = new Blockly.Workspace();
  const xmlText = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn" x="24" y="24"></block></xml>`;
  const domXml = Blockly.utils.xml.textToDom(xmlText);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};

  try {
    assert.doesNotThrow(() => {
      saveWorkspaceToLocalStorage(app);
    }, "saveWorkspaceToLocalStorage must never throw even under throwing localStorage getter");

    assert.doesNotThrow(() => {
      const readBack = getStoredWorkspaceXmlText(app, null, STARTER_XML);
      assert.equal(readBack, getWorkspaceXmlText(app), "Guided in-memory fallback should return the saved XML");
    });
  } finally {
    if (typeof originalWindow === "undefined") {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
    setStorageForTesting(undefined);
    workspace.dispose();
    _clearGuidedInMemoryWorkspacesForTesting();
  }
});

test("guided fallback round-trips in memory when storage unavailable, but uses storage when available", () => {
  registerBattleBlocklyBlocks();
  _clearGuidedInMemoryWorkspacesForTesting();

  const workspace = new Blockly.Workspace();
  const editedXml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn" x="10" y="10"></block></xml>`;
  const domXml = Blockly.utils.xml.textToDom(editedXml);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  const app = makeGuidedApp("guided-level-1", STARTER_XML, CURRENT_VERSION);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};

  // Scenario A: Storage blocked / unavailable
  setStorageForTesting(null);
  saveWorkspaceToLocalStorage(app);

  const expectedXml = getWorkspaceXmlText(app);

  // Reading back returns the edited XML from in-memory fallback
  const loadedWhenBlocked = getStoredWorkspaceXmlText(app, null, STARTER_XML);
  assert.equal(loadedWhenBlocked, expectedXml, "In-memory map should preserve guided XML when storage is blocked");

  // Scenario B: Storage works
  _clearGuidedInMemoryWorkspacesForTesting();
  const workingShim = makeLocalStorageShim();
  setStorageForTesting(workingShim);

  saveWorkspaceToLocalStorage(app);
  assert.equal(workingShim.getItem(`bba:guided-workspace:guided-level-1`), expectedXml, "Saved to real storage");

  // In-memory map should stay inert when storage is available
  setStorageForTesting(null);
  const fromMemory = getStoredWorkspaceXmlText(app, null, STARTER_XML);
  assert.equal(fromMemory, STARTER_XML, "In-memory map remained inert while storage was available");

  setStorageForTesting(undefined);
  workspace.dispose();
  _clearGuidedInMemoryWorkspacesForTesting();
});

test("project level shared workspaces use common key in memory fallback", () => {
  registerBattleBlocklyBlocks();
  _clearGuidedInMemoryWorkspacesForTesting();
  setStorageForTesting(null);

  const workspace = new Blockly.Workspace();
  const projectXml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn" x="50" y="50"></block></xml>`;
  const domXml = Blockly.utils.xml.textToDom(projectXml);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  // Level 1 in project 'proj-1'
  const appL1 = makeGuidedApp("project-level-1", STARTER_XML, CURRENT_VERSION, /* isProject= */ true);
  appL1.blocklyWorkspace = workspace;
  appL1.syncUi = () => {};

  saveWorkspaceToLocalStorage(appL1);
  const expectedProjectXml = getWorkspaceXmlText(appL1);

  // Level 2 in same project 'proj-1'
  const appL2 = makeGuidedApp("project-level-2", STARTER_XML, CURRENT_VERSION, /* isProject= */ true);
  const loadedL2 = getStoredWorkspaceXmlText(appL2, null, STARTER_XML);
  assert.equal(loadedL2, expectedProjectXml, "Project shared workspace should be shared across levels in memory");

  setStorageForTesting(undefined);
  workspace.dispose();
  _clearGuidedInMemoryWorkspacesForTesting();
});

test("resetWorkspaceToCurrentStarter updates in-memory map when storage unavailable", () => {
  registerBattleBlocklyBlocks();
  _clearGuidedInMemoryWorkspacesForTesting();
  setStorageForTesting(null);

  const workspace = new Blockly.Workspace();
  const editedXml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn" x="99" y="99"></block></xml>`;
  Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(editedXml), workspace);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};

  saveWorkspaceToLocalStorage(app);
  assert.equal(getStoredWorkspaceXmlText(app, null, STARTER_XML), getWorkspaceXmlText(app));

  // Now call resetWorkspaceToCurrentStarter
  resetWorkspaceToCurrentStarter(app);

  // In-memory map now holds starterXml
  assert.equal(getStoredWorkspaceXmlText(app, null, STARTER_XML), STARTER_XML);

  setStorageForTesting(undefined);
  workspace.dispose();
  _clearGuidedInMemoryWorkspacesForTesting();
});

// ─── Plan 119: Displaced-Workspace Recovery & Bounded Retention Tests ────────

test("restoreDisplacedWorkspace round-trip: restores XML, re-stamps version key, and survives reload", () => {
  registerBattleBlocklyBlocks();
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);

  const workspace = new Blockly.Workspace();
  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};

  // Setup: level displaced; storage currently holds starter and currentVersion,
  // while displaced slot holds STORED_XML.
  shim.setItem(WORKSPACE_KEY, STARTER_XML);
  shim.setItem(VERSION_KEY, CURRENT_VERSION);
  saveDisplacedWorkspace(app, LEVEL_ID, STORED_XML, "deadbeef", CURRENT_VERSION);

  // Restore action
  const result = restoreDisplacedWorkspace(app, LEVEL_ID);
  assert.equal(result.ok, true, "restore should report success");

  // 1. Workspace key updated to displaced XML
  assert.equal(shim.getItem(WORKSPACE_KEY), STORED_XML, "workspace storage should hold restored XML");

  // 2. Version key re-stamped with current version
  assert.equal(shim.getItem(VERSION_KEY), CURRENT_VERSION, "version key should be re-stamped with current starter version");

  // 3. Live Blockly workspace updated
  assert.ok(getWorkspaceXmlText(app).includes("battlegorithms_stay_still"), "live Blockly workspace should hold restored XML");

  // 4. Reload survival: calling getStoredWorkspaceXmlText returns restored XML (no re-replace)
  const afterReload = getStoredWorkspaceXmlText(app, null, STARTER_XML);
  assert.equal(afterReload, STORED_XML, "restored XML must survive page reload and not re-trigger replacement");

  // 5. Reversibility (Gate 4): displaced slot is NOT deleted upon restore
  const slotAfter = shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`);
  assert.ok(slotAfter, "displaced slot must be retained in storage after restore (never deleted)");
  const slotData = JSON.parse(slotAfter);
  assert.ok(slotData.restoredAt, "restoredAt timestamp should be set on restored slot");

  setStorageForTesting(undefined);
  workspace.dispose();
  _clearGuidedInMemoryWorkspacesForTesting();
});

test("restoreDisplacedWorkspace fails safely if workspace write fails", () => {
  registerBattleBlocklyBlocks();
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);
  const workspace = new Blockly.Workspace();
  const domXml = Blockly.utils.xml.textToDom(STARTER_XML);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};
  const initialXml = getWorkspaceXmlText(app);

  // Seed displaced slot
  saveDisplacedWorkspace(app, LEVEL_ID, STORED_XML, "deadbeef", CURRENT_VERSION);

  // Custom storage where setItem on WORKSPACE_KEY throws
  const failingShim = {
    ...shim,
    setItem(key, value) {
      if (key === WORKSPACE_KEY) {
        throw new Error("Disk error writing workspace");
      }
      return shim.setItem(key, value);
    }
  };
  setStorageForTesting(failingShim);

  const result = restoreDisplacedWorkspace(app, LEVEL_ID);
  assert.equal(result.ok, false);
  assert.equal(result.message, DISPLACED_WORKSPACE_RESTORE_FAILURE_TEXT);

  // Live workspace must NOT be overwritten on partial failure
  assert.equal(getWorkspaceXmlText(app), initialXml, "live workspace should remain untouched");
  // Displaced entry must remain intact
  assert.ok(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`), "displaced slot must remain in storage");
  assert.equal(app.state.displacedNotice.type, "restore-failure");

  setStorageForTesting(undefined);
  workspace.dispose();
});

test("restoreDisplacedWorkspace fails safely if version key write fails", () => {
  registerBattleBlocklyBlocks();
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);
  const workspace = new Blockly.Workspace();
  const domXml = Blockly.utils.xml.textToDom(STARTER_XML);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};
  const initialXml = getWorkspaceXmlText(app);

  saveDisplacedWorkspace(app, LEVEL_ID, STORED_XML, "deadbeef", CURRENT_VERSION);

  // Custom storage where setItem on VERSION_KEY throws
  const failingShim = {
    ...shim,
    setItem(key, value) {
      if (key === VERSION_KEY) {
        throw new Error("Disk error writing version");
      }
      return shim.setItem(key, value);
    }
  };
  setStorageForTesting(failingShim);

  const result = restoreDisplacedWorkspace(app, LEVEL_ID);
  assert.equal(result.ok, false);
  assert.equal(result.message, DISPLACED_WORKSPACE_RESTORE_FAILURE_TEXT);
  assert.equal(getWorkspaceXmlText(app), initialXml, "live workspace should remain untouched");
  assert.ok(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`), "displaced slot must remain in storage");
  assert.equal(app.state.displacedNotice.type, "restore-failure");

  setStorageForTesting(undefined);
  workspace.dispose();
});

test("restoreDisplacedWorkspace fails safely if workspace read-back verification fails", () => {
  registerBattleBlocklyBlocks();
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);
  const workspace = new Blockly.Workspace();
  const domXml = Blockly.utils.xml.textToDom(STARTER_XML);
  Blockly.Xml.domToWorkspace(domXml, workspace);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};
  const initialXml = getWorkspaceXmlText(app);

  saveDisplacedWorkspace(app, LEVEL_ID, STORED_XML, "deadbeef", CURRENT_VERSION);

  // Storage that silently returns wrong value on getItem(WORKSPACE_KEY)
  const failingShim = {
    ...shim,
    getItem(key) {
      if (key === WORKSPACE_KEY) {
        return "corrupted";
      }
      return shim.getItem(key);
    }
  };
  setStorageForTesting(failingShim);

  const result = restoreDisplacedWorkspace(app, LEVEL_ID);
  assert.equal(result.ok, false);
  assert.equal(result.message, DISPLACED_WORKSPACE_RESTORE_FAILURE_TEXT);
  assert.equal(getWorkspaceXmlText(app), initialXml, "live workspace should remain untouched");

  setStorageForTesting(undefined);
  workspace.dispose();
});

test("retention cap: pruning oldest-first when exceeding MAX_DISPLACED_WORKSPACES (8)", () => {
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);

  const levels = [];
  for (let i = 1; i <= 9; i++) {
    levels.push({ id: `level-${i}`, initialBlocklyXml: `<xml>starter-${i}</xml>`, starterXmlVersion: `ver-${i}` });
  }

  const app = {
    state: {
      currentModeView: GAME_VIEW_MODES.GUIDED_LEVELS,
      currentLevelId: "level-1",
      levels,
      freePlayPrograms: {}
    },
    blocklyWorkspace: null
  };

  // Displace 9 levels sequentially
  for (let i = 1; i <= 9; i++) {
    const levelId = `level-${i}`;
    app.state.currentLevelId = levelId;
    const ok = saveDisplacedWorkspace(app, levelId, `<xml>work-${i}</xml>`, `old-${i}`, `ver-${i}`);
    assert.equal(ok, true, `saveDisplacedWorkspace should succeed for ${levelId}`);
  }

  const index = getDisplacedWorkspaceIndex();
  assert.equal(index.length, MAX_DISPLACED_WORKSPACES, "index should be capped at MAX_DISPLACED_WORKSPACES (8)");

  // Oldest level (level-1) must be pruned
  assert.equal(index.some((e) => e.levelId === "level-1"), false, "level-1 should be pruned from index");
  assert.equal(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}level-1`), null, "level-1 slot should be removed from storage");

  // Levels 2 to 9 must survive
  for (let i = 2; i <= 9; i++) {
    assert.ok(index.some((e) => e.levelId === `level-${i}`), `level-${i} should exist in index`);
    assert.ok(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}level-${i}`), `level-${i} slot should exist in storage`);
  }

  setStorageForTesting(undefined);
});

test("one-per-level: displacing same level twice updates slot and keeps single index entry", () => {
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  // Displacement 1
  const ok1 = saveDisplacedWorkspace(app, LEVEL_ID, "<xml>work-1</xml>", "v1", CURRENT_VERSION);
  assert.equal(ok1, true);

  // Displacement 2 (newer)
  const ok2 = saveDisplacedWorkspace(app, LEVEL_ID, "<xml>work-2</xml>", "v2", CURRENT_VERSION);
  assert.equal(ok2, true);

  const index = getDisplacedWorkspaceIndex();
  const entriesForLevel = index.filter((e) => e.levelId === LEVEL_ID);
  assert.equal(entriesForLevel.length, 1, "exactly one index entry should exist for level");

  const slot = getDisplacedWorkspace(LEVEL_ID);
  assert.equal(slot.xml, "<xml>work-2</xml>", "slot should have newer XML");
  assert.equal(slot.storedVersion, "v2");

  setStorageForTesting(undefined);
});

test("no-op cases: empty stored XML, starter-identical XML, grace stamp do not displace", () => {
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  // Case 1: empty string
  assert.equal(saveDisplacedWorkspace(app, LEVEL_ID, "", "v1", CURRENT_VERSION), false);
  assert.equal(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`), null);

  // Case 2: whitespace only
  assert.equal(saveDisplacedWorkspace(app, LEVEL_ID, "   \n  ", "v1", CURRENT_VERSION), false);
  assert.equal(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`), null);

  // Case 3: byte-identical to starter XML in getStoredWorkspaceXmlText
  shim.setItem(WORKSPACE_KEY, STARTER_XML);
  shim.setItem(VERSION_KEY, "deadbeef");
  const result = getStoredWorkspaceXmlText(app, null, STARTER_XML);
  assert.equal(result, STARTER_XML);
  assert.equal(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`), null, "identical XML should not be displaced");

  // Case 4: grace stamp (storedVersion === null)
  shim.setItem(WORKSPACE_KEY, STORED_XML);
  shim.removeItem(VERSION_KEY);
  const graceResult = getStoredWorkspaceXmlText(app, null, STARTER_XML);
  assert.equal(graceResult, STORED_XML);
  assert.equal(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`), null, "grace stamp should not displace");

  setStorageForTesting(undefined);
});

test("corrupt slot: unparseable displaced JSON is cleaned up without throwing", () => {
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);

  const corruptKey = `${DISPLACED_WORKSPACE_STORAGE_PREFIX}${LEVEL_ID}`;
  shim.setItem(corruptKey, "{corrupted-not-json");

  const slot = getDisplacedWorkspace(LEVEL_ID);
  assert.equal(slot, null, "corrupt slot should return null");
  assert.equal(shim.getItem(corruptKey), null, "corrupt slot should be removed from storage");

  // Level load should succeed without throwing
  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  assert.doesNotThrow(() => {
    getStoredWorkspaceXmlText(app, null, STARTER_XML);
  });

  setStorageForTesting(undefined);
});

test("storage-unavailable from page start: memory fallback skips displacement", () => {
  _clearGuidedInMemoryWorkspacesForTesting();
  setStorageForTesting(null); // Storage unavailable / blocked

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  // Stale compare skipped in memory fallback
  const result = getStoredWorkspaceXmlText(app, null, STARTER_XML);
  assert.equal(result, STARTER_XML);

  // Restore returns false
  const restoreRes = restoreDisplacedWorkspace(app, LEVEL_ID);
  assert.equal(restoreRes.ok, false);
  assert.equal(restoreRes.message, DISPLACED_WORKSPACE_RESTORE_FAILURE_TEXT);

  setStorageForTesting(undefined);
  _clearGuidedInMemoryWorkspacesForTesting();
});

test("preservation failure: failure to write or verify recovery copy keeps original workspace intact", () => {
  _clearPreservationBlockedLevelsForTesting();
  const shim = makeLocalStorageShim();

  // Storage fails on writing displaced slot
  const failingShim = {
    ...shim,
    setItem(key, value) {
      if (key.startsWith(DISPLACED_WORKSPACE_STORAGE_PREFIX)) {
        throw new Error("Disk full saving displaced slot");
      }
      return shim.setItem(key, value);
    }
  };
  setStorageForTesting(failingShim);

  shim.setItem(WORKSPACE_KEY, STORED_XML);
  shim.setItem(VERSION_KEY, "deadbeef");

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  // Load level: should trigger preservation failure path
  const loadedXml = getStoredWorkspaceXmlText(app, null, STARTER_XML);

  // Invariant 1: Keeps earlier stored XML instead of starter!
  assert.equal(loadedXml, STORED_XML, "earlier program should be kept when preservation fails");

  // Invariant 2: Original workspace and version keys in storage are untouched!
  assert.equal(shim.getItem(WORKSPACE_KEY), STORED_XML, "original workspace key must be untouched");
  assert.equal(shim.getItem(VERSION_KEY), "deadbeef", "original version key must not be stamped");

  // Invariant 3: Preservation failure notice displayed with approved copy
  assert.deepEqual(app.state.displacedNotice, {
    type: "preservation-failure",
    levelId: LEVEL_ID,
    message: DISPLACED_WORKSPACE_PRESERVATION_FAILURE_TEXT
  });

  setStorageForTesting(undefined);
  _clearPreservationBlockedLevelsForTesting();
});

test("preservation failure followed by student edit/save: version key is NOT stamped", () => {
  registerBattleBlocklyBlocks();
  _clearPreservationBlockedLevelsForTesting();
  const shim = makeLocalStorageShim();

  const failingShim = {
    ...shim,
    setItem(key, value) {
      if (key.startsWith(DISPLACED_WORKSPACE_STORAGE_PREFIX)) {
        throw new Error("Quota error");
      }
      return shim.setItem(key, value);
    }
  };
  setStorageForTesting(failingShim);

  shim.setItem(WORKSPACE_KEY, STORED_XML);
  shim.setItem(VERSION_KEY, "deadbeef");

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  // 1. Load level -> triggers preservation failure and marks level preservation-blocked
  getStoredWorkspaceXmlText(app, null, STARTER_XML);

  // 2. Student edits workspace
  const workspace = new Blockly.Workspace();
  const newXml = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_on_each_turn" x="12" y="34"></block></xml>`;
  Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(newXml), workspace);
  app.blocklyWorkspace = workspace;
  app.syncUi = () => {};

  // 3. Save workspace
  saveWorkspaceToLocalStorage(app);

  // 4. Invariant: workspace XML was saved, BUT version key was NOT stamped!
  assert.equal(shim.getItem(WORKSPACE_KEY), getWorkspaceXmlText(app), "workspace XML should be saved");
  assert.ok(shim.getItem(WORKSPACE_KEY).includes("battlegorithms_on_each_turn"));
  assert.equal(shim.getItem(VERSION_KEY), "deadbeef", "version key must NOT be stamped with currentVersion while preservation-blocked");

  setStorageForTesting(undefined);
  workspace.dispose();
  _clearPreservationBlockedLevelsForTesting();
});

test("pruning unknown level IDs does not throw during saveDisplacedWorkspace", () => {
  const shim = makeLocalStorageShim();
  setStorageForTesting(shim);

  // Seed index with an obsolete level that is no longer in app.state.levels
  const oldIndex = [
    { levelId: "defunct-level-99", displacedAt: "2026-01-01T00:00:00.000Z" }
  ];
  shim.setItem(DISPLACED_WORKSPACE_INDEX_KEY, JSON.stringify(oldIndex));
  shim.setItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}defunct-level-99`, JSON.stringify({
    levelId: "defunct-level-99",
    xml: "<xml>old</xml>",
    displacedAt: "2026-01-01T00:00:00.000Z"
  }));

  const app = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);

  assert.doesNotThrow(() => {
    saveDisplacedWorkspace(app, LEVEL_ID, STORED_XML, "deadbeef", CURRENT_VERSION);
  });

  const index = getDisplacedWorkspaceIndex();
  assert.equal(index.some((e) => e.levelId === "defunct-level-99"), false, "defunct level should be pruned from index");
  assert.equal(shim.getItem(`${DISPLACED_WORKSPACE_STORAGE_PREFIX}defunct-level-99`), null, "defunct level slot should be removed");

  setStorageForTesting(undefined);
});

test("replacement partial failures: starter write fail and version write fail preserve displaced copy", () => {
  // Case A: Starter write fails -> version is never stamped, displaced slot retained
  const shimA = makeLocalStorageShim();
  shimA.setItem(WORKSPACE_KEY, STORED_XML);
  shimA.setItem(VERSION_KEY, "deadbeef");

  const failingShimA = {
    ...shimA,
    setItem(key, value) {
      if (key === WORKSPACE_KEY && value === STARTER_XML) {
        throw new Error("Starter write failed");
      }
      return shimA.setItem(key, value);
    }
  };
  setStorageForTesting(failingShimA);

  const appA = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  getStoredWorkspaceXmlText(appA, null, STARTER_XML);

  // Version key must NOT have been stamped
  assert.equal(shimA.getItem(VERSION_KEY), "deadbeef", "version must not be stamped if starter write failed");
  // Displaced slot must be retained
  const slotA = getDisplacedWorkspace(LEVEL_ID);
  assert.ok(slotA, "displaced slot must exist");
  assert.equal(slotA.xml, STORED_XML);

  // Case B: Version write fails -> starter was written, displaced slot retained;
  // On retry, no-op prevents overwriting displaced copy with starter
  const shimB = makeLocalStorageShim();
  shimB.setItem(WORKSPACE_KEY, STORED_XML);
  shimB.setItem(VERSION_KEY, "deadbeef");

  let versionFailedOnce = false;
  const failingShimB = {
    ...shimB,
    setItem(key, value) {
      if (key === VERSION_KEY && value === CURRENT_VERSION && !versionFailedOnce) {
        versionFailedOnce = true;
        throw new Error("Version write failed");
      }
      return shimB.setItem(key, value);
    }
  };
  setStorageForTesting(failingShimB);

  const appB = makeGuidedApp(LEVEL_ID, STARTER_XML, CURRENT_VERSION);
  // First load: starter written, version fails
  getStoredWorkspaceXmlText(appB, null, STARTER_XML);

  assert.equal(shimB.getItem(WORKSPACE_KEY), STARTER_XML, "starter was written");
  assert.equal(shimB.getItem(VERSION_KEY), "deadbeef", "version was not stamped due to failure");
  const slotB1 = getDisplacedWorkspace(LEVEL_ID);
  assert.equal(slotB1.xml, STORED_XML, "displaced slot holds original student XML");

  // Second load (retry): workspace now holds starter, version is still mismatch.
  // No-op rule must prevent starter from replacing original displaced copy!
  getStoredWorkspaceXmlText(appB, null, STARTER_XML);
  const slotB2 = getDisplacedWorkspace(LEVEL_ID);
  assert.equal(slotB2.xml, STORED_XML, "displaced copy was NOT overwritten by starter on retry");

  setStorageForTesting(undefined);
});
