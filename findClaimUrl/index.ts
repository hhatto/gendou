import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { getParams } from './params'
import { generateErrorApiResponce } from './../common/utils'
import { main } from './main'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	const params = getParams(req)
	const result =
		typeof params === 'undefined'
			? generateErrorApiResponce('parameters error', 400)
			: await main(params)

	return {
		status: result.status,
		body: result.body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
