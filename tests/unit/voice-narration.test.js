import test from "node:test";
import assert from "node:assert/strict";
import {
  cancelSpeech,
  getAvailableVoices,
  isVoiceEnabled,
  markUserGestured,
  initVoiceNarration,
  setVoiceEnabled,
  setVoiceRate,
  setVoiceUri,
  speak
} from "../../src/ui/voiceNarration.js";

// Node.js has no speechSynthesis, so all speak/cancel calls are silent no-ops.
// Tests verify in-memory state changes and no-op contracts.

// ─── Initial state ────────────────────────────────────────────────────────────

test("isVoiceEnabled returns false before any setVoiceEnabled call", () => {
  assert.equal(isVoiceEnabled(), false);
});

test("getAvailableVoices returns an array", () => {
  assert.ok(Array.isArray(getAvailableVoices()));
});

// ─── setVoiceEnabled ─────────────────────────────────────────────────────────

test("setVoiceEnabled(true) sets voice to enabled", () => {
  setVoiceEnabled(true);
  assert.equal(isVoiceEnabled(), true);
  setVoiceEnabled(false); // cleanup
});

test("setVoiceEnabled(false) sets voice to disabled", () => {
  setVoiceEnabled(true);
  setVoiceEnabled(false);
  assert.equal(isVoiceEnabled(), false);
});

test("setVoiceEnabled(false) does not throw even when speechSynthesis absent", () => {
  setVoiceEnabled(true);
  assert.doesNotThrow(() => setVoiceEnabled(false));
});

// ─── setVoiceRate clamping ────────────────────────────────────────────────────

test("setVoiceRate accepts value within [0.75, 1.5] range", () => {
  assert.doesNotThrow(() => setVoiceRate(1.0));
  assert.doesNotThrow(() => setVoiceRate(0.75));
  assert.doesNotThrow(() => setVoiceRate(1.5));
});

test("setVoiceRate clamps values below 0.75 without throwing", () => {
  assert.doesNotThrow(() => setVoiceRate(0.1));
});

test("setVoiceRate clamps values above 1.5 without throwing", () => {
  assert.doesNotThrow(() => setVoiceRate(3.0));
});

test("setVoiceRate handles non-numeric input without throwing", () => {
  assert.doesNotThrow(() => setVoiceRate("fast"));
  assert.doesNotThrow(() => setVoiceRate(null));
  assert.doesNotThrow(() => setVoiceRate(undefined));
});

// ─── setVoiceUri ─────────────────────────────────────────────────────────────

test("setVoiceUri accepts a URI string without throwing", () => {
  assert.doesNotThrow(() => setVoiceUri("com.apple.speech.voice.Alex"));
});

test("setVoiceUri accepts empty string without throwing", () => {
  assert.doesNotThrow(() => setVoiceUri(""));
});

test("setVoiceUri accepts null without throwing (resets to default)", () => {
  assert.doesNotThrow(() => setVoiceUri(null));
});

// ─── speak no-op contracts ────────────────────────────────────────────────────

test("speak does not throw when voice is disabled", () => {
  setVoiceEnabled(false);
  assert.doesNotThrow(() => speak("Turn 1. Ally 0 moved.", "board-narration"));
});

test("speak does not throw when text is empty", () => {
  setVoiceEnabled(true);
  assert.doesNotThrow(() => speak("", "board-narration"));
  setVoiceEnabled(false);
});

test("speak does not throw when text is whitespace only", () => {
  setVoiceEnabled(true);
  assert.doesNotThrow(() => speak("   ", "board-narration"));
  setVoiceEnabled(false);
});

test("speak does not throw before markUserGestured even when enabled", () => {
  setVoiceEnabled(true);
  assert.doesNotThrow(() => speak("Turn 2. Ally 0 moved.", "board-narration"));
  setVoiceEnabled(false);
});

test("speak does not throw with no liveRegionId", () => {
  setVoiceEnabled(false);
  assert.doesNotThrow(() => speak("text"));
});

// ─── markUserGestured ─────────────────────────────────────────────────────────

test("markUserGestured does not throw", () => {
  assert.doesNotThrow(() => markUserGestured());
});

test("speak does not throw after markUserGestured when voice disabled", () => {
  markUserGestured();
  setVoiceEnabled(false);
  assert.doesNotThrow(() => speak("Turn 1. Ally 0 moved.", "board-narration"));
});

test("speak does not throw after markUserGestured when voice enabled (speechSynthesis absent)", () => {
  markUserGestured();
  setVoiceEnabled(true);
  assert.doesNotThrow(() => speak("Turn 1. Ally 0 moved.", "board-narration"));
  setVoiceEnabled(false);
});

// ─── cancelSpeech ────────────────────────────────────────────────────────────

test("cancelSpeech does not throw when speechSynthesis is absent", () => {
  assert.doesNotThrow(() => cancelSpeech());
});

test("cancelSpeech does not throw after voice is enabled", () => {
  setVoiceEnabled(true);
  assert.doesNotThrow(() => cancelSpeech());
  setVoiceEnabled(false);
});

test("initVoiceNarration retries populateVoicePicker when the hook is assigned after the first voice load", async () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  let populateCalls = 0;
  globalThis.window = {
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    },
    speechSynthesis: {
      getVoices: () => [
        {
          name: "Test Voice",
          lang: "en-US",
          voiceURI: "test-voice",
          default: true
        }
      ],
      addEventListener: () => {},
      removeEventListener: () => {},
      cancel: () => {},
      speak: () => {}
    },
    addEventListener: () => {},
    removeEventListener: () => {}
  };
  globalThis.document = {
    documentElement: {
      lang: "en"
    }
  };

  try {
    const app = { hooks: {} };
    initVoiceNarration(app);
    app.hooks.populateVoicePicker = () => {
      populateCalls += 1;
    };

    assert.equal(populateCalls, 0);
    await Promise.resolve();
    assert.equal(populateCalls, 1);
  } finally {
    if (typeof originalWindow === "undefined") {
      delete globalThis.window;
    } else {
      globalThis.window = originalWindow;
    }
    if (typeof originalDocument === "undefined") {
      delete globalThis.document;
    } else {
      globalThis.document = originalDocument;
    }
    setVoiceEnabled(false);
    setVoiceUri("");
  }
});
