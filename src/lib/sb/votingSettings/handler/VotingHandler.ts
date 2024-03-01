export default abstract class VotingHandler {

    public readonly type: string
    public readonly forward: string | null
    public readonly port: number
    public readonly shard: string

    constructor(type: string, forward: string | null, port: number, shard: string) {
        this.type = type;
        this.forward = forward;
        this.port = port;
        this.shard = shard;
    }

}