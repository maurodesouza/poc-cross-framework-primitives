import {
    afterRenderEffect,
    computed,
    Directive,
    inject,
    untracked,
} from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/** The `listbox`: `<div comboboxList>`. Applies the highlight the keyboard asked for once its items render. */
@Directive({
    selector: "[comboboxList]",
    exportAs: "comboboxList",
    host: {
        role: "listbox",
        "data-combobox-part": "list",
        "[attr.id]": "root.listId",
        "[attr.data-empty]": "data().empty",
    },
})
export class ComboboxList {
    protected readonly root = inject(ComboboxRoot);
    readonly state = computed(() => ({ empty: this.root.itemCount() === 0 }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const root = this.root;
        registerHost(root.list);
        afterRenderEffect(() => {
            const list = root.list();
            root.itemCount();
            untracked(() => {
                const pending = root.pendingHighlight;
                if (list === null || pending === null) {
                    return;
                }
                root.pendingHighlight = null;
                const items = root.orderedItems();
                const selected = items.find(
                    (item) => item.value === root.selected(),
                );
                const target =
                    selected ?? (pending === "first" ? items[0] : items.at(-1));
                root.highlighted.set(target?.value ?? null);
            });
        });
    }
}
