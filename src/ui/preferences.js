export const PREF_KEYS = {
  SOUND_ENABLED: "bba:settings:sound-enabled",
  TURN_LOG_VISIBLE: "bba:settings:narration-visible-strip",
  COACHING_MODE_ENABLED: "bba:settings:coaching-mode-enabled",
  VOICE_NARRATION_ENABLED: "bba:settings:voice-narration-enabled",
  VOICE_NARRATION_RATE: "bba:settings:voice-narration-rate",
  VOICE_NARRATION_VOICE: "bba:settings:voice-narration-voice",
  LOW_MOTION_OVERRIDE: "bba:settings:low-motion-override",
  RUNNER_MOVEMENT_ANIMATIONS: "bba:settings:runner-movement-animations",
  RUNNER_JUMPING_ANIMATIONS: "bba:settings:runner-jumping-animations",
  SHOW_FROZEN_BADGES: "bba:settings:show-frozen-badges",
  SHOW_RUNNER_INDEX_BADGES: "bba:settings:show-runner-index-badges",
};

const LEGACY_KEYS = {
  [PREF_KEYS.SOUND_ENABLED]: "bba:sound-enabled",
  [PREF_KEYS.TURN_LOG_VISIBLE]: "bba:narration-visible-strip",
  [PREF_KEYS.COACHING_MODE_ENABLED]: "bba:coaching-mode-enabled",
  [PREF_KEYS.VOICE_NARRATION_ENABLED]: "bba:voice-narration-enabled",
  [PREF_KEYS.VOICE_NARRATION_RATE]: "bba:voice-narration-rate",
  [PREF_KEYS.VOICE_NARRATION_VOICE]: "bba:voice-narration-voice",
};

let customStorage = null;

export function setCustomStorage(storage) {
  customStorage = storage;
}

function getStorage() {
  if (customStorage) return customStorage;
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export function parseBoolean(value, defaultValue) {
  if (value === "true") return true;
  if (value === "false") return false;
  return defaultValue;
}

export function parseFloatPref(value, defaultValue) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : defaultValue;
}

export function parseString(value) {
  return value === null || value === undefined ? "" : String(value);
}

export function loadPreference(key, defaultValue, parser) {
  const storage = getStorage();
  if (!storage) {
    return defaultValue;
  }
  try {
    let raw = storage.getItem(key);
    if (raw === null) {
      const legacyKey = LEGACY_KEYS[key];
      if (legacyKey) {
        raw = storage.getItem(legacyKey);
        if (raw !== null) {
          storage.setItem(key, raw);
        }
      }
    }
    if (raw === null) {
      return defaultValue;
    }
    return parser(raw, defaultValue);
  } catch (err) {
    console.warn(`Failed to read from localStorage:`, err);
    return defaultValue;
  }
}

export function savePreference(key, value) {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  try {
    storage.setItem(key, String(value));
  } catch (err) {
    console.warn(`Failed to write to localStorage:`, err);
  }
}
