import { Directive, inject, input } from "@angular/core";
import { labelId } from "../../utils/label-id.ts";
import { PopoverRoot } from "./popover-root.directive.ts";

/** The popover's description (its id becomes the popup's `aria-describedby`): `<p popoverDescription>`. */
@Directive({
    selector: "[popoverDescription]",
    exportAs: "popoverDescription",
    host: { "data-popover-part": "description", "[attr.id]": "resolvedId()" },
})
export class PopoverDescription {
    readonly id = input<string | undefined>(undefined);
    protected readonly resolvedId = labelId(
        this.id,
        inject(PopoverRoot).descriptionId,
        "poc-popover-description",
    );
}
