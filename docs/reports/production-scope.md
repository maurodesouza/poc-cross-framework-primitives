# Production scope: from the POC to Base UI parity

The POC (`docs/reports/final.md`) showed that the same primitives can be written natively in five frameworks. Each component, though, covers only the scope of its spec, which is smaller than what Base UI ships. This survey lists what separates the POC from:

1. **Fragiola UI parity**: everything Fragiola UI uses from Base UI today. Without it, Fragiola UI cannot move off Base UI.
2. **Full Base UI parity**: everything else Base UI offers.

## How the survey was made

- **Sources** (read 2026-11-21): the Base UI source (1.9.0+, `references/base-ui`), React Aria Components 1.22.1 for the calendar family, the POC's specs on `main`, and the Fragiola UI registry (`~/organizations/fragiola/ui`, on `@base-ui/react@1.7.0`).
- **Classification of each feature:**
  - **essential**: Fragiola UI uses it, or a production library cannot do without it;
  - **desirable**: common in apps;
  - **niche**.
- **Effort of each item**, in the POC's architecture. Every item is built five times, once per framework:
  - **S**: a translation that reuses `@poc/dom`;
  - **M**: a spec section, new tests and some new `@poc/dom` code;
  - **L**: a new mechanism.

## 1. What Fragiola UI uses from Base UI

Fragiola UI imports 22 Base UI components and 2 utilities.

| status | components |
| --- | --- |
| covered by the POC | Popover, Tabs (except animation, see 3.4), Tooltip, Checkbox |
| partly covered | Dialog, Menu, Combobox, Select, Slider |
| not covered | Accordion, AlertDialog, Avatar, Button, Collapsible, ContextMenu, Drawer, Field, NavigationMenu, Progress, Radio / RadioGroup, Separator, Switch |
| utilities | `useRender` and `mergeProps` (the POC has them, but only internally); `DirectionProvider` (the POC only reads the computed direction) |

Fragiola UI has no date picker today (`examples/react/src/create/preview/cards/misc.tsx` fakes one with buttons). The POC's calendar family is new scope, not a replacement.

## 2. The cross-cutting gaps

| gap | used by Fragiola UI | effort | notes |
| --- | --- | --- | --- |
| **Field layer**: Field Root, Label, Control, Description and Error; `validate`; `validationMode`; `Error match`; the states `data-invalid`, `data-dirty`, `data-touched`, `data-filled` and `data-focused` | yes: every Select, Combobox, Checkbox and input sits inside a `Field.Root` | **L**, plus **M** to wire it into each control | the largest blocker. The POC stops at hidden inputs and native validity, and sets no `aria-invalid` or `aria-describedby` |
| **Physical and `inline-*` sides**: `side="left"`, `"right"`, `"inline-start"`, `"inline-end"`, and the matching `data-side` values | yes: submenus, the context menu, sidebar tooltips, the popup animations | S | the POC only accepts `top`, `bottom`, `start` and `end` |
| `DirectionProvider` / `useDirection` | yes: `ui/sidebar.tsx` | S | |
| Public `useRender` / `mergeProps` | yes: `atoms/clickable`, `ui/sidebar.tsx` | S | each framework needs its own equivalent |
| SSR and hydration: Base UI positions the Tabs indicator and the Slider thumb with a script before hydration | only if the site renders on the server | M | the POC has no SSR tests |
| A tree of nested overlays (FloatingTree) | yes, through Drawer and NavigationMenu | M | the POC's layer stack covers a dialog over a popover and submenus |
| Detached triggers (`createHandle`, `payload`, `triggerId`): one dialog opened from many table rows | no | L | the largest new mechanism across Base UI's overlays; common in apps |
| Change details `cancel()`, `event`, `trigger`; `onOpenChangeComplete`; `actionsRef`; `keepMounted` on overlays | no | S–M each | these touch every overlay spec |

## 3. Gaps in the components the POC already has

Only the gaps Fragiola UI depends on, or that are essential, are listed here. The desirable and niche gaps are summarised in section 5.

### 3.1 Overlays

