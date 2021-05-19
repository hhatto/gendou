type ReturnTypeOfAzureFunctions = {
	readonly status: number
	readonly body: string | Record<string, unknown>
	readonly headers?: {
		readonly [key: string]: string
	}
}

type ApiResponce = {
	readonly status: number
	readonly body: string | Record<string, unknown>
}

type ParamsOfFindClaimUrlApi = {
	readonly message: string
	readonly signature: string
	readonly address: string
}

type ParamsOfInfoApi = {
	readonly message: string
}

type TargetDate = {
	readonly from: Date
	readonly to: Date
}
