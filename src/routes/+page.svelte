<script lang="ts">
    import { Card } from "flowbite-svelte";
    import Chart from "../element/Chart.svelte";
    import Plus from "~icons/ic/round-plus";
    import type Community from "$lib/sb/Community";
    import { onMount } from "svelte";
    import Serverbench from "$lib/sb/Srvbench";
    import { goto } from "$app/navigation";

    let ownedCommunities: Community[] | null = null;
    let moderatedCommunites: Community[] | null = null;

    onMount(async () => {
        ownedCommunities =
            await Serverbench.getInstance().getOwnedCommunities();
        moderatedCommunites =
            await Serverbench.getInstance().getModeratedCommunities();
    });

    function selectCommunity(community: Community) {
        Serverbench.getInstance().setCommunity(community);
        goto('/community/servers/list/')
    }
</script>

<div class="flex flex-col gap-5 container mx-auto py-5">
    <div>
        <h1 class="text-xl text-black font-semibold mb-3">Owned Servers</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {#if ownedCommunities}
                {#each ownedCommunities as community}
                    <Card
                        href="#"
                        on:click={() => selectCommunity(community)}
                    >
                        <h2 class="text-xl font-semibold">{community.name}</h2>
                        <Chart height={150} />
                    </Card>
                {/each}
                <Card
                    href="/setup/identity"
                    class="flex flex-col items-center justify-center"
                    color="form"
                >
                    <Plus width="15%" height="100%" />
                </Card>
            {/if}
        </div>
    </div>
    <hr />
    <div>
        <h1 class="text-xl text-black font-semibold mb-3">Moderated Servers</h1>
        <div class="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {#if moderatedCommunites}
                {#each moderatedCommunites as community}
                    <Card href="/community/servers/list">
                        <h2 class="text-xl font-semibold">{community.name}</h2>
                        <Chart height={150} />
                    </Card>
                {/each}
                <Card
                    href="/invite"
                    class="flex flex-col items-center justify-center"
                    color="form"
                >
                    <Plus width="15%" height="177px" />
                </Card>
            {/if}
        </div>
    </div>
</div>
