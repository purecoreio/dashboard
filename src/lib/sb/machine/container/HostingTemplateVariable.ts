export default class HostingTemplateVariable {

    public readonly id: string
    public readonly key: string
    public readonly value: string | null

    constructor(id: string, key: string, value: string | null) {
        this.id = id
        this.key = key
        this.value = value
    }

    public static fromObject(obj:any){
        return new HostingTemplateVariable(
            obj.id,
            obj.key,
            obj.value
        )
    }


}