<script lang="ts">
    import {
        Card,
        Table,
        TableBody,
        TableBodyRow,
        Toggle,
        Button,
        Dropdown,
        DropdownItem,
    } from "flowbite-svelte";
    import Filter from "~icons/ic/baseline-filter-alt";
    import Plus from "~icons/ic/round-plus";
    import Server from "../Server.svelte";
    import Chart from "../../../../element/Chart.svelte";

    const servers = [
        {
            name: "proxy",
            instances: [
                {
                    id: "eu",
                    online: 20,
                    status: "healthy",
                },
                {
                    id: "na",
                    online: 20,
                    status: "healthy",
                },
                {
                    id: "ap",
                    online: 20,
                    status: "healthy",
                },
            ],
        },
        {
            name: "lobby",
            instances: [
                {
                    id: "1",
                    online: 1,
                    status: "healthy",
                },
            ],
        },
        {
            name: "cool",
            instances: [
                {
                    id: "1",
                    online: 20,
                    status: "healthy",
                },
                {
                    id: "2",
                    online: 20,
                    status: "healthy",
                },
            ],
        },
        {
            name: "simply",
            instances: [
                {
                    id: "1",
                    online: 20,
                    status: "healthy",
                },
                {
                    id: "2",
                    online: 20,
                    status: "healthy",
                },
            ],
        },
    ];

    function groupServer(server: any) {
        let online = 0;
        for (const instance of server.instances) {
            online += instance.online;
        }
        return {
            id: "group",
            online,
            status: "healthy",
        };
    }

    let groupShards = false;
    let hideOffline = false;
</script>

<Card class="max-w-full">
    <Chart title="Online Servers" stepped />
</Card>
<Card class="max-w-full">
    <Chart title="Connection Issues" />
</Card>
<div class="flex flex-row justify-between">
    <div>
        <Button color="alternative">
            <Filter />
        </Button>
        <Dropdown class="w-56 p-3 space-y-1">
            <DropdownItem>
                <Toggle bind:checked={groupShards}>Group Shards</Toggle>
            </DropdownItem>
            <DropdownItem>
                <Toggle bind:checked={hideOffline}>Hide Offline</Toggle>
            </DropdownItem>
        </Dropdown>
    </div>
    <Button>
        <Plus />
    </Button>
</div>
{#each servers as server}
    <Card class="max-w-full">
        <h5
            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
            {server.name}
        </h5>
        <Table>
            <TableBody>
                {#if groupShards}
                    <TableBodyRow>
                        <Server {server} instance={groupServer(server)} />
                    </TableBodyRow>
                {:else}
                    {#each server.instances as instance}
                        <TableBodyRow>
                            <Server {server} {instance} />
                        </TableBodyRow>
                    {/each}
                {/if}
            </TableBody>
        </Table>
    </Card>
{/each}
