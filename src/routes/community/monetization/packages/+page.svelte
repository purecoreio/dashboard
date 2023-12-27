<script>
    import { Badge, Card } from "flowbite-svelte";
    import Fire from "~icons/ph/fire-fill";
    import Edit from "~icons/ic/baseline-edit";
    const packages = [
        {
            name: "Hero",
            price: {
                value: 5.99,
                currency: "eur",
            },
            sales: 300,
        },
        {
            name: "Platinum",
            price: {
                value: 7.99,
                currency: "eur",
            },
            sales: 100,
        },
        {
            name: "Hero",
            price: {
                value: 9.99,
                currency: "eur",
            },
            sales: 100,
        },
        {
            name: "Hero",
            price: {
                value: 14.99,
                currency: "eur",
            },
            sales: 100,
        },
    ];
</script>

<div class="grid gap-3 grid-cols-3">
    {#each packages as _package}
        <Card>
            <h1 class="text-2xl font-semibold text-black">
                {_package.name}
            </h1>
            <h1 class="text-xl font-semibold">
                {_package.price.value}
                {_package.price.currency.toUpperCase()}
            </h1>
            <div class="mt-5 flex flex-row justify-between items-center">
                <div>
                    <Badge>
                        <span class="mx-2">{_package.sales}</span>
                        {#if _package.sales >= 300}
                            <Fire />
                        {/if}
                    </Badge>
                </div>
                <div>
                    <Edit />
                </div>
            </div>
        </Card>
    {/each}
</div>
