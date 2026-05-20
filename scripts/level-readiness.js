#!/usr/bin/env node
import {
  buildLevelReadinessResult,
  formatReadinessSummary
} from "../src/dev/levelReadiness.js";
import { formatLevelReadinessPrompt } from "../src/dev/levelReadinessPrompt.js";

function parseArgs(argv) {
  const args = { json: false, prompt: false, levelId: null };
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--json") {
      args.json = true;
      continue;
    }
    if (token === "--prompt") {
      args.prompt = true;
      continue;
    }
    if (token === "--level") {
      args.levelId = argv[index + 1] || null;
      index += 1;
      continue;
    }
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
  }
  return args;
}

function printHelp() {
  console.log([
    "Usage:",
    "  npm run level:readiness -- --level <levelId>",
    "  npm run level:readiness -- --level <levelId> --json",
    "  npm run level:readiness -- --level <levelId> --prompt",
    "",
    "Options:",
    "  --level   Guided level id to inspect.",
    "  --json    Emit machine-readable JSON.",
    "  --prompt  Emit a deterministic Markdown repair prompt.",
    "  -h, --help Show this help message."
  ].join("\n"));
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }
  if (!args.levelId) {
    throw new Error("Missing required --level <levelId> argument.");
  }
  if (args.json && args.prompt) {
    throw new Error("Use only one of --json or --prompt.");
  }

  const result = await buildLevelReadinessResult(args.levelId);
  if (args.prompt) {
    console.log(formatLevelReadinessPrompt(result));
    return;
  }
  if (args.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(formatReadinessSummary(result));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
