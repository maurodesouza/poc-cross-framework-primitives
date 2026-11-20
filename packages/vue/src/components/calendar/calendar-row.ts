import { type PlainDate, toIsoDate } from "@poc/dom";
import { defineComponent, h, type PropType } from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { CalendarCell } from "./calendar-cell.ts";

/** One week; the default scoped slot gets `{ date }` (default: a Cell each). */
export const CalendarRow = defineComponent({
    name: "CalendarRow",
    inheritAttrs: false,
    props: {
        ...asProp,
        week: { type: Array as PropType<PlainDate[]>, required: true },
    },
    setup(props, { attrs, slots }) {
        return () =>
            renderPart(
                "tr",
                { attrs, slots },
                props.as,
                {},
                { "data-calendar-part": "row" },
                () =>
                    props.week.flatMap((date) =>
                        slots.default
                            ? slots.default({ date })
                            : [h(CalendarCell, { key: toIsoDate(date), date })],
                    ),
            );
    },
});
