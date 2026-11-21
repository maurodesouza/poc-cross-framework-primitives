import { chipKeyTarget, getDirection } from "@poc/dom";
import { type KeyboardEvent, useRef } from "react";
import { flushSync } from "react-dom";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxChipContext,
    ComboboxContext,
    chipElements,
} from "./combobox-context.ts";

/** One value of a `multiple` combobox; the arrows move between chips (spec/combobox.md). */
export function ComboboxChip(props: PartProps<{ disabled: boolean }>) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Chip");
    const element = useRef<HTMLElement | null>(null);
    const { disabled } = context;

    const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (disabled || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        const chips = chipElements(context);
        const index = chips.indexOf(event.currentTarget);
        const action = chipKeyTarget(
            event.key,
            index,
            chips.length,
            getDirection(event.currentTarget) === "rtl",
        );
        if (action === null) {
            return;
        }
        // a printable character goes on to the input, focused below
        if (event.key.length !== 1 || event.key === " ") {
            event.preventDefault();
        }
        if (action.remove) {
            flushSync(() => context.removeAt(index, "none"));
        }
        if (action.open) {
            context.setOpen(true, "list-navigation");
        }
        const target =
            action.focus === "input"
                ? context.trigger
                : chipElements(context)[action.focus];
        target?.focus();
    };

    return (
        <ComboboxChipContext.Provider
            value={{ element: () => element.current }}
        >
            {renderElement(
                "div",
                props,
                { disabled },
                {
                    tabIndex: -1,
                    "aria-disabled": disabled ? "true" : undefined,
                    "data-combobox-part": "chip",
                    ...stateAttributes({ disabled }),
                    onKeyDown,
                },
                (node: HTMLElement | null) => {
                    element.current = node;
                },
            )}
        </ComboboxChipContext.Provider>
    );
}
