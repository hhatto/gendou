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

type ParamsOfFindClaimUrlApi = {
	readonly code: string
}

type ParamsOfInfoApi = {
	readonly githubId: string
}

type TargetDate = {
	readonly from: Date
	readonly to: Date
}

type TargetDateStr = {
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
