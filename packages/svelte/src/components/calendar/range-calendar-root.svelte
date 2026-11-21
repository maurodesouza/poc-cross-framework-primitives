<script lang="ts">
import type { ComponentProps } from "svelte";
import CalendarRoot from "./calendar-root.svelte";
import type { CalendarValue } from "./calendar-value.ts";

/** A range of dates (spec/calendar.md, `bind:value`). Inside a DateRangePicker, it binds to it. */
let {
    value = $bindable(),
    ...rest
}: Omit<ComponentProps<typeof CalendarRoot>, "mode" | "value"> & {
    value?: CalendarValue;
} = $props();
</script>

<CalendarRoot bind:value mode="range" {...rest} />
