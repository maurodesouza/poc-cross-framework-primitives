import { type PlainDate, toIsoDate } from "@poc/dom";
import type { ReactNode } from "react";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { CalendarCell } from "./calendar-cell.tsx";

export interface CalendarRowProps
    extends Omit<PartProps<Record<string, never>>, "children"> {
    week: PlainDate[];
    /** Called per date (default: a Cell each). */
    children?: (date: PlainDate) => ReactNode;
}

export function CalendarRow({ week, children, ...props }: CalendarRowProps) {
    const render =
        children ??
        ((date: PlainDate) => (
            <CalendarCell key={toIsoDate(date)} date={date} />
        ));
    return renderElement(
        "tr",
        { ...props, children: week.map(render) },
        {},
        {
            "data-calendar-part": "row",
        },
    );
}
