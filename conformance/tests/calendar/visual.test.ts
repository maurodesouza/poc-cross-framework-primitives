import { expect, test } from "@playwright/test";
import { fullDate } from "../../src/dates.ts";
import { openScenario } from "../../src/scenario.ts";
import { expectScreen, visualOnlyInCi } from "../../src/visual.ts";

test.beforeEach(visualOnlyInCi);

const cell = (page: import("@playwright/test").Page, day: number) =>
    page.getByRole("gridcell", { name: fullDate("en-US", 2026, 11, day) });

test("calendar / single: today, then a chosen date", async ({ page }) => {
    await openScenario(page, "/calendar/single", { today: true });
    await expectScreen(page, "calendar-single");
    await cell(page, 24).click();
    await expectScreen(page, "calendar-single-chosen");
});

test("calendar / min-max: disabled dates", async ({ page }) => {
    await openScenario(page, "/calendar/min-max", { today: true });
    await expectScreen(page, "calendar-min-max");
});

test("calendar / range: a chosen range", async ({ page }) => {
    await openScenario(page, "/calendar/range", { today: true });
    await cell(page, 10).click();
    await cell(page, 15).click();
    await expectScreen(page, "calendar-range");
});

test("calendar / locale de-DE", async ({ page }) => {
    await openScenario(page, "/calendar/locale", {
        locale: "de-DE",
        today: true,
    });
    await expectScreen(page, "calendar-locale-de");
});

test("date-picker / basic: open", async ({ page }) => {
    await openScenario(page, "/date-picker/basic", { today: true });
    await page.getByRole("button", { name: "Choose date" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectScreen(page, "date-picker-open");
});
