import { computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/** Holds the Input and its buttons; anchors the list (spec/combobox.md): `<div comboboxInputGroup>`. */
@Directive({
    selector: "[comboboxInputGroup]",
    exportAs: "comboboxInputGroup",
    host: {
        role: "group",
        "data-combobox-part": "input-group",
        "[attr.data-open]": "data().open",
        "[attr.data-disabled]": "data().disabled",
        "(mousedown)": "root.pressToOpen($event)",
    },
})
export class ComboboxInputGroup {
    protected readonly root = inject(ComboboxRoot);
    readonly state = computed(() => ({
        open: this.root.overlay.open(),
        disabled: this.root.isDisabled(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        registerHost(this.root.inputGroup);
    }
}
