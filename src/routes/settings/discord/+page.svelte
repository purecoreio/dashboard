<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import { onMount } from "svelte";
    import InviteBot from "./InviteBot.svelte";

    let discord: string | null = null;

    onMount(async () => {
        discord = await Srvbench.getInstance().getCommunity()!.getDiscord();
    });
</script>

<div class="flex flex-row">
    <span>
        {discord}
    </span>
    <InviteBot />
</div>
