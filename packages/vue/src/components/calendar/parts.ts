import { CalendarCell } from "./calendar-cell.ts";
import { CalendarGrid } from "./calendar-grid.ts";
import { CalendarGridBody } from "./calendar-grid-body.ts";
import { CalendarGridHeader } from "./calendar-grid-header.ts";
import { CalendarHeaderCell } from "./calendar-header-cell.ts";
import { CalendarHeading } from "./calendar-heading.ts";
import {
    CalendarNextButton,
    CalendarPrevButton,
} from "./calendar-page-button.ts";
import { CalendarRoot, RangeCalendarRoot } from "./calendar-root.ts";
import { CalendarRow } from "./calendar-row.ts";

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
