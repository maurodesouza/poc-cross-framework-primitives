import { computed, Directive, inject } from "@angular/core";
import { stepThroughNone } from "@poc/dom";
import { injectFlush } from "../../utils/flush.ts";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/**
 * The `combobox`: `<input comboboxInput>`. It keeps DOM focus while the list is open; the
 * highlighted item is announced with `aria-activedescendant` (spec/combobox.md, "Keyboard").
 */
@Directive({
    selector: "input[comboboxInput]",
    exportAs: "comboboxInput",
    host: {
        type: "text",
        role: "combobox",
        autocomplete: "off",
        "aria-autocomplete": "list",
        "data-combobox-part": "input",
        "[attr.disabled]": "data().disabled",
        "[value]": "root.typed()",
        "[attr.aria-expanded]": "String(state().open)",
        "[attr.aria-controls]": "root.listId",
        "[attr.aria-activedescendant]": "activeId()",
        "[attr.data-open]": "data().open",
        "[attr.data-disabled]": "data().disabled",
        "(input)": "onInput()",
        "(keydown)": "onKeyDown($event)",
    },
})
export class ComboboxInput {
    protected readonly root = inject(ComboboxRoot);
    readonly state = computed(() => ({
        open: this.root.overlay.open(),
        disabled: this.root.disabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    protected readonly activeId = computed(() => {
        this.root.itemCount();
        const highlighted = this.root.highlighted();
        if (!this.state().open || highlighted === null) {
            return null;
        }
        return (
            this.root.orderedItems().find((item) => item.value === highlighted)
                ?.id ?? null
        );
    });
    protected readonly String = String;
    private readonly input = registerHost<HTMLInputElement>(
        this.root.overlay.trigger,
    );
    private readonly flush = injectFlush();

    protected onInput(): void {
        const root = this.root;
        root.setInputValue(this.input.value, "input-change");
        root.highlighted.set(null);
        if (!root.overlay.open()) {
            root.pendingHighlight = null;
            root.overlay.setOpen(true, "input-change");
        }
        // a bound `inputValue` the consumer kept unchanged does not re-run the binding: put the
        // accepted text back (React re-asserts a controlled value too)
        this.flush();
        if (this.input.value !== root.typed()) {
            this.input.value = root.typed();
        }
    }

    protected onKeyDown(event: KeyboardEvent): void {
        const root = this.root;
        const open = root.overlay.open();
        const highlighted = root.highlighted();
        const openWith = (highlight: "first" | "last" | null) => {
            root.pendingHighlight = highlight;
            root.overlay.setOpen(true, "list-navigation");
        };
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault();
                if (event.altKey) {
                    if (event.key === "ArrowDown" && !open) {
                        openWith(null);
                    } else if (event.key === "ArrowUp" && open) {
                        root.overlay.setOpen(false, "list-navigation");
                    }
                    return;
                }
                if (!open) {
                    openWith(event.key === "ArrowDown" ? "first" : "last");
                    return;
                }
                // past an end, the visual focus goes back to the input; from the input, to the
                // near end
                const items = root.orderedItems();
                const index = items.findIndex(
                    (item) => item.value === highlighted,
                );
                const delta = event.key === "ArrowDown" ? 1 : -1;
                root.highlighted.set(
                    items[stepThroughNone(items.length, index, delta)]?.value ??
                        null,
                );
                return;
            }
            case "Enter":
                if (open) {
                    event.preventDefault();
                    if (highlighted !== null) {
                        root.choose(highlighted);
                    }
                }
                return;
            case "Escape":
                // the open list's layer takes Escape first; here the list is closed
                if (
                    !open &&
                    (root.typed() !== "" || root.selected() !== null)
                ) {
                    event.preventDefault();
                    root.clear();
                }
                return;
            case "Tab":
                if (open) {
                    root.overlay.setOpen(false, "focus-out");
                }
                return;
            default:
        }
    }
}
