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
import { CheckboxRoot, checkedAttributes } from "./checkbox-root.directive.ts";

/**
 * The check or the dash, hidden from assistive technologies (spec/checkbox.md); structural, so
 * it is rendered only while checked or indeterminate: `<span *checkboxIndicator>✓</span>`, or
 * `*checkboxIndicator="true"` to keep it in every state. Read the state through the root
 * (`#box="checkboxRoot"`, `box.state().indeterminate`). The directive writes its attributes on
 * the element it renders.
 */
@Directive({ selector: "[checkboxIndicator]", exportAs: "checkboxIndicator" })
export class CheckboxIndicator {
    private readonly root = inject(CheckboxRoot);
    /** Rendered in every state, not only while checked or indeterminate. */
    readonly keepMounted = input(false, {
        alias: "checkboxIndicator",
        // `*checkboxIndicator` alone gives "": not kept
        transform: (value: unknown) => value === true || value === "true",
    });
    readonly state = computed(() => this.root.state());

    constructor() {
        const template = inject(TemplateRef);
        const container = inject(ViewContainerRef);
        let view: EmbeddedViewRef<unknown> | null = null;
        effect(() => {
            const state = this.state();
            const show =
                state.checked || state.indeterminate || this.keepMounted();
            untracked(() => {
                if (!show) {
                    container.clear();
                    view = null;
                    return;
                }
                view ??= container.createEmbeddedView(template);
                const attributes: Record<string, string | null> = {
                    "aria-hidden": "true",
                    "data-checkbox-part": "indicator",
                    ...Object.fromEntries(
                        Object.entries(checkedAttributes(state)).map(
                            ([key, value]) => [`data-${key}`, value],
                        ),
                    ),
                };
                for (const node of view.rootNodes as Node[]) {
                    if (!(node instanceof HTMLElement)) {
                        continue;
                    }
                    for (const [name, value] of Object.entries(attributes)) {
                        if (value === null) {
                            node.removeAttribute(name);
                        } else {
                            node.setAttribute(name, value);
                        }
                    }
                }
            });
        });
    }
}
