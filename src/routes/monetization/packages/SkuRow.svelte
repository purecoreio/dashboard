<script lang="ts">
    import Bundle from "$lib/sb/store/sku/Bundle";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import Product from "$lib/sb/store/sku/Product";

    import * as Table from "$lib/components/ui/table/index.js";
    import { Button } from "$lib/components/ui/button";
    import {
        MoreVertical,
        Boxes,
        Box,
        Loader2,
        BadgeMinus,
        AlertCircle,
    } from "lucide-svelte";
    import { LinkedChart } from "svelte-tiny-linked-charts";

    import type Sku from "$lib/sb/store/sku/Sku";
    import SkuOptions from "./SkuOptions.svelte";
    import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
    import { fade, scale } from "svelte/transition";
    import SkuOptionsMenu from "./SkuOptionsMenu.svelte";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { createEventDispatcher } from "svelte";

    let data = {
        "2005-01-01": 1,
        "2005-01-02": 1,
        "2005-01-03": 1,
        "2005-01-04": 1,
        "2005-01-05": 1,
        "2005-01-06": 1,
        "2005-01-07": 1,
        "2005-01-08": 1,
        "2005-01-09": 1,
        "2005-01-10": 1,
        "2005-01-11": 1,
    };

    let loading: boolean = false;

    async function update(
        name?: string,
        description?: string,
        disabled?: boolean,
        visible?: boolean,
    ) {
        loading = true;
        try {
            if (sku instanceof Product) {
                sku = await sku.update(name, description, disabled, visible);
            } else if (sku instanceof Bundle) {
                throw new Error("todo");
            }
        } catch (error) {}
        loading = false;
    }

    let renaming = false,
        deleting = false;

    $: price = sku.prices.find((p) => p.country == country);
    $: fallback = sku.prices.find((p) => !p.country)!;

    const dispatch = createEventDispatcher();

    async function remove() {
        loading = true;
        try {
            if (sku instanceof Product) {
                await sku.remove();
            } else if (sku instanceof Bundle) {
                throw new Error("todo");
            } else {
                throw new Error("invalid type");
            }
            dispatch("delete", sku.id);
        } catch (error) {}
        loading = false;
    }

    export let sku: Product | Bundle | Sku,
        country: string | null = null;
</script>

<AlertDialog.Root bind:open={deleting}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Are you sure?</AlertDialog.Title>
            <AlertDialog.Description>
                You won't be able to restore <b>{sku.name}</b>!
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
            <AlertDialog.Action on:click={() => remove()}
                >Continue</AlertDialog.Action
            >
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
<Table.Row>
    <Table.Cell class="font-medium flex flex-row gap-2 items-center">
        <Button
            size="sm"
            variant="secondary"
            class="rounded-full aspect-square"
        >
            {#if loading}
                <Loader2 class="w-4 h-4 animate-spin" />
            {:else}
                <div in:scale>
                    {#if sku.type == "bundle"}
                        <Boxes class="w-4 h-4" />
                    {:else if sku.type == "product"}
                        <Box class="w-4 h-4" />
                    {/if}
                </div>
            {/if}
        </Button>
        {#if loading}
            <Skeleton class="h-5 w-full rounded-full" />
        {:else}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <a
                in:fade
                on:click={() => (renaming = true)}
                class="cursor-pointer"
            >
                {sku.name}
            </a>
        {/if}
    </Table.Cell>
    <Table.Cell>
        {#if loading}
            <Skeleton class="h-5 w-full rounded-full" />
        {:else}
            <div in:fade class="flex flex-row items-center gap-2">
                {#key country}
                    {#if price}
                        {price.amount}
                        {price.currency}
                    {:else}
                        {fallback.amount}
                        {fallback.currency}
                    {/if}
                    {#if !price}
                        <Tooltip.Root>
                            <Tooltip.Trigger asChild let:builder>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    builders={[builder]}
                                >
                                    <AlertCircle class="w-4 h-4" />
                                </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>Fallback Price</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                    {/if}
                {/key}
            </div>
        {/if}
    </Table.Cell>
    <Table.Cell>
        <LinkedChart width={50} height={30} {data} linked="a" />
    </Table.Cell>
    <Table.Cell class="flex flex-row justify-between">
        <div class="opacity-20 hover:opacity-100 transition">
            <SkuOptions
                disabled={sku.disabled}
                visible={sku.visible}
                {loading}
                on:disabled={() => update(undefined, undefined, !sku.disabled)}
                on:visible={() =>
                    update(undefined, undefined, undefined, !sku.visible)}
            />
        </div>
        <SkuOptionsMenu
            {loading}
            name={sku.name}
            visible={sku.visible}
            on:disabled={() => update(undefined, undefined, !sku.disabled)}
            on:visible={() =>
                update(undefined, undefined, undefined, !sku.visible)}
            on:delete={() => (deleting = true)}
            disabled={sku.disabled}
        >
            <div slot="trigger">
                <Button
                    disabled={loading}
                    variant="outline"
                    size="icon"
                    class="rounded-full"
                >
                    <MoreVertical />
                </Button>
            </div>
        </SkuOptionsMenu>
    </Table.Cell>
</Table.Row>
