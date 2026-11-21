import {
    booleanAttribute,
    computed,
    Directive,
    type EmbeddedViewRef,
    effect,
    inject,
    input,
    TemplateRef,
    untracked,
    ViewContainerRef,
} from "@angular/core";
import { TabsRoot } from "./tabs-root.directive.ts";

export interface TabsPanelState {
    selected: boolean;
    orientation: string;
}

/**
 * A tab's panel, structural so an inactive panel is not rendered (spec/tabs.md):
 * `<div *tabsPanel="'account'">`, or `*tabsPanel="'account'; keepMounted: true"` to keep it,
 * `hidden`. The directive writes the panel's attributes on the element it renders.
 */
@Directive({ selector: "[tabsPanel]", exportAs: "tabsPanel" })
export class TabsPanel {
    private readonly root = inject(TabsRoot);
    readonly value = input.required<string>({ alias: "tabsPanel" });
    /** Keep an inactive panel rendered, `hidden` (default `false`). */
    readonly keepMounted = input(false, {
        alias: "tabsPanelKeepMounted",
        transform: booleanAttribute,
    });
    readonly state = computed<TabsPanelState>(() => ({
        selected: this.root.selected() === this.value(),
        orientation: this.root.orientation(),
    }));

    constructor() {
        const template = inject(TemplateRef);
        const container = inject(ViewContainerRef);
        let view: EmbeddedViewRef<unknown> | null = null;
        effect(() => {
            const { selected, orientation } = this.state();
            const show = selected || this.keepMounted();
            const value = this.value();
            untracked(() => {
                if (!show) {
                    container.clear();
                    view = null;
                    return;
                }
                view ??= container.createEmbeddedView(template);
                const panel = (view.rootNodes as Node[]).find(
                    (node): node is HTMLElement => node instanceof HTMLElement,
                );
                if (panel === undefined) {
                    return;
                }
                const attributes: Record<string, string | null> = {
                    role: "tabpanel",
                    id: this.root.panelId(value),
                    "aria-labelledby": this.root.tabId(value),
                    tabindex: "0",
                    hidden: selected ? null : "",
                    "data-tabs-part": "panel",
                    "data-selected": selected ? "" : null,
                    "data-orientation": orientation,
                };
                for (const [name, attribute] of Object.entries(attributes)) {
                    if (attribute === null) {
                        panel.removeAttribute(name);
                    } else {
                        panel.setAttribute(name, attribute);
                    }
                }
            });
        });
    }
}
