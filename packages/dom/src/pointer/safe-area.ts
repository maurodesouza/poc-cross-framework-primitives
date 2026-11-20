export interface Point {
    x: number;
    y: number;
}

/**
 * Whether `point` is in the triangle between where the pointer left a submenu's trigger and the
 * near edge of the submenu (spec/menu.md, "Pointer": crossing sibling items on the way does not
 * close the submenu).
 */
export function isInSafeArea(
    point: Point,
    from: Point,
    submenu: Element,
): boolean {
    const rect = submenu.getBoundingClientRect();
    const edgeX = from.x <= rect.left ? rect.left : rect.right;
    const b = { x: edgeX, y: rect.top - 4 };
    const c = { x: edgeX, y: rect.bottom + 4 };
    const sign = (p: Point, q: Point, r: Point) =>
        (p.x - r.x) * (q.y - r.y) - (q.x - r.x) * (p.y - r.y);
    const d1 = sign(point, from, b);
    const d2 = sign(point, b, c);
    const d3 = sign(point, c, from);
    const negative = d1 < 0 || d2 < 0 || d3 < 0;
    const positive = d1 > 0 || d2 > 0 || d3 > 0;
    return !(negative && positive);
}
