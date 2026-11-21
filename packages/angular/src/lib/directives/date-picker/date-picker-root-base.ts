import { computed, Directive, input, output } from "@angular/core";
import type { PlainDate } from "@poc/dom";
import type { OpenChangeEvent } from "../../utils/change-details.ts";
import type { CalendarOptions } from "../calendar/calendar-value.ts";

/** The open state and the calendar options both pickers share; each declares its typed value. */
@Directive()
export abstract class DatePickerRootBase {
    readonly open = input<boolean | undefined>(undefined);
    readonly openChange = output<boolean>();
    readonly defaultOpen = input(false);
    readonly openChangeDetails = output<OpenChangeEvent>();
    readonly min = input<PlainDate | null | undefined>(undefined);
    readonly max = input<PlainDate | null | undefined>(undefined);
    readonly isDateUnavailable = input<
        ((date: PlainDate) => boolean) | undefined
    >(undefined);
    readonly locale = input<string | undefined>(undefined);
    readonly firstDayOfWeek = input<number | undefined>(undefined);
    readonly visibleMonths = input<number | undefined>(undefined);
    protected readonly options = computed<CalendarOptions>(() => ({
        min: this.min(),
        max: this.max(),
        isDateUnavailable: this.isDateUnavailable(),
        locale: this.locale(),
        firstDayOfWeek: this.firstDayOfWeek(),
        visibleMonths: this.visibleMonths(),
    }));
}
