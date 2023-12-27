<script>
    import { Card } from "flowbite-svelte";
    import Chart from "../../../../element/Chart.svelte";
</script>

<Card class="max-w-full">
    <Chart height={200} title="Income" />
</Card>
<div class="grid grid-cols-3 gap-5">
    <Card>
        <div class="py-3">
            <span class="font-black text-3xl text-primary-500">0.00 €</span>
            <span>Income</span>
        </div>
    </Card>
    <Card>
        <div class="py-3">
            <span class="font-black text-3xl text-primary-500">0.00 €</span>
            <span>Expenses</span>
        </div>
    </Card>
    <Card>
        <div class="py-3">
            <span class="font-black text-3xl text-primary-500">0.00 €</span>
            <span>Net Revenue</span>
        </div>
    </Card>
</div>
