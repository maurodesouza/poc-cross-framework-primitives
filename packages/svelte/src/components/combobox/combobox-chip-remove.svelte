<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxChipContext,
    ComboboxContext,
} from "./combobox-context.svelte.ts";

/** Removes its chip's value and returns focus to the input. */
let { child, children, ...rest }: PartProps<{ disabled: boolean }> = $props();
const context = ComboboxContext.use("Combobox.ChipRemove");
const chip = ComboboxChipContext.use("Combobox.ChipRemove");
const partState = $derived({ disabled: context.disabled });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            tabindex: -1,
            disabled: context.disabled,
            "data-combobox-part": "chip-remove",
            ...stateAttributes({ disabled: context.disabled }),
            onpointerdown: (event: PointerEvent) => event.preventDefault(),
            onclick: () => {
                const element = chip.element();
                const index =
                    element === null
                        ? -1
                        : context.chipElements().indexOf(element);
                if (index >= 0) {
                    context.removeAt(index, "chip-remove-press");
                }
                context.trigger?.focus();
            },
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
