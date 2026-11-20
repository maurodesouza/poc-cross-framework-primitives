import { monthGrid, type PlainDate, toIsoDate } from "@poc/dom";
import { defineComponent, h, inject } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { CalendarGridKey, CalendarKey } from "./calendar-context.ts";
import { CalendarRow } from "./calendar-row.ts";

/** `tbody`; the default scoped slot gets `{ week }`, 6 of them (default: a Row each). */
export const CalendarGridBody = defineComponent({
    name: "CalendarGridBody",
    inheritAttrs: false,
    props: asProp,
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(CalendarKey, "Calendar.GridBody");
        const month = inject(CalendarGridKey, null);
        return () => {
            const shown = month?.value ?? context.visibleStart.value;
            const weeks = monthGrid(
                shown.year,
                shown.month,
                context.firstDay(),
            );
            return renderPart(
                "tbody",
                { attrs, slots },
                props.as,
                {},
                { "data-calendar-part": "grid-body" },
                () =>
                    weeks.flatMap((week) =>
                        slots.default
                            ? slots.default({ week })
                            : [
                                  h(CalendarRow, {
                                      key: toIsoDate(week[0] as PlainDate),
                                      week,
                                  }),
                              ],
                    ),
            );
        };
    },
});
