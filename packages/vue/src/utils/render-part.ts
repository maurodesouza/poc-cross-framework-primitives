import {
    type Component,
    Fragment,
    type FunctionalComponent,
    h,
    mergeProps,
    type PropType,
    type Slots,
    type VNode,
    type VNodeChild,
} from "vue";

/** A tag or component a part renders instead of its own element (the `as` prop, never `asChild`). */
export type AsProp = string | Component;

/** The `as` prop every part takes. */
export const asProp = {
    as: {
        type: [String, Object, Function] as PropType<AsProp>,
        default: undefined,
    },
};

/** What a part's `render` scoped slot receives (spec/README.md, API mapping: Vue). */
export interface RenderSlotProps<State> {
    /** Bind on your own element (`v-bind="props"`): ARIA, `data-*`, listeners, the template ref. */
    props: Record<string, unknown>;
    state: State;
    /** The part's content, as one stable component (`<component :is="children" />`). */
    children: VNode;
}

const PartChildren: FunctionalComponent<{
    content?: (() => VNodeChild) | undefined;
}> = (props) => props.content?.();
PartChildren.props = ["content"];

/**
 * Renders a part: the part's props merged with the consumer's attributes (Vue's `mergeProps`:
 * `class` and `style` join, listeners run the part's first, other attributes the consumer's), on
 * the default element, on `as`, or through the `render` slot.
 */
export function renderPart<State>(
    tag: string,
    context: { attrs: Record<string, unknown>; slots: Slots },
    as: AsProp | undefined,
    state: State,
    internal: Record<string, unknown>,
    children?: () => VNodeChild,
): VNode {
    const props = mergeProps(internal, context.attrs);
    const content = children ?? (() => context.slots.default?.({ state }));
    const render = context.slots.render;
    if (render) {
        return h(
            Fragment,
            render({ props, state, children: h(PartChildren, { content }) }),
        );
    }
    // an element's children must be an array: a single vnode would read as a slots object
    return h(as ?? tag, props, {
        default: () => {
            const nodes = content();
            return Array.isArray(nodes) ? nodes : [nodes];
        },
    });
}
