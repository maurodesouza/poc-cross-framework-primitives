import { computed, Directive, inject } from "@angular/core";
import { chipKeyTarget, getDirection } from "@poc/dom";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/**
 * One value of a `multiple` combobox; the arrows move between chips (spec/combobox.md):
 * `<div comboboxChip>`, one per value, in value order.
 */
@Directive({
    selector: "[comboboxChip]",
    exportAs: "comboboxChip",
    host: {
        tabindex: "-1",
        "data-combobox-part": "chip",
        "[attr.aria-disabled]": "state().disabled ? 'true' : null",
        "[attr.data-disabled]": "data().disabled",
        "(keydown)": "onKeyDown($event)",
    },
})
export class ComboboxChip {
    private readonly root = inject(ComboboxRoot);
    /** The chip's element, read when a key or a press removes it. */
    readonly element = injectHost();
    readonly state = computed(() => ({ disabled: this.root.isDisabled() }));
    protected readonly data = computed(() => dataValues(this.state()));

    protected onKeyDown(event: KeyboardEvent): void {
        const root = this.root;
        if (
            this.state().disabled ||
            event.ctrlKey ||
            event.metaKey ||
            event.altKey
        ) {
            return;
        }
        const chips = root.chipElements();
        const index = chips.indexOf(this.element);
        const action = chipKeyTarget(
            event.key,
            index,
            chips.length,
            getDirection(this.element) === "rtl",
        );
        if (action === null) {
            return;
        }
        // a printable character goes on to the input, focused below
        if (event.key.length !== 1 || event.key === " ") {
            event.preventDefault();
        }
        if (action.remove) {
            // rendered at once: the focus target is a chip of the new list
            root.removeAt(index, "none");
        }
        if (action.open) {
            root.setOpen(true, "list-navigation");
        }
        const target =
            action.focus === "input"
                ? root.overlay.trigger()
                : root.chipElements()[action.focus];
        target?.focus();
    }
}
