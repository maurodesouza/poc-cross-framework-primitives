import { CalendarCell } from "./calendar-cell.tsx";
import { CalendarGrid } from "./calendar-grid.tsx";
import { CalendarGridBody } from "./calendar-grid-body.tsx";
import { CalendarGridHeader } from "./calendar-grid-header.tsx";
import { CalendarHeaderCell } from "./calendar-header-cell.tsx";
import { CalendarHeading } from "./calendar-heading.tsx";
import {
    CalendarNextButton,
    CalendarPrevButton,
} from "./calendar-page-button.tsx";
import { CalendarRoot, RangeCalendarRoot } from "./calendar-root.tsx";
import { CalendarRow } from "./calendar-row.tsx";

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
