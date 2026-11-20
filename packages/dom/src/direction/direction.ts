export type Direction = "ltr" | "rtl";

/** The element's writing direction, from its computed style (falls back to `ltr`). */
export function getDirection(element: Element): Direction {
    const view = element.ownerDocument.defaultView;
    const value = view?.getComputedStyle(element).direction;
    return value === "rtl" ? "rtl" : "ltr";
}
