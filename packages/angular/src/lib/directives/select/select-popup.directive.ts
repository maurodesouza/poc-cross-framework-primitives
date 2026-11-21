import { computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { SelectRoot } from "./select-root.directive.ts";

/** The floating container of the list (no role of its own; spec/select.md): `<div selectPopup>`. */
@Directive({
    selector: "[selectPopup]",
    exportAs: "selectPopup",
    host: {
        "data-select-part": "popup",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
        "[attr.data-starting-style]": "data()['starting-style']",
        "[attr.data-ending-style]": "data()['ending-style']",
    },
})
export class SelectPopup {
    private readonly root = inject(SelectRoot);
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
