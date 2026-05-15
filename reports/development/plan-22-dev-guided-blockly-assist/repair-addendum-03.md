# Plan 22 Repair Addendum 03: Fit The Dev Harness In The Viewport

## Status

Plan 22 is still **not complete**.

The latest repair makes the internal Blockly geometry pass, but it does so by making the dev-guided page wider than the viewport at `1280x720`.

Measured current behavior at `1280x720`:

```text
document width: 1528
#game-container.left: -216
#game-container.right: 1496
#canvas-container.left: -203
#blockly-region.right: 1528
```

So the board is not cropped inside its own container, and `On Each Turn` is inside `#blocklyDiv`, but the overall app is horizontally clipped. This matches the observed Gemini screenshot where the browser cannot see the left edge and Blockly still runs off the right.

The next repair must make the entire dev-guided harness fit in the viewport.

## Repair Goal

At a `1280x720` viewport with valid local-dev `devGuidedLevel`:

- the page must not require horizontal scrolling
- `#game-container.left >= 0`
- `#game-container.right <= window.innerWidth`
- `#canvas-container` and its canvas must be visible inside the viewport
- `#blockly-region.right <= window.innerWidth`
- the lesson/directions panel remains visible
- first toolbox category is open
- `On Each Turn` clears the flyout and remains inside `#blocklyDiv`
- normal Guided Levels and Free Play remain unchanged

## Required Test Tightening

Extend the assisted Playwright test to assert viewport containment, not just internal element containment:

```js
expect(documentWidth).toBeLessThanOrEqual(viewportWidth);
expect(gameRect.left).toBeGreaterThanOrEqual(0);
expect(gameRect.right).toBeLessThanOrEqual(viewportWidth);
expect(canvasContainerRect.left).toBeGreaterThanOrEqual(0);
expect(blocklyRegionRect.right).toBeLessThanOrEqual(viewportWidth);
```

Keep the existing assertions:

```js
expect(blockRect.left).toBeGreaterThan(flyoutRect.right + 8);
expect(blockRect.right).toBeLessThanOrEqual(blocklyRect.right - 8);
expect(canvasRect.right).toBeLessThanOrEqual(canvasContainerRect.right);
expect(canvasRect.left).toBeGreaterThanOrEqual(canvasContainerRect.left);
```

The test should fail on the current implementation before the fix.

## Required Implementation Direction

Stop using a `max-content` dev-guided layout that is wider than the viewport.

Replace:

```css
#game-container.guided-dev-blockly-assist {
  grid-template-columns: 600px 300px 760px;
  width: max-content;
}
```

with a viewport-fitting layout. The preferred strategy is:

1. Scale the dev-only board visually instead of keeping it full-size.
2. Keep the lesson panel visible but narrower.
3. Allocate the remaining viewport width to Blockly.
4. Keep the total grid width at or below `100vw`.

Suggested starting dimensions for `1280px` wide:

```text
simulation column: about 430-460px
lesson column: about 250-270px
Blockly column: remaining space, about 500-560px
```

For the board, do not crop. If the internal p5 canvas remains `600x400`, scale it with CSS in the dev-only layout:

```css
#game-container.guided-dev-blockly-assist #canvas-container {
  width: 450px;
  min-height: 300px;
}

#game-container.guided-dev-blockly-assist #canvas-container canvas {
  width: 450px !important;
  height: 300px !important;
  display: block;
}
```

The exact numbers can differ, but the rendered canvas must fit inside the rendered container and the full page must fit inside the viewport.

## Blockly Placement Guidance

With a narrower but viewport-fitting Blockly column, use a modest starter x-position and clamp any reveal scroll.

Avoid pushing `On Each Turn` so far right that the page needs horizontal overflow. A good target is:

```text
block.left > flyout.right + 8
block.right <= blocklyDiv.right - 8
```

If the first toolbox category is `Conditions` on Level 3, that is acceptable. Do not change toolbox ordering unless the level metadata/toolbox policy requires it.

## Suggested Sequencing

1. Add the viewport-containment assertions to the assisted browser test.
2. Confirm the current implementation fails because the page overflows horizontally.
3. Replace the `max-content` fixed wide layout with a `100vw`-bounded dev-only grid.
4. Scale the p5 canvas visually in the dev-only layout so the whole board is visible.
5. Re-tune starter block x-position or clamped scroll only after the layout fits.
6. Re-run the focused browser spec.
7. Run:

```powershell
node --test --test-isolation=none tests/unit/dev-guided-level-link.test.js
npx playwright test tests/browser/dev-guided-level-link.spec.js --reporter=line
npm test
npm run build
```

8. Run `npm run test:browser` if any shared layout behavior changed.
9. Update the Plan 22 progress report with the final rects at `1280x720`.

## Stop Conditions

Stop and report if:

- the assisted page still has horizontal overflow at `1280x720`
- the only passing solution hides/collapses the directions panel
- the board is cropped rather than scaled
- the starter block clears the flyout only by leaving the visible Blockly area
- the repair changes normal Guided Levels or Free Play
- the fix requires broad p5 rendering changes beyond dev-only CSS scaling

## Final Handoff Must Include

Report these exact measurements at `1280x720`:

- `documentElement.scrollWidth`
- `window.innerWidth`
- `#game-container` rect
- `#canvas-container` rect
- canvas rect
- lesson panel rect
- `#blockly-region` rect
- `#blocklyDiv` rect
- flyout rect
- `On Each Turn` rect
