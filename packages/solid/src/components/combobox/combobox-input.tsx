import { stepThroughNone } from "@poc/dom";
import { useContext } from "solid-js";
import { type PartProps, renderPart } from "../../utils/part.tsx";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { ComboboxContext, orderedItems } from "./combobox-context.ts";

/**
 * The `combobox`: keeps DOM focus while the list is open; the highlighted item is announced with
 * `aria-activedescendant` (spec/combobox.md, "Keyboard").
 */
export function ComboboxInput(
    props: PartProps<{ open: boolean; disabled: boolean }>,
) {
    const context = useContext(ComboboxContext);

    const openWith = (highlight: "first" | "last" | null) => {
        context.pendingHighlight.current = highlight;
        context.setOpen(true, "list-navigation");
    };
    const move = (delta: 1 | -1) => {
        // past an end, the visual focus goes back to the input; from the input, to the near end
        const items = orderedItems(context);
        const index = items.findIndex(
            (item) => item.value === context.highlighted(),
        );
        context.setHighlighted(
            items[stepThroughNone(items.length, index, delta)]?.value ?? null,
        );
    };

    const onKeyDown = (event: KeyboardEvent) => {
        const open = context.open();
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
            case "Enter": {
                if (open) {
                    event.preventDefault();
                    const highlighted = context.highlighted();
                    if (highlighted !== null) {
                        context.choose(highlighted);
                    }
                }
                return;
            }
            case "Escape":
                // the open list's layer takes Escape first; here the list is closed
                if (
                    !open &&
                    (context.inputValue() !== "" || context.value() !== null)
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

    const state = () => ({
        open: context.open(),
        disabled: context.disabled(),
    });
    return renderPart(
        "input",
        props,
        state,
        () => {
            const open = context.open();
            const active = orderedItems(context).find(
                (item) => item.value === context.highlighted(),
            );
            // the list's items register one pass after they render
            context.itemCount();
            return {
                type: "text",
                role: "combobox",
                autocomplete: "off",
                disabled: context.disabled(),
                value: context.inputValue(),
                "aria-autocomplete": "list",
                "aria-expanded": String(open),
                "aria-controls": context.listId,
                "aria-activedescendant": open && active ? active.id : undefined,
                "data-combobox-part": "input",
                ...stateAttributes(state()),
                onInput: (event: InputEvent) => {
                    context.setInputValue(
                        (event.currentTarget as HTMLInputElement).value,
                        "input-change",
                    );
                    context.setHighlighted(null);
                    if (!context.open()) {
                        context.pendingHighlight.current = null;
                        context.setOpen(true, "input-change");
                    }
                },
                onKeyDown,
            };
        },
        { ref: context.setTrigger },
    );
}
