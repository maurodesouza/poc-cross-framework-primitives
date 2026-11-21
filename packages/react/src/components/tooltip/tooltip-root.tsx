import {
    type Align,
    createDelayGroup,
    createHoverIntent,
    isInHoverBridge,
    type Side,
} from "@poc/dom";
import {
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    type OverlayRootProps,
    useOverlayRoot,
} from "../../hooks/use-overlay-root.ts";
import type { ChangeReason } from "../../utils/change-details.ts";
import { TooltipContext, TooltipProviderContext } from "./tooltip-context.ts";

export interface TooltipRootProps extends OverlayRootProps {
    /** ms before a hovered trigger opens (default: the Provider's, else 600). */
    delay?: number;
    /** ms before it closes once the pointer left (default: the Provider's, else 0). */
    closeDelay?: number;
    disabled?: boolean;
    children?: ReactNode;
}

/** Holds the tooltip's state and its hover intent; renders no element (spec/tooltip.md). */
export function TooltipRoot({
    delay: delayProp,
    closeDelay: closeDelayProp,
    disabled = false,
    children,
    ...overlayProps
}: TooltipRootProps) {
    const root = useOverlayRoot(overlayProps);
    const provider = useContext(TooltipProviderContext);
    // a Root outside any Provider is alone in its own group
    const ownGroup = useMemo(() => createDelayGroup({ timeout: 0 }), []);
    const group = provider?.group ?? ownGroup;
    const delay = delayProp ?? provider?.delay ?? 600;
    const closeDelay = closeDelayProp ?? provider?.closeDelay ?? 0;
    const [instant, setInstant] = useState(false);
    const [arrow, setArrow] = useState<HTMLElement | null>(null);
    const [placed, setPlaced] = useState<{ side: Side; align: Align }>({
        side: "top",
        align: "center",
    });
    const { open, setOpen, trigger, popup } = root;
    const blocked = useRef(false);
    const openedByHover = useRef(false);

    const show = useCallback(
        (reason: ChangeReason, isInstant: boolean) => {
            openedByHover.current = reason === "trigger-hover";
            setInstant(isInstant);
            setOpen(true, reason);
        },
        [setOpen],
    );
    const hide = useCallback(
        (reason: ChangeReason) => setOpen(false, reason),
        [setOpen],
    );
    const intent = useMemo(
        () =>
            createHoverIntent({
                open: () => show("trigger-hover", false),
                close: () => hide("trigger-hover"),
            }),
        [show, hide],
    );
    useEffect(() => intent.cancel, [intent]);

    const hoverStart = useCallback(() => {
        if (disabled || blocked.current) {
            return;
        }
        if (open) {
            intent.cancel();
        } else if (group.isInstant()) {
            intent.cancel();
            show("trigger-hover", true);
        } else {
            intent.enter(delay);
        }
    }, [disabled, open, group, intent, show, delay]);
    const hoverEnd = useCallback(() => {
        blocked.current = false;
        if (!open) {
            intent.cancel();
        }
    }, [open, intent]);
    const press = useCallback(() => {
        blocked.current = true;
        intent.cancel();
        if (open) {
            hide("trigger-press");
        }
    }, [open, intent, hide]);

    // one open tooltip per group: the previous one closes when this one opens
    const closeForGroup = useRef(() => hide("trigger-hover"));
    closeForGroup.current = () => hide("trigger-hover");
    const groupMember = useRef(() => closeForGroup.current());
    useEffect(() => {
        if (!open) {
            return undefined;
        }
        const member = groupMember.current;
        group.opened(member);
        return () => group.closed(member);
    }, [open, group]);

    // a hover-opened tooltip closes once the pointer leaves the trigger, the popup and the gap
    useEffect(() => {
        if (!open || !openedByHover.current || trigger === null) {
            return undefined;
        }
        const doc = trigger.ownerDocument;
        const onMove = (event: PointerEvent) => {
            const point = { x: event.clientX, y: event.clientY };
            const inside =
                popup !== null
                    ? isInHoverBridge(point, trigger, popup)
                    : trigger.contains(event.target as Node);
            if (inside) {
                intent.cancel();
            } else {
                intent.leave(closeDelay);
            }
        };
        doc.addEventListener("pointermove", onMove);
        return () => doc.removeEventListener("pointermove", onMove);
    }, [open, trigger, popup, intent, closeDelay]);

    // Escape closes it and stops there
    useEffect(() => {
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
    }, [open, trigger, intent, hide]);

    const value = useMemo(
        () => ({
            ...root,
            show,
            hide,
            hoverStart,
            hoverEnd,
            press,
            instant,
            disabled,
            arrow,
            setArrow,
            placed,
            setPlaced,
        }),
        [
            root,
            show,
            hide,
            hoverStart,
            hoverEnd,
            press,
            instant,
            disabled,
            arrow,
            placed,
        ],
    );
    return (
        <TooltipContext.Provider value={value}>
            {children}
        </TooltipContext.Provider>
    );
}
