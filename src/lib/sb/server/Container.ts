import Srvbench from "../Srvbench"
import Ip from "../machine/Ip"
import Machine from "../machine/Machine"
import HostingTemplate from "../machine/container/HostingTemplate"
import type Instance from "./Instance"

export default class Container {

    public readonly id: string
    public readonly instance?: Instance
    public readonly machine: Machine
    public readonly ip: Ip | null
    public readonly envs: Record<string, string>
    public readonly ports: Record<number, number>
    public readonly path: string
    public readonly memory: number
    public readonly storage: number | null
    public readonly template: HostingTemplate

    constructor(id: string, machine: Machine, ip: Ip | null, envs: Record<string, string>, ports: Record<number, number>, path: string, memory: number, storage: number | null, template: HostingTemplate, instance?: Instance) {
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
            obj.ip ? Ip.fromObject(obj.ip) : null,
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
        this.instance?.setContainer(null)
        return this.instance
    }

    public async resetPassword(): Promise<string> {
        const { password } = await this.instance?.server.community.rest(`servers/${this.instance?.server.id}/instance/${this.instance?.id}/container/password`, undefined, 'POST')
        return password
    }

    public async getPublicKey(): Promise<string> {
        const { key } = await this.instance?.server.community.rest(`servers/${this.instance?.server.id}/instance/${this.instance?.id}/container/publicKey`, undefined, 'GET')
        return key
    }

    public async stop() {
        await this.instance?.server.community.rest(`servers/${this.instance?.server.id}/instance/${this.instance?.id}/container/stop`, undefined, 'POST')
    }

    public async start() {
        await this.instance?.server.community.rest(`servers/${this.instance?.server.id}/instance/${this.instance?.id}/container/start`, undefined, 'POST')
    }

    public async transfer(out: boolean, address: string, user: string, path: string, mirror: boolean = false, port: number = 22, password: string | null = null) {
        await this.instance?.server.community.rest(`servers/${this.instance?.server.id}/instance/${this.instance?.id}/container/transfer`, {
            out,
            address,
            user,
            path,
            password,
            mirror,
            port
        }, 'POST')
    }
}