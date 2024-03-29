<script lang="ts">
    import { onMount } from "svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import Event from "./event.svelte";
    import { Label } from "$lib/components/ui/label";
    import * as Menubar from "$lib/components/ui/menubar";
    import error from "$lib/sound/error.mp3";
    import click from "$lib/sound/click.mp3";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Toaster } from "$lib/components/ui/sonner";
    import { toast } from "svelte-sonner";

    export let popup = false;
    let events: any[] = [];
    let opening = true;
    import { Switch } from "$lib/components/ui/switch";
    import * as Card from "$lib/components/ui/card";
    import {
        Loader2,
        VolumeX,
        Volume2,
        MessageCircle,
        MessageSquare,
        PanelBottomClose,
        MessageSquareDashed,
        MessageSquareDot,
        Coffee,
        MessagesSquare,
    } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
    import { fade, scale, slide } from "svelte/transition";
    onMount(async () => {
        await reconnect();
    });

    function parseEvent(event: any, instance: any) {
        return {
            event: {
                type: event.type,
                epoch: new Date(event.epoch),
                medium: event.medium,
                message: event.message,
                channel: event.channel,
                receiver: event.receiver
                    ? {
                          name: event.receiver.name,
                      }
                    : null,
                sender: event.sender
                    ? {
                          name: event.sender.name,
                      }
                    : null,
            },
            instance: {
                name: instance.name,
                id: instance.id,
                server: {
                    id: instance.server.id,
                    name: instance.server.name,
                },
            },
        };
    }

    function append(event: any, inverse = false) {
        let top = false;
        if (inverse) top = !top;
        if (top) {
            events.push(event);
        } else {
            events.unshift(event);
        }
    }

    let retry = 0;
    let hidden = popup;
    let hidding = false;
    $: hidden,
        (() => {
            hidding = true;
            setTimeout(() => {
                hidding = false;
            }, 200);
        })();
    async function reconnect() {
        console.log("reconnecting");
        opening = true;
        const socket = await Srvbench.getInstance().getCommunity()!.spectate();
        socket.addEventListener("message", async (e) => {
            retry = 0;
            const message = JSON.parse(e.data);
            const event = message.event;
            const instance = message.instance;
            if (!(instance.id in servers)) {
                servers[instance.id] = {
                    show: true,
                    name: `${instance.server.name}${instance.name}`,
                };
            }
            if (event.type == "chat") {
                append(parseEvent(event, instance));
                events = events;
            } else if (event.type == "backlog_response") {
                for (const messageData of event.data) {
                    const loggedEvent = parseEvent(messageData, instance);
                    if (loggedEvent.event.type != "chat") continue;
                    const dictLength = events.length;
                    if (dictLength <= 0) {
                        events.push(loggedEvent);
                    } else {
                        let finalIndex = -1;
                        for (let i = dictLength - 1; i >= 0; i--) {
                            if (i == 0) {
                                finalIndex = 0;
                            } else if (i >= dictLength) {
                                finalIndex = dictLength - 1;
                            } else {
                                const existingMessage = events[i];
                                if (
                                    new Date(
                                        existingMessage.event.epoch,
                                    ).getTime() >
                                    loggedEvent.event.epoch.getTime()
                                ) {
                                    // the backlogged event is OLDER, so it should be inserted on i+1
                                    finalIndex = i + 1;
                                    break;
                                }
                            }
                        }
                        if (finalIndex >= 0) {
                            if (finalIndex == 0) {
                                append(event);
                            } else if (finalIndex == events.length) {
                                append(event, true);
                            } else {
                                events.splice(finalIndex, 0, loggedEvent);
                            }
                        }
                    }
                }
                events = events;
            } else if (event.type == "toxicity") {
                errored[event.epoch] = true;
                await playAudio(0.5);
            }
        });
        socket.addEventListener("open", () => {
            opening = false;
        });
        socket.addEventListener("error", () => {
            opening = false;
        });
        socket.addEventListener("close", async () => {
            await new Promise((resolve) => setTimeout(resolve, 5000 * retry));
            retry++;
            await reconnect();
        });
    }

    let servers: Record<
        string,
        {
            name: string;
            show: boolean;
        }
    > = {};

    let alerts: boolean = false;
    onMount(async () => {
        await playAudio(0);
    });

    async function playAudio(volume: number, ignore: boolean = false) {
        if (!alerts && !ignore) return;
        const audio = new Audio(volume == 0 ? click : error);
        try {
            await audio.play();
        } catch (error) {}
        audio.remove();
    }

    async function toggleAudio(on: boolean) {
        try {
            if (!on) throw new Error("off");
            await playAudio(0, true);
            alerts = true;
        } catch (error) {
            alerts = false;
        }
        if (alerts) {
            toast("alerts enabled");
        } else {
            toast("alerts disabled");
        }
    }

    let errored: Record<number, boolean> = {};
