import { monthGrid, type PlainDate, toIsoDate } from "@poc/dom";
import type { ReactNode } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { CalendarContext, CalendarGridContext } from "./calendar-context.ts";
import { CalendarRow } from "./calendar-row.tsx";

export interface CalendarGridBodyProps
    extends Omit<PartProps<Record<string, never>>, "children"> {
    /** Called per week, 6 of them (default: a Row each). */
    children?: (week: PlainDate[]) => ReactNode;
}

export function CalendarGridBody({
    children,
    ...props
}: CalendarGridBodyProps) {
    const context = useRequiredContext(CalendarContext, "Calendar.GridBody");
    const month = useRequiredContext(CalendarGridContext, "Calendar.GridBody");
    const weeks = monthGrid(month.year, month.month, context.firstDay);
    const render =
        children ??
        ((week: PlainDate[]) => (
            <CalendarRow key={toIsoDate(week[0] as PlainDate)} week={week} />
        ));
    return renderElement(
        "tbody",
        { ...props, children: weeks.map(render) },
        {},
        {
            "data-calendar-part": "grid-body",
        },
    );
}
