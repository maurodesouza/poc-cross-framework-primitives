<script lang="ts">
import type { ComponentProps } from "svelte";
import DatePickerRoot from "./date-picker-root.svelte";

/** A trigger and a popover holding a bound RangeCalendar (spec/calendar.md). */
let {
    value = $bindable(),
    open = $bindable(),
    ...rest
}: Omit<ComponentProps<typeof DatePickerRoot>, "mode"> = $props();
</script>

<DatePickerRoot bind:value bind:open mode="range" {...rest} />
