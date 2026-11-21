import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { CalendarContext } from "./calendar-context.ts";

function renderPageButton(
    delta: 1 | -1,
    part: "prev-button" | "next-button",
    props: PartProps<{ disabled: boolean }>,
) {
    const context = useContext(CalendarContext);
    const disabled = () => context.disabled() || !context.canPage(delta);
    const grids = () =>
        Array.from({ length: context.visibleMonths() }, (_, offset) =>
            context.gridId(offset),
        ).join(" ");
    return renderPart(
        "button",
        props,
        () => ({ disabled: disabled() }),
        () => ({
            type: "button",
            disabled: disabled(),
            "aria-controls": grids(),
            "data-calendar-part": part,
            ...stateAttributes({ disabled: disabled() }),
            onClick: () => context.page(delta),
        }),
    );
}

/** Shows the previous page of months; the consumer names it. */
export function CalendarPrevButton(props: PartProps<{ disabled: boolean }>) {
    return renderPageButton(-1, "prev-button", props);
}

/** Shows the next page of months; the consumer names it. */
export function CalendarNextButton(props: PartProps<{ disabled: boolean }>) {
    return renderPageButton(1, "next-button", props);
}
