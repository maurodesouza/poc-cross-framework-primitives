import {
    booleanAttribute,
    computed,
    Directive,
    input,
    numberAttribute,
} from "@angular/core";
import type { PlainDate } from "@poc/dom";
import { dataValues } from "../../utils/state-attributes.ts";
import type { CalendarInputs } from "./calendar-state.ts";

/**
 * The inputs and the root element both calendar roots share (spec/calendar.md). Each root
 * declares its own typed `value` model and creates the state after it.
 */
@Directive({
    host: {
        "data-calendar-part": "root",
        "[attr.data-disabled]": "data().disabled",
        "[attr.data-readonly]": "data().readonly",
    },
})
export abstract class CalendarRootBase {
    readonly min = input<PlainDate | null | undefined>(undefined);
    readonly max = input<PlainDate | null | undefined>(undefined);
    /** Unavailable dates can be focused but not chosen. */
    readonly isDateUnavailable = input<
        ((date: PlainDate) => boolean) | undefined
    >(undefined);
    /** A BCP 47 tag (default: the document's `lang`, then the browser's). */
    readonly locale = input<string | undefined>(undefined);
    readonly firstDayOfWeek = input<number | undefined, unknown>(undefined, {
        transform: (value: unknown) =>
            value === undefined ? undefined : numberAttribute(value),
    });
    readonly visibleMonths = input<number | undefined, unknown>(undefined, {
        transform: (value: unknown) =>
            value === undefined ? undefined : numberAttribute(value),
    });
    readonly disabled = input(false, { transform: booleanAttribute });
    readonly readOnly = input(false, { transform: booleanAttribute });
    protected readonly data = computed(() =>
        dataValues({ disabled: this.disabled(), readonly: this.readOnly() }),
    );

    /** The inputs the state reads, with the root's own value model. */
    protected stateInputs(
        value: CalendarInputs["value"],
        defaultValue: CalendarInputs["defaultValue"],
    ): CalendarInputs {
        return {
            value,
            defaultValue,
            min: this.min,
            max: this.max,
            isDateUnavailable: this.isDateUnavailable,
            locale: this.locale,
            firstDayOfWeek: this.firstDayOfWeek,
            visibleMonths: this.visibleMonths,
            disabled: this.disabled,
            readOnly: this.readOnly,
        };
    }
}
