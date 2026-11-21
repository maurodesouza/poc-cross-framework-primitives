<script lang="ts">
import type { Weekday } from "@poc/dom";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";

/** One weekday: its short name, the long one as `abbr`. */
let {
    child,
    children,
    weekday,
    ...rest
}: PartProps<{ weekday: Weekday }> & { weekday: Weekday } = $props();
const partState = $derived({ weekday });
const partProps = $derived(
    mergeProps(
        {
            scope: "col",
            abbr: weekday.long,
            "data-calendar-part": "header-cell",
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<th {...partProps}>{#if children}{@render children()}{:else}{weekday.short}{/if}</th>{/if}
