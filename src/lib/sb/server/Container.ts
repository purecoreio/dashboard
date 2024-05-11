import Ip from "../machine/Ip"
import Machine from "../machine/Machine"
import HostingTemplate from "../machine/container/HostingTemplate"
import type Instance from "./Instance"

export default class Container {

    public readonly id: string
    public readonly instance?: Instance
    public readonly machine: Machine
    public readonly ip: Ip
    public readonly envs: Record<string, string>
    public readonly ports: Record<number, number>
    public readonly path: string
    public readonly memory: number
    public readonly storage: number | null
    public readonly template: HostingTemplate

    constructor(id: string, machine: Machine, ip: Ip, envs: Record<string, string>, ports: Record<number, number>, path: string, memory: number, storage: number | null, template: HostingTemplate, instance?: Instance) {
        this.id = id
        this.instance = instance
        this.machine = machine
        this.ip = ip
        this.envs = envs
        this.ports = ports
        this.path = path
        this.memory = memory
        this.storage = storage
        this.template = template
    }

    public static fromObject(obj: any, instance?: Instance) {
        return new Container(
            obj.id,
            Machine.fromObject(obj.machine),
            Ip.fromObject(obj.ip),
            obj.envs,
            obj.ports,
            obj.path,
            obj.memory,
            obj.storage,
            HostingTemplate.fromObject(obj.template),
            instance
        )
    }

    public async unhost() {
        await this.instance?.server.community.rest(`servers/${this.instance?.server.id}/instance/${this.instance?.id}/container`, undefined, 'DELETE')
    }

}