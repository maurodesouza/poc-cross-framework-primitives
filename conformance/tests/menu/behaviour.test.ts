import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { expectOutput } from "../../src/output.ts";
import { openScenario } from "../../src/scenario.ts";

// spec/menu.md
const item = (page: Page, name: string) => page.getByRole("menuitem", { name });

test.describe("menu / basic", () => {
    const trigger = (page: Page) =>
        page.getByRole("button", { name: "Actions" });
    const menu = (page: Page) => page.getByRole("menu", { name: "Actions" });

    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/menu/basic");
    });

    test("the trigger announces a menu", async ({ page }) => {
        await expect(trigger(page)).toHaveAttribute("aria-haspopup", "menu");
        await expect(trigger(page)).toHaveAttribute("aria-expanded", "false");
    });

    test("ArrowDown opens on the first item; arrows reach disabled items and wrap; Home and End", async ({
        page,
    }) => {
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await expect(menu(page)).toBeVisible();
        await expect(item(page, "Edit")).toBeFocused();
        await page.keyboard.press("ArrowDown");
        await expect(item(page, "Duplicate")).toBeFocused();
        await page.keyboard.press("ArrowDown");
        await expect(item(page, "Archive")).toBeFocused();
        await page.keyboard.press("ArrowDown");
        await expect(item(page, "Delete")).toBeFocused();
        await page.keyboard.press("ArrowDown");
        await expect(item(page, "Edit")).toBeFocused();
        await page.keyboard.press("ArrowUp");
        await expect(item(page, "Delete")).toBeFocused();
        await page.keyboard.press("Home");
        await expect(item(page, "Edit")).toBeFocused();
        await page.keyboard.press("End");
        await expect(item(page, "Delete")).toBeFocused();
    });

    test("a disabled item is marked aria-disabled and cannot be activated", async ({
        page,
    }) => {
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await expect(item(page, "Archive")).toHaveAttribute(
            "aria-disabled",
            "true",
        );
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("ArrowDown");
        await expect(item(page, "Archive")).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(menu(page)).toBeVisible();
        await expectOutput(page, "action", "none");
    });

    test("typeahead moves to the next item starting with the typed character", async ({
        page,
    }) => {
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await expect(item(page, "Edit")).toBeFocused();
        await page.keyboard.press("d");
        await expect(item(page, "Duplicate")).toBeFocused();
        await page.waitForTimeout(600);
        await page.keyboard.press("d");
        await expect(item(page, "Delete")).toBeFocused();
    });

    test("Enter activates the item, closes and focuses the trigger", async ({
        page,
    }) => {
        await trigger(page).focus();
        await page.keyboard.press("ArrowUp");
        await expect(item(page, "Delete")).toBeFocused();
        await page.keyboard.press("Enter");
        await expectOutput(page, "action", "Delete");
        await expect(menu(page)).toBeHidden();
        await expectOutput(page, "reason", "item-press");
        await expect(trigger(page)).toBeFocused();
    });

    test("Escape closes and focuses the trigger", async ({ page }) => {
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await expect(menu(page)).toBeVisible();
        await page.keyboard.press("Escape");
        await expect(menu(page)).toBeHidden();
        await expectOutput(page, "reason", "escape-key");
        await expect(trigger(page)).toBeFocused();
    });

    test("Tab closes and moves to the element after the trigger", async ({
        page,
    }) => {
        await trigger(page).focus();
        await page.keyboard.press("ArrowDown");
        await expect(menu(page)).toBeVisible();
        await page.keyboard.press("Tab");
        await expect(menu(page)).toBeHidden();
        await expect(
            page.getByRole("button", { name: "After menu" }),
        ).toBeFocused();
    });

    test("hovering highlights an item, clicking activates it", async ({
        page,
    }) => {
        await trigger(page).click();
        await expect(menu(page)).toBeVisible();
        await item(page, "Duplicate").hover();
        await expect(item(page, "Duplicate")).toBeFocused();
        await item(page, "Duplicate").click();
        await expectOutput(page, "action", "Duplicate");
        await expect(menu(page)).toBeHidden();
    });

    test("the separator is a separator", async ({ page }) => {
        await trigger(page).click();
        await expect(menu(page).getByRole("separator")).toHaveCount(1);
    });

    test("has no axe violation while open", async ({ page }) => {
        await trigger(page).click();
        await expect(menu(page)).toBeVisible();
        await expectNoAxeViolations(page);
    });
});

async function openShare(page: Page) {
    await page.getByRole("button", { name: "File" }).focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await expect(item(page, "Share")).toBeFocused();
}

