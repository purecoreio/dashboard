<script lang="ts">
    export let title: string;
</script>

<div>
    <p class="uppercase font-bold text-sm opacity-80">
        {title}
    </p>
    <hr class="mt-1 mb-2" />
    <slot />
</div>
