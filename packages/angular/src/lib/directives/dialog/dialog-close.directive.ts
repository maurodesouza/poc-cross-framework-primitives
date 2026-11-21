import { Directive, inject } from "@angular/core";
import { DialogRoot } from "./dialog-root.directive.ts";

/** Closes the dialog (reason `close-press`): `<button dialogClose>`. */
@Directive({
    selector: "[dialogClose]",
    exportAs: "dialogClose",
    host: {
        type: "button",
        "data-dialog-part": "close",
        "(click)": "root.overlay.setOpen(false, 'close-press')",
    },
})
export class DialogClose {
    protected readonly root = inject(DialogRoot);
}
