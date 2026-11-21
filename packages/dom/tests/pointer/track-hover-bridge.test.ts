import { describe, expect, it, vi } from "vitest";
import { trackHoverBridge } from "../../src/pointer/track-hover-bridge.ts";

function box(element: Element, left: number, top: number, size: number) {
    element.getBoundingClientRect = () =>
        ({
            left,
            top,
            right: left + size,
            bottom: top + size,
            width: size,
            height: size,
        }) as DOMRect;
}

function move(target: Element, x: number, y: number) {
    const event = new MouseEvent("pointermove", {
        bubbles: true,
        clientX: x,
        clientY: y,
    });
    target.dispatchEvent(event);
}

describe("trackHoverBridge", () => {
    it("reports moves inside the bridge of trigger and popup, and outside it", () => {
        const trigger = document.createElement("button");
        const popup = document.createElement("div");
        document.body.append(trigger, popup);
        box(trigger, 0, 100, 20);
        box(popup, 0, 0, 40);
        const inside = vi.fn();
        const outside = vi.fn();
        const stop = trackHoverBridge(trigger, popup, { inside, outside });

        move(document.body, 30, 70); // the gap between them
        expect(inside).toHaveBeenCalledOnce();
        move(document.body, 300, 300);
        expect(outside).toHaveBeenCalledOnce();

        stop();
        move(document.body, 300, 300);
        expect(outside).toHaveBeenCalledOnce();
        trigger.remove();
        popup.remove();
    });

    it("uses the trigger alone while there is no popup", () => {
        const trigger = document.createElement("button");
        const other = document.createElement("div");
        document.body.append(trigger, other);
        const inside = vi.fn();
        const outside = vi.fn();
        const stop = trackHoverBridge(trigger, null, { inside, outside });
        move(trigger, 0, 0);
        move(other, 0, 0);
        expect(inside).toHaveBeenCalledOnce();
        expect(outside).toHaveBeenCalledOnce();
        stop();
        trigger.remove();
        other.remove();
    });
});
