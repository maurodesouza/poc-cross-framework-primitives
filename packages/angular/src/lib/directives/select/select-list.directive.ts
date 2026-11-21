import { computed, Directive, inject } from "@angular/core";
import { SelectRoot } from "./select-root.directive.ts";

/** The `listbox`, named by the trigger's labels (spec/select.md): `<div selectList>`. */
@Directive({
    selector: "[selectList]",
    exportAs: "selectList",
    host: {
        role: "listbox",
        "data-select-part": "list",
        "[attr.id]": "root.listId",
        "[attr.aria-labelledby]": "labelledBy()",
    },
})
export class SelectList {
    protected readonly root = inject(SelectRoot);
    readonly state = computed(() => ({ open: this.root.overlay.open() }));

    /** The trigger's id, read at render: the consumer's own, or the generated one. */
    protected labelledBy(): string | null {
        return this.root.overlay.trigger()?.id || null;
    }
}
