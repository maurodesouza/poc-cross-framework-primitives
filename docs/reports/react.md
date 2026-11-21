# React report (Epic B)

The reference implementation: `@poc/dom`, `@poc/styles` and `@poc/react` with the six mandatory
components, written from scratch. Every later framework is compared to these numbers.

- Data: [`data/react.json`](data/react.json), tables: [`data/react.md`](data/react.md), from
  `pnpm metrics --framework react` after `pnpm e2e -- --project react --project baseline`
  (2026-11-20).
- The data files were regenerated in Epic E, after D1 moved code into `@poc/dom`; the tables on
  this page are as of this report. Current numbers: [`frameworks.md`](frameworks.md).
- Effort figures come from the commit timestamps of agent runs: a proxy, not human time.
- The tables below are the end of Epic B. Epic C moved two pure keyboard maps from React to
  `@poc/dom`, so the current numbers ([`data/react.md`](data/react.md),
  [`checkpoint.md`](checkpoint.md)) differ slightly (calendar 755 lines, combobox 543).

## Conformance

| project | layer | passed | failed | expected failures | skipped |
| --- | --- | --- | --- | --- | --- |
| react | behaviour | 90 | 0 | 0 | 0 |
| react | contract | 16 | 0 | 0 | 0 |
| react | visual | (CI only) | | | 16 |
| baseline | behaviour | 79 | 0 | 11 | 0 |

- **React passes every behaviour test, the 11 the baseline fails included** (the recorded
  deviations of Base UI and React Aria). On the spec's terms, it is the more conformant of the two.
- The visual layer runs in CI's Playwright image only. The golden set comes from this Epic's CI
  run (`conformance/README.md`).
- Calendar, combobox and pickers needed fixes found by the suite while being written: focus after
  a month change, the picker trigger's name (axe, WCAG 2.5.3). The specs were updated where the
  suite showed them unclear; no behaviour test was weakened.

## Lines of code

| component | `@poc/react` (its folder) | `@poc/dom` it uses | share in `@poc/dom` |
| --- | --- | --- | --- |
| dialog | 272 | 233 | 46% |
| popover | 376 | 417 | 53% |
| menu | 750 | 457 | 38% |
| combobox | 545 | 277 | 34% |
| tabs | 366 | 49 | 12% |
| calendar | 788 | 232 | 23% |
| date-picker | 272 | 294 | 52% |

Plus 372 lines of React infrastructure shared by every component (`render`, merged props and
refs, controllable state, presence, the overlay root, positioning hooks), and 915 lines in all of
`@poc/dom`.

How to read it: the `@poc/dom` column is what a port reuses for free; the first column is what a
port rewrites. Overlays reuse about half of their code; Tabs and the calendar reuse little,
because their logic is keyboard and state handling, which the boundary keeps in the framework
(see "Boundary pressure"). The count follows each component's imports (type-only imports
included, so the calendar counts `presence` through the picker's types).

## Bundle size (minified + gzip, React external)

| component | `@poc/react` | baseline |
| --- | --- | --- |
| Dialog | 3.4 kB | 23.4 kB (Base UI) |
| Popover | 10.8 kB | 40.2 kB (Base UI) |
| Menu | 12.3 kB | 60.2 kB (Base UI) |
| Combobox | 11.1 kB | 50.9 kB (Base UI) |
| Tabs | 2.4 kB | 13.3 kB (Base UI) |
| Calendar + RangeCalendar | 4.4 kB | 25.8 kB (React Aria) |
| DatePicker + DateRangePicker | 10.1 kB | 34.4 kB (React Aria) |

Not like for like: Base UI and React Aria ship many more options (modal and non-modal variants,
nested dialogs' stacking, virtualized and grouped collections, chips, forms, a segmented date
field, every calendar system, internationalized strings). The POC implements the specs' scope
only. What the numbers do say: the specs' scope fits in a small package, and `@floating-ui/dom`
(about 6 kB of the positioned components) is the largest single piece.

## API ergonomics (React)

- The namespace-of-parts API (`Dialog.Root`, `Dialog.Popup`, ...) and `render` read as Base UI
  does; the fixture's styled layer is one line per part (`fixtures/react/src/kit/ui/`).
- `className` and `style` as a function of the state were not needed by the fixture: the
  recipes select state through `data-*` alone. It is the strongest sign that one styling layer
  can serve every framework.
