# Combobox

## Purpose

A text input that filters a popup list, for choosing **one** value (APG `combobox` with a
`listbox` popup, list autocomplete without automatic selection). The consumer filters the items:
the combobox reports the input value and renders the items it is given. Multiple selection,
chips, creatable values and grouped lists are out of scope.

## Anatomy

| part | element | `data-combobox-part` | notes |
| --- | --- | --- | --- |
| Root | none | | holds the state |
| Input | `input` | `input` | the `combobox`; keeps DOM focus |
| Trigger | `button` | `trigger` | toggles the list; optional; not in the tab order |
| Portal | none | | |
| Positioner | `div` | `positioner` | anchored to the Input (or a given anchor) |
| Popup | `div` | `popup` | the floating container |
| List | `div` | `list` | the `listbox` |
| Item | `div` | `item` | an `option` |
| Empty | `div` | `empty` | rendered by the consumer when no item matches |

## API

**Root**:

- `value`, `defaultValue` (`null`), `onValueChange(value, details)`: the selected item's `value`
  (a string), or `null`.
- `inputValue`, `defaultInputValue` (`""`), `onInputValueChange(inputValue, details)`: the text in
  the input.
- `open`, `defaultOpen` (`false`), `onOpenChange(open, details)`.
- `disabled`.

**Item**: `value` (string, required), `label` (the text written into the input when the item is
chosen, and its typeahead text; defaults to its text content), `disabled`.

**Positioner**: as Popover's; defaults `side="bottom" align="start"`, and `--anchor-width` lets
the consumer match the input's width.

**Trigger**, **Input**: `disabled` comes from the Root.

When an item is chosen, the input value becomes its `label`, `onInputValueChange` fires with
reason `item-press`, and the list closes.

## State attributes and ARIA

| part | attributes |
| --- | --- |
| Input | `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` (the List's id), `aria-activedescendant` (the highlighted item's id, only while one is highlighted), `autocomplete="off"`, `data-open`, `data-disabled` |
| Trigger | `tabindex="-1"`, `aria-expanded`, `aria-controls`, `data-open`, `data-disabled` |
| Positioner, Popup | as Popover's (Popup has no role) |
| List | `role="listbox"`, an `id`, `data-empty` when it holds no item |
| Item | `role="option"`, an `id`, `aria-selected="true"` on the selected item (absent on others), `aria-disabled="true"` and `data-disabled` when disabled, `data-highlighted`, `data-selected` |
| Empty | none beyond the part attribute; the consumer renders it only when the list is empty |

The Input's accessible name comes from the consumer (`<label for>`, `aria-label`).

## Keyboard

DOM focus **always stays on the Input**; the highlighted item is announced through
`aria-activedescendant` (virtual focus).

| key | action |
| --- | --- |
| typing | updates the input value (reason `input-change`) and opens the list; **no item is highlighted** until the user navigates |
| ArrowDown | closed: opens and highlights the selected item, else the first item (reason `list-navigation`); open: highlights the next item; from the last item, returns the visual focus to the input (no highlight), and the next ArrowDown highlights the first item |
| ArrowUp | closed: opens and highlights the selected item, else the last item; open: highlights the previous item; from the first item, returns the visual focus to the input, and the next ArrowUp highlights the last item |
| Alt+ArrowDown | opens without highlighting |
| Alt+ArrowUp | closes, keeping the input value |
| Home / End | move the text caret (native input behaviour), never the highlight |
| Enter | open with a highlighted item: chooses it (value, input value, closes; reason `item-press`); otherwise does nothing and does not submit a form while the list is open |
| Escape | open: closes, keeping the input value (reason `escape-key`); closed: clears the input value **and** the selected value (reason `escape-key`), so the visible text and the value never disagree |
| Tab | closes without choosing (reason `focus-out`) and lets focus move on |

The APG lets the arrows either stop at the ends or return to the input; this spec returns to the
input, so the user can always get back to what they typed.

