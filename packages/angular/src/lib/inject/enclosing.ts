import { inject, type ProviderToken } from "@angular/core";

/** The directive of the enclosing part, or an error naming the part and the function. */
export function injectEnclosing<T>(
    token: ProviderToken<T>,
    selector: string,
    fn: string,
): T {
    const directive = inject(token, { optional: true });
    if (directive === null) {
        throw new Error(`${fn}() must be used inside [${selector}]`);
    }
    return directive;
}
