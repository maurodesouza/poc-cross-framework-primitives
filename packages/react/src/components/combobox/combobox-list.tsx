import { type ReactNode, useLayoutEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, orderedItems } from "./combobox-context.ts";

export interface ComboboxListProps
    extends Omit<PartProps<{ empty: boolean }>, "children"> {
    /** Nodes, or a render function of each matching entry (an item, or a group). */
    // biome-ignore lint/suspicious/noExplicitAny: an entry is the consumer's own item type
    children?: ReactNode | ((entry: any, index: number) => ReactNode);
}

/** The `listbox`. Applies the highlight the keyboard asked for once its items render. */
export function ComboboxList({ children, ...props }: ComboboxListProps) {
    const context = useRequiredContext(ComboboxContext, "Combobox.List");
    const { list, pendingHighlight, setHighlighted, itemCount } = context;

    // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the list or its items change
    useLayoutEffect(() => {
        const pending = pendingHighlight.current;
        if (list === null || pending === null) {
            return;
        }
        pendingHighlight.current = null;
        const items = orderedItems(context);
        const selected = context.multiple
            ? undefined
            : items.find((item) => context.isSelected(item.value));
        const edge = pending === "first" ? items[0] : items.at(-1);
        const target = selected ?? (pending === "selected" ? undefined : edge);
        setHighlighted(target?.id ?? null);
    }, [list, itemCount]);

    const empty = context.hasItems
        ? context.entries.length === 0
        : itemCount === 0;
    const content =
        typeof children === "function"
            ? context.entries.map((entry, index) => children(entry, index))
            : children;
    return renderElement(
        "div",
        { ...props, children: content },
        { empty },
        {
            role: "listbox",
            id: context.listId,
            "aria-multiselectable": context.multiple ? "true" : undefined,
            "data-combobox-part": "list",
            ...stateAttributes({ empty }),
        },
        context.setList,
    );
}
