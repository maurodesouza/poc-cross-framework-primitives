import { computed, Directive, inject } from "@angular/core";
import { dataValues } from "../../utils/state-attributes.ts";
import { SliderRoot } from "./slider-root.directive.ts";

/** The rail (spec/slider.md): `<div sliderTrack>`. */
@Directive({
    selector: "[sliderTrack]",
    exportAs: "sliderTrack",
    host: {
        "data-slider-part": "track",
        "[attr.data-orientation]": "data().orientation",
        "[attr.data-disabled]": "data().disabled",
        "[attr.data-dragging]": "data().dragging",
    },
})
export class SliderTrack {
    readonly state = inject(SliderRoot).state;
    protected readonly data = computed(() => dataValues(this.state()));
}
