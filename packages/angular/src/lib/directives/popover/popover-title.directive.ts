import { Directive, inject, input } from "@angular/core";
import { labelId } from "../../utils/label-id.ts";
import { PopoverRoot } from "./popover-root.directive.ts";

/** The popover's title (its id becomes the popup's `aria-labelledby`): `<h2 popoverTitle>`. */
@Directive({
    selector: "[popoverTitle]",
    exportAs: "popoverTitle",
    host: { "data-popover-part": "title", "[attr.id]": "resolvedId()" },
})
export class PopoverTitle {
    readonly id = input<string | undefined>(undefined);
    protected readonly resolvedId = labelId(
        this.id,
        inject(PopoverRoot).titleId,
        "poc-popover-title",
    );
}
