# Plan 125 — Repair 01

**Date:** 2026-09-13
**Raised by:** orchestrator review of `3f7e2eb` / `6904f83`
**Packet status:** `delivered` → `in-progress`
**Scope:** one line in `renderWorksheetUnknownIdBanner`, plus the test that should have caught it.
**Everything else is accepted.**

## What verified clean

Checked by running the code, not by reading the report:

- **Parsing.** `?worksheetAt=a,b` parses; `#worksheetAt=a,b` returns `{isPresent:false, rawIds:[]}`
  — the fragment is genuinely ignored, which was F3's whole point; `?other=1` is absent;
  `?worksheetAt=  a , ,b,a,` yields `["a","b"]`, so trimming, empties, trailing commas and
  duplicates are all handled.
- **R1, the reminder's condition.** Correct and correctly ordered. `worksheetCheckpointsReached` is
  recorded when `activeLevelResult === PASSED`, and `renderWorksheetReminder` gates on that set
  rather than on `activeLevelResult`, so the reminder survives a reset and is still there for a
  student replaying for a second star. That was the gap in the preflight and it is properly closed.
- **R2.** `.lesson-worksheet-reminder` is its own class; only `.storage-status-dismiss` is shared,
  which is the correct kind of reuse.
- **R3.** The marker reads "Check your worksheet!" — the medium is not named.
- **R4.** All four fields are declared in `createInitialState()`.
- **D3.** The Free Play disposition was decided and stated: the notice is suppressed outside Guided
  Levels, guarded in the renderer.
- **D4.** `grep -rn "worksheet" src/usage/` returns nothing. No field, no event, no analyzer path.
- 637/637 unit tests, clean build, clean tree.

## The defect: the unknown ids are escaped twice

`src/ui/worksheetCheckpoints.js:179` escapes each id, then `:187` escapes the whole assembled
string again:

```js
const badIdsText = unknownIds.map(escapeHtml).join(", ");   // :179  ids escaped
const copy = `… do not match any level: ${badIdsText}. …`;
return `… <span class="storage-status-text">${escapeHtml(copy)}</span> …`;  // :187  escaped again
```

Rendered output, with ids `Tom & Jerry`, `a<b`, `q"z`:

```
HTML:              … do not match any level: Tom &amp;amp; Jerry, a&amp;lt;b, q&amp;quot;z.
Teacher sees:      … do not match any level: Tom &amp; Jerry, a&lt;b, q&quot;z.
Teacher typed:     Tom & Jerry, a<b, q"z
```

**This is safe, not a hole** — it over-escapes, so nothing executes. But D2's requirement is that
the notice *"names the unknown ids verbatim"*, and a mangled id is not verbatim. This is the one
surface in the feature whose entire job is to show a teacher exactly what they mistyped, and on the
inputs where it matters it shows them something else.

The practical trigger is narrow — level ids are kebab-case, and a bare `&` in a URL splits the
querystring before it ever reaches here, so it takes `%26`, a quote, or an angle bracket. That is
why it is a repair and not a reopening. But the narrowness is also the reason to fix it rather than
wave it through: nobody will hit it often enough to notice, and the teacher who does will be looking
at a garbled string while trying to find a typo.

## Required repair

1. **Escape once.** Either build `copy` from the raw ids and escape only at interpolation, or keep
   the per-id escaping and interpolate `badIdsText` without wrapping it again. Either is fine;
   escaping twice is not.

2. **Add the test that would have caught it.** Assert that an unknown id containing `&`, `<`, and
   `"` is rendered so the browser displays the original characters — i.e. assert against the
   expected HTML entity form, once-encoded. The existing tests pass because every fixture id is
   plain kebab-case, which cannot distinguish one escape from two.

   While you are there, assert the banner is still safe: an id of `<img src=x onerror=alert(1)>`
   must not produce a live `<img` tag in the output.

## Accepted, with one note for the record — do not change

`renderLevelPanel` mutating `worksheetCheckpointsReached` is a side effect inside a render
function, which is normally a smell. It is accepted here: the packet's stop condition forbade
reaching into `src/core/levels.js` for a UI feature, this was the available seam, and it is
correct in practice — the only early return above it is `!panel`, which cannot be true in the
running app, and `showModePicker` / `!currentLevel` cannot coincide with a passed level.

Recorded so a future reader does not mistake it for an accident, and so that if `plan-123`'s P2 or
a later packet introduces a proper level-completion signal, this is a known place to move onto it.

## Out of scope — do not touch

- Parsing, resolution, the reminder condition, the marker, the CSS classes, the state fields, the
  Free Play disposition, the docs section, or any existing test.
- The banner's copy wording, mount point, and dismiss behaviour. All ruled and all correct.

## Acceptance

- The unknown-id notice displays ids exactly as typed, including `&`, `<`, `>`, and quotes.
- A test proves it, and a second test proves markup in an id cannot become live markup.
- `npm test`, `npm run build` clean; `git status` clean.
- Packet returns to `delivered`.

## Stop conditions

- If removing one escape makes any existing test fail, stop and report — that would mean a test is
  pinned to the doubled form and the expectation, not the code, is what is wrong.
