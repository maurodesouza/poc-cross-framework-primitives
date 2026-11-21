import {
    afterRenderEffect,
    computed,
    Directive,
    inject,
    input,
    untracked,
} from "@angular/core";
import { type Align, openOverlaySession, type Side } from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { positionOverlay } from "../../utils/positioner.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { SelectRoot } from "./select-root.directive.ts";

/**
 * Places the list below the trigger (spec/select.md, "Item alignment"); the open list is a layer
 * (Escape, outside press): `<div selectPositioner>`.
 */
@Directive({
    selector: "[selectPositioner]",
    exportAs: "selectPositioner",
    host: {
        role: "presentation",
        "data-select-part": "positioner",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
    },
})
export class SelectPositioner {
    private readonly root = inject(SelectRoot);
    readonly side = input<Side | undefined>(undefined);
    readonly align = input<Align | undefined>(undefined);
    readonly sideOffset = input<number | undefined>(4);
    readonly alignOffset = input<number | undefined>(undefined);
    readonly collisionPadding = input<number | undefined>(undefined);
    readonly anchor = input<Element | null | undefined>(undefined);
    readonly state = computed(() => ({
        open: this.root.overlay.open(),
        ...this.root.placed(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const overlay = this.root.overlay;
        const positioner = registerHost(overlay.positioner);
        positionOverlay(
            this,
            { side: "bottom", align: "start" },
            { anchor: overlay.trigger, positioner },
            this.root.placed,
        );
        afterRenderEffect((onCleanup) => {
            const open = overlay.open();
            const trigger = overlay.trigger();
            if (!open) {
                return;
            }
            untracked(() => {
                const session = openOverlaySession(positioner.ownerDocument, {
                    elements: () => [positioner],
                    ignore: () => [trigger],
                    dismiss: (reason) => overlay.setOpen(false, reason),
                });
                onCleanup(session.end);
            });
        });
    }
}
