import {
    afterRenderEffect,
    booleanAttribute,
    computed,
    Directive,
    input,
    model,
    output,
    signal,
    untracked,
} from "@angular/core";
import { createId } from "@poc/dom";
import type {
    ChangeDetails,
    ChangeReason,
    ValueChangeEvent,
} from "../../utils/change-details.ts";
import { controllable } from "../../utils/controllable.ts";
import { dataValues } from "../../utils/state-attributes.ts";

export interface TabInfo {
    value: string;
    disabled: boolean;
}

export interface TabsRootState {
    orientation: "horizontal" | "vertical";
    activation: "automatic" | "manual";
}

/** spec/tabs.md: `<div tabsRoot [(value)]="value">`. */
@Directive({
    selector: "[tabsRoot]",
    exportAs: "tabsRoot",
    host: {
        "data-tabs-part": "root",
        "[attr.data-orientation]": "data().orientation",
        "[attr.data-activation]": "data().activation",
    },
})
export class TabsRoot {
    readonly value = model<string | undefined>(undefined);
    /** Default: the first enabled tab. */
    readonly defaultValue = input<string | undefined>(undefined);
    readonly valueChangeDetails = output<ValueChangeEvent<string>>();
    readonly orientation = input<"horizontal" | "vertical">("horizontal");
    /** `automatic`: moving focus selects; `manual`: Enter or Space selects. */
    readonly activation = input<"automatic" | "manual">("automatic");
    readonly loop = input(true, { transform: booleanAttribute });

    private readonly selection = controllable<
        string | undefined,
        ChangeDetails
    >(
        this.value,
        () => this.defaultValue(),
        (value, details) =>
            this.valueChangeDetails.emit({ value: value ?? "", details }),
    );
    /** The selected tab's value. */
    readonly selected = this.selection.value;
    readonly baseId = createId("poc-tabs");
    readonly tabs = new Map<HTMLElement, TabInfo>();
    readonly list = signal<HTMLElement | null>(null);
    /** Bumped when a tab registers, so the roving tabindex and the indicator follow. */
    readonly version = signal(0);
    readonly state = computed<TabsRootState>(() => ({
        orientation: this.orientation(),
        activation: this.activation(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        // no value: the first enabled tab, once the tabs are known
        afterRenderEffect(() => {
            this.version();
            const list = this.list();
            if (this.selected() !== undefined || list === null) {
                return;
            }
            untracked(() => {
                const first = [
                    ...list.querySelectorAll<HTMLElement>('[role="tab"]'),
                ]
                    .map((element) => this.tabs.get(element))
                    .find((info) => info !== undefined && !info.disabled);
                if (first) {
                    this.select(first.value, "none");
                }
            });
        });
    }

    select(value: string, reason: ChangeReason): void {
        this.selection.set(value, { reason });
    }

    tabId(value: string): string {
        return `${this.baseId}-tab-${value}`;
    }

    panelId(value: string): string {
        return `${this.baseId}-panel-${value}`;
    }
}