| component | gap | effort |
| --- | --- | --- |
| Dialog | the `Viewport` part; the `data-closed` attribute; nested-dialog attributes (`data-nested`, `--nested-dialogs`) | S |
| AlertDialog | the whole component: `role="alertdialog"`, always modal, no outside dismissal | S–M |
| Menu | `CheckboxItem` with its indicator | M |
| Menu | `RadioGroup` and `RadioItem` with their indicator | M |
| ContextMenu | the whole component: opens on right-click or a 500 ms long press, anchored to the pointer through a virtual anchor, and ignores the mouseup that ends a right-click | M |
| Menu | `modal` (Base UI's default is modal; the POC's menu is not) | M, or a recorded decision |

### 3.2 Combobox

The POC's Combobox has the consumer filter the list and holds a single string value. The combobox Fragiola UI ships needs most of the following, which together amount to most of the component:

| gap | effort |
| --- | --- |
| Built-in filtering: `items`, `filter`, `limit`, `locale`, with `List` as a render function | M |
| Object values (`isItemEqualToValue`, `itemToStringLabel`, `itemToStringValue`) | M |
| `multiple`, with `Chips`, `Chip`, `ChipRemove` and a `Value` render function | M |
| Form support: `name`, `required` and a hidden input (the spec has no form section at all) | M |
| `Clear`, `ItemIndicator`, `Group`, `GroupLabel`, `Separator`, `InputGroup`, `Status`, and `Empty` as a live region | S each (8) |

### 3.3 Select

