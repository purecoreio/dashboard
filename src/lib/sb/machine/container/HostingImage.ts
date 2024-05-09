import Srvbench from "$lib/sb/Srvbench"

export default class HostingImage {

    public readonly id: string
    public readonly uri: string
    public readonly support: string | null

    constructor(id: string, uri: string, support: string | null) {
        this.id = id
        this.uri = uri
        this.support = support
    }

    public static fromObject(obj: any) {
        return new HostingImage(
            obj.id,
            obj.uri,
            obj.support
        )
    }

    public async delete() {
        await Srvbench.getInstance().rest(`hosting/image/${this.id}`, undefined, 'DELETE')
    }

    public async getUsages() {

    }

}