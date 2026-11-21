import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDelayGroup } from "../../src/hover/delay-group.ts";
import { createHoverIntent } from "../../src/hover/hover-intent.ts";

describe("createHoverIntent", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("opens after the delay unless the pointer leaves first", () => {
        const open = vi.fn();
        const close = vi.fn();
        const intent = createHoverIntent({ open, close });
        intent.enter(500);
        vi.advanceTimersByTime(499);
        expect(open).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(open).toHaveBeenCalledOnce();

        intent.enter(500);
        vi.advanceTimersByTime(200);
        intent.cancel();
        vi.advanceTimersByTime(1000);
        expect(open).toHaveBeenCalledOnce();
    });

    it("closes after the close delay, and a return cancels it", () => {
        const open = vi.fn();
        const close = vi.fn();
        const intent = createHoverIntent({ open, close });
        intent.leave(0);
        expect(close).toHaveBeenCalledOnce();
        intent.leave(100);
        intent.enter(0);
        vi.advanceTimersByTime(200);
        expect(close).toHaveBeenCalledOnce();
        expect(open).toHaveBeenCalledOnce();
    });
});

describe("createDelayGroup", () => {
    it("hands off instantly while open and within the timeout", () => {
        const group = createDelayGroup({ timeout: 400 });
        expect(group.isInstant(0)).toBe(false);
        const closeA = vi.fn();
        const closeB = vi.fn();
        group.opened(closeA);
        expect(group.isInstant(10)).toBe(true);
        group.opened(closeB);
        expect(closeA).toHaveBeenCalledOnce();
        // A reports its close after B opened: B stays the open member
        group.closed(closeA, 20);
        expect(group.isInstant(30)).toBe(true);
        group.closed(closeB, 1000);
        expect(group.isInstant(1300)).toBe(true);
        expect(group.isInstant(1401)).toBe(false);
    });
});
