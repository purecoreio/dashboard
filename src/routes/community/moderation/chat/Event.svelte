<script lang="ts">
    import { Avatar, Badge, Button } from "flowbite-svelte";
    import Discord from "~icons/ic/baseline-discord";
    import Public from "~icons/mingcute/announcement-fill";
    import Hashtag from "~icons/mingcute/hashtag-line";
    import Game from "~icons/mingcute/game-2-fill";
    import Mail from "~icons/mingcute/mail-fill";
    import Gavel from "~icons/fluent/gavel-24-filled";

    export let message: any;
</script>

<td>
    <div class="flex flex-col items-center justify-center gap-2 px-3">
        <Avatar src="https://minotar.net/avatar/quiquelhappy" />
        <span class="text-xs">
            {message.sender}
        </span>
        <Badge>
            {String(message.created.getHours()).padStart(2, "0")}:{String(
                message.created.getMinutes(),
            ).padStart(2, "0")}
        </Badge>
    </div>
</td>
<td class="w-full">
    <div class="flex flex-col gap-3 w-full">
        <div class="flex flex-row gap-3">
            <Badge>
                {#if message.medium.type == "discord"}
                    <Discord />
                {:else if message.medium.type == "game"}
                    <Game />
                {/if}
                <span class="ml-1">{message.medium.name}</span>
            </Badge>
            <Badge>
                {#if message.channel.name == null && message.channel.receiver}
                    <Mail />
                {:else if message.channel.name}
                    <Hashtag />
                {:else}
                    <Public />
                {/if}
                <span class="ml-1"
                    >{message.channel.receiver ??
                        message.channel.name ??
                        "public"}</span
                >
            </Badge>
        </div>
        <div>
            {message.text}
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
