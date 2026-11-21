import type { Signal } from "@angular/core";
import {
    DialogRoot,
    type DialogState,
} from "../directives/dialog/dialog-root.directive.ts";
import type { ChangeReason } from "../utils/change-details.ts";
import { injectEnclosing } from "./enclosing.ts";

/**
 * The part hook of the enclosing `[dialogRoot]` (spec/README.md, API mapping: Angular): its state,
 * and a way to open or close it, for a component of the consumer's inside the dialog.
 */
export function injectDialog(): {
    state: Signal<DialogState>;
    setOpen: (open: boolean, reason?: ChangeReason) => void;
} {
    const root = injectEnclosing(DialogRoot, "dialogRoot", "injectDialog");
    return {
        state: root.state,
        setOpen: (open, reason = "none") => root.overlay.setOpen(open, reason),
    };
}
