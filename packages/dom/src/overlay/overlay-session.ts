import { watchFocusOutside } from "../layers/focus-outside.ts";
import { pushLayer } from "../layers/layer-stack.ts";

/** How an overlay asks to be dismissed (spec/README.md, "Change details"). */
export type DismissReason = "escape-key" | "outside-press" | "focus-out";

type Elements = () => readonly (Element | null | undefined)[];

export interface OverlaySessionOptions {
    /** The overlay's own elements (its positioner or popup). */
    elements: Elements;
    /** Elements a press on does not dismiss it (its trigger, which toggles it itself). */
    ignore?: Elements;
    /** Called when Escape, an outside press or (with `focusOut`) focus leaving dismisses it. */
    dismiss: (reason: DismissReason) => void;
    /**
     * Non-modal overlays: dismiss when focus moves outside the overlay, its child layers and these
     * elements (usually the trigger).
     */
    focusOut?: Elements;
    /**
     * Where focus goes when the session ends: `to()` when `reason()` (the reason the overlay closed)
     * is one of `when` (or always, without `when`); nowhere otherwise. `to()` may return `false`
     * for "do not move focus".
     */
    returnFocus?: {
        when?: ReadonlySet<string>;
        reason: () => string | null;
        to: () => HTMLElement | null | false;
    };
}

export interface OverlaySession {
    /** The elements of the layers opened after this one (its child layers). */
    elementsAbove: () => Element[];
    /** Ends the session: removes the layer and the focus watch, then returns focus if due. */
    end: () => void;
}

/**
 * The wiring every overlay repeats (docs/reports/checkpoint.md, boundary pressure 2): its layer
 * (Escape, outside presses), the non-modal focus-out watch, and the focus return by close reason.
 * It holds no component state: the framework passes what it knows through the callbacks.
 */
export function openOverlaySession(
    doc: Document,
    options: OverlaySessionOptions,
): OverlaySession {
    const layer = pushLayer(doc, {
        elements: options.elements,
        ignore: options.ignore,
        onEscape: () => options.dismiss("escape-key"),
        onOutsidePress: () => options.dismiss("outside-press"),
    });
    const focusOut = options.focusOut;
    const stopWatching = focusOut
        ? watchFocusOutside(
              doc,
              () => [
                  ...options.elements(),
                  ...focusOut(),
                  ...layer.elementsAbove(),
              ],
              () => options.dismiss("focus-out"),
          )
        : () => {};
    let ended = false;
    return {
        elementsAbove: () => layer.elementsAbove(),
        end() {
            if (ended) {
                return;
            }
            ended = true;
            layer.remove();
            stopWatching();
            const returnFocus = options.returnFocus;
            if (
                returnFocus &&
                (!returnFocus.when ||
                    returnFocus.when.has(returnFocus.reason() ?? ""))
            ) {
                const target = returnFocus.to();
                if (target) {
                    target.focus({ preventScroll: true });
                }
            }
        },
    };
}
