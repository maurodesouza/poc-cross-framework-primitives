# Specs

The source of truth for every component. Each framework implementation, each style recipe
(`@poc/styles`) and each conformance test (`conformance/`) follows these pages. A behaviour change
starts here (with its reason), then the tests, then the implementations (AGENTS.md rule 3).

| spec | components |
| --- | --- |
| [dialog.md](dialog.md) | Dialog |
| [popover.md](popover.md) | Popover |
| [menu.md](menu.md) | Menu, with submenus |
| [combobox.md](combobox.md) | Combobox |
| [tabs.md](tabs.md) | Tabs |
| [calendar.md](calendar.md) | Calendar, RangeCalendar, DatePicker, DateRangePicker |

Primary source: the WAI-ARIA Authoring Practices (APG) patterns in
`~/organizations/fragiola/references/wai-aria-practices/content/patterns/`. Behaviour was compared
with Base UI (`references/base-ui`) and React Aria (`references/react-aria-ui`). Where they differ
from the APG, the spec follows the APG unless the difference is clearly better for users, and says
why.

## The format of a spec

Every spec has these sections, in this order:

1. **Purpose**: what the component is for, and what it is not.
2. **Anatomy**: each part, its default element and its part attribute value.
3. **API**: the props of each part, their defaults, the events, controlled and uncontrolled state.
   Names are the normalized names below; each framework expresses them as the mapping table says.
4. **State attributes and ARIA**: per part, what the primitive sets.
5. **Keyboard**: the key map.
6. **Focus**: where focus goes on open, close and inside.
7. **Pointer**: mouse, touch and pen.
8. **Dismissal and layering** (overlays).
9. **Positioning** (positioned overlays).
10. **Animation**: the enter and exit states.
11. **RTL**: what changes in right-to-left.
12. **Scenarios**: the fixtures every implementation renders, and what each one checks.
13. **Baseline deviations**: where Base UI or React Aria differ from the spec (filled by the
    conformance work).

## Shared conventions

### Part attribute

Every element a primitive renders carries `data-<component>-part="<part>"`, with the component's
slug and the part in kebab-case: `data-dialog-part="popup"`, `data-menu-part="submenu-trigger"`,
`data-calendar-part="cell"`. Subcomponents of the calendar family share the `calendar` slug
(`data-calendar-part`), and the pickers use `date-picker` (`data-date-picker-part`). The
conformance contract layer and the style recipes select by it, never by class names.

### State attributes

A boolean state is an attribute that is **present** (empty value) or **absent**, never `"false"`.
The vocabulary is shared by every component:

| attribute | meaning |
| --- | --- |
| `data-open` | an overlay or its trigger while open |
| `data-starting-style` | an element that just mounted, for one frame, so a CSS transition starts from it |
| `data-ending-style` | an element whose exit animation is running; it unmounts when its animations finish |
| `data-disabled` | the part is disabled |
| `data-highlighted` | the item that keyboard or pointer navigation points at (menu item, combobox item) |
| `data-selected` | a selected tab, combobox item or calendar date |
| `data-pressed` | not used in these specs |
| `data-orientation` | `horizontal` or `vertical` (a value, not a boolean) |
| `data-activation` | `automatic` or `manual` on Tabs (a value) |
| `data-side` | the side an overlay ended up on: `top`, `bottom`, `start` or `end` (a value) |
| `data-align` | `start`, `center` or `end` (a value) |
| `data-today` | the calendar cell of today |
| `data-outside-month` | a calendar cell of the previous or next month |
| `data-unavailable` | a calendar date the app marked unavailable |
| `data-range-start`, `data-range-end`, `data-in-range` | the range of a RangeCalendar |
| `data-range-preview` | a cell inside the range being chosen (between the start and the hovered or focused date) |
| `data-empty` | a combobox list with no item |
| `data-nested` | a submenu's positioner and popup |

### No text, and the one exception

Primitives render only their children: no UI copy and no accessible name of their own. The
fixtures give every name (`aria-label`, `<label>`, text children). **The exception is locale data**
in the calendar family: the month heading, the weekday names, the day numbers and each cell's full
date name come from `Intl` for the given locale. They are data, not copy, and no app could provide
them cell by cell; the consumer can still replace each one ([calendar.md](calendar.md)).

### Change details

Every `on<Value>Change` receives the new value and a details object: `{ reason }`. The reasons are
shared:

