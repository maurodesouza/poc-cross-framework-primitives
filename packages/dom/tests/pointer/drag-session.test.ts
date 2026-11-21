import { describe, expect, it, vi } from "vitest";
import { startDrag } from "../../src/pointer/drag-session.ts";
import { isInHoverBridge } from "../../src/pointer/hover-bridge.ts";

function pointer(type: string, pointerId: number, clientX = 0): PointerEvent {
    const event = new MouseEvent(type, { bubbles: true, clientX });
    Object.defineProperty(event, "pointerId", { value: pointerId });
    return event as PointerEvent;
}

describe("startDrag", () => {
    it("follows its pointer's moves until pointer up", () => {
        const element = document.createElement("div");
        document.body.append(element);
        const onMove = vi.fn();
        const onEnd = vi.fn();
        startDrag(element, pointer("pointerdown", 1), { onMove, onEnd });
        window.dispatchEvent(pointer("pointermove", 1, 10));
        window.dispatchEvent(pointer("pointermove", 2, 20));
        expect(onMove).toHaveBeenCalledOnce();
        window.dispatchEvent(pointer("pointerup", 1));
        expect(onEnd).toHaveBeenCalledOnce();
        window.dispatchEvent(pointer("pointermove", 1, 30));
        expect(onMove).toHaveBeenCalledOnce();
    });

    it("ends once when the cleanup runs", () => {
        const element = document.createElement("div");
        const onEnd = vi.fn();
        const end = startDrag(element, pointer("pointerdown", 1), {
            onMove: () => {},
            onEnd,
        });
        end();
        end();
        expect(onEnd).toHaveBeenCalledExactlyOnceWith(null);
    });
});

function at(left: number, top: number, width: number, height: number) {
    return {
        getBoundingClientRect: () => ({
            left,
            top,
            right: left + width,
            bottom: top + height,
        }),
    } as Element;
}

describe("isInHoverBridge", () => {
    it("covers the trigger, the popup and the gap between them", () => {
        const trigger = at(100, 100, 60, 30);
        const popup = at(90, 40, 120, 50);
        expect(isInHoverBridge({ x: 130, y: 95 }, trigger, popup)).toBe(true);
        expect(isInHoverBridge({ x: 130, y: 115 }, trigger, popup)).toBe(true);
        expect(isInHoverBridge({ x: 400, y: 300 }, trigger, popup)).toBe(false);
    });
});
