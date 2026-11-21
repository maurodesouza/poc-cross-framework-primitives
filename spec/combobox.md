# Combobox

## Purpose

A text input that filters a popup list, for choosing **one** value or **several** (APG `combobox`
with a `listbox` popup, list autocomplete without automatic selection). This is the combobox
Fragiola UI ships (Epic I, #62): the parts and props of its `combobox.tsx`, on Base UI 1.9's
behaviour.

- **The combobox filters.** Given `items`, it filters them with the text in the input and gives
  the List the matching ones, through a render function. A consumer that filters its own list
  (no `items`) renders the Items itself, as before.
- **Values are items.** A value is any item: a string, or an object, compared with
  `isItemEqualToValue` and turned into text with `itemToStringLabel` and `itemToStringValue`.
- **`multiple`** keeps a list of values, shown as chips.
- **Forms and Field**: `name`, `required`, hidden inputs, and the integration contract of
  [field.md](field.md#integration-contract).

Out of scope (`docs/reports/production-scope.md`): virtualization, `autoHighlight`, `readOnly`,
async loading, Autocomplete (`selectionMode="none"`), grid layout, an input inside the popup,
Base UI's `Collection`, `Row`, `Arrow`, `Backdrop`, `Icon` and `Label` parts, `inline`, `modal`,
`openOnInputClick={false}`, Space choosing the highlighted item, and the `useFilter` /
`useFilteredItems` hooks.

### What changed in Epic I, and why

| change | reason |
| --- | --- |
| The combobox filters `items` itself (`filter`, `limit`, `locale`) | decision 5 (`docs/decisions.md`): Base UI filters internally |
| Closing the list without a choice resets the input's text to the selected item's label (empty when none) | decision 6: Base UI resets the text. The old spec kept the typed text (the APG's wording) |
| A press on the Input (or on InputGroup, Chips) opens the list | decision 6: Base UI opens on input click |
| A value is an item of any type; Item lost its `label` prop | Base UI's `itemToStringLabel` and `isItemEqualToValue` replace it: the input's text is the value's label |
| `multiple`, chips, `Value`, `Clear`, groups, `ItemIndicator`, `Status`, `InputGroup`, forms, Field | the parts and props of Fragiola UI's combobox |
| `Empty` is always rendered, as a polite live region, and shows its children only while the list is empty | Base UI's `Empty`: a live region must exist before its text changes, or screen readers do not announce it |

## Anatomy

| part | element | `data-combobox-part` | notes |
| --- | --- | --- | --- |
| Root | none | | holds the state; renders the hidden inputs |
| InputGroup | `div` | `input-group` | optional; holds the Input and its buttons, and anchors the list |
| Input | `input` | `input` | the `combobox`; keeps DOM focus |
| Trigger | `button` | `trigger` | toggles the list; optional; not in the tab order |
| Clear | `button` | `clear` | clears the value and the text; rendered only while there is a value |
| Chips | `div` | `chips` | `multiple`: holds the chips and the Input; anchors the list |
| Chip | `div` | `chip` | one per value, in value order |
| ChipRemove | `button` | `chip-remove` | inside a Chip: removes its value |
| Value | none | | renders the value: its label, or a render function of it |
| Status | `div` | `status` | a polite live region for the consumer's text |
| Portal | none | | |
| Positioner | `div` | `positioner` | anchored to the InputGroup, else the Chips, else the Input |
| Popup | `div` | `popup` | the floating container |
| Empty | `div` | `empty` | a polite live region; its children are rendered only while the list is empty |
| List | `div` | `list` | the `listbox` |
| Group | `div` | `group` | a `group` of items |
| GroupLabel | `div` | `group-label` | names its Group |
| Separator | `div` | `separator` | between groups |
| Item | `div` | `item` | an `option` |
| ItemIndicator | `span` | `item-indicator` | inside an Item, rendered only while it is selected |
| (hidden inputs) | `input` | `hidden-input` | rendered by the Root: what the form submits and validates |

The hidden inputs' part value is `hidden-input`, not the `input` of the other form controls
(spec/README.md, "Forms"): `input` is the Input's.

## API

**Root**:

- `items`: the items, or groups of items (`{ items, ... }[]`, any other key is the consumer's).
  With it, the combobox filters them and the List renders the matching ones. Without it, the
  consumer renders the Items.
- `filter(item, query, itemToString)`: whether an item matches the query; `null` turns filtering
  off. The default is a locale-aware "contains": the item's label holds the query, compared with
  `Intl.Collator(locale, { usage: "search", sensitivity: "base", ignorePunctuation: true })`, so
  case and accents do not matter (`sao` finds "São Paulo").
- `limit` (`-1`, none): the most items the List renders, across groups.
- `locale`: the collator's locale (spec/README.md, "Normalized API names").
- `multiple` (`false`).
- `value`, `defaultValue`, `onValueChange(value, details)`: the selected item, or `null`
  (default `null`); with `multiple`, the selected items in the order they were chosen (default
  `[]`).
- `inputValue`, `defaultInputValue`, `onInputValueChange(inputValue, details)`: the text in the
  input. Its default is the label of `defaultValue` (single), else `""`.
- `open`, `defaultOpen` (`false`), `onOpenChange(open, details)`.
- `isItemEqualToValue(item, value)`: whether an item is a value (default `Object.is`).
- `itemToStringLabel(item)`: an item's text, for the input and the filter. Default: an object's
  `label`, else its `value`, else the item itself as a string.
- `itemToStringValue(item)`: an item's form value. Default: the `value` of an object with both
  `value` and `label`, else the item as a string (`JSON.stringify` for other objects).
- `name`, `required`, `disabled`.

**The query** is the input's text, trimmed. In single mode, when the list opens with the
selected item's label in the input, it shows every item until the user types (Base UI): reopening
a chosen combobox shows the whole list, not only the chosen item.

**List**: `children`, nodes or a render function. With the Root's `items`, a function is called
for each matching entry, `(entry, index)`: an item, or a group whose `items` are its matching
items. A group with no match is left out. The render functions map to each framework as
spec/README.md, "API mapping by framework", says:

| framework | List | Value |
| --- | --- | --- |
| React, Solid | `children={(entry, index) => ...}` | `children={(value) => ...}` |
| Vue | default scoped slot, `v-slot="{ entry, index }"` | default scoped slot, `v-slot="{ value }"` |
| Svelte | `children` snippet, `{#snippet children(entry, index)}` | `children` snippet, `{#snippet children(value)}` |
| Angular | `@for` over the directive's `entries()` signal, read through `exportAs` (`#list="comboboxList"`) | the Root's `value()` signal, read through `exportAs` (`#combobox="comboboxRoot"`); there is no Value directive |

**Item**: `value` (any, required), `disabled`. When it is chosen, the input's text becomes
`itemToStringLabel(value)`.

**Value**: `children`, a node or a render function of the value. Without children, it renders
the value's label, or the labels joined with `", "` (`multiple`).

**Clear**, **Trigger**, **ChipRemove**: `disabled` comes from the Root.

**ItemIndicator**: `keepMounted` (`false`).

**Positioner**: as Popover's; defaults `side="bottom" align="start"`, and `--anchor-width` lets
the consumer match the anchor's width.

**Choosing an item**:

- single: the value becomes the item, the input's text its label (reason `item-press`), and the
  list closes;
- `multiple`: the item is added to the values, or removed when it is already one (reason
  `item-press`). With text in the input, the text is cleared (reason `input-clear`) and the list
  closes; with none, the list stays open.

**Closing the list without a choice** (Escape, an outside press, Tab, the Trigger, Alt+ArrowUp)
resets the input's text: to the selected item's label in single mode, to `""` with `multiple`.
The reason is `input-clear` when the text becomes empty, else `none`.

## State attributes and ARIA

| part | attributes |
| --- | --- |
| InputGroup | `role="group"`, `data-open`, `data-disabled` |
| Input | `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` (the List's id), `aria-activedescendant` (the highlighted item's id, only while one is highlighted), `autocomplete="off"`, `data-open`, `data-disabled`; in a Field, the field's ids and states (field.md) |
| Trigger | `tabindex="-1"`, `aria-expanded`, `aria-controls`, `data-open`, `data-disabled` |
| Clear | `type="button"`, `tabindex="-1"`, `data-disabled` |
| Chips | `role="toolbar"` while it holds a chip |
| Chip | `tabindex="-1"`, `aria-disabled="true"` and `data-disabled` when the Root is disabled |
| ChipRemove | `type="button"`, `tabindex="-1"`, `data-disabled` |
| Status | `role="status"`, `aria-live="polite"`, `aria-atomic="true"` |
| Positioner, Popup | as Popover's (Popup has no role) |
| Empty | `role="status"`, `aria-live="polite"`, `aria-atomic="true"` |
| List | `role="listbox"`, an `id`, `aria-multiselectable="true"` with `multiple`, `data-empty` when it holds no item |
| Group | `role="group"`, `aria-labelledby` (its GroupLabel) |
| GroupLabel | an `id` |
| Separator | `role="presentation"` (a `listbox` owns only groups and options), `data-orientation="horizontal"` |
| Item | `role="option"`, an `id`, `aria-selected="true"` on a selected item (absent on others), `aria-disabled="true"` and `data-disabled` when disabled, `data-highlighted`, `data-selected` |
| ItemIndicator | `aria-hidden="true"` |
| hidden inputs | see "Forms" |

The Input's accessible name comes from the consumer (`<label for>`, `aria-label`, or a
`Field.Label`). The Clear, Trigger and ChipRemove buttons are named by the consumer too.

## Keyboard

DOM focus **stays on the Input** while the list is open; the highlighted item is announced through
`aria-activedescendant` (virtual focus).

| key | action |
| --- | --- |
| typing | updates the input's text (reason `input-change`), filters, and opens the list; **no item is highlighted** until the user navigates |
| ArrowDown | closed: opens and highlights the selected item, else the first item (reason `list-navigation`); open: highlights the next item (the first when none is highlighted); from the last item, returns the visual focus to the input (no highlight), and the next ArrowDown highlights the first item |
| ArrowUp | as ArrowDown, backwards: closed, the selected item, else the last item |
| Alt+ArrowDown | opens without highlighting |
| Alt+ArrowUp | closes |
| Home / End | move the text caret (native input behaviour), never the highlight |
| Enter | open with a highlighted item: chooses it ("Choosing an item"); otherwise does nothing and does not submit a form while the list is open |
| Escape | open: closes (reason `escape-key`), resetting the text; closed: clears the input's text **and** the value (reason `escape-key`) |
| Tab | closes without choosing (reason `focus-out`) and lets focus move on |
| Backspace | `multiple`, in an empty input: removes the last value (reason `none`) |
| ArrowLeft (ArrowRight in RTL) | `multiple`, with the caret at the start and at least one chip: focuses the last chip |

**On a focused Chip** (`multiple`):

| key | action |
| --- | --- |
| ArrowLeft / ArrowRight (swapped in RTL) | focus the previous / next chip; before the first or past the last chip, focus returns to the Input |
| Backspace, Delete | remove its value (reason `none`); focus moves to the chip now at its place (the previous one when it was the last), or to the Input when no chip is left |
| Enter, Space | focus the Input |
| ArrowDown, ArrowUp | open the list (reason `list-navigation`) and focus the Input |
| a printable character | focus the Input, which receives it |

The APG lets the arrows either stop at the ends or return to the input; this spec returns to the
input, so the user can always get back to what they typed.

**Disabled items can be highlighted** (APG: listbox options stay focusable when disabled, so they
can be discovered) but cannot be chosen: Enter on a disabled item and clicks on it do nothing.

## Focus

The Input keeps DOM focus while the list is open. Pressing an item, the Trigger, the Clear button
or a ChipRemove keeps focus in (or returns it to) the Input. Only the chips take DOM focus, from
the keyboard.

## Pointer

- A press on the Input, or on the InputGroup or Chips outside their buttons and chips, focuses the
  Input and opens the list (reason `input-press`). In single mode the selected item is
  highlighted (as Base UI does); otherwise no item is.
- A press on the Trigger toggles the list and keeps focus in the Input (reason `trigger-press`).
- A press on Clear clears the text and the value (reason `clear-press`, the value `null`, or `[]`
  with `multiple`); the list stays as it was.
- A press on a ChipRemove removes its chip's value (reason `chip-remove-press`).
- Hovering an item highlights it; clicking an enabled item chooses it.
- A press outside the Input, the InputGroup, the Chips, the Trigger and the Popup closes the list
  (reason `outside-press`).

## Forms

With a `name`, the Root renders (spec/README.md, "Forms"):

- **single**: one hidden input with the `name`, the value `itemToStringValue(value)` (`""` with
  none), `required`, `disabled`, `aria-hidden="true"`, `tabindex="-1"` and a structural, visually
  hidden inline style (not `type="hidden"`, so the browser validates it);
- **`multiple`**: one `type="hidden"` input per value, with the `name` and
  `itemToStringValue(value)`, in value order; plus one visually hidden input with no `name` that
  carries `required` while there is no value, so the browser still validates the combobox.

Every hidden input carries `data-combobox-part="hidden-input"`. Without a `name`, the validation
input is still rendered, so `required` and a Field work. A form reset returns an uncontrolled
combobox to its `defaultValue` and the input's text to that value's label. When the browser's
validation finds the combobox invalid, focus goes to the Input.

**In a Field** ([field.md](field.md#integration-contract)): the Input is the labelable element
(`id`, `for`, `aria-labelledby`, `aria-describedby`, `aria-invalid`, the field's states), focus
and blur come from the Input, `validate` gets the value (an item, `null`, or the list of items),
and the validated element is the visually hidden input. The field's `name` and `disabled` win.

## Dismissal and layering

The open list is a layer. A list inside a Dialog is a child of the dialog's layer: Escape closes
the list first.

## Positioning

As [popover.md](popover.md#positioning), anchored to the InputGroup, else the Chips, else the
Input.

## Animation

As [popover.md](popover.md#animation).

## RTL

The list follows the input's direction for `align`. The chip keys swap (the "previous" key is
ArrowRight); the list keys do not change.

## Scenarios

The items of most scenarios are the fruits, objects `{ value, label, disabled? }` (the value is
the label in lower case): **Apple**, **Banana**, **Blueberry**, **Cherry**, **Grape**, **Mango**,
**Orange** (disabled). An Item renders the fruit's label. Output values print a fruit as its
`value`, a list of them joined with `,`, and `none` for `null` or `[]`.

### `/combobox/basic`

Content: a `<label>` **"Fruit"** for the Input; an InputGroup with the Input, a Clear with
`aria-label` **"Clear fruit"** (text "×") and a Trigger with `aria-label` **"Show fruits"** (text
"▾");
`items` the fruits (the default filter). The Popup holds an Empty **"No fruit found."** and the
List. Output: `value: ...`, `input: ...`, `open: ...`, `reason: ...`.

Checks:

1. A `combobox` named "Fruit" with `aria-expanded="false"` and `aria-autocomplete="list"`.
2. A click on the input opens the list with all seven options and no `aria-activedescendant`
   (`reason: input-press`).
3. Type `b`: options "Banana" and "Blueberry"; `aria-expanded="true"`; no
   `aria-activedescendant`; focus stays on the input.
4. ArrowDown: `aria-activedescendant` points at "Banana"; ArrowDown → "Blueberry"; ArrowDown
   returns to the input (no `aria-activedescendant`); ArrowDown → "Banana".
5. Enter: output `value: banana`, the input shows "Banana"; the list closes.
6. With "Banana" chosen and the list closed, ArrowDown opens the list on "Banana" (the selected
   item, highlighted, with `aria-selected="true"`) with every option shown. Escape closes it;
   Escape again (closed) clears the input and the value: `input: ` empty, `value: none`.
7. Type `an`: options "Banana", "Mango", "Orange"; "Orange" has `aria-disabled="true"`.
   ArrowDown ×3 highlights "Orange"; Enter does nothing (no value, the list stays open);
   ArrowDown returns to the input.
8. Type `xyz`: the list shows "No fruit found." and no option.
9. **Escape resets the text.** Type `che` and press Escape: the list closes and the input is
   empty (no value). Choose "Cherry", type `x` (the input shows "Cherryx"), press Escape: the
   input shows "Cherry" again, `value: cherry`.
10. Click "Show fruits": the list opens, focus stays on the input; click "Cherry": `value:
    cherry`, `input: Cherry`.
11. **Clear.** No "Clear fruit" button while nothing is chosen. After choosing "Cherry", a click
    on "Clear fruit" empties the input, gives `value: none`, keeps focus on the input, and the
    button is gone.
12. Type `a`, then click outside (the page's corner): the list closes with
    `reason: outside-press` and the input is empty again.
13. Axe finds no violation while open.

### `/combobox/controlled`

The fixture holds `value` and `inputValue` in its own state, starting on the fruit Mango and
`input: Mango`, and a button **"Reset"** sets both to `null` / `""`. The combobox is basic's.

Checks: the input shows "Mango" on load; a click on the input opens the list on "Mango" (the
selected item, highlighted); after Escape, "Reset" empties the input, and the next click
highlights nothing, then ArrowDown highlights "Apple".

### `/combobox/rejected-input`

The fixture holds `value`, `inputValue` and `open` in its own state, all empty, and keeps an
`inputValue` only when it has no digit: a value with a digit is refused (the state stays as it
was). Output: `value: ...`, `input: ...`, `open: ...`.

Checks (spec/README.md, "A controlled value the consumer rejects"): type `b`: the input shows `b`,
options "Banana" and "Blueberry"; type `1`: the input still shows `b` (not `b1`), output
`input: b`, the options unchanged; type `l`: the input shows `bl`, only "Blueberry".

### `/combobox/filtered`

Two comboboxes, each in an InputGroup with its `<label>`:

- **"City"**: `items` the strings **Bogotá**, **Brasília**, **Kraków**, **Málaga**,
  **Montréal**, **São Paulo**, **Zürich**, `limit={4}`, the default filter. Its Empty:
  **"No city found."**.
- **"Fruit"**: **no `items`**: the fixture filters. Its Items are the fruit labels (strings, the
  item is its label) whose label **starts with** the input's text, case-insensitive, and its
  Empty is **"No fruit found."**.

Output: `city: ...`, `fruit: ...`.

Checks:

1. A click on "City" shows the first four cities: "Bogotá", "Brasília", "Kraków", "Málaga".
2. Typing `sao` shows "São Paulo" only; replacing it with `ZUR` shows "Zürich" only (case and
   accents do not matter).
3. Replacing it with `a` shows four of the six matches: "Bogotá", "Brasília", "Kraków", "Málaga".
4. ArrowDown and Enter on "Bogotá" give `city: Bogotá`.
5. In "Fruit", typing `b` shows "Banana" and "Blueberry"; typing on to `bl` shows "Blueberry";
   Enter after ArrowDown gives `fruit: Blueberry`.
6. Replacing the text with `an` shows "No fruit found." and no option (the fixture's prefix
   filter).

### `/combobox/objects`

**"Country"**: `items` the objects `{ code, name }` **AR** Argentina, **BR** Brazil, **DE**
Germany, **JP** Japan, **SE** Sweden, with `itemToStringLabel` the `name`, `itemToStringValue`
the `code`, `isItemEqualToValue` comparing `code`, and a `filter` that matches an item whose
`code` equals the query (case-insensitive) or whose `name` contains it (case-insensitive).
`defaultValue` is a **copy** of Brazil (`{ code: "BR", name: "Brazil" }`, not the item itself).
Each Item renders the name and an ItemIndicator **"✓"**. Output: `value: ...` (the `code`, or
`none`), `input: ...`.

Checks:

1. The input shows "Brazil" on load.
2. A click on the input opens the list with all five options, "Brazil" highlighted and
   `aria-selected="true"` (equal by `code`), its indicator shown.
3. Escape, then replacing the text with `de` shows "Germany" (its code) and "Sweden" (its name).
4. ArrowDown and Enter: `value: DE`, the input shows "Germany".

### `/combobox/multiple`

**"Fruits"**: `multiple`, `items` the fruits, `defaultValue` the fruits Apple and Cherry. A
`<label>` for the Input. Chips hold a Value whose render function renders, for each value, a Chip
with the fruit's label and a ChipRemove with `aria-label` **"Remove <label>"** (text "×"), then
the Input; after the Value, still in the Chips, a Clear **"Clear fruits"** (text "×") and a
Trigger **"Show fruits"** (text "▾"). A Status
(visually hidden) says **"<n> fruits selected."** (`1 fruit selected.` for one). The Popup holds
an Empty "No fruit found." and the List; each Item renders the label and an ItemIndicator
**"✓"**. Output: `value: ...`.

Checks:

1. A `toolbar` holds the chips "Apple" and "Cherry"; the status says "2 fruits selected."
   (a live region may add invisible characters to its text: the test checks that it holds it).
2. A click on the input opens a `listbox` with `aria-multiselectable="true"`; "Apple" and
   "Cherry" have `aria-selected="true"`.
3. A click on "Banana" adds it (`value: apple,cherry,banana`) and the list stays open; a click on
   "Apple" removes it (`value: cherry,banana`).
4. Typing `gr`, ArrowDown and Enter adds Grape (`value: apple,cherry,grape`), empties the input
   and closes the list.
5. Backspace in the empty input removes the last value (`value: apple`).
6. ArrowLeft in the empty input focuses the chip "Cherry"; ArrowLeft → "Apple"; ArrowRight →
   "Cherry"; ArrowRight → the input. ArrowLeft, then Backspace on "Cherry", removes it
   (`value: apple`) and focuses the chip "Apple".
7. A click on "Remove Apple" removes it (`value: cherry`) and focuses the input.
8. A click on "Clear fruits" removes every value (`value: none`): no chip, no `toolbar`, and the
   button is gone.
9. Axe finds no violation while open.

### `/combobox/groups`

**"Produce"**: `items` two groups, `{ label: "Fruits", items: [Apple, Banana, Cherry] }` and
`{ label: "Vegetables", items: [Carrot, Celery, Potato] }` (items `{ value, label }`, the value in
lower case). The List's render function renders, for each group, a Separator before every group
but the first, then a Group with its GroupLabel (the group's `label`) and its Items. The Popup
holds an Empty **"Nothing found."**. Output: `value: ...`.

Checks:

1. A click on the input shows a `group` named "Fruits" with "Apple", "Banana", "Cherry", and a
   `group` named "Vegetables" with "Carrot", "Celery", "Potato" (the contract layer checks the
   Separator between them, which has no role of its own).
2. Typing `c` shows "Cherry" in "Fruits", and "Carrot" and "Celery" in "Vegetables"; ArrowDown
   ×3 highlights "Cherry", "Carrot", then "Celery" (across groups); Enter gives `value: celery`.
3. Replacing the text with `pot` shows only the group "Vegetables" with "Potato".
4. Axe finds no violation while open.

### `/combobox/form`

A `<form>` with:

- **"Fruit"**: `name="fruit"`, `required`, `items` the fruits, in an InputGroup;
- **"Toppings"**: `multiple`, `name="toppings"`, `items` the objects **Cream**, **Nuts**,
  **Syrup** (`{ value, label }`, the value in lower case), `defaultValue` Nuts, with Chips as in
  `/combobox/multiple` (ChipRemove "Remove <label>");
- a **"Submit"** and a **"Reset"** button.

Output: `form: ...`.

Checks:

1. "Submit" with no fruit submits nothing (`form: none`) and focuses the "Fruit" input.
2. Choosing "Banana" (type `ban`, ArrowDown, Enter) and "Submit" give
   `form: fruit=banana&toppings=nuts`.
3. Adding "Cream" to the toppings and "Submit" give
   `form: fruit=banana&toppings=nuts&toppings=cream`.
4. "Reset" empties the "Fruit" input and leaves only the chip "Nuts"; "Submit" submits nothing
   again.
5. No hidden input is in the accessibility tree: axe finds no violation.

### `/combobox/field`

A `<form>` with a `Field.Root` `name="fruit"`: a `Field.Label` **"Fruit"**; the combobox of
`/combobox/basic` with `required` and no `<label>` or `name` of its own; a `Field.Description`
**"Pick one."**; a `Field.Error` **"Choose a fruit."**. Then a **"Submit"** button. Output:
`form: ...`.

Checks:

1. A `combobox` named "Fruit", described by "Pick one.", not `aria-invalid`.
2. A click on the label focuses the input.
3. "Submit" submits nothing (`form: none`), focuses the input, makes it `aria-invalid="true"`
   with `data-invalid`, and shows "Choose a fruit."; the description is
   "Pick one. Choose a fruit.".
4. Choosing "Banana" hides the error and removes `aria-invalid`; "Submit" gives
   `form: fruit=banana`.
5. Axe finds no violation, before and after the failed submission.

## Baseline deviations

Measured against Base UI 1.9 (`Combobox` with `items`, the default filter, and `filteredItems`
for the consumer-filtered "Fruit" of `/combobox/filtered`).

| difference | test |
| --- | --- |
| While the list is open, everything outside it is hidden from assistive technologies (`aria-hidden`), the input's `<label>` included, so axe reports the input as unlabelled | the axe tests of `/combobox/basic`, `/combobox/multiple` and `/combobox/groups` |
| A form reset leaves the value and the text as they were (spec/README.md, "Forms": a reset returns an uncontrolled control to its default) | `combobox / form › a reset returns to the defaults` |

The decisions of Epic I removed the two deviations of Epic B: Escape resetting the text, and the
`openOnInputClick={false}` fixture setting.

Fixture settings, not deviations: Base UI applies a highlight asynchronously, so a test checks
the highlight before pressing Enter, as a user would see it. A Base UI group renders its items
through `Combobox.Collection` (out of scope here: the POC's render function maps the group's
`items` itself).
