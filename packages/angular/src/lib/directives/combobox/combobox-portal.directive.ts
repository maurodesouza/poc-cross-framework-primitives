import { Directive, inject, input } from "@angular/core";
import { mountPortal, portalContainer } from "../../utils/portal.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/** Moves the positioner to the end of `body` while the list is open or closing: `*comboboxPortal`. */
@Directive({ selector: "[comboboxPortal]" })
export class ComboboxPortal {
    /** Where the content goes (default: `document.body`). */
    readonly container = input(null, {
        alias: "comboboxPortal",
        transform: portalContainer,
    });

    constructor() {
        mountPortal(
            inject(ComboboxRoot).overlay.presence.mounted,
            this.container,
        );
    }
}
