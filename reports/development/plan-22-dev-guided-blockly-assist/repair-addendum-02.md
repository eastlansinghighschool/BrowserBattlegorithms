# Plan 22 Repair Addendum 02: Visible Geometry And Non-Cropped Board

## Status

Plan 22 should still be treated as **not complete**.

The first repair made the Playwright assertion pass, but integration review found two issues at `1280x720`:

- `On Each Turn` is to the right of the flyout but is pushed off the visible Blockly workspace.
- The dev-guided "shrunk" game board is cropped rather than scaled because the p5 canvas remains `600x400` inside a narrower container with `overflow: hidden`.

Measured evidence from the current worktree:

```text
#blocklyDiv.right: 1298
flyout.right: 1190.8
On Each Turn.left: 1400.8
On Each Turn.right: 1512.2
canvas-container.width: 566
canvas.width: 600
```

The existing browser test is therefore too weak: `blockRect.left > flyoutRect.right + 8` proves the block clears the drawer, but it does not prove the block remains visible to Gemini.

## Repair Goal

At a `1280x720` viewport with valid local-dev `devGuidedLevel`:

- the first toolbox category is open
- the `On Each Turn` block clears the flyout
- the `On Each Turn` block remains inside the visible Blockly area
- the game board is not horizontally cropped
- the lesson/directions panel remains visible
- normal Guided Levels and Free Play remain unchanged

## Required Test Tightening

Update the assisted browser test to assert **both** conditions:

```js
expect(blockRect.left).toBeGreaterThan(flyoutRect.right + 8);
expect(blockRect.right).toBeLessThanOrEqual(blocklyRect.right - 8);
```

Also assert that the board is not cropped:

```js
expect(canvasRect.right).toBeLessThanOrEqual(canvasContainerRect.right);
expect(canvasRect.left).toBeGreaterThanOrEqual(canvasContainerRect.left);
```

Use reasonable margins if borders make exact equality noisy, but do not allow obvious clipping.

## Required Implementation Direction

Do not solve this by pushing the workspace farther right.

The previous reveal translation can make the geometry test pass while hiding the starter block offscreen. Prefer one of these cleaner approaches:

1. Give Blockly enough visible width that the flyout and starter block can coexist without offscreen translation.
2. Reduce the starter block x-position so it clears the flyout but remains inside `#blocklyDiv`.
3. If a reveal translation remains, clamp it so the starter block's right edge stays inside the visible Blockly rect.

For the game board:

- Do not make `#canvas-container` narrower than the actual p5 canvas unless the canvas is scaled with it.
- Either keep the board container at the full canvas width or apply a real scale/resize strategy that preserves the whole board.
- Do not rely on `overflow: hidden` cropping as a "shrink" strategy.

## Suggested Sequencing

1. Add the stricter failing assertions first.
2. Run the focused Playwright spec and confirm it fails for the current offscreen/cropped geometry.
3. Fix Blockly visibility:
   - Prefer layout width first.
   - If translation remains, clamp to visible bounds.
4. Fix board cropping:
   - Keep the full canvas visible, or scale the whole canvas/container together.
5. Re-run the focused Playwright spec.
6. Run targeted unit tests.
7. Run `npm test`, `npm run build`, and `npm run test:browser` if the layout repair touches shared browser behavior.
8. Update the Plan 22 progress report with the second repair notes.

## Stop Conditions

Stop and report if:

- the only passing geometry puts the block offscreen
- the board remains cropped in dev-guided layout
- keeping directions visible and keeping the board uncropped leaves too little room for Blockly at `1280x720`
- the repair requires changing normal student-facing layout
- the repair depends on arbitrary long timeouts
- the fix would require changing p5 rendering behavior beyond a dev-guided layout adjustment

## Handoff Summary To Include

When complete, report:

- `#blocklyDiv`, flyout, and `On Each Turn` rects at `1280x720`
- canvas and canvas-container rects at `1280x720`
- whether translation remains and how it is clamped
- commands run
- whether normal Guided Levels and Free Play were checked
