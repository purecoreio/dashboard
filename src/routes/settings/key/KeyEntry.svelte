<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";
    import type Key from "$lib/sb/Key";
    import * as Card from "$lib/components/ui/card";
    import { Clipboard, ClipboardCheck } from "lucide-svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import copy from "copy-text-to-clipboard";
    import { blur } from "svelte/transition";
    export let key: Key;
    let copied = false;

    function copyKey() {
        copy(key.id);
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 1000);
    }
</script>

<Card.Root class="flex flex-row gap-3 p-3">
    <Input type="password" value={key.id} />
    <Button on:click={() => copyKey()}>
        {#if copied}
            <div in:blur={{ duration: 300 }}>
                <ClipboardCheck class="w-4 h-4" />
            </div>
        {:else}
            <div in:blur={{ duration: 300 }}>
                <Clipboard class="w-4 h-4" />
            </div>
        {/if}
    </Button>
</Card.Root>
