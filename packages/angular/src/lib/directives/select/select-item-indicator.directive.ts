import {
    computed,
    Directive,
    type EmbeddedViewRef,
    effect,
    inject,
    input,
    TemplateRef,
    untracked,
    ViewContainerRef,
} from "@angular/core";
import { SelectItem } from "./select-item.directive.ts";

/**
 * Marks the selected item, hidden from assistive technologies (spec/select.md); structural, so it
 * is rendered only while its item is selected: `<span *selectItemIndicator>✓</span>`, or
 * `*selectItemIndicator="true"` to keep it. The directive writes its attributes on the element it
 * renders.
 */
@Directive({
    selector: "[selectItemIndicator]",
    exportAs: "selectItemIndicator",
})
export class SelectItemIndicator {
    private readonly item = inject(SelectItem);
    /** Rendered while the item is not selected too. */
    readonly keepMounted = input(false, {
        alias: "selectItemIndicator",
        // `*selectItemIndicator` alone gives "": not kept
        transform: (value: unknown) => value === true || value === "true",
    });
    readonly state = computed(() => ({
        selected: this.item.state().selected,
    }));

    constructor() {
        const template = inject(TemplateRef);
        const container = inject(ViewContainerRef);
        let view: EmbeddedViewRef<unknown> | null = null;
        effect(() => {
            const show = this.state().selected || this.keepMounted();
            untracked(() => {
                if (!show) {
                    container.clear();
                    view = null;
                    return;
                }
                if (view !== null) {
                    return;
                }
                view = container.createEmbeddedView(template);
                for (const node of view.rootNodes as Node[]) {
                    if (node instanceof HTMLElement) {
                        node.setAttribute("aria-hidden", "true");
                        node.setAttribute("data-select-part", "item-indicator");
                    }
                }
            });
        });
    }
}
