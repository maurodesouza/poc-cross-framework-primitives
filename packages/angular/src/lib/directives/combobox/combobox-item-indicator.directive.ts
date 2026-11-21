import { computed, Directive, inject, input } from "@angular/core";
import {
    conditionalView,
    writeAttributes,
} from "../../utils/conditional-view.ts";
import { ComboboxItem } from "./combobox-item.directive.ts";

/**
 * Marks a selected item, hidden from assistive technologies (spec/combobox.md); structural, so it
 * is rendered only while its item is selected: `<span *comboboxItemIndicator>✓</span>`, or
 * `*comboboxItemIndicator="true"` to keep it. The directive writes its attributes on the element
 * it renders.
 */
@Directive({
    selector: "[comboboxItemIndicator]",
    exportAs: "comboboxItemIndicator",
})
export class ComboboxItemIndicator {
    private readonly item = inject(ComboboxItem);
    /** Rendered while the item is not selected too. */
    readonly keepMounted = input(false, {
        alias: "comboboxItemIndicator",
        // `*comboboxItemIndicator` alone gives "": not kept
        transform: (value: unknown) => value === true || value === "true",
    });
    readonly state = computed(() => ({
        selected: this.item.state().selected,
    }));

    constructor() {
        conditionalView(
            computed(() => this.state().selected || this.keepMounted()),
            (element) =>
                writeAttributes(element, {
                    "aria-hidden": "true",
                    "data-combobox-part": "item-indicator",
                }),
        );
    }
}
