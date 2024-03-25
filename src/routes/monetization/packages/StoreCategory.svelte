<script lang="ts">
    import type Category from "$lib/sb/store/Category";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import Label from "$lib/components/ui/label/label.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { Filter, MoreVertical, Plus } from "lucide-svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { LinkedChart } from "svelte-tiny-linked-charts";

    import { ChevronDown, Info, Boxes, Box } from "lucide-svelte";

    let data = {
        "2005-01-01": 25,
        "2005-01-02": 20,
        "2005-01-03": 18,
        "2005-01-04": 17,
        "2005-01-05": 21,
        "2005-01-06": 18,
        "2005-01-07": 17,
        "2005-01-08": 21,
        "2005-01-09": 25,
        "2005-01-10": 20,
        "2005-01-11": 18,
    };

    let country: string | null = null;
    const countries = [
        ["ES", "Spain"],
        ["US", "United States"],
    ];

    export let category: Category;
</script>

<Card.Root>
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head class="text-black dark:text-white w-1/4 text-ellipsis">
                    {category.name}
                </Table.Head>
                <Table.Head class="flex flex-row gap-2 items-center">
                    <Label id="country">Price</Label>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <Button
                                class="flex flex-row gap-1 items-center"
                                size="sm"
                                variant="outline"
                            >
                                {country ?? "Fallback"}
                                <ChevronDown class="w-4 h-4" />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Group>
                                <DropdownMenu.Label>Region</DropdownMenu.Label>
                                <DropdownMenu.Separator />
                                <DropdownMenu.Item
                                    on:click={() => (country = null)}
                                    >Fallback</DropdownMenu.Item
                                >
                                <DropdownMenu.Separator />
                                {#each countries as countryEntry}
                                    <DropdownMenu.Item
                                        on:click={() =>
                                            (country = countryEntry[0])}
                                        >{countryEntry[1]}</DropdownMenu.Item
                                    >
                                {/each}
                            </DropdownMenu.Group>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>

                    <Tooltip.Root>
                        <Tooltip.Trigger>
                            <Button variant="ghost" size="sm">
                                <Info class="w-4 h-4" />
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <p>Price internationalization</p>
                        </Tooltip.Content>
                    </Tooltip.Root>
                </Table.Head>
                <Table.Head>Volume</Table.Head>
                <Table.Head>
                    <Button
                        class="flex flex-row gap-1 items-center ml-auto"
                        variant="secondary"
                        size="sm"
                    >
                        <Plus class="w-4 h-4" /> Add
                    </Button>
                </Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each category.skus as sku}
                <Table.Row>
                    <Table.Cell
                        class="font-medium flex flex-row gap-2 items-center"
                    >
                        <Button
                            size="sm"
                            variant="secondary"
                            class="rounded-full aspect-square"
                        >
                            {#if sku.type == "bundle"}
                                <Boxes />
                            {:else if sku.type == "item"}
                                <Box />
                            {/if}
                        </Button>
                        {sku.name}
                    </Table.Cell>
                    <Table.Cell
                        >{sku.prices.find((p) => p.country == country)
                            ?.amount}
                        {sku.prices.find((p) => p.country == country)
                            ?.currency}</Table.Cell
                    >
                    <Table.Cell>
                        <LinkedChart width={50} height={30} {data} linked="a" />
                    </Table.Cell>
                    <Table.Cell class="text-right">
                        <Button
                            variant="outline"
                            size="icon"
                            class="rounded-full"
                        >
                            <MoreVertical />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</Card.Root>
