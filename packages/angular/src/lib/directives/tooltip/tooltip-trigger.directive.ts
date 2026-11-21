import { afterNextRender, computed, Directive, inject } from "@angular/core";
import { registerHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { TooltipRoot } from "./tooltip-root.directive.ts";

function isFocusVisible(element: Element): boolean {
    try {
        return element.matches(":focus-visible");
    } catch {
        return true;
    }
}

/** The described control and the anchor (spec/tooltip.md): `<button tooltipTrigger>`. */
@Directive({
    selector: "[tooltipTrigger]",
    exportAs: "tooltipTrigger",
    host: {
        type: "button",
        "data-tooltip-part": "trigger",
        "[attr.aria-describedby]": "describedBy()",
        "[attr.data-open]": "data().open",
        "(pointerenter)": "onPointerEnter($event)",
        "(pointerleave)": "onPointerLeave($event)",
        "(pointerdown)": "root.press()",
        "(focus)": "onFocus()",
        "(blur)": "onBlur()",
    },
})
export class TooltipTrigger {
    protected readonly root = inject(TooltipRoot);
    readonly state = computed(() => ({ open: this.root.overlay.open() }));
    protected readonly data = computed(() => dataValues(this.state()));
    private readonly host = registerHost(this.root.overlay.trigger);
    /** The consumer's own description, kept before the tooltip's. */
    private readonly ownDescription =
        this.host.getAttribute("aria-describedby");
    protected readonly describedBy = computed(
        () =>
            [
                this.ownDescription,
                this.state().open ? this.root.overlay.popupId : null,
            ]
                .filter(Boolean)
                .join(" ") || null,
    );

    constructor() {
        // the consumer's own id wins
        afterNextRender(() => {
            if (this.host.id === "") {
                this.host.id = this.root.overlay.triggerId;
            }
        });
    }

    protected onPointerEnter(event: PointerEvent): void {
        // a tap never opens a tooltip
        if (event.pointerType !== "touch") {
            this.root.hoverStart();
        }
    }

    protected onPointerLeave(event: PointerEvent): void {
        if (event.pointerType !== "touch") {
            this.root.hoverEnd();
        }
    }

    protected onFocus(): void {
        if (!this.root.disabled() && isFocusVisible(this.host)) {
            this.root.show("trigger-focus", true);
        }
    }

    protected onBlur(): void {
        if (this.root.overlay.open()) {
            this.root.hide("trigger-focus");
        }
    }
}
