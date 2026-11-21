import { Component, signal, ViewEncapsulation } from "@angular/core";
import {
    DialogBackdrop,
    DialogClose,
    DialogPopup,
    DialogPortal,
    DialogRoot,
    DialogTitle,
} from "@poc/angular";
import { dialog } from "@poc/styles";
import { Output } from "../../kit/output.ts";

@Component({
    selector: "[scenario-dialog-controlled]",
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
        <ng-container dialogRoot [(open)]="open" (openChangeDetails)="reason.set($event.details.reason)">
            <ng-container *dialogPortal>
                <div dialogBackdrop [class]="styles.backdrop"></div>
                <div dialogPopup [class]="styles.popup">
                    <h2 dialogTitle [class]="styles.title">Controlled</h2>
                    <button dialogClose [class]="styles.close">Close</button>
                </div>
            </ng-container>
        </ng-container>
        <pre fixtureOutput [values]="{ open: open(), reason: reason() }"></pre>
    `,
})
export class DialogControlled {
    protected readonly styles = dialog;
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);
}
