import { AzureFunction, Context, HttpRequest } from '@azure/functions'
//import { main } from './main'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	// const [sendInfo, errorMessage] = await main(req)
	const [sendInfo, errorMessage] = [undefined, '']
	const status = typeof errorMessage === 'undefined' ? 200 : 400
	// const reward = typeof sendInfo === 'undefined' ? 0 : sendInfo.reward
	// const claimUrl = typeof sendInfo === 'undefined' ? '' : sendInfo.claim_url
	const reward = ''
	const claimUrl = ''
	const body =
		status === 200
			? {
					reward: reward,
					claim_url: claimUrl,
			  }
			: {
					message: errorMessage,
			  }

	return {
		status: status,
		body: body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
