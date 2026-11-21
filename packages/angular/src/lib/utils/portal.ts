import {
    DestroyRef,
    type EmbeddedViewRef,
    effect,
    inject,
    type Signal,
    TemplateRef,
    untracked,
    ViewContainerRef,
} from "@angular/core";

/**
 * The structural portal (spec/README.md, API mapping: Angular): renders the directive's template
 * while `mounted()` is true, and moves its nodes to the end of `container()` (default:
 * `document.body`), as React's `createPortal`. The view stays in its declaration's change
 * detection and injectors; Angular inserts later nodes next to their anchors, which moved with it,
 * and removes the nodes wherever they are when it clears the view. When the portal itself is
 * destroyed with an enclosing view (a submenu's portal inside its parent's popup), Angular only
 * detaches that view's own root nodes, so the portal removes the nodes it moved.
 */
export function mountPortal(
    mounted: Signal<boolean>,
    container: Signal<Element | null>,
): void {
    const template = inject(TemplateRef);
    const viewContainer = inject(ViewContainerRef);
    let view: EmbeddedViewRef<unknown> | null = null;
    let moved: Node[] = [];
    inject(DestroyRef).onDestroy(() => {
        for (const node of moved) {
            node.parentNode?.removeChild(node);
        }
        moved = [];
    });
    effect(() => {
        const show = mounted();
        const target = container() ?? document.body;
        untracked(() => {
            if (show && view === null) {
                view = viewContainer.createEmbeddedView(template);
                moved = [...(view.rootNodes as Node[])];
                for (const node of moved) {
                    target.appendChild(node);
                }
            } else if (!show && view !== null) {
                viewContainer.clear();
                view = null;
                moved = [];
            }
        });
    });
}

/**
 * The portal's input transform: `*dialogPortal` alone gives `""` (the default container), and
 * `*dialogPortal="element"` that element.
 */
export function portalContainer(
    value: Element | string | null | undefined,
): Element | null {
    return value instanceof Element ? value : null;
}
