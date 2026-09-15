import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CSS_PALETTE_FILES,
  canonicalizeCssColor,
  extractChannelTokenReferences,
  extractCssColorOccurrences,
  extractCssDeclarations,
  extractHtmlInlineChannelTokenReferences,
  extractHtmlInlineColorOccurrences
} from "../../scripts/dev/css-palette.mjs";
import { CHANNEL_TOKENS, CHANNEL_TOKENS_BY_NAME } from "../../scripts/dev/css-channel-tokens.mjs";

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(__filename), "../..");
const baseline = JSON.parse(fs.readFileSync(path.resolve(REPO_ROOT, "tests/fixtures/css-palette-baseline.json"), "utf8"));

function readRepoFile(file) {
  return fs.readFileSync(path.resolve(REPO_ROOT, file), "utf8");
}

function rootChannelValues() {
  const style = readRepoFile("src/assets/styles/channel-tokens.css");
  return Object.fromEntries(
    extractCssDeclarations(style)
      .filter((declaration) => declaration.selector === ":root" && declaration.property.startsWith("--c-"))
      .map((declaration) => [declaration.property, declaration.value])
  );
}

function currentSlots(content, file) {
  const rawSlots = file === "index.html"
    ? extractHtmlInlineColorOccurrences(content, { includeDynamic: true })
        .filter((slot) => !slot.raw.includes("--c-"))
    : extractCssColorOccurrences(content, { includeDynamic: true })
        .filter((slot) => !slot.raw.includes("--c-"));
  const tokenSlots = file === "index.html"
    ? extractHtmlInlineChannelTokenReferences(content)
    : extractChannelTokenReferences(content);
  const slots = [
    ...rawSlots.map((slot) => ({ ...slot, kind: "raw" })),
    ...tokenSlots.map((slot) => ({ ...slot, kind: "token" }))
  ].sort((left, right) => left.offset - right.offset);
  const occurrenceByDeclaration = new Map();
  return slots.map((slot) => {
    const occurrenceInDeclaration = occurrenceByDeclaration.get(slot.declarationOrdinal) ?? 0;
    occurrenceByDeclaration.set(slot.declarationOrdinal, occurrenceInDeclaration + 1);
    return { ...slot, occurrenceInDeclaration };
  });
}

function resolvedTokenCanonical(token, alpha, rootValues) {
  assert.ok(Object.hasOwn(CHANNEL_TOKENS_BY_NAME, token), `Unknown channel token ${token}`);
  assert.equal(rootValues[token], CHANNEL_TOKENS_BY_NAME[token], `Root value for ${token} must match its mapping`);
  const channels = CHANNEL_TOKENS_BY_NAME[token];
  const components = channels.split(" ");
  return canonicalizeCssColor(alpha === null
    ? `rgb(${components.join(",")})`
    : `rgba(${components.join(",")},${alpha})`);
}

