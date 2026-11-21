import { computed, inject, type Signal } from "@angular/core";
import type { PlainDate } from "@poc/dom";
import {
    CALENDAR,
    type CalendarState,
} from "../directives/calendar/calendar-state.ts";
import type { CalendarValue } from "../directives/calendar/calendar-value.ts";

/**
 * The part hook of the enclosing `[calendarRoot]` or `[rangeCalendarRoot]`: its value, focused
 * date and first visible month, and `select` / `page` (a custom cell or header uses them).
 */
export function injectCalendar(): {
    state: Signal<{
        value: CalendarValue;
        focusedDate: PlainDate;
        visibleStart: PlainDate;
    }>;
    select: CalendarState["select"];
    page: CalendarState["page"];
} {
    const calendar = inject(CALENDAR, { optional: true });
    if (calendar === null) {
        throw new Error(
            "injectCalendar() must be used inside [calendarRoot] or [rangeCalendarRoot]",
        );
    }
    return {
        state: computed(() => ({
            value: calendar.value(),
            focusedDate: calendar.focusedDate(),
            visibleStart: calendar.visibleStart(),
        })),
        select: (date) => calendar.select(date),
        page: (delta) => calendar.page(delta),
    };
}
