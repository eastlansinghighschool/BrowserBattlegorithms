export function fileURLToPath(url) {
  try {
    return new URL(url, "file:///").pathname;
  } catch {
    return String(url || "");
  }
}

export function pathToFileURL(path) {
  const normalized = String(path || "").replace(/\\/g, "/");
  return new URL(`file://${normalized.startsWith("/") ? "" : "/"}${normalized}`);
}

const urlShim = {
  fileURLToPath,
  pathToFileURL
};

export default urlShim;
