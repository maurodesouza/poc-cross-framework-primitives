import { computed, Directive, input, output, signal } from "@angular/core";
import type { OpenChangeEvent } from "../../utils/change-details.ts";
import { createOverlayRoot } from "../../utils/overlay-root.ts";
import { placementSignal } from "../../utils/positioner.ts";

export interface PopoverState {
    open: boolean;
}

/** Holds the popover's state (spec/popover.md): `<ng-container popoverRoot [(open)]="open">`. */
@Directive({ selector: "[popoverRoot]", exportAs: "popoverRoot" })
export class PopoverRoot {
    readonly open = input<boolean | undefined>(undefined);
    readonly openChange = output<boolean>();
    readonly defaultOpen = input(false);
    readonly openChangeDetails = output<OpenChangeEvent>();

    readonly overlay = createOverlayRoot(
        this,
        (event) => this.openChangeDetails.emit(event),
        "poc-popover",
    );
    readonly arrow = signal<HTMLElement | null>(null);
    readonly placed = placementSignal({ side: "bottom", align: "center" });
    readonly titleId = signal<string | undefined>(undefined);
    readonly descriptionId = signal<string | undefined>(undefined);
    readonly state = computed<PopoverState>(() => ({
        open: this.overlay.open(),
    }));
}
