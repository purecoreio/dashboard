<script lang="ts">
    const methods = [
        "minecraft",
        "github",
        "google",
        "microsoft",
        "steam",
        "xbox",
        "discord",
    ];
    import { page } from "$app/stores";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import SSO from "$lib/sso/SSO";
    import { createEventDispatcher, onMount } from "svelte";

    let enabled: string[] = [];

    const dispatch = createEventDispatcher();

    const sso = SSO.getInstance("serverbench.io");
    let logged: boolean = false;

    async function login(method: string) {
        await sso.login(method);
        logged = sso.logged;
        dispatch("logged", sso.logged);
    }

    onMount(() => {
        if ($page.url.searchParams.has("login")) {
            enabled = $page.url.searchParams.get("login")!.split(",");
        }
    });
</script>

<div class="h-screen flex flex-col items-center justify-center dark:bg-gradient-to-t dark:from-black dark:to-neutral-900">
    <main class="w-full text-center flex flex-col gap-3 max-w-sm">
        <h1 class="font-bold text-2xl">serverbench</h1>
        <Card.Root class="flex flex-col gap-1 p-2">
            {#each methods as method}
                <Button
                    disabled={enabled.length > 0 && !enabled.includes(method)}
                    on:click={() => login(method)}
                    class="capitalize"
                >
                    {method}
                </Button>
            {/each}
        </Card.Root>
        <small>
            serverbench.io is a product built by <a
                target="_blank"
                class="underline"
                href="https://nominal.es">nominal.es</a
            >.<br />
            By logging in you accept our
            <a class="underline" target="_blank" href="https://nominal.es/legal"
                >terms of service</a
            >
            and
            <a class="underline" target="_blank" href="https://nominal.es/legal"
                >privacy policy</a
            >
        </small>
    </main>
</div>
