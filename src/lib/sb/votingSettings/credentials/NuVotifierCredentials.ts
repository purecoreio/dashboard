export default class NuVotifierCredentials {

    public readonly token: string | null

    constructor(token: string | null) {
        this.token = token
    }

    public static fromObject(obj: any) {
        return new NuVotifierCredentials(
            obj.token,
        )
    }

}