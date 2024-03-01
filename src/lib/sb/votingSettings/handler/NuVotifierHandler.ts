import VotingHandler from "./VotingHandler"

export default class NuVotifierHandler extends VotingHandler {

    public readonly token: string | null

    constructor(forward: string | null, port: number, shard: string, token: string | null) {
        super('NuVotifier', forward, port, shard)
        this.token = token
    }

    public static fromObject(obj: any) {
        return new NuVotifierHandler(
            obj.forward,
            obj.port,
            obj.shard,
            obj.token,
        )
    }

}