- Children functions (calendar weeks and days) work, but the fixture had to pass keys itself; a
  part that renders its own default children (`GridHeader`, `GridBody`, `Row`) avoids that.
- **Not done: part hooks** (`useDialogPopup()` and the like, the contract's lower layer). The
  primitives use internal hooks; exposing them is deferred, since the POC measures the
  primitives. Recorded here for the checkpoint.

## Boundary pressure (`@poc/dom`)

What fit `@poc/dom` without strain: positioning with logical sides, the layer stack (Escape and
outside presses, child layers), focus trap and tab order, scroll lock, inert, list navigation and
typeahead, presence, dates and locale data.

Where component logic pushed against the boundary:

1. **Pure keyboard maps stayed in React and will be rewritten per framework.** The calendar's
   key → target date (arrows by direction, Home/End by week, PageUp/Down, Shift for years) and
   the combobox's highlight stepping (past an end, back to the input) are pure functions of
   (key, current, options). They are math, not state, so the boundary allows them in `@poc/dom`.
   **Recommendation for Epic C:** move them there before porting (`calendarKeyTarget`, a
   `stepIndex` option for "none past the ends").
2. **The submenu's safe hover area** (point-in-triangle geometry) was first written in the React
   menu, then moved to `@poc/dom` (`pointer/isInSafeArea`) in this Epic: it is geometry.
3. **Focus after render stays per framework.** The calendar focuses a cell once the cell exists
   (a new month's cells mount one render later); the picker focuses on open. This is lifecycle,
   correctly framework-side, and it was the subtlest bug of the Epic. Each port will meet it.
4. **The overlay wiring repeats in five components** (Dialog, Popover, Menu, Combobox,
   DatePicker: layer, presence, positioner, focus return). In React it is shared through hooks
   (`use-overlay-root`, `use-positioner`); each framework will need the same internal sharing.

## Baseline comparison

The behaviour suite found 9 differences between the baseline and the specs (recorded in each
spec's "Baseline deviations"), and the first draft of the specs left the APG in three places
(disabled items' focusability, combobox arrows at the ends, Escape on a closed combobox), which
the baseline showed. React passes the spec in all of them.

## Screen reader spot check

**Pending a human run**: it needs VoiceOver or NVDA, which this environment cannot drive. The
checklist, on `fixtures/react` (`pnpm --filter fixture-react dev`):

| component | check | result |
| --- | --- | --- |
| Dialog | opening announces "Edit profile, dialog" and its description; Tab stays inside; closing returns to "Open dialog" | pending |
| Menu | the trigger announces "Actions, menu button, collapsed"; arrows read items with position ("2 of 4"); "Archive" reads as dimmed/unavailable; the submenu trigger announces a submenu | pending |
| Combobox | typing announces the number of results or the highlighted option; the highlighted option is read while focus stays in the input; choosing reads the value | pending |
| Calendar | entering the grid reads "Friday, November 20, 2026" and "current date"; arrows read each date; changing month reads the new heading (`aria-live`); the selected date reads "selected" | pending |

## Effort

Every component folder was written in one commit by one agent run (Dialog, Popover and Menu in
the first, the other four in the second), about 10 minutes apart. The ports in Epic C will be
measured the same way, from their commits.

## Extras (Epic F)

Select, Tooltip, Checkbox and CheckboxGroup, and Slider, specified in Epic F (#35) and built in
#36. Current numbers: [`data/react.md`](data/react.md).

| component | framework package | @poc/dom used | bundle (gzip) | Base UI 1.9 |
| --- | --- | --- | --- | --- |
| select | 592 | 404 | 11.8 kB | 44.5 kB |
| tooltip | 421 | 272 | 10.4 kB | 33.3 kB |
| checkbox | 212 | 45 | 1.9 kB | 8.1 kB |
| checkbox-group | 108 | 0 | 1.1 kB | 4.2 kB |
| slider | 503 | 195 | 3.4 kB | 14.4 kB |

- **Conformance**: React passes the extras' behaviour (48), contract (8) and visual (8) tests,
  and the six earlier components as before (behaviour 140, contract 24 in all). The golden
  screenshots of the extras come from CI run 44895515549, made with React alone registered for
  them. The baseline passes the extras' behaviour layer apart from 6 recorded deviations.
- **New in `@poc/dom`** (337 lines, each tested with Vitest, framework-free): `startDrag` (a
  captured pointer drag), `isInHoverBridge`, `createHoverIntent` and `createDelayGroup`
  (`hover/`), the range math and `sliderKeyTarget` (`range/`), `bridgeForm` and the hidden
  input's style (`form/`). Select reuses `createTypeahead` and `menuKeyTarget` (without
  wrapping): no new listbox code.
- **Part hooks: none.** Every part of the extras reads its root's context (and Select's
  ItemIndicator its item's); no extra needed a lower layer to be expressed in React, so none was
  added (maintainer: "if necessary").

### Port log (React)

| part | finding | fixed in |
| --- | --- | --- |
| Slider | `onValueCommit` after a key read the value before React re-rendered; the change now returns the new values and the commit takes them | `@poc/react` |
| Checkbox | a `button` clicks on Enter: Enter is prevented, Space toggles (APG) | `@poc/react` |
| hidden inputs | a form reset happens after the `reset` event, and React does not re-render when the state already equals the default: `bridgeForm` reports the reset once the browser is done, and the component writes the default back onto its input | `@poc/dom`, `@poc/react` |
| Tooltip | focus opens only on `:focus-visible` (a click focuses the button too); a tap is ignored by `pointerType` | `@poc/react` |

### Boundary pressure (extras)

1. **The tooltip's hover tracking** (a document `pointermove` while a hover-opened tooltip is
   open, closing once the pointer leaves the trigger, the popup and the gap) is about 25 lines,
   written in each framework. It is a session like `openOverlaySession`: a candidate to move into
   `@poc/dom` before Epic G ports it three more times. It stayed out here because it decides when
   to close, with the framework's open state at hand. **Epic G moved it** before the three ports:
   `trackHoverBridge(trigger, popup, { inside, outside })` only reports where the pointer is;
   the decision (cancel, or start the close delay) stays in `Tooltip.Root`, which now calls it
   in three lines (React and Vue alike).
2. **The delay group** (`createDelayGroup`) went into `@poc/dom` because it holds no member's open
   state: only the open member's close callback and the time of the last close. Each tooltip
   keeps its own `open` and reports to it.
3. **CheckboxGroup's membership** (a child's checked state from the array, the parent's
   checked/mixed state, check-all) is component state: it stays in the framework packages, about
   40 lines each.
4. **The slider's value shape** (a number or an array, decided by `defaultValue`) is API, not
   math: it stays in the framework; the math (`moveThumb`, `thumbBounds`, `nearestThumb`) does
   not.

### Baseline deviations (extras)

Base UI 1.9 against the specs (each marked with `baselineDeviation`): Select moves DOM focus into
the list (the APG keeps it on the combobox), Tab closes without choosing, an outside press reports
`cancel-open`, and a form reset is ignored; Checkbox ignores a form reset; the Tooltip trigger gets
no `aria-describedby`. Fixture settings, not deviations: `alignItemWithTrigger={false}`,
`role="tooltip"` and `aria-hidden` on the Checkbox Indicator given by the fixture.

## Field (Epic H)

The Field layer of `spec/field.md`: Root, Label, Control, Description and Error, and its
integration into Checkbox, Select and Slider. It was built in #49, after the spec, the tests and
the Base UI baseline of #48.

| piece | lines |
| --- | --- |
| `components/field/` (five parts, context, namespace) | 429 |
| `hooks/use-field-control.ts`, the control's side of the integration contract | 119 |
| Checkbox, Select and Slider integration | +68 / −7 in 7 files |
| new in `@poc/dom` (`form/`), framework-free and tested with Vitest | 238 |

- **Conformance.** React passes the 22 Field behaviour and contract tests on the first suite run, apart from one
  axe finding (below). Every earlier test is unchanged and green. The golden screenshots come
  from CI run 44919917987, made with React alone registered for Field.
- **Effort.** About 20 minutes of agent time from the spec commit to the green suite. The Field
  is the largest cross-cutting gap of `production-scope.md`, but in this POC's scope it costs about as
  much as Checkbox did.
- **The baseline** (Base UI 1.9) passes every Field behaviour test. Base UI's `onSubmit` mode needs
  its `Form`, which the baseline fixture uses (a fixture setting).

### Boundary pressure (Field)

The validation pipeline went into `@poc/dom` before any framework used it, because it holds no
component state:

- `validateField`: the native validity, the required rule, `validate`, and the element's custom
  validity;
- `validatesOnChange` and `shownAfterChange`: the mode table;
- `fieldErrorShown`, `fieldStateAttributes`, `fieldDescribedBy` and `onSubmitAttempt`.

The field's state stays in the framework: `touched`, `focused`, `dirty`, `filled`, the shown
validation, the submitted flag, and the registry of label, control, description and errors. So
does the integration hook, about 120 lines. It is a value watcher, focus and blur reporting, and the form
listener's lifecycle, and each framework expresses those with its own reactivity.

### Port log (Field)

| part | finding | fixed in |
| --- | --- | --- |
| Field without a `Form` part | a native form validates its controls before `submit`. A field shows its errors from the browser's `invalid` event (caught at the form in the capture phase), and keeps `validate`'s result as the element's custom validity at all times, so the browser blocks a rejected value | `@poc/dom`, spec |
| Description | the recipe dimmed a disabled field's description, which axe flags (contrast). Only the control and the label are dimmed now | `@poc/styles` |
| Slider | its hidden inputs are `type="hidden"`, which the browser never validates: `validate` shows its messages but cannot block a native submission (recorded in the spec) | spec |
| Select | the field took the select's generated trigger id, so a consumer `id` on `Select.Trigger` left the label's `for` pointing nowhere. The select now registers the trigger's rendered id (found in the Epic review, fixed in React, Vue, Svelte and Solid) | `@poc/react` and the ports |

## Combobox parity (Epic I)

The Combobox of `spec/combobox.md` rewritten to Fragiola UI's scope (#56), after the spec, the
tests and the Base UI baseline of #55, with the maintainer's decisions 5 and 6 applied
(`docs/decisions.md`): the combobox filters `items` itself, closing without a choice resets the
text, and a press on the input opens the list.

| piece | lines |
| --- | --- |
| `components/combobox/` before (9 parts, context, namespace) | 590 |
| `components/combobox/` now (20 parts, context, namespace) | 1389, of which the Root 415 |
| new in `@poc/dom` (`collection/combobox-items.ts`, `chip-keys.ts`), pure and tested with Vitest | 288 |
| fixture (nine scenarios, data, kit wrapper) | 734 |

- **Conformance.** React passed the 42 Combobox behaviour and contract tests on its first suite
  run. The Epic review then found a stale highlight when the list reopens during its exit
  animation; the fix added one test (43). The golden screenshots (five) come from CI run
  44925304669, made with React alone registered for Combobox.
- **Effort.** About ten minutes of agent time from the green baseline (13:25) to the green
  React suite (13:34), after about twenty for the spec, the tests and the baseline.
- **The baseline** (Base UI 1.9) passes every Combobox behaviour test except two recorded
  deviations: axe while open (its `aria-hidden` outside the list hides the input's label) and a
  form reset, which leaves Base UI's value and text as they were.

### Boundary pressure (Combobox parity)

None that crossed the boundary. What holds no state went into `@poc/dom` before the ports:
`itemLabel` and `itemFormValue` (the item-to-string defaults), the locale-aware `textContains`
and `containsFilter`, `queryIsLabel`, `filterItems` (groups and a limit), `includesItem` and
`toggleItem`, and `chipKeyTarget`. The value, the text, the highlight, the "typed since open"
flag that decides when the whole list shows, the registry of rendered items and the reset of
the text on close stay in the framework.

### Port log (Combobox parity)

| part | finding | fixed in |
| --- | --- | --- |
| baseline | Base UI highlights the selected item when a click opens the list, and keeps its filter while the list closes: the spec follows the first, and the tests avoid depending on the second | spec, tests |
| Separator | Base UI renders it as `role="presentation"` inside the listbox (a `listbox` owns only groups and options); the spec follows | spec |
| hidden inputs | their part value is `hidden-input`, since `input` is the visible Input's | spec |
| List | a list reopened during its 150 ms exit animation kept its element and its item count, so the pending highlight was never applied and the old one stayed. Every close now drops the highlight, and the List applies a pending one on every open (found in the Epic review, fixed in the five frameworks) | `@poc/react` and the ports |
