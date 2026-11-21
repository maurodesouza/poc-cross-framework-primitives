import { Component, input, signal, ViewEncapsulation } from "@angular/core";
import {
    DatePickerPopup,
    DatePickerPortal,
    DatePickerPositioner,
    DatePickerTrigger,
    type DateRange,
    DateRangePickerRoot,
    RangeCalendarRoot,
} from "@poc/angular";
import { calendar, datePicker } from "@poc/styles";
import { isoRange } from "../../kit/iso.ts";
import { MonthView } from "../../kit/month-view.ts";
import { Output } from "../../kit/output.ts";

@Component({
    selector: "[scenario-date-picker-range]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        DateRangePickerRoot,
        DatePickerTrigger,
        DatePickerPortal,
        DatePickerPositioner,
        DatePickerPopup,
        RangeCalendarRoot,
        MonthView,
        Output,
    ],
    template: `
        <ng-container dateRangePickerRoot [(value)]="value" [locale]="locale()">
            <button datePickerTrigger [class]="styles.trigger">@for (run of ["Choose dates: ", isoRange(value()) ?? "none"]; track $index) {<ng-container>{{ run }}</ng-container>}</button>
            <ng-container *datePickerPortal>
                <div datePickerPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div datePickerPopup [class]="styles.popup">
                        <div rangeCalendarRoot [class]="calendarStyles.root">
                            <div monthView></div>
                        </div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <pre fixtureOutput [values]="{ value: isoRange(value()) }"></pre>
    `,
})
export class DatePickerRange {
    protected readonly styles = datePicker;
    protected readonly calendarStyles = calendar;
    protected readonly isoRange = isoRange;
    readonly locale = input.required<string>();
    protected readonly value = signal<DateRange | null>(null);
}