function assertWiring(sourceByFile, htmlSource = sourceByFile["index.html"]) {
  const rootValues = rootChannelValues();
  assert.deepEqual(Object.keys(rootValues).sort(), Object.values(CHANNEL_TOKENS).sort(), "Root must declare exactly the 21 channel tokens");

  for (const file of baseline.meta.targetFiles) {
    const content = file === "index.html" ? htmlSource : sourceByFile[file];
    const expectedSites = baseline.sites.filter((site) => site.file === file);
    const actualSites = currentSlots(content, file);
    assert.equal(actualSites.length, expectedSites.length, `${file}: color-site count changed`);

    for (const expected of expectedSites) {
      const actual = actualSites.find((site) =>
        site.declarationOrdinal === expected.declarationOrdinal &&
        site.occurrenceInDeclaration === expected.occurrenceInDeclaration
      );
      assert.ok(actual, `${file} declaration ${expected.declarationOrdinal} occurrence ${expected.occurrenceInDeclaration} is missing`);

      if (expected.nature === "dynamic") {
        assert.equal(actual.kind, "raw", `${file} declaration ${expected.declarationOrdinal} dynamic color must remain raw`);
        assert.equal(actual.raw, expected.raw, `${file} declaration ${expected.declarationOrdinal} dynamic color changed`);
        continue;
      }

      const expectedTriple = expected.rgbTriple?.join(" ");
      const shouldUseToken = expectedTriple && Object.hasOwn(CHANNEL_TOKENS, expectedTriple);
      if (shouldUseToken) {
        assert.equal(actual.kind, "token", `${file} declaration ${expected.declarationOrdinal} occurrence ${expected.occurrenceInDeclaration} must use a channel token`);
        const resolved = resolvedTokenCanonical(actual.token, actual.alpha, rootValues);
        assert.equal(
          resolved,
          expected.canonical,
          `${file} declaration ${expected.declarationOrdinal} occurrence ${expected.occurrenceInDeclaration}: token ${actual.token} resolved to ${resolved}; expected ${expected.canonical}`
        );
        assert.equal(actual.token, CHANNEL_TOKENS[expectedTriple], `${file} declaration ${expected.declarationOrdinal} occurrence ${expected.occurrenceInDeclaration} uses the wrong channel token`);
      } else {
        assert.equal(actual.kind, "raw", `${file} declaration ${expected.declarationOrdinal} occurrence ${expected.occurrenceInDeclaration} must remain out of scope`);
        assert.equal(actual.raw, expected.raw, `${file} declaration ${expected.declarationOrdinal} out-of-scope color changed`);
        assert.equal(actual.canonical, expected.canonical, `${file} declaration ${expected.declarationOrdinal} out-of-scope resolved value changed`);
      }
    }
  }
}

const cssSources = Object.fromEntries(CSS_PALETTE_FILES.map((file) => [file, readRepoFile(file)]));
const htmlSource = readRepoFile("index.html");

test("CSS palette — canonicalizer preserves exact color identity", () => {
  assert.equal(canonicalizeCssColor("#ABC"), "#aabbcc");
  assert.equal(canonicalizeCssColor("rgb(0,0,0)"), "#000000");
  assert.equal(canonicalizeCssColor("rgba(0,0,0,1)"), "#000000");
  assert.equal(canonicalizeCssColor("rgba(0,0,0,0.5)"), "rgba(0,0,0,0.5)");
  assert.equal(canonicalizeCssColor("rgba(var(--burst-fill-r), var(--burst-fill-g), var(--burst-fill-b), 0.7)"), null);
  assert.equal(canonicalizeCssColor("rgba(1,2,3,0.123456789)"), "rgba(1,2,3,0.123456789)");
  assert.throws(() => canonicalizeCssColor("rgb(0.4,0,0)"), /Fractional CSS RGB component/);
  assert.throws(() => canonicalizeCssColor("rgb(10%,0,0)"), /Fractional CSS RGB component/);
  assert.throws(() => canonicalizeCssColor("rgba(1,2,3,0.12345678901)"), /exceeds canonical precision/);
  assert.throws(() => canonicalizeCssColor("#00000080"), /Alpha-bearing hex colors are not supported/);
  assert.throws(() => canonicalizeCssColor("hsl(0.12345678901,50%,50%)"), /hue component exceeds canonical precision/);
  assert.throws(() => canonicalizeCssColor("hsl(0,50.12345678901%,50%)"), /saturation component exceeds canonical precision/);
  assert.throws(() => canonicalizeCssColor("hsl(0,50%,50.12345678901%)"), /lightness component exceeds canonical precision/);
  assert.throws(() => canonicalizeCssColor("rgba(36,64,74,0.12junk)"), /Invalid CSS alpha component/);
  assert.throws(() => canonicalizeCssColor("rgb(36junk,64,74)"), /Invalid CSS RGB component/);
});

