<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/** `multiple`: holds the chips and the Input; a `toolbar` while it holds a chip. */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const context = ComboboxContext.use("Combobox.Chips");
const ref = elementRef((element) => (context.chips = element));
const partProps = $derived(
    mergeProps(
        {
            role: context.values.length > 0 ? "toolbar" : undefined,
            "data-combobox-part": "chips",
            onmousedown: (event: MouseEvent) => context.pressToOpen(event),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
