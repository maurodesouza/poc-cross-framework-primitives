import { computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { TooltipRoot } from "./tooltip-root.directive.ts";

export interface TooltipPopupState {
    open: boolean;
    side: string;
    align: string;
    instant: boolean;
}

/** The `tooltip`; never takes focus (spec/tooltip.md): `<div tooltipPopup>`. */
@Directive({
    selector: "[tooltipPopup]",
    exportAs: "tooltipPopup",
    host: {
        role: "tooltip",
        "data-tooltip-part": "popup",
        "[attr.id]": "root.overlay.popupId",
        "[attr.data-open]": "data().open",
        "[attr.data-side]": "data().side",
        "[attr.data-align]": "data().align",
        "[attr.data-instant]": "data().instant",
        "[attr.data-starting-style]": "data()['starting-style']",
        "[attr.data-ending-style]": "data()['ending-style']",
    },
})
export class TooltipPopup {
    protected readonly root = inject(TooltipRoot);
    readonly state = computed<TooltipPopupState>(() => ({
        open: this.root.overlay.open(),
        instant: this.root.instant(),
        ...this.root.placed(),
    }));
    protected readonly data = computed(() => {
        const status = this.root.overlay.presence.status();
        return dataValues({
            ...this.state(),
            "starting-style": status === "starting",
            "ending-style": status === "ending",
        });
    });

    constructor() {
        registerHost(this.root.overlay.popup);
    }
}
