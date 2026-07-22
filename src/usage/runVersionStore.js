/**
 * runVersionStore.js
 *
 * Usage Tracker V2 Run-Version Store
 *
 * Tier 2 of Plan 84 data model: diff-deduped record of "unique program states
 * that were actually run." Local-only by default; not exported until Plan 108.
 *
 * Settled values (owner decision 2026-07-21):
 * - total byte budget for run-version store: ~2 MB
 * - guided level window D1: last ~8 levels encountered, cross-session
 * - free-play window D2: last ~20 distinct run-versions by recency, keyed per
 *   team slot (`freeplay:team1` / `freeplay:team2`, owner decision 2026-07-21)
 * - per-level guided cap K = 5: first + last + most-recent-5 unique runs
 */

import { hashXml } from "./learningLedger.js";

function cloneJson(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

export const RUN_VERSION_BUDGET_BYTES = 2 * 1024 * 1024;
export const RUN_VERSION_GUIDED_LEVEL_WINDOW = 8;
export const RUN_VERSION_FREE_PLAY_WINDOW = 20;
export const RUN_VERSION_GUIDED_PER_LEVEL_CAP = 5; // K in Plan 84 B6

function getXmlByteLength(xmlText) {
  if (typeof xmlText !== "string") {
    return 0;
  }
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(xmlText).length;
  }
  return xmlText.length;
}

export function hashRunVersionXml(xmlText) {
  return hashXml(xmlText) || "";
}

export function createRunVersionStore(overrides = {}) {
  // Free-play buckets are keyed by team slot. Accept either the new keyed shape
  // or a legacy flat `freePlay.versions` array and migrate it into the keyed
  // shape using the stored contextKey (defaulting to team1).
  const freePlay = {};
  if (Array.isArray(overrides?.freePlay?.versions)) {
    for (const version of overrides.freePlay.versions) {
      const key = version.contextKey || "freeplay:team1";
      if (!freePlay[key]) {
        freePlay[key] = { versions: [] };
      }
      freePlay[key].versions.push(cloneJson(version));
    }
  } else if (overrides?.freePlay && typeof overrides.freePlay === "object") {
    for (const [key, entry] of Object.entries(overrides.freePlay)) {
      if (entry && Array.isArray(entry.versions)) {
        freePlay[key] = { versions: cloneJson(entry.versions) };
      }
    }
  }

  return {
    guided: overrides?.guided && typeof overrides.guided === "object"
      ? cloneJson(overrides.guided)
      : {},
    freePlay,
    flags: {
      runVersionStoreTruncated: Boolean(overrides?.flags?.runVersionStoreTruncated),
      runVersionStoreBytes: Number(overrides?.flags?.runVersionStoreBytes) || 0
    }
  };
}

export function inferRunVersionContext(state, runner) {
  if (!state) {
    return null;
  }
  const modeView = state.currentModeView;
  if (modeView === "GUIDED_LEVELS") {
    const levelId = state.currentLevelId;
    return levelId ? { type: "guided", levelId } : null;
  }
  // Free-play (and any non-guided mode) is keyed per team slot, mirroring the
  // per-team stored workspaces. Per-program "slot" concepts remain deferred
  // per Plan 84 / decision-log 2026-07-21.
  const teamId = Number(runner?.team) === 2 ? 2 : 1;
  return { type: "freePlay", contextKey: `freeplay:team${teamId}` };
}

function createVersion(xmlText, at, extra = {}) {
  const hash = hashRunVersionXml(xmlText);
  return {
    at,
    hash,
    xmlText,
    sizeBytes: getXmlByteLength(xmlText),
    ...extra
  };
}

function applyGuidedPerLevelCap(entry, k) {
  // Keep first + last + most-recent-k unique runs.
  // chronological order: versions[0] is first, versions.at(-1) is last.
  if (!entry.versions || entry.versions.length <= k + 2) {
    return;
  }
  entry.versions = [entry.versions[0], ...entry.versions.slice(-k - 1)];
}

export function recordRunVersion(store, context, xmlText, at = new Date().toISOString()) {
  if (!store || !context || typeof xmlText !== "string" || !xmlText) {
    return { stored: false, reason: "missing_input" };
  }

  const hash = hashRunVersionXml(xmlText);
  if (!hash) {
    return { stored: false, reason: "unhashable" };
  }

  if (context.type === "guided") {
    return recordGuidedRunVersion(store, context.levelId, xmlText, hash, at);
  }

  return recordFreePlayRunVersion(store, xmlText, hash, at, context);
}

function recordGuidedRunVersion(store, levelId, xmlText, hash, at) {
  if (!store.guided[levelId]) {
    store.guided[levelId] = {
      levelId,
      versions: []
    };
  }
  const entry = store.guided[levelId];

  const lastVersion = entry.versions.at(-1);
  if (lastVersion && lastVersion.hash === hash) {
    return { stored: false, reason: "duplicate_of_last" };
  }

  entry.versions.push(createVersion(xmlText, at));
  applyGuidedPerLevelCap(entry, RUN_VERSION_GUIDED_PER_LEVEL_CAP);
  return { stored: true, reason: "new_guided_version" };
}

