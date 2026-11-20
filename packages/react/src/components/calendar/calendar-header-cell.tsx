import type { Weekday } from "@poc/dom";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";

export interface CalendarHeaderCellProps
    extends PartProps<{ weekday: Weekday }> {
    weekday: Weekday;
}

/** One weekday: its short name, the long one as `abbr`. */
export function CalendarHeaderCell({
    weekday,
    children,
    ...props
}: CalendarHeaderCellProps) {
    return renderElement(
        "th",
        { ...props, children: children ?? weekday.short },
        { weekday },
        {
            scope: "col",
            abbr: weekday.long,
            "data-calendar-part": "header-cell",
        },
    );
}
