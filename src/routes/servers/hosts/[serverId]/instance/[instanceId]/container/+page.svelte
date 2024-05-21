<script lang="ts">
    import Server from "$lib/sb/server/Server";
    import Instance from "$lib/sb/server/Instance";
    import { getContext, onMount, tick } from "svelte";
    import type { Writable } from "svelte/store";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import MachineSelector from "./MachineSelector.svelte";
    import TemplateSelector from "./TemplateSelector.svelte";
    import type Machine from "$lib/sb/machine/Machine";
    import type HostingTemplate from "$lib/sb/machine/container/HostingTemplate";
    import { toast } from "svelte-sonner";
    import { Loader2 } from "lucide-svelte";
    import ResetPassword from "./ResetPassword.svelte";
    import Console from "./Console.svelte";
    import Section from "$lib/components/serverbench/section.svelte";
    import { Dot } from "lucide-svelte";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import PerfChart from "./PerfChart.svelte";

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
            setTimeout(async () => {
                await tuneInIfDue();
            }, 1000 * 3);
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

    let lines: string[] = [];
    let status: string | null = null;
    type point = {
        x: Date;
        y: number;
    };
    let cpuData: point[] = [];
    let memData: point[] = [];
    $: status,
        (() => {
            if (status == "die" || status == "exited") {
                online = false;
            } else {
                online = true;
            }
        })();
    let online = false;

    async function tuneInIfDue() {
        if (socket) {
            socket.close();
            connecting = false;
            connected = false;
        }

        if ($instance) {
            connecting = true;
            console.log("connecting");
            socket = await $instance!.socket();
            socket.onopen = async () => {
                connected = true;
                connecting = false;
            };
            console.log(connected, connecting);
            socket.onmessage = (m) => {
                const { type, content } = JSON.parse(m.data);
                if (type == "log") {
                    lines.push(content);
                    lines = lines;
                } else if (type == "status") {
                    status = content;
                } else if (type == "load") {
                    const { cpu_stats, precpu_stats, memory_stats } =
                        JSON.parse(content);
                    (() => {
                        const cpu_delta =
                            cpu_stats.cpu_usage.total_usage -
                            precpu_stats.cpu_usage.total_usage;
                        const system_cpu_delta =
                            cpu_stats.system_cpu_usage -
                            precpu_stats.system_cpu_usage;
                        const number_cpus = cpu_stats.online_cpus;
                        const cpu_usage =
                            (cpu_delta / system_cpu_delta) *
                            number_cpus *
                            100.0;
                        cpuData.push({
                            x: new Date(),
                            y: cpu_usage,
                        });
                        if (cpuData.length > 50) cpuData.shift();
                        cpuData = cpuData;
                    })();

                    (() => {
                        const used_memory =
                            memory_stats.usage - (memory_stats.stats.cach ?? 0);
                        const available_memory = memory_stats.limit;
                        const memory_usage =
                            (used_memory / available_memory) * 100.0;
                        memData.push({
                            x: new Date(),
                            y: memory_usage,
                        });
                        if (memData.length > 50) memData.shift();
                        memData = memData;
                    })();
                }
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
        <Section
            title={`${$server.name}${$instance.name != null ? "/" : ""}${$instance.name ?? ""}`}
            loading={connecting}
        >
            <div class="flex flex-row justify-between items-center">
                <div
                    class:invisible={!status}
                    class="flex items-center space-x-2 transition"
                >
                    <Switch bind:checked={online} disabled id="online-status" />
                    <Label for="online-status">
                        {#if status != "die" && status != "exited"}
                            <Dot class="text-green-500 animate-ping" />
                        {:else if status}
                            <Dot class="text-red-500" />
                        {:else}
                            <Dot
                                class="text-gray-500 text-opacity-40 animate-ping"
                            />
                        {/if}
                    </Label>
                </div>
                <div class="flex flex-row gap-2">
                    <Button
                        variant="ghost"
                        class="text-red-400"
                        disabled={loading}
                        on:click={() => unhost()}>Unhost</Button
                    >
                    <ResetPassword container={$instance.container} />
                </div>
            </div>
            <Console {lines} />
            <PerfChart title="CPU" data={cpuData} />
            <PerfChart title="Memory" data={memData} />
        </Section>
    {/if}
{/if}
