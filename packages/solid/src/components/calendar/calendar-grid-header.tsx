import { type Weekday, weekdays } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { For, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { CalendarContext } from "./calendar-context.ts";
import { CalendarHeaderCell } from "./calendar-header-cell.tsx";

export interface CalendarGridHeaderProps
    extends Omit<PartProps<Record<string, never>>, "children"> {
    /** Called per weekday, in the locale's order (default: a HeaderCell each). */
    children?: (weekday: Weekday) => JSX.Element;
}

export function CalendarGridHeader(props: CalendarGridHeaderProps) {
    const context = useContext(CalendarContext);
    const days = () => weekdays(context.locale(), context.firstDay());
    return renderPart(
        "thead",
        props as PartProps<Record<string, never>>,
        () => ({}),
        () => ({ "data-calendar-part": "grid-header" }),
        {
            children: () => (
                <tr>
                    <For each={days()}>
                        {(weekday) =>
                            props.children ? (
                                props.children(weekday)
                            ) : (
                                <CalendarHeaderCell weekday={weekday} />
                            )
                        }
                    </For>
                </tr>
            ),
        },
    );
}
