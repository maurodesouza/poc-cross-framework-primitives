<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/** Holds the Input and its buttons; anchors the list (spec/combobox.md). */
let {
    child,
    children,
    ...rest
}: PartProps<{ open: boolean; disabled: boolean }> = $props();
const context = ComboboxContext.use("Combobox.InputGroup");
const ref = elementRef((element) => (context.inputGroup = element));
const partState = $derived({ open: context.open, disabled: context.disabled });
const partProps = $derived(
    mergeProps(
        {
            role: "group",
            "data-combobox-part": "input-group",
            ...stateAttributes({
                open: context.open,
                disabled: context.disabled,
            }),
            onmousedown: (event: MouseEvent) => context.pressToOpen(event),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
