// Channel primitives selected by Plan 127 Amendment 01. These names identify
// reusable RGB triples, not semantic roles; P3 owns assigning roles later.
export const CHANNEL_TOKENS = Object.freeze({
  "36 64 74": "--c-slate",
  "255 255 255": "--c-white",
  "0 0 0": "--c-black",
  "59 111 144": "--c-ocean",
  "30 43 51": "--c-charcoal",
  "245 158 11": "--c-amber",
  "76 90 99": "--c-muted",
  "140 61 34": "--c-rust",
  "47 122 77": "--c-forest",
  "64 81 90": "--c-blue-gray",
  "132 32 41": "--c-red",
  "233 245 236": "--c-mint",
  "237 243 246": "--c-mist",
  "24 55 68": "--c-deep-teal",
  "247 251 255": "--c-ice",
  "253 236 236": "--c-blush",
  "255 253 247": "--c-cream",
  "31 93 52": "--c-deep-forest",
  "36 54 63": "--c-ink",
  "47 92 121": "--c-steel",
  "58 111 144": "--c-sky"
});

export const CHANNEL_TOKENS_BY_NAME = Object.freeze(
  Object.fromEntries(Object.entries(CHANNEL_TOKENS).map(([triple, token]) => [token, triple]))
);
