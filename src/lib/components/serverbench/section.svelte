<script lang="ts">
    export let title: string;
</script>

<div class="mb-4">
    <p class="uppercase font-bold text-sm opacity-80">
        {title}
    </p>
    <hr class="mt-1 mb-2" />
    <div class="flex flex-col gap-3">
        <slot />
    </div>
</div>
