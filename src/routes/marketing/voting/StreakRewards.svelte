<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import type VotingSettings from "$lib/sb/votingSettings/VotingSettings";
    import { Input } from "$lib/components/ui/input";
    import Label from "$lib/components/ui/label/label.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import ConditionalResult from "./ConditionalResult.svelte";

    let loading: boolean = false;

    export let settings: VotingSettings;

    let streakAction = settings.streakAction;
    let streakActionExpressionOperator =
        settings.streakActionExpression.operator;
    let streakActionExpressionResult = settings.streakActionExpression.result;
    let streakActionExpressionExpression =
        settings.streakActionExpression.expression;
    let streakFreezeExpressionOperator =
        settings.streakFreezeExpression.operator;
    let streakFreezeExpressionResult = settings.streakFreezeExpression.result;
    let streakFreezeExpressionExpression =
        settings.streakFreezeExpression.expression;

    async function update() {
        loading = true;
        try {
            await settings.setStreakReward(
                {
                    operator: streakActionExpressionOperator,
                    result: streakActionExpressionResult,
                    expression: streakActionExpressionExpression,
                },
                {
                    operator: streakFreezeExpressionOperator,
                    result: streakFreezeExpressionResult,
                    expression: streakFreezeExpressionExpression,
                },
                streakAction,
            );
        } catch (error) {}
        loading = false;
    }
</script>

<Card.Root class="p-3 flex flex-col gap-3">
    <div class="grid grid-cols-2 gap-3 items-center">
        <div>
            <Label>Streak Action Expression</Label>
            <Input
                disabled={loading}
                bind:value={streakActionExpressionExpression}
            />
        </div>
        <div>
            <Label>Streak Action Condition</Label>
            <ConditionalResult
                disabled={loading}
                bind:result={streakActionExpressionResult}
                bind:operator={streakActionExpressionOperator}
            />
        </div>
    </div>
    <hr />
    <div class="grid grid-cols-2 gap-3 items-center">
        <div>
            <Label>Streak Freeze Expression</Label>
            <Input bind:value={streakFreezeExpressionExpression} />
        </div>
        <div>
            <Label>Streak Freeze Condition</Label>
            <ConditionalResult
                disabled={loading}
                bind:result={streakFreezeExpressionResult}
                bind:operator={streakFreezeExpressionOperator}
            />
        </div>
    </div>
    <hr />
    <div>
        <Label>Streak Action</Label>
        <Input disabled={loading} bind:value={streakAction} />
    </div>
    <div class="text-right">
        <Button disabled={loading} on:click={() => update()}>Save</Button>
    </div>
</Card.Root>
