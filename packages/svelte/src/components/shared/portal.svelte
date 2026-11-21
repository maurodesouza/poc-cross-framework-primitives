<script lang="ts">
import { getAllContexts, mount, type Snippet, unmount } from "svelte";
import PortalContent from "./portal-content.svelte";

/**
 * Moves its content to the end of `body` (or `container`) while `mounted`, with no element of
 * its own (as React's createPortal), keeping the contexts.
 */
let {
    mounted,
    container,
    children,
}: { mounted: boolean; container?: Element | null; children: Snippet } =
    $props();
const contexts = getAllContexts();

$effect(() => {
    if (!mounted || typeof document === "undefined") {
        return undefined;
    }
    const instance = mount(PortalContent, {
        target: container ?? document.body,
        props: { content: children },
        context: contexts,
    });
    return () => {
        void unmount(instance);
    };
});
</script>
