# Select

## Purpose

Choose **one** value from a list that pops up from a button (APG "select-only combobox": a
`combobox` that is not editable, with a `listbox` popup). It works in a native `<form>`: it
submits, resets and validates as a `<select>` would. Multiple selection, groups, a search field
and scroll arrows are out of scope.

## Anatomy

| part | element | `data-select-part` | notes |
| --- | --- | --- | --- |
| Root | none | | holds the state; renders the hidden input |
| Trigger | `button` | `trigger` | the `combobox`; keeps DOM focus while the list is open |
| Value | `span` | `value` | inside the Trigger: the selected item's label, or the placeholder |
| Portal | none | | |
| Positioner | `div` | `positioner` | positions the popup below the trigger |
| Popup | `div` | `popup` | the floating container |
| List | `div` | `list` | the `listbox` |
| Item | `div` | `item` | an `option` |
| ItemIndicator | `span` | `item-indicator` | inside an Item, rendered only while it is selected |
| (hidden input) | `input` | `input` | rendered by the Root; what the form submits and validates |

## API

**Root**:

- `value`, `defaultValue` (`null`), `onValueChange(value, details)`: the selected item's `value`
  (a string), or `null`.
- `open`, `defaultOpen` (`false`), `onOpenChange(open, details)`.
- `items`: every item, `{ value, label, disabled? }[]`. The Root needs them while the list is
  closed (the Value's label, typeahead on the closed trigger, the hidden input); the consumer
  renders the Items from the same array.
- `name`, `required`, `disabled`.

**Value**: `placeholder` (shown, as the Value's text, while nothing is selected).

**Item**: `value` (string, required), `disabled`. Its label is the matching `items` entry's
`label`.

**ItemIndicator**: `keepMounted` (`false`).

**Positioner**: as Popover's; defaults `side="bottom" align="start"`, `sideOffset` `4`.
`--anchor-width` lets the consumer make the popup at least as wide as the trigger.

When an item is chosen, the value changes (reason `item-press`), the list closes and focus stays
on the trigger.

### Item alignment: a standard placement

Base UI lays the selected item over the trigger (`alignItemWithTrigger`), as macOS menus do. This
spec places the popup **below the trigger** (flipping above when there is no room), as React Aria
and the APG example do: the trigger stays visible, the positioning layer (`@poc/dom`
`anchorFloating`) stays the only one, and the list never covers what the user just read. The
baseline fixture sets `alignItemWithTrigger={false}` (a fixture setting, not a deviation).

## State attributes and ARIA

| part | attributes |
| --- | --- |
| Trigger | `role="combobox"`, `type="button"`, `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` (the List's id, while open), `aria-activedescendant` (the highlighted item's id, while open), `aria-required="true"` when required, `disabled` and `data-disabled`, `data-open`, `data-placeholder` while nothing is selected |
| Value | `data-placeholder` while nothing is selected |
| Positioner, Popup | as Popover's (Popup has no role) |
| List | `role="listbox"`, an `id`, `aria-labelledby` (the trigger's labels: the consumer's `<label>` and the trigger) |
| Item | `role="option"`, an `id`, `aria-selected` (`"true"` on the selected item, `"false"` on the others), `aria-disabled="true"` and `data-disabled`, `data-highlighted`, `data-selected` |
| ItemIndicator | `aria-hidden="true"` |
| hidden input | `name`, `value` (`""` when nothing is selected), `required`, `disabled`, `aria-hidden="true"`, `tabindex="-1"`, structural inline style (visually hidden; not `type="hidden"`, which a browser never validates) |

The Trigger's accessible name comes from the consumer: `<label for>` (a `button` is labelable) or
`aria-label`. Its text (the Value) is its value, not its name: the consumer's label wins.

## Keyboard

DOM focus **always stays on the Trigger**; the highlighted item is announced through
`aria-activedescendant` (virtual focus), as in the APG select-only combobox.

| key | closed | open |
| --- | --- | --- |
| ArrowDown | opens, highlights the selected item, else the first enabled one (reason `list-navigation`) | next item (stops at the last) |
| ArrowUp | opens, highlights the selected item, else the first enabled one | previous item (stops at the first) |
| Enter, Space | opens (as ArrowDown) | chooses the highlighted item and closes (reason `item-press`); on a disabled item, nothing |
| Home / End | opens on the first / last item | first / last item |
| a character | opens on the first item whose label starts with the typed text (typeahead, as Menu) | moves the highlight by typeahead; Space while typing continues the text |
| Escape | | closes without choosing (reason `escape-key`) |
| Tab | moves on | chooses the highlighted item (APG), closes (reason `focus-out`) and lets focus move on |

Disabled items can be highlighted (as Combobox and Tabs: options stay discoverable) but cannot be
chosen.

## Focus

The Trigger keeps DOM focus while the list is open; a click on an item does not move it. When the
form's validation fails on a required Select, the hidden input's `invalid` event moves focus to the
Trigger.

## Pointer

- A press on the Trigger toggles the list (reason `trigger-press`) and highlights the selected
  item.
- Hovering an item highlights it; clicking an enabled item chooses it; clicking a disabled one
  does nothing.
- A press outside the Trigger and the Popup closes the list (reason `outside-press`).

## Forms

- The hidden input carries `name` and the value (`""` when none), so `FormData` has
  `name=value`, as a `<select>`.
- `required`: a submission with no value is blocked by the browser's constraint validation (no
  `submit` event), and focus moves to the Trigger.
- A form `reset` returns an uncontrolled Select to `defaultValue`; a controlled one reports it
  through `onValueChange` (reason `none`).

## Dismissal and layering

The open list is a layer, as Combobox's.

## Positioning

As [popover.md](popover.md#positioning), from the Trigger (see "Item alignment").

## Animation

As [popover.md](popover.md#animation).

## RTL

`align="start"` follows the trigger's direction; the keyboard map does not change.

## Scenarios

### `/select/basic`

A `<form>` with a `<label for>` **"Fruit"** for the Trigger, a Select `name="fruit"` `required`
with the Value's placeholder **"Choose a fruit"**, items (value = label in lower case): **Apple**,
**Banana**, **Blueberry**, **Cherry**, **Grape**, **Mango**, **Orange** (disabled); buttons
**"Submit"** and **"Reset"**. The form scenarios print `form: ...` as
[checkbox.md](checkbox.md#scenarios). Output: `value: ...`, `open: ...`, `reason: ...`,
`form: ...`.

Checks:

1. One `combobox` named "Fruit", `aria-expanded="false"`, `aria-haspopup="listbox"`, showing
   "Choose a fruit"; no other form control in the accessibility tree but the buttons.
2. A click opens a `listbox` with the seven options; focus stays on the trigger, which points at a
   highlighted option with `aria-activedescendant`.
3. The popup is below the trigger, its inline start aligned with the trigger's (±1 px), at least
   as wide as the trigger.
4. ArrowDown twice from the trigger (closed) opens it and highlights Apple, then Banana; Enter
   chooses Banana (`value: banana`), the trigger shows "Banana", the list closes, focus stays on
   the trigger.
5. Reopened with ArrowDown, "Banana" is highlighted and `aria-selected="true"`.
6. Open, type `m`: Enter chooses Mango. Closed, Home opens on Apple, End on Orange.
7. On "Orange" (disabled, `aria-disabled="true"`), Enter and a click do nothing (it stays open).
8. Escape closes without changing the value (`reason: escape-key`).
9. Open, click "Cherry": `value: cherry`. Open, click outside: closes (`reason: outside-press`).
10. Open, ArrowDown, Tab: the highlighted item is chosen and the list closes.
11. "Submit" with no value submits nothing (`form: none`) and focuses the trigger; with Banana,
    `form: fruit=banana`.
12. "Reset" shows "Choose a fruit" again (`value: none`).
13. Axe finds no violation, closed and open.

### `/select/controlled`

A Select labelled **"Fruit"** (the basic items) whose `value` the fixture holds, starting at
`apple`, and which refuses `cherry`: the change is recorded (`requested: cherry`) and the value
stays (spec/README.md, "A controlled value the consumer rejects"). Output: `value: ...`,
`requested: ...`.

Checks: choosing Cherry reports `requested: cherry` while the trigger still shows "Apple"
(`value: apple`) and the list closes; choosing Banana shows "Banana".

## Baseline deviations

Measured against Base UI 1.9 (`Select`, `alignItemWithTrigger={false}`).

| difference | test |
| --- | --- |
| On open, DOM focus moves into the list (to the highlighted option) instead of staying on the trigger with `aria-activedescendant`, as the APG select-only combobox does | `select / basic › a click opens the list; focus stays on the trigger, ...` |
| Tab closes the list without choosing the highlighted option; the APG chooses it | `select / basic › Tab chooses the highlighted option and moves on` |
| An outside press reports the reason `cancel-open`, not `outside-press` | `select / basic › a click chooses; an outside press closes` |
| A form reset does not return the Select to its default | `select / basic › a form reset shows the placeholder again` |

Fixture settings, not deviations: `alignItemWithTrigger={false}` (see "Item alignment"), and a popup
with no padding of its own so the list's box is the popup's.
