import { isItemGroup } from "@poc/dom";
import type { JSX } from "@solidjs/web";
import {
    type Accessor,
    createEffect,
    createMemo,
    For,
    untrack,
    useContext,
} from "solid-js";
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
    // each recompute filters a group into a new object: key it by the first one seen with the
    // same fields, so a group stays mounted while its items change (React keeps its key)
    let groups: object[] = [];
    const keys = createMemo(() => {
        const known = groups;
        const next = new Map<unknown, unknown>();
        groups = [];
        for (const entry of context.entries()) {
            if (isItemGroup(entry)) {
                const key =
                    known.find((group) => sameGroup(group, entry)) ?? entry;
                groups.push(key);
                next.set(entry, key);
            }
        }
        return next;
    });

    createEffect(
        // runs when the list opens (a list reopened while it closes keeps its element), or its
        // items change
        () => ({
            list: context.list(),
            count: context.itemCount(),
            open: context.open(),
        }),
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
                    return children as JSX.Element;
                }
                const render = children as (
                    entry: unknown,
                    index: number,
                ) => JSX.Element;
                // an entry's index is current: a render function that takes it renders again when it
                // changes (an earlier entry was filtered out)
                const renderEntry = (
                    entry: Accessor<unknown>,
                    index: Accessor<number>,
                ) => {
                    const first = untrack(entry);
                    const value = isItemGroup(first) ? groupView(entry) : first;
                    if (render.length < 2) {
                        return untrack(() => render(value, index()));
                    }
                    return <>{renderAt(render, value, index())}</>;
                };
                return (
                    <For
                        each={context.entries()}
                        keyed={(entry) => keys().get(entry) ?? entry}
                    >
                        {renderEntry}
                    </For>
                );
            },
        },
    );
}

function renderAt(
    render: (entry: unknown, index: number) => JSX.Element,
    entry: unknown,
    index: number,
): JSX.Element {
    return untrack(() => render(entry, index));
}

/** Whether two groups hold the same fields, their items aside. */
function sameGroup(group: object, other: object): boolean {
    const fields = Object.keys(group).filter((key) => key !== "items");
    return (
        fields.length ===
            Object.keys(other).filter((key) => key !== "items").length &&
        fields.every((key) =>
            Object.is(
                (group as Record<string, unknown>)[key],
                (other as Record<string, unknown>)[key],
            ),
        )
    );
}

/** A group that reads the current filtered group: its `items` follow the query. */
function groupView(entry: Accessor<unknown>): object {
    const current = () => entry() as object;
    return new Proxy(untrack(current), {
        get: (_, key) => Reflect.get(current(), key),
        has: (_, key) => Reflect.has(current(), key),
        ownKeys: () => Reflect.ownKeys(current()),
        getOwnPropertyDescriptor: (_, key) =>
            Reflect.getOwnPropertyDescriptor(current(), key),
    });
}