test("CSS palette — baseline captures the revised primitive scope", () => {
  assert.equal(baseline.meta.totalSites, 285);
  assert.equal(baseline.meta.staticSites, 277);
  assert.equal(baseline.meta.dynamicSites, 8);
  assert.equal(baseline.meta.distinctCanonicalValues, 159);
  assert.equal(baseline.meta.distinctRgbTriples, 100);
  assert.equal(baseline.meta.recurringRgbTriples, 21);
  assert.equal(Object.keys(CHANNEL_TOKENS).length, 21);

  const cssStaticSites = baseline.sites.filter((site) => site.file !== "index.html" && site.nature === "static");
  const tripleFiles = new Map();
  const tripleOccurrences = new Map();
  const canonicalFiles = new Map();
  for (const site of cssStaticSites) {
    if (site.rgbTriple) {
      const triple = site.rgbTriple.join(" ");
      if (!tripleFiles.has(triple)) tripleFiles.set(triple, new Set());
      tripleFiles.get(triple).add(site.file);
      tripleOccurrences.set(triple, (tripleOccurrences.get(triple) ?? 0) + 1);
    }
    if (!canonicalFiles.has(site.canonical)) canonicalFiles.set(site.canonical, new Set());
    canonicalFiles.get(site.canonical).add(site.file);
  }
  const recurringTriples = [...tripleFiles].filter(([, files]) => files.size >= 2).map(([triple]) => triple).sort();
  assert.deepEqual(recurringTriples, Object.keys(CHANNEL_TOKENS).sort(), "Channel token mapping must equal the mechanically derived recurring RGB scope");
  assert.equal([...tripleOccurrences.values()].filter((count) => count === 1).length, 60);
  assert.equal([...canonicalFiles.values()].filter((files) => files.size === 1).length, 130);
});

test("CSS palette — current declarations wire to baseline values by file and ordinal", () => {
  assertWiring(cssSources, htmlSource);
  assert.match(readRepoFile("src/assets/styles/style.css"), /@import "\.\/channel-tokens\.css";/);
  assert.match(readRepoFile("src/assets/styles/help.css"), /@import "\.\/channel-tokens\.css";/);
});

test("CSS palette — current recurring triples have no raw literal residue", () => {
  for (const file of CSS_PALETTE_FILES) {
    const rawRecurring = extractCssColorOccurrences(cssSources[file])
      .filter((site) => site.rgbTriple && Object.hasOwn(CHANNEL_TOKENS, site.rgbTriple.join(" ")));
    assert.deepEqual(rawRecurring, [], `${file} still contains a raw recurring RGB triple`);
  }
  const htmlRawRecurring = extractHtmlInlineColorOccurrences(htmlSource)
    .filter((site) => site.rgbTriple && Object.hasOwn(CHANNEL_TOKENS, site.rgbTriple.join(" ")));
  assert.deepEqual(htmlRawRecurring, [], "index.html still contains a raw recurring RGB triple");
});

test("CSS palette — runtime variables and hsla declarations remain unchanged", () => {
  for (const site of baseline.sites.filter((site) => site.nature === "dynamic" || site.raw.toLowerCase().startsWith("hsla"))) {
    const source = site.file === "index.html" ? htmlSource : cssSources[site.file];
    const current = currentSlots(source, site.file).find((candidate) =>
      candidate.declarationOrdinal === site.declarationOrdinal &&
      candidate.occurrenceInDeclaration === site.occurrenceInDeclaration
    );
    assert.ok(current, `${site.file} declaration ${site.declarationOrdinal} site disappeared`);
    assert.equal(current.kind, "raw");
    assert.equal(current.raw, site.raw, `${site.file}:${site.line} raw special color changed`);
  }
});

test("CSS palette — no theme variant or runtime animation variable was introduced", () => {
  for (const file of CSS_PALETTE_FILES) {
    const source = cssSources[file];
    assert.doesNotMatch(source, /prefers-color-scheme|\[data-theme\]/i, `${file} must not introduce a theme variant`);
  }
  assert.doesNotMatch(cssSources["src/assets/styles/style.css"], /--burst-|--particle-/i);
});

test("CSS palette — wiring test catches a deliberate two-token call-site swap", () => {
  const file = "src/assets/styles/help.css";
  const swapped = cssSources[file]
    .replace("var(--c-slate)", "var(--c-temp)")
    .replace("var(--c-ocean)", "var(--c-slate)")
    .replace("var(--c-temp)", "var(--c-ocean)");
  assert.throws(
    () => assertWiring({ ...cssSources, [file]: swapped }, htmlSource),
    /src\/assets\/styles\/help\.css declaration \d+ occurrence \d+: token --c-ocean resolved to rgba\(59,111,144,0\.12\); expected rgba\(36,64,74,0\.12\)/
  );
});
