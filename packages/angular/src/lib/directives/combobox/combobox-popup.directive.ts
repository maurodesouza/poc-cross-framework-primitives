import { computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/** The floating container of the list (no role of its own): `<div comboboxPopup>`. */
@Directive({
    selector: "[comboboxPopup]",
    exportAs: "comboboxPopup",
    host: {
        "data-combobox-part": "popup",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
        "[attr.data-starting-style]": "data()['starting-style']",
        "[attr.data-ending-style]": "data()['ending-style']",
    },
})
export class ComboboxPopup {
    private readonly root = inject(ComboboxRoot);
    readonly state = computed(() => ({
        open: this.root.overlay.open(),
        ...this.root.placed(),
    }));
    protected readonly data = computed(() => {
        const status = this.root.overlay.presence.status();
        return dataValues({
            ...this.state(),
            "starting-style": status === "starting",
            "ending-style": status === "ending",
        });
    });

    constructor() {
        registerHost(this.root.overlay.popup);
    }
}
