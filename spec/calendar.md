# Calendar, RangeCalendar, DatePicker, DateRangePicker

## Purpose

- **Calendar**: a month grid for choosing one date (APG date picker dialog's grid).
- **RangeCalendar**: the same grid for choosing a start and an end date.
- **DatePicker** / **DateRangePicker**: a trigger and a popover holding a Calendar / RangeCalendar.

Out of scope: a segmented date field (typing a date in parts), time, time zones, non-Gregorian
calendars, event calendars.

## Dates

A date is a plain value `{ year, month, day }` (`month` 1–12) with no time and no time zone
(`PlainDate`, from `@poc/dom`). A range is `{ start, end }` with `start <= end`. Fixtures print
dates as ISO strings (`2026-11-20`, `2026-11-10..2026-11-15`). "Today" is the local date of
`new Date()`.

## Anatomy

| part | element | part attribute | notes |
| --- | --- | --- | --- |
| Root | `div` | `data-calendar-part="root"` | holds the state |
| Heading | `h2` | `heading` | the month shown by the grid of the same `offset` |
| PrevButton | `button` | `prev-button` | shows the previous page of months |
| NextButton | `button` | `next-button` | shows the next page of months |
| Grid | `table` | `grid` | one month |
| GridHeader | `thead` (with one `tr`) | `grid-header` | children function per weekday |
| HeaderCell | `th` | `header-cell` | one weekday |
| GridBody | `tbody` | `grid-body` | children function per week |
| Row | `tr` | `row` | one week; children function per date |
| Cell | `td` | `cell` | one date |

RangeCalendar has the same parts (same `data-calendar-part` values).

DatePicker and DateRangePicker:

| part | element | `data-date-picker-part` | notes |
| --- | --- | --- | --- |
| Root | none | | holds the value and the open state |
| Trigger | `button` | `trigger` | opens the popup; its content is the consumer's (for example the formatted value) |
| Portal | none | | |
| Positioner | `div` | `positioner` | as [popover.md](popover.md#positioning) |
| Popup | `div` | `popup` | a non-modal `dialog` holding a `Calendar.Root` / `RangeCalendar.Root` |

A `Calendar.Root` (or `RangeCalendar.Root`) rendered inside a picker's Popup without `value` /
`defaultValue` binds to the picker: it shows the picker's value and choosing a date sets it.

## API

**Calendar.Root**:

- `value`, `defaultValue` (`null`), `onValueChange(date, details)`.
- `min`, `max` (`PlainDate`): dates outside are disabled.
- `isDateUnavailable(date) => boolean`: unavailable dates can be focused but not chosen.
- `locale` (BCP 47; defaults to the document's `lang`, then the browser's).
- `firstDayOfWeek` (`0`–`6`, Sunday = 0; defaults to the locale's, from `Intl.Locale` week info
  with a fallback table).
- `visibleMonths` (`1`): how many months are shown side by side; each is a Grid with an `offset`.
- `disabled`, `readOnly`.

**RangeCalendar.Root**: the same, with `value: { start, end } | null`.

**Heading**: `offset` (`0`): which visible month it names. Its default content is the month and
year formatted by `Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })`.

**PrevButton**, **NextButton**: move the visible months by `visibleMonths` (one page). Disabled
when the page would only hold dates outside `min` / `max`.

**Grid**: `offset` (`0`).

**GridHeader**: children function `(weekday) => HeaderCell`, where `weekday` is
`{ index, short, long }` (`short`: `Intl` `weekday: "short"`, `long`: `weekday: "long"`), in the
locale's order.

**HeaderCell**: `weekday`. Default content: `weekday.short`.

**GridBody**: children function `(week) => Row`, `week` being an array of 7 `PlainDate`s (6 weeks
are always rendered, so the grid never changes height).

**Row**: `week`; children function `(date) => Cell`.

**Cell**: `date`. Default content: the day number (`Intl` `day: "numeric"`). Its `aria-label`
defaults to the full date (`Intl` `dateStyle: "full"`), and the consumer can replace it.

**DatePicker.Root**: `value`, `defaultValue`, `onValueChange`, `open`, `defaultOpen`,
`onOpenChange`, plus the calendar options (`min`, `max`, `isDateUnavailable`, `locale`,
`firstDayOfWeek`, `visibleMonths`) passed to the bound calendar. **DateRangePicker.Root**: the
same with a range.

**Locale data is the one exception to "no text"** ([README](README.md#no-text-and-the-one-exception)):
the heading, the weekday names, the day numbers and the cells' full date names come from `Intl`.
The prev and next buttons have no name of their own: the consumer labels them.

## State attributes and ARIA

| part | attributes |
| --- | --- |
| Root | `data-disabled`, `data-readonly` |
| Heading | an `id`, `aria-live="polite"` (only on the `offset` 0 heading) |
| PrevButton, NextButton | `aria-controls` (the grids' ids), `disabled` and `data-disabled` when they cannot move |
| Grid | `role="grid"`, `aria-labelledby` (the Heading with the same `offset`), `aria-readonly="true"` when read-only, `aria-disabled="true"` when disabled, `aria-multiselectable="true"` in a RangeCalendar |
| HeaderCell | `scope="col"`, `abbr` (the long weekday name) |
| Cell | `role="gridcell"`, `aria-label`, `tabindex` (`0` on the focused date, `-1` on the other dates of the shown months, absent on outside-month cells), `aria-selected="true"` when selected (absent otherwise), `aria-disabled="true"` when disabled, unavailable or outside the month, `aria-current="date"` on today; `data-today`, `data-selected`, `data-disabled`, `data-unavailable`, `data-outside-month`; in a RangeCalendar also `data-range-start`, `data-range-end`, `data-in-range`, `data-range-preview` |
| DatePicker Trigger | `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`, `data-open` |
| DatePicker Popup | `role="dialog"`, `data-open`, `data-side`, `data-align`, `data-starting-style`, `data-ending-style` |

A date is **disabled** when it is before `min`, after `max`, or the calendar is disabled: it
cannot be focused by the keyboard nor chosen. A date is **unavailable** when
`isDateUnavailable` says so: it can be focused but not chosen. **Outside-month** cells (the
leading and trailing days of the 6-week grid) cannot be focused nor chosen; the keyboard reaches
those dates by moving the visible month.

## Keyboard

In the grid (APG date picker grid). "Next day" is ArrowRight in LTR and ArrowLeft in RTL:

| key | moves the focused date to |
| --- | --- |
| next day / previous day | +1 / −1 day |
| ArrowDown / ArrowUp | +7 / −7 days |
| Home / End | the first / last day of its week (by the locale's first day) |
| PageDown / PageUp | the same day of the next / previous month (clamped to the month's last day) |
| Shift+PageDown / Shift+PageUp | the same day of the next / previous year (clamped) |
| Enter, Space | chooses the focused date (unless disabled, unavailable or read-only) |
| Escape | in a RangeCalendar, cancels a started range; in a picker, closes the popup |

- Moving the focused date outside the visible months moves them (by one month, so the focused
  date's month becomes the first or last visible month).
- The focused date never moves to a disabled date (before `min` / after `max`): the key does
  nothing.
- Each move updates the Heading (announced through its `aria-live`).

## Focus

- The grid is one tab stop: the focused date's cell. The **focused date** starts at the value
  (the range's start), else today, clamped into `[min, max]`.
- PrevButton and NextButton keep focus on themselves; the focused date moves by the same number
  of months (clamped).
- After a choice, focus stays on the chosen cell (Calendar, RangeCalendar).
- **Pickers**: opening focuses the focused date's cell. Choosing a date (DatePicker) or a range's
  end (DateRangePicker) closes the popup (reason `item-press`) and focuses the Trigger. Escape
  closes (reason `escape-key`) and focuses the Trigger. Focus is not trapped: as in
  [popover.md](popover.md#focus), the popup's content comes right after the Trigger in the tab
  order. Tab from its last tabbable element closes (reason `focus-out`) and moves focus to the
  element after the Trigger; Shift+Tab from its first closes (reason `focus-out`) and focuses the
  Trigger.

## Pointer

- Clicking an enabled, available date chooses it (and focuses it).
- **RangeCalendar**: the first choice sets the start (the range is pending); while pending,
  hovering or focusing a date previews the range between the start and it
  (`data-range-preview`); the second choice sets the end. If the second date is before the
  first, they are swapped. `onValueChange` fires once, with the complete range.

## Dismissal and layering

Calendars: none. Pickers: as [popover.md](popover.md#dismissal-and-layering) (Escape, outside
press, focus out), with focus returning to the Trigger on Escape.

## Positioning

Pickers: as Popover's, defaults `side="bottom" align="start"`.

## Animation

Pickers' Popup as [popover.md](popover.md#animation). Calendars: none.

## RTL

The grid flows right to left (from the document's `dir`); next/previous day swap ArrowRight and
ArrowLeft. Week order still starts at the locale's first day, on the inline-start side.

## Scenarios

The suite fixes today at **2026-11-20** (Friday). November 2026 starts on a Sunday and has 30
days.

### `/calendar/single`

`locale="en-US"`. Content: a PrevButton with `aria-label` **"Previous month"**, a Heading, a
NextButton **"Next month"**, one Grid. Output: `value: <ISO or none>`.

Checks:

1. A `grid` named "November 2026" (by its heading); 7 `columnheader`s, the first with text "Sun".
2. The `gridcell` named "Friday, November 20, 2026" has `aria-current="date"` and `tabindex="0"`;
   every other in-month cell has `tabindex="-1"`.
3. Tab into the grid focuses November 20. ArrowRight → November 21; ArrowDown → November 28;
   ArrowDown → December 5 and the grid is named "December 2026"; ArrowUp → November 28 ("November
   2026"); Home → November 22 (Sunday); End → November 28 (Saturday).
4. PageDown → December 28; PageUp → November 28; Shift+PageDown → November 28, 2027 ("November
   2027"); Shift+PageUp → November 28, 2026.
5. Enter chooses it: output `value: 2026-11-28`, the cell has `aria-selected="true"`.
6. Click "Next month": the grid is named "December 2026" and focus stays on the button.
7. In December's grid, the trailing cells (January 2027) are outside the month:
   `aria-disabled="true"`, no `tabindex`; clicking one does nothing.
8. Click December 3: `value: 2026-12-03`.
9. Axe finds no violation.

### `/calendar/min-max`

`min = 2026-11-10`, `max = 2026-12-05`, en-US.

Checks:

1. November 9 has `aria-disabled="true"`; clicking it does not choose it.
2. "Previous month" is disabled; "Next month" is enabled.
3. Focus November 10 (click it), ArrowLeft: focus stays on November 10.
4. Click "Next month": in December, "Next month" is disabled and December 6 is disabled.

### `/calendar/unavailable`

Weekends are unavailable (`isDateUnavailable`), en-US.

Checks: November 21 (Saturday) has `aria-disabled="true"`; the keyboard can focus it
(ArrowRight from November 20); Enter does not choose it (output unchanged).

### `/calendar/locale?locale=de-DE`

The single scenario with `locale="de-DE"`.

Checks (expected strings computed in the test with `Intl` for `de-DE`):

1. The grid is named "November 2026".
2. The first `columnheader` is Monday's short name ("Mo").
3. The first row starts with October 26 (outside the month).
4. Focus November 20, Home → November 16 (Monday).
5. The cell names are German full dates ("Freitag, 20. November 2026").

### `/calendar/rtl?locale=he-IL&dir=rtl`

The single scenario in Hebrew, right to left.

Checks: focus November 20; ArrowLeft → November 21; ArrowRight → November 20 → November 19.

### `/calendar/two-months`

`visibleMonths = 2`, en-US. Two Headings and Grids (`offset` 0 and 1).

Checks:

1. Two grids named "November 2026" and "December 2026".
2. Focus November 30, ArrowRight → December 1 (in the second grid); the visible months do not
   change.
3. "Next month" shows "January 2027" and "February 2027".

### `/calendar/range`

RangeCalendar, en-US. Output: `value: <start>..<end>` or `none`.

Checks:

1. Click November 10, hover November 15: November 10–15 carry `data-range-preview` (contract
   layer).
2. Click November 15: `value: 2026-11-10..2026-11-15`; November 10–15 have
   `aria-selected="true"`; November 10 has `data-range-start`, November 15 `data-range-end`
   (contract layer).
3. Click November 18, then November 12: `value: 2026-11-12..2026-11-18` (swapped).
4. Keyboard: focus November 20, Enter, ArrowRight twice, Enter: `value: 2026-11-20..2026-11-22`.
5. Enter on November 24, Escape: the pending range is cancelled; the value is unchanged.
6. The grid has `aria-multiselectable="true"`.

### `/date-picker/basic`

DatePicker, en-US. The Trigger's text is **"Choose date: "** followed by the value (or "none"),
which is also its accessible name (no `aria-label`: WCAG 2.5.3 wants the visible text in the
name); the Popup holds a bound Calendar with PrevButton **"Previous month"** and NextButton
**"Next month"**. Output: `value: ...`, `open: ...`, `reason: ...`.

Checks:

1. Trigger has `aria-haspopup="dialog"`, `aria-expanded="false"`.
2. Click it: a `dialog` with a grid named "November 2026"; focus on November 20.
3. ArrowRight ×4, Enter: `value: 2026-11-24`, the popup closes (`reason: item-press`), focus on
   the trigger.
4. Reopen: focus on November 24 (the value).
5. Escape closes (`reason: escape-key`), focus on the trigger.
6. Reopen, click outside: closes (`reason: outside-press`).
7. Reopen (focus on the date cell, the popup's last tabbable element), Tab: closes
   (`reason: focus-out`). Reopen, Shift+Tab ×3 (Next month, Previous month, then out): closes
   (`reason: focus-out`), focus on the trigger.
8. Axe finds no violation while open.

### `/date-picker/range`

DateRangePicker, en-US, Trigger text **"Choose dates: "** followed by the range (or "none").

Checks: open; click November 10: the popup stays open; click November 13: `value:
2026-11-10..2026-11-13`, the popup closes and focus is on the trigger.

## Baseline deviations

Measured against React Aria Components 1.22 (`Calendar`, `RangeCalendar`, `DatePicker`,
`DateRangePicker`).

| difference | test |
| --- | --- |
| The weekday header row is hidden from assistive technologies (`aria-hidden` on `thead`); the weekday is part of each cell's name instead | `calendar / single › a grid named by its month, with locale weekday headers`, `calendar / locale de-DE: German weekday headers, Monday first` |
| Today has no `aria-current="date"`; its name starts with "Today, " | `calendar / single › today is marked as the current date` |
| Home and End move to the start and end of the **month**; the APG grid moves to the start and end of the **week** | `calendar / single › Home and End move to the start and end of the week`, `calendar / locale de-DE: Home goes to Monday` |
| In a RangeCalendar, Enter that starts a range also moved the focus one day forward, so two ArrowRight presses ended the range three days later | `calendar / range › the keyboard chooses a range` |
| The picker's popover is modal and contains focus: Tab and Shift+Tab cycle inside it instead of leaving and closing it | `date-picker / basic › Tab out of the popup closes it, as a popover` |

React Aria also extends the cells' names (" selected", ", First available date", "Selected
Range: ... to ..., " before the date). The behaviour layer finds a cell by the full date its name
ends with (any trailing note has no digit, so it can never be another date); the contract layer
checks the spec's exact name.
