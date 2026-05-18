/**
 * FNV-1a 32-bit hash helpers for guided workspace starter versioning.
 *
 * Pure module — no imports, no side effects. Works identically in Node (tests)
 * and the browser (runtime). The algorithm and normalization rules are stable
 * by contract; do not change either without also versioning the stored hash
 * format (see docs/subsystems/blockly-workspace.md — "Starter XML versioning").
 */

const FNV1A_OFFSET_BASIS = 2166136261; // 0x811c9dc5
const FNV1A_PRIME = 16777619; // 0x01000193

/**
 * Normalize a starter XML string before hashing so that formatting-only edits
 * (added indentation, whitespace, re-saved position attributes) do not trigger
 * a stale-replace on student workspaces.
 *
 * Normalization rules (stable by contract — do not change):
 *   1. Strip whitespace-only text nodes between XML elements (inter-element
 *      whitespace). Pattern: collapse `> ... <` where the middle is only
 *      whitespace to `><`. This makes `<a>\n  <b>` and `<a><b>` equivalent.
 *   2. Collapse any remaining runs of whitespace (spaces, tabs, newlines)
 *      inside non-empty text content to a single space.
 *   3. Strip leading / trailing whitespace.
 *   4. Remove x="…" and y="…" attribute pairs from any element. These are
 *      Blockly's saved block positions — they are cosmetic, not semantic.
 *      The regex removes the optional leading whitespace before the attribute
 *      name to avoid leaving a double-space.
 *
 * Does NOT normalize attribute order, case, or quote style — those are stable
 * in authored XML and should not be silently altered.
 *
 * @param {string|null|undefined} xml
 * @returns {string}
 */
export function normalizeStarterXmlForHashing(xml) {
  if (xml === null || xml === undefined) {
    return "";
  }
  return String(xml)
    .replace(/\s*\bx="[^"]*"/g, "")
    .replace(/\s*\by="[^"]*"/g, "")
    .replace(/>\s+</g, "><")   // strip inter-element whitespace-only text nodes
    .replace(/\s+/g, " ")      // collapse remaining whitespace runs to a single space
    .trim();
}

/**
 * Hash a starter XML string using FNV-1a 32-bit.
 *
 * Applies normalizeStarterXmlForHashing before hashing so the digest is stable
 * across formatting-only edits. Returns exactly 8 lowercase hex characters,
 * zero-padded when needed (e.g., "00000000" through "ffffffff").
 *
 * This function is pure and deterministic: identical input always produces
 * identical output. The empty string, null, and undefined all produce the
 * same deterministic digest (the FNV-1a offset basis, formatted as hex).
 *
 * @param {string|null|undefined} xml
 * @returns {string} 8-character lowercase hex digest
 */
export function hashStarterXml(xml) {
  const normalized = normalizeStarterXmlForHashing(xml);
  let hash = FNV1A_OFFSET_BASIS;
  for (let i = 0; i < normalized.length; i++) {
    // XOR the low byte with the current character code
    hash ^= normalized.charCodeAt(i);
    // Multiply modulo 2^32 using unsigned 32-bit integer arithmetic
    hash = (Math.imul(hash, FNV1A_PRIME) >>> 0);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}
