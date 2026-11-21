import {
    getDirection,
    sliderKeyTarget,
    thumbBounds,
    valueToPercent,
} from "@poc/dom";
import { defineComponent, type PropType, shallowRef, watch } from "vue";
import { elementSetter } from "../../composables/use-overlay-root.ts";
import { useRequiredContext } from "../../composables/use-required-context.ts";
import { asProp, renderPart } from "../../utils/render-part.ts";
import { stateAttributes } from "../../utils/state-attributes.ts";
import { SliderKey } from "./slider-context.ts";

/** A `slider`: one value of the slider (spec/slider.md). */
export const SliderThumb = defineComponent({
    name: "SliderThumb",
    inheritAttrs: false,
    props: {
        ...asProp,
        /** Its value's index (default: its order among the thumbs). */
        index: { type: Number, default: undefined },
        /** The text for `aria-valuetext`. */
        getAriaValueText: {
            type: Function as PropType<
                (value: number, index: number) => string
            >,
            default: undefined,
        },
        disabled: { type: Boolean, default: false },
    },
    setup(props, { attrs, slots }) {
        const context = useRequiredContext(SliderKey, "Slider.Thumb");
        const element = shallowRef<HTMLElement | null>(null);
        const setElement = elementSetter(element);
        watch(
            element,
            (node, _, onCleanup) => {
                if (node !== null) {
                    onCleanup(context.registerThumb(node));
                }
            },
            { flush: "post" },
        );

        const index = () => {
            const order =
                element.value === null
                    ? -1
                    : context.thumbs.value.indexOf(element.value);
            return props.index ?? Math.max(order, 0);
        };
        const bounds = () =>
            thumbBounds(context.values.value, index(), {
                min: context.min(),
                max: context.max(),
                step: context.step(),
                minStepsBetweenValues: context.minStepsBetweenValues(),
            });
        const rtl = () =>
            element.value !== null && getDirection(element.value) === "rtl";

        const onKeydown = (event: KeyboardEvent) => {
            if (props.disabled || context.disabled()) {
                return;
            }
            const position = index();
            const value = context.values.value[position] ?? context.min();
            const { min, max } = bounds();
            const target = sliderKeyTarget(event.key, event.shiftKey, value, {
                step: context.step(),
                largeStep: context.largeStep(),
                min,
                max,
                orientation: context.orientation(),
                rtl: rtl(),
            });
            if (target === null) {
                return;
            }
            event.preventDefault();
            context.commit(context.setThumb(position, target, "keyboard"));
        };

        return () => {
            const position = index();
            const value = context.values.value[position] ?? context.min();
            const disabled = props.disabled || context.disabled();
            const orientation = context.orientation();
            const dragging =
                context.dragging.value &&
                context.activeIndex.value === position;
            const { min, max } = bounds();
            const percent = valueToPercent(value, context.min(), context.max());
            // structural: the thumb's centre on its value
            const style =
                orientation === "vertical"
                    ? {
                          position: "absolute",
                          insetBlockEnd: `${percent}%`,
                          left: "50%",
                          translate: "-50% 50%",
                      }
                    : {
                          position: "absolute",
                          insetInlineStart: `${percent}%`,
                          top: "50%",
                          translate: rtl() ? "50% -50%" : "-50% -50%",
                      };
            return renderPart(
                "div",
                { attrs, slots },
                props.as,
                { value, index: position, orientation, disabled, dragging },
                {
                    role: "slider",
                    tabindex: disabled ? undefined : 0,
                    "aria-valuenow": value,
                    "aria-valuemin": min,
                    "aria-valuemax": max,
                    "aria-valuetext": props.getAriaValueText?.(value, position),
                    "aria-orientation": orientation,
                    "aria-disabled": disabled ? "true" : undefined,
                    "data-slider-part": "thumb",
                    ...stateAttributes({
                        orientation,
                        index: String(position),
                        disabled,
                        dragging,
                    }),
                    style,
                    onKeydown,
                    ref: setElement,
                },
            );
        };
    },
});
