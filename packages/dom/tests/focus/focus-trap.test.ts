import { afterEach, describe, expect, it } from "vitest";
import { focusInitial, trapFocus } from "../../src/focus/focus-trap.ts";
import {
    getTabbables,
    nextTabbableAfter,
    previousTabbableBefore,
} from "../../src/focus/tabbable.ts";

afterEach(() => {
    document.body.innerHTML = "";
});

function setup() {
    document.body.innerHTML = `
        <button id="before">before</button>
        <div id="box" tabindex="-1">
            <input id="name" />
            <button id="save">save</button>
            <button id="hidden" hidden>hidden</button>
            <button id="disabled" disabled>disabled</button>
            <button id="close">close</button>
        </div>
        <button id="after">after</button>`;
    return document.getElementById("box") as HTMLElement;
}

const tab = (shiftKey = false) =>
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
            key: "Tab",
            shiftKey,
            cancelable: true,
        }),
    );

describe("focus", () => {
    it("lists the tabbable elements in order", () => {
        const box = setup();
        expect(getTabbables(box).map((element) => element.id)).toEqual([
            "name",
            "save",
            "close",
        ]);
    });

    it("finds the next tabbable element after another, skipping containers", () => {
        const box = setup();
        const before = document.getElementById("before") as HTMLElement;
        expect(nextTabbableAfter(before, [box])?.id).toBe("after");
        const after = document.getElementById("after") as HTMLElement;
        expect(previousTabbableBefore(after, [box])?.id).toBe("before");
    });

    it("focuses the initial element or the first tabbable one", () => {
        const box = setup();
        focusInitial(box);
        expect(document.activeElement?.id).toBe("name");
        focusInitial(box, document.getElementById("close"));
        expect(document.activeElement?.id).toBe("close");
    });

    it("wraps Tab and Shift+Tab at the ends", () => {
        const box = setup();
        const release = trapFocus(box);
        (document.getElementById("close") as HTMLElement).focus();
        tab();
        expect(document.activeElement?.id).toBe("name");
        tab(true);
        expect(document.activeElement?.id).toBe("close");
        release();
    });

    it("pulls focus back when it escapes", () => {
        const box = setup();
        const release = trapFocus(box);
        (document.getElementById("after") as HTMLElement).focus();
        expect(document.activeElement?.id).toBe("name");
        release();
    });
});
