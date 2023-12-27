<script lang="ts">
    import { Avatar, Badge, Button } from "flowbite-svelte";
    import Discord from "~icons/ic/baseline-discord";
    import Public from "~icons/mingcute/announcement-fill";
    import Hashtag from "~icons/mingcute/hashtag-line";
    import Game from "~icons/mingcute/game-2-fill";
    import Mail from "~icons/mingcute/mail-fill";
    import Gavel from "~icons/fluent/gavel-24-filled";

    export let message: any,
        instance: any,
        color:
            | "red"
            | "yellow"
            | "green"
            | "indigo"
            | "purple"
            | "pink"
            | "blue"
            | "dark"
            | "primary";
</script>

<td>
    <div class="flex flex-col items-center justify-center gap-2">
        <Avatar src={`https://minotar.net/helm/${message.sender.name}`} />
        <span class="text-xs">
            {message.sender.name}
        </span>
        <Badge {color}>
            {String(message.epoch.getHours()).padStart(2, "0")}:{String(
                message.epoch.getMinutes(),
            ).padStart(2, "0")}
        </Badge>
    </div>
</td>
<td class="w-full">
    <div class="flex flex-col gap-3 w-full pl-2">
        <div class="flex flex-row gap-3">
            <Badge {color}>
                {#if message.medium == "discord"}
                    <Discord />
                {:else if message.medium == "game"}
                    <Game />
                {/if}
                <span class="ml-1">{instance.server.name} {instance.name}</span>
            </Badge>
            <Badge {color}>
                {#if message.channel == null && message.receiver}
                    <Mail />
                {:else if message.channel}
                    <Hashtag />
                {:else}
                    <Public />
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
    <Button size="xs" color="alternative">
        <Gavel />
    </Button>
</td>

<style>
    td {
        padding: 20px 5px !important;
    }
</style>
