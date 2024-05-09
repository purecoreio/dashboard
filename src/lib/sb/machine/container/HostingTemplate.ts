import Srvbench from "$lib/sb/Srvbench"
import HostingImage from "./HostingImage"
import HostingTemplateVariable from "./HostingTemplateVariable"

export default class HostingTemplate {

    public readonly id: string
    public readonly name: string | null
    public readonly image: HostingImage
    public readonly variables: HostingTemplateVariable[]

    constructor(id: string, image: HostingImage, variables: HostingTemplateVariable[], name: string | null) {
        this.id = id
        this.image = image
        this.variables = variables
        this.name = name
    }

    public static fromObject(obj: any) {
        return new HostingTemplate(
            obj.id,
            HostingImage.fromObject(obj.image),
            obj.variables.map((v: any) => HostingTemplateVariable.fromObject(v)),
            obj.name
        )
    }

    public async delete() {
        await Srvbench.getInstance().rest(`hosting/template/${this.id}`, undefined, 'DELETE')
    }

    public async getUsages() {

    }

}