import { addMonths, calendarKeyTarget, getDirection } from "@poc/dom";
import { createMemo, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { CalendarContext, CalendarGridContext } from "./calendar-context.ts";

export interface CalendarGridProps extends PartProps<Record<string, never>> {
    /** Which visible month it shows (default 0). */
    offset?: number;
}

/** One month, as an ARIA grid with the APG date grid keyboard (spec/calendar.md, "Keyboard"). */
export function CalendarGrid(props: CalendarGridProps) {
    const context = useContext(CalendarContext);
    const offset = () => props.offset ?? 0;
    const month = createMemo(() => addMonths(context.visibleStart(), offset()));

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            context.select(context.focusedDate());
            return;
        }
        if (event.key === "Escape") {
            if (context.anchor() !== null) {
                event.preventDefault();
                context.cancelRange();
            }
            return;
        }
        const target = calendarKeyTarget(event.key, context.focusedDate(), {
            rtl: getDirection(event.currentTarget as HTMLElement) === "rtl",
            firstDayOfWeek: context.firstDay(),
            shiftKey: event.shiftKey,
        });
        if (target === null) {
            return;
        }
        event.preventDefault();
        if (context.moveFocus(target)) {
            context.requestFocus();
        }
    };

    return (
        <CalendarGridContext value={month}>
            {renderPart(
                "table",
                props,
                () => ({}),
                () => ({
                    role: "grid",
                    id: context.gridId(offset()),
                    "aria-labelledby": context.headingId(offset()),
                    "aria-multiselectable":
                        context.mode === "range" ? "true" : undefined,
                    "aria-readonly": context.readOnly() ? "true" : undefined,
                    "aria-disabled": context.disabled() ? "true" : undefined,
                    "data-calendar-part": "grid",
                    onKeyDown,
                }),
                { omit: ["offset"] },
            )}
        </CalendarGridContext>
    );
}
