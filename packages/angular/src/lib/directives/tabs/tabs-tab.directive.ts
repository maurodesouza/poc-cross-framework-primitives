import {
    booleanAttribute,
    computed,
    DestroyRef,
    Directive,
    effect,
    inject,
    input,
} from "@angular/core";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { TabsRoot } from "./tabs-root.directive.ts";

export interface TabsTabState {
    selected: boolean;
    disabled: boolean;
    orientation: string;
}

/** A tab: `<button tabsTab value="account">`. A disabled tab stays focusable, is never selected. */
@Directive({
    selector: "[tabsTab]",
    exportAs: "tabsTab",
    host: {
        type: "button",
        role: "tab",
        "data-tabs-part": "tab",
        "[attr.id]": "root.tabId(value())",
        "[attr.aria-selected]": "state().selected ? 'true' : 'false'",
        "[attr.aria-controls]": "root.panelId(value())",
        "[attr.aria-disabled]": "state().disabled ? 'true' : null",
        "[attr.tabindex]": "holdsTabStop() ? 0 : -1",
        "[attr.data-selected]": "data().selected",
        "[attr.data-disabled]": "data().disabled",
        "[attr.data-orientation]": "data().orientation",
        "(click)": "onClick()",
    },
})
export class TabsTab {
    protected readonly root = inject(TabsRoot);
    readonly value = input.required<string>();
    readonly disabled = input(false, { transform: booleanAttribute });
    private readonly host = injectHost();
    readonly state = computed<TabsTabState>(() => ({
        selected: this.root.selected() === this.value(),
        disabled: this.disabled(),
        orientation: this.root.orientation(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));
    // the roving tab stop: the selected tab, else the first tab
    protected readonly holdsTabStop = computed(() => {
        if (this.root.selected() !== undefined) {
            return this.state().selected;
        }
        this.root.version();
        return this.root.list()?.querySelector('[role="tab"]') === this.host;
    });

    constructor() {
        const root = this.root;
        effect(() => {
            root.tabs.set(this.host, {
                value: this.value(),
                disabled: this.disabled(),
            });
            root.version.update((current) => current + 1);
        });
        inject(DestroyRef).onDestroy(() => root.tabs.delete(this.host));
    }

    protected onClick(): void {
        if (!this.disabled()) {
            this.root.select(this.value(), "trigger-press");
        }
    }
}
