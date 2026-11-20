import { describe, expect, it } from "vitest";
import { inertOutside } from "../../src/inert/inert-outside.ts";

describe("inertOutside", () => {
    it("makes the siblings of the kept element's ancestors inert, and restores them", () => {
        document.body.innerHTML = `
            <main id="main"><button id="outside">x</button></main>
            <div id="portal"><div id="dialog"></div></div>`;
        const dialog = document.getElementById("dialog") as HTMLElement;
        const restore = inertOutside([dialog]);
        expect(document.getElementById("main")?.hasAttribute("inert")).toBe(
            true,
        );
        expect(document.getElementById("portal")?.hasAttribute("inert")).toBe(
            false,
        );
        expect(dialog.hasAttribute("inert")).toBe(false);
        restore();
        expect(document.getElementById("main")?.hasAttribute("inert")).toBe(
            false,
        );
    });
});
