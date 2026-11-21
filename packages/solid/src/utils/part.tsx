import { dynamic, type JSX } from "@solidjs/web";
import { createMemo, merge, omit, untrack } from "solid-js";
import { mergeProps, type Props } from "./merge-props.ts";

/** `render`: a function of the part's props (spread them on the element) and its state. */
export type RenderProp<State> = (props: Props, state: State) => JSX.Element;

/** A ref: a callback, or several (Solid 2 refs are functions; arrays compose). */
export type ElementRef =
    | ((element: HTMLElement) => void)
    | readonly ElementRef[]
    | undefined;

/** The props every part accepts besides its own (the primitive contract). */
export interface PartProps<State> {
    render?: RenderProp<State>;
    class?: JSX.ClassValue | ((state: State) => JSX.ClassValue);
    style?:
        | JSX.CSSProperties
        | string
        | ((state: State) => JSX.CSSProperties | string | undefined);
    ref?: ElementRef;
    children?: JSX.Element;
    [key: string]: unknown;
}

export interface PartOptions {
    /** The part's own element ref (registers it in its root). */
    ref?: (element: HTMLElement) => void;
    /** The part's own content, used when it renders its children itself. */
    children?: () => JSX.Element;
    /** Props of the part's own that are not attributes. */
    omit?: readonly string[];
}

const PART_KEYS = ["render", "class", "style", "ref", "children"] as const;

function applyRef(ref: ElementRef, element: HTMLElement): void {
    if (typeof ref === "function") {
        ref(element);
    } else if (Array.isArray(ref)) {
        for (const each of ref) {
            applyRef(each, element);
        }
    }
}

/**
 * Renders a part: the default element, or the consumer's `render`, with the part's props merged
 * into the consumer's (`class` and `style` resolved against the state first). Everything stays
 * reactive: the merged props are a memo the element's spread follows.
 */
export function renderPart<State extends object>(
    tag: string,
    consumer: PartProps<State>,
    state: () => State,
    internal: () => Props,
    options: PartOptions = {},
): JSX.Element {
    const rest = omit(
        consumer,
        ...([
            ...PART_KEYS,
            ...(options.omit ?? []),
        ] as (keyof PartProps<State>)[]),
    ) as Props;
    const attributes = createMemo(() => {
        const current = state();
        const resolved: Props = { ...rest };
        const className = consumer.class;
        const resolvedClass =
            typeof className === "function" ? className(current) : className;
        if (resolvedClass !== undefined) {
            resolved.class = resolvedClass;
        }
        const style = consumer.style;
        const resolvedStyle =
            typeof style === "function" ? style(current) : style;
        if (resolvedStyle !== undefined) {
            resolved.style = resolvedStyle;
        }
        return mergeProps(internal(), resolved);
    });
    const props = merge(attributes, {
        ref: (element: HTMLElement) => {
            options.ref?.(element);
            applyRef(consumer.ref, element);
        },
        get children() {
            return options.children ? options.children() : consumer.children;
        },
    }) as Props;
    const view = merge(state) as State;
    // a static tag: `<Dynamic component={tag}>` (or a non-static `dynamic`) builds the element in
    // a memo that tracks the merged props, so every change of them would create a new element
    const Element = dynamic(() => tag, { static: true });
    // a memo, not a bare function: a parent resolving its children calls a function child again
    // each time it re-resolves, which would build the element again
    return createMemo(() => {
        const render = consumer.render;
        return render
            ? untrack(() => render(props, view))
            : untrack(() => <Element {...props} />);
    }) as unknown as JSX.Element;
}
