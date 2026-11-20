import { useLayoutEffect } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, orderedItems } from "./combobox-context.ts";

/** The `listbox`. Applies the highlight the keyboard asked for once its items render. */
export function ComboboxList(props: PartProps<{ empty: boolean }>) {
    const context = useRequiredContext(ComboboxContext, "Combobox.List");
    const { list, pendingHighlight, setHighlighted, value, itemCount } =
        context;

    // biome-ignore lint/correctness/useExhaustiveDependencies: runs when the list or its items change
    useLayoutEffect(() => {
        const pending = pendingHighlight.current;
        if (list === null || pending === null) {
            return;
        }
        pendingHighlight.current = null;
        const items = orderedItems(context);
        const selected = items.find((item) => item.value === value);
        const target =
            selected ?? (pending === "first" ? items[0] : items.at(-1));
        setHighlighted(target?.value ?? null);
    }, [list, itemCount]);

    const empty = itemCount === 0;
    return renderElement(
        "div",
        props,
        { empty },
        {
            role: "listbox",
            id: context.listId,
            "data-combobox-part": "list",
            ...stateAttributes({ empty }),
        },
        context.setList,
    );
}
