import {
  buildExportPayloadWithIntegrity,
  computeBrowserSha256Hex
} from "./usageFormat.js";

/**
 * Builds a sanitized schema-v2 evidence payload containing no self-reported identity,
 * preserving the existing integrity-hash contract.
 *
 * Pure, DOM-free, network-free.
 *
 * @param {Object} options
 * @param {Object} options.session - The usage tracker session object
 * @param {string} [options.exportedAt] - ISO timestamp for exportedAt
 * @param {Function} [options.computeSha256] - Async function (text: string) => Promise<string>
 * @returns {Promise<Object>} Schema-v2 payload with integrity block
 */
export async function buildCloudEvidencePayload({
  session,
  exportedAt = new Date().toISOString(),
  computeSha256 = computeBrowserSha256Hex
} = {}) {
  if (!session || typeof session !== "object") {
    throw new Error("A valid session object is required to build cloud evidence.");
  }

  return buildExportPayloadWithIntegrity({
    session,
    studentName: "",
    exportedAt,
    computeSha256,
    options: {
      schemaVersion: 2,
      stripStudentName: true
    }
  });
}
