<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Table from "$lib/components/ui/table";
    import { Eraser, Loader2, Plus } from "lucide-svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import type Product from "$lib/sb/store/sku/Product";
    import { createEventDispatcher } from "svelte";
    import Srvbench from "$lib/sb/Srvbench";

    export let product: Product;

    const dispatch = createEventDispatcher();

    let name: string | null = null;
    let description: string | null = null;
    let amount: number | null = null;
    let loading: boolean = false;

    async function createPerk() {
        loading = true;
        try {
            const perk = await Srvbench.getInstance()
                .getCommunity()!
                .createPerk(name!, description ?? "");
            product = await product.usePerk(perk, amount);
            dispatch("perk", {
                perk,
                product,
            });
            name = null;
            description = null;
            amount = null;
        } catch (error) {}
        loading = false;
    }

    async function clearAmount() {
        amount = null;
    }
</script>

<Table.Row
    class="items-center align-middle dark:bg-opacity-5 bg-white hover:bg-initial"
>
    <Table.Cell class="text-center">
        <Badge>New</Badge>
    </Table.Cell>
    <Table.Cell>
        <Input disabled={loading} bind:value={name} placeholder="name" />
    </Table.Cell>
    <Table.Cell>
        <div class="flex flex-row items-center gap-2">
            <Tooltip.Root>
                <Tooltip.Trigger>
                    <Input
                        disabled={loading}
                        bind:value={amount}
                        placeholder="amount"
                        type="number"
                    />
                </Tooltip.Trigger>
                <Tooltip.Content>
                    <p>
                        You can leave this empty if your perk is not numerable
                    </p>
                </Tooltip.Content>
            </Tooltip.Root>
            <div>
                <Button
                    on:click={() => clearAmount()}
                    size="icon"
                    variant="ghost"
                    disabled={loading}
                >
                    <Eraser class="w-4 h-4" />
                </Button>
            </div>
        </div>
    </Table.Cell>
    <Table.Cell>
        <Tooltip.Root>
            <Tooltip.Trigger>
                <Button
                    on:click={() => createPerk()}
                    size="icon"
                    class="rounded-full"
                    disabled={loading}
                >
                    {#if loading}
                        <Loader2 class="w-4 h-4 animate-spin" />
                    {:else}
                        <Plus class="w-4 h-4" />
                    {/if}
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Create perk and add to product</p>
            </Tooltip.Content>
        </Tooltip.Root>
    </Table.Cell>
</Table.Row>
