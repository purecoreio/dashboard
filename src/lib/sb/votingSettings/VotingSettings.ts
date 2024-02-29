import type Community from "../Community"
import Srvbench from "../Srvbench"
import type { HandlerType } from "../voting/HandlerType"
import type VotingSite from "../voting/VotingSite"
import VotingSiteSetup from "./VotingSiteSetup"
import VotingCredentials from "./credentials/Credentials"
import NuVotifierCredentials from "./credentials/NuVotifierCredentials"
import VotifierCredentials from "./credentials/VotifierCredentials"

export default class VotingSettings {

    public readonly id: string
    public readonly community: Community
    public readonly autoscore: boolean
    public readonly autoscoringQueries: string[]
    public readonly featuredSites: number | null
    public readonly featuredSitesHeadroom: number
    public readonly credentials: VotingCredentials
    public readonly sites: VotingSiteSetup[]

    constructor(id: string, community: Community, autoscore: boolean, autoscoringQueries: string[], featuredSites: number | null, featuredSitesHeadroom: number, credentials: VotingCredentials, sites: VotingSiteSetup[]) {
        this.id = id
        this.community = community
        this.autoscore = autoscore
        this.autoscoringQueries = autoscoringQueries
        this.featuredSites = featuredSites
        this.featuredSitesHeadroom = featuredSitesHeadroom
        this.credentials = credentials
        this.sites = sites
    }

    public static fromObject(obj: any, community: Community) {
        return new VotingSettings(
            obj.id,
            community,
            obj.autoscore,
            obj.autoscoringQueries,
            obj.featuredSites,
            obj.featuredSitesHeadroom,
            new VotingCredentials(community, null, new NuVotifierCredentials(null), new VotifierCredentials(null, null, null, null)), //VotingCredentials.fromObject(obj.credentials, community),
            obj.sites.map((s: any) => VotingSiteSetup.fromObject(s))
        )
    }

    public async regenCredentials(handlerType: HandlerType): Promise<VotingSettings> {
        const credentials =
            VotingCredentials.fromObject(
                await Srvbench.getInstance().rest(`community/${this.community.id}/voting/credentials/${handlerType}`, {}),
                this.community
            )
        return new VotingSettings(
            this.id,
            this.community,
            this.autoscore,
            this.autoscoringQueries,
            this.featuredSites,
            this.featuredSitesHeadroom,
            credentials,
            this.sites
        )
    }

    public async setupSite(votingSite: VotingSite, url: string, handlerType: HandlerType, entrypoint: string | null, cooldown: number | null, reset: number | null) {
        const votingSiteSetup = VotingSiteSetup.fromObject(await Srvbench.getInstance().rest(`community/${this.community.id}/voting/sites`, {
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

}