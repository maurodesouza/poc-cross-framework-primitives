import { Directive, inject, input, signal } from "@angular/core";
import { labelId } from "../../utils/label-id.ts";
import { MenuGroup } from "./menu-group.directive.ts";

/** Names its Group: `<div menuGroupLabel>`. */
@Directive({
    selector: "[menuGroupLabel]",
    exportAs: "menuGroupLabel",
    host: { "data-menu-part": "group-label", "[attr.id]": "resolvedId()" },
})
export class MenuGroupLabel {
    readonly id = input<string | undefined>(undefined);
    protected readonly resolvedId = labelId(
        this.id,
        inject(MenuGroup, { optional: true })?.labelId ?? signal(undefined),
        "poc-menu-group-label",
    );
}
