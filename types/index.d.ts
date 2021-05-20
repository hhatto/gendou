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
	readonly message: string
}

type TargetDate = {
	readonly from: Date
	readonly to: Date
}

type TargetDateStr = {
	readonly from: string
	readonly to: string
}

type GithubIdAndCommitCount = {
	readonly githubId: string
	readonly commitCount: number
}
