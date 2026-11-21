import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
    DialogBackdrop,
    DialogClose,
    DialogPopup,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    type OpenChangeEvent,
} from "@poc/angular";
import { dialog } from "@poc/styles";
import { Output } from "../../kit/output.ts";

/** The consumer keeps `open` true: Escape, an outside press and Close change nothing. */
@Component({
    selector: "[scenario-dialog-rejected-close]",
    encapsulation: ViewEncapsulation.None,
    imports: [
        DialogRoot,
        DialogPortal,
        DialogBackdrop,
        DialogPopup,
        DialogTitle,
        DialogClose,
        Output,
    ],
    template: `
        <button type="button" (click)="open.set(true)">Open dialog</button>
        <ng-container dialogRoot [open]="open()" (openChangeDetails)="onOpenChange($event)">
            <ng-container *dialogPortal>
                <div dialogBackdrop [class]="styles.backdrop"></div>
                <div dialogPopup [class]="styles.popup">
                    <h2 dialogTitle [class]="styles.title">Locked</h2>
                    <button dialogClose [class]="styles.close">Close</button>
                </div>
            </ng-container>
        </ng-container>
        <pre fixtureOutput [values]="{ open: open(), reason: reason() }"></pre>
    `,
})
export class DialogRejectedClose {
    protected readonly styles = dialog;
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);

    protected onOpenChange(event: OpenChangeEvent): void {
        this.reason.set(event.details.reason);
        if (event.open) {
            this.open.set(true);
        }
    }
}
