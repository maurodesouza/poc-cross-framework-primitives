const TABBABLE = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "iframe",
    "audio[controls]",
    "video[controls]",
    "[contenteditable]:not([contenteditable='false'])",
    "[tabindex]",
].join(",");

function isVisible(element: HTMLElement): boolean {
    if (element.hidden || element.closest("[inert]") !== null) {
        return false;
    }
    const view = element.ownerDocument.defaultView;
    const style = view?.getComputedStyle(element);
    return style?.visibility !== "hidden" && style?.display !== "none";
}

/** The elements of `container` that Tab reaches, in tab order (positive tabindex first). */
export function getTabbables(container: Element): HTMLElement[] {
    const candidates = [
        ...container.querySelectorAll<HTMLElement>(TABBABLE),
    ].filter((element) => element.tabIndex >= 0 && isVisible(element));
    const positive = candidates
        .filter((element) => element.tabIndex > 0)
        .sort((a, b) => a.tabIndex - b.tabIndex);
    return [
        ...positive,
        ...candidates.filter((element) => element.tabIndex === 0),
    ];
}

/** The first tabbable element of the document after `element` in tab order, outside `skip`. */
export function nextTabbableAfter(
    element: Element,
    skip: readonly (Element | null | undefined)[] = [],
): HTMLElement | null {
    const all = getTabbables(element.ownerDocument.body).filter(
        (candidate) =>
            !skip.some((container) => container?.contains(candidate) === true),
    );
    return (
        all.find(
            (candidate) =>
                element.compareDocumentPosition(candidate) &
                    Node.DOCUMENT_POSITION_FOLLOWING &&
                !element.contains(candidate),
        ) ?? null
    );
}

/** The last tabbable element of the document before `element` in tab order, outside `skip`. */
export function previousTabbableBefore(
    element: Element,
    skip: readonly (Element | null | undefined)[] = [],
): HTMLElement | null {
    const all = getTabbables(element.ownerDocument.body).filter(
        (candidate) =>
            !skip.some((container) => container?.contains(candidate) === true),
    );
    return (
        all
            .filter(
                (candidate) =>
                    element.compareDocumentPosition(candidate) &
                        Node.DOCUMENT_POSITION_PRECEDING &&
                    !candidate.contains(element),
            )
            .at(-1) ?? null
    );
}
