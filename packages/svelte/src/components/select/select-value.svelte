<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectContext } from "./select-context.svelte.ts";

/** The selected item's label, or the placeholder (spec/select.md). */
let {
    child,
    children,
    placeholder,
    ...rest
}: PartProps<{ placeholder: boolean }> & {
    /** Shown while nothing is selected. */
    placeholder?: string;
} = $props();
const context = SelectContext.use("Select.Value");
const label = $derived(
    context.items.find((item) => item.value === context.value)?.label,
);
const isPlaceholder = $derived(label === undefined);
const text = $derived(isPlaceholder ? placeholder : label);
const partState = $derived({ placeholder: isPlaceholder });
const partProps = $derived(
    mergeProps(
        {
            "data-select-part": "value",
            ...stateAttributes({ placeholder: isPlaceholder }),
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<span {...partProps}>{#if children}{@render children()}{:else}{text}{/if}</span>{/if}
