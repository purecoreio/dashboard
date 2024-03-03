export default class MediaRequirement {

    public readonly id: string
    public readonly regex: string | null
    public readonly description: string

    constructor(id: string, regex: string | null, description: string) {
        this.id = id
        this.regex = regex
        this.description = description
    }

    public static fromObject(obj: any) {
        return new MediaRequirement(
            obj.id,
            obj.regex,
            obj.description
        )
    }

}