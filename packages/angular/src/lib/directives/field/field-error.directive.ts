import {
    computed,
    DestroyRef,
    Directive,
    type EmbeddedViewRef,
    effect,
    inject,
    input,
    type Signal,
    TemplateRef,
    untracked,
    ViewContainerRef,
} from "@angular/core";
import { createId, type FieldErrorMatch, fieldErrorShown } from "@poc/dom";
import { injectEnclosing } from "../../inject/enclosing.ts";
import { FieldRoot } from "./field-root.directive.ts";

/** The template context of `*fieldError`: the field's current messages. */
export interface FieldErrorContext {
    $implicit: Signal<readonly string[]>;
}

/** The field's messages as the error's content: one as text, several as a list. */
function renderMessages(element: HTMLElement, errors: readonly string[]) {
    if (errors.length > 1) {
        const list = document.createElement("ul");
        for (const message of errors) {
            const item = document.createElement("li");
            item.textContent = message;
            list.appendChild(item);
        }
        element.replaceChildren(list);
    } else {
        element.replaceChildren(
            ...(errors[0] === undefined ? [] : [errors[0]]),
        );
    }
}

/**
 * An error message, structural so it is rendered only while shown (spec/field.md):
 * `<div *fieldError="'valueMissing'">Enter your email.</div>`; `*fieldError` alone while the field
 * is invalid, `*fieldError="true"` always. An element with no children of its own shows the
 * field's messages (one as text, several as a `ul`); `*fieldError="let errors"` gives them to the
 * template instead. The directive writes the error's attributes on the element it renders.
 */
@Directive({ selector: "[fieldError]", exportAs: "fieldError" })
export class FieldError {
    /** A `ValidityState` key (`"customError"` for `validate`'s messages), or `true` for always. */
    readonly match = input<FieldErrorMatch | undefined, unknown>(undefined, {
        alias: "fieldError",
        // `*fieldError` alone gives "": shown while the field is invalid
        transform: (value: unknown) =>
            value === "" || value === null || value === undefined
                ? undefined
                : value === true || value === "true"
                  ? true
                  : (value as FieldErrorMatch),
    });
    readonly id = input<string | undefined>(undefined, {
        alias: "fieldErrorId",
    });
    private readonly field = injectEnclosing(
        FieldRoot,
        "fieldRoot",
        "FieldError",
    );
    private readonly generated = createId("poc-field-error");
    private readonly resolvedId = computed(() => this.id() ?? this.generated);
    readonly state = this.field.state;
    /** Whether the error is shown (rendered). */
    readonly shown = computed(() =>
        fieldErrorShown(this.match(), this.field.shown(), {
            invalid: this.field.showsInvalid(),
            disabled: this.field.disabled(),
        }),
    );
    private readonly errors = computed(() => this.field.shown().errors);

    static ngTemplateContextGuard(
        _directive: FieldError,
        _context: unknown,
    ): _context is FieldErrorContext {
        return true;
    }

    constructor() {
        const template = inject<TemplateRef<FieldErrorContext>>(TemplateRef);
        const container = inject(ViewContainerRef);
        let view: EmbeddedViewRef<FieldErrorContext> | null = null;
        let element: HTMLElement | null = null;
        let own = false;
        let registered: { id: string; stop: () => void } | null = null;
        const unregister = () => {
            registered?.stop();
            registered = null;
        };
        inject(DestroyRef).onDestroy(unregister);

        effect(() => {
            const show = this.shown();
            const data = this.field.data();
            const errors = this.errors();
            const id = this.resolvedId();
            untracked(() => {
                if (!show) {
                    unregister();
                    container.clear();
                    view = null;
                    element = null;
                    return;
                }
                if (view === null) {
                    view = container.createEmbeddedView(template, {
                        $implicit: this.errors,
                    });
                    element =
                        (view.rootNodes as Node[]).find(
                            (node): node is HTMLElement =>
                                node instanceof HTMLElement,
                        ) ?? null;
                    own = element !== null && element.childNodes.length > 0;
                }
                if (element === null) {
                    return;
                }
                const attributes: Record<string, string | null> = {
                    id,
                    "data-field-part": "error",
                    ...Object.fromEntries(
                        Object.entries(data).map(([key, value]) => [
                            `data-${key}`,
                            value,
                        ]),
                    ),
                };
                for (const [name, value] of Object.entries(attributes)) {
                    if (value === null) {
                        element.removeAttribute(name);
                    } else {
                        element.setAttribute(name, value);
                    }
                }
                if (!own) {
                    renderMessages(element, errors);
                }
                // listed in the control's `aria-describedby` once it carries its id
                if (registered?.id !== id) {
                    unregister();
                    registered = {
                        id,
                        stop: this.field.registerMessage(element),
                    };
                }
            });
        });
    }
}
