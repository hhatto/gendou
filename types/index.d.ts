type ReturnTypeOfAzureFunctions = {
	readonly status: number
	readonly body: string | Record<string, unknown>
	readonly headers?: {
		readonly [key: string]: string
	}
}

type ParamsOfSendApi = {
	readonly message: string
	readonly signature: string
	readonly address: string
	readonly tweetStatus: string
}
type ParamsOfRewardApi = {
	readonly message: string
}
