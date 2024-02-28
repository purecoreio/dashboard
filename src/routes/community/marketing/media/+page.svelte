<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import { Button } from "flowbite-svelte";

    async function linkMedia(platform: string) {
        await Srvbench.getInstance().linkMedia(platform);
    }
</script>

<Button on:click={() => linkMedia("tiktok")}>Link TikTok</Button>
<Button on:click={() => linkMedia("youtube")}>Link YouTube</Button>
<Button on:click={() => linkMedia("twitch")}>Link Twitch</Button>
