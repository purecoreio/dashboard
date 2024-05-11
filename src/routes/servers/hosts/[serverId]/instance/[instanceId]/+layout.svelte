<script lang="ts">
    import { error } from "@sveltejs/kit";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import Srvbench from "$lib/sb/Srvbench";
    import type Server from "$lib/sb/server/Server";
    import type Instance from "$lib/sb/server/Instance";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    const { serverId, instanceId } = $page.params;
    let loading = true;
    let instance = writable<Instance>();
    let server = writable<Server>();

    setContext("instance", instance);
    setContext("server", server);

    let adding = false;
    let value = 0;

    onMount(async () => {
        loading = true;
        try {
            $server = await Srvbench.getInstance()
                .getCommunity()!
                .getServer(serverId);
            value = 50;
            $instance = $server.instances.find((i) => i.id == instanceId)!;
            value = 100;
            console.log('test')
        } catch (e) {
            console.log(e);
            error(404);
        }
        loading = false;
    });
</script>

<slot />
