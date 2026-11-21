import {
    Directive,
    forwardRef,
    inject,
    input,
    type ModelSignal,
    model,
    output,
} from "@angular/core";
import type { PlainDate } from "@poc/dom";
import type { ValueChangeEvent } from "../../utils/change-details.ts";
import { CalendarRootBase } from "./calendar-root-base.ts";
import { CALENDAR, CalendarState } from "./calendar-state.ts";
import type { CalendarValue } from "./calendar-value.ts";

/**
 * One date (spec/calendar.md): `<div calendarRoot [(value)]="date">`. Inside a DatePicker with no
 * value of its own, it binds to it.
 */
@Directive({
    selector: "[calendarRoot]",
    exportAs: "calendarRoot",
    providers: [
        {
            provide: CALENDAR,
            useFactory: () => inject(forwardRef(() => CalendarRoot)).calendar,
        },
    ],
})
export class CalendarRoot extends CalendarRootBase {
    readonly value = model<PlainDate | null | undefined>(undefined);
    readonly defaultValue = input<PlainDate | null | undefined>(undefined);
    readonly valueChangeDetails = output<ValueChangeEvent<PlainDate | null>>();
    readonly calendar = new CalendarState(
        "single",
        this.stateInputs(
            this.value as unknown as ModelSignal<CalendarValue | undefined>,
            this.defaultValue,
        ),
        (value, details) =>
            this.valueChangeDetails.emit({
                value: value as PlainDate | null,
                details,
            }),
    );
}
