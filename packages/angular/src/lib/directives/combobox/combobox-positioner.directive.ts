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
import { ComboboxRoot } from "./combobox-root.directive.ts";

/**
 * Places the list under the InputGroup (else the Chips, else the Input); the open list is a layer
 * (Escape, outside press): `<div comboboxPositioner>`.
 */
@Directive({
    selector: "[comboboxPositioner]",
    exportAs: "comboboxPositioner",
    host: {
        role: "presentation",
        "data-combobox-part": "positioner",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
    },
})
export class ComboboxPositioner {
    private readonly root = inject(ComboboxRoot);
    readonly side = input<Side | undefined>(undefined);
    readonly align = input<Align | undefined>(undefined);
    readonly sideOffset = input<number | undefined>(undefined);
    readonly alignOffset = input<number | undefined>(undefined);
    readonly collisionPadding = input<number | undefined>(undefined);
    readonly anchor = input<Element | null | undefined>(undefined);
    readonly state = computed(() => ({
        open: this.root.overlay.open(),
        ...this.root.placed(),
    }));
    protected readonly data = computed(() => dataValues(this.state()));

    constructor() {
        const root = this.root;
        const overlay = root.overlay;
        const positioner = registerHost(overlay.positioner);
        positionOverlay(
            this,
            { side: "bottom", align: "start" },
            {
                anchor: computed(
                    () =>
                        root.inputGroup() ?? root.chips() ?? overlay.trigger(),
                ),
                positioner,
            },
            root.placed,
        );
        afterRenderEffect((onCleanup) => {
            const open = overlay.open();
            const ignored = [
                overlay.trigger(),
                root.button(),
                root.inputGroup(),
                root.chips(),
                root.clearButton(),
            ];
            if (!open) {
                return;
            }
            untracked(() => {
                const session = openOverlaySession(positioner.ownerDocument, {
                    elements: () => [positioner],
                    ignore: () => ignored,
                    dismiss: (reason) => root.setOpen(false, reason),
                });
                onCleanup(session.end);
            });
        });
    }
}
