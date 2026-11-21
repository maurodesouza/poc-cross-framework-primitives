type Attributes = Record<string, string | undefined>;

/** Creates an element with its attributes (an `undefined` value is left out) and children. */
export function element<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attributes: Attributes = {},
    ...children: (Node | string)[]
): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes)) {
        if (value !== undefined) {
            node.setAttribute(name, value);
        }
    }
    node.append(...children);
    return node;
}
