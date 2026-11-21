import { Directive } from "@angular/core";
import { pageButton } from "./calendar-page-button.ts";

/** Shows the next page of months; the consumer names it: `<button calendarNextButton>`. */
@Directive({
    selector: "[calendarNextButton]",
    exportAs: "calendarNextButton",
    host: {
        type: "button",
        "data-calendar-part": "next-button",
        "[attr.disabled]": "button.data().disabled",
        "[attr.data-disabled]": "button.data().disabled",
        "[attr.aria-controls]": "button.controls()",
        "(click)": "button.press()",
    },
})
export class CalendarNextButton {
    protected readonly button = pageButton(1);
}
