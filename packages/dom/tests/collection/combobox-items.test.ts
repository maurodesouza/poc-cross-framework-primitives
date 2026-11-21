import { describe, expect, it } from "vitest";
import {
    containsFilter,
    filterItems,
    flattenItems,
    itemFormValue,
    itemLabel,
    queryIsLabel,
    textContains,
    toggleItem,
} from "../../src/collection/combobox-items.ts";

const label = (item: unknown) => itemLabel(item);

describe("itemLabel and itemFormValue", () => {
    it("read an object's label and value, or the item itself", () => {
        const fruit = { value: "banana", label: "Banana" };
        expect(itemLabel(fruit)).toBe("Banana");
        expect(itemFormValue(fruit)).toBe("banana");
        expect(itemLabel({ value: 3 })).toBe("3");
        expect(itemLabel("Kraków")).toBe("Kraków");
        expect(itemFormValue("Kraków")).toBe("Kraków");
        expect(itemFormValue({ code: "BR" })).toBe('{"code":"BR"}');
        expect(itemLabel(null)).toBe("");
        expect(itemFormValue(null)).toBe("");
    });

    it("use the consumer's functions first", () => {
        const country = { code: "BR", name: "Brazil" };
        expect(itemLabel(country, (entry) => entry.name)).toBe("Brazil");
        expect(itemFormValue(country, (entry) => entry.code)).toBe("BR");
    });
});

describe("textContains", () => {
    it("ignores case, accents and punctuation", () => {
        expect(textContains("São Paulo", "sao")).toBe(true);
        expect(textContains("Zürich", "ZUR")).toBe(true);
        expect(textContains("Montréal", "real")).toBe(true);
        expect(textContains("Bogotá", "x")).toBe(false);
        expect(textContains("anything", "")).toBe(true);
    });
});

describe("queryIsLabel", () => {
    it("is the label, ignoring case", () => {
        expect(queryIsLabel("Banana", "banana")).toBe(true);
        expect(queryIsLabel("Banana", "Ban")).toBe(false);
        expect(queryIsLabel("Banana", "")).toBe(false);
    });
});

describe("filterItems", () => {
    const cities = ["Bogotá", "Brasília", "Kraków", "Málaga", "São Paulo"];
    const options = {
        filter: containsFilter(),
        limit: -1,
        itemToString: label,
    };

    it("keeps the matching items, within the limit", () => {
        expect(filterItems(cities, "sao", options)).toEqual(["São Paulo"]);
        expect(filterItems(cities, "", { ...options, limit: 2 })).toEqual([
            "Bogotá",
            "Brasília",
        ]);
        expect(filterItems(cities, "a", { ...options, limit: 3 })).toEqual([
            "Bogotá",
            "Brasília",
            "Kraków",
        ]);
        expect(filterItems(cities, "x", { ...options, filter: null })).toEqual(
            cities,
        );
    });

    it("keeps the groups with a match, counting the limit across them", () => {
        const groups = [
            { label: "A", items: ["Apple", "Cherry"] },
            { label: "B", items: ["Carrot", "Potato"] },
        ];
        expect(filterItems(groups, "c", options)).toEqual([
            { label: "A", items: ["Cherry"] },
            { label: "B", items: ["Carrot"] },
        ]);
        expect(filterItems(groups, "pot", options)).toEqual([
            { label: "B", items: ["Potato"] },
        ]);
        expect(filterItems(groups, "", { ...options, limit: 3 })).toEqual([
            { label: "A", items: ["Apple", "Cherry"] },
            { label: "B", items: ["Carrot"] },
        ]);
        expect(flattenItems(groups)).toEqual([
            "Apple",
            "Cherry",
            "Carrot",
            "Potato",
        ]);
    });
});

describe("toggleItem", () => {
    it("adds a new item at the end and removes an existing one", () => {
        const byCode = (a: { code: string }, b: { code: string }) =>
            a.code === b.code;
        const br = { code: "BR" };
        expect(toggleItem([br], { code: "DE" }, byCode)).toEqual([
            br,
            { code: "DE" },
        ]);
        expect(toggleItem([br], { code: "BR" }, byCode)).toEqual([]);
        expect(toggleItem(["a", "b"], "a")).toEqual(["b"]);
    });
});
