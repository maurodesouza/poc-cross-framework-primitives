import { HostAttributeToken, inject } from "@angular/core";

/**
 * The consumer's own static attribute on the host element (`aria-labelledby="..."`), or `null`. A
 * part that binds the same attribute falls back to it, so a host binding never removes it.
 */
export function ownAttribute(name: string): string | null {
    return inject(new HostAttributeToken(name), { optional: true });
}
