<script lang="ts">
    import Fa from "svelte-fa";
    import {
        faTiktok,
        faYoutube,
        faTwitch,
    } from "@fortawesome/free-brands-svg-icons";
    import type { MediaPlatform } from "$lib/sb/media/MediaProfile";

    export let platform: MediaPlatform;
</script>

{#if platform == "youtube"}
    <Fa icon={faYoutube} />
{:else if platform == "tiktok"}
    <Fa icon={faTiktok} />
{:else if platform == "twitch"}
    <Fa icon={faTwitch} />
{/if}
