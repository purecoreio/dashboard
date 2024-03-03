import MediaRequirement from "./MediaRequirement"
import Submission from "./Submission"

export default class SubmissionResult {
    public readonly submission: Submission | null
    public readonly missing: MediaRequirement[]

    constructor(submission: Submission | null, missing: MediaRequirement[]) {
        this.submission = submission
        this.missing = missing
    }

    public static fromObject(obj: any) {
        return new SubmissionResult(
            Submission.fromObject(obj.submission),
            obj.missing.map((m: any) => MediaRequirement.fromObject(m))
        )
    }

}