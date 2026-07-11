#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  generateLevelCopyDigest,
  GUIDED_LEVEL_COPY_DIGEST_PATH
} from "../src/dev/levelCopyDigest.js";

function parseArgs(argv) {
  const args = { help: false, outputPath: null };
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token === "--output") {
      args.outputPath = argv[index + 1] || null;
      index += 1;
    }
  }
  return args;
}

function printHelp() {
  console.log([
    "Usage:",
    "  npm run level:copy-digest",
    "  npm run level:copy-digest -- --output <path>",
    "",
    "Options:",
    "  --output       Override the generated digest path.",
    "  -h, --help     Show this message."
  ].join("\n"));
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  const outputPath = args.outputPath
    ? path.resolve(args.outputPath)
    : GUIDED_LEVEL_COPY_DIGEST_PATH;
  const result = await generateLevelCopyDigest({ outputPath });
  console.log(`Generated guided level copy digest for ${result.levelCount} levels: ${outputPath}`);
}

const isDirectExecution =
  typeof process !== "undefined" &&
  process.argv?.[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
  });
}
