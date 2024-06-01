<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { ClipboardCopy, Loader2 } from "lucide-svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import Input from "$lib/components/ui/input/input.svelte";
    import { toast } from "svelte-sonner";
    import type Container from "$lib/sb/server/Container";
    import copyTextToClipboard from "copy-text-to-clipboard";

    export let loading;
    export let reset: boolean;
    let password: string | null;

    $: reset,
        (async () => {
            if (reset) {
                try {
                    password = await container!.resetPassword();
                    copyToClipboard();
                } catch (error) {
                    toast.error("unable to reset password");
                }
            }
        })();

    export let container: Container | null;

    function copyToClipboard() {
        if (!password) return;
        try {
            copyTextToClipboard(password);
            toast.info("copied to clipboard");
        } catch (error) {
            toast.error("unable to copy to clipboard");
        }
    }
</script>

{#if container}
    <Dialog.Root bind:open={reset}>
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>Password Reset</Dialog.Title>
            </Dialog.Header>
            <div class="flex flex-row gap-2">
                <Input
                    id="password"
                    type="password"
                    disabled
                    bind:value={password}
                />
                <Button disabled={loading} on:click={() => copyToClipboard()}>
                    <ClipboardCopy class="w-4 h-4" />
                </Button>
            </div>
            <Dialog.Footer>
                <Button on:click={() => (reset = false)}>Close</Button>
            </Dialog.Footer>
        </Dialog.Content>
    </Dialog.Root>
{/if}
