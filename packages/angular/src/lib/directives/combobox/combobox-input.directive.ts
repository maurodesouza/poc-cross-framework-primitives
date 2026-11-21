import { afterNextRender, computed, Directive, inject } from "@angular/core";
import { chipArrows, getDirection, stepThroughNone } from "@poc/dom";
import { writeFieldAria } from "../../utils/field-control.ts";
import { injectFlush } from "../../utils/flush.ts";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import {
    ComboboxRoot,
    type PendingHighlight,
} from "./combobox-root.directive.ts";

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
        "[value]": "root.inputValue()",
        "[attr.aria-expanded]": "String(state().open)",
        "[attr.aria-controls]": "root.listId",
        "[attr.aria-activedescendant]": "activeId()",
        "[attr.data-invalid]": "root.field.data().invalid",
        "[attr.data-valid]": "root.field.data().valid",
        "[attr.data-dirty]": "root.field.data().dirty",
        "[attr.data-touched]": "root.field.data().touched",
        "[attr.data-filled]": "root.field.data().filled",
        "[attr.data-focused]": "root.field.data().focused",
        "[attr.data-open]": "data().open",
        "[attr.data-disabled]": "data().disabled",
        "(input)": "onInput()",
        "(click)": "root.openOnPress()",
        "(keydown)": "onKeyDown($event)",
        "(focus)": "root.field.focused()",
        "(blur)": "root.field.blurred()",
    },
})
export class ComboboxInput {
    protected readonly root = inject(ComboboxRoot);
    readonly state = computed(() => ({
        open: this.root.overlay.open(),
        disabled: this.root.isDisabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    /** The highlighted item, while the list is open and the item is rendered. */
    private readonly active = computed(() => {
        this.root.itemCount();
        const highlighted = this.root.highlighted();
        if (!this.state().open || highlighted === null) {
            return undefined;
        }
        return this.root.orderedItems().find((item) => item.id === highlighted);
    });
    protected readonly activeId = computed(() => this.active()?.id ?? null);
    protected readonly String = String;
    private readonly input = registerHost<HTMLInputElement>(
        this.root.overlay.trigger,
    );
    private readonly flush = injectFlush();

    constructor() {
        const { field } = this.root;
        const host = this.input;
        writeFieldAria(field, host, {
            "aria-labelledby": field.labelledBy,
            "aria-describedby": field.describedBy,
            "aria-invalid": field.ariaInvalid,
        });
        // the consumer's own id wins (the label's `for` points at it)
        afterNextRender(() => {
            if (host.id === "") {
                host.id = this.root.overlay.triggerId;
            }
            this.root.inputElementId.set(host.id);
        });
    }

    protected onInput(): void {
        const root = this.root;
        root.setInputValue(this.input.value, "input-change");
        root.highlighted.set(null);
        root.markTyped();
        if (!root.overlay.open()) {
            root.pendingHighlight.set(null);
            root.setOpen(true, "input-change");
        }
        // a bound `inputValue` the consumer kept unchanged does not re-run the binding: put the
        // accepted text back (React re-asserts a controlled value too)
        this.flush();
        if (this.input.value !== root.inputValue()) {
            this.input.value = root.inputValue();
        }
    }

    protected onKeyDown(event: KeyboardEvent): void {
        const root = this.root;
        const input = this.input;
        const open = root.overlay.open();
        const openWith = (highlight: PendingHighlight) => {
            root.pendingHighlight.set(highlight);
            root.setOpen(true, "list-navigation");
        };
        switch (event.key) {
            case "ArrowDown":
            case "ArrowUp": {
                event.preventDefault();
                if (event.altKey) {
                    if (event.key === "ArrowDown" && !open) {
                        openWith(null);
                    } else if (event.key === "ArrowUp" && open) {
                        root.setOpen(false, "list-navigation");
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
                    (item) => item.id === root.highlighted(),
                );
                const delta = event.key === "ArrowDown" ? 1 : -1;
                root.highlight(
                    items[stepThroughNone(items.length, index, delta)]?.id ??
                        null,
                );
                return;
            }
            case "Enter":
                if (open) {
                    event.preventDefault();
                    const active = this.active();
                    if (active !== undefined && !active.disabled) {
                        root.choose(active.value);
                    }
                }
                return;
            case "Escape":
                // the open list's layer takes Escape first; here the list is closed
                if (
                    !open &&
                    (root.inputValue() !== "" || root.values().length > 0)
                ) {
                    event.preventDefault();
                    root.clear("escape-key");
                }
                return;
            case "Tab":
                if (open) {
                    root.setOpen(false, "focus-out");
                }
                return;
            case "Backspace":
                if (
                    root.multiple() &&
                    input.value === "" &&
                    root.values().length > 0
                ) {
                    root.removeAt(root.values().length - 1, "none");
                }
                return;
            default: {
                const chips = root.chipElements();
                if (
                    root.multiple() &&
                    event.key ===
                        chipArrows(getDirection(input) === "rtl").previous &&
                    input.selectionStart === 0 &&
                    input.selectionEnd === 0 &&
                    chips.length > 0
                ) {
                    event.preventDefault();
                    chips.at(-1)?.focus();
                }
            }
        }
    }
}
