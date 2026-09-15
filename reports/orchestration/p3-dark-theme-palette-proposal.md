# P3 dark theme — a concrete palette proposal

- **From:** orchestration
- **Date:** 2026-09-15
- **Status:** a proposal for the owner to accept, reshape, or reject. **Nothing here is built.**
- **Purpose:** turn charter position V8 from a blank page into a yes/no on specific values.

`plan-126` and `plan-127` built both structural seams. P3 now needs a design, not a prerequisite.
This is that design, with measured numbers rather than adjectives.

## The finding that shapes everything: the primitives are the wrong granularity for theming

`plan-127` deliberately shipped primitives rather than roles, and that was right. But it means **a
dark theme cannot be produced by swapping the 21 primitives**, and the reason is concrete rather
than stylistic.

`--c-slate` (`36 64 74`) does two jobs at once:

- **primary body text** — 16 `color:` declarations;
- **subtle borders** — `rgb(var(--c-slate) / 0.12)` and `/ 0.24)`.

In light mode one value serves both, because a dark colour is simultaneously readable text and, at
12% alpha over white, an almost invisible hairline. **Under inversion those two jobs diverge.** Flip
`--c-slate` to a light value and the text becomes correct while every 12%-alpha border turns into a
light line glowing on a dark surface. The same split affects `--c-white` (both text on dark chips
and the main page surface) and `--c-charcoal` (both text and box-shadow colour).

So P3's first structural move is not colour choice at all:

> **Add a semantic layer between the primitives and the call sites. The primitives keep their
> current light values and never change. The semantic layer is what a theme overrides.**

```css
:root {                                   /* light — today's appearance, unchanged */
  --text-primary:    rgb(var(--c-slate));
  --border-subtle:   rgb(var(--c-slate) / 0.12);
}
:root[data-theme="dark"] {
  --text-primary:    #e6edf1;
  --border-subtle:   rgb(var(--c-white) / 0.14);   /* a different relationship, not a flipped value */
}
```

That is the whole reason the charter called light/dark the hardest item, and it is now visible in
one example instead of asserted.

## The proposed dark palette

Surfaces are drawn from the existing brand family rather than invented. Note that
**`--surface-raised` is exactly `--c-deep-teal`**, a primitive already in the palette — the dark
theme's mid surface is a colour this app already uses for overlay scrims.

| Role | Dark value | Notes |
|---|---|---|
| `--surface-base` | `#101e26` | page ground; the slate/teal family, darkened |
| `--surface-raised` | `#183744` | **= existing `--c-deep-teal`** |
| `--surface-sunken` | `#0a151b` | wells, code areas |
| `--text-primary` | `#e6edf1` | cool near-white, not pure white |
| `--text-secondary` | `#a8bcc6` | |
| `--text-muted` | `#7f939f` | |
| `--border-subtle` | `rgb(var(--c-white) / 0.14)` | **alpha-on-white, not a solid** |
| `--border-strong` | `rgb(var(--c-white) / 0.28)` | |
| `--accent` | `#6fb0d8` | `--c-ocean` lifted; `#3b6f90` is too dark on a dark ground |
| `--accent-on` | `#0a151b` | text placed *on* the accent |
| `--state-success` | `#5fc98d` | |
| `--state-warning` | `#f0a92e` | |
| `--state-danger` | `#f08a80` | `--c-red` at `#842029` is unreadable on dark |

### Measured contrast

Computed, not estimated:

| Pair | Ratio | |
|---|---|---|
| text-primary on base | **14.36** | AAA |
| text-primary on raised | **10.64** | AAA |
| text-secondary on base | **8.64** | AAA |
| text-secondary on raised | **6.40** | AA |
| text-muted on base | **5.32** | AA |
| accent on base | **7.18** | AAA |
| accent-on on accent | **7.81** | AAA |
| success / warning / danger on base | **8.28 / 8.43 / 7.00** | AAA |

