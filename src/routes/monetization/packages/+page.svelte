<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { Filter, MoreVertical } from "lucide-svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import {
        ChevronDown,
        Info,
        Route,
        RouteOff,
        Boxes,
        Box,
    } from "lucide-svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import Section from "$lib/components/serverbench/section.svelte";
    import { LinkedChart } from "svelte-tiny-linked-charts";
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

    const categories = [
        {
            name: "cosmetics",
            upgradable: false,
        },
    ];

    const invoices = [
        {
            amount: {
                value: 9.99,
                currency: "EUR",
                frequency: null,
            },
            type: "bundle",
            category: categories[0],
            name: "Easter Bundle",
        },
        {
            amount: {
                value: 5.99,
                currency: "EUR",
                frequency: null,
            },
            type: "item",
            category: categories[0],
            name: "Bunny Ears",
        },
        {
            amount: {
                value: 5.99,
                currency: "EUR",
                frequency: null,
            },
            type: "item",
            category: categories[0],
            name: "Lily Particles",
        },
        {
            amount: {
                value: 5.99,
                currency: "EUR",
                frequency: null,
            },
            type: "item",
            category: categories[0],
            name: "Egg Hat",
        },
    ];

    let country: string | null = null;
    const countries = [
        ["ES", "Spain"],
        ["US", "United States"],
    ];
</script>

<Section title="Packages">
    <Card.Root>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Name</Table.Head>
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
                                    <DropdownMenu.Label
                                        >Region</DropdownMenu.Label
                                    >
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
                    <Table.Head>Category</Table.Head>
                    <Table.Head>Volume</Table.Head>
                    <Table.Head>
                        <Button
                            class="flex flex-row gap-1 items-center ml-auto"
                            variant="secondary"
                            size="sm"
                        >
                            <Filter class="w-4 h-4" /> Filter
                        </Button>
                    </Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each invoices as invoice, i (i)}
                    <Table.Row>
                        <Table.Cell
                            class="font-medium flex flex-row gap-2 items-center"
                        >
                            <Button
                                size="sm"
                                variant="secondary"
                                class="rounded-full aspect-square"
                            >
                                {#if invoice.type == "bundle"}
                                    <Boxes />
                                {:else if invoice.type == "item"}
                                    <Box />
                                {/if}
                            </Button>
                            {invoice.name}
                        </Table.Cell>
                        <Table.Cell
                            >{invoice.amount.value}
                            {invoice.amount.currency}</Table.Cell
                        >
                        <Table.Cell>
                            {invoice.category.name}
                        </Table.Cell>
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
</Section>
<Section title="categories">
    <Card.Root>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Name</Table.Head>
                    <Table.Head>Upgradable</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each categories as category}
                    <Table.Row>
                        <Table.Cell class="font-medium"
                            >{category.name}</Table.Cell
                        >
                        <Table.Cell>
                            <Badge
                                class="flex-inline flex-row gap-1 items-center"
                                variant="outline"
                            >
                                {#if category.upgradable}
                                    <Route class="w-4 h-4" />
                                    Upgradable
                                {:else}
                                    <RouteOff class="w-4 h-4" />
                                    Non-Upgradable
                                {/if}
                            </Badge>
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
</Section>
