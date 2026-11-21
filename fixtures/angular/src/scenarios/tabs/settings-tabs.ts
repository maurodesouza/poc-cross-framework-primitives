import { Component, input, signal, ViewEncapsulation } from "@angular/core";
import {
    TabsIndicator,
    TabsList,
    TabsPanel,
    TabsRoot,
    TabsTab,
} from "@poc/angular";
import { tabs } from "@poc/styles";
import { Output } from "../../kit/output.ts";

const TABS = [
    { value: "account", label: "Account", disabled: false },
    { value: "password", label: "Password", disabled: false },
    { value: "billing", label: "Billing", disabled: true },
    { value: "team", label: "Team", disabled: false },
];

/**
 * The tabs of every tabs scenario (spec/tabs.md); the three routes set its inputs. A panel's text
 * is two text nodes, as JSX makes `{tab.label} settings` (AGENTS.md, "Porting a framework").
 */
@Component({
    selector: "[scenario-settings-tabs]",
    encapsulation: ViewEncapsulation.None,
    imports: [TabsRoot, TabsList, TabsTab, TabsIndicator, TabsPanel, Output],
    template: `
        <div tabsRoot [(value)]="value" [activation]="activation()" [orientation]="orientation()" [class]="styles.root">
            <div tabsList [class]="styles.list">
                @for (tab of tabs; track tab.value) {
                    <button tabsTab [value]="tab.value" [disabled]="tab.disabled" [class]="styles.tab">{{ tab.label }}</button>
                }
                <span tabsIndicator [class]="styles.indicator"></span>
            </div>
            @for (tab of tabs; track tab.value) {
                <div *tabsPanel="tab.value" [class]="styles.panel"><p>@for (run of [tab.label, " settings"]; track $index) {<ng-container>{{ run }}</ng-container>}</p></div>
            }
        </div>
        <button type="button" class="mt-2">After tabs</button>
        <pre fixtureOutput [values]="{ value: value() }"></pre>
    `,
})
export class SettingsTabs {
    protected readonly styles = tabs;
    protected readonly tabs = TABS;
    readonly activation = input.required<"automatic" | "manual">();
    readonly orientation = input.required<"horizontal" | "vertical">();
    protected readonly value = signal<string | undefined>("account");
}
