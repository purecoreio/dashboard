<script lang="ts">
    import {
        Timeline,
        TimelineItem,
        Button,
        Input,
        Card,
    } from "flowbite-svelte";
    import NoUpdates from "~icons/fluent-emoji/closed-mailbox-with-lowered-flag";
    import Updates from "~icons/fluent-emoji/closed-mailbox-with-raised-flag";
    import Next from "~icons/ic/round-chevron-right";

    let connected: boolean = false;
    setTimeout(() => {
        connected = true;
    }, 2000);
</script>

<div>
    <Timeline>
        <TimelineItem title="Download the plugin">
            <p
                class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400"
            >
                Download the plugin and install it in your plugins folder (on
                every proxy and server possible).
            </p>
            <Button color="alternative">Download</Button>
        </TimelineItem>
        <TimelineItem title="Restart your server">
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
                After installing our plugin, restart the server so it starts
                running.
            </p>
        </TimelineItem>
        <TimelineItem title="Application UI code in Tailwind CSS">
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">
                Enter this command in your proxy/proxies, our on every single
                server.
                <Input value="/serverbench setup <key>" disabled />
            </p>
        </TimelineItem>
    </Timeline>
    <div class="mt-5 flex flex-row gap-3 items-center justify-end">
        <Button color="alternative">Skip</Button>
        <div class:animate-pulse={!connected}>
            <Button href="/" disabled={!connected}>
                {#if connected}
                    Next <Next />
                {:else}
                    Waiting for events...
                {/if}
            </Button>
        </div>
    </div>
</div>
<Card class="max-w-full items-center">
    {#if connected}
        <Updates height="100%" width="50%" />
    {:else}
        <NoUpdates height="100%" width="50%" />
    {/if}
</Card>
