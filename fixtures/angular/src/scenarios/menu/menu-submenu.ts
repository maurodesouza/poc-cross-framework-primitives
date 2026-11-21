import { Component, ViewEncapsulation } from "@angular/core";
import { menu } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { MenuOutput } from "./menu-output.ts";
import { MENU_PARTS } from "./menu-parts.ts";

@Component({
    selector: "[scenario-menu-submenu]",
    encapsulation: ViewEncapsulation.None,
    imports: [MENU_PARTS, Output],
    template: `
        <ng-container menuRoot [(open)]="output.open" (openChangeDetails)="output.onOpenChange($event)">
            <button menuTrigger [class]="styles.trigger">File</button>
            <ng-container *menuPortal>
                <div menuPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div menuPopup [class]="styles.popup">
                        <div menuItem [class]="styles.item" (click)="output.select('New file')">New file</div>
                        <ng-container menuSubmenuRoot>
                            <div menuSubmenuTrigger [class]="styles['submenu-trigger']">Share</div>
                            <ng-container *menuPortal>
                                <div menuPositioner [class]="styles.positioner">
                                    <div menuPopup [class]="styles.popup">
                                        <div menuItem [class]="styles.item" (click)="output.select('Email')">Email</div>
                                        <div menuItem [class]="styles.item" (click)="output.select('Link')">Link</div>
                                        <div menuItem [class]="styles.item" (click)="output.select('Slack')">Slack</div>
                                    </div>
                                </div>
                            </ng-container>
                        </ng-container>
                        <div menuItem [class]="styles.item" (click)="output.select('Print')">Print</div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <pre fixtureOutput [values]="output.values()"></pre>
    `,
})
export class MenuSubmenu {
    protected readonly styles = menu;
    protected readonly output = new MenuOutput();
}
