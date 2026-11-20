import { addMonths, calendarKeyTarget, getDirection } from "@poc/dom";
import { computed, defineComponent, provide } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { CalendarGridKey, CalendarKey } from "./calendar-context.ts";

/** One month, as an ARIA grid with the APG date grid keyboard (spec/calendar.md, "Keyboard"). */
export const CalendarGrid = defineComponent({
    name: "CalendarGrid",
    inheritAttrs: false,
    props: { ...asProp, offset: { type: Number, default: 0 } },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(CalendarKey, "Calendar.Grid");
        const month = computed(() =>
            addMonths(context.visibleStart.value, props.offset),
        );
        provide(CalendarGridKey, month);
        const onKeydown = (event: KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                context.select(context.focusedDate.value);
                return;
            }
            if (event.key === "Escape") {
                if (context.anchor.value !== null) {
                    event.preventDefault();
                    context.cancelRange();
                }
                return;
            }
            const target = calendarKeyTarget(
                event.key,
                context.focusedDate.value,
                {
                    rtl: getDirection(event.currentTarget as Element) === "rtl",
                    firstDayOfWeek: context.firstDay(),
                    shiftKey: event.shiftKey,
                },
            );
            if (target === null) {
                return;
            }
            event.preventDefault();
            if (context.moveFocus(target)) {
                context.requestFocus();
            }
        };
        return () =>
            renderPart(
                "table",
                { attrs, slots },
                props.as,
                {},
                {
                    role: "grid",
                    id: context.gridId(props.offset),
                    "aria-labelledby": context.headingId(props.offset),
                    "aria-multiselectable":
                        context.mode === "range" ? "true" : undefined,
                    "aria-readonly": context.readOnly() ? "true" : undefined,
                    "aria-disabled": context.disabled() ? "true" : undefined,
                    "data-calendar-part": "grid",
                    onKeydown,
                },
            );
    },
});
