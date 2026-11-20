import { stepThroughNone } from "@poc/dom";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useRequiredContext } from "../../hooks/use-required-context.ts";
import { type PartProps, renderElement } from "../../utils/render-element.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, orderedItems } from "./combobox-context.ts";

/**
 * The `combobox`: keeps DOM focus while the list is open; the highlighted item is announced with
 * `aria-activedescendant` (spec/combobox.md, "Keyboard").
 */
export function ComboboxInput(
    props: PartProps<{ open: boolean; disabled: boolean }>,
) {
    const context = useRequiredContext(ComboboxContext, "Combobox.Input");
    const { open, disabled, highlighted } = context;
    const items = orderedItems(context);
    const active = items.find((item) => item.value === highlighted);

    const openWith = (highlight: "first" | "last" | null) => {
        context.pendingHighlight.current = highlight;
        context.setOpen(true, "list-navigation");
    };
    const move = (delta: 1 | -1) => {
        // past an end, the visual focus goes back to the input; from the input, to the near end
        const index = items.findIndex((item) => item.value === highlighted);
        context.setHighlighted(
            items[stepThroughNone(items.length, index, delta)]?.value ?? null,
        );
    };

    const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault();
                if (event.altKey) {
                    if (event.key === "ArrowDown" && !open) {
                        openWith(null);
                    } else if (event.key === "ArrowUp" && open) {
                        context.setOpen(false, "list-navigation");
                    }
                    return;
                }
                if (!open) {
                    openWith(event.key === "ArrowDown" ? "first" : "last");
                    return;
                }
                move(event.key === "ArrowDown" ? 1 : -1);
                return;
            }
            case "Enter":
                if (open) {
                    event.preventDefault();
                    if (highlighted !== null) {
                        context.choose(highlighted);
                    }
                }
                return;
            case "Escape":
                // the open list's layer takes Escape first; here the list is closed
                if (
                    !open &&
                    (context.inputValue !== "" || context.value !== null)
                ) {
                    event.preventDefault();
                    context.clear();
                }
                return;
            case "Tab":
                if (open) {
                    context.setOpen(false, "focus-out");
                }
                return;
            default:
        }
    };

    const state = { open, disabled };
    return renderElement(
        "input",
        props,
        state,
        {
            type: "text",
            role: "combobox",
            autoComplete: "off",
            disabled,
            value: context.inputValue,
            "aria-autocomplete": "list",
            "aria-expanded": open,
            "aria-controls": context.listId,
            "aria-activedescendant": open && active ? active.id : undefined,
            "data-combobox-part": "input",
            ...stateAttributes({ open, disabled }),
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
                context.setInputValue(event.target.value, "input-change");
                context.setHighlighted(null);
                if (!open) {
                    context.pendingHighlight.current = null;
                    context.setOpen(true, "input-change");
                }
            },
            onKeyDown,
        },
        context.setTrigger,
    );
}
