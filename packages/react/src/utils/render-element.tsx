import {
    type CSSProperties,
    cloneElement,
    createElement,
    isValidElement,
    type ReactElement,
    type ReactNode,
    type Ref,
} from "react";
import { mergeProps } from "./merge-props.ts";
import { mergeRefs } from "./merge-refs.ts";

/** `render`: an element to merge the part's props into, or a function of props and state. */
export type RenderProp<State> =
    | ReactElement
    | ((props: Record<string, unknown>, state: State) => ReactNode);

/** The props every part accepts besides its own (the primitive contract). */
export interface PartProps<State> {
    render?: RenderProp<State>;
    className?: string | ((state: State) => string | undefined);
    style?: CSSProperties | ((state: State) => CSSProperties | undefined);
    ref?: Ref<HTMLElement>;
    children?: ReactNode;
    [key: string]: unknown;
}

/**
 * Renders a part: the default element, or the consumer's `render`, with the part's props merged
 * into the consumer's (`className` and `style` resolved against the state first).
 */
export function renderElement<State>(
    tag: string,
    consumer: PartProps<State>,
    state: State,
    internal: Record<string, unknown>,
    internalRef?: Ref<HTMLElement>,
): ReactNode {
    const { render, className, style, ref, ...rest } = consumer;
    const resolved: Record<string, unknown> = { ...rest };
    const resolvedClass =
        typeof className === "function" ? className(state) : className;
    if (resolvedClass !== undefined) {
        resolved.className = resolvedClass;
    }
    const resolvedStyle = typeof style === "function" ? style(state) : style;
    if (resolvedStyle !== undefined) {
        resolved.style = resolvedStyle;
    }
    const props = mergeProps(internal, resolved);
    props.ref = mergeRefs(internalRef, ref);
    if (typeof render === "function") {
        return render(props, state);
    }
    if (isValidElement<Record<string, unknown>>(render)) {
        const elementProps = render.props;
        const merged = mergeProps(props, elementProps);
        merged.ref = mergeRefs(
            props.ref as Ref<HTMLElement>,
            elementProps.ref as Ref<HTMLElement> | undefined,
        );
        return cloneElement(render, merged);
    }
    return createElement(tag, props);
}
