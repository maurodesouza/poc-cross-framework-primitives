<script lang="ts">
import { type Snippet, untrack } from "svelte";
import { elementRef } from "../../utils/element-ref.ts";
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.svelte.ts";

/**
 * The `listbox`. With the Root's `items`, its `children` snippet is called for each matching entry
 * (an item, or a group): `{#snippet children(entry, index)}`. Applies the highlight the keyboard
 * asked for once its items render.
 */
let {
    child,
    children,
    ...rest
}: Pick<PartProps<{ empty: boolean }>, "child" | "class" | "style"> & {
    // biome-ignore lint/suspicious/noExplicitAny: an entry is the consumer's own item type
    children?: Snippet<[entry: any, index: number]> | Snippet;
    [key: string]: unknown;
} = $props();
const context = ComboboxContext.use("Combobox.List");
const ref = elementRef((element) => (context.list = element));
// with `items`, the snippet takes each entry; without, it is the consumer's own items
const renderEntry = $derived(
    children as Snippet<[unknown, number]> | undefined,
);
const renderItems = $derived(children as Snippet | undefined);

$effect(() => {
    const list = context.list;
    // runs when the list opens (a list reopened while it closes keeps its element), or its
    // items change
    context.itemsVersion;
    context.open;
    untrack(() => {
        const pending = context.pendingHighlight.current;
        if (list === null || pending === null) {
            return;
        }
        const items = context.orderedItems();
        // the rendered options register after the list: wait for them
        if (items.length === 0) {
            return;
        }
        context.pendingHighlight.current = null;
        const selected = context.multiple
            ? undefined
            : items.find((item) => context.isSelected(item.value));
        const edge = pending === "first" ? items[0] : items.at(-1);
        const target = selected ?? (pending === "selected" ? undefined : edge);
        context.highlighted = target?.id ?? null;
    });
});

const empty = $derived(context.empty);
const partState = $derived({ empty });
const partProps = $derived(
    mergeProps(
        {
            role: "listbox",
            id: context.listId,
            "aria-multiselectable": context.multiple ? "true" : undefined,
            "data-combobox-part": "list",
            ...stateAttributes({ empty }),
            ...ref,
        },
        rest,
    ),
);
</script>

{#snippet content()}{#if context.hasItems}{#each context.entries as entry, index}{@render renderEntry?.(entry, index)}{/each}{:else}{@render renderItems?.()}{/if}{/snippet}{#if child}{@render child({ props: partProps, state: partState })}{:else}<div {...partProps}>{@render content()}</div>{/if}
