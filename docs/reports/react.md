# React report (Epic B)

The reference implementation: `@poc/dom`, `@poc/styles` and `@poc/react` with the six mandatory
components, written from scratch. Every later framework is compared to these numbers.

- Data: [`data/react.json`](data/react.json), tables: [`data/react.md`](data/react.md), from
  `pnpm metrics --framework react` after `pnpm e2e -- --project react --project baseline`
  (2026-11-20).
- Effort figures come from the commit timestamps of agent runs: a proxy, not human time.

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
