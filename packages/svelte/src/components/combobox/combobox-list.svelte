<script lang="ts">
import { untrack } from "svelte";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/** The `listbox`. Applies the highlight the keyboard asked for once its items render. */
let { child, children, ...rest }: PartProps<{ empty: boolean }> = $props();
const context = ComboboxContext.use("Combobox.List");
const ref = elementRef((element) => (context.list = element));
$effect(() => {
    const list = context.list;
    context.itemCount;
    untrack(() => {
        const pending = context.pendingHighlight.current;
        if (list === null || pending === null) {
            return;
        }
        context.pendingHighlight.current = null;
        const items = context.orderedItems();
        const selected = items.find((item) => item.value === context.value);
        const target =
            selected ?? (pending === "first" ? items[0] : items.at(-1));
        context.highlighted = target?.value ?? null;
    });
});
const empty = $derived(context.itemCount === 0);
const partState = $derived({ empty });
const partProps = $derived(
    mergeProps(
        {
            role: "listbox",
            id: context.listId,
            "data-combobox-part": "list",
            ...stateAttributes({ empty }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
