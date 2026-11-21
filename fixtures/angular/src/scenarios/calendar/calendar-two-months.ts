import { Component, input, ViewEncapsulation } from "@angular/core";
import { CalendarRoot } from "@poc/angular";
import { calendar } from "@poc/styles";
import { MonthView } from "../../kit/month-view.ts";

@Component({
    selector: "[scenario-calendar-two-months]",
    encapsulation: ViewEncapsulation.None,
    imports: [CalendarRoot, MonthView],
    template: `
        <div calendarRoot [locale]="locale()" [visibleMonths]="2" [class]="styles.root">
            <div class="flex gap-6">
                <div monthView></div>
                <div monthView [offset]="1" [withButtons]="false"></div>
            </div>
        </div>
    `,
})
export class CalendarTwoMonths {
    protected readonly styles = calendar;
    readonly locale = input.required<string>();
}
