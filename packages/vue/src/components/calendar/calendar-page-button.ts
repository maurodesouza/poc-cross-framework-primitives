import { defineComponent } from "vue";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CalendarKey } from "./calendar-context.ts";

export function definePageButton(
    name: string,
    delta: 1 | -1,
    part: "prev-button" | "next-button",
) {
    return defineComponent({
        name,
        inheritAttrs: false,
        props: asProp,
        setup(props, { attrs, slots }) {
            const context = useRequiredContext(CalendarKey, name);
            return () => {
                context.visibleStart.value;
                const disabled = context.disabled() || !context.canPage(delta);
                const grids = Array.from(
                    { length: context.visibleMonths() },
                    (_, offset) => context.gridId(offset),
                ).join(" ");
                return renderPart(
                    "button",
                    { attrs, slots },
                    props.as,
                    { disabled },
                    {
                        type: "button",
                        disabled,
                        "aria-controls": grids,
                        "data-calendar-part": part,
                        ...stateAttributes({ disabled }),
                        onClick: () => context.page(delta),
                    },
                );
            };
        },
    });
}

/** Shows the previous page of months; the consumer names it. */
export const CalendarPrevButton = definePageButton(
    "CalendarPrevButton",
    -1,
    "prev-button",
);

/** Shows the next page of months; the consumer names it. */
export const CalendarNextButton = definePageButton(
    "CalendarNextButton",
    1,
    "next-button",
);
