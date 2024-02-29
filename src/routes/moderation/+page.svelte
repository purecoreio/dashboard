<script lang="ts">
    import { onMount } from "svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import Event from "./Event.svelte";
    import { Label } from "$lib/components/ui/label";

    let summaries = [
        {
            start: new Date(),
            end: new Date(),
            author: "quiquelhappy",
            messages: 300,
        },
    ];
    let events: any[] = [];
    let opening = true;
    import { Switch } from "$lib/components/ui/switch";
    import * as Card from "$lib/components/ui/card";
    import * as Popover from "$lib/components/ui/popover";
    import { Filter } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
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

    async function reconnect() {
        console.log("reconnecting");
        opening = true;
        const socket = await Srvbench.getInstance().getCommunity()!.spectate();
        socket.addEventListener("message", async (e) => {
            const message = JSON.parse(e.data);
            const event = message.event;
            const instance = message.instance;
            if (event.type == "chat") {
                events.unshift(parseEvent(event, instance));
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
                                events.unshift(loggedEvent);
                            } else if (finalIndex == events.length) {
                                events.push(loggedEvent);
                            } else {
                                events.splice(finalIndex, 0, loggedEvent);
                            }
                        }
                    }
                }
                events = events;
            }
        });
        socket.addEventListener("open", () => {
            opening = false;
        });
        socket.addEventListener("error", () => {
            opening = false;
        });
        socket.addEventListener("close", async () => {
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
    const colors: Map<string, string> = new Map();
    const possibleColors = ["red", "yellow", "green", "purple", "pink", "blue"];
    let lastColor = -1;
    type supportedColors =
        | "red"
        | "yellow"
        | "green"
        | "purple"
        | "pink"
        | "blue";
    function getColor(
        instanceId: string,
        instanceName: string,
    ): supportedColors {
        if (!colors.has(instanceId)) {
            lastColor++;
            if (lastColor >= possibleColors.length) {
                lastColor = 0;
            }
            colors.set(instanceId, possibleColors[lastColor]);
            servers[instanceId] = {
                name: instanceName,
                show: true,
            };
        }
        const color = colors.get(instanceId)!;
        return color as supportedColors;
    }
</script>

<div class="flex flex-row justify-between">
    <div>
        <Popover.Root>
            <Popover.Trigger>
                <Button class="flex flex-row gap-2">
                    <Filter class="w-4 h-4" />
                    Filter
                </Button>
            </Popover.Trigger>
            <Popover.Content class="flex flex-col gap-3 max-w-[200px]">
                {#each Object.keys(servers) as server}
                    <div class="flex flex-row items-center gap-3">
                        <Switch
                            id={servers[server].name}
                            bind:checked={servers[server].show}
                            >{servers[server].name}</Switch
                        >
                        <Label for={servers[server].name}
                            >{servers[server].name}</Label
                        >
                    </div>
                {/each}
                {#if Object.keys(servers).length<=0}
                    Servers will appear after new messages
                {/if}
            </Popover.Content>
        </Popover.Root>
    </div>
</div>
<Card.Root class="max-w-full">
    <!-- svelte-ignore empty-block -->
    {#if opening}{:else}
        <div>
            <table class="w-full">
                {#each events as event, i}
                    {#key Number(i == 0) * event.event.epoch.getTime()}
                        <tr class:message={i == 0}>
                            {#if !servers[event.instance.id] || servers[event.instance.id].show}
                                <Event
                                    message={event.event}
                                    instance={event.instance}
                                    color={getColor(
                                        event.instance.id,
                                        `${event.instance.server.name} ${event.instance.name}`,
                                    )}
                                />
                            {/if}
                        </tr>
                    {/key}
                {/each}
            </table>
            <div class="py-5 flex flex-col gap-5 justify-center items-center">
                <span>New Messages Will Appear Above</span>
            </div>
        </div>
    {/if}
</Card.Root>

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
