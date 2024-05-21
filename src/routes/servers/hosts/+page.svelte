<script lang="ts">
    import Section from "$lib/components/serverbench/section.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import type Server from "$lib/sb/server/Server";
    import { Loader2 } from "lucide-svelte";
    import * as Table from "$lib/components/ui/table/index.js";

    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import ServerRow from "./ServerRow.svelte";
    import * as Card from "$lib/components/ui/card/index.js";

    let update = 0;
    let statuses: Record<string, string> = {};
    let loading = true;
    let adding = false;

    let serverName: string | null = null;
    let createDefault = true;

    let servers: Server[] = [];

    onMount(async () => {
        loading = true;
        try {
            servers = await Srvbench.getInstance().getCommunity()!.getServers();
            await dialStatus();
        } catch (error) {
            toast.error("unable to load servers");
            console.log(error);
        }
        loading = false;
    });

    async function dialStatus() {
        const ws = await Srvbench.getInstance()
            .getCommunity()!
            .instanceSocket();
        ws.onclose = async () => {
            toast.error("reconnecting to status updates");
            await new Promise((resolve) => setTimeout(resolve, 3000));
            return dialStatus();
        };
        ws.onopen = () => toast.success("listening for status updates");
        ws.onmessage = (ev) => {
            const { type, content, container } = JSON.parse(ev.data);
            if (type == "status") {
                statuses[container] = content;
                update++;
            }
        };
    }

    async function createServer() {
        loading = true;
        try {
            const server = await Srvbench.getInstance()
                .getCommunity()!
                .createServer(serverName!);
            if (createDefault) {
                await server.createInstance(null);
            }
            servers.unshift(server);
            servers = servers;
            adding = false;
            serverName = null;
            createDefault = true;
            toast.success("created server");
        } catch (error) {
            toast.error("unable to create server");
        }
        loading = false;
    }
</script>

<Section title="servers" {loading} bind:adding>
    <div class="flex flex-col gap-3" slot="add">
        <div>
            <Label for="serverName">Server Name</Label>
            <Input
                disabled={loading}
                bind:value={serverName}
                id="serverName"
                placeholder="survival"
            />
        </div>
        <div class="flex flex-row gap-2 items-center">
            <Switch
                disabled={loading}
                bind:checked={createDefault}
                id="createDefault"
            />
            <Label for="createDefault">Create Default Instance</Label>
        </div>
        <Button on:click={() => createServer()} disabled={loading}>
            {#if loading}
                <Loader2 class="w-4 h-4 animate-spin" />
            {:else}
                Create Server
            {/if}
        </Button>
    </div>

    <Card.Root>
        <Table.Root>
            <Table.Body>
                {#each servers as server}
                    <ServerRow {update} {statuses} {server} />
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>
