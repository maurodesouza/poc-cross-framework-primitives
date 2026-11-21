import { computed, DestroyRef, Directive, effect, inject } from "@angular/core";
import {
    conditionalView,
    writeAttributes,
} from "../../utils/conditional-view.ts";
import { dataValue } from "../../utils/state-attributes.ts";
import { ComboboxRoot } from "./combobox-root.directive.ts";

/**
 * Clears the text and the value; structural, so it is rendered only while there is a value
 * (spec/combobox.md): `<button *comboboxClear aria-label="Clear fruit">×</button>`. The directive
 * writes its attributes on the element it renders, and keeps focus in the input.
 */
@Directive({ selector: "[comboboxClear]", exportAs: "comboboxClear" })
export class ComboboxClear {
    private readonly root = inject(ComboboxRoot);
    readonly state = computed(() => ({ disabled: this.root.isDisabled() }));

    constructor() {
        const root = this.root;
        const onPointerDown = (event: Event) => event.preventDefault();
        const onClick = () => {
            root.clear("clear-press");
            root.overlay.trigger()?.focus();
        };
        const element = conditionalView(
            computed(() => root.values().length > 0),
            (button) => {
                writeAttributes(button, {
                    type: "button",
                    tabindex: "-1",
                    "data-combobox-part": "clear",
                });
                button.addEventListener("pointerdown", onPointerDown);
                button.addEventListener("click", onClick);
            },
        );
        effect((onCleanup) => {
            const button = element();
            const disabled = this.state().disabled;
            if (button === null) {
                return;
            }
            writeAttributes(button, {
                disabled: disabled ? "" : null,
                "data-disabled": dataValue(disabled),
            });
            root.clearButton.set(button);
            onCleanup(() => {
                if (root.clearButton() === button) {
                    root.clearButton.set(null);
                }
            });
        });
        inject(DestroyRef).onDestroy(() => root.clearButton.set(null));
    }
}
