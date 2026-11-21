import { Component, signal, ViewEncapsulation } from "@angular/core";
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
import { dialog } from "@poc/styles";
import { Output } from "../../kit/output.ts";

@Component({
    selector: "[scenario-dialog-basic]",
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
        Output,
    ],
    template: `
        <div class="h-[200vh]">
            <ng-container dialogRoot [(open)]="open" (openChangeDetails)="reason.set($event.details.reason)">
                <button dialogTrigger [class]="styles.trigger">Open dialog</button>
                <ng-container *dialogPortal>
                    <div dialogBackdrop [class]="styles.backdrop"></div>
                    <div dialogPopup [class]="styles.popup">
                        <h2 dialogTitle [class]="styles.title">Edit profile</h2>
                        <p dialogDescription [class]="styles.description">Change your display name.</p>
                        <label class="flex flex-col gap-1 text-sm">Name<input type="text" class="h-9 rounded-md border border-palette-line px-2" /></label>
                        <div class="flex justify-end gap-2">
                            <button dialogClose [class]="styles.close">Save</button>
                            <button dialogClose [class]="styles.close">Close</button>
                        </div>
                    </div>
                </ng-container>
            </ng-container>
            <button type="button" class="ms-2">Outside button</button>
            <pre fixtureOutput [values]="{ open: open(), reason: reason() }"></pre>
        </div>
    `,
})
export class DialogBasic {
    protected readonly styles = dialog;
    protected readonly open = signal(false);
    protected readonly reason = signal<string | undefined>(undefined);
}
