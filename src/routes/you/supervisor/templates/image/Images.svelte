<script lang="ts">
    import Section from "$lib/components/serverbench/section.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import type HostingImage from "$lib/sb/machine/container/HostingImage";
    import { onMount } from "svelte";
    import { toast } from "svelte-sonner";
    import ImageRow from "./ImageRow.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";

    export let images: HostingImage[] | null = null;
    let loading = true;
    let uri: string | null = null;
    let adding = false;

    onMount(async () => {
        loading = true;
        try {
            images = await Srvbench.getInstance().getUser().getHostingImages();
        } catch (error) {}
        loading = false;
    });

    async function createImage() {
        loading = true;
        try {
            if (!images) throw new Error();
            images.unshift(
                await Srvbench.getInstance().getUser().createHostingImage(uri!),
            );
            images = images;
            adding = false;
            uri = null;
            toast.success("created image");
        } catch (error) {
            toast.error("error while creating image");
        }
        loading = false;
    }
</script>

<Section title="images" {loading} bind:adding>
    <div class="flex flex-col gap-3" slot="add">
        <div>
            <Label>Image URI (Docker Hub Tag)</Label>
            <Input
                bind:value={uri}
                type="text"
                placeholder="itzg/minecraft-server"
            />
        </div>
        <Button disabled={loading} on:click={() => createImage()}
            >Create Image</Button
        >
    </div>
    <Card.Root>
        <Table.Root>
            <Table.Body>
                {#if images}
                    {#each images as image}
                        <ImageRow
                            on:delete={(ev) => {
                                if(!images) return
                                images = images.filter(
                                    (i) => i.id != ev.detail.id,
                                );
                            }}
                            {image}
                        />
                    {/each}
                {/if}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</Section>
