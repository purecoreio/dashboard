import Key from "./Key"
import Srvbench from "./SrvBench"

export default class Community {

    public readonly id: string
    public readonly name: string
    public readonly slug: string

    private keys: Key[] | null

    constructor(id: string, name: string, slug: string) {
        this.id = id
        this.name = name
        this.slug = slug
        this.keys = null
    }

    public static fromObject(object: any) {
        return new Community(
            object.id,
            object.name,
            object.slug
        )
    }

    public async spectate() {
        return Srvbench.getInstance().openSocket('community/spectate', {
            community: this.id
        })
    }

    public async getKeys() {
        if (this.keys == null) {
            this.keys = (await Srvbench.getInstance().rest(`community/${this.id}/keys`)).map((o: any) => Key.fromObject(o))
        }
        return this.keys!
    }

}