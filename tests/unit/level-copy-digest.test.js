import test from "node:test";
import assert from "node:assert/strict";
import { renderLevelCopyDigest } from "../../src/dev/levelCopyDigest.js";

test("copy digest groups levels by source phase and preserves copy fields", () => {
  const markdown = renderLevelCopyDigest({
    levels: [
      {
        id: "sample-level",
        title: "Sample Level",
        sourcePath: "src/config/levels/phases/resources-and-territory/sample.js",
        description: "Reach the marked square.",
        introText: "Watch the lane.",
        tips: ["Read the board first."],
        tutorialSteps: [{
          id: "step-1",
          title: "Read The Board",
          body: "Notice what is directly ahead.",
          demoBlocklyXml: "<xml />",
          demoTitle: "A Board Question",
          demoCaption: "Watch the board before choosing."
        }],
        setup: {
          teams: {
            opponent: {
              runners: [{ isFrozen: false }, { isFrozen: true }]
            }
          }
        },
        boardDynamicsTier: "background-motion",
        winCondition: { type: "runner_reaches_cell", targetCell: { x: 1, y: 2 } }
      }
    ],
    lintDiagnostics: [{
      levelId: "sample-level",
      contract: "copy-voice-banned-phrase",
      message: "tips[0] contains a banned phrase"
    }]
  });

  assert.match(markdown, /## Phase: resources-and-territory/);
  assert.match(markdown, /- source: `src\/config\/levels\/phases\/resources-and-territory\/sample\.js`/);
  assert.match(markdown, /- opponent runners: 1 live, 1 frozen/);
  assert.match(markdown, /- boardDynamicsTier: background-motion/);
  assert.match(markdown, /- copy-voice-banned-phrase: tips\[0\] contains a banned phrase/);
  assert.match(markdown, /Reach the marked square\./);
  assert.match(markdown, /Notice what is directly ahead\./);
  assert.match(markdown, /A Board Question/);
  assert.match(markdown, /Watch the board before choosing\./);
});

test("copy digest reports levels without optional copy or board metadata honestly", () => {
  const markdown = renderLevelCopyDigest({
    levels: [{
      id: "minimal-level",
      title: "Minimal Level",
      sourcePath: "src/config/levels/phases/foundations/minimal.js",
      description: "",
      introText: "",
      tips: [],
      tutorialSteps: [],
      winCondition: null
    }]
  });

  assert.match(markdown, /- opponent runners: not found/);
  assert.match(markdown, /- boardDynamicsTier: not set/);
  assert.match(markdown, /#### Tips\n- none/);
  assert.match(markdown, /#### Tutorial Steps\n- none/);
  assert.match(markdown, /~~~text\n\n~~~/);
});