**Disabled items can be highlighted** (APG: listbox options stay focusable when disabled, so they
can be discovered) but cannot be chosen: Enter on a disabled item and clicks on it do nothing.

## Focus

The Input keeps DOM focus while the list is open. Clicking an item or the Trigger does not move
focus away from the Input.

## Pointer

- A press on the Trigger toggles the list and keeps focus in the Input (reason `trigger-press`).
- Clicking the Input does not open the list: typing, the arrow keys and the Trigger do.
- Hovering an item highlights it; clicking an enabled item chooses it.
- A press outside the Input, the Trigger and the Popup closes the list (reason `outside-press`).

## Dismissal and layering

The open list is a layer. A list inside a Dialog is a child of the dialog's layer: Escape closes
the list first.

## Positioning

As [popover.md](popover.md#positioning), anchored to the Input.

## Animation

As [popover.md](popover.md#animation).

## RTL

The list follows the input's direction for `align`; the keyboard map does not change.

## Scenarios

### `/combobox/basic`

Content: a `<label>` **"Fruit"** for the Input; a Trigger with `aria-label` **"Show fruits"**;
items (value = label in lower case): **Apple**, **Banana**, **Blueberry**, **Cherry**, **Grape**,
**Mango**, **Orange** (disabled). The fixture filters with a case-insensitive "contains" on the
label and renders Empty **"No fruit found."** when nothing matches. Output: `value: ...`,
`input: ...`, `open: ...`, `reason: ...`.

Checks:

1. A `combobox` named "Fruit" with `aria-expanded="false"` and `aria-autocomplete="list"`.
2. Type `b`: a `listbox` with options "Banana" and "Blueberry"; `aria-expanded="true"`; no
   `aria-activedescendant`; focus stays on the input.
3. ArrowDown: `aria-activedescendant` points at "Banana"; ArrowDown → "Blueberry"; ArrowDown returns
   to the input (no `aria-activedescendant`); ArrowDown → "Banana".
4. Enter: output `value: banana`, `input: Banana`; the list closes.
5. With "Banana" chosen and the list closed, ArrowDown opens the list on "Banana" (the selected
   item, highlighted, with `aria-selected="true"`). Escape closes it; Escape again (closed)
   clears the input and the value: `input: ` empty, `value: none`.
6. Type `an`: options "Banana", "Mango", "Orange"; "Orange" has `aria-disabled="true"`.
   ArrowDown ×3 highlights "Orange"; Enter does nothing (no value, the list stays open);
   ArrowDown returns to the input.
7. Type `xyz`: the list shows "No fruit found." and no option.
8. Escape closes and keeps `input: xyz`; Escape again clears the input.
9. Click "Show fruits": the list opens, focus stays on the input; click "Cherry": `value:
   cherry`, `input: Cherry`.
10. Open, click outside: closes with `reason: outside-press`.
11. Axe finds no violation while open.

### `/combobox/controlled`

The fixture holds `value` and `inputValue` in its own state, starting at `value: mango` /
`input: Mango`, and a button **"Reset"** sets both to `null` / `""`.

Checks: the input shows "Mango" on load; ArrowDown opens the list highlighting "Mango"; after
Escape, "Reset" empties the input and the next ArrowDown highlights "Apple".

## Baseline deviations

Measured against Base UI 1.9 (`Combobox` with `filteredItems`, so the fixture filters).

| difference | test |
| --- | --- |
| Escape while the list is open resets the input to the selected item's label (empty when none), instead of keeping the typed text. The APG: Escape closes the popup "without changing previous input" | `combobox / basic › Escape closes keeping the text, then clears it` |
| While the list is open, everything outside it is hidden from assistive technologies (`aria-hidden`), the input's `<label>` included, so axe reports the input as unlabelled | `combobox / basic › has no axe violation while open` |

Fixture settings, not deviations: Base UI opens the list when the input is clicked unless
`openOnInputClick={false}`, which the fixture sets (the spec opens on typing, the arrows and the
Trigger). Base UI applies a highlight asynchronously, so a test checks the highlight before
pressing Enter, as a user would see it.

