import Srvbench from "../Srvbench"
import Ip from "./Ip"

export default class Machine {

    public readonly id: string
    public readonly created: Date
    public readonly hostname: string | null
    public readonly ips: Ip[]

    constructor(id: string, created: Date, hostname: string | null, ips: Ip[]) {
        this.id = id
        this.created = created
        this.hostname = hostname
        this.ips = ips
    }

    public static fromObject(obj: any) {
        return new Machine(
            obj.id,
            new Date(obj.created),
            obj.hostname,
            obj.ips.map((i: any) => Ip.fromObject(i))
        )
    }

    public async delete() {
        await Srvbench.getInstance().rest(`machine/${this.id}`, undefined, 'DELETE')
    }

    public async getContainers() {

    }

    public async getToken() {
        return (await Srvbench.getInstance().rest(`machine/${this.id}/token`)).token! as string
    }

}