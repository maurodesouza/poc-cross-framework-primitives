import { ElementRef } from "@angular/core";
import { describe, expect, it } from "vitest";
import { menuItems } from "../src/lib/directives/menu/menu-items.ts";
import { resolveFocusTarget } from "../src/lib/utils/change-details.ts";
import { portalContainer } from "../src/lib/utils/portal.ts";
import { dataValue, dataValues } from "../src/lib/utils/state-attributes.ts";

describe("dataValue", () => {
    it("gives an empty attribute for true, none (null) for false, and strings as values", () => {
        expect(dataValue(true)).toBe("");
        expect(dataValue(false)).toBeNull();
        expect(dataValue(undefined)).toBeNull();
        expect(dataValue("end")).toBe("end");
        expect(
            dataValues({ open: true, disabled: false, side: "top" }),
        ).toEqual({ open: "", disabled: null, side: "top" });
    });
});

describe("resolveFocusTarget", () => {
    it("takes an element, an ElementRef, a getter or false", () => {
        const element = document.createElement("button");
        expect(resolveFocusTarget(element)).toBe(element);
        expect(resolveFocusTarget(new ElementRef(element))).toBe(element);
        expect(resolveFocusTarget(() => element)).toBe(element);
        expect(resolveFocusTarget(false)).toBe(false);
        expect(resolveFocusTarget(undefined)).toBeNull();
    });
});

describe("portalContainer", () => {
    it("reads `*xPortal` alone as the default container", () => {
        const element = document.createElement("div");
        expect(portalContainer("")).toBeNull();
        expect(portalContainer(element)).toBe(element);
    });
});

describe("menuItems", () => {
    it("lists a level's own items, not its submenu's", () => {
        document.body.innerHTML = `<div role="menu" id="root"><div role="menuitem">A</div><div><div role="menu"><div role="menuitem">B</div></div></div><div role="menuitem">C</div></div>`;
        const popup = document.getElementById("root") as HTMLElement;
        expect(menuItems(popup).map((item) => item.textContent)).toEqual([
            "A",
            "C",
        ]);
    });
});
