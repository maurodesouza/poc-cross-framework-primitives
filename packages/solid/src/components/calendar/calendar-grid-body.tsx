import { monthGrid, type PlainDate } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { createMemo, For, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { CalendarContext, CalendarGridContext } from "./calendar-context.ts";
import { CalendarRow } from "./calendar-row.tsx";

export interface CalendarGridBodyProps
    extends Omit<PartProps<Record<string, never>>, "children"> {
    /** Called per week, 6 of them (default: a Row each). */
    children?: (week: PlainDate[]) => JSX.Element;
}

export function CalendarGridBody(props: CalendarGridBodyProps) {
    const context = useContext(CalendarContext);
    const month = useContext(CalendarGridContext);
    const weeks = createMemo(() =>
        monthGrid(month().year, month().month, context.firstDay()),
    );
    return renderPart(
        "tbody",
        props as PartProps<Record<string, never>>,
        () => ({}),
        () => ({ "data-calendar-part": "grid-body" }),
        {
            children: () => (
                <For each={weeks()}>
                    {(week) =>
                        props.children ? (
                            props.children(week)
                        ) : (
                            <CalendarRow week={week} />
                        )
                    }
                </For>
            ),
        },
    );
}
