<script lang="ts">
    import {
        Gamepad2,
        Mail,
        Hash,
        MessageCircle,
        Gavel,
        ExternalLink,
    } from "lucide-svelte";
    import * as Avatar from "$lib/components/ui/avatar";
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    export let message: any, instance: any, errored: boolean;

    let variant: "default" | "destructive" = errored
        ? "destructive"
        : "default";

    $: errored,
        (() => {
            variant = errored ? "destructive" : "default";
        })();
</script>

<td>
    <div
        class="flex flex-col items-center justify-center gap-2"
        class:text-red-600={errored}
        class:dark:text-red-500={errored}
    >
        <Avatar.Root>
            <Avatar.Image
                src={`https://minotar.net/helm/${message.sender.name}`}
                alt="@shadcn"
            />
            <Avatar.Fallback>{message.sender.name.charAt(0)}</Avatar.Fallback>
        </Avatar.Root>
        <span class="text-xs">
            {message.sender.name}
        </span>
        <Badge {variant}>
            {String(message.epoch.getHours()).padStart(2, "0")}:{String(
                message.epoch.getMinutes(),
            ).padStart(2, "0")}
        </Badge>
    </div>
</td>
<td
    class="w-full"
    class:text-red-600={errored}
    class:dark:text-red-500={errored}
>
    <div class="flex flex-col gap-3 w-full pl-2">
        <div class="flex flex-row gap-3">
            <Badge {variant}>
                {#if message.medium == "discord"}
                    <ExternalLink class="w-4 h-4" />
                {:else if message.medium == "game"}
                    <Gamepad2 class="w-4 h-4" />
                {/if}
                <span class="ml-1">{instance.server.name} {instance.name}</span>
            </Badge>
            <Badge {variant}>
                {#if message.channel == null && message.receiver}
                    <Mail class="w-4 h-4" />
                {:else if message.channel}
                    <Hash class="w-4 h-4" />
                {:else}
                    <MessageCircle class="w-4 h-4" />
                {/if}
                <span class="ml-1"
                    >{message.receiver?.name ??
                        message.channel ??
                        "public"}</span
                >
            </Badge>
        </div>
        <div>
            {message.message}
        </div>
    </div>
</td>
<td>
    {#if errored}
        <Button variant="destructive">
            <Gavel />
        </Button>
    {/if}
</td>

<style>
    td {
        padding: 20px 5px !important;
    }
</style>
