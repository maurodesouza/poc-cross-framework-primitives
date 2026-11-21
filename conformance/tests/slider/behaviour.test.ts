import { expect, type Page, test } from "@playwright/test";
import { expectNoAxeViolations } from "../../src/axe.ts";
import { expectSubmitted } from "../../src/form.ts";
import { expectOutput } from "../../src/output.ts";
import { dragFrom, pointAlong, pressAlong } from "../../src/pointer.ts";
import { openScenario } from "../../src/scenario.ts";
import { expectSliderValue, sliderState } from "../../src/slider.ts";

// spec/slider.md
const slider = (page: Page, name: string) =>
    page.getByRole("slider", { name, exact: true });
const control = (page: Page) => page.getByTestId("control");

test.describe("slider / basic", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/slider/basic");
    });

    test("one named slider with its value and bounds", async ({ page }) => {
        await expect(page.getByRole("slider")).toHaveCount(1);
        expect(await sliderState(slider(page, "Volume"))).toEqual({
            now: 50,
            min: 0,
            max: 100,
        });
        await expect(slider(page, "Volume")).not.toHaveAttribute(
            "aria-orientation",
            "vertical",
        );
    });

    test("the arrows, Page Up and Down, Shift and Home and End", async ({
        page,
    }) => {
        const volume = slider(page, "Volume");
        await volume.focus();
        const steps: [string, number][] = [
            ["ArrowRight", 51],
            ["ArrowUp", 52],
            ["ArrowLeft", 51],
            ["ArrowDown", 50],
            ["PageUp", 60],
            ["PageDown", 50],
            ["Shift+ArrowRight", 60],
            ["End", 100],
            ["Home", 0],
        ];
        for (const [key, value] of steps) {
            await page.keyboard.press(key);
            await expectSliderValue(volume, value);
            await expectOutput(page, "value", String(value));
            await expectOutput(page, "committed", String(value));
        }
    });

    test("a press on the control moves the thumb there and focuses it", async ({
        page,
    }) => {
        await pressAlong(page, control(page), 0.3);
        await expectSliderValue(slider(page, "Volume"), 30);
        await expectOutput(page, "committed", "30");
        await expect(slider(page, "Volume")).toBeFocused();
    });

    test("a drag follows the pointer, outside the control too, and commits on release", async ({
        page,
    }) => {
        const volume = slider(page, "Volume");
        await dragFrom(page, volume, await pointAlong(control(page), 0.8));
        await expectSliderValue(volume, 80);
        await expectOutput(page, "value", "80");
        await expectOutput(page, "committed", "none");
        // the pointer leaves the control (captured): below it, at 90%
        const at90 = await pointAlong(control(page), 0.9);
        await page.mouse.move(at90.x, at90.y + 120, { steps: 4 });
        await expectSliderValue(volume, 90);
        await page.mouse.up();
        await expectOutput(page, "committed", "90");
    });

    test("the form submits its value", async ({ page }) => {
        await slider(page, "Volume").focus();
        await page.keyboard.press("ArrowRight");
        await page.getByRole("button", { name: "Submit" }).click();
        await expectSubmitted(page, "volume=51");
    });

    test("has no axe violation", async ({ page }) => {
        await expectNoAxeViolations(page);
    });
});

test.describe("slider / range", () => {
    test.beforeEach(async ({ page }) => {
        await openScenario(page, "/slider/range");
    });

    test("two named thumbs with their values and value text", async ({
        page,
    }) => {
        await expect(page.getByRole("slider")).toHaveCount(2);
        await expectSliderValue(slider(page, "Minimum price"), 20);
        await expectSliderValue(slider(page, "Maximum price"), 80);
        await expect(slider(page, "Minimum price")).toHaveAttribute(
            "aria-valuetext",
            "$20",
        );
    });

    test("thumbs keep the minimum distance", async ({ page }) => {
        await slider(page, "Minimum price").focus();
        await page.keyboard.press("End");
        await expectSliderValue(slider(page, "Minimum price"), 70);
        await slider(page, "Maximum price").focus();
        await page.keyboard.press("Home");
        await expectSliderValue(slider(page, "Maximum price"), 80);
        await expectOutput(page, "value", "70,80");
    });

    test("a press moves the nearest thumb", async ({ page }) => {
        await pressAlong(page, control(page), 0.95);
        await expectSliderValue(slider(page, "Maximum price"), 95);
        await pressAlong(page, control(page), 0.05);
        await expectSliderValue(slider(page, "Minimum price"), 5);
        await expectOutput(page, "value", "5,95");
    });

    test("the form submits both values", async ({ page }) => {
        await page.getByRole("button", { name: "Submit" }).click();
        await expectSubmitted(page, "price=20&price=80");
    });
});

test("slider / vertical: the keys and a press from the bottom", async ({
    page,
}) => {
    await openScenario(page, "/slider/vertical");
    const brightness = slider(page, "Brightness");
    await expect(brightness).toHaveAttribute("aria-orientation", "vertical");
    await brightness.focus();
    await page.keyboard.press("ArrowUp");
    await expectSliderValue(brightness, 31);
    await page.keyboard.press("ArrowRight");
    await expectSliderValue(brightness, 32);
    await page.keyboard.press("ArrowDown");
    await expectSliderValue(brightness, 31);
    await pressAlong(page, control(page), 0.75, "vertical");
    await expectSliderValue(brightness, 75);
});

test("slider / rtl: the arrows swap, the minimum is on the right", async ({
    page,
}) => {
    await openScenario(page, "/slider/rtl", { dir: "rtl" });
    const volume = slider(page, "Volume");
    await volume.focus();
    await page.keyboard.press("ArrowRight");
    await expectSliderValue(volume, 49);
    await page.keyboard.press("ArrowLeft");
    await expectSliderValue(volume, 50);
    await pressAlong(page, control(page), 0.25);
    await expectSliderValue(volume, 75);
});

test("slider / controlled: a value the consumer refuses is not shown", async ({
    page,
}) => {
    await openScenario(page, "/slider/controlled");
    const limited = slider(page, "Limited");
    await limited.focus();
    await page.keyboard.press("End");
    await expectOutput(page, "requested", "100");
    await expectSliderValue(limited, 70);
    await expectOutput(page, "value", "70");
    await page.keyboard.press("ArrowRight");
    await expectSliderValue(limited, 71);
});
