import { type PlainDate, toIsoDate } from "@poc/dom";
import { defineComponent, nextTick, type PropType, provide, watch } from "vue";
import type { ChangeDetails } from "../../utils/change-details.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CalendarKey } from "./calendar-context.ts";
import type { CalendarMode, CalendarValue } from "./calendar-value.ts";
import { useCalendar } from "./use-calendar.ts";

const calendarProps = {
    ...asProp,
    value: { type: Object as PropType<CalendarValue>, default: undefined },
    defaultValue: {
        type: Object as PropType<CalendarValue>,
        default: undefined,
    },
    min: { type: Object as PropType<PlainDate | null>, default: undefined },
    max: { type: Object as PropType<PlainDate | null>, default: undefined },
    isDateUnavailable: {
        type: Function as PropType<(date: PlainDate) => boolean>,
        default: undefined,
    },
    locale: { type: String, default: undefined },
    firstDayOfWeek: { type: Number, default: undefined },
    visibleMonths: { type: Number, default: undefined },
    disabled: { type: Boolean, default: undefined },
    readOnly: { type: Boolean, default: undefined },
};

const calendarEmits = {
    "update:value": (_value: CalendarValue) => true,
    valueChange: (_value: CalendarValue, _details: ChangeDetails) => true,
};

function defineCalendarRoot(name: string, mode: CalendarMode) {
    return defineComponent({
        name,
        inheritAttrs: false,
        props: calendarProps,
        emits: calendarEmits,
        setup(props, { attrs, slots, emit }) {
            const { context } = useCalendar(mode, props, (next, details) => {
                emit("update:value", next);
                emit("valueChange", next, details);
            });
            provide(CalendarKey, context);
            // after a render while a focus is pending (a cell that mounts later takes it itself)
            watch(
                () =>
                    [
                        context.focusedDate.value,
                        context.visibleStart.value,
                    ] as const,
                () => {
                    void nextTick().then(() => {
                        if (!context.focusPending.current) {
                            return;
                        }
                        const cell = context.cells.get(
                            toIsoDate(context.focusedDate.value),
                        );
                        if (cell) {
                            context.focusPending.current = false;
                            cell.focus({ preventScroll: true });
                        }
                    });
                },
                { flush: "post", immediate: true },
            );
            return () => {
                const disabled = context.disabled();
                const readOnly = context.readOnly();
                return renderPart(
                    "div",
                    { attrs, slots },
                    props.as,
                    { disabled, readOnly },
                    {
                        "data-calendar-part": "root",
                        ...stateAttributes({ disabled, readonly: readOnly }),
                    },
                );
            };
        },
    });
}

/** One date (spec/calendar.md, `v-model:value`). Inside a DatePicker with no value of its own, it binds to it. */
export const CalendarRoot = defineCalendarRoot("CalendarRoot", "single");

/** A range of dates (spec/calendar.md). Inside a DateRangePicker, it binds to it. */
export const RangeCalendarRoot = defineCalendarRoot(
    "RangeCalendarRoot",
    "range",
);
