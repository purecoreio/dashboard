<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import type Product from "$lib/sb/store/sku/Product";
    import type Perk from "$lib/sb/store/sku/perk/Perk";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Workflow } from "lucide-svelte";
    import PerkRow from "./PerkRow.svelte";
    import * as Alert from "$lib/components/ui/alert";
    import type PerkUsage from "$lib/sb/store/sku/perk/PerkUsage";

    export let product: Product,
        perks: Perk[],
        open: boolean = false;

    let perkUsages: PerkUsage[] = product.perks;
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
        <div class="max-h-96 overflow-y-auto">
            <Card.Root>
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
                        <PerkRow bind:perkUsages bind:perks bind:product />
                        {#key perkUsages.length}
                            {#each perkUsages as perkUsage}
                                <PerkRow
                                    bind:perkUsages
                                    bind:perks
                                    bind:product
                                    {perkUsage}
                                />
                            {/each}
                            {#each perks as perk}
                                {#if !perkUsages.find((p) => p.perk.id == perk.id)}
                                    <PerkRow
                                        bind:perkUsages
                                        bind:perks
                                        bind:product
                                        {perk}
                                    />
                                {/if}
                            {/each}
                        {/key}
                    </Table.Body>
                </Table.Root>
            </Card.Root>
        </div>

        <Dialog.Footer>
            <Button type="submit">Save changes</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
