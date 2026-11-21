import { Component, input, signal, ViewEncapsulation } from "@angular/core";
import { CalendarRoot, type PlainDate } from "@poc/angular";
import { calendar } from "@poc/styles";
import { iso } from "../../kit/iso.ts";
import { MonthView } from "../../kit/month-view.ts";
import { Output } from "../../kit/output.ts";

/** A single-date calendar with the scenario's options (the single, min-max, unavailable, locale and rtl routes). */
@Component({
    selector: "[scenario-single-calendar]",
    encapsulation: ViewEncapsulation.None,
    imports: [CalendarRoot, MonthView, Output],
    template: `
        <div calendarRoot [(value)]="value" [locale]="locale()" [min]="min()" [max]="max()" [isDateUnavailable]="isDateUnavailable()" [class]="styles.root">
            <div monthView></div>
        </div>
        <pre fixtureOutput [values]="{ value: iso(value()) }"></pre>
    `,
})
export class SingleCalendar {
    protected readonly styles = calendar;
    protected readonly iso = iso;
    readonly locale = input.required<string>();
    readonly min = input<PlainDate | undefined>(undefined);
    readonly max = input<PlainDate | undefined>(undefined);
    readonly isDateUnavailable = input<
        ((date: PlainDate) => boolean) | undefined
    >(undefined);
    protected readonly value = signal<PlainDate | null>(null);
}
