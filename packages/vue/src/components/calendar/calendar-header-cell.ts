import type { Weekday } from "@poc/dom";
import { defineComponent, type PropType } from "vue";
import { asProp, renderPart } from "../../utils/render-part.ts";

/** One weekday: its short name, the long one as `abbr`. */
export const CalendarHeaderCell = defineComponent({
    name: "CalendarHeaderCell",
    inheritAttrs: false,
    props: {
        ...asProp,
        weekday: { type: Object as PropType<Weekday>, required: true },
    },
    setup(props, { attrs, slots }) {
        return () =>
            renderPart(
                "th",
                { attrs, slots },
                props.as,
                { weekday: props.weekday },
                {
                    scope: "col",
                    abbr: props.weekday.long,
                    "data-calendar-part": "header-cell",
                },
                () =>
                    slots.default?.({ weekday: props.weekday }) ??
                    props.weekday.short,
            );
    },
});
