<script lang="ts">
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { DialogContext } from "./dialog-context.svelte.ts";

let { child, children, ...rest }: PartProps<{ open: boolean }> = $props();
const context = DialogContext.use("Dialog.Backdrop");
const ref = elementRef((element) => (context.backdrop = element));
const state = $derived({ open: context.open });
const partProps = $derived(
    mergeProps(
        {
            "aria-hidden": "true",
            "data-dialog-part": "backdrop",
            ...stateAttributes({
                open: context.open,
                "starting-style": context.presence.status === "starting",
                "ending-style": context.presence.status === "ending",
            }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
