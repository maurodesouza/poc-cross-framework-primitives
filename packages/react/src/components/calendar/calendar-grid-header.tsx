import { type Weekday, weekdays } from "@poc/dom";
import type { ReactNode } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { CalendarContext } from "./calendar-context.ts";
import { CalendarHeaderCell } from "./calendar-header-cell.tsx";

export interface CalendarGridHeaderProps
    extends Omit<PartProps<Record<string, never>>, "children"> {
    /** Called per weekday, in the locale's order (default: a HeaderCell each). */
    children?: (weekday: Weekday) => ReactNode;
}

export function CalendarGridHeader({
    children,
    ...props
}: CalendarGridHeaderProps) {
    const context = useRequiredContext(CalendarContext, "Calendar.GridHeader");
    const days = weekdays(context.locale, context.firstDay);
    const render =
        children ??
        ((weekday: Weekday) => (
            <CalendarHeaderCell key={weekday.index} weekday={weekday} />
        ));
    return renderElement(
        "thead",
        { ...props, children: <tr>{days.map(render)}</tr> },
        {},
        {
            "data-calendar-part": "grid-header",
        },
    );
}
