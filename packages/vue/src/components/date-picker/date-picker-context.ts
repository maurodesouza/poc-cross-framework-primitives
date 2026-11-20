import type { Align, Side } from "@poc/dom";
import type { InjectionKey, Ref } from "vue";
import type { OverlayRoot } from "../../composables/use-overlay-root.ts";
import type {
    CalendarMode,
    CalendarOptions,
    CalendarValue,
} from "../calendar/calendar-value.ts";

export interface DatePickerContext extends OverlayRoot {
    mode: CalendarMode;
    value: Ref<CalendarValue>;
    /** Sets the value and closes the popup (reason `item-press`). */
    choose: (value: CalendarValue) => void;
    options: () => CalendarOptions;
    placed: Ref<{ side: Side; align: Align }>;
}

export const DatePickerKey: InjectionKey<DatePickerContext> =
    Symbol("DatePicker");
