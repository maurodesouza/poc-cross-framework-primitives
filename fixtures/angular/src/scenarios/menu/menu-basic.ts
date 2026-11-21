import { Component, ViewEncapsulation } from "@angular/core";
import { menu } from "@poc/styles";
import { Output } from "../../kit/output.ts";
import { MenuOutput } from "./menu-output.ts";
import { MENU_PARTS } from "./menu-parts.ts";

@Component({
    selector: "[scenario-menu-basic]",
    encapsulation: ViewEncapsulation.None,
    imports: [MENU_PARTS, Output],
    template: `
        <ng-container menuRoot [(open)]="output.open" (openChangeDetails)="output.onOpenChange($event)">
            <button menuTrigger [class]="styles.trigger">Actions</button>
            <ng-container *menuPortal>
                <div menuPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div menuPopup [class]="styles.popup">
                        <div menuItem [class]="styles.item" (click)="output.select('Edit')">Edit</div>
                        <div menuItem [class]="styles.item" (click)="output.select('Duplicate')">Duplicate</div>
                        <div menuItem disabled [class]="styles.item" (click)="output.select('Archive')">Archive</div>
                        <div menuSeparator [class]="styles.separator"></div>
                        <div menuItem [class]="styles.item" (click)="output.select('Delete')">Delete</div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
        <button type="button" class="ms-2">After menu</button>
        <pre fixtureOutput [values]="output.values()"></pre>
    `,
})
export class MenuBasic {
    protected readonly styles = menu;
    protected readonly output = new MenuOutput();
}
