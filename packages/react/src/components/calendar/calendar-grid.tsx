import {
    addDays,
    addMonths,
    addYears,
    endOfWeek,
    getDirection,
    startOfWeek,
} from "@poc/dom";
import type { KeyboardEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { CalendarContext, CalendarGridContext } from "./calendar-context.ts";

export interface CalendarGridProps extends PartProps<Record<string, never>> {
    /** Which visible month it shows (default 0). */
    offset?: number;
}

/** One month, as an ARIA grid with the APG date grid keyboard (spec/calendar.md, "Keyboard"). */
export function CalendarGrid({ offset = 0, ...props }: CalendarGridProps) {
    const context = useRequiredContext(CalendarContext, "Calendar.Grid");
    const month = addMonths(context.visibleStart, offset);

    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        const focused = context.focusedDate;
        const rtl = getDirection(event.currentTarget) === "rtl";
        let target = null;
        switch (event.key) {
            case "ArrowRight":
                target = addDays(focused, rtl ? -1 : 1);
                break;
            case "ArrowLeft":
                target = addDays(focused, rtl ? 1 : -1);
                break;
            case "ArrowDown":
                target = addDays(focused, 7);
                break;
            case "ArrowUp":
                target = addDays(focused, -7);
                break;
            case "Home":
                target = startOfWeek(focused, context.firstDay);
                break;
            case "End":
                target = endOfWeek(focused, context.firstDay);
                break;
            case "PageDown":
                target = event.shiftKey
                    ? addYears(focused, 1)
                    : addMonths(focused, 1);
                break;
            case "PageUp":
                target = event.shiftKey
                    ? addYears(focused, -1)
                    : addMonths(focused, -1);
                break;
            case "Enter":
            case " ":
                event.preventDefault();
                context.select(focused);
                return;
            case "Escape":
                if (context.anchor !== null) {
                    event.preventDefault();
                    context.cancelRange();
                }
                return;
            default:
                return;
        }
        event.preventDefault();
        if (context.moveFocus(target)) {
            context.requestFocus();
        }
    };

    return (
        <CalendarGridContext.Provider value={month}>
            {renderElement(
                "table",
                props,
                {},
                {
                    role: "grid",
                    id: context.gridId(offset),
                    "aria-labelledby": context.headingId(offset),
                    "aria-multiselectable":
                        context.mode === "range" ? "true" : undefined,
                    "aria-readonly": context.readOnly ? "true" : undefined,
                    "aria-disabled": context.disabled ? "true" : undefined,
                    "data-calendar-part": "grid",
                    onKeyDown,
                },
            )}
        </CalendarGridContext.Provider>
    );
}
