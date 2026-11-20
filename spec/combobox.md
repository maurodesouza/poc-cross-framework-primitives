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
| ArrowDown | closed: opens and highlights the selected item, else the first enabled item (reason `list-navigation`); open: highlights the next enabled item (wraps) |
| ArrowUp | closed: opens and highlights the selected item, else the last enabled item; open: highlights the previous enabled item (wraps) |
| Alt+ArrowDown | opens without highlighting |
| Alt+ArrowUp | closes, keeping the input value |
| Home / End | move the text caret (native input behaviour), never the highlight |
| Enter | open with a highlighted item: chooses it (value, input value, closes; reason `item-press`); otherwise does nothing and does not submit a form while the list is open |
| Escape | open: closes, keeping the input value (reason `escape-key`); closed: clears the input value |
| Tab | closes without choosing (reason `focus-out`) and lets focus move on |

Disabled items are skipped by navigation and cannot be chosen.

## Focus

The Input keeps DOM focus while the list is open. Clicking an item or the Trigger does not move
focus away from the Input.

## Pointer

- A press on the Trigger toggles the list and keeps focus in the Input (reason `trigger-press`).
- Hovering an enabled item highlights it; clicking it chooses it.
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
3. ArrowDown: `aria-activedescendant` points at "Banana"; ArrowDown → "Blueberry"; ArrowDown wraps
   to "Banana".
4. Enter: output `value: banana`, `input: Banana`; the list closes.
5. Escape (the list is closed, so it clears the input: `input: ` empty, `value: banana` kept),
   then ArrowDown: the list opens with all items and "Banana" (the selected item) highlighted,
   with `aria-selected="true"`.
6. Navigation skips "Orange", which has `aria-disabled="true"`.
7. Type `xyz`: the list shows "No fruit found." and no option.
8. Escape closes and keeps `input: xyz`; Escape again clears the input.
9. Click "Show fruits": the list opens, focus stays on the input; click "Cherry": `value:
   cherry`, `input: Cherry`.
10. Open, click outside: closes with `reason: outside-press`.
11. Axe finds no violation while open.

### `/combobox/controlled`

The fixture holds `value` and `inputValue` in its own state, starting at `value: mango` /
`input: Mango`, and a button **"Reset"** sets both to `null` / `""`.

Checks: the input shows "Mango" on load; opening highlights "Mango"; "Reset" empties the input and
the next ArrowDown highlights "Apple".

## Baseline deviations

Filled by the conformance work.
