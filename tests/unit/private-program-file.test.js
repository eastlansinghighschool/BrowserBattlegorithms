import test from "node:test";
import assert from "node:assert/strict";
import {
  decryptPrivateProgramXml,
  encryptPrivateProgramXml,
  isPrivateProgramFileShape,
  parsePrivateProgramFileText,
  serializePrivateProgramFile
} from "../../src/crypto/privateProgramFile.js";

test("private program file round-trips XML through Web Crypto", async () => {
  const xmlText = `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_move_forward"></block></xml>`;
  const payload = await encryptPrivateProgramXml({
    xmlText,
    password: "1234",
    programLabel: "Team 1"
  });

  assert.equal(payload.kind, "browser-battlegorithms-private-program");
  assert.equal(payload.schemaVersion, 1);
  assert.equal(isPrivateProgramFileShape(payload), true);

  const serialized = serializePrivateProgramFile(payload);
  assert.equal(serialized.includes("<block"), false);

  const parsed = parsePrivateProgramFileText(serialized);
  const decrypted = await decryptPrivateProgramXml(parsed, "1234");
  assert.equal(decrypted, xmlText);
});

test("private program file rejects the wrong password", async () => {
  const payload = await encryptPrivateProgramXml({
    xmlText: `<xml xmlns="https://developers.google.com/blockly/xml"><block type="battlegorithms_move_forward"></block></xml>`,
    password: "abcd"
  });

  await assert.rejects(
    () => decryptPrivateProgramXml(payload, "wrong"),
    /decrypt|operation/i
  );
});

