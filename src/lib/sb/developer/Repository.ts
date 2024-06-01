import Srvbench from "../Srvbench"
import type DeveloperProfile from "./DeveloperProfile"

export default class Repository {

    public readonly id: string | null
    public readonly eid: string
    public readonly uri: string
    public readonly owner: DeveloperProfile

    constructor(id: string | null, eid: string, uri: string, owner: DeveloperProfile) {
        this.id = id
        this.eid = eid
        this.uri = uri
        this.owner = owner
    }

    public static fromObj(obj: any, owner: DeveloperProfile) {
        return new Repository(
            obj.id,
            obj.eid,
            obj.uri,
            owner
        )
    }

    public async getBranches(): Promise<string[]> {
        return await Srvbench.getInstance().rest(`developer/${this.id}/repo/branches`, {
            eid: this.eid
        })
    }


}