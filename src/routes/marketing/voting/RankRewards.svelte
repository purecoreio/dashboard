<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import type VotingSettings from "$lib/sb/votingSettings/VotingSettings";
    import { Input } from "$lib/components/ui/input";
    import Label from "$lib/components/ui/label/label.svelte";
    import Switch from "$lib/components/ui/switch/switch.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import ConditionalResult from "./ConditionalResult.svelte";

    export let settings: VotingSettings;

    let rankExpression = settings.rankExpression;
    let rankDecreaseAfter = settings.rankDecreaseAfter;
    let rankDecreaseEvery = settings.rankDecreaseEvery;
    let rankDecreaseAmount = settings.rankDecreaseAmount;
    let featuredVotePoints = settings.featuredVotePoints;
    let unfeaturedVotePoints = settings.unfeaturedVotePoints;
    let requireAllForPoints = settings.requireAllForPoints;
    let rankActionExpression = settings.rankActionExpression.expression;
    let rankActionOperator = settings.rankActionExpression.operator;
    let rankActionResult = settings.rankActionExpression.result;
    let rankupAction = settings.rankupAction;
    let rankdownAction = settings.rankdownAction;

    let loading: boolean = false;

    async function update() {
        loading = true;
        try {
            settings = await settings.setRankReward(
                rankExpression,
                rankDecreaseAfter,
                rankDecreaseEvery,
                rankDecreaseAmount,
                featuredVotePoints,
                unfeaturedVotePoints,
                requireAllForPoints,
                {
                    expression: rankActionExpression,
                    operator: rankActionOperator,
                    result: rankActionResult,
                },
                rankupAction,
                rankdownAction,
            );
        } catch (error) {}
        loading = false;
    }
</script>

<Card.Root class="p-3 flex flex-col gap-3">
    <div class="grid grid-cols-2 gap-3 items-center">
        <div>
            <Label>Rank Expression</Label>
            <Input disabled={loading} bind:value={rankExpression} />
        </div>
        <div>
            <Label>Decrease Points After</Label>
            <Input disabled={loading} bind:value={rankDecreaseAfter} />
        </div>
        <div>
            <Label>Decrease Points Every</Label>
            <Input disabled={loading} bind:value={rankDecreaseEvery} />
        </div>
        <div>
            <Label>Decrease Points Amount</Label>
            <Input disabled={loading} bind:value={rankDecreaseAmount} />
        </div>
        <div>
            <Label>Featured Vote Points</Label>
            <Input disabled={loading} bind:value={featuredVotePoints} />
        </div>
        <div>
            <Label>Unfeatured Vote Points</Label>
            <Input disabled={loading} bind:value={unfeaturedVotePoints} />
        </div>
        <div class="flex flex-row items-center gap-3 py-2">
            <Switch disabled={loading} bind:checked={requireAllForPoints} />
            <Label>Require All For Points</Label>
        </div>
    </div>
    <hr />
    <div class="grid grid-cols-2 gap-3 items-center">
        <div>
            <Label>Rank Action Expression</Label>
            <Input disabled={loading} bind:value={rankActionExpression} />
        </div>
        <div>
            <Label>Rank Action Condition</Label>
            <ConditionalResult
                disabled={loading}
                bind:result={rankActionResult}
                bind:operator={rankActionOperator}
            />
        </div>
    </div>
    <hr />
    <div class="grid grid-cols-2 gap-3 items-center">
        <div>
            <Label>Rankup Command</Label>
            <Input disabled={loading} bind:value={rankupAction} />
        </div>
        <div>
            <Label>Rankdown Command</Label>
            <Input disabled={loading} bind:value={rankdownAction} />
        </div>
    </div>
    <div class="text-right">
        <Button disabled={loading} on:click={() => update()}>Save</Button>
    </div>
</Card.Root>
