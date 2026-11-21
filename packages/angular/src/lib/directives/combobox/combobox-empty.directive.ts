import { Directive } from "@angular/core";

/** What the consumer shows when no item matches (it renders it only then): `<div comboboxEmpty>`. */
@Directive({
    selector: "[comboboxEmpty]",
    host: { "data-combobox-part": "empty" },
})
export class ComboboxEmpty {}
