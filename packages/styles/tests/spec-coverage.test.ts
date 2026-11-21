import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as styles from "../src/index.ts";

const specDir = join(import.meta.dirname, "../../../spec");

/**
 * The part names of a spec's anatomy tables: the backticked values of the part attribute column
 * (`data-calendar-part="root"` gives `root`), keyed by the table's attribute slug.
 */
function specParts(file: string): Map<string, string[]> {
    const parts = new Map<string, string[]>();
    let slug: string | null = null;
    for (const line of readFileSync(join(specDir, file), "utf8").split("\n")) {
        const header = /^\| part \| element \| `data-([a-z-]+)-part` \|/.exec(
            line,
        );
        const genericHeader = /^\| part \| element \| part attribute \|/.exec(
            line,
        );
        if (header) {
            slug = header[1] ?? null;
            continue;
        }
        if (genericHeader) {
            slug = "calendar";
            continue;
        }
        if (slug !== null && !line.startsWith("|")) {
            slug = null;
            continue;
        }
        // a hidden form input has a part attribute but no recipe (structural style only)
        if (line.split("|")[1]?.trim().startsWith("(hidden input)")) {
            continue;
        }
        const cell = slug === null ? undefined : line.split("|")[3];
        const value =
            cell === undefined
                ? undefined
                : /`(?:data-[a-z-]+-part=")?([a-z-]+)"?`/.exec(cell)?.[1];
        if (slug !== null && value !== undefined) {
            parts.set(slug, [...(parts.get(slug) ?? []), value]);
        }
    }
    return parts;
}

const RECIPES: Record<string, Record<string, string>> = {
    dialog: styles.dialog,
    popover: styles.popover,
    menu: styles.menu,
    combobox: styles.combobox,
    tabs: styles.tabs,
    calendar: styles.calendar,
    "date-picker": styles.datePicker,
    select: styles.select,
    tooltip: styles.tooltip,
    checkbox: styles.checkbox,
    "checkbox-group": styles.checkboxGroup,
    slider: styles.slider,
    field: styles.field,
};

describe("every part of the specs has a recipe", () => {
    for (const file of [
        "dialog.md",
        "popover.md",
        "menu.md",
        "combobox.md",
        "tabs.md",
        "calendar.md",
        "select.md",
        "tooltip.md",
        "checkbox.md",
        "slider.md",
        "field.md",
    ]) {
        it(file, () => {
            const parts = specParts(file);
            expect(parts.size).toBeGreaterThan(0);
            for (const [slug, names] of parts) {
                const recipe = RECIPES[slug];
                expect(recipe, slug).toBeDefined();
                expect(Object.keys(recipe ?? {}).sort()).toEqual(
                    [...new Set(names)].sort(),
                );
            }
        });
    }
});

describe("the recipes", () => {
    it("use logical properties and no !important", () => {
        for (const recipe of Object.values(RECIPES)) {
            for (const value of Object.values(recipe)) {
                expect(value).not.toMatch(/(^|\s)!|!(\s|$)/);
                expect(value).not.toMatch(
                    /(^|\s|:)(ml|mr|pl|pr|left|right|border-l|border-r|rounded-l|rounded-r)-/,
                );
            }
        }
    });
});
