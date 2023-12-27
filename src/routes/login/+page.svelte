<script lang="ts">
    import { Alert } from "flowbite-svelte";
    import { Card } from "flowbite-svelte";
    import { Button } from "flowbite-svelte";
    import github from "~icons/mdi/github";
    import google from "~icons/bi/google";
    import microsoft from "~icons/mdi/microsoft";
    import steam from "~icons/mdi/steam";
    import xbox from "~icons/mdi/microsoft-xbox";
    import discord from "~icons/ic/baseline-discord";
    import minecraft from "~icons/mdi/minecraft";
    import SSO from "$lib/sso/SSO";
    import { goto } from "$app/navigation";
    const methods = {
        Minecraft: minecraft,
        GitHub: github,
        Google: google,
        Microsoft: microsoft,
        Steam: steam,
        Xbox: xbox,
        Discord: discord,
    };
    let loading: boolean = false;

    async function login(method: string) {
        loading = true;
        try {
            await SSO.getInstance().login(method.toLowerCase());
            alert("logged in");
        } catch (error) {}
        loading = false;
        goto("/");
    }
</script>

<div class="flex items-center justify-center h-screen">
    <div class="max-w-md w-full flex flex-col gap-3">
        <Card class="flex flex-col gap-2 text-center" size="lg">
            <h5
                class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
                serverbench
            </h5>
            {#each Object.keys(methods) as method}
                <Button
                    on:click={() => login(method)}
                    disabled={loading}
                    class="flex flex-row gap-2"
                >
                    <svelte:component this={methods[method]} />
                    {method}
                </Button>
            {/each}
        </Card>

        <Alert class="text-center">
            <span class="font-medium">Heya!</span>
            We suggest logging in with Minecraft for now.
        </Alert>
    </div>
</div>
