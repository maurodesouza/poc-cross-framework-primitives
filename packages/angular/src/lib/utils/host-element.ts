import {
    DestroyRef,
    ElementRef,
    inject,
    type WritableSignal,
} from "@angular/core";

/** The element a part's directive sits on (the consumer's own element: Angular's `render`). */
export function injectHost<T extends HTMLElement = HTMLElement>(): T {
    return inject<ElementRef<T>>(ElementRef).nativeElement;
}

/**
 * Registers the host element in its root (`trigger`, `popup`, ...) for as long as the directive
 * lives, and returns it. A later element of the same part keeps its place.
 */
export function registerHost<T extends HTMLElement = HTMLElement>(
    target: WritableSignal<HTMLElement | null>,
): T {
    const host = injectHost<T>();
    target.set(host);
    inject(DestroyRef).onDestroy(() => {
        if (target() === host) {
            target.set(null);
        }
    });
    return host;
}
