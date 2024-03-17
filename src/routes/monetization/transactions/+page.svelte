<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import { Filter, MoreVertical } from "lucide-svelte";

    const invoices = [
        {
            created: new Date(),
            amount: {
                value: 14.99,
                currency: "EUR",
            },
            player: {
                name: "quiquelhappy",
            },
            items: [
                {
                    name: "Immortal",
                },
            ],
            states: [
                {
                    type: "refunded",
                    timestamp: new Date(),
                    amount: 5.99,
                },
                {
                    type: "paid",
                    timestamp: new Date(),
                    net: 13.4,
                },
            ],
        },
    ];
</script>

<Card.Root>
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head>Date</Table.Head>
                <Table.Head>Amount</Table.Head>
                <Table.Head>Player</Table.Head>
                <Table.Head>Items</Table.Head>
                <Table.Head class="text-center">Status</Table.Head>
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
                    <Table.Cell class="font-medium"
                        >{invoice.created.toLocaleDateString()}
                        {invoice.created.toLocaleTimeString()}</Table.Cell
                    >
                    <Table.Cell
                        >{invoice.amount.value}
                        {invoice.amount.currency}</Table.Cell
                    >
                    <Table.Cell>{invoice.player.name}</Table.Cell>
                    <Table.Cell
                        >{invoice.items
                            .map((i) => i.name)
                            .join(", ")}</Table.Cell
                    >
                    <Table.Cell class="text-center capitalize">
                        <Badge
                            variant={invoice.states.length > 0
                                ? "default"
                                : "outline"}
                        >
                            {invoice.states.length <= 0
                                ? "incomplete"
                                : invoice.states[0].type}
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
