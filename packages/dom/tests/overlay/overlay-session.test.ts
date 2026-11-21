import { afterEach, describe, expect, it, vi } from "vitest";
import { openOverlaySession } from "../../src/overlay/overlay-session.ts";

afterEach(() => {
    document.body.innerHTML = "";
});

function setup() {
    document.body.innerHTML = `<button id="trigger">t</button><div id="popup"><button id="inside">i</button></div><button id="outside">o</button>`;
    const get = (id: string) => document.getElementById(id) as HTMLElement;
    return {
        trigger: get("trigger"),
        popup: get("popup"),
        inside: get("inside"),
        outside: get("outside"),
    };
}

describe("openOverlaySession", () => {
    it("dismisses on Escape and outside presses, not on the trigger", () => {
        const { trigger, popup, outside } = setup();
        const dismiss = vi.fn();
        const session = openOverlaySession(document, {
            elements: () => [popup],
            ignore: () => [trigger],
            dismiss,
        });
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        trigger.dispatchEvent(
            new PointerEvent("pointerdown", { bubbles: true }),
        );
        outside.dispatchEvent(
            new PointerEvent("pointerdown", { bubbles: true }),
        );
        expect(dismiss.mock.calls).toEqual([["escape-key"], ["outside-press"]]);
        session.end();
    });

    it("dismisses when focus leaves, if asked", () => {
        const { trigger, popup, inside, outside } = setup();
        const dismiss = vi.fn();
        const session = openOverlaySession(document, {
            elements: () => [popup],
            dismiss,
            focusOut: () => [trigger],
        });
        inside.focus();
        trigger.focus();
        expect(dismiss).not.toHaveBeenCalled();
        outside.focus();
        expect(dismiss).toHaveBeenCalledWith("focus-out");
        session.end();
    });

    it("returns focus on end only for the listed reasons, once", () => {
        const { trigger, popup, outside } = setup();
        let reason: string | null = "outside-press";
        const session = () =>
            openOverlaySession(document, {
                elements: () => [popup],
                dismiss: () => {},
                returnFocus: {
                    when: new Set(["escape-key"]),
                    reason: () => reason,
                    to: () => trigger,
                },
            });
        outside.focus();
        session().end();
        expect(document.activeElement).toBe(outside);
        reason = "escape-key";
        const second = session();
        second.end();
        expect(document.activeElement).toBe(trigger);
        outside.focus();
        second.end();
        expect(document.activeElement).toBe(outside);
    });
});
