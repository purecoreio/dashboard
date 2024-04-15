<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import Srvbench from "$lib/sb/Srvbench";
    import { Clipboard, Loader2 } from "lucide-svelte";
    import copy from "copy-text-to-clipboard";

    let loading: boolean = false;
    let code: string | null = null;
    let url: string | null = null;
    let open: boolean = false;
    let copied:boolean=false

    $: open,
        (async () => {
            if (open) {
                loading = true;
                try {
                    const link = await Srvbench.getInstance()
                        .getCommunity()!
                        .requestDiscordLinkIntent();
                    code = link.code;
                    url = link.url;
                } catch (error) {
                    console.log(error);
                    open = false;
                }
                loading = false;
            }
        })();
    
    function copyCode(){
        copy(code!)
        copied=true
        setTimeout(() => {
            copied = false
        }, 1000);
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger>
        <Button>Link Discord</Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Link Your Discord Guild</Dialog.Title>
            <Dialog.Description>
                Your previous Discord guild will be replaced.
            </Dialog.Description>
        </Dialog.Header>
        <div class="flex flex-col gap-3">
            <div class="flex flex-row gap-3 items-center">
                <div class="grow">
                    <Input disabled id="code" value={code} />
                </div>
                {#if code}
                    <Button disabled={loading || copied} on:click={() => copyCode()}>
                        <Clipboard class="w-4 h-4" />
                    </Button>
                {/if}
            </div>
            <div class="flex flex-row gap-3 items-center">
                <div>
                    <Button on:click={() => (open = false)}>Close</Button>
                </div>
                <div class="grow">
                    {#if loading}
                        <Button class="w-full" disabled>
                            <Loader2 class="w-4 h-4 animate-spin" />
                        </Button>
                    {:else}
                        <Button class="w-full" href={url} target="_blank"
                            >Click To Invite Vote</Button
                        >
                    {/if}
                </div>
            </div>
        </div>
    </Dialog.Content>
</Dialog.Root>
