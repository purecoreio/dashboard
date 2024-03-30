<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import Product from "$lib/sb/store/sku/Product";
    import type Perk from "$lib/sb/store/sku/perk/Perk";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Workflow } from "lucide-svelte";
    import PerkRow from "./PerkRow.svelte";
    import * as Alert from "$lib/components/ui/alert";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import CreatePerk from "./CreatePerk.svelte";
    import type PerkUsage from "$lib/sb/store/sku/perk/PerkUsage";

    export let product: Product,
        perks: Perk[] | null,
        open: boolean = false;

    let usageMap: Map<Perk, PerkUsage | null> = new Map();
    $: product, computeUsageMap();
    $: perks, computeUsageMap();

    computeUsageMap();

    function computeUsageMap() {
        usageMap.clear();
        let unusedPerks: Perk[] = [];
        for (const perk of perks ?? []) {
            const usage = product.perks.find((p) => p.perk.id == perk.id);
            if (usage) {
                usageMap.set(perk, usage);
            } else {
                unusedPerks.push(perk);
            }
        }
        for (const perk of unusedPerks) {
            usageMap.set(perk, null);
        }
        usageMap = usageMap;
        return usageMap;
    }

    async function handlePerkDelete(ev: CustomEvent<Perk>) {
        console.log("perk deleted");
        perks = perks?.filter((p) => p.id != ev.detail.id)!;
    }

    async function handlePerkUpdate(ev: CustomEvent<Perk>) {
        console.log("perk updated");
        usageMap = usageMap;
    }

    function handleUsageUpdate(ev: CustomEvent<Product>) {
        product = ev.detail;
        computeUsageMap();
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
        <Button variant="outline">
            {product.perks.length}
            Perk{product.perks.length != 1 ? "s" : ""}
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="max-w-xl">
        <Dialog.Header>
            <Dialog.Title>{product.name}</Dialog.Title>
        </Dialog.Header>
        <Alert.Root class="text-left">
            <Workflow class="w-4 h-4" />
            <Alert.Title>Perk data is shared accross products</Alert.Title>
            <Alert.Description>
                When you update the name or description of any given perk, it
                will be updated on all products.
            </Alert.Description>
        </Alert.Root>
        <div class="max-h-96 overflow-y-auto border overflow-hidden rounded-lg">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head>Usage</Table.Head>
                        <Table.Head>Name</Table.Head>
                        <Table.Head>Amount</Table.Head>
                        <Table.Head />
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#if perks != null}
                        <CreatePerk
                            on:perk={(p) => {
                                if (!perks) return;
                                perks.push(p.detail.perk);
                                product = p.detail.product;
                                computeUsageMap();
                            }}
                            bind:product
                        />
                        <!-- used perks -->
                        {#key usageMap}
                            {#each usageMap.keys() as perk}
                                <PerkRow
                                    on:delete={handlePerkDelete}
                                    on:usage={handleUsageUpdate}
                                    on:update={handlePerkUpdate}
                                    perkUsage={usageMap.get(perk) ?? null}
                                    {perk}
                                    {product}
                                />
                            {/each}
                        {/key}
                    {:else}
                        {#each Array(5) as _}
                            <Table.Row>
                                {#each Array(4) as _}
                                    <Table.Cell>
                                        <Skeleton
                                            class="rounded-full w-full h-5"
                                        />
                                    </Table.Cell>
                                {/each}
                            </Table.Row>
                        {/each}
                    {/if}
                </Table.Body>
            </Table.Root>
        </div>

        <Dialog.Footer>
            <Button on:click={() => (open = false)}>Close</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
