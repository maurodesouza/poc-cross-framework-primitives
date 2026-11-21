import { Component, ViewEncapsulation } from "@angular/core";
import {
    DialogBackdrop,
    DialogClose,
    DialogDescription,
    DialogPopup,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@poc/angular";
import { dialog, popover } from "@poc/styles";
import { POPOVER_PARTS } from "../popover/popover-parts.ts";

@Component({
    selector: "[scenario-dialog-nested-popover]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        DialogRoot,
        DialogTrigger,
        DialogPortal,
        DialogBackdrop,
        DialogPopup,
        DialogTitle,
        DialogDescription,
        DialogClose,
        POPOVER_PARTS,
    ],
    template: `
        <ng-container dialogRoot>
            <button dialogTrigger [class]="styles.trigger">Open dialog</button>
            <ng-container *dialogPortal>
                <div dialogBackdrop [class]="styles.backdrop"></div>
                <div dialogPopup [class]="styles.popup">
                    <h2 dialogTitle [class]="styles.title">Edit profile</h2>
                    <p dialogDescription [class]="styles.description">Change your display name.</p>
                    <ng-container popoverRoot>
                        <button popoverTrigger [class]="popoverStyles.trigger">More info</button>
                        <ng-container *popoverPortal>
                            <div popoverPositioner [sideOffset]="4" [class]="popoverStyles.positioner">
                                <div popoverPopup [class]="popoverStyles.popup">
                                    <h2 popoverTitle [class]="popoverStyles.title">About names</h2>
                                    <button popoverClose [class]="popoverStyles.close">Got it</button>
                                </div>
                            </div>
                        </ng-container>
                    </ng-container>
                    <button dialogClose [class]="styles.close">Close</button>
                </div>
            </ng-container>
        </ng-container>
    `,
})
export class DialogNestedPopover {
    protected readonly styles = dialog;
    protected readonly popoverStyles = popover;
}
