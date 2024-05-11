<script lang="ts">
    import Server from "$lib/sb/server/Server";
    import Instance from "$lib/sb/server/Instance";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import * as Card from "$lib/components/ui/card";
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
    let ans = "x"
        .repeat(5)
        .replace(
            /./g,
            (c) =>
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
                    Math.floor(Math.random() * 62)
                ],
        );

    let server = getContext<Writable<Server>>("server");
    let instance = getContext<Writable<Instance>>("instance");
    let path: string | null = "/home/happy/" + ans;
    let machine: Machine | null = null;
    let template: HostingTemplate | null = null;
    let hosting = false;
    let loading = false;

    async function host() {
        loading = true;
        try {
            const container = await $instance.host(machine!, template!, path!);
            path = null;
            machine = null;
            template = null;
            hosting = false;
            toast.success("hosted: " + container.ip.ip);
        } catch (error) {
            console.log(error)
            toast.error("unable to host");
        }
        loading = false;
    }
</script>

<Dialog.Root bind:open={hosting}>
    <Dialog.Content>
        <div class="flex flex-col gap-3">
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
        <Button on:click={() => (hosting = true)}>Host</Button>
    {:else}
        <Button>Unhost</Button>
    {/if}
{/if}
