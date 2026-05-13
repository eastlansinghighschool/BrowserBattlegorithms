import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildUsageExportWithIntegrity } from "../../src/usage/usageAnalyzer.js";

function createSeededRandom(seedText) {
  let seed = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
  }
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

function pickRange(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

function profileRanges(profileName) {
  if (profileName === "Gave-Up Gabi") {
    return {
      passMs: [110000, 150000],
      failMs: [60000, 90000],
      thinkMs: [10000, 20000],
      retryMs: [15000, 30000],
      exportMs: [45000, 60000]
    };
  }
  if (profileName === "Challenged Charlie") {
    return {
      passMs: [135000, 195000],
      failMs: [60000, 100000],
      thinkMs: [12000, 25000],
      retryMs: [20000, 45000],
      exportMs: [60000, 90000]
    };
  }
  if (profileName === "Struggling Sam") {
    return {
      passMs: [125000, 180000],
      failMs: [45000, 75000],
      thinkMs: [10000, 22000],
      retryMs: [15000, 30000],
      exportMs: [60000, 75000]
    };
  }
  return {
    passMs: [115000, 165000],
    failMs: [0, 0],
    thinkMs: [10000, 20000],
    retryMs: [0, 0],
    exportMs: [45000, 75000]
  };
}

function toDate(ms) {
  return new Date(ms).toISOString();
}

function chunkIndices(total, groups) {
  if (groups <= 0) {
    return [];
  }
  const chunkSize = Math.ceil(total / groups);
  const ranges = [];
  for (let start = 0; start < total; start += chunkSize) {
    ranges.push([start, Math.min(total - 1, start + chunkSize - 1)]);
  }
  return ranges;
}

function spreadEventTimestamps(payload, profile) {
  const rng = createSeededRandom(`${profile.studentName}:${payload.sessionId}`);
  const ranges = profileRanges(profile.name);
  const startedAtMs = Date.parse(payload.sessionStartedAt || payload.startedAt || payload.exportedAt || new Date().toISOString());
  let currentMs = startedAtMs;

  const events = Array.isArray(payload.events) ? payload.events : [];
  const snapshots = Array.isArray(payload.snapshots) ? payload.snapshots : [];
  const attemptWindows = [];
  let currentWindow = null;

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    if (event.type === "level_started") {
      currentWindow = {
        levelId: event.data?.levelId || null,
        result: null,
        eventIndices: [index]
      };
    } else if (currentWindow) {
      currentWindow.eventIndices.push(index);
      if (event.type === "level_completed") {
        currentWindow.result = event.data?.result || null;
        attemptWindows.push(currentWindow);
        currentWindow = null;
      }
    }
  }

  const windowByLevelId = new Map();
  attemptWindows.forEach((window) => {
    if (!windowByLevelId.has(window.levelId)) {
      windowByLevelId.set(window.levelId, []);
    }
    windowByLevelId.get(window.levelId).push(window);
  });

  const levelGroups = chunkIndices(events.length, Math.max(1, attemptWindows.length));
  const assignedEventTimes = new Array(events.length).fill(null);

  let windowIndex = 0;
  for (const window of attemptWindows) {
    const windowGroup = levelGroups[windowIndex] || [0, events.length - 1];
    windowIndex += 1;
    const [startIndex, endIndex] = windowGroup;
    const durationMs = window.result === "FAILED"
      ? pickRange(rng, ranges.failMs[0], ranges.failMs[1])
      : pickRange(rng, ranges.passMs[0], ranges.passMs[1]);
    const windowStartMs = currentMs + pickRange(rng, ranges.thinkMs[0], ranges.thinkMs[1]);
    const windowEndMs = windowStartMs + Math.max(60000, durationMs);
    const windowEventIndices = window.eventIndices.filter((eventIndex) => eventIndex >= startIndex && eventIndex <= endIndex);
    const usedIndices = windowEventIndices.length ? windowEventIndices : window.eventIndices;

    if (usedIndices.length === 1) {
      assignedEventTimes[usedIndices[0]] = windowStartMs;
    } else {
      usedIndices.forEach((eventIndex, position) => {
        const fraction = usedIndices.length === 1 ? 1 : position / (usedIndices.length - 1);
        assignedEventTimes[eventIndex] = Math.round(windowStartMs + (windowEndMs - windowStartMs) * fraction);
      });
    }

    currentMs = windowEndMs + (window.result === "FAILED"
      ? pickRange(rng, ranges.retryMs[0], ranges.retryMs[1])
      : pickRange(rng, ranges.thinkMs[0], ranges.thinkMs[1]));
  }

  for (let index = 0; index < events.length; index += 1) {
    if (assignedEventTimes[index] === null) {
      currentMs += 5000 + Math.round(rng() * 10000);
      assignedEventTimes[index] = currentMs;
    }
  }

  const orderedEvents = events.map((event, index) => ({
    ...event,
    at: toDate(assignedEventTimes[index])
  }));

  const snapshotGroups = new Map();
  for (const snapshot of snapshots) {
    const levelId = snapshot.data?.levelId || "__ungrouped__";
    if (!snapshotGroups.has(levelId)) {
      snapshotGroups.set(levelId, []);
    }
    snapshotGroups.get(levelId).push(snapshot);
  }

  const exportedAtMs = currentMs + pickRange(rng, ranges.exportMs[0], ranges.exportMs[1]);
  const startMs = startedAtMs;
  const snapshotTotal = snapshots.length;
  let snapshotIndex = 0;
  const orderedSnapshots = snapshots.map((snapshot) => {
    const levelId = snapshot.data?.levelId || null;
    const matchingWindows = levelId ? windowByLevelId.get(levelId) || [] : [];
    const windowPosition = matchingWindows.length ? Math.min(snapshotIndex, matchingWindows.length - 1) : -1;
    const baseMs = matchingWindows.length
      ? assignedEventTimes[matchingWindows[windowPosition].eventIndices[0]] || startMs
      : startMs;
    const spreadMs = Math.max(5000, Math.floor((exportedAtMs - startMs) / Math.max(1, snapshotTotal + 1)));
    const at = baseMs + spreadMs * (snapshotIndex + 1);
    snapshotIndex += 1;
    return {
      ...snapshot,
      at: toDate(Math.min(at, exportedAtMs - 1000))
    };
  });

  const session = {
    schemaVersion: payload.schemaVersion,
    sessionId: payload.sessionId,
    startedAt: toDate(startMs),
    updatedAt: orderedEvents.at(-1)?.at || toDate(startMs),
    appVersion: payload.appVersion,
    summary: payload.summary,
    events: orderedEvents,
    snapshots: orderedSnapshots
  };

  const adjusted = buildUsageExportWithIntegrity(session, profile.studentName, toDate(exportedAtMs));
  return adjusted;
}

export async function rewriteUsageExportFile(filePath, profile) {
  const absolutePath = resolve(filePath);
  const payload = JSON.parse(await readFile(absolutePath, "utf8"));
  const adjusted = spreadEventTimestamps(payload, profile);
  await writeFile(absolutePath, `${JSON.stringify(adjusted, null, 2)}\n`, "utf8");
  return adjusted;
}
