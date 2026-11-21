# Slider

## Purpose

Choose a number (or a range of numbers) within bounds by dragging a thumb along a track, pressing
the track, or with the keyboard (APG `slider` and multi-thumb slider). It works in a native
`<form>`: each thumb submits its value. A slider with marks or labels along the track, a vertical
range in RTL writing modes and non-linear scales are out of scope.

## Anatomy

| part | element | `data-slider-part` | notes |
| --- | --- | --- | --- |
| Root | `div` | `root` | holds the state; a `group` |
| Control | `div` | `control` | the interactive area: a press here moves the nearest thumb, then drags it |
| Track | `div` | `track` | the rail |
| Indicator | `div` | `indicator` | the filled part: from `min` to the value, or between two thumbs |
| Thumb | `div` | `thumb` | a `slider`; one per value |
| (hidden input) | `input type="hidden"` | `input` | one per value, rendered by the Root; what the form submits |

## API

**Root**:

- `value`, `defaultValue` (`min`), `onValueChange(value, details)`: a number, or an array of
  numbers for several thumbs (sorted ascending). The type of `defaultValue` (or `value`) decides
  between one and several thumbs.
- `onValueCommit(value, details)`: once, when a drag ends (pointer up) or after a key changes the
  value.
- `min` (`0`), `max` (`100`), `step` (`1`), `largeStep` (`10`, Page Up / Page Down and
  Shift+Arrow).
- `minStepsBetweenValues` (`0`): the smallest distance between two thumbs, in steps.
- `orientation` (`"horizontal"`), `disabled`, `name`.

