const HEX_COLOR_PATTERN = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/gi;
const FUNCTION_COLOR_PATTERN = /(?:rgba?|hsla?)\((?:[^()]|\([^()]*\))*\)/gi;
const KEYWORD_COLOR_PATTERN = /(?<![\w-])(?:transparent|white)(?![\w-])/gi;

export const CSS_PALETTE_FILES = [
  "src/assets/styles/style.css",
  "src/assets/styles/help.css",
  "src/assets/styles/components/base.css",
  "src/assets/styles/components/blockly.css",
  "src/assets/styles/components/cellInspector.css",
  "src/assets/styles/components/controls.css",
  "src/assets/styles/components/layout.css",
  "src/assets/styles/components/lesson-panel.css",
  "src/assets/styles/components/loading.css",
  "src/assets/styles/components/overlays.css",
  "src/assets/styles/components/responsive.css"
];

function normalizeAlpha(value) {
  const alpha = value.endsWith("%") ? Number.parseFloat(value) / 100 : Number.parseFloat(value);
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    throw new Error(`Invalid CSS alpha component: ${value}`);
  }
  return Number(alpha.toFixed(10));
}

function normalizeRgbComponent(value) {
  const component = value.endsWith("%")
    ? (Number.parseFloat(value) * 255) / 100
    : Number.parseFloat(value);
  if (!Number.isFinite(component) || component < 0 || component > 255) {
    throw new Error(`Invalid CSS RGB component: ${value}`);
  }
  return Math.round(component);
}

function normalizePercentage(value, label) {
  if (!value.endsWith("%")) {
    throw new Error(`Invalid CSS ${label} component: ${value}`);
  }
  const percentage = Number.parseFloat(value);
  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new Error(`Invalid CSS ${label} component: ${value}`);
  }
  return Number(percentage.toFixed(10));
}

function toHex(component) {
  return component.toString(16).padStart(2, "0");
}

/**
 * Return a canonical representation for a static CSS color value.
 *
 * The canonical form uses lowercase six-digit hex for opaque colors and a
 * compact rgba() form when alpha is less than one. Dynamic expressions such
 * as rgba(var(--burst-fill-r), ...) return null because they are not palette
 * literals.
 */
export function canonicalizeCssColor(value) {
  const raw = value.trim();
  const lower = raw.toLowerCase();

  if (lower === "white") {
    return "#ffffff";
  }
  if (lower === "transparent") {
    return "rgba(0,0,0,0)";
  }
  if (lower.startsWith("#")) {
    if (!/^#[0-9a-f]{3,4}$|^#[0-9a-f]{6}$|^#[0-9a-f]{8}$/i.test(raw)) {
      throw new Error(`Invalid CSS hex color: ${value}`);
    }
    const digits = raw.slice(1).toLowerCase();
    const expanded = digits.length === 3 || digits.length === 4
      ? [...digits].map((digit) => digit + digit).join("")
      : digits;
    const red = Number.parseInt(expanded.slice(0, 2), 16);
    const green = Number.parseInt(expanded.slice(2, 4), 16);
    const blue = Number.parseInt(expanded.slice(4, 6), 16);
    const alpha = expanded.length === 8 ? Number.parseInt(expanded.slice(6, 8), 16) / 255 : 1;
    return alpha === 1
      ? `#${toHex(red)}${toHex(green)}${toHex(blue)}`
      : `rgba(${red},${green},${blue},${Number(alpha.toFixed(10))})`;
  }

  const functionMatch = lower.match(/^(rgba?)\((.*)\)$/s);
  const hslMatch = lower.match(/^(hsla?)\((.*)\)$/s);
  const colorMatch = functionMatch ?? hslMatch;
  if (!colorMatch) {
    return null;
  }
  if (colorMatch[2].includes("var(") || colorMatch[2].includes("currentcolor")) {
    return null;
  }

  const components = colorMatch[2].split(",").map((component) => component.trim());
  if (components.length !== 3 && components.length !== 4) {
    throw new Error(`Unsupported CSS color function: ${value}`);
  }
  if (colorMatch[1].startsWith("hsl")) {
    const hue = Number.parseFloat(components[0]);
    if (!Number.isFinite(hue)) throw new Error(`Invalid CSS hue component: ${components[0]}`);
    const saturation = normalizePercentage(components[1], "saturation");
    const lightness = normalizePercentage(components[2], "lightness");
    const alpha = components.length === 4 ? normalizeAlpha(components[3]) : 1;
    const functionName = alpha === 1 ? "hsl" : "hsla";
    return `${functionName}(${Number(hue.toFixed(10))},${saturation}%,${lightness}%${alpha === 1 ? "" : `,${alpha}`})`;
  }
  const [red, green, blue] = components.slice(0, 3).map(normalizeRgbComponent);
  const alpha = components.length === 4 ? normalizeAlpha(components[3]) : 1;
  return alpha === 1
    ? `#${toHex(red)}${toHex(green)}${toHex(blue)}`
    : `rgba(${red},${green},${blue},${alpha})`;
}

export function rgbTripleFromCanonical(canonical) {
  if (canonical.startsWith("#")) {
    return [
      Number.parseInt(canonical.slice(1, 3), 16),
      Number.parseInt(canonical.slice(3, 5), 16),
      Number.parseInt(canonical.slice(5, 7), 16)
    ];
  }
  const rgbaMatch = canonical.match(/^rgba\((\d+),(\d+),(\d+),[0-9.]+\)$/);
  return rgbaMatch ? rgbaMatch.slice(1, 4).map(Number) : null;
}

