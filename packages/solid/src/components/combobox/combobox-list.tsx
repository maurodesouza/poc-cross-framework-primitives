import type { JSX } from "@solidjs/web";
import { createEffect, For, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, orderedItems } from "./combobox-context.ts";

export interface ComboboxListProps
    extends Omit<PartProps<{ empty: boolean }>, "children"> {
    /** Nodes, or a render function of each matching entry (an item, or a group). */
    // biome-ignore lint/suspicious/noExplicitAny: an entry is the consumer's own item type
    children?: JSX.Element | ((entry: any, index: number) => JSX.Element);
}

/** The `listbox`. Applies the highlight the keyboard asked for once its items render. */
export function ComboboxList(props: ComboboxListProps) {
    const context = useContext(ComboboxContext);

    createEffect(
        () => ({ list: context.list(), count: context.itemCount() }),
        ({ list }) => {
            const pending = context.pendingHighlight.current;
            if (list === null || pending === null) {
                return;
            }
            // Solid runs this effect before the items' own (parent first): wait until every
            // rendered option has registered
            const items = orderedItems(context);
            if (
                items.length !== list.querySelectorAll('[role="option"]').length
            ) {
                return;
            }
            context.pendingHighlight.current = null;
            const selected = context.multiple()
                ? undefined
                : items.find((item) => context.isSelected(item.value));
            const edge = pending === "first" ? items[0] : items.at(-1);
            const target =
                selected ?? (pending === "selected" ? undefined : edge);
            context.setHighlighted(target?.id ?? null);
        },
    );

    const empty = () =>
        context.hasItems()
            ? context.entries().length === 0
            : context.itemCount() === 0;
    const state = () => ({ empty: empty() });
    return renderPart(
        "div",
        props as PartProps<{ empty: boolean }>,
        state,
        () => ({
            role: "listbox",
            id: context.listId,
            "aria-multiselectable": context.multiple() ? "true" : undefined,
            "data-combobox-part": "list",
            ...stateAttributes(state()),
        }),
        {
            ref: context.setList,
            children: () => {
                const children = props.children;
                // a render function takes the entry; a component's output (`<For>`) is a
                // function of no argument, as Solid's `Show` tells its callback apart
                if (typeof children !== "function" || children.length === 0) {
                    return children;
                }
                const render = children as (
                    entry: unknown,
                    index: number,
                ) => JSX.Element;
                return (
                    <For each={context.entries()}>
                        {(entry, index) => render(entry, index())}
                    </For>
                );
            },
        },
    );
}
