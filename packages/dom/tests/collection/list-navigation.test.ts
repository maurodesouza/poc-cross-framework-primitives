import { describe, expect, it } from "vitest";
import { edgeIndex, stepIndex } from "../../src/collection/list-navigation.ts";
import { createTypeahead } from "../../src/collection/typeahead.ts";

describe("stepIndex", () => {
    it("moves, wraps and starts from nothing", () => {
        expect(stepIndex(4, 0, 1)).toBe(1);
        expect(stepIndex(4, 3, 1)).toBe(0);
        expect(stepIndex(4, 0, -1)).toBe(3);
        expect(stepIndex(4, -1, 1)).toBe(0);
        expect(stepIndex(4, -1, -1)).toBe(3);
        expect(stepIndex(0, -1, 1)).toBe(-1);
    });

    it("stops at the ends without loop, and skips", () => {
        expect(stepIndex(4, 3, 1, { loop: false })).toBe(3);
        const skip = (index: number) => index === 1;
        expect(stepIndex(4, 0, 1, { skip })).toBe(2);
        expect(stepIndex(2, 0, 1, { skip: () => true })).toBe(0);
        expect(edgeIndex(4, "first", (index) => index === 0)).toBe(1);
        expect(edgeIndex(4, "last")).toBe(3);
    });
});

describe("typeahead", () => {
    const labels = ["Edit", "Duplicate", "Archive", "Delete"];

    it("cycles through items starting with a repeated character", () => {
        const typeahead = createTypeahead();
        expect(typeahead.match("d", labels, 0, 1000)).toBe(1);
        expect(typeahead.match("d", labels, 1, 1100)).toBe(3);
        expect(typeahead.match("d", labels, 3, 1200)).toBe(1);
    });

    it("accumulates characters typed quickly and resets after the timeout", () => {
        const typeahead = createTypeahead(500);
        expect(typeahead.match("d", labels, 0, 1000)).toBe(1);
        expect(typeahead.match("e", labels, 1, 1100)).toBe(3);
        expect(typeahead.match("a", labels, 3, 2000)).toBe(2);
        expect(typeahead.match("Shift", labels, 2, 2100)).toBe(-1);
    });
});