test.describe("menu / submenu", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/menu/submenu");
    });

    test("ArrowRight opens the submenu on its first item; ArrowLeft closes it", async ({
        page,
    }) => {
        await openShare(page);
        await expect(item(page, "Share")).toHaveAttribute(
            "aria-haspopup",
            "menu",
        );
        await expect(item(page, "Share")).toHaveAttribute(
            "aria-expanded",
            "false",
        );
        await page.keyboard.press("ArrowRight");
        await expect(page.getByRole("menu", { name: "Share" })).toBeVisible();
        await expect(item(page, "Email")).toBeFocused();
        await expect(item(page, "Share")).toHaveAttribute(
            "aria-expanded",
            "true",
        );
        await page.keyboard.press("ArrowLeft");
        await expect(page.getByRole("menu", { name: "Share" })).toBeHidden();
        await expect(item(page, "Share")).toBeFocused();
        await expect(page.getByRole("menu", { name: "File" })).toBeVisible();
    });

    test("Escape closes one level at a time", async ({ page }) => {
        await openShare(page);
        await page.keyboard.press("ArrowRight");
        await expect(item(page, "Email")).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("menu", { name: "Share" })).toBeHidden();
        await expect(page.getByRole("menu", { name: "File" })).toBeVisible();
        await expect(item(page, "Share")).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(page.getByRole("menu", { name: "File" })).toBeHidden();
        await expect(page.getByRole("button", { name: "File" })).toBeFocused();
    });

    test("activating a submenu item closes every level", async ({ page }) => {
        await openShare(page);
        await page.keyboard.press("ArrowRight");
        await expect(item(page, "Email")).toBeFocused();
        await page.keyboard.press("ArrowDown");
        await expect(item(page, "Link")).toBeFocused();
        await page.keyboard.press("Enter");
        await expectOutput(page, "action", "Link");
        await expect(page.getByRole("menu")).toHaveCount(0);
        await expect(page.getByRole("button", { name: "File" })).toBeFocused();
    });

    test("the pointer can cross sibling items on its way to the submenu", async ({
        page,
    }) => {
        await page.getByRole("button", { name: "File" }).click();
        await item(page, "Share").hover();
        const submenu = page.getByRole("menu", { name: "Share" });
        await expect(submenu).toBeVisible();
        const from = await item(page, "Share").boundingBox();
        const to = await item(page, "Slack").boundingBox();
        if (from === null || to === null) {
            throw new Error("missing boxes");
        }
        await page.mouse.move(
            from.x + from.width - 4,
            from.y + from.height / 2,
        );
        await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
            steps: 12,
        });
        await expect(submenu).toBeVisible();
        await expect(item(page, "Slack")).toBeFocused();
    });

    test("the submenu opens past the end edge of its trigger", async ({
        page,
    }) => {
        await openShare(page);
        await page.keyboard.press("ArrowRight");
        await expect(item(page, "Email")).toBeFocused();
        const share = await item(page, "Share").boundingBox();
        const sub = await page
            .getByRole("menu", { name: "Share" })
            .boundingBox();
        if (share === null || sub === null) {
            throw new Error("missing boxes");
        }
        expect(sub.x).toBeGreaterThanOrEqual(share.x + share.width - 2);
    });
});

test.describe("menu / submenu in RTL", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/menu/submenu", { dir: "rtl" });
    });

    test("ArrowLeft opens, ArrowRight closes, and the submenu is on the left", async ({
        page,
    }) => {
        await openShare(page);
        await page.keyboard.press("ArrowLeft");
        await expect(item(page, "Email")).toBeFocused();
        const share = await item(page, "Share").boundingBox();
        const sub = await page
            .getByRole("menu", { name: "Share" })
            .boundingBox();
        if (share === null || sub === null) {
            throw new Error("missing boxes");
        }
        expect(sub.x + sub.width).toBeLessThanOrEqual(share.x + 2);
        await page.keyboard.press("ArrowRight");
        await expect(page.getByRole("menu", { name: "Share" })).toBeHidden();
        await expect(item(page, "Share")).toBeFocused();
    });
});

test("menu / groups: labelled groups, navigation crosses them", async ({
    page,
}) => {
    await openScenario(page, "/menu/groups");
    await page.getByRole("button", { name: "View" }).focus();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("group", { name: "Sort by" })).toBeVisible();
    await expect(page.getByRole("group", { name: "Show" })).toBeVisible();
    await page.keyboard.press("ArrowDown");
    await expect(item(page, "Date")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(item(page, "Hidden files")).toBeFocused();
});
