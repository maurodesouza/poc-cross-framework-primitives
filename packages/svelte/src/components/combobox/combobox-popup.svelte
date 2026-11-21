<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/** The floating container of the list (no role of its own). */
let {
    child,
    children,
    ...rest
}: PartProps<{ open: boolean; side: string; align: string }> = $props();
const context = ComboboxContext.use("Combobox.Popup");
const ref = elementRef((element) => (context.popup = element));
const partState = $derived({ open: context.open, ...context.placed });
const partProps = $derived(
    mergeProps(
        {
            "data-combobox-part": "popup",
            ...stateAttributes({
                open: context.open,
                side: context.placed.side,
                align: context.placed.align,
                "starting-style": context.presence.status === "starting",
                "ending-style": context.presence.status === "ending",
            }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
