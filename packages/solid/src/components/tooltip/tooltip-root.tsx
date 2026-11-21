import {
    createDelayGroup,
    createHoverIntent,
    trackHoverBridge,
} from "@poc/dom";
import type { JSX } from "@solidjs/web";
import { createEffect, createSignal, onCleanup, useContext } from "solid-js";
import {
    createOverlayRoot,
    type OverlayRootProps,
} from "../../hooks/create-overlay-root.ts";
import { createPlacement } from "../../hooks/create-positioner.ts";
import type { ChangeReason } from "../../utils/change-details.ts";
import {
    TooltipContext,
    type TooltipContextValue,
    TooltipProviderContext,
} from "./tooltip-context.ts";

export interface TooltipRootProps extends OverlayRootProps {
    /** ms before a hovered trigger opens (default: the Provider's, else 600). */
    delay?: number;
    /** ms before it closes once the pointer left (default: the Provider's, else 0). */
    closeDelay?: number;
    disabled?: boolean;
    children?: JSX.Element;
}

/** Holds the tooltip's state and its hover intent; renders no element (spec/tooltip.md). */
export function TooltipRoot(props: TooltipRootProps) {
    const root = createOverlayRoot(props);
    const provider = useContext(TooltipProviderContext);
    // a Root outside any Provider is alone in its own group
    const ownGroup = createDelayGroup({ timeout: 0 });
    const group = () => provider?.group() ?? ownGroup;
    const delay = () => props.delay ?? provider?.delay() ?? 600;
    const closeDelay = () => props.closeDelay ?? provider?.closeDelay() ?? 0;
    const disabled = () => props.disabled ?? false;
    const [instant, setInstant] = createSignal(false);
    const [arrow, setArrow] = createSignal<HTMLElement | null>(null);
    const [placed, setPlaced] = createPlacement(() => ({
        side: "top",
        align: "center",
    }));
    let blocked = false;
    let openedByHover = false;

    const show = (reason: ChangeReason, isInstant: boolean) => {
        openedByHover = reason === "trigger-hover";
        setInstant(isInstant);
        root.setOpen(true, reason);
    };
    const hide = (reason: ChangeReason) => root.setOpen(false, reason);
    const intent = createHoverIntent({
        open: () => show("trigger-hover", false),
        close: () => hide("trigger-hover"),
    });
    onCleanup(intent.cancel);

    // one open tooltip per group: the previous one closes when this one opens
    const member = () => hide("trigger-hover");
    createEffect(
        () => ({ open: root.open(), current: group() }),
        ({ open, current }) => {
            if (!open) {
                return undefined;
            }
            current.opened(member);
            return () => current.closed(member);
        },
    );

    // a hover-opened tooltip closes once the pointer leaves the trigger, the popup and the gap
    createEffect(
        () => ({
            open: root.open(),
            trigger: root.trigger(),
            popup: root.popup(),
        }),
        ({ open, trigger, popup }) => {
            if (!open || !openedByHover || trigger === null) {
                return undefined;
            }
            return trackHoverBridge(trigger, popup, {
                inside: () => intent.cancel(),
                outside: () => intent.leave(closeDelay()),
            });
        },
    );

    // Escape closes it and stops there
    createEffect(
        () => ({ open: root.open(), trigger: root.trigger() }),
        ({ open, trigger }) => {
            if (!open || trigger === null) {
                return undefined;
            }
            const doc = trigger.ownerDocument;
            const onKeyDown = (event: KeyboardEvent) => {
                if (event.key === "Escape") {
                    event.stopPropagation();
                    intent.cancel();
                    hide("escape-key");
                }
            };
            doc.addEventListener("keydown", onKeyDown, true);
            return () => doc.removeEventListener("keydown", onKeyDown, true);
        },
    );

    const value: TooltipContextValue = {
        ...root,
        show,
        hide,
        hoverStart: () => {
            if (disabled() || blocked) {
                return;
            }
            if (root.open()) {
                intent.cancel();
            } else if (group().isInstant()) {
                intent.cancel();
                show("trigger-hover", true);
            } else {
                intent.enter(delay());
            }
        },
        hoverEnd: () => {
            blocked = false;
            if (!root.open()) {
                intent.cancel();
            }
        },
        press: () => {
            blocked = true;
            intent.cancel();
            if (root.open()) {
                hide("trigger-press");
            }
        },
        instant,
        disabled,
        arrow,
        setArrow: (element) => setArrow(element),
        placed,
        setPlaced,
    };
    return <TooltipContext value={value}>{props.children}</TooltipContext>;
}
