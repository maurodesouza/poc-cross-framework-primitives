import { useCallback, useState } from "react";

/** An element kept in state, so effects re-run when it mounts (a callback ref). */
export function useElement<T extends HTMLElement>() {
    const [element, setElement] = useState<T | null>(null);
    const ref = useCallback((node: T | null) => setElement(node), []);
    return [element, ref] as const;
}
