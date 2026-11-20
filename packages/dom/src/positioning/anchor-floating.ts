import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift,
    size,
} from "@floating-ui/dom";
import { getDirection } from "../direction/direction.ts";
import {
    type Align,
    fromPlacement,
    type Side,
    toPlacement,
} from "./placement.ts";

export interface AnchorOptions {
    side?: Side;
    align?: Align;
    /** Distance from the anchor, in px. */
    sideOffset?: number;
    /** Shift along the anchor's edge, in px. */
    alignOffset?: number;
    /** Space kept from the viewport's edges when flipping and shifting, in px. */
    collisionPadding?: number;
    /** An arrow element inside the floating element, placed along its edge. */
    arrow?: HTMLElement | null;
    /** Called after every placement with the side and align it ended up on. */
    onPlaced?: (placed: { side: Side; align: Align }) => void;
}

/**
 * Keeps `floating` next to `anchor` (spec/popover.md, "Positioning"): flip, shift, logical sides,
 * and it follows scroll and resize until the returned function is called. It writes structural
 * inline style only (`position`, `top`, `left`), the CSS variables `--anchor-width`,
 * `--anchor-height`, `--available-width`, `--available-height`, `--transform-origin`, and the
 * arrow's offset.
 */
export function anchorFloating(
    anchor: Element,
    floating: HTMLElement,
    options: AnchorOptions = {},
): () => void {
    const {
        side = "bottom",
        align = "center",
        sideOffset = 0,
        alignOffset = 0,
        collisionPadding = 8,
    } = options;
    floating.style.position = "fixed";
    floating.style.top = "0";
    floating.style.left = "0";

    const update = async () => {
        const direction = getDirection(anchor);
        const middleware = [
            offset({ mainAxis: sideOffset, alignmentAxis: alignOffset }),
            flip({ padding: collisionPadding }),
            shift({ padding: collisionPadding }),
            size({
                padding: collisionPadding,
                apply({ availableWidth, availableHeight, rects }) {
                    floating.style.setProperty(
                        "--available-width",
                        `${availableWidth}px`,
                    );
                    floating.style.setProperty(
                        "--available-height",
                        `${availableHeight}px`,
                    );
                    floating.style.setProperty(
                        "--anchor-width",
                        `${rects.reference.width}px`,
                    );
                    floating.style.setProperty(
                        "--anchor-height",
                        `${rects.reference.height}px`,
                    );
                },
            }),
        ];
        if (options.arrow) {
            middleware.push(arrow({ element: options.arrow, padding: 4 }));
        }
        const result = await computePosition(anchor, floating, {
            strategy: "fixed",
            placement: toPlacement(side, align, direction),
            middleware,
        });
        floating.style.left = `${result.x}px`;
        floating.style.top = `${result.y}px`;
        const placed = fromPlacement(result.placement, direction);
        floating.style.setProperty(
            "--transform-origin",
            transformOrigin(result.placement),
        );
        const arrowData = result.middlewareData.arrow;
        if (options.arrow && arrowData) {
            const physical = result.placement.split("-")[0];
            const style = options.arrow.style;
            style.position = "absolute";
            style.left = arrowData.x != null ? `${arrowData.x}px` : "";
            style.top = arrowData.y != null ? `${arrowData.y}px` : "";
            const edge = {
                top: "bottom",
                bottom: "top",
                left: "right",
                right: "left",
            }[physical as "top" | "bottom" | "left" | "right"];
            style.setProperty(edge, `${-options.arrow.offsetWidth / 2}px`);
        }
        options.onPlaced?.(placed);
    };

    return autoUpdate(anchor, floating, () => {
        void update();
    });
}

function transformOrigin(placement: string): string {
    const [physical, edge] = placement.split("-");
    const cross = edge === "start" ? "0%" : edge === "end" ? "100%" : "50%";
    switch (physical) {
        case "top":
            return `${cross} 100%`;
        case "bottom":
            return `${cross} 0%`;
        case "left":
            return `100% ${cross}`;
        default:
            return `0% ${cross}`;
    }
}
