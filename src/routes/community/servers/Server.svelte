<script lang="ts">
    import { Badge, Button, Checkbox } from "flowbite-svelte";
    import Settings from "~icons/ic/baseline-settings";
    import Edit from "~icons/ic/baseline-edit";

    export let server: any, instance: any;
</script>

<div class="flex row gap-2 py-2 items-center">
    <Checkbox/>
    <span class="grow">
        {server.name}
        {instance.id}
    </span>
    <Badge color="green">Healthy</Badge>
    <Badge>{instance.online} Online</Badge>
    <Button size="xs" color="alternative">
        <Edit />
    </Button>
    <Button size="xs" color="alternative">
        <Settings />
    </Button>
</div>
