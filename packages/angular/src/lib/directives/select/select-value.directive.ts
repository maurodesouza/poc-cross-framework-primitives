import { computed, Directive, inject, input } from "@angular/core";
import { dataValues } from "../../utils/state-attributes.ts";
import { SelectRoot } from "./select-root.directive.ts";

/**
 * The selected item's label, or the placeholder (spec/select.md): `<span selectValue
 * placeholder="Choose a fruit">`. The directive writes the text (one text node, as React's).
 */
@Directive({
    selector: "[selectValue]",
    exportAs: "selectValue",
    host: {
        "data-select-part": "value",
        "[attr.data-placeholder]": "data().placeholder",
        "[textContent]": "text()",
    },
})
export class SelectValue {
    private readonly root = inject(SelectRoot);
    /** Shown while nothing is selected. */
    readonly placeholder = input("");
    private readonly label = computed(
        () =>
            this.root
                .items()
                .find((item) => item.value === this.root.selected())?.label,
    );
    readonly state = computed(() => ({
        placeholder: this.label() === undefined,
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    protected readonly text = computed(
        () => this.label() ?? this.placeholder(),
    );
}
