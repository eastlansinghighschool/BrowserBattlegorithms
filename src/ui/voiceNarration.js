// Plan 39: Browser TTS Delivery
// Web Speech API wrapper for optional voice narration.
// Off by default. Handles user-gesture-first-speak, async voice loading,
// queue management, aria-live conflict suppression, and SFX ducking.

import { setNarrationDucking } from "./sound.js";

import { loadPreference, savePreference, parseBoolean, parseFloatPref, parseString, PREF_KEYS } from "./preferences.js";

// Module-level state (reset only by calling initVoiceNarration again).
let hasGestured = false;
let voiceEnabled = false;
let voiceRate = 1.0;
let selectedVoiceUri = "";
let availableVoices = [];
let activeLiveRegionEl = null;

function hasSpeechSynthesis() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function hasWindowStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function pickVoice() {
  if (!availableVoices.length) return null;
  if (selectedVoiceUri) {
    const match = availableVoices.find((v) => v.voiceURI === selectedVoiceUri);
    if (match) return match;
  }
  return availableVoices.find((v) => v.default) || availableVoices[0];
}

function restoreActiveLiveRegion() {
  if (activeLiveRegionEl) {
    activeLiveRegionEl.setAttribute("aria-live", "polite");
    activeLiveRegionEl = null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function isVoiceEnabled() {
  return voiceEnabled;
}

export function markUserGestured() {
  hasGestured = true;
}

export function getAvailableVoices() {
  return availableVoices.slice();
}

export function setVoiceEnabled(enabled) {
  voiceEnabled = Boolean(enabled);
  savePreference(PREF_KEYS.VOICE_NARRATION_ENABLED, voiceEnabled);
  if (!voiceEnabled) {
    cancelSpeech();
  }
}

export function setVoiceRate(rate) {
  const parsed = Number(rate);
  voiceRate = Number.isFinite(parsed) ? Math.max(0.75, Math.min(1.5, parsed)) : 1.0;
  savePreference(PREF_KEYS.VOICE_NARRATION_RATE, voiceRate);
}

export function setVoiceUri(uri) {
  selectedVoiceUri = uri || "";
  savePreference(PREF_KEYS.VOICE_NARRATION_VOICE, selectedVoiceUri);
}

// Cancel any in-flight or queued speech. Restores aria-live and clears ducking.
export function cancelSpeech() {
  if (!hasSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
  restoreActiveLiveRegion();
  setNarrationDucking(false);
}

// Speak text. No-op when: voice off, no user gesture yet, or text is empty.
// Sequence: cancel current queue → set aria-live=off → speak → onend restores.
// liveRegionId: id of the aria-live element to suppress during speech (optional).
export function speak(text, liveRegionId) {
  if (!hasSpeechSynthesis()) return;
  if (!voiceEnabled) return;
  if (!hasGestured) return;
  if (!text || !`${text}`.trim()) return;

  const liveRegion = liveRegionId
    ? (typeof document !== "undefined" ? document.getElementById(liveRegionId) : null)
    : null;

  window.speechSynthesis.cancel();
  restoreActiveLiveRegion();

  if (liveRegion) {
    liveRegion.setAttribute("aria-live", "off");
    activeLiveRegionEl = liveRegion;
  }

  const utterance = new window.SpeechSynthesisUtterance(`${text}`);
  utterance.rate = voiceRate;
  utterance.pitch = 1.0;
  const voice = pickVoice();
  if (voice) utterance.voice = voice;

  utterance.onstart = () => {
    setNarrationDucking(true);
  };

  const cleanup = () => {
    setNarrationDucking(false);
    restoreActiveLiveRegion();
  };

  utterance.onend = cleanup;
  utterance.onerror = cleanup;

  window.speechSynthesis.speak(utterance);
}

// Initialize voice narration for the session. Reads persisted prefs, loads
// voices, wires the user-gesture listener, and cancels speech on page unload.
export function initVoiceNarration(app) {
  if (!hasSpeechSynthesis()) return;

  voiceEnabled = loadPreference(PREF_KEYS.VOICE_NARRATION_ENABLED, false, parseBoolean);
  voiceRate = loadPreference(PREF_KEYS.VOICE_NARRATION_RATE, 1.0, parseFloatPref);
  voiceRate = Math.max(0.75, Math.min(1.5, voiceRate));
  selectedVoiceUri = loadPreference(PREF_KEYS.VOICE_NARRATION_VOICE, "", parseString);

  const docLang = typeof document !== "undefined"
    ? (document.documentElement.lang || "").split("-")[0]
    : "";

  const loadVoices = () => {
    const all = window.speechSynthesis.getVoices();
    availableVoices = docLang
      ? all.filter((v) => v.lang.startsWith(docLang))
      : all;
    if (!availableVoices.length) availableVoices = all;
    if (app.hooks.populateVoicePicker) {
      app.hooks.populateVoicePicker();
    } else if (typeof queueMicrotask === "function") {
      queueMicrotask(() => {
        app.hooks.populateVoicePicker?.();
      });
    } else {
      setTimeout(() => {
        app.hooks.populateVoicePicker?.();
      }, 0);
    }
  };

  window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  loadVoices();

  const onGesture = () => {
    hasGestured = true;
    window.removeEventListener("click", onGesture, true);
    window.removeEventListener("keydown", onGesture, true);
    window.removeEventListener("touchstart", onGesture, true);
  };
  window.addEventListener("click", onGesture, true);
  window.addEventListener("keydown", onGesture, true);
  window.addEventListener("touchstart", onGesture, true);

  window.addEventListener("beforeunload", () => {
    cancelSpeech();
  });
}
