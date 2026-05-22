#!/usr/bin/env node
import path from "node:path";
import {
  generateGuidedLevelBehaviorEvidence,
  GUIDED_LEVEL_BEHAVIOR_OUTPUT_DIR,
  GUIDED_LEVEL_BEHAVIOR_SUMMARY_INDEX_PATH
} from "../src/dev/levelBehaviorEvidence.js";

function parseArgs(argv) {
  const args = { help: false, outputDir: null, summaryIndexPath: null };
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token === "--output-dir") {
      args.outputDir = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (token === "--summary-index") {
      args.summaryIndexPath = argv[index + 1] || null;
      index += 1;
      continue;
    }
  }
  return args;
}

function printHelp() {
  console.log([
    "Usage:",
    "  npm run level:behavior-evidence",
    "  npm run level:behavior-evidence -- --output-dir <path>",
    "  npm run level:behavior-evidence -- --summary-index <path>",
    "",
    "Options:",
    "  --output-dir      Override the generated behavior-evidence folder.",
    "  --summary-index   Override the generated behavior-summary-index.md path.",
    "  -h, --help        Show this help message."
  ].join("\n"));
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  const outputDir = args.outputDir ? path.resolve(args.outputDir) : GUIDED_LEVEL_BEHAVIOR_OUTPUT_DIR;
  const summaryIndexPath = args.summaryIndexPath ? path.resolve(args.summaryIndexPath) : GUIDED_LEVEL_BEHAVIOR_SUMMARY_INDEX_PATH;
  const result = await generateGuidedLevelBehaviorEvidence({ outputDir, summaryIndexPath });
  console.log(`Generated ${result.entries.length} guided level behavior evidence files in ${outputDir}`);
  console.log(`Summary index: ${summaryIndexPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
