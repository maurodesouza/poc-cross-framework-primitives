import {
    createEffect,
    createSignal,
    createUniqueId,
    useContext,
} from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, ComboboxItemContext } from "./combobox-context.ts";

export interface ComboboxItemState {
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
}

export interface ComboboxItemProps extends PartProps<ComboboxItemState> {
    /** The item: written into the input as `itemToStringLabel(value)` when chosen. */
    value: unknown;
    /** Can be highlighted, never chosen. */
    disabled?: boolean;
}

/** An `option` (spec/combobox.md). */
export function ComboboxItem(props: ComboboxItemProps) {
    const context = useContext(ComboboxContext);
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    const id = createUniqueId();
    const disabled = () => props.disabled ?? false;
    createEffect(
        () => ({ node: element(), value: props.value, off: disabled() }),
        ({ node, value, off }) => {
            if (node === null) {
                return undefined;
            }
            context.items.set(node, { value, disabled: off, id });
            context.setItemCount(context.items.size);
            return () => {
                context.items.delete(node);
                context.setItemCount(context.items.size);
            };
        },
    );

    const highlighted = () => context.highlighted() === id;
    const selected = () => context.isSelected(props.value);
    createEffect(
        () => ({ on: highlighted(), node: element() }),
        ({ on, node }) => {
            if (on) {
                node?.scrollIntoView?.({ block: "nearest" });
            }
        },
    );

    const state = () => ({
        highlighted: highlighted(),
        selected: selected(),
        disabled: disabled(),
    });
    return (
        <ComboboxItemContext value={() => ({ selected: selected() })}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    role: "option",
                    id,
                    "aria-selected": selected() ? "true" : undefined,
                    "aria-disabled": disabled() ? "true" : undefined,
                    "data-combobox-part": "item",
                    ...stateAttributes(state()),
                    onPointerMove: () => {
                        if (!highlighted()) {
                            context.setHighlighted(id);
                        }
                    },
                    onPointerDown: (event: PointerEvent) =>
                        event.preventDefault(),
                    onClick: () => {
                        if (!disabled()) {
                            context.choose(props.value);
                        }
                    },
                }),
                {
                    ref: (node) => setElement(node),
                    omit: ["value", "disabled"],
                },
            )}
        </ComboboxItemContext>
    );
}
