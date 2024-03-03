<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import Srvbench from "$lib/sb/Srvbench";
    import { Loader2 } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let communityId: string | null = null;
    let loading: boolean = false;
    let open: boolean = false;

    async function join() {
        if (loading) return;
        loading = true;
        try {
            await Srvbench.getInstance().getUser()!.joinAsCreator(communityId!);
            dispatch("created");
            open = false;
        } catch (error) {
            communityId = null;
        }
        loading = false;
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
        <Button size="sm" variant="outline">Join Community</Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Join Community As Creator</Dialog.Title>
            <Dialog.Description>
                Start your creator profile on your favorite community
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex items-center gap-3 flex-row">
            <Label for="name" class="text-right">ID</Label>
            <Input id="name" bind:value={communityId} class="col-span-3" />
        </div>
        <Dialog.Footer>
            <Button on:click={() => join()} type="submit">
                {#if loading}
                    <Loader2 class="animate-spin" />
                {:else}
                    Join Community
                {/if}
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
