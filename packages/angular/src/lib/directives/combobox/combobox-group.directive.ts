import { Directive } from "@angular/core";
import { createId } from "@poc/dom";

/** A `group` of items, named by its GroupLabel (spec/combobox.md): `<div comboboxGroup>`. */
@Directive({
    selector: "[comboboxGroup]",
    exportAs: "comboboxGroup",
    host: {
        role: "group",
        "data-combobox-part": "group",
        "[attr.aria-labelledby]": "labelId",
    },
})
export class ComboboxGroup {
    /** Its GroupLabel's id. */
    readonly labelId = `${createId("poc-combobox-group")}-label`;
}
