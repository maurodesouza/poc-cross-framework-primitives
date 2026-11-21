import { useLayoutEffect, useRef } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SelectContext, SelectItemContext } from "./select-context.ts";

export interface SelectItemState {
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
}

export interface SelectItemProps extends PartProps<SelectItemState> {
    value: string;
    /** Can be highlighted, never chosen (default: the Root item's `disabled`). */
    disabled?: boolean;
}

/** An `option` (spec/select.md). */
export function SelectItem({
    value,
    disabled: disabledProp,
    ...props
}: SelectItemProps) {
    const context = useRequiredContext(SelectContext, "Select.Item");
    const element = useRef<HTMLElement | null>(null);
    const disabled =
        disabledProp ??
        context.items.find((item) => item.value === value)?.disabled ??
        false;
    const highlighted = context.highlighted === value;
    const selected = context.value === value;
    useLayoutEffect(() => {
        if (highlighted) {
            element.current?.scrollIntoView?.({ block: "nearest" });
        }
    }, [highlighted]);
    const state = { highlighted, selected, disabled };
    return (
        <SelectItemContext.Provider value={state}>
            {renderElement(
                "div",
                props,
                state,
                {
                    role: "option",
                    id: context.itemId(value),
                    "aria-selected": selected ? "true" : "false",
                    "aria-disabled": disabled ? "true" : undefined,
                    "data-select-part": "item",
                    ...stateAttributes({ highlighted, selected, disabled }),
                    onPointerMove: () => {
                        if (!highlighted) {
                            context.setHighlighted(value);
                        }
                    },
                    // the trigger keeps DOM focus
                    onPointerDown: (event: PointerEvent) =>
                        event.preventDefault(),
                    onClick: () => {
                        if (!disabled) {
                            context.choose(value, "item-press");
                        }
                    },
                },
                (node: HTMLElement | null) => {
                    element.current = node;
                },
            )}
        </SelectItemContext.Provider>
    );
}
