import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { fullDate, monthHeading, shortWeekday } from "../../src/dates.ts";
import { baselineDeviation } from "../../src/deviation.ts";
import { expectFocusWithin } from "../../src/focus.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/calendar.md — today is fixed at 2026-11-20 (a Friday)
//
// A cell is found by the full date its name contains: the spec's name is exactly the full date,
// the contract layer checks that, and the behaviour layer only needs to find the cell (React Aria
// adds "Today, " and ", selected" around it). A cell is looked up in the grid of its month when
// two months are visible, since the outside-month days of one grid repeat the dates of the other.
const cell = (
    page: Page,
    month: number,
    day: number,
    year = 2026,
    locale = "en-US",
) =>
    page.getByRole("gridcell", {
        name: dateName(fullDate(locale, year, month, day)),
    });

/**
 * A cell name that ends with the full date, allowing a trailing note with no digit in it, so it
 * can never be another date (React Aria appends " selected" and ", First available date").
 */
function dateName(full: string): RegExp {
    const escaped = full.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|, )${escaped}([ ,][^0-9]*)?$`);
}
const grid = (page: Page, year: number, month: number, locale = "en-US") =>
    page.getByRole("grid", {
        name: monthHeading(locale, year, month),
        exact: true,
    });

/** Puts focus on the grid's focused date, the way a keyboard user enters it. */
async function tabIntoGrid(page: Page) {
    await page.getByRole("button", { name: "Next month" }).focus();
    await page.keyboard.press("Tab");
}

test.describe("calendar / single", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/calendar/single", { today: true });
    });

    test("a grid named by its month, with locale weekday headers", async ({
        page,
    }) => {
        baselineDeviation(
            "React Aria hides the weekday header row from assistive technologies (spec/calendar.md, Baseline deviations)",
        );
        await expect(grid(page, 2026, 11)).toBeVisible();
        const headers = page.getByRole("columnheader");
        await expect(headers).toHaveCount(7);
        await expect(headers.first()).toHaveText(
            shortWeekday("en-US", 2026, 11, 1),
        );
    });

    test("today holds the tab stop", async ({ page }) => {
        await tabIntoGrid(page);
        await expectFocusWithin(cell(page, 11, 20));
    });

    test("today is marked as the current date", async ({ page }) => {
        baselineDeviation(
            'React Aria names today\'s cell "Today, ..." instead of setting aria-current="date" (spec/calendar.md, Baseline deviations)',
        );
        await expect(cell(page, 11, 20)).toHaveAttribute(
            "aria-current",
            "date",
        );
    });

    test("arrows move the focused date across weeks and months", async ({
        page,
    }) => {
        await tabIntoGrid(page);
        await page.keyboard.press("ArrowRight");
        await expectFocusWithin(cell(page, 11, 21));
        await page.keyboard.press("ArrowDown");
        await expectFocusWithin(cell(page, 11, 28));
        await page.keyboard.press("ArrowDown");
        await expectFocusWithin(cell(page, 12, 5));
        await expect(grid(page, 2026, 12)).toBeVisible();
        await page.keyboard.press("ArrowUp");
        await expectFocusWithin(cell(page, 11, 28));
        await expect(grid(page, 2026, 11)).toBeVisible();
    });

    test("Home and End move to the start and end of the week", async ({
        page,
    }) => {
        baselineDeviation(
            "React Aria's Home and End go to the start and end of the month, not of the week (spec/calendar.md, Baseline deviations)",
        );
        await tabIntoGrid(page);
        await page.keyboard.press("ArrowDown");
        await expectFocusWithin(cell(page, 11, 27));
        await page.keyboard.press("Home");
        await expectFocusWithin(cell(page, 11, 22));
        await page.keyboard.press("End");
        await expectFocusWithin(cell(page, 11, 28));
    });

    test("PageUp/PageDown move by month, with Shift by year", async ({
        page,
    }) => {
        await tabIntoGrid(page);
        await page.keyboard.press("ArrowDown");
        await expectFocusWithin(cell(page, 11, 27));
        await page.keyboard.press("ArrowRight");
        await expectFocusWithin(cell(page, 11, 28));
        await page.keyboard.press("PageDown");
        await expectFocusWithin(cell(page, 12, 28));
        await page.keyboard.press("PageUp");
        await expectFocusWithin(cell(page, 11, 28));
        await page.keyboard.press("Shift+PageDown");
        await expectFocusWithin(cell(page, 11, 28, 2027));
        await expect(grid(page, 2027, 11)).toBeVisible();
        await page.keyboard.press("Shift+PageUp");
        await expectFocusWithin(cell(page, 11, 28));
    });

    test("Enter chooses the focused date", async ({ page }) => {
        await tabIntoGrid(page);
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowRight");
        await expectFocusWithin(cell(page, 11, 28));
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "2026-11-28");
        await expect(cell(page, 11, 28)).toHaveAttribute(
            "aria-selected",
            "true",
        );
    });

    test("next month keeps focus on the button; outside-month days cannot be chosen", async ({
        page,
    }) => {
        const next = page.getByRole("button", { name: "Next month" });
        await next.click();
        await expect(grid(page, 2026, 12)).toBeVisible();
        await expect(next).toBeFocused();
        const outside = cell(page, 1, 2, 2027);
        await expect(outside).toHaveAttribute("aria-disabled", "true");
        await outside.click({ force: true });
        await expectOutput(page, "value", "none");
        await cell(page, 12, 3).click();
        await expectOutput(page, "value", "2026-12-03");
    });

    test("has no axe violation", async ({ page }) => {
        await expectNoAxeViolations(page);
    });
});

test.describe("calendar / min-max", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/calendar/min-max", { today: true });
    });

    test("dates outside the bounds are disabled and cannot be chosen", async ({
        page,
    }) => {
        await expect(cell(page, 11, 9)).toHaveAttribute(
            "aria-disabled",
            "true",
        );
        await cell(page, 11, 9).click({ force: true });
        await expectOutput(page, "value", "none");
    });

    test("previous month is disabled at the lower bound, next at the upper bound", async ({
        page,
    }) => {
        await expect(
            page.getByRole("button", { name: "Previous month" }),
        ).toBeDisabled();
        const next = page.getByRole("button", { name: "Next month" });
        await expect(next).toBeEnabled();
        await next.click();
        await expect(grid(page, 2026, 12)).toBeVisible();
        await expect(next).toBeDisabled();
        await expect(cell(page, 12, 6)).toHaveAttribute(
            "aria-disabled",
            "true",
        );
    });

    test("the keyboard cannot move past the lower bound", async ({ page }) => {
        await cell(page, 11, 10).click();
        await expectFocusWithin(cell(page, 11, 10));
        await page.keyboard.press("ArrowLeft");
        await expectFocusWithin(cell(page, 11, 10));
    });
});

test("calendar / unavailable: weekends can be focused but not chosen", async ({
    page,
}) => {
    await openScenario(page, "/calendar/unavailable", { today: true });
    await expect(cell(page, 11, 21)).toHaveAttribute("aria-disabled", "true");
    await tabIntoGrid(page);
    await page.keyboard.press("ArrowRight");
    await expectFocusWithin(cell(page, 11, 21));
    await page.keyboard.press("Enter");
    await expectOutput(page, "value", "none");
});

test("calendar / locale de-DE: German weekday headers, Monday first", async ({
    page,
}) => {
    baselineDeviation(
        "React Aria hides the weekday header row from assistive technologies (spec/calendar.md, Baseline deviations)",
    );
    await openScenario(page, "/calendar/locale", {
        locale: "de-DE",
        today: true,
    });
    await expect(page.getByRole("columnheader").first()).toHaveText(
        shortWeekday("de-DE", 2026, 11, 16),
    );
});

test("calendar / locale de-DE: German names, Monday first", async ({
    page,
}) => {
    await openScenario(page, "/calendar/locale", {
        locale: "de-DE",
        today: true,
    });
    await expect(grid(page, 2026, 11, "de-DE")).toBeVisible();
    const firstCell = page.getByRole("gridcell").first();
    await expect(firstCell).toHaveAccessibleName(
        new RegExp(fullDate("de-DE", 2026, 10, 26)),
    );
    await tabIntoGrid(page);
    await expectFocusWithin(cell(page, 11, 20, 2026, "de-DE"));
});

test("calendar / locale de-DE: Home goes to Monday", async ({ page }) => {
    baselineDeviation(
        "React Aria's Home goes to the start of the month, not of the week (spec/calendar.md, Baseline deviations)",
    );
    await openScenario(page, "/calendar/locale", {
        locale: "de-DE",
        today: true,
    });
    await tabIntoGrid(page);
    await expectFocusWithin(cell(page, 11, 20, 2026, "de-DE"));
    await page.keyboard.press("Home");
    await expectFocusWithin(cell(page, 11, 16, 2026, "de-DE"));
});

test("calendar / rtl he-IL: ArrowLeft is the next day", async ({ page }) => {
    await openScenario(page, "/calendar/rtl", {
        locale: "he-IL",
        dir: "rtl",
        today: true,
    });
    await tabIntoGrid(page);
    await expectFocusWithin(cell(page, 11, 20, 2026, "he-IL"));
    await page.keyboard.press("ArrowLeft");
    await expectFocusWithin(cell(page, 11, 21, 2026, "he-IL"));
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await expectFocusWithin(cell(page, 11, 19, 2026, "he-IL"));
});

test("calendar / two-months: two named grids; arrows cross them; next pages by two", async ({
    page,
}) => {
    await openScenario(page, "/calendar/two-months", { today: true });
    await expect(grid(page, 2026, 11)).toBeVisible();
    await expect(grid(page, 2026, 12)).toBeVisible();
    await grid(page, 2026, 11)
        .getByRole("gridcell", { name: fullDate("en-US", 2026, 11, 30) })
        .click();
    await page.keyboard.press("ArrowRight");
    await expectFocusWithin(
        grid(page, 2026, 12).getByRole("gridcell", {
            name: fullDate("en-US", 2026, 12, 1),
        }),
    );
    await expect(grid(page, 2026, 11)).toBeVisible();
    await page.getByRole("button", { name: "Next month" }).click();
    await expect(grid(page, 2027, 1)).toBeVisible();
    await expect(grid(page, 2027, 2)).toBeVisible();
});

test.describe("calendar / range", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/calendar/range", { today: true });
    });

    test("two clicks choose a range", async ({ page }) => {
        await expect(page.getByRole("grid")).toHaveAttribute(
            "aria-multiselectable",
            "true",
        );
        await cell(page, 11, 10).click();
        await cell(page, 11, 15).click();
        await expectOutput(page, "value", "2026-11-10..2026-11-15");
        for (const day of [10, 12, 15]) {
            await expect(cell(page, 11, day)).toHaveAttribute(
                "aria-selected",
                "true",
            );
        }
    });

    test("an end before the start swaps them", async ({ page }) => {
        await cell(page, 11, 18).click();
        await cell(page, 11, 12).click();
        await expectOutput(page, "value", "2026-11-12..2026-11-18");
    });

    test("the keyboard chooses a range", async ({ page }) => {
        baselineDeviation(
            "React Aria's RangeCalendar moved the focus one day forward when Enter started the range (spec/calendar.md, Baseline deviations)",
        );
        await tabIntoGrid(page);
        await expectFocusWithin(cell(page, 11, 20));
        await page.keyboard.press("Enter");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("ArrowRight");
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "2026-11-20..2026-11-22");
    });

    test("Escape cancels a started range", async ({ page }) => {
        await cell(page, 11, 24).click();
        await page.keyboard.press("Escape");
        await cell(page, 11, 26).click();
        await expectOutput(page, "value", "none");
    });
});

test.describe("date-picker / basic", () => {
    const trigger = (page: Page) =>
        page.getByRole("button", { name: "Choose date" });

    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/date-picker/basic", { today: true });
    });

    test("the trigger opens a dialog focused on today", async ({ page }) => {
        await expect(trigger(page)).toHaveAttribute("aria-haspopup", "dialog");
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
        await trigger(page).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(grid(page, 2026, 11)).toBeVisible();
        await expectFocusWithin(cell(page, 11, 20));
    });

    test("choosing a date closes and focuses the trigger; reopening focuses the value", async ({
        page,
    }) => {
        await trigger(page).click();
        await expectFocusWithin(cell(page, 11, 20));
        for (let index = 0; index < 4; index++) {
            await page.keyboard.press("ArrowRight");
        }
        await expectFocusWithin(cell(page, 11, 24));
        await page.keyboard.press("Enter");
        await expectOutput(page, "value", "2026-11-24");
        await expect(page.getByRole("dialog")).toBeHidden();
        await expect(trigger(page)).toBeFocused();
        await trigger(page).click();
        await expectFocusWithin(cell(page, 11, 24));
    });

    test("Escape closes and focuses the trigger", async ({ page }) => {
        await trigger(page).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toBeHidden();
        await expect(trigger(page)).toBeFocused();
    });

    test("an outside press closes", async ({ page }) => {
        await trigger(page).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await page.mouse.click(600, 600);
        await expect(page.getByRole("dialog")).toBeHidden();
    });

    test("has no axe violation while open", async ({ page }) => {
        await trigger(page).click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

test("date-picker / range: closes after the end date", async ({ page }) => {
    await openScenario(page, "/date-picker/range", { today: true });
    const trigger = page.getByRole("button", { name: "Choose dates" });
    await trigger.click();
    await cell(page, 11, 10).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await cell(page, 11, 13).click();
    await expectOutput(page, "value", "2026-11-10..2026-11-13");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
});
