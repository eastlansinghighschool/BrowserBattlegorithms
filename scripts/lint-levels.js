#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadLevelReadinessContext } from "../src/dev/levelReadiness.js";

export * from "../src/dev/levelLintCore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

function toRepoRelative(filePath) {
  if (!filePath) {
    return null;
  }

  let candidate = filePath;
  if (candidate.startsWith("file://")) {
    try {
      candidate = fileURLToPath(candidate);
    } catch {
      return candidate;
    }
  }

  if (path.isAbsolute(candidate)) {
    candidate = path.relative(REPO_ROOT, candidate);
  }

  return candidate.split(path.sep).join("/");
}

export function formatDiagnostic(diagnostic) {
  const filePart = diagnostic.file ? ` (${toRepoRelative(diagnostic.file)})` : "";
  return `${diagnostic.severity} ${diagnostic.levelId} ${diagnostic.contract}: ${diagnostic.message}${filePart}`;
}

export async function main({
  logger = console
} = {}) {
  const context = await loadLevelReadinessContext();
  const diagnostics = context.lintDiagnostics || [];

  for (const diagnostic of diagnostics) {
    logger?.error?.(formatDiagnostic(diagnostic));
  }

  const exitCode = diagnostics.some((diagnostic) => diagnostic.severity === "error") ? 1 : 0;
  return { diagnostics, exitCode };
}

const isDirectExecution =
  typeof process !== "undefined" &&
  process.argv?.[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectExecution) {
  main()
    .then(({ exitCode }) => {
      process.exitCode = exitCode;
    })
    .catch((error) => {
      console.error(error instanceof Error ? error.stack || error.message : String(error));
      process.exitCode = 1;
    });
}