For reference, today's light theme measures 11.01 (slate on white), 14.50 (charcoal on white), and
5.44 (white on ocean). **The proposal is at least as accessible as what is shipping**, which is the
bar it has to clear — a dark theme that is prettier and less readable is not an improvement in a
classroom.

One honest caveat: `--surface-base` against `--surface-raised` measures **1.35**. That is not a
WCAG failure — the 3:1 rule governs text and UI component boundaries, not two adjacent background
planes — but it is a real property of dark interfaces. **Surface steps read as smaller in the dark,
so borders and shadows have to do more of the separation work than they do today.** Expect to add
`--border-subtle` in places that currently rely on a background change alone.

## Three things that must NOT flip

**1. Canvas colours that carry game meaning.** This is the one I would defend hardest. Team glow is
blue for team 1 and orange for team 2; frozen state, flags, and barriers are all read by students as
*information*. If dark mode re-hues them, it changes what the game is teaching, and a student who
learns the board in dark mode and then sees a light-mode screenshot in a worksheet is looking at a
different game. **Only the board's neutral surfaces — floor, wall, jail, grid line — should respond
to the theme.** The semantic layer makes that separable; a blanket inversion does not.

**2. `--c-black` at alpha 0.** Five of its uses are `rgb(var(--c-black) / 0)` — a fully transparent
placeholder for a transition start, not a colour. It should not appear in the theme layer at all.

**3. The `hsla()` trio and the runtime `--burst-*` properties.** `plan-127` left them alone for good
reasons; P3 should too unless it has a specific need.

## Two things worth fixing while you are in there

Both are pre-existing and neither is urgent.

**`--c-sky` and `--c-ocean` differ by one channel** — `58 111 144` versus `59 111 144` — and sky is
used only for two low-alpha borders. `plan-127` correctly refused to merge them, because a silent
refactor must not change pixels. **P3 is the packet where merging them is legitimate**, because it
is an authoring decision made in the open with a reviewer, not a refactor claiming to change
nothing. In dark mode there is no reason to carry both.

**Amber measures 2.15:1 against white.** It is used as `color` in two places: the trace overflow
badge and the level-picker stars. I am not calling this a defect — the stars carry shape as well as
hue and already have an `aria-label`, so the information is not colour-only — but it is below the
3:1 threshold for a meaningful UI indicator and worth a deliberate look. It gets *better* in dark
mode, not worse, which is a small argument for the dark theme rather than against it.

## The other two systems

Charter V8's three systems, with the DOM now designed:

| System | State |
|---|---|
| **DOM / CSS** | Seam built (`plan-127`). This proposal covers it. |
| **Canvas** | Seam built (`plan-126`). Needs the same semantic split, and the "must not flip" rule above is the governing constraint. Smaller job than the DOM. |
| **Blockly** | **No theme is configured at all.** This is the unbounded one: Blockly themes cover block colours, category colours, toolbox and flyout chrome, and the workspace background, and the block colours are load-bearing for the curriculum in the same way the canvas colours are. |

I would scope Blockly as its own packet rather than folding it into P3. It is the only one of the
three with no existing seam, and its colour decisions are curriculum decisions.

## What I need from you

1. **Do the surface and text values look right to you?** You are the one who will look at this for
   hours in a classroom. Swatches beat tables — say the word and I will build a preview page you can
   open in a browser rather than reading hex codes.
2. **Is the "canvas game colours never flip" rule right**, or do you want the board neutrals and the
   piece colours to move together?
3. **Toggle or system preference?** `prefers-color-scheme` alone, an explicit setting in the gear
   modal, or both with the setting overriding. The existing settings modal makes the third cheap,
   and it rides the same portable-state decision as skin choice (V5 / owner ruling 5).
4. **Does Blockly get its own packet?** My recommendation: yes.

None of this is scheduled. `plan-123`'s P2 still needs its three curated sets chosen, and the Gate 1
and Gate 2 probe runs remain the only items actually blocking Stage 1.
