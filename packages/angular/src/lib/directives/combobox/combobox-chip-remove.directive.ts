import { computed, Directive, inject } from "@angular/core";
import { dataValues } from "../../utils/state-attributes.ts";
import { ComboboxChip } from "./combobox-chip.directive.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/** Removes its chip's value and returns focus to the input: `<button comboboxChipRemove>`. */
@Directive({
    selector: "[comboboxChipRemove]",
    exportAs: "comboboxChipRemove",
    host: {
        type: "button",
        tabindex: "-1",
        "data-combobox-part": "chip-remove",
        "[attr.disabled]": "data().disabled",
        "[attr.data-disabled]": "data().disabled",
        "(pointerdown)": "$event.preventDefault()",
        "(click)": "onClick()",
    },
})
export class ComboboxChipRemove {
    private readonly root = inject(ComboboxRoot);
    private readonly chip = inject(ComboboxChip);
    readonly state = computed(() => ({ disabled: this.root.isDisabled() }));
    protected readonly data = computed(() => dataValues(this.state()));

    protected onClick(): void {
        const root = this.root;
        const index = root.chipElements().indexOf(this.chip.element);
        if (index >= 0) {
            root.removeAt(index, "chip-remove-press");
        }
        root.overlay.trigger()?.focus();
    }
}
