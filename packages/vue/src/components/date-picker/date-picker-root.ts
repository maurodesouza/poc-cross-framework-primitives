import type { Align, PlainDate, Side } from "@poc/dom";
import { computed, defineComponent, type PropType, provide, ref } from "vue";
import { useControllable } from "../../composables/use-controllable.ts";
import {
    overlayRootEmits,
    overlayRootProps,
    useOverlayRoot,
} from "../../composables/use-overlay-root.ts";
import type { ChangeDetails } from "../../utils/change-details.ts";
import type {
    CalendarMode,
    CalendarValue,
} from "../calendar/calendar-value.ts";
import { DatePickerKey } from "./date-picker-context.ts";

function definePickerRoot(name: string, mode: CalendarMode) {
    return defineComponent({
        name,
        props: {
            ...overlayRootProps,
            value: {
                type: Object as PropType<CalendarValue>,
                default: undefined,
            },
            defaultValue: {
                type: Object as PropType<CalendarValue>,
                default: null,
            },
            min: {
                type: Object as PropType<PlainDate | null>,
                default: undefined,
            },
            max: {
                type: Object as PropType<PlainDate | null>,
                default: undefined,
            },
            isDateUnavailable: {
                type: Function as PropType<(date: PlainDate) => boolean>,
                default: undefined,
            },
            locale: { type: String, default: undefined },
            firstDayOfWeek: { type: Number, default: undefined },
            visibleMonths: { type: Number, default: undefined },
        },
        emits: {
            ...overlayRootEmits,
            "update:value": (_value: CalendarValue) => true,
            valueChange: (_value: CalendarValue, _details: ChangeDetails) =>
                true,
        },
        setup(props, { emit, slots }) {
            const root = useOverlayRoot(props, emit);
            const value = useControllable<CalendarValue, ChangeDetails>(
                () => props.value,
                props.defaultValue ?? null,
                (next, details) => {
                    emit("update:value", next);
                    emit("valueChange", next, details);
                },
            );
            provide(DatePickerKey, {
                ...root,
                mode,
                value: computed(() => value.value.value),
                choose(next) {
                    value.set(next, { reason: "item-press" });
                    root.setOpen(false, "item-press");
                },
                options: () => ({
                    min: props.min,
                    max: props.max,
                    isDateUnavailable: props.isDateUnavailable,
                    locale: props.locale,
                    firstDayOfWeek: props.firstDayOfWeek,
                    visibleMonths: props.visibleMonths,
                }),
                placed: ref<{ side: Side; align: Align }>({
                    side: "bottom",
                    align: "start",
                }),
            });
            return () => slots.default?.();
        },
    });
}

/** A trigger and a popover holding a bound `Calendar.Root` (spec/calendar.md). */
export const DatePickerRoot = definePickerRoot("DatePickerRoot", "single");

/** A trigger and a popover holding a bound `RangeCalendar.Root` (spec/calendar.md). */
export const DateRangePickerRoot = definePickerRoot(
    "DateRangePickerRoot",
    "range",
);
