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
    import {
        GitMerge,
        Loader2,
        Play,
        Square,
        SquareAsterisk,
        Trash2,
        UploadCloud,
    } from "lucide-svelte";
    import ResetPassword from "./ResetPassword.svelte";
    import Console from "./Console.svelte";
    import Section from "$lib/components/serverbench/section.svelte";
    import { Dot, MoreVertical } from "lucide-svelte";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import PerfChart from "./PerfChart.svelte";
    import ChartData from "$lib/utils";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import Srvbench from "$lib/sb/Srvbench";
    import RepositoryPicker from "./repositoryPicker/RepositoryPicker.svelte";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import type DeveloperProfile from "$lib/sb/developer/DeveloperProfile";
    import type Repository from "$lib/sb/developer/Repository";
    import { fade } from "svelte/transition";
    import { Progress } from "$lib/components/ui/progress";
    import * as Tooltip from "$lib/components/ui/tooltip/index.js";
    import Transfer from "./Transfer.svelte";

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
            const container = await $instance.host(
                machine!,
                template!,
                path!,
                developerProfile,
                repository,
                branch,
            );
            console.log(container);
            instance.set(container.instance!);
            path = "/home/happy/" + randomStr();
            machine = null;
            template = null;
            hosting = false;
            toast.success("hosted: " + container.ip?.ip);
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
    let transfer = false

    $: $instance, tuneInIfDue();

    let lines: string[] = [];
    let status: any | null = null;
    type point = {
        x: Date;
        y: number;
    };
    const cpuData = new ChartData("cpu");
    let cpuDataPoints = cpuData.n;
    const memData = new ChartData("memory");
    let memDataPoints = memData.n;
    $: status,
        (() => {
            online = status?.running;
        })();
    let online = false;
    let deleted: string[] = [];

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
                    status = JSON.parse(content);
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
                        cpuData.add(cpu_usage);
                        cpuDataPoints = cpuData.n;
                    })();

                    (() => {
                        const used_memory =
                            memory_stats.usage - (memory_stats.stats.cach ?? 0);
                        const available_memory = memory_stats.limit;
                        const memory_usage =
                            (used_memory / available_memory) * 100.0;
                        memData.add(memory_usage);
                        memDataPoints = memData.n;
                    })();
                } else if (type == "progress") {
                    const progress = JSON.parse(content);
                    if (!deleted.includes(progress.id)) {
                        tasks[progress.id] = progress;
                        if (progress.errored) {
                            toast.error("failed task " + progress.description);
                        }
                        if (tasks[progress.id].finished) {
                            delete tasks[progress.id];
                            deleted.push(progress.id);
                        }
                        tasks = tasks;
                    }
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

    let reset = false;
    let repositorySettings = false;
    let developerProfile: DeveloperProfile | null = null;
    let repository: Repository | null = null;
    let branch: string | null = null;
    let tasks: Record<string, any> = {};
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
            <div class="flex flex-row gap-2 items-center">
                <Checkbox
                    id="repository-settings"
                    bind:checked={repositorySettings}
                />
                <Label
                    for="repository-settings"
                    class="text-sm font-medium leading-none"
                >
                    Use a git repository
                </Label>
            </div>
            {#if repositorySettings}
                <RepositoryPicker
                    bind:developerProfile
                    bind:repository
                    bind:branch
                />
            {/if}
        </div>
        <Dialog.Footer>
            <Button
                on:click={() => host()}
                disabled={loading ||
                    !machine ||
                    !path ||
                    !template ||
                    (repositorySettings &&
                        (!developerProfile || !repository || !branch))}
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
    <Transfer bind:transfer container={$instance.container}/>
    <ResetPassword bind:loading bind:reset container={$instance.container} />
    {#if !$instance.container}
        <Button disabled={loading} on:click={() => (hosting = true)}
            >Host</Button
        >
    {:else}
        <Section
            title={`${$server.name}${$instance.name != null ? "/" : ""}${$instance.name ?? ""}`}
            loading={connecting}
        >
            <div class="flex flex-row items-center gap-2">
                <div
                    class:invisible={!status}
                    class="flex items-center space-x-2 transition mr-auto"
                >
                    <Switch bind:checked={online} disabled id="online-status" />
                    <Label for="online-status">
                        {#if online}
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
                {#if Object.keys(tasks).length > 0}
                    <div transition:fade>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild let:builder>
                                <Button
                                    builders={[builder]}
                                    class="rounded-full flex flex-row gap-2"
                                    variant="outline"
                                >
                                    <Loader2 class="animate-spin w-4 h-4" />
                                    <Tooltip.Root>
                                        <Tooltip.Trigger asChild let:builder>
                                            <span
                                                class="max-w-64 overflow-hidden overflow-ellipsis whitespace-nowrap"
                                            >
                                                {#if Object.keys(tasks).length == 1}
                                                    {Object.values(tasks)[0]
                                                        .description}
                                                {:else}
                                                    Multiple Tasks
                                                {/if}
                                            </span>
                                        </Tooltip.Trigger>
                                        {#if Object.keys(tasks).length == 1}
                                            <Tooltip.Content>
                                                <p>
                                                    {Object.values(tasks)[0]
                                                        .description}
                                                </p>
                                            </Tooltip.Content>
                                        {/if}
                                    </Tooltip.Root>
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content class="w-64">
                                {#each Object.entries(tasks) as [id, task]}
                                    <DropdownMenu.Item
                                        class="flex flex-row items-center gap-2"
                                    >
                                        <Tooltip.Root>
                                            <Tooltip.Trigger
                                                asChild
                                                let:builder
                                            >
                                                <span
                                                    class="w-1/4 whitespace-nowrap overflow-hidden overflow-ellipsis"
                                                >
                                                    {task.description}
                                                </span>
                                            </Tooltip.Trigger>
                                            <Tooltip.Content>
                                                <p>
                                                    {task.description}
                                                </p>
                                            </Tooltip.Content>
                                        </Tooltip.Root>
                                        <div class="w-full">
                                            <Progress
                                                value={task.progress}
                                                class="h-2"
                                                max={100}
                                            />
                                        </div>
                                        <span
                                            class="text-right max-w-10 overflow-hidden w-20"
                                        >
                                            {task.progress}%
                                        </span>
                                    </DropdownMenu.Item>
                                {/each}
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </div>
                {/if}
                <div class="flex flex-row items-center">
                    <Button
                        on:click={() => $instance.container?.stop()}
                        disabled={!online}
                        class="rounded-l-full rounded-r-none "
                        variant="outline"
                    >
                        <Square class="w-4 h-4" />
                    </Button>
                    <Button
                        on:click={() => $instance.container?.start()}
                        disabled={online}
                        class="rounded-r-full rounded-l-none"
                        variant="outline"
                    >
                        <Play class="w-4 h-4" />
                    </Button>
                </div>
                <div class="flex flex-row gap-2">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger
                            disabled={loading}
                            asChild
                            let:builder
                        >
                            <Button
                                builders={[builder]}
                                size="icon"
                                class="rounded-full"
                                variant="outline"
                            >
                                <MoreVertical class="w-4 h-4" />
                            </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <!--
                            <DropdownMenu.Item
                                on:click={() => (picking = true)}
                                class="flex flex-row gap-2"
                            >
                                <GitMerge class="w-4 h-4" />
                                <span>Sync Repository</span>
                            </DropdownMenu.Item>-->
                            <DropdownMenu.Item
                                on:click={() => (transfer = true)}
                                class="flex flex-row gap-2"
                            >
                                <UploadCloud class="w-4 h-4" />
                                <span>Transfer</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                on:click={() => (reset = true)}
                                class="flex flex-row gap-2"
                            >
                                <SquareAsterisk class="w-4 h-4" />
                                <span>Reset Password</span>
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                                on:click={() => unhost()}
                                class="text-red-400 flex flex-row gap-2"
                            >
                                <Trash2 class="w-4 h-4" />
                                <span>Unhost</span>
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
            </div>
            <Console {lines} />
            <PerfChart title="CPU" data={cpuDataPoints} />
            <PerfChart title="Memory" data={memDataPoints} />
        </Section>
    {/if}
{/if}
