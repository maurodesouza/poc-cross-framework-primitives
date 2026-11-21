import type { Signal } from "@angular/core";
import {
    PopoverRoot,
    type PopoverState,
} from "../directives/popover/popover-root.directive.ts";
import type { ChangeReason } from "../utils/change-details.ts";
import { injectEnclosing } from "./enclosing.ts";

/** The part hook of the enclosing `[popoverRoot]`: its state, and a way to open or close it. */
export function injectPopover(): {
    state: Signal<PopoverState>;
    setOpen: (open: boolean, reason?: ChangeReason) => void;
} {
    const root = injectEnclosing(PopoverRoot, "popoverRoot", "injectPopover");
    return {
        state: root.state,
        setOpen: (open, reason = "none") => root.overlay.setOpen(open, reason),
    };
}
