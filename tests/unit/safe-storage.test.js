import test from "node:test";
import assert from "node:assert/strict";
import {
  isLocalStorageAvailable,
  readLocalStorage,
  writeLocalStorage,
  removeLocalStorage,
  setStorageForTesting
} from "../../src/platform/safeStorage.js";

function makeMapStorage() {
  const map = new Map();
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
    clear() {
      map.clear();
    },
    _map: map
  };
}

test("safeStorage: normal storage round-trip and availability", () => {
  const storage = makeMapStorage();
  setStorageForTesting(storage);

  assert.equal(isLocalStorageAvailable(), true);
  assert.equal(writeLocalStorage("key1", "val1"), true);
  assert.equal(readLocalStorage("key1"), "val1");
  assert.equal(removeLocalStorage("key1"), true);
  assert.equal(readLocalStorage("key1"), null);

  setStorageForTesting(undefined);
});

test("safeStorage: throwing localStorage getter returns false and does not throw", () => {
  const originalWindow = globalThis.window;
  const throwingWindow = {
    get localStorage() {
      const err = new Error("Blocked by policy");
      err.name = "SecurityError";
      throw err;
    }
  };

  globalThis.window = throwingWindow;
  setStorageForTesting(undefined); // ensure it reads window.localStorage

  try {
    assert.equal(isLocalStorageAvailable(), false);
    assert.equal(readLocalStorage("foo"), null);
    assert.equal(writeLocalStorage("foo", "bar"), false);
    assert.equal(removeLocalStorage("foo"), false);
  } finally {
    if (typeof originalWindow === "undefined") {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
    setStorageForTesting(undefined);
  }
});

test("safeStorage: storage whose setItem throws returns false and does not throw", () => {
  const storage = {
    getItem() {
      return null;
    },
    setItem() {
      throw new Error("Disk error");
    },
    removeItem() {}
  };
  setStorageForTesting(storage);

  assert.equal(isLocalStorageAvailable(), false);
  assert.equal(writeLocalStorage("key", "val"), false);

  setStorageForTesting(undefined);
});

test("safeStorage: quota-error stub keeps isLocalStorageAvailable true while write returns false", () => {
  let probePassed = false;
  const storage = {
    getItem(key) {
      return key === "__bba_storage_probe__" && probePassed ? "probe" : null;
    },
    setItem(key, value) {
      const quotaErr = new Error("Quota exceeded");
      quotaErr.name = "QuotaExceededError";
      quotaErr.code = 22;
      throw quotaErr;
    },
    removeItem() {}
  };
  setStorageForTesting(storage);

  // Per R1: if storage property acquired but probe cannot write due to quota,
  // isLocalStorageAvailable() returns true (accessible / not blocked).
  assert.equal(isLocalStorageAvailable(), true);
  assert.equal(writeLocalStorage("anyKey", "largePayload"), false);

  setStorageForTesting(undefined);
});

test("safeStorage: probe readback failure marks storage unavailable", () => {
  const storage = {
    getItem() {
      return "wrong-value"; // silent no-op / corruption
    },
    setItem() {},
    removeItem() {}
  };
  setStorageForTesting(storage);

  assert.equal(isLocalStorageAvailable(), false);

  setStorageForTesting(undefined);
});

test("safeStorage: setStorageForTesting(null) marks storage unavailable without throwing", () => {
  setStorageForTesting(null);

  assert.equal(isLocalStorageAvailable(), false);
  assert.equal(readLocalStorage("foo"), null);
  assert.equal(writeLocalStorage("foo", "bar"), false);
  assert.equal(removeLocalStorage("foo"), false);

  setStorageForTesting(undefined);
});
