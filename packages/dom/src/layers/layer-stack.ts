/**
 * The stack of open overlays of a document (spec/dialog.md, "Dismissal and layering"). Escape and
 * outside presses go to the topmost layer first:
 *
 * - Escape closes the topmost layer only;
 * - a press is walked from the top: each layer the press is outside of is dismissed, until a
 *   layer that contains it (a layer opened inside another counts as inside it, since it is above).
 */
export interface LayerOptions {
    /** The elements that make up the layer (its popup, positioner, backdrop). */
    elements: () => readonly (Element | null | undefined)[];
    /** Elements a press on does not dismiss the layer (its trigger, which toggles it itself). */
    ignore?: () => readonly (Element | null | undefined)[];
    onEscape?: (event: KeyboardEvent) => void;
    onOutsidePress?: (event: PointerEvent) => void;
}

export interface Layer {
    /** Whether the layer is the topmost one of its document. */
    isTop: () => boolean;
    /** The elements of the layers opened after this one (its child layers). */
    elementsAbove: () => Element[];
    remove: () => void;
}

interface Stack {
    layers: LayerOptions[];
    teardown: () => void;
}

const stacks = new WeakMap<Document, Stack>();

function contains(
    list: readonly (Element | null | undefined)[],
    target: EventTarget | null,
): boolean {
    return (
        target instanceof Node &&
        list.some((element) => element?.contains(target) === true)
    );
}

function createStack(doc: Document): Stack {
    const stack: Stack = { layers: [], teardown: () => {} };
    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape" || event.defaultPrevented) {
            return;
        }
        const top = stack.layers.at(-1);
        if (top?.onEscape) {
            event.preventDefault();
            event.stopPropagation();
            top.onEscape(event);
        }
    };
    const onPointerDown = (event: PointerEvent) => {
        for (const layer of [...stack.layers].reverse()) {
            if (contains(layer.elements(), event.target)) {
                return;
            }
            if (layer.ignore && contains(layer.ignore(), event.target)) {
                return;
            }
            layer.onOutsidePress?.(event);
        }
    };
    doc.addEventListener("keydown", onKeyDown, true);
    doc.addEventListener("pointerdown", onPointerDown, true);
    stack.teardown = () => {
        doc.removeEventListener("keydown", onKeyDown, true);
        doc.removeEventListener("pointerdown", onPointerDown, true);
    };
    return stack;
}

/** Pushes a layer on its document's stack; `remove` pops it (in any order). */
export function pushLayer(doc: Document, options: LayerOptions): Layer {
    let stack = stacks.get(doc);
    if (stack === undefined) {
        stack = createStack(doc);
        stacks.set(doc, stack);
    }
    const current = stack;
    current.layers.push(options);
    return {
        isTop: () => current.layers.at(-1) === options,
        elementsAbove: () =>
            current.layers
                .slice(current.layers.indexOf(options) + 1)
                .flatMap((layer) => layer.elements())
                .filter((element): element is Element => element != null),
        remove: () => {
            const index = current.layers.indexOf(options);
            if (index !== -1) {
                current.layers.splice(index, 1);
            }
            if (current.layers.length === 0) {
                current.teardown();
                stacks.delete(doc);
            }
        },
    };
}
