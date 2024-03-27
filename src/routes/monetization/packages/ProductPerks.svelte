<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import type Product from "$lib/sb/store/sku/Product";
    import type Perk from "$lib/sb/store/sku/perk/Perk";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input";
    import { X, Trash2, ChevronsUpDown, Check, Plus } from "lucide-svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";

    export let product: Product,
        perks: Perk[],
        open: boolean = false;

    let openPerk = false;
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
        <Button variant="outline">
            {product.perks.length}
            Perk{product.perks.length != 1 ? "s" : ""}
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>{product.name}</Dialog.Title>
        </Dialog.Header>
        <Card.Root>
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head class="w-1/2">Amount</Table.Head>
                        <Table.Head>Perk</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each product.perks as usage}
                        <Table.Row>
                            <Table.Cell>
                                <div class="flex flex-row gap-2">
                                    <div>
                                        <Button variant="outline" size="icon">
                                            <X class="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Input type="number" />
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <div class="flex flex-row gap-2 items-center">
                                    <span class="grow">
                                        {usage.perk.name}
                                    </span>
                                    <div>
                                        <Button variant="secondary" size="icon">
                                            <Trash2 class="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                    <Table.Row>
                        <Table.Cell>
                            <div class="flex flex-row gap-2">
                                <div>
                                    <Button variant="outline" size="icon">
                                        <X class="w-4 h-4" />
                                    </Button>
                                </div>
                                <Input type="number" />
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <div class="flex flex-row gap-2 items-center">
                                <Input placeholder="Name" />
                                <div>
                                    <Button size="icon">
                                        <Plus class="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </Card.Root>

        <Dialog.Footer>
            <Button type="submit">Save changes</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
