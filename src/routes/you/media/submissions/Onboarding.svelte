<script lang="ts">
    import MediaIcon from "$lib/components/serverbench/mediaIcon.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import Srvbench from "$lib/sb/Srvbench";
    import type MediaProfile from "$lib/sb/media/MediaProfile";
    import type { MediaPlatform } from "$lib/sb/media/MediaProfile";
    import { createEventDispatcher, onMount } from "svelte";
    import { Separator } from "$lib/components/ui/separator";
    import * as Card from "$lib/components/ui/card";
    import { ArrowRightCircle } from "lucide-svelte";
    import { page } from "$app/stores";

    let open: boolean = false;
    export let platforms: MediaPlatform[];
    let sources: MediaProfile[] = [];
    let loading: boolean = false;

    const dispatch = createEventDispatcher();

    async function loadSources() {
        const user = Srvbench.getInstance().getUser();
        loading = true;
        try {
            sources = await user.listMediaSources();
        } catch (error) {}
        loading = false;
    }

    async function link(method: MediaPlatform) {
        if (loading) return;
        loading = true;
        try {
            const user = Srvbench.getInstance().getUser();
            await user.linkMediaSource(method);
            await loadSources();
            dispatch("created");
        } catch (error) {}
        loading = false;
    }

    function next() {
        open = false;
        dispatch("finished");
    }

    onMount(async () => {
        await loadSources();
        if ($page.url.searchParams.has("media_onboarding")) {
            if (sources.length <= 0) {
                open = true;
            } else {
                dispatch("finished");
            }
        }
    });
</script>

<Dialog.Root bind:open>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Link Your Media</Dialog.Title>
            <Dialog.Description>
                Start submitting your content. Please, link your YouTube channel
                so we can make sure the videos you are sending are yours
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-col gap-2">
            {#each platforms as method}
                <Button
                    on:click={() => link(method)}
                    disabled={method == "tiktok" || loading}
                    class="flex flex-row gap-2 capitalize"
                >
                    <MediaIcon platform={method} />
                    {method}
                    {#if method == "tiktok"}
                        <Badge variant="secondary">Soon</Badge>
                    {/if}
                </Button>
            {/each}
            {#if sources.length > 0}
                <Separator />
                {#each sources as source}
                    <Card.Root
                        class="px-3 py-2 flex flex-row gap-2 items-center"
                    >
                        <MediaIcon platform={source.platform} />
                        {source.username}
                    </Card.Root>
                {/each}
                <Separator />
                <Button
                    on:click={() => next()}
                    disabled={loading}
                    class="flex flex-row gap-2"
                >
                    Next
                    <ArrowRightCircle class="w-4 h-4" />
                </Button>
            {/if}
        </div>
    </Dialog.Content>
</Dialog.Root>
