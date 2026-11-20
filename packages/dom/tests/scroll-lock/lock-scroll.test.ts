import { describe, expect, it } from "vitest";
import { lockScroll } from "../../src/scroll-lock/lock-scroll.ts";

describe("lockScroll", () => {
    it("locks once for nested locks and restores after the last unlock", () => {
        const root = document.documentElement;
        const unlockA = lockScroll(document);
        const unlockB = lockScroll(document);
        expect(root.style.overflow).toBe("hidden");
        unlockA();
        unlockA();
        expect(root.style.overflow).toBe("hidden");
        unlockB();
        expect(root.style.overflow).toBe("");
    });
});
