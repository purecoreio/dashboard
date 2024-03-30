<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import I18nPrice from "$lib/sb/store/price/I18nPrice";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { AlertCircle } from "lucide-svelte";

    export let price: I18nPrice | null | undefined,
        fallback: I18nPrice | undefined;
</script>

<Button class="flex flex-row gap-2 items-center" variant="ghost">
    {#if price}
        {price.amount}
        {price.currency}
    {:else}
        {fallback?.amount}
        {fallback?.currency}
        <Tooltip.Root>
            <Tooltip.Trigger>
                <AlertCircle class="w-4 h-4" />
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Fallback Price</p>
            </Tooltip.Content>
        </Tooltip.Root>
    {/if}
</Button>
