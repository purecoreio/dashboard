<script lang="ts">
    import type Server from "$lib/sb/server/Server";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Dot, Loader2, Plus, Search } from "lucide-svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import * as Command from "$lib/components/ui/command/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { goto } from "$app/navigation";

    export let server: Server, statuses: Record<string, string>, update: number;
    let open = false;
    let value = "";
</script>

<Table.Row class="hover:bg-inherit">
    <Table.Cell class="py-0">
        <div class="flex flex-col">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="flex flex-row items-center gap-5">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <a
                    tabindex="0"
                    on:click={() => (open = true)}
                    on:keydown|preventDefault={() => (open = true)}
                    class="grow flex flex-row justify-between rounded-lg py-6 cursor-pointer select-none"
                >
                    <span>
                        {server.name}
                    </span>
                    <div class="text-center float-right w-36">
                        {#if server.instances.length <= 0}
                            <Badge variant="outline">No Instances</Badge>
                        {:else if server.instances.filter((i) => i.name != null).length == 0 && server.instances[0]}
                            {#if server.instances[0].container}
                                {#key update}
                                    {#if statuses[server.instances[0].container.id]}
                                        {#if statuses[server.instances[0].container.id] != "die" && statuses[server.instances[0].container.id] != "exited"}
                                            <Dot
                                                class="text-green-400 animate-pulse ml-auto mr-auto"
                                            />
                                        {:else}
                                            <Dot
                                                class="text-red-400 ml-auto mr-auto"
                                            />
                                        {/if}
                                    {:else}
                                        <Dot
                                            class="text-gray-400 text-opacity-50 ml-auto mr-auto"
                                        />
                                    {/if}
                                {/key}
                            {/if}
                        {:else}
                            <Badge>
                                {server.instances.length} Instances
                            </Badge>
                        {/if}
                    </div>
                </a>
                <Popover.Root bind:open>
                    <Popover.Trigger asChild let:builder>
                        <Button
                            builders={[builder]}
                            variant="outline"
                            role="combobox"
                            size="icon"
                            aria-expanded={open}
                            class="rounded-full"
                        >
                            <Search class="w-4 h-4" />
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content class="p-0 w-52">
                        <Command.Root>
                            <Command.Input
                                placeholder="Search instance..."
                                class="h-9"
                            />
                            <Command.Empty>No instance found.</Command.Empty>
                            <Command.Group>
                                {#each server.instances as instance}
                                    <Command.Item
                                        value={instance.id}
                                        onSelect={(currentValue) => {
                                            value = currentValue;
                                            open = false;
                                            goto(
                                                `/servers/hosts/${server.id}/instance/${instance.id}/container`,
                                            );
                                        }}
                                    >
                                        {instance.name ?? "default"}
                                    </Command.Item>
                                {/each}
                            </Command.Group>
                        </Command.Root>
                    </Popover.Content>
                </Popover.Root>
                <Button class="rounded-full" variant="outline" size="icon">
                    <Plus class="w-4 h-4" />
                </Button>
            </div>
            {#if server.instances.filter((i) => i.name != null).length > 0}
                <Card.Root class="mb-4">
                    <Table.Root>
                        <Table.Body>
                            {#each server.instances as instance}
                                <Table.Row>
                                    <Table.Cell class="py-0">
                                        <a
                                            class="block py-3"
                                            href="/servers/hosts/{server.id}/instance/{instance.id}/container"
                                        >
                                            {instance.name ?? "default"}
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </Card.Root>
            {/if}
        </div>
    </Table.Cell>
</Table.Row>
