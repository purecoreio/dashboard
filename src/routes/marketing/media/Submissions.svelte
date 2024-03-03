<script lang="ts">
    import Submission from "$lib/sb/media/Submission";
    import * as Table from "$lib/components/ui/table";
    import * as Card from "$lib/components/ui/card";
    import Fa from "svelte-fa";
    import {
        faTiktok,
        faYoutube,
        faTwitch,
    } from "@fortawesome/free-brands-svg-icons";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import { Button } from "$lib/components/ui/button";
    import { MoreVertical, Play } from "lucide-svelte";
    import MediaIcon from "$lib/components/serverbench/mediaIcon.svelte";
    export let submissions: Submission[];
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
            {#each submissions as submission}
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
                            variant={submission.verification.on == null
                                ? "destructive"
                                : "outline"}
                        >
                            {#if submission.verification.on == null}
                                Pending
                            {:else if submission.verification.declined}
                                Declined
                            {:else}
                                Approved
                            {/if}
                        </Badge>
                    </Table.Cell>
                    <Table.Cell>
                        <Button class="capitalize" variant="ghost" size="sm">
                            <Play class="h-4 w-4" />
                        </Button>
                    </Table.Cell>
                    <Table.Cell class="text-right">
                        <Button
                            size="icon"
                            class="rounded-full"
                            variant="outline"
                        >
                            <MoreVertical />
                        </Button>
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</Card.Root>
