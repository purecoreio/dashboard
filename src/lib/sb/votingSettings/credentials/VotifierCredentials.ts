export default class VotifierCredentials {

    public readonly rsa2048Pk: string | null
    public readonly rsa2048Sk: string | null
    public readonly rsa1024Pk: string | null
    public readonly rsa1024Sk: string | null

    constructor(rsa2048Pk: string | null, rsa2048Sk: string | null, rsa1024Pk: string | null, rsa1024Sk: string | null) {
        this.rsa2048Pk = rsa2048Pk
        this.rsa2048Sk = rsa2048Sk
        this.rsa1024Pk = rsa1024Pk
        this.rsa1024Sk = rsa1024Sk
    }

    public static fromObject(obj: any) {
        return new VotifierCredentials(
            obj.rsa2048Pk,
            obj.rsa2048Sk,
            obj.rsa1024Pk,
            obj.rsa1024Sk
        )
    }

}