import { Directive, signal } from "@angular/core";

/** Groups items under its GroupLabel: `<div menuGroup>`. */
@Directive({
    selector: "[menuGroup]",
    exportAs: "menuGroup",
    host: {
        role: "group",
        "data-menu-part": "group",
        "[attr.aria-labelledby]": "labelId() ?? null",
    },
})
export class MenuGroup {
    readonly labelId = signal<string | undefined>(undefined);
}
