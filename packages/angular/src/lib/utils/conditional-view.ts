import {
    type EmbeddedViewRef,
    effect,
    inject,
    type Signal,
    signal,
    TemplateRef,
    untracked,
    ViewContainerRef,
} from "@angular/core";

/**
 * A structural part's view (spec/README.md, API mapping: Angular, "a part rendered only in some
 * states is structural"): renders the directive's template while `show()` is true, in its
 * directive's injection context, and returns the element it rendered (`null` while hidden), on
 * which the directive writes its attributes and listens. `setup` runs on each element it renders,
 * before it is shown.
 */
export function conditionalView(
    show: Signal<boolean>,
    setup?: (element: HTMLElement) => void,
): Signal<HTMLElement | null> {
    const template = inject(TemplateRef);
    const container = inject(ViewContainerRef);
    const element = signal<HTMLElement | null>(null);
    let view: EmbeddedViewRef<unknown> | null = null;
    effect(() => {
        const shown = show();
        untracked(() => {
            if (!shown) {
                container.clear();
                view = null;
                element.set(null);
                return;
            }
            if (view !== null) {
                return;
            }
            view = container.createEmbeddedView(template);
            const rendered =
                (view.rootNodes as Node[]).find(
                    (node): node is HTMLElement => node instanceof HTMLElement,
                ) ?? null;
            if (rendered !== null) {
                setup?.(rendered);
            }
            element.set(rendered);
        });
    });
    return element.asReadonly();
}

/** Writes `attributes` on `element` (`null` removes one). */
export function writeAttributes(
    element: HTMLElement,
    attributes: Record<string, string | null>,
): void {
    for (const [name, value] of Object.entries(attributes)) {
        if (value === null) {
            element.removeAttribute(name);
        } else {
            element.setAttribute(name, value);
        }
    }
}
