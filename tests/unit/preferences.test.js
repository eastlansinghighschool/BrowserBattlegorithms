import test from "node:test";
import assert from "node:assert/strict";

import {
  loadPreference,
  savePreference,
  parseBoolean,
  parseFloatPref,
  parseString,
  setCustomStorage,
  PREF_KEYS
} from "../../src/ui/preferences.js";

const mockStorageMap = new Map();
const mockLocalStorage = {
  getItem: (key) => {
    const val = mockStorageMap.get(key);
    return val === undefined ? null : val;
  },
  setItem: (key, value) => {
    mockStorageMap.set(key, String(value));
  },
  removeItem: (key) => {
    mockStorageMap.delete(key);
  },
  clear: () => {
    mockStorageMap.clear();
  }
};

setCustomStorage(mockLocalStorage);

test.beforeEach(() => {
  setCustomStorage(mockLocalStorage);
});

test.after(() => {
  setCustomStorage(null);
});

test("parseBoolean correctly parses booleans or returns default", () => {
  assert.equal(parseBoolean("true", false), true);
  assert.equal(parseBoolean("false", true), false);
  assert.equal(parseBoolean("invalid", true), true);
  assert.equal(parseBoolean("invalid", false), false);
});

test("parseFloatPref correctly parses floats or returns default", () => {
  assert.equal(parseFloatPref("1.25", 1.0), 1.25);
  assert.equal(parseFloatPref("invalid", 1.0), 1.0);
  assert.equal(parseFloatPref(null, 1.0), 1.0);
});

test("parseString returns string representation or empty", () => {
  assert.equal(parseString("hello"), "hello");
  assert.equal(parseString(null), "");
  assert.equal(parseString(undefined), "");
  assert.equal(parseString(123), "123");
});

test("loadPreference returns default when key does not exist", () => {
  mockStorageMap.clear();
  const val = loadPreference("nonexistent-key", "default-val", parseString);
  assert.equal(val, "default-val");
});

test("loadPreference loads existing preference correctly", () => {
  mockStorageMap.clear();
  mockLocalStorage.setItem("test-key", "true");
  const val = loadPreference("test-key", false, parseBoolean);
  assert.equal(val, true);
});

test("savePreference saves preference correctly", () => {
  mockStorageMap.clear();
  savePreference("test-key", "new-val");
  assert.equal(mockLocalStorage.getItem("test-key"), "new-val");
});

test("loadPreference migrates legacy keys on first read", () => {
  mockStorageMap.clear();
  // Set legacy key
  mockLocalStorage.setItem("bba:sound-enabled", "false");
  // Read new key
  const val = loadPreference(PREF_KEYS.SOUND_ENABLED, true, parseBoolean);
  assert.equal(val, false);
  // Verify new key was set
  assert.equal(mockLocalStorage.getItem(PREF_KEYS.SOUND_ENABLED), "false");
});

test("loadPreference handles localStorage exceptions gracefully", () => {
  const originalGet = mockLocalStorage.getItem;
  mockLocalStorage.getItem = () => {
    throw new Error("Disk Full / Restricted Access");
  };
  try {
    const val = loadPreference("any-key", "fallback", parseString);
    assert.equal(val, "fallback");
  } finally {
    mockLocalStorage.getItem = originalGet;
  }
});

test("savePreference handles localStorage exceptions gracefully", () => {
  const originalSet = mockLocalStorage.setItem;
  mockLocalStorage.setItem = () => {
    throw new Error("Quota Exceeded");
  };
  try {
    // Should not throw
    savePreference("any-key", "value");
  } finally {
    mockLocalStorage.setItem = originalSet;
  }
});