function recordFreePlayRunVersion(store, xmlText, hash, at, context) {
  const contextKey = context.contextKey || "freeplay:team1";
  if (!store.freePlay[contextKey]) {
    store.freePlay[contextKey] = { versions: [] };
  }
  const bucket = store.freePlay[contextKey];
  const lastVersion = bucket.versions.at(-1);
  if (lastVersion && lastVersion.hash === hash) {
    return { stored: false, reason: "duplicate_of_last" };
  }

  bucket.versions.push(createVersion(xmlText, at, { contextKey }));
  return { stored: true, reason: "new_free_play_version" };
}

export function computeRunVersionStoreBytes(store) {
  if (!store) {
    return 0;
  }
  let bytes = 0;
  for (const entry of Object.values(store.guided || {})) {
    for (const version of entry.versions || []) {
      bytes += version.sizeBytes || 0;
    }
  }
  for (const bucket of Object.values(store.freePlay || {})) {
    for (const version of bucket.versions || []) {
      bytes += version.sizeBytes || 0;
    }
  }
  return bytes;
}

export function normalizeRunVersionStore(store, budgetBytes = RUN_VERSION_BUDGET_BYTES) {
  if (!store) {
    return;
  }

  // D2 window: each team bucket keeps its own last ~20 distinct versions.
  for (const bucket of Object.values(store.freePlay || {})) {
    if (bucket.versions?.length > RUN_VERSION_FREE_PLAY_WINDOW) {
      bucket.versions = bucket.versions.slice(-RUN_VERSION_FREE_PLAY_WINDOW);
      store.flags.runVersionStoreTruncated = true;
    }
  }

  // D1 window: last ~8 guided levels by recency of last version.
  const guidedEntries = Object.values(store.guided || {});
  if (guidedEntries.length > RUN_VERSION_GUIDED_LEVEL_WINDOW) {
    const sorted = guidedEntries
      .map((entry) => ({ entry, lastAt: entry.versions.at(-1)?.at || "" }))
      .sort((a, b) => a.lastAt.localeCompare(b.lastAt));
    const toKeep = new Set(
      sorted.slice(-RUN_VERSION_GUIDED_LEVEL_WINDOW).map((item) => item.entry.levelId)
    );
    for (const levelId of Object.keys(store.guided)) {
      if (!toKeep.has(levelId)) {
        delete store.guided[levelId];
        store.flags.runVersionStoreTruncated = true;
      }
    }
  }

  // Per-level cap K = 5.
  for (const entry of Object.values(store.guided)) {
    applyGuidedPerLevelCap(entry, RUN_VERSION_GUIDED_PER_LEVEL_CAP);
  }

  // Byte budget enforcement with graceful degradation.
  // 1. Evict oldest free-play versions first.
  // 2. Then evict oldest guided-level windows.
  // 3. If a single remaining version still exceeds the budget, drop it and flag.
  let currentBytes = computeRunVersionStoreBytes(store);
  if (currentBytes > budgetBytes) {
    while (currentBytes > budgetBytes) {
      const removed = evictOldestFreePlayVersion(store);
      if (!removed) {
        break;
      }
      currentBytes = computeRunVersionStoreBytes(store);
      store.flags.runVersionStoreTruncated = true;
    }
  }
  if (currentBytes > budgetBytes) {
    const sortedEntries = Object.values(store.guided || {})
      .map((entry) => ({ entry, lastAt: entry.versions.at(-1)?.at || "" }))
      .sort((a, b) => a.lastAt.localeCompare(b.lastAt));
    while (sortedEntries.length > 0 && currentBytes > budgetBytes) {
      const removed = sortedEntries.shift();
      delete store.guided[removed.entry.levelId];
      currentBytes = computeRunVersionStoreBytes(store);
      store.flags.runVersionStoreTruncated = true;
    }
  }
  if (currentBytes > budgetBytes) {
    // A single version is larger than the total budget; store nothing.
    store.guided = {};
    store.freePlay = {};
    store.flags.runVersionStoreTruncated = true;
    currentBytes = 0;
  }

  store.flags.runVersionStoreBytes = currentBytes;
}

function evictOldestFreePlayVersion(store) {
  let oldest = null;
  for (const [contextKey, bucket] of Object.entries(store.freePlay || {})) {
    const first = bucket.versions?.[0];
    if (first && (!oldest || first.at < oldest.version.at)) {
      oldest = { contextKey, version: first };
    }
  }
  if (!oldest) {
    return false;
  }
  const bucket = store.freePlay[oldest.contextKey];
  bucket.versions.shift();
  if (bucket.versions.length === 0) {
    delete store.freePlay[oldest.contextKey];
  }
  return true;
}

export function getRunVersionDebugSummary(store) {
  if (!store) {
    return { guidedLevelCount: 0, freePlayVersionCount: 0, bytes: 0 };
  }
  return {
    guidedLevelCount: Object.keys(store.guided || {}).length,
    freePlayVersionCount: Object.values(store.freePlay || {})
      .reduce((sum, bucket) => sum + (bucket.versions?.length || 0), 0),
    bytes: computeRunVersionStoreBytes(store)
  };
}
