<script lang="ts">
    import type HostingImage from "$lib/sb/machine/container/HostingImage";
    import Images from "./image/Images.svelte";
    import Templates from "./template/Templates.svelte";

    let images: HostingImage[] | null = null;
</script>

<Templates bind:images />
<Images bind:images />