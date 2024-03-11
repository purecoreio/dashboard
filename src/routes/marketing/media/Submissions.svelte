<script lang="ts">
    import Submission from "$lib/sb/media/Submission";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Loader2, MoreVertical, Play } from "lucide-svelte";
    import MediaIcon from "$lib/components/serverbench/mediaIcon.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
    import { createEventDispatcher } from "svelte";
    export let submissions: Submission[], showPending: boolean;

    const dispatch = createEventDispatcher();

    let loading = false;

    async function setStatus(submission: Submission, approve: boolean) {
        loading = true;
        try {
            await submission.setStatus(approve ? "approved" : "declined");
            dispatch("update", submissions);
        } catch (error) {}
        loading = false;
        submissions = submissions;
    }
</script>

<Card.Root>
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head class="w-[100px]">Creator</Table.Head>
                <Table.Head>Date</Table.Head>
                <Table.Head>Verification Status</Table.Head>
                <Table.Head>Link</Table.Head>
                <Table.Head class="text-right">Options</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each submissions.filter((s) => (s.getVerification().on != null && !showPending) || (s.getVerification().on == null && showPending)) as submission}
                <Table.Row>
                    <Table.Cell>
                        <div class="flex flex-row gap-3 items-center">
                            <MediaIcon platform={submission.profile.platform} />
                            <span>
                                {submission.profile.username}
                            </span>
                        </div>
                    </Table.Cell>
                    <Table.Cell>
                        {submission.created.toLocaleDateString()}
                        {submission.created.toLocaleTimeString()}
                    </Table.Cell>
                    <Table.Cell>
                        <Badge
                            variant={submission.getVerification().on == null
                                ? "destructive"
                                : submission.getVerification().declined
                                  ? "outline"
                                  : "secondary"}
                        >
                            {#if loading}
                                <Loader2 class="animate-spin h-4 w-4" />
                            {:else if submission.getVerification().on == null}
                                Pending
                            {:else if submission.getVerification().declined}
                                Declined
                            {:else}
                                Approved
                            {/if}
                        </Badge>
                    </Table.Cell>
                    <Table.Cell class="flex flex-row gap-2 items-center">
                        <Input disabled value={submission.title} />
                        <Button
                            href={submission.url}
                            target="_blank"
                            class="capitalize"
                            variant="ghost"
                            size="sm"
                        >
                            <Play class="h-4 w-4" />
                        </Button>
                    </Table.Cell>
                    <Table.Cell class="text-right">
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Button
                                    size="icon"
                                    class="rounded-full"
                                    variant="outline"
                                    disabled={loading}
                                >
                                    <MoreVertical />
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Group>
                                    <DropdownMenu.Label
                                        >Manage</DropdownMenu.Label
                                    >
                                    <DropdownMenu.Separator />
                                    {#if submission.getVerification().declined == null || submission.getVerification().declined == true}
                                        <DropdownMenu.Item
                                            on:click={() =>
                                                setStatus(submission, true)}
                                        >
                                            Approve
                                        </DropdownMenu.Item>
                                    {/if}
                                    {#if submission.getVerification().declined == null || submission.getVerification().declined == false}
                                        <DropdownMenu.Item
                                            on:click={() =>
                                                setStatus(submission, false)}
                                        >
                                            Decline
                                        </DropdownMenu.Item>
                                    {/if}
                                </DropdownMenu.Group>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</Card.Root>
