import Srvbench from "../Srvbench"
import type Machine from "../machine/Machine"
import type HostingTemplate from "../machine/container/HostingTemplate"
import Container from "./Container"
import type Server from "./Server"

export default class Instance {

    public readonly id: string
    public readonly name: string | null
    public readonly server: Server
    private _container: Container | null

    constructor(id: string, name: string | null, server: Server, container: Container | null) {
        this.id = id
        this.name = name
        this.server = server
        this._container = container
    }

    public get container() {
        return this._container
    }

    setContainer(container: Container | null) {
        this._container = container
    }

    public static fromObject(obj: any, server: Server) {
        const instance = new Instance(
            obj.id,
            obj.name,
            server,
            null
        )
        if (obj.container) instance.setContainer(Container.fromObject(obj.container, instance))
        return instance
    }

    public async host(machine: Machine, template: HostingTemplate, path: string) {
        const container = Container.fromObject(await this.server.community.rest(`servers/${this.server.id}/instance/${this.id}/container`, {
            hostingTemplate: template.id,
            machineToken: await machine.getToken(),
            path
        }), this)
        this._container = container
        return container
    }

    public socket() {
        return Srvbench.getInstance().openSocket('admin/instance', {
            community: this.server.community.id,
            server: this.server.id,
            instance: this.id
        })
    }


}