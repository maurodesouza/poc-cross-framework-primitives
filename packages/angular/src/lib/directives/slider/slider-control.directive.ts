import { computed, DestroyRef, Directive, inject } from "@angular/core";
import {
    fractionAlong,
    getDirection,
    nearestThumb,
    startDrag,
    valueAtFraction,
} from "@poc/dom";
import { injectFlush } from "../../utils/flush.ts";
import { injectHost } from "../../utils/host-element.ts";
import { dataValues } from "../../utils/state-attributes.ts";
import { SliderRoot } from "./slider-root.directive.ts";

/**
 * The interactive area: a press moves the nearest thumb there, then drags it with pointer capture
 * (spec/slider.md, "Pointer"): `<div sliderControl>`. Every move renders within its event
 * (`injectFlush`): zoneless Angular would render it a task later.
 */
@Directive({
    selector: "[sliderControl]",
    exportAs: "sliderControl",
    host: {
        "data-slider-part": "control",
        "[attr.data-orientation]": "data().orientation",
        "[attr.data-disabled]": "data().disabled",
        "[attr.data-dragging]": "data().dragging",
        // structural: a touch drag must not scroll the page
        "[style.touch-action]": "'none'",
        "(pointerdown)": "onPointerDown($event)",
    },
})
export class SliderControl {
    private readonly root = inject(SliderRoot);
    readonly state = this.root.state;
    protected readonly data = computed(() => dataValues(this.state()));
    private readonly host = injectHost();
    private readonly flush = injectFlush();
    private endDrag: (() => void) | null = null;

    constructor() {
        inject(DestroyRef).onDestroy(() => this.endDrag?.());
    }

    private valueAt(x: number, y: number): number {
        const root = this.root;
        const fraction = fractionAlong(
            this.host.getBoundingClientRect(),
            { x, y },
            root.orientation(),
            getDirection(this.host) === "rtl",
        );
        return valueAtFraction(fraction, {
            min: root.min(),
            max: root.max(),
            step: root.step(),
        });
    }

    protected onPointerDown(event: PointerEvent): void {
        const root = this.root;
        if (
            root.isDisabled() ||
            (event.pointerType === "mouse" && event.button !== 0)
        ) {
            return;
        }
        event.preventDefault();
        const value = this.valueAt(event.clientX, event.clientY);
        const index = nearestThumb(root.values(), value);
        root.setThumb(index, value, "track-press");
        root.thumbs()[index]?.focus();
        root.activeIndex.set(index);
        root.dragging.set(true);
        this.flush();
        this.endDrag?.();
        this.endDrag = startDrag(this.host, event, {
            onMove: (move) => {
                root.setThumb(
                    index,
                    this.valueAt(move.clientX, move.clientY),
                    "drag",
                );
                this.flush();
            },
            onEnd: () => {
                this.endDrag = null;
                root.dragging.set(false);
                root.commit();
                this.flush();
            },
        });
    }
}
