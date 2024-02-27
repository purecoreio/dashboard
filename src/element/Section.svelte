<script lang="ts">
    export let slim: boolean = false;
</script>

<div
    class:p-3={!slim}
    class="rounded ring-1 ring-black ring-opacity-15 overflow-hidden flex flex-col gap-3"
>
    <slot />
</div>
