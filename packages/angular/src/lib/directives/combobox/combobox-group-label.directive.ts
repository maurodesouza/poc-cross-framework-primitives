import { Directive } from "@angular/core";
import { injectEnclosing } from "../../inject/enclosing.ts";
import { ComboboxGroup } from "./combobox-group.directive.ts";

/** Names its Group: `<div comboboxGroupLabel>`. */
@Directive({
    selector: "[comboboxGroupLabel]",
    host: {
        "data-combobox-part": "group-label",
        "[attr.id]": "group.labelId",
    },
})
export class ComboboxGroupLabel {
    protected readonly group = injectEnclosing(
        ComboboxGroup,
        "comboboxGroup",
        "ComboboxGroupLabel",
    );
}
