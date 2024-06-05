<script lang="ts">
    import type DeveloperProfile from "$lib/sb/developer/DeveloperProfile";
    import type Repository from "$lib/sb/developer/Repository";
    import DeveloperProfilePicker from "./DeveloperProfilePicker.svelte";
    import RepositoryBranchPicker from "./RepositoryBranchPicker.svelte";
    import RepositoryDirectoryPicker from "./RepositoryDirectoryPicker.svelte";

    export let developerProfile: DeveloperProfile | null = null;
    export let repository:Repository|null=null
    export let branch:string|null=null
</script>

<DeveloperProfilePicker bind:developerProfile />
<RepositoryDirectoryPicker bind:developerProfile bind:repository />
<RepositoryBranchPicker bind:repository bind:branch/>
