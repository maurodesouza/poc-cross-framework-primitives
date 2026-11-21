import { createHoverIntent, type DelayGroup, type HoverIntent } from "@poc/dom";
import type { ChangeReason } from "../../utils/change-details.ts";
import { createContext } from "../../utils/context.ts";
import { OverlayRoot } from "../../utils/overlay-root.svelte.ts";

/** A Provider's delays and its delay group (spec/tooltip.md, "Delay group"). */
export interface TooltipProviderValue {
    readonly delay: number;
    readonly closeDelay: number;
    readonly group: DelayGroup;
}

export const TooltipProviderContext =
    createContext<TooltipProviderValue>("Tooltip.Provider");

export class TooltipState extends OverlayRoot {
    arrow = $state<HTMLElement | null>(null);
    /** Opened with no delay (focus, the group's hand-off). */
    instant = $state(false);
    /** A press on the trigger blocks reopening until the pointer leaves. */
    blocked = false;
    openedByHover = false;
    readonly intent: HoverIntent;

    constructor(
        overlay: ConstructorParameters<typeof OverlayRoot>[0],
        readonly options: {
            delay: () => number;
            closeDelay: () => number;
            disabled: () => boolean;
            group: () => DelayGroup;
        },
    ) {
        super({ ...overlay, placed: { side: "top", align: "center" } });
        this.intent = createHoverIntent({
            open: () => this.show("trigger-hover", false),
            close: () => this.hide("trigger-hover"),
        });
    }

    get disabled(): boolean {
        return this.options.disabled();
    }

    /** Opens now; `instant` when no delay ran. */
    show(reason: ChangeReason, instant: boolean): void {
        this.openedByHover = reason === "trigger-hover";
        this.instant = instant;
        this.setOpen(true, reason);
    }

    hide(reason: ChangeReason): void {
        this.setOpen(false, reason);
    }

    /** The trigger's hover: starts the delay (or opens at once in a hand-off). */
    hoverStart(): void {
        if (this.disabled || this.blocked) {
            return;
        }
        if (this.open) {
            this.intent.cancel();
        } else if (this.options.group().isInstant()) {
            this.intent.cancel();
            this.show("trigger-hover", true);
        } else {
            this.intent.enter(this.options.delay());
        }
    }

    hoverEnd(): void {
        this.blocked = false;
        if (!this.open) {
            this.intent.cancel();
        }
    }

    /** A press closes and blocks reopening until the pointer leaves. */
    press(): void {
        this.blocked = true;
        this.intent.cancel();
        if (this.open) {
            this.hide("trigger-press");
        }
    }
}

export const TooltipContext = createContext<TooltipState>("Tooltip");
