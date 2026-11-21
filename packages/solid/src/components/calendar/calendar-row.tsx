import type { PlainDate } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { For } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { CalendarCell } from "./calendar-cell.tsx";

export interface CalendarRowProps
    extends Omit<PartProps<Record<string, never>>, "children"> {
    week: PlainDate[];
    /** Called per date (default: a Cell each). */
    children?: (date: PlainDate) => JSX.Element;
}

export function CalendarRow(props: CalendarRowProps) {
    return renderPart(
        "tr",
        props as PartProps<Record<string, never>>,
        () => ({}),
        () => ({ "data-calendar-part": "row" }),
        {
            omit: ["week"],
            children: () => (
                <For each={props.week}>
                    {(date) =>
                        props.children ? (
                            props.children(date)
                        ) : (
                            <CalendarCell date={date} />
                        )
                    }
                </For>
            ),
        },
    );
}
