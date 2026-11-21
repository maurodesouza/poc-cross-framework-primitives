import { Directive, input } from "@angular/core";
import type { Weekday } from "@poc/dom";

/** One weekday: `<th calendarHeaderCell [weekday]="weekday">{{ weekday.short }}</th>` (its long name as `abbr`). */
@Directive({
    selector: "[calendarHeaderCell]",
    exportAs: "calendarHeaderCell",
    host: {
        scope: "col",
        "data-calendar-part": "header-cell",
        "[attr.abbr]": "weekday().long",
    },
})
export class CalendarHeaderCell {
    readonly weekday = input.required<Weekday>();
}
