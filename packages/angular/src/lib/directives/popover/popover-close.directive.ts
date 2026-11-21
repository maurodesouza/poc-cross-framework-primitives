import { Directive, inject } from "@angular/core";
import { PopoverRoot } from "./popover-root.directive.ts";

/** Closes the popover (reason `close-press`): `<button popoverClose>`. */
@Directive({
    selector: "[popoverClose]",
    exportAs: "popoverClose",
    host: {
        type: "button",
        "data-popover-part": "close",
        "(click)": "root.overlay.setOpen(false, 'close-press')",
    },
})
export class PopoverClose {
    protected readonly root = inject(PopoverRoot);
}
