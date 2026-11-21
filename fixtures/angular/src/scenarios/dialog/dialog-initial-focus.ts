import { Component, ViewEncapsulation } from "@angular/core";
import {
    DialogBackdrop,
    DialogClose,
    DialogPopup,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@poc/angular";
import { dialog } from "@poc/styles";

@Component({
    selector: "[scenario-dialog-initial-focus]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        DialogRoot,
        DialogTrigger,
        DialogPortal,
        DialogBackdrop,
        DialogPopup,
        DialogTitle,
        DialogClose,
    ],
    template: `
        <ng-container dialogRoot>
            <button dialogTrigger [class]="styles.trigger">Delete file</button>
            <ng-container *dialogPortal>
                <div dialogBackdrop [class]="styles.backdrop"></div>
                <div dialogPopup [class]="styles.popup" [initialFocus]="cancel">
                    <h2 dialogTitle [class]="styles.title">Delete file?</h2>
                    <div class="flex justify-end gap-2">
                        <button type="button">Delete</button>
                        <button dialogClose #cancel [class]="styles.close">Cancel</button>
                    </div>
                </div>
            </ng-container>
        </ng-container>
    `,
})
export class DialogInitialFocus {
    protected readonly styles = dialog;
}
