import { Directive, inject, input } from "@angular/core";
import { labelId } from "../../utils/label-id.ts";
import { DialogRoot } from "./dialog-root.directive.ts";

/** Names the dialog (its id becomes the popup's `aria-labelledby`): `<h2 dialogTitle>`. */
@Directive({
    selector: "[dialogTitle]",
    exportAs: "dialogTitle",
    host: { "data-dialog-part": "title", "[attr.id]": "resolvedId()" },
})
export class DialogTitle {
    readonly id = input<string | undefined>(undefined);
    protected readonly resolvedId = labelId(
        this.id,
        inject(DialogRoot).titleId,
        "poc-dialog-title",
    );
}
