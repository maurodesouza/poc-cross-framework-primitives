import type { Placement } from "@floating-ui/dom";
import type { Direction } from "../direction/direction.ts";

/** A logical side (spec/README.md, `data-side`). */
export type Side = "top" | "bottom" | "start" | "end";
export type Align = "start" | "center" | "end";

/** The Floating UI placement of a logical side and align, in a direction. */
export function toPlacement(
    side: Side,
    align: Align,
    direction: Direction,
): Placement {
    const physical =
        side === "start"
            ? direction === "rtl"
                ? "right"
                : "left"
            : side === "end"
              ? direction === "rtl"
                  ? "left"
                  : "right"
              : side;
    if (align === "center") {
        return physical;
    }
    // Floating UI's -start/-end follow the physical axis: on top/bottom, -start is the left edge
    const flipAlign =
        direction === "rtl" && (physical === "top" || physical === "bottom");
    const physicalAlign = flipAlign
        ? align === "start"
            ? "end"
            : "start"
        : align;
    return `${physical}-${physicalAlign}`;
}

/** The logical side and align of a resolved Floating UI placement. */
export function fromPlacement(
    placement: Placement,
    direction: Direction,
): { side: Side; align: Align } {
    const [physical, edge] = placement.split("-") as [
        string,
        "start" | "end" | undefined,
    ];
    const side: Side =
        physical === "left"
            ? direction === "rtl"
                ? "end"
                : "start"
            : physical === "right"
              ? direction === "rtl"
                  ? "start"
                  : "end"
              : (physical as Side);
    if (edge === undefined) {
        return { side, align: "center" };
    }
    const flipAlign =
        direction === "rtl" && (physical === "top" || physical === "bottom");
    return {
        side,
        align: flipAlign ? (edge === "start" ? "end" : "start") : edge,
    };
}
