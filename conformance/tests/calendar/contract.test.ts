import { expect, test } from "@playwright/test";
import { expectNoFalseStates, part } from "../../src/contract.ts";
import { fullDate } from "../../src/dates.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/calendar.md: anatomy, state attributes, cell names
const cellOf = (
    page: import("@playwright/test").Page,
    month: number,
    day: number,
) =>
    page.locator(
        `[data-calendar-part="cell"][aria-label="${fullDate("en-US", 2026, month, day)}"]`,
    );

test("calendar / single: parts, six weeks, today and outside-month cells", async ({
    page,
}) => {
    await openScenario(page, "/calendar/single", { today: true });
    await expect(part(page, "calendar", "root")).toHaveCount(1);
    await expect(part(page, "calendar", "heading")).toHaveAttribute(
        "aria-live",
        "polite",
    );
    await expect(part(page, "calendar", "prev-button")).toHaveCount(1);
    await expect(part(page, "calendar", "next-button")).toHaveCount(1);
    await expect(part(page, "calendar", "grid")).toHaveCount(1);
    const headerCells = part(page, "calendar", "header-cell");
    await expect(headerCells).toHaveCount(7);
    await expect(headerCells.first()).toHaveAttribute("abbr", "Sunday");
    await expect(headerCells.first()).toHaveAttribute("scope", "col");
    await expect(part(page, "calendar", "row")).toHaveCount(6);
    await expect(part(page, "calendar", "cell")).toHaveCount(42);
    const today = cellOf(page, 11, 20);
    await expect(today).toHaveAttribute("data-today", "");
    await expect(today).toHaveAttribute("aria-current", "date");
    await expect(today).toHaveAttribute("tabindex", "0");
    const outside = page.locator(
        '[data-calendar-part="cell"][data-outside-month]',
    );
    await expect(outside).toHaveCount(12);
    await expect(outside.first()).not.toHaveAttribute("tabindex");
    await today.click();
    await expect(today).toHaveAttribute("data-selected", "");
    await expectNoFalseStates(page.locator("[data-calendar-part]"));
});

test("calendar / min-max and unavailable: disabled and unavailable cells", async ({
    page,
}) => {
    await openScenario(page, "/calendar/min-max", { today: true });
    await expect(cellOf(page, 11, 9)).toHaveAttribute("data-disabled", "");
    await expect(part(page, "calendar", "prev-button")).toHaveAttribute(
        "data-disabled",
        "",
    );
    await openScenario(page, "/calendar/unavailable", { today: true });
    await expect(cellOf(page, 11, 21)).toHaveAttribute("data-unavailable", "");
});

test("calendar / range: preview, start, end and in-range cells", async ({
    page,
}) => {
    await openScenario(page, "/calendar/range", { today: true });
    await cellOf(page, 11, 10).click();
    await cellOf(page, 11, 15).hover();
    for (const day of [10, 12, 15]) {
        await expect(cellOf(page, 11, day)).toHaveAttribute(
            "data-range-preview",
            "",
        );
    }
    await cellOf(page, 11, 15).click();
    await expect(cellOf(page, 11, 10)).toHaveAttribute("data-range-start", "");
    await expect(cellOf(page, 11, 15)).toHaveAttribute("data-range-end", "");
    await expect(cellOf(page, 11, 12)).toHaveAttribute("data-in-range", "");
    await expect(cellOf(page, 11, 16)).not.toHaveAttribute("data-in-range");
});

test("date-picker / basic: picker parts", async ({ page }) => {
    await openScenario(page, "/date-picker/basic", { today: true });
    const trigger = page.locator('[data-date-picker-part="trigger"]');
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-open", "");
    await expect(
        page.locator('[data-date-picker-part="popup"]'),
    ).toHaveAttribute("data-open", "");
    await expect(
        page.locator('[data-date-picker-part="positioner"]'),
    ).toHaveAttribute("data-side", "bottom");
});
