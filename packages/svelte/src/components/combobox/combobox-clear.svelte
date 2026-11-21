<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/** Clears the text and the value; rendered only while there is a value (spec/combobox.md). */
let { child, children, ...rest }: PartProps<{ disabled: boolean }> = $props();
const context = ComboboxContext.use("Combobox.Clear");
const ref = elementRef((element) => (context.clearButton = element));
const partState = $derived({ disabled: context.disabled });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            tabindex: -1,
            disabled: context.disabled,
            "data-combobox-part": "clear",
            ...stateAttributes({ disabled: context.disabled }),
            onpointerdown: (event: PointerEvent) => event.preventDefault(),
            onclick: () => {
                context.clear("clear-press");
                context.trigger?.focus();
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if context.values.length > 0}{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}{/if}
