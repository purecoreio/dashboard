<script lang="ts">
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Select from "$lib/components/ui/select";
    import Srvbench from "$lib/sb/Srvbench";
    import type Creator from "$lib/sb/media/Creator";
    import type { MediaPlatform } from "$lib/sb/media/MediaProfile";
    import { Loader2 } from "lucide-svelte";
    import { createEventDispatcher, onMount } from "svelte";

    const dispatch = createEventDispatcher();

    let url: string | null = null;
    export let creatorProfiles: Creator[] = [],
        submitting: boolean;
    let creatorProfile: any = null;
    let loading: boolean = false;

    async function submitContent() {
        if (loading) return;
        loading = true;
        try {
            const link = new URL(url!);
            let platform: MediaPlatform | null = null;
            let id: string | null = null;
            if (
                link.hostname == "youtube.com" ||
                link.hostname == "www.youtube.com"
            ) {
                platform = "youtube";
                if (link.pathname.includes("shorts")) {
                    id = link.pathname.split("shorts")[1].split("/")[1];
                } else {
                    id = link.searchParams.get("v");
                }
            } else if (link.hostname == "youtu.be") {
                platform = "youtube";
                id = link.pathname.split("/")[1];
            } else if (
                link.hostname == "tiktok.com" ||
                link.hostname == "www.tiktok.com"
            ) {
                platform = "tiktok";
                id = link.pathname.split("video")[1].split("/")[1];
            } else if (link.hostname == "vm.tiktok.com") {
                throw new Error(
                    "tiktok share urls must use this format: https://www.tiktok.com/@<username>/video/<video id>. try copying the url from your browser address bar instead.",
                );
            } else if (
                link.hostname == "twitch.tv" ||
                link.hostname == "www.twitch.tv"
            ) {
                platform = "twitch";
                id = link.pathname.split("videos")[1].split("/")[1];
            } else {
                throw new Error("unsupported link");
            }
            if (!platform || !id) throw new Error("unknown video or platform");
            console.log(platform, id, creatorProfile, creatorProfiles);
            console.log(
                await Srvbench.getInstance()
                    .getUser()
                    .submitContent(
                        creatorProfiles.find(
                            (p) => p.id == creatorProfile?.value,
                        )!.community,
                        platform,
                        id,
                    ),
            );
            dispatch("submitted");
            submitting = false;
            url = null;
        } catch (error) {
            console.log(error);
        }
        loading = false;
    }

    $: creatorProfiles,
        (() => {
            if (creatorProfiles.length > 0) {
                creatorProfile = {
                    label: creatorProfiles[0].community.name,
                    value: creatorProfiles[0].id,
                };
            }
        })();
</script>

<Dialog.Root bind:open={submitting}>
    <Dialog.Trigger>
        <Button size="sm" variant="outline">Submit Content</Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Submit Content</Dialog.Title>
            <Dialog.Description>
                Submit your content. Enter a valid URL from YouTube or TikTok.
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-col gap-3">
            <div>
                <Label for="community">Community</Label>
                <Select.Root bind:selected={creatorProfile} portal={null}>
                    <Select.Trigger>
                        <Select.Value placeholder="Select a community" />
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Group>
                            <Select.Label>Community</Select.Label>
                            {#each creatorProfiles as creatorProfile}
                                <Select.Item
                                    value={creatorProfile.id}
                                    label={creatorProfile.community.name}
                                >
                                    {creatorProfile.community.name}
                                </Select.Item>
                            {/each}
                        </Select.Group>
                    </Select.Content>
                    <Select.Input id="community" name="community" />
                </Select.Root>
            </div>
            <div>
                <Label for="url">Video URL</Label>
                <Input
                    id="url"
                    bind:value={url}
                    placeholder="https://www.youtube.com/watch?v=jIQ6UV2onyI"
                />
            </div>
        </div>
        <Dialog.Footer>
            <Button
                on:click={() => submitContent()}
                disabled={loading}
                type="submit"
            >
                {#if loading}
                    <Loader2 class="animate-spin" />
                {:else}
                    Submit Content
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
