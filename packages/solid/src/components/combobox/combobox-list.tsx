import { createEffect, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, orderedItems } from "./combobox-context.ts";

/** The `listbox`. Applies the highlight the keyboard asked for once its items render. */
export function ComboboxList(props: PartProps<{ empty: boolean }>) {
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
            const selected = items.find(
                (item) => item.value === context.value(),
            );
            const target =
                selected ?? (pending === "first" ? items[0] : items.at(-1));
            context.setHighlighted(target?.value ?? null);
        },
    );

    const state = () => ({ empty: context.itemCount() === 0 });
    return renderPart(
        "div",
        props,
        state,
        () => ({
            role: "listbox",
            id: context.listId,
            "data-combobox-part": "list",
            ...stateAttributes(state()),
        }),
        { ref: context.setList },
    );
}
