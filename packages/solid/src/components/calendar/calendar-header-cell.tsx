import type { Weekday } from "@poc/dom";
import { type PartProps, renderPart } from "../../utils/part.tsx";

export interface CalendarHeaderCellProps
    extends PartProps<{ weekday: Weekday }> {
    weekday: Weekday;
}

/** One weekday: its short name, the long one as `abbr`. */
export function CalendarHeaderCell(props: CalendarHeaderCellProps) {
    return renderPart(
        "th",
        props,
        () => ({ weekday: props.weekday }),
        () => ({
            scope: "col",
            abbr: props.weekday.long,
            "data-calendar-part": "header-cell",
        }),
        {
            omit: ["weekday"],
            children: () => props.children ?? props.weekday.short,
        },
    );
}
