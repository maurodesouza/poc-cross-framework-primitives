import {
    afterRenderEffect,
    computed,
    Directive,
    inject,
    untracked,
} from "@angular/core";
import { getDirection } from "@poc/dom";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { TabsRoot } from "./tabs-root.directive.ts";

const VARIABLES = [
    "--tabs-indicator-inset-inline-start",
    "--tabs-indicator-inset-block-start",
    "--tabs-indicator-inline-size",
    "--tabs-indicator-block-size",
] as const;

/**
 * Follows the selected tab through CSS variables measured from the list (spec/tabs.md):
 * `<span tabsIndicator>` inside the list. It stays rendered; until a tab is selected it carries
 * no variables.
 */
@Directive({
    selector: "[tabsIndicator]",
    exportAs: "tabsIndicator",
    host: {
        "aria-hidden": "true",
        "data-tabs-part": "indicator",
        "[attr.data-orientation]": "data().orientation",
    },
})
export class TabsIndicator {
    private readonly root = inject(TabsRoot);
    readonly state = computed(() => ({ orientation: this.root.orientation() }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const host = injectHost();
        const root = this.root;
        afterRenderEffect((onCleanup) => {
            const list = root.list();
            const value = root.selected();
            root.version();
            untracked(() => {
                const clear = () => {
                    for (const name of VARIABLES) {
                        host.style.removeProperty(name);
                    }
                };
                if (list === null || value === undefined) {
                    clear();
                    return;
                }
                const measure = () => {
                    const tab = list.ownerDocument.getElementById(
                        root.tabId(value),
                    );
                    if (tab === null) {
                        clear();
                        return;
                    }
                    const listRect = list.getBoundingClientRect();
                    const tabRect = tab.getBoundingClientRect();
                    const inlineStart =
                        getDirection(list) === "rtl"
                            ? listRect.right - tabRect.right
                            : tabRect.left - listRect.left;
                    const values = [
                        inlineStart,
                        tabRect.top - listRect.top,
                        tabRect.width,
                        tabRect.height,
                    ];
                    VARIABLES.forEach((name, index) => {
                        host.style.setProperty(name, `${values[index]}px`);
                    });
                };
                measure();
                const view = list.ownerDocument.defaultView;
                const observer = view?.ResizeObserver
                    ? new view.ResizeObserver(measure)
                    : null;
                observer?.observe(list);
                onCleanup(() => observer?.disconnect());
            });
        });
    }
}
