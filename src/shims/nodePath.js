function normalizeSlashes(value) {
  return String(value || "").replace(/\\/g, "/");
}

function splitSegments(value) {
  return normalizeSlashes(value).split("/").filter((segment, index, all) => !(segment === "" && index === all.length - 1));
}

function hasLeadingSlash(value) {
  return normalizeSlashes(value).startsWith("/");
}

function normalizePath(value) {
  const raw = normalizeSlashes(value);
  const absolute = raw.startsWith("/");
  const segments = [];
  for (const segment of raw.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }
    if (segment === "..") {
      if (segments.length > 0 && segments[segments.length - 1] !== "..") {
        segments.pop();
      } else if (!absolute) {
        segments.push("..");
      }
      continue;
    }
    segments.push(segment);
  }
  const joined = segments.join("/");
  return absolute ? `/${joined}` : joined || (absolute ? "/" : ".");
}

export function join(...parts) {
  const filtered = parts.filter((part) => part !== undefined && part !== null && part !== "");
  if (filtered.length === 0) {
    return ".";
  }
  let result = normalizeSlashes(filtered[0]);
  for (let index = 1; index < filtered.length; index += 1) {
    const piece = normalizeSlashes(filtered[index]);
    if (hasLeadingSlash(piece)) {
      result = piece;
      continue;
    }
    result = result.endsWith("/") ? `${result}${piece}` : `${result}/${piece}`;
  }
  return normalizePath(result);
}

export function resolve(...parts) {
  const filtered = parts.filter((part) => part !== undefined && part !== null && part !== "");
  if (filtered.length === 0) {
    return "/";
  }
  let result = "";
  for (const part of filtered) {
    const piece = normalizeSlashes(part);
    if (!piece) {
      continue;
    }
    if (hasLeadingSlash(piece)) {
      result = piece;
    } else if (!result) {
      result = piece;
    } else {
      result = result.endsWith("/") ? `${result}${piece}` : `${result}/${piece}`;
    }
  }
  return normalizePath(result || "/");
}

export function dirname(value) {
  const normalized = normalizePath(value);
  if (normalized === "/") {
    return "/";
  }
  const segments = normalizeSlashes(normalized).split("/").filter(Boolean);
  segments.pop();
  return normalized.startsWith("/") ? `/${segments.join("/")}` || "/" : segments.join("/") || ".";
}

export function relative(from, to) {
  const fromPath = normalizePath(from);
  const toPath = normalizePath(to);
  const fromSegments = normalizeSlashes(fromPath).split("/").filter(Boolean);
  const toSegments = normalizeSlashes(toPath).split("/").filter(Boolean);

  while (fromSegments.length && toSegments.length && fromSegments[0] === toSegments[0]) {
    fromSegments.shift();
    toSegments.shift();
  }

  const ups = new Array(fromSegments.length).fill("..");
  const output = [...ups, ...toSegments].join("/");
  return output || ".";
}

export function isAbsolute(value) {
  return normalizeSlashes(value).startsWith("/");
}

export const sep = "/";

const pathShim = {
  join,
  resolve,
  dirname,
  relative,
  isAbsolute,
  sep
};

export default pathShim;
