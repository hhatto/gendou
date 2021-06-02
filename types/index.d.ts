type ReturnTypeOfAzureFunctions = {
	readonly status: number
	readonly body: Record<string, unknown>
	readonly headers?: {
		readonly [key: string]: string
	}
}

type ApiResponce = {
	readonly status: number
	readonly body: Record<string, unknown>
}

type ParamsOfInfoByCodeApi = {
	readonly code: string
}

type ParamsOfInfoApi = {
	readonly githubId: string
}

type TargetDate = {
	readonly from: Date
	readonly to: Date
}

type GithubIdAndCommitCount = {
	readonly githubId: string
	readonly commitCount: number
}

type ClaimUrlInfo = {
	readonly reward: string
	readonly isRankDown: boolean
	readonly claimUrl: claim_url
}

type CrearedAtAndContributions = {
	readonly crearedAt: Date
	readonly contributions: readonly Contribution[]
}

type Contribution = {
	readonly from: Date
	readonly to: Date
	readonly contribution: number
}
