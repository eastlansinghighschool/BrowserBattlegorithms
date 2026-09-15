import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CSS_PALETTE_FILES,
  extractCssColorOccurrences,
  extractHtmlInlineColorOccurrences
} from "./css-palette.mjs";
import { CHANNEL_TOKENS } from "./css-channel-tokens.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");

function replacementFor(raw, token) {
  const lower = raw.toLowerCase();
  if (lower === "transparent") return `rgb(var(${token}) / 0)`;
  if (lower.startsWith("rgba(")) {
    const components = raw.slice(raw.indexOf("(") + 1, -1).split(",").map((part) => part.trim());
    if (components.length !== 4) throw new Error(`Unsupported rgba() value: ${raw}`);
    return `rgb(var(${token}) / ${components[3]})`;
  }
  if (lower.startsWith("#") && (raw.length === 5 || raw.length === 9)) {
    throw new Error(`Alpha-bearing hex is not supported by this exact transform: ${raw}`);
  }
  return `rgb(var(${token}))`;
}

function replaceOccurrences(content, occurrences, file) {
  const replacements = occurrences
    .filter((occurrence) => occurrence.rgbTriple && CHANNEL_TOKENS[occurrence.rgbTriple.join(" ")])
    .map((occurrence) => ({
      start: occurrence.offset,
      end: occurrence.offset + occurrence.raw.length,
      replacement: replacementFor(occurrence.raw, CHANNEL_TOKENS[occurrence.rgbTriple.join(" ")])
    }))
    .sort((left, right) => right.start - left.start);

  let result = content;
  for (const replacement of replacements) {
    const actual = result.slice(replacement.start, replacement.end);
    if (actual !== content.slice(replacement.start, replacement.end)) {
      throw new Error(`Replacement offset drift in ${file} at ${replacement.start}`);
    }
    result = `${result.slice(0, replacement.start)}${replacement.replacement}${result.slice(replacement.end)}`;
  }
  return { content: result, replacements: replacements.length };
}

let replacementCount = 0;
for (const file of CSS_PALETTE_FILES) {
  const fullPath = path.resolve(REPO_ROOT, file);
  const original = fs.readFileSync(fullPath, "utf8");
  const occurrences = extractCssColorOccurrences(original);
  const transformed = replaceOccurrences(original, occurrences, file);
  fs.writeFileSync(fullPath, transformed.content, "utf8");
  replacementCount += transformed.replacements;
}

const htmlPath = path.resolve(REPO_ROOT, "index.html");
const htmlOriginal = fs.readFileSync(htmlPath, "utf8");
const htmlTransformed = replaceOccurrences(
  htmlOriginal,
  extractHtmlInlineColorOccurrences(htmlOriginal),
  "index.html"
);
fs.writeFileSync(htmlPath, htmlTransformed.content, "utf8");
replacementCount += htmlTransformed.replacements;

console.log(`Replaced ${replacementCount} recurring RGB color operands with channel tokens`);
