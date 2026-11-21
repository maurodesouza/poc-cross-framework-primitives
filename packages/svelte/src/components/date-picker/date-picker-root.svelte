<script lang="ts">
import type { PlainDate } from "@poc/dom";
import { type Snippet, untrack } from "svelte";
import type { ChangeDetails } from "../../utils/change-details.ts";
import type {
    CalendarMode,
    CalendarValue,
} from "../calendar/calendar-value.ts";
import {
    DatePickerContext,
    DatePickerState,
} from "./date-picker-context.svelte.ts";

/** A trigger and a popover holding a bound calendar (spec/calendar.md, `bind:value`, `bind:open`). */
let {
    mode = "single",
    open = $bindable(),
    defaultOpen = false,
    onOpenChange,
    value = $bindable(),
    defaultValue = null,
    onValueChange,
    min,
    max,
    isDateUnavailable,
    locale,
    firstDayOfWeek,
    visibleMonths,
    children,
}: {
    mode?: CalendarMode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, details: ChangeDetails) => void;
    value?: CalendarValue;
    defaultValue?: CalendarValue;
    onValueChange?: (value: CalendarValue, details: ChangeDetails) => void;
    min?: PlainDate | null;
    max?: PlainDate | null;
    isDateUnavailable?: (date: PlainDate) => boolean;
    locale?: string;
    firstDayOfWeek?: number;
    visibleMonths?: number;
    children?: Snippet;
} = $props();

DatePickerContext.provide(
    new DatePickerState(
        {
            read: () => open,
            write: (next) => (open = next),
            initial: untrack(() => defaultOpen),
            onOpenChange: () => onOpenChange,
        },
        {
            read: () => value,
            write: (next) => (value = next),
            initial: untrack(() => defaultValue),
            onChange: () => onValueChange,
        },
        untrack(() => mode),
        () => ({
            min,
            max,
            isDateUnavailable,
            locale,
            firstDayOfWeek,
            visibleMonths,
        }),
    ),
);
</script>

{@render children?.()}
