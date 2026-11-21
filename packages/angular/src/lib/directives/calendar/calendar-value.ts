import type { DateRange, PlainDate } from "@poc/dom";

/** What a calendar holds: one date (Calendar) or a range (RangeCalendar). */
export type CalendarMode = "single" | "range";
export type CalendarValue = PlainDate | DateRange | null;

export interface CalendarOptions {
    min?: PlainDate | null;
    max?: PlainDate | null;
    isDateUnavailable?: (date: PlainDate) => boolean;
    locale?: string;
    firstDayOfWeek?: number;
    visibleMonths?: number;
}

export function isRange(value: CalendarValue): value is DateRange {
    return value !== null && "start" in value;
}
