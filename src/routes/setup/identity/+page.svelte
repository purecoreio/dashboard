<script lang="ts">
    import { goto } from "$app/navigation";
    import Srvbench from "$lib/sb/SrvBench";
    import {
        Label,
        Input,
        ButtonGroup,
        InputAddon,
        MultiSelect,
        DeviceMockup,
        Button,
        Indicator,
    } from "flowbite-svelte";
    import Next from "~icons/ic/round-chevron-right";
    let subdomain: string, name: string;
    let selectedGames = ["minecraft"];
    let games = [
        {
            value: "minecraft",
            name: "Minecraft Java Edition",
        },
        {
            value: "minecraft-bedrock",
            name: "Minecraft Bedrock Edition",
        },
        {
            value: "fivem",
            name: "FiveM",
        },
    ];

    let loading = false;

    async function createCommunity() {
        loading = true;
        try {
            const srv = Srvbench.getInstance();
            const community = await srv.createCommunity(name, subdomain);
            srv.setCommunity(community);
            goto("/community/servers/list");
        } catch (error) {
            loading = false;
        }
    }
</script>

<div>
    <div class="flex flex-col gap-4">
        <div>
            <Label for="community-name" class="block">Community Name</Label>
            <Input id="community-name" bind:value={name} placeholder="Name" />
        </div>
        <div>
            <Label for="community-domain" class="block"
                >Community Subdomain</Label
            >
            <ButtonGroup class="w-full">
                <Input
                    id="community-domain"
                    bind:value={subdomain}
                    placeholder="Subdomain"
                />
                <InputAddon>serverbench.io</InputAddon>
            </ButtonGroup>
        </div>
        <div>
            <Label for="community-games" class="block">Community Games</Label>
            <MultiSelect
                id="community-games"
                items={games}
                bind:value={selectedGames}
            />
        </div>
        <div class="text-right">
            <Button disabled={loading} on:click={() => createCommunity()} href="#"
                >Next <Next /></Button
            >
        </div>
    </div>
</div>
<div>
    <DeviceMockup device="laptop">
        <div
            class="flex flex-row gap-3 p-3 bg-neutral-100 items-center border-b-2"
        >
            <Indicator color="gray" />
            <Input
                size="sm"
                value={`${subdomain ? subdomain : "?"}.serverbench.io`}
            />
            <Indicator color="gray" />
        </div>
        <div class="py-5 text-center">
            <h1 class="font-bold text-2xl">{name ? name : "?"}</h1>
        </div>
        <div class="bg-neutral-100 rounded h-full w-1/2 mx-auto"></div>
    </DeviceMockup>
</div>
