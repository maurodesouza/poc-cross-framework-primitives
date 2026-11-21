<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogContext } from "./dialog-context.svelte.ts";

let {
    child,
    children,
    disabled = false,
    ...rest
}: PartProps<{ open: boolean; disabled: boolean }> & {
    disabled?: boolean;
} = $props();
const context = DialogContext.use("Dialog.Trigger");
const ref = elementRef((element) => (context.trigger = element));
const state = $derived({ open: context.open, disabled });
const partProps = $derived(
    mergeProps(
        {
            type: "button",
            id: context.triggerId,
            disabled,
            "aria-haspopup": "dialog",
            "aria-expanded": context.open ? "true" : "false",
            "aria-controls": context.open ? context.popupId : undefined,
            "data-dialog-part": "trigger",
            ...stateAttributes({ open: context.open, disabled }),
            onclick: () => context.setOpen(!context.open, "trigger-press"),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state })}{:else}<button {...partProps}>{@render children?.()}</button>{/if}
