import type { Point } from "./safe-area.ts";

/**
 * Whether `point` is over `trigger`, over `popup`, or in the box that spans both (the gap the
 * pointer crosses from a tooltip's trigger to its popup: spec/tooltip.md, "Pointer").
 */
export function isInHoverBridge(
    point: Point,
    trigger: Element,
    popup: Element,
): boolean {
    const a = trigger.getBoundingClientRect();
    const b = popup.getBoundingClientRect();
    const left = Math.min(a.left, b.left);
    const right = Math.max(a.right, b.right);
    const top = Math.min(a.top, b.top);
    const bottom = Math.max(a.bottom, b.bottom);
    return (
        point.x >= left &&
        point.x <= right &&
        point.y >= top &&
        point.y <= bottom
    );
}
