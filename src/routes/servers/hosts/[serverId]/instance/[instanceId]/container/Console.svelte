<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";

    export let lines: string[];
</script>

<Card.Root>
    <div>
        <div class="p-3 h-96 overflow-auto flex flex-col-reverse">
            {#each lines as line}
                {line}<br />
            {/each}
        </div>
        <div class="flex flex-row items-center gap-3 p-2">
            <Input placeholder="cmd" />
            <Button variant="secondary">
                Send
            </Button>
        </div>
    </div>
</Card.Root>
