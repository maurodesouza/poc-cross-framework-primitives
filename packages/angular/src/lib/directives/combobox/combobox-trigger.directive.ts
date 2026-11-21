import { computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/** Toggles the list; not in the tab order, keeps focus in the input: `<button comboboxTrigger>`. */
@Directive({
    selector: "[comboboxTrigger]",
    exportAs: "comboboxTrigger",
    host: {
        type: "button",
        tabindex: "-1",
        "data-combobox-part": "trigger",
        "[attr.disabled]": "data().disabled",
        "[attr.aria-expanded]": "String(state().open)",
        "[attr.aria-controls]": "root.listId",
        "[attr.data-open]": "data().open",
        "[attr.data-disabled]": "data().disabled",
        "(pointerdown)": "$event.preventDefault()",
        "(click)": "onClick()",
    },
})
export class ComboboxTrigger {
    protected readonly root = inject(ComboboxRoot);
    readonly state = computed(() => ({
        open: this.root.overlay.open(),
        disabled: this.root.disabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    protected readonly String = String;

    constructor() {
        registerHost(this.root.button);
    }

    protected onClick(): void {
        const root = this.root;
        root.pendingHighlight = null;
        root.overlay.setOpen(!root.overlay.open(), "trigger-press");
        root.overlay.trigger()?.focus();
    }
}
