import type Community from "$lib/sb/Community"
import NuVotifierCredentials from "./NuVotifierCredentials"
import VotifierCredentials from "./VotifierCredentials"

export default class VotingCredentials {

    private readonly community: Community
    public readonly autoscoringKey: string | null
    public readonly nuVotifier: NuVotifierCredentials
    public readonly votifier: VotifierCredentials

    constructor(community: Community, autoscoringKey: string | null, nuVotifier: NuVotifierCredentials, votifier: VotifierCredentials) {
        this.community = community
        this.autoscoringKey = autoscoringKey
        this.nuVotifier = nuVotifier
        this.votifier = votifier
    }

    public static fromObject(obj: any, community: Community) {
        return new VotingCredentials(
            community,
            obj.autoscoringKey,
            NuVotifierCredentials.fromObject(obj.nuVotifier),
            VotifierCredentials.fromObject(obj.votifier),
        )
    }

}