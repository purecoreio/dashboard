<script lang="ts">
    export let date: Date;
    import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root class="w-24 flex flex-col gap-1 text-center py-3">
    <span>
        {date.toLocaleString("default", {
            month: "long",
        })}
    </span>
    <span class="font-black text-xl number">
        {date.getDate()}
    </span>
</Card.Root>