| gap | effort |
| --- | --- |
| `Group`, `GroupLabel`, `Separator` and `ItemText`, and `items` made optional (the label then comes from the item's text) | S each |
| `alignItemWithTrigger`: the selected item is laid over the trigger. Fragiola UI relies on it implicitly, because it is Base UI's default | L, or a recorded decision (see section 4) |
| `modal`: scroll lock and blocked outside pointer events. It is Base UI's default | S |

### 3.4 Tabs

| gap | effort |
| --- | --- |
| `data-activation-direction`, on which Fragiola UI's panel transition depends | S |
| Panel enter and exit states. The spec says Tabs has "no animation of its own" | M |
| Physical indicator variables `--active-tab-left` and `--active-tab-width` (the POC only has logical names) | S |

### 3.5 Slider and Checkbox

| component | gap | effort |
| --- | --- | --- |
| Slider | `Label`, `Value` (an `<output>`), and `format` / `locale`, used to format `Value` and `aria-valuetext` | S each |
| Checkbox | Field integration (covered by the Field row in section 2) | M |

### 3.6 Calendar family (new scope: Fragiola UI has no calendar)

For a production date picker, compared with React Aria:

| gap | class | effort |
| --- | --- | --- |
| Form support for the pickers: `name`, hidden inputs, `required`, validation, `disabled`, `readOnly` | essential | S–M |
| Typed, segmented date entry (`DateInput`, `DateSegment`) | essential | L |
| `DateField` and `TimeField`, granularity, time zones | desirable | L, on the same segment mechanism |
| RangeCalendar rules: a range that would cross an unavailable date, what happens on blur mid-selection, drag selection | desirable | M |
| Month and year pickers, multiple dates | desirable | M |

## 4. Deliberate differences that become decisions

Each of these is a recorded spec choice, mostly following the APG. Keeping one changes Fragiola UI's current behaviour. Each needs a maintainer decision before a port.

**Decided on 2026-11-21:** see [`docs/decisions.md`](../decisions.md). The production version follows Base UI, except for Tooltip's ARIA wiring and Select's placement. This cycle applies only the Combobox decisions (Epic I); the others are pending.

| difference | POC | Base UI (and so Fragiola UI today) |
| --- | --- | --- |
| Select placement | the list opens below the trigger | the selected item is laid over the trigger |
| Select focus | DOM focus stays on the trigger, with `aria-activedescendant`; Tab chooses the highlighted option | focus moves into the list; Tab closes without choosing |
| Select typing while closed | opens the list on the matching option | chooses the matching option without opening, like a native `<select>` (this deviation is not yet in the spec) |
| Tabs activation default | automatic: focusing a tab selects it | manual: a tab is selected on click or Enter |
| Combobox filtering | the consumer filters the list | Base UI filters internally |
| Combobox Escape and click | Escape keeps the typed text; clicking the input does not open the list | Escape resets the text; clicking the input opens the list |
| Menu, Select modal | not modal | modal by default |
| Popover focus | focus goes to the popup on open, and stays where the user pressed after an outside press | focus goes to the first tabbable element on open, and returns to the trigger after an outside press |
| Tooltip | wires `aria-describedby` and `role="tooltip"` itself; the popup always stays open while hovered | the consumer wires both; `disableHoverablePopup` lets the popup close when the pointer leaves the trigger |
| Naming | `start` / `end`, `loop`, `data-open` on the trigger | `inline-start` / `inline-end`, `loopFocus`, `data-popup-open` |

## 5. Beyond Fragiola UI: full Base UI parity

- **Components Fragiola UI does not use:**
  - L: Toast, ScrollArea, NumberField.
  - M: Menubar, Toolbar, OTPField, Form, PreviewCard (hover card).
  - S: Autocomplete, Toggle, ToggleGroup, Meter, Input, Fieldset.
- **Desirable options in the existing components:**
  - Dialog and Popover: `modal` variants, `disablePointerDismissal`, a hover-opened Popover, collision options, `data-anchor-hidden`.
  - Menu: drag-to-select, `LinkItem`, a hover-opened Menu.
  - Combobox and Select: virtualization (L), `autoHighlight`, `readOnly`; multiple selection and object values in Select.
  - Tabs: the automatic fallback when the selected tab is disabled or removed.
  - Checkbox: `readOnly`, `uncheckedValue`, and a parent checkbox that remembers the user's mixed selection.
  - Slider: `thumbAlignment: 'edge'`, thumb collision behaviour (push or swap), and keeping the press offset.
- **Niche:** about 40 small options, such as positioner fine-tuning, `trackCursorAxis`, non-Gregorian calendars and grid comboboxes.

## 6. Estimate

The count of work items to reach **Fragiola UI parity** is approximate, with each item built five times:

| | S | M | L |
| --- | --- | --- | --- |
| Cross-cutting (section 2) | 3 | 3 | 1 (Field) |
| Existing components (section 3, without the calendar) | ~20 | ~9 | 0–1 (Select alignment, if kept) |
| New components (Accordion, AlertDialog, Avatar, Button, Progress, Radio, Separator, Switch; Collapsible, ContextMenu; Drawer, NavigationMenu) | 8 | 2 | 2 |
| **Total** | **~31** | **~14** | **3–4** |

What the numbers mean:

- **The L items are the real cost.** Field, Drawer and NavigationMenu together are about 9,500 lines of Base UI source. That is about the size of all ten POC components in one framework (4,946–5,336 lines), and each framework pays it again.
- **The S items are cheap.** They are mostly translations that reuse `@poc/dom`. The POC's porting data puts a new component at 0.4–0.9× React's cost once a framework's model is mapped.
- **The bundle comparison** in `final.md` measures the POC's scope against Base UI's full scope. Its 1.4–6.5× advantage will shrink as these gaps close. How much was not measured. One way to measure it is to bring one component, such as Combobox, to Fragiola UI parity, then compare its size again.

## 7. Suggested order

1. **Decide the section 4 differences.** They change the specs before any code is written.
2. **Field.** It is the foundation for every form control, and Fragiola UI's forms cannot move without it.
3. **The cheap breadth:** the side names, AlertDialog, the Menu checkbox and radio items, Select groups, Slider Label and Value, Switch, Radio, Separator, Progress, Avatar and Button.
4. **Combobox to Fragiola UI parity.** It is the most used complex control, and the honest re-measure of size.
5. **Collapsible and Accordion, then ContextMenu.**
6. **Drawer and NavigationMenu,** which need the overlay tree.
7. **SSR,** if the docs site renders on the server.
