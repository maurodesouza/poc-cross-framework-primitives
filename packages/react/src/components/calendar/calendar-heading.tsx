import { addMonths, formatMonthYear } from "@poc/dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { CalendarContext } from "./calendar-context.ts";

export interface CalendarHeadingProps extends PartProps<{ month: string }> {
    /** Which visible month it names (default 0). */
    offset?: number;
}

/** The month a grid shows, from `Intl` unless the consumer gives children. */
export function CalendarHeading({
    offset = 0,
    children,
    ...props
}: CalendarHeadingProps) {
    const context = useRequiredContext(CalendarContext, "Calendar.Heading");
    const month = formatMonthYear(
        context.locale,
        addMonths(context.visibleStart, offset),
    );
    return renderElement(
        "h2",
        { ...props, children: children ?? month },
        { month },
        {
            id: context.headingId(offset),
            "aria-live": offset === 0 ? "polite" : undefined,
            "data-calendar-part": "heading",
        },
    );
}
