import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { main } from './main'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const [sendInfo, errorMessage] = await main(req)
	const status = typeof errorMessage === 'undefined' ? 200 : 400
	const body =
		status === 200
			? {
					reward: sendInfo.reward,
					claim_url: sendInfo.claim_url,
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
