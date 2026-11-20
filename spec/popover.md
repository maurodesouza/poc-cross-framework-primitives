# Popover

## Purpose

Non-modal floating content anchored to a trigger: a panel the user opens, uses and leaves
(APG: a non-modal `dialog` disclosed by a button). The page stays usable while it is open. Menus
and listboxes have their own components ([Menu](menu.md), [Combobox](combobox.md)); tooltips are
an extra for later.

## Anatomy

| part | element | `data-popover-part` | notes |
| --- | --- | --- | --- |
| Root | none | | holds the state |
| Trigger | `button` | `trigger` | toggles the popover and is its anchor |
| Portal | none | | moves the Positioner to the end of `body` (or a given container) |
| Positioner | `div` | `positioner` | positions the popup next to the anchor |
| Popup | `div` | `popup` | the popover itself |
| Arrow | `div` | `arrow` | points at the anchor; optional |
| Title | `h2` | `title` | names the popover |
| Description | `p` | `description` | describes it |
| Close | `button` | `close` | closes it |

## API

**Root**: `open`, `defaultOpen` (`false`), `onOpenChange(open, details)`.

**Trigger**: `disabled`.

**Portal**: `container`.

**Positioner**: `side` (`"bottom"`; one of `top`, `bottom`, `start`, `end`), `align` (`"center"`;
`start`, `center`, `end`), `sideOffset` (`0`, px), `alignOffset` (`0`, px), `collisionPadding`
(`8`, px), `anchor` (an element; defaults to the Trigger).

**Popup**: `initialFocus` (default: the popup itself), `finalFocus` (default: the trigger when the
popover closed by Escape, Close or the trigger; nowhere when it closed by an outside press or
focus-out, so focus stays where the user put it).

## State attributes and ARIA

| part | attributes |
| --- | --- |
| Trigger | `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` (while open), `data-open`, `data-disabled` |
| Positioner | `data-side`, `data-align`, `data-open`; CSS variables `--anchor-width`, `--anchor-height`, `--available-width`, `--available-height`, `--transform-origin`; structural inline style (`position`, `top`, `left`, `transform`) |
| Popup | `role="dialog"` (no `aria-modal`), `aria-labelledby` / `aria-describedby` when Title / Description exist, `tabindex="-1"`, `data-side`, `data-align`, `data-open`, `data-starting-style`, `data-ending-style` |
| Arrow | `data-side`, `data-align`, `aria-hidden="true"`; structural inline style placing it along the popup's edge |
| Title, Description | an `id` |

## Keyboard

| key | action |
| --- | --- |
| Enter, Space on Trigger | toggles |
| Tab | moves through the popup's content in order; Tab from its last tabbable element moves focus to the element after the trigger in the page and closes the popover (reason `focus-out`) |
| Shift+Tab | from the popup's first tabbable element (or the popup), moves focus back to the trigger and closes (reason `focus-out`) |
| Escape | closes (reason `escape-key`) and focuses the trigger; a child layer closes first |

## Focus

- On open, focus moves to `initialFocus`, else the popup.
- Focus is **not** trapped. In the tab order, the popup's content comes right after the trigger,
  even though it is portalled.
- When focus leaves the popup and its child layers (by Tab, or by clicking a focusable element
  outside), the popover closes (reason `focus-out` or `outside-press`).

## Pointer

- A press on the Trigger toggles (reason `trigger-press`); pressing it while open closes, never
  "outside press then reopen".
- A press outside the popup and its child layers closes (reason `outside-press`) without moving
  focus back to the trigger.

## Dismissal and layering

The popover is a layer (see [dialog.md](dialog.md#dismissal-and-layering)). Opened inside another
layer, it is that layer's child. No scroll lock, no inert page.

## Positioning

- The popup sits on `side` of the anchor, aligned by `align`, offset by `sideOffset` /
  `alignOffset`.
- **Flip**: when `side` lacks room in the viewport (minus `collisionPadding`), the popup moves to
  the opposite side; `data-side` reports the side it ended up on.
- **Shift**: along the cross axis, the popup stays inside the viewport.
- `start` and `end` are logical: `end` is to the right in LTR and to the left in RTL.
- The position follows the anchor on scroll and resize while open.

## Animation

Popup carries `data-starting-style` / `data-ending-style` as in [dialog.md](dialog.md#animation);
the Positioner stays mounted until the popup's exit animations finish. `--transform-origin` points
at the anchor so a scale transition grows from it.

## RTL

`side="start"`/`"end"` and `align="start"`/`"end"` follow the direction of the anchor's document
(`dir`). Keyboard behaviour does not change.

## Scenarios

### `/popover/basic`

Content: a button **"Open popover"** (Trigger), followed in the page by a button **"After
trigger"**; the popup with Title **"Notifications"**, Description **"You have 3 unread
messages."**, a button **"Mark all as read"** and a Close **"Close"**. Output: `open: ...`,
`reason: ...`.

Checks:

1. Trigger has `aria-haspopup="dialog"`, `aria-expanded="false"`; then `"true"` with
   `aria-controls`.
2. Clicking it shows a non-modal `dialog` named "Notifications" (no `aria-modal`).
3. Focus is on the popup; Tab moves to "Mark all as read", then "Close".
4. Tab from "Close" moves focus to "After trigger" and closes (`reason: focus-out`).
5. Reopen; Escape closes (`reason: escape-key`) and focuses "Open popover".
6. Reopen; clicking the page body closes (`reason: outside-press`); focus is not moved to the
   trigger.
7. Reopen; clicking "Open popover" closes (`reason: trigger-press`) and does not reopen.
8. Axe finds no violation while open.

### `/popover/placement`

Three popovers with Positioner props, Triggers **"Bottom start"** (`side="bottom" align="start"`),
**"End"** (`side="end"`) and **"Flip"** (`side="bottom"`, its trigger placed at the bottom edge of
the viewport). Each popup has Title "Placed".

Checks (geometry, measured with bounding boxes):

1. "Bottom start": the popup's top is below the trigger's bottom, and their left edges are
   aligned (±1 px).
2. "End" (LTR): the popup is to the right of the trigger.
3. "Flip": the popup is above the trigger; contract layer: `data-side="top"`.

### `/popover/rtl?dir=rtl`

The "End" popover of `/popover/placement` in a document with `dir="rtl"`.

Checks: the popup is to the **left** of the trigger; contract layer: `data-side="end"`.

### `/popover/arrow`

A Trigger **"With arrow"** and a popup with an Arrow and Title **"Arrow"**.

Checks: the arrow's centre is horizontally within the trigger's box (±2 px); contract layer:
Arrow has `aria-hidden="true"` and `data-side="bottom"`.

## Baseline deviations

Filled by the conformance work.
