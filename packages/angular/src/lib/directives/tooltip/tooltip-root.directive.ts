import {
    booleanAttribute,
    computed,
    DestroyRef,
    Directive,
    effect,
    inject,
    input,
    output,
    signal,
    untracked,
} from "@angular/core";
import {
    createDelayGroup,
    createHoverIntent,
    trackHoverBridge,
} from "@poc/dom";
import type {
    ChangeReason,
    OpenChangeEvent,
} from "../../utils/change-details.ts";
import { createOverlayRoot } from "../../utils/overlay-root.ts";
import { placementSignal } from "../../utils/positioner.ts";
import { TooltipProvider } from "./tooltip-provider.directive.ts";

export interface TooltipState {
    open: boolean;
    instant: boolean;
}

/**
 * Holds the tooltip's state and its hover intent; renders no element (spec/tooltip.md):
 * `<ng-container tooltipRoot [(open)]="open" [delay]="500">`.
 */
@Directive({ selector: "[tooltipRoot]", exportAs: "tooltipRoot" })
export class TooltipRoot {
    readonly open = input<boolean | undefined>(undefined);
    readonly openChange = output<boolean>();
    readonly defaultOpen = input(false);
    readonly openChangeDetails = output<OpenChangeEvent>();
    /** ms before a hovered trigger opens (default: the Provider's, else 600). */
    readonly delay = input<number | undefined>(undefined);
    /** ms before it closes once the pointer left (default: the Provider's, else 0). */
    readonly closeDelay = input<number | undefined>(undefined);
    readonly disabled = input(false, { transform: booleanAttribute });

    readonly overlay = createOverlayRoot(
        this,
        (event) => this.openChangeDetails.emit(event),
        "poc-tooltip",
    );
    readonly arrow = signal<HTMLElement | null>(null);
    readonly placed = placementSignal({ side: "top", align: "center" });
    readonly instant = signal(false);
    readonly state = computed<TooltipState>(() => ({
        open: this.overlay.open(),
        instant: this.instant(),
    }));

    private readonly provider = inject(TooltipProvider, { optional: true });
    // a Root outside any Provider is alone in its own group
    private readonly ownGroup = createDelayGroup({ timeout: 0 });
    private readonly intent = createHoverIntent({
        open: () => this.show("trigger-hover", false),
        close: () => this.hide("trigger-hover"),
    });
    /** A press on the trigger blocks reopening until the pointer leaves. */
    private blocked = false;
    private openedByHover = false;
    /** How the group closes this tooltip when another one opens. */
    private readonly member = () => this.hide("trigger-hover");

    constructor() {
        const overlay = this.overlay;
        inject(DestroyRef).onDestroy(() => this.intent.cancel());

        // the group hears this tooltip close (it opens in `show`, an event: closing the previous
        // member renders at once, which an effect must not do)
        let member: (() => void) | null = null;
        effect(() => {
            const open = overlay.open();
            untracked(() => {
                if (open && member === null) {
                    member = this.member;
                } else if (!open && member !== null) {
                    this.group().closed(member);
                    member = null;
                }
            });
        });

        // a hover-opened tooltip closes once the pointer leaves the trigger, the popup and the gap
        effect((onCleanup) => {
            const open = overlay.open();
            const trigger = overlay.trigger();
            const popup = overlay.popup();
            if (!open || !this.openedByHover || trigger === null) {
                return;
            }
            const intent = this.intent;
            onCleanup(
                trackHoverBridge(trigger, popup, {
                    inside: () => intent.cancel(),
                    outside: () => intent.leave(untracked(this.closeAfter)),
                }),
            );
        });

        // Escape closes it and stops there
        effect((onCleanup) => {
            const open = overlay.open();
            const trigger = overlay.trigger();
            if (!open || trigger === null) {
                return;
            }
            const doc = trigger.ownerDocument;
            const onKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    event.stopPropagation();
                    this.intent.cancel();
                    this.hide("escape-key");
                }
            };
            doc.addEventListener("keydown", onKeyDown, true);
            onCleanup(() =>
                doc.removeEventListener("keydown", onKeyDown, true),
            );
        });
    }

    private group() {
        return this.provider?.group() ?? this.ownGroup;
    }

    private readonly openAfter = computed(
        () => this.delay() ?? this.provider?.delay() ?? 600,
    );
    private readonly closeAfter = computed(
        () => this.closeDelay() ?? this.provider?.closeDelay() ?? 0,
    );

    /** Opens now; `instant` when no delay ran (focus, the group's hand-off). */
    show(reason: ChangeReason, instant: boolean): void {
        this.openedByHover = reason === "trigger-hover";
        this.instant.set(instant);
        this.overlay.setOpen(true, reason);
        // one open tooltip per group: the previous one closes
        if (untracked(this.overlay.open)) {
            this.group().opened(this.member);
        }
    }

    hide(reason: ChangeReason): void {
        this.overlay.setOpen(false, reason);
    }

    /** The trigger's hover: starts the delay (or opens at once in a hand-off). */
    hoverStart(): void {
        if (this.disabled() || this.blocked) {
            return;
        }
        if (this.overlay.open()) {
            this.intent.cancel();
        } else if (this.group().isInstant()) {
            this.intent.cancel();
            this.show("trigger-hover", true);
        } else {
            this.intent.enter(this.openAfter());
        }
    }

    hoverEnd(): void {
        this.blocked = false;
        if (!this.overlay.open()) {
            this.intent.cancel();
        }
    }

    /** A press on the trigger closes and blocks reopening until the pointer leaves. */
    press(): void {
        this.blocked = true;
        this.intent.cancel();
        if (this.overlay.open()) {
            this.hide("trigger-press");
        }
    }
}
