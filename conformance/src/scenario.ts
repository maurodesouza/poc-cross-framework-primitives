import type { Page } from "@playwright/test";

/** "Today" in every calendar scenario (spec/README.md): Friday 2026-11-20. */
export const TODAY = new Date(2026, 10, 20, 10, 0, 0);

export interface ScenarioOptions {
    locale?: string;
    dir?: "rtl";
    /** Fixes the clock at {@link TODAY} before the page loads. */
    today?: boolean;
}

/** Opens `/<component>/<scenario>` with the spec's query parameters. */
export async function openScenario(
    page: Page,
    path: string,
    options: ScenarioOptions = {},
): Promise<void> {
    if (options.today) {
        await page.clock.setFixedTime(TODAY);
    }
    const query = new URLSearchParams();
    if (options.locale !== undefined) {
        query.set("locale", options.locale);
    }
    if (options.dir !== undefined) {
        query.set("dir", options.dir);
    }
    const search = query.size > 0 ? `?${query}` : "";
    await page.goto(`${path}${search}`);
}
