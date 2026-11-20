import { addMonths, formatMonthYear } from "@poc/dom";
import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { CalendarKey } from "./calendar-context.ts";

/** The month a grid shows, from `Intl` unless the default slot gives content. */
export const CalendarHeading = defineComponent({
    name: "CalendarHeading",
    inheritAttrs: false,
    props: { ...asProp, offset: { type: Number, default: 0 } },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(CalendarKey, "Calendar.Heading");
        return () => {
            const month = formatMonthYear(
                context.locale(),
                addMonths(context.visibleStart.value, props.offset),
            );
            return renderPart(
                "h2",
                { attrs, slots },
                props.as,
                { month },
                {
                    id: context.headingId(props.offset),
                    "aria-live": props.offset === 0 ? "polite" : undefined,
                    "data-calendar-part": "heading",
                },
                () => slots.default?.({ month }) ?? month,
            );
        };
    },
});
