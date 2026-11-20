import { afterEach, describe, expect, it, vi } from "vitest";
import { pushLayer } from "../../src/layers/layer-stack.ts";

function element(): HTMLElement {
    const node = document.createElement("div");
    document.body.append(node);
    return node;
}

afterEach(() => {
    document.body.innerHTML = "";
});

describe("the layer stack", () => {
    it("sends Escape to the topmost layer only", () => {
        const parent = { onEscape: vi.fn() };
        const child = { onEscape: vi.fn() };
        const a = pushLayer(document, {
            elements: () => [element()],
            ...parent,
        });
        const b = pushLayer(document, {
            elements: () => [element()],
            ...child,
        });
        expect(b.isTop()).toBe(true);
        expect(a.elementsAbove()).toHaveLength(1);
        expect(b.elementsAbove()).toEqual([]);
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        expect(child.onEscape).toHaveBeenCalledTimes(1);
        expect(parent.onEscape).not.toHaveBeenCalled();
        b.remove();
        expect(a.isTop()).toBe(true);
        a.remove();
    });

    it("dismisses each layer a press is outside of, from the top, until one contains it", () => {
        const dialog = element();
        const popover = element();
        const outsideDialog = vi.fn();
        const outsidePopover = vi.fn();
        const a = pushLayer(document, {
            elements: () => [dialog],
            onOutsidePress: outsideDialog,
        });
        const b = pushLayer(document, {
            elements: () => [popover],
            onOutsidePress: outsidePopover,
        });
        dialog.dispatchEvent(
            new PointerEvent("pointerdown", { bubbles: true }),
        );
        expect(outsidePopover).toHaveBeenCalledTimes(1);
        expect(outsideDialog).not.toHaveBeenCalled();
        document.body.dispatchEvent(
            new PointerEvent("pointerdown", { bubbles: true }),
        );
        expect(outsideDialog).toHaveBeenCalledTimes(1);
        b.remove();
        a.remove();
    });

    it("ignores presses on the layer's ignored elements", () => {
        const popup = element();
        const trigger = element();
        const onOutsidePress = vi.fn();
        const layer = pushLayer(document, {
            elements: () => [popup],
            ignore: () => [trigger],
            onOutsidePress,
        });
        trigger.dispatchEvent(
            new PointerEvent("pointerdown", { bubbles: true }),
        );
        expect(onOutsidePress).not.toHaveBeenCalled();
        layer.remove();
    });
});
