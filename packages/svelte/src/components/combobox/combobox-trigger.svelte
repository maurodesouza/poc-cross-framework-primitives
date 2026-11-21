<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/** Toggles the list; not in the tab order, keeps focus in the input. */
let {
    child,
    children,
    ...rest
}: PartProps<{ open: boolean; disabled: boolean }> = $props();
const context = ComboboxContext.use("Combobox.Trigger");
const ref = elementRef((element) => (context.button = element));
const partState = $derived({ open: context.open, disabled: context.disabled });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            tabindex: -1,
            disabled: context.disabled,
            "aria-expanded": context.open ? "true" : "false",
            "aria-controls": context.listId,
            "data-combobox-part": "trigger",
            ...stateAttributes({
                open: context.open,
                disabled: context.disabled,
            }),
            onpointerdown: (event: PointerEvent) => event.preventDefault(),
            onclick: () => {
                context.pendingHighlight.current = null;
                context.setOpen(!context.open, "trigger-press");
                context.trigger?.focus();
            },
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
