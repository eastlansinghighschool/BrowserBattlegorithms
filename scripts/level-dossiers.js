#!/usr/bin/env node
import path from "node:path";
import { generateGuidedLevelDossiers, GUIDED_LEVEL_DOSSIER_OUTPUT_DIR } from "../src/dev/levelDossiers.js";

function parseArgs(argv) {
  const args = { help: false, outputDir: null };
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
  }
  return args;
}

function printHelp() {
  console.log([
    "Usage:",
    "  npm run level:dossiers",
    "  npm run level:dossiers -- --output-dir <path>",
    "",
    "Options:",
    "  --output-dir  Override the generated report folder.",
    "  -h, --help    Show this help message."
  ].join("\n"));
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  const outputDir = args.outputDir ? path.resolve(args.outputDir) : GUIDED_LEVEL_DOSSIER_OUTPUT_DIR;
  const result = await generateGuidedLevelDossiers({ outputDir });
  console.log(`Generated ${result.dossiers.length} guided level dossiers in ${outputDir}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
