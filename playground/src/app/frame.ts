import type { Implementation } from "../../../conformance/src/implementations.ts";
import { element } from "../kit/element.ts";
import { isRunning } from "../kit/probe.ts";

/** How often a frame checks that its dev server still answers. */
const PROBE_INTERVAL = 2000;

export interface Frame {
    element: HTMLElement;
    /** Stops the probe. */
    dispose(): void;
}

type Status = "probing" | "running" | "stopped";

/** The frame of an implementation that has not ported the scenario's component yet. */
export function createUnavailableFrame(
    implementation: Implementation,
    component: string,
    className: string,
): Frame {
    const root = element(
        "section",
        {
            class: `flex flex-col overflow-hidden rounded-lg border border-dashed border-palette-line ${className}`,
            "data-implementation": implementation.name,
            "data-status": "unavailable",
        },
        element(
            "header",
            {
                class: "flex items-center gap-2 border-b border-palette-line bg-palette-soft px-3 py-1.5",
            },
            element(
                "h2",
                { class: "text-sm font-semibold" },
                implementation.name,
            ),
        ),
        element(
            "div",
            {
                class: "flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center",
                "data-testid": "unavailable",
            },
            element(
                "p",
                { class: "font-semibold" },
                `${component} is not available in ${implementation.name} yet`,
            ),
            element(
                "p",
                { class: "text-xs text-palette-accent/85" },
                "Not ported yet (pending in conformance/src/implementations.ts).",
            ),
        ),
    );
    return { element: root, dispose() {} };
}

/**
 * One implementation's scenario: a header (its name, reload, open in a new tab) over an iframe
 * while its dev server answers, or a "not running" state while it does not. The probe keeps
 * running, so a server that starts later (Angular's takes the longest) appears by itself, and one
 * that stops turns back into "not running".
 */
export function createFrame(
    implementation: Implementation,
    origin: string,
    url: string,
    className: string,
): Frame {
    let status: Status = "probing";
    const body = element("div", { class: "relative min-h-0 flex-1" });
    const reload = element(
        "button",
        {
            type: "button",
            class: "rounded border border-palette-line px-2 py-0.5 text-xs hover:bg-palette-soft",
            title: `Reload ${implementation.name}`,
        },
        "Reload",
    );
    const open = element(
        "a",
        {
            href: url,
            target: "_blank",
            rel: "noopener",
            class: "rounded border border-palette-line px-2 py-0.5 text-xs hover:bg-palette-soft",
            title: `Open ${implementation.name} in a new tab`,
        },
        "Open ↗",
    );
    const badge = element("span", {
        class: "text-xs text-palette-accent/85",
        "data-status": "probing",
    });
    const root = element(
        "section",
        {
            class: `flex flex-col overflow-hidden rounded-lg border border-palette-line ${className}`,
            "data-implementation": implementation.name,
        },
        element(
            "header",
            {
                class: "flex items-center gap-2 border-b border-palette-line bg-palette-soft px-3 py-1.5",
            },
            element(
                "h2",
                { class: "text-sm font-semibold" },
                implementation.name,
            ),
            element(
                "span",
                { class: "text-xs text-palette-accent/85" },
                `:${implementation.port}`,
            ),
            badge,
            element("span", { class: "flex-1" }),
            reload,
            open,
        ),
        body,
    );

    let iframe: HTMLIFrameElement | undefined;

    function show(next: Status): void {
        status = next;
        badge.dataset.status = next;
        badge.textContent = next === "probing" ? "checking…" : "";
        body.replaceChildren();
        iframe = undefined;
        if (next === "running") {
            iframe = element("iframe", {
                src: url,
                title: `${implementation.name}: ${new URL(url).pathname}`,
                class: "absolute inset-0 size-full border-0 bg-white",
            });
            body.append(iframe);
        } else if (next === "stopped") {
            body.append(
                element(
                    "div",
                    {
                        class: "absolute inset-0 flex flex-col items-center justify-center gap-1 p-6 text-center",
                        "data-testid": "not-running",
                    },
                    element(
                        "p",
                        { class: "font-semibold" },
                        `${implementation.name} is not running`,
                    ),
                    element(
                        "p",
                        { class: "text-xs text-palette-accent/85" },
                        `Nothing answers on port ${implementation.port}. Start it with `,
                        element(
                            "code",
                            {},
                            `pnpm playground --framework ${implementation.name}`,
                        ),
                        ".",
                    ),
                ),
            );
        }
    }

    reload.addEventListener("click", () => {
        if (iframe !== undefined) {
            iframe.src = url;
        } else {
            void probe();
        }
    });

    let disposed = false;
    async function probe(): Promise<void> {
        const running = await isRunning(origin);
        if (disposed) {
            return;
        }
        const next: Status = running ? "running" : "stopped";
        if (next !== status) {
            show(next);
        }
    }

    show("probing");
    void probe();
    const timer = window.setInterval(() => void probe(), PROBE_INTERVAL);

    return {
        element: root,
        dispose() {
            disposed = true;
            window.clearInterval(timer);
        },
    };
}
