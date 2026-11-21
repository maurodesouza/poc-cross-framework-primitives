import { computed, Directive, inject } from "@angular/core";
import { valueToPercent } from "@poc/dom";
import { SliderRoot } from "./slider-root.directive.ts";

/** The filled part: from `min` to the value, or between the thumbs (spec/slider.md): `<div sliderIndicator>`. */
@Directive({
    selector: "[sliderIndicator]",
    exportAs: "sliderIndicator",
    host: {
        "data-slider-part": "indicator",
        "[attr.data-orientation]": "state().orientation",
        "[style]": "style()",
    },
})
export class SliderIndicator {
    private readonly root = inject(SliderRoot);
    readonly state = this.root.state;
    /** Structural: where the fill starts and how long it is. */
    protected readonly style = computed(() => {
        const root = this.root;
        const percents = root
            .values()
            .map((entry) => valueToPercent(entry, root.min(), root.max()));
        const start = percents.length > 1 ? (percents[0] ?? 0) : 0;
        const end = percents.at(-1) ?? 0;
        return root.orientation() === "vertical"
            ? {
                  position: "absolute",
                  "inset-block-end": `${start}%`,
                  "block-size": `${end - start}%`,
              }
            : {
                  position: "absolute",
                  "inset-inline-start": `${start}%`,
                  "inline-size": `${end - start}%`,
              };
    });
}
