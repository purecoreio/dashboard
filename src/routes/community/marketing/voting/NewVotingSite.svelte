<script lang="ts">
    import Srvbench from "$lib/sb/Srvbench";
    import countryData from "country-code-lookup";
    import type { HandlerType } from "$lib/sb/voting/HandlerType";
    import {
        Button,
        ButtonGroup,
        Input,
        Label,
        Modal,
        MultiSelect,
        Toggle,
    } from "flowbite-svelte";
    export let show: boolean = false;
    let loading = false;
    let h: boolean = true;
    let regional = false;
    let countries: string[] = [];
    const countryList = countryData.countries.map((c) => {
        return {
            value: c.iso3,
            name: c.country,
        };
    });
    const handlers = [
        {
            value: "Votifier",
            name: "Votifier",
        },
        {
            value: "NuVotifier",
            name: "NuVotifier",
        },
    ];
    let handle: HandlerType[] = [];
    let time: string | null = null;
    let cooldown: number = 0;
    let domain: string | null = null;
    let identifier: string | null = null;

    function getParsedTime() {
        if (!time) return null;
        const [h, m] = time.split(":");
        const n = Number(h) * 3600 + Number(m) * 60;
        if (n < 0 || n >= 3600 * 24) return 0;
        return n;
    }

    async function register() {
        loading = true;
        try {
            await Srvbench.getInstance().createVotingSite(
                domain!,
                identifier!,
                handle,
                cooldown * (h ? 3600 : 60),
                getParsedTime(),
                regional ? countries : [],
            );
            show = false;
            handle = [];
            time = null;
            cooldown = 0;
            domain = null;
            identifier = null;
        } catch (error) {}
        loading = false;
    }
</script>

<Modal title="Register a voting site" bind:open={show}>
    <div class="flex flex-col gap-3">
        <Label>
            Domain
            <Input disabled={loading} bind:value={domain} />
        </Label>
        <Label>
            Handlers
            <MultiSelect
                disabled={loading}
                items={handlers}
                bind:value={handle}
            />
        </Label>
        <Label>
            Identifier
            <Input disabled={loading} bind:value={identifier} />
        </Label>
        <Label>
            Cooldown
            <div class="flex flex-row gap-3">
                <Input disabled={loading} bind:value={cooldown} type="number" />
                <ButtonGroup>
                    <Button
                        disabled={loading}
                        color={h ? "primary" : undefined}
                        on:click={() => (h = true)}>H</Button
                    >
                    <Button
                        disabled={loading}
                        color={!h ? "primary" : undefined}
                        on:click={() => (h = false)}>m</Button
                    >
                </ButtonGroup>
            </div>
        </Label>
        <Label>
            Reset Time (UTC)
            <Input disabled={loading} bind:value={time} type="time" />
        </Label>
        <Toggle bind:checked={regional}>
            This list is not an international site, it targets an specific
            country
        </Toggle>
        {#if regional}
            <MultiSelect
                disabled={loading}
                items={countryList}
                bind:value={countries}
            />
        {/if}
    </div>
    <svelte:fragment slot="footer">
        <div class="flex-row justify-between flex w-full">
            <Button disabled={loading} on:click={() => (show = false)}
                >Cancel</Button
            >
            <Button disabled={loading} on:click={register}>Register</Button>
        </div>
    </svelte:fragment>
</Modal>
