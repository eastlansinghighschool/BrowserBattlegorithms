export const PRIVATE_PROGRAM_SCHEMA_VERSION = 1;
export const PRIVATE_PROGRAM_KIND = "browser-battlegorithms-private-program";
export const PRIVATE_PROGRAM_KDF = {
  name: "PBKDF2",
  hash: "SHA-256",
  iterations: 150000
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function getWebCrypto() {
  const crypto = globalThis.crypto;
  if (!crypto?.subtle || typeof crypto.getRandomValues !== "function") {
    throw new Error("Web Crypto is not available in this browser.");
  }
  return crypto;
}

function bytesToBase64(bytes) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (let index = 0; index < bytes.length; index += 1) {
    binary += String.fromCharCode(bytes[index]);
  }
  return btoa(binary);
}

function base64ToBytes(value) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function normalizePassword(password) {
  return `${password ?? ""}`;
}

async function deriveAesGcmKey(password, saltBytes, iterations = PRIVATE_PROGRAM_KDF.iterations) {
  const crypto = getWebCrypto();
  const material = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(normalizePassword(password)),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: PRIVATE_PROGRAM_KDF.name,
      salt: saltBytes,
      iterations,
      hash: PRIVATE_PROGRAM_KDF.hash
    },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export function isPrivateProgramFileShape(candidate) {
  return Boolean(
    candidate &&
    candidate.kind === PRIVATE_PROGRAM_KIND &&
    Number(candidate.schemaVersion) === PRIVATE_PROGRAM_SCHEMA_VERSION &&
    candidate.kdf &&
    candidate.salt &&
    candidate.iv &&
    candidate.ciphertext
  );
}

export function parsePrivateProgramFileText(fileText) {
  const parsed = JSON.parse(fileText);
  if (!isPrivateProgramFileShape(parsed)) {
    throw new Error("This file is not a recognized private Browser Battlegorithms program file.");
  }
  return parsed;
}

export async function encryptPrivateProgramXml({
  xmlText,
  password,
  programLabel = "",
  teamNumber = null
}) {
  const crypto = getWebCrypto();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesGcmKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    textEncoder.encode(`${xmlText ?? ""}`)
  );

  return {
    schemaVersion: PRIVATE_PROGRAM_SCHEMA_VERSION,
    kind: PRIVATE_PROGRAM_KIND,
    createdAt: new Date().toISOString(),
    kdf: { ...PRIVATE_PROGRAM_KDF },
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    metadata: {
      programLabel: `${programLabel || ""}`,
      teamNumber: teamNumber == null ? null : Number(teamNumber)
    }
  };
}

export async function decryptPrivateProgramXml(filePayload, password) {
  if (!isPrivateProgramFileShape(filePayload)) {
    throw new Error("This file is not a recognized private Browser Battlegorithms program file.");
  }

  const crypto = getWebCrypto();
  const salt = base64ToBytes(filePayload.salt);
  const iv = base64ToBytes(filePayload.iv);
  const ciphertext = base64ToBytes(filePayload.ciphertext);
  const iterations = Number(filePayload.kdf?.iterations || PRIVATE_PROGRAM_KDF.iterations);
  const key = await deriveAesGcmKey(password, salt, iterations);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return textDecoder.decode(plaintext);
}

export function serializePrivateProgramFile(payload) {
  return JSON.stringify(payload, null, 2);
}

