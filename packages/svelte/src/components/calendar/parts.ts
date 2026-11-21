import CalendarCell from "./calendar-cell.svelte";
import CalendarGrid from "./calendar-grid.svelte";
import CalendarGridBody from "./calendar-grid-body.svelte";
import CalendarGridHeader from "./calendar-grid-header.svelte";
import CalendarHeaderCell from "./calendar-header-cell.svelte";
import CalendarHeading from "./calendar-heading.svelte";
import CalendarNextButton from "./calendar-next-button.svelte";
import CalendarPrevButton from "./calendar-prev-button.svelte";
import CalendarRoot from "./calendar-root.svelte";
import CalendarRow from "./calendar-row.svelte";
import RangeCalendarRoot from "./range-calendar-root.svelte";

const parts = {
    Heading: CalendarHeading,
    PrevButton: CalendarPrevButton,
    NextButton: CalendarNextButton,
    Grid: CalendarGrid,
    GridHeader: CalendarGridHeader,
    HeaderCell: CalendarHeaderCell,
    GridBody: CalendarGridBody,
    Row: CalendarRow,
    Cell: CalendarCell,
};

/** spec/calendar.md: one date */
export const Calendar = { Root: CalendarRoot, ...parts };

/** spec/calendar.md: a range of dates (the same parts) */
export const RangeCalendar = { Root: RangeCalendarRoot, ...parts };
