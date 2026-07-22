import test from "node:test";
import assert from "node:assert/strict";
import {
  RUN_VERSION_BUDGET_BYTES,
  RUN_VERSION_FREE_PLAY_WINDOW,
  RUN_VERSION_GUIDED_LEVEL_WINDOW,
  RUN_VERSION_GUIDED_PER_LEVEL_CAP,
  hashRunVersionXml,
  computeRunVersionStoreBytes,
  createRunVersionStore,
  inferRunVersionContext,
  normalizeRunVersionStore,
  recordRunVersion
} from "../../src/usage/runVersionStore.js";

function makeXml(seed) {
  return `<xml xmlns="https://developers.google.com/blockly/xml"><block type="${seed}"></block></xml>`;
}

test("createRunVersionStore produces empty guided/freePlay buckets and flags", () => {
  const store = createRunVersionStore();
  assert.deepEqual(store.guided, {});
  assert.deepEqual(store.freePlay, {});
  assert.equal(store.flags.runVersionStoreTruncated, false);
  assert.equal(store.flags.runVersionStoreBytes, 0);
});

test("inferRunVersionContext returns guided context for GUIDED_LEVELS", () => {
  const context = inferRunVersionContext({ currentModeView: "GUIDED_LEVELS", currentLevelId: "level-1" });
  assert.deepEqual(context, { type: "guided", levelId: "level-1" });
});

test("inferRunVersionContext returns freePlay context keyed by team slot", () => {
  assert.deepEqual(
    inferRunVersionContext({ currentModeView: "FREE_PLAY", currentLevelId: null }, { team: 1 }),
    { type: "freePlay", contextKey: "freeplay:team1" }
  );
  assert.deepEqual(
    inferRunVersionContext({ currentModeView: "FREE_PLAY" }, { team: 2 }),
    { type: "freePlay", contextKey: "freeplay:team2" }
  );
  assert.deepEqual(
    inferRunVersionContext({ currentModeView: "FREE_PLAY" }, null),
    { type: "freePlay", contextKey: "freeplay:team1" }
  );
});

test("recordRunVersion stores only distinct-from-last guided runs", () => {
  const store = createRunVersionStore();
  const a = makeXml("block_a");
  const b = makeXml("block_b");
  const c = makeXml("block_a"); // same hash as a

  assert.equal(recordRunVersion(store, { type: "guided", levelId: "lvl" }, a, "2026-07-21T10:00:00Z").stored, true);
  assert.equal(recordRunVersion(store, { type: "guided", levelId: "lvl" }, a, "2026-07-21T10:00:01Z").stored, false);
  assert.equal(recordRunVersion(store, { type: "guided", levelId: "lvl" }, b, "2026-07-21T10:00:02Z").stored, true);
  // A again: differs from last stored (b), so it is stored again.
  assert.equal(recordRunVersion(store, { type: "guided", levelId: "lvl" }, c, "2026-07-21T10:00:03Z").stored, true);

  assert.equal(store.guided["lvl"].versions.length, 3);
  assert.equal(store.guided["lvl"].versions[0].hash, hashRunVersionXml(a));
  assert.equal(store.guided["lvl"].versions.at(-1).hash, hashRunVersionXml(c));
});

