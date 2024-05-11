import type Community from "../Community"
import Instance from "./Instance"

export default class Server {

    public readonly id: string
    public readonly name: string
    public readonly community: Community
    private _instances: Instance[]

    constructor(id: string, name: string, instances: Instance[], community: Community) {
        this.id = id
        this.name = name
        this._instances = instances
        this.community = community
    }

    public get instances() {
        return this._instances
    }

    private setInstances(instances: Instance[]) {
        this._instances = instances
    }

    public static fromObject(obj: any, community: Community) {
        const server = new Server(
            obj.id,
            obj.name,
            [],
            community
        )
        server.setInstances(obj.instances.map((i: any) => Instance.fromObject(i, server)))
        return server
    }

    public async createInstance(name: string | null) {
        const instance =  Instance.fromObject(await this.community.rest(`servers/${this.id}/instance`, {
            name
        }), this)
        this._instances.unshift(instance)
        return instance
    }

}