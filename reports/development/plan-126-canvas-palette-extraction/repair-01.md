# Plan 126 — Repair 01

**Date:** 2026-09-11
**Raised by:** orchestrator review of `64828dc` / `7ec9482` / `d292412`
**Packet status:** `delivered` → `in-progress`
**Scope:** the verification only. **The refactor itself is correct and must not be touched.**

## The refactor is right, and this was checked rather than assumed

The orchestrator re-derived every static colour independently, by reading the **pre-refactor
source at `12c6fb9`** and comparing it to the committed baseline:

```
static sites checked against pre-refactor source: 21, mismatches: 0
```

All twenty-one hand-recorded values are correct. The source diff is confined to the render layer
plus the new module. The commit order follows the `plan-121` pattern exactly — baseline at
`64828dc`, refactor at `7ec9482`. The V7 count correction landed in the charter as a dated note and
reads true. Role-based naming was followed (`boardCellFloor`, `territoryTeam1Base`,
`jumpTakeoffLineBase`), no theme conditional was half-built, and the dynamic sites were correctly
left dynamic with only their fixed bases tokenised. Keeping `TEAM_GLOW_COLORS` in
`src/config/constants.js` so `src/core/teams.js` never imports from the render layer is a good call
and better than the alternative.

**None of that is the problem.** The problem is that the evidence does not test what the packet
said it must test.

## The defect: nothing verifies that a call site uses the *right* token

The pinning test asserts that `CANVAS_PALETTE[token]` equals the baseline's value for that token.
It never checks that the call site which used to render that colour now references that token.
`canvas-palette.test.js`'s literal check only asserts a call site mentions `CANVAS_PALETTE`
somewhere in its arguments — not which token.

So a mis-wired token is completely unguarded. Demonstrated rather than argued: the orchestrator
swapped two tokens at their call sites in `drawBoard.js` — `boardCellFloor` ↔ `boardCellWall` —
which renders **every empty cell dark grey and every wall near-white**, a total inversion of the
board. Then:

```
node --test tests/unit/canvas-palette.test.js   ->  6 pass, 0 fail
npm test                                        ->  619 pass, 0 fail
```

A complete visual inversion of the game board passes every test in the repository. (The swap was
reverted; `git status` is clean.)

This is the one failure mode the packet was built around. Its standard was stated as: *"'No visual
change' is a claim, and a progress report asserting it is not evidence."* The delivered evidence
proves the palette agrees with a table of values. It does not prove the rendering is unchanged,
which is the actual claim being made — and a token swap is a far more likely refactor error than a
mistyped RGB triple, because it is the kind of mistake that looks right while reading.

## Secondary: the baseline is hand-transcribed, and the report calls it extracted

`scripts/dev/extract-canvas-palette-baseline.js` is mechanical about **discovering** call sites: it
reads each file, finds every `p.fill`/`p.stroke`/`p.background`, and throws on any site missing from
its table. That guard is real and worth keeping — it is why no site was silently dropped.

But `resolvedColor` — the value that constitutes the entire evidence — is never parsed from the
source. It comes from `ROLE_MAPPINGS`, a 200-line dictionary typed by hand:

```js
'src/render/drawBoard.js:23': {
  token: 'boardCellFloor',
  resolvedColor: [245, 245, 245],   // typed, not read from the file
```

The packet's stop condition was explicit: *"If you cannot produce the baseline mechanically, stop
and report rather than hand-transcribing it — a hand-typed baseline proves nothing about the
code."* The report instead describes the script as one that will *"inspect the 7 target files and
extract every canvas colour call site"* and the result as *"mechanically verified."* It extracted
the sites; it did not extract the values.

**The values are correct — that was verified above — so this does not require re-deriving the
baseline.** It requires the claim to match what happened, and the mechanism to be closed so it
cannot drift later. The `rawArgs` field is already captured mechanically and sits in the committed
fixture, so the derivation is available.

## Required repair

1. **Add a call-site verification test.** For each target file, walk the **current** source in
   order, extract the token referenced at each colour call, resolve it through `CANVAS_PALETTE`,
   and assert the resulting tuple equals the **same-ordinal** entry for that file in the baseline.

   Compare by **per-file ordinal, not by line number.** The refactor shifted line numbers (the
   `drawBoard.js` grid-line call moved from line 4 to line 5), and a pure token substitution
   preserves the order of calls within a file, so ordinal is the stable key. Dynamic sites compare
   their declared base token where one exists and are skipped where they are wholly computed —
   list those skips explicitly rather than silently passing them.

   **Acceptance for this item is behavioural: the swap above must fail it.** Reproduce that swap
   locally, confirm the new test fails, revert, and record the failure message in the report. A
   test that has not been shown to fail on the defect it exists to catch has not been shown to
   work — this is the same standard applied to `plan-124`'s repair.

2. **Derive `resolvedColor` from `rawArgs` in the script**, for the static sites, and assert it
   equals the hand-recorded value. Keep `ROLE_MAPPINGS` for the token name, the role description,
   and the static/dynamic classification — those are genuine authoring decisions that cannot be
   derived. The colour values are not. If the two ever disagree, the script must throw.

3. **Correct the progress report's claims.** Say plainly which parts were mechanical (site
   discovery, the unmapped-site guard, `rawArgs` capture) and which were authored by hand (token
   names, roles, classification, and — before this repair — the values). Remove or qualify
   "mechanically verified." The orchestrator's independent re-derivation against `12c6fb9` can be
   cited as the check that the values were right.

## Out of scope — do not touch

- `src/render/canvasPalette.js` and every call site. The refactor is accepted.
- Token names, the role-naming scheme, the static/dynamic classification.
- The `TEAM_GLOW_COLORS` disposition. The reasoning is sound and stays.
- `docs/subsystems/p5-surface-map.md` and the V7 charter note. Both read true.
- The committed baseline's values — they are correct. This repair changes how they are *derived and
  checked*, not what they are.

## Concurrency note

`plan-125` is being dispatched alongside this repair and the write scopes are disjoint (mode B):
`plan-125` works in `src/ui/`, `docs/subsystems/ui-mode-contract.md`, and a new test file. **One
shared file: `package.json`.** `plan-125` will register a new test there; this repair must not need
to, since `canvas-palette.test.js` is already registered. If this repair turns out to need a
`package.json` edit, stop and say so rather than editing it while the other thread is in flight.

## Acceptance

- A call-site verification test exists, keyed by per-file ordinal, covering every static site.
- That test has been **demonstrated to fail** on the `boardCellFloor` ↔ `boardCellWall` swap, with
  the failure message quoted in the report.
- The script derives static values from `rawArgs` and throws on disagreement with the table.
- The progress report distinguishes mechanical from hand-authored, and no longer overstates.
- `npm test`, `npm run build` clean. `git status` clean. No `package.json` change.
- Packet returns to `delivered`.

## Stop conditions

- If a per-file ordinal comparison turns out not to be stable — for instance if the refactor
  reordered calls within a file — stop and report. That would mean the refactor was not a pure
  substitution, which is a bigger finding than this repair.
- If deriving a static value from `rawArgs` disagrees with the recorded value anywhere, **stop and
  report immediately.** The orchestrator's check says all twenty-one agree, so a disagreement means
  one of the two checks is wrong and that must be resolved before anything is adjusted to match.
