import { resolve, sep } from "node:path";

/**
 * Checks if a given candidate file path is safe for cohort usage data.
 * A path is safe ONLY if it resolves strictly within 'local/usage-cohorts/'.
 * It must NOT traverse outside this directory or resolve to tracked source/doc/test paths.
 * 
 * @param {string} candidatePath - The candidate file or directory path.
 * @param {string} projectRoot - The project root directory (defaults to process.cwd()).
 * @returns {boolean} True if the path is strictly under local/usage-cohorts/ and not in any tracked folder, false otherwise.
 */
export function isCohortPathSafe(candidatePath, projectRoot = process.cwd()) {
  if (typeof candidatePath !== "string" || !candidatePath.trim()) {
    return false;
  }

  try {
    const resolvedRoot = resolve(projectRoot);
    const resolvedCohortRoot = resolve(resolvedRoot, "local/usage-cohorts");
    
    // Resolve candidatePath relative to resolvedRoot
    const resolvedCandidate = resolve(resolvedRoot, candidatePath);

    // Normalize separators for case-insensitive check and substring matching
    const isWindows = process.platform === "win32";
    
    let rootPathStr = resolvedCohortRoot;
    let candidatePathStr = resolvedCandidate;

    if (isWindows) {
      rootPathStr = rootPathStr.toLowerCase();
      candidatePathStr = candidatePathStr.toLowerCase();
    }

    // Candidate must start with root path
    if (!candidatePathStr.startsWith(rootPathStr)) {
      return false;
    }

    // Ensure it's not just a prefix match of a sibling directory (e.g. 'local/usage-cohorts-other')
    // It must either be exactly rootPathStr or start with rootPathStr + path separator.
    if (candidatePathStr.length > rootPathStr.length) {
      const charAfterPrefix = candidatePathStr[rootPathStr.length];
      if (charAfterPrefix !== sep && charAfterPrefix !== "/") {
        return false;
      }
    }

    // Explicitly reject if candidate path points inside tracked/source locations (docs, src, tests, reports, public).
    // While starting with local/usage-cohorts/ should prevent this, we explicitly check as a defense-in-depth safety measure.
    const trackedDirs = ["src", "docs", "reports", "tests", "public"];
    for (const dir of trackedDirs) {
      let resolvedTracked = resolve(resolvedRoot, dir);
      if (isWindows) {
        resolvedTracked = resolvedTracked.toLowerCase();
      }
      if (
        candidatePathStr === resolvedTracked || 
        candidatePathStr.startsWith(resolvedTracked + sep) || 
        candidatePathStr.startsWith(resolvedTracked + "/")
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}
