import { weekdays } from "@poc/dom";
import { defineComponent, h } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { CalendarKey } from "./calendar-context.ts";
import { CalendarHeaderCell } from "./calendar-header-cell.ts";

/** `thead` with one row; the default scoped slot gets `{ weekday }` (default: a HeaderCell each). */
export const CalendarGridHeader = defineComponent({
    name: "CalendarGridHeader",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(CalendarKey, "Calendar.GridHeader");
        return () => {
            const days = weekdays(context.locale(), context.firstDay());
            return renderPart(
                "thead",
                { attrs, slots },
                props.as,
                {},
                { "data-calendar-part": "grid-header" },
                () =>
                    h(
                        "tr",
                        days.flatMap((weekday) =>
                            slots.default
                                ? slots.default({ weekday })
                                : [
                                      h(CalendarHeaderCell, {
                                          key: weekday.index,
                                          weekday,
                                      }),
                                  ],
                        ),
                    ),
            );
        };
    },
});
