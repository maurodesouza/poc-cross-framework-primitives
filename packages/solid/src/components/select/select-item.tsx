import { createEffect, createSignal, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    SelectContext,
    SelectItemContext,
    type SelectItemState,
} from "./select-context.ts";

export interface SelectItemProps extends PartProps<SelectItemState> {
    value: string;
    /** Can be highlighted, never chosen (default: the Root item's `disabled`). */
    disabled?: boolean;
}

/** An `option` (spec/select.md). */
export function SelectItem(props: SelectItemProps) {
    const context = useContext(SelectContext);
    const [element, setElement] = createSignal<HTMLElement | null>(null);
    const disabled = () =>
        props.disabled ??
        context.items().find((item) => item.value === props.value)?.disabled ??
        false;
    const highlighted = () => context.highlighted() === props.value;
    const selected = () => context.value() === props.value;
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
        <SelectItemContext value={state}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    role: "option",
                    id: context.itemId(props.value),
                    "aria-selected": selected() ? "true" : "false",
                    "aria-disabled": disabled() ? "true" : undefined,
                    "data-select-part": "item",
                    ...stateAttributes(state()),
                    onPointerMove: () => {
                        if (!highlighted()) {
                            context.setHighlighted(props.value);
                        }
                    },
                    // the trigger keeps DOM focus
                    onPointerDown: (event: PointerEvent) =>
                        event.preventDefault(),
                    onClick: () => {
                        if (!disabled()) {
                            context.choose(props.value, "item-press");
                        }
                    },
                }),
                {
                    ref: (node) => setElement(node),
                    omit: ["value", "disabled"],
                },
            )}
        </SelectItemContext>
    );
}
