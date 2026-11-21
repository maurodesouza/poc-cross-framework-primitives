import { Directive } from "@angular/core";

/** One week: `<tr calendarRow>`. */
@Directive({
    selector: "[calendarRow]",
    host: { "data-calendar-part": "row" },
})
export class CalendarRow {}