| reason | when |
| --- | --- |
| `trigger-press` | the trigger toggled the overlay |
| `close-press` | a `Close` part was pressed |
| `escape-key` | Escape dismissed the overlay |
| `outside-press` | a press outside the overlay (and its child layers) dismissed it |
| `focus-out` | focus left a non-modal overlay |
| `item-press` | a menu or combobox item was chosen |
| `list-navigation` | the keyboard opened a menu or combobox |
| `input-change` | typing opened or changed a combobox |
| `none` | anything else (a programmatic change) |

### Normalized API names

| concept | name |
| --- | --- |
| open state | `open`, `defaultOpen`, `onOpenChange(open, details)` |
| value | `value`, `defaultValue`, `onValueChange(value, details)` |
| disabled | `disabled` |
| orientation | `orientation` |
| an element to focus | `initialFocus`, `finalFocus` (an element, a ref, or `false` for none; Vue also takes a getter, since a template unwraps a ref before the element exists) |
| positioning | `side`, `align`, `sideOffset`, `alignOffset`, `collisionPadding` |
| locale | `locale` (a BCP 47 tag; defaults to the document's `lang`, then the browser's) |

Controlled and uncontrolled: when `value` (or `open`) is given, the component is controlled and
only reports changes; otherwise it keeps its own state, seeded by `defaultValue`.

## API mapping by framework

The specs describe one API. Each framework expresses it with its own means, never as a foreign API:

| concept | React | Vue | Angular | Svelte | Solid |
| --- | --- | --- | --- | --- | --- |
| namespace | `Dialog.Popup` (object of components) | `Dialog.Popup` (object of components) | one standalone directive per part, selector `[dialogPopup]`, class `DialogPopup` | `Dialog.Popup` (object of components) | `Dialog.Popup` (object of components) |
| element override (`render`) | `render={<section />}` or `render={(props, state) => ...}` | `as="section"`, or the `#render="{ props, state, children }"` scoped slot | the directive sits on the consumer's own element (Angular's `render`) | the `child` snippet: `{#snippet child({ props, state })}` | `render={(props, state) => ...}` |
| controlled state | `open` + `onOpenChange` | `v-model:open` (`open` prop + `update:open` emit) | `open = model<boolean>()` (two-way `[(open)]`) | `bind:open` (`$bindable`) | `open` prop (a value: `open={open()}`) + `onOpenChange` |
| uncontrolled seed | `defaultOpen` | `default-open` | `defaultOpen = input()` | `defaultOpen` | `defaultOpen` |
| change details | `onOpenChange(open, details)` | `@open-change="(open, details) => ..."` (besides `update:open`) | `openChange = output<{ open, details }>()` | `onOpenChange(open, details)` | `onOpenChange(open, details)` |
| class and style from state | `className` / `style` as a value or `(state) => value` | `class` / `style` values; state through `data-*` or the `render` slot | the consumer's own `class`; state through `data-*` or the directive's `state()` signal (`exportAs`) | `class` / `style` values; state through `data-*` or the `child` snippet | `class` / `style` as a value or `(state) => value` |
| element reference | `ref` prop | template ref (the component instance, element as `$el`) | the host element | an attachment (`{@attach (node) => ...}`): every part passes its attachments on to its element, or to the `child` snippet's props | `ref` prop (a callback; focus targets take a getter, `initialFocus={() => el}`) |
| children function (collections, calendar weeks) | `children={(item) => ...}` | default scoped slot (`v-slot="{ week }"`) | structural directive or `@for` over the directive's signal | `children` snippet with arguments | `children={(item) => ...}` |
| part hooks (lower layer) | `useDialogPopup()` → `{ state, props }` | `useDialogPopup()` composable → `{ state, props }` | `injectDialogPopup()` | `useDialogPopup()` (`.svelte.ts`) | `useDialogPopup()` → `{ state, props }` |

Fragiola's existing mapping of the same contract: `~/organizations/fragiola/dockable/site/docs/concepts/primitive-contract.mdx`
(the "In Vue" and "In Angular" sections), `dockable/packages/vue`, `dockable/packages/angular`
and `splitter/packages/*`.

## Scenarios and fixtures

Every scenario is a page at `/<component>/<scenario>` in every fixture (`fixtures/<implementation>`).
The specs fix:

- the content and the **accessible names** (text, `aria-label`, `<label>`), so the behaviour tests
  find elements by role and name and never by implementation detail;
- what the fixture prints outside the component (`data-testid="output"`): the last value, the last
  open state and the last change reason, as `key: value` lines;
- a `data-testid` on an element the behaviour layer must find but that has no role (a popover's
  Arrow), named in the scenario;
- query parameters: `?locale=<tag>` and `?dir=rtl` where a scenario says so.

The conformance suite fixes "today" with Playwright's clock: **2026-11-20** (a Friday) in every
calendar scenario.