export function rgbTripleForCssColor(value) {
  const canonical = canonicalizeCssColor(value);
  return canonical === null ? null : rgbTripleFromCanonical(canonical);
}

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\r\n]/g, " "));
}

function findDeclarationColon(text) {
  let quote = null;
  let parentheses = 0;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quote) {
      if (character === quote && text[index - 1] !== "\\") quote = null;
    } else if (character === "\"" || character === "'") {
      quote = character;
    } else if (character === "(") {
      parentheses += 1;
    } else if (character === ")") {
      parentheses -= 1;
    } else if (character === ":" && parentheses === 0) {
      return index;
    }
  }
  return -1;
}

function scanCssStatements(content) {
  const clean = stripComments(content);
  const statements = [];
  const blocks = [];
  let statementStart = 0;
  let quote = null;
  let parentheses = 0;

  const recordStatement = (end) => {
    if (blocks.length === 0) return;
    const segment = clean.slice(statementStart, end);
    const colon = findDeclarationColon(segment);
    if (colon === -1) return;
    const property = segment.slice(0, colon).trim();
    if (!/^[\w-]+$/.test(property)) return;
    const value = segment.slice(colon + 1).trim();
    const leadingWhitespace = segment.slice(colon + 1).search(/\S/);
    const offset = statementStart + colon + 1 + Math.max(leadingWhitespace, 0);
    statements.push({
      property,
      value,
      selector: blocks[blocks.length - 1].selector.trim(),
      start: offset,
      end,
      ordinal: statements.length
    });
  };

  for (let index = 0; index < clean.length; index += 1) {
    const character = clean[index];
    if (quote) {
      if (character === quote && clean[index - 1] !== "\\") quote = null;
      continue;
    }
    if (character === "\"" || character === "'") {
      quote = character;
    } else if (character === "(") {
      parentheses += 1;
    } else if (character === ")") {
      parentheses -= 1;
    } else if (parentheses === 0 && character === "{") {
      blocks.push({ selector: clean.slice(statementStart, index) });
      statementStart = index + 1;
    } else if (parentheses === 0 && character === ";") {
      recordStatement(index);
      statementStart = index + 1;
    } else if (parentheses === 0 && character === "}") {
      recordStatement(index);
      blocks.pop();
      statementStart = index + 1;
    }
  }
  return statements;
}

function colorMatches(value, { includeDynamic = false } = {}) {
  const matches = [];
  for (const pattern of [HEX_COLOR_PATTERN, FUNCTION_COLOR_PATTERN, KEYWORD_COLOR_PATTERN]) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(value)) !== null) {
      const raw = match[0];
      const canonical = canonicalizeCssColor(raw);
      if (canonical !== null || includeDynamic) {
        matches.push({
          start: match.index,
          end: match.index + raw.length,
          raw,
          canonical,
          rgbTriple: canonical === null ? null : rgbTripleFromCanonical(canonical),
          nature: canonical === null ? "dynamic" : "static"
        });
      }
    }
  }
  return matches.sort((left, right) => left.start - right.start);
}

function lineNumber(content, offset) {
  return content.slice(0, offset).split(/\r?\n/).length;
}

export function extractCssColorOccurrences(content, { includeTokenLayer = true, includeDynamic = false } = {}) {
  const occurrences = [];
  for (const declaration of scanCssStatements(content)) {
    if (!includeTokenLayer && declaration.selector === ":root" && declaration.property.startsWith("--")) {
      continue;
    }
    const declarationColors = colorMatches(declaration.value, { includeDynamic });
    declarationColors.forEach((color, occurrenceInDeclaration) => {
      occurrences.push({
        ...color,
        property: declaration.property,
        selector: declaration.selector,
        line: lineNumber(content, declaration.start),
        declarationOrdinal: declaration.ordinal,
        occurrenceInDeclaration
      });
    });
  }
  return occurrences;
}

export function extractHtmlInlineColorOccurrences(content, { includeDynamic = false } = {}) {
  const occurrences = [];
  const styleAttributePattern = /\bstyle\s*=\s*(["'])([\s\S]*?)\1/gi;
  let attributeMatch;
  while ((attributeMatch = styleAttributePattern.exec(content)) !== null) {
    const styleText = attributeMatch[2];
    const styleOffset = attributeMatch.index + attributeMatch[0].indexOf(styleText);
    for (const declarationText of styleText.split(";")) {
      const colon = declarationText.indexOf(":");
      if (colon === -1) continue;
      const property = declarationText.slice(0, colon).trim();
      const value = declarationText.slice(colon + 1);
      const valueOffset = declarationText.indexOf(value, colon + 1);
      const colors = colorMatches(value, { includeDynamic });
      colors.forEach((color, occurrenceInDeclaration) => {
        occurrences.push({
          ...color,
          property,
          selector: "inline-style",
          line: lineNumber(content, styleOffset + valueOffset),
          declarationOrdinal: occurrences.length,
          occurrenceInDeclaration
        });
      });
    }
  }
  return occurrences;
}

export function extractDomTokenReferences(content) {
  const references = [];
  for (const declaration of scanCssStatements(content)) {
    if (declaration.selector === ":root" && declaration.property.startsWith("--")) continue;
    const pattern = /var\((--c-[\w-]+)\)/g;
    let match;
    let occurrenceInDeclaration = 0;
    while ((match = pattern.exec(declaration.value)) !== null) {
      references.push({
        token: match[1],
        property: declaration.property,
        selector: declaration.selector,
        line: lineNumber(content, declaration.start),
        declarationOrdinal: declaration.ordinal,
        occurrenceInDeclaration
      });
      occurrenceInDeclaration += 1;
    }
  }
  return references;
}

export function extractCssDeclarations(content) {
  return scanCssStatements(content);
}
