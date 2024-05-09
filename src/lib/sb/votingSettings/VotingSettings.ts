import type Community from "../Community"
import Srvbench from "../Srvbench"
import type { HandlerType } from "../voting/HandlerType"
import type VotingSite from "../voting/VotingSite"
import type { ConditionalExpression } from "./ConditionalExpression"
import VotingSiteSetup from "./VotingSiteSetup"
import VotingCredentials from "./credentials/Credentials"
import NuVotifierHandler from "./handler/NuVotifierHandler"
import VotifierHandler from "./handler/VotifierHandler"
import VotingHandler from "./handler/VotingHandler"

export default class VotingSettings {

    public readonly id: string
    public readonly community: Community
    public readonly autoscore: boolean
    public readonly autoscoringQueries: string[]
    public readonly featuredSites: number | null
    public readonly featuredSitesHeadroom: number
    public readonly sites: VotingSiteSetup[]
    public readonly rankExpression: string
    public readonly requireAllForPoints: boolean
    public readonly featuredSitesBuffer: number
    public readonly featuredVotePoints: number
    public readonly unfeaturedVotePoints: number
    public readonly rankDecreaseAfter: number | null
    public readonly rankDecreaseEvery: number | null
    public readonly rankDecreaseAmount: number | null
    public readonly rankActionExpression: ConditionalExpression
    public readonly streakFreezeExpression: ConditionalExpression
    public readonly streakActionExpression: ConditionalExpression
    public readonly streakAction: string | null
    public readonly rankupAction: string | null
    public readonly rankdownAction: string | null

    constructor(id: string, community: Community, autoscore: boolean, autoscoringQueries: string[], featuredSites: number | null, featuredSitesHeadroom: number, sites: VotingSiteSetup[], rankExpression: string, requireAllForPoints: boolean, featuredSitesBuffer: number, featuredVotePoints: number, unfeaturedVotePoints: number, rankDecreaseAfter: number | null, rankDecreaseEvery: number | null, rankDecreaseAmount: number | null, rankActionExpression: ConditionalExpression, streakFreezeExpression: ConditionalExpression, streakActionExpression: ConditionalExpression, streakAction: string | null, rankupAction: string | null, rankdownAction: string | null) {
        this.id = id
        this.community = community
        this.autoscore = autoscore
        this.autoscoringQueries = autoscoringQueries
        this.featuredSites = featuredSites
        this.featuredSitesHeadroom = featuredSitesHeadroom
        this.sites = sites
        this.rankExpression = rankExpression
        this.requireAllForPoints = requireAllForPoints
        this.featuredSitesBuffer = featuredSitesBuffer
        this.featuredVotePoints = featuredVotePoints
        this.unfeaturedVotePoints = unfeaturedVotePoints
        this.rankDecreaseAfter = rankDecreaseAfter
        this.rankDecreaseEvery = rankDecreaseEvery
        this.rankDecreaseAmount = rankDecreaseAmount
        this.rankActionExpression = rankActionExpression
        this.streakFreezeExpression = streakFreezeExpression
        this.streakActionExpression = streakActionExpression
        this.streakAction = streakAction
        this.rankupAction = rankupAction
        this.rankdownAction = rankdownAction
    }

    public static fromObject(obj: any, community: Community) {
        return new VotingSettings(
            obj.id,
            community,
            obj.autoscore,
            obj.autoscoringQueries,
            obj.featuredSites,
            obj.featuredSitesHeadroom,
            obj.sites.map((s: any) => VotingSiteSetup.fromObject(s)),
            obj.rankExpression,
            obj.requireAllForPoints,
            obj.featuredSitesBuffer,
            obj.featuredVotePoints,
            obj.unfeaturedVotePoints,
            obj.rankDecreaseAfter,
            obj.rankDecreaseEvery,
            obj.rankDecreaseAmount,
            obj.rankActionExpression,
            obj.streakFreezeExpression,
            obj.streakActionExpression,
            obj.streakAction,
            obj.rankupAction,
            obj.rankdownAction
        )
    }

    public async getCredentials(): Promise<VotingHandler[]> {
        return (await this.community.rest(`voting/handlers`)).map((o: any) => {
            if (o.type == 'NuVotifierHandler') {
                return NuVotifierHandler.fromObject(o)
            } else if (o.type == 'VotifierHandler') {
                return VotifierHandler.fromObject(o)
            } else {
                throw new Error('unknown')
            }
        })
    }

    public async setupSite(votingSite: VotingSite, url: string, handlerType: HandlerType, entrypoint: string | null, cooldown: number | null, reset: number | null) {
        const votingSiteSetup = VotingSiteSetup.fromObject(await this.community.rest(`voting/sites`, {
            site: votingSite.id,
            url,
            handlerType,
            entrypoint,
            cooldown,
            reset
        }))
        this.sites.push(votingSiteSetup)
        return votingSiteSetup
    }

    public async setRankReward(rankExpression: string, rankDecreaseAfter: number | null, rankDecreaseEvery: number | null, rankDecreaseAmount: number | null, featuredVotePoints: number, unfeaturedVotePoints: number, requireAllForPoints: boolean, rankActionExpression: ConditionalExpression, rankupAction: string | null, rankdownAction: string | null) {
        return VotingSettings.fromObject(await this.community.rest('voting/rank', {
            rankExpression,
            rankDecreaseAfter,
            rankDecreaseEvery,
            rankDecreaseAmount,
            featuredVotePoints,
            unfeaturedVotePoints,
            requireAllForPoints,
            rankActionExpression,
            rankupAction,
            rankdownAction
        }), this.community)
    }

    public async setStreakReward(streakActionExpression: ConditionalExpression, streakFreezeExpression: ConditionalExpression, streakAction: string | null) {
        return VotingSettings.fromObject(await this.community.rest('voting/streak', {
            streakActionExpression,
            streakFreezeExpression,
            streakAction,
        }), this.community)
    }

}