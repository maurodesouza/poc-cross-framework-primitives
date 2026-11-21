<script lang="ts">
import {
    formatDayNumber,
    formatFullDate,
    type PlainDate,
    toIsoDate,
} from "@poc/dom";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    CalendarContext,
    CalendarGridContext,
    type CellState,
} from "./calendar-context.svelte.ts";

/** One date. Its name and content come from `Intl` (spec/calendar.md, the locale exception). */
let {
    child,
    children,
    date,
    ...rest
}: PartProps<CellState> & { date: PlainDate } = $props();
const calendar = CalendarContext.use("Calendar.Cell");
const month = CalendarGridContext.maybe();
let element = $state<HTMLElement | null>(null);
const ref = elementRef((node) => (element = node));
const cell = $derived(
    calendar.cellState(date, month?.() ?? calendar.visibleStart),
);
$effect(() => {
    const node = element;
    const key = toIsoDate(date);
    const { outsideMonth, focused } = cell;
    if (node === null || outsideMonth) {
        return undefined;
    }
    calendar.cells.set(key, node);
    // a cell of a month just shown mounts after the keyboard moved the focus to it
    if (calendar.focusPending.current && focused) {
        calendar.focusPending.current = false;
        node.focus({ preventScroll: true });
    }
    return () => {
        if (calendar.cells.get(key) === node) {
            calendar.cells.delete(key);
        }
    };
});
const partProps = $derived(
    mergeProps(
        {
            role: "gridcell",
            tabindex: cell.outsideMonth ? undefined : cell.focused ? 0 : -1,
            "aria-label": formatFullDate(calendar.locale, date),
            "aria-selected": cell.selected ? "true" : undefined,
            "aria-disabled":
                cell.disabled || cell.unavailable || cell.outsideMonth
                    ? "true"
                    : undefined,
            "aria-current": cell.today ? "date" : undefined,
            "data-calendar-part": "cell",
            ...stateAttributes({
                today: cell.today,
                selected: cell.selected,
                disabled: cell.disabled,
                unavailable: cell.unavailable,
                "outside-month": cell.outsideMonth,
                "range-start": cell.rangeStart,
                "range-end": cell.rangeEnd,
                "in-range": cell.inRange,
                "range-preview": cell.rangePreview,
            }),
            onclick: () => {
                if (!cell.outsideMonth && !cell.disabled) {
                    calendar.select(date);
                    calendar.requestFocus();
                }
            },
            onpointerenter: () => {
                if (calendar.anchor !== null && !cell.outsideMonth) {
                    calendar.hovered = date;
                }
            },
            onfocus: () => {
                if (!cell.outsideMonth && !cell.focused) {
                    calendar.moveFocus(date);
                }
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: cell })}{:else}<td {...partProps}>{#if children}{@render children()}{:else}{formatDayNumber(calendar.locale, date)}{/if}</td>{/if}
