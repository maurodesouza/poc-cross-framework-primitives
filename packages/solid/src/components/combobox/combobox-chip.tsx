import { chipKeyTarget, getDirection } from "@poc/dom";
import { flush, useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import {
    ComboboxChipContext,
    ComboboxContext,
    chipElements,
} from "./combobox-context.ts";

/** One value of a `multiple` combobox; the arrows move between chips (spec/combobox.md). */
export function ComboboxChip(props: PartProps<{ disabled: boolean }>) {
    const context = useContext(ComboboxContext);
    let element: HTMLElement | null = null;

    const onKeyDown = (event: KeyboardEvent) => {
        if (
            context.disabled() ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey
        ) {
            return;
        }
        const chip = event.currentTarget as HTMLElement;
        const chips = chipElements(context);
        const index = chips.indexOf(chip);
        const action = chipKeyTarget(
            event.key,
            index,
            chips.length,
            getDirection(chip) === "rtl",
        );
        if (action === null) {
            return;
        }
        // a printable character goes on to the input, focused below
        if (event.key.length !== 1 || event.key === " ") {
            event.preventDefault();
        }
        if (action.remove) {
            context.removeAt(index, "none");
            // the chips render before focus moves to the one now at its place
            flush();
        }
        if (action.open) {
            context.setOpen(true, "list-navigation");
        }
        const target =
            action.focus === "input"
                ? context.trigger()
                : chipElements(context)[action.focus];
        target?.focus();
    };

    const state = () => ({ disabled: context.disabled() });
    return (
        <ComboboxChipContext value={{ element: () => element }}>
            {renderPart(
                "div",
                props,
                state,
                () => ({
                    tabindex: -1,
                    "aria-disabled": context.disabled() ? "true" : undefined,
                    "data-combobox-part": "chip",
                    ...stateAttributes(state()),
                    onKeyDown,
                }),
                {
                    ref: (node) => {
                        element = node;
                    },
                },
            )}
        </ComboboxChipContext>
    );
}
