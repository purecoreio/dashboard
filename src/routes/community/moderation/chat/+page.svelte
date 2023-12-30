<script lang="ts">
    import {
        Button,
        Card,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        ListPlaceholder,
    } from "flowbite-svelte";
    import Spiral from "~icons/streamline/spiral-shape-solid";
    import Document from "~icons/mdi/document";
    import Sleeping from "~icons/fluent-emoji/sleeping-face";
    import { onMount } from "svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import Event from "./Event.svelte";

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

    const colors: Map<string, string> = new Map();
    const possibleColors = [
        "red",
        "yellow",
        "green",
        "purple",
        "pink",
        "blue",
        "dark",
        "primary",
    ];
    let lastColor = -1;
    type supportedColors =
        | "red"
        | "yellow"
        | "green"
        | "purple"
        | "pink"
        | "blue"
        | "dark"
        | "primary";
    function getColor(instanceId: string): supportedColors {
        if (!colors.has(instanceId)) {
            lastColor++;
            if (lastColor >= possibleColors.length) {
                lastColor = 0;
            }
            colors.set(instanceId, possibleColors[lastColor]);
        }
        const color = colors.get(instanceId)!;
        return color as supportedColors;
    }
</script>

<!--<Card class="max-w-full flex flex-col gap-5">
    <div class="flex flex-row gap-5 items-center font-bold">
        <Spiral />
        <span> AI Summaries </span>
        <div class="grow text-right">
            <Button color="alternative">Generate</Button>
        </div>
    </div>
    <div class="border-2 rounded overflow-hidden">
        <Table>
            <TableHead>
                <TableHeadCell>Span</TableHeadCell>
                <TableHeadCell>Generated By</TableHeadCell>
                <TableHeadCell>Messages</TableHeadCell>
                <TableHeadCell>Output</TableHeadCell>
            </TableHead>
            <TableBody>
                {#each summaries as summary}
                    <TableBodyRow>
                        <TableBodyCell>
                            {String(summary.start.getHours()).padStart(
                                2,
                                "0",
                            )}:{String(summary.start.getMinutes()).padStart(
                                2,
                                "0",
                            )}-{String(summary.end.getHours()).padStart(
                                2,
                                "0",
                            )}:{String(summary.end.getMinutes()).padStart(
                                2,
                                "0",
                            )}
                        </TableBodyCell>
                        <TableBodyCell>
                            {summary.author}
                        </TableBodyCell>
                        <TableBodyCell>
                            {summary.messages} messages
                        </TableBodyCell>
                        <TableBodyCell tdClass="text-right pr-4">
                            <Button size="xs" color="alternative">
                                <Document />
                            </Button>
                        </TableBodyCell>
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    </div>
</Card>-->
<Card class="max-w-full max-h-screen overflow-y-scroll">
    {#if opening}
        <ListPlaceholder divClass="max-w-full" />
    {:else}
        <div>
            <table class="w-full">
                {#each events as event, i}
                    {#key Number(i == 0) * event.event.epoch.getTime()}
                        <tr class:message={i == 0}>
                            <Event
                                message={event.event}
                                instance={event.instance}
                                color={getColor(event.instance.id)}
                            />
                        </tr>
                    {/key}
                {/each}
            </table>
            <div
                class="py-5 flex flex-col gap-5 justify-center items-center"
                class:mt-5={events.length > 0}
            >
                <span>New Messages Will Appear Above</span>
                <Sleeping height={50} width={50} />
            </div>
        </div>
    {/if}
</Card>

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
