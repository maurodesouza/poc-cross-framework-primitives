import { Directive, inject, input } from "@angular/core";
import { mountPortal, portalContainer } from "../../utils/portal.ts";
import { DATE_PICKER } from "./date-picker-state.ts";

/** Moves the positioner to the end of `body` while the picker is open or closing. */
@Directive({ selector: "[datePickerPortal]" })
export class DatePickerPortal {
    /** Where the content goes (default: `document.body`). */
    readonly container = input(null, {
        alias: "datePickerPortal",
        transform: portalContainer,
    });

    constructor() {
        mountPortal(
            inject(DATE_PICKER).overlay.presence.mounted,
            this.container,
        );
    }
}
