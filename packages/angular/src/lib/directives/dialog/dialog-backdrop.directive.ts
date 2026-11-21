import { computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { DialogRoot } from "./dialog-root.directive.ts";

export interface DialogBackdropState {
    open: boolean;
}

/** The layer behind the popup: `<div dialogBackdrop>`. */
@Directive({
    selector: "[dialogBackdrop]",
    exportAs: "dialogBackdrop",
    host: {
        "aria-hidden": "true",
        "data-dialog-part": "backdrop",
        "[attr.data-open]": "data().open",
        "[attr.data-starting-style]": "data()['starting-style']",
        "[attr.data-ending-style]": "data()['ending-style']",
    },
})
export class DialogBackdrop {
    private readonly root = inject(DialogRoot);
    readonly state = computed<DialogBackdropState>(() => ({
        open: this.root.overlay.open(),
    }));
    protected readonly data = computed(() => {
        const status = this.root.overlay.presence.status();
        return dataValues({
            open: this.state().open,
            "starting-style": status === "starting",
            "ending-style": status === "ending",
        });
    });

    constructor() {
        registerHost(this.root.backdrop);
    }
}
