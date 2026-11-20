import { useId, useLayoutEffect } from "react";
import { useElement } from "../../hooks/use-element.ts";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext } from "./combobox-context.ts";

export interface ComboboxItemState {
    highlighted: boolean;
    selected: boolean;
    disabled: boolean;
}

export interface ComboboxItemProps extends PartProps<ComboboxItemState> {
    value: string;
    /** Written into the input when chosen (default: the item's text). */
    label?: string;
    /** Can be highlighted, never chosen. */
    disabled?: boolean;
}

export function ComboboxItem({
    value,
    label,
    disabled = false,
    ...props
}: ComboboxItemProps) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Item");
    const [element, ref] = useElement<HTMLElement>();
    const id = useId();
    const { items, setItemCount } = context;
    useLayoutEffect(() => {
        if (element === null) {
            return undefined;
        }
        items.set(element, {
            value,
            label: label ?? element.textContent ?? "",
            disabled,
            id,
        });
        setItemCount(items.size);
        return () => {
            items.delete(element);
            setItemCount(items.size);
        };
    }, [element, value, label, disabled, id, items, setItemCount]);

    const highlighted = context.highlighted === value;
    const selected = context.value === value;
    useLayoutEffect(() => {
        if (highlighted) {
            element?.scrollIntoView?.({ block: "nearest" });
        }
    }, [highlighted, element]);

    const state = { highlighted, selected, disabled };
    return renderElement(
        "div",
        props,
        state,
        {
            role: "option",
            id,
            "aria-selected": selected ? "true" : undefined,
            "aria-disabled": disabled ? "true" : undefined,
            "data-combobox-part": "item",
            ...stateAttributes({ highlighted, selected, disabled }),
            onPointerMove: () => {
                if (!highlighted) {
                    context.setHighlighted(value);
                }
            },
            onPointerDown: (event: PointerEvent) => event.preventDefault(),
            onClick: () => {
                if (!disabled) {
                    context.choose(value);
                }
            },
        },
        ref,
    );
}