</script>

{#if hidden}
    {#if !hidding}
        <div transition:fade={{ duration: 200 }} class="inline">
            <Button
                on:click={() => (hidden = false)}
                class="rounded-full drop-shadow-sm flex flex-col items-center justify-center h-14 px-0 aspect-square"
                size="lg"
            >
                {#if opening}
                    <MessageSquareDashed />
                {:else if events.length <= 0}
                    <MessageSquare />
                {:else}
                    <MessageSquareDot />
                {/if}
            </Button>
        </div>
    {/if}
{:else}
    <div transition:slide={{ duration: 200 }}>
        <Card.Root
            class={"w-full overflow-hidden" +
                (popup ? " bg-opacity-50 backdrop-blur-lg" : "")}
        >
            <Menubar.Root class="rounded-none border-0 border-b-[1px]">
                <Menubar.Menu>
                    <Menubar.Trigger class="mr-auto">Filter</Menubar.Trigger>
                    <Menubar.Item on:click={() => toggleAudio(!alerts)}>
                        <Tooltip.Root open={popup == false}>
                            <Tooltip.Trigger>
                                {#if alerts}
                                    <Volume2 class="w-4 h-4" />
                                {:else}
                                    <VolumeX class="w-4 h-4" />
                                {/if}
                            </Tooltip.Trigger>
                            <Tooltip.Content>
                                <p>Get toxicity alerts</p>
                            </Tooltip.Content>
                        </Tooltip.Root>
                    </Menubar.Item>
                    {#if popup}
                        <Menubar.Item on:click={() => (hidden = true)}>
                            <PanelBottomClose class="h-4 w-4" />
                        </Menubar.Item>
                    {/if}
                    <Menubar.Content>
                        {#each Object.keys(servers) as server}
                            <Menubar.Item
                                on:click={() =>
                                    (servers[server].show =
                                        !servers[server].show)}
                                class="flex flex-row items-center gap-3"
                            >
                                <Switch
                                    id={servers[server].name}
                                    checked={servers[server].show}
                                    >{servers[server].name}</Switch
                                >
                                <Label for={servers[server].name}
                                    >{servers[server].name}</Label
                                >
                            </Menubar.Item>
                        {/each}
                        {#if Object.keys(servers).length <= 0}
                            Servers will appear after new messages
                        {/if}
                    </Menubar.Content>
                </Menubar.Menu>
            </Menubar.Root>
            <!-- svelte-ignore empty-block -->
            <div class:max-h-80={popup} class:overflow-y-scroll={popup}>
                <table class="w-full">
                    {#each events as event, i}
                        {#key Number(i == 0) * event.event.epoch.getTime()}
                            <tr class:message={i == 0}>
                                {#if !servers[event.instance.id] || servers[event.instance.id].show}
                                    <Event
                                        message={event.event}
                                        instance={event.instance}
                                        errored={errored[
                                            event.event.epoch.getTime()
                                        ] ?? false}
                                    />
                                {/if}
                            </tr>
                        {/key}
                    {/each}
                </table>
                <div
                    class="py-5 flex flex-row gap-5 justify-center items-center px-16"
                >
                    {#if opening}
                        <span>Connecting</span>
                        <Loader2 class="animate-spin" />
                    {:else if events.length <= 0}
                        <span class="animate-pulse"
                            >Waiting for chat messages</span
                        >
                    {:else}
                        <span>Reached the end</span>
                        <MessagesSquare class="w-4 h-4" />
                    {/if}
                </div>
            </div>
        </Card.Root>
    </div>
{/if}

<div>
    <Toaster offset={70} position={popup ? "top-center" : "bottom-center"} />
</div>

<style>
    table tr {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        vertical-align: top;
    }
    @keyframes expand {
        from {
            transform: translateY(-10%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    .message {
        animation-name: expand;
        animation-duration: 200ms;
        animation-fill-mode: forwards;
    }
</style>
