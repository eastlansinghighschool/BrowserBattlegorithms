/**
 * Safe Browser Local Storage Platform Adapter
 *
 * Plan 118: Embedded And Blocked Storage Resilience
 *
 * Provides exception-safe access to browser localStorage.
 * When a browser blocks site storage (e.g. cross-site iframe,
 * BlockThirdPartyCookies policy, Incognito, strict tracking protection),
 * evaluating `window.localStorage` itself throws a SecurityError.
 *
 * This module ensures:
 * 1. Every property access to window.localStorage happens inside try/catch.
 * 2. Silent no-op storage sinks are caught by a read/write probe.
 * 3. QuotaExceededError is classified as accessible (not blocked),
 *    while write fails.
 * 4. Failures log at most once per page load to avoid console spam.
 * 5. No module in src/ platform imports from any other layer.
 */

let customStorage; // undefined = use window.localStorage; null = explicitly unavailable; object = custom
let cachedAvailable = null;
let hasLoggedFailure = false;

function warnOnce(message, error) {
  if (!hasLoggedFailure) {
    hasLoggedFailure = true;
    if (error !== undefined) {
      console.warn(message, error);
    } else {
      console.warn(message);
    }
  }
}

function getRawStorage() {
  if (customStorage !== undefined) {
    return customStorage;
  }
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage || null;
  } catch (err) {
    warnOnce("[safeStorage] Access to window.localStorage was denied:", err);
    return null;
  }
}

function isQuotaError(err) {
  return (
    err?.name === "QuotaExceededError" ||
    err?.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    err?.code === 22 ||
    err?.code === 1014
  );
}

/**
 * Resets the memoized capability probe and configures custom storage for testing.
 *
 * @param {Storage | object | null | undefined} storageLike
 */
export function setStorageForTesting(storageLike) {
  customStorage = storageLike;
  cachedAvailable = null;
  hasLoggedFailure = false;
}

/**
 * Checks whether browser localStorage is accessible and functional.
 * Memoized per page load (or until reset by setStorageForTesting).
 *
 * @returns {boolean}
 */
export function isLocalStorageAvailable() {
  if (cachedAvailable !== null) {
    return cachedAvailable;
  }

  let storage = null;
  try {
    storage = getRawStorage();
  } catch (err) {
    warnOnce("[safeStorage] Failed to acquire storage reference:", err);
    cachedAvailable = false;
    return false;
  }

  if (!storage) {
    cachedAvailable = false;
    return false;
  }

  const probeKey = "__bba_storage_probe__";
  try {
    storage.setItem(probeKey, "probe");
    const readBack = storage.getItem(probeKey);
    storage.removeItem(probeKey);
    if (readBack !== "probe") {
      warnOnce("[safeStorage] Storage round-trip probe failed to read back value.");
      cachedAvailable = false;
      return false;
    }
    cachedAvailable = true;
    return true;
  } catch (err) {
    if (isQuotaError(err)) {
      // Storage is accessible, but full. Per Plan 118 R1:
      // classify QuotaExceededError separately: storage is accessible (not blocked),
      // so return true here so the storage-blocked banner does not display.
      cachedAvailable = true;
      return true;
    }

    warnOnce("[safeStorage] Storage capability probe failed:", err);
    cachedAvailable = false;
    return false;
  }
}

/**
 * Safely reads a value from localStorage without throwing.
 *
 * @param {string} key
 * @returns {string | null}
 */
export function readLocalStorage(key) {
  try {
    const storage = getRawStorage();
    if (!storage) {
      return null;
    }
    return storage.getItem(key);
  } catch (err) {
    warnOnce(`[safeStorage] Failed to read key "${key}":`, err);
    return null;
  }
}

/**
 * Safely writes a value to localStorage without throwing.
 *
 * @param {string} key
 * @param {string} value
 * @returns {boolean} True if write persisted successfully, false otherwise.
 */
export function writeLocalStorage(key, value) {
  try {
    const storage = getRawStorage();
    if (!storage) {
      return false;
    }
    storage.setItem(key, String(value));
    return true;
  } catch (err) {
    warnOnce(`[safeStorage] Failed to write key "${key}":`, err);
    return false;
  }
}

/**
 * Safely removes a value from localStorage without throwing.
 *
 * @param {string} key
 * @returns {boolean} True if removal succeeded without error, false otherwise.
 */
export function removeLocalStorage(key) {
  try {
    const storage = getRawStorage();
    if (!storage) {
      return false;
    }
    storage.removeItem(key);
    return true;
  } catch (err) {
    warnOnce(`[safeStorage] Failed to remove key "${key}":`, err);
    return false;
  }
}
