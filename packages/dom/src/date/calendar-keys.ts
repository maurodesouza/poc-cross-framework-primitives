import {
    addDays,
    addMonths,
    addYears,
    endOfWeek,
    startOfWeek,
} from "./date-math.ts";
import type { PlainDate } from "./plain-date.ts";

export interface CalendarKeyOptions {
    rtl: boolean;
    firstDayOfWeek: number;
    shiftKey: boolean;
}

/**
 * The date a key moves the focused date to in a calendar grid (spec/calendar.md, "Keyboard", the
 * APG date grid), or `null` when the key does not move it.
 */
export function calendarKeyTarget(
    key: string,
    focused: PlainDate,
    { rtl, firstDayOfWeek, shiftKey }: CalendarKeyOptions,
): PlainDate | null {
    switch (key) {
        case "ArrowRight":
            return addDays(focused, rtl ? -1 : 1);
        case "ArrowLeft":
            return addDays(focused, rtl ? 1 : -1);
        case "ArrowDown":
            return addDays(focused, 7);
        case "ArrowUp":
            return addDays(focused, -7);
        case "Home":
            return startOfWeek(focused, firstDayOfWeek);
        case "End":
            return endOfWeek(focused, firstDayOfWeek);
        case "PageDown":
            return shiftKey ? addYears(focused, 1) : addMonths(focused, 1);
        case "PageUp":
            return shiftKey ? addYears(focused, -1) : addMonths(focused, -1);
        default:
            return null;
    }
}
