# Screen reader spot check

> **Status: pending, needs a person.** This environment cannot drive VoiceOver or NVDA, so no
> finding below has been observed yet. The conformance suite already checks the roles, names,
> states and relations these announcements are built from (behaviour layer, axe included); this
> check is about what a screen reader actually says.

The plan's metric (`docs/plan.md`, "Metrics") is a spot check, not a full audit: six components,
one screen reader per platform, the React fixture first, then the same steps on one more
framework to confirm that the announcements match (the DOM is the same, so they should).

## Setup

1. `pnpm install`, then `pnpm playground` (every fixture on its suite port, the playground on
   5300), or one fixture: `pnpm --filter fixture-react dev` (5320).
2. One of:
   - **macOS**: Safari or Chrome, VoiceOver (Cmd+F5). Use the VO keys only where a step says so;
     otherwise press the keys the step names, with VoiceOver on.
   - **Windows**: Firefox or Chrome, NVDA (latest). Browse mode off (NVDA+Space) once focus is
     on the component, unless a step says otherwise.
3. Open each route at `http://localhost:5320/<route>`. Repeat the whole list on a second
   framework (for example Angular, `5360`, the most different DOM authoring) and note any
   difference.
4. Record the screen reader and browser versions in the table below, then one row per check:
   `as expected`, or what was announced instead.

The expected announcements come from the specs (`spec/<component>.md`, "Accessibility" and
"Scenarios"). Wording differs between screen readers: what matters is the role, the name, the
state and the value, not the exact words.

## Checklist

### Dialog: `/dialog/basic` (spec/dialog.md)

1. Tab to "Open dialog", press Enter. Expected: "Edit profile, dialog" and its description; focus
   on the first field, read with its label.
2. Tab through the dialog to the end and once more. Expected: focus wraps inside the dialog; the
   page behind is never read (it is inert).
3. Press Escape. Expected: back on "Open dialog", read as a button.

### Menu: `/menu/basic`, `/menu/submenu` (spec/menu.md)

1. Focus "Actions". Expected: "Actions, menu button, collapsed" (or "popup button").
2. ArrowDown. Expected: the menu opens, "Edit, menu item, 1 of 4" (with position).
3. ArrowDown twice. Expected: "Archive" read as dimmed or unavailable, still reachable.
4. On `/menu/submenu`, reach the submenu trigger. Expected: announced as having a submenu;
   ArrowRight (ArrowLeft with `?dir=rtl`) enters it and reads its first item.
5. Escape. Expected: back on "Actions", collapsed.

### Combobox: `/combobox/basic` (spec/combobox.md)

1. Tab to the input. Expected: "Fruit, combo box, collapsed" (editable, autocomplete list).
2. Type "b". Expected: expanded, with two options (some screen readers announce the count);
   nothing is highlighted yet and focus stays in the input.
3. ArrowDown. Expected: "Banana" read as the highlighted option (`aria-activedescendant`), focus
   still in the input; ArrowDown again reads "Blueberry".
4. Enter. Expected: the input now reads "Blueberry"; the list is collapsed.
5. Type "zz". Expected: "No fruit found." is reachable or announced (it is rendered as the empty
   state, not as an option).

### Calendar: `/calendar/single`, `/date-picker/basic` (spec/calendar.md)

1. Tab into the grid. Expected: the focused date in full ("Friday, November 20, 2026"), with
   "current date" on today's cell and the grid named by its month heading.
2. Arrows. Expected: each date read in full; an unavailable or out-of-range date read as
   dimmed/unavailable.
3. PageDown. Expected: the new month's heading is announced (the heading is `aria-live`), then
   the focused date.
4. Enter. Expected: the date read as "selected".
5. On `/date-picker/basic`, focus the trigger. Expected: "Choose date: none, button", with a
   dialog popup. Enter: a dialog whose grid is named "November 2026", focus on November 20;
   Escape returns to the trigger.

### Select: `/select/basic` (spec/select.md)

1. Tab to the trigger. Expected: "Fruit, Choose a fruit, combo box (or pop-up button),
   collapsed" (the placeholder is the trigger's text).
2. ArrowDown. Expected: expanded; "Apple" read as the highlighted option while focus stays on the
   trigger (`aria-activedescendant`, the APG select-only combobox).
3. ArrowDown to "Orange". Expected: read as dimmed/unavailable (it can be highlighted, not
   chosen).
4. Type "m". Expected: "Mango" highlighted and read.
5. Enter. Expected: collapsed, and the trigger now reads "Fruit, Mango".
6. Reopen, press Tab. Expected: the highlighted option is chosen, focus moves on (APG).

### Slider: `/slider/basic`, `/slider/range`, `/slider/vertical` (spec/slider.md)

1. Tab to the thumb on `/slider/basic`. Expected: "Volume, slider, 50" (min 0, max 100).
2. ArrowRight, PageUp, End. Expected: 51, 61, 100, each read as it changes.
3. On `/slider/range`, Tab through both thumbs. Expected: "Minimum price, slider, $20" (the value
   text from `aria-valuetext`), then "Maximum price, slider, 80".
4. On `/slider/vertical`. Expected: "Brightness, slider, 30", announced as vertical; ArrowUp
   reads 31.

## Findings

Screen reader and browser: _pending_. Second framework: _pending_.

| component | step | expected | observed | status |
| --- | --- | --- | --- | --- |
| Dialog | 1–3 | see above | | pending: needs a person |
| Menu | 1–5 | see above | | pending: needs a person |
| Combobox | 1–5 | see above | | pending: needs a person |
| Calendar | 1–5 | see above | | pending: needs a person |
| Select | 1–6 | see above | | pending: needs a person |
| Slider | 1–4 | see above | | pending: needs a person |

A difference between two frameworks is a bug in the one whose DOM differs: compare the elements'
roles and ARIA in the devtools' accessibility tree first.
