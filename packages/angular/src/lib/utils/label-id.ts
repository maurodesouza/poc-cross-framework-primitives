import {
    computed,
    DestroyRef,
    effect,
    inject,
    type Signal,
    type WritableSignal,
} from "@angular/core";
import { createId } from "@poc/dom";

/**
 * The id of a part that names or describes another (a title, a description, a group label): the
 * consumer's `id` input or a generated one, registered in `target` (the root's `titleId`, ...) for
 * as long as the part lives.
 */
export function labelId(
    id: Signal<string | undefined>,
    target: WritableSignal<string | undefined>,
    prefix: string,
): Signal<string> {
    const generated = createId(prefix);
    const resolved = computed(() => id() ?? generated);
    effect(() => target.set(resolved()));
    inject(DestroyRef).onDestroy(() => target.set(undefined));
    return resolved;
}
