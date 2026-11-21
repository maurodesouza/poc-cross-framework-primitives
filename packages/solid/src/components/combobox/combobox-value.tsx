import type { JSX } from "@solidjs/web";
import { createMemo, createProjection, untrack, useContext } from "solid-js";
import { ComboboxContext } from "./combobox-context.ts";

export interface ComboboxValueProps {
    /**
     * A node, or a render function of the value. Single: the item or `null`, called again when
     * it changes. `multiple`: called once with a reactive array of the items (a store: iterate it
     * with `For`), so the elements it renders, the Input among them, are kept.
     */
    // biome-ignore lint/suspicious/noExplicitAny: the value is the consumer's own item type
    children?: JSX.Element | ((value: any) => JSX.Element);
}

/** Renders the value: its label (labels joined with ", "), or the consumer's render function. */
export function ComboboxValue(props: ComboboxValueProps) {
    const context = useContext(ComboboxContext);
    const store = createProjection<{ values: unknown[] }>(
        (draft) => {
            // in place: the consumer holds this array (a new one would leave it stale)
            draft.values.splice(0, draft.values.length, ...context.values());
        },
        { values: [] },
    );
    return createMemo(() => {
        const children = props.children;
        // a render function takes the value; a component's output is a function of none
        if (typeof children === "function" && children.length > 0) {
            const render = children as (value: unknown) => JSX.Element;
            if (context.multiple()) {
                return untrack(() => render(store.values));
            }
            const value = context.value();
            return untrack(() => render(value));
        }
        if (children !== undefined) {
            return children;
        }
        return context.values().map(context.label).join(", ");
    }) as unknown as JSX.Element;
}
