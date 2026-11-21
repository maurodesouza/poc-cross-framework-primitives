import { Directive, inject, input } from "@angular/core";
import { labelId } from "../../utils/label-id.ts";
import { DialogRoot } from "./dialog-root.directive.ts";

/** Describes the dialog (its id becomes the popup's `aria-describedby`): `<p dialogDescription>`. */
@Directive({
    selector: "[dialogDescription]",
    exportAs: "dialogDescription",
    host: { "data-dialog-part": "description", "[attr.id]": "resolvedId()" },
})
export class DialogDescription {
    readonly id = input<string | undefined>(undefined);
    protected readonly resolvedId = labelId(
        this.id,
        inject(DialogRoot).descriptionId,
        "poc-dialog-description",
    );
}
