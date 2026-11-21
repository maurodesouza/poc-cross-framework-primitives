import { Directive } from "@angular/core";

/** A polite live region for the consumer's text (spec/combobox.md): `<div comboboxStatus>`. */
@Directive({
    selector: "[comboboxStatus]",
    host: {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true",
        "data-combobox-part": "status",
    },
})
export class ComboboxStatus {}
