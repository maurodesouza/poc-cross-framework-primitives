import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/tabs.md
const tab = (page: Page, name: string) => page.getByRole("tab", { name });

test.describe("tabs / automatic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/tabs/automatic");
    });

    test("a tablist whose selected tab holds the roving tabindex", async ({
        page,
    }) => {
        await expect(page.getByRole("tablist")).toBeVisible();
        await expect(page.getByRole("tab")).toHaveCount(4);
        await expect(tab(page, "Account")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await expect(tab(page, "Account")).toHaveAttribute("tabindex", "0");
        for (const name of ["Password", "Billing", "Team"]) {
            await expect(tab(page, name)).toHaveAttribute(
                "aria-selected",
                "false",
            );
            await expect(tab(page, name)).toHaveAttribute("tabindex", "-1");
        }
    });

    test("the visible panel is named by its tab", async ({ page }) => {
        const panel = page.getByRole("tabpanel", { name: "Account" });
        await expect(panel).toBeVisible();
        await expect(panel).toContainText("Account settings");
    });

    test("arrows move and select, focus disabled tabs without selecting them, and wrap; Home and End", async ({
        page,
    }) => {
        await tab(page, "Account").focus();
        await page.keyboard.press("ArrowRight");
        await expect(tab(page, "Password")).toBeFocused();
        await expect(tab(page, "Password")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await expectOutput(page, "value", "password");
        await expect(
            page.getByRole("tabpanel", { name: "Password" }),
        ).toBeVisible();
        await page.keyboard.press("ArrowRight");
        await expect(tab(page, "Billing")).toBeFocused();
        await expect(tab(page, "Billing")).toHaveAttribute(
            "aria-disabled",
            "true",
        );
        await expect(tab(page, "Password")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await page.keyboard.press("ArrowRight");
        await expect(tab(page, "Team")).toBeFocused();
        await expectOutput(page, "value", "team");
        await page.keyboard.press("ArrowRight");
        await expect(tab(page, "Account")).toBeFocused();
        await page.keyboard.press("End");
        await expect(tab(page, "Team")).toBeFocused();
        await page.keyboard.press("Home");
        await expect(tab(page, "Account")).toBeFocused();
    });

    test("Tab moves from the tab list to the panel, then on", async ({
        page,
    }) => {
        await tab(page, "Account").focus();
        await page.keyboard.press("Tab");
        await expect(
            page.getByRole("tabpanel", { name: "Account" }),
        ).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(
            page.getByRole("button", { name: "After tabs" }),
        ).toBeFocused();
    });

    test("clicking a tab selects it", async ({ page }) => {
        await tab(page, "Team").click();
        await expect(tab(page, "Team")).toHaveAttribute(
            "aria-selected",
            "true",
        );
        await expectOutput(page, "value", "team");
    });

    test("has no axe violation", async ({ page }) => {
        await expectNoAxeViolations(page);
    });
});

test("tabs / manual: arrows move focus only; Enter and Space select", async ({
    page,
}) => {
    await openScenario(page, "/tabs/manual");
    await tab(page, "Account").focus();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "Password")).toBeFocused();
    await expect(tab(page, "Account")).toHaveAttribute("aria-selected", "true");
    await expectOutput(page, "value", "account");
    await page.keyboard.press("Enter");
    await expect(tab(page, "Password")).toHaveAttribute(
        "aria-selected",
        "true",
    );
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "Billing")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "Team")).toBeFocused();
    await page.keyboard.press("Space");
    await expect(tab(page, "Team")).toHaveAttribute("aria-selected", "true");
    await expectOutput(page, "value", "team");
});

test("tabs / vertical: up and down arrows; right does nothing", async ({
    page,
}) => {
    await openScenario(page, "/tabs/vertical");
    await expect(page.getByRole("tablist")).toHaveAttribute(
        "aria-orientation",
        "vertical",
    );
    await tab(page, "Account").focus();
    await page.keyboard.press("ArrowDown");
    await expect(tab(page, "Password")).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(tab(page, "Account")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "Account")).toBeFocused();
});

test("tabs / automatic in RTL: ArrowLeft is next, ArrowRight is previous", async ({
    page,
}) => {
    await openScenario(page, "/tabs/automatic", { dir: "rtl" });
    await tab(page, "Account").focus();
    await page.keyboard.press("ArrowLeft");
    await expect(tab(page, "Password")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "Account")).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "Team")).toBeFocused();
});
