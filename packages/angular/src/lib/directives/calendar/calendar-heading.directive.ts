import {
    computed,
    Directive,
    inject,
    input,
    numberAttribute,
} from "@angular/core";
import { addMonths, formatMonthYear } from "@poc/dom";
import { CALENDAR } from "./calendar-state.ts";

/**
 * The month a grid shows: `<h2 calendarHeading #heading="calendarHeading">{{ heading.month() }}</h2>`
 * (from `Intl`, unless the consumer writes its own content).
 */
@Directive({
    selector: "[calendarHeading]",
    exportAs: "calendarHeading",
    host: {
        "data-calendar-part": "heading",
        "[attr.id]": "calendar.headingId(offset())",
        "[attr.aria-live]": "offset() === 0 ? 'polite' : null",
    },
})
export class CalendarHeading {
    protected readonly calendar = inject(CALENDAR);
    /** Which visible month it names (default 0). */
    readonly offset = input(0, { transform: numberAttribute });
    readonly month = computed(() =>
        formatMonthYear(
            this.calendar.locale(),
            addMonths(this.calendar.visibleStart(), this.offset()),
        ),
    );
}
