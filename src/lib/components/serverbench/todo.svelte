<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Construction } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
</script>

<Card.Root class="p-3 flex flex-row gap-3 items-center">
    <Construction />
    <span class="grow"> This feature is being worked on </span>
    <Button variant="outline" href="https://www.buymeacoffee.com/happy" target="_blank"
        >buy me a coffee</Button
    >
</Card.Root>
