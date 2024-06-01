import Srvbench from "../Srvbench"
import type User from "../User"
import Repository from "./Repository"

export type DevelopmentPlatform = "github"
export default class DeveloperProfile {

    public readonly id: string
    public readonly platform: DevelopmentPlatform
    public readonly eid: string
    public readonly installation: string
    public readonly username: string
    public readonly owner: User

    constructor(id: string, platform: DevelopmentPlatform, eid: string, installation: string, username: string, user: User) {
        this.id = id
        this.platform = platform
        this.eid = eid
        this.installation = installation
        this.username = username
        this.owner = user
    }

    public static fromObj(obj: any, user: User) {
        return new DeveloperProfile(
            obj.id,
            obj.platform,
            obj.eid,
            obj.installation,
            obj.username,
            user
        )
    }

    public async getRepositories(): Promise<Repository[]> {
        return (await Srvbench.getInstance().rest(`developer/${this.id}/repos`)).map((r: any) => Repository.fromObj(r, this))
    }

}