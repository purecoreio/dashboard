import type { HandlerType } from "./HandlerType";

export default class VotingSite {

    public readonly id: string
    public readonly handlerTypes: HandlerType[];
    public readonly verified: Date | null
    public readonly cooldown: number
    public readonly reset: number | null
    public readonly domain: string
    public readonly handlerIdentifier: string
    public readonly regions: string[] | null

    constructor(id: string, handlerTypes: HandlerType[], verified: Date | null, cooldown: number, reset: number | null, domain: string, handlerIdentifier: string, regions: string[] | null) {
        this.id = id
        this.handlerTypes = handlerTypes
        this.verified = verified
        this.cooldown = cooldown
        this.reset = reset
        this.domain = domain
        this.handlerIdentifier = handlerIdentifier
        this.regions = regions
    }

    public static fromObject(obj: any) {
        return new VotingSite(
            obj.id,
            obj.handlerTypes as HandlerType[],
            obj.verified ? new Date(obj.verified) : null,
            obj.cooldown,
            obj.reset,
            obj.domain,
            obj.handlerIdentifier,
            obj.regions
        )
    }

}