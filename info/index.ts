import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generateErrorApiResponce } from '../common/utils'
import { getParams } from './params'
import { getRewardApiResponce } from '../common/responce'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)
	const result =
		typeof params === 'undefined'
			? generateErrorApiResponce('parameters error', 400)
			: await getRewardApiResponce(params.githubId)
	return {
		status: result.status,
		body: result.body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
