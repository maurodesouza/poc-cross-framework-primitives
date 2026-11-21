<script lang="ts">
import { addMonths, calendarKeyTarget, getDirection } from "@poc/dom";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import {
    CalendarContext,
    CalendarGridContext,
} from "./calendar-context.svelte.ts";

/** One month, as an ARIA grid with the APG date grid keyboard (spec/calendar.md, "Keyboard"). */
let {
    child,
    children,
    offset = 0,
    ...rest
}: PartProps<Record<string, never>> & { offset?: number } = $props();
const calendar = CalendarContext.use("Calendar.Grid");
const month = $derived(addMonths(calendar.visibleStart, offset));
CalendarGridContext.provide(() => month);
const onkeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        calendar.select(calendar.focusedDate);
        return;
    }
    if (event.key === "Escape") {
        if (calendar.anchor !== null) {
            event.preventDefault();
            calendar.cancelRange();
        }
        return;
    }
    const target = calendarKeyTarget(event.key, calendar.focusedDate, {
        rtl: getDirection(event.currentTarget as Element) === "rtl",
        firstDayOfWeek: calendar.firstDay,
        shiftKey: event.shiftKey,
    });
    if (target === null) {
        return;
    }
    event.preventDefault();
    if (calendar.moveFocus(target)) {
        calendar.requestFocus();
    }
};
const partProps = $derived(
    mergeProps(
        {
            role: "grid",
            id: calendar.gridId(offset),
            "aria-labelledby": calendar.headingId(offset),
            "aria-multiselectable":
                calendar.mode === "range" ? "true" : undefined,
            "aria-readonly": calendar.readOnly ? "true" : undefined,
            "aria-disabled": calendar.disabled ? "true" : undefined,
            "data-calendar-part": "grid",
            onkeydown,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<table {...partProps}>{@render children?.()}</table>{/if}
