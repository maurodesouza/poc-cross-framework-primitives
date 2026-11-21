import {
    afterRenderEffect,
    computed,
    Directive,
    inject,
    untracked,
} from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import {
    type ComboboxItemValue,
    ComboboxRoot,
} from "./combobox-root.directive.ts";

/**
 * The `listbox`: `<div comboboxList #list="comboboxList">`. With the Root's `items`, its
 * `entries()` are the matching items, or groups with their matching items: the consumer renders
 * them with `@for (entry of list.entries(); ...)` (the List's render function in Angular).
 * Applies the highlight the keyboard asked for once its items render.
 */
@Directive({
    selector: "[comboboxList]",
    exportAs: "comboboxList",
    host: {
        role: "listbox",
        "data-combobox-part": "list",
        "[attr.id]": "root.listId",
        "[attr.aria-multiselectable]": "root.multiple() ? 'true' : null",
        "[attr.data-empty]": "data().empty",
    },
})
export class ComboboxList {
    protected readonly root = inject(ComboboxRoot);
    /** The matching entries (with the Root's `items`). */
    readonly entries = computed<readonly ComboboxItemValue[]>(() =>
        this.root.entries(),
    );
    readonly state = computed(() => ({ empty: this.root.empty() }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const root = this.root;
        registerHost(root.list);
        afterRenderEffect(() => {
            const list = root.list();
            const pending = root.pendingHighlight();
            root.itemCount();
            if (list === null || pending === null) {
                return;
            }
            untracked(() => {
                // the rendered options register after the list: wait for every one of them
                if (!root.itemsRegistered()) {
                    return;
                }
                root.pendingHighlight.set(null);
                const items = root.orderedItems();
                const selected = root.multiple()
                    ? undefined
                    : items.find((item) => root.isSelected(item.value));
                const edge = pending === "first" ? items[0] : items.at(-1);
                const target =
                    selected ?? (pending === "selected" ? undefined : edge);
                root.highlighted.set(target?.id ?? null);
            });
        });
    }
}
