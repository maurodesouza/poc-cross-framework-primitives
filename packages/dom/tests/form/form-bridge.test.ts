import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bridgeForm } from "../../src/form/form-bridge.ts";

describe("bridgeForm", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML =
            '<form><input name="fruit" required><button type="button">Trigger</button></form>';
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("reports a reset once the browser has reset the controls", () => {
        const input = document.querySelector("input") as HTMLInputElement;
        const reset = vi.fn();
        const end = bridgeForm(input, { reset });
        input.form?.reset();
        expect(reset).not.toHaveBeenCalled();
        vi.runAllTimers();
        expect(reset).toHaveBeenCalledOnce();
        end();
        input.form?.reset();
        vi.runAllTimers();
        expect(reset).toHaveBeenCalledOnce();
    });

    it("sends the focus of a failed validation to the primitive", () => {
        const input = document.querySelector("input") as HTMLInputElement;
        const trigger = document.querySelector("button") as HTMLButtonElement;
        bridgeForm(input, { invalid: () => trigger });
        const event = new Event("invalid", { cancelable: true });
        input.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(trigger);
    });
});
