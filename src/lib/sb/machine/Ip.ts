export default class Ip {

    public readonly id: string
    public readonly ip: string
    public readonly adapter: string
    public readonly available: boolean
    public readonly created: Date
    public readonly updated: Date

    constructor(id: string, ip: string, adapter: string, available: boolean, created: Date, updated: Date) {
        this.id = id
        this.ip = ip
        this.adapter = adapter
        this.available = available
        this.created = created
        this.updated = updated
    }

    public static fromObject(obj:any){
        return new Ip(
            obj.id,
            obj.ip,
            obj.adapter,
            obj.available,
            new Date(obj.created),
            new Date(obj.updated)
        )
    }

    public async getContainers() {

    }

}