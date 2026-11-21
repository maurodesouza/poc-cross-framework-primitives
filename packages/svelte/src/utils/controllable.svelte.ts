/**
 * A value controlled through a bindable prop when the consumer gives one, or kept here otherwise
 * (spec/README.md, "Normalized API names"). `read()` and `write()` reach the prop.
 */
export class Controllable<T> {
    #own: T = $state() as T;
    readonly #read: () => T | undefined;
    readonly #write: (value: T) => void;

    constructor(
        read: () => T | undefined,
        write: (value: T) => void,
        initial: T,
    ) {
        this.#own = initial;
        this.#read = read;
        this.#write = write;
    }

    get value(): T {
        const controlled = this.#read();
        return controlled !== undefined ? controlled : this.#own;
    }

    /** Sets the value; `false` when it was already that value. */
    set(next: T): boolean {
        if (Object.is(next, this.value)) {
            return false;
        }
        if (this.#read() === undefined) {
            this.#own = next;
        } else {
            this.#write(next);
        }
        return true;
    }
}
