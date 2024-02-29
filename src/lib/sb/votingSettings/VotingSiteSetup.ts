import type { HandlerType } from "../voting/HandlerType"
import VotingSite from "../voting/VotingSite"
export default class VotingSiteSetup {

    public readonly id: string
    public readonly site: VotingSite
    public readonly score: number | null
    public readonly lastScored: Date | null
    public readonly handlerType: HandlerType
    public readonly url: string

    constructor(id: string, site: VotingSite, score: number | null, lastScored: Date | null, handlerType: HandlerType, url: string) {
        this.id = id
        this.site = site
        this.score = score
        this.lastScored = lastScored
        this.handlerType = handlerType
        this.url = url
    }

    public static fromObject(obj: any) {
        return new VotingSiteSetup(
            obj.id,
            VotingSite.fromObject(obj.site),
            obj.score,
            obj.lastScored ? new Date(obj.lastScored) : null,
            obj.handlerType as HandlerType,
            obj.url
        )
    }

}