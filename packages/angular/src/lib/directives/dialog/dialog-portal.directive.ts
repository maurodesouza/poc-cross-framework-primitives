import { Directive, inject, input } from "@angular/core";
import { mountPortal, portalContainer } from "../../utils/portal.ts";
import { DialogRoot } from "./dialog-root.directive.ts";

/**
 * Moves the backdrop and the popup to the end of `body` while the dialog is open or closing:
 * `<ng-container *dialogPortal>`, or `*dialogPortal="container"` for another element.
 */
@Directive({ selector: "[dialogPortal]" })
export class DialogPortal {
    /** Where the content goes (default: `document.body`). */
    readonly container = input(null, {
        alias: "dialogPortal",
        transform: portalContainer,
    });

    constructor() {
        const root = inject(DialogRoot);
        mountPortal(root.overlay.presence.mounted, this.container);
    }
}