test("recordRunVersion stores only distinct-from-last free-play runs per team", () => {
  const store = createRunVersionStore();
  const a = makeXml("fp_a");
  const b = makeXml("fp_b");

  assert.equal(recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team1" }, a, "2026-07-21T10:00:00Z").stored, true);
  assert.equal(recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team1" }, a, "2026-07-21T10:00:01Z").stored, false);
  assert.equal(recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team1" }, b, "2026-07-21T10:00:02Z").stored, true);

  assert.equal(store.freePlay["freeplay:team1"].versions.length, 2);
});

test("recordRunVersion keeps interleaved PvP team programs in separate dedupe chains", () => {
  const store = createRunVersionStore();
  const team1Program = makeXml("pvp_team1_move");
  const team2Program = makeXml("pvp_team2_move");

  // Interleave turns: team1, team2, team1, team2 (neither program changes).
  const team1 = { type: "freePlay", contextKey: "freeplay:team1" };
  const team2 = { type: "freePlay", contextKey: "freeplay:team2" };

  assert.equal(recordRunVersion(store, team1, team1Program, "2026-07-21T10:00:00Z").stored, true);
  assert.equal(recordRunVersion(store, team2, team2Program, "2026-07-21T10:00:01Z").stored, true);
  assert.equal(recordRunVersion(store, team1, team1Program, "2026-07-21T10:00:02Z").stored, false);
  assert.equal(recordRunVersion(store, team2, team2Program, "2026-07-21T10:00:03Z").stored, false);

  assert.equal(store.freePlay["freeplay:team1"].versions.length, 1);
  assert.equal(store.freePlay["freeplay:team2"].versions.length, 1);

  // Changing only team1's program creates a new version for team1 only.
  const team1ProgramV2 = makeXml("pvp_team1_move_v2");
  assert.equal(recordRunVersion(store, team1, team1ProgramV2, "2026-07-21T10:00:04Z").stored, true);
  assert.equal(recordRunVersion(store, team2, team2Program, "2026-07-21T10:00:05Z").stored, false);

  assert.equal(store.freePlay["freeplay:team1"].versions.length, 2);
  assert.equal(store.freePlay["freeplay:team2"].versions.length, 1);
});

test("guided per-level cap keeps first + last + most-recent-K", () => {
  const store = createRunVersionStore();
  const versions = [];
  for (let i = 0; i < 12; i++) {
    const xml = makeXml(`block_${i}`);
    versions.push(xml);
    recordRunVersion(store, { type: "guided", levelId: "lvl" }, xml, `2026-07-21T10:00:${String(i).padStart(2, "0")}Z`);
  }

  const entry = store.guided["lvl"];
  const k = RUN_VERSION_GUIDED_PER_LEVEL_CAP;
  assert.equal(entry.versions.length, k + 2);
  assert.equal(entry.versions[0].hash, hashRunVersionXml(versions[0]));
  assert.equal(entry.versions.at(-1).hash, hashRunVersionXml(versions.at(-1)));
  // Most recent K before the last should be present.
  assert.equal(entry.versions[entry.versions.length - 2].hash, hashRunVersionXml(versions.at(-2)));
  // The dropped version is the middle one.
  assert.ok(!entry.versions.find((v) => v.hash === hashRunVersionXml(versions[2])));
});

test("D1 window keeps only the last ~8 guided levels", () => {
  const store = createRunVersionStore();
  for (let i = 0; i < 12; i++) {
    recordRunVersion(store, { type: "guided", levelId: `level-${i}` }, makeXml(`lvl_${i}`), `2026-07-21T10:00:${String(i).padStart(2, "0")}Z`);
  }
  normalizeRunVersionStore(store);

  assert.equal(Object.keys(store.guided).length, RUN_VERSION_GUIDED_LEVEL_WINDOW);
  // Oldest 4 should be evicted.
  assert.equal(store.guided["level-0"], undefined);
  assert.equal(store.guided["level-3"], undefined);
  assert.ok(store.guided["level-4"]);
  assert.ok(store.guided["level-11"]);
});

test("D2 window keeps only the last ~20 free-play versions per team bucket", () => {
  const store = createRunVersionStore();
  for (let i = 0; i < 25; i++) {
    recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team1" }, makeXml(`fp_${i}`), `2026-07-21T10:00:${String(i).padStart(2, "0")}Z`);
  }
  normalizeRunVersionStore(store);

  assert.equal(store.freePlay["freeplay:team1"].versions.length, RUN_VERSION_FREE_PLAY_WINDOW);
  assert.equal(store.freePlay["freeplay:team1"].versions[0].hash, hashRunVersionXml(makeXml("fp_5")));
  assert.equal(store.freePlay["freeplay:team1"].versions.at(-1).hash, hashRunVersionXml(makeXml("fp_24")));
  assert.equal(store.flags.runVersionStoreTruncated, true);
});

test("D2 window is enforced independently per team bucket", () => {
  const store = createRunVersionStore();
  for (let i = 0; i < 25; i++) {
    recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team1" }, makeXml(`t1_${i}`), `2026-07-21T10:00:${String(i).padStart(2, "0")}Z`);
    recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team2" }, makeXml(`t2_${i}`), `2026-07-21T10:00:${String(i + 25).padStart(2, "0")}Z`);
  }
  normalizeRunVersionStore(store);
  assert.equal(store.freePlay["freeplay:team1"].versions.length, RUN_VERSION_FREE_PLAY_WINDOW);
  assert.equal(store.freePlay["freeplay:team2"].versions.length, RUN_VERSION_FREE_PLAY_WINDOW);
  assert.equal(store.flags.runVersionStoreTruncated, true);
});

test("byte budget enforcement evicts oldest free-play versions first", () => {
  const store = createRunVersionStore();
  const bigXml = "x".repeat(1000);
  const bigXmlB = "y".repeat(1000);
  for (let i = 0; i < 30; i++) {
    recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team1" }, i % 2 === 0 ? bigXml : bigXmlB, `2026-07-21T10:00:${String(i).padStart(2, "0")}Z`);
  }
  normalizeRunVersionStore(store, 5000);

  assert.ok(computeRunVersionStoreBytes(store) <= 5000);
  assert.equal(store.flags.runVersionStoreTruncated, true);
  // Oldest free-play versions should have been evicted to meet budget.
  assert.ok(store.freePlay["freeplay:team1"].versions.length < 30);
});

test("byte budget enforcement evicts oldest guided-level windows when free-play is exhausted", () => {
  const store = createRunVersionStore();
  const bigXml = "x".repeat(1000);
  for (let i = 0; i < 5; i++) {
    recordRunVersion(store, { type: "guided", levelId: `level-${i}` }, bigXml, `2026-07-21T10:00:${String(i).padStart(2, "0")}Z`);
  }
  for (let i = 0; i < 3; i++) {
    recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team1" }, bigXml, `2026-07-21T10:00:${String(i + 5).padStart(2, "0")}Z`);
  }
  normalizeRunVersionStore(store, 2500);

  assert.ok(computeRunVersionStoreBytes(store) <= 2500);
  assert.equal(store.flags.runVersionStoreTruncated, true);
  // Oldest guided levels should be evicted.
  assert.equal(store.guided["level-0"], undefined);
  assert.equal(store.guided["level-1"], undefined);
  assert.ok(store.guided["level-4"]);
  assert.equal(Object.keys(store.freePlay).length, 0);
});

test("single version larger than budget is not stored and sets flag", () => {
  const store = createRunVersionStore();
  const hugeXml = "x".repeat(100);
  recordRunVersion(store, { type: "guided", levelId: "huge" }, hugeXml, "2026-07-21T10:00:00Z");
  normalizeRunVersionStore(store, 50);

  assert.equal(Object.keys(store.guided).length, 0);
  assert.deepEqual(store.freePlay, {});
  assert.equal(store.flags.runVersionStoreTruncated, true);
  assert.equal(store.flags.runVersionStoreBytes, 0);
});

test("normalization preserves cross-session shape for rehydration", () => {
  const store = createRunVersionStore();
  recordRunVersion(store, { type: "guided", levelId: "lvl" }, makeXml("a"), "2026-07-21T10:00:00Z");
  recordRunVersion(store, { type: "guided", levelId: "lvl" }, makeXml("b"), "2026-07-21T10:00:01Z");
  recordRunVersion(store, { type: "freePlay", contextKey: "freeplay:team1" }, makeXml("fp"), "2026-07-21T10:00:02Z");
  normalizeRunVersionStore(store);

  const rehydrated = createRunVersionStore(store);
  assert.equal(rehydrated.guided["lvl"].versions.length, 2);
  assert.equal(rehydrated.freePlay["freeplay:team1"].versions.length, 1);
  assert.equal(rehydrated.flags.runVersionStoreTruncated, store.flags.runVersionStoreTruncated);
  assert.equal(rehydrated.flags.runVersionStoreBytes, store.flags.runVersionStoreBytes);
});

test("legacy flat freePlay.versions array migrates to keyed shape on rehydration", () => {
  const legacyStore = {
    freePlay: {
      versions: [
        {
          at: "2026-07-21T10:00:00Z",
          hash: hashRunVersionXml(makeXml("legacy")),
          xmlText: makeXml("legacy"),
          sizeBytes: 100,
          contextKey: "freeplay:team2"
        }
      ]
    }
  };
  const store = createRunVersionStore(legacyStore);
  assert.equal(store.freePlay["freeplay:team2"].versions.length, 1);
});
