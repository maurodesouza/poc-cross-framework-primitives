import { Component, input, signal, ViewEncapsulation } from "@angular/core";
import { type DateRange, RangeCalendarRoot } from "@poc/angular";
import { calendar } from "@poc/styles";
import { isoRange } from "../../kit/iso.ts";
import { MonthView } from "../../kit/month-view.ts";
import { Output } from "../../kit/output.ts";

@Component({
    selector: "[scenario-calendar-range]",
    encapsulation: ViewEncapsulation.None,
    imports: [RangeCalendarRoot, MonthView, Output],
    template: `
        <div rangeCalendarRoot [(value)]="value" [locale]="locale()" [class]="styles.root">
            <div monthView></div>
        </div>
        <pre fixtureOutput [values]="{ value: isoRange(value()) }"></pre>
    `,
})
export class CalendarRange {
    protected readonly styles = calendar;
    protected readonly isoRange = isoRange;
    readonly locale = input.required<string>();
    protected readonly value = signal<DateRange | null>(null);
}
