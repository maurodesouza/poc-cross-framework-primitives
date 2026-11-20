import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CalendarContext } from "./calendar-context.ts";

function usePageButton(
    delta: 1 | -1,
    part: "prev-button" | "next-button",
    props: PartProps<{ disabled: boolean }>,
) {
    const context = useRequiredContext(
        CalendarContext,
        `Calendar.${part === "prev-button" ? "PrevButton" : "NextButton"}`,
    );
    const disabled = context.disabled || !context.canPage(delta);
    const grids = Array.from({ length: context.visibleMonths }, (_, offset) =>
        context.gridId(offset),
    ).join(" ");
    return renderElement(
        "button",
        props,
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
}

/** Shows the previous page of months; the consumer names it. */
export function CalendarPrevButton(props: PartProps<{ disabled: boolean }>) {
    return usePageButton(-1, "prev-button", props);
}

/** Shows the next page of months; the consumer names it. */
export function CalendarNextButton(props: PartProps<{ disabled: boolean }>) {
    return usePageButton(1, "next-button", props);
}
