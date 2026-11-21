import { Component, ViewEncapsulation } from "@angular/core";
import { menu } from "@poc/styles";
import { MENU_PARTS } from "./menu-parts.ts";

@Component({
    selector: "[scenario-menu-groups]",
    encapsulation: ViewEncapsulation.None,
    imports: [MENU_PARTS],
    template: `
        <ng-container menuRoot>
            <button menuTrigger [class]="styles.trigger">View</button>
            <ng-container *menuPortal>
                <div menuPositioner [sideOffset]="4" [class]="styles.positioner">
                    <div menuPopup [class]="styles.popup">
                        <div menuGroup [class]="styles.group">
                            <div menuGroupLabel [class]="styles['group-label']">Sort by</div>
                            <div menuItem [class]="styles.item">Name</div>
                            <div menuItem [class]="styles.item">Date</div>
                        </div>
                        <div menuSeparator [class]="styles.separator"></div>
                        <div menuGroup [class]="styles.group">
                            <div menuGroupLabel [class]="styles['group-label']">Show</div>
                            <div menuItem [class]="styles.item">Hidden files</div>
                        </div>
                    </div>
                </div>
            </ng-container>
        </ng-container>
    `,
})
export class MenuGroups {
    protected readonly styles = menu;
}
