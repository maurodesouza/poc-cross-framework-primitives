import { Directive } from "@angular/core";

/** Separates items: `<div menuSeparator>`. */
@Directive({
    selector: "[menuSeparator]",
    host: {
        role: "separator",
        "aria-orientation": "horizontal",
        "data-menu-part": "separator",
    },
})
export class MenuSeparator {}
