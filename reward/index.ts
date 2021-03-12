import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getReward } from '../common/reward'
import { getParams } from './params'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)
	const reward =
		params instanceof Error
			? (params as Error)
			: await getReward(params.message)
	const status = reward instanceof Error ? 400 : 200
	const message = status === 200 ? 'success' : (reward as Error).message

	return {
		status: status,
		body: { message: message },
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
