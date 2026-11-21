import { Component, input, signal, ViewEncapsulation } from "@angular/core";
import {
    CalendarRoot,
    DatePickerPopup,
    DatePickerPortal,
    DatePickerPositioner,
    DatePickerRoot,
    DatePickerTrigger,
    type PlainDate,
} from "@poc/angular";
import { calendar, datePicker } from "@poc/styles";
import { iso } from "../../kit/iso.ts";
import { MonthView } from "../../kit/month-view.ts";
import { Output } from "../../kit/output.ts";

/** The trigger's text is two text nodes, as JSX makes `Choose date: {iso(value) ?? "none"}`. */
@Component({
    selector: "[scenario-date-picker-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        DatePickerRoot,
        DatePickerTrigger,
        DatePickerPortal,
        DatePickerPositioner,
        DatePickerPopup,
        CalendarRoot,
        MonthView,
        Output,
    ],
    template: `
        <ng-container datePickerRoot [(value)]="value" [(open)]="open" (openChangeDetails)="reason.set($event.details.reason)" [locale]="locale()">
            <button datePickerTrigger [class]="styles.trigger">@for (run of ["Choose date: ", iso(value()) ?? "none"]; track $index) {<ng-container>{{ run }}</ng-container>}</button>
            <ng-container *datePickerPortal>
                <div datePickerPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div datePickerPopup [class]="styles.popup">
                        <div calendarRoot [class]="calendarStyles.root">
                            <div monthView></div>
                        </div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <pre fixtureOutput [values]="{ value: iso(value()), open: open(), reason: reason() }"></pre>
    `,
})
export class DatePickerBasic {
    protected readonly styles = datePicker;
    protected readonly calendarStyles = calendar;
    protected readonly iso = iso;
    readonly locale = input.required<string>();
    protected readonly value = signal<PlainDate | null>(null);
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);
}
