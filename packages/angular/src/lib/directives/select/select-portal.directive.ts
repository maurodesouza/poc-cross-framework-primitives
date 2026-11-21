import { Directive, inject, input } from "@angular/core";
import { mountPortal, portalContainer } from "../../utils/portal.ts";
import { SelectRoot } from "./select-root.directive.ts";

/** Moves the positioner to the end of `body` while the list is open or closing. */
@Directive({ selector: "[selectPortal]" })
export class SelectPortal {
    /** Where the content goes (default: `document.body`). */
    readonly container = input(null, {
        alias: "selectPortal",
        transform: portalContainer,
    });

    constructor() {
        mountPortal(
            inject(SelectRoot).overlay.presence.mounted,
            this.container,
        );
    }
}
