import { afterRenderEffect, Directive, inject, untracked } from "@angular/core";
import { injectHost } from "../../utils/host-element.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/**
 * A polite live region, always rendered; its children are shown only while the list is empty
 * (spec/combobox.md): `<div comboboxEmpty>No fruit found.</div>`. A live region must exist before
 * its text changes, so the element stays and the directive takes its child nodes out, keeping
 * them (and Angular's bindings in them) until the list is empty again.
 */
@Directive({
    selector: "[comboboxEmpty]",
    host: {
        role: "status",
        "aria-live": "polite",
        "aria-atomic": "true",
        "data-combobox-part": "empty",
    },
})
export class ComboboxEmpty {
    private readonly root = inject(ComboboxRoot);

    constructor() {
        const host = injectHost();
        const kept = document.createDocumentFragment();
        afterRenderEffect({
            write: () => {
                const empty = this.root.empty();
                untracked(() => {
                    if (empty) {
                        host.append(kept);
                    } else {
                        kept.append(...host.childNodes);
                    }
                });
            },
        });
    }
}
