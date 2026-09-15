import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CSS_PALETTE_FILES,
  extractCssColorOccurrences,
  extractHtmlInlineColorOccurrences
} from "./css-palette.mjs";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DEFAULT_OUTPUT = path.resolve(REPO_ROOT, "tests/fixtures/css-palette-baseline.json");

function readCssSites(file) {
  const content = fs.readFileSync(path.resolve(REPO_ROOT, file), "utf8");
  return extractCssColorOccurrences(content, { includeDynamic: true }).map((site) => ({
    file,
    ...site
  }));
}

function readHtmlSites(file) {
  const content = fs.readFileSync(path.resolve(REPO_ROOT, file), "utf8");
  return extractHtmlInlineColorOccurrences(content, { includeDynamic: true }).map((site) => ({
    file,
    ...site
  }));
}

const cssSites = CSS_PALETTE_FILES.flatMap(readCssSites);
const htmlSites = readHtmlSites("index.html");
const sites = [...cssSites, ...htmlSites].map((site, index) => ({
  id: `${site.file}:${index}`,
  file: site.file,
  line: site.line,
  selector: site.selector,
  property: site.property,
  declarationOrdinal: site.declarationOrdinal,
  occurrenceInDeclaration: site.occurrenceInDeclaration,
  raw: site.raw,
  canonical: site.canonical,
  rgbTriple: site.rgbTriple,
  nature: site.nature
}));

const staticSites = sites.filter((site) => site.nature === "static");
const rgbTriples = new Set(staticSites.filter((site) => site.rgbTriple).map((site) => site.rgbTriple.join(" ")));
const recurringRgbTriples = new Set();
for (const triple of rgbTriples) {
  const fileCount = new Set(
    cssSites
      .filter((site) => site.nature === "static" && site.rgbTriple?.join(" ") === triple)
      .map((site) => site.file)
  ).size;
  if (fileCount >= 2) recurringRgbTriples.add(triple);
}

const baseline = {
  meta: {
    version: 2,
    targetFiles: [...CSS_PALETTE_FILES, "index.html"],
    cssTargetFiles: CSS_PALETTE_FILES,
    totalSites: sites.length,
    staticSites: staticSites.length,
    dynamicSites: sites.length - staticSites.length,
    distinctCanonicalValues: new Set(staticSites.map((site) => site.canonical)).size,
    distinctRgbTriples: rgbTriples.size,
    recurringRgbTriples: recurringRgbTriples.size,
    recurringRgbTripleScope: "CSS files only; index.html is included as a site when its triple is already recurring in CSS"
  },
  sites
};

const outputPath = path.resolve(REPO_ROOT, process.argv[2] ?? DEFAULT_OUTPUT);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(baseline, null, 2)}\n`, "utf8");
console.log(`Wrote ${sites.length} sites (${staticSites.length} static, ${sites.length - staticSites.length} dynamic) to ${path.relative(REPO_ROOT, outputPath)}`);
