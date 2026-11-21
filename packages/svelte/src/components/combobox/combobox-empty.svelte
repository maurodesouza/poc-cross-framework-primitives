<script lang="ts">
import { mergeProps } from "../../utils/merge-props.ts";
import type { PartProps } from "../../utils/part.ts";

/** What the consumer shows when no item matches (it renders it only then). */
let { child, children, ...rest }: PartProps<Record<string, never>> = $props();
const partProps = $derived(mergeProps({ "data-combobox-part": "empty" }, rest));
</script>

{#if child}{@render child({ props: partProps, state: {} })}{:else}<div {...partProps}>{@render children?.()}</div>{/if}
