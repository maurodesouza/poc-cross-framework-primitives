import { addMonths, formatMonthYear } from "@poc/dom";
import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { CalendarContext } from "./calendar-context.ts";

export interface CalendarHeadingProps extends PartProps<{ month: string }> {
    /** Which visible month it names (default 0). */
    offset?: number;
}

/** The month a grid shows, from `Intl` unless the consumer gives children. */
export function CalendarHeading(props: CalendarHeadingProps) {
    const context = useContext(CalendarContext);
    const offset = () => props.offset ?? 0;
    const month = () =>
        formatMonthYear(
            context.locale(),
            addMonths(context.visibleStart(), offset()),
        );
    return renderPart(
        "h2",
        props,
        () => ({ month: month() }),
        () => ({
            id: context.headingId(offset()),
            "aria-live": offset() === 0 ? "polite" : undefined,
            "data-calendar-part": "heading",
        }),
        { omit: ["offset"], children: () => props.children ?? month() },
    );
}
