import { Directive, inject, input } from "@angular/core";
import { mountPortal, portalContainer } from "../../utils/portal.ts";
import { MenuRoot } from "./menu-root.directive.ts";

/** Moves a menu level's positioner to the end of `body` while it is open or closing. */
@Directive({ selector: "[menuPortal]" })
export class MenuPortal {
    /** Where the content goes (default: `document.body`). */
    readonly container = input(null, {
        alias: "menuPortal",
        transform: portalContainer,
    });

    constructor() {
        mountPortal(inject(MenuRoot).overlay.presence.mounted, this.container);
    }
}
