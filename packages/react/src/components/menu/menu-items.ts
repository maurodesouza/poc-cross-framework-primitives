/** The items of one menu level, in order (a submenu's items live in its own popup). */
export function menuItems(popup: HTMLElement): HTMLElement[] {
    return [...popup.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter(
        (item) => item.closest('[role="menu"]') === popup,
    );
}

/** Whether the point is in the triangle between where the pointer left and the submenu's edge. */
export function isInSafeArea(
    point: { x: number; y: number },
    from: { x: number; y: number },
    submenu: HTMLElement,
): boolean {
    const rect = submenu.getBoundingClientRect();
    const edgeX = from.x <= rect.left ? rect.left : rect.right;
    const a = from;
    const b = { x: edgeX, y: rect.top - 4 };
    const c = { x: edgeX, y: rect.bottom + 4 };
    const sign = (p: { x: number; y: number }, q: typeof p, r: typeof p) =>
        (p.x - r.x) * (q.y - r.y) - (q.x - r.x) * (p.y - r.y);
    const d1 = sign(point, a, b);
    const d2 = sign(point, b, c);
    const d3 = sign(point, c, a);
    const negative = d1 < 0 || d2 < 0 || d3 < 0;
    const positive = d1 > 0 || d2 > 0 || d3 > 0;
    return !(negative && positive);
}