**Thumb**: `index` (its value's index; default: its order among the thumbs), `getAriaValueText(value,
index)` (a string for `aria-valuetext`), `disabled`. Its accessible name comes from the consumer
(`aria-label` or `aria-labelledby`).

**Control**, **Track**, **Indicator**: no props.

Values snap to `min + n × step` and stay in `[min, max]`. With several thumbs, a thumb stays
`minStepsBetweenValues × step` away from its neighbours: thumbs never cross or swap.

Change reasons (spec/README.md): `keyboard` (a key on a thumb), `track-press` (a press on the
Control away from the thumb), `drag` (pointer moves after a press).

## State attributes and ARIA

| part | attributes |
| --- | --- |
| Root | `role="group"`, `data-orientation`, `data-disabled`, `data-dragging` while a pointer drags |
| Control, Track | `data-orientation`, `data-disabled`, `data-dragging` |
| Indicator | `data-orientation`; structural inline style: `inset-inline-start` and `inline-size` in % (horizontal), `inset-block-end` and `block-size` (vertical) |
| Thumb | `role="slider"`, `tabindex="0"` (none when disabled), `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext` (from `getAriaValueText`), `aria-orientation`, `aria-disabled="true"` and `data-disabled` when disabled, `data-orientation`, `data-index`, `data-dragging` while dragged; structural inline style placing it (`inset-inline-start: <percent>%` with a `translate`, or `inset-block-end` when vertical) |
| hidden input | `type="hidden"`, `name`, `value` (one per thumb, in order) |

With several thumbs, each thumb's `aria-valuemin` / `aria-valuemax` are the bounds it can reach
(the neighbour's value ∓ the minimum distance), as the APG multi-thumb example does.

## Keyboard

| key | horizontal | vertical |
| --- | --- | --- |
| increase by `step` | ArrowRight (ArrowLeft in RTL), ArrowUp | ArrowUp, ArrowRight (ArrowLeft in RTL) |
| decrease by `step` | ArrowLeft (ArrowRight in RTL), ArrowDown | ArrowDown, ArrowLeft (ArrowRight in RTL) |
| Page Up / Page Down, Shift+Arrow | ± `largeStep` | same |
| Home / End | `min` / `max` (within the thumb's reachable bounds) | same |

## Focus

Every thumb is a tab stop, in value order. A press on the Control focuses the thumb it moves.

## Pointer

- A press on the Control (mouse, touch, pen; primary button only) moves the **nearest** thumb to
  the value under the pointer (reason `track-press`) and starts a drag; with equidistant thumbs,
  the one the pointer is past moves (so the user can pull thumbs apart).
- The drag uses pointer capture: it follows the pointer outside the Control, the window included,
  until pointer up or cancel (reason `drag`; `data-dragging` meanwhile).
- The value maps linearly across the Control's box: its inline start is `min` (the right edge in
  RTL); vertically its bottom is `min`.
- `touch-action: none` on the Control (structural) keeps a touch drag from scrolling the page.

## RTL

Horizontal sliders run right to left: `min` at the right, the arrows swap. Vertical sliders do not
change.

## Scenarios

The form scenarios print `form: <key=value&...>` as [checkbox.md](checkbox.md#scenarios) does.
The Control has `data-testid="control"` (it has no role) and is 200 px wide (or high, vertical),
so 1% of the range is 2 px, and pointer positions are chosen on whole pixels.

### `/slider/basic`

A `<form>`: a Slider with one thumb (`aria-label` **"Volume"**), `defaultValue` `50`, `name`
`"volume"`; a **"Submit"** button. Output: `value: ...` (the last change), `committed: ...` (the
last commit), `form: ...`.

Checks:

1. One `slider` named "Volume", value 50, min 0, max 100, horizontal.
2. Focused: ArrowRight → 51, ArrowUp → 52, ArrowLeft → 51, ArrowDown → 50, Page Up → 60,
   Page Down → 50, Shift+ArrowRight → 60, End → 100, Home → 0; `committed` follows each key.
3. A press on the Control at 30% → 30 (`committed: 30`); the thumb has focus.
4. Press the thumb and drag with stepped moves to 80% → 80 while dragging, `committed: 80` only
   after the release; dragging on below the Control (the pointer leaves it) to 90% → 90.
5. "Submit": `form: volume=<value>`.
6. Axe finds no violation.

### `/slider/range`

A `<form>`: thumbs **"Minimum price"** and **"Maximum price"**, `defaultValue` `[20, 80]`,
`minStepsBetweenValues` `10`, `name` `"price"`, `getAriaValueText` giving `"$20"`; a **"Submit"**
button. Output: `value: 20,80`, `form: ...`.

Checks:

1. Two sliders: "Minimum price" (value 20, `aria-valuetext="$20"`), "Maximum price" (80).
2. On "Minimum price", End → 70 (80 − 10); on "Maximum price", Home → 80 (70 + 10).
3. A press at 95% moves "Maximum price" (the nearest) → 95; at 5% moves "Minimum price" → 5.
4. "Submit": `form: price=<min>&price=<max>`.

### `/slider/vertical`

A vertical slider (`aria-label` **"Brightness"**), `defaultValue` `30`, 200 px high.

Checks: `aria-orientation="vertical"`; ArrowUp → 31, ArrowRight → 32, ArrowDown → 31; a press at
75% from the bottom → 75.

### `/slider/rtl?dir=rtl`

The slider of `/slider/basic` ("Volume", 50) in a document with `dir="rtl"`.

Checks: ArrowRight → 49, ArrowLeft → 50; a press at 25% from the **left** edge → 75.

### `/slider/controlled`

A slider (`aria-label` **"Limited"**) whose value the fixture holds, starting at `70`, refusing
any value above `80` (spec/README.md, "A controlled value the consumer rejects"). Output: `value:
...`, `requested: ...`.

Checks: End reports `requested: 100` and the slider stays at 70; ArrowRight → 71.

## Baseline deviations

Measured against Base UI 1.9 (`Slider`): its thumbs hold a native `<input type="range">`, which
gives the `slider` role, the value and the bounds natively; the behaviour layer reads the
accessible value (`aria-valuenow`, else the native range's value), the contract layer checks the
spec's attributes on the Fragiola implementations.

| difference | test |
| --- | --- |
