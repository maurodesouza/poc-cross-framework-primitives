import {
    formatDayNumber,
    formatFullDate,
    type PlainDate,
    toIsoDate,
} from "@poc/dom";
import { createEffect, createMemo, createSignal, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    CalendarContext,
    CalendarGridContext,
    type CellState,
} from "./calendar-context.ts";

export interface CalendarCellProps extends PartProps<CellState> {
    date: PlainDate;
}

/** One date. Its name and content come from `Intl` (spec/calendar.md, the locale exception). */
export function CalendarCell(props: CalendarCellProps) {
    const context = useContext(CalendarContext);
    const month = useContext(CalendarGridContext);
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    const state = createMemo(() => context.cellState(props.date, month()));
    createEffect(
        () => ({
            node: element(),
            key: toIsoDate(props.date),
            outsideMonth: state().outsideMonth,
            focused: state().focused,
            canFocus: context.canTakeFocus(),
        }),
        ({ node, key, outsideMonth, focused, canFocus }) => {
            if (node === null || outsideMonth) {
                return undefined;
            }
            context.cells.set(key, node);
            // a cell of a month just shown mounts after the keyboard moved the focus to it
            if (context.focusPending.current && focused && canFocus) {
                context.focusPending.current = false;
                node.focus({ preventScroll: true });
            }
            return () => {
                if (context.cells.get(key) === node) {
                    context.cells.delete(key);
                }
            };
        },
    );

    return renderPart(
        "td",
        props,
        state,
        () => {
            const current = state();
            const choosable = !current.outsideMonth;
            return {
                "aria-label": formatFullDate(context.locale(), props.date),
                role: "gridcell",
                tabindex: current.outsideMonth
                    ? undefined
                    : current.focused
                      ? 0
                      : -1,
                "aria-selected": current.selected ? "true" : undefined,
                "aria-disabled":
                    current.disabled ||
                    current.unavailable ||
                    current.outsideMonth
                        ? "true"
                        : undefined,
                "aria-current": current.today ? "date" : undefined,
                "data-calendar-part": "cell",
                ...stateAttributes({
                    today: current.today,
                    selected: current.selected,
                    disabled: current.disabled,
                    unavailable: current.unavailable,
                    "outside-month": current.outsideMonth,
                    "range-start": current.rangeStart,
                    "range-end": current.rangeEnd,
                    "in-range": current.inRange,
                    "range-preview": current.rangePreview,
                }),
                onClick: () => {
                    if (choosable && !current.disabled) {
                        context.select(props.date);
                        context.requestFocus();
                    }
                },
                onPointerEnter: () => {
                    if (context.anchor() !== null && choosable) {
                        context.setHovered(props.date);
                    }
                },
                onFocus: () => {
                    if (choosable && !state().focused) {
                        context.moveFocus(props.date);
                    }
                },
            };
        },
        {
            ref: (node) => setElement(node),
            omit: ["date"],
            children: () =>
                props.children ?? formatDayNumber(context.locale(), props.date),
        },
    );
}
