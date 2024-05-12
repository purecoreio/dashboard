<script lang="ts">
    import Server from "$lib/sb/server/Server";
    import Instance from "$lib/sb/server/Instance";
    import { getContext, onMount, tick } from "svelte";
    import type { Writable } from "svelte/store";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import MachineSelector from "./MachineSelector.svelte";
    import TemplateSelector from "./TemplateSelector.svelte";
    import type Machine from "$lib/sb/machine/Machine";
    import type HostingTemplate from "$lib/sb/machine/container/HostingTemplate";
    import { toast } from "svelte-sonner";
    import { Loader2 } from "lucide-svelte";
    import ResetPassword from "./ResetPassword.svelte";
    import ansiHTML from "ansi-html";
    import * as Card from "$lib/components/ui/card";

    function randomStr() {
        return "x"
            .repeat(5)
            .replace(
                /./g,
                (c) =>
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
                        Math.floor(Math.random() * 62)
                    ],
            );
    }

    let msg: string[] = [];

    let server = getContext<Writable<Server>>("server");
    let instance = getContext<Writable<Instance>>("instance");
    let path: string | null = "/home/happy/" + randomStr();
    let machine: Machine | null = null;
    let template: HostingTemplate | null = null;
    let hosting = false;
    let loading = false;

    async function host() {
        loading = true;
        try {
            const container = await $instance.host(machine!, template!, path!);
            console.log(container);
            instance.set(container.instance!);
            path = "/home/happy/" + randomStr();
            machine = null;
            template = null;
            hosting = false;
            toast.success("hosted: " + container.ip.ip);
            await tuneInIfDue();
        } catch (error) {
            console.log(error);
            toast.error("unable to host");
        }
        loading = false;
    }

    async function unhost() {
        loading = true;
        try {
            const instanceUpdate = await $instance.container!.unhost();
            if (instanceUpdate) instance.set(instanceUpdate);
            msg = [];
            socket.close();
            toast.success("unhosted");
        } catch (error) {
            console.log(error);
            toast.error("unable to unhost");
        }
        loading = false;
    }

    let socket: WebSocket;
    let connected = false;
    let connecting = false;

    $: $instance, tuneInIfDue();

    async function tuneInIfDue() {
        if ($instance) {
            if (connecting || connected) return;
            connecting = true;
            try {
                socket.close();
            } catch (error) {}
            const lid = randomStr();
            socket = await $instance!.socket();
            socket.onopen = async () => {
                connected = true;
                connecting = false;
                if (socket.readyState === WebSocket.OPEN) {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    socket.send(
                        JSON.stringify({
                            lid,
                            cmd: "logs",
                        }),
                    );
                }
            };
            socket.onmessage = (m) => {
                const { lid, data } = JSON.parse(m.data);
                if (!data) return;
                const line = data as string;
                msg.push(line.substring(line.indexOf("[")));
                msg = msg;
            };
            socket.onclose = () => {
                connected = false;
            };
            socket.onerror = () => {
                connecting = false;
            };
        }
    }

    onMount(async () => {
        await tuneInIfDue();
    });
</script>

<Dialog.Root bind:open={hosting}>
    <Dialog.Content>
        <div class="flex flex-col gap-3">
            <Dialog.Header>
                <Dialog.Title>Host</Dialog.Title>
            </Dialog.Header>
            <MachineSelector bind:machine disabled={loading} />
            <TemplateSelector bind:template disabled={loading} />
            <Input disabled={loading} bind:value={path} />
        </div>
        <Dialog.Footer>
            <Button
                on:click={() => host()}
                disabled={loading || !machine || !path || !template}
                type="submit"
            >
                {#if loading}
                    <Loader2 class="w-4 h-4 animate-spin" />
                {:else}
                    Host
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

{#if $instance}
    {#if !$instance.container}
        <Button disabled={loading} on:click={() => (hosting = true)}
            >Host</Button
        >
    {:else}
        <Button
            variant="destructive"
            disabled={loading}
            on:click={() => unhost()}>Unhost</Button
        >
        <ResetPassword container={$instance.container} />
        {#if connected}
            Connected
            <Card.Root>
                <div class="p-3 max-h-96 overflow-auto flex flex-col-reverse">
                    {#each msg as line}
                        {line}<br />
                    {/each}
                </div>
            </Card.Root>
        {:else}
            Disconnected
        {/if}
    {/if}
{/if}
