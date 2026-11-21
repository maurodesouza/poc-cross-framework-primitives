import { computed, Directive, inject, input } from "@angular/core";
import type { Align, Side } from "@poc/dom";
import { registerHost } from "../../utils/host-element.ts";
import { positionOverlay } from "../../utils/positioner.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { MenuRoot } from "./menu-root.directive.ts";

export interface MenuPositionerState {
    open: boolean;
    side: Side;
    align: Align;
}

/**
 * Places a menu level: below its trigger, or at the end side of its submenu trigger.
 * `<div menuPositioner>`.
 */
@Directive({
    selector: "[menuPositioner]",
    exportAs: "menuPositioner",
    host: {
        role: "presentation",
        "data-menu-part": "positioner",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
        "[attr.data-nested]": "data().nested",
    },
})
export class MenuPositioner {
    private readonly level = inject(MenuRoot);
    readonly side = input<Side | undefined>(undefined);
    readonly align = input<Align | undefined>(undefined);
    readonly sideOffset = input<number | undefined>(undefined);
    readonly alignOffset = input<number | undefined>(undefined);
    readonly collisionPadding = input<number | undefined>(undefined);
    readonly anchor = input<Element | null | undefined>(undefined);
    readonly state = computed<MenuPositionerState>(() => ({
        open: this.level.overlay.open(),
        ...this.level.placed(),
    }));
    protected readonly data = computed(() =>
        dataValues({ ...this.state(), nested: this.level.nested }),
    );

    constructor() {
        const overlay = this.level.overlay;
        const positioner = registerHost(overlay.positioner);
        positionOverlay(
            this,
            this.level.nested
                ? { side: "end", align: "start" }
                : { side: "bottom", align: "start" },
            { anchor: overlay.trigger, positioner },
            this.level.placed,
        );
    }
}
