/**
 * Whether a dev server answers at `origin`. The fixtures run on their own origins with no CORS, so
 * the probe is a `no-cors` request: its response is opaque, but it only resolves when the server
 * is up (a refused connection rejects).
 */
export async function isRunning(
    origin: string,
    fetcher: typeof fetch = fetch,
    timeout = 1500,
): Promise<boolean> {
    try {
        await fetcher(`${origin}/`, {
            mode: "no-cors",
            cache: "no-store",
            signal: AbortSignal.timeout(timeout),
        });
        return true;
    } catch {
        return false;
    }
}
