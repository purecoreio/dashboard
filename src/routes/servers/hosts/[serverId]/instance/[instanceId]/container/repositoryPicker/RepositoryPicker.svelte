<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog";
    import type DeveloperProfile from "$lib/sb/developer/DeveloperProfile";
    import DeveloperProfilePicker from "./DeveloperProfilePicker.svelte";

    export let loading;
    export let picking: boolean;
    let developerProfile: DeveloperProfile | null = null;
</script>

<Dialog.Root bind:open={picking}>
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Repository Settings</Dialog.Title>
        </Dialog.Header>
        <DeveloperProfilePicker bind:developerProfile />
        <Dialog.Footer>
            <Button on:click={() => (picking = false)}>Close</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
