import Ip from "../Ip"
import Machine from "../Machine"
import HostingTemplate from "./HostingTemplate"

export default class Container {

    public readonly id: string
    public readonly machine: Machine
    public readonly ip: Ip
    public readonly envs: Record<string, string>
    public readonly ports: Record<number, number>
    public readonly path: string
    public readonly memory: number
    public readonly storage: number | null
    public readonly template: HostingTemplate

    constructor(id: string, machine: Machine, ip: Ip, envs: Record<string, string>, ports: Record<number, number>, path: string, memory: number, storage: number | null, template: HostingTemplate) {
        this.id = id
        this.machine = machine
        this.ip = ip
        this.envs = envs
        this.ports = ports
        this.path = path
        this.memory = memory
        this.storage = storage
        this.template = template
    }

    public static fromObject(obj: any) {
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
        )
    }

}