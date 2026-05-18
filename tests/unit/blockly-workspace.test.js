import test from "node:test";
import assert from "node:assert/strict";
import * as Blockly from "blockly";
import { GAME_VIEW_MODES } from "../../src/config/constants.js";
import {
  hashStarterXml,
  normalizeStarterXmlForHashing,
  getStoredWorkspaceXmlText,
  saveWorkspaceToLocalStorage
} from "../../src/ai/blockly/workspace.js";
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
  try {
    return fn();
  } finally {
    if (typeof originalWindow === "undefined") {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
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

test("getStoredWorkspaceXmlText returns fallbackXml and stamps new version when stored version differs (stale-replace)", () => {
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
