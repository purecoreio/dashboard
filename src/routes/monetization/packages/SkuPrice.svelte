<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import I18nPrice from "$lib/sb/store/price/I18nPrice";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import { AlertCircle } from "lucide-svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";
    import * as Avatar from "$lib/components/ui/avatar";
    import * as Select from "$lib/components/ui/select";
    import { Input } from "$lib/components/ui/input";
    import type Sku from "$lib/sb/store/sku/Sku";

    export let price: I18nPrice | null | undefined,
        sku: Sku,
        fallback: I18nPrice | undefined;

    let open = false;
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
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
    </Dialog.Trigger>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>{sku.name}</Dialog.Title>
        </Dialog.Header>
        <div class="max-h-96 overflow-y-auto border overflow-hidden rounded-lg">
            <Table.Root>
                <Table.Header>
                    <Table.Row>
                        <Table.Head>Country</Table.Head>
                        <Table.Head>Currency</Table.Head>
                        <Table.Head class="text-right">Amount</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each sku.prices as price}
                        <Table.Row>
                            <Table.Cell>
                                <div class="flex flex-row gap-2 items-center">
                                    {#if price.country == null}
                                        <Badge>Fallback</Badge>
                                    {:else}
                                        <Avatar.Root>
                                            <Avatar.Image
                                                src={`https://flagcdn.com/${price.country.toLowerCase()}.svg`}
                                                alt={`${price.country} flag`}
                                            />
                                            <Avatar.Fallback
                                                >{price.country.toUpperCase()}</Avatar.Fallback
                                            >
                                        </Avatar.Root>
                                        {price.country}
                                    {/if}
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <Select.Root
                                    selected={{
                                        value: price.currency,
                                    }}
                                >
                                    <Select.Trigger class="w-[180px]">
                                        <Select.Value />
                                    </Select.Trigger>
                                    <Select.Content>
                                        <Select.Item value={price.currency}
                                            >{price.currency}</Select.Item
                                        >
                                    </Select.Content>
                                </Select.Root>
                            </Table.Cell>
                            <Table.Cell>
                                <Input
                                    type="number"
                                    placeholder="amount"
                                    value={price.amount}
                                />
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
        <Dialog.Footer>
            <Button on:click={() => (open = false)} type="submit">Close</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
