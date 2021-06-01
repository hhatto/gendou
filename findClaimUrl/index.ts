import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { generateErrorApiResponce } from './../common/utils'

const httpTrigger: AzureFunction = async (
	context: Context,
	req: HttpRequest
): Promise<ReturnTypeOfAzureFunctions> => {
	// const params = getParams(req)
	// const result =
	// 	typeof params === 'undefined'
	// 		? generateErrorApiResponce('parameters error', 400)
	// 		: await main(params.code)

	// return {
	// 	status: result.status,
	// 	body: result.body,
	// 	headers: {
	// 		'Cache-Control': 'no-store',
	// 	},
	// }
	const result = generateErrorApiResponce('claim is stopped', 400)

	return {
		status: result.status,
		body: result.body,
		headers: {
			'Cache-Control': 'no-store',
		},
	}
}

export default httpTrigger
